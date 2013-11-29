<?php
/*
UserCake Version: 2.0.2
http://usercake.com
*/

require_once("models/config.php");

//Forms posted
if(!empty($_POST))
{
	$errors = array();
	$username = sanitize(trim($_POST["username"]));
	$password = trim($_POST["password"]);
	
	//Perform some validation
	//Feel free to edit / change as required
	if($username == "")
	{
		$errors[] = lang("ACCOUNT_SPECIFY_USERNAME");
	}
	if($password == "")
	{
		$errors[] = lang("ACCOUNT_SPECIFY_PASSWORD");
	}

	if(count($errors) == 0)
	{
		//A security note here, never tell the user which credential was incorrect
		if(!usernameExists($username))
		{
			$errors[] = lang("ACCOUNT_USER_OR_PASS_INVALID");
		}
		else
		{
			$userdetails = fetchUserDetails($username);
			//See if the user's account is activated
			if($userdetails["active"]==0)
			{
				$errors[] = lang("ACCOUNT_INACTIVE");
			}
			else
			{
				//Hash the password and use the salt from the database to compare the password.
				$entered_pass = generateHash($password, $userdetails["password"]);
				
				if($entered_pass != $userdetails["password"])
				{
					//Again, we know the password is at fault here, but lets not give away the combination incase of someone bruteforcing
					$errors[] = lang("ACCOUNT_USER_OR_PASS_INVALID");
				}
				else
				{
					//Passwords match! we're good to go'
					
					//Construct a new logged in user object
					//Transfer some db data to the session object
					$loggedInUser = new loggedInUser();
					$loggedInUser->email = $userdetails["email"];
					$loggedInUser->user_id = $userdetails["id"];
					$loggedInUser->hash_pw = $userdetails["password"];
					$loggedInUser->title = $userdetails["title"];
					$loggedInUser->displayname = $userdetails["display_name"];
					$loggedInUser->username = $userdetails["user_name"];
					
					//Update last sign in
					$loggedInUser->updateLastSignIn();
					$_SESSION["userCakeUser"] = $loggedInUser;
                    setcookie("rib_user_name", $loggedInUser->username, time()+3600*24);
                    $_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp

                    $result = array("bizCode" => 1, "memo" => "登录成功", "data"=>array("user"=>$loggedInUser, "redirect" => "cashier.html"));
                    echo json_encode($result);
                    exit;
				}
			}
		}

        $result = array("bizCode" => 0, "memo" => "登录失败", "data"=>array("msg"=>$errors));
        echo json_encode($result);
        exit;
	}else{
        $result = array("bizCode" => 0, "memo" => "登录失败", "data"=>array("msg"=>$errors));
        echo json_encode($result);
        exit;
    }
}

?>
