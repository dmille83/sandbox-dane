var arr_photos = [];
var arr_photos_idx = null;
var arr_photos_idx_prev = null;
var boolMobile = mobile_device();

var loadPhotos = (function(){
	
	// Late-load image sources
	[].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
		img.setAttribute('src', img.getAttribute('data-src'));
		img.onload = function() {
			img.removeAttribute('data-src');
		};
	});
	
});

var registerPhotos = (function(){
	
	/*
	if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$("#nav-mode").text("This is a mobile device");
	} else {
		$("#nav-mode").text("This is NOT a mobile device");
	}
	*/
	
	// Late-load image sources
	loadPhotos();
	
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
		window.onkeydown = function(e){ checkKey(e); };
	}
	
});

function photoExpand(i) {
	
	var t = 400;
	var photoContainer = document.getElementById("photo-container-expand");
	var photoFrame = document.getElementById("photo-frame");
	var photoTitle = $("#photo-title");
	var photo = $("#photo-expanded");
	
	if (i === null) {
		arr_photos_idx = null;
		photoContainer.style.display = "none";
		document.body.style.overflow = "";
	} else if (i < arr_photos.length && i >= 0) {
		
		// Index
		arr_photos_idx_prev = arr_photos_idx;
		arr_photos_idx = i;
		var idx = (i+1) + "/" + arr_photos.length;
		console.log("photo " + idx);
		photoTitle.html(idx);
		var element = arr_photos[i];
		
		// Navigation Arrows
		var arrowLeft = photoContainer.getElementsByClassName("nav-arrow-left")[0];
		var arrowRight = photoContainer.getElementsByClassName("nav-arrow-right")[0];
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
		
		document.body.style.overflow = "hidden";
		photoContainer.style.display = "block";
		
		$(photo).attr("title", element.title);
		$(photo).attr("src", element.src);
		
		if (boolMobile === true) {
			
			// Photo Transition Animation - https://api.jqueryui.com/slide-effect/
			$(photo).stop(true, true);
			$(photo).hide(1, function(){
				
				$(photo).attr("title", element.title);
				$(photo).attr("src", element.src);
			
				photoFrame.style.overflow = "hidden";
				
				if (arr_photos_idx_prev === null) {
					
					// Show - Slide Up
					$(photo).animate({"marginTop": window.innerHeight + "px"},1).show(1).animate({"marginTop":"0px"},t, function(){
						photoFrame.style.overflow = "";
					});
					
				} else {
					
					// Show - Slide In
					var d = window.innerWidth * 2;
					if (arr_photos_idx_prev > arr_photos_idx) d *= -1;
					$(photo).animate({marginLeft: d + "px"},1).show(1).animate({marginLeft:"0px"},t, function(){
						photoFrame.style.overflow = "";
					});
					
				}
			
			});
			
		} else {
			$(photo).attr("title", element.title);
			$(photo).attr("src", element.src);
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