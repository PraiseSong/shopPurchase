<?php
/*
UserCake Version: 2.0.2
http://usercake.com
*/

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
        $password = @$_POST["password"];
        $password_new = @$_POST["passwordc"];
        $password_confirm = @$_POST["passwordcheck"];

        //第三方平台登录的用户，密码为空
        //因此前台可以不传密码
        if (!$password) {
            $password = "";
        }
        if (!$password_new || !$password_confirm) {
            $errors[] = lang("ACCOUNT_SPECIFY_NEW_PASSWORD");
        }else{
            //Confirm the hashes match before updating a users password
            $entered_pass = generateHash($password, $loggedInUser->hash_pw);

            if ($entered_pass != $loggedInUser->hash_pw) {
            } else {
                if (minMaxRange(6, 50, $password_new)) {
                    $errors[] = lang("ACCOUNT_NEW_PASSWORD_LENGTH", array(6, 50));
                } else if ($password_new != $password_confirm) {
                    $errors[] = lang("ACCOUNT_PASS_MISMATCH");
                }

                //Also prevent updating if someone attempts to update with the same password
                $entered_pass_new = generateHash($password_new, $loggedInUser->hash_pw);

                if ($entered_pass_new == $loggedInUser->hash_pw) {
                    //Don't update, this fool is trying to update with the same password Â¬Â¬
                    $errors[] = lang("ACCOUNT_PASSWORD_NOTHING_TO_UPDATE");
                } else {
                    $loggedInUser->updatePassword($password_new);
                    $successes[] = lang("ACCOUNT_PASSWORD_UPDATED");
                }
            }
        }

        if (count($errors) == 0 AND count($successes) == 0) {
            $errors[] = lang("NOTHING_TO_UPDATE");
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
