<?php

use api\v1\lib\auth\Authenticator;
use api\v1\lib\common\ResErr;

if ((new Authenticator())->getSessionUser() instanceof ResErr) {
	return header('Location: /auth/sign-in');
}
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Calendar — 2do</title>

		<link rel="stylesheet" href="/global.css" />
		<link rel="stylesheet" href="index.css" />
		<script type="module" src="index.js"></script>
	</head>

	<body>
		<x-index />
	</body>
</html>
