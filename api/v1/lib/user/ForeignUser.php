<?php

namespace api\v1\lib\user;

class ForeignUser {
	public string $id;
	public string $username;
	public string $peepeepoopoo;

	public function __construct(
		string $id,
		string $username,
		string $peepeepoopoo = 'peepeepoopoo',
	) {
		$this->id = $id;
		$this->username = $username;
		$this->peepeepoopoo = $peepeepoopoo;
	}

	public static function fromUser(User $user): ForeignUser {
		return new ForeignUser($user->id, $user->username, $user->peepeepoopoo);
	}
}
