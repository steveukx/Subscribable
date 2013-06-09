var Assertions = require('unit-test').Assertions,
    Sinon = require('unit-test').Sinon,
    TestCase = require('unit-test').TestCase;

module.exports = new TestCase("stringEventNames", {

   "test can use strings to fire events":function () {
      var sub = new Subscribable();
      var stubHandler = Sinon.spy(function() {});

      sub.on('namedEvent', stubHandler);
      sub.fire('NamedEvent');
      Assertions.assertEquals(1, stubHandler.callCount);
   },

   "test can use any case of string":function () {
      var sub = new Subscribable();
      var stubHandler = Sinon.spy(function() {});

      sub.on('namedEvent', stubHandler);
      sub.fire('NAMEDEvent');
      Assertions.assertEquals(1, stubHandler.callCount);
   },

   "test can use an object that has a constructor level toString that returns an event name":function () {
      var sub = new Subscribable();
      var stubHandler = Sinon.spy(function() {});

      sub.on('someNamedEvent', stubHandler);
      sub.fire( SomeNamedEvent );
      Assertions.assertEquals(1, stubHandler.callCount);
   }

});
