"use strict";

import {
EVENT_COMMENT_RETRIEVE,
EVENT_COMMENT_SEND,
EVENT_COMMENT_HIDE,
eventBus as eB
} from "../util/eventBus.js"
import { setTitle, getTemplate } from "../util/general.js"
import Mustache from 'mustache'

class CommentView {
 
    onModelEvent(event, data) {
        if (event === EVENT_COMMENT_RETRIEVE) {
            this.commentRetrieve(data);
        } else if (event === EVENT_COMMENT_SEND) {
            this.commentSend(data);
        } else if (event === EVENT_COMMENT_HIDE) {
            this.commentHide(data);
        }
    }
  
    commentRetrieve(data) { // NOT TESTED
        let comments = $('#postid-' + data.id + ' .comments');
        comments.empty();
        getTemplate('/templates/comment.mustache', (template) => {
            if (data.comments.length == 0) {
                comments.html('<small>No comments</small>');
            } else {
                for (var i = 0; i < data.comments.length; i++) {
                    var rendered = Mustache.render(template, data.comments[i]);
                    comments.html(rendered);
                }
            }
        });
    }
    
    commentSend(data) { // NOT TESTED
        
    }
    
    commentHide(data) { // NOT TESTED
        
    }
}

const commentView = new CommentView();
eB.register(commentView);

