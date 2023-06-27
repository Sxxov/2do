<?php

namespace api\v1\auth;

use api\v1\lib\auth\Authenticator;
use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;
use api\v1\lib\common\ResOk;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;
use api\v1\lib\note\Note;
use mysqli_sql_exception;

$db = Db::connect(DbInfo::getApp());

$body = file_get_contents('php://input');
$in = json_decode($body);

if (!isset($in->id)) {
	return (new ResErr(ResErrCodes::INCOMPLETE))->echo();
}

$userId = (new Authenticator())->getSessionUser();
$id = $in->id;

try {
	$res = $db->query(
		<<<SQL
		SELECT * FROM notes WHERE todo_id = "{$db->real_escape_string($id)}";
		SQL
		,
	);

	$row = $res->fetch_assoc();

	$note = new Note(
		id: $row['user_id'],
		title: $row['title'],
		owner: $row['owner'],
		description: $row['description'],
		dateCreated: $row['dateCreated'],
		dateModified: $row['dateModified'],
	);
} catch (mysqli_sql_exception $err) {
	return (new ResErr(
		ResErrCodes::NOTE_DISPLAY_ERROR,
		message: 'Failed to display note',
		detail: $err,
	))->echo();
}

return (new ResOk($note))->echo();

