<?php

namespace api\v1\auth;

use api\v1\lib\auth\Authenticator;

$body = file_get_contents('php://input');
$in = json_decode($body);

$auth = new Authenticator();

if (!$in || !isset($in->username)) {
	return $auth->getSessionUser()->echo();
}

return $auth->getUser($in->username)->echo();
