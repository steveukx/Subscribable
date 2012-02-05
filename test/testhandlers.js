TestCase("TestHandlers", {

   "test handlers attached to string event names receive all arguments fired":function () {
      var spyHandler = sinon.spy(function() {}),
          spyScope = {},
          sub = new Subscribable();

      sub.on('stringEventName', spyHandler, spyScope);

      sub.fire('stringEventName', 'blah', 'plop', 'woo');

      assertEquals(1, spyHandler.callCount);
      assert(thisSpy(spyHandler).wasCalledInScope(spyScope));
      assert(thisSpy(spyHandler).wasCalledWithArguments('blah', 'plop', 'woo'));

      assertEquals(true, true);
   },


   "test handlers are executed in order of attaching": function() {
      var spyHandlerA = sinon.spy(),
          spyHandlerB = sinon.spy(),
          sub = new Subscribable();

      sub.on('foo', spyHandlerA);
      sub.on('foo', spyHandlerB);

      sub.fire('foo', 'blah', 'plop', 'woo');

      assert(thisSpy(spyHandlerA).wasCalledWithArguments('blah', 'plop', 'woo'));
      assert(thisSpy(spyHandlerB).wasCalledWithArguments('blah', 'plop', 'woo'));
      assert(thisSpy(spyHandlerA).wasCalledBefore(spyHandlerB));
   },


   "test handlers can return false to prevent events from 'bubbling'": function() {
      var spyHandlerA = sinon.spy(),
          spyHandlerB = sinon.stub().returns(false),
          spyHandlerC = sinon.spy(),
          sub = new Subscribable();

      sub.on('foo', spyHandlerA);
      sub.on('foo', spyHandlerB);
      sub.on('foo', spyHandlerC);

      sub.fire('foo', 'blah', 'plop', 'woo');
      assert(thisSpy(spyHandlerC).wasNotCalled());
   },


   "test handlers can return false-y values without preventing events from 'bubbling'": function() {
      var spyHandlerA = sinon.stub().returns(0),
          spyHandlerB = sinon.stub().returns(null),
          spyHandlerC = sinon.spy(),
          sub = new Subscribable();

      sub.on('foo', spyHandlerA);
      sub.on('foo', spyHandlerB);
      sub.on('foo', spyHandlerC);

      sub.fire('foo', 'blah', 'plop', 'woo');
      assert(thisSpy(spyHandlerC).wasCalled().once());
   }

});