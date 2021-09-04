var pageLoad = (function(){
	
	//alert(performance.now());
	
	$("#ajaxloading").hide();
	$("#content-wrapper").show();
	$("#portraitImg").show(); // hide portrait until page is fully loaded
	
	// SOURCE:  http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device-in-jquery
	var isMobileDevice = false;
	var useMobileLayout = false;
	if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		isMobileDevice = true;
		useMobileLayout = true;
	} else {
		isMobileDevice = false;
		useMobileLayout = false;
	}
	// USE MOBILE DEVICE CSS IF PAGE IS NARROW
	if ($(window).width() < 860) useMobileLayout = true;
	if ($(window).width() - $(window).height() < 130) useMobileLayout = true;
	
	// Init particle background
	//if (isMobileDevice == false) { initparticles(); }
	
	if (useMobileLayout == true) 
	{
		// MOBILE DEVICE:
		
		// CSS
		//$("#layer1").css("height", "3000px");
		$("#topLeftFrame").css("height", "300px");
		$("#topLeftFrame").css("width", "100%");
		$("#topLeftFrame").css("border-bottom", "10px solid white");
		$("#topLeftFrame").css("margin-bottom", "0px");
		$("#topRightFrame").css("float", "left");
		$('.leftFrame').each(function(){
			$(this).css("float", "left");
			$(this).css("width", "100%");
			$(this).css("text-align", "left");
		});
		$('.leftFrame > h3').each(function(){
			gradientCss(this, "right", "#ddd");
		});
		$('.spacerDiv .leftFrame > h3').each(function(){
			gradientCss(this, "right", "#bbb");
		});
		$('.rightFrame').each(function(){
			$(this).css("float", "left");
			$(this).css("width", "100%");
		});
		if (isMobileDevice == true) {
			$('.navLink').each(function(){
				$(this).css("font-size", "2.0em");
			});
			$("#bioName").css("font-size", "2.5em");
		}
		applyRandomColorGradients("right");
		
	}
	else
	{
		// BROWSER:
		
		// CSS
		//$("#layer1").css("height", "");
		$("#topLeftFrame").css("height",$(window).height() + "px");
		$("#topLeftFrame").css("width", $(window).height()*(969/1400) + "px"); // Portrait's proportional width
		$("#topLeftFrame").css("border-bottom", "");
		$("#topLeftFrame").css("margin-bottom", "");
		$("#topRightFrame").css("float", "");
		$('.leftFrame').each(function(){
			$(this).css("float", "");
			$(this).css("width", "");
			$(this).css("text-align", "");
		});
		$('.leftFrame > h3').each(function(){
			$(this).css("background", "");
			//$(this).css("font-size", "");
		});
		$('.spacerDiv .leftFrame > h3').each(function(){
			$(this).css("background", "");
		});
		$('.rightFrame').each(function(){
			$(this).css("float", "");
			$(this).css("width", "");
		});
		$('.navLink').each(function(){
			$(this).css("font-size", "");
		});
		$("#bioName").css("font-size", "");
		$("#note").css("background", "");
		applyRandomColorGradients("left");
	}
	
	$("#layer1").css("height", document.getElementById("darkAreaBegin").offsetTop + "px");
	
	// RUN FADE IN/OUT
	if (isMobileDevice == false) fadeScroll();
	
	// FANCY FADE IN/OUT OF PAGE ELEMENTS WHILE SCROLLING
	function fadeScroll() {
		
		// Reset scroll fade
		$('.scrollFade').each(function(){
			if ( $(this).css("z-index") !== "2" ) {
				if( $(this).is(':animated') ) $(this).stop();
				$(this).css("z-index","2");
				$(this).animate({left: "0px", opacity: "1.0"}, 100);
			}
		});
		
		// SOURCE:  http://stackoverflow.com/questions/11760898/jquery-get-the-element-thats-on-the-middle-of-the-visible-screen-while-scroll
		var permashow = false;
		var scrollFade = (function(docElm){
			var viewportHeight = docElm.clientHeight,
				elements = $('.scrollFade')
				s = 300
				x = 10;
			return function(e){
				if( e && e.type == 'resize' ) viewportHeight = docElm.clientHeight;
				
				// Are we scrolled to the very bottom?
				var b = ($(window).scrollTop() + $(window).height() - $(document).height() >= 0);
				var c = ($(window).scrollTop() + $(window).height() - $(document).height() >= -400); // some leeway so the bottom item isn't missed
				
				// When we reach the bottom, perma-show all elements
				if(b==true) permashow = true;
				if(permashow==true) b = true;
				
				elements.each(function(){
					var pos = this.parentElement.getBoundingClientRect().top, 
						d = false, 
						lr = -10;
					if ( ($(this).offset().left + $(this).width() > docElm.clientWidth/2) && (isMobileDevice == false) ) lr *= -1;
					
					// Screen position of element as user scrolls down.
					if ( pos < viewportHeight-150 ) d = true;
					
					if ( b==true || c==true || d==true ) {
						// SHOW
						if ( $(this).css("z-index") !== "2" ) {
							if( $(this).is(':animated') ) $(this).stop();
							$(this).css("z-index","2");
							$(this).animate({left: "0px", opacity: "1.0"}, s);
						}
					} else {
						// HIDE
						if ( $(this).css("z-index") !== "1" ) {
							if( $(this).is(':animated') ) $(this).stop();
							$(this).css("z-index","1");
							$(this).animate({left: lr + "px", opacity: "0.2"}, s);
						}
					}
					
				});
			}
			
		})(document.documentElement);
		
		// Wait until user stops scrolling
		$(window).scroll(function() {
			scrollFade();
			clearTimeout($.data(this, 'scrollTimer'));
			$.data(this, 'scrollTimer', setTimeout(function() {
				// do something
				//scrollFade();
			}, 100));
		});
		// Very first setup run on page load
		scrollFade();
		
	}
	
	// Animated Code Gradient Fade
	function gradientAnimated()
	{
		var elem = $('#topLeftFrame');
		var direction = 'right';
		//rgba(59, 59, 67, 100)
		
		var a = randomInt(1, 100);
		var b = randomInt(1, 100);
		var c = randomInt(1, 100);
		var d = randomInt(1, 100);
		var e = randomInt(1, 100);
		
		var dirsafari = "left"
		if (direction == "left") dirsafari = "right"
		
		elem.css("background", "rgba(59, 59, 67, 100)"); // For browsers that do not support gradients
		elem.css("background", "linear-gradient(to " + direction + ", rgba(59, 59, 67, " + a + "), rgba(59, 59, 67, " + b + "), rgba(59, 59, 67, " + c + "), rgba(59, 59, 67, " + d + "), rgba(59, 59, 67, " + e + "), url('./img/code-wallpaper-2.jpg')"); // Standard syntax
		
	}
	function randomInt(min,max) { return Math.floor(Math.random()*(max-min+1)+min); }
	
	
	/*** FRIVOLOUS COSMETICS (BEGIN) ***/
	// Set gradient CSS with Javascript
	function gradientCss(elem, direction, color1)
	{
		var dirsafari = "left"
		if (direction == "left") dirsafari = "right"
		if (color1.substring(0,1) !== "#") color1 = "#" + color1;
		$(elem).css("background", "white"); // For browsers that do not support gradients
		$(elem).css("background", "-webkit-linear-gradient(" + dirsafari + ", " + color1 + ", rgba(255,255,255, 0.0), rgba(255,255,255, 0.0))"); // For Safari 5.1 to 6.0
		$(elem).css("background", "-o-linear-gradient(" + direction + ", " + color1 + ", rgba(255,255,255, 0.0), rgba(255,255,255, 0.0))"); // For Opera 11.1 to 12.0
		$(elem).css("background", "-moz-linear-gradient(" + direction + ", " + color1 + ", rgba(255,255,255, 0.0), rgba(255,255,255, 0.0))"); // For Firefox 3.6 to 15
		$(elem).css("background", "linear-gradient(to " + direction + ", " + color1 + ", rgba(255,255,255, 0.0), rgba(255,255,255, 0.0))"); // Standard syntax
	}
	
	function applyRandomColorGradients(direction)
	{
		$('.randomColor h3').each(function(){
			gradientCss(this, direction, randomcolor());
		});
	}
	/*** FRIVOLOUS COSMETICS (END) ***/
	
});
window.onload = pageLoad;

$(window).on('resize', function() {
	clearTimeout($.data(this, 'scrollTimer'));
	$.data(this, 'scrollTimer', setTimeout(function() {
		// do something
		pageLoad();
	}, 100));
});


/* SCROLL */

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		document.getElementById("scrollToTopBtn").style.display = "block";
	} else {
		document.getElementById("scrollToTopBtn").style.display = "none";
	}
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
	document.body.scrollTop = 0; // For Chrome, Safari and Opera 
	document.documentElement.scrollTop = 0; // For IE and Firefox
}