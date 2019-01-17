// GLOBAL VARIABLES.
var spacing = 10;
var sliderYposition = 471; //427; //500; //547; // 280; // Since there are so many domains being pinged now, set the default height to just show the 4 most important ones, then the user can expand it to see the rest if they want. This makes it more convenient to test on smaller screens. When this is put on a bigger monitor I may change it to be taller by default.
var wrapperFrames = [];

// AUTOMATIC FUNCTIONS


// CREATE SLIDER BAR AFTER PAGE LOAD SO THEY WILL BE ON TOP OF THE PAGE CONTENT.
$(document).ready(function()
{

	// Push all wrapper frames into an array.
	wrapperFrames[1] = $("#wrapper01");
	wrapperFrames[2] = $("#wrapper02");
	wrapperFrames[3] = $("#wrapper03");

	wrapperFrames[4] = $("#wrapper04");
	wrapperFrames[5] = $("#wrapper05");
	wrapperFrames[6] = $("#wrapper06");

	wrapperFrames[7] = $("#wrapperMiddle");

	// wrapperFrames[7] = $("#wrapper07");
	// wrapperFrames[8] = $("#wrapper08");
	// wrapperFrames[9] = $("#wrapper09");
	//console.log(wrapperFrames);



	var container = document.createElement("div");
	container.innerHTML = '<div id="sliderNS01" class="slidervertical"><span>310</span></div>';
	document.getElementById("wrapper").appendChild(container);

	//var margincontainer = document.createElement("div");
	//margincontainer.innerHTML = '<div class="aspectRatio"><label>Frame Margins <input type="range" id="marginwidth" name="marginwidth" min="0" max="50"  value="10" onmouseup="changeMargins(this.value);" onload="rangevalue.value=value" onchange="rangevalue.value=value" oninput="rangevalue.value=value; changeMargins(this.value);" /></label><output id="rangevalue">10</output> Settings</div>';
	//margincontainer.innerHTML = '<div class="aspectRatio">							<img src="images/Gear.png" id="sizemenugear">							<span class="layoutMenuLabel">Settings</span>							<br>							<span class="aspectRatioHidden">								<label>Frame Margins 									<input type="range" id="marginwidth" name="marginwidth" min="0" max="50"  value="10" onmouseup="changeMargins(this.value);" onload="rangevalue.value=value" onchange="rangevalue.value=value" oninput="rangevalue.value=value; changeMargins(this.value);" />								</label>								<output id="rangevalue">10</output> 							</span>													</div>';


	//var buttonContainer = document.createElement("button");
	//buttonContainer.innerHTML = '<button id="closefullscreenbutton" type="button"  style="width:50px; height:50px; background-color:red; border:3px solid black; position:absolute; right:20px; top:20px; z-index:4001; font-size:2em;">&#10060;</button>';
	//$(buttonContainer).hide();
	$("#closefullscreenbutton").hide();

	//document.getElementById("wrapper").appendChild(margincontainer);

	// MANUALLY POSITIONING FRAMES TO FIX THE LAYOUT BUG IN SAFARI AND CHROME ON MAC.
	for (var i = 1; i <= wrapperFrames.length; i++) {
		$(wrapperFrames[i]).css("position", "absolute");
	}
	// document.getElementById("wrapper01").style.position = "absolute";
	// document.getElementById("wrapper02").style.position = "absolute";
	// document.getElementById("wrapper03").style.position = "absolute";
	// document.getElementById("wrapper04").style.position = "absolute";
	// document.getElementById("wrapper05").style.position = "absolute";
	// document.getElementById("wrapper06").style.position = "absolute";
	// document.getElementById("wrapperMiddle").style.position = "absolute";
	// document.getElementById("wrapper07").style.position = "absolute";
	// document.getElementById("wrapper08").style.position = "absolute";
	// document.getElementById("wrapper09").style.position = "absolute";

	document.getElementById("sliderNS01").style.top = sliderYposition + "px";
	document.getElementById("sliderNS01").getElementsByTagName('span')[0].innerHTML = sliderYposition + "px"
	changeSliderHeight();
});


// SLIDER BAR HANDLER.
$(function() {
	// Source:  http://jqueryui.com/draggable/#constrain-movement
	$(".slidervertical" ).draggable({
		axis: "y",
		containment: "#wrapper",
		drag: function() // SOURCE:  http://jqueryui.com/draggable/#events
		{
			sliderYposition = parseInt(document.getElementById("sliderNS01").style.top, 10);
			document.getElementById("sliderNS01").getElementsByTagName('span')[0].innerHTML = sliderYposition;
			runDuringResize(); // UPDATE PAGE LIVE AS USER SLIDES THE BAR.
		},
		stop: function (e, ui)
       	{
			if ((ui.position.top) >= ($(window).height() - 80 - spacing)) // IF SLIDER IS OFF THE EDGE OF THE PAGE, CANCEL THE CHANGE AND MOVE IT BACK.
			{
				// "sliderNS01"
				document.getElementById($(e.target).attr('id')).style.top = ($(window).height() - 80 - spacing) + 'px'
				document.getElementById($(e.target).attr('id')).getElementsByTagName('span')[0].innerHTML = parseInt(document.getElementById($(e.target).attr('id')).style.top, 10);
				sliderYposition = parseInt(document.getElementById($(e.target).attr('id')).getElementsByTagName('span')[0].innerHTML, 10);
			}
			else
			{
				// "sliderNS01"
				document.getElementById($(e.target).attr('id')).getElementsByTagName('span')[0].innerHTML = parseInt(document.getElementById($(e.target).attr('id')).style.top, 10);
				sliderYposition = parseInt(document.getElementById($(e.target).attr('id')).getElementsByTagName('span')[0].innerHTML, 10);
			}
			runAfterResizeCompletes();
		}
	});
});


// BEGIN FUNCTIONS / METHODS SCRIPT SECTION.

function runDuringResize()
{
	//$("#servicenowiframe1").hide(); // Dragging the frame height slider over an iFrame causes issues, so hide the iFrames while dragging.
	//$("#servicenowiframe2").hide(); // Dragging the frame height slider over an iFrame causes issues, so hide the iFrames while dragging.
	//NOT NECISSARY IF WE ARE USING AN OVERLAY OVER THE IFRAME.

	//changeSliderHeight(); // GETS A BIT CHOPPY WHEN YOU ARE CALLING THE FUNCTIONS THAT UPDATE THE PAGE LAYOUT EVERY MILLISECOND.
}

function runAfterResizeCompletes()
{
	//$("#servicenowiframe1").show(); // Dragging the frame height slider over an iFrame causes issues, so re-show the iFrames after you are finished dragging.
	//$("#servicenowiframe2").show(); // Dragging the frame height slider over an iFrame causes issues, so re-show the iFrames after you are finished dragging.

	resizeAndReloadContentList(); // See 'initialcontentload.js'.
	/*
	setTimeout(function(){
		svcnwResize(); // CALL FUNCTION IN SERVICENOW01 FRAME TO MAKE IT FIT THE NEW FRAME SIZE. THE DELAY IS SO THAT THE MAIN PAGE RESIZES ITS ELEMENTS *BEFORE* THE SERVICENOW01 FRAME CHANGES TO FIT THEM.
	}, 500);
	*/

	changeSliderHeight();
}

function changeSliderHeight()
{
	changeMargins(spacing); // Run with current margin value.
}

function changeMargins(newspacing) // Run with new margin value as function input.
{
	spacing = parseInt(newspacing, 10); // It HAS to parse for int or it will say it is a STRING!

	// CHANGE WIDTH AND HEIGHT OF CELL FRAMES.
	var cols = document.getElementsByClassName('topRowFrame');
	for(i=0; i<cols.length; i++)
	{
		// IF "spacing == 0" OVERLAP EDGES OF CELLS TO REMOVE DOUBLE MARGINS.
		// CELL BORDERS ARE 6px WIDE, SO OVERLAP BY 5px.
		if ( spacing == 0 )
		{
			cols[i].style.width = "calc(33% - " + 0.5*spacing + "px + 5px)";
			cols[i].style.height = "calc(" + sliderYposition + "px + 5px)";
		}
		else // PERFORM NORMAL CELL SPACING WITH POSITIVE-VALUE MARGINS.
		{
			cols[i].style.width = "calc(33% - " + 0.5*spacing + "px)";
			cols[i].style.height = sliderYposition + 'px';
		}
	}
	cols = document.getElementsByClassName('feedRowFrame');
	for(i=0; i<cols.length; i++)
	{
		// IF "spacing == 0" OVERLAP EDGES OF CELLS TO REMOVE DOUBLE MARGINS.
		// CELL BORDERS ARE 6px WIDE, SO OVERLAP BY 5px.
		if ( spacing == 0 )
		{
			cols[i].style.width = "calc(33% - " + 0.5*spacing + "px + 5px)";
			cols[i].style.height = "calc(50% - " + 0.5*sliderYposition + "px - 40px - " + 1.5*spacing + "px + 5px)";
		}
		else // PERFORM NORMAL CELL SPACING WITH POSITIVE-VALUE MARGINS.
		{
			cols[i].style.width = "calc(33% - " + 0.5*spacing + "px)";
			cols[i].style.height = "calc(50% - " + 0.5*sliderYposition + "px - 40px - " + 1.5*spacing + "px)";
		}
		cols[i].style.marginTop = spacing + 'px';
	}
	cols = document.getElementsByClassName('RowFrameCenter');
	for(i=0; i<cols.length; i++)
	{
		cols[i].style.width = "calc(34% - " + spacing + "px)";
		cols[i].style.marginLeft = spacing + 'px';
	}

	// CENTER FRAME
	cols = document.getElementsByClassName('middleRowFrame');
	for(i=0; i<cols.length; i++)
	{
		// IF "spacing == 0" OVERLAP EDGES OF CELLS TO REMOVE DOUBLE MARGINS.
		// CELL BORDERS ARE 6px WIDE, SO OVERLAP BY 5px.
		if ( spacing == 0 )
		{
			cols[i].style.width = "100%";
			cols[i].style.height = "calc(50% - " + 0.5*sliderYposition + "px - 40px - " + 1.5*spacing + "px + 5px)";
		}
		else // PERFORM NORMAL CELL SPACING WITH POSITIVE-VALUE MARGINS.
		{
			cols[i].style.width = "100%";
			cols[i].style.height = "calc(50% - " + 0.5*sliderYposition + "px - 40px - " + 1.5*spacing + "px)";
		}
		cols[i].style.marginTop = spacing + 'px';
	}


	// CHANGE OFFSET OF SLIDER TO MATCH BORDER POSITION IN "spacing == 0" SCENARIO.
	// CELL BORDERS ARE 6px WIDE, SO CHANGE SLIDER OFFSET BY 5px.
	if ( spacing == 0 )
		document.getElementById("sliderNS01").style.marginTop = "-11px";
	else
		document.getElementById("sliderNS01").style.marginTop = "-16px";


	// CHECK IF FEED ROWS NEED TO BE HIDDEN.
	//updateFeedRowHiddenState();


	// UPDATE MINIMUM PAGE HEIGHT BASED ON CURRENT SLIDER POSITION (CANNOT SHRINK PAGE HEIGHT SHORTER THAN SLIDER POSITION).
	document.getElementById("wrapper").style.minHeight = sliderYposition + 80 + spacing + 'px';



	// MANUALLY POSITIONING FRAMES TO FIX THE LAYOUT BUG IN SAFARI AND CHROME ON MAC.
	// POSITIONING SECTION.

		// Y POSITION.
			var row1Y = "0px";
			var row2Y = sliderYposition + 'px';
			var row3Y = "calc(50% - " + 0.5*sliderYposition + "px - 40px - " + 1.5*spacing + "px + " + sliderYposition + "px + " + spacing + "px)";
			// ROW 1
			wrapperFrames[1].css("top", row1Y);
			wrapperFrames[2].css("top", row1Y);
			wrapperFrames[3].css("top", row1Y);
			// ROW 2
			wrapperFrames[4].css("top", row3Y);
			wrapperFrames[5].css("top", row3Y);
			wrapperFrames[6].css("top", row3Y);

			// ROW MIDDLE
			wrapperFrames[7].css("top", row2Y);

			// // ROW 3
			// wrapperFrames[7].css("top", row3Y);
			// wrapperFrames[8].css("top", row3Y);
			// wrapperFrames[9].css("top", row3Y);

		// X POSITION.
			var col1X = "0px";
			var col2X = "calc(33% - " + 0.5*spacing + "px)";
			var col3X = "0px";
			// COL 1
			wrapperFrames[1].css("left", col1X);
			wrapperFrames[2].css("left", col2X);
			wrapperFrames[3].css("right", col3X);
			// COL 2
			wrapperFrames[4].css("left", col1X);
			wrapperFrames[5].css("left", col2X);
			wrapperFrames[6].css("right", col3X);

			// ROW MIDDLE
			wrapperFrames[7].css("left", col1X);

			// // COL 3
			// wrapperFrames[7].css("left", col1X);
			// wrapperFrames[8].css("left", col2X);
			// wrapperFrames[9].css("right", col3X);


	// FUNCTIONS TO RUN AFTER PAGE LAYOUT HAS BEEN CHANGED.
		//clearTimeout(globalTimer); // Do nothing until user FINISHES changing the height of the page, otherwise you end up with an insane number of function calls getting added up every milli-second.
		//globalTimer = setTimeout(function()
		//{
			updateFeedRowHiddenState(); // CHECK IF FEED ROWS NEED TO BE HIDDEN.
			checkIfPingersAreHidden(); // CHECK IF HEIGHT OF TOP ROW OF FRAMES IS SMALLER THAN THE HEIGHT NEEDED TO DISPLAY ALL OF THE PINGED DOMAINS.
		//}, 1000);


} // END OF "function changeMargins(newspacing)".


// IF SLIDER BAR BRINGS THE BOTTOM EDGE OF THE TOP ROW TOO CLOSE TO THE FOOTER, HIDE THE FEED FRAMES SQUASHED BETWEEN THEM.
function updateFeedRowHiddenState()
{
	cols = document.getElementsByClassName('feedRowFrame');
	for(i=0; i<cols.length; i++)
	{
		if ( document.getElementById("sliderNS01").getElementsByTagName('span')[0].innerHTML == ($(window).height() - 80 - spacing) )
			cols[i].style.display = "none";
		else
			cols[i].style.display = "inline-block";
	}
}

// CHECK IF HEIGHT OF TOP ROW OF FRAMES IS SMALLER THAN THE HEIGHT NEEDED TO DISPLAY ALL OF THE PINGED DOMAINS.
function checkIfPingersAreHidden()
{
	if ( document.getElementById("pingerid") != null )
	{
		if ( document.getElementById("frame01") != null )
		{
			if ( document.getElementById("morePingersAreHiddenNotificationID") != null ) // THE MOBILE VIEW DOES NOT USE THIS INDICATOR AT ALL, SO WE NEED TO CHECK IF IT EXISTS. (BUT WHY DO WE NEED TO CHECK IF IT EXISTS *HERE*?).
			{
				if ( ($("#pingerid").height() - 5) > $(getContentFrameID('pinger')).height() )
					$("#morePingersAreHiddenNotificationID").fadeIn(1);
				else
					$("#morePingersAreHiddenNotificationID").fadeOut(1);
			}
		}
	}
}

// REGISTER FUNCTIONS THAT SHOULD BE (RE-)RUN ON PAGE RESIZE HERE.
var hidertimer;
$(window).bind('resize', function()
{
	clearTimeout(hidertimer); // Do nothing until user FINISHES resizing the browser window, otherwise you end up with an insane number of function calls getting added up every second that you are still dragging the window.
	hidertimer = setTimeout(function()
	{
		updateFeedRowHiddenState(); // RUN TO CHECK IF WE NEED TO HIDE/UN-HIDE FEED ROWS WHEN THE WINDOW ITSELF IS RESIZED.
		checkIfPingersAreHidden(); // CHECK IF HEIGHT OF TOP ROW OF FRAMES IS SMALLER THAN THE HEIGHT NEEDED TO DISPLAY ALL OF THE PINGED DOMAINS.
	}, 1000);
});




/*========================================== -------------------------------- ========================================*/
/*========================================== SWAP POSITIONS OF ANY TWO FRAMES ========================================*/
/*========================================== -------------------------------- ========================================*/


// SWAP POSITIONS OF ANY TWO FRAMES
var isSwappingTwoWrappers = false;
$(function() {
	$( ".overlay" ).parent().draggable({
		revert: '100',
		helper: "clone",
		start: function(e, ui) {
			isSwappingTwoWrappers = true;
			$(ui.helper).css('z-index', 99);
		},
		stop: function (e, ui)
		{
			var halfSwapWidth = ($('#' + e.target.id).width()/2);
			var halfSwapHeight = ($('#' + e.target.id).height()/2);

			// Check position relative to other frames, then swap them.
			var swapComplete = false;
			for (var key in wrapperFrames)
			{
				if (!swapComplete)
				{
					if (e.target.id != wrapperFrames[key].attr('id'))
					{
						if (ui.position.top + halfSwapHeight > wrapperFrames[key].position().top && ui.position.top + halfSwapHeight < wrapperFrames[key].position().top + wrapperFrames[key].height())
						{
							if (ui.position.left + halfSwapWidth > wrapperFrames[key].position().left && ui.position.left + halfSwapWidth < wrapperFrames[key].position().left + wrapperFrames[key].width())
							{
								var classes01 = $('#' + e.target.id).attr('class');
								var classes02 = wrapperFrames[key].attr('class');
								console.log(classes02);
								console.log(classes01);


								for (var key2 in wrapperFrames) if (wrapperFrames[key2].attr('id') == e.target.id)
								{
									wrapperFrames[key2] = wrapperFrames[key];
									wrapperFrames[key2].removeClass();
									clearOutInlineCSS(wrapperFrames[key2]);
									wrapperFrames[key2].addClass(classes01);
								}

								wrapperFrames[key] = $('#' + e.target.id);
								wrapperFrames[key].removeClass();
								clearOutInlineCSS(wrapperFrames[key]);
								wrapperFrames[key].addClass(classes02);

								swapComplete = true;
							}
						}
					}
				}
			}
			if (swapComplete) runAfterResizeCompletes();

			isSwappingTwoWrappers = false;
		}
	});
});


/*======================================== ----------------------------------- ========================================*/
/*======================================== ONCLICK EXPAND FRAME TO FILL SCREEN ========================================*/
/*======================================== ----------------------------------- ========================================*/

var overlayAnchors;
$(document).ready(function()
{
	$("#fullScreenWrapper").hide();

	var overlayAnchors = document.getElementsByClassName('overlay');
	for(var i = 0; i < overlayAnchors.length; i++)
	{
		var anchor = overlayAnchors[i];
		registerForOnclickExpansion(anchor);
	}
});

function registerForOnclickExpansion(argFrame)
{
	argFrame.onclick = function()
	{
		if (!isSwappingTwoWrappers)
			showFullscreenFrame(argFrame);
	}
}

function moveElementUnderParentOverlay(elem, newpar)
{
	newpar.insertBefore(elem, newpar.childNodes[0]);
}

function showFullscreenFrame(argFrame)
{
	var parentFrame = argFrame.parentNode;
	//alert(parentFrame.id);
	$("#closefullscreenbutton").show();
	$(".overlay", parentFrame).hide();

	$(parentFrame).css("margin-left", "0px");
	$(parentFrame).css("margin-top", "0px");
	$(parentFrame).css("left", "0px");
	$(parentFrame).css("top", "0px");
	$(parentFrame).css("width", "50%");
	$(parentFrame).css("height", "50%");


	$(parentFrame).css("-moz-transform", "scale(2.0)");
	$(parentFrame).css("-o-transform", "scale(2.0)");
	$(parentFrame).css("-webkit-transform", "scale(2.0)");
	$(parentFrame).css("-ms-transform", "scale(2.0)");
	$(parentFrame).css("transform", "scale(2.0, 2.0)");

	$(parentFrame).css("-moz-transform-origin", "0 0");
	$(parentFrame).css("-o-transform-origin", "0 0");
	$(parentFrame).css("-webkit-transform-origin", "0 0");
	$(parentFrame).css("-ms-transform-origin", "0 0");
	$(parentFrame).css("transform-origin", "0 0");


	//SOURCE:  http://stackoverflow.com/questions/5977699/jquery-get-all-divs-inside-a-div-with-class-container
	//$(parentFrame.id ." > .overlay").hide();

	var oldZindex = $(parentFrame).zIndex();
	$(parentFrame).css("z-index", "6999");
	$("#closefullscreenbutton").css("z-index", "7001");

	// STUFF WE WANT TO HAPPEN WHEN WE EXPAND A FRAME.
		resizeAndReloadContentList(); // FUNCTION LOCATED IN: initialcontentload.js
		// RSS READERS.
			$(".sliderdescbg, .sliderdescfg, .sliderdesctext").css("visibility", "visible");
		// TWITTER SCROLLABILITY.
			$(getContentFrameID('twitter')).css("overflow-y", "auto");
			$("#twitterinner").css("width", "100%");
			$("#twitterinner").css("left", "0px");
			$("#twitterouter").css("height", "calc(100% - 50px)");
			$("#twitterinner").css("height", "100%");
			$("#twitter-widget-0").css("height", "100%");


	closefullscreenbutton.onclick = function()
	{
		//clear changes made to CSS.
		clearOutInlineCSS($(parentFrame));

		$(parentFrame).css("-moz-transform", "");
		$(parentFrame).css("-o-transform", ")");
		$(parentFrame).css("-webkit-transform", "");
		$(parentFrame).css("-ms-transform", "");
		$(parentFrame).css("transform", "");

		$(parentFrame).css("-moz-transform-origin", "");
		$(parentFrame).css("-o-transform-origin", "");
		$(parentFrame).css("-webkit-transform-origin", "");
		$(parentFrame).css("-ms-transform-origin", "");
		$(parentFrame).css("transform-origin", "");


		$(".overlay", parentFrame).show();
		$("#closefullscreenbutton").hide();

		// STUFF WE WANT TO HAPPEN WHEN WE GO BACK TO FRAME VIEW.
			resizeAndReloadContentList();
			changeSliderHeight(); // resets frame sizes and positions.
			// RSS READERS.
				$(".sliderdescbg, .sliderdescfg, .sliderdesctext").css("visibility", "hidden");
			// TWITTER SCROLLABILITY.
				$(getContentFrameID('twitter')).css("overflow-y", "hidden");
				$("#twitterinner").css("width", "calc(100% + 85px)");
				$("#twitterinner").css("left", "-60px");
				$("#twitterouter").css("height", "calc(100% + 50px)");

				$("#twitter-widget-0").css("max-width", "");
				$("#twitter-widget-0").css("width", "100%");



		//$(parentFrame ." > .overlay").show();
	}

}

function clearOutInlineCSS(frame)
{
	frame.css("left", "");
	frame.css("right", "");
	frame.css("top", "");
	frame.css("width", "");
	frame.css("height", "");
	frame.css("z-index", "");
	frame.css("margin-left", "");
	frame.css("margin-top", "");

	frame.css("-moz-transform", "");
	frame.css("-o-transform", ")");
	frame.css("-webkit-transform", "");
	frame.css("-ms-transform", "");
	frame.css("transform", "");

	frame.css("-moz-transform-origin", "");
	frame.css("-o-transform-origin", "");
	frame.css("-webkit-transform-origin", "");
	frame.css("-ms-transform-origin", "");
	frame.css("transform-origin", "");
}
