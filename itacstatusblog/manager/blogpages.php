<link rel="stylesheet" type="text/css" href="css/styles.css">

<?php
    require "login_template.php";

    $pages = scandir("../pages/");

    $page_content_html = "<table class=\"index-table\">";

    $page_content_html .= "<tr><td colspan=3>";
    $page_content_html .= "<h2>Pages</h2>";
    $page_content_html .= "</td></tr>";

    $page_content_html .= "<tr><td>";
    $page_content_html .= "Show";
    $page_content_html .= "</td><td>";
    $page_content_html .= "Title";
    $page_content_html .= "</td></tr>";

    $page_content_html .= "<tr><td colspan=4>";
    $page_content_html .= "<div style='border-top: 1px solid black; height: 10px;'></div>";
    $page_content_html .= "</td></tr>";

    foreach($pages as $page) {
        if ($page != "." && $page != "..") {
            $page_content_html .= "<tr><td>";

            $page_content_html .= "<input type='checkbox' />";

            $page_content_html .= "</td><td>";

            $page_content_html .= "<a href=\"../pages/" . $page . "\">" . substr($page, 0, strrpos($page, ".")) . "</a>";

            $page_content_html .= "</td><td>";

            $page_content_html .= "<form class=\"inline-form-class\" method=\"post\" action=\"edit.php\"><input type=\"hidden\" name=\"page-title\" value=\"" . substr($page, 0, strrpos($page, ".")) . "\"><input class=\"inline-btn\" type=\"submit\" value=\"edit\"></form>";

            $page_content_html .= "</td><td>";

            $page_content_html .= "<form class=\"inline-form-class\" method=\"post\" action=\"delete.php\"><input type=\"hidden\" name=\"page-title\" value=\"" . substr($page, 0, strrpos($page, ".")) . "\"><input class=\"inline-btn\" type=\"submit\" value=\"delete\"></form>";

            $page_content_html .= "</td></tr>";
        }
    }

    $page_content_html .= "<tr><td colspan=2>";
    $page_content_html .= "<form method=\"post\" action=\"edit.php\"><input class=\"inline-btn\" type=\"submit\" value=\"create new page\"></form>";
    $page_content_html .= "</td></tr>";

    $page_content_html .= "</table>";

    // run the application
    $application = new OneFileLoginApplication($page_content_html);
?>
