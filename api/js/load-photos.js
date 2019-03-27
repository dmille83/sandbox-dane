var arr_photos = [];
var arr_photos_idx = null;

function navMenu(c) {
	var x = document.getElementById("nav-menu");
	if (x.style.display === "table-cell" || c === true) {
		x.style.display = "";
	} else {
		x.style.display = "table-cell";
	}
}

var loadPhotos = (function(){
	
	/*
	if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$("#nav-mode").text("This is a mobile device");
	} else {
		$("#nav-mode").text("This is NOT a mobile device");
	}
	*/
	
	// Late-load image sources
	[].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
		img.setAttribute('src', img.getAttribute('data-src'));
		img.onload = function() {
			img.removeAttribute('data-src');
		};
	});
	
	// Add event listeners to the photo gallery
	var elementsContainer = document.getElementsByClassName("photo-container");
	for (var j = 0; j < elementsContainer.length; j++) {
		
		var elements = elementsContainer[j].getElementsByTagName('img');
		for (var i = 0; i < elements.length; i++) {
			arr_photos[i] = elements[i];
			(function(i){
				arr_photos[i].addEventListener('click', function(){ photoExpand(i); });
			})(i)
		}
	}
	if (elementsContainer.length > 0) {
		var element = document.getElementById("photo-container-expand");
		//var element = document.getElementById("photo-expanded");
		detectswipe(element, handleswipe);
		window.onkeydown = function(){ checkKey(); };
	}
	
});

function photoExpand(i) {
	if (i === null) {
		arr_photos_idx = null;
		document.getElementById("photo-container-expand").style.display = "none";
		document.body.style.overflow = "";
	} else if (i < arr_photos.length && i >= 0) {
		arr_photos_idx = i;
		console.log("photo " + (i+1) + "/" + arr_photos.length);
		
		var element = arr_photos[i];
		$("#photo-expanded").hide(1, function(){
			$("#photo-expanded").show(100);
			
			document.body.style.overflow = "hidden";
			document.getElementById("photo-container-expand").style.display = "block";
			document.getElementById("photo-expanded").src = element.src;
			document.getElementById("photo-expanded").title = element.title;
			document.getElementById("photo-title").innerHTML = element.title;
			
		});
		
		var arrowLeft = document.getElementById("photo-container-expand").getElementsByClassName("nav-arrow-left")[0];
		var arrowRight = document.getElementById("photo-container-expand").getElementsByClassName("nav-arrow-right")[0];
		if (i == 0) {
			arrowLeft.style.display = "none";
		} else {
			arrowLeft.style.display = "";
		}
		if (i == (arr_photos.length - 1)) {
			arrowRight.style.display = "none";
		} else {
			arrowRight.style.display = "";
		}
		
	}
}

function photoNav(d) {
	if (arr_photos_idx !== null) {
		photoExpand(arr_photos_idx + d);
	}
}

function checkKey(e) {
	e = e || window.event;
	
	// escape
	if (e.keyCode == '27') {
		photoExpand(null);
		navMenu(true);
    }
	
	// left arrow
    if (e.keyCode == '37') {
		photoNav(-1);
    }
	
	// right arrow
    if (e.keyCode == '39') {
		photoNav(1);
    }
	
}

function handleswipe(el, direc) {
	
	// swiped right
	if (direc === "r") {
		photoNav(-1);
	}
	
	// swiped left
	if (direc === "l") {
		photoNav(1);
	}
	
	// swiped down
	if (direc === "d") {
		photoExpand(null);
	}
	
}