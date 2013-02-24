<?php


?><!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>
<meta http-equiv="Content-type" content="text/html; charset=utf-8">
<title>Ajax File Upload Plugin</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
<script type="text/javascript" src="../dist/AjaxFileUpload-1.0.0.js"></script>
<meta name="viewport" content="width=device-width"/>

<link rel="stylesheet" href="demo.css">
<script type="text/javascript" src="http://use.typekit.com/bax4uqj.js"></script>
<script type="text/javascript">try {Typekit.load();} catch (e) {}</script>

</head>
<body>
<nav id="top-bar">
    <ul>
        <li>Download: <a href="../dist/FileUploadPlugin.min.js" target="_blank">Minified 2.3KB</a> | <a href="../dist/FileUploadPlugin.js" target="_blank">Full Source 13.8KB</a></li>
        <li class="active"><a href="#examples">Examples</a></li>
        <li><a href="#options">Options</a></li>
        <!--<li><a href="/docs/AjaxFileUpload.html">Documentation</a></li>-->
        <li><a href="../docs/AjaxFileUpload.html" target="_blank">Annotated Source</a></li>
        <!--<li><a href="../test/FileUploadPlugin.html" target="_blank">Tests</a></li>-->
    </ul>
</nav>

<div id="main">
    <h1>AjaxFileUpload.js</h1>

    <!--<nav id="main-nav">-->
        <!--<ul>-->
            <!--<li class="active"><a href="#examples">Examples</a></li>-->
            <!--<li><a href="#options">Options</a></li>-->
            <!--&lt;!&ndash;<li><a href="#example3"></a></li>&ndash;&gt;-->
        <!--</ul>-->
    <!--</nav>-->

    <div id="sections">

        <div id="examples" class="section">
            <div class="example">
                <h2>Example 1: Simple ajax auto-upload upon selection.</h2>
                <form action="upload.php" method="post" enctype="multipart/form-data" id="file-upload-form1">
                    <input type="file" name="file" id="file1" accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp,image/tiff"/>
                </form>
                <script type="text/javascript" charset="utf-8">
                    //            $('#file1').ajaxFileUpload({
                    var input = document.getElementById("file1");
                    new AjaxFileUpload(input, {
                        url: "http://fileupload.jchilders.com/demo/upload.php",
                        multiple: true,
                        sizeLimit: 2000000,
                        showCustomInput: true,
//                        autoUpload: true,
                        allowedTypes: "*.jpg;*.jpeg;*.gif;*.png",
                        onSuccess: function(data, files, xhr) {
                            console.log("onSuccess", data, JSON.stringify(files), xhr);
                            var response = JSON.stringify(data);
                            $(input).parents('.example').find('.response').show().find('pre').append("<span>" + response + "</span>");
                        },
                        onError: function(message) {
                            console.log("onError", message);
                        },
                        onFileSelect: function(selection) {
                            console.log("onSelection: ", selection);
                        },
                        onProgress: function(loaded, total, files, xhr) {
                            console.log("onProgress", loaded, total, files, xhr);

                        },
                        onProgressStart: function(files, xhr) {
                            console.log("onProgressStart", files, xhr);
                        },
                        onProgressEnd: function(files, xhr) {
                            console.log("onProgressEnd", files, xhr);
                        }
                    });
                </script>
                <!--<strong>HTML:</strong>-->
            <!--<pre class="brush: js; tab-size: 2;">&lt;form action=&quot;upload.php&quot; method=&quot;post&quot; enctype=&quot;multipart/form-data&quot;&gt;-->
    <!--&lt;label for=&quot;file1&quot;&gt;Select a file: &lt;/label&gt;-->
    <!--&lt;input type=&quot;file&quot; name=&quot;file&quot; id=&quot;<strong>file1</strong>&quot;/&gt;-->
<!--&lt;/form&gt;</pre>-->
                <!--<strong>JS:</strong>-->
                <!--<pre>&lt;script type=&quot;text/javascript&quot;&gt;-->
<!--var input = document.getElementById(&quot;<strong>file1</strong>&quot;),-->
<!--ajaxFileUpload = new <strong>AjaxFileUpload</strong>(input, {-->
    <!--url: input.form.action-->
<!--});-->
<!--&lt;/script&gt;</pre>-->
                <div class="response" style="display: none;">
                    <strong>Response</strong>
                    <pre></pre>
                </div>
                <div class="uploads"></div>
            </div>
        </div>

        <div id="options" class="section" style="display: none">
            <table cellspacing="0" border="0">
                <thead>
                    <tr>
                        <th>Option</th>
                        <th>Default Value</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>url</td>
                        <td>""</td>
                        <td><strong>(Required)</strong> <em>String</em> URL to upload controller.</td>
                    </tr>
                    <tr>
                        <td>additionalData</td>
                        <td>{}</td>
                        <td><em>Object</em> Additional data that will get posted along with the file data.</td>
                    </tr>
                    <tr>
                        <td>autoUpload</td>
                        <td>true</td>
                        <td><em>Boolean</em> If true, ajax upload will fire upon dialog selection.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</div>

<script type="text/javascript">
    $(".section").not($("nav#top-bar .active a").attr("href")).hide();
    $("nav#top-bar a").click(function(e){
        $(".section").hide();
        $("nav#top-bar .active").removeClass("active");
        var target = $($(e.target).attr("href"));
        target.show();
        $(e.target).parents("li").addClass("active");
        e.preventDefault();
    });
</script>

</body>
</html>