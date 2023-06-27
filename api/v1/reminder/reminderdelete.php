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

$db = Db::connect(DbInfo::getApp());

$body = file_get_contents('php://input');
$in = json_decode($body);
$userRes = (new Authenticator())->getSessionUser();
$id = $in->id;

if (!isset($in->id)) {
	return (new ResErr(ResErrCodes::INCOMPLETE))->echo();
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["row_id"])) {

    $rowId = $_POST["row_id"];

    $sql = "DELETE FROM reminders WHERE reminder_id = $rowId";

    if ($conn->query($sql) === TRUE) {
        echo "Row deleted successfully.";
    } else {
        echo "Error deleting row: " . $conn->error;
    }
}
// Close the database connection
$conn->close();
?>  