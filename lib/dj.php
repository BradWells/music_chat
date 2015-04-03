<?php
class DJ {

  /**
   * Retrieve a channel by name
   * @param mywrap_con $con object to run queries on
   * @param String $channel_name the channel name to retrieve
   * @return Object|false given channel if it exists, false otherwise
   */
  public static function get_channel($con, $channel_name) {
    $results = $con->run('select * from channels where name = ? limit 1', 's', $channel_name);
    $channel = $results->fetch_array();

    if ($channel) {
      $channel['owner'] = DJ::owns_channel($channel_name);
      $channel['tracks'] = DJ::get_channel_tracks($con, $channel['id']);
      return $channel;
    }

    return false;
  }

  /**
   * Check if the current user owns the given channel name
   * @param String $channel_name the channel name to checkdate
   * @return boolean
   */
  public static function owns_channel($channel_name) {
    return (isset($_SESSION['channels'])) ? in_array($channel_name, $_SESSION['channels']) : false;
  }

  /**
   * Make current user 'owner' of given channel name
   * @param String $channel_name name of channel to add to current user
   */
  public static function add_channel_to_user($channel_name) {
    if (!isset($_SESSION['channels'])) $_SESSION['channels'] = array();
    array_push($_SESSION['channels'], $channel_name);
  }

  /**
   * Create a new channel given a channel name
   * @param mywrap_con $con object to run queries on
   * @param String $channel_name the channel name to create
   * @return Object|null recently created channel
   */
  public static function create_channel($con, $channel_name) {
    try {
      $results = $con->run('insert into channels (name) values (?)', 's', $channel_name);
    } catch(Exception $e) {
      $results = false;
    }

    // check if any value was actually added
    if ($results->affected_rows() > 0) {
      // add the channel to current user
      DJ::add_channel_to_user($channel_name);
      return DJ::get_channel($con, $channel_name);
    }
    return false;
  }

  /**
   * Get all tracks associated with a given channel ID, in order
   * @param mywrap_con $con object to run queries on
   * @param int $channel_id the channel id
   * @return Array list of tracks
   */
  public static function get_channel_tracks($con, $channel_id) {
    $tracks = array();
    $results = $con->run('select * from tracks where channel_id = ? order by number', 'i', $channel_id);
    while ($result = $results->fetch_array()) {
      $tracks[$result['id']] = $result;
    }
    return $tracks;
  }

  /**
   * Get all tracks associated with a given channel ID, in order
   * @param mywrap_con $con object to run queries on
   * @param int $channel_id the channel id
   * @param String $track_name name of the track
   * @param String $track_url the url of the track
   * @param int $track_number the (for order) number of the track
   * @return boolean true if track was added, false otherwise
   */
  public static function add_channel_track($con, $channel_id, $track_name, $track_url, $track_number) {
    $track_type = DJ::get_track_type($track_url);
    if ($track_type) {
      if (strlen($track_name) > 0)
      $results = $con->run(
        'insert into tracks (channel_id, name, url, number) values(?, ?, ?, ?, ?)',
        array($channel_id, $track_name, $track_url, $track_number, $track_type));
      return $results->affected_rows() > 0;
    }
    return false;
  }

  /**
   * Update the given channels "currently playing" info
   * @param mywrap_con $con object to run queries on
   * @param int $channel_id the channel id
   * @param int $track_id the currently playing track
   * @param 'PLAY'|'PAUSE'|'NEW' $status the current status of the track
   * @param string $update when this data was recorded (in datetime format)
   * @param double $offset the offset of the current track, in seconds
   */
  public static function set_channel_current($con, $channel_id, $track_id, $status, $update, $offset) {
    $con->run('update channels
      set
        current_status = ?,
        current_track = ?,
        current_position = ?,
        current_update = ?
      where id = ?',
      'sidsi', array($status, $track_id, $offset, $update, $channel_id));
  }

  /**
   * Check if the given url can be used with our system
   * @param String $track_url the url of the track
   * @return Boolean true if track is valid
   */
  public static function get_track_type($track_url) {
    // TODO

    $type = false;

    /**
    * List of acceptable HTML5 mime types and extensions available at:
    * http://voice.firefallpro.com/2012/03/html5-audio-video-mime-types.html
    */
    $audio_mime_types = array(
      "application/ogg",
      "audio/aac",
      "audio/mp4",
      "audio/mpeg",
      "audio/ogg",
      "audio/wav",
      "audio/webm"
    );
    $video_mime_types = array(
      "video/mp4",
      "video/ogg",
      "video/webm"
    );

    $types = get_headers($track_url, 1)["Content-Type"];
    print_r($types);

    //If one or more of the mime_types are html5 audio
    if(!empty(array_intersect($types, $audio_mime_types))){
      $type = 'html5-audio';
    }

    //If one or more of the mime_types are html5 video
    if(!empty(array_intersect($types, $video_mime_types))){
      $type = 'html5-video';
    }

    // check if it is a youtube video?
    // check if it is a raw mp3 file?
    return $type;
  }

} ?>