<?php

namespace api\v1\lib\db;

class DbHostInfo
{
	public static function getRoot()
	{
		$info = new DbHostInfo();
		$info->uri = 'localhost';
		$info->username = 'root';
		$info->password = '';

		return $info;
	}

	public string $uri;
	public string $username;
	public string $password;
}
