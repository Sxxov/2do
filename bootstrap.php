<?php

spl_autoload_register(function ($class) {
	$baseDir = __DIR__;
	$classPath = str_replace('\\', '/', $class);
	$filePath = $baseDir . '/' . $classPath . '.php';

	if (file_exists($filePath))
		require_once $filePath;
});

$request_uri = preg_replace('/^\//', "", preg_replace('/\/$/', '', $_SERVER['REQUEST_URI']));

if ($request_uri === '/')
	require 'index.php';
else if (is_file($request_uri))
	require $request_uri;
else if (is_file($request_uri . '.php'))
	require $request_uri . '.php';
else if (is_file($request_uri . '/index.php'))
	require $request_uri . '/index.php';
else require '404.php';
