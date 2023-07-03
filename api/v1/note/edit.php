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

if (!isset($in->id)) {
	return (new ResErr(ResErrCodes::INCOMPLETE))->echo();
}

$userRes = (new Authenticator())->getSessionUser();

$id = $in->id;
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
if (isset($in->title) || isset($in->description)) {
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

	if ($db->affected_rows <= 0) {
		return (new ResErr(
			ResErrCodes::NOT_FOUND,
			message: 'Attempted to edit a note that does not exist',
		))->echo();
	}
} catch (mysqli_sql_exception $err) {
	return (new ResErr(ResErrCodes::UNKNOWN, detail: $err))->echo();
}

return (new ResOk([]))->echo();

