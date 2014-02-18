<?php
/*
UserCake Version: 2.0.2
http://usercake.com
*/

class userCakeMail {
	//UserCake uses a text based system with hooks to replace various strs in txt email templates
	public $contents = NULL;
	
	//Function used for replacing hooks in our templates
	public function newTemplateMsg($template,$additionalHooks)
	{
		global $mail_templates_dir,$debug_mode;
		
		$this->contents = file_get_contents($mail_templates_dir.$template);

		//Check to see we can access the file / it has some contents
		if(!$this->contents || empty($this->contents))
		{
			return false;
		}
		else
		{
			//Replace default hooks
			$this->contents = replaceDefaultHook($this->contents);
			
			//Replace defined / custom hooks
			$this->contents = str_replace($additionalHooks["searchStrs"],$additionalHooks["subjectStrs"],$this->contents);
			
			return true;
		}
	}
	
	public function sendMail($email,$subject,$msg = NULL)
	{
		global $websiteName,$emailAddress;
		
		$header = "MIME-Version: 1.0\r\n";
		$header .= "Content-type: text/html; charset=utf-8\r\n";
		$header .= "From: ". $websiteName . " <" . $emailAddress . ">\r\n";
		
		//Check to see if we sending a template email.
		if($msg == NULL)
			$msg = $this->contents; 
		
		$message = $msg;
		
		//$message = wordwrap($message, 70);

        require_once('PHPMailer_5.2.4/class.phpmailer.php');
        require_once("PHPMailer_5.2.4/class.smtp.php");

        $mail  = new PHPMailer();
        $mail->IsHTML(true);
        $mail->CharSet    ="UTF-8";                 //设定邮件编码，默认ISO-8859-1，如果发中文此项必须设置为 UTF-8
        $mail->IsSMTP();                            // 设定使用SMTP服务
        $mail->SMTPAuth   = true;                   // 启用 SMTP 验证功能
        $mail->SMTPSecure = "ssl";                  // SMTP 安全协议
        $mail->Host       = "smtp.exmail.qq.com";       // SMTP 服务器
        $mail->Port       = 465;                    // SMTP服务器的端口号
        $mail->Username   = "service@jizhangbao.com.cn";  // SMTP服务器用户名
        $mail->Password   = "jizhangbao2014";        // SMTP服务器密码
        $mail->SetFrom($emailAddress, $websiteName);    // 设置发件人地址和名称
        $mail->AddReplyTo($emailAddress,$websiteName);
        // 设置邮件回复人地址和名称
        $mail->Subject    = $subject;                     // 设置邮件标题
        $mail->AltBody    = "为了查看该邮件，请切换到支持 HTML 的邮件客户端";
        // 可选项，向下兼容考虑
        $mail->MsgHTML($message);                         // 设置邮件内容
        $mail->AddAddress($email, "");
        if(!$mail->Send()) {
            return false;
        } else {
            return true;
        }
		
		//return mail($email,$subject,$message,$header);
	}
}

?>