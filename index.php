<?php

use api\v1\lib\auth\Authenticator;
use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResOk;

$auth = new Authenticator();

header('Location: /app');
exit();
