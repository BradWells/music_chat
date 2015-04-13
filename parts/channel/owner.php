<h4>
  <span class='channel-title-modifier'></span>
  <span class='channel-title'><?php echo htmlspecialchars($channel_name); ?></span>
  <span class='channel-title-status-container'>
    [<span class='channel-title-status'>LOADING</span>]
  </span>
</h4>
<div class='new-channel-container <?php echo $channel ? 'hide' : ''; ?>'>
  <h4> This channel doesn't exist yet</h4>
  <input type='hidden' id='create-channel-name' value='<?php echo $channel_name; ?>'>
  <button type='button' id='create-channel'>Create it</button>
</div>
<div class='channel-container hide'>

  <?php include $root . 'parts/channel/player-controls.php'; ?>
  <?php include $root . 'parts/channel/player.php'; ?>

  <h4>Add Track</h4>

  <label>Track name</label>
  <input id='channel-add-track-name' type='text'>

  <label>Track url</label>
  <input id='channel-add-track-url' type='text'>

  <button type='button' id='channel-add-track-confirm'>Add</button>

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