<?php

namespace api\v1\lib\user;

class User {
	const ID_REGEX = '/^[a-zA-Z0-9-._]+$/';

	public string $id;
	public string $username;
	public string $email;
	public string $peepeepoopoo;

	public function __construct(
		string $id,
		string $username,
		string $email,
		string $peepeepoopoo = 'peepeepoopoo',
	) {
		$this->id = $id;
		$this->username = $username;
		$this->email = $email;
		$this->peepeepoopoo = $peepeepoopoo;
	}

	public static function isValidUsername(string $username): bool {
		return strlen($username) >= 3 &&
			strlen($username) <= 20 &&
			preg_match(self::ID_REGEX, $username);
	}

	public static function isValidEmail(string $email): bool {
		return strlen($email) <= 255 &&
			filter_var($email, FILTER_VALIDATE_EMAIL);
	}

	public static function isValidPassword(string $password): bool {
		return strlen($password) >= 8 && strlen($password) <= 255;
	}
}
