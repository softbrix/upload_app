"use strict";
/* global window, Dropzone, $ */

var cfg = window.config;
window.title = cfg.title;
$('#title').text(cfg.title);
$('#paragraph').text(cfg.paragraph);
$('#from').attr("placeholder", cfg.input_placeholder);

var preventNavigation = function (e) {
  var confirmationMessage = 'Uploads going on. Are you sure you want to leave this page?';

  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
};

Dropzone.options.uploadForm = {
  dictDefaultMessage: window.config.dropzone_message,
  //paramName: "file", // The name that will be used to transfer the file
  maxFilesize: 500, // MB
  maxFiles : 99,
  init: function() {
    var totalFileSize = 0;

    this.on("addedfile", function(file) {
      console.log("Dropzone added file.");
      totalFileSize += file.size;
    });
    this.on("totaluploadprogress", function(progress, totalBytes, totalSent) {
      console.log(progress, totalBytes, totalSent);
    });
    this.on("sending", function(file, xhr, formData) {
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
      console.log('complete');
    });
    this.on("queuecomplete", function() {
      window.removeEventListener('beforeunload', preventNavigation, false);
    });
  }
};
