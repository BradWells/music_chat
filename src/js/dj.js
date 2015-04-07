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
  api.getChannel(channel['name']).done(function(data) {
    var status = data.current_status;
    if (status == 'PLAY') {
      var current = channel.tracks[data.current_track];
      var date = new Date(data.current_update.replace(/-/g,"/"));
      var offset = music.getPosition(date, data.current_position);
      music.setTrack(current, offset);
    } else if (status == 'PAUSE') {
      music.stop();
    } else {
      music.stop();
      console.log ('This is a new channel and the tracks haven\'t started playing yet');
    }
  });
});


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
    return (now.getTime() - root.getTime()) * 0.001;
  }
}

$(document).on('click', '.channel-set-track', function() {
  var track_id = $(this).data('track');
  var track = channel['tracks'][track_id]
  music.setTrack(track);
});

// this will be done automatically later
$(document).on('click', '#channel-container-update', function() {
  var chan = channel['id'];
  var track = music.current.id;
  var status = music.status;
  var update = (new Date).datetime();
  var offset = music.offset();
  api.updateCurrent(chan, track, status, update, offset);
});

