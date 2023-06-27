<?php    

    namespace api\v1\auth;

    use api\v1\lib\auth\Authenticator;
    use api\v1\lib\common\ResErr;
    use api\v1\lib\common\ResErrCodes;
    use api\v1\lib\common\ResOk;
    use api\v1\lib\db\Db;
    use api\v1\lib\db\DbInfo;
    use api\v1\lib\reminder\Reminder;
    use api\v1\lib\user\User;
    use mysqli;
    use mysqli_sql_exception;

    $db = Db::connect(DbInfo::getApp());

    $body = file_get_contents('php://inputs');
    $in = \json_decode($body);

    if (!isset($in->re_title) || !isset($in->re_datetime)) {
        return(new ResErr(ResErrCodes::INCOMPLETE))->echo();
    }

    $userRes = (new Authenticator())->getSessionUser();

    $reminders = new Reminders(
        id: uniqid('reminders_'),
        re_title: $in->title,
        re_datetime: $in->datetime,
    );
    try {
        $db->query(
            <<<SQL
            INSERT INTO reminder (
                reminder_id,
                re_title,
                re_datetime,
            )
            VALUES (
                "{$db->real_escape_string($reminders->id)}",
                "{$db->real_escape_string($reminders->re_title)}",
                "{$db->real_escape_string($reminders->re_datetime)}",
            );
            SQL
            ,
        );
    } catch (mysqli_sql_exception $err) {
        return (new ResErr(ResErrCodes::UNKNOWN, detail: $err))->echo();
    }
    
    return (new ResOk($reminders))->echo();
    
?>