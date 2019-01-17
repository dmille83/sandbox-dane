<?php // MAIN SCRIPT, RUN ON POST CALLBACK // GLOBALS AND ERROR STRING

	error_reporting(0);

	/* 	
	*	Title: Scantron Converter
	*	Version: 3.8
	*	
	*	CHANGELOG:
	*		Added support for specifying individual question point values.
	*		Fixed an error where session variables would be prematurely destroyed.
	*		Fixed a bug where '$tempPoint' was spelled '$temppoint' in a few lines.
	*	
	*	TO-DO-LIST:
	*		Add the ability to switch a *student's* test version number on the preview page, in case they didn't fill it out?
	*/

	session_start();

	// GLOBAL VARIABLES
	$error = '';		//error holder
	$nonTerminalError = '';		//error holder
	$converterOutput = '';
	$matchingQuestionsIdArray = Array(); // (global) // list of matching question IDs that are completed.

	if(isset($_POST['createzip_step3'])) // WRITE CSV FILE
	{
		
		//if (true) echo printMyData($_POST); else // !!! debugger.
		if (isset($_SESSION['answerkeysDataArray']) && isset($_SESSION['studentAnswersDataArray']) && isset($_SESSION['fileToZipName']))
		{
			$answerkeysDataArray = $_SESSION["answerkeysDataArray"];
			$studentAnswersDataArray = $_SESSION["studentAnswersDataArray"];
			$fileToZipName = $_SESSION['fileToZipName'];
			
			
			//echo printMyData($_POST); // !!! debugger.
			
			
			// Create the 'tempfiles' file directory if it does not exist already.
			$tempFilePath = sys_get_temp_dir() .'/'; 	// "../tempfiles/"; // needs to be a folder with permissions 0711. // sys_get_temp_dir(); 	//"tempfiles/";
			if (!is_dir($tempFilePath))
			{
				echo 'Error: Please create the temporary file directory specified in line 35 so that this application may run.';
				die();
			}
				
			// CREATE A TEMPORARY DIRECTORY TO PREVENT FILENAME CONFLICTS (better scalability)
			$tempBatchID = mt_rand(000000,999999);
			$tempBatchTimeStamp = time();
			$tempBatchFilePath = "BATCH".$tempBatchID.$tempBatchTimeStamp."/";
			while(is_dir($tempFilePath.$tempBatchFilePath)) // remake until unique.
			{
				$tempBatchID = mt_rand(000000,999999);
				$tempBatchTimeStamp = time();
				$tempBatchFilePath = "BATCH".$tempBatchID.$tempBatchTimeStamp."/";
			}
			mkdir($tempFilePath.$tempBatchFilePath, 0711);
			
			try // This makes sure we still delete the temp files even if there is an error.
			{
				if(extension_loaded('zip'))	// Checking ZIP extension is available
				{
					// PERFORM THE CONVERSION, THEN OUTPUT CONVERTED DATA TO A NEW .csv FILE
					$myNewFileName = $fileToZipName ."_". $tempBatchTimeStamp .".csv";
					$newCSVfile = fopen($tempFilePath.$tempBatchFilePath.$myNewFileName, "w") or die("Unable to open file!");
					writeNewCsv($answerkeysDataArray, $studentAnswersDataArray, $fileToZipName, $newCSVfile);
					fclose($newCSVfile);
						
					if(file_exists($tempFilePath.$tempBatchFilePath.$myNewFileName)){
						// push to download the zip
						header('Content-type: application/zip');
						header('Content-Disposition: attachment; filename="'.$myNewFileName.'"');
						readfile($tempFilePath.$tempBatchFilePath.$myNewFileName);
					}
				}
			}
			catch(Exception $e) // This makes sure we still delete the temp files even if there is an error.
			{
				$error .= '<br><br><strong>* ERROR: Please report the following error to ITAC: '. $e .' </strong><br>';
			}
			deleteFolder($tempFilePath.$tempBatchFilePath); // remove all files (if exists) created in the temp path
			
			
			// Clear out any old session variables before we start.
			gc_collect_cycles();
			session_unset();
			
			
			die(); // do not read the page itself.
		}
		else
			$error .= "* Session variables were not found. Please restart the process from step 1, select your file, and try again. Please also make sure that you have only one instance of this page open in your browser at a time.<br>";
	}
	else if(isset($_POST['createzip_step2']) && isset($_POST['answerkeys'])) // RE-GRADE SUBMISSIONS FROM EXISTING DATA AND UPDATE PREVIEW PAGE
	{
		//echo printMyData($_POST); // !!! debugger.
	
		$answerkeysDataArray = $_SESSION["answerkeysDataArray"];
		
		// Copy user's form data (+fixes) to answerkeys.
		$answerkeys = $_POST['answerkeys'];
		foreach($answerkeys as $key => $value)
		{
			// Single answer questions will return as an array of values, not an array of arrays of values, so let's fix that before replacing our answer keys.
			$newArray = Array();
			//$qindex = 1;
			foreach($value as $k => $v)
			{
				if (!is_array($v))
				{
					$temp = Array();
					$temp[$v] = $v;
					$newArray[$k] = $temp;
				}
				else
					$newArray[$k] = $v;
			}
			
			// Make sure any empty responses are still included in the answer key.
			if (count($newArray) < count($answerkeysDataArray[$key]->getAnswers()))
			{
				$qindex = 1;
				for ($qindex = 1; $qindex <= count($answerkeysDataArray[$key]->getAnswers()); $qindex++)
					if (!array_key_exists($qindex, $newArray))
						$newArray[$qindex][0] = Array();
				ksort($newArray);
			}
			
			
			$answerkeysDataArray[$key]->replaceAnswerSheet($newArray);
		}
		
		// Print out classes as Step Two page.
		if ($error == "") $converterOutput = printStepTwoPage($answerkeysDataArray, $_SESSION["studentAnswersDataArray"], $_SESSION["fileToZipName"], $_SESSION["nonTerminalError"]);
		//else echo $error;
	}
	else if(isset($_POST['createzip_step1']) && isset($_POST['versioncount']) && isset($_POST['sheetcount']) && isset($_POST['fileToZipName']) && (isset($_POST['totalPointsPossible']) || isset($_POST['specifyIndividualQuestionWeights'])) && isset($_POST['numberofquestions'])) // READ IN DATA FROM SCANTRON FILE AND CONVERT INTO ARRAYS OF PHP OBJECTS
	{
		//$error .= '<div style="text-align: left;">'. printMyData($_POST) .'</div>'; // !!! debugger.
		
		
		// Clear out any old session variables before we start.
		gc_collect_cycles();
		gc_disable();
		session_unset();
		
		
		if(extension_loaded('zip'))	// Checking ZIP extension is available
		{
			$fileTypeIsValid = true;
			if(isset($_FILES['filestozip']) && count($_FILES['filestozip']))
			{
				//$error .= 'filesize: '. implode(', ', $_FILES['filestozip']['size']); // !!! debugger.
				
				$totalFileSize = 0;
				foreach ($_FILES['filestozip']['size'] as $file) $totalFileSize += $file; // tally up size of all the files combined.
				
				// MAX FILE SIZE IS 1.5MB, OR 1500000 BYTES, A.K.A. 15001 AVG-LENGTH LINES IN THE CSV (COUNTING THE BLANK LINE AT THE BOTTOM).
				$maxFileSize = 1048576.0; // (left a buffer of 0.5MB)
				if ($totalFileSize > $maxFileSize)
				{
					$error .= '* File upload limit is 1MB, but your file(s) are '. $totalFileSize/1048576.0 .'MB in size, '. ($totalFileSize - $maxFileSize)/1048576.0 .'MB over the limit. <br>Please reduce the number of files you are attempting to convert, or break down any file(s) over 1MB into smaller parts.<br>';
					$fileTypeIsValid = false;
				}
				else if ($_FILES['filestozip']['size'] > 0)
				{
					$csv_mimetypes = array(
						'text/csv',
						'text/plain',
						'text/comma-separated-values',
						'text/anytext',
						'application/txt',
					);
					foreach ($_FILES['filestozip']['type'] as $file)
					{
						if (!in_array($file, $csv_mimetypes)) $fileTypeIsValid = false;
					}
					
					//==============================
					//This function separates the extension from the rest of the file name and returns it.
					// Source:  http://php.about.com/od/advancedphp/ss/rename_upload_2.htm
					function findexts($filename) 
					{
						global $error;
						global $fileTypeIsValid;
						
						$filename = strtolower($filename) ; 
						$exts = split("[/\\.]", $filename) ; 
						$n = count($exts)-1; 

						// Write any scripts that check for unwanted extensions here!
						if ($n > 1) // Check for evil double-barreled extensions like "yourfile.php.csv" or "yourfile.exe.csv" and eliminate extensions you don't allow.
						{
							$error .= "* Double-Barreled file extension(s) are not allowed.<br>";
							$fileTypeIsValid = false;
						}
						$exts = strtolower($exts[$n]); 
						return $exts; 
					}
					foreach ($_FILES['filestozip']['name'] as $file)
						if (findexts($file) != "txt") $fileTypeIsValid = false;
					//==============================
					
				}
			}
			else 
				$fileTypeIsValid = false;
			
			

			if ($_POST['numberofquestions'] < 1) $error .= '* Please enter the number of questions in this scantron assignment.<br>';
			if (isset($_POST['totalPointsPossible']) && $_POST['totalPointsPossible'] < 1 && !isset($_POST['specifyIndividualQuestionWeights'])) $error .= '* Please enter the maximum number of points available for this scantron assignment.<br>';
			

			
			if ($fileTypeIsValid && $error == '')
			{
				// GET QUESTION DATA FROM FILE
				$key = 0;
				$file = $_FILES['filestozip']['tmp_name']; // ONE file only for this app.
				
				// READ IN THE DATA FROM THE Axio .csv FILE
				$myAxioFileTemp = fopen($_FILES['filestozip']['tmp_name'][$key], "r") or die("Unable to open file!");  // READ IN DATA FROM TEMP FILE
				$answerkeysDataArray = Array();
				$answerKeyCount = $_POST['versioncount'] * $_POST['sheetcount'];
				$studentAnswersDataArray = Array();
				$multipleAnswersArray = Array();
				$numberofquestions = $_POST['numberofquestions'];
				$a = 1;
				$cardindex = 0;
				
				
				// SET VARIABLE VALUES
					$fileToZipName = preg_replace('/\.(\w+)$/', '', $_FILES['filestozip']['name'][$key]);
					if ($_POST['fileToZipName'] != '') $fileToZipName = preg_replace('/\.(\w+)$/', '', $_POST['fileToZipName']);
				
					if (isset($_POST['totalPointsPossible'])) $totalPointsPossible = $_POST['totalPointsPossible'];
					else $totalPointsPossible = $numberofquestions;
				
				
				// Create point value array for individual questions.
					$tempPointArray = Array();
					$pointIndex = 0;
					while ($pointIndex++ < $numberofquestions) 
					{
						$tempPointArray[$pointIndex] = $totalPointsPossible/$numberofquestions;
					}
				
				
				// (BEGIN) WRITE IN BLANK ANSWERKEYS
				// Check if answerkeys were scanned in with the stack. If not, make some blank ones.
				$noAnswerkeysInStack = false;
				if (isset($_POST['noAnswerkeysInStack']) && $_POST['noAnswerkeysInStack'])
				{
					$noAnswerkeysInStack = true;
					
					$qNum = 1;
					$lineEnd = "";
					while ($qNum++ <= $numberofquestions)
						$lineEnd .= " ";
					$lineEnd .= "'";
					
					$line04 = "         ,      ,4, '" . $lineEnd;
					$line03 = "         ,      ,3, '" . $lineEnd;
					$line02 = "         ,      ,2, '" . $lineEnd;
					$line01 = "         ,      ,1, '" . $lineEnd;
				
					$vCount = 1;
					while ($vCount <= $_POST['versioncount'])
					{
						$cardindex++;
						$line05 = "---------, ". $vCount ."1---,5, '" . $lineEnd;
						
						$myNewStudent = new SCANTRON($line05, $numberofquestions, $cardindex);
						$myNewStudent->addLineToMultiple($line04);
						$myNewStudent->addLineToMultiple($line03);
						$myNewStudent->addLineToMultiple($line02);
						$myNewStudent->addLineToMultiple($line01);
						
						// Add point values for individual questions.
						$myNewStudent->setPointValueArray($tempPointArray);
						
						$answerkeysDataArray[$myNewStudent->getVersion()] = $myNewStudent;
							
						$vCount++;
					}
				}
				// (FINISH) WRITE IN BLANK ANSWERKEYS
				
				
				// Handler for missing WIDs.
				$maxSheetNumPerVersionFound = 1;
				$missingWidIndex = 0;
				
				while($line = fgets($myAxioFileTemp))
				{
					$cardindex++;
					$args = explode(',', $line);
					try
					{
						$myNewStudent = new SCANTRON($line, $numberofquestions, $cardindex);
						if ($myNewStudent->getIsMultiple()) // Read in the next 4 lines.
							for ($j = 4; $j > 0; $j--)
								$myNewStudent->addLineToMultiple(fgets($myAxioFileTemp));
						
						// If $noAnswerkeysInStack was NOT set to true...
						if (!$noAnswerkeysInStack && $a++ <= $answerKeyCount) // First 1-3 sheets go into the answer-key array.
						{
							// Add point values for individual questions.
							$myNewStudent->setPointValueArray($tempPointArray);
						
							if (array_key_exists($myNewStudent->getVersion(), $answerkeysDataArray))
								$answerkeysDataArray[$myNewStudent->getVersion()]->mergeAnswerSheet($myNewStudent);
							else $answerkeysDataArray[$myNewStudent->getVersion()] = $myNewStudent;
							//ksort($answerkeysDataArray);
							
							// Checker for if missing WIDs can be handled.
							$tempOps = $myNewStudent->getOptions();
							if ($tempOps[1] > $maxSheetNumPerVersionFound) $maxSheetNumPerVersionFound = $tempOps;
							
						}
						else
						{
							// Handler for missing WIDs.
							if ($myNewStudent->getWid() == '---------' && $maxSheetNumPerVersionFound > 1)
								$nonTerminalError .= '* Scantron card #'. $cardindex .' is missing a WID and will not be graded.';
							else if ($myNewStudent->getWid() == '---------')
								$studentAnswersDataArray[$cardindex++] = $myNewStudent; 		//$studentAnswersDataArray[$missingWidIndex++] = $myNewStudent;
							
							
							else
							{
								if (array_key_exists($myNewStudent->getWid(), $studentAnswersDataArray))
								{
									if ($myNewStudent->getVersion() != $studentAnswersDataArray[$myNewStudent->getWid()]->getVersion())
										throw new Exception('* More than one test version was submitted by student with WID '. $myNewStudent->getWid() .': versions '. $myNewStudent->getVersion() .' and '. $studentAnswersDataArray[$myNewStudent->getWid()]->getVersion() .'. They may have accidentally filled out the version numbers in place of their sheet numbers. Please confirm that their scantron sheets were filled out correctly before continuing.<br>');
									else if (!array_key_exists($myNewStudent->getVersion(), $answerkeysDataArray))
										throw new Exception('* Answerkey not found for student with WID '. $myNewStudent->getWid() .'. They turned in test version '. $myNewStudent->getVersion() .'.<br>');
									else
										$studentAnswersDataArray[$myNewStudent->getWid()]->mergeAnswerSheet($myNewStudent);
								}
								else $studentAnswersDataArray[$myNewStudent->getWid()] = $myNewStudent;
								//ksort($studentAnswersDataArray);
							}
						}
					}
					catch (Exception $e)
					{
						$error .= $e->getMessage();
					}
				}
				fclose($myAxioFileTemp);
				
				// Sort arrays of data.
				ksort($answerkeysDataArray); // Sort array of answerkeys by test version number.
				//ksort($studentAnswersDataArray); // Sort array of students by WID.
				
				if (count($multipleAnswersArray) > 0) $error .= '* Error: We have detected one or more scanning errors (extra lines present). Please rescan your cards.<br>';
				
									
				// Print out classes as Step Two page.
				if ($error == "") $converterOutput = printStepTwoPage($answerkeysDataArray, $studentAnswersDataArray, $fileToZipName, $nonTerminalError);
				//else echo $error;
				
					
			} else if (!$fileTypeIsValid)
				$error .= "* Please select a valid .txt file to convert. <br>";
		}else
			$error .= "* You dont have ZIP extension.<br>";
	}
?>


<?php // PRINT OUT FORM FOR STEP TWO
function printStepTwoPage($answerkeysDataArray, $studentAnswersDataArray, $fileToZipName, $nonTerminalError)
{
	global $error;
	
	//session_start();
	$_SESSION["answerkeysDataArray"] = $answerkeysDataArray;
	
	
	// Update point values
	$totalPointsPossible = -1;
	foreach ($answerkeysDataArray as $key => $value) 
	{
		if (isset($_POST['pointvalue'][$value->getVersion()])) 
			$value->setPointValueArray($_POST['pointvalue'][$value->getVersion()]);
		
		if ($totalPointsPossible == -1) $totalPointsPossible = $value->getPointsPossible();		
	}		
	
	
	$_SESSION["studentAnswersDataArray"] = $studentAnswersDataArray;
	$_SESSION['fileToZipName'] = $fileToZipName;
	$_SESSION['nonTerminalError'] = $nonTerminalError;
	
	if (isset($_POST['noAnswerkeysInStack']) && $_POST['noAnswerkeysInStack']) $noAnswerkeysInStack = true;
	else $noAnswerkeysInStack = false;

	// Print out classes.
	$converterOutput = '';
	$studentAnswersRow = 0;
	$converterOutput .= '<div id="step2formID" class="formWrapper formWrapper_step2">';
	
	
	//$converterOutput .= '<div class="floatingNavMenu"><button style="width:100%; height:100%;" onclick="window.scrollTo(0,0);">Scroll Back to Top</button></div>';
	
	
	$converterOutput .= '<form enctype="multipart/form-data" name="zips" method="post">';
	$converterOutput .= '<p>Please review the data and/or settings below to verify that they are correct, then click <i>Perform Conversion</i>.</p>';
	
	
	$converterOutput .= '<p>';
	$converterOutput .= '<button onclick="window.location.href='.';">Go Back and Upload a Different File</button>';
	$converterOutput .= '<input type="submit" name="createzip_step2" value="Update Preview of Student Scores"/>';
	$converterOutput .= '<input type="submit" name="createzip_step3" value="Perform Conversion" onclick="resetErrorBox();" />';
	$converterOutput .= '</p>';
	
	
	$converterOutput .= '<h1 class="fileNameClass">'. $fileToZipName .'</h1>';
	if (isset($_POST['specifyIndividualQuestionWeights'])) $converterOutput .= '<div id="totalPointsTitleID"><strong>Specify individual question weights below</strong></div>';
	else $converterOutput .= '<div id="totalPointsTitleID"><strong>Worth '. $totalPointsPossible .' points total</strong></div>';
	
	
	if ($noAnswerkeysInStack) $converterOutput .=  '<p>Please fill out the answerkeys below to grade your students submissions before converting.</p>';
	else $converterOutput .=  '<p>If errors are present that cannot be fixed using this interface, please rescan your cards through the machine again before re-attempting to convert them into the Canvas format.</p>';
	
	if ($nonTerminalError != '') $converterOutput .=  '<p style="color:red;">'. $nonTerminalError .'</p>';
	
	$converterOutput .= '<table class="phpOutputTable">';
	$converterOutput .= '<tr class="answerKeyField">';
	
	foreach($answerkeysDataArray as $key => $value)
	{
		if ($studentAnswersRow++ > 3) // Print them in rows of 3.
		{
			$converterOutput .= '</tr>';
			$converterOutput .= '<tr class="studentField">';
			$studentAnswersRow = 1;
		}
			
		try
		{
			$converterOutput .= $value->printSheet();
		}
		catch (Exception $e)
		{
			$error .= $e->getMessage();
		}
	}
	$converterOutput .= '</tr>';
	$converterOutput .= '</table>';
	
	
	$converterOutput .= '<input type="submit" name="createzip_step2" value="Update Preview of Student Scores"/>';
	
	
	$converterOutput .= '<table class="phpOutputTable">';
	$converterOutput .= '<tr class="studentField">';
	foreach($studentAnswersDataArray as $key => $value)
	{
		if ($studentAnswersRow < 3) // Print them in rows of 3.
		{
			$converterOutput .= '</tr>';
			$converterOutput .= '<tr class="studentField">';
			$studentAnswersRow = 1;
		}
		else
			$studentAnswersRow++;
			
		try
		{
			$converterOutput .= $value->printSheet($answerkeysDataArray, $totalPointsPossible);
		}
		catch (Exception $e)
		{
			$error .= $e->getMessage();
		}							
	}
	$converterOutput .= '</tr>';
	$converterOutput .= '</table>';
		
	$converterOutput .= '</form>';
	
	// Add the floating tools
	$converterOutput .= '<div class="floatingNavMenu">';
	$converterOutput .= '<button style="width:100%; height:85px;" onclick="window.scrollTo(0,0);">Scroll Back to Top</button>';
	$converterOutput .= '<form id="f1" name="f1" action="javascript:void()" onsubmit="if(this.t1.value!=null &amp;&amp; this.t1.value!=\'\') parent.findString(this.t1.value); return false;"><input type="text" style="width:70px; height:20px; text-align:center; border-radius:8px;" id="t1" name="t1" placeholder="WID" size="20"><input type="submit" style="width:100%; height:30px;" name="b1" value="Find"></form>';
	$converterOutput .= '</div>';
	
	$converterOutput .= '</div>';
	//$converterOutput .= '<div style="text-align:center; font-size: 0.8em;">&copy; Dane Miller & Alexandre Adams, ITAC Help Desk Developers. K-State University 2014</div>';

	return $converterOutput;
}
?>


<?php // STEP 3, WRITE NEW CSV
function writeNewCsv($answerkeysDataArray, $studentAnswersDataArray, $fileToZipName, $newCSVfile)
{
	error_reporting(0);
	
	// Update point values
	$totalPointsPossible = -1;
	foreach ($answerkeysDataArray as $key => $value) 
	{
		if (isset($_POST['pointvalue'][$value->getVersion()])) 
			$value->setPointValueArray($_POST['pointvalue'][$value->getVersion()]);
		
		if ($totalPointsPossible == -1) $totalPointsPossible = $value->getPointsPossible();		
	}

	//Row1:
	//	Col1: Student (blank ok)
	//	Col2: ID (blank ok)
	//	Col3: "SIS User ID" (WID, NEEDED)
	//	Col4: "SIS Login ID" (blank ok)
	//	Col5: <assignment name> (score goes 2 rows underneath)
	//Row2:
	//	Col1: "    Points Possible" (4 extra spaces at start of title) (max scores go beneath each assignment)
	
	global $error;
	
	$fields = array('Student', 'ID', 'SIS User ID', 'SIS Login ID', 'Section', $fileToZipName);
	fputcsv($newCSVfile, $fields);
	
	$fields = array('    Points Possible', '', '', '', '', $totalPointsPossible);
	fputcsv($newCSVfile, $fields);
	
	foreach($studentAnswersDataArray as $key => $student)
	{
		if (isset($_POST['versionPartial']))	//if ($_POST['isMultiple'] == 1)
		{
			$partialArray = null;
			if (array_key_exists($student->getVersion(), $_POST['versionPartial']))
			{
				$partialArray = $_POST['versionPartial'][$student->getVersion()];
			}
			
			$myScore = ($student->getScore($answerkeysDataArray, $partialArray)/$student->getNumberOfQuestions())*$totalPointsPossible;
			$myName = 'Scantron Card(s): ' . implode(', ', $student->getStackNumber());
			$fields = array($myName, '', $student->getWid(), '', '', $myScore);
			fputcsv($newCSVfile, $fields);
		}
		else
		{
			$myScore = $student->getScore($answerkeysDataArray);
			$myName = 'Scantron Card(s): ' . implode(', ', $student->getStackNumber());
			$fields = array($myName, '', $student->getWid(), '', '', $myScore);
			fputcsv($newCSVfile, $fields);
		}
	}
}
?>


<?php // SCANTRON CLASS
// Each will hold an array that holds an array of answer indices.
// Number of answers is based on user  input.
// If sheet# > 1, ((version-1)*50)+1 = starting index.
//
// For errors, provide the line# in the Catch statement.
//
// For multiple sheets, create new, then merge new with existing.
class Scantron
{	
	private $_wid;
	private $_options;
	private $_answers = Array();
	
	private $_numberofquestions;
	private $_ismultiple = false;
	private $_stacknumber = Array();
	
	private $_pointvaluearray = Array();
	
	public function getWid() { return $this->_wid; }
	public function getOptions() { return $this->_options; }
	public function getAnswers() { return $this->_answers; }
	
	public function getNumberOfQuestions() { return $this->_numberofquestions; }
	public function getIsMultiple() { return $this->_ismultiple; }
	public function getStackNumber() { return $this->_stacknumber; }
	
	public function getPointValueArray() { return $this->_pointvaluearray; }
	
	function __construct ($line, $numberofquestions, $stacknumber)
	{
		$args = explode(',', $line);
		if ($args < 2) throw new Exception('* Unrecognized assignment format, please rescan your cards before continuing.<br>');
		$this->_wid = rtrim(str_replace(" ", "", $args[0]));
		$this->_options = str_split(rtrim(str_replace(" ", "", $args[1])));
		
		if ($stacknumber) array_push($this->_stacknumber, $stacknumber);
		
		$myOptions = $this->_options;
		if (count($myOptions) < 2) throw new Exception('* Test options not found for student with WID '. $this->_wid .', please rescan your cards before continuing.<br>');
		
		
		$sheetnumber = 1; // Assume it is sheetnumber 1 if not filled in.
			if ($myOptions[1] != '-')
				$sheetnumber = $myOptions[1];
		$startingIndex = (($sheetnumber-1)*50)+1; // If sheet#2, start at question 51.
		
		
		$this->_numberofquestions = $numberofquestions;
		
		// Create an array of arrays to hold the answers.
		$tempArray = Array();
		for ($i = 1; $i <= $numberofquestions; $i++)
			$tempArray[$i] = Array();
		$this->_answers = $tempArray;
			
		
		if (count($args) == 3) // Single
		{
			// Push first set of answers onto the array.
			$answers = str_split(rtrim(str_replace("'", "", str_replace(" ", "", $args[2]))));
			foreach($answers as $key => $value) 
				$this->pushAnswer($startingIndex++, $value);
		}
		
		
		else if (count($args) == 4) // MULTIPLE
		{
			$this->_ismultiple = true; 
			// Add lines in layers
			$this->addLineToMultiple($line);
			
			/*
			//$tempIndex = rtrim(str_replace("'", "", str_replace(" ", "", $args[2])));
			preg_match('/\'(.*?)\'/', $args[3], $answers); // Get rid of spaces before the quotes.
			$answers = str_split(rtrim(str_replace("'", "", str_replace(" ", "0", $answers[0])))); // Do NOT remove empty space characters for this one, make them into 0s instead.
			
			foreach($answers as $key => $value)
				if($value != 0) $this->pushAnswer($startingIndex++, $value);
			*/
		}
		else
			throw new Exception('* Scantron cards were not read in correctly. Please rescan your cards before trying again.<br>');
			
		//echo '<h1>Assignment v'. $this->getVersion() .'</h1>'. printMyData($this->getAnswers());
	}
	
	public function addLineToMultiple($line)
	{
		$args = explode(',', $line);
		if (count($args) != 4) throw new Exception('* Scantron cards were not read in correctly. Please rescan your cards before trying again.<br>');
		
		$myOptions = $this->_options;
		$sheetnumber = 1; // Assume it is sheetnumber 1 if not filled in.
			if ($myOptions[1] != '-')
				$sheetnumber = $myOptions[1];
		$startingIndex = (($sheetnumber-1)*50)+1; // If sheet#2, start at question 51.
		
		preg_match('/\'(.*?)\'/', $args[3], $answers); // Get rid of spaces before the quotes.
		$answers = str_split(rtrim(str_replace("'", "", str_replace(" ", "0", $answers[0])))); // Do NOT remove empty space characters for this one, make them into 0s instead.
		
		foreach($answers as $key => $value)
		{
			$this->pushAnswer($startingIndex, $value);
			$startingIndex++;
		}
	}
	
	public function getVersion()
	{
		$myOptions = $this->_options;
		if ($myOptions[0] != '-')
			return $myOptions[0];
		else
			return 1; // Assume it is version 1 if not filled in.
	}
	
	public function mergeAnswerSheet(SCANTRON $sheetToMerge)
	{
		if ($sheetToMerge->getIsMultiple())
			$this->_ismultiple = true;
			
		$valueArray = $sheetToMerge->getAnswers();
		foreach($valueArray as $key => $value)
			foreach($value as $k => $v)
				$this->pushAnswer($key, $v);
				
		foreach($sheetToMerge->getStackNumber() as $value)
			array_push($this->_stacknumber, $value);
		
		//foreach($this->getAnswers() as $key => $value)
		//	echo 'key: '. $key .' value: '. implode(', ', $value) .'<br>';
	}
	
	public function replaceAnswerSheet($newAnswerArray)
	{
		unset($this->_answers);
		$this->_answers = Array();
		foreach($newAnswerArray as $key => $value)
			foreach($value as $k => $v)
				$this->pushAnswer($key, $v);
		
		//foreach($this->getAnswers() as $key => $value)
		//	echo 'key: '. $key .' value: '. implode(', ', $value) .'<br>';
	}
	
	public function pushAnswer($key, $value)
	{
		if ($value != '0') //if ($value != '0' && $value != '-')
		{
			$myAnswers = $this->getAnswers();
			//if (!is_array($myAnswers[$key])) $myAnswers[$key] = Array();
			$myAnswers[intval($key)][intval($value)] = $value;
			$this->_answers = $myAnswers;
		}
	}
	
	public function printSheet($answerkeys = null, $totalPointsPossible = null)
	{
		$txt = '';
		if ($answerkeys)
		{
			if ($totalPointsPossible) $txt .= $this->printStudentResults($answerkeys, $totalPointsPossible);
			else $txt .= $this->printStudentResults($answerkeys);
		}
		else
		{
			$txt .= $this->printAnswerKey();
		}
		return $txt;
	}
	
	private function printAnswerKey()
	{
		//echo printMyData($_POST); // !!! debugger.
		//echo printMyData($_POST['versionPartial']); // !!! debugger.
		//echo printMyData($_POST['pointvalue'][$this->getVersion()]); // !!! debugger.
		
		// If no answerkeys were in the stack, cancel a lot of the error messages.
		if (isset($_POST['noAnswerkeysInStack']) && $_POST['noAnswerkeysInStack']) $noAnswerkeysInStack = true;
		else $noAnswerkeysInStack = false;
		
		
		// Update point values
		//if (isset($_POST['pointvalue'][$this->getVersion()])) $this->setPointValueArray($_POST['pointvalue'][$this->getVersion()]);
		
		
		$txt = '';
		//$txt .= '<td class="studentMultipleWrapper studentMultipleWrapperKey">';
		$possibleErrorsFound = false;
		
		$wid = $this->getWid();
		if ($wid[0] == '8')
		{
			$txt .=  '<div style="margin-top:10px; color:#4f4f4f; text-align:center; border-radius:20px; border:2px solid #4f4f4f; background-color:white;">This answerkey has a WID ('. $this->getWid() .'). Are you sure this isn\'t a student submission? If this is not an answerkey, please rescan your stack of cards face-up with the answerkeys on top.</div>';
			$possibleErrorsFound = true;
		}

		
		$txt .=  '<h3>Answer Key for Test Version #'. $this->getVersion() .'</h3>';
		
		$txt .= '<table class="studentMultipleTable studentAnswerKeyTable"><tr>';
		$txt .= '<th></th>';
		$txt .= '<th>A</th>';
		$txt .= '<th>B</th>';
		$txt .= '<th>C</th>';
		$txt .= '<th>D</th>';
		$txt .= '<th>E</th>';
		$txt .= '<td style="border:0; width: 65px; text-align:right;">Points</td>';
		//if ($this->getIsMultiple())
			$txt .= '<td style="border:0; width: 150px; text-align:right;"> <label>All <input type="checkbox" id="partialKeyAllID'. $this->getVersion() .'" onclick=\'checkAllBoxes("partialKeyAllID'. $this->getVersion() .'", "partialKeyAll'. $this->getVersion() .'");\'></label></td>';
		$txt .= '</tr>';
		$tempindex = 1;
		$singleAnswerThreshold = 1;
		foreach ($this->getAnswers() as $questionnumber => $row)
		{
			if ($tempindex <= $this->getNumberOfQuestions())
			{
				// Check for errors reading in responses to this question (non-fatal).
				if ($noAnswerkeysInStack) $errorType = -1;
				else if (count($row) < $singleAnswerThreshold) $errorType = 1;
				else if (in_array('-', $row)) $errorType = 2;
				else $errorType = 0;
				
			
				//$inputType = 'radio';
				//if (count($row) > $singleAnswerThreshold || $this->getIsMultiple())
					$inputType = 'checkbox';
			
				$txt .= '<tr>';
				
				/*
				// !!! debugger.
				$txt .= '<td colspan="99" style ="width:200px; height:25px; border: 1px solid blue;">count: '. count($row) .' as ';
				foreach($row as $key => $value)
					$txt .= 'key: '. $key .' value: '. $value;
				$txt .=  '</td></tr><tr>';
				*/
				
				if ($errorType > 0) $txt .= '<td style="color:red; border:0;">';
				else $txt .= '<td style="border:0;">';
				
				$txt .= $questionnumber .'</td>';
				for($j = 1; $j <= 5; $j++)
				{
					if ($errorType > 0) $txt .= '<td style="border:2px solid red;">';
					else $txt .= '<td>';
					
					if ($inputType == 'radio')
					{
						if (in_array($j, $row)) $txt .= '<input class="answerKeyResponseClass" type="'. $inputType .'" name="answerkeys['. $this->getVersion() .']['. $tempindex .']" value="'. $j .'" checked>';
						else $txt .= '<input class="answerKeyResponseClass" type="'. $inputType .'" name="answerkeys['. $this->getVersion() .']['. $tempindex .']" value="'. $j .'">';
					}
					else
					{
						if (in_array($j, $row)) $txt .= '<input class="answerKeyResponseClass" type="'. $inputType .'" name="answerkeys['. $this->getVersion() .']['. $tempindex .']['. $j .']" value="'. $j .'" checked>';
						else $txt .= '<input class="answerKeyResponseClass" type="'. $inputType .'" name="answerkeys['. $this->getVersion() .']['. $tempindex .']['. $j .']" value="'. $j .'">';
					}
					
					$txt .= '</td>';
				}
				
				
				// Point value
				$pointValueArray = $this->getPointValueArray();
				$txt .= '<td style="width: 65px; text-align:right;">';
				$txt .= '<input class="answerKeyResponseClass pointValueClass" onchange="tallyPointValue()" style="width: 40px;" type="number" min="0" step="0.01" name="pointvalue['. $this->getVersion() .']['. $tempindex .']" value="'. round($pointValueArray[$questionnumber], 2) .'">';
				$txt .= '</td>';
				
				
				$txt .= '<td style="width: 150px; text-align:right;">';
				if (true) //if (count($row) > $singleAnswerThreshold || $this->getIsMultiple())
				{
					// This runs if partial credit checkboxes are selected.
					$isPartialChecked = '';
					if (isset($_POST['versionPartial']))
					{
						$versionPartial = $_POST['versionPartial'];
						if (array_key_exists($this->getVersion(), $versionPartial))
							if (array_key_exists($questionnumber, $_POST['versionPartial'][$this->getVersion()])) 
							//if ($versionPartial[$student->getVersion()][$questionnumber] == 'on')
								$isPartialChecked = 'checked';
					}
					//$txt .= '<td style="border:0; width: 150px; text-align:right;"> <label>Allow Partial <input type="checkbox" name="versionPartial['. $this->getVersion() .']['. $questionnumber .']" class="partialKeyAll'. $this->getVersion() .'" '. $isPartialChecked .'></label></td>';
					$txt .= ' <label>Allow Partial <input type="checkbox" name="versionPartial['. $this->getVersion() .']['. $questionnumber .']" class="partialKeyAll'. $this->getVersion() .'" '. $isPartialChecked .'></label>';
				}
				$txt .= '</td>';
				
				
				if ($errorType == 1)
				{
					$txt .= '</tr><tr><td colspan="99" class="errorBoxTd" style="height: 20px; border-radius:0; border:2px solid #4f4f4f;"> Is this row supposed to be empty?</td></tr>'; //<input type="hidden" name="answerkeys['. $this->getVersion() .']['. $tempindex .']" value="0">
					$possibleErrorsFound = true;
				}
				else if ($errorType == 2)
				{
					$txt .= '</tr><tr><td colspan="99" class="errorBoxTd" style="height: 20px; border-radius:0; border:2px solid #4f4f4f;"> This response could not be read.</td></tr>'; //<input type="hidden" name="answerkeys['. $this->getVersion() .']['. $tempindex .']" value="0">
					$possibleErrorsFound = true;
				}
				
				$txt .= '</tr>';
			}
			$tempindex++;
		}
		$txt .= '</table>';
		
		$txt .=  "</td>";
		
		if ($possibleErrorsFound)
			$newTxt = '<td class="studentMultipleWrapper studentMultipleWrapperKey" style="border:3px dotted red;">' . '<br>Scantron Card(s): ' . implode(', ', $this->getStackNumber()) . '<div style="margin-top:10px; color:#4f4f4f; text-align:center; border-radius:20px; border:2px solid #4f4f4f; background-color:white;">Possible issues have been flagged below. Please review this answer key for accuracy and make any necessary changes. Once you have confirmed that these are correct, click <i>Perform Conversion</i>.</div>' . $txt;
		else
			$newTxt = '<td class="studentMultipleWrapper studentMultipleWrapperKey">'. '<br>Scantron Card(s): ' . implode(', ', $this->getStackNumber()) . $txt;
		
		return $newTxt;
	}
	
	private function printStudentResults($answerkeys, $totalPointsPossible = null)
	{
		$txt = '';
		
		$txt .= '<td class="studentMultipleWrapper">';
		$txt .=  "<br>Scantron Card(s): ". implode(', ', $this->getStackNumber());
		$txt .=  "<br><strong>WID:</strong> ". $this->getWid();
		//$txt .=  "<br><strong>Options:</strong> ";
		//foreach ($this->getOptions() as $key => $option) 
		//	$txt .=  $option .',';
		$txt .=  "<br><strong>Test Version:</strong> ". $this->getVersion();
		
		
		if (array_key_exists($this->getVersion(), $answerkeys))
			$myKey = $answerkeys[$this->getVersion()]->getAnswers();
		else
			throw new Exception('* Answer key not found for test version '. $this->getVersion() .' filled out by student with WID '. $this->getWid() .'.<br>');
		
		$txt .= '<div>';
		
		$txt .= '<table class="studentMultipleTable"><tr>';
		$txt .= '<th></th>';
		$txt .= '<th>A</th>';
		$txt .= '<th>B</th>';
		$txt .= '<th>C</th>';
		$txt .= '<th>D</th>';
		$txt .= '<th>E</th>';
		$tempindex = 1;
		$questionbreakline = 50;
		foreach ($this->getAnswers() as $questionnumber => $row)
		{
			if ($tempindex++ <= $this->getNumberOfQuestions())
			{
				// Split into multiple rows if really long.
				//if ($questionnumber == 51 || $questionnumber == 101 || $questionnumber == 151)
				
				if (($questionnumber-1) % $questionbreakline == 0 && $questionnumber > $questionbreakline) // 51, 101, 151, ...etc.
				{
					$txt .= '</table>';
					$txt .= '<table class="studentMultipleTable"><tr>';
					$txt .= '<th></th>';
					$txt .= '<th>A</th>';
					$txt .= '<th>B</th>';
					$txt .= '<th>C</th>';
					$txt .= '<th>D</th>';
					$txt .= '<th>E</th>';
				}
			
			
				$txt .= '<tr>';
				$txt .= '<td style="border:0;">'. $questionnumber .'</td>';
				for($j = 1; $j <= 5; $j++)
				{
					
					if ((in_array($j, $row) && !in_array($j, $myKey[$questionnumber])) || (!in_array($j, $row) && in_array($j, $myKey[$questionnumber])))
						$txt .= '<td class="bulletWrapper" style="background-color:red;">';
					else
						$txt .= '<td class="bulletWrapper">';
					if (in_array($j, $row)) $txt .= '<div class="studentMultipleBullet"></div>';
					$txt .= '</td>';
				}
				$txt .= '</tr>';
			}
		}
		$txt .= '</table>';
		
		$txt .= '</div>';
		
		
		$allowpartialarray = null;
		if (isset($_POST['versionPartial']))
			if (array_key_exists($this->getVersion(), $_POST['versionPartial']))
				$allowpartialarray = $_POST['versionPartial'][$this->getVersion()];
				
		
		$txt .= '<div style="float:left;"><strong>Scored '. $this->getScore($answerkeys, $allowpartialarray) .'/'. $answerkeys[$this->getVersion()]->getPointsPossible() .' points</div>';
		//if ($totalPointsPossible != null) $txt .= '<div style="float:left;"><strong>Final Score: '. ($this->getScore($answerkeys, $allowpartialarray)/$this->getNumberOfQuestions())*$totalPointsPossible .' points</div>';
		
		$txt .=  "</td>";
		
		return $txt;
	}
	
	// Returns a percentage value of the student's score.
	public function getScore($answerkey, $allowpartialarray = null)
	{
		if (array_key_exists($this->getVersion(), $answerkey))
			$myKey = $answerkey[$this->getVersion()]->getAnswers();
		else
			throw new Exception('* Answer key not found for test version '. $this->getVersion() .' filled out by student with WID '. $this->getWid() .'.<br>');
		
		$pointValueArray = $answerkey[$this->getVersion()]->getPointValueArray();
		
		$tempindex = 1;
		$totalPoints = 0;
		foreach ($this->getAnswers() as $questionnumber => $row)
		{
			if ($tempindex++ <= $this->getNumberOfQuestions())
			{
				if (count($myKey[$questionnumber]) > 1)// || $this->getIsMultiple())		//if (count($row) > 1 || $this->getIsMultiple())
				{
					if ($allowpartialarray && array_key_exists($questionnumber, $allowpartialarray))
					{
						$tempPoint = 0;
						for($j = 1; $j <= 5; $j++)
						{
							
							// Same as below, but better organized.
							if (in_array($j, $row) == in_array($j, $myKey[$questionnumber]))
							{
								if (in_array($j, $row) && in_array($j, $myKey[$questionnumber]))
									$tempPoint += 1/count($myKey[$questionnumber]);
								else // if (!in_array($j, $row) && !in_array($j, $myKey[$questionnumber]))
									$tempPoint += 0; // no points for not choosing a wrong answer.
							}
							else
							{
								if (in_array($j, $row) && !in_array($j, $myKey[$questionnumber]))
									$tempPoint -= 1/(5 - count($myKey[$questionnumber]));
								else // if (!in_array($j, $row) && in_array($j, $myKey[$questionnumber]))
									$tempPoint += 0; // no points added, but none subtracted.
							}
							
							/*
							// Same as above, but not nested.
							if (in_array($j, $row) && in_array($j, $myKey[$questionnumber]))
								$tempPoint += 1/count($myKey[$questionnumber]);
							else if (!in_array($j, $row) && !in_array($j, $myKey[$questionnumber]))
								$tempPoint += 0; // no points for not choosing a wrong answer.
							else if (in_array($j, $row) && !in_array($j, $myKey[$questionnumber]))
								$tempPoint -= 1/(5 - count($myKey[$questionnumber]));
							else if (!in_array($j, $row) && in_array($j, $myKey[$questionnumber]))
								$tempPoint += 0; // no points added, but none subtracted.
							*/
						}
						$tempPoint *= $pointValueArray[$questionnumber]; // Multiply by point value of this question.
						if ($tempPoint >= 0) $totalPoints += $tempPoint; // No negative points.
					}
					else
					{
						$tempPoint = 1;
						for($j = 1; $j <= 5; $j++)
						{
							if ((in_array($j, $row) != in_array($j, $myKey[$questionnumber])))
								$tempPoint = 0;
						}
						$tempPoint *= $pointValueArray[$questionnumber]; // Multiply by point value of this question.
						$totalPoints += $tempPoint;
					}
				}
				else
					for($j = 1; $j <= 5; $j++)
						if ((in_array($j, $row) && in_array($j, $myKey[$questionnumber])))
							$totalPoints += $pointValueArray[$questionnumber]; // Multiply by point value of this question.;
			}
		}
	
		return $totalPoints;
	}
	
	public function setPointValueArray($newArray) 
	{ 
		$this->_pointvaluearray = $newArray;
	}
	
	public function getPointsPossible() 
	{
		$totalPointPossible = 0;
		foreach($this->getPointValueArray() as $key => $value)
		{
			$totalPointPossible += $value;
		}
		return $totalPointPossible;
	}
}
?>


<?php // DELETE TEMP FILES/FOLDERS AFTER CONVERSION
	// handles deletion of temp files used to create the QTI .zip
	function deleteFolder($path)
	{
		if (is_dir($path) === true)
		{
			$files = array_diff(scandir($path), array('.', '..'));

			foreach ($files as $file)
			{
				deleteFolder(realpath($path) . '/' . $file);
			}

			return rmdir($path);
		}

		else if (is_file($path) === true)
		{
			return unlink($path);
		}

		return false;
	}
?>


<?php // PRINT VARIABLE ARRAY DUMP (for debugging) // !!! debugger.
	//======== VARIABLE DUMP (begin) ========
	function printMyData($value)
	{
		$txt = '';
		if (is_array($value))
		{
			//ksort($value);
			foreach ($value as $innerkey => $innervalue) 
			{
				//if ($innervalue != null && $innervalue != "")
				//{
					$txt .= "<div style='margin-left:20px;'><strong>". $innerkey .":</strong> ";
					$txt .= printMyData($innervalue);
					$txt .= "</div>";
				//}
			}
		}
		else
			$txt .= $value;
		return $txt;
	}
	//======== VARIABLE DUMP (end) ==========
?>


<!DOCTYPE HTML>
<html>
<head>
<title>Scantron to Canvas Gradebook Converter</title>

<!-- Version 3.8 -->

<link rel="shortcut icon" href="https://s.ksucloud.net/k-state-static/2011/0.9.5/img/favicon.ico">

<style>
	html, body
	{
		font-family: "Calibri";
		width: 100%; 
		margin: 0; 
		padding: 0; 
		background-color: #ddd;
	}
	
	.header
	{
		background-color: #4f2684;
		color: white;
		text-decoration: none;
		text-align: center;
		line-height: 70px;
		width: 100%;
		margin: 0;
	}
	a .headerLink
	{
		color: white;
		text-decoration: none;
	}
	a .headerLink:visited
	{
		color: white;
		text-decoration: none;
	}
	
	.fileNameClass
	{
		margin-bottom: 5px;
	}
	
	.inputDiv
	{
		text-align: center;
	}
	
	p, li
	{
		padding-left: 20px;
		padding-right: 20px;
	}
	
	.formWrapper, .formWrapper_step2, .floatingNavMenu
	{
		width: 800px;
		border: 6px solid #4f2684;
		border-radius: 30px;
		
		margin-top: 20px;
		margin-left: auto;
		margin-right: auto;	
		
		background-color: #fff;
	}
	.formWrapper_step2
	{
		width: 1090px;
	}
	
	.inputTable
	{
		margin-left: auto;
		margin-right: auto;
		/* border-spacing: 20px; */
	}
	.inputTable tr td:first-child
	{
		width: 300px;
		text-align: right;
	}
	.inputTable tr td:last-child
	{
		width: 300px;
		text-align: left;
		padding-left: 10px;
	}
	
	input[type=file], input[type=submit], button
	{
		border: 6px solid white;
		background-color: #4f2684;
		color: white;
		
		border-radius: 10px;
		font-weight: bold;
		width: 280px;
	}
	input[type=file]
	{
		width: 270px;
		margin-left:5px;
		margin-bottom: 10px;
	}
	input[type=submit], button
	{
		height: 35px;
	}
	input[type=file]:hover, input[type=submit]:hover, button:hover
	{
		border: 6px solid #4f2684;
		background-color: #ddd;
		color: #4f2684;
	}
	input[type=checkbox], input[type=radio]
	{
		position: relative;
		top: 1px;
		left: 1px;
		
		width: 15px;
		height: 15px;
	}
	input[type=checkbox]:after, input[type=radio]:after
	{
		content: ' ';
		background-color: white;
		border-radius: 50%;
		display: inline-block;
		width: 12px;
		height: 12px;
		position: relative;
		top: 1px;
		left: 1px;
	}
	input[type=checkbox]:checked:after, input[type=radio]:checked:after
	{
		content: ' ';
		background-color: #4f4f4f;
		
		width: 10px;
		height: 10px;
		top: 1px;
		border: 1px solid white;
	}
	
	.disabledClass
	{
		border: 6px solid #999;
		background-color: #999;
	}
	
	.answerKeyResponseClass
	{
		margin: 0;
		position: relative;
		top: 4px;
	}
	
	#phpErrorBox
	{
		color: red;
	}
	#phpGoodOutputBox
	{
		text-align: center;
	}
	
	.studentMultipleTable
	{
		table-collapse: collapse;
		table-layout: fixed;
		/* margin-left: auto;
		margin-right: auto; */
		
		float: left;
		margin-right: 20px;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	.studentMultipleTable tr td, .studentMultipleTable tr th
	{
		width:10px;
		height:10px;
		border: 1px solid black;
		border-radius: 50%;
		text-align: center;
		line-height: 0px;
	}
	.bulletWrapper
	{
		background-color: white;
	}
	
	.studentMultipleTable tr th
	{
		border: 0px solid black;
	}
	
	.studentAnswerKeyTable
	{
		margin-right:0;
	}
	.studentAnswerKeyTable tr td
	{
		border: 0;
	}
	
	.studentMultipleBullet
	{
		display: inline-block;
		width: 6px;
		height: 6px;
		margin: auto;
		position: relative;
		top: 0px;
		left: 0px;
		border: 1px solid black;
		border-radius: 50%;
		background-color: black;
	}
	
	.phpOutputTable
	{
		text-align: left;
		margin-left: auto;
		margin-right: auto;
		/* border-collapse: collapse; */
		border-spacing: 10px;
		border-collapse: separate;
	}
	
	.studentMultipleWrapper, .studentMultipleWrapperKey
	{
		border:1px solid black;
		border-radius: 30px;
		display: inline-block;
		width: 300px;
		background-color: rgb(231, 248, 255);
		/* height: 100%; */
		text-align: left; 
		color: black;
		vertical-align: top;
		padding-left: 20px; 
		padding-right: 20px;
		padding-bottom: 20px;
		margin: 5px;
		
		/* margin-bottom: 50px;
		margin-left: -1px; */
		
	}
	.studentMultipleWrapperKey
	{
		border:4px dotted black;
		width: 296px;
		/* margin-left: -4px;
		margin-top: -4px; */
		background-color: rgb(238, 226, 226); /*#ddd;*/
	}
	
	.errorBoxTd
	{
		height:20px; 
		background-color:white; 
		font-weight:bold; 
		border:0; 
		height: 50px;
		text-align:left; 
		color:red;
		border-radius: 0;
		
	}
	.errorBox
	{
		display: block;
		width: 620px;
		margin-left: auto;
		margin-right: auto;
		
		padding: 10px;
		
		background-color: white;
		border: 3px solid red;
	}
	
	
	.floatingNavMenu
	{
		position: fixed;
		right: 10px;
		top: 70px;
		width: 80px;
		/* height: 85px; */
	}
	@media screen and (max-width:1330px) 
	{  
		.floatingNavMenu
		{
			display: none;
		}
	}
	
</style>


<!-- LOAD JAVASCRIPT LIBRARIES: -->
<!--
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
-->
<!--
<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css" />
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>
-->

<script>
	function showStep1Form(show)
	{
		//window.onload = function() {
		setTimeout(function() {
			if (show) document.getElementById("step1formID").style.display = "block";
			else document.getElementById("step1formID").style.display = "none";
		}, 1000);
		//}
	}
	function showStep2Form(show)
	{
		//window.onload = function() {
		setTimeout(function() {
			if (show) document.getElementById("step2formID").style.display = "block";
			else document.getElementById("step2formID").style.display = "none";
		}, 1000);
		//}
	}
	
	
	function resetErrorBox()
	{
		//document.getElementById('phpErrorBox').innerHTML = '';
		//setTimeout(function(){
			document.getElementById('phpErrorBox').innerHTML = '<p><div class="inputDiv"><span style="color:black;"><strong>Converting</strong></span></div></p>';
			setTimeout(function(){
				document.getElementById('phpErrorBox').innerHTML = '<p><div class="inputDiv"><span style="color:black;"><strong>Converting.</strong></span></div></p>';
				setTimeout(function(){
					document.getElementById('phpErrorBox').innerHTML = '<p><div class="inputDiv"><span style="color:black;"><strong>Converting..</strong></span></div></p>';
					setTimeout(function(){
						document.getElementById('phpErrorBox').innerHTML = '<p><div class="inputDiv"><span style="color:black;"><strong>Converting...</strong></span></div></p>';
						setTimeout(function(){
							document.getElementById('phpErrorBox').innerHTML = '<p><div class="inputDiv"><span style="color:black;"><strong>Please check your <i>Downloads</i> folder. Your file should appear there shortly.</strong></span></div></p>';
							showStep1Form(true);
							showStep2Form(false);
						}, 1000);
					}, 1000);
				}, 1000);
			}, 1000);
		//}, 1000);
		
		/*
		// Reload or reset page when finished.
		setTimeout(function(){
			//window.location.href = '.';
			showStep1Form(true);
			showStep2Form(false);
		}, 6000);
		*/
	}
	
	function checkAllBoxes(thisCheckBoxID, keyClassName)
	{
		var myAll = document.getElementById(thisCheckBoxID);
		var allMyCheckboxes = document.getElementsByClassName(keyClassName);
		//alert("All: " + myAll.id + " Class: " + allMyCheckboxes.className);
		for (i = 0; i < allMyCheckboxes.length; i++) 
		{ 
			allMyCheckboxes[i].checked = myAll.checked;
		}
	}
	
	function tallyPointValue()
	{
		var pointArray = document.getElementsByClassName('pointValueClass');
		var pointArrayTotals = [];
		var pointArrayTotalsIndex = 0;
		var lastName = 'pointvalue[1]';
		var totalPoints = 0;
		for (var i = 0; i < pointArray.length; i++)
		{
			if (i == pointArray.length-1) totalPoints += parseFloat(pointArray[i].value);
			if (pointArray[i].name.substring(0, 13) != lastName || i == pointArray.length-1)
			{
				//console.log(lastName + ': ' + totalPoints.toFixed(2) + '\n');
				lastName = pointArray[i].name.substring(0, 13);
				
				if (totalPoints > 0)
				{
					pointArrayTotals.push(parseFloat(totalPoints).toFixed(2));
					totalPoints = 0;
				}
			}
			if (i != pointArray.length-1) totalPoints += parseFloat(pointArray[i].value);
		}
		//console.log('remainder: ' + totalPoints);
		
		var lastPointValue = -1;
		var failedCheck = false;
		for (var i = 0; i < pointArrayTotals.length; i++) 
		{
			//console.log(i + ': ' + pointArrayTotals[i]);
			if (pointArrayTotals[i] != lastPointValue)
			{
				if (lastPointValue == -1) lastPointValue = pointArrayTotals[i];
				else failedCheck = true;
			}
		}
		
		if (failedCheck)
		{
			document.getElementsByName('createzip_step2')[0].disabled = true;
			document.getElementsByName('createzip_step3')[0].disabled = true;
			//document.getElementsByName('createzip_step2')[0].className = 'disabledClass';
			//document.getElementsByName('createzip_step3')[0].className = 'disabledClass';
			document.getElementsByName('createzip_step2')[0].style.color = '#999';
			document.getElementsByName('createzip_step3')[0].style.color = '#999';
			document.getElementById('totalPointsTitleID').innerHTML = '<strong style="color:red;">Point values for all test versions must match!</strong>';
		}
		else
		{
			document.getElementsByName('createzip_step2')[0].disabled = false;
			document.getElementsByName('createzip_step3')[0].disabled = false;
			//document.getElementsByName('createzip_step2')[0].className = '';
			//document.getElementsByName('createzip_step3')[0].className = '';
			document.getElementsByName('createzip_step2')[0].style.color = '';
			document.getElementsByName('createzip_step3')[0].style.color = '';
			document.getElementById('totalPointsTitleID').innerHTML = '<strong>Worth ' + lastPointValue + ' point total</strong>';
		}
		
		//alert(pointArray.length);
		//pointArray.value 
	}
</script>


<script>
	// SOURCE:  http://www.javascripter.net/faq/searchin.htm
	// Dane: The search box must come LAST in the HTML of the page, or the search will focus on its own textbox and get stuck. Or you need to find a way to break the user's selected 'focus()' (blur()?) on the textbox before clicking 'Find'.
	
	
	var TRange=null;
	function findString (str)
	{
		//document.getElementsByTagName('p')[0].focus();
		//document.getElementById('t2').focus();
	
		if (parseInt(navigator.appVersion)<4) return;
		var strFound;
		if (window.find) 
		{
			// CODE FOR BROWSERS THAT SUPPORT window.find

			strFound=self.find(str);
			if (!strFound) 
			{
				strFound=self.find(str,0,1);
				while (self.find(str,0,1)) continue;
			}
		}
		else if (navigator.appName.indexOf("Microsoft")!=-1) 
		{

			// EXPLORER-SPECIFIC CODE

			if (TRange!=null) 
			{
				TRange.collapse(false);
				strFound=TRange.findText(str);
				if (strFound) TRange.select();
			}
			if (TRange==null || strFound==0) 
			{
				TRange=self.document.body.createTextRange();
				strFound=TRange.findText(str);
				if (strFound) TRange.select();
			}
		}
		else if (navigator.appName=="Opera") 
		{
			alert ("Opera browsers not supported, sorry...")
			return;
		}
		if (!strFound) alert ("WID '"+str+"' was not found!");
		return;
	}
	
	function toggleTotalPointsBox()
	{
		if (document.getElementById('specifyIndividualQuestionWeights').checked)
			document.getElementById('totalPointsPossible').disabled = true;
		else
			document.getElementById('totalPointsPossible').disabled = false;
	}
</script>


</head>
<body>
	<a class="headerLink" href=".">
		<h1 class="header">Scantron to Canvas Gradebook Converter</h1>
	</a>
	<div id="phpErrorBox">
		<?php
			if ($error != "")
				echo '<p><div class="inputDiv errorBox">'. $error .'</div></p>';
		?>
	</div>
	<div id="phpGoodOutputBox">
		<?php
			if ($converterOutput != "" && $error == "")
			{
				echo '<p class="inputDiv">'. $converterOutput .'</p>';
				//die(); // do not show the form from step 1 if the step 2 form is generated.
				echo '<script>showStep1Form(false);</script>';
			}
		?>
	</div>
	<div id="step1formID" class="formWrapper">
		<form enctype="multipart/form-data" name="zips" method="post">
			<p>
				<strong>Before you begin:</strong> fill out the answer keys for this assignment on scantron cards and place them at the top of the stack, then then scan your cards face-up through the scantron machine in Hale 214. This converter will identify the first scantrons read in as answerkeys, so they do not need to be marked with a special WID number/etc.
			</p>
			<div class="inputDiv">
				<p>
					Select the Scantron file you wish to convert into a .csv for Canvas gradebook import.
				</p>
				<p>
					<a target="_blank" href="./example_scantron_files.zip">(.zip of example files)</a>
				</p>
				<p>
					<!--<input type='file' name='filestozip[]' id='filetozip' multiple />-->
					<input type='file' name='filestozip[]' id='filetozip'/>
				</p>
				<table class="inputTable">
					<tr>
						<td>
							What do you want your assignment to be named in Canvas?
						</td>
						<td>
							<input type='text' name='fileToZipName' id='fileToZipName'/>
						</td>
					</tr>
					<tr>
						<td>
							How many questions are in this assignment?
						</td>
						<td>
							<input type='number' name='numberofquestions' id='numberofquestions' style="width:55px; text-align: left;" min="1"/> <span style="color:red;">*required</span>
						</td>
					</tr>
					<tr>
						<td>
							How many points is this assignment worth?
						</td>
						<td>
							<input type='number' name='totalPointsPossible' id='totalPointsPossible' style="width:55px; text-align: left;" min="1"/> <span style="color:red;">*required</span>
						</td>
					</tr>
					<tr>
						<td>
							<label>I will specify individual question weights</label>
						</td>
						<td>
							<input type="checkbox" class="answerKeyResponseClass" id="specifyIndividualQuestionWeights" name="specifyIndividualQuestionWeights" value="true" onclick="toggleTotalPointsBox()">
						</td>
					</tr>
				</table>
				<p>
					Select the number of test versions (answer keys).
					<!--<input type="number" name="versioncount" value="1" style="width:35px; text-align: center;" min="1">-->
					<br>
					<label><input type="radio" name="versioncount" value="1" checked>1</label>
					<label><input type="radio" name="versioncount" value="2">2</label>
					<label><input type="radio" name="versioncount" value="3">3</label>
				</p>
				<p>
					Select the number of answer sheets per test version.
					<br>
					(e.g.: more than 50 questions equals 2 sheets):
					<!--<input type="number" name="sheetcount" value="1" style="width:35px; text-align: center;" min="1">-->
					<br>
					<label><input type="radio" name="sheetcount" value="1" checked>1</label>
					<label><input type="radio" name="sheetcount" value="2">2</label>
					<label><input type="radio" name="sheetcount" value="3">3</label>
					<label><input type="radio" name="sheetcount" value="4">4</label>
					<label><input type="radio" name="sheetcount" value="5">5</label>
				</p>
				<p>
					Make sure the answer key sheets were scanned in at the top of the stack.
				</p>
				<p>
					<label><input type="checkbox" class="answerKeyResponseClass" name="noAnswerkeysInStack" value="true"> I did not create my answer keys on my scantron cards.</label>
				</p>
				<p>
					<input type='submit' name='createzip_step1' value='Convert' onclick="resetErrorBox();" />
				</p>
			</div>
			<div class="toolInstructions">
				<p>
					Select the appropriate settings above and follow the steps provided. Once the steps are complete, check your <i>Downloads</i> folder for the converted file.
				</p>
				<p>
					<strong>Uploading to Canvas:</strong> Navigate to the Canvas Gradebook, click the gear icon at the top left, then choose the option to <i>Upload Scores (from .csv)</i>. Canvas will insert the students' total scores into your gradebook as if they were a graded manual assignment.
				</p>
				<p>
					Please note that you must already have some content in your Canvas Gradebook before you can successfully upload any grades from .csv files.
				</p>
			</div>
		</form>
	</div>
	<div style="text-align:center; font-size: 0.8em;">&copy; Dane Miller & Alexandre Adams, ITAC Help Desk Developers. K-State University 2014</div>
</body>