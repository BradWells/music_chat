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
  $('#channel-container').html('<h4>loading...</h4>');
  //TODO what exactly is the track number?
  trackNumber = channel['tracks'].length + 1;
  api.addTrack(channel["id"], name, url, trackNumber).done(function(trackData) {
    console.log(trackData);
  });
});




var music = {
  player: $('#channel-player')[0],
  current: null,
  start: function() {
    this.player.play();
  },
  stop: function() {

  },
  nextTrack: function() {

  },
  setTrack: function(track) {
    this.current = track;
    this.player.src = track.url;
    this.start();
  }
}

$(document).on('click', '.channel-set-track', function() {

  console.log($('#channel-player')[0]);

  var track = $(this).data('track');
  console.log(track);
  console.log(channel['tracks'][track]);
  music.setTrack(channel['tracks'][track]);
});