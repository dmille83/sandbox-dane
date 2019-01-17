//$(document).ready(function (){
function startAnimatedScrollDown() {

	$("#marqueeUpOuterFrame").css("width", "calc(100% + " + getScrollbarWidth() + "px)");
	$("#marqueeUpOuterFrame").scrollTo($("#topOfScrollPage"), 0);
	//console.log($("#bottomOfScrollPage").offset().top);
	
	var scrollInterval;
	var restartScrollAnimation;
	var restartScrollDelay = 3000;
	function cancelAnimation()
	{
		//console.log($("#bottomOfScrollPage").offset().top);
		clearTimeout(scrollInterval);
		clearTimeout(restartScrollAnimation);
		//console.log("canceled scrolling...");
		restartScrollAnimation = setTimeout(function() { 
			//console.log("started scrolling...");
			scrollInterval = setInterval(function(){
				//$("#counterSpan").html(parseInt($("#bottomOfScrollPage").offset().top, 10));
				if ($("#bottomOfScrollPage").offset().top < 55) {
					// !!! percentage fails? ??? // http://stackoverflow.com/questions/3464876/javascript-get-window-x-y-position-for-scroll
					//console.log("scrolling to top...");
					$("#marqueeUpOuterFrame").scrollTo($("#topOfScrollPage"), 10);
				} else {
					//console.log("scrolling down...");
					//console.log($("#marqueeUpOuterFrame").attr("id"));
					//$("#marqueeUpOuterFrame").scrollTo('max', 100000);
					$("#marqueeUpOuterFrame").scrollTo("+=2px", 10);
				}
			},150);
		}, restartScrollDelay);
	}
	cancelAnimation(); // Begin the endless marquee scrolling cycle.
	restartScrollDelay = 12000;
	
	$('#marqueeUpOuterFrame').bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e){
		if ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel"){
			cancelAnimation();
		}
	});
	$(document).keydown(function(event){
		switch (event.keyCode) 
		{
			case 37: //moveLeft();
				break
			case 38: //moveUp();
				cancelAnimation();
				break;
			case 39: //moveRight();
				break;
			case 40: //moveDown();
				cancelAnimation();
				break;
		}
	});		

}
//});