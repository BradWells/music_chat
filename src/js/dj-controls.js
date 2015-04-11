/*
 *  dj.controls
 *
 *  Controls the sound/video
 */
dj.controls = {
  currentTrack: null,
  activePlayer: null,
  ACTIVE: false,
  muted: false,
  state: {
    status: 'UNSET',
    muted: false,
    volume: 0.75,
    location: 0,
    show: true
  },
  play: function() {
    this.state.status = 'PLAY';
    if (!this.ACTIVE) return false;
    this.activePlayer.play();
    dj.utils.updateChannelCurrent();
    return this;
  },
  pause: function() {
    if (!this.ACTIVE) return false;
    this.activePlayer.pause();
    this.state.status = 'PAUSE';
    dj.utils.updateChannelCurrent();
    return this;
  },
  mute: function(doMute) {
    if (doMute == undefined || doMute == true) {
      this.state.muted = true;
      if (this.ACTIVE) this.activePlayer.mute();
    } else {
      this.state.muted = false;
      if (this.ACTIVE) this.activePlayer.unMute();
    }
    dj.view.onMuteChange();
    return this;
  },
  show: function(doShow) {
    var s = doShow || doShow == undefined;
    this.state.show = s;
    if (!this.ACTIVE) return false;
    if (s) {
      this.activePlayer.show();
    } else {
      this.activePlayer.hide();
    }
    return this;
  },
  location: function(loc) {
    if (!this.ACTIVE) return false;
    this.state.location = loc;
    if (loc != undefined) dj.utils.updateChannelCurrent();
    return this.activePlayer.location(loc);
  },
  duration: function() {
    if (!this.ACTIVE) return false;
    return this.activePlayer.duration();
  },
  setActivePlayer: function(player) {
    if (this.ACTIVE) this.activePlayer.shutdown();
    this.activePlayer = player;
    this.activePlayer.initialize(this.state);
    this.ACTIVE = true;
  },
  getPlayerForTrack: function(track) {
    for (var player in dj.players) {
      if (dj.players.hasOwnProperty(player)) {
        var p = dj.players[player];
        if (p.handles(track)) return p;
      }
    }
    return false;
  },
  setTrack: function(track, offset) {
    console.log ('setTrack(' + track.name + ', ' + offset + ');');
    var self = this;

    var p = this.getPlayerForTrack(track);
    if (p) {
      this.setActivePlayer(p);
    } else {
      var err = 'Could not find a valid player for this track type. (' + track.type +')';
      dj.errors.emit(err);
      return false;
    }

    if (track.type == 'youtube') {
      this.setActivePlayer(dj.players.youtube);
    } else {
      this.setActivePlayer(dj.players.audio);
    }

    if (this.currentTrack == null || track.id != this.currentTrack.id) {
      this.currentTrack = track;
      var then = new Date;
      this.activePlayer.mediaLoaded(function() {
        offset = offset || 0;
        var o = dj.utils.getRealOffset(then, offset);
        self.location(o);
        if (self.state.status == 'UNSET' || self.state.status == 'PLAY') {
          self.play();
        } else if (self.state.status == 'PAUSE') {
          self.pause();
        }
        dj.view.onTrackChange();
      });
      this.activePlayer.load(this.currentTrack.url);
    } else {
      console.log ('ALRDY ON THIS TRACK');
      offset = offset || 0;
      self.location(offset);
      if (self.state.status == 'UNSET' || self.state.status == 'PLAY') {
        self.play();
      } else if (self.state.status == 'PAUSE') {
        self.pause();
      }
      dj.view.onTrackChange();
    }

    return this;
  },
  volume: function(vol) {
    if (!this.ACTIVE) return false;
    this.state.volume = vol;
    return this.activePlayer.volume(vol);
  }
}