TestCase("Single Subscriptions", {

   "test attaching a single subscription returns a handler id":function () {
      var sub = new Subscribable();
      var subscriptionResult = sub.on('foo', function() {});

      assertEquals('number', typeof subscriptionResult);
   },

   "test able to unsubscribe from a single handler by id": function() {
      var stubHandler = sinon.spy(function() {});
      var sub = new Subscribable();
      var subscriptionResult = sub.on('foo', stubHandler);

      assertEquals(0, stubHandler.callCount);
      sub.fire('foo');
      assertEquals(1, stubHandler.callCount);
      sub.un(subscriptionResult);
      sub.fire('foo');
      assertEquals(1, stubHandler.callCount);
   },

   "test able to unsubscribe from a single handler by id leaves others intact": function() {
      var sub = new Subscribable();

      var stubHandlerFoo = sinon.spy(function() {}),
         stubHandlerBar = sinon.spy(function() {});

      var subResultFoo = sub.on('foo', stubHandlerFoo),
         subResultBar = sub.on('bar', stubHandlerBar);

      assertEquals(0, stubHandlerFoo.callCount);
      assertEquals(0, stubHandlerBar.callCount);

      sub.fire('foo');
      assertEquals(1, stubHandlerFoo.callCount);
      assertEquals(0, stubHandlerBar.callCount);

      sub.fire('bar');
      assertEquals(1, stubHandlerFoo.callCount);
      assertEquals(1, stubHandlerBar.callCount);

      sub.un(subResultFoo);

      sub.fire('foo');
      assertEquals(1, stubHandlerFoo.callCount);
      assertEquals(1, stubHandlerBar.callCount);

      sub.fire('bar');
      assertEquals(1, stubHandlerFoo.callCount);
      assertEquals(2, stubHandlerBar.callCount);

      sub.un(subResultBar);

      sub.fire('foo');
      assertEquals(1, stubHandlerFoo.callCount);
      assertEquals(2, stubHandlerBar.callCount);

      sub.fire('bar');
      assertEquals(1, stubHandlerFoo.callCount);
      assertEquals(2, stubHandlerBar.callCount);
   },

   "test attempting to unsubscribe with a bad handler id does not cause errors": function() {
      var sub = new Subscribable();
      var stubHandlerFoo = sinon.spy(function() {});
      var subResultFoo = sub.on('foo', stubHandlerFoo);

      sub.fire('foo');
      assertEquals(1, stubHandlerFoo.callCount);

      sub.un(1000);

      sub.fire('foo');
      assertEquals(2, stubHandlerFoo.callCount);

      sub.un(subResultFoo);

      sub.fire('foo');
      assertEquals(2, stubHandlerFoo.callCount);
   }

});

