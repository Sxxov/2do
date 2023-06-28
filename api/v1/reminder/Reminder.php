<?php

    namespace api\v1\lib\reminder;

use api\v1\lib\auth\Authenticator;
use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;
use api\v1\lib\common\ResOk;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;
use api\v1\lib\note\Note;
use DateTime;
use mysqli_sql_exception;

    class Reminder {
        public string $id;
        public string $re_title;
        public string $re_datetime;

        public function __construct(
            string $id,
            string $re_title,
            string $re_datetime,
            string $re_isCompleted,
        ) {
            $this->id = $id;
            $this->re_title = $re_title;
            $this->re_datetime = $re_datetime;
            $this->re_isCompleted = $re_isCompleted;
        }
    }


?>