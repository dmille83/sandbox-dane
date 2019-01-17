window.Bubble = Bubble;


function Bubble(title, x, y, isbackend, parentbubble)
{
	this.title = new String(title);
	this.isbackend = isbackend;
	this.parentbubble = parentbubble;
	
	// Position
	this.x = x;
	this.y = y;
	
	this.radius = 50; //50;
	
	this.level = 1;
	//if (parentbubble) this.level = parentbubble.level + 1;
	
	// SOURCE:  http://stackoverflow.com/questions/1152024/best-way-to-generate-a-random-color-in-javascript
	if (this.isbackend === true) this.lineColor = '#99ffcc';
	else {
		this.lineColor = '#000000';
		while (this.lineColor == '#000000' || this.lineColor == '#FFFFFF' || this.lineColor == '#99ffcc' || this.lineColor.length < 7) {
			// beware 5-digit colors in the rare instance that random() == 0
			//if (this.lineColor.length < 7) console.log('color hex ' + this.lineColor + ' is too short! (' + this.title + ')'); 
			this.lineColor = "#"+((1<<24)*Math.random()|0).toString(16);
			
			//this.lineColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
			//this.lineColor = '#'+Math.floor(Math.random() * 16777216).toString(16);
			//this.lineColor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
			//this.lineColor = 'rgb(' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ')';
			
		}
	}
	
	this.links = [];
	//this.lines = [];
}


// ====== GET AND SET ======
Bubble.prototype.addLink = function(nwLnk){
	this.links.push(nwLnk);
	//this.lines.push(nwLnk);
};
//Bubble.prototype.addLine = function(nwLnk){
//	this.lines.push(nwLnk);
//};
Bubble.prototype.getWidth = function(){
	//return this.title.width("bold 12px Georgia") + 10;
	//return ctx.measureText(this.title).width,10,50)
	
	var myTitle = this.title;
	return this.title.width(ctx.font) + 10;
};
Bubble.prototype.getHeight = function(){
	return this.title.height("bold 12px Georgia") * (3/2);
};

Bubble.prototype.renderConnections = function(ctx, recIdx){
	
	beenrendered.push(this.title);
	
	//ctx.globalAlpha = 0.5;
	ctx.globalAlpha = 1.0;
	
	recIdx -= 1;
	//console.log(recIdx);
	if (recIdx >= 0) {
		// Render Bubble connections
		for(var i=0; i<this.links.length; i++) {
			
			//if (!this.isbackend) { 
				
				/*
				if (inArray(this.links[i].title, beenrendered)) {
					// Use lighter colors for lines to DBs in other branches
					ctx.strokeStyle = '#d9d9d9';
					ctx.fillStyle = 'rgba(217, 217, 217, 0.9)';
					ctx.lineWidth = 0.5;
				} else {
					// Use a unique color for lines to immediate (new) relations
					ctx.strokeStyle = this.links[i].lineColor;
					ctx.fillStyle = this.links[i].lineColor;
					ctx.lineWidth = 1.0;
				}
				*/
				
				// Use a unique color for lines to immediate (new) relations
				if (this.isbackend === true) {
					
					ctx.strokeStyle = this.links[i].lineColor;
					ctx.fillStyle = this.links[i].lineColor;
					
					// wedge
					var xOffset = 5;
					var yOffset = -5;
					//if (this.x >= this.links[i].x) yOffset = 5;
					ctx.beginPath();
					ctx.moveTo(this.x, this.y);
					ctx.lineTo(this.links[i].x + yOffset, this.links[i].y)
					ctx.lineTo(this.links[i].x - yOffset, this.links[i].y)
					ctx.lineTo(this.x, this.y)
					ctx.fill();
					
					yOffset = 5;
					ctx.beginPath();
					ctx.moveTo(this.x, this.y);
					ctx.lineTo(this.links[i].x, this.links[i].y + yOffset)
					ctx.lineTo(this.links[i].x, this.links[i].y - yOffset)
					ctx.lineTo(this.x, this.y)
					ctx.fill();
					
					ctx.beginPath();
					ctx.rect(this.links[i].x - yOffset, this.links[i].y - yOffset, yOffset * 2, yOffset * 2);
					ctx.fill();
					
				} else {
					
					ctx.strokeStyle = this.lineColor;
					ctx.fillStyle = this.lineColor;
					
					// wedge
					var xOffset = 5;
					var yOffset = -5;
					//if (this.links[i].x >= this.x) yOffset = 5;
					ctx.beginPath();
					ctx.moveTo(this.links[i].x, this.links[i].y);
					ctx.lineTo(this.x + yOffset, this.y)
					ctx.lineTo(this.x - yOffset, this.y)
					ctx.lineTo(this.links[i].x, this.links[i].y)
					ctx.fill();
					
					yOffset = 5;
					ctx.beginPath();
					ctx.moveTo(this.links[i].x, this.links[i].y);
					ctx.lineTo(this.x, this.y + yOffset)
					ctx.lineTo(this.x, this.y - yOffset)
					ctx.lineTo(this.links[i].x, this.links[i].y)
					ctx.fill();
					
					ctx.beginPath();
					ctx.rect(this.x - yOffset, this.y - yOffset, yOffset * 2, yOffset * 2);
					ctx.fill();
					
				}
				
			//}
			
			if (!inArray(this.links[i].title, beenrendered)) {
				//this.links[i].level = this.level + 1;
				this.links[i].renderConnections(ctx, recIdx);
				//this.links[i].render(ctx, recIdx);
			}
			//this.render(ctx, recIdx);
		}
		
	}
	
};

Bubble.prototype.render = function(ctx, recIdx){
	
	beenrendered.push(this.title);
	
	recIdx -= 1;
	//console.log(recIdx);
	
	if (recIdx >= 0) {
		// Render Linked Bubbles
		for(var i=0; i<this.links.length; i++) {
			if (!inArray(this.links[i].title, beenrendered)) {
				//this.links[i].level = this.level + 1;
				this.links[i].render(ctx, recIdx);
			}
		}
	}
	
	// Render Bubble
	ctx.font = "bold 12px Tahoma"; //"bold 12px Georgia";
	ctx.lineWidth = 0.5;
	ctx.globalAlpha = 1.0;
	
	// Get Title
	var myTitle = this.title; // + " (" + (this.level) + ")";
	var xTxt = this.getWidth();
	var yTxt = this.getHeight(); //this.title.height(ctx.font) * (3/2); //20;
	
	// Special highlight around root
	if (this.level == 1 && recIdx >= 2) {
		/*
		var lvl1margin = 5;
		ctx.beginPath();
		ctx.strokeStyle = '#0000FF'; //'#00ad2e';
		ctx.lineWidth = 4.0;
		ctx.rect(this.x - (xTxt/2) - lvl1margin, this.y - (yTxt * 2/3) - lvl1margin, xTxt + (lvl1margin*2), yTxt + (lvl1margin*2));
		//roundRect(ctx, this.x - (xTxt/2) - lvl1margin, this.y - (yTxt * 2/3) - lvl1margin, xTxt + (lvl1margin*2), yTxt + (lvl1margin*2), 10, true);
		ctx.stroke();
		*/
		
		var lvl1margin = 5;
		ctx.beginPath();
		ctx.strokeStyle = '#ffff00'; //'#00ad2e';
		ctx.lineWidth = 4.0;
		//ctx.rect(this.x - (xTxt/2) - lvl1margin, this.y - (yTxt * 2/3) - lvl1margin, xTxt + (lvl1margin*2), yTxt + (lvl1margin*2));
		roundRect(ctx, this.x - (xTxt/2) - lvl1margin, this.y - (yTxt * 2/3) - lvl1margin, xTxt + (lvl1margin*2), yTxt + (lvl1margin*2), 10, true);
		ctx.stroke();
	}
	
	/*
	// Default colors
	ctx.strokeStyle = '#d9d9d9';
	ctx.fillStyle = '#d9d9d9';
	if (this.parentbubble) {
		//ctx.strokeStyle = this.parentbubble.lineColor;
		//ctx.fillStyle = this.parentbubble.lineColor;
	}
	
	// Get color at pixel (TODO: is this guaranteed to work?)
	var colordata = ctx.getImageData(this.x, this.y, 1, 1).data;
	var pixelcolor = 'rgb(' + colordata[0] + ',' + colordata[1] + ',' + colordata[2] + ')';
	ctx.strokeStyle = pixelcolor;
	ctx.fillStyle = pixelcolor;
	*/
	
	// TODO: assigning from this.lineColor sometimes fails for no apparent reason? (BAD HEX CODE GENERATED, 1 CHAR SHORT!)
	// Personal color of this Bubble
	ctx.fillStyle = this.lineColor;
	ctx.strokeStyle = this.lineColor;
	
	// I don't remember what this was for
	//if (this.parentbubble && this.links.length == 0) ctx.strokeStyle = this.parentbubble.lineColor;
	//if (this.parentbubble && this.links.length == 0) ctx.fillStyle = this.parentbubble.lineColor;
	
	//if (this.parentbubble) console.log('parent of ' + this.title + ' is ' + this.parentbubble.title + ', color is ' + this.lineColor);
	
	if (this.lineColor !== ctx.fillStyle) console.log('missing color: ' + this.lineColor);
	
	ctx.beginPath();
	if (this.isbackend == true) {
		// Rim in dark blue
		ctx.strokeStyle = '#0000FF';
		ctx.lineWidth = 2.0;
		ctx.rect(this.x - (xTxt/2), this.y - (yTxt * 2/3), xTxt, yTxt);
	} else {
		// Rounded rectangle
		roundRect(ctx, this.x - (xTxt/2), this.y - (yTxt * 2/3), xTxt, yTxt, 10, true);
	}
	ctx.fill();
	ctx.stroke();
	
	// Render title
	ctx.beginPath();
	//if (colorisdark(this.lineColor) > 200) ctx.fillStyle = "black";
	if (colorisdark(ctx.fillStyle) > 200) ctx.fillStyle = "black";
	else ctx.fillStyle = "white";
	ctx.textAlign = "center"; 
	ctx.fillText(myTitle, this.x, this.y);
	
};


// ====== AUTOMATE ======
Bubble.prototype.getHasLink = function(dbname, arrFound){
	//if (this.title === dbname) return true; // redundant, but there for safety
	if (this.title === dbname) return this; // redundant, but there for safety
	if (!arrFound) arrFound = [];
	for(var i=0; i < this.links.length; i++) {
		if (this.links[i].title == dbname) {
			//return true;
			return this.links[i];
		} else {
			if (!inArray(this.links[i].title, arrFound)) {
				if (this.links[i].getHasLink(dbname, arrFound) == true) {
					return true;
				} else {
					//console.log(dbname + " not found in " + this.links[i].title);
				}
			}
		}
	}
	return false;
};

/*
Bubble.prototype.parseLinks = function(myCSV, maxIters, rcsvIters){
	if (!rcsvIters) rcsvIters = maxIters;
	//console.log("interval " + rcsvIters + "/" + maxIters);
	
	// Add orbitals
	for (var i=0; i<myCSV.length; i++) {
		
		var frontend = "";
		if (this.isbackend && myCSV[i][0] == this.title) {
			// Add frontend apps
			frontend = myCSV[i][1];
		} else if (this.isbackend == false && myCSV[i][1] == this.title) {
			// Add backend apps
			frontend = myCSV[i][0];
		}
		if (this.parentbubble && frontend == this.parentbubble.title) {
			//console.log(this.parentbubble.title);
			frontend = "";
		}
		var exsLink = mybubbles[0].getHasLink(frontend);
		if (exsLink) {
			console.log("skipping " + frontend);
			this.addLine(exsLink);
			frontend = "";
		}
		
		
		//if (myCSV[i][0] == this.title) {
		if (frontend !== "") {
			//console.log(myCSV[i][0] + ", " + myCSV[i][1]);
			
			var newfront = new Bubble(frontend, 0, 0, !this.isbackend, this);
			
			this.addLink(newfront);
			
			// Parse next generation
			if (rcsvIters > 1) {
				//console.log("interval " + rcsvIters + "/" + maxIters);
				rcsvIters -= 1;
				newfront.parseLinks(myCSV, maxIters, rcsvIters);
				//newfront.parseLinks(myCSV, rcsvIters);
			}
			
		}
	}
	
};
*/


Bubble.prototype.setLinkPositions = function(recIdx = 0){
	
	//this.parentbubble = myparent;
	
	if (recIdx > 0) {
		recIdx -= 1;
		if (recIdx < 0) return;
	}
	
	beenrendered.push(this.title);
	if (!inArray(this.title, collisionchecklist)) collisionchecklist.push(this.title);
	
	/*
	// Check for overlap
	for(var j=0; j<collisionchecklist.length; j++)
	{
		if (this.title !== collisionchecklist[j]) 
		{
			var bubble2 = getExistingBubble(collisionchecklist[j]);
			if (this.hasOverlap(bubble2) === true)
			{
				
				console.log("repositioning " + this.title + "(" + this.x + "," + this.y + ") in relation to " + bubble2.title + "(" + bubble2.x + "," + bubble2.y + ")");
				
				// X
				if (this.y >= bubble2.y) this.y += (this.getHeight() + bubble2.getHeight() + 15);
				else this.y -= (this.getHeight() + bubble2.getHeight() + 15);
				// Y
				if (this.hasOverlap(bubble2) === true)
				{
					if (this.x >= bubble2.x) this.x += (this.getWidth() + bubble2.getWidth() + 15);
					else this.x -= (this.getWidth() + bubble2.getWidth() + 15);
				}
			}
		}
	}
	// Adjust canvas margins
	var m = 55;
	if (xMax < this.x + this.getWidth()/2) xMax = this.x + this.getWidth()/2 + m;
	if (xMin > this.x - this.getWidth()/2) xMin = this.x - this.getWidth()/2 - m;
	if (yMax < this.y + this.getHeight()/2) yMax = this.y + this.getHeight()/2 + m;
	if (yMin > this.y - this.getHeight()/2) yMin = this.y - this.getHeight()/2 - m;
	*/
	
	
	// Determine spread of orbitals
	var alternate = 1;
	var startAngle = 0;
	if (this.parentbubble) startAngle += getAngle(this.x, this.y, this.parentbubble.x, this.parentbubble.y) + 180;
	//console.log(this.title + " start at (" + startAngle + ")");
	var incrAngle = 0;
	var incrSegs = this.links.length;
	if (this.level !== 1) incrSegs *= 2; //3;
	//if (this.parentbubble) incrSegs += 1;
	if (incrSegs > 0) incrAngle = 360 / incrSegs;
	var orbitDist = 100; // 300 / this.level;
	if (recIdx > 0) orbitDist = 100 * (recIdx + 1);
	if (incrAngle <= 15) orbitDist = 55 / Math.sin(incrAngle * TO_RADIANS);
	//orbitDist = 10;
	
	var curAngle = startAngle;
	
	
	
	// Set positions
	for(var i=0; i<this.links.length; i++) {
		//if (this.links[i].title !== myparent.title) {
		if (!inArray(this.links[i].title, collisionchecklist)) {
			collisionchecklist.push(this.links[i].title);
			
			if (this.links[i].level == 0) this.links[i].level = this.level + 1;
			this.links[i].parentbubble = this;
			
			alternate *= -1;
			var myDist = orbitDist;
			//if (alternate == -1) myDist *= (3/2);
			//if (incrAngle <= 15 && alternate == -1) myDist *= (3/2);
			if (this.links[i].links.length > 0) {
				if (recIdx - 1 >= 0) {
					//myDist *= 2;
				}
			}
			
			if (this.level === 1) curAngle = ((incrAngle * (i)) + startAngle)
			else 
			{
				// Back and forth at increasing angles, pointed mostly away from the center
				if (alternate == -1) curAngle = (incrAngle * (i) * alternate) + startAngle;
				else curAngle = (incrAngle * (i-1) * alternate) + startAngle;
			}
			//console.log(this.links[i].title + " (" + curAngle + ")");
			
			this.links[i].x = this.x + Math.sin(curAngle * TO_RADIANS) * myDist;
			this.links[i].y = this.y + Math.cos(curAngle * TO_RADIANS) * myDist;
			
			/*
			// Check for overlap
			for(var j=0; j<collisionchecklist.length; j++)
			{
				if (this.links[i].title !== collisionchecklist[j]) 
				{
					var bubble2 = getExistingBubble(collisionchecklist[j]);
					if (this.links[i].hasOverlap(bubble2) === true)
					{
						
						console.log("repositioning " + this.links[i].title + "(" + this.links[i].x + "," + this.links[i].y + ") in relation to " + bubble2.title + "(" + bubble2.x + "," + bubble2.y + ")");
						
						// X
						if (this.links[i].y >= bubble2.y) this.links[i].y += (this.links[i].getHeight() + 15);
						else this.links[i].y -= (this.links[i].getHeight() + 15);
						// Y
						if (this.links[i].hasOverlap(bubble2) === true)
						{
							if (this.links[i].x >= bubble2.x) this.links[i].x += (this.links[i].getWidth() + 15);
							else this.links[i].x -= (this.links[i].getWidth() + 15);
						}
					}
				}
			}
			*/
			
			// Adjust canvas margins
			var m = 55;
			if (xMax < this.links[i].x + this.links[i].getWidth()/2) xMax = this.links[i].x + this.links[i].getWidth() + m;
			if (xMin > this.links[i].x - this.links[i].getWidth()/2) xMin = this.links[i].x - this.links[i].getWidth() - m;
			if (yMax < this.links[i].y + this.links[i].getHeight()/2) yMax = this.links[i].y + this.links[i].getHeight() + m;
			if (yMin > this.links[i].y - this.links[i].getHeight()/2) yMin = this.links[i].y - this.links[i].getHeight() - m;
			

		}
	}
	
	
	// Recursion
	if (recIdx > 0) {
		for(var i=0; i<this.links.length; i++) {
			if (!inArray(this.links[i].title, beenrendered)) {
				this.links[i].setLinkPositions(recIdx);
			}
		}
	}
	
};


/*
Bubble.prototype.hasOverlap = function(bubble2){
	if (
		(
			(this.x + this.getWidth() > bubble2.x - bubble2.getWidth())
			&& 
			(bubble2.x - bubble2.getWidth() > this.x + this.getWidth())
		)
		&& 
		(
			(this.y + this.getHeight() > bubble2.y - bubble2.getHeight())
			&& 
			(bubble2.y - bubble2.getHeight() > this.y + this.getHeight())
		)
	) {
		return true;
	}
	return false;
};
*/


Bubble.prototype.hasOverlap = function(bubble2){
	var rec1 = { x: this.x - this.getWidth()/2, y: this.y - this.getHeight()/2, width: this.getWidth(), height: this.getHeight() };
	var rec2 = { x: bubble2.x - bubble2.getWidth()/2, y: bubble2.y - bubble2.getHeight()/2, width: bubble2.getWidth(), height: bubble2.getHeight() };
	if (hasOverlap(rec1, rec2) > 0) return true;
	return false;
};