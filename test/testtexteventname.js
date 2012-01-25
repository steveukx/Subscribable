TestCase("stringEventNames", {

   "test can use strings to fire events":function () {
      var sub = new Subscribable();
      var stubHandler = sinon.spy(function() {});

      sub.on('namedEvent', stubHandler);
      sub.fire('NamedEvent');
      assertEquals(1, stubHandler.callCount);
   },

   "test can use any case of string":function () {
      var sub = new Subscribable();
      var stubHandler = sinon.spy(function() {});

      sub.on('namedEvent', stubHandler);
      sub.fire('NAMEDEvent');
      assertEquals(1, stubHandler.callCount);
   },

   "test can use an object that has a constructor level toString that returns an event name":function () {
      function SomeEvent() {}
      SomeEvent.toString = function() {
         return 'namedEvent';
      };

      var sub = new Subscribable();
      var stubHandler = sinon.spy(function() {});

      sub.on('NamedEvent', stubHandler);
      sub.fire( SomeEvent );
      assertEquals(1, stubHandler.callCount);
   }

});