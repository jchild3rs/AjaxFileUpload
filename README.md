# Ajax File Upload Plugin

Simple and lightweight file uploading plugin. Written in plain ol' JavaScript. Currently it exposes itself as an AMD module and a jQuery plugin. See usages below.


## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/jchild3rs/AjaxFileUpload/master/dist/AjaxFileUpload-1.0.0.min.js
[max]: https://raw.github.com/jchild3rs/AjaxFileUpload/master/dist/AjaxFileUpload-1.0.0.js

In your web page:

```html
<form action="upload.php" method="post" enctype="multipart/form-data" id="file-upload-form">
    <input type="file" name="file" id="file"/>
</form>

<script type="text/javascript">
	// Plain example
	var myInput = document.getElementById("file");
	new ajaxFileUpload(myInput, {
        url: "upload.php"
	});

	// jQuery plugin
    $('#file').ajaxFileUpload({
        url: "upload.php"
    });
</script>
```


## Options

| Option 	    | Default Value  | Description |
|:--------------|:--------------:|:------------|
| url           | **""**             | **{String}** Request mapping to back-end service that handles the upload and returns a response.
| additionalData| **{}**             | **{Object}** Additional data you would like to pass along with the request.
| autoUpload    | **true**           | **{Boolean}** If true, the upload will happen upon file selection.
| dataType      | **"json"**         | **{String}** The data type you are using to communicate with the server. Currently *"json"* and *"xml"* are supported.
| method        | **"post"**         | **{String}** The request method you would like to send to the server. Can be "post" or "get".


## Callbacks
| Name            | Description |
|:----------------|:------------|
| onSuccess:      | (data, files, xhr) Fires on successful ajax response. If IE, you will only get "data" returned.
| onError:        | (data, files, xhr) Fires when there is an error. 
| onFileSelect:   | (event) Fires on file input change event.
| onProgress:     | (event, files, xhr) Fires as the upload progresses. This can be used to create progress bars.
| onProgressStart:| (event, files, xhr) Fires when the upload process begins.
| onProgressEnd:  | (event, files, xhr) Fires when the upload process ends.

## Release History
- v0.1.0 - 2013-02-02 - Initial release candidate. Stable in all browsers, but no custom input styling yet.
