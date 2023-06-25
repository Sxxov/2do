<?php

use api\v1\lib\common\ResOk;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;

session_start();
$sessionId = session_id();

if (!$sessionId) {
	return ResOk::send([]);
}

$db = Db::connect(DbInfo::getApp());

try {
	$db->query(
		<<<SQL
		DELETE FROM sessions WHERE session_id = "{$db->real_escape_string(
			$sessionId,
		)}";
		SQL
		,
	);
} catch (mysqli_sql_exception $err) {
}

session_destroy();

return ResOk::send([]);
