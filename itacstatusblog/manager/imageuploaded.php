<head>

<!--
	THIS IS THE PAGE WHERE THE PHP RUNS TO UPDATE THE .txt FILE THAT CONTAINS THE STUDENT OF THE MONTH'S NAME, AND UPLOADS THE IMAGE FILE THAT WILL REPLACE studentofthemonth.jpg
	BE VERY CAREFUL TO SANITIZE YOUR USER INPUTS (REMOVE ANY SPECIAL CHARACTERS OR CONVERT THEM INTO HTML CODES FOR SPECIAL CHARACTERS), OTHERWISE SOMEONE COULD TYPE JAVASCRIPT CODE INTO YOUR PAGE AND HACK INTO THE STATUS BOARD.
	DO NOT ALLOW ANYTHING TO BE UPLOADED OTHER THAN IMAGE FILES, ESPECIALLY IF THEY CONTAIN PHP OR JAVASCRIPT, OR ARE OF TYPE .exe
-->

<title>K-State - ITAC Online Status Board - Image Uploader</title>

<style>
	.errortext
	{
		color:red;
	}
	.greytext
	{
		color:gray;
	}
</style>

</head>
<body>

<a target="_blank" href="http://pinger-ksu.rhcloud.com">Back to Status Board &#8617;</a>

<h1>Image Uploader</h1>
<?php 


//This function separates the extension from the rest of the file name and returns it.
// Source:  http://php.about.com/od/advancedphp/ss/rename_upload_2.htm
function findexts ($filename) 
{ 
	$filename = strtolower($filename) ; 
	$exts = split("[/\\.]", $filename) ; 
	$n = count($exts)-1; 

	// Write any scripts that check for unwanted extensions here!
	if ($n > 1) // Check for evil double-barreled extensions like "yourfile.php.jpg" or "yourfile.exe.jpg" and eliminate extensions you don't allow.
	{
		echo "Double-Barreled file extension(s) are not allowed.<br>";
		$ok=0;
	}
	$exts = $exts[$n]; 
	return $exts; 
}


if ( htmlspecialchars($_POST["password"]) == "helpdesk" ) 
{

	// STUDENT PHOTO 1.

	// Source: http://php.about.com/od/advancedphp/ss/php_file_upload.htm
	$target = "../upload/"; 
	$uploaded = $_FILES['uploaded'];
	$filename = basename( $_FILES['uploaded']['name']) ;
	$filesize = $_FILES['uploaded']['size'];
	//$target = $target . basename( $_FILES['uploaded']['name']) ; 
	$target = $target . "studentofthemonth.jpg";
	$ok=1; // 1 = good, 0 = bad, -1 = bad and no final failure message please.


	// For debugging...
	//echo "Target: ". $target ."<br>";
	//echo "File name: ". $filename ."<br>";	
	//echo "File size: ". $filesize ."<br>";


	echo "<span class='errortext'>"; // Start error message format.
	// Check to see if any file was selected.
	if ($filesize <= 0) // if ($uploaded_size <= 0) // "$uploaded_size" does not work? Do the other "name_blarg" work as advertised?
	{
		echo "Please choose a file to upload.<br>"; // ??? Post an error back to previous page to display this error there? Do the same for wrong passwords?
		$ok=-1;
	}
	else // If a file was actually uploaded, check for other conditions.
	{
		
		// Source:  http://stackoverflow.com/questions/10662915/check-whether-a-file-is-an-image-or-not
		$info = exif_imagetype ($_FILES['uploaded']['tmp_name']);
		if ($info == FALSE)
		{
			echo "Unable to determine image type of uploaded file.<br>";
			$ok=0;
		}

		// Source: http://stackoverflow.com/questions/9314164/php-uploading-files-image-only-checking
		$info = getimagesize($_FILES['uploaded']['tmp_name']);
		if ($info == FALSE)
		{
			//echo "Unable to determine image size of uploaded file.<br>";
			$ok=0;
		}	

		// This is our size condition.
		if ($_FILES['uploaded']['size'] > 350000)
		{
			echo "Your file is too large.<br>"; 
			$ok=0;
		}

		/* // "$_FILES['uploaded'][type]" THESE ARE ALL BROKEN APPARENTLY. :(
		// This is our limit file type condition.
		if ($_FILES['uploaded'][type] =="text/php")
		{
			echo "No PHP files.<br>";
			$ok=0;
		} 

		// This is our limit file type condition.
		if ($_FILES['uploaded'][type] =="text/exe")
		{
			echo "No executable files.<br>";
			$ok=0;
		} 

		 // Broken?
		// This is our limit file image type condition.
		if ($_FILES['uploaded'][type] !="text/jpg")
		{
			echo "Please upload images in JPEG format.<br>";
			$ok=0;
		}
		*/

		//This applies the function to our file  
		$ext = findexts ($_FILES['uploaded']['name']) ; 
		//$target = $target ."studentofthemonth.". $ext;
		if ($ext != "jpg")
		{
			echo "Please upload images in JPEG format.<br>";
			$ok=0;
		}

	}
	echo "</span>";


	// Here we check that $ok was not set to 0 by an error.
	if ($ok==0) 
	{ 
		echo "<span class='errortext'>Sorry, your file was not uploaded.<br></span>"; 
	} 
	else if ($ok==-1)
	{
		// Do not print a final error message.
	}
	else
	{
		//If everything is ok we try to upload it.
		if(move_uploaded_file($_FILES['uploaded']['tmp_name'], $target)) 
		{
			//echo "The file &ldquo;". basename( $_FILES['uploadedfile']['tmp_name']). "&rdquo; has been uploaded as ". $target .".<br>";
			//echo "The file &ldquo;". $_FILES['uploaded']['tmp_name']. "&rdquo; has been uploaded as ". $target .".<br><br>";
			echo "<span class='greytext'>The file <i>". $filename ."</i> (". $filesize ."B) has been uploaded under the name <i>". $target ."</i>.<br></span>";
		} 
		else
		{
			echo "<span class='errortext'>Sorry, there was a problem uploading your file.<br></span>";
		}
	}

	//========================================================================

	// STUDENT PHOTO 2.

	// Source: http://php.about.com/od/advancedphp/ss/php_file_upload.htm
	$target2 = "../upload/"; 
	$uploaded2 = $_FILES['uploaded2'];
	$filename2 = basename( $_FILES['uploaded2']['name']) ;
	$filesize2 = $_FILES['uploaded2']['size'];
	//$target2 = $target2 . basename( $_FILES['uploaded2']['name']) ; 
	$target2 = $target2 . "studentofthemonth2.jpg";
	$ok2=1; // 1 = good, 0 = bad, -1 = bad and no final failure message please.


	// For debugging...
	//echo "Target: ". $target2 ."<br>";
	//echo "File name: ". $filename2 ."<br>";	
	//echo "File size: ". $filesize2 ."<br>";


	echo "<span class='errortext'>"; // Start error message format.
	// Check to see if any file was selected.
	if ($filesize2 <= 0) // if ($uploaded2_size <= 0) // "$uploaded2_size" does not work? Do the other "name_blarg" work as advertised?
	{
		echo "Please choose a file to upload.<br>"; // ??? Post an error back to previous page to display this error there? Do the same for wrong passwords?
		$ok2=-1;
	}
	else // If a file was actually uploaded2, check for other conditions.
	{
		// Source:  http://stackoverflow.com/questions/10662915/check-whether-a-file-is-an-image-or-not
		$info2 = exif_imagetype ($_FILES['uploaded2']['tmp_name']);
		if ($info2 == FALSE)
		{
			echo "Unable to determine image type of uploaded file.<br>";
			$ok2=0;
		}

		// Source: http://stackoverflow.com/questions/9314164/php-uploading-files-image-only-checking
		$info2 = getimagesize($_FILES['uploaded2']['tmp_name']);
		if ($info2 == FALSE)
		{
			//echo "Unable to determine image size of uploaded file.<br>";
			$ok2=0;
		}	

		// This is our size condition.
		if ($_FILES['uploaded2']['size'] > 350000)
		{
			echo "Your file is too large.<br>"; 
			$ok=0;
		}

		//This applies the function to our file  
		$ext2 = findexts ($_FILES['uploaded2']['name']) ; 
		//$target2 = $target2 ."studentofthemonth2.". $ext;
		if ($ext2 != "jpg")
		{
			echo "Please upload images in JPEG format.<br>";
			$ok2=0;
		}

	}
	echo "</span>";


	// Here we check that $ok was not set to 0 by an error.
	if ($ok2==0) 
	{ 
		echo "<span class='errortext'>Sorry, your file was not uploaded.<br></span>"; 
	} 
	else if ($ok2==-1)
	{
		// Do not print a final error message.
	}
	else
	{
		//If everything is ok we try to upload it.
		if(move_uploaded_file($_FILES['uploaded2']['tmp_name'], $target2)) 
		{
			//echo "The file &ldquo;". basename( $_FILES['uploaded2file']['tmp_name']). "&rdquo; has been uploaded as ". $target .".<br>";
			//echo "The file &ldquo;". $_FILES['uploaded2']['tmp_name']. "&rdquo; has been uploaded as ". $target .".<br><br>";
			echo "<span class='greytext'>The file <i>". $filename2 ."</i> (". $filesize2 ."B) has been uploaded under the name <i>". $target2 ."</i>.<br></span>";
		} 
		else
		{
			echo "<span class='errortext'>Sorry, there was a problem uploading your file.<br></span>";
		}
	}

	//========================================================================

	// STUDENT NAME AND COUNT.
	$myFile = "../upload/studentofthemonthname.txt"; //the file you want to open
	$fh = fopen($myFile, 'w') or die("can't open file"); //opening the file
	$data = htmlspecialchars($_POST["studentname"]); //data you want to write
	fwrite($fh, $data); //writing the data
	fclose($fh); //close the file
	echo "<span class='greytext'>Student of the Month <i>name</i> has been changed to <i>&ldquo;". $data ."&rdquo;</i>.<br></span>";

	$myFile1 = "../upload/studentofthemonthname2.txt"; //the file you want to open
	$fh1 = fopen($myFile1, 'w') or die("can't open file"); //opening the file
	$data1 = htmlspecialchars($_POST["studentname2"]); //data you want to write
	fwrite($fh1, $data1); //writing the data
	fclose($fh1); //close the file
	echo "<span class='greytext'>Student of the Month 2 <i>name</i> has been changed to <i>&ldquo;". $data1 ."&rdquo;</i>.<br></span>";

	// VARIABLE TO SHOW SECOND STUDENT.
	$myFile2 = "../upload/bool_twostudents.txt"; //the file you want to open
	$fh2 = fopen($myFile2, 'w') or die("can't open file"); //opening the file
	$data2 = htmlspecialchars($_POST["twostudents"]); //data you want to write
	fwrite($fh2, $data2); //writing the data
	fclose($fh2); //close the file

	if ($data2 == "2") echo "<span class='greytext'>There will be <i>&ldquo;2&rdquo;</i> students of the month.<br></span>";
	else echo "<span class='greytext'>There will be <i>&ldquo;1&rdquo;</i> student of the month.<br></span>";

	//echo "<form method='post' action='imageuploader.php'><button type='submit'>Back</button></form>";
}
else
{
	echo "<font color='red'>Please go back and re-enter the correct password in order to save your changes. We apologize for any inconvenience.</font><br><br>";
	//echo "<input type='button' onclick='history.back();' value='Back'>";
}
?>

<br>
<form method='post' action='imageuploader.php'><button type='submit'>Back</button></form>
</body>