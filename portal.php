<?php
/*
UserCake Version: 2.0.2
http://usercake.com
*/

if (!securePage($_SERVER['PHP_SELF'])){die();}

//Links for logged in user
if(isUserLoggedIn()) {
	echo "
	<ul>
	<li><a href='account.php'>我的小店</a></li>
	<li><a href='security_settings.php'>安全设置</a></li>
	<li><a href='user_settings.php'>账户设置</a></li>
	<li><a href='logout.php'>退出</a></li>
	</ul>";
	
	//Links for permission level 2 (default admin)
	if ($loggedInUser->checkPermission(array(2))){
	echo "
	<ul>
	<li><a href='admin_configuration.php'>系统配置</a></li>
	<li><a href='admin_users.php'>用户管理</a></li>
	<li><a href='admin_permissions.php'>权限管理</a></li>
	<li><a href='admin_pages.php'>页面管理</a></li>
	</ul>";
	}
} 
//Links for users not logged in
else {
	echo "
	<ul>
	<li><a href='login.php'>登录</a></li>
	<li><a href='register.php'>注册小店</a></li>
	<li><a href='forgot-password.php'>登录密码忘记了</a></li>";
	if ($emailActivation)
	{
	echo "<li><a href='resend-activation.php'>重新激活小店</a></li>";
	}
	echo "</ul>";
}

?>
