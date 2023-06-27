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

$userId = (new Authenticator())->getSessionUser();

try {
	$res = $db->query(
		<<<SQL
		SELECT * FROM notes WHERE owner = "{$db->real_escape_string($userId)}";
		SQL
		,
	);

	$notes = [];
	while ($row = $res->fetch_assoc()) {
		$note = new Note(
			id: $row['todo_id'],
			title: $row['title'],
			owner: $row['owner'],
			description: $row['description'],
			dateCreated: $row['date_created'],
			dateModified: $row['date_modified'],
		);

		$notes[] = $note;
	}
} catch (mysqli_sql_exception $err) {
	return (new ResErr(ResErrCodes::UNKNOWN, detail: $err))->echo();
}

return (new ResOk($notes))->echo();

