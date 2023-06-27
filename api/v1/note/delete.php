<?php

namespace api\v1\auth;

use api\v1\lib\auth\Authenticator;
use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;
use api\v1\lib\common\ResOk;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;
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
	$query = <<<SQL
	DELETE FROM notes WHERE todo_id = "{$db->real_escape_string(
		$id,
	)}" AND owner = "{$db->real_escape_string($userId)}";
	SQL;

	$res = $db->query($query);

	if ($res->num_rows <= 0) {
		return (new ResErr(
			ResErrCodes::NOTE_DELETE_ERROR,
			message: 'Failed to delete note',
		))->echo();
	}
} catch (mysqli_sql_exception $err) {
	return (new ResErr(
		ResErrCodes::NOTE_DELETE_ERROR,
		message: 'Failed to delete note',
		detail: $err,
	))->echo();
}

return (new ResOk([]))->echo();

