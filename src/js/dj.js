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
      var offset = music.getPosition(date, data.current_position);
      var freedom = Math.abs(offset - music.offset());
      if(set_track || freedom > SYNC_DEGREE_FREEDOM) {
        music.setTrack(current, offset);
      }
    } else if (status == 'PAUSE') {
      $('.player').addClass('hide');
      $('.channel-notification').html('The DJ has paused this channel');
      music.stop();
    } else {
      music.stop();
      $('.player').addClass('hide');
      $('.channel-notification').html('This is a new channel and the tracks haven\'t started playing yet');
      console.log ('This is a new channel and the tracks haven\'t started playing yet');
    }
  });
}


function formatDurations(s) {
  var m = Math.floor(s/60);
  s -= m * 60;
  s = Math.floor(s) + '';
  if (s.length == 0) {
    s = '00';
  }
  if (s.length == 1) {
    s = '0' + s;
  }
  return m + ':' + s;
}

var music = {
  player: $('#channel-player')[0],
  current: channel['tracks'][channel['current_track']],
  status: channel['status'],
  play: function() {
    this.player.play();
    this.status = 'PLAY';
  },
  stop: function() {
    this.player.pause();
    this.status = 'PAUSE';
  },
  nextTrack: function() {

  },
  offset: function() {
    return this.player.currentTime;
  },
  setTrack: function(track, offset) {
    offset = offset || 0; // offset will default to zero
    this.current = track; // set this' current track
    var self = this; // need a reference to self because of context change below
    // this function will be called once the audio can be played all the way through
    var startPlaying = function() {
      self.player.currentTime = offset;
      self.play();
      self.player.removeEventListener('canplaythrough', startPlaying, false);
    }
    // add event listener
    this.player.addEventListener('canplaythrough', startPlaying, false);
    // set new audio source
    this.player.src = track.url;
    return this;
  },
  start: function() {

  },
  getPosition: function(root, offset) {
    var now = new Date;
    return (now.getTime() - root.getTime()) * 0.001 + offset;
  }
}

function updateChannelCurrent() {
  var chan = channel['name'];
  var track = music.current.id;
  var status = music.status;
  var update = (new Date).datetime();
  var offset = music.offset();
  api.updateCurrent(chan, track, status, update, offset);
}

$(document).on('click', '.channel-set-track', function() {
  var track_id = $(this).data('track');
  var track = channel['tracks'][track_id]
  music.setTrack(track);
  updateChannelCurrent();
});

$(document).on('click', '.player-controls-pause', function() {
  music.stop();
  $(this).hide();
  $('.player-controls-play').show();
  updateChannelCurrent();
});

$(document).on('click', '.player-controls-play', function() {
  music.play();
  $(this).hide();
  $('.player-controls-pause').show();
  updateChannelCurrent();
});

$(document).on('click', '.player-volume-toggle', function() {
  if (music.player.muted) {
    music.player.muted = false;
    $(this).find('.fa-volume-off').removeClass('fa-volume-off');
    $(this).find('.fa').addClass('fa-volume-up');
  } else {
    music.player.muted = true;
    $(this).find('.fa-volume-up').removeClass('fa-volume-up');
    $(this).find('.fa').addClass('fa-volume-off');
  }
});

$(document).on('click', '.player-volume', function(e) {
  var posX = $(this).offset().left;
  var mouseX = e.pageX;
  var width = $(this).width();
  var vol = (mouseX - posX)/width;
  $('.player-volume-progress').css('width', vol * 100 + '%');
  music.player.volume = vol;
});

$(document).on('click', '.player-meter', function(e) {
  var posX = $(this).offset().left;
  var mouseX = e.pageX;
  var width = $(this).width();
  var prog = (mouseX - posX)/width;
  var loc = music.player.duration * prog;
  music.player.currentTime = loc;
  updateChannelCurrent();
});

// update total music duration
music.player.addEventListener('durationchange', function() {
  $('.player-time-total').html(formatDurations(music.player.duration));
}, false);

// Update music player time
music.player.addEventListener('timeupdate', function() {
  $('.player-time-current').html(formatDurations(music.player.currentTime));
  var len = music.player.currentTime/music.player.duration * 100;
  $('.player-meter-progress').css('width', len + '%');
}, false);

// update total music duration
music.player.addEventListener('loadstart', function() {
  $('.player-time-current').html('00:00');
  $('.player-time-total').html('13:37');
  $('.player-meter-progress').css('width', 0 + '%');
  $('.player-name').html('loading <i class="fa fa-fw fa-spin fa-cog"></i>');
}, false);

music.player.addEventListener('playing', function() {
  $('.player').removeClass('hide');
  $('.player-controls').removeClass('hide');
  $('.player-name').html(music.current.name);
});