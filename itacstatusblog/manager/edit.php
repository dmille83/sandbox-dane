<link rel="stylesheet" type="text/css" href="css/styles.css">

<script type="text/javascript" src="js/tinymce/tinymce.min.js"></script>
<script type="text/javascript">
  tinymce.init({
      selector: "textarea",
      subfolder:"",
      //skin: "charcoal",
      height: "300px",
      plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table contextmenu paste filemanager" //moxiemanager
      ],
      toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link"
  });
</script>


<?php
    require "login_template.php";

    $edit_title = "";
    if (isset($_POST["page-title"])) {
        $edit_title = trim($_POST["page-title"]);
    }
    $edit_content = "";
    if (isset($_POST["page-title"])) {
        $edit_content = file_get_contents("../pages/" . $_POST["page-title"] . ".html");
    }


    $page_content_html = '
        <form method="post" action="post.php">
            <label class="page-title-field">Page Title <input type="text" name="page-title" value="' . $edit_title . '" required></input></label>
            <textarea name="content" id="content">' . $edit_content . '</textarea>

            <div class="mce-widget mce-btn mce-menubtn">
                <input name="submit" type="submit" value="Save" id="save_cancel_btn"></input>
            </div>
            <div class="mce-widget mce-btn mce-menubtn">
                <a href="blogpages.php" id="save_cancel_btn">Cancel</a>
            </div>
        </form>';

    // run the application
    $application = new OneFileLoginApplication($page_content_html);
?>
