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
	
	this.level = 0;
	//this.rendered = false;
	//if (parentbubble) this.level = parentbubble.level + 1;
	
	// SOURCE:  http://stackoverflow.com/questions/1152024/best-way-to-generate-a-random-color-in-javascript
	//if (this.isbackend !== backends_on_left) this.lineColor = '#99ffcc';
	//else {
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
	//}
	
	this.links = [];
	//this.lines = [];
}


// ====== GET AND SET ======
Bubble.prototype.addLink = function(nwLnk){
	//console.log(this.title + ", " + nwLnk.title);
	this.links.push(nwLnk);
	//this.lines.push(nwLnk);
};
//Bubble.prototype.addLine = function(nwLnk){
//	this.lines.push(nwLnk);
//};
Bubble.prototype.getWidth = function(){
	//return this.title.width(ctx.font) + 10;
	return 300;
};
Bubble.prototype.getHeight = function(){
	return this.title.height("bold 12px Georgia") * (3/2);
};


Bubble.prototype.setPosition = function(){
	
	this.x = canvas.width - 310;
	if (this.isbackend == backends_on_left) {
		this.x = 10;
		this.y = yB;
		yB += this.getHeight() + yRowOffset;
	} else {
		this.x = canvas.width - 310;
		this.y = yF;
		yF += this.getHeight() + yRowOffset;
	}
	
	if (this.y + 100 > canvas.height) {
		canvas.height = this.y + 100;
	}
	
};


Bubble.prototype.render = function(ctx){
	
	if (this.level-1 > recursion_degrees) return;
	if (this.rendered == true) return;
	this.rendered = true;
	
	// POSITION
	this.setPosition();
	
	console.log(this.title + ", " + this.level + "/" + recursion_degrees);
	for(var i=0; i<this.links.length; i++) {
		console.log("    " + this.title + ", " + this.links[i].title);
	}
	
	// RENDER BUBBLE
	
	ctx.font = "bold 12px Tahoma"; //"bold 12px Georgia";
	ctx.lineWidth = 0.5;
	ctx.globalAlpha = 1.0;
	
	// Get Title
	var myTitle = this.title; // + " (" + (this.level) + ")";
	var xTxt = this.getWidth(); // + 20;
	var yTxt = this.getHeight(); //this.title.height(ctx.font) * (3/2); //20;
	
	// FOR DEBUGGING
	//myTitle = this.title + " (" + (this.level) + ")"; xTxt = this.getWidth() + 20;
	
	// Special highlight around root
	if (this.level == 1) {
		var lvl1margin = 5;
		ctx.beginPath();
		//ctx.fillStyle = this.lineColor;
		//ctx.fillStyle = "rgba(0, 0, 0, 0.0)";
		ctx.strokeStyle = '#ffff00'; //'#00ad2e';
		ctx.lineWidth = 4.0;
		if (this.isbackend == true) {
			ctx.rect(this.x - lvl1margin, this.y - lvl1margin, xTxt + (lvl1margin*2), yTxt + (lvl1margin*2));
		} else {
			roundRect(ctx, this.x - lvl1margin, this.y - lvl1margin, xTxt + (lvl1margin*2), yTxt + (lvl1margin*2), 10, true);
		}
		//ctx.fill();
		ctx.stroke();
	}
	
	
	// Personal color of this Bubble
	ctx.fillStyle = this.lineColor;
	ctx.strokeStyle = this.lineColor;
	
	if (this.lineColor !== ctx.fillStyle) console.log('missing color: ' + this.lineColor);
	
	ctx.beginPath();
	if (this.isbackend) {
		// Rim in dark blue
		ctx.strokeStyle = '#0000FF';
		ctx.lineWidth = 2.0;
		ctx.rect(this.x, this.y, xTxt, yTxt);
	} else {
		// Rounded rectangle
		roundRect(ctx, this.x, this.y, xTxt, yTxt, 10, true);
	}
	ctx.fill();
	//ctx.stroke();
	
	// Render title
	ctx.beginPath();
	if (colorisdark(ctx.fillStyle) > 200) ctx.fillStyle = "black";
	else ctx.fillStyle = "white";
	ctx.textAlign = "left"; 
	ctx.fillText(myTitle, this.x + 5, this.y + this.getHeight() * (2/3));
	
	
	// RECURSION
	
	ctx.globalAlpha = 1.0;
	
	// SET LEVELS FOR ALL IMMEDIATE SUBORDINATES FIRST
	for(var i=0; i<this.links.length; i++) {
		if (this.links[i].level == 0) {
			this.links[i].level = this.level + 1;
		}
	}
		
	// RENDER LINES FOR LINKS
	for(var i=0; i<this.links.length; i++) {
		
		// RENDER BUBBLES
		this.links[i].render(ctx);
		
		if (this.links[i].rendered == true && this.links[i].level > this.level) {
			
			var meY, meX, themY, themX;
			
			if (this.links[i].level > this.level || this.isbackend == true) {
				ctx.strokeStyle = this.lineColor;
				ctx.fillStyle = this.lineColor;
			} else {
				ctx.strokeStyle = this.links[i].lineColor;
				ctx.fillStyle = this.links[i].lineColor;
			}
			
			if (this.isbackend == backends_on_left) {
				meX = this.x + (this.getWidth()-1);
				themX = this.links[i].x + 1;
			} else {
				meX = this.x + 1;
				themX = this.links[i].x + (this.links[i].getWidth()-1);
			}
			
			/*
			//meY = this.y + (this.getHeight() * 0.5);
			//themY = this.links[i].y + (this.links[i].getHeight() * 0.5);
			if (this.links[i].level > this.level) {
				if (this.isbackend) {
					meY = this.y + (this.getHeight()-1);
				} else {
					meY = this.y + (this.getHeight() * 0.5);
				}
				if (this.links[i].isbackend) {
					themY = this.links[i].y + 1;
				} else {
					themY = this.links[i].y + (this.links[i].getHeight() * 0.5);
				}
			} else {
				if (this.isbackend) {
					meY = this.y;
				} else {
					meY = this.y + (this.getHeight() * 0.5);
				}
				if (this.links[i].isbackend) {
					themY = this.links[i].y + this.links[i].getHeight();
				} else {
					themY = this.links[i].y + (this.links[i].getHeight() * 0.5);
				}
			}
			*/
			
			if (this.isbackend) {
				meY = this.y + 1;
				if (this.links[i].y >= this.y) meY += (this.getHeight()-2);
			} else {
				meY = this.y + (this.getHeight() * 0.5);
			}
			if (this.links[i].isbackend) {
				themY = this.links[i].y + 1;
				if (this.links[i].y <= this.y) themY += (this.links[i].getHeight()-2);
			} else {
				themY = this.links[i].y + (this.links[i].getHeight() * 0.5);
			}
			
			/*
			meY = this.y + 1;
			if (this.links[i].y >= this.y) meY += (this.getHeight()-2);
			themY = this.links[i].y + 1;
			if (this.links[i].y <= this.y) themY += (this.links[i].getHeight()-2);
			*/
			
			ctx.lineWidth = 1.0;
			ctx.beginPath();
			ctx.moveTo(meX, meY);
			ctx.lineTo(themX, themY)
			ctx.stroke();
			
		}
		
	}
	
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

Bubble.prototype.hasOverlap = function(bubble2){
	var rec1 = { x: this.x - this.getWidth()/2, y: this.y - this.getHeight()/2, width: this.getWidth(), height: this.getHeight() };
	var rec2 = { x: bubble2.x - bubble2.getWidth()/2, y: bubble2.y - bubble2.getHeight()/2, width: bubble2.getWidth(), height: bubble2.getHeight() };
	if (hasOverlap(rec1, rec2) > 0) return true;
	return false;
};