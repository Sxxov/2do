<?php

namespace api\v1\auth;

use api\v1\lib\common\HttpCodes;
use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;
use api\v1\lib\common\ResOk;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;
use api\v1\lib\user\User;
use mysqli_sql_exception;

$db = Db::connect(DbInfo::getApp());

$body = file_get_contents('php://input');
$in = json_decode($body);

if (!isset($in->username) || !isset($in->password)) {
	return ResErr::send(ResErrCodes::INCOMPLETE, http: HttpCodes::BAD_REQUEST);
}

$isEmail = User::isValidEmail($in->username);

if (!User::isValidUsername($in->username) && !$isEmail) {
	return ResErr::send(
		ResErrCodes::INVALID,
		http: HttpCodes::BAD_REQUEST,
		field: 'username',
	);
}

$hash = password_hash($in->password, PASSWORD_DEFAULT);

try {
	$col = $isEmail ? 'email' : 'username';
	$res = $db->query(
		<<<SQL
		SELECT * FROM users WHERE {$col} = "{$db->real_escape_string(
			$in->username,
		)}";
		SQL
		,
	);

	if ($res->num_rows <= 0) {
		return ResErr::send(
			ResErrCodes::SIGN_IN_USER_NOT_FOUND,
			http: HttpCodes::BAD_REQUEST,
		);
	}

	$row = $res->fetch_assoc();

	if (!password_verify($in->password, $row['password'])) {
		return ResErr::send(
			ResErrCodes::SIGN_IN_INVALID_CREDENTIALS,
			http: HttpCodes::BAD_REQUEST,
		);
	}

	$user = new User(
		id: $row['user_id'],
		username: $row['username'],
		email: $row['email'],
	);
} catch (mysqli_sql_exception $err) {
	return ResErr::send(
		ResErrCodes::UNKNOWN,
		http: HttpCodes::INTERNAL_SERVER_ERROR,
		message: 'Failed to check user credentials',
		detail: $err,
	);
}

session_start();
$sessionId = session_id();

try {
	$db->query(
		<<<SQL
		DELETE FROM sessions WHERE user_id = "{$user->id}" OR session_id = "{$sessionId}";
		SQL
		,
	);
	$db->query(
		<<<SQL
		INSERT INTO sessions (session_id, user_id) VALUES ("{$db->real_escape_string(
			$sessionId,
		)}", "{$user->id}");
		SQL
		,
	);
} catch (mysqli_sql_exception $err) {
	return ResErr::send(
		ResErrCodes::UNKNOWN,
		http: HttpCodes::INTERNAL_SERVER_ERROR,
		message: 'Failed to create session',
		detail: $err,
	);
}

return ResOk::send($user);
