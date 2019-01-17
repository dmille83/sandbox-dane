<!DOCTYPE html>
<head>

<!--
	THIS IS THE PAGE WHERE THE PHP RUNS TO UPDATE THE .txt FILE THAT CONTAINS THE MANAGER'S MESSAGE.
	BE VERY CAREFUL TO SANITIZE YOUR USER INPUTS (REMOVE ANY SPECIAL CHARACTERS OR CONVERT THEM INTO HTML CODES FOR SPECIAL CHARACTERS), OTHERWISE SOMEONE COULD TYPE JAVASCRIPT CODE INTO YOUR PAGE AND HACK INTO THE STATUS BOARD.
-->


<link rel="stylesheet" href="helpdesk_iframecontroller.css">
<title>K-State - ITAC Online Status Board - Messageboard Manager</title>

<style>
	h1, h2
	{
		display: inline;
	}
</style>

</head>
<body>

<a target="_blank" href="http://pinger-ksu.rhcloud.com">Back to Status Board &#8617;</a>
<br><br>

<?php


$lineCounter = 1;
function addNewlineNumbers(){ 
	global $lineCounter;

	$newlineNum = '<br>' . $lineCounter . '. ';
	$lineCounter++;
	return $newlineNum;
	//return '<br>' . ($lineCounter++) . '. ';
}

// SOURCE:  See http://www.w3schools.com/php/php_forms.asp for the tutorial.
echo "<h1>ITAC Messageboard Manager</h1><br>";

if ( htmlspecialchars($_POST["password"]) == "helpdesk" ) {

	echo '<br><strong>Message From Your Manager: </strong>';
	
	//echo '<br><br><div style="border: 1px solid black; padding: 10px;">' . preg_replace('/(\n)/', '<br>', htmlspecialchars($_POST["message"])) . '</div><br>';
	echo '<br><br><div style="border: 1px solid black; padding: 10px;">' . preg_replace('/(\n)/', '<br>', $_POST["message"]) . '</div><br>';
	//echo '<br><br><div style="border: 1px solid black; padding: 10px;">'. $lineCounter++ . '. ' . preg_replace('/(\n)/', addNewlineNumbers(), $_POST["message"]) . '</div><br>';
	//echo '<br><br><div style="border: 1px solid black; padding: 10px;">'. $lineCounter++ . '. ' . preg_replace('/(\n)/', function(){ global $lineCounter; return '<br>' . ($lineCounter++) . '. '; }, $_POST["message"]) . '</div><br>';
	
	echo "<font color='gray'>Message contents have been changed and will be shown on the main display screen the next time it refreshes (within 3 minutes).</font><br><br>";

	// write Manager Message to file
	$myFile = "../upload/managerMessage.txt"; //the file you want to open
	$fh = fopen($myFile, 'w') or die("can't open file"); //opening the file
	//$data = htmlspecialchars($_POST["message"]); //data you want to write
	$data = $_POST["message"]; //data you want to write
	fwrite($fh, $data); //writing the data
	fclose($fh); //close the file

	echo "<form method='post' action='index.php'><button type='submit'>Back</button></form>";

} else {

	echo "<font color='red'>Please go back and re-enter the correct password in order to save your changes. We apologize for any inconvenience.</font><br><br>";

	echo "<input type='button' onclick='history.back();' value='Back'>";

}

?>

</body>