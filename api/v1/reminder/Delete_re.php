<?php

namespace api\v1\auth;

use api\v1\lib\auth\Authenticator;
use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;
use api\v1\lib\common\ResOk;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;
use api\v1\lib\reminder\Reminder;
use api\v1\lib\user\User;
use mysqli;
use mysqli_sql_exception;

$db = Db::connect(DbInfo::getApp());

$body = file_get_contents('php://inputs');
$in = \json_decode($body);

if (!isset($in->re_title) || !isset($in->re_datetime)) {
	return (new ResErr(ResErrCodes::INCOMPLETE))->echo();
}

$userRes = (new Authenticator())->getSessionUser();

$id = $in->id;
try {
	$query = <<<SQL
	    DELETE FROM reminder WHERE reminder_id = "{$db->real_escape_string(
		$id,
	)}";
	SQL;

	$res = $db->query($query);

	if ($res->num_rows <= 0) {
		return (new ResErr(
			ResErrCodes::NOT_FOUND,
			message: 'Attempted to delete a reminder that does not exist',
		))->echo();
	}
} catch (mysqli_sql_exception $err) {
	return (new ResErr(ResErrCodes::UNKNOWN, detail: $err))->echo();
}

return (new ResOk([]))->echo();

?>
