
//================================ FRAME HTML (begin) ================================//
var twitterHTML =  '<h1 class="header">KStateITHelp</h1>\
					<div id="twitterouter" class="centered">\
						<div id="twitterinner">\
							<a class="twitter-timeline" href="https://twitter.com/KStateITHelp" data-widget-id="405803838000484352">Tweets by @KStateITHelp</a>\
							<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?"http":"https";if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>\
						</div>\
					</div>';

var helpdesklHTML ='<h1 class="header">Helpdesk-L</h1>\
					<div id="marqueeUpOuterFrame">\
						<div id="marqueeUpInnerFrame">\
							<div id="topOfScrollPage" style="height: 10px; width 10px; color:pink;"><!--BEGIN--></div>\
							<div id="gmailFrameA"></div>\
							<div id="bottomOfScrollPage" style="height: 10px; width 10px; color:pink;"><!--END--></div>\
							<div id="gmailFrameB"></div>\
						</div>\
					</div>';

var itstatusHTML = '<h1 class="header"><a href="http://www.k-state.edu/its/status/" target="_blank">IT Status</a></h1><div id="mysagscroller2" class="sagscroller"></div>';
var itnewsHTML = '<h1 class="header"><a href="https://blogs.k-state.edu/it-news/" target="_blank">IT News</a></h1><div id="mysagscroller1" class="sagscroller"></div>';
var office365HTML = '<h1 class="header"><a href="http://rss.servicehealth.microsoftonline.com/feed/en-US/E2F545B3FAAD6D986B820C99550126F7/0m--3s/x9duf_/n-dbvo/c8mfak/gk1n7d" target="_blank">Office 365 Administrators</a></h1><div id="mysagscroller3" class="sagscroller"></div>';

var pagesHTML = '<iframe class="innerIframe" style="border: 0;" src="./content/frame_ex_pages.php"></iframe>';
//================================ FRAME HTML (end) ================================//



//================================ FRAME LAYOUT (begin) ================================//
var urlList = Array(); // List of URLs to use for each frame.
// { url: url, frame: frame }

urlList[	'pinger'			] =	{		url: './content/frame_ex_pinger.php', 			frameID: "#frame01", 		singleLoad: true 	};

urlList[	'studentofthemonth'	] =	{		url: './content/studentofthemonth.php', 		frameID: "#frame02", 		singleLoad: false 	};

urlList[	'twitter'			] =	{		html: twitterHTML, 								frameID: "#frame03", 		singleLoad: true 	};

//urlList[	'svcnow1'			] =	{		url: './content/frame_ex_servicenow01.html', 	frameID: "#frame04", 		singleLoad: false 	};

//urlList[	'svcnow2'			] =	{		url: './content/frame_ex_servicenow02.html', 	frameID: "#frame05", 		singleLoad: false 	};

urlList[	'rss_itnews'	] =	{		url: './content/rss_itnews.html', 					frameID: "#frame04", 		singleLoad: false 	};
urlList[	'rss_itstatus'	] =	{		url: './content/rss_itstatus.html', 				frameID: "#frame05", 		singleLoad: false 	};

urlList[	'helpdeskl'			] =	{		html: helpdesklHTML, 							frameID: "#frame06", 		singleLoad: true 	};
//urlList[	'gmail1'			] =	{		url: './content/gmail_content.php', 			frameID: "#gmailFrameA", 	singleLoad: false 	};
//urlList[	'gmail2'			] =	{		url: './content/gmail_content.php', 			frameID: "#gmailFrameB", 	singleLoad: false 	};
urlList[	'gmail1'			] =	{		url: './content/gmail_fake.html', 				frameID: "#gmailFrameA", 	singleLoad: false 	};
urlList[	'gmail2'			] =	{		url: './content/gmail_fake.html', 				frameID: "#gmailFrameB", 	singleLoad: false 	};

//urlList[	'pages'				] =	{		url: './content/frame_ex_pages.php', 			frameID: "#frameMiddle", 	singleLoad: false 	};
urlList[	'pages'				] =	{		html: pagesHTML, 								frameID: "#frameMiddle", 	singleLoad: true 	};


// These have to be written into the HTML of the page or load_rssfeeds.js will not work. Calling load_rssfeeds.js operations as a function after the page loads will crash the page, but I'm not sure why this is.
//urlList[	'itstatus'			] =	{		html: itstatusHTML, 							frameID: "#frame07", 		singleLoad: true 	};
//urlList[	'itnews'			] =	{		html: itnewsHTML, 								frameID: "#frame08", 		singleLoad: true 	};
//urlList[	'office365'			] =	{		html: office365HTML, 							frameID: "#frame09", 		singleLoad: true 	};


//urlList[	'canvas'			] =	{		url: './content/frame_ex_canvas.html', 			frameID: "#frame06" 	};
//================================ FRAME LAYOUT (end) ================================//




// Load/Reload all frames, with option to skip the Pinger, as it will be reloaded separately (and with greater frequency).
function loadAllContentFrames(contentList, isReloading)
{
	for (var key in contentList) {
		if (urlList[key].singleLoad && isReloading) { }
		else loadContentFrame(key);
	}
}

// Load/Reload frame with ID...
function loadContentFrame(urlObjectID)
{
	if(typeof urlList[urlObjectID] == 'undefined')
	{
		console.log(urlObjectID + ' was not found in urlList[] and could not be loaded');
	}
	else if (urlList[urlObjectID].url) // If this frame comes with a URL, load it. If not, do nothing.
	{
		$(urlList[urlObjectID].frameID)		.load(		urlList[urlObjectID].url		 + '?_=' + (new Date()).getTime());
	}
	else if (urlList[urlObjectID].html) // If this frame comes with a URL, load it. If not, do nothing.
	{
		$(urlList[urlObjectID].frameID)		.html(		urlList[urlObjectID].html		);
	}
}

// Get the frame ID of this object
function getContentFrameID(urlObjectID)
{
	if(typeof urlList[urlObjectID] == 'undefined')
	{
		console.log(urlObjectID + ' was not found in urlList[] and could not be returned');
	}
	else if (urlList[urlObjectID].frameID)
	{
		return urlList[urlObjectID].frameID;
	}
	//return null;
	return $('<div></div>'); // !!! ??? Create an element that is not attached to the page so there is no error?
}




var messageCurrentIndex = 0;
var studentSwapInterval;


$.ajaxSetup ({
    // Disable caching of AJAX responses
    cache: false
});



// INITIAL LOAD OF ALL FRAMES.
setTimeout(function(){			// USING setTimeout INSTEAD OF $(document).ready BECAUSE THE DOCUMENT WILL *NEVER* BE READY *UNTIL* THIS CONTENT IS LOADED.

	loadAllContentFrames(urlList, false);

	//loadMyRssFeeds();
	//startAnimatedScrollDown(); // Gmail

	//loadContentFrame('idonotexist');

	reloadAndResizeManagerMessage(0);

	runAfterFirstLoad();
},2000);



// VARIABLE LOADING TIMES FOR DIFFERENT FRAMES.
setInterval(function(){
	loadContentFrame('pinger');
},20000);


setInterval(function(){
	clearInterval(studentSwapInterval);

	loadAllContentFrames(urlList, true);

	reloadAndResizeManagerMessage(messageCurrentIndex);
},300000);




function resizeAndReloadContentList()
{
	//!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?"http":"https";if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

	// WHEN BROWSER WINDOW IS RESIZED, AUTOMATICALLY RELOAD frame_ex_servicenow01.html PAGE. RELOADING CALLS THE RESIZE FUNCTION WITHIN THE frame_ex_servicenow01.html PAGE ITSELF.
	setTimeout(function(){

		//svcnwResize(); // HANDLER FUNCTION FOR RESIZING THE SERVICENOW CHART IS LOCATED IN THE SERVICENOW01 CONTENT FRAME. //$("#frame02").load("./content/frame_ex_servicenow01.html" + '?_=' + (new Date()).getTime()); // THIS PAGE HAS ITS OWN HANDLER FOR PAGE RESIZE EVENT?

		//loadContentFrame('svcnow1');

	}, 500);
	reloadAndResizeManagerMessage(messageCurrentIndex);
}



var messageCurrentIndex = 0;
var managerMessateInterval;
function reloadAndResizeManagerMessage(mindex)
{
	clearInterval(managerMessateInterval);
	$.get("./upload/managerMessage.txt" + '?_=' + (new Date()).getTime(), function(managerMessageData) {
		var items = managerMessageData.split('\n');

		// for (var i = 0; i < items.length; i++) {
		// 	console.log(items[i]);
		// 	if (items[i] == "") {
		// 		items.splice(i--, 1);
		// 	}
		// }

		while (mindex < 0) mindex += items.length;
		if (mindex >= items.length) mindex=0;
		$('#marqueeleftspanid').html(items[mindex])
		messageCurrentIndex = mindex;
		//console.log('Reload Manager Message at: ' + mindex);
		if (items.length > 1)
		{
			managerMessateInterval = setInterval(function(){
				mindex++;
				if (mindex >= items.length) mindex=0;
				$('#marqueeleftspanid').html(items[mindex])
				messageCurrentIndex = mindex;
			}, 10000);
		}


		var originalFontSize = 12;
		$('#sidebar span').css({"font-size" : originalFontSize, "line-height" : originalFontSize/1.2 + "px"});
		var sectionWidth = $('#sidebar').width();
		$('#sidebar span').each(function(){
			var spanWidth = $(this).width() + 10;
			var newFontSize = (sectionWidth/spanWidth) * originalFontSize;
			//document.getElementById("frame02").innerHTML = newFontSize; // FOR DEBUGGING.
			if ( newFontSize > 30 )
			{
				newFontSize = 30;
			}
			$(this).css({"font-size" : newFontSize, "line-height" : newFontSize/1.2 + "px"});
			$(this).css({"top" : "calc(50% - " + $(this).height()/2 + "px)"});
		});

	});
}


// FIXES FOR LOADED ELEMENTS WITH INLINE CSS THAT CAME ALREADY LOADED IN THEM.
//$(document).ready(function(){
function runAfterFirstLoad()
{
	setTimeout(function(){
		$("#twitter-widget-0").css("max-width", "");
		$("#twitter-widget-0").css("width", "100%");

		startAnimatedScrollDown();

		//$.getScript("./sagscroller.js");
		//$.getScript("./load_rssfeeds.js"); //loadMyRssFeeds();
	},3000);
}




// REGISTER ALL CONTENT THAT SHOULD BE RE-LOADED ON PAGE RESIZE HERE.
var windowResizeTimer;
$(window).bind('resize', function()
{
	clearTimeout(windowResizeTimer); // Do nothing until user FINISHES resizing the browser window, otherwise you end up with an insane number of function calls getting added up every second that you are still dragging the window.
	windowResizeTimer = setTimeout(function()
	{
		resizeAndReloadContentList();
	}, 1000);
});
