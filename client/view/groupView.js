"use strict";

import {
EVENT_GROUP_RETRIEVE,
EVENT_GROUP_SEND,
eventBus as eB
} from "../util/eventBus.js"

class GroupView {
 
  onModelEvent(event, data) {
      if (event === EVENT_GROUP_RETRIEVE) {
          groupRetrieve(data);
      } else if (event === EVENT_GROUP_SEND) {
          groupSend(data);
      }
  }
  
  groupRetrieve(data) { // NOT TESTED
      
  }
  
  groupSend(data) { // NOT TESTED
      
  }
}

const groupView = new GroupView();
eB.register(groupView);

