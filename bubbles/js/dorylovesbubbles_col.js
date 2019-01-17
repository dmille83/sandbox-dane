//(function() {
// Parse file
//readTextFile("qryExport.txt", beginMapping);
//function beginMapping(data) {

    // Create the canvas
    var canvasSize = 800; //8000; //window.innerWidth; //900;
    var canvasScale = 1; //canvasSize/1400;
    var canvas = document.getElementById('canvasScreenID'); //document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    //canvas.style.display='inline-block';
	//canvas.style.border='3px dashed black';
	canvas.width = canvasSize;
    canvas.height = 8000;
    //canvas.style.margin='auto';
	
	var yB = 0, yF = 0;
	
	// Math constants / etc
	var TO_RADIANS = Math.PI/180;
	
	var mybubbles = [];
	var renderedbubbles = [];
	var rootbubble;
	
	var backends_on_left = false;
	var recursion_degrees = 2;
	var root_bubble_default = "Public";
	
	var xMax, xMin, yMax, yMin;
	xMax = 0;
	xMin = 0;
	yMax = 0;
	yMin = 0;
	
	var yRowOffset = 40;
	
	function generateSelect(inputID, backend_list, frontend_list) {
		var select = document.getElementById(inputID);
		
		// Remove options
		while (select.length > 0) {
			select.remove(0);
		}
		
		// Sort alphabetically
		backend_list.sort();
		frontend_list.sort();
		
		// Create divider
		option = document.createElement("option");
		option.text = "";
		option.value = "";
		select.appendChild(option);
		
		// Create divider
		option = document.createElement("option");
		option.text = "----------BACKENDS-----------------------------------------------------";
		option.value = "";
		select.appendChild(option);
		
		// Add root DB options
		for (var i = 1; i < backend_list.length; i++) {
			//console.log(backend_list[i]);
			
			var option = document.createElement("option");
			option.text = backend_list[i] + " (back) (" + getFrontendCount(backend_list[i]) + ")";
			option.value = backend_list[i];
			select.appendChild(option);
		}
		
		// Create divider
		option = document.createElement("option");
		option.text = "";
		option.value = "";
		select.appendChild(option);
		select.appendChild(option);
		
		// Create divider
		option = document.createElement("option");
		option.text = "----------FRONTENDS-----------------------------------------------------";
		option.value = "";
		select.appendChild(option);
		
		// Add frontend options
		for (var i = 1; i < frontend_list.length; i++) {
			//console.log(backend_list[i]);
			
			var option = document.createElement("option");
			option.text = frontend_list[i] + " (front) (" + getBackendCount(frontend_list[i]) + ")";
			option.value = frontend_list[i];
			select.appendChild(option);
		}
		
		// URL Parameters
		var params = QueryString();
		if (params["database"] == null) {
			document.getElementById("selectDb").value = "Public";
		} else {
			document.getElementById("selectDb").value = params["database"];
		}
		if (params["degrees"] == null) {
			document.getElementById("selectRecsv").value = 2;
		} else {
			document.getElementById("selectRecsv").value = params["degrees"];
		}
		if (params["side"] == null) {
			document.getElementById("selectSide").value = "right";
		} else {
			document.getElementById("selectSide").value = params["side"];
		}
		
		// Default bubble/options selected
		root_bubble_default = select.value;
		recursion_degrees = document.getElementById("selectRecsv").value;
		if (document.getElementById("selectSide").value == "right") {
			backends_on_left = false;
		} else {
			backends_on_left = true;
		}
		
	}
	
	function generateMapSelect() {
		var dbname = document.getElementById('selectDb').value;
		if (dbname === null || dbname === '') return;
		document.getElementById('processing').style.display = "inline-block";
		setTimeout(function(){ 
			
			generateMap(dbname);
			// Render
			render();
			
			document.getElementById('processing').style.display = "none";
		}, 10);
	}
	
	// Generate bubble map
	function generateMap(dbname) {
		var backend, frontend;
		mybubbles = [];
		
		for (var i=0; i<myCSV.length; i++) 
		{
			//if (myCSV[i][0] === dbname) {
				backend = spawnNewBubble(myCSV[i][0], true);
				frontend = spawnNewBubble(myCSV[i][1], false);
				
				backend.addLink(frontend);
				frontend.addLink(backend);
			//}
		}
		
		rootbubble = getExistingBubble(dbname);
		//console.log(rootbubble.title);
		
		
		return; // END HERE
		/*
		if (dbname) { console.log("rendering: " + dbname); }
		
		// Empty bubbles array
		mybubbles = [];
		
		var newback = spawnNewBubble(dbname, 0, 0, true);
		newback.parseLinks(myCSV, document.getElementById("selectRecsv").value);
		*/
	}
	
	function render() {
		if (document.getElementById('selectDb').value == null || document.getElementById('selectDb').value == '' || document.getElementById('selectDb').value == ' ') return;
		
		recursion_degrees = document.getElementById("selectRecsv").value;
		
		ctx.save();
		
		// Reset Bubbles
		for (var i = 0; i < mybubbles.length; i++) {
			mybubbles[i].level = 0;
			mybubbles[i].x = 0;
			mybubbles[i].y = 0;
			mybubbles[i].rendered = false;
		}
		
		// Render Bubbles
		rootbubble.x = 0;
		rootbubble.y = 0;
		rootbubble.level = 1;
		
		xMax = 0;
		yMax = 0;
		yB = 35;
		yF = 35;
		
		// WHITE BACKGROUND
		var x = window.innerWidth - 50;
		if (yB < yF) var y = yF;
		else var y = yB
		canvas.width = x; //xMax;
		canvas.height = 4000; //y + 1000; //yMax;
		ctx.fillStyle = "#FFFFFF"; // "#F4F4F4";
		ctx.fillRect(0, 0, canvas.width/canvasScale, canvas.height/canvasScale);
		ctx.fill();
		ctx.translate(0, 0); // Go to top-left
		
		// COLUMN HEADERS
		ctx.font = "bold 12px Tahoma"; //"bold 12px Georgia";
		ctx.lineWidth = 0.5;
		ctx.globalAlpha = 1.0;
		ctx.fillStyle = "black";
		ctx.textAlign = "left"; 
		if (backends_on_left == true) {
			ctx.fillText("BACKEND DATABASES", 10, 15);
			ctx.fillText("FRONTEND APPLICATIONS", canvas.width - 310, 15);
		} else {
			ctx.fillText("FRONTEND APPLICATIONS", 10, 15);
			ctx.fillText("BACKEND DATABASES", canvas.width - 310, 15);
		}
		ctx.fill();
		ctx.stroke();
		
		renderedbubbles = [];
		rootbubble.setPosition();
		rootbubble.render(ctx);
		
		ctx.restore();
	}
	
	//----------------------------------------------
	// begin building world here
	
	function spawnNewBubble(title, isbackend) {
		// Prevent duplicates
		var exisBub = getExistingBubble(title);
		if (exisBub) return exisBub;
		
		var x = 0, y = 0;
		
		if (isbackend == true) {
			yB += 20;
			x = 20;
			y = yB;
		}
		
		if (isbackend == false) {
			yF += 20;
			x = 500;
			y = yF;
		}
		
		// Make new Bubble
		var newbubble = new Bubble(title, x, y, isbackend);
		mybubbles.push(newbubble);
		return newbubble;
	}
	// EXAMPLES:
	//var newbubble = spawnNewBubble('My Frontend', 250, 300);
	//newbubble.addLink(spawnNewBubble('My DB 1', 450, 150));
	//newbubble.addLink(spawnNewBubble('My DB 2', 650, 500));
	
	function getExistingBubble(title) {
		for(var i=0; i<mybubbles.length; i++) {
			if (mybubbles[i].title == title) {
				//console.log(mybubbles[i].title + " exists");
				return mybubbles[i];
			}
		}
	}
	
	function inArray(needle,haystack)
	{
		var count=haystack.length;
		for(var i=0;i<count;i++)
		{
			if(haystack[i]===needle){return true;}
		}
		return false;
	}
	
	function getAngle(x1, y1, x2, y2)
	{
		//console.log("y2: " + y2 + " y1: " + y1 + " x2: " + x2 + " x1: " + x1);

		// angle in degrees (0 at top)
		return -((Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI) - 90);
	}
	
	function getFrontendCount(dbname) {
		var dbcount = 0;
		for (var i=0; i<myCSV.length; i++) {
			//console.log(myCSV[i][0] + ", " + myCSV[i][1]);			
			if (myCSV[i][0] == dbname || !dbname) {
				dbcount += 1;
			}
		}
		return dbcount;
	}
	
	function getBackendCount(dbname) {
		var dbcount = 0;
		for (var i=0; i<myCSV.length; i++) {
			//console.log(myCSV[i][0] + ", " + myCSV[i][1]);			
			if (myCSV[i][1] == dbname || !dbname) {
				dbcount += 1;
			}
		}
		return dbcount;
	}
	
	
	
	//------------
	// Parse file
	var myfiletxt = "";
	var myCSV = [];
	//readTextFile("list.txt", fileLoaded);
	window.onload = function () {
		fileLoaded(document.getElementById('myFile').innerHTML);
	};
	
	// Process file contents
	function fileLoaded(data) {
		//console.log(data);
		myfiletxt = data;
		
		//$("#myFile").text(myfiletxt);
		
		myCSV = CSVToArray(myfiletxt);
		//console.log(myCSV);
		//console.log(myCSV[0][0] + ", " + myCSV[0][1]);
		
		// Create select options
		var backend = "";
		var backend_list = [];
		for (var i=0; i<myCSV.length-1; i++) {
			if (backend !== myCSV[i][0]) {
				backend = myCSV[i][0];
				//if (!inArray(backend, backend_list)) backend_list.push(backend);
				if (!inArray(backend, backend_list)) backend_list[backend_list.length] = backend;
			}
		}
		
		// Add frontend options
		var frontend = "";
		var frontend_list = [];
		for (var i=0; i<myCSV.length-1; i++) {
			if (frontend !== myCSV[i][1]) {
				frontend = myCSV[i][1];
				if (!inArray(frontend, frontend_list)) frontend_list[frontend_list.length] = frontend;
			}
		}
		
		generateSelect("selectDb", backend_list, frontend_list);
		
		generateMap(document.getElementById("selectDb").value);
		
		// Render
		render();
		
		document.getElementById('processing').style.display = "none";
	}
	//------------
	
	
	// end building world here
	//----------------------------------------------
	// Render
	//render();
	
//}
//})();