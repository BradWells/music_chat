<?php
session_start();
require_once '../lib/mysqli-wrapper/mywrap.php';
require_once '../lib/dj.php';

// http request method used
$method = $_SERVER['REQUEST_METHOD'];

// a connection object for running queries on the database
$con = new mywrap_con();

// check if GET method was used, if it was: get the given channel
if ($method == 'GET') {
  $name = isset($_GET['name']) ? $_GET['name'] : false;

  if ($name) {
    $result = DJ::get_channel($con, $name);
  } else {
    $result = array('error' => 'Must specify channel name');
  }

  echo json_encode($result, JSON_PRETTY_PRINT);
}

// check if POST method was used, if it was, create a new channel
if ($method == 'POST') {
  $name = isset($_POST['name']) ? $_POST['name'] : false;

  if ($name) {
    $result = DJ::create_channel($con, $name);
  } else {
    $result = array('error' => 'Must specify channel name');
  }

  echo json_encode($result, JSON_PRETTY_PRINT);
}
?>