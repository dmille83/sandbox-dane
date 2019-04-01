<?php
// PHP code to enable CORS: https://enable-cors.org/server_php.html
header("Access-Control-Allow-Origin: *"); // all domains
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
?>

<?php

$error = "";
$data = [];

if (empty($_GET['id'])) {
	
	$error = 'Please provide an id field in the URL query string, where id equals the alphanumeric id found at the end of the URL string of a publicly-visible Google Drive folder';
	
} else {
	
	// CONSTRUCT A PHOTO GALLERY PAGE ELEMENT
	// READ THE PUBLIC GRID PAGE AND PARSE THE IMAGE URLS
	// WHERE $folder_ids CONTAINS THE ID#S IN THE GOOGLE DRIVE FOLDER URLS
	
	$folder_ids = $_GET['id'];
	$folder_ids = explode(",", $folder_ids);
	for ($i = 0; $i < count($folder_ids); $i++) {
		$id = $folder_ids[$i];
		$id = preg_replace("/[^a-zA-Z0-9\-]+/", "", $id);
		$url = '//drive.google.com/embeddedfolderview?id=' . $id . '#grid';
		$page = file_get_contents($url);
		$dom = new DOMDocument;
		libxml_use_internal_errors(true);
		$dom->loadHTML($page);
		foreach($dom->getElementsByTagName('img') as $link) {
			$img_src = $link->getAttribute('src');
			//$img_title = $link->getAttribute('title');
			if (strpos($img_src, '/type/image/') == false) {
				$data[] = str_replace('=s190', '=s1080', $img_src);
			}
		}
	}
	
}

$json = (object) [
	'error' => $error,
	'count' => count($data),
	'data' => $data
];
echo json_encode($json);

?>