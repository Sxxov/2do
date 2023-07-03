<?php

use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;
use api\v1\lib\common\ResOk;

ob_start();
require 'api/v1/debug/db/destroy.php';
$destroyRes = json_decode(ob_get_clean());
require 'api/v1/debug/db/init.php';
$initRes = json_decode(ob_get_clean());
if ($destroyRes->ok && $initRes->ok) {
	(new ResOk([
		'destroy' => $destroyRes,
		'init' => $initRes,
	]))->echo();
} else {
	(new ResErr(
		ResErrCodes::UNKNOWN,
		detail: json_encode([
			'destroy' => $destroyRes,
			'init' => $initRes,
		]),
	))->echo();
}
