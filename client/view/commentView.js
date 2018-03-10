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
  
    commentRetrieve(data) {
        let comments = $('#postid-' + data.id + ' .comments');
        comments.empty();
        getTemplate('/templates/comment.mustache', (template) => {
            if (data.comments.length == 0) {
                comments.html('<div class="no-comment"><small>No comments</small></div>');
            } else {
                for (var i = 0; i < data.comments.length; i++) {
                    let d = getFancyTimeData(data.comments[i]);
                    let status = d.text.trim();
                    if (status == "Hidden") {
                        status = 'Show';
                    } else {
                        status = 'Hide';
                    }
                    d.toggle_comment = status;
                    var rendered = Mustache.render(template, d);
                    comments.append(rendered);
                }
            }
            $('[data-toggle="tooltip"]').tooltip();
        });
    }
    
    commentSend(data) {}
    
    commentHide(data) {
        $('#postid-' + data.postid + ' .comment_retrieve_button').click();
        let status = $('#postid-' + data.postid).find('.comment-text').text().trim();
        if (status == "Hidden") {
            status = 'Show';
        } else {
            status = 'Hide';
        }
        $('#comment_hide_button_' + data.id).text(status);
    }
}

const commentView = new CommentView();
eB.register(commentView);

