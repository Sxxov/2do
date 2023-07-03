<?php

namespace api\v1\auth;

use api\v1\lib\auth\Authenticator;
use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;
use api\v1\lib\common\ResOk;
use api\v1\lib\common\Vali;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;
use api\v1\lib\note\Note;
use DateTime;
use mysqli_sql_exception;

$db = Db::connect(DbInfo::getApp());

$body = file_get_contents('php://input');
$in = json_decode($body);

if (!isset($in->id)) {
	return (new ResErr(ResErrCodes::INCOMPLETE))->echo();
}

Vali::check($in, [
	'id' => Vali::$string,
	'?title' => Vali::$string,
	'?description' => Vali::$string,
	'?done' => Vali::$bool,
	'?priority' => Vali::$int,
	'?dateStart' => Vali::$datetime,
	'?dateDue' => Vali::$datetime,
])
	->ifErr()
	?->return();

$userRes = (new Authenticator())->getSessionUser();

$id = $in->id;

try {
	$res = $db->query(
		<<<SQL
		SELECT * FROM notes WHERE todo_id = "{$db->real_escape_string(
			$id,
		)}" AND owner = "{$db->real_escape_string($userRes->data['id'])}";
		SQL
		,
	);

	if (!$res || $res->num_rows === 0) {
		return (new ResErr(
			ResErrCodes::NOT_FOUND,
			message: 'Attempted to edit a note that does not exist',
		))->echo();
	}

	$row = $res->fetch_assoc();

	$note = new Note(
		id: $row['todo_id'],
		title: $row['title'],
		owner: $row['owner'],
		description: $row['description'],
		dateCreated: $row['date_created'],
		dateModified: $row['date_modified'],
		dateStart: $row['date_start'],
		dateDue: $row['date_due'],
		done: (bool) $row['done'],
		priority: $row['priority'],
	);
} catch (mysqli_sql_exception $err) {
	return (new ResErr(ResErrCodes::UNKNOWN, detail: $err))->echo();
}

$queries = [];

if (isset($in->title)) {
	$queries[] = "title = '{$db->real_escape_string($in->title)}'";
}
if (isset($in->description)) {
	$queries[] = "description = '{$db->real_escape_string($in->description)}'";
}
if (isset($in->done)) {
	$queries[] = "done = '{$db->real_escape_string((int) $in->done)}'";
}
if (isset($in->priority)) {
	$queries[] = "priority = '{$db->real_escape_string($in->priority)}'";
}
if (isset($in->dateStart)) {
	$queries[] = "date_start = '{$db->real_escape_string($in->dateStart)}'";
}
if (isset($in->dateDue)) {
	$queries[] = "date_due = '{$db->real_escape_string($in->dateDue)}'";
}
if (
	(isset($in->title) && $in->title !== $note->title) ||
	(isset($in->description) && $in->description !== $note->description) ||
	(isset($in->dateStart) && $in->dateStart !== $note->dateStart) ||
	(isset($in->dateDue) && $in->dateDue !== $note->dateDue)
) {
	$queries[] = "date_modified = '{$db->real_escape_string(
		(new DateTime())->format('Y-m-d H:i:s'),
	)}'";
}
if (count($queries) === 0) {
	return (new ResErr(ResErrCodes::INCOMPLETE))->echo();
}
$query = rtrim(implode(',', $queries), ',');

try {
	$res = $db->query(
		<<<SQL
		UPDATE notes
		SET
			{$query}
		WHERE todo_id = "{$db->real_escape_string(
			$id,
		)}" AND owner = "{$db->real_escape_string($userRes->data['id'])}";
		SQL
		,
	);

	if (!$res) {
		return (new ResErr(ResErrCodes::UNKNOWN, detail: $db->error))->echo();
	}
} catch (mysqli_sql_exception $err) {
	return (new ResErr(ResErrCodes::UNKNOWN, detail: $err))->echo();
}

return (new ResOk([]))->echo();

