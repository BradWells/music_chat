/**
 * An interface for the dj's track list
 */
dj.tracks = {
  mode: 'SHUFFLE',
  setMode: function(mode) {
    this.mode = mode;
  },
  currentId: null,
  getNextTrack: function() {
    if (this.mode == 'ORDERED') {
      // return _.sample(dj.channel.tracks);
    }
    if (this.mode == 'SHUFFLE') {
      return _.sample(dj.channel.tracks);
    }
  },
  addTrack: function(name, url) {
    trackNumber = dj.channel.tracks.length + 1;
    dj.api.addTrack(dj.channel.id, name, url, trackNumber).done(function(track) {
      dj.channel.tracks[track.id] = track;
      dj.view.onTrackAdded(track);
    });
  }
}