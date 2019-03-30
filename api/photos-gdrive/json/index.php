<?php
// PHP code to enable CORS: https://enable-cors.org/server_php.html
header("Access-Control-Allow-Origin: *"); // all domains
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
?>

<?php

if (empty($_GET['id'])) {
	
	//include('../error.html');
	echo '{ data: [], error: "Please provide an id field in the URL query string, where id equals the alphanumeric id found at the end of the URL string of a publicly-visible Google Drive folder" }';
	
} else {
	
	// CONSTRUCT A PHOTO GALLERY PAGE ELEMENT
	// READ THE PUBLIC GRID PAGE AND PARSE THE IMAGE URLS
	// WHERE $array CONTAINS THE ID#S IN THE GOOGLE DRIVE FOLDER URLS
	
	//echo 'images: { data: [ ';
	//echo '[';
	echo '{ data: [';
	$array = $_GET['id'];
	$array = explode(",", $array);
	$total = 0;
	for ($i = 0; $i < count($array); $i++) {
		$id = $array[$i];
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
				//echo '<img data-src="' . str_replace('=s190', '=s1080', $img_src) . '" title="' . $img_title . '" src="" alt="">';
				if ($total > 0) echo ',';
				echo '"' . str_replace('=s190', '=s1080', $img_src) . '"';
				$total = $total + 1;
			}
		}
	}
	//echo ' ], count: ' . $total . ' }';
	//echo ']';
	echo '] }';
	
}

?>