"use strict";

var express        = require("express"),
    bodyParser     = require('body-parser'),
    compression    = require('compression'),
    session        = require('express-session'),
    sessionFsStore = require('session-file-store')(session),
    shFiles        = require('./modules/shatabang_files'),
    app            = express(),
    argv           = require('minimist')(process.argv.slice(2)),
    reCAPTCHA      = require('recaptcha2'),
    path           = require('path');

var config = {};

config.port = process.env.PORT || 3001;
config.captcha_site_key = process.env.CAPTCHA_SITE_KEY;
config.captcha_secret = process.env.CAPTCHA_SECRET;
config.storageDir = process.env.STORAGE_DIR || './data'
config.sessionSecret = process.env.COOKIE_SECRET;

var storageDir = config.storageDir;
var deleteDir = config.deletedDir = path.join(storageDir, 'deleted');
var uploadDir = config.uploadDir = path.join(storageDir, 'upload');
var importDir = config.importDir = path.join(storageDir, 'import');

if(hasSiteKey(config)) {
  config.recaptcha = new reCAPTCHA({
    siteKey: config.captcha_site_key,
    secretKey: config.captcha_secret
  });
} else {
  console.log('Warning! Recaptcha not configured.');
}

// Check that directories exists
[uploadDir, importDir, deleteDir].forEach(function(directory) {
  if(!shFiles.exists(directory)) {
    console.log("Directory dir does not exists. Trying to create it.", directory);
    shFiles.mkdirsSync(directory);
  }
});

var routes = [];
routes.push({path: 'upload', route: require('./routes/uploads')});
//routes.push({path: 'dirs', route: require('./routes/dirs')});

routes.forEach(function(itm) {
  itm.route.initialize(config);
});

app.use(bodyParser.json());
app.use(compression());
app.use(session({
  resave: false,
  saveUninitialized: true,
  store: new sessionFsStore({}),
  secret: config.sessionSecret
}));

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

app.listen(config.port, function(){
  console.log("Working on port " + config.port);
});

function hasSiteKey(config) {
  var k = config.captcha_site_key;
  return k !== undefined && k.length > 1 && k !== 'YOUR_SITE_KEY';
}
