<!-- This page is displayed when a user requests a channel that has already been made. If they are not the owner of the page, they are a "listener" -->
<h4>
  <span class='channel-title-modifier'>loading: </span>
  <span class='channel-title'><?php echo htmlspecialchars($channel_name); ?></span> <!-- Displays channel name -->
</h4>
<div class='channel-container hide'>
  <button type='button' id='channel-container-sync'>Start Listening </button> <!-- Button to initiate the user to start listening to the DJ's music. -->
  <p class='channel-notification'></p>
  <?php include $root . 'parts/channel/player.php'; ?> <!-- Displays the audio/video player -->
</div>
<?php include $root . 'parts/channel/loader.php'; ?> <!-- Displays while the viewer page is loading -->