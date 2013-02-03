(function() {
  var AjaxFileUpload,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AjaxFileUpload = (function() {
    var ajaxUpload, defaultSettings, handleAjaxProgress, handleAjaxProgressLoad, handleAjaxProgressStart, handleAjaxStateChange, handleFileSelection, iframeUpload, utils;

    defaultSettings = {
      url: "",
      additionalData: {},
      autoUpload: true,
      dataType: "json",
      method: "post",
      onSuccess: function() {},
      onError: function() {},
      onFileSelect: function() {},
      onProgress: function() {},
      onProgressStart: function() {},
      onProgressEnd: function() {}
    };

    function AjaxFileUpload(input, options) {
      var _this = this;
      this.input = input;
      this.upload = __bind(this.upload, this);

      if (this.input === null || utils.validate.inputType(this.input.type === false)) {
        return;
      }
      this.settings = utils.merge(defaultSettings, options);
      if (this.settings.url === "") {
        this.settings.url = this.input.getAttribute("data-url");
      }
      if (this.settings.url === "" && this.input.form.action !== "") {
        this.settings.url = this.input.form.action;
      }
      if (this.settings.url === "") {
        return;
      }
      if (this.settings.additionalData !== {}) {
        this.settings.url += "?" + (utils.serialize(this.settings.additionalData));
      }
      utils.bindEvent(this.input, "change", function(event) {
        return handleFileSelection(event, _this);
      });
    }

    AjaxFileUpload.prototype.upload = function() {
      if (utils.has.ajaxUpload) {
        return ajaxUpload(this);
      } else {
        return iframeUpload(this);
      }
    };

    handleFileSelection = function(event, instance) {
      var _ref;
      if (instance.settings.autoUpload) {
        instance.upload();
      }
      return (_ref = instance.settings).onFileSelect.apply(_ref, [event.target]);
    };

    ajaxUpload = function(instance) {
      var file, _i, _len, _ref;
      if (utils.has.ajaxUpload) {
        instance.xhr = new XMLHttpRequest();
      }
      if (instance.xhr.upload) {
        instance.xhr.upload.addEventListener("progress", function(event) {
          return handleAjaxProgress(event, instance);
        }, false);
        instance.xhr.upload.addEventListener("loadstart", function(event) {
          return handleAjaxProgressStart(event, instance);
        }, false);
        instance.xhr.upload.addEventListener("load", function(event) {
          return handleAjaxProgressLoad(event, instance);
        }, false);
      } else {
        instance.xhr.addEventListener("progress", function(event) {
          return handleAjaxProgress(event, instance);
        }, false);
      }
      instance.xhr.addEventListener("readystatechange", function(event) {
        return handleAjaxStateChange(event, instance);
      }, false);
      if (utils.has.formData) {
        instance.formData = new FormData();
      }
      _ref = instance.input.files;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        instance.formData.append(file.name, file);
      }
      instance.xhr.open(instance.settings.method, instance.settings.url, true);
      switch (instance.settings.dataType) {
        case "json":
          instance.xhr.setRequestHeader("Accept", "application/json");
          break;
        case "xml":
          instance.xhr.setRequestHeader("Accept", "text/xml");
          break;
        default:
          break;
      }
      instance.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      return instance.xhr.send(instance.formData);
    };

    handleAjaxStateChange = function(event, instance) {
      var data, _ref, _ref1;
      if (instance.xhr.readyState !== 4) {
        return;
      }
      data = instance.xhr.responseText;
      if (~instance.xhr.getResponseHeader("content-type").indexOf("application/json")) {
        data = JSON.parse(data);
      }
      if (instance.xhr.status === 200 || instance.xhr.status === 201) {
        (_ref = instance.settings).onSuccess.apply(_ref, [data, instance.input.files, instance.xhr]);
      } else {
        (_ref1 = instance.settings).onError.apply(_ref1, [data, instance.input.files, instance.xhr]);
      }
    };

    handleAjaxProgressLoad = function(event, instance) {
      var _ref;
      return (_ref = instance.settings).onProgressEnd.apply(_ref, [event, instance.input.files, instance.xhr]);
    };

    handleAjaxProgress = function(event, instance) {
      var _ref;
      return (_ref = instance.settings).onProgress.apply(_ref, [event, instance.input.files, instance.xhr]);
    };

    handleAjaxProgressStart = function(event, instance) {
      var _ref;
      return (_ref = instance.settings).onProgressStart.apply(_ref, [event, instance.input.files, instance.xhr]);
    };

    iframeUpload = function(instance) {
      var iframe, _ref;
      instance.input.form.action = instance.settings.url;
      instance.input.form.target = "fu-iframe";
      instance.input.form.method = instance.settings.method;
      instance.input.form.enctype = "multipart/form-data";
      instance.input.form.encoding = "multipart/form-data";
      iframe = document.getElementById("fu-iframe");
      if (iframe == null) {
        iframe = document.createElement("iframe");
      }
      iframe.id = "fu-iframe";
      iframe.name = "fu-iframe";
      iframe.style.display = 'none';
      utils.bindEvent(iframe, "load", function() {
        var data, response, _ref, _ref1, _ref2;
        iframe = window.frames["fu-iframe"];
        if (iframe.document.body.children.length > 0 || iframe.document.body.children.length === 1) {
          response = iframe.document.body.children[0].innerHTML;
        } else {
          response = iframe.document.body.innerHTML;
        }
        if (response != null) {
          data = JSON.parse(response);
          (_ref = instance.settings).onProgressEnd.apply(_ref, [data, instance.input.files, instance.xhr]);
          return (_ref1 = instance.settings).onSuccess.apply(_ref1, [data, instance.input.value, instance.xhr]);
        } else {
          return (_ref2 = instance.settings).onError.apply(_ref2, [null, instance.input.value, instance.xhr]);
        }
      });
      utils.bindEvent(iframe, "error", function() {
        var data, response, _ref;
        if (window.frames["fu-iframe"].document.body.children.length > 0) {
          response = window.frames["fu-iframe"].document.body.children[0].innerHTML;
        } else {
          response = window.frames["fu-iframe"].document.body.innerHTML;
        }
        data = JSON.parse(response);
        (_ref = instance.settings).onError.apply(_ref, [data, instance.input.value, instance.xhr]);
      });
      if (!document.getElementById("fu-iframe")) {
        document.body.appendChild(iframe);
      }
      instance.input.form.submit();
      return (_ref = instance.settings).onProgressStart.apply(_ref, [event, instance.input.files, instance.xhr]);
    };

    utils = {
      serialize: function(obj, prefix) {
        var k, p, str, v;
        str = [];
        for (p in obj) {
          v = obj[p];
          k = prefix ? prefix + "[" + p + "]" : p;
          if (typeof v === "object") {
            str.push(utils.serialize(v, k));
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
              obj1[p] = utils.merge(obj1[p], obj2[p]);
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
        formData: !!window.FormData,
        fileAPI: !!window.File && !!window.FileReader && !!window.FileList && !!window.Blob,
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
          return el[type](el);
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

  })();

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
  }

  window.AjaxFileUpload = AjaxFileUpload;

}).call(this);
