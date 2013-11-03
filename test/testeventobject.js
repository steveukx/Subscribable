var Assertions = require('unit-test').Assertions,
    Sinon = require('unit-test').Sinon,
    TestCase = require('unit-test').TestCase;

module.exports = new TestCase("eventObjects", {

   "test can use instances":function () {
      function Foo(a) {this.a = a;}

      var sub = new Subscribable();
      var stubHandler = Sinon.spy();

      sub.on(Foo, stubHandler);
      sub.fire(new Foo("blah"));

      Assertions.assert(stubHandler.calledOnce, "Called the handler");
      Assertions.assert(stubHandler.calledWith({a: "blah"}), "Called with the instance object");
   }

});
