"use strict";

import {
EVENT_POST_RETRIEVE,
EVENT_POST_SEND,
EVENT_POST_HIDE,
eventBus as eB
} from "../util/eventBus.js"

class CommentView {
 
  onModelEvent(event, data) {
      if (event === EVENT_POST_RETRIEVE) {
          postRetrieve(data);
      } else if (event === EVENT_POST_SEND) {
          postSend(data);
      } else if (event === EVENT_POST_HIDE) {
          postHide(data);
      }
  }
  
  postRetrieve(data) { // NOT TESTED
      
  }
  
  postSend(data) { // NOT TESTED
      
  }
  
  postHide(data) { // NOT TESTED
      
  }
}

const commentView = new CommentView();
eB.register(commentView);

