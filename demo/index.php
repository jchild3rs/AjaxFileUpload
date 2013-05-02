<!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>
  <meta http-equiv="Content-type" content="text/html; charset=utf-8">
  <title>Ajax File Upload Plugin</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="viewport" content="width=device-width"/>
  <link href='http://fonts.googleapis.com/css?family=Rokkitt:400,700' rel='stylesheet' type='text/css'>

  <link rel="stylesheet" href="demo.css">
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
  <script type="text/javascript" src="../dist/AjaxFileUpload-1.0.1.js"></script>
  <script type="text/javascript" src="demo.js"></script>
</head>
<body>
<nav id="top-bar">
  <ul>
    <li><a href="#features">Features</a></li>
    <li><a href="#options">Options</a></li>
    <li><a href="#callbacks">Callbacks</a></li>
    <!--<li><a href="/docs/AjaxFileUpload.html">Documentation</a></li>-->
    <li><a href="../docs/AjaxFileUpload.html" target="_blank">Docs</a></li>
    <!--<li><a href="../test/FileUploadPlugin.html" target="_blank">Tests</a></li>-->
    <li>Download: <a href="../dist/AjaxFileUpload-1.0.1.min.js" target="_blank">Minified 8.5KB</a> (3KB gzipped) |
      <a href="../dist/AjaxFileUpload-1.0.1.js" target="_blank">Full Source 16.7KB</a></li>
  </ul>
</nav>

<div id="main">

<h1>AjaxFileUpload.js</h1>

<p class="large">Simple vanilla JavaScript file uploading plugin that aims to leverage the new features added in
  <a href="http://www.w3.org/TR/2008/WD-XMLHttpRequest2-20080225/" title="XMLHttpRequest Level 2" target="_blank">XMLHttpRequest 2</a>, and back-fill
  <a href="http://caniuse.com/xhr2" title="Browser Support" target="_blank">support</a> for older browsers via Flash. </p>

<p><strong>Browser support:</strong> IE6/7/8/9/10+, Chrome, Firefox, Safari/Mobile Safari</p>

<p class="note"><strong>NOTE</strong>: For jQuery users, I have exposed the plugin via <strong>$.fn.ajaxFileUpload()</strong></p>

<a href="#" name="features"></a>
<h2>Features</h2>
<ul id="feature-list">
  <li>Asynchronous uploads</li>
  <li>iOS Support</li>
  <li>Multi-file uploads</li>
  <li>Client-side file size/type validation</li>
  <li>CSS styled file inputs</li>
  <li>AMD Support</li>
  <li>Exposure to libraries such as jQuery</li>
  <li>File dialog type filtering</li>
</ul>

<a href="#" name="options"></a>

<h2>Options</h2>
<table id="options-table" class="table">
  <tbody>
  <tr>
    <th align="left">Name</th>
    <th align="center">Default Value</th>
    <th align="left">Description</th>
  </tr>
  <tr>
    <td align="left">url</td>
    <td align="center"><strong>""</strong></td>
    <td align="left">
      <strong>{String}</strong> Request mapping to back-end service that handles the upload and returns a response.
    </td>
  </tr>
  <tr>
    <td align="left">additionalData</td>
    <td align="center"><strong>{}</strong></td>
    <td align="left">
      <strong>{Object}</strong> Additional data you would like to pass along with the request.
    </td>
  </tr>
  <tr>
    <td align="left">autoUpload</td>
    <td align="center"><strong>true</strong></td>
    <td align="left">
      <strong>{Boolean}</strong> If true, the upload will happen upon file selection.
    </td>
  </tr>
  <tr>
    <td align="left">dataType</td>
    <td align="center"><strong>"json"</strong></td>
    <td align="left">
      <strong>{String}</strong> The data type you are using to communicate with the server. Currently, only
      <em>"json"</em> is supported.
    </td>
  </tr>
  <tr>
    <td align="left">method</td>
    <td align="center"><strong>"post"</strong></td>
    <td align="left">
      <strong>{String}</strong> The request method you would like to send to the server. Can be "post" or "get".
    </td>
  </tr>
  <tr>
    <td align="left">pathToSwf</td>
    <td align="center"><strong>"AjaxFileUpload.swf"&nbsp;&nbsp;&nbsp;</strong></td>
    <td align="left">
      <strong>{String}</strong> Path to SWF that is required for IE9 and below. You will likely need to serve this from the same domain as your website or application.
    </td>
  </tr>
  <tr>
    <td align="left">showCustomInput</td>
    <td align="center"><strong>false</strong></td>
    <td align="left">
      <strong>{Boolean}</strong> If true, a style-able fake element will be used.
    </td>
  </tr>
  <tr>
    <td align="left">buttonEmptyText</td>
    <td align="center"><strong>"Select"</strong></td>
    <td align="left">
      <strong>{Boolean}</strong> Label for button pre file section.
    </td>
  </tr>
  <tr>
    <td align="left">buttonSelectedText</td>
    <td align="center"><strong>"Upload"</strong></td>
    <td align="left">
      <strong>{Boolean}</strong> Label for button post file section.
    </td>
  </tr>
  <tr>
    <td align="left">multiple</td>
    <td align="center"><strong>false</strong></td>
    <td align="left">
      <strong>{Boolean}</strong> Enables multiple file uploading. If the provided input has the multiple attribute set to true, this will automatically be true. Explicitly setting it here will override any attribute value.
    </td>
  </tr>
  <tr>
    <td align="left">sizeLimit</td>
    <td align="center"><strong>0</strong></td>
    <td align="left">
      <strong>{Integer}</strong> Uploading file size limit in bytes.
    </td>
  </tr>
  <tr>
    <td align="left">allowedTypes</td>
    <td align="center"><strong>[]</strong></td>
    <td align="left">
      <strong>{Array}</strong> Allowed file types. Format: ['image/jpg', 'image/jpeg', 'image/png']
    </td>
  </tr>
  </tbody>
</table>

<a href="#" name="callbacks"></a>
<h2>Callbacks</h2>
<table id="callbacks-table" class="table">
  <tbody>
  <tr>
    <th align="left">Name</th>
    <th align="center">Params</th>
    <th align="left">Description</th>
  </tr>
  <tr>
    <td align="left">onSuccess</td>
    <td align="center">(data, files, XHR/UrlRequest)</td>
    <td align="left">Fires on successful ajax response.</td>
  </tr>
  <tr>
    <td align="left">onError</td>
    <td align="center">(data, files, XHR/UrlRequest)</td>
    <td align="left">Fires when there is an error.</td>
  </tr>
  <tr>
    <td align="left">onFileSelect</td>
    <td align="center">(selectedFiles)</td>
    <td align="left">Fires on file input change event.</td>
  </tr>
  <tr>
    <td align="left">onProgress</td>
    <td align="center">(loaded, total, files, XHR/UrlRequest)</td>
    <td align="left">Fires as the upload progresses. <br/><strong>(This can be used to create progress bars)</strong>.</td>
  </tr>
  <tr>
    <td align="left">onProgressStart</td>
    <td align="center">(files, XHR/UrlRequest)</td>
    <td align="left">Fires when the upload process begins.</td>
  </tr>
  <tr>
    <td align="left">onProgressEnd</td>
    <td align="center">(files, XHR/UrlRequest)</td>
    <td align="left">Fires when the upload process ends.</td>
  </tr>
  </tbody>
</table>

<p class="note">For more detailed documentation, please see the <a href="../docs/AjaxFileUpload.html" target="_blank">Annotated Source</a>.</p>

<footer>
  &copy; 2013 Created by James Childers
</footer>


<!--&lt;!&ndash;<nav id="main-nav">&ndash;&gt;-->
<!--&lt;!&ndash;<ul>&ndash;&gt;-->
<!--&lt;!&ndash;<li class="active"><a href="#examples">Examples</a></li>&ndash;&gt;-->
<!--&lt;!&ndash;<li><a href="#options">Options</a></li>&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;<li><a href="#example3"></a></li>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;</ul>&ndash;&gt;-->
<!--&lt;!&ndash;</nav>&ndash;&gt;-->

<!--&lt;!&ndash;<div id="sections">&ndash;&gt;-->

<!--&lt;!&ndash;<div id="examples" class="section">&ndash;&gt;-->


<!--&lt;!&ndash;<div class="example">&ndash;&gt;-->
<!--&lt;!&ndash;<h2>Example 1: Simple ajax auto-upload upon selection.</h2>&ndash;&gt;-->

<!--&lt;!&ndash;<form action="upload.php" method="post" enctype="multipart/form-data" id="file-upload-form1">&ndash;&gt;-->
<!--&lt;!&ndash;<input type="file" name="file" id="file1"/>&ndash;&gt;-->
<!--&lt;!&ndash;</form>&ndash;&gt;-->

<!--&lt;!&ndash;<progress id="progress-bar" style="display: none;">&ndash;&gt;-->
<!--&lt;!&ndash;<strong class="fallback">Progress: <span class="percent">0</span>% done.</strong>&ndash;&gt;-->
<!--&lt;!&ndash;</progress>&ndash;&gt;-->

<!--&lt;!&ndash;<strong>HTML:</strong>&ndash;&gt;-->
<!--&lt;!&ndash;<pre class="brush: js; tab-size: 2;">&lt;form action=&quot;upload.php&quot; method=&quot;post&quot; enctype=&quot;multipart/form-data&quot;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;label for=&quot;file1&quot;&gt;Select a file: &lt;/label&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;input type=&quot;file&quot; name=&quot;file&quot; id=&quot;<strong>file1</strong>&quot;/&gt;&ndash;&gt;-->
<!--&lt;!&ndash;&lt;/form&gt;</pre>&ndash;&gt;-->
<!--&lt;!&ndash;<strong>JS:</strong>&ndash;&gt;-->
<!--&lt;!&ndash;<pre>&lt;script type=&quot;text/javascript&quot;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;var input = document.getElementById(&quot;<strong>file1</strong>&quot;),&ndash;&gt;-->
<!--&lt;!&ndash;ajaxFileUpload = new <strong>AjaxFileUpload</strong>(input, {&ndash;&gt;-->
<!--&lt;!&ndash;url: input.form.action&ndash;&gt;-->
<!--&lt;!&ndash;});&ndash;&gt;-->
<!--&lt;!&ndash;&lt;/script&gt;</pre>&ndash;&gt;-->
<!--&lt;!&ndash;<div class="response" style="display: none;">&ndash;&gt;-->
<!--&lt;!&ndash;<strong>Response</strong>&ndash;&gt;-->
<!--&lt;!&ndash;<pre></pre>&ndash;&gt;-->
<!--&lt;!&ndash;</div>&ndash;&gt;-->
<!--&lt;!&ndash;<div class="uploads"></div>&ndash;&gt;-->
<!--&lt;!&ndash;</div>&ndash;&gt;-->
<!--&lt;!&ndash;</div>&ndash;&gt;-->

<!--&lt;!&ndash;<div id="options" class="section" style="display: none">&ndash;&gt;-->
<!--&lt;!&ndash;<table cellspacing="0" border="0">&ndash;&gt;-->
<!--&lt;!&ndash;<thead>&ndash;&gt;-->
<!--&lt;!&ndash;<tr>&ndash;&gt;-->
<!--&lt;!&ndash;<th>Option</th>&ndash;&gt;-->
<!--&lt;!&ndash;<th>Default Value</th>&ndash;&gt;-->
<!--&lt;!&ndash;<th>Description</th>&ndash;&gt;-->
<!--&lt;!&ndash;</tr>&ndash;&gt;-->
<!--&lt;!&ndash;</thead>&ndash;&gt;-->
<!--&lt;!&ndash;<tbody>&ndash;&gt;-->
<!--&lt;!&ndash;<tr>&ndash;&gt;-->
<!--&lt;!&ndash;<td>url</td>&ndash;&gt;-->
<!--&lt;!&ndash;<td>""</td>&ndash;&gt;-->
<!--&lt;!&ndash;<td><strong>(Required)</strong> <em>String</em> URL to upload controller.</td>&ndash;&gt;-->
<!--&lt;!&ndash;</tr>&ndash;&gt;-->
<!--&lt;!&ndash;<tr>&ndash;&gt;-->
<!--&lt;!&ndash;<td>additionalData</td>&ndash;&gt;-->
<!--&lt;!&ndash;<td>{}</td>&ndash;&gt;-->
<!--&lt;!&ndash;<td><em>Object</em> Additional data that will get posted along with the file data.</td>&ndash;&gt;-->
<!--&lt;!&ndash;</tr>&ndash;&gt;-->
<!--&lt;!&ndash;<tr>&ndash;&gt;-->
<!--&lt;!&ndash;<td>autoUpload</td>&ndash;&gt;-->
<!--&lt;!&ndash;<td>true</td>&ndash;&gt;-->
<!--&lt;!&ndash;<td><em>Boolean</em> If true, ajax upload will fire upon dialog selection.</td>&ndash;&gt;-->
<!--&lt;!&ndash;</tr>&ndash;&gt;-->
<!--&lt;!&ndash;</tbody>&ndash;&gt;-->
<!--&lt;!&ndash;</table>&ndash;&gt;-->
<!--&lt;!&ndash;</div>&ndash;&gt;-->
<!--&lt;!&ndash;</div>&ndash;&gt;-->

</div>


</body>
</html>