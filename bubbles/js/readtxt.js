function readTextFile(file, callback)
{
	$.ajax({
		 async: false,
		 type: 'GET',
		 url: file + '?_=' + Math.random(),
		 success: function(data) {
			//alert(data);
			callback(data);
		 }
	});
}


/*
// SOURCE:  http://stackoverflow.com/questions/14446447/javascript-read-local-text-file
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                //alert(allText);
				//console.log(allText);
				return allText;
            }
        }
    }
	//while (rawFile.readyState !== 4) { } // wait
    rawFile.send(null);
}
*/

/*
function getFriends(callback){
    FB.api({
      method: 'fql.query', 
      query: 'SELECT uid, name, pic_square  FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())'
    }, 
    callback
  );
}

$.ajax({
   async: false,
   // other parameters
});
*/