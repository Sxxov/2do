<?php
// Create connection to the database
$servername = "localhost";
$username = "your_username";
$password = " ";
$dbname = "2do";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the current date
$currentDate = date('Y-m-d');
$currentDate = time('h:i:s');

// Query to retrieve the nearest date past the current date
$sql = "SELECT re_date FROM reminder WHERE re_date > '$currentDate' ORDER BY re_date ASC LIMIT 1";
$result1 = $conn->query($sql);

$sql = "SELECT re_time FROM reminder WHERE re_time > '$currentTime' ORDER BY re_time ASC LIMIT 1";
$result1 = $conn->query($sql);

if ($result1->num_rows > 0) {
    $row = $result->fetch_assoc();
    $nearestDate = $row['re_date'];
    if ($result2->num_rows > 0) {
        $row = $result->fetch_assoc();
        $nearestTime = $row['re_time'];
    //** put in whatever is supposed to happen when finding the nearest reminder */
    } else {
        echo "No functional reminders.";
    }
} else {
    echo "No functional reminders.";
}

// Close the database connection
$conn->close();
?>
