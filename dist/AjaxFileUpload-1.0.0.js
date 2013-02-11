/*! Ajax File Upload Plugin - v1.0.0 - 2013-02-10
* https://github.com/jchild3rs/AjaxFileUpload
* Copyright (c) 2013 James Childers; Licensed MIT */

(function() {
  var AjaxFileUpload,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AjaxFileUpload = (function() {
    var defaultSettings, has, utils, valid, validateFiles;

    defaultSettings = {
      url: "",
      additionalData: {},
      autoUpload: true,
      dataType: "json",
      method: "post",
      pathToSwf: "/dist/AjaxFileUpload.swf",
      debug: false,
      multiple: false,
      sizeLimit: 0,
      allowedTypes: "",
      onSuccess: function() {},
      onError: function() {},
      onFileSelect: function() {},
      onProgress: function() {},
      onProgressStart: function() {},
      onProgressEnd: function() {}
    };

    function AjaxFileUpload(input, options) {
      this.input = input;
      this.embedSWF = __bind(this.embedSWF, this);

      this.handleAjaxProgressEnd = __bind(this.handleAjaxProgressEnd, this);

      this.handleAjaxProgress = __bind(this.handleAjaxProgress, this);

      this.handleAjaxProgressStart = __bind(this.handleAjaxProgressStart, this);

      this.handleAjaxStateChange = __bind(this.handleAjaxStateChange, this);

      this.ajaxUpload = __bind(this.ajaxUpload, this);

      this.handleFileSelection = __bind(this.handleFileSelection, this);

      if (this.input === null || this.input.type !== "file") {
        return;
      }
      this.settings = utils.merge(defaultSettings, options);
      if (this.input.multiple || this.settings.multiple) {
        this.input.multiple = true;
        this.settings.multiple = true;
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
      if (this.settings.additionalData !== {}) {
        this.settings.url += "?" + (utils.serialize(this.settings.additionalData));
      }
      if (has.fileAPI && has.ajaxUpload) {
        this.input.addEventListener("change", this.handleFileSelection);
      } else {
        this.embedSWF();
      }
      window.AjaxFileUpload.instances = AjaxFileUpload.instances || [];
      window.AjaxFileUpload.instances[this.input.id] = this;
    }

    AjaxFileUpload.prototype.handleFileSelection = function(event) {
      var _ref;
      if (validateFiles(event.target.files, this.settings)) {
        if (this.settings.autoUpload) {
          this.ajaxUpload();
        }
        (_ref = this.settings).onFileSelect.apply(_ref, [event.target.files]);
      }
    };

    AjaxFileUpload.prototype.ajaxUpload = function() {
      var file, formData, xhr, _i, _len, _ref;
      xhr = new XMLHttpRequest();
      if (xhr.upload) {
        xhr.upload.addEventListener("progress", this.handleAjaxProgress, false);
        xhr.upload.addEventListener("loadstart", this.handleAjaxProgressStart, false);
        xhr.upload.addEventListener("load", this.handleAjaxProgressEnd, false);
      } else {
        xhr.addEventListener("progress", this.handleAjaxProgress, false);
      }
      xhr.addEventListener("readystatechange", this.handleAjaxStateChange, false);
      formData = new FormData();
      _ref = this.input.files;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        formData.append(file.name, file);
      }
      xhr.open(this.settings.method, this.settings.url, true);
      switch (this.settings.dataType) {
        case "json":
          xhr.setRequestHeader("Accept", "application/json");
          break;
        case "xml":
          xhr.setRequestHeader("Accept", "text/xml");
          break;
        default:
          break;
      }
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      xhr.send(formData);
    };

    AjaxFileUpload.prototype.handleAjaxStateChange = function(event) {
      var response, xhr, _ref, _ref1;
      xhr = event.target;
      if (xhr.readyState !== 4) {
        return;
      }
      response = xhr.responseText;
      if (~xhr.getResponseHeader("content-type").indexOf("application/json") && !!window.JSON) {
        response = JSON.parse(response);
      }
      if (xhr.status === 200 || xhr.status === 201) {
        (_ref = this.settings).onSuccess.apply(_ref, [response, this.input.files, xhr]);
      } else {
        (_ref1 = this.settings).onError.apply(_ref1, [response, this.input.files, xhr]);
      }
    };

    AjaxFileUpload.prototype.handleAjaxProgressStart = function(event) {
      var _ref;
      return (_ref = this.settings).onProgressStart.apply(_ref, [this.input.files, event.target]);
    };

    AjaxFileUpload.prototype.handleAjaxProgress = function(event) {
      var _ref;
      return (_ref = this.settings).onProgress.apply(_ref, [event.loaded, event.total, this.input.files, event.target]);
    };

    AjaxFileUpload.prototype.handleAjaxProgressEnd = function(event) {
      var _ref;
      return (_ref = this.settings).onProgressEnd.apply(_ref, [this.input.files, event.target]);
    };

    AjaxFileUpload.prototype.embedSWF = function() {
      var attrs, embed, flashVars, key, objectEl, param, params, val;
      flashVars = {
        id: this.input.id,
        url: this.settings.url,
        method: this.settings.method,
        debug: this.settings.debug,
        multiple: this.settings.multiple,
        additionalData: this.settings.additionalData,
        sizeLimit: this.settings.sizeLimit,
        allowedTypes: this.settings.allowedTypes
      };
      params = {
        movie: this.settings.pathToSwf,
        quality: "low",
        play: "true",
        loop: "true",
        wmode: "transparent",
        scale: "noscale",
        menu: "true",
        devicefont: "false",
        salign: "",
        allowScriptAccess: "sameDomain",
        flashvars: utils.serialize(flashVars)
      };
      attrs = {
        src: this.settings.pathToSwf,
        id: "fu-embed-" + this.input.id,
        name: "fu-embed-" + this.input.id,
        classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
        type: "application/x-shockwave-flash",
        pluginspage: "http://www.adobe.com/go/getflashplayer",
        FlashVars: utils.serialize(flashVars),
        width: this.input.offsetWidth + 5,
        height: this.input.offsetHeight + 5,
        style: "position: absolute"
      };
      embed = document.getElementById("fu-embed-" + this.input.id);
      if (!embed) {
        embed = document.createElement("embed");
      }
      objectEl = document.getElementById("fu-object-" + this.input.id);
      if (!objectEl) {
        objectEl = document.createElement("object");
      }
      utils.attr(objectEl, {
        classid: "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",
        id: "fu-object-" + this.input.id,
        align: "left"
      });
      for (key in params) {
        val = params[key];
        if (params.hasOwnProperty(key)) {
          param = document.createElement("param");
          utils.attr(param, {
            name: key,
            value: val
          });
          objectEl.appendChild(param);
        }
      }
      utils.attr(embed, utils.merge(attrs, params));
      objectEl.appendChild(embed);
      this.input.parentNode.insertBefore(objectEl, this.input.nextSibling);
    };

    utils = {
      attr: function(element, attributes) {
        var attribute, value;
        for (attribute in attributes) {
          value = attributes[attribute];
          if (attributes.hasOwnProperty(attribute)) {
            if (attribute === "class") {
              attribute = "className";
            }
            element.setAttribute(attribute, value);
          }
        }
      },
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
      }
    };

    has = {
      fileAPI: !!window.File && !!window.FileReader && !!window.FileList && !!window.Blob,
      ajaxUpload: !!window.XMLHttpRequestUpload
    };

    valid = {
      sizeLimit: function(size, sizeLimit) {
        return size <= sizeLimit;
      },
      fileType: function(type, allowedTypes) {
        var match, types, validType, _i, _len;
        match = false;
        if (!!allowedTypes) {
          type = type.split("/")[1];
          types = allowedTypes.toString().replace(/\*/g, "").split(";");
          for (_i = 0, _len = types.length; _i < _len; _i++) {
            validType = types[_i];
            if (~(validType.indexOf(type))) {
              match = true;
            }
          }
        }
        return match;
      }
    };

    validateFiles = function(files, settings) {
      var file, messages, _i, _len;
      messages = [];
      if (files.length === 0) {
        settings.onError.apply(this, ["No file selected"]);
        return false;
      }
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        if (!valid.sizeLimit(file.size, settings.sizeLimit)) {
          messages.push("\"" + file.name + "\" is " + file.size + " bytes. Your provided limit is " + settings.sizeLimit);
        }
        if (!valid.fileType(file.type, settings.allowedTypes)) {
          messages.push("\"" + (file.name.split(".")[1]) + "\" is not a valid file type/extension: " + settings.allowedTypes);
        }
      }
      if (messages.length > 0) {
        settings.onError.apply(this, messages);
      }
      return messages.length === 0;
    };

    return AjaxFileUpload;

  })();

  window.AjaxFileUploadFlashProxy = function(instanceId, method, args) {
    var instance;
    instance = window.AjaxFileUpload.instances[instanceId];
    instance.settings[method].apply(instance, args);
  };

  window.AjaxFileUpload = AjaxFileUpload;

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

}).call(this);
