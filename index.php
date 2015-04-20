<!-- The home page of the site, this is the first thing given to a visitor -->

<!-- Get the root directory -->
<?php $_r = preg_replace(':/[^/]+:', '../', dirname($_SERVER['SCRIPT_NAME'])); ?>
<!-- If root is a single slash, remove the slash-->
<?php $root = $_r == '/' || $_r == '\\' ? '' : $_r; ?>
<?php include 'parts/header.php'; ?>
<?php $con = new mywrap_con(); ?>

<h4> ~ grp.space </h4>

<!-- go to channel -->
<span class='go-channel-location'>
  http://grp.space/at/<input type='text' id='go-channel-name'>
</span>
<button type='button' id='go-channel'>go</button>
<p id='go-channel-err' class='text-err'></p>

<br />
<br />

<?php $channels = DJ::get_recent_channels($con); ?>

<div class='recent-channels'>
  <h5> Recent Channels </h5>
  <table>
    <thead>
      <tr>
        <th>name</th>
        <th>created</th>
        <th>updated</th>
        <th>status</th>
      </tr>
    </thead>
    <tbody>
    <?php foreach ($channels as $indx=>$channel) : ?>
      <tr>
        <td><a href='at/<?php echo $channel['name']; ?>'><?php echo $channel['name']; ?></a></td>
        <td><?php echo $channel['created']; ?></td>
        <td><?php echo $channel['current_update']; ?></td>
        <td><?php echo $channel['current_status']; ?></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</div>

<!-- Set root variable of client javascript to the root determined by php -->
<?php echo "\n<script> var ROOT = " . json_encode($root) . "; </script>\n"; ?>
<?php include 'parts/footer.php'; ?>