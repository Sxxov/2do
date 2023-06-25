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

session_start();
$sessionId = session_id();

if (!$sessionId) {
	return ResErr::send(
		ResErrCodes::UNAUTHORISED,
		http: HttpCodes::UNAUTHORISED,
	);
}

$db = Db::connect(DbInfo::getApp());

try {
	$row = $db->query(
		<<<SQL
		SELECT user_id FROM sessions WHERE session_id = "{$db->real_escape_string(
			$sessionId,
		)}";
		SQL
		,
	);

	if ($row->num_rows <= 0) {
		return ResErr::send(
			ResErrCodes::UNAUTHORISED,
			http: HttpCodes::UNAUTHORISED,
		);
	}

	$userId = $row->fetch_assoc()['user_id'];
} catch (mysqli_sql_exception $err) {
	return ResErr::send(
		ResErrCodes::UNKNOWN,
		http: HttpCodes::INTERNAL_SERVER_ERROR,
		message: 'Failed to get user id from session',
		detail: $err,
	);
}

try {
	$row = $db->query(
		<<<SQL
		SELECT * FROM users WHERE user_id = "{$userId}";
		SQL
		,
	);

	if ($row->num_rows <= 0) {
		return ResErr::send(
			ResErrCodes::UNAUTHORISED,
			http: HttpCodes::UNAUTHORISED,
		);
	}

	$data = $row->fetch_assoc();

	$user = new User(
		username: $data['username'],
		email: $data['email'],
		id: $data['user_id'],
	);
} catch (mysqli_sql_exception $err) {
	return ResErr::send(
		ResErrCodes::UNKNOWN,
		http: HttpCodes::INTERNAL_SERVER_ERROR,
		message: 'Failed to get user info from session id',
		detail: $err,
	);
}

return ResOk::send($user);
