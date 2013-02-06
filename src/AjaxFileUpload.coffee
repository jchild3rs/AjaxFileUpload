# This is a simple and lightweight Javascript plugin
# (written in CoffeeScript) for handling ajax file uploads.
# IE9 and below require use of an iframe hack.
# ([See here](http://ajaxpatterns.org/IFrame_Call))
window.AjaxFileUploadFlashProxy = (instanceId, method, args) ->
  console.log instanceId, method, args
  instance = window.AjaxFileUpload.instances[instanceId]
  instance.settings[method].apply instance, args

class AjaxFileUpload

  # ## Options
  # Default settings that get deep merged with
  # user provided settings.
  defaultSettings =

    # **{String}** Request mapping to back-end service
    # that handles the upload and returns a response.
    url: ""

    # **{Object}** Additional data you would like to
    # pass along with the request.
    additionalData: {}

    # **{Boolean}** If true, the upload will happen
    # upon file selection.
    autoUpload: true

    # **{String}** The data type you are using to communicate
    # with the server. Currently *"json"* and *"xml"* are supported.
    dataType: "json"

    # **{String}** The request method you would like
    # to send to the server. Can be "post" or "get".
    method: "post"

    pathToSwf: "/dist/AjaxFileUpload.swf"

    debug: true
    multiple: false

    # **{Callback}** onSuccess(data, files, xhr)
    # Fires on successful ajax response.
    # If IE, you will only get "data" returned.
    onSuccess: ->

    # **{Callback}** onError(data, files, xhr)
    # todo, update params pass "message"
    # Fires when there is an error.
    onError: ->

    # **{Callback}** onFileSelect(data, files, xhr)
    # Fires on file input change event.
    onFileSelect: ->

    # **{Callback}** onProgress(event, files, xhr)
    # Fires as the upload progresses. This can be used to create progress bars.
    onProgress: ->

    # **{Callback}** onProgressStart(event, files, xhr)
    # Fires when the upload process begins.
    onProgressStart: ->

    # **{Callback}** onProgressEnd(event, files, xhr)
    # Fires when the upload process ends.
    onProgressEnd: ->

  # ## Constructor
  # (input, options) Two paramters, the first should be an _HTMLInputElement_ (required), and the second is an object.
  constructor: (@input, options) ->

    # Back out if provided input is null or isnt file
    return if @input is null or @utils.validate.inputType @input.type is false

    # Merge provided settings w/ default
    @settings = @utils.merge defaultSettings, options

    @settings.multiple = true if @input.multiple
    # set unique instance id (mainly for flash communication)
    @.instanceId = @input.id

#    @embedSWF()

    # If url not defined, check for url in data attribute "data-url",
    if @settings.url is ""
      @settings.url = @input.getAttribute "data-url"

    # If thats empty, use the forms action. otherwise, return
    if @settings.url is "" and @input.form.action isnt ""
      @settings.url = @input.form.action
    return if @settings.url is ""

    # Setup additional post data if present
    if @settings.additionalData isnt {}
      @settings.url += "?#{@utils.serialize(@settings.additionalData)}"

    # Bind change event to input
    @utils.bindEvent @input, "change", (event) => @handleFileSelection(event, @)

    window.AjaxFileUpload.instances = AjaxFileUpload.instances or []
    window.AjaxFileUpload.instances[@instanceId] = @


  # **upload()** Determines based on settings whether to use XHR or iframe and makes it happen.
  upload: => if @utils.has.ajaxUpload then @ajaxUpload(@) else @iframeUpload(@)

  embedSWF: =>

    settings = @settings
    input = @input

    # create reference to embed
    embed = document.getElementById "fu-embed"
    embed = document.createElement "embed" unless embed

    objectEl = document.getElementById "fu-object"
    objectEl = document.createElement "object" unless objectEl
    @utils.attr objectEl,
               classid: "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
               id: "fu-object"
               align: "left"

    flashVars =
      id: @instanceId
      url: settings.url
      method: settings.method
      debug: settings.debug
      multiple: settings.multiple

    params =
      movie: settings.pathToSwf
      quality: "low"
      play: "true"
      loop: "true"
      wmode: "transparent"
      scale: "noscale"
      menu: "true"
      devicefont: "false"
      salign: ""
      allowScriptAccess: "sameDomain"
      flashvars: @utils.serialize flashVars

    for key, val of params
      param = document.createElement "param"
      @utils.attr param,
                 name: key
                 value: val
      objectEl.appendChild param

    attrs =
      src: settings.pathToSwf
      id: "fu-embed"
      name: "fu-embed"
      classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
      type: "application/x-shockwave-flash"
      pluginspage: "http://www.adobe.com/go/getflashplayer"
      FlashVars: @utils.serialize flashVars
      width: input.offsetWidth + 5
      height: input.offsetHeight + 5
      style: "position: absolute"
    #        style: "position: fixed; top: 0; left: 0;"
    #        style: "position: absolute; top: -999em; left: -999em;"
    #        width: 0
    #        height: 0

    @utils.attr embed, @utils.merge(attrs, params)

    objectEl.appendChild embed
    input.parentNode.insertBefore objectEl, input.nextSibling
    #      document.body.appendChild swf
    return

  # **handleFileSelection(event)** Change event handler.
  handleFileSelection: (event) =>

    # If autoUpload is set, triggers the upload.
    @upload() if @settings.autoUpload

    # Trigger onFileSelect callback.
    @settings.onFileSelect [event.target]...

  # **ajaxUpload(instance)** Handles ajax upload.
  ajaxUpload: =>

    # Create XHR object
    @xhr = new XMLHttpRequest()

    # Bind XHR events to local callback proxies
    if @xhr.upload
      @xhr.upload.addEventListener "progress", (event) =>
        @handleAjaxProgress(event)
      , false
      @xhr.upload.addEventListener "loadstart", (event) =>
        @handleAjaxProgressStart(event)
      , false
      @xhr.upload.addEventListener "load", (event) =>
        @handleAjaxProgressLoad(event)
      , false
    else
      @xhr.addEventListener "progress", (event) =>
        @handleAjaxProgress(event)
      , false
    @xhr.addEventListener "readystatechange", (event) =>
      @handleAjaxStateChange(event)
    , false

    # Create formData object
    @formData = new FormData() if @utils.has.formData
    # todo: handle no FormData situation.

    # Recursively store file(s) data in formData object
    @formData.append file.name, file for file in @input.files


    # Specify request settings
    @xhr.open @settings.method, @settings.url, true

    # Set appropriate Accept request header.
    switch @settings.dataType
      when "json"
        @xhr.setRequestHeader("Accept", "application/json")
        break
      when "xml"
        @xhr.setRequestHeader("Accept", "text/xml")
        break
      else break

    # Set header telling the server that this is an XHR request.
    @xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")

    # Send request w/ formData to server.
    @xhr.send @formData

  handleAjaxStateChange: (event) =>
    return  unless @xhr.readyState is 4
    data = @xhr.responseText
    if ~@xhr.getResponseHeader("content-type").indexOf("application/json")
      data = JSON.parse data
    if @xhr.status is 200 or @xhr.status is 201
      @settings.onSuccess [data, @input.files, @xhr]...
    else
      @settings.onError [data, @input.files, @xhr]...
    return

  handleAjaxProgressLoad: (event) =>
    @settings.onProgressEnd [event, @input.files, @xhr]...

  handleAjaxProgress: (event) =>
    @settings.onProgress [event, @input.files, @xhr]...

  handleAjaxProgressStart: (event) =>
    @settings.onProgressStart [event, @input.files, @xhr]...

  iframeUpload: (instance) =>
    @utils.attr @input.form,
      action: @settings.url
      target: "fu-iframe"
      method: @settings.method
      enctype: "multipart/form-data"
      encoding: "multipart/form-data"

    # create reference to iframe
    iframe = document.getElementById "fu-iframe"

    # create iframe if not present
    iframe ?= document.createElement "iframe"

    # set/override mandatory attributes
    @utils.attr iframe,
      id: "fu-iframe"
      name: "fu-iframe"
      style: "display:none"

    @utils.bindEvent iframe, "load", ->
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
        @settings.onProgressEnd [data, @input.files, @xhr]...
        @settings.onSuccess [data, @input.value, @xhr]...
      else
        @settings.onError [null, @input.value, @xhr]...

    @utils.bindEvent iframe, "error", =>
      if window.frames["fu-iframe"].document.body.children.length > 0
        response = window.frames["fu-iframe"].document.body.children[0].innerHTML
      else
        response = window.frames["fu-iframe"].document.body.innerHTML
      data = JSON.parse response
      @settings.onError [data, @input.value, @xhr]...
      return

    unless document.getElementById("fu-iframe")
      document.body.appendChild iframe

    # send request via form submit
    @input.form.submit()
    @settings.onProgressStart [event, @input.files, @xhr]...

  utils:

    attr: (element, attribs) ->
      for attr, val of attribs
        attr = "className" if attr is "class"
        element.setAttribute attr, val

    serialize: (obj, prefix) ->
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

window.AjaxFileUpload = AjaxFileUpload