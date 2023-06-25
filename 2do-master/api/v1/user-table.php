<?php
require "db.php";
$sql = "CREATE TABLE usertable (
    id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    password varchar(200) NOT NULL,
    email varchar(255) NOT NULL,
    create_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1";


if ($conn->query($sql))
    echo ("Table created successfully");
else
    echo ("Error creating table: " . $conn->error);
