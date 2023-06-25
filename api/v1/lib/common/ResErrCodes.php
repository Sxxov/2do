<?php

namespace api\v1\lib\common;

enum ResErrCodes: string {
	case UNKNOWN = 'UNKNOWN';
	case INCOMPLETE = 'INCOMPLETE';
	case INVALID = 'INVALID';

	case SIGN_UP_USERNAME_TAKEN = 'SIGN_UP_USERNAME_TAKEN';
	case SIGN_UP_EMAIL_TAKEN = 'SIGN_UP_EMAIL_TAKEN';
}
