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

$db = Db::connect(DbInfo::getApp());

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


    $re_title = $_POST["re_title"];
    $re_datetime = $_POST["re_datetime"];



    $sql = "INSERT INTO reminders (re_title, re_datetime) VALUES ('$re_title', '$re_datetime')";


    if ($conn->query($sql) === TRUE) {
        echo "Data inserted successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }


$conn->close();
?>
