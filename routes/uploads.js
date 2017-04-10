"use strict";
var express = require('express'),
    shFiles = require('../modules/shatabang_files');
var router = express.Router(),
    multer  =   require('multer');
var sanitize = require("sanitize-filename");

var totalUpload = {
  size: 0,
  files: 0
};
var uploadDir, storageDir, importDir, recaptcha;
router.initialize = function(config) {
  uploadDir = config.uploadDir;
  storageDir = config.storageDir;
  importDir = config.importDir;
  recaptcha = config.recaptcha;
};
var partPrefix = 'part-';

function cleanFromString(str) {
  if(str !== undefined) {
    return str.replace(/\s+/g, "_");
  }
  return "";
}

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    var from = cleanFromString(req.body.from);
    var filename = partPrefix + from + '-'+Date.now()+ '-' + file.originalname;
    filename = sanitize(filename);
    console.log('Uploading: ' + filename, from);
    callback(null, filename);
  }
});
var uploadSingle = multer({ storage : storage}).single('file');
var uploadMultiple = multer({ storage : storage}).array('files', 999);

router.post('/single', function(req,res) {
    uploadSingle(req,res, function(err) {
        if(err) {
          console.log(err);
          return res.status(500).end("Error uploading file.");
        }
        var handleUpload = function() {
          var file = req.file;
          shFiles.moveFile(file.path, importDir + '/' + file.filename.substr(partPrefix.length));
          totalUpload.size += file.size;
          totalUpload.files += 1;

          res.end("File is uploaded");
        };

        var sess = req.session;
        if (sess.trusted && recaptcha !== undefined) {
          handleUpload();
        } else {
          recaptcha.validateRequest(req)
            .then(function() {
              console.log('session validated');
              sess.trusted = true;
              handleUpload();
            })
            .catch(function(errorCodes) {
              console.log(recaptcha.translateErrors(errorCodes));
              res.status(400).end();
            });
        }
    });
});

router.post('/multiple',function(req,res) {
    uploadMultiple(req,res,function(err) {
        if(err) {
          console.log(err);
            return res.status(500).end("Error uploading files.");
        }
        res.end("Files are uploaded");
    });
});

router.get('/info', function(req,res) {
  res.send(totalUpload).end();
});


module.exports = router;
