<!--
	THIS IS THE PINGER PAGE.
	IT CONTAINS FUNCTIONS TO SEND A PING TO A WEBSITE, THEN RETURN WHETHER OR NOT THE SERVER RESPONDED, AND IF SO, HOW FAST.
	SEE THE BOTTOM OF THE PAGE FOR EXAMPLES OF THE PHP CALL TO THESE FUNCTIONS.
		printPingDomain(STRING DOMAIN, STRING TITLE);
	BE CAREFUL OF USING DOUBLE AND SINGLE-QUOTES CORRECTLY WHEN USING THE echo FUNCTION, AS MIS-MATCHED QUOTES WILL BREAK THE PAGE.
-->

<script type='text/javascript'>
	// MAKES BACKGROUND OF PAGE FLASH RED 5 TIMES IF A DOMAIN IS DOWN.
	// HOWEVER, STUFF SOMETIMES GOES DOWN FOR JUST 10 SECONDS OR SO, SO THIS MAY MOSTLY END UP SPAMMING PEOPLE WITH UNNECCISSARILY OBNOXIOUS FALSE ALARMS (CURRENTLY COMMENTED OUT / DISABLED BELOW).
	function flashRedAlert()
	{
		var originalWrapperColor = document.getElementById("wrapper").style.backgroundColor;
		var colorFlashCount = 0;
		var flashRedInterval = setInterval(function(){
			document.getElementById("wrapper").style.backgroundColor="red";
			setTimeout(function(){
				document.getElementById("wrapper").style.backgroundColor=originalWrapperColor;
			}, 250);
			colorFlashCount++;
			if (colorFlashCount >= 5)
				clearInterval(flashRedInterval);
		}, 500);
	}
</script>


<?php
	// This function returns the color of the ping speed text as green if ping speed is within tolerance range, or as yellow if it exceeds XX milliseconds.
	function getStatusColor($number) 
	{
		if ($number > 0 && $number <= 500) return '#00FF00'; // less than XX milliseconds is good.
		else return '#FF8000'; // yellow for slow, red is handled in the printPingDomain function.
	}

	// This function prints out a status bar when called.
	function printStatusBars($number) 
	{
		$sixBarThreshold = 50; // number must be LESS than this to have six bars
		$fiveBarThreshold = 75;
		$fourBarThreshold = 100;
		$threeBarThreshold = 200;
		$twoBarThreshold = 400;
		$oneBarThreshold = 1000;

		//echo "<div class='servicebars pinger'>";
		if ($number > 0 && $number <= $sixBarThreshold)echo '<div class="servicebars barEnd barBegin"><div class="bar1 barBegin"></div><div class="bar2"></div><div class="bar3"></div><div class="bar4"></div><div class="bar5"></div><div class="bar6 barEnd"></div></div> '; // 6
		else if ($number > 0 && $number <= $fiveBarThreshold)echo '<div class="servicebars barEnd barBegin"><div class="bar1 barBegin"></div><div class="bar2"></div><div class="bar3"></div><div class="bar4"></div><div class="bar5"></div><div class="bar0 barEnd"></div></div> '; // 5
		else if ($number > 0 && $number <= $fourBarThreshold)echo '<div class="servicebars barEnd barBegin"><div class="bar1 barBegin"></div><div class="bar2"></div><div class="bar3"></div><div class="bar4"></div><div class="bar0"></div><div class="bar0 barEnd"></div></div> '; // 4
		else if ($number > 0 && $number <= $threeBarThreshold)echo '<div class="servicebars barEnd barBegin"><div class="bar1 barBegin"></div><div class="bar2"></div><div class="bar3"></div><div class="bar0"></div><div class="bar0"></div><div class="bar0 barEnd"></div></div> '; // 3
		else if ($number > 0 && $number <= $twoBarThreshold)echo '<div class="servicebars barEnd barBegin"><div class="bar1 barBegin"></div><div class="bar2"></div><div class="bar0"></div><div class="bar0"></div><div class="bar0"></div><div class="bar0 barEnd"></div></div> '; // 2
		//else if ($number > 0 && $number <= $oneBarThreshold)echo '<div class="servicebars barEnd barBegin"><div class="bar1 barBegin"></div><div class="bar0"></div><div class="bar0"></div><div class="bar0"></div><div class="bar0"></div><div class="bar0 barEnd"></div></div> '; // 1
		else echo '<div class="servicebars barEnd barBegin"><div class="bar1 barBegin"></div><div class="bar0"></div><div class="bar0"></div><div class="bar0"></div><div class="bar0"></div><div class="bar0 barEnd"></div></div> ';
		//echo "</div>";
	}

	// Checks the response time of the requested webserver, prints out the green/red light, ping speed, and title of the webserver.
	function printPingDomain($domain, $title)
	{
		//echo "<div class='pinger servertitle'><a target='blank' href='http://$domain'>$title</a></div>";
		$starttime = microtime(true);
		// supress error messages with @
		$file      = @fsockopen($domain, 80, $errno, $errstr, 10); // domain, portnumber, errorNumber, errorString, timeoutInSeconds.
		$stoptime  = microtime(true);
		$status    = 0;

		echo "<div class='pinger statusline'>";
		echo "<div class='pinger servertitle'><a target='blank' href='http://$domain'>$title</a></div>";
		echo "<div class='lightAndBars'>";
	if (!$file)
	{
		$status = -1; // Site is down
		echo "&nbsp<img src='./images/gif_Red.gif' class='statuslight'> ";
		printStatusBars($status);
		echo "<span class='pingrate' style='color: #FF0000;'>DOWN </span>";
		//echo '<script>flashRedAlert();</script>'; // MAKE PAGE *BRIEFLY* FLASH RED IF SOMETHING IS DOWN?
	}
	else
	{
		fclose($file);
		$status = ($stoptime - $starttime) * 1000;
		$status = floor($status);
		echo "&nbsp<img src='./images/png_Green.png' class='statuslight'> ";
		printStatusBars($status);
		$color = getStatusColor($status);
		echo "<span class='pingrate'>";
		if ($status < 10) echo "0";
			echo $status;
			echo "MS ";
			echo "</span>";
		}
		echo "</div>";
		echo "</div>";
		echo"<br>";
		return $status;
	}
?>

<div id="pingerid">
	<h1 id='pingerid' class='header pinger'><a target='blank' href='http://www.ksu.edu'>K-State</a> Server Status</h1>
	<div class='pingersubmenu'>
		<span class='pingerspacer'>Ping Response Time</span>
		<span>Domain</span>
	</div>

	<?php
		// HERE ARE THE DOMAINS WE WANT TO PING.

		printPingDomain('eid.ksu.edu', 'eProfile / KEAS'); //printPingDomain('eid.ksu.edu', 'eProfile / KEAS Support Tools');
		printPingDomain('connect.ksu.edu', 'Single Sign-On');
		printPingDomain('online.ksu.edu', 'K-State Online');
		printPingDomain('webmail.ksu.edu', 'Webmail');
		//printPingDomain('pod51042.outlook.com', 'Outlook Server');
		printPingDomain('ksu.edu', 'K-State Home');
		printPingDomain('ksis.ksu.edu', 'KSIS');
		printPingDomain('hris.ksu.edu', 'HRIS');
	?>
</div>

<script type='text/javascript'>

// ADDS AN INDICATOR THAT THERE ARE MORE PINGER DOMAINS BELOW THE VISIBLE FRAME. IF THE FRAME IS TOO SMALL TO SHOW THEM ALL, "layout.js" WILL SHOW/HIDE THE INDICATOR AS NEEDED.
if ( document.getElementById("frame01") != null )
{
	if ( document.getElementById("morePingersAreHiddenNotificationID") == null )
	{
		var thereAreMorePingers = document.createElement("div");
		thereAreMorePingers.innerHTML = '<div id="morePingersAreHiddenNotificationID"  class="morePingersAreHiddenNotification"><span>more &#x25BC;</span></div>';
		document.getElementById("frame01").appendChild(thereAreMorePingers);
		
		if ( ($("#pingerid").height() - 5) <= $("#frame01").height() )
			$("#morePingersAreHiddenNotificationID").fadeOut(1); // FADE IT OUT IF NOT NEEDED, BUT LEAVE IT THERE FOR THE MAIN "layout.js" TO SHOW/HIDE AS NEEDED.
	}
}

</script>
