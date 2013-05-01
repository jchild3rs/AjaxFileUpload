//// Features -
// - single-file vs multi-file
// - normal vs custom styles


$(function(){
  $('#file1').ajaxFileUpload({
    url: "/demo/upload.php",
    multiple: true,
    sizeLimit: 5242880, // 5 MB
    showCustomInput: true,
    autoUpload: true,
    allowedTypes: ['image/jpg', 'image/jpeg', 'image/png'],
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
      console.log("onProgress", parseInt(loaded / total * 100, 10), loaded, total, files, xhr);
      $("progress#progress-bar").attr({
        "max": total,
        "value": loaded
      });
      $("progress#progress-bar .percent").text(parseInt(loaded / total * 100, 10) + "%");
    },
    onProgressStart: function(files, xhr) {
      $("#progress-bar").fadeIn();
      console.log("onProgressStart", files, xhr);
    },
    onProgressEnd: function(files, xhr) {
      $("#progress-bar").fadeOut();
      console.log("onProgressEnd", files, xhr);
    }
  });
});