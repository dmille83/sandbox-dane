// Return unique text array
function uniqueTxtArray(txtArray) {
	function onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	}
	var unique = txtArray.filter(onlyUnique);
	return unique;
}

// Return unique object array
// Also works for a text array
function uniqueObjArray(arr) {
	var a = [];
	var unique = [];
	for (i = 0; i < arr.length; i++) {
		var v = JSON.stringify(arr[i]);
		if (a.indexOf(v) == -1) {
			a.push(v);
			var o = arr[i];
			unique.push(o);
		}
	}
	return unique;
}
