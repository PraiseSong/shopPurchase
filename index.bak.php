<?php
/*
UserCake Version: 2.0.2
http://usercake.com
*/
require_once("models/config.php");
if (!securePage($_SERVER['PHP_SELF'])){die();}
require_once("models/header.php");

echo "
<body>
<link rel=\"stylesheet\" href=\"static/css/index.css\" />
<div id='wrapper'>
<div id='content'>
<div id='portal'>";
include("portal.php");

echo "
</div>
<div id='main'>
</div>
</div>
</body>
</html>";

?>
