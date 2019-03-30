<?php
// PHP code to enable CORS: https://enable-cors.org/server_php.html
header("Access-Control-Allow-Origin: *"); // all domains
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
?>

<?php

$error = "";
$count = 0;
$data = "";

if (empty($_GET['id'])) {
	
	$error = 'Please provide an id field in the URL query string, where id equals the alphanumeric id found at the end of the URL string of a publicly-visible Google Drive folder';
	
} else {
	
	// CONSTRUCT A PHOTO GALLERY PAGE ELEMENT
	// READ THE PUBLIC GRID PAGE AND PARSE THE IMAGE URLS
	// WHERE $array CONTAINS THE ID#S IN THE GOOGLE DRIVE FOLDER URLS
	
	$array = $_GET['id'];
	$array = explode(",", $array);
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
			//$img_title = $link->getAttribute('title');
			if (strpos($img_src, '/type/image/') == false) {
				if ($count > 0) $data .= ',';
				$data .= '"' . str_replace('=s190', '=s1080', $img_src) . '"';
				$count = $count + 1;
			}
		}
	}
	
}

//echo 'images: { error: "' . $error . '", count: ' . $count . ', data: [' . $data . '] }';

$json->error = $error;
$json->count = $count;
$json->data = $data;
echo json_encode($json);

?>