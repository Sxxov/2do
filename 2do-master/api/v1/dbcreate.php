<?php
  $servername = "localhost";
  $username = "root";
  $password = ""; 
  $conn = new mysqli($servername, $username, $password);
  if($conn->connect_error) 
   die("Connection failed: " . $conn->connect_error);
  echo("Connected successfully.<br>");

  $sql = "CREATE DATABASE `database2do`;"; 
  
  if($conn->query($sql))
   echo "Database created successfully!!"; 
  else
   echo "Error creating database: " . $conn->error; 

  $conn->close();
