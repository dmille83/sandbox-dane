<?php // MAIN SCRIPT, RUN ON POST CALLBACK // GLOBALS AND ERROR STRING

	/* 	
	*	Title: Axio to Canvas (QTI 2.0) Converter
	*	Version: 2.8
	*	
	*	CHANGELOG:
	*	Changed all question types to read in answers provided in numerical format.
	*	
	*/


	// GLOBAL VARIABLES
	$error = "";		//error holder
	$matchingQuestionsIdArray = Array(); // (global) // list of matching question IDs that are completed.

	if(isset($_POST['createzip']))
	{
		$post = $_POST;		
		$tempFilePath = sys_get_temp_dir() .'/'; 	//"../tempfiles/"; // needs to be a folder with permissions 0711.			// sys_get_temp_dir(); //OR = "tempfiles/"; // to create our own directory.

		
		if (!is_dir($tempFilePath))
		{
			echo 'Error: Please create the temp file directory specified in line 20 before running this app.';
			die();
		}
		
		
		/*
		// ALTERNATIVE OPTION IS TO CREATE THE 'tempfiles' DIRECTORY SOMEWHERE.
		
		// create the 'tempfiles' file directory if it does not exist already.
		if (!is_dir("tempfiles"))  // is_dir - tells whether the filename is a directory.
			mkdir("tempfiles", 0711); // mkdir - tells that need to create a directory. 
			// 0777 is the default permission set, open to w r e for others (BAD).
			// 0755 is read/execute only.
			// 0711 is execute only.
			// 0600 is only the owner can read/write.
		*/
		
			
		// CREATE A TEMPORARY DIRECTORY TO PREVENT FILENAME CONFLICTS (scalability).
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
			//$tempFilePath = $tempFilePath.$tempBatchFilePath;
		
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
					$error .= '* File upload limit is '. $maxFileSize/1048576.0 .'MB, but your file(s) are '. $totalFileSize/1048576.0 .'MB in size, '. ($totalFileSize - $maxFileSize)/1048576.0 .'MB over the limit. <br>Please reduce the number of files you are attempting to convert, or break down any file(s) over 1MB into smaller parts.';
					$fileTypeIsValid = false;
				}
				else if ($_FILES['filestozip']['size'] > 0)
				{
					$csv_mimetypes = array(
						'text/csv',
						'text/plain',
						'text/anytext',
						'text/comma-separated-values',
						'application/csv',
						'application/excel',
						'application/vnd.ms-excel',
						'application/vnd.msexcel',
						'application/octet-stream', // !!! ALLOWS .php FILES THROUGH !!! // Has to be allowed in case they have no default program, or their default is Notepad, which doesn't care about MIME-Type.
						'application/txt',
					);
					foreach ($_FILES['filestozip']['type'] as $file)
					{
						//$error .= 'Type: '. $file .'<br>__________<br>';
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
						//$exts = split("[/\\.]", $filename) ; 
						$exts = preg_split("[/\\.]", $filename) ;
						$n = count($exts)-1; 

						// Write any scripts that check for unwanted extensions here!
						if ($n > 1) // Check for evil double-barreled extensions like "yourfile.php.csv" or "yourfile.exe.csv" and eliminate extensions you don't allow.
						{
							$error .= "Double-Barreled file extension(s) are not allowed.<br>";
							$fileTypeIsValid = false;
						}
						$exts = $exts[$n]; 
						return $exts; 
					}
					foreach ($_FILES['filestozip']['name'] as $file)
						if (findexts ($file) != "csv") $fileTypeIsValid = false;
					//==============================
					
				}
			}
			else 
				$fileTypeIsValid = false;
				
			if ($fileTypeIsValid && $error == '')
			{
				// GET QUESTION DATA FROM EACH FILE
				$outPutData = Array(); // store temp file's directory names in an array so they can all be found and zipped later.
				foreach ($_FILES['filestozip']['tmp_name'] as $key => $file)
				{
					// SET VARIABLE VALUES
					$fileToZipName = preg_replace('/\.(\w+)$/', '', $_FILES['filestozip']['name'][$key]);
					$manifestTitle = $fileToZipName;

					
					// READ IN THE DATA FROM THE Axio .csv FILE
					$myAxioFileTemp = fopen($_FILES['filestozip']['tmp_name'][$key], "r") or die("Unable to open file!");  // READ IN DATA FROM TEMP FILE
					$questionDataArray = Array();
					$i = 1;
					while($line = fgetcsv($myAxioFileTemp))
					{
						try
						{
							$myNewQuestion = new Question($fileToZipName, $i++, $line);
							array_push($questionDataArray, $myNewQuestion);
						}
						catch (Exception $e)
						{
							$error .= $e->getMessage();
						}
						
						// LEAVE COMMENTED OUT EXCEPT WHEN DEBUGGING.
						//$error .= $myNewQuestion->printClass() ."* No file output will be given because you have not commented out the 'Debug Mode' lines.";
						
					}
					fclose($myAxioFileTemp);

					
					if ($error == "")
					{
						// PERFORM THE CONVERSION, THEN OUTPUT CONVERTED DATA TO A NEW .xml FILE
						$txt = writeNewXml($questionDataArray, $fileToZipName);
						$myNewFileName = $fileToZipName ."_". $tempBatchTimeStamp .".xml";
						$newXMLfile = fopen($tempFilePath.$tempBatchFilePath.$myNewFileName, "w") or die("Unable to open file!");
						fwrite($newXMLfile, $txt);
						
						fclose($newXMLfile);						

						/*
						// CREATE NEW .xml MANIFEST (unneeded)
						$myNewManifestName = $fileToZipName ."_manifest_". $tempBatchTimeStamp .".xml";
						$newManifestFile = fopen($tempFilePath.$tempBatchFilePath.$myNewManifestName, "w") or die("Unable to open file!");				
						$txt = writeNewManifest($fileToZipName, $manifestTitle);
						fwrite($newManifestFile, $txt);
						fclose($newManifestFile);
						*/
					}
					
					// IF NO ERRORS, CREATE FILES.
					if ($error == "")
					{
						// CREATE AND DOWNLOAD THE .zip FILE CONTAINING THE NEWLY-CREATED .xml FILE
						$zip = new ZipArchive();			// Load zip library	
						$zip_name = $fileToZipName ."_". $tempBatchTimeStamp .".zip";			// Zip name
						if($zip->open($tempFilePath.$tempBatchFilePath.$zip_name, ZIPARCHIVE::CREATE)!==TRUE){		// Opening zip file to load files
							$error .=  "* Sorry ZIP creation failed at this time<br/>";
						}
						$zip->addFile($tempFilePath.$tempBatchFilePath.$myNewFileName, $myNewFileName);			// Adding files into zip
						//$zip->addFile($tempFilePath.$tempBatchFilePath.$myNewManifestName, "imsmanifest.xml");	// Adding files into zip
						$zip->close();
						if(file_exists($tempFilePath.$tempBatchFilePath.$zip_name)){
							array_push($outPutData, $zip_name);
						}
					}
				}
				if ($error == "")
				{
					// IF MORE THAN ONE FILE WAS CONVERTED AT ONCE, WRAP THEM ALL IN A .zip FOR DOWNLOAD
					if(sizeOf($outPutData) > 1)
					{
						$outerZip = new ZipArchive();			// Load zip library	
						$outer_zip_name = 'BATCH_OF_'. sizeOf($outPutData) .'_ASSIGNMENTS_date'. $tempBatchTimeStamp .'_ID'. $tempBatchID .'.zip';			// Zip name
						if($outerZip->open($tempFilePath.$tempBatchFilePath.$outer_zip_name, ZIPARCHIVE::CREATE)!==TRUE){		// Opening zip file to load files
							$error .=  "* Sorry ZIP creation failed at this time<br/>";
						}
						foreach ($outPutData as $innerZipFileName)
						{
							$outerZip->addFile($tempFilePath.$tempBatchFilePath.$innerZipFileName, $innerZipFileName);
						}
						$outerZip->close();
						if(file_exists($tempFilePath.$tempBatchFilePath.$outer_zip_name)){
							// push to download the zip
							header('Content-type: application/zip');
							header('Content-Disposition: attachment; filename="'.$outer_zip_name.'"');
							readfile($tempFilePath.$tempBatchFilePath.$outer_zip_name);
						}
					}
					else // DOWNLOAD THE SINGLE .zip FILE WITHOUT WRAPPING IT IN A BATCH_OF_#_ASSIGNMENTS.zip
					{
						if(count($outPutData) > 0 && file_exists($tempFilePath.$tempBatchFilePath.$outPutData[0]))
						{
							// push to download the zip
							header('Content-type: application/zip');
							header('Content-Disposition: attachment; filename="'.$outPutData[0].'"');
							readfile($tempFilePath.$tempBatchFilePath.$outPutData[0]);
						}
					}
				}
			}else
				$error .= "* Please select a valid .csv file to zip <br/>";
		}else
			$error .= "* You dont have ZIP extension<br/>";
		deleteFolder($tempFilePath.$tempBatchFilePath); // remove all files (if exists) created in the temp path
		if ($error == '') die();
	}
?>


<?php // QUESTION CLASS
class Question
{
	private $_assignment;
	private $_number;
	private $_title;
	private $_id;
	private $_type;
	private $_points;
	private $_text;
	private $_answers = Array(); // in case of multiple-choice
	private $_responses = Array();
	
	public function getAssignment() { return $this->_assignment; }
	public function getNumber() { return $this->_number; }
	public function getTitle() { return $this->_title; }
	public function getID() { return $this->_id; }
	public function getType() 
	{ 
		global $error;
		switch(strtolower($this->_type))
		{
			case 'mc':
				return 'multiple_choice_question';
			case 'fb':
				return 'short_answer_question';
			case 'tf':
				return 'true_false_question';
			case 'mr':
				return 'multiple_answers_question';
			case 'matching':
				return 'matching_question';
			case 'es':
				return 'essay_question';
			case 'numeric':
				return 'numerical_question';
			default:
				//$error .= '* Question '. $this->getNumber() .' has a missing or unrecognized type in column 1. Please edit or remove this question before attempting to convert this file to QTI format.';
				//throw new Exception('* Question '. $this->getNumber() .' of <i>'. $this->getAssignment() .'.csv</i> has a missing or unrecognized question type in column 1. Please edit or remove this question before attempting to convert this file to QTI format.');
				return ''; // !!! debugger: should we throw an error here?
		}
	}
	public function getPoints() { return $this->_points; }
	public function getText() { return $this->_text; }
	public function getAnswers()
	{
		/*
		// !!! handling odd answer format of 'multiple_choice_question' until Dustin fixes the output from Axio.
		$answ = $this->_answers;
		if ($this->_type == 'mc')
		{
			foreach ($answ as $key => $a)
				$answ[$key] = ord(strtolower($a)) - 97;
			return $answ;
		}
		else 
		*/
			return $this->_answers; 
	}
	public function getResponses() { return $this->_responses; }

	
	// !!! debugger: USED FOR DEBUGGING
	public function printClass()
	{
		$txt = '<div style="text-align: left; color: black; padding-left: 20px; padding-right: 20px;">';
		$txt .=  "<br>". $this->getTitle() .": ";
		$txt .=  "<br>Type: ". $this->getType();
		$txt .=  "<br>Points: ". $this->getPoints();
		$txt .=  "<br>". $this->getText();
		if ($this->getType() == 'essay_question')
			$txt .=  "<br>Answer: (essay)";
		elseif ($this->getType() == 'true_false_question')
			if (implode($this->getAnswers(), ',') == 1)
				$txt .=  "<br>Answer: True";
			else
				$txt .=  "<br>Answer: False";
		else
			$txt .=  "<br>Answer: ". implode($this->getAnswers(), ',');
		$txt .=  "<div style='margin-left:20px;'>";
		foreach ($this->getResponses() as $responsekey => $response) 
		{
			if (in_array($responsekey, $this->getAnswers())) 
				$txt .=  "<strong>". $response ."</strong><br>";
			else
				$txt .=  $response ."<br>";
		}
		$txt .=  "</div></div>";
		return $txt;
	}
	
	// !!! debugger: check for invalid formatting due to user editing file
	public function isValid() // CHECKS FOR EXISTENCE OF ALL NECESSARY VARIABLES/ETC IN CASE USER MODIFIED THE .csv FILE
	{
		$myQerrorBefore = '<br>* Question '. $this->getNumber() .' of <i>'. $this->getAssignment() .'.csv</i> : ';
		$myQerrorBehind = '.';	// '. Please edit or remove this question before attempting to convert this file to QTI format.';
		
		//$myQerrorBefore = '* ';
		//$myQerrorBehind = ' of question '. $this->getNumber() .' of <i>'. $this->getAssignment() .'.csv</i> : ';	
		
	
		// check TYPE
		switch($this->_type)
		{
			case 'mc':
				break; //return 'multiple_choice_question';
			case 'fb':
				break; //return 'short_answer_question';
			case 'tf':
				break; //return 'true_false_question';
			case 'mr':
				break; //return 'multiple_answers_question';
			case 'matching':
				break; //return 'matching_question';
			case 'es':
				break; //return 'essay_question';
			case 'numeric':
				break; //return 'numerical_question';
			default:
				//$error .= '* Question '. $this->getNumber() .' has a missing or unrecognized type in column 1. Please edit or remove this question before attempting to convert this file to QTI format.';
				throw new Exception($myQerrorBefore .'Missing or unrecognized question type <i>"'. $this->_type .'"</i> in column 1'. $myQerrorBehind);
				break;
		}
		
		// check POINTS
		if ($this->_points == '' || $this->_points < 0) throw new Exception($myQerrorBefore .'Points are missing or less than zero in column 3'. $myQerrorBehind);
		
		// check ANSWERS
		if($this->_type != 'es' && $this->_type != 'fb' && count($this->_answers) <= 0) throw new Exception($myQerrorBefore .'Answers are missing from column 5'. $myQerrorBehind);
		
		// check RESPONSES
		if($this->_type != 'es' && $this->_type != 'tf' && $this->_type != 'numeric'&& count($this->_responses) <= 0) throw new Exception($myQerrorBefore .'Responses are missing from column 6'. $myQerrorBehind);
	}
	
	
	function __construct ($fileToZipName, $questionNumber, $args=Array())
	{
		// !!! debugger: throw exception if there are not at least 5 columns in the .csv (unless it is an 'es', then 4 is ok)
		if (count($args) < 5 && !(strtolower(rtrim($args[0])) == 'es' && count($args) == 4)) throw new Exception('<br>* Question '. $questionNumber .' of <i>'. $fileToZipName .'.csv</i> : Missing columns needed for question type <i>"'. rtrim($args[0]) .'"</i>.'); // (this line only has '. count($args) .' columns, needs at least 5)
		
		/*
		echo '<table border=1><tr><td style="width:200px;">';
		echo implode('</td><td style="width:200px;">', $args).'<br>';
		echo '</td></tr></table>';
		//throw new Exception("^");
		*/
		
		$this->_assignment = $fileToZipName;
		$this->_number = $questionNumber;
		$this->_title = "Question ". $questionNumber;	//$this->_title = $fileToZipName ." - Question ". $questionNumber;
		$this->_type = strtolower(rtrim($args[0]));
		$this->_id = strtolower(rtrim($args[1]));
		$this->_points = $args[2];
		$this->_text = $args[3]; //rtrim($args[3]);
		
		if ($this->_type != 'es') // !!! debugger: do not look for this if 'es', in case ALL the questions were 'es' and we only have 4 columns
		{
			$this->_answers = explode (',', $args[4]);
			if ($this->_type != 'numeric')
			{
				$this->_responses = array_slice($args, 5, count($args)-5);
				foreach ($this->_responses as $key => $val)
				{
					rtrim($this->_responses[$key]);
					if ($val == null || $val == '')
						unset($this->_responses[$key]); // the array goes out to the max number of choices given from ALL the questions in the doc, so clean out any empty slots.
				}
			}	
		}
		
		$this->isValid(); // !!! debugger: check for invalid formatting due to user editing file
	}
}
?>


<?php // WRITE XML DOC FOR QUESTIONS
	function writeNewXml($questionDataArray, $fileToZipName)
	{
		$txt = '';

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
/*
encoding="UTF-8"
*/
/*
	FOR SOME REASON, ENCODING IT AS UTF-8 (below) MAKES THE "lisa craft questions.csv" FILE, 
	WHEN CONVERTED, CONTAIN A BROKEN CHARACTER, WHICH MAKES THE UPLOAD INTO CANVAS FAIL. 
	SWITCHING BACK TO "ISO-8859-1", WHICH WAS USED IN QTI 1.0, FIXES THE ISSUE WITH THE 
	BROKEN CHARACTER. 
*/
$txt .= '<?xml version="1.0" encoding="ISO-8859-1"?>
<questestinterop xmlns="http://www.imsglobal.org/xsd/ims_qtiasiv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/ims_qtiasiv1p2 http://www.imsglobal.org/xsd/ims_qtiasiv1p2p1.xsd">
  <assessment ident="i'. md5($fileToZipName) .'" title="'. $fileToZipName .'">
    <qtimetadata>
      <qtimetadatafield>
        <fieldlabel>cc_maxattempts</fieldlabel>
        <fieldentry>1</fieldentry>
      </qtimetadatafield>
    </qtimetadata>
    <section ident="root_section">';
//--------------------------------------------------------------------------------//
		
		$txt .= writeQuestions($questionDataArray);
		
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
    </section>
  </assessment>
</questestinterop>
';
//--------------------------------------------------------------------------------//

		return $txt;
	}

	
	function writeQuestions($questionDataArray)
	{
		global $matchingQuestionsIdArray;
		
		$txt = '';
		foreach ($questionDataArray as $questionkey => $question)
		{
			if (!in_array($question->getID(), $matchingQuestionsIdArray)) // keeps it from writing duplicate matching questions
			{
				$txt .= writeQuestionHeader($question);
				
				// List of question types (for reference): 
				//		multiple_choice_question, short_answer_question, true_false_question, multiple_answers_question, matching_question, essay_question
				switch ($question->getType())				// This is the 'body', or '<presentation>' and '<resprocessing>' segment.
				{
					case 'multiple_choice_question':
						$txt .= writeXml_mc($question);
						break;
					case 'essay_question':
						$txt .= writeXml_es($question);
						break;
					case 'true_false_question':
						$txt .= writeXml_tf($question);
						break;
					case 'multiple_answers_question':
						$txt .= writeXml_mr($question);
						break;
					case 'short_answer_question':
						$txt .= writeXml_fb($question);
						break;
					case 'matching_question':
						$txt .= writeXml_matching($question, $questionDataArray);
						break;
					case 'numerical_question':
						$txt .= writeXml_numeric($question);
					default:
						// throw an exception, or just write nothing?
						break;
				}
				
				$txt .= writeQuestionFooter();
			}
		}
		return $txt;
	}
	
	
	function writeQuestionHeader($question)
	{
		$txt = '';
		//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
      <item ident="i'. md5($question->getTitle()) .'" title="'. $question->getTitle() .'">
        <itemmetadata>
          <qtimetadata>
            <qtimetadatafield>
              <fieldlabel>question_type</fieldlabel>
              <fieldentry>'. $question->getType() .'</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>points_possible</fieldlabel>
              <fieldentry>'. $question->getPoints() .'</fieldentry>
            </qtimetadatafield>
            <qtimetadatafield>
              <fieldlabel>assessment_question_identifierref</fieldlabel>
              <fieldentry>i'. md5(mt_rand(100000, 999999)) .'</fieldentry>
            </qtimetadatafield>
          </qtimetadata>
        </itemmetadata>';
		// Above is the same for every question.
//--------------------------------------------------------------------------------//
		return $txt;
	}
	function writeQuestionFooter()
	{
		return '
      </item>';
	}
	
	
	// multiple_choice_question
	function writeXml_mc($question)
	{
		$identNum = $question->getNumber() * 1000;
		
		$txt = '';
	
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
        <presentation>
          <material>
            <mattext texttype="text/html">'. $question->getText() .'</mattext>
          </material>
          <response_lid ident="response1" rcardinality="Single">
            <render_choice>';
//--------------------------------------------------------------------------------//
		foreach($question->getResponses() as $responsekey => $response)
		{
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
              <response_label ident="'. $identNum++ .'">
                <material>
                  <mattext texttype="text/plain">'. $response .'</mattext>
                </material>
              </response_label>';
//--------------------------------------------------------------------------------//
		}
		
		$answ = $question->getAnswers();
		$correctAnswerIdentNum = $question->getNumber() * 1000 + $answ[0] - 1; // index of correct answer;
		
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
            </render_choice>
          </response_lid>
        </presentation>
        <resprocessing>
          <outcomes>
            <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
          </outcomes>
          <respcondition continue="No">
            <conditionvar>
              <varequal respident="response1">'. $correctAnswerIdentNum .'</varequal>
            </conditionvar>
            <setvar action="Set" varname="SCORE">100</setvar>
          </respcondition>
        </resprocessing>';
//--------------------------------------------------------------------------------//

		return $txt;
	}
	
	
	// essay_question
	function writeXml_es($question)
	{
		$txt = '';
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
		<presentation>
          <material>
            <mattext texttype="text/html">'. $question->getText() .'</mattext>
          </material>
          <response_str ident="response1" rcardinality="Single">
            <render_fib>
              <response_label ident="answer1" rshuffle="No"/>
            </render_fib>
          </response_str>
        </presentation>
        <resprocessing>
          <outcomes>
            <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
          </outcomes>
          <respcondition continue="No">
            <conditionvar>
              <other/>
            </conditionvar>
          </respcondition>
        </resprocessing>';
//--------------------------------------------------------------------------------//
		return $txt;
	}
	
	
	// true_false_question
	function writeXml_tf($question)
	{
		$identNum = $question->getNumber() * 1000;
		
		$qAnsw = $question->getAnswers();
		$answIndex = 0; // true
		if ($qAnsw[0] == 0) $answIndex = 1;
		
		$correctAnswerIdentNum = $question->getNumber() * 1000 + $answIndex; // index of correct answer;
	
		$txt = '';
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
		<presentation>
          <material>
            <mattext texttype="text/html">'. $question->getText() .'</mattext>
          </material>
          <response_lid ident="response1" rcardinality="Single">
            <render_choice>
              <response_label ident="'. $identNum++ .'">
                <material>
                  <mattext texttype="text/plain">True</mattext>
                </material>
              </response_label>
              <response_label ident="'. $identNum++ .'">
                <material>
                  <mattext texttype="text/plain">False</mattext>
                </material>
              </response_label>
            </render_choice>
          </response_lid>
        </presentation>
        <resprocessing>
          <outcomes>
            <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
          </outcomes>
          <respcondition continue="No">
            <conditionvar>
              <varequal respident="response1">'. $correctAnswerIdentNum .'</varequal>
            </conditionvar>
            <setvar action="Set" varname="SCORE">100</setvar>
          </respcondition>
        </resprocessing>';
//--------------------------------------------------------------------------------//
		return $txt;
	}
	
	
	// multiple_answers_question
	function writeXml_mr($question)
	{
		$identNum = $question->getNumber() * 1000;
		
		$txt = '';
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
		<presentation>
          <material>
            <mattext texttype="text/html">'. $question->getText() .'</mattext>
          </material>
          <response_lid ident="response1" rcardinality="Multiple">
            <render_choice>';
//--------------------------------------------------------------------------------//

		foreach($question->getResponses() as $responsekey => $response)
		{
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
              <response_label ident="'. $identNum++ .'">
                <material>
                  <mattext texttype="text/plain">'. $response .'</mattext>
                </material>
              </response_label>';
//--------------------------------------------------------------------------------//
		}
		
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//			
$txt .= '
            </render_choice>
          </response_lid>
        </presentation>
        <resprocessing>
          <outcomes>
            <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
          </outcomes>
          <respcondition continue="No">
            <conditionvar>
              <and>';
//--------------------------------------------------------------------------------//

		$identNum = $question->getNumber() * 1000; // reset to starting value
		$indexNum = 1;
		
		foreach($question->getResponses() as $responsekey => $response)
		{
			if (in_array($indexNum++, $question->getAnswers()))
			{
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
				<varequal respident="response1">'. $identNum++ .'</varequal>';
//--------------------------------------------------------------------------------//
			}
			else
			{
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
				<not>
				  <varequal respident="response1">'. $identNum++ .'</varequal>
				</not>';
//--------------------------------------------------------------------------------//
			}
		}
		
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//			
$txt .= '
              </and>
            </conditionvar>
            <setvar action="Set" varname="SCORE">100</setvar>
          </respcondition>
        </resprocessing>';
//--------------------------------------------------------------------------------//
		return $txt;
	}
	
	
	// short_answer_question
	function writeXml_fb($question)
	{
		$txt = '';
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
		<presentation>
          <material>
            <mattext texttype="text/html">'. $question->getText() .'</mattext>
          </material>
          <response_str ident="response1" rcardinality="Single">
            <render_fib>
              <response_label ident="answer1" rshuffle="No"/>
            </render_fib>
          </response_str>
        </presentation>
        <resprocessing>
          <outcomes>
            <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
          </outcomes>
          <respcondition continue="No">
            <conditionvar>';
//--------------------------------------------------------------------------------//

			foreach($question->getResponses() as $responsekey => $response)
			{
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
               <varequal respident="response1">'. $response .'</varequal>';
//--------------------------------------------------------------------------------//
			}
			
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
            </conditionvar>
            <setvar action="Set" varname="SCORE">100</setvar>
          </respcondition>
        </resprocessing>';
//--------------------------------------------------------------------------------//
		return $txt;
	}
	
	//numeric question
	function writeXml_numeric($question)
	{
		$identNum = $question->getNumber() * 1000;
		
		$txt = '';
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
        <presentation>
          <material>
            <mattext texttype="text/html">'. $question->getText() .'</mattext>
          </material>
          <response_str ident="response1" rcardinality="Single">
            <render_fib fibtype="Decimal">
              <response_label ident="answer1"/>
            </render_fib>
          </response_str>
        </presentation>';
//--------------------------------------------------------------------------------//
		if (count($question->getAnswers()) == 1)
		{
			$tempAnsw = $question->getAnswers();
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .=	'
		<resprocessing>
          <outcomes>
            <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
          </outcomes>
          <respcondition continue="No">
            <conditionvar>
              <or>
                <varequal respident="response1">' . $tempAnsw[0] . '</varequal>
                <and>
                  <vargte respident="response1">' . $tempAnsw[0] . '</vargte>
                  <varlte respident="response1">' . $tempAnsw[0] . '</varlte>
                </and>
              </or>
            </conditionvar>
            <setvar action="Set" varname="SCORE">100</setvar>
          </respcondition>
        </resprocessing>';		
//--------------------------------------------------------------------------------//
		}
		else 
		{
			$tempAnsw = $question->getAnswers();
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .=	'
		<resprocessing>
          <outcomes>
            <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
          </outcomes>
          <respcondition continue="No">
            <conditionvar>
              <vargte respident="response1">' . $tempAnsw[0] . '</vargte>
              <varlte respident="response1">' . $tempAnsw[1] . '</varlte>
            </conditionvar>
            <setvar action="Set" varname="SCORE">100</setvar>
          </respcondition>
        </resprocessing>';		
//--------------------------------------------------------------------------------//
		}
		return $txt;
	}
	
	// matching_question
	//$matchingQuestionsIdArray = Array(); // (global) // list of matching question IDs that are completed.
	function writeXml_matching($question, $questionDataArray)
	{
		global $matchingQuestionsIdArray;
		
		$txt = '';
		
		$doesIdMatch = function($q) use ($question)
		{
			if ($question->getID() == $q->getID()) return true;
			else return false;
		};
		
		if (!in_array($question->getID(), $matchingQuestionsIdArray))
		{
			array_push($matchingQuestionsIdArray, $question->getID());
			$matchingTempArray = array_filter($questionDataArray, $doesIdMatch); //Array(); //array_slice($matchingQuestionsIdArray, 5, count($args)-5)
			// now use data from all questions in $matchingTempArray.
			
			$identNum = $question->getNumber() * 1000;
			
			// CREATE AND STORE THE REPEATING RESPONSES FIRST
			$rightColumnText = '';
			foreach ($matchingTempArray as $key => $rightcolumn)
			{
				$resp = $rightcolumn->getResponses();
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$rightColumnText .= '
              <response_label ident="'. $identNum++ .'">
                <material>
                  <mattext>'. $resp[0] .'</mattext>
                </material>
              </response_label>';
//--------------------------------------------------------------------------------//
			}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
		<presentation>
          <material>
            <mattext texttype="text/html">'. $question->getText() .'</mattext>
          </material>';
//--------------------------------------------------------------------------------//

			foreach ($matchingTempArray as $key => $leftcolumn)
			{
				$answ = $leftcolumn->getAnswers();
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
		  <response_lid ident="response_'. $identNum++ .'">
            <material>
              <mattext texttype="text/plain">'. $answ[0] .'</mattext>
            </material>
            <render_choice>';
//--------------------------------------------------------------------------------//
				$txt .= $rightColumnText;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
            </render_choice>
          </response_lid>';
//--------------------------------------------------------------------------------//
			}
			
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
        </presentation>
        <resprocessing>
          <outcomes>
            <decvar maxvalue="100" minvalue="0" varname="SCORE" vartype="Decimal"/>
          </outcomes>';
//--------------------------------------------------------------------------------//

			$pointsPerAnswer = 100.0/count($matchingTempArray);
			$rightIdentNum = $question->getNumber() * 1000;
			$leftIdentNum = $question->getNumber() * 1000 + count($matchingTempArray);
			foreach ($matchingTempArray as $key => $matchingset)
			{
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
          <respcondition>
            <conditionvar>
              <varequal respident="response_'. $leftIdentNum++ .'">'. $rightIdentNum++ .'</varequal>
            </conditionvar>
            <setvar varname="SCORE" action="Add">'. $pointsPerAnswer .'</setvar>
          </respcondition>';
//--------------------------------------------------------------------------------//
			}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt .= '
        </resprocessing>';
//--------------------------------------------------------------------------------//
		}
		// else do not write it again.
		
		return $txt;
	}
?>


<?php // WRITE NEW MANIFEST (unneeded)
	function writeNewManifest($manifestTitle, $fileToZipName)
	{
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
$txt = '<?xml version="1.0"?>
<manifest identifier="MANIFEST1" xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
	xmlns:imsmd="http://www.imsglobal.org/xsd/imsmd_v1p2" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd http://www.imsglobal.org/xsd/imsmd_v1p2 imsmd_v1p2p2.xsd">
	<metadata>
		<schema>IMS Content</schema>
		<schemaversion>1.1.3</schemaversion>
		<imsmd:lom>
			<imsmd:general>
				<imsmd:title>
					<imsmd:langstring xml:lang="en-US">'. $fileToZipName .' (IMS QTI export)</imsmd:langstring>
				</imsmd:title>
			</imsmd:general>
		</imsmd:lom>
	</metadata>
	<organizations default="EXAM1">
		<organization identifier="EXAM1" structure="hierarchical">
			<title>default</title>
			<item identifier="ITEM1" identifierref="RESOURCE1">
				<title>'. $fileToZipName .'</title>
			</item>
		</organization>
	</organizations>
	<resources>
		<resource identifier="RESOURCE1" type="imsqti_xmlv1p1" href="'. $fileToZipName .'.xml">
	<file href="'. $fileToZipName .'.xml" />
	</resource>
</resources>
</manifest>';
//--------------------------------------------------------------------------------//
		return $txt;
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



<!DOCTYPE HTML>
<html>
<head>
<title>Axio to Canvas (QTI 2.0) Converter</title>

<!-- Version 2.8 -->

<link rel="shortcut icon" href="https://s.ksucloud.net/k-state-static/2011/0.9.5/img/favicon.ico">

<style>
	html, body
	{
		font-family: "Calibri";
		width: 100%; 
		margin: 0; 
		padding: 0; 
		background-color: #ddd;"
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
	
	.inputDiv
	{
		text-align: center;
	}
	
	p, li
	{
		padding-left: 10px;
		padding-right: 10px;
	}
	
	form
	{
		width: 800px;
		border: 6px solid #4f2684;
		border-radius: 30px;
		
		margin-top: 20px;
		margin-left: auto;
		margin-right: auto;	
		
		background-color: #fff;
	}
	
	input[type=file], input[type=submit]
	{
		border: 6px solid white;
		background-color: #4f2684;
		color: white;
		
		border-radius: 10px;
		font-weight: bold;
		width: 250px;
	}
	input[type=file]
	{
		width: 240px;
		margin-left:5px;
		margin-bottom: 10px;
	}
	input[type=submit]
	{
		height: 35px;
	}
	input[type=file]:hover, input[type=submit]:hover
	{
		border: 6px solid #4f2684;
		background-color: #ddd;
		color: #4f2684;
	}
	
	#phpErrorBox
	{
		color: red;
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

	function resetErrorBox()
	{
		document.getElementById('phpErrorBox').innerHTML = '';
		setTimeout(function(){
			document.getElementById('phpErrorBox').innerHTML = '<p><div class="inputDiv"><span style="color:black;"><strong>Converting</strong></span></div></p>';
			setTimeout(function(){
				document.getElementById('phpErrorBox').innerHTML = '<p><div class="inputDiv"><span style="color:black;"><strong>Converting.</strong></span></div></p>';
				setTimeout(function(){
					document.getElementById('phpErrorBox').innerHTML = '<p><div class="inputDiv"><span style="color:black;"><strong>Converting..</strong></span></div></p>';
					setTimeout(function(){
						document.getElementById('phpErrorBox').innerHTML = '<p><div class="inputDiv"><span style="color:black;"><strong>Converting...</strong></span></div></p>';
						setTimeout(function(){
							document.getElementById('phpErrorBox').innerHTML = '<p><div class="inputDiv"><span style="color:black;"><strong>Please check your <i>Downloads</i> folder. Your file should appear there shortly.</strong></span></div></p>';
						}, 1000);
					}, 1000);
				}, 1000);
			}, 1000);
		}, 1000);
	}

</script>

</head>
<body>
	<h1 class="header">Axio to Canvas (QTI 2.0) Converter</h1>
	<div id="phpErrorBox">
		<?php
			if ($error != ""){
				echo '<p><div class="inputDiv">'. $error .'</div></p>';
				echo '<p><div class="inputDiv">Current PHP version'. phpversion() .'</div></p>';
			}
		?>
	</div>
	<form enctype="multipart/form-data" name="zips" method="post">
		<div class="inputDiv">
			<p>
				Select the Axio .CSV file(s) you wish to convert into the Canvas QTI format.
			</p>
			<p>
				<a target="_blank" href="./example_qti_files.zip">(.zip of example files)</a>
			</p>
			<p>
				<input type='file' name='filestozip[]' id='filetozip' multiple />
				<br>
				<input type='submit' name='createzip' value='Convert' onclick="resetErrorBox();" />
			</p>
		</div>
		<div class="toolInstructions">
			<p>
				<strong>Single File:</strong> If you only convert a single file at a time, it will be downloaded as a single .zip folder with the same name as the file you uploaded (check your <i>Downloads</i> folder). <strong>Do not unzip this folder</strong>.
			</p>
			<p>
				<strong>Multiple Files:</strong> If you convert multiple assignments at once, they will be zipped into a folder labeled "<i>BATCH_OF_#_ASSIGNMENTS</i>" before being downloaded. You must unzip <strong>only</strong> the outer "<i>BATCH_OF_#_ASSIGNMENTS</i>" folder before continuing to the next step.
			</p>
			<p>
				<strong>Important: </strong> Do not unzip the individually-named assignment folders inside the "<i>BATCH_OF_#_ASSIGNMENTS</i>" folder. They must remain in .zip format to be imported into Canvas.
			</p>
			<ol>
				<li>
					To import the resulting QTI file into Canvas, open your course Settings using the sidebar on the bottom left-hand side of your course page.
				</li>
				<li>
					Click <i>Import Content into this Course</i>, and select <i>QTI .zip file</i> under <i>Content Type</i>. 
				</li>
				<li>
					Click <i>Choose File</i> and select one of the converted files you just created (usually saved to your <i>Downloads</i> folder by default). Click <i>Import</i>, and once the job is finished running, your content should show up under the <i>Quizzes</i> tab.
				</li>
			</ol>
		</div>
	</form>
	<div style="text-align:center; font-size: 0.8em;">&copy; Dane Miller & Alexandre Adams, ITAC Help Desk Developers. K-State University 2014</div>
</body>