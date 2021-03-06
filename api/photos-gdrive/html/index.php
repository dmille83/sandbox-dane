<?php
// PHP code to enable CORS: //enable-cors.org/server_php.html
header("Access-Control-Allow-Origin: *"); // all domains
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
?>

<!DOCTYPE HTML>
<html>
<head>

<title>API - Google Drive Photo Gallery View</title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="./css/styles.css?v=1">

<script src="//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="./js/mobile_device.js?v=0"></script>
<script src="./js/swipe.js?v=1"></script>
<script src="./js/photos.js?v=1"></script>

</head>
<body>

<?php
/***
	TITLE:	LOAD FILES FROM A GOOGLE DRIVE FOLDER AS A PHOTO ALBUM
	USES: 	GOOGLE DRIVE + PHP
	SOURCE:	http://htmlparsing.com/php.html
	SOURCE:	http://stackoverflow.com/questions/20681974/how-to-embed-a-google-drive-folder-in-a-website
	SOURCE:	http://www.publicalbum.org/blog/embedding-google-photos-albums
	PROS:	easy to build, dynamically updates with the folder
	CONS:	alphabetical with no custom sorting (yet)
	
	***
	
	WRAPPER OPTIONS:

	<script src="http://cdn.jsdelivr.net/npm/publicalbum@latest/dist/pa-embed-player.min.js" async></script>
	<div class="pa-embed-player" style="width:100%; max-width:800px; height:480px; display:none;"
		data-link=""
		data-title="Little Apple Ren Fest"
		data-description="Album by Little Apple Ren Fest">
		<?php loadPhotosGDrive('1XtoXy34BvHQZGtFGuC7QQARLcz27EIws'); ?>
		<?php loadPhotosGDrive('17n-iswLPlotLuCsP2t70a7KDK2Indi2m'); ?>
	</div>
	
	<div class="photo-container" title="click on a photo to expand">
		<?php loadPhotosGDrive('1XtoXy34BvHQZGtFGuC7QQARLcz27EIws'); ?>
		<?php loadPhotosGDrive('17n-iswLPlotLuCsP2t70a7KDK2Indi2m'); ?>
	</div>

***/

if (empty($_GET['id'])) {
?>

<style>td { padding: 0 10px 0 10px; }</style>
<p>Please provide an "id" field in the URL query string, where "id" equals the alphanumeric id found at the end of the URL string of a public Google Drive folder.</p>
<table border=1>
<tr><td>Example Folder URL</td><td>//drive.google.com/drive/folders/&lt;ID&gt;</td></tr>
<tr><td>Example API Query</td><td><span id="id-url"></span>?id=&lt;ID&gt;</td></tr>
</table>
<script>
var x = location.protocol + '//' + location.host + location.pathname;
document.getElementById("id-url").innerHTML = x;
</script>

<?php
} else {
	
	// CONSTRUCT A PHOTO GALLERY PAGE ELEMENT
	// READ THE PUBLIC GRID PAGE AND PARSE THE IMAGE URLS
	// WHERE $array CONTAINS THE ID#S IN THE GOOGLE DRIVE FOLDER URLS
	
	echo '<div class="photo-container" title="click on a photo to expand">';
	$array = $_GET['id'];
	$array = explode(",", $array);
	for ($i = 0; $i < count($array); $i++) {
		$id = $array[$i];
		//echo $id . '<br/>';
		$id = preg_replace("/[^a-zA-Z0-9\-]+/", "", $id);
		$url = 'https://drive.google.com/embeddedfolderview?id=' . $id . '#grid';
		$page = file_get_contents($url);
		$dom = new DOMDocument;
		libxml_use_internal_errors(true);
		$dom->loadHTML($page);
		foreach($dom->getElementsByTagName('img') as $link) {
			$img_src = $link->getAttribute('src');
			$img_title = $link->getAttribute('title');
			if (strpos($img_src, '/type/image/') == false) {
				echo '<img data-src="' . str_replace('=s190', '=s1080', $img_src) . '" title="' . $img_title . '" src="" alt="">';
			}
		}
	}
	echo '</div>';
	
}

?>

<!-- Photos expanded browsing window -->
<div id="photo-container-expand">
	<div id="photo-frame">
		<div id="photo-title"></div>
		<img id="photo-expanded">
	</div>
	<a class="nav-arrow nav-arrow-left" href="javascript:void(0);" title="Previous Photo" onclick="photoNav(-1);"></a>
	<a class="nav-arrow nav-arrow-right" href="javascript:void(0);" title="Next Photo" onclick="photoNav(1);"></a>
	<a class="nav-exit" href="javascript:void(0);" title="Minimize" onclick="photoExpand(null);">X</a>
</div>

<script>

registerPhotos();

</script>

</body>
</html>