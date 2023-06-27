<?php

use api\v1\lib\common\ResOk;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;

$db = Db::connectOrCreate(DbInfo::getApp());
$db->query(
	<<<SQL
		CREATE TABLE IF NOT EXISTS users (
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
		CREATE TABLE IF NOT EXISTS sessions (
			session_id VARCHAR(255) NOT NULL,
				PRIMARY KEY (session_id),
			user_id VARCHAR(255) NOT NULL,
				FOREIGN KEY (user_id) REFERENCES users(user_id)
		);
	SQL
	,
);

$db->query(
	<<<SQL
		CREATE TABLE IF NOT EXISTS reminders (
			reminder_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			re_title VARCHAR(255) NOT NULL,
			re_datetime DATE NOT NULL,
			re_done BOOLEAN NOT NULL,
		);
	SQL
	,
);

$db->query(
	<<<SQL
		CREATE TABLE IF NOT EXISTS notes (
			todo_id VARCHAR(255) NOT NULL,
				PRIMARY KEY (todo_id),
			title VARCHAR(255) NOT NULL,
			owner VARCHAR(255) NOT NULL,
				FOREIGN KEY (owner) REFERENCES users(user_id),
			description TEXT(65535) NOT NULL,
			date_created DATETIME,
			date_modified DATETIME
		);
	SQL
	,
);

return (new ResOk([]))->echo();
