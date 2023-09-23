<?php
    $username = $_POST['username'];
    $password = $_POST['password'];
    //database connection
    $host='localhost'; 
    $user='root';
    $pass = '';
    $db='gahaweb';
    $con = mysqli_connect($host,$user,$pass,$db);
    if ($con->connect_error){
        die("Failed to connect : " .$con->connect_error);
        // <?php
        // fwrite(STDERR, "An error occurred.\n");
        // exit(1); > 
    } 
    $stmt = $con->prepare("select * from signin where username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt_result = $stmt->get_result();
    if($stmt_result->num_rows > 0) {
        $data = $stmt_result->fetch_assoc();
        if($data['password'] === $password) {
            header('Location: currEmployees.html');
        } else {
            echo "<h2> Invalid Username or password<h2>";
        }
    } else {
        echo "<h2> Invalid Username or password<h2>";
    }
?>