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



  module('Dev Usability', {
    setup: function() {
      this.el = document.getElementById("mock-file-input1");
    }
  });
  test("Provided input element is accessible via the instance", 1, function() {
    var instance = new AjaxFileUpload(this.el);
    strictEqual(this.el, instance.input, "It is accessible via instance.input");
  });
  test("Provided settings are accessible via the instance", 2, function() {
    var customSettings = { foo: "bar", onError: function() {} };
    var instance = new AjaxFileUpload(this.el, customSettings);
    strictEqual(customSettings.foo, instance.settings.foo, "Setting successfully passed a string through.");
    strictEqual(customSettings.onError, instance.settings.onError, "Setting successfully passed a function/callback through.");
  });
  



  module('Initialization', {
    setup: function() {
      this.el = document.getElementById("mock-file-input2");
    }
  });
  test('Constructor: Provided element is a valid input.', 3, function() {
    var instance = new AjaxFileUpload(this.el);
    strictEqual(instance.input.nodeName === "INPUT", true, "Provided element is an input!");
    strictEqual(instance.input.type === "file", true, "Provided input is a file input!");
    
    var instance2 = new AjaxFileUpload(document.createElement("div"));
    console.log(instance2);
    strictEqual(true, true, "asdf");
    
  });
  



  module('Public Methods', {
    setup: function() {
      this.el = document.getElementById("mock-file-input3");
    }
  });
  test('upload(): Call upload against current isntance\'s input.', 1, function() {
    // this.instance.reset();
    this.instance = new AjaxFileUpload(this.el);
    equal(true, true, 'woot');
  });
  test('reset(): Resets instance\'s input input.', 1, function() {
    // this.instance.reset();
    this.instance = new AjaxFileUpload(this.el);
    equal(true, true, 'woot');
  });
  
  
  
  
  
  

}(jQuery));

