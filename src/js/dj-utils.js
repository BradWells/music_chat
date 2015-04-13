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
    if (dj.channel.owner) {
      setTimeout(function() {
        var update = (new Date);
        var chan = dj.channel.name;
        var track = dj.controls.currentTrack.id;
        var status = dj.controls.state.status;
        var offset = dj.controls.location();
        if (offset == undefined) offset = 0;
        dj.api.updateCurrent(chan, track, status, update.datetime(), offset);
      }, 500);
    }
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
    dj.api.getChannel(name).done(function(data) {
      if (!data) return false;

      dj.channel = data;

      var status = data.current_status;
      var offset = data.current_position;

      if (status == 'PLAYING') {
        var date = new Date(data.current_update.replace(/-/g,"/"));
        offset = dj.utils.getRealOffset(date, data.current_position);
      }

      var track = dj.channel.tracks[data.current_track];

      dj.controls.applyState({
        status: data.current_status,
        location: offset,
        track: track
      });

    });
  }
}