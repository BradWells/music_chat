/*
 *  dj-player-audio.js
 *
 *  Creates a standard interface for html5 audio
 */
dj.players.audio = {
  el: $('#html5-audio-player')[0],
  mimes: [
    'audio/aac',
    'audio/mp4',
    'audio/mpeg',
    'audio/ogg',
    'audio/wav',
    'audio/webm',
  ],
  handles: function(track) {
    var t = track.type;
    return $.inArray(t, this.mimes) > -1;
  },
  play: function() {
    this.el.play();
  },
  pause: function() {
    this.el.pause();
  },
  load: function(url) {
    this.el.src = url;
  },
  offset: function() {
    return this.el.currentTime;
  },
  volume: function(vol) {
    if (vol == undefined) return this.el.volume;
    this.el.volume = vol;
  },
  mute: function() {
    this.el.muted = true;
  },
  unMute: function() {
    this.el.muted = false;
  },
  duration: function() {
    return this.el.duration;
  },
  location: function(loc) {
    if (loc == undefined) return this.el.currentTime;
    this.el.currentTime = loc;
  },
  mediaLoaded: function(callback) {
    var self = this, cb = callback;
    var fn = function(e) {
      callback(e);
      self.el.removeEventListener('canplaythrough', fn, false);
    }
    this.el.addEventListener('canplaythrough', fn, false);
    return this;
  },
  mediaEnded: function(callback) {
    var self = this, cb = callback;
    var fn = function(e) {
      callback(e);
      self.el.removeEventListener('ended', fn, false);
    }
    this.el.addEventListener('ended', fn, false);
    return this;
  },
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
  // there is nothing to show or hide for pure html5 audio
  show: function() { return this; },
  hide: function() { return this; }
}