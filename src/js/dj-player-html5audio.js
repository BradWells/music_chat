html5audioPlayer = {
  el: $('#html5-audio-player')[0],
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
  show: function() { return this; },
  hide: function() { return this; }
}