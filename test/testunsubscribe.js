var Assertions = require('unit-test').Assertions,
    Sinon = require('unit-test').Sinon,
    TestCase = require('unit-test').TestCase;

module.exports = new TestCase("RemoveHandlers", {

   "test trailing handlers consolidated on unsubscribe": function() {
      var sub = new Subscribable();
      Assertions.assertEquals(0, sub.on('foo', Sinon.spy()));
      Assertions.assertEquals(1, sub.on('foo', Sinon.spy()));

      sub.un(0);
      Assertions.assertEquals(2, sub.on('foo', Sinon.spy()));

      sub.un(0); // look, no error thrown
      sub.un(1); // is a handler, no consolidation
      sub.un(2); // is a handler, leaves trailing events to remove
      Assertions.assertEquals(0, sub.on('foo', Sinon.spy()));
   },

   "test handlers consolidated when removing single handler if no events remain": function() {
      var sub = new Subscribable();
      Assertions.assertEquals(0, sub.on('foo', Sinon.spy()));

      sub.un(0);
      Assertions.assertEquals(0, sub.on('foo', Sinon.spy()));
   },

   "test handlers not consolidated when removing single handler if other events remain": function() {
      var sub = new Subscribable();
      Assertions.assertEquals(0, sub.on('foo', Sinon.spy()));
      Assertions.assertEquals(1, sub.on('foo', Sinon.spy()));

      sub.un(0);
      Assertions.assertEquals(2, sub.on('foo', Sinon.spy()));
   },

   "test able to unsubscribe a single handler":function () {
      var sub = new Subscribable(),
         handler = Sinon.spy( function() {} ),
         handlerId = sub.on(SomeNamedEvent, handler);

      sub.fire(new SomeNamedEvent());
      Assertions.assertEquals(1, handler.callCount);

      sub.un(handlerId);

      sub.fire(new SomeNamedEvent());
      Assertions.assertEquals(1, handler.callCount);
   },

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

   "test able to unsubscribe by event id leaves others intact":function () {
      var sub = new Subscribable(),
         handler1 = Sinon.spy( function() {} ),
         handler2 = Sinon.spy( function() {} ),
         handler3 = Sinon.spy( function() {} );

      sub.on(SomeNamedEvent, handler1);
      sub.on(SomeNamedEvent, handler2);
      sub.on(SomeNamedEvent, handler3);

      sub.fire(new SomeNamedEvent());
      Assertions.assertEquals(1, handler1.callCount);
      Assertions.assertEquals(1, handler2.callCount);
      Assertions.assertEquals(1, handler3.callCount);

      sub.un(1);

      sub.fire(new SomeNamedEvent());
      Assertions.assertEquals(2, handler1.callCount);
      Assertions.assertEquals(1, handler2.callCount);
      Assertions.assertEquals(2, handler3.callCount);
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
   }

});
