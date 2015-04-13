<h4>
  <span class='channel-title-modifier'>loading: </span>
  <span class='channel-title'><?php echo htmlspecialchars($channel_name); ?></span>
</h4>
<div class='channel-container hide'>
  <button type='button' id='channel-container-sync'>Start Listening </button>
  <p class='channel-notification'></p>
  <?php include $root . 'parts/channel/player.php'; ?>
</div>
<?php include $root . 'parts/channel/loader.php'; ?>