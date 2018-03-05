"use strict";

import {
EVENT_GROUP_GET,
EVENT_GROUP_POST,
EVENT_GROUP_PUT,
EVENT_GROUP_JOIN,
EVENT_GROUP_INVITE,
eventBus as eB
} from "../util/eventBus.js"

class GroupView {
 
  onModelEvent(event, data) {
        switch(event) {
            case EVENT_GROUP_GET:
                this.groupGet(data);
                break;
            case EVENT_GROUP_POST:
                this.groupPost(data);
                break;
            case EVENT_GROUP_PUT:
                this.groupPut(data);
                break;
            case EVENT_GROUP_JOIN:
                this.groupJoin(data);
                break;
            case EVENT_GROUP_INVITE:
                this.groupInvite(data);
                break;
        }
  }
  
  groupGet(data) { // NOT TESTED
      console.log("Unused event sent: EVENT_GROUP_GET, with data: " + JSON.stringify(data));
  }
  
  groupPost(data) { // NOT TESTED
      console.log("Unused event sent: EVENT_GROUP_POST, with data: " + JSON.stringify(data));
  }
  
  groupPut(data) {
      console.log("Unused event sent: EVENT_GROUP_PUT, with data: " + JSON.stringify(data));
  }
  
  groupJoin(data) {
      console.log("Unused event sent: EVENT_GROUP_JOIN, with data: " + JSON.stringify(data));
  }
  
  groupInvite(data) {
      console.log("Unused event sent: EVENT_GROUP_INVITE, with data: " + JSON.stringify(data));
  }
  
}

const groupView = new GroupView();
eB.register(groupView);

