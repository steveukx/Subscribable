/**
 * @exports Subscribable
 */
(function (root, subscribableFactory) {
   if(typeof module !== "undefined" && module.exports) { // Node.js
      module.exports = subscribableFactory();
   }
   else  if (typeof exports === "object" && exports) { // CommonJS
      exports.Subscribable = subscribableFactory();
   }
   else  if (typeof define === "function" && define.amd) { // AMD
      define(subscribableFactory);
   }
   else { // <script>
      root.Subscribable = subscribableFactory();
   }
}(this, function () {

   "use strict";

   /**
    * The Subscribable class is the underlying component in a pub/sub application providing the ability
    * to "fire" events and bind handlers using "on" and remove them again with "un"
    *
    * @constructor
    * @name Subscribable
    */
   function Subscribable() {
      Subscribable.prepareInstance(this);
   }

   /**
    * The events object stores the names of the events that have listeners and the numeric IDs of the handlers
    * that are listening to the events.
    * @type {Object[]}
    */
   Subscribable.prototype.__events = null;

   /**
    * Checks for whether there are any listeners for the supplied event type, where the event type can either be the
    * string name of an event or an event constructor.
    *
    * When the eventType parameter is omitted, the method will check for a handler against any event type.
    *
    * @param {String|Function} [eventType]
    */
   Subscribable.hasListener = function(eventType) {
      var eventName;

      if(arguments.length) {
         eventName = String(eventType).toLowerCase();
         return this.__events.hasOwnProperty(eventName) && this.__events[eventName].length > 0;
      }
      else {
         for(eventName in this.__events) {
            if(this.hasListener(eventName)) {
               return true;
            }
         }
      }

      return false;
   };

   /**
    * Fires an event where the event can be either the string name of an event or an instance of an event class. When
    * an event instance is used, it should `toString` to the same thing that constructor does so the events match up.
    *
    * @param {String|Object} event
    */
   Subscribable.fire = function(event) {
      var typeOfEvent = typeof event;
      var eventName = String(event && typeOfEvent === 'object' ? event.constructor : event).toLowerCase();
      var handlers = (this.__events[eventName] || []).slice(0);
      var eventData = handlers.length ? (typeOfEvent === 'string' ? [].slice.call(arguments, 1) : event) : null;

      for(var i = 0, l = handlers.length; i < l; i++) {
         var exit = (handlers[i][0].apply(handlers[i][1] || this, eventData) === false);
         if(handlers[i][2]) {
            this.un(eventName, handlers[i][0], handlers[i][1]);
         }
         if(exit) {
            break;
         }
      }

      return this;
   };

   /**
    * Attach a handler to the named event.
    *
    * @param {String|Function} event The string name of an event or the constructor of an event class, when a constructor
    *                                  it should override the `toString` to return the same string an instance returns
    * @param {Function} handler
    * @param {Object} [scope] Optional context scope for the handler to be run in
    * @param {Boolean} [once=false] limit the handler to only be run on the next time the event fires
    */
   Subscribable.on = function(event, handler, scope, once) {
      return event = String(event).toLowerCase(),
            (this.__events[event] = this.__events[event] || []).push([handler, scope, !!once]),
            this;
   };

   /**
    * Attach a handler to the named event to run at most once.
    *
    * @param {String|Function} event The string name of an event or the constructor of an event class, when a constructor
    *                                  it should override the `toString` to return the same string an instance returns
    * @param {Function} handler
    * @param {Object} [scope] Optional context scope for the handler to be run in
    */
   Subscribable.once = function(event, handler, scope) {
      return this.on(event, handler, scope, true);
   };

   /**
    * Removes one or more handlers. Arguments can be supplied as:
    *
    * `event`
    * `handler`
    * `scope`
    * `handler`, `scope`
    * `event`, `handler`
    * `event`, `scope`
    * `event`, `handler`, `scope`
    *
    * In all cases, the `event` is either the String name of the event, or a Function which when converted to a string
    * (through standard `.toString`) returns a name that has been used as an event. The `handler` is a function and the
    * `scope` is an object.
    *
    * All parameters are optional and when not supplied they are assumed to be matches for everything, so calling with
    * no arguments removes all handlers.
    *
    * @param [event]
    * @param [handler]
    * @param [scope]
    */
   Subscribable.un = function(event, handler, scope) {
      var typeOfEvent = typeof event;

      // check for handling .un(SomeEventConstructor) or .un(SomeEventConstructor, this)
      if(event !== null && typeOfEvent === 'object' && this.hasListener(event.constructor)) {
         return this.un(event.constructor.toString(), handler);
      }

      else if(typeOfEvent === 'function' && this.hasListener(event)) {
         return this.un(event.toString(), handler);
      }

      // check for handling either .un(someHandler, this), .un(someHandler) or .un(this)
      else if(event && typeOfEvent !== "string") {
         return this.un(null, event, handler);
      }

      // event is either not there or is a string so make it lower case
      else {
         event = event && String(event).toLowerCase();
      }

      // un-validated removal of events, remove all of them.
      if(!event && !handler) {
         for(event in this.__events) {
            if(this.__events.hasOwnProperty(event)) {
               delete this.__events[event];
            }
         }
      }

      // single named event removal .un('some.event') or .un(SomeEventConstructor)
      else if(!handler) {
         delete this.__events[event];
      }

      // single selection named event removal .un('some.event', myHandler) or .un('some.event', this)
      else if(!event) {
         for(event in this.__events) {
            if(this.__events.hasOwnProperty(event)) {
               this.un(event, handler);
            }
         }
      }

      // got an event and at least one other type of search - could be a function or a scope
      else {
         var searchIndex  = +(typeof handler !== "function");
         var includeScope = !searchIndex && !!scope;
         var handlers     = this.__events[event];

         for(var i = handlers && handlers.length - 1; i >= 0; i--) {
            if(handlers[i][searchIndex] === handler && (!includeScope || handlers[i][1] === scope)) {
               handlers.splice(i, 1);
            }
         }
      }

      return this;
   };

   /**
    * Flyweight on, prepares the instance for being a Subscribable then attaches the handler
    */
   Subscribable.prototype.on = function() {
      return Subscribable.prepareInstance(this).on.apply(this, arguments);
   };

   /**
    * Flyweight once, prepares the instance for being a Subscribable then attaches the handler
    */
   Subscribable.prototype.once = function() {
      return Subscribable.prepareInstance(this).once.apply(this, arguments);
   };

   /**
    * Flyweight un, does nothing
    */
   Subscribable.prototype.un = function() {
      return this;
   };

   /**
    * Flyweight fire, does nothing
    */
   Subscribable.prototype.fire = function() {
      return this;
   };

   /**
    * Flyweight hasListener, always returns false
    */
   Subscribable.prototype.hasListener = function() {
      return false;
   };

   /**
    * Converts any object instance into a Subscribable by applying the interface from Subscribable onto it. Note
    * that if the object already has a function from the Subscribable interface (eg: on, off, fire) these functions
    * will be replaced.
    *
    * @param {Object} subscribable
    * @return {*} The supplied subscribable for chaining
    */
   Subscribable.prepareInstance = function(subscribable) {
      subscribable.__events = {};
      subscribable.on = Subscribable.on;
      subscribable.once = Subscribable.once;
      subscribable.un = Subscribable.un;
      subscribable.fire = Subscribable.fire;
      subscribable.hasListener = Subscribable.hasListener;
      return subscribable;
   };

   return Subscribable;

}));
