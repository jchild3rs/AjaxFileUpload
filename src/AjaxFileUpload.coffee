class AjaxFileUpload

  constructor: (@input, options) ->

    # back out if input isnt file
    return if utils.validate.inputType @input.type is false

    # merge provided settings w/ default
    @settings = utils.merge defaultSettings, options

    # bind change event to input
#    $(@input).on 'change', =>
    utils.bind @input, "change", =>
      handleFileSelection @input, @settings
      return


  handleFileSelection = (input, settings) ->
#    if utils.has.fileAPI
#      console.log "validation is supported"
    if settings.autoUpload
      upload input, settings
    return

  upload = (input, settings) ->
    if utils.has.ajaxUpload
      ajaxUpload input, settings
    else
      iframeUpload input, settings
    return

  ajaxUpload = (input, settings) ->
    url = settings.url
    xhr = new XMLHttpRequest();
    xhr.open "POST", url, true

    utils.bind xhr, "load", handleAjaxResponse, false
    utils.bind xhr.upload, "progress", handleAjaxProgress, false
    utils.bind xhr.upload, "loadstart", handleAjaxProgressStart, false
    utils.bind xhr.upload, "loadend", handleAjaxProgressEnd, false

    formData = new FormData()
    formData.append file.name, file for file in input.files

    xhr.send formData

    return

  handleAjaxResponse = (event) ->
    xhr = event.target
    settings.onSuccess($.parseJSON(xhr.responseText))
    console.log "request response: ", xhr.status, xhr.responseText

  handleAjaxProgress = =>
  handleAjaxProgressStart = =>
  handleAjaxProgressEnd = =>

  iframeUpload = (input, settings) ->
    url = settings.url
    input.form.action = url
    input.form.target = "fu-iframe"
    input.form.method = "post"
    input.form.enctype = "multipart/form-data"
    input.form.encoding = "multipart/form-data"

    iframe = document.getElementById "fu-iframe"
    if iframe is null
      iframe = document.createElement('iframe')
      iframe.id = "fu-iframe"
    iframe.name = "fu-iframe"
    iframe.style.display = 'none';

    utils.bind iframe, "load", ->
      response = window.frames["fu-iframe"].document.body.innerHTML
      data = JSON.stringify(response)
      settings.onSuccess(data)

    if document.getElementById("fu-iframe") is null
      document.body.appendChild iframe

    input.form.submit()

    return





  defaultSettings =
    url: ""
    autoUpload: true
    onSuccess: ->                   # **{Function}** Fires on successful ajax response.
    onError: ->                     # **{Function}*
    onSelect: ->                    # **{Function}*
    onProgress: ->                  # **{Function}*
    onProgressStart: ->             # **{Function}*
    onProgressEnd: ->               # **{Function}*


  utils =
  
    bind: (element, eventName, callback, useCapture) ->
      useCapture = true if !!useCapture
      if element.addEventListener?
        element.addEventListener eventName, callback, useCapture
      else
        element.attachEvent "on#{eventName}", callback

#    extend: ->
#      Obj = ->
#      i = arguments.length
#      while i--
#        for m of arguments[i]
#          Obj::[m] = arguments[i][m]
#      return new Obj()

    merge: (obj1, obj2) ->
      for p of obj2
        try
          # Property in destination object set; update its value.
          if obj2[p].constructor is Object
            obj1[p] = utils.merge(obj1[p], obj2[p])
          else
            obj1[p] = obj2[p]
        catch e
          # Property in destination object not set; create it and set its value.
          obj1[p] = obj2[p]
      obj1

    has:
      fileAPI: window.File and window.FileReader and window.FileList and window.Blob
      ajaxUpload: window.XMLHttpRequestUpload

    triggerEvent: (el, type) ->
      if (el[type] or false) and typeof el[type] is "function"
        el[type](el)
      return

    validate:
      inputType: (type) ->
        return type is "file"
      fileName: ->
      fileSize: ->
      fileType: ->


if window.jQuery
  jQuery.ajaxFileUpload = AjaxFileUpload
  jQuery.fn.ajaxFileUpload = (options) ->
    this.each (i, input) ->
      new AjaxFileUpload(input, options);
      return

if typeof define is "function" and define.amd
  define "ajaxFileUpload", [], ->
    return AjaxFileUpload
else
  window.AjaxFileUpload = AjaxFileUpload;