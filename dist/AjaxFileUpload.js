/*! Ajax File Upload Plugin - v0.1.0 - 2013-01-31
* https://github.com/jchild3rs/AjaxFileUpload
* Copyright (c) 2013 James Childers; Licensed MIT */

(function() {
  var AjaxFileUpload,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AjaxFileUpload = (function() {
    var defaultSettings,
      _this = this;

    defaultSettings = {
      url: "",
      additionalData: {},
      autoUpload: true,
      namespace: "",
      sizeLimit: 1000000,
      onSuccess: function() {},
      onError: function() {},
      onFileSelect: function() {},
      onProgress: function() {},
      onProgressStart: function() {},
      onProgressEnd: function() {}
    };

    function AjaxFileUpload(input, options) {
      this.input = input;
      this.iframeUpload = __bind(this.iframeUpload, this);

      this.handleAjaxProgressStart = __bind(this.handleAjaxProgressStart, this);

      this.handleAjaxProgress = __bind(this.handleAjaxProgress, this);

      this.handleAjaxProgressLoad = __bind(this.handleAjaxProgressLoad, this);

      this.handleAjaxStateChange = __bind(this.handleAjaxStateChange, this);

      this.ajaxUpload = __bind(this.ajaxUpload, this);

      this.upload = __bind(this.upload, this);

      this.handleFileSelection = __bind(this.handleFileSelection, this);

      if (this.input === null || this.utils.validate.inputType(this.input.type === false)) {
        return;
      }
      this.settings = this.utils.merge(defaultSettings, options);
      if (this.settings.additionalData !== {}) {
        this.settings.url += "?" + (this.utils.serialize(this.settings.additionalData));
      }
      if (this.settings.url === "") {
        this.settings.url = this.input.getAttribute("data-url");
      }
      if (this.settings.url === "" && this.input.form.action !== "") {
        this.settings.url = this.input.form.action;
      }
      if (this.settings.url === "") {
        return;
      }
      this.utils.bindEvent(this.input, "change", this.handleFileSelection);
      this.xhr = new XMLHttpRequest();
      if (this.utils.has.formData) {
        this.formData = new FormData();
      }
    }

    AjaxFileUpload.prototype.handleFileSelection = function(event) {
      if (this.settings.autoUpload) {
        this.upload();
      }
      this.settings.onFileSelect.apply(this, [event.target]);
    };

    AjaxFileUpload.prototype.upload = function() {
      if (this.utils.has.ajaxUpload) {
        this.ajaxUpload();
      } else {
        this.iframeUpload();
      }
    };

    AjaxFileUpload.prototype.ajaxUpload = function() {
      var file, _i, _len, _ref;
      if (this.xhr.upload) {
        this.xhr.upload.addEventListener("progress", this.handleAjaxProgress, false);
        this.xhr.upload.addEventListener("loadstart", this.handleAjaxProgressStart, false);
        this.xhr.upload.addEventListener("load", this.handleAjaxProgressLoad, false);
      } else {
        this.xhr.addEventListener("progress", this.handleAjaxProgress, false);
      }
      this.xhr.addEventListener("readystatechange", this.handleAjaxStateChange, false);
      _ref = this.input.files;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        this.formData.append(file.name, file);
      }
      this.xhr.processData = false;
      this.xhr.contentType = false;
      this.xhr.open("POST", this.settings.url, true);
      this.xhr.send(this.formData);
    };

    AjaxFileUpload.prototype.handleAjaxStateChange = function(event) {
      var data;
      if (this.xhr.readyState !== 4) {
        return;
      }
      data = JSON.parse(this.xhr.responseText);
      if (this.xhr.status === 200 || this.xhr.status === 201) {
        this.settings.onSuccess.apply(this, [data, event.target.files, this.xhr]);
      } else {
        this.settings.onError.apply(this, [data, event.target.files, this.xhr]);
      }
    };

    AjaxFileUpload.prototype.handleAjaxProgressLoad = function(event) {
      return this.settings.onProgressEnd.apply(this, [event.target, event.target.files, this.xhr]);
    };

    AjaxFileUpload.prototype.handleAjaxProgress = function(event) {
      return this.settings.onProgress.apply(this, [event.target, event.target.files, this.xhr]);
    };

    AjaxFileUpload.prototype.handleAjaxProgressStart = function(event) {
      return this.settings.onProgressStart.apply(this, [event.target, event.target.files, this.xhr]);
    };

    AjaxFileUpload.prototype.iframeUpload = function() {
      var iframe,
        _this = this;
      this.input.form.action = this.settings.url;
      this.input.form.target = "fu-iframe";
      this.input.form.method = "post";
      this.input.form.enctype = "multipart/form-data";
      this.input.form.encoding = "multipart/form-data";
      iframe = document.getElementById("fu-iframe");
      if (iframe === null) {
        iframe = document.createElement("iframe");
        iframe.id = "fu-iframe";
      }
      iframe.name = "fu-iframe";
      iframe.style.display = 'none';
      this.utils.bindEvent(iframe, "load", function() {
        var data, response;
        if (window.frames["fu-iframe"].document.body.children.length > 0) {
          response = window.frames["fu-iframe"].document.body.children[0].innerHTML;
        } else {
          response = window.frames["fu-iframe"].document.body.innerHTML;
        }
        data = JSON.parse(response);
        return _this.settings.onSuccess.apply(_this, [data, _this.input.value, _this.xhr]);
      });
      this.utils.bindEvent(iframe, "error", function() {
        var data, response;
        if (window.frames["fu-iframe"].document.body.children.length > 0) {
          response = window.frames["fu-iframe"].document.body.children[0].innerHTML;
        } else {
          response = window.frames["fu-iframe"].document.body.innerHTML;
        }
        data = JSON.parse(response);
        _this.settings.onError.apply(_this, [data, _this.input.value, _this.xhr]);
      });
      if (document.getElementById("fu-iframe") === null) {
        document.body.appendChild(iframe);
      }
      this.input.form.submit();
    };

    AjaxFileUpload.prototype.utils = {
      serialize: function(obj, prefix) {
        var k, p, str, v;
        str = [];
        for (p in obj) {
          v = obj[p];
          k = prefix ? prefix + "[" + p + "]" : p;
          if (typeof v === "object") {
            str.push(AjaxFileUpload.utils.serialize(v, k));
          } else {
            str.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
          }
        }
        return str.join("&");
      },
      merge: function(obj1, obj2) {
        var p;
        for (p in obj2) {
          try {
            if (obj2[p].constructor === Object) {
              obj1[p] = this.utils.merge(obj1[p], obj2[p]);
            } else {
              obj1[p] = obj2[p];
            }
          } catch (e) {
            obj1[p] = obj2[p];
          }
        }
        return obj1;
      },
      has: {
        formData: window.FormData,
        fileAPI: window.File && window.FileReader && window.FileList && window.Blob,
        ajaxUpload: !!window.XMLHttpRequestUpload
      },
      bindEvent: function(element, eventName, callback, useCapture) {
        if (!!useCapture) {
          useCapture = true;
        }
        if (typeof element.addEventListener !== "undefined") {
          return element.addEventListener(eventName, callback, useCapture);
        } else {
          return element.attachEvent("on" + eventName, callback);
        }
      },
      triggerEvent: function(el, type) {
        if ((el[type] || false) && typeof el[type] === "function") {
          el[type](el);
        }
      },
      validate: {
        inputType: function(type) {
          return type === "file";
        },
        fileName: function(name) {
          return name !== "";
        }
      }
    };

    return AjaxFileUpload;

  }).call(this);

  if (window.jQuery) {
    jQuery.ajaxFileUpload = AjaxFileUpload;
    jQuery.fn.ajaxFileUpload = function(options) {
      return this.each(function(i, input) {
        new AjaxFileUpload(input, options);
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
