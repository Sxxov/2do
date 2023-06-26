<?php

namespace api\v1\auth;

use api\v1\lib\auth\Authenticator;
use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;

$body = file_get_contents('php://input');
$in = json_decode($body);

if (!isset($in->username) || !isset($in->password)) {
	return (new ResErr(ResErrCodes::INCOMPLETE))->echo();
}

return (new Authenticator())->signIn($in->username, $in->password)->echo();
