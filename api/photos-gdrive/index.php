<?php

// PHP code to enable CORS
// SOURCE:  https://enable-cors.org/server_php.html
header("Access-Control-Allow-Origin: *"); // all domains
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
//header('Content-Type: text/html');
header('Content-type: application/json');

if (!empty($_GET['id'])) {
	loadFolder($_GET['id']);
}
else {
	echo 'please provide the id of a publically-shared Google Drive folder';
}

function loadFolder($array) {
	echo 'images: { data: [ ';
	$array = explode(",", $array);
	for ($i = 0; $i < count($array); $i++) {
		$id = $array[$i];
		$id = preg_replace("/[^a-zA-Z0-9\-]+/", "", $id);
		$url = 'https://drive.google.com/embeddedfolderview?id=' . $id . '#grid';
		$page = file_get_contents($url);
		$dom = new DOMDocument;
		libxml_use_internal_errors(true);
		$dom->loadHTML($page);
		$img = 0;
		foreach($dom->getElementsByTagName('img') as $link) {
			$img_src = $link->getAttribute('src');
			$img_title = $link->getAttribute('title');
			if (strpos($img_src, '/type/image/') == false) {
				//echo '<img data-src="' . str_replace('=s190', '=s1080', $img_src) . '" title="' . $img_title . '" src="" alt="">';
				if ($img > 0) echo ',';
				echo $img . ":'" . str_replace('=s190', '=s1080', $img_src) . "'";
				$img = $img + 1;
			}
		}
	}
	echo ' ] }';
}

?>