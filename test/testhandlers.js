var Assertions = require('unit-test').Assertions,
    Sinon = require('unit-test').Sinon,
    TestCase = require('unit-test').TestCase;

module.exports = new TestCase("TestHandlers", {

   "test handlers attached to string event names receive all arguments fired":function () {
      var spyHandler = Sinon.spy(function() {}),
          spyScope = {},
          sub = new Subscribable();

      sub.on('stringEventName', spyHandler, spyScope);

      sub.fire('stringEventName', 'blah', 'plop', 'woo');

      Assertions.assertEquals(1, spyHandler.callCount);
      Assertions.assert(thisSpy(spyHandler).wasCalledInScope(spyScope));
      Assertions.assert(thisSpy(spyHandler).wasCalledWithArguments('blah', 'plop', 'woo'));

      Assertions.assertEquals(true, true);
   },

   "test handlers are executed in order of attaching": function() {
      var spyHandlerA = Sinon.spy(),
          spyHandlerB = Sinon.spy(),
          sub = new Subscribable();

      sub.on('foo', spyHandlerA);
      sub.on('foo', spyHandlerB);

      sub.fire('foo', 'blah', 'plop', 'woo');

      Assertions.assert(thisSpy(spyHandlerA).wasCalledWithArguments('blah', 'plop', 'woo'));
      Assertions.assert(thisSpy(spyHandlerB).wasCalledWithArguments('blah', 'plop', 'woo'));
      Assertions.assert(thisSpy(spyHandlerA).wasCalledBefore(spyHandlerB));
   },

   "test handlers can return false to prevent events from 'bubbling'": function() {
      var spyHandlerA = Sinon.spy(),
          spyHandlerB = Sinon.stub().returns(false),
          spyHandlerC = Sinon.spy(),
          sub = new Subscribable();

      sub.on('foo', spyHandlerA);
      sub.on('foo', spyHandlerB);
      sub.on('foo', spyHandlerC);

      sub.fire('foo', 'blah', 'plop', 'woo');
      Assertions.assert(thisSpy(spyHandlerC).wasNotCalled());
   },

   "test handlers can return false-y values without preventing events from 'bubbling'": function() {
      var spyHandlerA = Sinon.stub().returns(0),
          spyHandlerB = Sinon.stub().returns(null),
          spyHandlerC = Sinon.spy(),
          sub = new Subscribable();

      sub.on('foo', spyHandlerA);
      sub.on('foo', spyHandlerB);
      sub.on('foo', spyHandlerC);

      sub.fire('foo', 'blah', 'plop', 'woo');
      Assertions.assert(thisSpy(spyHandlerC).wasCalled().once());
   }

});
