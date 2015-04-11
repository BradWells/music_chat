var SYNC_INTERVAL = 5000;
var SYNC_DEGREE_FREEDOM = 5;

$(document).on('click', '#create-channel', function() {
  var name = $('#create-channel-name').val();
  $('#new-channel-container').html('<h4>loading...</h4>');
  api.createChannel(name).done(function(data) {
    $('#new-channel-container').addClass('hide');
    $('#channel-container').removeClass('hide');
    console.log(data);
    channel = data;
  });
});

$(document).on('click', '#channel-add-track-confirm', function() {
  var name = $('#channel-add-track-name').val();
  var url = $('#channel-add-track-url').val();
  var input = $('#channel-container').html();
  $('#channel-container').html('<h4>loading...</h4>');
  //TODO what exactly is the track number?
  trackNumber = channel['tracks'].length + 1;
  api.addTrack(channel["id"], name, url, trackNumber).done(function(trackData) {
    console.log(trackData);
    if(trackData){
      $('#channel-container').html(
        '<h4>Track Addition Successful<h4>' + input
        ).prev().remove();
    } else {
      $('#channel-container').html(
        '<h4>Track Addition Failed<h4>' + input
        ).prev().remove();
    }
  });
});


/* Get the Date in a mysql datetime format */
Date.prototype.datetime = function() {
  var y = this.getFullYear();
  var M = this.getMonth() + 1;
  var d = this.getDate();
  var h = this.getHours();
  var m = this.getMinutes();
  var s = this.getSeconds();

  /* pad the values */
  M = M < 10 ? '0' + M : M;
  d = d < 10 ? '0' + d : d;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;

  /* (yyyy-MM-dd hh:mm:ss) */
  return (y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s);
}

$(document).on('click', '#channel-container-sync', function() {
  $('#channel-container-sync').hide();
  $('.channel-title-modifier').html('Enjoy the sweet sounds of');
 synchronize(channel['name'], true);
 setInterval(synchronize,  SYNC_INTERVAL, channel['name'], false);
});

function synchronize(name, set_track) {
  api.getChannel(name).done(function(data) {
    var status = data.current_status;
    if (status == 'PLAY') {
      $('.channel-notification').html('');
      var current = channel.tracks[data.current_track];
      var date = new Date(data.current_update.replace(/-/g,"/"));
      var offset = utils.getRealOffset(date, data.current_position);
      var freedom = Math.abs(offset - controls.location());
      if (set_track || freedom > SYNC_DEGREE_FREEDOM) {
        controls.setTrack(current, offset);
      }
    } else if (status == 'PAUSE') {
      $('.player').addClass('hide');
      $('.channel-notification').html('The DJ has paused this channel');
      controls.pause();
    } else {
      $('.player').addClass('hide');
      $('.channel-notification').html('This is a new channel and the tracks haven\'t started playing yet');
      controls.pause();
    }
  });
}

var players = {
  youtube: youtubePlayer,
  audio: html5audioPlayer
}

var controls = {
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
    utils.updateChannelCurrent();
    return this;
  },
  pause: function() {
    if (!this.ACTIVE) return false;
    this.activePlayer.pause();
    this.state.status = 'PAUSE';
    utils.updateChannelCurrent();
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
    view.onMuteChange();
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
    if (loc != undefined) utils.updateChannelCurrent();
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
  setTrack: function(track, offset) {
    console.log ('setTrack(' + track.name + ', ' + offset + ');');
    var self = this;

    if (track.type == 'youtube') {
      this.setActivePlayer(players.youtube);
    } else {
      this.setActivePlayer(players.audio);
    }

    if (this.currentTrack == null || track.id != this.currentTrack.id) {
      this.currentTrack = track;
      var then = new Date;
      this.activePlayer.mediaLoaded(function() {
        offset = offset || 0;
        var o = utils.getRealOffset(then, offset);
        self.location(o);
        if (self.state.status == 'UNSET' || self.state.status == 'PLAY') {
          self.play();
        } else if (self.state.status == 'PAUSE') {
          self.pause();
        }
        view.onTrackChange();
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
      view.onTrackChange();
    }

    return this;
  },
  volume: function(vol) {
    if (!this.ACTIVE) return false;
    this.state.volume = vol;
    return this.activePlayer.volume(vol);
  }
}

var utils = {
  getRealOffset: function(root, offset) {
    var now = new Date;
    return (now.getTime() - root.getTime()) * 0.001 + offset;
  },
  updateChannelCurrent: function() {
    var chan = channel.name;
    var track = controls.currentTrack.id;
    var status = controls.state.status;
    var update = (new Date);
    var offset = controls.location();
    api.updateCurrent(chan, track, status, update.datetime(), offset);
  },
  formatSeconds: function(s) {
    var m = Math.floor(s/60);
    s -= m * 60;
    s = Math.floor(s) + '';
    if (s.length == 0) s = '00';
    if (s.length == 1) s = '0' + s;
    return m + ':' + s;
  }
}

var view = {
  onTrackChange: function() {
    $('.player-name').html(controls.currentTrack.name);
    $('.player-time-current').html('~:~');
    $('.player-time-total').html('~:~');
  },
  onLocationChange: function() {
    var loc = controls.location();
    var dur = controls.duration();
    $('.player-time-current').html(utils.formatSeconds(loc));
    $('.player-time-total').html(utils.formatSeconds(dur));
    var len = loc / dur * 100;
    $('.player-meter-progress').css('width', len + '%');
  },
  onMuteChange: function() {
    if (controls.state.muted) {
      $('.player-volume-toggle .fa-volume-up').removeClass('fa-volume-up');
      $('.player-volume-toggle .fa').addClass('fa-volume-off');
    } else {
      $('.player-volume-toggle .fa-volume-off').removeClass('fa-volume-off');
      $('.player-volume-toggle .fa').addClass('fa-volume-up');
    }
  }
}

setInterval(view.onLocationChange, 1000);

$(document).on('click', '.channel-set-track', function() {
  var track_id = $(this).data('track');
  var track = channel['tracks'][track_id]
  controls.setTrack(track);
});

$(document).on('click', '.player-volume-toggle', function() {
  controls.mute(!controls.state.muted);
});

//
// $(document).on('click', '.player-controls-pause', function() {
//   music.stop();
//   $(this).hide();
//   $('.player-controls-play').show();
//   updateChannelCurrent();
// });
//
// $(document).on('click', '.player-controls-play', function() {
//   music.play();
//   $(this).hide();
//   $('.player-controls-pause').show();
//   updateChannelCurrent();
// });
//
// $(document).on('click', '.player-volume-toggle', function() {
//   if (music.player.muted) {
//     music.player.muted = false;
//     $(this).find('.fa-volume-off').removeClass('fa-volume-off');
//     $(this).find('.fa').addClass('fa-volume-up');
//   } else {
//     music.player.muted = true;
//     $(this).find('.fa-volume-up').removeClass('fa-volume-up');
//     $(this).find('.fa').addClass('fa-volume-off');
//   }
// });
//
// $(document).on('click', '.player-volume', function(e) {
//   var posX = $(this).offset().left;
//   var mouseX = e.pageX;
//   var width = $(this).width();
//   var vol = (mouseX - posX)/width;
//   $('.player-volume-progress').css('width', vol * 100 + '%');
//   music.player.volume = vol;
// });
//
$(document).on('click', '.player-meter', function(e) {
  var posX = $(this).offset().left;
  var mouseX = e.pageX;
  var width = $(this).width();
  var prog = (mouseX - posX)/width;
  var loc = controls.duration() * prog;
  controls.location(loc);
  // updateChannelCurrent();
});

$(document).on('click', '.player-volume', function(e) {
  var posX = $(this).offset().left;
  var mouseX = e.pageX;
  var width = $(this).width();
  var vol = (mouseX - posX)/width;
  $('.player-volume-progress').css('width', vol * 100 + '%');
  controls.volume(vol);
});