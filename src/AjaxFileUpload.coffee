class AjaxFileUpload

  defaultSettings =
    url:                  ""
    additionalData:       {}
    autoUpload:           true
    namespace:            ""
    sizeLimit:            1000000
    onSuccess:            -> # **{Function}** Fires on successful ajax response.
    onError:              -> # **{Function}*
    onFileSelect:         -> # **{Function}*
    onProgress:           -> # **{Function}*
    onProgressStart:      -> # **{Function}*
    onProgressEnd:        -> # **{Function}*

  constructor: (@input, options) ->

    # back out if input is null or isnt file
    return if @input is null or @utils.validate.inputType @input.type is false

    # merge provided settings w/ default
    @settings = @utils.merge defaultSettings, options

    # setup additional post data
    if @settings.additionalData isnt {}
      @settings.url += "?#{@utils.serialize @settings.additionalData}"

    # if url not defined, check for url in data attribute "data-url",
    if @settings.url is ""
      @settings.url = @input.getAttribute "data-url"
    # if thats empty, use the forms action. otherwise, return
    if @settings.url is "" and @input.form.action isnt ""
      @settings.url = @input.form.action
    return if @settings.url is ""

    # bindEvent change event to input
    @utils.bindEvent @input, "change", @handleFileSelection

    # create local XHR object
    @xhr = new XMLHttpRequest()

    # create formData obj
    @formData = new FormData() if @utils.has.formData


  handleFileSelection: (event) =>
    @upload() if @settings.autoUpload
    @settings.onFileSelect.apply @, [event.target]
    return

  upload: =>
    if @utils.has.ajaxUpload
      @ajaxUpload()
    else
      @iframeUpload()
    return

  ajaxUpload: =>
    if @xhr.upload
      @xhr.upload.addEventListener "progress", @handleAjaxProgress, false
      @xhr.upload.addEventListener "loadstart", @handleAjaxProgressStart, false
      @xhr.upload.addEventListener "load", @handleAjaxProgressLoad, false
    else
      @xhr.addEventListener "progress", @handleAjaxProgress, false
    @xhr.addEventListener "readystatechange", @handleAjaxStateChange, false

    # get file(s) data
    @formData.append file.name, file for file in @input.files

    @xhr.processData = false
    @xhr.contentType = false

    @xhr.open "POST", @settings.url, true
    @xhr.send @formData

    return

  handleAjaxStateChange: (event) =>
    return  unless @xhr.readyState is 4
    data = @xhr.responseText
    if ~@xhr.getResponseHeader("content-type").indexOf("application/json")
      data = JSON.parse data
    if @xhr.status is 200 or @xhr.status is 201
      @settings.onSuccess.apply @, [data, @input.files, @xhr]
    else
      @settings.onError.apply @, [data, @input.files, @xhr]
    return

  handleAjaxProgressLoad: (event) =>
    @settings.onProgressEnd.apply @, [event, @input.files, @xhr]

  handleAjaxProgress: (event) =>
    @settings.onProgress.apply @, [event, @input.files, @xhr]

  handleAjaxProgressStart: (event) =>
    @settings.onProgressStart.apply @, [event, @input.files, @xhr]

  iframeUpload: =>
    @input.form.action = @settings.url
    @input.form.target = "fu-iframe"
    @input.form.method = "post"
    @input.form.enctype = "multipart/form-data"
    @input.form.encoding = "multipart/form-data"

    # create iframe if not present
    iframe = document.getElementById "fu-iframe"
    if iframe is null
      iframe = document.createElement "iframe"
      iframe.id = "fu-iframe"

    # set mandatory attributes
    iframe.name = "fu-iframe"
    iframe.style.display = 'none'

    @utils.bindEvent iframe, "load", =>
      # if text/plain content type is used, most browsers will wrap response in <pre> tag
      if window.frames["fu-iframe"].document.body.children.length > 0
        response = window.frames["fu-iframe"].document.body.children[0].innerHTML
      else
        response = window.frames["fu-iframe"].document.body.innerHTML
      data = JSON.parse response
      @settings.onSuccess.apply @, [data, @input.value, @xhr]

    @utils.bindEvent iframe, "error", =>
      if window.frames["fu-iframe"].document.body.children.length > 0
        response = window.frames["fu-iframe"].document.body.children[0].innerHTML
      else
        response = window.frames["fu-iframe"].document.body.innerHTML
      data = JSON.parse response
      @settings.onError.apply @, [data, @input.value, @xhr]
      return

    if document.getElementById("fu-iframe") is null
      document.body.appendChild iframe

    @input.form.submit()

    return

  utils:

    serialize: (obj, prefix) =>
      str = []
      for p, v of obj
        k = if prefix then prefix + "[" + p + "]" else p
        if typeof v == "object"
          str.push @utils.serialize(v, k)
        else
          str.push encodeURIComponent(k) + "=" + encodeURIComponent(v)
      str.join "&"

    merge: (obj1, obj2) ->
      for p of obj2
        try
          if obj2[p].constructor is Object
            obj1[p] = @utils.merge obj1[p], obj2[p]
          else
            obj1[p] = obj2[p]
        catch e
          obj1[p] = obj2[p]
      obj1

    has:
      formData : window.FormData
      fileAPI: window.File and window.FileReader and window.FileList and window.Blob
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
      return

    validate:
      inputType: (type) -> return type is "file"
      fileName: (name) -> return name isnt ""
#      fileSize: (size) => return size <= @settings.sizeLimit

if window.jQuery
  jQuery.ajaxFileUpload = AjaxFileUpload
  jQuery.fn.ajaxFileUpload = (options) ->
    this.each (i, input) ->
      new AjaxFileUpload input, options
      return

if typeof define is "function" and define.amd
  define "ajaxFileUpload", [], ->
    return AjaxFileUpload
else
  window.AjaxFileUpload = AjaxFileUpload;