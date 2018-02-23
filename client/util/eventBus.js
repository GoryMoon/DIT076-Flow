"use strict";

class EventBus {

  constructor() {
    this.observers = [];
  }

  register(observer) {
    this.observers.push(observer);
  }

  unregister(observer) {
    let i = this.observers.indexOf(observer);
    this.observers.slice(i, 1);
  }

  notify(event, data) {
    this.observers.forEach(function(observer) {
      observer.onModelEvent(event, data);
    });
  }

}

export const eventBus = new EventBus();
