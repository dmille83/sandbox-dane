// load a .js library file after page has loaded
function loadJS(path) {
	var script = document.createElement('script');
	script.onload = function () {
		//do stuff with the script
	};
	script.src = path;
	document.head.appendChild(script); //or something of the likes
}