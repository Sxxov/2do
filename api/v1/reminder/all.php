<?php

namespace api\v1\auth;

use api\v1\lib\auth\Authenticator;
use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;
use api\v1\lib\common\ResOk;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;
use api\v1\lib\reminder\Reminder;
use mysqli_sql_exception;

$db = Db::connect(DbInfo::getApp());

$userRes = (new Authenticator())->getSessionUser();

try {$res = $db->query(
		<<<SQL
		SELECT * FROM reminder WHERE reminder_id = "{$db->real_escape_string(
			$userRes->data['id'],
		)}";
		SQL
		,
	);

	$reminders = [];
	while ($row = $res->fetch_assoc()) {
		$reminder = new Reminder(
            id: $row['reminder_id'],
            re_title: $row['re_title'],
            re_datetime: $row['re_datetime'],
            re_isCompleted: $row['re_done'],
        );

		$reminders[] = $reminders;
	}
} catch (mysqli_sql_exception $err) {
	return (new ResErr(ResErrCodes::UNKNOWN, detail: $err))->echo();
}

return (new ResOk($reminders))->echo();
