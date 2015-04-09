<?php
session_start();
require_once '../lib/mysqli-wrapper/mywrap.php';
require_once '../lib/dj.php';

// http request method used
$method = $_SERVER['REQUEST_METHOD'];

// a connection object for running queries on the database
$con = new mywrap_con();

// check if POST method was used, if it was, create a new track
if ($method == 'POST') {
  $channel_id   = isset($_POST['channel_id']) ? $_POST['channel_id'] : false;
  $track_name   = isset($_POST['track_name']) ? $_POST['track_name'] : false;
  $track_url    = isset($_POST['track_url']) ? $_POST['track_url'] : false;
  $track_number = isset($_POST['track_number']) ? $_POST['track_number'] : false;

  if ($channel_id && $track_name && $track_url && $track_number) {
    $result = DJ::add_channel_track($con, $channel_id, $track_name, $track_url, $track_number);
  } else {
    $result = array('error' => 'Must include "channel_id", "track_name", "track_url", and "track_number" to create a new track.');
  }

  echo json_encode($result);
}
?>