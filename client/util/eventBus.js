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
export const EVENT_ACCOUNT_VIEW_REGISTER = "ACCOUNT_REGISTER_VIEW";
export const EVENT_ACCOUNT_VIEW_LOGIN = "ACCOUNT_LOGIN_VIEW";
export const EVENT_ACCOUNT_LOGOUT = "ACCOUNT_LOGOUT";
export const EVENT_ACCOUNT_GET = "ACCOUNT_GET";
export const EVENT_ACCOUNT_PUT = "ACCOUNT_PUT";

export const EVENT_COMMENT_GET = "COMMENT_RETRIEVE";
export const EVENT_COMMENT_POST = "COMMENT_SEND";
export const EVENT_COMMENT_PUT = "COMMENT_HIDE";

export const EVENT_POST_VIEW = "POST_VIEW";
export const EVENT_POST_GET = "POST_RETRIEVE";
export const EVENT_POST_POST = "POST_SEND";
export const EVENT_POST_PUT = "POST_HIDE";

export const EVENT_GROUP_CREATE_VIEW = "GROUP_CREATE_VIEW"
export const EVENT_GROUP_INVITE_VIEW = "GROUP_INVITE_VIEW"
export const EVENT_GROUP_MANAGE_VIEW = "GROUP_OWNER_VIEW"
export const EVENT_GROUP_GET = "GROUP_RETRIEVE";
export const EVENT_GROUP_POST = "GROUP_SEND";
export const EVENT_GROUP_PUT = "GROUP_PUT";
export const EVENT_GROUP_JOIN = "GROUP_JOIN";
export const EVENT_GROUP_LEAVE = "GROUP_LEAVE";
export const EVENT_GROUP_INVITE = "GROUP_INVITE";
export const EVENT_GROUP_KICK = "GROUP_KICK";
export const EVENT_UPDATE_GROUP_INFO = "GROUP_UPDATE_INFO"

export const eventBus = new EventBus();
