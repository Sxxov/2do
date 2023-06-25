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

if (!isset($in->username) || !isset($in->password) || !isset($in->email)) {
	return ResErr::send(ResErrCodes::INCOMPLETE, http: HttpCodes::BAD_REQUEST);
}

if (!User::isValidUsername($in->username)) {
	return ResErr::send(
		ResErrCodes::INVALID,
		http: HttpCodes::BAD_REQUEST,
		field: 'username',
	);
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
		return ResErr::send(
			ResErrCodes::SIGN_UP_USERNAME_TAKEN,
			http: HttpCodes::BAD_REQUEST,
		);
	}
} catch (mysqli_sql_exception $err) {
	return ResErr::send(
		ResErrCodes::UNKNOWN,
		http: HttpCodes::INTERNAL_SERVER_ERROR,
		message: 'Failed to check if username is taken',
		detail: $err,
	);
}

if (!User::isValidEmail($in->email)) {
	return ResErr::send(
		ResErrCodes::INVALID,
		http: HttpCodes::BAD_REQUEST,
		field: 'email',
	);
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
		return ResErr::send(
			ResErrCodes::SIGN_UP_EMAIL_TAKEN,
			http: HttpCodes::BAD_REQUEST,
		);
	}
} catch (mysqli_sql_exception $err) {
	return ResErr::send(
		ResErrCodes::UNKNOWN,
		http: HttpCodes::INTERNAL_SERVER_ERROR,
		message: 'Failed to check if email is taken',
		detail: $err,
	);
}

if (!User::isValidPassword($in->password)) {
	return ResErr::send(
		ResErrCodes::INVALID,
		http: HttpCodes::BAD_REQUEST,
		field: 'password',
	);
}

$user = new User(username: $in->username, email: $in->email, id: uniqid());

try {
	$hash = password_hash($in->password, PASSWORD_DEFAULT);
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
	return ResErr::send(
		ResErrCodes::SIGN_UP_USERNAME_TAKEN,
		http: HttpCodes::BAD_REQUEST,
	);
}

require 'api/v1/auth/sign-in.php';
