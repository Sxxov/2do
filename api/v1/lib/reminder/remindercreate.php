<?php
$servername = "localhost";
$username = "root";
$password = " ";
$dbname = "reminders";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


    $re_title = $_POST["re_title"];
    $re_year = $_POST["re_year"];
    $re_month = $_POST["re_month"];
    $re_date = $_POST["re_date"];
    $re_hour = $_POST["re_hour"];
    $re_minute = $_POST["re_minute"];


    $sql = "INSERT INTO reminders (re_title, re_year, re_month, re_date, re_hour, re_minute) VALUES ('$re_title', '$re_year', '$re_month', '$re_date', '$re_hour', '$re_minute')";


    if ($conn->query($sql) === TRUE) {
        echo "Data inserted successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }


$conn->close();
?>
