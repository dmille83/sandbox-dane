<?php
	require "login_template.php";

	$myFile = "../upload/studentofthemonthname.txt"; //the file you want to open
	$fh = fopen($myFile, 'r') or die("can't open file"); //opening the file
	$data = htmlspecialchars(fread($fh, filesize($myFile))); //read in data from the file
	fclose($fh); //close the file

	$myFile1 = "../upload/studentofthemonthname2.txt"; //the file you want to open
	$fh1 = fopen($myFile1, 'r') or die("can't open file"); //opening the file
	$data1 = htmlspecialchars(fread($fh1, filesize($myFile1))); //read in data from the file
	fclose($fh1); //close the file

	$myFile2 = "../upload/bool_twostudents.txt"; //the file you want to open
	$fh2 = fopen($myFile2, 'r') or die("can't open file 2"); //opening the file
	$data2 = htmlspecialchars(fread($fh2, filesize($myFile2))); //read in data from the file
	fclose($fh2); //close the file

	$page_content_html = '
		<form enctype="multipart/form-data" action="imageuploaded.php" method="POST">
			<table>
			<tr>
				<td>
					<h2>' . htmlspecialchars($data) . '</h2>
					<br>
					<br>
					Current photo:
				</td>

				<td class="secondStudentTD">
					<h2>' . htmlspecialchars($data1). '</h2>
					<br>
					<br>
					Current photo:
				</td>
			</tr>
			<tr>
				<td>
					<img src="../upload/studentofthemonth.jpg" alt="Student of the Month Photo" style="color:silver; border:3px dashed black;">
				</td>

				<td class="secondStudentTD">
					<img src="../upload/studentofthemonth2.jpg" alt="Student of the Month Photo" style="color:silver; border:3px dashed black;">
				</td>
			</tr>
			<tr>
				<td>
					Please choose the new image file (JPEG): <br>
					<input name="uploaded" type="file" /><br>
					<br>
					Enter student\'s name: <br>
					<input name="studentname" type="text" size="25" placeholder="student name" value="'.htmlspecialchars($data). '" />
				</td>

				<td class="secondStudentTD">
					Please choose the new image file (JPEG): <br>
					<input name="uploaded2" type="file" /><br>
					<br>
					Enter second student\'s name: <br>
					<input name="studentname2" type="text" size="25" placeholder="student name" value="' . htmlspecialchars($data1) . '" />
				</td>

			</tr>
			</table>

			<br>
			<br>';

			//echo(htmlspecialchars($data2));
			if (htmlspecialchars($data2) == '2')
			{
				$page_content_html .= '<input type="checkbox" name="twostudents" value="2" onClick="showHideSecond();" checked> Two Students Of The Month';
			}
			else
			{
				$page_content_html .= '<input type="checkbox" name="twostudents" value="2" onClick="showHideSecond();"> Two Students Of The Month';
				$page_content_html .= '<script> showHideSecond(); </script>';
			}

			$page_content_html .= '
			<br>
			<br>
			<input type="submit" value="Save">
		</form>';

	// run the application
	$application = new OneFileLoginApplication($page_content_html);
?>
