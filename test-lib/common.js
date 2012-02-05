
function SomeNamedEvent() {}
SomeNamedEvent.toString = function() {
   return 'someNamedEvent';
};

function AnotherEvent() {}
AnotherEvent.toString = function() {
   return 'anotherEvent';
};


function thisSpy(spy) {
   var assertion = {};

   assertion.wasCalledInScope = function(scope) {
      return spy.thisValues[0] === scope;
   };

   assertion.wasCalledWithArguments = function() {
      var expectedArgs = Array.prototype.slice.call(arguments, 0)
         ,actualArgs = spy.args[0];

      return JSON.stringify(spy.args[0]) == JSON.stringify(expectedArgs);
   };

   assertion.wasCalledBefore = function(laterSpy) {
      return spy.calledBefore(laterSpy);
   };

   assertion.wasNotCalled = function() {
      return spy.callCount === 0;
   };

   assertion.wasCalled = function() {
      return {
         once: function() {
            return spy.callCount === 1;
         }
      };
   };

   return assertion;
}
