var SYNC_INTERVAL = 5000;
var SYNC_DEGREE_FREEDOM = .5;

var dj = {
  controls : {},
  players  : {},
  api      : {},
  utils    : {},
  view     : {},
  errors   : {}
}

$(document).ready(function() {
  dj.api.getChannel(CURRENT_CHANNEL_NAME).done(function(data) {
    dj.channel = data;
    dj.view.onPageLoad();
    dj.controls.initialize();
  });
});


/*
 *  dj.errors
 *
 *  Do error stuff here
 */
dj.errors = {
  emit: function(err) {
    alert(err);
  }
}


/*
 *  misc.
 *
 */

// ## Get the Date in a mysql datetime format
Date.prototype.datetime = function() {
  var y = this.getFullYear();
  var M = this.getMonth() + 1;
  var d = this.getDate();
  var h = this.getHours();
  var m = this.getMinutes();
  var s = this.getSeconds();

  // pad the values
  M = M < 10 ? '0' + M : M;
  d = d < 10 ? '0' + d : d;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;

  // (yyyy-MM-dd hh:mm:ss)
  return (y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s);
}