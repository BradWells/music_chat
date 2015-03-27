/*
 * This file controls all communication between the client and server
 */
var BASEURL = 'api/';

var api = {
  getChannel: function(channelName) {
    return $.ajax({
      url: BASEURL + 'channel.php',
      method: 'get',
      data: {
        'name' : channelName
      }
    });
  },

  createChannel: function(channelName) {
    return $.ajax({
      url: BASEURL + 'channel.php',
      method: 'post',
      data: {
        'name' : channelName
      }
    });
  },

  addTrack: function(channelId, trackName, trackUrl, trackNumber) {
    return $.ajax({
      url: BASEURL + 'track.php',
      method: 'post',
      data: {
        'channel_id'   : channelId,
        'track_name'   : trackName,
        'track_url'    : trackUrl,
        'track_number' : trackNumber
      }
    });
  }
}