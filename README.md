# Purpose

The Subscribable microframework is a library that provides the basis of a pub-sub event framework for JavaScript running
either in the browser or a NodeJS Server.

Integrating with Subscribable
=============================

To use in [Node.js](http://nodejs.org), easiest installation is through [NPM](http://npmjs.org):

    npm install subscribable

To use in the browser, download the latest released version from https://github.com/steveukx/Subscribable/tree/master/dist
which can be loaded either as the `src` of a `script` tag, or as a module using [requirejs](http://requirejs.org).

# Usage

Install using `npm install subscribable`

Objects are made subscribable either by inheriting from the Subscribable prototype or by explicitly calling
`Subscribable.prepareInstance` for the object to attach the standard pub-sub methods to the object instance.

Inheritance:

    function SomePubSubClass() {
    }
    SomePubSubClass.prototype = Object.create(Subscribable.prototype);

    SomePubSubClass.prototype.sendMessage = function(msg) {
       this.fire('data', msg);
    };

    somePubSubClass = new SomePubSubClass();
    somePubSubClass.on('data', function(data) {
       alert(data);
    });

    somePubSubClass.sendMessage('to be alerted');

When a class inherits from Subscribable, it is not necessary to call the Subscribable constructor against the child
class. Inheriting from Subscribable is the most efficient use case, as the prepareInstance method will only run when the
first subscriber is attached to the Subscribable instance - particularly useful if some base or abstract is made to
inherit from Subscribable but not all implementations will have events bound to it.

If it is not convenient to use inheritance, any object can be made a Subscribable by using it as a mix-in:

    function SomePubSubClass() {
       Subscribable.prepareInstance(this);
    }
    SomePubSubClass.prototype.sendMessage = function(msg) {
       this.fire('data', msg);
    };

    somePubSubClass = new SomePubSubClass();
    somePubSubClass.on('data', function(data) {
       alert(data);
    });

    somePubSubClass.sendMessage('to be alerted');

here the instance of SomePubSubClass is made into a Subscribable by explicitly preparing the instance in its constructor.
The mix-in style is useful for when there is already a complex prototype chain and the superclass cannot be made to
inherit from Subscribable, or if the object being made Subscribable isn't a class instance, but the class itself:

    function SomeGroupedClass() {
    }
    Subscribable.prepareInstance(SomeGroupedClass);

    SomeGroupedClass.prototype.sendMessage = function(msg) {
       SomeGroupedClass.fire('data', this, msg);
    };

    SomeGroupedClass.on('data', function(someGroupedClass, data) {
       alert(data);
    });

    new SomeGroupedClass().sendMessage('to be alerted');

# Firing an event

Events are fired using the `.fire()` method and can either be fired as a string event name with any number of additional
arguments that will all be passed on to the handlers, or it can be fired with an event instance:

    // some method that fires a string event
    SomeClass.prototype.someBehaviour = function() {
      this.fire('myEvent', 123, 456);
    }

    // handlers would have two arguments whose values are 123 and 456
    someClass.on('myEvent', function(a, b) {});

The string event name can add event behaviours to any class very quickly - little to no preparation is required, and all
events are case insensitive. Documenting the order of arguments and maintainability can be problematic across large
projects though, so it can be better to use a custom event instance:

    function SomeEvent(propertyA, propertyB) {
      this.a = propertyA; this.b = propertyB;
    }

    // it is a requirement that the event object overrides the toString method to return the name of the event
    SomeEvent.toString = function() {
      return 'myEvent';
    };

    // some method that fires an instance of the SomeEvent class
    SomeClass.prototype.someBehaviour = function() {
      this.fire(new SomeEvent(123, 456));
    };

    // handlers would receive the event instance
    someClass.on(SomeEvent, function(someEvent) {})

Event objects fired in this way are not immutable between handlers, so changes made to the event object directly will
be seen by any handler that executes later.

# Attaching a handler

`subscribable.on( eventNameOrConstructor, handlerFunction, handlerScope )`

Each handler is added using a separate call to the `.on()` method, supplying either the name of the event being
subscribed to or the constructor of an event object. The handlerScope is optional and when omitted the handlerFunction
will be executed in the scope of window.

While it is possible to use the `Function.prototype.bind` method from ECMA5 to set the scope of the handlerFunction
explicitly, supplying the scope in the `.on()` method allows the removal of handlers based on the scope of the handler -
particularly useful if removing all handlers created by a class that is being destroyed.
