<?php
//PHP=======================================================================================PHP


// HERE IS WHERE THE GMAIL READER BEGINS.
// Source:  http://davidwalsh.name/gmail-php-imap

/* connect to gmail */
$hostname = '{imap.gmail.com:993/imap/ssl}INBOX';
$username = 'conslt11@gmail.com';
$password = 'd1andonlY';


$maxEmailsDisplayed = 4;

/* try to connect */
$inbox = imap_open($hostname,$username,$password) or die('Cannot connect to Gmail: ' . imap_last_error());

/* grab emails */
$emails = imap_search($inbox,'ALL');

/* if emails are returned, cycle through each... */
if($emails) {
	//echo "Emails have been found...<br><br>";
	
	/* begin output var */
	$output = '';
	$finalemail = '';
	
	$emailcounter = 0;

	/* put the newest emails on top */
	rsort($emails);
	
	/* for every email... */
	foreach($emails as $email_number) {

		if ($emailcounter <= $maxEmailsDisplayed) {			// only allow the last XX Helpdesk-L emails to be shown on page.
			//$emailcounter = $emailcounter + 1;	// This limiter is so that the marquee will reach the end before it resets itself.

			/* get information specific to this email */
			$overview = imap_fetch_overview($inbox,$email_number,0);
			$structure = imap_fetchstructure($inbox, $email_number);

			// SOURCE: http://stackoverflow.com/questions/15539902/php-imap-decoding-messages
			if(isset($structure->parts) && is_array($structure->parts) && isset($structure->parts[1])) {
				$part = $structure->parts[1];
				$message = imap_fetchbody($inbox,$email_number,2);
		
				if($part->encoding == 4) {
					$message = quoted_printable_decode($message);
				} else if($part->encoding == 3) {
					$message = imap_base64($message);
				} else if($part->encoding == 1) {
					$message = imap_8bit($message);
				} else {
					$message = imap_qprint($message);
				}

				// CHECK IF MESSAGE CONTAINS AN INLINE ATTACHMENT. If it does, the message will be scrambled badly, and must be read in differently.
				if(strpos($message, "From:") == false)  $message = quoted_printable_decode(imap_fetchbody($inbox,$email_number, 1.2));

				$message = mb_convert_encoding($message, 'UTF-8');
			}







			// With an email message that is a multi-part message in MIME format, and contains the message text in plain text and HTML, and has a file.ext attachment, imap-fetchbody() will return something like the following for each requested part number:
			// (empty) - Entire message
			// 0 - Message header
			// 1 - MULTIPART/ALTERNATIVE
			// 1.1 - TEXT/PLAIN
			// 1.2 - TEXT/HTML
			// 2 - file.ext

			// 2 shows all emails without attachments, but explodes when there is an attachment.
			// 1.2 shows ONLY emails with attachments.
			// So I run the method for emails with attachments, and if nothing gets pulled from the email body, I know it has no attachments, so I can run the other one for that email.

// THIS METHOD DOES NOT HANDLE ENCRYPTED EMAIL OR EMAIL WITH ATTACHMENTS !!!
//			$message = quoted_printable_decode(imap_fetchbody($inbox,$email_number, 1.2));
//			if ($message == "")
//			{
//				$message = quoted_printable_decode(imap_fetchbody($inbox,$email_number,2));
//			}
//			// If there are no empty spaces in the first 100 characters of the email body, it is probably showing code from an attached file, so something went wrong.
//			if(strpos($message, " ") == false || strpos($message, " ") > 100)
//			{
//				//$message = "<span style='color: grey;'>invalid email format</span>";
//				$message = "<span style='color: grey;'>________</span>";
//			}


			if (strip_tags($overview[0]->from) != "conslt11 ") // if ($overview[0]->from != "conslt11 <conslt11@ksu.edu>")
			{
				//$message = "<span style='color: grey;'>invalid email sender</span>";
				$message = "<span style='color: grey;'>________</span>"; // DON'T EXPLICITLY SAY THERE WAS AN INVALID SENDER ON THE PAGE (VIEWABLE TO END-USERS), BUT THE ADMIN SHOULD KNOW WHAT THE SOLID LINE INDICATES.

				//$message = "<span style='color: grey;'>invalid email sender: ".htmlspecialchars($overview[0]->from)."</span>";
				//$message = "|".htmlspecialchars($overview[0]->from)."|";
			}
			else // don't incr counter if not a valid email.
			{
				$emailcounter = $emailcounter + 1;	// This limiter is so that the marquee will reach the end before it resets itself.
			}


			// I DON'T NEED THESE ON THE STATUSBOARD RIGHT NOW, BUT WE MAY DECIDE TO PUT THEM BACK IN AT SOME POINT LATER.
			/* output the email header information */
			//$output.= '<div class="toggler '.($overview[0]->seen ? 'read' : 'unread').'">';
			//$output.= '<span class="subject">'.$overview[0]->subject.'</span> ';
			//$output.= '<span class="from">'.$overview[0]->from.'</span>';
			//$output.= '<span class="date">on '.$overview[0]->date.'</span>';
			//$output.= '</div>';

			// I JUST NEED THIS LINE.
			/* output the email body */
			$output.= '<br><div class="emailDividerLine"></div><div class="emailBody">'.$message.'</div>';

			// ADD A SECOND COPY OF THE EMAILS TO THE END AS A BUFFER SO THAT THE SCROLL + REFRESH LOOKS LIKE A CONTINUOUS LOOP (EXCEPT FOR WHEN A NEW EMAIL ARRIVES). WHEN A NEW EMAIL ARRIVES THE CHANGE WILL BE VISIBLE, BUT THE REST OF THE TIME WE WANT IT TO LOOK LIKE IT IS LOOPING SMOOTHLY.
			//if ($emailcounter <= 2) 
			//{
				$finalemail.= '<br><div class="emailDividerLine"></div><div class="emailBody">'.$message.'</div>';
			//}

		} // end of IF statement for "only show last XX Helpdesk-L emails".
	}

	//==================================================
	// CLEAN OUT ANY UNIDENTIFIABLE CHARACTERS.
	//SOURCE:  http://www.stemkoski.com/php-remove-non-ascii-characters-from-a-string/
		$output = preg_replace('/[^(\x20-\x7F)]*/','', $output);
	//==================================================

	// Strip tags from output. THIS IS ESSENTIAL! Without this, people could inject scripts into our Status Board by sending an email to conslt11@gmail.com!
	echo strip_tags( $output, '<div><br><font><strong><style><table><tr><td><th><b><p><span>' ); //<span>
	//echo "<div id='finalemailframe'>". strip_tags( $finalemail, '<div><br><font><strong><style><table><tr><td><th><b><p><span>' ) ."</div>"; //<span>

} 

/* close the connection */
imap_close($inbox);

//PHP=======================================================================================PHP
?>