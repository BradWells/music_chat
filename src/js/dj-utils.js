/*
 *  utils
 *
 *  Utility methods
 */
dj.utils = {
  getRealOffset: function(root, offset) {
    var now = new Date;
    return (now.getTime() - root.getTime()) * 0.001 + offset;
  },
  updateChannelCurrent: function() {
    var chan = dj.channel.name;
    var track = dj.controls.currentTrack.id;
    var status = dj.controls.state.status;
    var update = (new Date);
    var offset = dj.controls.location();
    dj.api.updateCurrent(chan, track, status, update.datetime(), offset);
  },
  formatSeconds: function(s) {
    var m = Math.floor(s/60);
    s -= m * 60;
    s = Math.floor(s) + '';
    if (s.length == 0) s = '00';
    if (s.length == 1) s = '0' + s;
    return m + ':' + s;
  },
  synchronize: function(name, set_track) {
    api.getChannel(name).done(function(data) {
      var status = data.current_status;
      if (status == 'PLAY') {
        $('.channel-notification').html('');
        var current = dj.channel.tracks[data.current_track];
        var date = new Date(data.current_update.replace(/-/g,"/"));
        var offset = dj.utils.getRealOffset(date, data.current_position);
        var freedom = Math.abs(offset - dj.controls.location());
        if (set_track || freedom > SYNC_DEGREE_FREEDOM) {
          dj.controls.setTrack(current, offset);
        }
      } else if (status == 'PAUSE') {
        $('.player').addClass('hide');
        $('.channel-notification').html('The DJ has paused this channel');
        dj.controls.pause();
      } else {
        $('.player').addClass('hide');
        $('.channel-notification').html('This is a new channel and the tracks haven\'t started playing yet');
        dj.controls.pause();
      }
    });
  }
}