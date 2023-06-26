<?php

namespace api\v1\auth;

use api\v1\lib\auth\Authenticator;

return (new Authenticator())->getSessionUser()->echo();
