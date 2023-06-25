<?php
require_once "db.php";

class User
{
    public string $username;
    public string $email;
    public string $password;
    public string $peepeepoopoo;
}

if (!isset($GLOBALS['sessions']))
    $GLOBALS['sessions'] = array();

$body = file_get_contents("php://input");
$req = json_decode($body);
// $username = $_POST["username"];
// $password = $_POST["password"];

if (isset($req->username) && isset($req->password)) {
    // function validate($data)
    // {
    //     $data = trim($data);
    //     $data = stripslashes($data);
    //     $data = htmlspecialchars($data);
    //     return $data;
    // }

    $user = new User();
    $user->username = $req->username;
    $user->password = $req->password;
    // $username = validate($body['username']);
    // $password = validate($body['password']);
    // $username = validate($username);
    // $password = validate($password);
    $sql = " SELECT * FROM usertable WHERE username = '$username' && password = '$password'";
    $result = mysqli_query($conn, $sql);
    $num = mysqli_num_rows($result);
    if ($conn->query($sql)) {
        if ($num == 1) {
            echo "Logged in";
            $_SESSION['username'] = $row['username'];

            session_start();
            $sess_id = session_id();
            $GLOBALS['sessions'][$sess_id] = $user;

            $res = array(
                "res" => array(
                    "ok" => true
                ),
                "data" => array(
                    'redirect' => "home"
                ) //for login
            );

            echo json_encode($res);
        }
    }
}
