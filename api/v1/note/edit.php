<?php

namespace api\v1\auth;

use api\v1\lib\auth\Authenticator;
use api\v1\lib\common\HttpCodes;
use api\v1\lib\common\ResErr;
use api\v1\lib\common\ResErrCodes;
use api\v1\lib\common\ResOk;
use api\v1\lib\db\Db;
use api\v1\lib\db\DbInfo;
use api\v1\lib\note\Note as NoteNote;
use api\v1\lib\note\Note;
use api\v1\lib\user\User;
use DateTime;
use mysqli_sql_exception;

$db = Db::connect(DbInfo::getApp());

$body = file_get_contents('php://input');
$in = json_decode($body);

if (!isset($in->username) || !isset($in->password) || !isset($in->email)) {
	return (new ResErr(ResErrCodes::INCOMPLETE))->echo();
}

$userId = (new Authenticator())->getSessionUser();

$updatedTitle = $in->title;
$updatedDescription = $in->description;
$datetime = new DateTime();
$dateModified = $datetime->format('Y-m-d H:i:s');
$id = $in->id;

try {
    $query = <<<SQL
        UPDATE notes SET title = "{$db->real_escape_string($updatedTitle)}",
                        description = "{$db->real_escape_string($updatedDescription)}",
                        dateModified = "{$db->real_escape_string($dateModified)}"
        WHERE todo_id = "{$db->real_escape_string($id)}";
    SQL;

    $db->query($query);

    // Check if the update was successful
    if ($db->affected_rows > 0) {
        $note = new Note(
            id: $row['user_id'],
            title: $row['title'],
            owner: $row['owner'],
            description: $row['description'],
            dateCreated: $row['dateCreated'],
            dateModified: $row['dateModified']
        );
        return new ResOk('Note updated successfully');
    } else {
        return new ResErr(
            ResErrCodes::NOTE_DISPLAY_ERROR,
            message: 'Failed to edit note',

        );
    }
} catch (mysqli_sql_exception $err) {
    return new ResErr(
        ResErrCodes::NOTE_DISPLAY_ERROR,
        message: 'Failed to edit note',
        detail: $err
    );
}

return new ResOk($note);
