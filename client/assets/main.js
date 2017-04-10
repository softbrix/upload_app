"use strict";
/* global window, Dropzone, $, grecaptcha */

var cfg = window.config;
window.title = cfg.title;
$('#title').text(cfg.title);
$('#paragraph').text(cfg.paragraph);
$('#from').attr("placeholder", cfg.input_placeholder);
$('#recaptcha').attr("data-sitekey", cfg.recaptcha_data_sitekey);

var preventNavigation = function (e) {
  var confirmationMessage = 'Uploads going on. Are you sure you want to leave this page?';

  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
};

function hasRecaptcha() {
  var val = $('#uploadForm *[name=g-recaptcha-response').val();
  return val !== undefined && val.length > 0;
}

Dropzone.options.uploadForm = {
  dictDefaultMessage: window.config.dropzone_message,
  //paramName: "file", // The name that will be used to transfer the file
  maxFilesize: 500, // MB
  maxFiles : 99,
  accept: function(file, done) {
    console.log('accept?', file);
    if(hasRecaptcha()) {
      done();
    } else {
      var t, i = 0, max_retry = 120;
      t = setInterval(function() {
        var isDone = hasRecaptcha();
        if(isDone) {
          done();
        }
        if(isDone || i++ > max_retry) {
          clearInterval(t);
        }
      }, 1000);
    }
  },
  init: function() {
    var totalFileSize = 0;

    this.on("addedfile", function(file) {
      grecaptcha.execute();
      totalFileSize += file.size;
    });
    this.on("totaluploadprogress", function(progress, totalBytes, totalSent) {
      console.log(progress, totalBytes, totalSent);
    });
    this.on("sending", function(file, xhr, formData) {
      console.log($('#uploadForm *[name=g-recaptcha-response').val());

      // Will send the filesize along with the file as POST data.
      formData.append("filesize", file.size);

      var from = $('#from').val();
      if(from !== undefined && from.trim().length > 0) {
        formData.append("from", from);
        console.log('from', from);
      }
      window.addEventListener('beforeunload', preventNavigation, false);
    });
    this.on("success", function(file) {
      console.log('Success', file);
      // Remove the file once it is done
      /*setTimeout(function() {
        this.removeFile(file);
      }.bind(this), 4000);*/
    });
    this.on("complete", function() {
      //console.log('complete');
    });
    this.on("queuecomplete", function() {
      window.removeEventListener('beforeunload', preventNavigation, false);
    });
  }
};
