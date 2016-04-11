var idx = require('./modules/shatabang_index');
var _ = require('underscore');
var ProgressBar = require('progress');


var logGet = function(k) {
  console.log("idx.get('"+k+"'):", idx.get(k));
};
var logSearch = function(k) {
  console.log("idx.search('"+k+"'):",idx.search(k));
};


idx.usePath('./idx_tst');

idx.put('as', 'the beste1');
idx.put('asa', 'the beste2');
idx.put('asas', 'the beste3');
idx.put('asasas', 'the beste4');

idx.put('asa', 'the beste');
idx.put('asa', 'the beste1');
idx.put('asa', 'the beste2');

var noOfItems = 2000;

var bar = new ProgressBar('[:bar] :percent :elapseds :etas', { total: noOfItems });

/* Fill with garbage **/
_.times(noOfItems, function(n) {
  var k = (Math.random() * 10e20).toString(36).substring(0,_.random(2, 20));

  _.times(200, function(n) {
      var v = (Math.random() * 10e20).toString(36);
    idx.put(k, v);
  });

  bar.tick();
});


bar = new ProgressBar('[:bar] :percent :elapseds :etas', { total: noOfItems });
/** Put plenty items in single file */
var k = "D5320";
_.times(noOfItems, function(n) {
    var v = (Math.random() * 10e20).toString(36);
  idx.put(k, v);

  bar.tick();
});
logSearch(k);
logGet(k);

logGet('ase');
logGet('asa');

logSearch('sas');
logSearch('as');
logSearch('es');