<h4>
  <span class='channel-title'>
    <i class='fa fa-fw fa-eye-slash'></i> Channel not found
  </span>
</h4>

<p> The channel "<?php echo htmlspecialchars($channel_name); ?>" does not exist yet.</p>

<div class='new-channel-container'>
  <p id='create-channel-response'></p>
  <input type='hidden' id='create-channel-name' value='<?php echo $channel_name; ?>'>
  <button type='button' id='create-channel'>Create it</button>
</div>

<div class='loader new-channel-loader-container hide'>
  <i class='fa fa-2x fa-cog fa-spin'></i>
</div>