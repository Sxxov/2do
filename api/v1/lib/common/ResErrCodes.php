<?php

namespace api\v1\lib\common;

enum ResErrCodes {
	case UNKNOWN;
	case INCOMPLETE;
	case INVALID;
	case NOT_FOUND;

	case UNAUTHORISED;
	case FORBIDDEN;

	case SIGN_UP_USERNAME_TAKEN;
	case SIGN_UP_EMAIL_TAKEN;

	case SIGN_IN_INVALID_CREDENTIALS;
	case SIGN_IN_USER_NOT_FOUND;

	public function http(): HttpCodes {
		return match ($this) {
			self::UNKNOWN => HttpCodes::INTERNAL_SERVER_ERROR,
			self::INCOMPLETE => HttpCodes::BAD_REQUEST,
			self::INVALID => HttpCodes::BAD_REQUEST,
			self::NOT_FOUND => HttpCodes::NOT_FOUND,
			self::UNAUTHORISED => HttpCodes::UNAUTHORISED,
			self::FORBIDDEN => HttpCodes::FORBIDDEN,
			self::SIGN_UP_USERNAME_TAKEN => HttpCodes::CONFLICT,
			self::SIGN_UP_EMAIL_TAKEN => HttpCodes::CONFLICT,
			self::SIGN_IN_INVALID_CREDENTIALS => HttpCodes::UNAUTHORISED,
			self::SIGN_IN_USER_NOT_FOUND => HttpCodes::NOT_FOUND,
		};
	}

	public function key() {
		return match ($this) {
			self::UNKNOWN => 'UNKNOWN',
			self::INCOMPLETE => 'INCOMPLETE',
			self::INVALID => 'INVALID',
			self::NOT_FOUND => 'NOT_FOUND',
			self::UNAUTHORISED => 'UNAUTHORISED',
			self::FORBIDDEN => 'FORBIDDEN',
			self::SIGN_UP_USERNAME_TAKEN => 'SIGN_UP_USERNAME_TAKEN',
			self::SIGN_UP_EMAIL_TAKEN => 'SIGN_UP_EMAIL_TAKEN',
			self::SIGN_IN_INVALID_CREDENTIALS => 'SIGN_IN_INVALID_CREDENTIALS',
			self::SIGN_IN_USER_NOT_FOUND => 'SIGN_IN_USER_NOT_FOUND',
		};
	}
}
