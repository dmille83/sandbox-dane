function hasOverlap(rec1, rec2)
{
	// SOURCE:  https://math.stackexchange.com/questions/99565/simplest-way-to-calculate-the-intersect-area-of-two-rectangles
	// e.g.:  var rec1 = { x:0, y:0, width:100, height:100 };
	
	var d0 = 	x11 = rec1.x,
				y11 = rec1.y,
				x12 = rec1.x + rec1.width,
				y12 = rec1.y + rec1.height,
				x21 = rec2.x,
				y21 = rec2.y,
				x22 = rec2.x + rec2.width,
				y22 = rec2.y + rec2.height
            
	/*x_overlap = x12<x21 || x11>x22 ? 0 : Math.min(x12,x22) - Math.max(x11,x21),
	y_overlap = y12<y21 || y11>y22 ? 0 : Math.min(y12,y22) - Math.max(y11,y21);*/
	
	x_overlap = Math.max(0, Math.min(x12,x22) - Math.max(x11,x21))
	y_overlap = Math.max(0, Math.min(y12,y22) - Math.max(y11,y21));
	
	//console.log("x_overlap=" + x_overlap);
	//console.log("y_overlap=" + y_overlap);
	//if ((x_overlap * y_overlap) > 0) console.log("overlap=" + x_overlap * y_overlap);
	return (x_overlap * y_overlap);
};