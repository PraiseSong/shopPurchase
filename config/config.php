<?php
/**
 * Created by JetBrains PhpStorm.
 * User: praise
 * Date: 9/15/13
 * Time: 8:20 PM
 * To change this template use File | Settings | File Templates.
 */
ini_set("display_errors", "1");
error_reporting(E_ALL);
date_default_timezone_set('Asia/Shanghai');

/**
 * MySQL config
 */
$db_host = 'localhost';
$db_name = 'rib';
$db_username = 'root';
$db_password = 'ZHUqi@159';

/**
 * Product config
 */
define("PRODUCT_NAME", "夜市记账");
define("SITE_URL", "http://localhost/shopPurchase/");
define("SITE_ROOT_DIR", "");

/**
 * Directories config
 */
$attachments_dir = constant('SITE_ROOT_DIR')."attachment";
$libs_dir = constant('SITE_ROOT_DIR')."libraries";
$templates_dir = constant('SITE_ROOT_DIR')."templates";
$controler_dir = constant('SITE_ROOT_DIR')."controler";
?>