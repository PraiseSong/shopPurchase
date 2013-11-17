<?php
/*
UserCake Version: 2.0.2
http://usercake.com
*/

//Database Information
$db_host = "localhost"; //Host address (most likely localhost)
$db_name = "rib"; //Name of Database
$db_user = "root"; //Name of database user
$db_pass = "ZHUqi@159"; //Password for database user
$db_table_prefix = "rib_";

GLOBAL $errors;
GLOBAL $successes;

$errors = array();
$successes = array();

/* Create a new mysqli object with database connection parameters */
$mysqli = new mysqli($db_host, $db_user, $db_pass, $db_name);

/* change character set to utf8 */
@$mysqli->set_charset("utf8");

GLOBAL $mysqli;

if(mysqli_connect_errno()) {
	echo "Connection Failed: " . mysqli_connect_errno();
	exit();
}

?>