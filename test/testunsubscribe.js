TestCase("RemoveHandlers", {

   "test able to unsubscribe a single handler":function () {
      var sub = new Subscribable(),
         handler = sinon.spy( function() {} ),
         handlerId = sub.on(SomeNamedEvent, handler);

      sub.fire(new SomeNamedEvent());
      assertEquals(1, handler.callCount);

      sub.un(handlerId);

      sub.fire(new SomeNamedEvent());
      assertEquals(1, handler.callCount);
   },

   "test able to unsubscribe a bad handlerId":function () {
      var sub = new Subscribable(),
         handler = sinon.spy( function() {} ),
         handlerId = sub.on(SomeNamedEvent, handler);

      sub.fire(new SomeNamedEvent());
      assertEquals(1, handler.callCount);

      sub.un(handlerId +1);

      sub.fire(new SomeNamedEvent());
      assertEquals(2, handler.callCount);
   },

   "test able to unsubscribe by event id leaves others intact":function () {
      var sub = new Subscribable(),
         handler1 = sinon.spy( function() {} ),
         handler2 = sinon.spy( function() {} ),
         handler3 = sinon.spy( function() {} );

      sub.on(SomeNamedEvent, handler1);
      sub.on(SomeNamedEvent, handler2);
      sub.on(SomeNamedEvent, handler3);

      sub.fire(new SomeNamedEvent());
      assertEquals(1, handler1.callCount);
      assertEquals(1, handler2.callCount);
      assertEquals(1, handler3.callCount);

      sub.un(1);

      sub.fire(new SomeNamedEvent());
      assertEquals(2, handler1.callCount);
      assertEquals(1, handler2.callCount);
      assertEquals(2, handler3.callCount);
   },

   "test able to unsubscribe by event name":function () {
      var sub = new Subscribable(),
         handler1 = sinon.spy( function() {} ),
         handler2 = sinon.spy( function() {} ),
         handler3 = sinon.spy( function() {} );

      sub.on(SomeNamedEvent, handler1);
      sub.on(AnotherEvent,   handler2);
      sub.on(SomeNamedEvent, handler3);

      sub.fire(new SomeNamedEvent());
      assertEquals(1, handler1.callCount);
      assertEquals(0, handler2.callCount);
      assertEquals(1, handler3.callCount);

      sub.un('SomeNamedEvent');

      sub.fire(new SomeNamedEvent());
      assertEquals(1, handler1.callCount);
      assertEquals(0, handler2.callCount);
      assertEquals(1, handler3.callCount);

      sub.fire(new AnotherEvent());
      assertEquals(1, handler1.callCount);
      assertEquals(1, handler2.callCount);
      assertEquals(1, handler3.callCount);
   },

   "test able to unsubscribe by event object":function () {
      var sub = new Subscribable(),
         handler1 = sinon.spy( function() {} ),
         handler2 = sinon.spy( function() {} ),
         handler3 = sinon.spy( function() {} );

      sub.on(SomeNamedEvent, handler1);
      sub.on(AnotherEvent,   handler2);
      sub.on(SomeNamedEvent, handler3);

      sub.fire(new SomeNamedEvent());
      assertEquals(1, handler1.callCount);
      assertEquals(0, handler2.callCount);
      assertEquals(1, handler3.callCount);

      sub.un(SomeNamedEvent);

      sub.fire(new SomeNamedEvent());
      assertEquals(1, handler1.callCount);
      assertEquals(0, handler2.callCount);
      assertEquals(1, handler3.callCount);

      sub.fire(new AnotherEvent());
      assertEquals(1, handler1.callCount);
      assertEquals(1, handler2.callCount);
      assertEquals(1, handler3.callCount);
   },

   "test able to unsubscribe by handler scope":function () {
      var sub = new Subscribable(),
         handler1 = sinon.spy( function() {} ),
         handler2 = sinon.spy( function() {} ),
         scopeA = {a:123},
         scopeB = {b:456};

      sub.on(SomeNamedEvent, handler1, scopeA);
      sub.on(SomeNamedEvent, handler2, scopeB);

      sub.fire(new SomeNamedEvent());
      assertEquals(1, handler1.callCount);
      assertEquals(scopeA, handler1.thisValues[0]);
      assertEquals(1, handler2.callCount);
      assertEquals(scopeB, handler2.thisValues[0]);

      sub.un(scopeA);

      sub.fire(new SomeNamedEvent());
      assertEquals(1, handler1.callCount);
      assertEquals(2, handler2.callCount);
      assertEquals(scopeB, handler2.thisValues[1]);
   },

   "test able to remove all handlers in one step by supplying no arguments": function() {
      var sub = new Subscribable();
      sub.on('foo', function() {});
      sub.on('bar', function() {});
      sub.on('foo', function() {});
      sub.on('bar', function() {});

      assertEquals(true, sub.hasListener('foo'));
      assertEquals(true, sub.hasListener('bar'));

      sub.un();

      assertEquals(false, sub.hasListener('foo'));
      assertEquals(false, sub.hasListener('bar'));
   }

});