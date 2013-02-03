# Ajax File Upload Plugin

Simple and lightweight file uploading plugin.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/jchild3rs/AjaxFileUpload/master/dist/AjaxFileUpload.min.js
[max]: https://raw.github.com/jchild3rs/AjaxFileUpload/master/dist/AjaxFileUpload.js

In your web page:

```html
<form action="upload.php" method="post" enctype="multipart/form-data" id="file-upload-form">
    <input type="file" name="file" id="file"/>
</form>

<script type="text/javascript">
    $('#file').ajaFileUpload({
        url:                 "upload.php"
    });
</script>
```

## Options



## Release History
- No release yet.
