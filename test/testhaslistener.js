TestCase("HasListener", {

   "test can check for existence of listeners by string name":function () {
      var sub = new Subscribable();

      sub.on('namedEvent', function() {});
      assertEquals(true, sub.hasListener('NamedEvent'));
   },

   "test can check for existence of listeners by event constructor":function () {
      var sub = new Subscribable();

      sub.on('someNamedEvent', function() {});
      assertEquals(true, sub.hasListener(SomeNamedEvent));
   },

   "test can check for existence of listeners attached by event constructor":function () {
      var sub = new Subscribable();

      sub.on(SomeNamedEvent, function() {});
      assertEquals(true, sub.hasListener(SomeNamedEvent));
   },

   "test can check for existence of listeners on the subscribable without the event type":function () {
      var sub = new Subscribable();

      sub.on(SomeNamedEvent, function() {});
      assertEquals(true, sub.hasListener());

      sub.un();
      assertEquals(false, sub.hasListener());

      sub.on(AnotherEvent, function() {});
      assertEquals(true, sub.hasListener());
   },

   "test falsey event names are treated as real events": function () {
      var sub = new Subscribable();

      var handlerA = sub.on(false, function() {}),
          handlerB = sub.on(null, function() {});

      assertEquals(true, sub.hasListener());
      assertEquals(true, sub.hasListener(false));

      sub.un(handlerA);

      assertEquals(true, sub.hasListener());
      assertEquals(false, sub.hasListener(false));
   }

});