<?php
include 'parts/header.php';

$channel_name = $_GET['c']; // the current channel
$con          = new mywrap_con(); // a mysql wrapper object
$channel      = DJ::get_channel($con, $channel_name); // the channel object

if (!$channel) {
  include 'parts/channel/owner.php';
} else {
  if ($channel['owner']) {
    include 'parts/channel/player.php';
    include 'parts/channel/owner.php';
  } else {
    include 'parts/channel/player.php';
    include 'parts/channel/listener.php';
  }
}
?>
<script> var channel = <?php echo json_encode($channel); ?> </script>
<?php include 'parts/footer.php'; ?>