<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 10/2/13
 * Time: 9:18 PM
 * To change this template use File | Settings | File Templates.
 */
$src = @$_POST['src'];
if($src){
    $file = '../attachments/'.$src.'.txt';
    $handle = @fopen($file, 'r');
    $base64 = @fread($handle, filesize($file));
    @fclose($handle);
    if($base64){
        echo $base64;
    }
}
?>