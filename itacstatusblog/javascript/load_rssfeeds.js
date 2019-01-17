/***********************************************
* SAG Content Scroller- © Dynamic Drive DHTML code library (www.dynamicdrive.com)
* Visit http://www.dynamicDrive.com for hundreds of DHTML scripts
* This notice must stay intact for legal use
***********************************************/

// Source:  http://www.htmlgoodies.com/beyond/css/displaying-rss-feeds-with-xhtml-css-and-jquery.html
// Source:  http://www.dynamicdrive.com/dynamicindex2/sagscroller_suppliment.htm

//var sagscroller1;
//var sagscroller2;
//var sagscroller3;

//function loadMyRssFeeds() {
//$(document).ready(function (){
	//setTimeout(function(){

	var sagscroller1=new sagscroller({
		id:'mysagscroller1',
		mode: 'manual',
		//navpanel:{show:false},
		rssdata:{
			feeds: [
				['IT News', 'http://blogs.k-state.edu/it-news/feed/']
			],
			linktarget: '_new',
			displayoptions: 'label datetime',
		 groupbylabel: true,
			entries: 20 //<--no comma following last option
		},
		pause: 2500,
		animatespeed: 400 //<--no comma following last option
	});

	var sagscroller2=new sagscroller({
		id:'mysagscroller2',
		mode: 'manual',
		//navpanel:{show:false},
		rssdata:{
			feeds: [
				['IT Status', 'http://www.k-state.edu/its/status/status.xml']
			],
			linktarget: '_new',
			displayoptions: 'datetime',
		 groupbylabel: true,
			entries: 20 //<--no comma following last option
		},
		pause: 2500,
		animatespeed: 400 //<--no comma following last option
	});


	var sagscroller3=new sagscroller({
		id:'mysagscroller3',
		mode: 'manual',
		//navpanel:{show:false},
		rssdata:{
			feeds: [
				['Office 365 Administrators', 'http://rss.servicehealth.microsoftonline.com/feed/en-US/E2F545B3FAAD6D986B820C99550126F7/0m--3s/x9duf_/n-dbvo/c8mfak/gk1n7d']
			],
			linktarget: '_new',
			displayoptions: 'datetime',
		 groupbylabel: true,
			entries: 20 //<--no comma following last option
		},
		pause: 2500,
		animatespeed: 400 //<--no comma following last option
	});

	//}, 1000);
//}


