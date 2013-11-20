
<?php
/**
 * Created by PhpStorm.
 * User: apple
 * Date: 11/20/13
 * Time: 5:44 PM
 */
require_once("qqConnect2.0/API/qqConnectAPI.php");
$qc = new QC();
$acs = $qc->qq_callback();
$oid = $qc->get_openid();
$qc = new QC($acs,$oid);
$uinfo = $qc->get_user_info();

var_dump($uinfo);
?>