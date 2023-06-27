<?php

namespace api\v1\auth;

use api\v1\lib\auth\Authenticator;
use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;
use api\v1\lib\common\ResOk;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;
use api\v1\lib\note\Note;
use DateTime;
use mysqli_sql_exception;

$db = Db::connect(DbInfo::getApp());

$body = file_get_contents('php://input');
$in = json_decode($body);

if (!isset($in->id) || !isset($in->title) || !isset($in->description)) {
	return (new ResErr(ResErrCodes::INCOMPLETE))->echo();
}

$userId = (new Authenticator())->getSessionUser();

$id = $in->id;
$updatedTitle = $in->title;
$updatedDescription = $in->description;
$dateModified = (new DateTime())->format('Y-m-d H:i:s');

try {
	$res = $db->query(
		<<<SQL
		UPDATE notes
		SET
			title = "{$db->real_escape_string($updatedTitle)}",
			description = "{$db->real_escape_string($updatedDescription)}",
			dateModified = "{$db->real_escape_string($dateModified)}"
		WHERE todo_id = "{$db->real_escape_string(
			$id,
		)}" AND owner = "{$db->real_escape_string($userId)}";
		SQL
		,
	);

	if ($res->num_rows <= 0) {
		return (new ResErr(
			ResErrCodes::NOTE_NOT_FOUND,
			message: 'Attempted to edit a note that does not exist',
		))->echo();
	}

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
	return (new ResErr(ResErrCodes::UNKNOWN, detail: $err))->echo();
}

return (new ResOk($note))->echo();

