<?php
require_once "db.php";

class User
{
    public string $username;
    public string $email;
    public string $peepeepoopoo;
}

if (!isset($GLOBALS['sessions']))
    $GLOBALS['sessions'] = array();

$body = file_get_contents("php://input");
$req = json_decode($body);

if (isset($req->username) && isset($req->password) && isset($req->email)) {
    $sql = "INSERT INTO usertable (username, email, password) VALUES (:username, :email, :password)";
    $stmt = $conn->prepare($sql);
    $stmt->execute(array(
        ':username' => $body['username'],
        ':email' => $body['email'],
        ':password' => $body['password'],
    ));

    // after authentication
    $user = new User();
    $user->username = $req->username;
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
