
import {
    EVENT_POST_VIEW,
    EVENT_POST_GET,
    EVENT_POST_POST,
    EVENT_POST_PUT,
    EVENT_UPDATE_GROUP_INFO,
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
import { groupCtrl as gc } from "../control/groupCtrl.js"

class CommentView {
 
    onModelEvent(event, data) {
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
            case EVENT_UPDATE_GROUP_INFO:
                this.updateCreatePostView(data);
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
            $(".show_hide.comment_link.outer").click((event) => {
                let self = $(event.target);
                if (self.is('svg') || self.is('path')) {
                    self = self.parents('a');
                }
                let drawer = self.next();
                if (drawer.hasClass('show')) {
                    self.html("Show comments <i class=\"fas fa-angle-down\"></i>");
                } else {
                    if (drawer.children('.comments').children().length == 0) {
                        cc.get(self.parents('.card').data("postid"));
                    }
                    self.html("Hide comments <i class=\"fas fa-angle-up\"></i>");
                }
                drawer.collapse('toggle');
            });
            //Bottom hide comments button
            $(".show_hide.comment_link.inner").click((event) => {
                let target = $(event.target);
                if (target.is('svg') || target.is('path')) {
                    target = target.parents('a');
                }
                let drawer = target.parent();
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
        let info = gc.getGroupInfo();
        let g = [];
        for (var i = 0; i < info.length; i++) {
            if (info[i].status != 2) {
                g.push(info[i]);
            }
        }
        getTemplate('/templates/create-post.mustache', (template) => $('#content').html(Mustache.render(template, {groups: g})));
    }

    updateCreatePostView(data) {
        if ($("#create_post_card") != undefined) {
            setTitle('Feed');
            let g = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].status != 2) {
                    g.push(data[i]);
                }
            }
            getTemplate('/templates/create-post.mustache', (template) => $('#create_post_card').replaceWith(Mustache.render(template, {groups: g})));
        }
    }

    postSend(data) {}
    
    postHide(data) {}

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

