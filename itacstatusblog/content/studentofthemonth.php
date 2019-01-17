<!--
<link rel="stylesheet" href="../stylesheet/contentcontrol.css">
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
-->

<script>
	$(function(){
		$("#studentNameHeader").load("./upload/studentofthemonthname.txt");
		$("#studentNameHeader2").load("./upload/studentofthemonthname2.txt");
	});

	function swapImages()
	{
		//$(document).ready(function() 
		//{
			//alert("!");
			studentSwapInterval = setInterval(function(){ // DEFINED IN MAIN LOADER SCRIPT.
				$(".hideableFrame").toggleClass("hiddenSecondStudentPhoto");
			},6000);
		//}
	}

	$(document).ready(function()
	{
		//$("#studentphotoID01").src = ($("#studentphotoID01").src + '?_=' + (new Date()).getTime());
		//$("#studentphotoID02").src = ($("#studentphotoID02").src + '?_=' + (new Date()).getTime());

		//alert("reloading images");
		var images = document.getElementsByTagName("img"); //document.images;
		for (var i=0; i<images.length; i++) {
			images[i].src = (images[i].src + '?_=' + (new Date()).getTime());
			//images[i].src = images[i].src.replace(/\btime=[^&]*/, 'time=' + new Date().getTime());
		}
	});
</script>



<!--
http://php.about.com/od/advancedphp/ss/rename_upload.htm
-->

<div class="imageuploadouterwrapper">
	<h1 class="header">Student of the Month</h1>
	<div class="imageuploadinnerwrapper">
		<h2 id="studentNameHeader" class="hideableFrame"></h2>
		<h2 id="studentNameHeader2" class="hideableFrame hiddenSecondStudentPhoto"></h2>
		<br>
	</div>
</div>

<div class="hideableFrame imageuploadimagewrapper">
	<img id="studentphotoID01" class="studentphoto" src="./upload/studentofthemonth.jpg" alt="Student of the Month Photo" onError="this.onerror=null;this.src='upload/default.jpg';">
</div>
<div class="hideableFrame hiddenSecondStudentPhoto imageuploadimagewrapper">
	<img id="studentphotoID02" class="studentphoto" src="./upload/studentofthemonth2.jpg" alt="Student of the Month Photo" onError="this.onerror=null;this.src='upload/default.jpg';">
</div>

<!-- 
document.write('?_=' + (new Date()).getTime()); 
-->


<?php
$myFile = "../upload/bool_twostudents.txt"; //the file you want to open
$fh = fopen($myFile, 'r') or die("can't open bool variable"); //opening the file
$data = htmlspecialchars(fread($fh, filesize($myFile))); //read in data from the file
//echo $data; // show the data on the page
fclose($fh); //close the file
?>
<?php
	//if (htmlspecialchars($data) == '2') echo('<script> swapImages(); </script>');
?>
