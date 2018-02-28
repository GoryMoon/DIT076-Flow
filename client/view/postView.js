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
import { retriveComments } from "../control/commentCtrl.js"

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
            $('[data-toggle="tooltip"]').tooltip();
            $(".show_hide-comment.outer").click(function() {
                if ($(this).next().children('.comments').children().length == 0) {
                    retriveComments($(this).parents('.card').data("postid"));
                }
                if ($(this).next().hasClass('show')) {
                    $(this).html("Show comments <i class=\"fas fa-angle-down\"></i>");
                } else {
                    $(this).html("Hide comments <i class=\"fas fa-angle-up\"></i>");
                }
                $(this).next().collapse('toggle');
            });
            $(".show_hide-comment.inner").click(function() {
                if ($(this).parent().hasClass('show')) {
                    $(this).parent().prev().html("Show comments <i class=\"fas fa-angle-down\"></i>");
                } else {
                    $(this).parent().prev().html("Hide comments <i class=\"fas fa-angle-up\"></i>");
                }
                $(this).parent().collapse('toggle');
            });
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

