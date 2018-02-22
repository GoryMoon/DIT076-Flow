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
      //console.log(item, index);
    });
  }

}

export const eventBus = new EventBus();
