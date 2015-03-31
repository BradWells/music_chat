<h4> Welcome to <?php echo $channel_name; ?> </h4>
<div id='new-channel-container' class='<?php echo $channel ? 'hide' : ''; ?>'>
  <h4> This channel doesn't exist yet</h4>
  <input type='hidden' id='create-channel-name' value='<?php echo $channel_name; ?>'>
  <button type='button' id='create-channel'>Create it</button>
</div>
<div id='channel-container' class='<?php echo $channel ? '' : 'hide'; ?>'>
  <h4>Tracks</h4>
  <input id='channel-add-track-name' type='text'>
  <input id='channel-add-track-url' type='text'>
  <button type='button' id='channel-add-track-confirm'>Add</button>
</div>