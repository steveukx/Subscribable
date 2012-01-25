TestCase("HasListener", {

   "test can check for existence of listeners by string name":function () {
      var sub = new Subscribable();

      sub.on('namedEvent', function() {});
      assertEquals(true, sub.hasListener('NamedEvent'));
   },

   "test can check for existence of listeners by event constructor":function () {
      function SomeEvent() {}
      SomeEvent.toString = function() {
         return 'namedEvent';
      };

      var sub = new Subscribable();

      sub.on('namedEvent', function() {});
      assertEquals(true, sub.hasListener(SomeEvent));
   }

});