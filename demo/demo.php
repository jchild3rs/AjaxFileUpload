<?php


?><!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>
<meta http-equiv="Content-type" content="text/html; charset=utf-8">
<title>jQuery File Upload Plugin</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<script type="text/javascript" src="../src/AjaxFileUpload.js"></script>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>

<!--<script type="text/javascript" src="js/shCore.js"></script>-->
<!--<script type="text/javascript" src="js/shBrushJScript.js"></script>-->
<!--<link type="text/css" rel="stylesheet" href="css/shCoreDefault.css"/>-->

<!--<script type="text/javascript">-->
    <!--SyntaxHighlighter.all();-->
<!--</script>-->


<style type="text/css">

body {
    background: #edece8;
    color: #666;
    font-family: "museo-slab-1", "museo-slab-2", "Rockwell", "Georgia", serif;
    margin: 0;
    padding: 0 0 50px;
    /*text-align: center;*/
}
pre {
    padding: 15px;
    background: #fff;
    border-radius: 15px;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace;
    overflow: auto;
    -webkit-box-shadow: inset 0 1px 0 0 #fff, 0 1px 2px 0 #ddd;
    box-shadow: inset 0 1px 0 0 #fff, 0 1px 2px 0 #ddd;
}

h1 {
    font-size: 60px;
    text-shadow: 2px 2px 2px #fff;
    margin: 50px 0;
}

#sub-head {
    margin-bottom: 40px;
}

#main {
    width: 750px;
    margin: 0 auto;
}

.fu-input {
    display: inline-block;
    vertical-align: top;
    width: 80%;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;

    border: 1px solid #bbb;
    -webkit-border-top-left-radius: 3px;
    -webkit-border-bottom-left-radius: 3px;
    -moz-border-radius-topleft: 3px;
    -moz-border-radius-bottomleft: 3px;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    border-right: 0;
    padding: 8px;
    background: #fafafa;
    -webkit-box-shadow: inset 0 1px 0 0 #fff, 0 1px 2px 0 #ddd;
    box-shadow: inset 0 1px 0 0 #fff, 0 1px 2px 0 #ddd;
    color: #666;
    font: bold 14px/1 "helvetica neue", helvetica, arial, sans-serif;
    text-shadow: 0 1px 0 #fff;
}

    /*.fu-hover .fu-input {*/
    /*background: #fff;*/
    /*}*/

.fu-button {
    text-transform: uppercase;
    vertical-align: top;
    display: inline-block;
    width: 20%;
    padding: 10px 5px;
    background-color: #52a8e8;
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #52a8e8), color-stop(100%, #377ad0));
    background-image: -webkit-linear-gradient(top, #52a8e8, #377ad0);
    background-image: -moz-linear-gradient(top, #52a8e8, #377ad0);
    background-image: -ms-linear-gradient(top, #52a8e8, #377ad0);
    background-image: -o-linear-gradient(top, #52a8e8, #377ad0);
    background-image: linear-gradient(top, #52a8e8, #377ad0);
    border-top: 1px solid #4081af;
    border-right: 1px solid #2e69a3;
    border-bottom: 1px solid #20559a;
    border-left: 1px solid #2e69a3;
    -webkit-border-top-right-radius: 5px;
    -webkit-border-bottom-right-radius: 5px;
    -moz-border-radius-topright: 5px;
    -moz-border-radius-bottomright: 5px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    color: #fff;
    text-align: center;
    text-shadow: 0 -1px 1px #3275bc;
    -webkit-background-clip: padding-box;
}

.fu-button:hover,
.fu-hover .fu-button {
    background-color: #3e9ee5;
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #3e9ee5), color-stop(100%, #206bcb));
    background-image: -webkit-linear-gradient(top, #3e9ee5 0%, #206bcb 100%);
    background-image: -moz-linear-gradient(top, #3e9ee5 0%, #206bcb 100%);
    background-image: -ms-linear-gradient(top, #3e9ee5 0%, #206bcb 100%);
    background-image: -o-linear-gradient(top, #3e9ee5 0%, #206bcb 100%);
    background-image: linear-gradient(top, #3e9ee5 0%, #206bcb 100%);
    border-top: 1px solid #2a73a6;
    border-right: 1px solid #165899;
    border-bottom: 1px solid #07428f;
    border-left: 1px solid #165899;
    -webkit-box-shadow: inset 0 1px 0 0 #62b1e9;
    box-shadow: inset 0 1px 0 0 #62b1e9;
    cursor: pointer;
    text-shadow: 0 -1px 1px #1d62ab;
    -webkit-background-clip: padding-box;
}

.fu-button:active {
    background: #3282d3;
    border: 1px solid #154c8c;
    border-bottom: 1px solid #0e408e;
    -webkit-box-shadow: inset 0 0 6px 3px #1657b5, 0 1px 0 0 white;
    box-shadow: inset 0 0 6px 3px #1657b5, 0 1px 0 0 white;
    text-shadow: 0 -1px 1px #2361a4;
    -webkit-background-clip: padding-box;
}

.progress-bar-wrap {
    width: 100%;
}

.progress-bar {
    /*width: 0;*/
    height: 25px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    -moz-box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset;
    -webkit-box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset;
    box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset;
    -webkit-transition: width .4s ease-in-out;
    -moz-transition: width .4s ease-in-out;
    -ms-transition: width .4s ease-in-out;
    -o-transition: width .4s ease-in-out;
    transition: width .4s ease-in-out;
}

.blue {
    background-color: #3275bc;
}

.orange {
    background-color: #fecf23;
    background-image: -webkit-gradient(linear, left top, left bottom, from(#fecf23), to(#fd9215));
    background-image: -webkit-linear-gradient(top, #fecf23, #fd9215);
    background-image: -moz-linear-gradient(top, #fecf23, #fd9215);
    background-image: -ms-linear-gradient(top, #fecf23, #fd9215);
    background-image: -o-linear-gradient(top, #fecf23, #fd9215);
    background-image: linear-gradient(top, #fecf23, #fd9215);
}

.green {
    background-color: #a5df41;
    background-image: -webkit-gradient(linear, left top, left bottom, from(#a5df41), to(#4ca916));
    background-image: -webkit-linear-gradient(top, #a5df41, #4ca916);
    background-image: -moz-linear-gradient(top, #a5df41, #4ca916);
    background-image: -ms-linear-gradient(top, #a5df41, #4ca916);
    background-image: -o-linear-gradient(top, #a5df41, #4ca916);
    background-image: linear-gradient(top, #a5df41, #4ca916);
}

.stripes {
    -webkit-background-size: 30px 30px;
    -moz-background-size: 30px 30px;
    background-size: 30px 30px;
    background-image: -webkit-gradient(linear, left top, right bottom, color-stop(.25, rgba(255, 255, 255, .15)), color-stop(.25, transparent), color-stop(.5, transparent), color-stop(.5, rgba(255, 255, 255, .15)), color-stop(.75, rgba(255, 255, 255, .15)), color-stop(.75, transparent), to(transparent));
    background-image: -webkit-linear-gradient(135deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
    background-image: -moz-linear-gradient(135deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
    background-image: -ms-linear-gradient(135deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
    background-image: -o-linear-gradient(135deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
    background-image: linear-gradient(135deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);

    -webkit-animation: animate-stripes 3s linear infinite;
    -moz-animation: animate-stripes 3s linear infinite;
}

@-webkit-keyframes animate-stripes {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 60px 0;
    }
}

@-moz-keyframes animate-stripes {
    0% {
        background-position: 60px 0;
    }
    100% {
        background-position: 0 0;
    }
}

.shine {
    position: relative;
}

.shine span::after {
    content: '';
    opacity: 0;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #fff;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;

    -webkit-animation: animate-shine 2s ease-out infinite;
    -moz-animation: animate-shine 2s ease-out infinite;
}

@-webkit-keyframes animate-shine {
    0% {
        opacity: 0;
        width: 0;
    }
    50% {
        opacity: .5;
    }
    100% {
        opacity: 0;
        width: 95%;
    }
}

@-moz-keyframes animate-shine {
    0% {
        opacity: 0;
        width: 0;
    }
    50% {
        opacity: .5;
    }
    100% {
        opacity: 0;
        width: 95%;
    }
}

.glow {
    -moz-box-shadow: 0 5px 5px rgba(255, 255, 255, .7) inset, 0 -5px 5px rgba(255, 255, 255, .7) inset;
    -webkit-box-shadow: 0 5px 5px rgba(255, 255, 255, .7) inset, 0 -5px 5px rgba(255, 255, 255, .7) inset;
    box-shadow: 0 5px 5px rgba(255, 255, 255, .7) inset, 0 -5px 5px rgba(255, 255, 255, .7) inset;

    -webkit-animation: animate-glow 1s ease-out infinite;
    -moz-animation: animate-glow 1s ease-out infinite;
}

@-webkit-keyframes animate-glow {
    0% {
        -webkit-box-shadow: 0 5px 5px rgba(255, 255, 255, .7) inset, 0 -5px 5px rgba(255, 255, 255, .7) inset;
    }
    50% {
        -webkit-box-shadow: 0 5px 5px rgba(255, 255, 255, .3) inset, 0 -5px 5px rgba(255, 255, 255, .3) inset;
    }
    100% {
        -webkit-box-shadow: 0 5px 5px rgba(255, 255, 255, .7) inset, 0 -5px 5px rgba(255, 255, 255, .7) inset;
    }
}

@-moz-keyframes animate-glow {
    0% {
        -moz-box-shadow: 0 5px 5px rgba(255, 255, 255, .7) inset, 0 -5px 5px rgba(255, 255, 255, .7) inset;
    }
    50% {
        -moz-box-shadow: 0 5px 5px rgba(255, 255, 255, .3) inset, 0 -5px 5px rgba(255, 255, 255, .3) inset;
    }
    100% {
        -moz-box-shadow: 0 5px 5px rgba(255, 255, 255, .7) inset, 0 -5px 5px rgba(255, 255, 255, .7) inset;
    }
}

#response-data {
    width: 750px;
    margin: 100px auto 0;
}

#response-data textarea {
    background: none;
    border: 0;
    width: 750px;
    overflow: scroll;
}

#top-bar {
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    width: 100%;
    background: #333;
    color: #ccc;
    padding: 7px 0 10px;
}
#top-bar ul {
    width: 750px;
    margin: 0 auto;
}
nav ul {
    margin: 0;
    list-style: none;
    padding: 0;
}
#top-bar li {
    list-style: none;
    display: inline;
    padding: 0 15px;
    font-size: 12px;
    line-height: 12px;
    color: #ccc;
}
#top-bar a {
    color: #eee;
    text-decoration: none;
}

#main-nav {
    margin-bottom: 50px; }
#main-nav li {
    display: inline;
    font-size: 18px;
    padding-right: 20px;
    margin-right: 20px;
    border-right: 1px solid #ccc; }
#main-nav a {
    color: #333;
    text-decoration: none; }
#main-nav .active a {
    text-decoration: underline;
}
#examples {
    width: 750px;
    margin: 0 auto;
}
#examples form {
    margin-bottom: 20px;
}
#options table {
    width: 100%;
}
#options table tr {}
#options table th {
    text-align: left;
    background: #333;
    color: #ccc;
}
#options table th,
#options table td {
    padding: 15px 5px;
    border-bottom: 1px solid #ccc;
    vertical-align: middle;
}


</style>
<script type="text/javascript" src="http://use.typekit.com/bax4uqj.js"></script>
<script type="text/javascript">try {Typekit.load();} catch (e) {}</script>

</head>
<body>
<nav id="top-bar">
    <ul>
        <li>Download: <a href="../dist/FileUploadPlugin.min.js" target="_blank">Minified 2.3KB</a> | <a href="../dist/FileUploadPlugin.js" target="_blank">Full Source 13.8KB</a></li>
        <li class="active"><a href="#examples">Examples</a></li>
        <li><a href="#options">Options</a></li>
        <li><a href="#">Documentation</a></li>
        <li><a href="../docs/FileUploadPlugin.html" target="_blank">Annotated Source</a></li>
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
                    <label for="file1">Select a file: </label>
                    <input type="file" name="file" id="file1"/>
                </form>
                <script type="text/javascript" charset="utf-8">
                    //            $('#file1').ajaxFileUpload({
                    var input = document.getElementById("file1");
                    new AjaxFileUpload(input, {
                        url: "upload.php",
                        onSuccess: function(data, formData, xhr) {
                            console.log(data, JSON.stringify(formData), xhr);
                            var response = JSON.stringify(data);
                            $(input).parents('.example').find('.response').show().find('pre').text(response);
                        }
                    });
                </script>
                <strong>HTML:</strong>
            <pre class="brush: js; tab-size: 2;">&lt;form action=&quot;upload.php&quot; method=&quot;post&quot; enctype=&quot;multipart/form-data&quot;&gt;
    &lt;label for=&quot;file1&quot;&gt;Select a file: &lt;/label&gt;
    &lt;input type=&quot;file&quot; name=&quot;file&quot; id=&quot;<strong>file1</strong>&quot;/&gt;
&lt;/form&gt;</pre>
                <strong>JS:</strong>
                <pre>&lt;script type=&quot;text/javascript&quot;&gt;
var input = document.getElementById(&quot;<strong>file1</strong>&quot;),
ajaxFileUpload = new <strong>AjaxFileUpload</strong>(input, {
    url: input.form.action
});
&lt;/script&gt;</pre>
                <div class="response" style="display: none;">
                    <strong>Response</strong>
                    <pre></pre>
                </div>
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