<?php

namespace api\v1\lib\reminder;

use api\v1\lib\auth\Authenticator;
use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;
use api\v1\lib\common\ResOk;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;
use api\v1\lib\note\Note;
use DateTime;
use mysqli_sql_exception;

$servername = "localhost";
$username = "root";
$password = " ";
$dbname = "2do";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

    $re_id = $_POST["re_id"];
    $re_title = $_POST["re_title"];
    $re_date = $_POST["re_date"];
    $re_time = $_POST["re_time"];

    $sql = "UPDATE reminders SET re_title ='$re_title', re_date ='$re_date', re_time ='$re_time' WHERE re_id = $re_id";

    if ($conn->query($sql) === TRUE) {
        echo "Data inserted successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }


$conn->close();
?>
