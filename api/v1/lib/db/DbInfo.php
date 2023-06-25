<?php

namespace api\v1\lib\db;

class DbInfo
{
	public static function getApp()
	{
		$info = new DbInfo();
		$info->hostInfo = DbHostInfo::getRoot();
		$info->name = '2do';

		return $info;
	}

	public DbHostInfo $hostInfo;
	public string $name;

	public function __construct()
	{
		$this->hostInfo = new DbHostInfo();
	}
}
