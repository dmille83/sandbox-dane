<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<link rel="stylesheet" href="../stylesheet/layoutcontrol.css">

<?php
    $pages = scandir("../pages/");
    foreach($pages as $page) {
        if ($page != "." && $page != "..") {
            echo "<div class='page-frame-class'>";

            readfile("../pages/" . $page);

            echo "</div>";
        }
    }
?>

<div class="inertOverlay" onclick="iterateToNextPageFrame(1);" style="text-align: right;"></div>
<div class="inertOverlay" onclick="iterateToNextPageFrame(-1);" style="width: 50%; text-align: left;"></div>
    <img src="../images/transparent-left.png" class="hoveringLeftRightArrows" style="left: 0; top: calc(50% - 25px);">
    <img src="../images/transparent-right.png" class="hoveringLeftRightArrows" style="right: 0; top: calc(50% - 25px);">

<script>
//(function($) {

    var page_frame_classes = document.getElementsByClassName('page-frame-class');
    var current_page_frame_index = 0;
    var iterateNextPageFrameTimer;
    function iterateToNextPageFrame(next_page_diff) {
        page_frame_classes[current_page_frame_index].style.display = "none";
        current_page_frame_index += next_page_diff;
        if (current_page_frame_index >= page_frame_classes.length) {
            current_page_frame_index = 0;
        }
        else if (current_page_frame_index < 0) {
            current_page_frame_index = page_frame_classes.length - 1;
        }
        page_frame_classes[current_page_frame_index].style.display = "block";
        clearTimeout(iterateNextPageFrameTimer);
        iterateNextPageFrameTimer = setTimeout(function(){
            iterateToNextPageFrame(1);
        }, 10000);
    }

    for(i=0; i<page_frame_classes.length; i++)
    {
        page_frame_classes[i].style.display = "none";
    }
    iterateToNextPageFrame(0);

//})(jQuery);
</script>
