<?php

use api\v1\lib\common\HttpCodes;
use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;

spl_autoload_register(function ($class) {
	$baseDir = __DIR__;
	$classPath = str_replace('\\', '/', $class);
	$filePath = $baseDir . '/' . $classPath . '.php';

	if (file_exists($filePath)) {
		require_once $filePath;
	}
});

$request_uri = preg_replace(
	'/^\//',
	'',
	preg_replace('/\/$/', '', $_SERVER['REQUEST_URI']),
);

try {
	if ($request_uri === '/') {
		require_once 'index.php';
	} elseif (is_file($request_uri)) {
		require_once $request_uri;
	} elseif (is_file($request_uri . '.php')) {
		require_once $request_uri . '.php';
	} elseif (is_file($request_uri . '/index.php')) {
		require_once $request_uri . '/index.php';
	} elseif (is_file($request_uri . '/index.html')) {
		require_once $request_uri . '/index.html';
	} else {
		require_once '404.php';
	}
} catch (Exception $err) {
	return ResErr::send(
		ResErrCodes::UNKNOWN,
		http: HttpCodes::INTERNAL_SERVER_ERROR,
		message: 'An unknown error occurred',
		detail: $err,
	);
}
