<?php
    $name=$_POST['name']; //getting the name value using api
    //$expression=$_POST['expression']; //getting the expression value using api
    echo $name;
    $angry=$_POST['angry'];
    $disgusted=$_POST['disgusted'];
    $fearful=$_POST['fearful'];
    $happy=$_POST['happy'];
    $neutral=$_POST['neutral'];
    $sad=$_POST['sad'];
    $surprised=$_POST['surprised'];
    $expression = $_POST['express'];
    //echo $expression;
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "face";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Create database
    $sql = "INSERT INTO `face`(`ID`, `Date`, `Time`, `Name`, `Expression` , `angry`, `disgusted`, `fearful`, `happy`, `neutral`, `sad`, `surprised`) 
    VALUES ('',NOW(),NOW(), '". $name ."', '". $expression ."', '". $angry ."', '". $disgusted ."', '". $fearful ."', '". $happy ."', '". $neutral ."', '". $sad ."', '". $surprised ."')";
    if ($conn->query($sql) === TRUE) {
        echo "Data entered successfully";
    } else {
        echo "Error entering into database: " . $conn->error;
    }

    $conn->close();
?>