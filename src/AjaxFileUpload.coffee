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
    additionalData:
      {}

    # **{Boolean}** If true, the upload will happen
    # upon file selection.
    autoUpload: false

    # **{String}** The data type you are using to communicate
    # with the server. Currently *"json"* and *"xml"* are supported.
    dataType: "json"

    # **{String}** The request method you would like
    # to send to the server. Can be "post" or "get".
    method: "post"

    # **{String}** Path to SWF that is required for IE9 and below
    pathToSwf: "/dist/AjaxFileUpload.swf"

    showCustomInput: false
    buttonEmptyText: "Select"
    buttonSelectedText: "Upload"

    showProgressBar: false
    progressBarElement: ""

    debug: false

    # **{Boolean}** Enables multiple file uploading.
    multiple: false

    # **{Integer}** Uploading file size limit in bytes.
    sizeLimit: 0

    # **{Array}** Allowed file types. Please follow this format: ['image/jpg', 'image/jpeg', 'image/png']
    allowedTypes: []

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

    if @settings.allowedTypes.length > 0
      utils.attr @input, accept: @settings.allowedTypes.join()

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
      @settings.url += "#{utils.serialize(@settings.additionalData)}"

    if @settings.showCustomInput
      setupCustomInput @

    # Bind change event to input if file API and ajax uploading is available.
    # Otherwise, embed swf (which invisibly overlays on top on the input)
#    if has.fileAPI and has.ajaxUpload
#      @input.addEventListener "change", (event) => handleFileSelection event, @
#    else
    embedSWF @

    # Create globally accessibly instance for Flash communication.
    window.AjaxFileUpload = window.AjaxFileUpload or AjaxFileUpload
    window.AjaxFileUpload.instances = AjaxFileUpload.instances or []
    window.AjaxFileUpload.instances[@input.id] = @

    return

  # ## Public methods.
  reset: =>
    fakeButton = document.getElementById("fu-button-#{@input.id}")
#    fakeInput = document.getElementById("fu-input-#{@input.id}")
#    fakeInput.value = ""
    fakeButton.innerHTML = @settings.buttonEmptyText
    @input.value = ""
    utils.css @input, display: "block"
    return
  upload: =>
    ajaxUpload @
    return

  # **handleFileSelection(event)** Change event handler.
  handleFileSelection = (event, instance) =>

    settings = instance.settings

    if settings.showCustomInput
      fakeButton = document.getElementById("fu-button-#{event.target.id}")
      fakeInput = document.getElementById("fu-input-#{event.target.id}")

    if validateFiles instance

      # If autoUpload is set, triggers the upload.
      if settings.autoUpload
        ajaxUpload(instance)

      # Trigger onFileSelect callback.
      settings.onFileSelect [event.target.files]...

      if settings.showCustomInput
        fakeButton.innerHTML = settings.buttonSelectedText
        utils.css instance.input, display: "none"
        fakeButton.onclick = =>
          ajaxUpload(instance)
          return false
        displayFileNames(fakeInput, event.target.files)

    return

  # **ajaxUpload(instance)** Handles ajax upload if FileAPI is supported.
  ajaxUpload = (instance) =>

    return if instance.input.files.length is 0

    # Create XHR object
    xhr = new XMLHttpRequest()

    # Bind XHR events to callback proxies
    if xhr.upload
      xhr.upload.addEventListener "progress", (event) => handleAjaxProgress event, instance
      xhr.upload.addEventListener "loadstart", (event) => handleAjaxProgressStart event, instance
      xhr.upload.addEventListener "load", (event) => handleAjaxProgressEnd event, instance
    else
      xhr.addEventListener "progress", (event) => handleAjaxProgress event, instance

    xhr.addEventListener "readystatechange", (event) -> handleAjaxStateChange event, instance

    # Create formData object
    formData = new FormData()

    # Recursively store file(s) in formData object
    formData.append file.name, file for file in instance.input.files

    # Specify request settings
    xhr.open instance.settings.method, instance.settings.url, true

    # Set appropriate Accept request header.
    switch instance.settings.dataType
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

  handleAjaxStateChange = (event, instance) =>
    xhr = event.target
    return unless xhr.readyState is 4
    response = xhr.responseText
    if ~(xhr.getResponseHeader("content-type").indexOf("application/json")) and !!window.JSON
      response = JSON.parse response
    if xhr.status is 200 or xhr.status is 201
      instance.settings.onSuccess [response, instance.input.files, xhr]...
      instance.reset()
    else
      instance.settings.onError [response, instance.input.files, xhr]...
    return

  handleAjaxProgressStart = (event, instance) =>
    document.getElementById("fu-wrap-#{instance.input.id}").className += " fu-loading"
    instance.settings.onProgressStart [instance.input.files, event.target]...

  handleAjaxProgress = (event, instance) =>
    instance.settings.onProgress [event.loaded, event.total, instance.input.files, event.target]...

  handleAjaxProgressEnd = (event, instance) =>
    document.getElementById("fu-wrap-#{instance.input.id}").className = document.getElementById("fu-wrap-#{instance.input.id}").className.replace(" fu-loading", "")
    instance.settings.onProgressEnd [instance.input.files, event.target]...

  # **embedSWF()** Embeds swf invisibly on top of provided input.
  embedSWF = (instance) ->

    # Convert type array into "*.ext;*.ext" string for Flash.
    allowedTypes = instance.settings.allowedTypes
    allowedTypes = allowedTypes.join(";").replace(/[a-z]*\//ig, "*.")

    # Set FlashVars to be passed to both &lt;embed&gt; and &lt;object&gt;
    flashVars =
      id: instance.input.id
      url: instance.settings.url
      method: instance.settings.method
      debug: instance.settings.debug
      multiple: instance.settings.multiple
      additionalData: instance.settings.additionalData
      sizeLimit: instance.settings.sizeLimit
      allowedTypes: allowedTypes

    # Set &lt;param&gt; name and values to be passed to &lt;object&gt; as tags and to &lt;embed&gt; as a query string.
    params =
      movie: instance.settings.pathToSwf
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
      src: instance.settings.pathToSwf
      id: "fu-embed-#{instance.input.id}"
      name: "fu-embed-#{instance.input.id}"
      classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
      type: "application/x-shockwave-flash"
      pluginspage: "http://www.adobe.com/go/getflashplayer"
      FlashVars: utils.serialize flashVars
      width: instance.input.offsetWidth + 5
      height: instance.input.offsetHeight + 5
      style: "position: absolute"

    # Create or find &lt;object&gt; and &lt;embed&gt; elements for SWF.
    embed = document.getElementById "fu-embed-#{instance.input.id}"
    embed = document.createElement "embed" unless embed
    objectEl = document.getElementById "fu-object-#{instance.input.id}"
    objectEl = document.createElement "object" unless objectEl

    wrap = document.getElementById("fu-wrap-#{instance.input.id}")
    embed.onmouseover = -> utils.attr wrap, class: "fu-wrap fu-hover"
    embed.onmouseout = -> utils.attr wrap, class: "fu-wrap"
    embed.onmousedown = -> utils.attr wrap, class: "fu-wrap fu-active"
    embed.onmouseup = -> utils.attr wrap, class: "fu-wrap"

    # Set required &lt;object&gt; attributes
    utils.attr objectEl,
               classid: "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
               id: "fu-object-#{instance.input.id}"
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
    if instance.settings.showCustomInput
      refNode = document.getElementById("fu-button-#{instance.input.id}")
      refNode.parentNode.insertBefore objectEl, refNode.nextSibling
      instance.input.style.display = "none"
    else
      instance.input.parentNode.insertBefore objectEl, instance.input.nextSibling

    return

  setupCustomInput = (instance) ->

    providedInput = instance.input

    # create wrapper for fake input/button
    wrapId = "fu-wrap-#{providedInput.id}"
    wrap = document.createElement("div")
    utils.attr wrap, class: "fu-wrap", id: wrapId
    utils.css wrap, position: "relative"

    # fake input for display of file name/path
    input = document.createElement("input")
    utils.attr input, type: "text", disabled: "disabled", class: "fu-input", id: "fu-input-#{providedInput.id}"

    # fake button for styling
    button = document.createElement("button")
    utils.attr button, class: "fu-button", id: "fu-button-#{providedInput.id}"
    if instance.settings.autoUpload
      button.innerHTML = instance.settings.buttonSelectedText
    else
      button.innerHTML = instance.settings.buttonEmptyText

    button.onclick = (event) ->
#      if event.target.innerHTML is @settings.buttonSelectedText
#        upload()
      return false

    # append input and button to wrap
    wrap.appendChild input
    wrap.appendChild button

    # insert wrapper after provided input
    providedInput.parentNode.insertBefore wrap, providedInput.nextSibling

    # move provided input inside wrapper for positioning
    wrap.appendChild providedInput

    # overlay file input on top of fake inputs
    utils.css providedInput, position: "absolute", top: 0, left: 0, opacity: 0

    # because we're overlaying, add helper class for state styling
    providedInput.onmouseover = -> utils.attr wrap, class: "fu-wrap fu-hover"
    providedInput.onmouseout = -> utils.attr wrap, class: "fu-wrap"
    providedInput.onmousedown = -> utils.attr wrap, class: "fu-wrap fu-active"
    providedInput.onmouseup = -> utils.attr wrap, class: "fu-wrap"

    # we want the values *after* we've absolutely positioned the input
    # so we can acurately set width/height
    utils.css providedInput,
              width: document.getElementById(wrapId).clientWidth + "px"
              height: document.getElementById(wrapId).clientHeight + "px"

    return providedInput


  displayFileNames = (input, files) ->
    return if files.length is 0
    return input.value = files[0].name if files.length is 1
    if files.length > 1
      names = ""
      for file in files
        names += file.name + " "
      return input.value = names
    return


  # Simple utilities not worth using a library for.
  utils =

    css: (element, properties) ->
      for property, value of properties
        element.style[property] = value
      return

    # Shortcut for setAttribute and className
    attr: (element, attributes) ->
      for attribute, value of attributes
        if attribute is "class"
          element.className = value
        else if attributes.hasOwnProperty(attribute)
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
      return str.join "&"

    # Takes two objects and combines them, with the second taking precedence.
    merge: (obj1, obj2) ->
      for p of obj2
        try
          if obj2[p].constructor is Object
            obj1[p] = utils.merge obj1[p], obj2[p]
          else obj1[p] = obj2[p]
        catch e
          obj1[p] = obj2[p]
      return obj1

  # Feature detection.
  has =
    fileAPI: !!window.File and !!window.FileReader and !!window.FileList and !!window.Blob
    ajaxUpload: !!window.XMLHttpRequestUpload and !!window.FormData
    typeFiltering: typeof document.createElement("input").accept is "string"
    progressbar: document.createElement('progress').max isnt undefined

  # Validation methods.
  valid =
    sizeLimit: (size, sizeLimit) -> return size <= sizeLimit
    fileType: (type, allowedTypes) ->
      return true if allowedTypes is [] or not has.typeFiltering
      match = false
      if !!allowedTypes
        for validType in allowedTypes
          if ~(validType.indexOf(type))
            match = true
      return match

  # Validation wrapper method.
  validateFiles = (instance) ->

    files = instance.input.files
    settings = instance.settings
    messages = []

    if files.length is 0
      settings.onError.apply instance, ["No file selected"]
      return false
    for file in files
      if settings.sizeLimit isnt 0 and not valid.sizeLimit(file.size, settings.sizeLimit)
        messages.push "\"#{file.name}\" is #{file.size} bytes. Your provided limit is #{settings.sizeLimit}"
      if settings.allowedTypes.length isnt 0 and not valid.fileType(file.type, settings.allowedTypes)
        messages.push "\"#{file.name.split(".")[1]}\" is not a valid file type/extension: #{settings.allowedTypes}"
    if messages.length > 0
      settings.onError.apply instance, messages
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
