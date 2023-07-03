<?php

use api\v1\lib\common\ResOk;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;

$db = Db::connectOrCreate(DbInfo::getApp());
$db->query(
	<<<SQL
		DROP TABLE IF EXISTS `sessions`;
	SQL
	,
);
$db->query(
	<<<SQL
		DROP TABLE IF EXISTS `notes`;
	SQL
	,
);
$db->query(
	<<<SQL
		DROP TABLE IF EXISTS `users`;
	SQL
	,
);
$db->query(
	<<<SQL
		DROP TABLE IF EXISTS `reminders`;
	SQL
	,
);

return (new ResOk([]))->echo();
