/*
 *  DJ API
 *
 *  The dj-api controls all asynchronous communication
 *  between the client and server
 */
dj.api = {
  getChannel: function(channelName) {
    return $.ajax({
      url: ROOT + 'api/channel.php',
      method: 'get',
      dataType: 'json',
      data: {
        'name' : channelName
      }
    });
  },

  createChannel: function(channelName) {
    return $.ajax({
      url:  ROOT + 'api/channel.php',
      method: 'post',
      dataType: 'json',
      data: {
        'name' : channelName
      }
    });
  },

  addTrack: function(channelId, trackName, trackUrl, trackNumber) {
    return $.ajax({
      url:  ROOT + 'api/track.php',
      method: 'post',
      dataType: 'json',
      data: {
        'channel_id'   : channelId,
        'track_name'   : trackName,
        'track_url'    : trackUrl,
        'track_number' : trackNumber
      }
    });
  },

  updateCurrent: function(channelName, trackId, status, update, offset) {
    console.log ('UPDATE: ' + status + ' ' + update + ' + ' + offset);
    return $.ajax({
      url:  ROOT + 'api/current.php',
      method: 'post',
      dataType: 'json',
      data: {
        'channel_name' : channelName,
        'track_id'   : trackId,
        'status'     : status,
        'update'     : update,
        'offset'     : offset
      }
    });
  }
}