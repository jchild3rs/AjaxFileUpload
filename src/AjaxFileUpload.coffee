# This is a simple and lightweight Javascript plugin for handling ajax file uploads.
# IE9 and below require use of an iframe hack. ([See here.](http://ajaxpatterns.org/IFrame_Call))

class AjaxFileUpload

  defaultSettings =
    # **{String}** Request mapping to back-end service that handles the upload and returns a response.
    url:                  ""
    additionalData:       {}
    autoUpload:           true
    dataType:             "json"
    method:               "post"
#    sizeLimit:            1000000
#    templates:
#      buttonTemplate: "<button class=\"fu-button\"></button>"
#      inputTemplate: "<input disabled=\"disabled\" type=\"text\" class=\"fu-input\" />"
#      progressBarTemplate: "<div class=\"progress-bar-wrap\"><div class=\"progress-bar blue stripes\"></div></div>"
#
    onSuccess:            -> # **{Function}** Fires on successful ajax response.
    onError:              -> # **{Function}*
    onFileSelect:         -> # **{Function}*
    onProgress:           -> # **{Function}*
    onProgressStart:      -> # **{Function}*
    onProgressEnd:        -> # **{Function}*

  constructor: (@input, options) ->

    # back out if input is null or isnt file
    return if @input is null or utils.validate.inputType @input.type is false

    # merge provided settings w/ default
    @settings = utils.merge defaultSettings, options

    # if url not defined, check for url in data attribute "data-url",
    if @settings.url is ""
      @settings.url = @input.getAttribute "data-url"

    # if thats empty, use the forms action. otherwise, return
    if @settings.url is "" and @input.form.action isnt ""
      @settings.url = @input.form.action
    return if @settings.url is ""

    # setup additional post data
    if @settings.additionalData isnt {}
      @settings.url += "?#{utils.serialize(@settings.additionalData)}"

    # bind change event to input
    utils.bindEvent @input, "change", (event) => handleFileSelection(event, @)

  upload: => if utils.has.ajaxUpload then ajaxUpload(@) else iframeUpload(@)

  handleFileSelection = (event, instance) ->
    instance.upload() if instance.settings.autoUpload
    instance.settings.onFileSelect [event.target]...

  ajaxUpload = (instance) ->

    # create local XHR object
    instance.xhr = new XMLHttpRequest()  if utils.has.ajaxUpload

    if instance.xhr.upload
      instance.xhr.upload.addEventListener "progress", (event) ->
        handleAjaxProgress(event, instance)
      , false
      instance.xhr.upload.addEventListener "loadstart", (event) ->
        handleAjaxProgressStart(event, instance)
      , false
      instance.xhr.upload.addEventListener "load", (event) ->
        handleAjaxProgressLoad(event, instance)
      , false
    else
      instance.xhr.addEventListener "progress", (event) ->
        handleAjaxProgress(event, instance)
      , false
    instance.xhr.addEventListener "readystatechange", (event) ->
      handleAjaxStateChange(event, instance)
    , false

    # create formData obj
    instance.formData = new FormData() if utils.has.formData

    # get file(s) data
    instance.formData.append file.name, file for file in instance.input.files

    instance.xhr.open instance.settings.method, instance.settings.url, true

    switch instance.settings.dataType
      when "json"
        instance.xhr.setRequestHeader("Accept", "application/json")
        break
      when "xml"
        instance.xhr.setRequestHeader("Accept", "text/xml")
        break
      else break

    instance.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
    instance.xhr.send instance.formData

  handleAjaxStateChange = (event, instance) ->
    return  unless instance.xhr.readyState is 4
    data = instance.xhr.responseText
    if ~instance.xhr.getResponseHeader("content-type").indexOf("application/json")
      data = JSON.parse data
    if instance.xhr.status is 200 or instance.xhr.status is 201
      instance.settings.onSuccess [data, instance.input.files, instance.xhr]...
    else
      instance.settings.onError [data, instance.input.files, instance.xhr]...
    return

  handleAjaxProgressLoad = (event, instance) ->
    instance.settings.onProgressEnd [event, instance.input.files, instance.xhr]...

  handleAjaxProgress= (event, instance) ->
    instance.settings.onProgress [event, instance.input.files, instance.xhr]...

  handleAjaxProgressStart = (event, instance) ->
    instance.settings.onProgressStart [event, instance.input.files, instance.xhr]...

  iframeUpload = (instance) ->
    instance.input.form.action = instance.settings.url
    instance.input.form.target = "fu-iframe"
    instance.input.form.method = instance.settings.method
    instance.input.form.enctype = "multipart/form-data"
    instance.input.form.encoding = "multipart/form-data"

    # create reference to iframe
    iframe = document.getElementById "fu-iframe"

    # create iframe if not present
    iframe ?= document.createElement "iframe"

    # set mandatory attributes
    iframe.id = "fu-iframe"
    iframe.name = "fu-iframe"
    iframe.style.display = 'none'

    utils.bindEvent iframe, "load", ->
      iframe = window.frames["fu-iframe"]
      # if text/plain content type is used, most browsers will wrap response in <pre> tag
      if iframe.document.body.children.length > 0 or iframe.document.body.children.length is 1
        response = iframe.document.body.children[0].innerHTML
        # otherwise, "text/html" content type should be set in the response content type headr
        # to avoid popups in IE which does not automatically create any children elements.
      else
        response = iframe.document.body.innerHTML

      if response?
        data = JSON.parse response
        instance.settings.onProgressEnd [data, instance.input.files, instance.xhr]...
        instance.settings.onSuccess [data, instance.input.value, instance.xhr]...
      else
        instance.settings.onError [null, instance.input.value, instance.xhr]...

    utils.bindEvent iframe, "error", ->
      if window.frames["fu-iframe"].document.body.children.length > 0
        response = window.frames["fu-iframe"].document.body.children[0].innerHTML
      else
        response = window.frames["fu-iframe"].document.body.innerHTML
      data = JSON.parse response
      instance.settings.onError [data, instance.input.value, instance.xhr]...
      return

    unless document.getElementById("fu-iframe")
      document.body.appendChild iframe

    # send request via form submit
    instance.input.form.submit()
    instance.settings.onProgressStart [event, instance.input.files, instance.xhr]...

  utils =

    serialize: (obj, prefix) ->
      str = []
      for p, v of obj
        k = if prefix then prefix + "[" + p + "]" else p
        if typeof v == "object"
          str.push utils.serialize(v, k)
        else
          str.push encodeURIComponent(k) + "=" + encodeURIComponent(v)
      str.join "&"

    merge: (obj1, obj2) ->
      for p of obj2
        try
          if obj2[p].constructor is Object
            obj1[p] = utils.merge obj1[p], obj2[p]
          else obj1[p] = obj2[p]
        catch e
          obj1[p] = obj2[p]
      obj1

    has:
      formData : !!window.FormData
      fileAPI: !!window.File and !!window.FileReader and !!window.FileList and !!window.Blob
      ajaxUpload: !!window.XMLHttpRequestUpload

    bindEvent: (element, eventName, callback, useCapture) ->
      useCapture = true if !!useCapture
      if typeof element.addEventListener isnt "undefined"
        element.addEventListener eventName, callback, useCapture
      else
        element.attachEvent "on#{eventName}", callback

    triggerEvent: (el, type) ->
      if (el[type] or false) and typeof el[type] is "function"
        el[type](el)

    validate:
      inputType: (type) -> return type is "file"
      fileName: (name) -> return name isnt ""
#      fileSize: (size) -> return size <= @settings.sizeLimit

if window.jQuery
  jQuery.ajaxFileUpload = AjaxFileUpload
  jQuery.fn.ajaxFileUpload = (options) ->
    this.each (i, input) ->
      new AjaxFileUpload input, options
      return

if typeof define is "function" and define.amd
  define "ajaxFileUpload", [], -> return AjaxFileUpload

window.AjaxFileUpload = AjaxFileUpload;