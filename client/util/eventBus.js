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

export const EVENT_ACCOUNT_REGISTER = "ACCOUNT_REGISTER";
export const EVENT_ACCOUNT_LOGIN = "ACCOUNT_LOGIN";
export const EVENT_ACCOUNT_VIEW_REGISTER = "ACCOUNT_REGISTER";
export const EVENT_ACCOUNT_VIEW_LOGIN = "ACCOUNT_LOGIN";
export const EVENT_ACCOUNT_LOGOUT = "ACCOUNT_LOGOUT";

export const EVENT_COMMENT_RETRIEVE = "COMMENT_RETRIEVE";
export const EVENT_COMMENT_SEND = "COMMENT_SEND";
export const EVENT_COMMENT_HIDE = "COMMENT_HIDE";

export const EVENT_POST_VIEW = "POST_VIEW";
export const EVENT_POST_RETRIEVE = "POST_RETRIEVE";
export const EVENT_POST_SEND = "POST_SEND";
export const EVENT_POST_HIDE = "POST_HIDE";

export const EVENT_GROUP_RETRIEVE = "GROUP_RETRIEVE";
export const EVENT_GROUP_SEND = "GROUP_SEND";

export const eventBus = new EventBus();
