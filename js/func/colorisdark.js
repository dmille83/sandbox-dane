// 06/10/2017
// SOURCE:  http://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black

function colorisdark(hexcode)
{
	var c = hexcode.substring(1);      // strip #
	var rgb = parseInt(c, 16);   // convert rrggbb to decimal
	var r = (rgb >> 16) & 0xff;  // extract red
	var g = (rgb >>  8) & 0xff;  // extract green
	var b = (rgb >>  0) & 0xff;  // extract blue

	var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
	
	//if (luma < darkthreshold) {
	//	// pick a different colour
	//}
	
	return luma;
}