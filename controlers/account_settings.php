<?php
include_once('config/config.php');
include_once($libs_dir . '/db.php');
require_once("models/config.php");

$user_id = null;
if (isset($loggedInUser) && $loggedInUser->user_id) {
    $user_id = $loggedInUser->user_id;
}

if (!$user_id) {
    $result = array("bizCode" => 0, "memo" => "用户未登录", "data" => array("redirect" => "login.html"));
    exit(json_encode($result));
}

$db = new DB($db_name, $db_host, $db_username, $db_password);
$db->query("SET NAMES 'UTF8'");

if ($client_action === "update") {
    if (!empty($_POST)) {
        $errors = array();
        $successes = array();

        $displayname = @trim($_POST['displayname']);
        $email = @trim($_POST['email']);

        if ($displayname) {
            $origin_displayname = $loggedInUser->displayname;

            if ($displayname === $loggedInUser->displayname) {
                $errors[] = lang("ACCOUNT_DISPLAY_NOTHING");
            } else if (minMaxRange(5, 25, $displayname)) {
                $errors[] = lang("ACCOUNT_DISPLAY_CHAR_LIMIT", array(5, 25));
            } else if (displayNameExists($displayname)) {
                $errors[] = lang("ACCOUNT_DISPLAYNAME_IN_USE", array($displayname));
            } else {
                $loggedInUser->updateDisplayName($displayname);

                $successes[] = lang("ACCOUNT_DISPLAYNAME_UPDATED", array($displayname));
            }

            if (!isset($origin_displayname)) {
                $origin_displayname = $displayname;
            }
        }

        if ($email) {
            $origin_email = $loggedInUser->email;
            if ($email !== $loggedInUser->email) {
                if (!isValidEmail($email)) {
                    $errors[] = lang("ACCOUNT_INVALID_EMAIL");
                } else if (emailExists($email)) {
                    $errors[] = lang("ACCOUNT_EMAIL_IN_USE", array($email));
                } else {
                    $loggedInUser->updateEmail($email);
                    $successes[] = lang("ACCOUNT_EMAIL_UPDATED");
                }
            } else {
                $errors[] = lang("ACCOUNT_EMAIL_NOTHING");
            }

            if (!isset($origin_email)) {
                $origin_email = $email;
            }
        }

        function echo_memo($errors, $successes)
        {
            //Error block
            $str = '';
            if (count($errors) > 0) {
                $str .= "<div id='error'>
		<ul>";
                foreach ($errors as $error) {
                    $str .= "<li>" . $error . "</li>";
                }
                $str .= "</ul>";
                $str .= "</div>";
            }
            //Success block
            if (count($successes) > 0) {
                $str .= "<div id='success'>
		<ul>";
                foreach ($successes as $success) {
                    $str .= "<li>" . $success . "</li>";
                }
                $str .= "</ul>";
                $str .= "</div>";
            }

            return $str;
        }

        if (count($errors) !== 0) {
            $result = array("bizCode" => 0, "memo" => echo_memo($errors, $successes), "data" => array());
            echo json_encode($result);
            exit;
        } else if (count($errors) == 0) {
            $result = array("bizCode" => 1, "memo" => echo_memo($errors, $successes), "data" => array("user" => $loggedInUser));
            echo json_encode($result);
            exit;
        }
    } else {
        $result = array("bizCode" => 0, "memo" => "请使用POST提交", "data" => array());
        echo json_encode($result);
        exit;
    }
}
?>
