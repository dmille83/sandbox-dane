// 08/10/2017
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

/*
// 06/10/2017
function randomcolor() 
{
	this.lineColor = '#000000';
	while (this.lineColor == '#000000' || this.lineColor == '#FFFFFF' || this.lineColor.length < 7) {
		// beware 5-digit colors in the rare instance that random() == 0
		//if (this.lineColor.length < 7) console.log('color hex ' + this.lineColor + ' is too short! (' + this.title + ')'); 
		this.lineColor = "#"+((1<<24)*Math.random()|0).toString(16);
		
		//this.lineColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
		//this.lineColor = '#'+Math.floor(Math.random() * 16777216).toString(16);
		//this.lineColor = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
		//this.lineColor = 'rgb(' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ',' + Math.floor(Math.random()*255) + ')';
		
	}
}
*/