<?php include 'parts/header.php'; ?>
<?php
$channel_name = $_GET['c']; // the current channel
$con          = new mywrap_con(); // a mysql wrapper object
$channel      = DJ::get_channel($con, $channel_name); // the channel object

if (!$channel) {
  $channel = DJ::create_channel($con, $channel_name); // create a new channel
}
?>
<h2> Welcome to <?php echo htmlspecialchars($channel_name); ?> </h2>

<?php if ($channel['owner']) : ?>
  <p> You own this channel </p>
  <?php if (!count($channel['tracks'])) : ?>
    <p> You do not have any tracks in this channel </p>
  <?php endif; ?>
<?php else : ?>
  <p> You don't own this channel </p>
<?php endif; ?>

<pre><?php print_r ($channel); ?></pre>
<?php include 'parts/footer.php'; ?>