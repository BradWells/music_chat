<?php
include 'parts/header.php';

$channel_name = $_GET['c']; // the current channel
$con          = new mywrap_con(); // a mysql wrapper object
$channel      = DJ::get_channel($con, $channel_name); // the channel object

if (!$channel) {
  include 'parts/channel/owner.php';
} else {
  if ($channel['owner']) {
    include 'parts/channel/owner.php';
  } else {
    include 'parts/channel/listener.php';
  }
}



?>
<h2><?php echo DJ::is_valid_track('http://dj.local/sample_music/Starling.mp3'); ?></h2>
<script> var channel = <?php echo json_encode($channel); ?> </script>
<?php include 'parts/footer.php'; ?>