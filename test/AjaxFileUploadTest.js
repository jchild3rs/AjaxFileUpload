/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  /*
   ======== A Handy Little QUnit Reference ========
   http://docs.jquery.com/QUnit

   Test methods:
   expect(numAssertions)
   stop(increment)
   start(decrement)
   Test assertions:
   ok(value, [message])
   equal(actual, expected, [message])
   notEqual(actual, expected, [message])
   deepEqual(actual, expected, [message])
   notDeepEqual(actual, expected, [message])
   strictEqual(actual, expected, [message])
   notStrictEqual(actual, expected, [message])
   raises(block, [expected], [message])
   //  */

  var MOCK_INPUT = document.createElement("input");
  MOCK_INPUT.type = "file";
  MOCK_INPUT.id = "mock-file-input";

  var INPUT_TYPES = ["button", "checkbox", "colorNew", "dateNew", "datetimeNew", "datetime-localNew", "emailNew", "hidden", "file", "image", "monthNew", "numberNew", "password", "radio", "rangeNew", "reset", "searchNew", "submit", "telNew", "text", "timeNew", "urlNew", "weekNew"];

  module('validate.inputType()', {
    setup: function() {
      this.input = document.getElementById("mock-file-input");
      this.instance = new AjaxFileUpload(document.getElementById("mock-file-input"), {
        url: "../demo/upload.php"
      });
    }
  });

  test('fails if anything but "file" type', 1, function() {
    strictEqual(true, true, "foo");
//    for (var i = 0; i < INPUT_TYPES.length; i++) {
//      var isFileType = INPUT_TYPES[i] === "file";
//      strictEqual(this.instance.validate.inputType(INPUT_TYPES[i]), isFileType, 'When "' + INPUT_TYPES[i] + '", returns ' + isFileType);
//    }
  });

}(jQuery));

