/*
 *  dj-view.js
 *
 *  Update view on certain events
 */
dj.view = {
  onTrackChange: function() {
    $('.player-name').html(dj.controls.currentTrack.name);
    $('.player-time-current').html('~:~');
    $('.player-time-total').html('~:~');
  },
  onLocationChange: function() {
    var loc = dj.controls.location();
    var dur = dj.controls.duration();
    $('.player-time-current').html(dj.utils.formatSeconds(loc));
    $('.player-time-total').html(dj.utils.formatSeconds(dur));
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
  },
  onPageLoad: function() {
    console.log ('ALL READY');
  }
}

/*
 *  dj-view-events.js
 *
 *  Handle user interface events
 */

// ## When the DJ clicks on a track
$(document).on('click', '.channel-set-track', function() {
  var track_id = $(this).data('track');
  var track = dj.channel['tracks'][track_id]
  dj.controls.setTrack(track);
});

// ## Volume Toggle
$(document).on('click', '.player-volume-toggle', function() {
  dj.controls.mute(!controls.state.muted);
});

// ## Pause Button
$(document).on('click', '.player-controls-pause', function() {
  dj.controls.pause();
  $(this).hide();
  $('.player-controls-play').show();
});

// ## Play Button
$(document).on('click', '.player-controls-play', function() {
  dj.controls.play();
  $(this).hide();
  $('.player-controls-pause').show();
});

// ## Play Meter/Slider
$(document).on('click', '.player-meter', function(e) {
  var posX = $(this).offset().left;
  var mouseX = e.pageX;
  var width = $(this).width();
  var prog = (mouseX - posX)/width;
  var loc = dj.controls.duration() * prog;
  dj.controls.location(loc);
});

// ## Volume Controls
$(document).on('click', '.player-volume', function(e) {
  var posX = $(this).offset().left;
  var mouseX = e.pageX;
  var width = $(this).width();
  var vol = (mouseX - posX)/width;
  $('.player-volume-progress').css('width', vol * 100 + '%');
  dj.controls.volume(vol);
});

// ## Create Channel Button
$(document).on('click', '#create-channel', function() {
  var name = $('#create-channel-name').val();
  $('#new-channel-container').html('<h4>loading...</h4>');
  dj.api.createChannel(name).done(function(data) {
    $('#new-channel-container').addClass('hide');
    $('#channel-container').removeClass('hide');
    dj.channel = data;
  });
});

// ## Add Track Button
$(document).on('click', '#channel-add-track-confirm', function() {
  var name = $('#channel-add-track-name').val();
  var url = $('#channel-add-track-url').val();
  var input = $('#channel-container').html();
  $('#channel-container').html('<h4>loading...</h4>');
  //TODO what exactly is the track number?
  trackNumber = dj.channel.tracks.length + 1;
  dj.api.addTrack(dj.channel.id, name, url, trackNumber).done(function(trackData) {
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

// ## Start Listening Button
$(document).on('click', '#channel-container-sync', function() {
  $('#channel-container-sync').hide();
  $('.channel-title-modifier').html('Enjoy the sweet sounds of');
  dj.utils.synchronize(channel['name'], true);
  setInterval(dj.utils.synchronize,  SYNC_INTERVAL, dj.channel.name, false);
});

// ## check location in track every second
setInterval(dj.view.onLocationChange, 1000);