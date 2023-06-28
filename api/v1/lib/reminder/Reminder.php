<?php

    namespace api\v1\lib\reminder;

    class Reminder {
        public string $id;
        public string $re_title;
        public string $re_datetime;
        public string $re_done;

        public function __construct(
            string $id,
            string $re_title,
            string $re_datetime,
            string $re_done,
        ) {
            $this->id = $id;
            $this->re_title = $re_title;
            $this->re_datetime = $re_datetime;
            $this->re_isCompleted = $re_done;
        }
    }


?>