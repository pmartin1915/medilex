/**
 * Mock for react-native/Libraries/vendor/emitter/EventEmitter
 * This fixes compatibility with RN 0.76+ Flow syntax
 */

class EventEmitter {
  constructor() {
    this._registry = {};
  }

  addListener(eventType, listener, context) {
    if (!this._registry[eventType]) {
      this._registry[eventType] = [];
    }
    this._registry[eventType].push({ listener, context });
    return {
      remove: () => {
        const index = this._registry[eventType]?.findIndex(
          (reg) => reg.listener === listener
        );
        if (index !== undefined && index >= 0) {
          this._registry[eventType].splice(index, 1);
        }
      },
    };
  }

  removeListener(eventType, listener) {
    const listeners = this._registry[eventType];
    if (listeners) {
      const index = listeners.findIndex((reg) => reg.listener === listener);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    }
  }

  removeAllListeners(eventType) {
    if (eventType) {
      delete this._registry[eventType];
    } else {
      this._registry = {};
    }
  }

  emit(eventType, ...args) {
    const listeners = this._registry[eventType];
    if (listeners) {
      listeners.forEach(({ listener, context }) => {
        listener.apply(context, args);
      });
    }
  }

  listenerCount(eventType) {
    return this._registry[eventType]?.length || 0;
  }
}

module.exports = EventEmitter;
module.exports.default = EventEmitter;
