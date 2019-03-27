function detectswipe(el,func) {
	// SOURCE:	https://stackoverflow.com/questions/15084675/how-to-implement-swipe-gestures-for-mobile-devices
	swipe_det = new Object();
	swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
	
	var min_x = 60;		//min x swipe for horizontal swipe
	var min_y = 120;	//min y swipe for vertical swipe
	
	function detectswipexy() {
		var x = swipe_det.eX - swipe_det.sX;
		var y = swipe_det.eY - swipe_det.sY;
		//if (Math.abs(x) < min_x) x = 0;
		//if (Math.abs(y) < min_y) y = 0;
		if (Math.abs(x) > Math.abs(y)) y = 0;
		else x = 0;
		var v = new Object();
		v.x = x;
		v.y = y;
		return v;
	}
	
	// Events
	var direc = "";
	el.addEventListener('touchstart',function(e){
		var t = e.touches[0];
		swipe_det.sX = t.screenX; 
		swipe_det.sY = t.screenY;
		swipe_det.eX = t.screenX;
		swipe_det.eY = t.screenY;
	},false);
	el.addEventListener('touchmove',function(e){
		e.preventDefault();
		var t = e.touches[0];
		swipe_det.eX = t.screenX;
		swipe_det.eY = t.screenY;
		
		// Animated swipe
		var v = detectswipexy();
		
		// Photo swipe down
		if (v.y > 0) { el.style.top = v.y + "px"; el.style.backgroundColor = "white"; }
		else { el.style.top = ""; el.style.backgroundColor = ""; }
		
		// Photo nav left/right
		if (v.x != 0) document.getElementById("photo-frame").style.left = v.x + "px";
		else document.getElementById("photo-frame").style.left = "";
		
	},false);
	el.addEventListener('touchend',function(e){
		
		// Animated swipe
		el.style.top = "";
		el.style.backgroundColor = "";
		
		// Photo nav left/right
		document.getElementById("photo-frame").style.left = "";
		document.getElementById("photo-frame").style.right = "";
		
		// Vector
		var v = detectswipexy();
		//alert( "x: " + v.x + "\ny: " + v.y );
		//alert( "x: " + (swipe_det.sX - swipe_det.eX) + "\ny: " + (swipe_det.sY - swipe_det.eY) );
		
		if (Math.abs(v.x) < min_x) v.x = 0;
		if (Math.abs(v.y) < min_y) v.y = 0;
		
		// Direction detection
		if(v.x > 0) direc = "r";
		else if(v.x < 0) direc = "l";
		else if(v.y > 0) direc = "d";
		else if(v.y < 0) direc = "u";
		
		// Call function
		if (direc != "") {
			if(typeof func == 'function') func(el,direc);
		}
		
		// Reset
		direc = "";
		swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
		
	},false);	
}