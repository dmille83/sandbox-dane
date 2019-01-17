<?php
    require "login_template.php";

    $myFile = "../upload/managerMessage.txt"; //the file you want to open
    $fh = fopen($myFile, 'r') or die("can't open file"); //opening the file
    $MessageData = fread($fh, filesize($myFile)); //read in data from the file
    fclose($fh); //close the file


    $page_content_html = '
        <form action="managerPost.php" method="post">
          <strong>Message From Your Manager: </strong>
          <br>(put each separate message on a new line)
          <br>
          <textarea name="message" style="width: 890px; height: 300px; resize:none;">' . htmlspecialchars($MessageData) . '</textarea>
          <br>
          <input type="submit" value="Save">
        </form>';

    // run the application
    $application = new OneFileLoginApplication($page_content_html);
?>
