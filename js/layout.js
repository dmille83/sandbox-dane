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
	//if ($(window).height() > $(window).width()*0.9) useMobileLayout = true;
	if ($(window).width() - $(window).height() < 130) useMobileLayout = true;
	//alert($(window).width());
	
	// Init particle background
	if (isMobileDevice == false) { initparticles(); }
	//initparticles();
	
	if (useMobileLayout == true) 
	{
		// MOBILE DEVICE:
		
		// CSS
		//$("#bio").css("height", "");
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
			//$(this).css("font-size", "2.5em");
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
		//$("#note").css("background", "transparent");
		applyRandomColorGradients("right");
		
		//gradientAnimated();
	}
	else
	{
		// BROWSER:
		
		// CSS
		//$("#bio").css("height",$(window).height() + "px");
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
	
	/*
	// FANCY FADE IN/OUT OF PAGE ELEMENTS WHILE SCROLLING
	// Reset scroll fade
	$('.scrollFade').each(function(){
		if ( $(this).css("z-index") !== "2" ) {
			if( $(this).is(':animated') ) $(this).stop();
			$(this).css("z-index","2");
			$(this).animate({left: "0px", opacity: "1.0"}, 100);
		}
	});
	// RUN FADE IN/OUT
	if (isMobileDevice == false) 
	{
		
		// SOURCE:  http://stackoverflow.com/questions/11760898/jquery-get-the-element-thats-on-the-middle-of-the-visible-screen-while-scroll
		var permashow = false;
		var scrollFade = (function(docElm){
			var viewportHeight = docElm.clientHeight,
				elements = $('.scrollFade')
				s = 1000;
			return function(e){
				if( e && e.type == 'resize' ) viewportHeight = docElm.clientHeight;
				
				// Are we scrolled to the very bottom?
				var b = ($(window).scrollTop() + $(window).height() - $(document).height() >= 0);
				var c = ($(window).scrollTop() + $(window).height() - $(document).height() >= -400); // some leeway so the bottom item isn't missed
				//if(b==true) alert("bottom");
				
				// When we reach the bottom, perma-show all elements
				if(b==true) permashow = true;
				if(permashow==true) b = true;
				
				// Are we scrolled to the very top?
				//if(b==false) b = (window.pageYOffset == 0);
				
				elements.each(function(){
					var pos = this.parentElement.getBoundingClientRect().top, 
						d = false, 
						lr = "-";
					if ( ($(this).offset().left + $(this).width() > docElm.clientWidth/2) && (isMobileDevice == false) ) lr = "";
					
					// Screen position of element as user scrolls down.
					//if (pos < viewportHeight-$(this).height()) d = true; // works well!
					if ( (pos < viewportHeight-$(this).height()) || (pos < viewportHeight-200) ) d = true;
					
					//if( $(this).is(':animated') ) $(this).stop();
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
							//$(this).animate({left: lr + $(this).width()/3 + "px", opacity: "0.0"}, s);
							$(this).animate({left: lr + 50 + "px", opacity: "0.0"}, 300);
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
	*/
	
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
		//elem.css("background", "-webkit-linear-gradient(" + dirsafari + ", rgba(59, 59, 67, " + a + "), rgba(59, 59, 67, " + b + "), rgba(59, 59, 67, " + c + "), rgba(59, 59, 67, " + d + "), rgba(59, 59, 67, " + e + "), url('./img/code-wallpaper-2.jpg')"); // For Safari 5.1 to 6.0
		//elem.css("background", "-o-linear-gradient(" + direction + ", rgba(59, 59, 67, " + a + "), rgba(59, 59, 67, " + b + "), rgba(59, 59, 67, " + c + "), rgba(59, 59, 67, " + d + "), rgba(59, 59, 67, " + e + "), url('./img/code-wallpaper-2.jpg')"); // For Opera 11.1 to 12.0
		//elem.css("background", "-moz-linear-gradient(" + direction + ", rgba(59, 59, 67, " + a + "), rgba(59, 59, 67, " + b + "), rgba(59, 59, 67, " + c + "), rgba(59, 59, 67, " + d + "), rgba(59, 59, 67, " + e + "), url('./img/code-wallpaper-2.jpg')"); // For Firefox 3.6 to 15
		elem.css("background", "linear-gradient(to " + direction + ", rgba(59, 59, 67, " + a + "), rgba(59, 59, 67, " + b + "), rgba(59, 59, 67, " + c + "), rgba(59, 59, 67, " + d + "), rgba(59, 59, 67, " + e + "), url('./img/code-wallpaper-2.jpg')"); // Standard syntax
		
		//console.log('animated ' + "linear-gradient(to " + direction + ", rgba(59, 59, 67, " + a + "), rgba(59, 59, 67, " + b + "), rgba(59, 59, 67, " + c + "), rgba(59, 59, 67, " + d + "), rgba(59, 59, 67, " + e + "), url('./img/code-wallpaper-2.jpg')");
	}
	function randomInt(min,max) { return Math.floor(Math.random()*(max-min+1)+min); }
	
	
	/*** FRIVOLOUS COSMETICS (BEGIN) ***/
	// Set gradient CSS with Javascript
	function gradientCss(elem, direction, color1)
	{
		var dirsafari = "left"
		if (direction == "left") dirsafari = "right"
		if (color1.substring(0,1) !== "#") color1 = "#" + color1;
		
		//color1 = "rgb(168, 158, 190)"; // I like this color a lot
		
		$(elem).css("background", "white"); // For browsers that do not support gradients
		$(elem).css("background", "-webkit-linear-gradient(" + dirsafari + ", " + color1 + ", rgba(255,255,255, 0.0), rgba(255,255,255, 0.0))"); // For Safari 5.1 to 6.0
		$(elem).css("background", "-o-linear-gradient(" + direction + ", " + color1 + ", rgba(255,255,255, 0.0), rgba(255,255,255, 0.0))"); // For Opera 11.1 to 12.0
		$(elem).css("background", "-moz-linear-gradient(" + direction + ", " + color1 + ", rgba(255,255,255, 0.0), rgba(255,255,255, 0.0))"); // For Firefox 3.6 to 15
		$(elem).css("background", "linear-gradient(to " + direction + ", " + color1 + ", rgba(255,255,255, 0.0), rgba(255,255,255, 0.0))"); // Standard syntax
	}
	/*
	function randomcolor() 
	{
		var rcolor = '#000000';
		while (rcolor == '#000000' || rcolor == '#FFFFFF' || rcolor.length < 7 || colorisdark(rcolor) < 117) {
			// beware 5-digit colors in the rare instance that random() == 0
			rcolor = "#"+((1<<24)*Math.random()|0).toString(16);
		}
		//console.log(rcolor + ' ' + colorisdark(rcolor));
		return rcolor;
	}
	function colorisdark(hexcode)
	{
		// SOURCE:  http://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
		var c = hexcode.substring(1);      // strip #
		var rgb = parseInt(c, 16);   // convert rrggbb to decimal
		var r = (rgb >> 16) & 0xff;  // extract red
		var g = (rgb >>  8) & 0xff;  // extract green
		var b = (rgb >>  0) & 0xff;  // extract blue
		var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
		return luma;
	}
	*/
	function applyRandomColorGradients(direction)
	{
		$('.randomColor h3').each(function(){
			gradientCss(this, direction, randomcolor());
		});
	}
	//applyRandomColorGradients("left");
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