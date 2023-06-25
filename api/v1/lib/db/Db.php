<?php

namespace api\v1\lib\db;

class Db
{
	public static function connect(DbInfo $info)
	{
		$connection = new \mysqli(
			$info->hostInfo->uri,
			$info->hostInfo->username,
			$info->hostInfo->password,
			$info->name
		);

		if ($connection->connect_error) {
			throw new \Exception(
				'Db connection failed: ' . $connection->connect_error
			);
		}

		return $connection;
	}

	public static function connectOrCreate(DbInfo $info)
	{
		$connection = new \mysqli(
			$info->hostInfo->uri,
			$info->hostInfo->username,
			$info->hostInfo->password,
			$info->name
		);

		if ($connection->connect_error) {
			$connection = self::create($info);
		}

		return $connection;
	}

	public static function create(DbInfo $info)
	{
		$connection = new \mysqli(
			$info->hostInfo->uri,
			$info->hostInfo->username,
			$info->hostInfo->password
		);

		if ($connection->connect_error) {
			throw new \Exception(
				'Db connection failed: ' . $connection->connect_error
			);
		}

		$connection->query('CREATE DATABASE ' . $info->name);

		return self::connect($info);
	}
}
