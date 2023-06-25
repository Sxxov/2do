<?php

use api\v1\lib\common\ResOk;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;

$db = Db::connectOrCreate(DbInfo::getApp());
$db->query(
	<<<SQL
		CREATE TABLE users (
			user_id VARCHAR(255) NOT NULL,
				PRIMARY KEY (user_id),
			username VARCHAR(255) NOT NULL,
			email VARCHAR(255) NOT NULL,
			password VARCHAR(255) NOT NULL
		);
	SQL
	,
);
$db->query(
	<<<SQL
		CREATE TABLE sessions (
			session_id VARCHAR(255) NOT NULL,
				PRIMARY KEY (session_id),
			user_id VARCHAR(255) NOT NULL,
				FOREIGN KEY (user_id) REFERENCES users(user_id)
		);
	SQL
	,
);

return ResOk::send([]);
