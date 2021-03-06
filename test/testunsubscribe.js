var Assertions = require('unit-test').Assertions,
    Sinon = require('unit-test').Sinon,
    TestCase = require('unit-test').TestCase;

module.exports = new TestCase("RemoveHandlers", {

   "test able to unsubscribe a bad handlerId":function () {
      var sub = new Subscribable(),
         handler = Sinon.spy( function() {} ),
         handlerId = sub.on(SomeNamedEvent, handler);

      sub.fire(new SomeNamedEvent());
      Assertions.assertEquals(1, handler.callCount);

      sub.un(handlerId +1);

      sub.fire(new SomeNamedEvent());
      Assertions.assertEquals(2, handler.callCount);
   },

   "test able to unsubscribe by event name":function () {
      var sub = new Subscribable(),
         handler1 = Sinon.spy( function() {} ),
         handler2 = Sinon.spy( function() {} ),
         handler3 = Sinon.spy( function() {} );

      sub.on(SomeNamedEvent, handler1);
      sub.on(AnotherEvent,   handler2);
      sub.on(SomeNamedEvent, handler3);

      sub.fire(new SomeNamedEvent());
      Assertions.assertEquals(1, handler1.callCount);
      Assertions.assertEquals(0, handler2.callCount);
      Assertions.assertEquals(1, handler3.callCount);

      sub.un('SomeNamedEvent');

      sub.fire(new SomeNamedEvent());
      Assertions.assertEquals(1, handler1.callCount);
      Assertions.assertEquals(0, handler2.callCount);
      Assertions.assertEquals(1, handler3.callCount);

      sub.fire(new AnotherEvent());
      Assertions.assertEquals(1, handler1.callCount);
      Assertions.assertEquals(1, handler2.callCount);
      Assertions.assertEquals(1, handler3.callCount);
   },

   "test able to unsubscribe by event object":function () {
      var sub = new Subscribable(),
         handler1 = Sinon.spy( function() {} ),
         handler2 = Sinon.spy( function() {} ),
         handler3 = Sinon.spy( function() {} );

      sub.on(SomeNamedEvent, handler1);
      sub.on(AnotherEvent,   handler2);
      sub.on(SomeNamedEvent, handler3);

      sub.fire(new SomeNamedEvent());
      Assertions.assertEquals(1, handler1.callCount);
      Assertions.assertEquals(0, handler2.callCount);
      Assertions.assertEquals(1, handler3.callCount);

      sub.un(SomeNamedEvent);

      sub.fire(new SomeNamedEvent());
      Assertions.assertEquals(1, handler1.callCount);
      Assertions.assertEquals(0, handler2.callCount);
      Assertions.assertEquals(1, handler3.callCount);

      sub.fire(new AnotherEvent());
      Assertions.assertEquals(1, handler1.callCount);
      Assertions.assertEquals(1, handler2.callCount);
      Assertions.assertEquals(1, handler3.callCount);
   },

   "test able to unsubscribe by handler scope":function () {
      var sub = new Subscribable(),
         handler1 = Sinon.spy( function() {} ),
         handler2 = Sinon.spy( function() {} ),
         scopeA = {a:123},
         scopeB = {b:456};

      sub.on(SomeNamedEvent, handler1, scopeA);
      sub.on(SomeNamedEvent, handler2, scopeB);

      sub.fire(new SomeNamedEvent());
      Assertions.assertEquals(1, handler1.callCount);
      Assertions.assertEquals(scopeA, handler1.thisValues[0]);
      Assertions.assertEquals(1, handler2.callCount);
      Assertions.assertEquals(scopeB, handler2.thisValues[0]);

      sub.un(scopeA);

      sub.fire(new SomeNamedEvent());
      Assertions.assertEquals(1, handler1.callCount);
      Assertions.assertEquals(2, handler2.callCount);
      Assertions.assertEquals(scopeB, handler2.thisValues[1]);
   },

   "test able to remove all handlers in one step by supplying no arguments": function() {
      var sub = new Subscribable();
      sub.on('foo', function() {});
      sub.on('bar', function() {});
      sub.on('foo', function() {});
      sub.on('bar', function() {});

      Assertions.assertEquals(true, sub.hasListener('foo'));
      Assertions.assertEquals(true, sub.hasListener('bar'));

      sub.un();

      Assertions.assertEquals(false, sub.hasListener('foo'));
      Assertions.assertEquals(false, sub.hasListener('bar'));
   },

   'test unsubscribe by context': function() {

      var sub = new Subscribable();

      var Subscriber = function() {
         this.callback = Sinon.stub();
         sub.on("event", this.callback, this)
      };

      var subscriber1 = new Subscriber();
      var subscriber2 = new Subscriber();

      sub.fire("event");

      Assertions.assertEquals(1, subscriber1.callback.callCount, "Subscriber 1's callback should have been triggered");
      Assertions.assertEquals(1, subscriber2.callback.callCount, "Subscriber 2's callback should have been triggered");

      sub.un(null, subscriber1);

      // fails:
      Assertions.assert(sub.hasListener("event"), "Subscriber 2 should still be listening");

      sub.fire("event");

      Assertions.assertEquals(1, subscriber1.callback.callCount, "Subscriber 1's callback should not have been triggered again");

      // fails:
      Assertions.assertEquals(2, subscriber2.callback.callCount, "Subscriber 2's callback should have been triggered once more");
   },

   'test automatically removes single use handlers': function() {
      var spies = [];

      var sub = new Subscribable()
                      .on('foo', spies[spies.length] = Sinon.spy())
                      .once('foo', spies[spies.length] = Sinon.spy())
                      .on('foo', spies[spies.length] = Sinon.spy(), null, true)
                      .on('foo', spies[spies.length] = Sinon.spy(), null, false);

      sub.fire('foo', 'bar');
      Assertions.assertEquals(4, spies.filter(function(spy) { return spy.callCount === 1; }).length);

      sub.fire('foo', 'bar');
      Assertions.assertEquals(2, spies[0].callCount);
      Assertions.assertEquals(1, spies[1].callCount);
      Assertions.assertEquals(1, spies[2].callCount);
      Assertions.assertEquals(2, spies[3].callCount);
   }

});
