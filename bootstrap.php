<?php

use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

spl_autoload_register(function ($class) {
	$baseDir = __DIR__;
	$classPath = str_replace('\\', '/', $class);
	$filePath = $baseDir . '/' . $classPath . '.php';

	if (file_exists($filePath)) {
		require_once $filePath;
	}
});

$requestUri = preg_replace(
	'/^\//',
	'',
	preg_replace('/\/$/', '', $_SERVER['REQUEST_URI']),
);

try {
	if ($requestUri === '') {
		require_once 'index.php';
	} elseif (is_file($requestUri)) {
		require_once $requestUri;
	} elseif (is_file($requestUri . '.php')) {
		require_once $requestUri . '.php';
	} elseif (is_file($requestUri . '/index.php')) {
		require_once $requestUri . '/index.php';
	} elseif (is_file($requestUri . '/index.html')) {
		require_once $requestUri . '/index.html';
	} else {
		require_once '404.php';
	}
} catch (Exception $err) {
	return (new ResErr(
		ResErrCodes::UNKNOWN,
		message: 'An unknown error occurred',
		detail: $err,
	))->echo();
}
