<?php

namespace api\v1\auth;

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

if (!isset($in->username) || !isset($in->password) || !isset($in->email)) {
	return ResErr::send(ResErrCodes::INCOMPLETE, http: 400);
}

if (
	strlen($in->username) < 3 ||
	strlen($in->username) > 20 ||
	!preg_match('/^[a-zA-Z0-9-._]+$/', $in->username)
) {
	return ResErr::send(ResErrCodes::INVALID, http: 400, field: 'username');
}

try {
	if (
		$db->query(
			<<<SQL
				SELECT user_id FROM users WHERE username = "{$db->real_escape_string(
				$in->username,
			)}";
			SQL
			,
		)->num_rows > 0
	) {
		return ResErr::send(ResErrCodes::SIGN_UP_USERNAME_TAKEN, http: 400);
	}
} catch (mysqli_sql_exception $err) {
	return ResErr::send(
		ResErrCodes::UNKNOWN,
		http: 500,
		message: 'Failed to check if username is taken',
		detail: $err,
	);
}

if (
	strlen($in->email) > 255 ||
	!filter_var($in->email, FILTER_VALIDATE_EMAIL)
) {
	return ResErr::send(ResErrCodes::INVALID, http: 400, field: 'email');
}

try {
	if (
		$db->query(
			<<<SQL
				SELECT user_id FROM users WHERE email = "{$db->real_escape_string(
				$in->email,
			)}";
			SQL
			,
		)->num_rows > 0
	) {
		return ResErr::send(ResErrCodes::SIGN_UP_EMAIL_TAKEN, http: 400);
	}
} catch (mysqli_sql_exception $err) {
	return ResErr::send(
		ResErrCodes::UNKNOWN,
		http: 500,
		message: 'Failed to check if email is taken',
		detail: $err,
	);
}

if (strlen($in->password) < 8 || strlen($in->password) > 20) {
	return ResErr::send(ResErrCodes::INVALID, http: 400, field: 'password');
}

$user = new User();
$user->username = $in->username;
$user->id = uniqid();
$user->email = $in->email;

try {
	$hash = password_hash($in->password, PASSWORD_BCRYPT);
	$db->query(
		<<<SQL
			INSERT INTO users (user_id, username, email, password) VALUES ("{$user->id}", "{$db->real_escape_string(
			$user->username,
		)}", "{$db->real_escape_string($user->email)}", "{$hash}");
		SQL
		,
	);
} catch (mysqli_sql_exception $err) {
	echo $err;
	return ResErr::send(ResErrCodes::SIGN_UP_USERNAME_TAKEN, http: 400);
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
		http: 500,
		message: 'Failed to create session',
		detail: $err,
	);
}

return ResOk::send($user);
