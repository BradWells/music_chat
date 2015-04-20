<!-- This is main page for a channel-->

<!-- Get the root directory -->
<?php $_r = preg_replace(':/[^/]+:', '../', dirname($_SERVER['SCRIPT_NAME'])); ?>
<!-- If root is a single slash, remove the slash-->
<?php $root = $_r == '/' || $_r == '\\' ? '' : $_r; ?>
<?php

include $root . 'parts/header.php';

$channel_name = ltrim($_GET['_url'], '/'); // the current channel
$con          = new mywrap_con(); // a mysql wrapper object
$channel      = DJ::get_channel($con, $channel_name); // the channel object

if (!$channel) {
  include $root . 'parts/channel/not-found.php';
} else {
  if ($channel['owner']) {
    include $root . 'parts/channel/owner.php';
  } else {
    include $root . 'parts/channel/listener.php';
  }
}

echo "\n<script> var CHANNEL_EXISTS = " . json_encode(!!$channel) . "; </script>\n";
echo "\n<script> var CHANNEL_NAME = " . json_encode($channel_name) . "; </script>\n";
//Set root variable of client javascript to the root determined by php
echo "\n<script> var ROOT = " . json_encode($root) . "; </script>\n";
include $root . 'parts/footer.php';
?>