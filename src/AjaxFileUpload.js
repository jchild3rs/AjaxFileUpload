(function() {
  var AjaxFileUpload,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.AjaxFileUploadFlashProxy = function(instanceId, method, args) {
    var instance;
    console.log(instanceId, method, args);
    instance = window.AjaxFileUpload.instances[instanceId];
    return instance.settings[method].apply(instance, args);
  };

  AjaxFileUpload = (function() {
    var defaultSettings;

    defaultSettings = {
      url: "",
      additionalData: {},
      autoUpload: true,
      dataType: "json",
      method: "post",
      pathToSwf: "/dist/AjaxFileUpload.swf",
      debug: true,
      multiple: false,
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
      this.iframeUpload = __bind(this.iframeUpload, this);

      this.handleAjaxProgressStart = __bind(this.handleAjaxProgressStart, this);

      this.handleAjaxProgress = __bind(this.handleAjaxProgress, this);

      this.handleAjaxProgressLoad = __bind(this.handleAjaxProgressLoad, this);

      this.handleAjaxStateChange = __bind(this.handleAjaxStateChange, this);

      this.ajaxUpload = __bind(this.ajaxUpload, this);

      this.handleFileSelection = __bind(this.handleFileSelection, this);

      this.embedSWF = __bind(this.embedSWF, this);

      this.upload = __bind(this.upload, this);

      if (this.input === null || this.utils.validate.inputType(this.input.type === false)) {
        return;
      }
      this.settings = this.utils.merge(defaultSettings, options);
      if (this.input.multiple) {
        this.settings.multiple = true;
      }
      this.instanceId = this.input.id;
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
        this.settings.url += "?" + (this.utils.serialize(this.settings.additionalData));
      }
      this.utils.bindEvent(this.input, "change", function(event) {
        return _this.handleFileSelection(event, _this);
      });
      window.AjaxFileUpload.instances = AjaxFileUpload.instances || [];
      window.AjaxFileUpload.instances[this.instanceId] = this;
    }

    AjaxFileUpload.prototype.upload = function() {
      if (this.utils.has.ajaxUpload) {
        return this.ajaxUpload(this);
      } else {
        return this.iframeUpload(this);
      }
    };

    AjaxFileUpload.prototype.embedSWF = function() {
      var attrs, embed, flashVars, input, key, objectEl, param, params, settings, val;
      settings = this.settings;
      input = this.input;
      embed = document.getElementById("fu-embed");
      if (!embed) {
        embed = document.createElement("embed");
      }
      objectEl = document.getElementById("fu-object");
      if (!objectEl) {
        objectEl = document.createElement("object");
      }
      this.utils.attr(objectEl, {
        classid: "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",
        id: "fu-object",
        align: "left"
      });
      flashVars = {
        id: this.instanceId,
        url: settings.url,
        method: settings.method,
        debug: settings.debug,
        multiple: settings.multiple
      };
      params = {
        movie: settings.pathToSwf,
        quality: "low",
        play: "true",
        loop: "true",
        wmode: "transparent",
        scale: "noscale",
        menu: "true",
        devicefont: "false",
        salign: "",
        allowScriptAccess: "sameDomain",
        flashvars: this.utils.serialize(flashVars)
      };
      for (key in params) {
        val = params[key];
        param = document.createElement("param");
        this.utils.attr(param, {
          name: key,
          value: val
        });
        objectEl.appendChild(param);
      }
      attrs = {
        src: settings.pathToSwf,
        id: "fu-embed",
        name: "fu-embed",
        classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
        type: "application/x-shockwave-flash",
        pluginspage: "http://www.adobe.com/go/getflashplayer",
        FlashVars: this.utils.serialize(flashVars),
        width: input.offsetWidth + 5,
        height: input.offsetHeight + 5,
        style: "position: absolute"
      };
      this.utils.attr(embed, this.utils.merge(attrs, params));
      objectEl.appendChild(embed);
      input.parentNode.insertBefore(objectEl, input.nextSibling);
    };

    AjaxFileUpload.prototype.handleFileSelection = function(event) {
      var _ref;
      if (this.settings.autoUpload) {
        this.upload();
      }
      return (_ref = this.settings).onFileSelect.apply(_ref, [event.target]);
    };

    AjaxFileUpload.prototype.ajaxUpload = function() {
      var file, _i, _len, _ref,
        _this = this;
      this.xhr = new XMLHttpRequest();
      if (this.xhr.upload) {
        this.xhr.upload.addEventListener("progress", function(event) {
          return _this.handleAjaxProgress(event);
        }, false);
        this.xhr.upload.addEventListener("loadstart", function(event) {
          return _this.handleAjaxProgressStart(event);
        }, false);
        this.xhr.upload.addEventListener("load", function(event) {
          return _this.handleAjaxProgressLoad(event);
        }, false);
      } else {
        this.xhr.addEventListener("progress", function(event) {
          return _this.handleAjaxProgress(event);
        }, false);
      }
      this.xhr.addEventListener("readystatechange", function(event) {
        return _this.handleAjaxStateChange(event);
      }, false);
      if (this.utils.has.formData) {
        this.formData = new FormData();
      }
      _ref = this.input.files;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        this.formData.append(file.name, file);
      }
      this.xhr.open(this.settings.method, this.settings.url, true);
      switch (this.settings.dataType) {
        case "json":
          this.xhr.setRequestHeader("Accept", "application/json");
          break;
        case "xml":
          this.xhr.setRequestHeader("Accept", "text/xml");
          break;
        default:
          break;
      }
      this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      return this.xhr.send(this.formData);
    };

    AjaxFileUpload.prototype.handleAjaxStateChange = function(event) {
      var data, _ref, _ref1;
      if (this.xhr.readyState !== 4) {
        return;
      }
      data = this.xhr.responseText;
      if (~this.xhr.getResponseHeader("content-type").indexOf("application/json")) {
        data = JSON.parse(data);
      }
      if (this.xhr.status === 200 || this.xhr.status === 201) {
        (_ref = this.settings).onSuccess.apply(_ref, [data, this.input.files, this.xhr]);
      } else {
        (_ref1 = this.settings).onError.apply(_ref1, [data, this.input.files, this.xhr]);
      }
    };

    AjaxFileUpload.prototype.handleAjaxProgressLoad = function(event) {
      var _ref;
      return (_ref = this.settings).onProgressEnd.apply(_ref, [event, this.input.files, this.xhr]);
    };

    AjaxFileUpload.prototype.handleAjaxProgress = function(event) {
      var _ref;
      return (_ref = this.settings).onProgress.apply(_ref, [event, this.input.files, this.xhr]);
    };

    AjaxFileUpload.prototype.handleAjaxProgressStart = function(event) {
      var _ref;
      return (_ref = this.settings).onProgressStart.apply(_ref, [event, this.input.files, this.xhr]);
    };

    AjaxFileUpload.prototype.iframeUpload = function(instance) {
      var iframe, _ref,
        _this = this;
      this.utils.attr(this.input.form, {
        action: this.settings.url,
        target: "fu-iframe",
        method: this.settings.method,
        enctype: "multipart/form-data",
        encoding: "multipart/form-data"
      });
      iframe = document.getElementById("fu-iframe");
      if (iframe == null) {
        iframe = document.createElement("iframe");
      }
      this.utils.attr(iframe, {
        id: "fu-iframe",
        name: "fu-iframe",
        style: "display:none"
      });
      this.utils.bindEvent(iframe, "load", function() {
        var data, response, _ref, _ref1, _ref2;
        iframe = window.frames["fu-iframe"];
        if (iframe.document.body.children.length > 0 || iframe.document.body.children.length === 1) {
          response = iframe.document.body.children[0].innerHTML;
        } else {
          response = iframe.document.body.innerHTML;
        }
        if (response != null) {
          data = JSON.parse(response);
          (_ref = this.settings).onProgressEnd.apply(_ref, [data, this.input.files, this.xhr]);
          return (_ref1 = this.settings).onSuccess.apply(_ref1, [data, this.input.value, this.xhr]);
        } else {
          return (_ref2 = this.settings).onError.apply(_ref2, [null, this.input.value, this.xhr]);
        }
      });
      this.utils.bindEvent(iframe, "error", function() {
        var data, response, _ref;
        if (window.frames["fu-iframe"].document.body.children.length > 0) {
          response = window.frames["fu-iframe"].document.body.children[0].innerHTML;
        } else {
          response = window.frames["fu-iframe"].document.body.innerHTML;
        }
        data = JSON.parse(response);
        (_ref = _this.settings).onError.apply(_ref, [data, _this.input.value, _this.xhr]);
      });
      if (!document.getElementById("fu-iframe")) {
        document.body.appendChild(iframe);
      }
      this.input.form.submit();
      return (_ref = this.settings).onProgressStart.apply(_ref, [event, this.input.files, this.xhr]);
    };

    AjaxFileUpload.prototype.utils = {
      attr: function(element, attribs) {
        var attr, val, _results;
        _results = [];
        for (attr in attribs) {
          val = attribs[attr];
          if (attr === "class") {
            attr = "className";
          }
          _results.push(element.setAttribute(attr, val));
        }
        return _results;
      },
      serialize: function(obj, prefix) {
        var k, p, str, v;
        str = [];
        for (p in obj) {
          v = obj[p];
          k = prefix ? prefix + "[" + p + "]" : p;
          if (typeof v === "object") {
            str.push(this.utils.serialize(v, k));
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
