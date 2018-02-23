"use strict";

import {
EVENT_COMMENT_RETRIEVE,
EVENT_COMMENT_SEND,
EVENT_COMMENT_HIDE,
eventBus as eB
} from "../util/eventBus.js"

class CommentView {
 
  onModelEvent(event, data) {
      if (event === EVENT_COMMENT_RETRIEVE) {
          commentRetrieve(data);
      } else if (event === EVENT_COMMENT_SEND) {
          commentSend(data);
      } else if (event === EVENT_COMMENT_HIDE) {
          commentHide(data);
      }
  }
  
  commentRetrieve(data) { // NOT TESTED
      
  }
  
  commentSend(data) { // NOT TESTED
      
  }
  
  commentHide(data) { // NOT TESTED
      
  }
}

const commentView = new CommentView();
eB.register(commentView);

