<!--   A loading display, while the webpage loads the specified channel -->
<h4>
  <span class='channel-title-modifier'></span>
  <span class='channel-title'><?php echo htmlspecialchars($channel_name); ?></span>
  <span class='channel-title-status-container'>
    [<span class='channel-title-status'>LOADING</span>]
  </span>
</h4>

<!-- A display for when the specified channel is not yet created. Displays the channel name a button to create the channel. Hides itself upon pressing the button. -->
<div class='new-channel-container <?php echo $channel ? 'hide' : ''; ?>'>
  <h4> This channel doesn't exist yet</h4>
  <input type='hidden' id='create-channel-name' value='<?php echo $channel_name; ?>'>
  <button type='button' id='create-channel'>Create it</button>
</div>
<div class='channel-container hide'>

<!-- Displays the controls for an owner of a channel (play, pause, etc), and the audio/video player itself -->
  <?php include $root . 'parts/channel/player-controls.php'; ?>
  <?php include $root . 'parts/channel/player.php'; ?>

 <!-- Provides input fields to add a new track (both title and link to audio file) to the channel's playlist. Is created upon pressing the button. -->
  <h4>Add Track</h4>
  <label>Track name</label>
  <input id='channel-add-track-name' type='text'>
  <label>Track url</label>
  <input id='channel-add-track-url' type='text'>
  <button type='button' id='channel-add-track-confirm'>Add</button>

  <!-- Displays the playlist (tracklist) for the current channel. -->
  <h4>Tracklist</h4>
  <div class='tracklist-container'>
    <ul id='tracklist' class='tracklist'>
      <?php if ($channel) : ?>
        <?php foreach ($channel['tracks'] as $i=>$track) : ?>
          <li id='track-<?php echo $track['id']; ?>'>
            <?php echo $track['name']; ?>
            <button type='button' class='channel-set-track' data-track='<?php echo $track['id']; ?>'>
              <i class='fa fa-fw fa-play'></i>
            </button>
          </li>
        <?php endforeach; ?>
      <?php endif; ?>
    </ul>
  </div>
</div>
<?php include $root . 'parts/channel/loader.php'; ?>