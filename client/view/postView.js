"use strict";

import {
EVENT_POST_VIEW,
EVENT_POST_RETRIEVE,
EVENT_POST_SEND,
EVENT_POST_HIDE,
eventBus as eB
} from "../util/eventBus.js"
import { setTitle } from "../util/general.js"
import Mustache from 'mustache'
import moment from 'moment';

class CommentView {
 
    onModelEvent(event, data) {
        if (event === EVENT_POST_RETRIEVE) {
            this.postRetrieve(data);
        } else if (event === EVENT_POST_VIEW) {
            this.postView();
        } else if (event === EVENT_POST_SEND) {
            this.postSend(data);
        } else if (event === EVENT_POST_HIDE) {
            this.postHide(data);
        }
    }
  
    postRetrieve(data) { // NOT TESTED
        setTitle('Feed');
        //TODO optimize with saving of templates?
        $.get('/templates/post.mustache', (template) => {
            for (var i = 0; i < data.length; i++) {
                let d = data[i];
                d.time = moment(d.time.toLowerCase(), "MMM DD, YYYY hh:mm:ss a").subtract(1, 'd');
                let yesterday = moment().subtract(1, 'd');
                d.raw_time = d.time.format("ddd DD MMM YYYY HH:mm");
                if (d.time.isSameOrAfter(yesterday)) {
                    d.time = d.time.fromNow();
                } else {
                    d.time = d.time.format("DD MMM YYYY HH:mm");
                }
                var rendered = Mustache.render(template, d);
                $('#content').append(rendered);
            }
            $('[data-toggle="tooltip"]').tooltip()
        });
    }
  
    postView() { // NOT TESTED
        //TODO optimize with saving of templates?
        $.get('/templates/create-post.mustache', function(template) {
            var rendered = Mustache.render(template);
            $('#content').html(rendered);
        });
    }

    postSend(data) { // NOT TESTED
        
    }
    
    postHide(data) { // NOT TESTED
        
    }
}

const commentView = new CommentView();
eB.register(commentView);

