// called by the youtube API when the iframe is loaded
function onYouTubeIframeAPIReady() { youtubePlayer._doReady(); }

youtubePlayer = {
  api: null,
  _evntCount: 0,
  _evnts: {},
  play: function() {
    this.api.playVideo();
  },
  pause: function() {
    this.api.pauseVideo();
  },
  load: function(url) {
    this.api.loadVideoByUrl(url);
  },
  mute: function() {
    this.api.mute();
    return this;
  },
  unMute: function() {
    this.api.unMute();
    return this;
  },
  volume: function(vol) {
    if (this.api != null) {
      if (!vol) return (this.api.getVolume() / 100);
      this.api.setVolume(vol * 100);
    }
    return this;
  },
  duration: function() {
    return this.api.getDuration();
  },
  location: function(loc) {
    if (!loc) return this.api.getCurrentTime();
    this.api.seekTo(loc, true);
    return this;
  },
  _handleStateChange: function(e) {
    // check if video is loaded
    if (e.data == 5 || e.data == 1) {
      // pop all from event que
      for (var k in youtubePlayer._evnts) {
        if (youtubePlayer._evnts.hasOwnProperty(k)) {
          youtubePlayer._evnts[k].cb();
          delete youtubePlayer._evnts[k];
        }
      }
    }
  },
  mediaLoaded: function(callback) {
    var s = this.api.getPlayerState();

    // execute callback if player is ready right now
    if (s == 5 || s == 1) {
      callback();
      return this;
    }

    // push to event que if player isn't ready
    this._evnts[++this._evntCount] = {
      'id': this._evntCount,
      'cb': callback
    }

    return this;
  },
  doStuff: function() { console.log ('SWAG'); },
  shutdown: function() {
    this.mute();
    this.pause();
    this.hide();
    return this;
  },
  initialize: function(state) {
    this.volume(state.volume);

    if (state.muted) {
      this.mute();
    } else {
      this.unMute();
    }

    if (state.show) {
      this.show();
    } else {
      this.hide();
    }

    return this;
  },
  show: function() {
    this.api.setSize(640, 360);
  },
  hide: function() {
    this.api.setSize(0, 0);
  },
  _doReady: function() {
    this.api = new YT.Player('youtube-player', {
      height: '0',
      width: '0',
      playerVars: { 'controls': 0, 'showinfo': 0 }
    });
    this.api.addEventListener('onStateChange', this._handleStateChange);
  }
}