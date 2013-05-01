/*! Ajax File Upload Plugin - v1.0.1 - 2013-05-01
* https://github.com/jchild3rs/AjaxFileUpload
* Copyright (c) 2013 James Childers; Licensed MIT */

(function() {
  var AjaxFileUpload,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AjaxFileUpload = (function() {
    var ajaxUpload, bindStateEventsToWrap, defaultSettings, displayFileNames, embedSWF, handleAjaxProgress, handleAjaxProgressEnd, handleAjaxProgressStart, handleAjaxStateChange, handleFileSelection, has, setupCustomInput, utils, valid, validateFiles,
      _this = this;

    defaultSettings = {
      url: "",
      additionalData: {},
      autoUpload: false,
      dataType: "json",
      method: "post",
      pathToSwf: "/dist/AjaxFileUpload.swf",
      showCustomInput: false,
      buttonEmptyText: "Select",
      buttonSelectedText: "Upload",
      multiple: false,
      sizeLimit: 0,
      allowedTypes: [],
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

      this.reset = __bind(this.reset, this);

      this.settings = utils.merge(defaultSettings, options);
      if (this.input.multiple || this.settings.multiple) {
        this.input.multiple = true;
        this.settings.multiple = true;
      }
      if (this.settings.allowedTypes.length > 0) {
        utils.attr(this.input, {
          accept: this.settings.allowedTypes.join()
        });
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
      if (this.settings.showCustomInput) {
        setupCustomInput(this);
      }
      if (has.fileAPI && has.formData) {
        this.input.addEventListener("change", function(event) {
          return handleFileSelection(event, _this);
        });
      } else {
        embedSWF(this);
      }
      window.AjaxFileUpload = window.AjaxFileUpload || AjaxFileUpload;
      window.AjaxFileUpload.instances = AjaxFileUpload.instances || [];
      window.AjaxFileUpload.instances[this.input.id] = this;
      return;
    }

    AjaxFileUpload.prototype.reset = function() {
      var fakeButton, fakeInput;
      fakeButton = document.getElementById("fu-button-" + this.input.id);
      if (fakeButton != null) {
        fakeButton.innerHTML = this.settings.buttonEmptyText;
      }
      fakeInput = document.getElementById("fu-input-" + this.input.id);
      if (fakeInput != null) {
        fakeInput.value = "";
      }
      this.input.value = "";
      utils.css(this.input, {
        display: "block"
      });
    };

    AjaxFileUpload.prototype.upload = function() {
      return ajaxUpload(this);
    };

    handleFileSelection = function(event, instance) {
      var fakeButton, fakeInput, settings;
      settings = instance.settings;
      if (validateFiles(instance)) {
        if (settings.autoUpload) {
          instance.upload();
        }
        settings.onFileSelect.apply(settings, [event.target.files]);
        if (settings.showCustomInput) {
          fakeButton = document.getElementById("fu-button-" + event.target.id);
          fakeInput = document.getElementById("fu-input-" + event.target.id);
          fakeButton.innerHTML = settings.buttonSelectedText;
          utils.css(instance.input, {
            display: "none"
          });
          fakeButton.onclick = function() {
            ajaxUpload(instance);
            return false;
          };
          displayFileNames(fakeInput, event.target.files);
        }
      }
    };

    ajaxUpload = function(instance) {
      var file, formData, xhr, _i, _len, _ref;
      if (instance.input.files.length === 0) {
        return;
      }
      xhr = new XMLHttpRequest();
      if (xhr.upload) {
        xhr.upload.addEventListener("progress", function(event) {
          return handleAjaxProgress(event, instance);
        });
        xhr.upload.addEventListener("loadstart", function(event) {
          return handleAjaxProgressStart(event, instance);
        });
        xhr.upload.addEventListener("load", function(event) {
          return handleAjaxProgressEnd(event, instance);
        });
      } else {
        xhr.addEventListener("progress", function(event) {
          return handleAjaxProgress(event, instance);
        });
      }
      xhr.addEventListener("readystatechange", function(event) {
        return handleAjaxStateChange(event, instance);
      });
      formData = new FormData();
      _ref = instance.input.files;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        formData.append(file.name, file);
      }
      xhr.open(instance.settings.method, instance.settings.url, true);
      switch (instance.settings.dataType) {
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

    handleAjaxStateChange = function(event, instance) {
      var response, xhr, _ref, _ref1;
      xhr = event.target;
      if (xhr.readyState !== 4) {
        return;
      }
      response = xhr.responseText;
      if (~(xhr.getResponseHeader("content-type").indexOf("application/json")) && !!window.JSON) {
        response = JSON.parse(response);
      }
      if (xhr.status === 200 || xhr.status === 201) {
        (_ref = instance.settings).onSuccess.apply(_ref, [response, instance.input.files, xhr]);
        instance.reset();
      } else {
        (_ref1 = instance.settings).onError.apply(_ref1, [response, instance.input.files, xhr]);
      }
    };

    handleAjaxProgressStart = function(event, instance) {
      var _ref;
      if (instance.settings.showCustomInput) {
        document.getElementById("fu-wrap-" + instance.input.id).className += " fu-loading";
      }
      return (_ref = instance.settings).onProgressStart.apply(_ref, [instance.input.files, event.target]);
    };

    handleAjaxProgress = function(event, instance) {
      var _ref;
      return (_ref = instance.settings).onProgress.apply(_ref, [event.loaded, event.total, instance.input.files, event.target]);
    };

    handleAjaxProgressEnd = function(event, instance) {
      var wrap, _ref;
      if (instance.settings.showCustomInput) {
        wrap = document.getElementById("fu-wrap-" + instance.input.id);
        wrap.className = wrap.className.replace(" fu-loading", "");
      }
      return (_ref = instance.settings).onProgressEnd.apply(_ref, [instance.input.files, event.target]);
    };

    embedSWF = function(instance) {
      var allowedTypes, attrs, embed, embedId, flashVars, key, param, params, refNode, val, wrap;
      embedId = "fu-embed-" + instance.input.id;
      if (document.getElementById(embedId !== null)) {
        return;
      }
      allowedTypes = instance.settings.allowedTypes;
      allowedTypes = allowedTypes.join(";").replace(/[a-z]*\//ig, "*.");
      flashVars = {
        id: instance.input.id,
        url: instance.settings.url,
        method: instance.settings.method,
        multiple: instance.settings.multiple,
        additionalData: instance.settings.additionalData,
        sizeLimit: instance.settings.sizeLimit,
        allowedTypes: allowedTypes
      };
      params = {
        movie: instance.settings.pathToSwf,
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
        src: instance.settings.pathToSwf,
        id: embedId,
        name: "fu-embed-" + instance.input.id,
        classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
        type: "application/x-shockwave-flash",
        pluginspage: "http://www.adobe.com/go/getflashplayer",
        FlashVars: utils.serialize(flashVars),
        width: instance.input.offsetWidth + 5,
        height: instance.input.offsetHeight + 5
      };
      embed = document.getElementById(embedId);
      if (!embed) {
        embed = document.createElement("embed");
      }
      wrap = document.getElementById("fu-wrap-" + instance.input.id);
      bindStateEventsToWrap(embed, wrap);
      for (key in params) {
        val = params[key];
        if (params.hasOwnProperty(key)) {
          param = document.createElement("param");
          utils.attr(param, {
            name: key,
            value: val
          });
        }
      }
      utils.attr(embed, utils.merge(attrs, params));
      utils.css(embed, {
        position: "absolute",
        top: 0,
        left: 0,
        opacity: 0,
        cursor: "pointer"
      });
      if (instance.settings.showCustomInput) {
        refNode = document.getElementById("fu-button-" + instance.input.id);
        refNode.parentNode.insertBefore(embed, refNode.nextSibling);
        instance.input.style.display = "none";
      } else {
        instance.input.parentNode.insertBefore(embed, instance.input.nextSibling);
      }
    };

    bindStateEventsToWrap = function(element, wrap) {
      element.onmouseover = function() {
        return utils.attr(wrap, {
          "class": "fu-wrap fu-hover"
        });
      };
      element.onmouseout = function() {
        return utils.attr(wrap, {
          "class": "fu-wrap"
        });
      };
      element.onmousedown = function() {
        return utils.attr(wrap, {
          "class": "fu-wrap fu-active"
        });
      };
      return element.onmouseup = function() {
        return utils.attr(wrap, {
          "class": "fu-wrap"
        });
      };
    };

    setupCustomInput = function(instance) {
      var button, input, providedInput, wrap, wrapId;
      providedInput = instance.input;
      wrapId = "fu-wrap-" + providedInput.id;
      if (document.getElementById(wrapId) !== null) {
        return false;
      }
      wrap = document.createElement("div");
      utils.attr(wrap, {
        "class": "fu-wrap",
        id: wrapId
      });
      utils.css(wrap, {
        position: "relative"
      });
      input = document.createElement("input");
      utils.attr(input, {
        type: "text",
        disabled: "disabled",
        "class": "fu-input",
        id: "fu-input-" + providedInput.id
      });
      button = document.createElement("button");
      utils.attr(button, {
        "class": "fu-button button",
        id: "fu-button-" + providedInput.id
      });
      if (instance.settings.autoUpload) {
        button.innerHTML = instance.settings.buttonSelectedText;
      } else {
        button.innerHTML = instance.settings.buttonEmptyText;
      }
      button.onclick = function() {
        if (button.innerHTML === instance.settings.buttonSelectedText) {
          instance.upload();
        }
        return false;
      };
      wrap.appendChild(input);
      wrap.appendChild(button);
      providedInput.parentNode.insertBefore(wrap, providedInput.nextSibling);
      wrap.appendChild(providedInput);
      utils.css(providedInput, {
        position: "absolute",
        top: 0,
        left: 0,
        opacity: 0
      });
      bindStateEventsToWrap(providedInput, wrap);
      utils.css(providedInput, {
        width: document.getElementById(wrapId).clientWidth + "px",
        height: document.getElementById(wrapId).clientHeight + "px"
      });
      return providedInput;
    };

    displayFileNames = function(input, files) {
      var file, names, _i, _len;
      if (files.length === 0) {
        return;
      }
      if (files.length === 1) {
        return input.value = files[0].name;
      }
      if (files.length > 1) {
        names = "";
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          names += file.name + " ";
        }
        return input.value = names;
      }
    };

    utils = {
      css: function(element, properties) {
        var property, value;
        for (property in properties) {
          value = properties[property];
          element.style[property] = value;
        }
      },
      attr: function(element, attributes) {
        var attribute, value;
        for (attribute in attributes) {
          value = attributes[attribute];
          if (attribute === "class") {
            element.className = value;
          } else if (attributes.hasOwnProperty(attribute)) {
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
      formData: !!window.FormData,
      fileTypeFiltering: typeof document.createElement("input").accept === "string",
      progressbar: document.createElement('progress').max !== void 0
    };

    valid = {
      sizeLimit: function(size, sizeLimit) {
        return size <= sizeLimit;
      },
      fileType: function(type, allowedTypes) {
        var match, validType, _i, _len;
        if (allowedTypes === [] || !has.fileTypeFiltering) {
          return true;
        }
        match = false;
        if (!!allowedTypes) {
          for (_i = 0, _len = allowedTypes.length; _i < _len; _i++) {
            validType = allowedTypes[_i];
            if (~(validType.indexOf(type))) {
              match = true;
            }
          }
        }
        return match;
      }
    };

    validateFiles = function(instance) {
      var file, files, messages, settings, _i, _len;
      files = instance.input.files;
      settings = instance.settings;
      messages = [];
      if (files.length === 0) {
        settings.onError.apply(instance, ["No file selected"]);
        return false;
      }
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        if (settings.sizeLimit !== 0 && !valid.sizeLimit(file.size, settings.sizeLimit)) {
          messages.push("\"" + file.name + "\" is " + file.size + " bytes. Your provided limit is " + settings.sizeLimit + " bytes.");
        }
        if (settings.allowedTypes.length !== 0 && !valid.fileType(file.type, settings.allowedTypes)) {
          messages.push("\"" + (file.name.split(".")[1]) + "\" is not a valid file type/extension: " + settings.allowedTypes);
        }
      }
      if (messages.length > 0) {
        settings.onError.apply(instance, messages);
      }
      return messages.length === 0;
    };

    return AjaxFileUpload;

  }).call(this);

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
