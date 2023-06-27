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
    $id = $in->id;

    // Calculate the date one week from now
    $oneDayFromNow = date('Y-m-d H:i:s', strtotime('+1 Day'));

    // Retrieve the task reminders that are not completed and due within one week
    try {$res = $db->query(

            <<<SQL
            PREPARE("SELECT * FROM reminder WHERE due_date < ? AND is_completed = 0");
            SQL
            ,
        );

        $res = \exec($oneDayFromNow);
        $res = \pg_fetch_assoc($reminders);
        
        // Send the alert for each task
        foreach ($reminders as $reminders) {
            sendAlert($reminders['re_title']);
        }
    } catch (mysqli_sql_exception $err){
        return (new ResErr(ResErrCodes::UNKNOWN, detail: $err))->echo();

    }

    return (new ResOk($reminders))->echo();

?>