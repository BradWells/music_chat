<!-- Various displays for the video / audio player function buttons -->
<div class='player'>
  <div class='player-playing'>
    <div class='player-options-container'>
      <button type='button' class='btn-ctl player-video-toggle'> <!-- Toggles the video view box on and off -->
        <span class='fa-stack'>
          <i class='fa fa-stack-1x fa-video-camera'></i>
          <i class='fa fa-stack-2x fa-ban'></i>
        </span>
      </button>
      <button type='button' class='btn-vol player-volume-toggle'> <!-- Controls the  player's audio volume -->
        <span class='fa-stack'>
          <i class='fa fa-stack-1x fa-volume-up'></i>
          <i class='fa fa-stack-2x fa-ban'></i>
        </span>
      </button>
      <div class='player-volume-max'>
        <div class='player-volume'>
          <div class='player-volume-progress'>
          </div>
        </div>
      </div>
    </div>
    <span class='player-time'>
      (<span class='player-time-current'>1:04</span>/<span class='player-time-total'>2:32</span>)
    </span>
    <span class='player-name'>Darude Sandstorm</span>
  </div>
  <div class='player-meter'> <!-- Displays the progress bar for the video / audio currently loaded to the player --->
    <div class='player-buffer-progress'></div>
    <div class='player-meter-progress'></div>
  </div>
</div>

<!-- Specifies the kind of audio play we want displayed --->
<audio id='html5-audio-player'></audio>
<div id='youtube-player-container'>
  <div id='youtube-player-cover'></div>
  <div id='youtube-player'></div>
</div>