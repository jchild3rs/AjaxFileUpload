/*! Ajax File Upload Plugin - v0.1.0 - 2013-01-27
* https://github.com/jchild3rs/AjaxFileUpload
* Copyright (c) 2013 James Childers; Licensed MIT */

(function() {
  var AjaxFileUpload;

  AjaxFileUpload = (function() {
    var bindEvents, defaultSettings, handleFileSelection;

    function AjaxFileUpload(input, options) {
      this.input = input;
      this.settings = this.utils.extend(options, defaultSettings);
      bindEvents(this.input);
    }

    AjaxFileUpload.prototype.validate = {
      inputType: function(type) {
        return type === "file";
      },
      fileName: function() {},
      fileSize: function() {},
      fileType: function() {}
    };

    AjaxFileUpload.prototype.utils = {
      extend: function() {
        var MergedObject, i, m;
        MergedObject = function() {};
        i = arguments.length;
        while (i--) {
          for (m in arguments[i]) {
            MergedObject.prototype[m] = arguments[i][m];
          }
        }
        return new MergedObject();
      }
    };

    defaultSettings = {
      url: ""
    };

    bindEvents = function(input) {
      input.addEventListener("change", handleFileSelection);
    };

    handleFileSelection = function(event) {
      var files, input;
      input = event.target;
      if (!!FormData) {
        files = input.files;
      }
    };

    return AjaxFileUpload;

  })();

  if (window.jQuery) {
    jQuery.ajaxFileUpload = AjaxFileUpload;
    jQuery.fn.ajaxFileUpload = function(options) {
      return this.each(function(i, input) {
        return new AjaxFileUpload(input, options);
      });
    };
  }

  if (typeof define === "function" && define.amd) {
    define("ajaxFileUpload", [], function() {
      return AjaxFileUpload;
    });
  } else {
    window.AjaxFileUpload = AjaxFileUpload;
  }

}).call(this);
