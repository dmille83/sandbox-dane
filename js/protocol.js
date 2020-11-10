if (location.protocol.indexOf("https") === -1) {
	if (location.protocol.indexOf("http") === 0) {
		console.log("reloading page under https protocol");
		location.href = "https" + location.href.slice(4);
	} else {
		console.log("unable to reload page under https protocol");	
	}
}