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
  initialize: function() {
    this.mute(this.state.muted);
    this.show(this.state.show);
    this.volume(this.state.volume);
  },
  applyState: function(s) {

    console.log (s);

    var freedom = Math.abs(s.location - this.location());
    console.log (freedom);

    if (this.currentTrack == null || this.currentTrack.id != s.track.id) {
      this.setTrack(s.track, s.location);
    } else if (freedom > SYNC_DEGREE_FREEDOM) {
      this.location(s.location);
    }

    if (s.status == 'PLAYING') {
      this.play();
    } else if (s.status == 'PAUSED') {
      this.pause();
    }

  },
  play: function() {
    this.state.status = 'PLAYING';
    if (!this.ACTIVE) return false;
    this.activePlayer.play();
    dj.utils.updateChannelCurrent();
    dj.view.onPlay();
    return this;
  },
  pause: function() {
    if (!this.ACTIVE) return false;
    this.activePlayer.pause();
    this.state.status = 'PAUSED';
    dj.utils.updateChannelCurrent();
    dj.view.onPlay();
    return this;
  },
  mute: function(doMute) {
    if (doMute == undefined || doMute == true) {
      this.state.muted = true;
      if (this.ACTIVE) this.activePlayer.mute();
      dj.view.onMute();
    } else {
      this.state.muted = false;
      if (this.ACTIVE) this.activePlayer.unMute();
      dj.view.onUnmute();
    }
    return this;
  },
  show: function(doShow) {
    var s = doShow || doShow == undefined;
    this.state.show = s;
    if (s) {
      if (this.ACTIVE) this.activePlayer.show();
      dj.view.onShow();
    } else {
      if (this.ACTIVE) this.activePlayer.hide();
      dj.view.onHide();
    }
    return this;
  },
  location: function(loc) {
    if (!this.ACTIVE) return false;
    this.state.location = loc;
    if (loc == undefined) return this.activePlayer.location();
    this.activePlayer.location(loc)
    dj.utils.updateChannelCurrent();
  },
  duration: function() {
    if (!this.ACTIVE) return false;
    return this.activePlayer.duration();
  },
  _setActivePlayer: function(player) {
    if (this.ACTIVE) this.activePlayer.shutdown();
    this.activePlayer = player;
    this.activePlayer.initialize(this.state);
    this.ACTIVE = true;
  },
  _getPlayerForTrack: function(track) {
    for (var player in dj.players) {
      if (dj.players.hasOwnProperty(player)) {
        var p = dj.players[player];
        if (p.handles(track)) return p;
      }
    }
    return false;
  },
  _restartTrack: function() {
    this.location(0);
    this.activePlayer.mediaEnded(this._onTrackEnd.bind(this));
  },
  _onTrackEnd: function() {
    if (dj.channel.owner) {
      var ntrack = dj.tracks.getNextTrack();
      if (this.currentTrack != undefined && ntrack.id == this.currentTrack.id) {
        this._restartTrack();
      } else {
        this.setTrack(ntrack);
      }
    }
  },
  setTrack: function(track, offset) {
    var then = new Date;
    offset = offset || 0;
    console.log ('setTrack(' + track.name + ', ' + offset + ');');
    var self = this;

    var p = this._getPlayerForTrack(track);
    if (p) {
      this._setActivePlayer(p);
    } else {
      var err = 'Could not find a valid player for this track type. (' + track.type +')';
      dj.errors.emit(err);
      return false;
    }

    if (this.currentTrack == null || track.id != this.currentTrack.id) {
      this.currentTrack = track;
      this.activePlayer.mediaLoaded(function() {

        if (self.state.status == 'UNSET' || self.state.status == 'PLAYING') {
          self.play();
        } else if (self.state.status == 'PAUSED') {
          self.pause();
        }

        var o = dj.utils.getRealOffset(then, offset);
        self.location(o);

        self.activePlayer.mediaEnded(self._onTrackEnd.bind(self));
      });

      this.activePlayer.load(this.currentTrack.url);
    } else {

      if (self.state.status == 'UNSET' || self.state.status == 'PLAYING') {
        self.play();
      } else if (self.state.status == 'PAUSED') {
        self.pause();
      }

      var o = dj.utils.getRealOffset(then, offset);
      self.location(o);

      dj.view.onTrackChange();
    }

    dj.utils.updateChannelCurrent();

    return this;
  },
  volume: function(vol) {
    if (!this.ACTIVE) return false;
    this.state.volume = vol;
    if (vol) dj.view.onVolumeChange();
    return this.activePlayer.volume(vol);
  }
}