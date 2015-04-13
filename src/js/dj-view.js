/*
 *  dj-view.js
 *
 *  Update view on certain events
 */
dj.view = {
  onTrackChange: function() {
    console.log ('TRACK CHANGE');
    $('.player-name').html(dj.controls.currentTrack.name);
    $('.player-time-current').html('~:~');
    $('.player-time-total').html('~:~');
  },
  onPlay: function() {
    $('.channel-title-status').html(dj.controls.state.status);
  },
  onPause: function() {
    $('.channel-title-status').html(dj.controls.state.status);
  },
  onMute: function() {
    $('.player-volume-toggle .fa-ban').show();
  },
  onUnmute: function() {
    $('.player-volume-toggle .fa-ban').hide();
  },
  onShow: function() {
    $('.player-video-toggle .fa-ban').hide();
  },
  onHide: function() {
    $('.player-video-toggle .fa-ban').show();
  },
  onVolumeChange: function() {
    $('.player-volume-progress').css('width', dj.controls.state.volume * 100 + '%');
  },
  onLocationChange: function() {
    var loc = dj.controls.location();
    var dur = dj.controls.duration();
    $('.player-time-current').html(dj.utils.formatSeconds(loc));
    $('.player-time-total').html(dj.utils.formatSeconds(dur));
    var len = loc / dur * 100;
    $('.player-meter-progress').css('width', len + '%');
  },
  onPageLoad: function() {
    if (dj.channel.owner) {
      $('.channel-title-modifier').html('Station: ');
    } else {
      $('.channel-title-modifier').html('Ready to play: ');
      $('.player').addClass('no-control');
    }

    $('.channel-container').removeClass('hide');
    $('.channel-loader-container').addClass('hide');

    $('.channel-title-status').html(dj.controls.state.status);

    if (dj.controls.state.status == 'UNSET') {
      $('.player').hide();
      $('.player-controls').hide();
    }
  },
  trackTemplate: _.template('<li style="display: none;" id="track-<%- id %>"><%- name %> <button type="button" class="channel-set-track" data-track="<%- id %>"><i class="fa fa-fw fa-play"></i></button></li>'),
  onTrackAdded: function(t) {
    $('#tracklist').append(dj.view.trackTemplate(t));
    $('#track-' + t.id).slideDown();
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
  $('.player').show();
  $('.player-controls').show();
  dj.controls.setTrack(track);
});

// ## Volume Toggle
$(document).on('click', '.player-volume-toggle', function() {
  dj.controls.mute(!dj.controls.state.muted);
});

// ## Video Toggle
$(document).on('click', '.player-video-toggle', function() {
  dj.controls.show(!dj.controls.state.show);
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
  if (dj.channel.owner) {
    var posX = $(this).offset().left;
    var mouseX = e.pageX;
    var width = $(this).width();
    var prog = (mouseX - posX) / width;
    var loc = dj.controls.duration() * prog;
    dj.controls.location(loc);
  }
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
  $('.channel-title').html('Creating channel &hellip;');
  $('.new-channel-loader-container').removeClass('hide');
  $('.new-channel-container').addClass('hide');
  dj.api.createChannel(name).done(function(data) {
    if (data) {
      location.reload();
    } else {
      $('#create-channel-response').html('This channel already exists');
    }
  });
});

// ## Add Track Button
$(document).on('click', '#channel-add-track-confirm', function() {
  var name = $('#channel-add-track-name').val();
  var url = $('#channel-add-track-url').val();
  var input = $('#channel-container').html();
  dj.tracks.addTrack(name, url);
});

// ## Go-to-channel
$(document).on('click', '#go-channel', function() {
  var name = $('#go-channel-name').val();
  if (name != '') {
    name = encodeURIComponent(name);
    location.href = ROOT + 'at/' + name;
  } else {
    $('#go-channel-err').html('channel name cannot be empty');
  }
});

// ## Start Listening Button
$(document).on('click', '#channel-container-sync', function() {
  $('#channel-container-sync').hide();
  $('.channel-title-modifier').html('Welcome to');
  dj.utils.synchronize(dj.channel.name, true);
  $('.player').show();
  setInterval(dj.utils.synchronize,  SYNC_INTERVAL, dj.channel.name, false);
});

// ## check location in track every second
setInterval(dj.view.onLocationChange, 1000);