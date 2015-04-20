<?php
/**
 * This is the server-side http request handler for a current channel status.
 * Specifically, it handles updating a channel's info server-side when a client-side request is given (POST).
 */
session_start();
require_once '../lib/mysqli-wrapper/mywrap.php';
require_once '../lib/dj.php';

// http request method used
$method = $_SERVER['REQUEST_METHOD'];

// a connection object for running queries on the database
$con = new mywrap_con();

// check if POST method was used, if it was, update the current channel info
if ($method == 'POST') {
  $chan   = isset($_POST['channel_name']) ? $_POST['channel_name'] : false;
  $track  = isset($_POST['track_id']) ? $_POST['track_id'] : false;
  $status = isset($_POST['status']) ? $_POST['status'] : 'NEW';
  $update = isset($_POST['update']) ? $_POST['update'] : '';
  $offset = isset($_POST['offset']) ? $_POST['offset'] : '0';

  if ($chan && $track) {
    $result = DJ::set_channel_current($con, $chan, $track, $status, $update, $offset);
  } else {
    $result = array('error' => 'Must specify channel name and track ID');
  }

  echo json_encode($result);
}
?>