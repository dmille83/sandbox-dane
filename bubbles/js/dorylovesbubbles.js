//(function() {
// Parse file
//readTextFile("qryExport.txt", beginMapping);
//function beginMapping(data) {

    // Create the canvas
    var canvasSize = 1500; //window.innerWidth; //900;
    var canvasScale = 1; //canvasSize/1400;
    var canvas = document.getElementById('canvasScreenID'); //document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.style.display='inline-block';
    //canvas.style.border='3px dashed black';
	canvas.width = canvasSize;
    canvas.height = canvasSize;
    //canvas.style.margin='auto';
	
	canvas.onclick = function(){
		if (document.getElementById('selectFit').value == "scale") document.getElementById('selectFit').value = "resize";
		else document.getElementById('selectFit').value = "scale";
		
		generateMapSelect(document.getElementById('selectDb').value);
	}
	
	// Math constants / etc
	var TO_RADIANS = Math.PI/180;
	
	var mybubbles = [];
	var rootbubble;
	
	var recursion_degrees = 2;
	var root_bubble_default = "Public";
	
	var xMax, xMin, yMax, yMin;
	xMax = 0;
	xMin = 0;
	yMax = 0;
	yMin = 0;
	
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
		
		// Create divider
		option = document.createElement("option");
		option.text = "";
		option.value = "";
		select.appendChild(option);
		
		// Create divider
		option = document.createElement("option");
		option.text = "----------FRONTENDS-----------------------------------------------------";
		option.value = "";
		select.appendChild(option);
		
		// Add frontend options
		for (var i = 1; i < frontend_list.length; i++) {
			//console.log(backend_list[i]);
			
			if (frontend_list[i].includes(".") > 0) {
				var option = document.createElement("option");
				option.text = frontend_list[i] + " (front) (" + getBackendCount(frontend_list[i]) + ")";
				option.value = frontend_list[i];
				select.appendChild(option);
			}
		}
		
		// URL Parameters
		var params = QueryString();
		if (params["database"] == null) {
			document.getElementById("selectDb").value = "Shared";
		} else {
			document.getElementById("selectDb").value = params["database"];
		}
		if (params["degrees"] == null) {
			document.getElementById("selectRecsv").value = 2;
		} else {
			document.getElementById("selectRecsv").value = params["degrees"];
		}
		
		// Default bubble selected
		root_bubble_default = select.value;
		recursion_degrees = document.getElementById("selectRecsv").value;
		
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
			if (myCSV[i][0] === dbname) {
				backend = spawnNewBubble(myCSV[i][0], 0, 0, true);
				frontend = spawnNewBubble(myCSV[i][1], 0, 0, false);
				
				backend.addLink(frontend);
				frontend.addLink(backend);
			}
			
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
	
	var beenrendered = [];
	var collisionchecklist = [];
	function render() {
		if (document.getElementById('selectDb').value == null || document.getElementById('selectDb').value == '' || document.getElementById('selectDb').value == ' ') return;
		
		ctx.save();
		
		// Render background
		//ctx.fillStyle = "#F4F4F4";
		//ctx.fillRect(0, 0, canvasSize, canvasSize);
		//ctx.fill();
		
		//ctx.scale(canvasScale, canvasScale);
		//ctx.translate((canvasSize/canvasScale)/2, (canvasSize/canvasScale)/2);
		
		// Reset Bubbles
		for (var i = 0; i < mybubbles.length; i++) {
			mybubbles[i].level = 0;
			mybubbles[i].x = 0;
			mybubbles[i].y = 0;
		}
		
		// Render Bubbles
		rootbubble.x = 0;
		rootbubble.y = 0;
		rootbubble.level = 1;
		xMax = 0;
		xMin = 0;
		yMax = 0;
		yMin = 0;
		var recIdx = document.getElementById("selectRecsv").value;
		beenrendered = [];
		collisionchecklist = [];
		rootbubble.setLinkPositions(recIdx);
		preventOverlap();
		
		//if (document.getElementById('selectFit').value === "scale")
		if (false)
		{
			document.getElementById('canvasScreenID').className = "zoom_in";
			
			canvas.width = canvasSize;
			canvas.height = canvasSize;
			
			// Render background
			ctx.fillStyle = "#FFFFFF"; // "#F4F4F4";
			ctx.fillRect(0, 0, canvas.width/canvasScale, canvas.height/canvasScale);
			ctx.fill();
			// Scale content to fit canvas
			//console.log("x=" + (xMax-xMin) + ",y=" + (yMax-yMin));
			if ((xMax-xMin) > canvasSize || (yMax-yMin) > canvasSize) {
				var xScale = canvasSize/(xMax-xMin + 100);
				var yScale = canvasSize/(yMax-yMin + 100);
				if (xScale < yScale) canvasScale = xScale;
				else canvasScale = yScale;
				ctx.scale(canvasScale, canvasScale);
			}
			console.log("scale=" + canvasScale);
			// Midpoint
			ctx.translate(((canvasSize/canvasScale)/2)-(xMax+xMin)/2, ((canvasSize/canvasScale)/2)-(yMax+yMin)/2);
			
		} 
		else 
		{
			document.getElementById('canvasScreenID').className = "zoom_out";
			
			// Scale canvas to fit contents
			//console.log("x=" + (xMax-xMin) + ",y=" + (yMax-yMin));
			canvas.width = (xMax-xMin) + 100;
			canvas.height = (yMax-yMin) + 100;
			// Render background
			ctx.fillStyle = "#FFFFFF"; // "#F4F4F4";
			ctx.fillRect(0, 0, canvas.width/canvasScale, canvas.height/canvasScale);
			ctx.fill();
			// Go to center
			ctx.translate((canvas.width/2)-(xMax+xMin)/2, (canvas.height/2)-(yMax+yMin)/2);
			
		}
		
		
		beenrendered = [];
		rootbubble.renderConnections(ctx, recIdx);
		
		beenrendered = [];
		rootbubble.render(ctx, recIdx);
		
		ctx.restore();
	}
	
	//----------------------------------------------
	// begin building world here
	
	function spawnNewBubble(title, x, y, isbackend) {
		// Prevent duplicates
		var exisBub = getExistingBubble(title);
		if (exisBub) return exisBub;
		
		if (!title.includes(".")) {
			isbackend = true;
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
	
	
	function preventOverlap() {
		
		xMax = 0;
		xMin = 0;
		yMax = 0;
		yMin = 0;
		
		var bump_distance = 30;
		
		// Reposition to prevent overlap
		var bubble1, bubble2;
		for(var i=0; i<collisionchecklist.length; i++) {
			//setTimeout(function(){ 
				
				bubble1 = getExistingBubble(collisionchecklist[i]);
				for(var j=0; j<collisionchecklist.length; j++) {
					if (collisionchecklist[i] !== collisionchecklist[j]) 
					{
						bubble2 = getExistingBubble(collisionchecklist[j]);
						
						if (bubble1.hasOverlap(bubble2) === true)
						{
							console.log("repositioning " + bubble1.title + "(" + bubble1.x + "," + bubble1.y + ") in relation to " + bubble2.title + "(" + bubble2.x + "," + bubble2.y + ")");
							
							// X
							//if (bubble1.y >= bubble2.y) bubble1.y += (bubble1.getHeight() + bubble2.getHeight() + bump_distance);
							//else bubble1.y -= (bubble1.getHeight() + bubble2.getHeight() + bump_distance);
							bubble1.y += (bubble1.getHeight() + bubble2.getHeight() + bump_distance);
							// Y
							if (bubble1.hasOverlap(bubble2) === true)
							{
								//if (bubble1.x >= bubble2.x) bubble1.x += (bubble1.getWidth() + bubble2.getWidth() + bump_distance);
								//else bubble1.x -= (bubble1.getWidth() + bubble2.getWidth() + bump_distance);
								bubble1.x += (bubble1.getWidth() + bubble2.getWidth() + bump_distance);
							}
							
							/*
							// Re-adjust margins of canvas
							var m = 55;
							if (xMax < bubble1.x + bubble1.getWidth()/2) xMax = bubble1.x + bubble1.getWidth()/2 + m;
							if (xMin > bubble1.x - bubble1.getWidth()/2) xMin = bubble1.x - bubble1.getWidth()/2 - m;
							if (yMax < bubble1.y + bubble1.getHeight()/2) yMax = bubble1.y + bubble1.getHeight()/2 + m;
							if (yMin > bubble1.y - bubble1.getHeight()/2) yMin = bubble1.y - bubble1.getHeight()/2 - m;
							*/
							
							// Reset
							j=0;
							//i=0;
						}
						
					}
				}
				
				// Re-adjust margins of canvas
				var m = 55;
				if (xMax < bubble1.x + bubble1.getWidth()/2) xMax = bubble1.x + bubble1.getWidth()/2 + m;
				if (xMin > bubble1.x - bubble1.getWidth()/2) xMin = bubble1.x - bubble1.getWidth()/2 - m;
				if (yMax < bubble1.y + bubble1.getHeight()/2) yMax = bubble1.y + bubble1.getHeight()/2 + m;
				if (yMin > bubble1.y - bubble1.getHeight()/2) yMin = bubble1.y - bubble1.getHeight()/2 - m;
				
			//}, 10);
		}
		
	}
	
	
	
	
	// end building world here
	//----------------------------------------------
	// Render
	//render();
	
//}
//})();