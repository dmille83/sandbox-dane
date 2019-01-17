<?php
    require "login_template.php";

    $page_content_html = false;

    // run the application
    $application = new OneFileLoginApplication($page_content_html);
    if ($application->getUserLoginStatus() == true) {

        if (isset($_POST["page-title"])) {
            unlink("../pages/" . $_POST["page-title"] . ".html") or die("Unable to delete file!");

            /* Redirect browser */
            header("Location: blogpages.php");

            /* Make sure that code below does not get executed when we redirect. */
            exit;
        }

    } else {
        //echo "You are not logged in.";

        /* Redirect browser */
        header("Location: " . "index.php");
    }
?>
