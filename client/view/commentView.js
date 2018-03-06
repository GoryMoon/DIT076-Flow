"use strict";

import {
EVENT_COMMENT_GET,
EVENT_COMMENT_POST,
EVENT_COMMENT_PUT,
eventBus as eB
} from "../util/eventBus.js"
import { 
    getTemplate, 
    getFancyTimeData, 
} from "../util/general.js"
import Mustache from 'mustache'

class CommentView {
 
    onModelEvent(event, data) {
        switch(event) {
            case EVENT_COMMENT_GET:
                this.commentRetrieve(data);
                break;
            case EVENT_COMMENT_POST:
                this.commentSend(data);
                break;
            case EVENT_COMMENT_PUT:
                this.commentHide(data);
                break;
        }
    }
  
    commentRetrieve(data) { // NOT TESTED
        let comments = $('#postid-' + data.id + ' .comments');
        comments.empty();
        getTemplate('/templates/comment.mustache', (template) => {
            if (data.comments.length == 0) {
                comments.html('<div class="no-comment"><small>No comments</small></div>');
            } else {
                for (var i = 0; i < data.comments.length; i++) {
                    var rendered = Mustache.render(template, getFancyTimeData(data.comments[i]));
                    comments.append(rendered);
                }
            }
            $('[data-toggle="tooltip"]').tooltip();
        });
    }
    
    commentSend(data) { // NOT TESTED
        console.log("Unused event sent: EVENT_COMMENT_POST, with data: " + JSON.stringify(data));
    }
    
    commentHide(data) { // NOT TESTED
        console.log("Unused event sent: EVENT_COMMENT_PUT, with data: " + JSON.stringify(data));
    }
}

const commentView = new CommentView();
eB.register(commentView);

