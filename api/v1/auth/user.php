<?php

namespace api\v1\auth;

use api\v1\lib\auth\Authenticator;
use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;

session_start();
$sessionId = session_id();

if (!$sessionId) {
	return (new ResErr(ResErrCodes::UNAUTHORISED))->echo();
}

return (new Authenticator())->getSessionUser($sessionId)->echo();
