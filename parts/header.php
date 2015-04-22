<!-- Page included in most pages of the website. Does necessary setup, and begins the display of the page -->

<!-- Starts the php ssession used to track users of the website -->
<?php session_start(); ?>

<!-- Includes the necessary files needed for the database calls -->
<?php require_once $root . 'lib/mysqli-wrapper/mywrap.php'; ?>
<?php require_once $root . 'lib/dj.php'; ?>

<!-- Displays title of the page, and references the needed stylesheets -->
<!doctype html>
<html lang='en'>
  <head>
    <meta charset='utf-8'></meta>
    <title>~ grp.space ~</title>
    <link type='text/css' rel='stylesheet' href='<?php echo $root; ?>src/css/dj.css'></link>
    <link type='text/css' rel='stylesheet' href='<?php echo $root; ?>src/css/font-awesome.min.css'></link>
  </head>
  <body>
    <div class='page-header'>
      <div class='page'>
        <!-- <h1>BE UR OWN DJ</h1> -->
      </div>
    </div>
    <div class='page-content'>
      <div class='page'>