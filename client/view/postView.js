
import {
EVENT_POST_VIEW,
EVENT_POST_GET,
EVENT_POST_POST,
EVENT_POST_PUT,
eventBus as eB
} from "../util/eventBus.js"
import { 
    setTitle, 
    getTemplate,
    getMomentTime,
    getFancyTime,
    getFancyTimeData,
    COMMENT_SEND_BUTTON,
} from "../util/general.js"
import Mustache from 'mustache'
import { commentCtrl as cc } from "../control/commentCtrl.js"

class CommentView {
 
    onModelEvent(event, data) {
        if (event === EVENT_POST_GET) {
            this.postRetrieve(data);
        } else if (event === EVENT_POST_VIEW) {
            this.postView();
        } else if (event === EVENT_POST_POST) {
            this.postSend(data);
        } else if (event === EVENT_POST_PUT) {
            this.postHide(data);
        }
        switch(event) {
            case EVENT_POST_GET:
                this.postRetrieve(data);
                break;
            case EVENT_POST_VIEW:
                this.postView();
                break;
            case EVENT_POST_POST:
                this.postSend(data);
                break;
            case EVENT_POST_PUT:
                this.postHide(data);
                break;
        }
    }
  
    postRetrieve(data) {
        getTemplate('/templates/post.mustache', (template) => {
            for (var i = 0; i < data.length; i++) {
                $('#content').append(Mustache.render(template, getFancyTimeData(data[i])));
            }
            $('[data-toggle="tooltip"]').tooltip();
            //Show/hide toggle
            $(".show_hide-comment.outer").click((event) => {
                let self = $(event.target);
                let drawer = self.next();
                if (drawer.hasClass('show')) {
                    self.html("Show comments <i class=\"fas fa-angle-down\"></i>");
                } else {
                    if (drawer.children('.comments').children().length == 0) {
                        cc.retrieve(self.parents('.card').data("postid"));
                    }
                    self.html("Hide comments <i class=\"fas fa-angle-up\"></i>");
                }
                drawer.collapse('toggle');
            });
            //Bottom hide comments button
            $(".show_hide-comment.inner").click((event) => {
                let drawer = $(event.target).parent();
                if (drawer.hasClass('show')) {
                    drawer.prev().html("Show comments <i class=\"fas fa-angle-down\"></i>");
                } else {
                    drawer.prev().html("Hide comments <i class=\"fas fa-angle-up\"></i>");
                }
                drawer.collapse('hide');
            });
        });
    }
  
    postView() {
        setTitle('Feed');
        getTemplate('/templates/create-post.mustache', (template) => $('#content').html(Mustache.render(template)));
    }

    postSend(data) { // NOT TESTED
      console.log("Unused event sent: EVENT_POST_POST, with data: " + JSON.stringify(data));
    }
    
    postHide(data) { // NOT TESTED
      console.log("Unused event sent: EVENT_POST_PUT, with data: " + JSON.stringify(data));
    }

    updateTime() {
        let times = $('.live-time');
        for (var i = 0; i < times.length; i++) {
            let time = $(times[i]);
            time.text(getFancyTime(getMomentTime(time.data('rawtime'))));
        };
    }
}

const commentView = new CommentView();
eB.register(commentView);
setInterval(() => commentView.updateTime(), 1000);

