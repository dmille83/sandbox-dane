// 06/10/2017

// Set gradient CSS with Javascript
function gradientCss(elem, direction, color1)
{
	var dirsafari = "left"
	if (direction == "left") dirsafari = "right"
	
	$(elem).css("background", "white"); // For browsers that do not support gradients
	$(elem).css("background", "-webkit-linear-gradient(" + dirsafari + ", " + color1 + ", #FFFFFF, #FFFFFF)"); // For Safari 5.1 to 6.0
	$(elem).css("background", "-o-linear-gradient(" + direction + ", " + color1 + ", , #FFFFFF)"); // For Opera 11.1 to 12.0
	$(elem).css("background", "-moz-linear-gradient(" + direction + ", " + color1 + ", #FFFFFF, #FFFFFF)"); // For Firefox 3.6 to 15
	$(elem).css("background", "linear-gradient(to " + direction + ", " + color1 + ", #FFFFFF, #FFFFFF)"); // Standard syntax
}