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
  }
}