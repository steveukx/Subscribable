/**
 * @class
 */
var Subscribable = (function () {

   "use strict";

   /**
    * The Subscribable class is the underlying component in a pub/sub application providing the ability
    * to "fire" events and bind handlers using "on" and remove them again with "un"
    *
    * @constructor
    * @name Subscribable
    */
   function Subscribable() {
   }

   /**
    *
    * @param {Object} subscribable
    */
   Subscribable.prepareInstance = function(subscribable) {
      subscribable.__events = {};
      subscribable.__handlers = [];
      subscribable.on = Subscribable.on;
      subscribable.un = Subscribable.un;
      subscribable.fire = Subscribable.fire;
      subscribable.hasListener = Subscribable.hasListener;
   };

   /**
    * The events object stores the names of the events that have listeners and the numeric IDs of the handlers
    * that are listening to the events.
    * @type {Object[]}
    */
   Subscribable.prototype.__events = null;

   /**
    * The handlers object is an array of handlers that will respond to the events being fired.
    * @type {Object[]}
    */
   Subscribable.prototype.__handlers = null;

   /**
    *
    */
   Subscribable.prototype.on = function() {
      Subscribable.prepareInstance(this);
      return this.on.apply(this, arguments);
   };

   /**
    *
    */
   Subscribable.prototype.un = function() {
      return this;
   };

   /**
    *
    */
   Subscribable.prototype.fire = function() {
      return true;
   };

   /**
    * Checks for whether there are any listeners for the supplied event type, where the event type can either be the
    * string name of an event or an event constructor.
    *
    * When the eventType parameter is omitted, the method will check for a handler against any event type.
    *
    * @param {String|Function} [eventType]
    */
   Subscribable.prototype.hasListener = function(eventType) {
      return false;
   };

   /**
    * Fires the named event with any arguments used as the call to fire.
    *
    * @param {String} eventName
    */
   Subscribable.fire = function(eventName) {
      var i, l,
         returnValue,
         args,
         handler,
         handlerIds;

      if(typeof eventName == 'object') {
         args = [eventName];
         eventName = eventName.constructor.toString();
      }

      handlerIds = Subscribable._getHandlersList(this, eventName, false);

      if(handlerIds && handlerIds.length) {
         args = args || Array.prototype.slice.call(arguments, 1);
         for(returnValue, i = 0, l = handlerIds.length; i < l && returnValue !== false; i++) {
            if(handler = this.__handlers[handlerIds[i]]) {
               returnValue = handler[0].apply(handler[1], args);
            }
         }
         return returnValue !== false;
      }

      return true;
   };

   /**
    * Gets the list of handler IDs for the supplied event name in the Subscribable instance. When
    * the create parameter is set to true and the event has not yet been set up in the Subscribable
    * it will be created.
    *
    * @param {Subscribable} instance
    * @param {String} eventName
    * @param {Boolean} create
    * @return {Number[]}
    */
   Subscribable._getHandlersList = function(instance, eventName, create) {
      eventName = ('' + eventName).toLowerCase();
      if(!instance.__events[eventName] && create) {
         instance.__events[eventName] = [];
      }
      return instance.__events[eventName];
   };

   /**
    * Attaches the supplied handler/scope as a listener in the supplied event list.
    *
    * @param {Function} handler
    * @param {Object} scope
    * @param {Number[]} eventList
    */
   Subscribable._saveHandler = function(instance, handler, scope, eventList) {
      var handlerId = instance.__handlers.length;
      instance.__handlers.push( [handler, scope, handlerId] );
      eventList.push(handlerId);

      return handlerId;
   };

   /**
    * Attaches the supplied handler and scope as a listener for the supplied event name. The return value is
    * the numerical ID of the handler that has been added to allow for removal of a single event handler in the
    * "un" method.
    *
    * @param {String} eventName
    * @param {Function} handler
    * @param {Object} scope
    * @return {Number}
    */
   Subscribable.on = function(eventName, handler, scope) {
      return Subscribable._saveHandler(this, handler, scope, Subscribable._getHandlersList(this, eventName, true));
   };

   /**
    * Remove handlers for the specified selector - the selector type can either be a number (which is the ID of a single
    * handler and is the result of using the .on method), a string event name (which is the same string used as the event
    * name in the .on method), the Function constructor of an event object (that has a .toString method to return the
    * name of the associated event) or an object that is the scope of a handler (in which case, any handler for any
    * event that uses that object as the scope will be removed).
    *
    * @param {Object|String|Number|Function} un
    * @param {Object} [scopeCheck]
    */
   Subscribable.un = function(un, scopeCheck) {
      var typeofRemoval = typeof un;
      switch(typeofRemoval) {
         case 'number':
            Subscribable.removeSingleEvent(this, un, scopeCheck);
            break;

         case 'string':
         case 'function':
            un = ('' + un).toLowerCase();
            Subscribable.removeMultipleEvents(this,
               Subscribable._getHandlersList(this, un, false), scopeCheck);
            if(scopeCheck) {
               Subscribable.consolidateEvents(this, un);
            }
            break;

         default:
            if(un) {
               Subscribable.removeMultipleHandlers(this, this.__handlers, un || null);
               Subscribable.consolidateEvents(this);
            }
            else {
               this.__handlers = [];
               this.__events = {};
            }
            break;
      }
   };

   /**
    * Consolidates the handler IDs registered for the supplied named event; when the event name is not specified
    * all event containers will be consolidated.
    *
    * @param {String} [eventName]
    */
   Subscribable.consolidateEvents = function(instance, eventName) {
      if(!arguments.length) {
         for(var eventName in instance.__events) {
            Subscribable.consolidateEvents(eventName);
         }
      }

      var handlerList = instance.__events[eventName];

      if(handlerList && handlerList.length) {
         for(var i = handlerList.length - 1; i >= 0; i--) {
            if(!instance.__handlers[handlerList[i]]) {
               handlerList.splice(i,1);
            }
         }
      }

      if(handlerList && !handlerList.length) {
         delete instance.__events[eventName];
      }
   };

   /**
    * Attempts to nullify the handler with the supplied list of handler IDs in the Subscribable instance. If the
    * optional scopeCheck parameter is supplied, each handler will only be nullified when the scope it was attached
    * with is the same entity as the scopeCheck.
    *
    * @param {Subscribable} instance
    * @param {Number[]} handlerList
    * @param {Object} [scopeCheck]
    */
   Subscribable.removeMultipleEvents = function(instance, handlerList, scopeCheck) {
      for(var i = 0, l = handlerList.length; i < l; i++) {
         Subscribable.removeSingleEvent(instance, handlerList[i], scopeCheck);
      }
   };

   /**
    * Attempts to nullify the supplied handlers (note that in this case the handler array is the list of actual handlers
    * rather than their handler ID values). If the optional scopeCheck parameter is supplied, each handler will only be
    * nullified when the scope it was attached with the same entity as the scopeCheck.
    *
    * @param {Subscribable} instance
    * @param {Object[]} handlers
    * @param {Object} [scopeCheck]
    */
   Subscribable.removeMultipleHandlers = function(instance, handlers, scopeCheck) {
      var handler;
      for(var i = 0, l = handlers.length; i < l; i++) {
         if(handler = handlers[i]) {
            Subscribable.removeSingleEvent(instance, handler[2], scopeCheck);
         }
      }
   };

   /**
    * Attempts to nullify the handler with the supplied handler ID in the Subscribable instance. If the optional
    * scopeCheck parameter is supplied, the handler will only be nullified when the scope it was attached with is
    * the same entity as the scopeCheck.
    *
    * @param {Subscribable} instance
    * @param {Number} handlerId
    * @param {Object} [scopeCheck]
    */
   Subscribable.removeSingleEvent = function(instance, handlerId, scopeCheck) {
      if(instance.__handlers[handlerId]) {
         if(!scopeCheck || instance.__handlers[handlerId][1] === scopeCheck) {
            instance.__handlers[handlerId] = null;
         }
      }
   };

   /**
    *
    * @param {String|Function} [eventType]
    */
   Subscribable.hasListener = function(eventType) {
      var handlers, handlerIds, i, l;

      if(eventType === undefined) {
         handlers = this.__handlers;
         for(i = 0, l = handlers.length; i < l; i++) {
            if(!!handlers[i]) {
               return true;
            }
         }
      }

      else if(handlerIds = this.__events[('' + eventType).toLowerCase()]) {
         for(var i = 0, l = handlerIds.length; i < l; i++) {
            if(this.__handlers[handlerIds[i]]) {
               return true;
            }
         }
      }

      return false;
   };

   return Subscribable;

}());

/*
 * If this is being used in a browser as a requireJs or commonJs module, or is being used as part of a NodeJS
 * app, externalise the Subscribable constructor as module.exports
 */
if(typeof module !== 'undefined') {
   module.exports = Subscribable;
}
