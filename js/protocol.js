if (location.protocol.indexOf("https") === -1) {
	if (location.protocol.indexOf("http") === 0) {
		location.href = "https" + location.href.slice(4);
		console.log("reloading page under https protocol");
	} else {
		console.log("unable to reload page under https protocol");	
	}
}