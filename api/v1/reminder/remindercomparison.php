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

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Get the current date and time
        $currentDateTime = date('Y-m-d H:i:s');

        // Query to retrieve the 5 soonest items ordered by time and date
        $sql = "SELECT * FROM reminders WHERE re_date > '$currentDateTime' ORDER BY re_time ASC LIMIT 5";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $row['re_title'] . "</td>";
                echo "<td>" . $row['re_date'] . "</td>";
                echo "<td>" . $row['re_time'] . "</td>";
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='3'>No upcoming events found.</td></tr>";
        }

        // Close the database connection
        $conn->close();
        ?>