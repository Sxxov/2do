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

if (!isset($in->title) || !isset($in->description)) {
	return (new ResErr(ResErrCodes::INCOMPLETE))->echo();
}

$userRes = (new Authenticator())->getSessionUser();

$dateCreated = (new DateTime())->format('Y-m-d H:i:s');
$note = new Note(
	id: uniqid('note_'),
	title: $in->title,
	owner: $userRes->data['id'],
	description: $in->description,
	dateCreated: $dateCreated,
	dateModified: $dateCreated,
	done: false,
	priority: 0,
);
try {
	$res = $db->query(
		<<<SQL
		INSERT INTO notes (
			todo_id,
			title,
			owner,
			description,
			date_created,
			date_modified,
			done,
			priority
		)
		VALUES (
			"{$db->real_escape_string($note->id)}",
			"{$db->real_escape_string($note->title)}",
			"{$db->real_escape_string($note->owner)}",
			"{$db->real_escape_string($note->description)}",
			"{$db->real_escape_string($note->dateCreated)}",
			"{$db->real_escape_string($note->dateModified)}",
			"{$db->real_escape_string((int) $note->done)}",
			"{$db->real_escape_string($note->priority)}"
		);
		SQL
		,
	);

	if (!$res) {
		return (new ResErr(ResErrCodes::UNKNOWN, detail: $db->error))->echo();
	}
} catch (mysqli_sql_exception $err) {
	return (new ResErr(ResErrCodes::UNKNOWN, detail: $err))->echo();
}

return (new ResOk($note))->echo();

