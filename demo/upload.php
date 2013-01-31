<?php
error_reporting(0);
// header('Content-Type: application/json');

// assuming name of <input type="file" /> is "file"
$file = $_FILES["file"];
$allowedExts = array();
$extension = end(explode(".", $file["name"]));
$result = "";
$message = "";

if (file_exists("upload/" . $_FILES["file"]["name"] . "." . $extension)) {
$result = "success";
$message = "File already exists. It has been overwritten.";
} else if (move_uploaded_file($_FILES["file"]["tmp_name"], "upload/" . md5($_FILES["file"]["name"]) . "." . $extension)) {
$result = "success";
$message = "File successfully uploaded";
}

echo json_encode(array(
"result" => $result,
"message" => $message,
"data" => array(
"file" => array($_FILES["file"]),
"newFilePath" => "http://$_SERVER[HTTP_HOST]/~james/jQuery%20File%20Upload%20Plugin/demo/". "upload/" . md5($_FILES["file"]["name"]) . "." . $extension
)
));


?>