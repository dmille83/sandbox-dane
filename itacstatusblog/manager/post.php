<?php
    require "login_template.php";

    $page_content_html = false;

    // run the application
    $application = new OneFileLoginApplication($page_content_html);
    if ($application->getUserLoginStatus() == true) {

        if (isset($_POST["content"])) {
            $myfile = fopen("../pages/" . $_POST["page-title"] . ".html", "w") or die("Unable to open file!");
            $txt = $_POST["content"];
            fwrite($myfile, $txt);
            fclose($myfile);

            /* Redirect browser */
            header("Location: " . "../pages/" . $_POST["page-title"] . ".html");

            /* Make sure that code below does not get executed when we redirect. */
            exit;
        }
    } else {
        //echo "You are not logged in.";

        /* Redirect browser */
        header("Location: " . "index.php");
    }
?>
