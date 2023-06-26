<?php

namespace api\v1\lib\auth;

use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;
use api\v1\lib\common\ResOk;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;
use api\v1\lib\user\User;
use mysqli;
use mysqli_sql_exception;

class Authenticator {
	private mysqli $db;

	public function __construct(?mysqli $db = null) {
		$this->db = $db ?? Db::connect(DbInfo::getApp());
	}

	public function getSession() {
		$sessionId = session_id();

		if (!$sessionId) {
			session_start();
			$sessionId = session_id();
		}

		return $sessionId;
	}

	private function createSession(User $user): string {
		$sessionId = $this->getSession();

		try {
			$this->db->query(
				<<<SQL
				INSERT INTO sessions (session_id, user_id) VALUES ("{$this->db->real_escape_string(
					$sessionId,
				)}", "{$this->db->real_escape_string($user->id)}");
				SQL
				,
			);
		} catch (mysqli_sql_exception $err) {
			return new ResErr(
				ResErrCodes::UNKNOWN,
				message: 'Failed to create session',
				detail: $err,
			);
		}

		return $sessionId;
	}

	public function signIn(string $username, string $password) {
		$isEmail = User::isValidEmail($username);

		if (!User::isValidUsername($username) && !$isEmail) {
			return new ResErr(ResErrCodes::INVALID, field: 'username');
		}

		try {
			$col = $isEmail ? 'email' : 'username';
			$res = $this->db->query(
				<<<SQL
				SELECT * FROM users WHERE {$col} = "{$this->db->real_escape_string(
					$username,
				)}";
				SQL
				,
			);

			if ($res->num_rows <= 0) {
				return new ResErr(ResErrCodes::SIGN_IN_USER_NOT_FOUND);
			}

			$row = $res->fetch_assoc();

			if (!password_verify($password, $row['password'])) {
				return new ResErr(ResErrCodes::SIGN_IN_INVALID_CREDENTIALS);
			}

			$user = new User(
				id: $row['user_id'],
				username: $row['username'],
				email: $row['email'],
			);
		} catch (mysqli_sql_exception $err) {
			return new ResErr(
				ResErrCodes::UNKNOWN,
				message: 'Failed to check user credentials',
				detail: $err,
			);
		}

		$this->createSession($user);

		return new ResOk($user, redirect: '/app');
	}

	public function signOut(?string $sessionId = null) {
		$sessionId ??= $this->getSession();

		try {
			$this->db->query(
				<<<SQL
				DELETE FROM sessions WHERE session_id = "{$this->db->real_escape_string(
					$sessionId,
				)}";
				SQL
				,
			);
		} catch (mysqli_sql_exception $err) {
			return new ResErr(
				ResErrCodes::UNKNOWN,
				message: 'Failed to delete session',
				detail: $err,
			);
		}

		return new ResOk([]);
	}

	public function signUp(string $username, string $password, string $email) {
		if (!User::isValidUsername($username)) {
			return new ResErr(ResErrCodes::INVALID, field: 'username');
		}

		try {
			if (
				$this->db->query(
					<<<SQL
						SELECT user_id FROM users WHERE username = "{$this->db->real_escape_string(
						$username,
					)}";
					SQL
					,
				)->num_rows > 0
			) {
				return new ResErr(ResErrCodes::SIGN_UP_USERNAME_TAKEN);
			}
		} catch (mysqli_sql_exception $err) {
			return new ResErr(
				ResErrCodes::UNKNOWN,
				message: 'Failed to check if username is taken',
				detail: $err,
			);
		}

		if (!User::isValidEmail($email)) {
			return new ResErr(ResErrCodes::INVALID, field: 'email');
		}

		try {
			if (
				$this->db->query(
					<<<SQL
						SELECT user_id FROM users WHERE email = "{$this->db->real_escape_string(
						$email,
					)}";
					SQL
					,
				)->num_rows > 0
			) {
				return new ResErr(ResErrCodes::SIGN_UP_EMAIL_TAKEN);
			}
		} catch (mysqli_sql_exception $err) {
			return new ResErr(
				ResErrCodes::UNKNOWN,
				message: 'Failed to check if email is taken',
				detail: $err,
			);
		}

		if (!User::isValidPassword($password)) {
			return new ResErr(ResErrCodes::INVALID, field: 'password');
		}

		$user = new User(
			username: $username,
			email: $email,
			id: uniqid('user_'),
		);

		try {
			$hash = password_hash($password, PASSWORD_DEFAULT);
			$this->db->query(
				<<<SQL
				INSERT INTO users (user_id, username, email, password) VALUES ("{$user->id}", "{$this->db->real_escape_string(
					$user->username,
				)}", "{$this->db->real_escape_string(
					$user->email,
				)}", "{$hash}");
				SQL
				,
			);
		} catch (mysqli_sql_exception $err) {
			return new ResErr(
				ResErrCodes::UNKNOWN,
				message: 'Failed to create user',
				detail: $err,
			);
		}

		$this->createSession($user);

		return new ResOk($user, redirect: '/app');
	}

	public function getSessionUser(?string $sessionId = null) {
		$sessionId ??= $this->getSession();

		try {
			$row = $this->db->query(
				<<<SQL
				SELECT user_id FROM sessions WHERE session_id = "{$this->db->real_escape_string(
					$this->getSession(),
				)}";
				SQL
				,
			);

			if ($row->num_rows <= 0) {
				return new ResErr(ResErrCodes::UNAUTHORISED);
			}

			$userId = $row->fetch_assoc()['user_id'];
		} catch (mysqli_sql_exception $err) {
			return new ResErr(
				ResErrCodes::UNKNOWN,
				message: 'Failed to get user id from session',
				detail: $err,
			);
		}

		try {
			$row = $this->db->query(
				<<<SQL
				SELECT * FROM users WHERE user_id = "{$userId}";
				SQL
				,
			);

			if ($row->num_rows <= 0) {
				return new ResErr(ResErrCodes::UNAUTHORISED);
			}

			$data = $row->fetch_assoc();

			$user = new User(
				username: $data['username'],
				email: $data['email'],
				id: $data['user_id'],
			);
		} catch (mysqli_sql_exception $err) {
			return new ResErr(
				ResErrCodes::UNKNOWN,
				message: 'Failed to get user info from session id',
				detail: $err,
			);
		}

		return new ResOk($user);
	}
}
