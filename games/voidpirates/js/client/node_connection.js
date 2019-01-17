
// Wait to establish a connection with the game server until the user's browser has finished loading the game's sprite resources locally
var socket;
function connectToServerNode()
{
	try
	{
		//var server_url = 'http://nodejs-dane.rhcloud.com:1337';
		//var server_url = 'http://nodejs-dane.rhcloud.com/VoidPirates/node_modules/socket.io/node_modules/socket.io-client/socket.io.js';
		//var server_url = 'http://192.168.0.5:1337';
		//var server_url = 'http://localhost:1337';
		//var server_url = 'http://24.255.217.135:1337';
		
		//var server_url = 'http://6254fbda.ngrok.io'; // technically works
		
		// This will get it dynamically from index.html
		function getserverurl() {
			var iosrc = document.getElementById("iosrc").src;
			var strsf = '/socket.io/socket.io.js';
			return iosrc.substring(0, iosrc.length - strsf.length);
		}
		var server_url = getserverurl();
		
		
		console.log('attempting to connect to server: ' + server_url);
		socket = io.connect(server_url);
		socket.on('error', function (reason){
		  console.error('Unable to connect Socket.IO', reason);
		});

		// SOURCE:  http://stackoverflow.com/questions/18248128/socket-io-connect-with-server-offline
		//socket.on('connect_failed', function (error){ console.log(error); });

		socket.on('connect', function (){
		  console.info('successfully established a working and authorized connection');
		});

		// The server sends the user this critical bit of data when they connect
		socket.on('sendyouyoursocketid', function(data) {
			console.log('Received my player ID of:' + data);
			player_id = data;
		});


		// listener, whenever the server emits 'tellusersglobalstuff', this updates all users with a message
		socket.on('tellusersglobalstuff', function (textColor, data) {
			postWarningMessage(textColor, data);
		});
		
		socket.on('sendyoutheserverdata', function(data) {
			render(data);
			
			//if (data.length > 0) gameData = data; // Store data for death scene
			//render(gameData);
		});
		
		window.onunload = function() {
			socket.emit('disconnect');
		}
	}
	catch (e)
	{
		console.log(e);
		console.log("Unable to connect to server. Re-attempting in 6 seconds...")
		return false;
	}
	return true;
}

function reconnectToServerNode()
{
	console.log('reconnecting...');
	try
	{
		socket.emit('disconnect');
		/*
		setTimeout(function(){ 
			alert("reconnecting..."); 
			return connectToServerNode();
		}, 3000);
		*/
		return connectToServerNode();
	}
	catch (e)
	{
		console.log(e);
		console.log("Unable to reconnect to server.")
		return false;
	}
}

/*
// Disconnect user when they close their browser page
window.onbeforeunload = function (e) {
  var message = "Are you sure you want to quit?",
  e = e || window.event;

  // For IE and Firefox
  if (e) {
    e.returnValue = message;
  }

  // For Safari
  return message;
};
*/
/*
window.onunload = function() {
	socket.emit('disconnect');
    //alert('Bye.');
}
*/


function sendServerUpdatePacket(userInputPacket)
{
	try
	{
		//console.log(userInputPacket);
		if (userInputPacket.length > 0) socket.emit('sendtheservermydata', userInputPacket);
	}
	catch (e)
	{
		console.log(e);
	}
}
