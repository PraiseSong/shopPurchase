<?php
/*
UserCake Version: 2.0.2
http://usercake.com
*/

/*
%m1% - Dymamic markers which are replaced at run time by the relevant index.
*/

$lang = array();

//Account
$lang = array_merge($lang,array(
	"ACCOUNT_SPECIFY_USERNAME" 		=> "请输入用户名",
	"ACCOUNT_SPECIFY_PASSWORD" 		=> "请输入登录密码",
	"ACCOUNT_SPECIFY_EMAIL"			=> "请输入常用邮箱，比如QQ邮箱",
	"ACCOUNT_INVALID_EMAIL"			=> "无效的邮箱",
	"ACCOUNT_USER_OR_EMAIL_INVALID"		=> "用户名或邮箱错误",
	"ACCOUNT_USER_OR_PASS_INVALID"		=> "用户名或登录密码错误",
	"ACCOUNT_ALREADY_ACTIVE"		=> "账户已经激活，可以正常使用啦。",
	"ACCOUNT_INACTIVE"			=> "对不起，账户还没有激活！请登录邮箱激活",
	"ACCOUNT_USER_CHAR_LIMIT"		=> "用户名必须是 %m1% 到 %m2% 位英文或数字",
	"ACCOUNT_DISPLAY_CHAR_LIMIT"		=> "您家小店名必须是 %m1% 到 %m2% 位",
    "ACCOUNT_DISPLAY_NOTHING"   => "小店名没有更新",
    "ACCOUNT_EMAIL_NOTHING"   => "邮箱没有更新",
	"ACCOUNT_PASS_CHAR_LIMIT"		=> "登录密码必须是 %m1% 到 %m2% 位",
	"ACCOUNT_TITLE_CHAR_LIMIT"		=> "Titles must be between %m1% and %m2% characters in length",
	"ACCOUNT_PASS_MISMATCH"			=> "2次输入的登录密码不匹配",
	//"ACCOUNT_DISPLAY_INVALID_CHARACTERS"	=> "Display name can only include alpha-numeric characters",
	"ACCOUNT_USERNAME_IN_USE"		=> "用户名： %m1% 已存在",
	"ACCOUNT_DISPLAYNAME_IN_USE"		=> "小店名： %m1% 已存在",
	"ACCOUNT_EMAIL_IN_USE"			=> "邮箱： %m1% 已存在",
	"ACCOUNT_LINK_ALREADY_SENT"		=> "对不起，请在 %m1% 个小时后再来激活账户",
	"ACCOUNT_NEW_ACTIVATION_SENT"		=> "已经为您发送新的激活链接,请检查你的电子邮件",
	"ACCOUNT_SPECIFY_NEW_PASSWORD"		=> "请输入新的登录密码",
	"ACCOUNT_SPECIFY_CONFIRM_PASSWORD"	=> "请再次输入新的登录密码",
	"ACCOUNT_NEW_PASSWORD_LENGTH"		=> "新的登录密码必须是 %m1% 到 %m2% 位",
	"ACCOUNT_PASSWORD_INVALID"		=> "当前密码验证失败",
	"ACCOUNT_DETAILS_UPDATED"		=> "账户已更新",
	"ACCOUNT_ACTIVATION_MESSAGE"		=> "激活成功后，可登录 %m1%。请点击下面的链接激活账号\n\n
	%m2%activate-account.php?token=%m3%",
	"ACCOUNT_ACTIVATION_COMPLETE"		=> "您已成功激活账户，现在就 <a href=\"login.php\">登录</a>.",
	"ACCOUNT_REGISTRATION_COMPLETE_TYPE1"	=> "您已成功注册:-)，现在就 <a href=\"login.php\">登录</a> .",
	"ACCOUNT_REGISTRATION_COMPLETE_TYPE2"	=> "您已成功注册:-)，稍后会收到激活邮箱",
	"ACCOUNT_PASSWORD_NOTHING_TO_UPDATE"	=> "新密码与旧密码相同，更新失败",
	"ACCOUNT_PASSWORD_UPDATED"		=> "登录密码更新成功",
	"ACCOUNT_EMAIL_UPDATED"			=> "常用邮箱更新成功",
	"ACCOUNT_TOKEN_NOT_FOUND"		=> "Token不存在或者账户已激活",
	"ACCOUNT_USER_INVALID_CHARACTERS"	=> "用户名必须包含英文字母和数字",
	"ACCOUNT_DELETIONS_SUCCESSFUL"		=> "成功删除用户： %m1%",
	"ACCOUNT_MANUALLY_ACTIVATED"		=> "%m1% 的账户已被手动激活",
	"ACCOUNT_DISPLAYNAME_UPDATED"		=> "小店名修改为 %m1%",
	"ACCOUNT_TITLE_UPDATED"			=> "%m1% 的Title修改为 %m2%",
	"ACCOUNT_PERMISSION_ADDED"		=> "添加访问权限级别： %m1%",
	"ACCOUNT_PERMISSION_REMOVED"		=> "移除访问权限级别： %m1%",
	"ACCOUNT_INVALID_USERNAME"		=> "无效用户名",
	));

//Configuration
$lang = array_merge($lang,array(
	"CONFIG_NAME_CHAR_LIMIT"		=> "Site name must be between %m1% and %m2% characters in length",
	"CONFIG_URL_CHAR_LIMIT"			=> "Site name must be between %m1% and %m2% characters in length",
	"CONFIG_EMAIL_CHAR_LIMIT"		=> "Site name must be between %m1% and %m2% characters in length",
	"CONFIG_ACTIVATION_TRUE_FALSE"		=> "Email activation must be either `true` or `false`",
	"CONFIG_ACTIVATION_RESEND_RANGE"	=> "Activation Threshold must be between %m1% and %m2% hours",
	"CONFIG_LANGUAGE_CHAR_LIMIT"		=> "Language path must be between %m1% and %m2% characters in length",
	"CONFIG_LANGUAGE_INVALID"		=> "There is no file for the language key `%m1%`",
	"CONFIG_TEMPLATE_CHAR_LIMIT"		=> "Template path must be between %m1% and %m2% characters in length",
	"CONFIG_TEMPLATE_INVALID"		=> "There is no file for the template key `%m1%`",
	"CONFIG_EMAIL_INVALID"			=> "The email you have entered is not valid",
	"CONFIG_INVALID_URL_END"		=> "Please include the ending / in your site's URL",
	"CONFIG_UPDATE_SUCCESSFUL"		=> "Your site's configuration has been updated. You may need to load a new page for all the settings to take effect",
	));

//Forgot Password
$lang = array_merge($lang,array(
	"FORGOTPASS_INVALID_TOKEN"		=> "激活Token失效",
	"FORGOTPASS_NEW_PASS_EMAIL"		=> "已经向邮箱发送了新的密码",
    "FORGOTPASS_NEW_PASS_EMAIL_CLIENT"		=> "您的登录密码已经更新，请重新登录",
	"FORGOTPASS_REQUEST_CANNED"		=> "您已取消找回密码",
	"FORGOTPASS_REQUEST_EXISTS"		=> "已经有一个找回密码的请求在处理中。建议到邮箱中查找我们给您发送的邮件",
	"FORGOTPASS_REQUEST_SUCCESS"		=> "我们已经发邮件给您，请按照邮件里的步骤找回登录密码",
	));

//Mail
$lang = array_merge($lang,array(
	"MAIL_ERROR"				=> "尝试发送邮箱失败，请联系 %m1% 管理员",
	"MAIL_TEMPLATE_BUILD_ERROR"		=> "邮件模版处理失败",
	"MAIL_TEMPLATE_DIRECTORY_ERROR"		=> "不能打开邮箱模版目录，请尝试修改为： %m1%",
	"MAIL_TEMPLATE_FILE_EMPTY"		=> "邮件模版文件为空，没有内容发送",
	));

//Miscellaneous
$lang = array_merge($lang,array(
	"CAPTCHA_FAIL"				=> "验证码错误",
	"CONFIRM"				=> "确认找回我的密码",
	"DENY"					=> "算了，过一会再找吧",
	"SUCCESS"				=> "成功",
	"ERROR"					=> "错误",
	"NOTHING_TO_UPDATE"			=> "没有更新",
	"SQL_ERROR"				=> "数据库写入失败",
	"FEATURE_DISABLED"			=> "这个功能当前已禁用",
	"PAGE_PRIVATE_TOGGLED"			=> "这个页面当前是 %m1%",
	"PAGE_ACCESS_REMOVED"			=> "页面访问权限 %m1% 移除",
	"PAGE_ACCESS_ADDED"			=> "增加页面访问权限 %m1%",
	));

//Permissions
$lang = array_merge($lang,array(
	"PERMISSION_CHAR_LIMIT"			=> "Permission names must be between %m1% and %m2% characters in length",
	"PERMISSION_NAME_IN_USE"		=> "Permission name %m1% is already in use",
	"PERMISSION_DELETIONS_SUCCESSFUL"	=> "Successfully deleted %m1% permission level(s)",
	"PERMISSION_CREATION_SUCCESSFUL"	=> "Successfully created the permission level `%m1%`",
	"PERMISSION_NAME_UPDATE"		=> "Permission level name changed to `%m1%`",
	"PERMISSION_REMOVE_PAGES"		=> "Successfully removed access to %m1% page(s)",
	"PERMISSION_ADD_PAGES"			=> "Successfully added access to %m1% page(s)",
	"PERMISSION_REMOVE_USERS"		=> "Successfully removed %m1% user(s)",
	"PERMISSION_ADD_USERS"			=> "Successfully added %m1% user(s)",
	"CANNOT_DELETE_NEWUSERS"		=> "You cannot delete the default 'new user' group",
	"CANNOT_DELETE_ADMIN"			=> "You cannot delete the default 'admin' group",
	));
?>