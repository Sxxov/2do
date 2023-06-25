<?php

namespace api\v1\lib\user;

class User
{
	public string $id;
	public string $username;
	public string $email;
	public string $peepeepoopoo;

	public static function from(array $data): User
	{
		$user = new User();
		foreach ($data as $key => $value) {
			$user->{$key} = $value;
		}

		return $user;
	}
}
