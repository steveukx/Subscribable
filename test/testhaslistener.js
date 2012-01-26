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
   }

});