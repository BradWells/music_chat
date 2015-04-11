/*
 *  dj-player-youtube.js
 *
 *  Creates a standard interface for the youtube API
 */
dj.players.youtube = {
  api: null,
  _evntCount: 0,
  _evnts: {},
  // check if this can handle the track
  handles: function(track) {
    return track.type == 'youtube';
  },
  play: function() {
    this.api.playVideo();
  },
  pause: function() {
    this.api.pauseVideo();
  },
  load: function(url) {
    this.api.loadVideoById(url);
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
    if (loc == undefined) return this.api.getCurrentTime();
    this.api.seekTo(loc, true);
    return this;
  },
  _handleStateChange: function(e) {
    // check if video is loaded
    if (e.data == 5 || e.data == 1) {
      // pop all 'loaded' events from event que
      for (var k in dj.players.youtube._evnts) {
        if (dj.players.youtube._evnts.hasOwnProperty(k)) {
          var e = dj.players.youtube._evnts[k];
          if (e.type == 'load') {
            e.cb();
            delete dj.players.youtube._evnts[k];
          }
        }
      }
    }
    if (e.data == 0) {
      // pop all 'ended' events from event que
      for (var k in dj.players.youtube._evnts) {
        if (dj.players.youtube._evnts.hasOwnProperty(k)) {
          var e = dj.players.youtube._evnts[k];
          if (e.type == 'end') {
            e.cb();
            delete dj.players.youtube._evnts[k];
          }
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
      'type': 'load',
      'cb': callback
    }

    return this;
  },
  mediaEnded: function(callback) {
    var s = this.api.getPlayerState();

    // push to event que
    this._evnts[++this._evntCount] = {
      'id': this._evntCount,
      'type': 'end',
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
// called by the youtube API when the iframe is loaded
function onYouTubeIframeAPIReady() { dj.players.youtube._doReady(); }