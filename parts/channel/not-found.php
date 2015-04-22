<!-- This file is displayed after someone enters a channel name, and the channel has yet to be created by anyone. -->

<!-- Displays the not found message-->
<h4>
  <span class='channel-title'>
    <i class='fa fa-fw fa-eye-slash'></i> Channel not found
  </span>
</h4>

<!-- Displays what the channel name is, that has not yet been created -->
<p> The channel "<?php echo htmlspecialchars($channel_name); ?>" does not exist yet.</p>

<!-- Button to create a new channel with the previously specified name. -->
<div class='new-channel-container'>
  <p id='create-channel-response'></p>
  <input type='hidden' id='create-channel-name' value='<?php echo $channel_name; ?>'>
  <button type='button' id='create-channel'>Create it</button>
</div>

<!-- Displays a spinning cog whell upon loading new channel -->
<div class='loader new-channel-loader-container hide'>
  <i class='fa fa-2x fa-cog fa-spin'></i>
</div>