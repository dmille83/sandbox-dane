<!DOCTYPE html>
<head>

<!--
	THIS IS THE PAGE WHERE A MANAGER CAN UPDATE THE MARQUEE MESSAGE AT THE BOTTOM OF THE STATUS BOARD.
	BE VERY CAREFUL TO SANITIZE YOUR USER INPUTS (REMOVE ANY SPECIAL CHARACTERS OR CONVERT THEM INTO HTML CODES FOR SPECIAL CHARACTERS), OTHERWISE SOMEONE COULD TYPE JAVASCRIPT CODE INTO YOUR PAGE AND HACK INTO THE STATUS BOARD.
-->

<!--
	Prevent Cache:
	http://davidwalsh.name/prevent-cache
-->

<link rel="stylesheet" href="../stylesheets/helpdesk_iframecontroller.css">
<title>K-State - ITAC Online Status Board - Messageboard Manager</title>

<?php
$myFile = "../upload/managerMessage.txt"; //the file you want to open
$fh = fopen($myFile, 'r') or die("can't open file"); //opening the file
//$data = htmlspecialchars(fread($fh, filesize($myFile))); //read in data from the file
$MessageData = fread($fh, filesize($myFile)); //read in data from the file
fclose($fh); //close the file
?>

<style>
	.managerouterwrapper
	{
		width:900px;
		padding:10px;
		border:3px solid black;
	}
	h1, h2
	{
		display: inline;
	}
</style>

</head>
<body>

<!--
	ENCRYPT THIS!!!
-->

<a target="_blank" href="http://pinger-ksu.rhcloud.com">Back to Status Board &#8617;</a>

<div class="managerouterwrapper">
	<h1 class="header">ITAC Messageboard Manager</h1>
	<br>
	<a href="index.php">Messageboard Manager</a>&nbsp;&nbsp;&nbsp;&nbsp;
	<a href="imageuploader.php">Student of the Month</a>
	<br>
	<br>
	<form action="managerPost.php" method="post">
		<strong>Message From Your Manager: </strong>
		<br>(put each separate message on a new line)
		<br>
		<textarea name="message" style="width: 890px; height: 300px; resize:none;"><?php echo htmlspecialchars($MessageData); ?></textarea>
		<br>
	</form>
</div>

</body>
</html>
