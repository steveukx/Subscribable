var Assertions = require('unit-test').Assertions,
    Sinon = require('unit-test').Sinon,
    TestCase = require('unit-test').TestCase;

module.exports = new TestCase("Single Subscriptions", {

   "test attaching a single subscription returns a the subscribable for chaining":function () {
      var sub = new Subscribable();
      var subscriptionResult = sub.on('foo', function() {});

      Assertions.assertEquals(sub, subscriptionResult);
   },

   "test able to unsubscribe from a single handler by function": function() {
      var stubHandler = Sinon.spy(function() {});
      var sub = new Subscribable();
      sub.on('foo', stubHandler);

      Assertions.assertEquals(0, stubHandler.callCount);
      sub.fire('foo');
      Assertions.assertEquals(1, stubHandler.callCount);
      sub.un(stubHandler);
      sub.fire('foo');
      Assertions.assertEquals(1, stubHandler.callCount);
   },

   "test able to unsubscribe from a single handler by function leaves others intact": function() {
      var sub = new Subscribable();

      var stubHandlerFoo = Sinon.spy(),
         stubHandlerBar = Sinon.spy();

      var subResultFoo = sub.on('foo', stubHandlerFoo),
         subResultBar = sub.on('bar', stubHandlerBar);

      Assertions.assertEquals(0, stubHandlerFoo.callCount);
      Assertions.assertEquals(0, stubHandlerBar.callCount);

      sub.fire('foo');
      Assertions.assertEquals(1, stubHandlerFoo.callCount);
      Assertions.assertEquals(0, stubHandlerBar.callCount);

      sub.fire('bar');
      Assertions.assertEquals(1, stubHandlerFoo.callCount);
      Assertions.assertEquals(1, stubHandlerBar.callCount);

      sub.un(stubHandlerFoo);

      sub.fire('foo');
      Assertions.assertEquals(1, stubHandlerFoo.callCount);
      Assertions.assertEquals(1, stubHandlerBar.callCount);

      sub.fire('bar');
      Assertions.assertEquals(1, stubHandlerFoo.callCount);
      Assertions.assertEquals(2, stubHandlerBar.callCount);

      sub.un(stubHandlerBar);

      sub.fire('foo');
      Assertions.assertEquals(1, stubHandlerFoo.callCount);
      Assertions.assertEquals(2, stubHandlerBar.callCount);

      sub.fire('bar');
      Assertions.assertEquals(1, stubHandlerFoo.callCount);
      Assertions.assertEquals(2, stubHandlerBar.callCount);
   },

   "test attempting to unsubscribe with a bad handler id does not cause errors": function() {
      var sub = new Subscribable();
      var stubHandlerFoo = Sinon.spy();
      var subResultFoo = sub.on('foo', stubHandlerFoo);

      sub.fire('foo');
      Assertions.assertEquals(1, stubHandlerFoo.callCount);

      sub.un(1000); // does nothing

      sub.fire('foo');
      Assertions.assertEquals(2, stubHandlerFoo.callCount);

      sub.un(stubHandlerFoo); // removes handler

      sub.fire('foo');
      Assertions.assertEquals(2, stubHandlerFoo.callCount);
   }

});

