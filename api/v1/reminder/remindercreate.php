<?php
$servername = "localhost";
$username = "root";
$password = " ";
$dbname = "2do";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


    $re_title = $_POST["re_title"];
    $re_date = $_POST["re_date"];
    $re_time = $_POST["re_time"];



    $sql = "INSERT INTO reminders (re_title, re_date, re_time) VALUES ('$re_time', '$re_date', '$re_time')";


    if ($conn->query($sql) === TRUE) {
        echo "Data inserted successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }


$conn->close();
?>
