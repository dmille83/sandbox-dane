function csv_reader(strData) {
	
	//console.log("txt:" + strData);
	
	//var strData = "hello,world,i,am,bob";
	var objPattern = new RegExp(
		//"(.*?)(,|$)", 
		"(.*?),(.*?)\r", 
		"gi"
	);
	var arrMatches = null;
	
	arrMatches = objPattern.exec( strData );
	console.log("log:");
	//console.log(arrMatches);
	
	// console.log(arrMatches[1]);
	// arrMatches = objPattern.exec( strData );
	// console.log(arrMatches[1]);
	// arrMatches = objPattern.exec( strData );
	// console.log(arrMatches[1]);
	// arrMatches = objPattern.exec( strData );
	// console.log(arrMatches[1]);
	// arrMatches = objPattern.exec( strData );
	// console.log(arrMatches[1]);
	
	
	// Create an array to hold our data. Give the array
	// a default empty first row.
	var arrData = [[]];
	
	var rLimit = 0;
	while (arrMatches = objPattern.exec( strData )) {
		if ((rLimit++) > 10) return;
		console.log(arrMatches[1] + ", " + arrMatches[2]);
	}
	
	
	/*
	var objPattern = new RegExp(
		"(.*?)(,|$)", 
		//"(.*?),(.*?)($)", 
		"gi"
	);
	
	var arrMatches = null;
	
	// arrMatches = objPattern.exec( strData );
	 console.log("log:");
	 console.log(arrMatches);
	// console.log(arrMatches[1]);
	// arrMatches = objPattern.exec( strData );
	// console.log(arrMatches[1]);
	// arrMatches = objPattern.exec( strData );
	// console.log(arrMatches[1]);
	// arrMatches = objPattern.exec( strData );
	// console.log(arrMatches[1]);
	// arrMatches = objPattern.exec( strData );
	// console.log(arrMatches[1]);
	
	var rLimit = 0;
	while (arrMatches = objPattern.exec( strData ) && (rLimit++) < 10) {
		console.log(arrMatches[1]);
	}
	*/
}