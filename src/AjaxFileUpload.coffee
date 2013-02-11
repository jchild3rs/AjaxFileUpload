# This is a simple and lightweight Javascript plugin
# (written in CoffeeScript) for handling ajax file uploads.
# IE9 and below require use of a SWF that is overlayed
# on top of the original input.

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

    # **{String}** Path to SWF that is required for IE9 and below
    pathToSwf: "/dist/AjaxFileUpload.swf"

    debug: false

    # **{Boolean}** Enables multiple file uploading.
    multiple: false

    # **{Integer}** Uploading file size limit in bytes.
    sizeLimit: 0

    # **{String}** Allowed file types. Please follow this format: '*.jpg;*.jpeg;*.png'
    allowedTypes: ""

    # **{Callback}** onSuccess(data, files, XHR/UrlRequest)
    # Fires on successful ajax response.
    onSuccess: -> return

    # **{Callback}** onError(data, files, XHR/UrlRequest)
    # todo, update params pass "message"
    # Fires when there is an error.
    onError: -> return

    # **{Callback}** onFileSelect(files)
    # Fires on file input change event.
    onFileSelect: -> return

    # **{Callback}** onProgress(loaded, total, files, XHR/UrlRequest)
    # Fires as the upload progresses. This can be used to create progress bars.
    onProgress: -> return

    # **{Callback}** onProgressStart(files, XHR/UrlRequest)
    # Fires when the upload process begins.
    onProgressStart: -> return

    # **{Callback}** onProgressEnd(files, XHR/UrlRequest)
    # Fires when the upload process ends.
    onProgressEnd: -> return

  # ## Constructor
  # (input, options) Two paramters, the first should be an _HTMLInputElement_ (required), and the second is an object.
  constructor: (@input, options) ->

    # Back out if provided input is null or isnt file
    return if @input is null or @input.type isnt "file"

    # Merge provided settings w/ default
    @settings = utils.merge defaultSettings, options

    # If input has mutliple set, force multiple: true; setting.
    if @input.multiple or @settings.multiple
      @input.multiple = true
      @settings.multiple = true

    # If url not defined, check for url in data attribute "data-url",
    if @settings.url is ""
      @settings.url = @input.getAttribute "data-url"

    # If thats url data attr is empty, use the the input's
    # form action. otherwise, return false
    if @settings.url is "" and @input.form.action isnt ""
      @settings.url = @input.form.action
    return if @settings.url is ""

    # Setup additional post data if present
    if @settings.additionalData isnt {}
      @settings.url += "?#{utils.serialize(@settings.additionalData)}"

    # Bind change event to input if file API and ajax uploading is available.
    # Otherwise, embed swf (which invisibly overlays on top on the input)
    if has.fileAPI and has.ajaxUpload
      @input.addEventListener "change", @handleFileSelection
    else
      @embedSWF()

    # Create globally accessibly instance for Flash communication.
    window.AjaxFileUpload.instances = AjaxFileUpload.instances or []
    window.AjaxFileUpload.instances[@input.id] = @

  # **handleFileSelection(event)** Change event handler.
  handleFileSelection: (event) =>

    if validateFiles event.target.files, @settings

      # If autoUpload is set, triggers the upload.
      @ajaxUpload() if @settings.autoUpload

      # Trigger onFileSelect callback.
      @settings.onFileSelect [event.target.files]...

    return

  # **ajaxUpload(instance)** Handles ajax upload if FileAPI is supported.
  ajaxUpload: =>

    # Create XHR object
    xhr = new XMLHttpRequest()

    # Bind XHR events to callback proxies
    if xhr.upload
      xhr.upload.addEventListener "progress", @handleAjaxProgress, false
      xhr.upload.addEventListener "loadstart", @handleAjaxProgressStart, false
      xhr.upload.addEventListener "load", @handleAjaxProgressEnd, false
    else
      xhr.addEventListener "progress", @handleAjaxProgress, false
    xhr.addEventListener "readystatechange", @handleAjaxStateChange, false

    # Create formData object
    formData = new FormData()

    # Recursively store file(s) in formData object
    formData.append file.name, file for file in @input.files

    # Specify request settings
    xhr.open @settings.method, @settings.url, true

    # Set appropriate Accept request header.
    switch @settings.dataType
      when "json"
        xhr.setRequestHeader("Accept", "application/json")
        break
      when "xml"
        xhr.setRequestHeader("Accept", "text/xml")
        break
      else break

    # Set header telling the server that this is an XHR request.
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")

    # Send request w/ formData to server.
    xhr.send formData

    return

  handleAjaxStateChange: (event) =>
    xhr = event.target
    return unless xhr.readyState is 4
    response = xhr.responseText
    if ~xhr.getResponseHeader("content-type").indexOf("application/json") and !!window.JSON
      response = JSON.parse response
    if xhr.status is 200 or xhr.status is 201
      @settings.onSuccess [response, @input.files, xhr]...
    else
      @settings.onError [response, @input.files, xhr]...
    return

  handleAjaxProgressStart: (event) => @settings.onProgressStart [@input.files, event.target]...
  handleAjaxProgress: (event) => @settings.onProgress [event.loaded, event.total, @input.files, event.target]...
  handleAjaxProgressEnd: (event) => @settings.onProgressEnd [@input.files, event.target]...

  # **embedSWF()** Embeds swf invisibly on top of provided input.
  embedSWF: =>

    # Set FlashVars to be passed to both &lt;embed&gt; and &lt;object&gt;
    flashVars =
      id: @input.id
      url: @settings.url
      method: @settings.method
      debug: @settings.debug
      multiple: @settings.multiple
      additionalData: @settings.additionalData
      sizeLimit: @settings.sizeLimit
      allowedTypes: @settings.allowedTypes

    # Set &lt;param&gt; name and values to be passed to &lt;object&gt; as tags and to &lt;embed&gt; as a query string.
    params =
      movie: @settings.pathToSwf
      quality: "low"
      play: "true"
      loop: "true"
      wmode: "transparent"
      scale: "noscale"
      menu: "true"
      devicefont: "false"
      salign: ""
      allowScriptAccess: "sameDomain"
      flashvars: utils.serialize flashVars

    # Set attributes for &lt;embed&gt; tag
    attrs =
      src: @settings.pathToSwf
      id: "fu-embed-#{@input.id}"
      name: "fu-embed-#{@input.id}"
      classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
      type: "application/x-shockwave-flash"
      pluginspage: "http://www.adobe.com/go/getflashplayer"
      FlashVars: utils.serialize flashVars
      width: @input.offsetWidth + 5
      height: @input.offsetHeight + 5
      style: "position: absolute"

    # Create or find &lt;object&gt; and &lt;embed&gt; elements for SWF.
    embed = document.getElementById "fu-embed-#{@input.id}"
    embed = document.createElement "embed" unless embed
    objectEl = document.getElementById "fu-object-#{@input.id}"
    objectEl = document.createElement "object" unless objectEl

    # Set required &lt;object&gt; attributes
    utils.attr objectEl,
               classid: "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
               id: "fu-object-#{@input.id}"
               align: "left"

    # Create &lt;param&gt; tags and append to &lt;object&gt; tag.
    for key, val of params
      if params.hasOwnProperty(key)
        param = document.createElement "param"
        utils.attr param,
                   name: key
                   value: val
        objectEl.appendChild param

    # Apply attributes to &lt;embed&gt;
    utils.attr embed, utils.merge(attrs, params)

    # Append &lt;embed&gt; into &lt;object&gt;
    objectEl.appendChild embed

    # Insert &lt;object&gt; after provided input
    @input.parentNode.insertBefore objectEl, @input.nextSibling

    return

  # Simple utilities not worth re-writing.
  utils =

    # Shortcut for setAttribute
    attr: (element, attributes) ->
      for attribute, value of attributes
        if attributes.hasOwnProperty(attribute)
          attribute = "className" if attribute is "class"
          element.setAttribute attribute, value
      return

    # Turns an object into a URL friendly query string.
    serialize: (obj, prefix) ->
      str = []
      for p, v of obj
        k = if prefix then prefix + "[" + p + "]" else p
        if typeof v == "object"
          str.push utils.serialize(v, k)
        else
          str.push encodeURIComponent(k) + "=" + encodeURIComponent(v)
      str.join "&"

    # Takes two objects and combines them, with the second taking precedence.
    merge: (obj1, obj2) ->
      for p of obj2
        try
          if obj2[p].constructor is Object
            obj1[p] = utils.merge obj1[p], obj2[p]
          else obj1[p] = obj2[p]
        catch e
          obj1[p] = obj2[p]
      obj1

  # Feature detection.
  has =
    fileAPI: !!window.File and !!window.FileReader and !!window.FileList and !!window.Blob
    ajaxUpload: !!window.XMLHttpRequestUpload

  # Validation methods.
  valid =
    sizeLimit: (size, sizeLimit) -> return size <= sizeLimit
    fileType: (type, allowedTypes) ->
      match = false
      if !!allowedTypes
        type = type.split("/")[1]
        types = allowedTypes.toString().replace(/\*/g, "").split(";")
        for validType in types
          if ~(validType.indexOf(type))
            match = true
      return match

  # Validation wrapper.
  validateFiles = (files, settings) ->
    messages = []
    if files.length is 0
      settings.onError.apply @, ["No file selected"]
      return false
    for file in files
      if not valid.sizeLimit(file.size, settings.sizeLimit)
        messages.push "\"#{file.name}\" is #{file.size} bytes. Your provided limit is #{settings.sizeLimit}"
      if not valid.fileType(file.type, settings.allowedTypes)
        messages.push "\"#{file.name.split(".")[1]}\" is not a valid file type/extension: #{settings.allowedTypes}"
    if messages.length > 0
      settings.onError.apply @, messages
    return messages.length is 0


# Global proxy function that flash uses to trigger an instance's callbacks.
window.AjaxFileUploadFlashProxy = (instanceId, method, args) ->
  instance = window.AjaxFileUpload.instances[instanceId]
  instance.settings[method].apply instance, args
  return

# #### Expose as global variable.
window.AjaxFileUpload = AjaxFileUpload

# #### Expose to jQuery.
if window.jQuery
  jQuery.ajaxFileUpload = AjaxFileUpload
  jQuery.fn.ajaxFileUpload = (options) ->
    this.each (i, input) ->
                new AjaxFileUpload input, options
                return

# #### Expose to AMD/RequireJS
if typeof define is "function" and define.amd
  define "ajaxFileUpload", [], -> return AjaxFileUpload
