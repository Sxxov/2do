<?php

namespace api\v1\lib\common;

enum ResErrCodes {
	case UNKNOWN;
	case INCOMPLETE;
	case INVALID;

	case UNAUTHORISED;

	case SIGN_UP_USERNAME_TAKEN;
	case SIGN_UP_EMAIL_TAKEN;

	case SIGN_IN_INVALID_CREDENTIALS;
	case SIGN_IN_USER_NOT_FOUND;

	case NOTE_NOT_FOUND;

	public function http(): HttpCodes {
		return match ($this) {
			self::UNKNOWN => HttpCodes::INTERNAL_SERVER_ERROR,
			self::INCOMPLETE => HttpCodes::BAD_REQUEST,
			self::INVALID => HttpCodes::BAD_REQUEST,
			self::UNAUTHORISED => HttpCodes::UNAUTHORISED,
			self::SIGN_UP_USERNAME_TAKEN => HttpCodes::CONFLICT,
			self::SIGN_UP_EMAIL_TAKEN => HttpCodes::CONFLICT,
			self::SIGN_IN_INVALID_CREDENTIALS => HttpCodes::CONFLICT,
			self::SIGN_IN_USER_NOT_FOUND => HttpCodes::CONFLICT,
			self::NOTE_NOT_FOUND => HttpCodes::BAD_REQUEST,
		};
	}

	public function key() {
		return match ($this) {
			self::UNKNOWN => 'UNKNOWN',
			self::INCOMPLETE => 'INCOMPLETE',
			self::INVALID => 'INVALID',
			self::UNAUTHORISED => 'UNAUTHORISED',
			self::SIGN_UP_USERNAME_TAKEN => 'SIGN_UP_USERNAME_TAKEN',
			self::SIGN_UP_EMAIL_TAKEN => 'SIGN_UP_EMAIL_TAKEN',
			self::SIGN_IN_INVALID_CREDENTIALS => 'SIGN_IN_INVALID_CREDENTIALS',
			self::SIGN_IN_USER_NOT_FOUND => 'SIGN_IN_USER_NOT_FOUND',
			self::NOTE_NOT_FOUND => 'NOTE_NOT_FOUND',
		};
	}
}
