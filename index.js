"use strict";

var express        = require("express"),
    bodyParser     = require('body-parser'),
    compression    = require('compression'),
    shFiles        = require('./modules/shatabang_files'),
    app            = express(),
    path           = require('path');

var config = require('./config_server.json'); //JSON.parse(fs.readFileSync('server_config.json', 'utf8'));

var PORT = config.port || 3000;

var storageDir = config.storageDir; //'/Volumes/Mini\ Stick/sorted/';
var cacheDir = config.cacheDir; // '/Volumes/Mini\ Stick/cache/';
var deleteDir = config.deletedDir = path.join(storageDir, 'deleted');
var uploadDir = config.uploadDir = path.join(storageDir, 'upload');
var importDir = config.importDir = path.join(storageDir, 'import');

// Check that directories exists
[uploadDir, importDir, deleteDir, path.join(cacheDir, 'info')].forEach(function(directory) {
  if(!shFiles.exists(directory)) {
    console.log("Directory dir does not exists. Trying to create it.", directory);
    shFiles.mkdirsSync(directory);
  }
});

var routes = [];
routes.push({path: 'upload', route: require('./routes/uploads')});
//routes.push({path: 'images', route: require('./routes/images')});
//routes.push({path: 'dirs', route: require('./routes/dirs')});
//routes.push({path: 'auth', route: require('./routes/auth'), public: true});

routes.forEach(function(itm) {
  itm.route.initialize(config);
});

app.use(bodyParser.json());
app.use(compression());

app.get('/',function(req,res){
      res.sendFile(__dirname + "/client/index.html");
});
app.get('/client_config.js',function(req,res){
      res.sendFile(__dirname + "/config_client.js");
});

// Map the routes
routes.forEach(function(route) {
  var path = '/api/' + route.path;
  app.use(path, route.route);
});

app.use('/', express.static(__dirname + "/client/"));

app.listen(PORT, function(){
  console.log("Working on port " + PORT);
});
