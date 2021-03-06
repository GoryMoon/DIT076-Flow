"use strict";

import {
serverService as server
} from "../model/serverService.js"
import {
EVENT_POST_VIEW,
EVENT_POST_GET,
EVENT_POST_POST,
EVENT_POST_PUT,
eventBus as eB
} from "../util/eventBus.js"
import {
getInput,
getUser,
hasUser,
validate,
POST_FILTER_GROUP,
POST_FILTER_TIME,
POST_FILTER_COUNT,
POST_SEND_GROUP_ID,
POST_SEND_TITLE,
POST_SEND_TEXT,
POST_HIDE_ID,
POST_RETRIEVE_BUTTON,
POST_SEND_BUTTON,
POST_HIDE_BUTTON
} from "../util/general.js"
import { groupCtrl as gc } from "../control/groupCtrl.js"

class PostCtrl {

    refresh() {
        page(location.pathname);
    }
    get() {
        if (hasUser()) { // PROTOCOL 3.1 COMPLIANT - NOT TESTED
            gc.get(() => {
                eB.notify(EVENT_POST_VIEW);
                let getPostData = {userid: null, ownerid: null, groupid: null, nick: null, id: null, title: null, text: null, before: null, after: null, count: null};
                getPostData.userid = getUser().id; // verify user can access this info.
                server.rpcGetPost(getPostData, data => { return eB.notify(EVENT_POST_GET, data); });
            });
        }
    }
    
    put(event) { // PROTOCOL 3.1 COMPLIANT - NOT TESTED
        let id = $(event.target).parents('.card').data('postid');
        let putPostData = {userid: null, id: null, title: null, text: null, status: null};
        putPostData.userid = getUser().id;
        putPostData.id = id;
        putPostData.status = 1;
        server.rpcPutPost(putPostData, data => { 
            eB.notify(EVENT_POST_PUT, data); 
            page('/');
        });
    }
    
    post(event) { // PROTOCOL 3.1 COMPLIANT - NOT TESTED
        if (validate(POST_SEND_TITLE, POST_SEND_TEXT, POST_SEND_GROUP_ID)) {
            event.preventDefault();
            let postPostData = {userid: null, groupid: null, title: null, text: null, status: null};
            postPostData.userid = getUser().id;
            postPostData.groupid = getInput(POST_SEND_GROUP_ID);
            postPostData.title = getInput(POST_SEND_TITLE);
            postPostData.text = getInput(POST_SEND_TEXT);
            postPostData.status = 0;
            server.rpcPostPost(postPostData, data => { 
                eB.notify(EVENT_POST_POST, data); 
                page('/');
            });
        }
    }
}

export const postCtrl = new PostCtrl();

//TODO add pathes for the data loading
page('/', postCtrl.get);

$(document).ready(function () {
    $(document).on("click", POST_RETRIEVE_BUTTON, postCtrl.refresh);
    $(document).on("click", POST_SEND_BUTTON, postCtrl.post);
    $(document).on("click", POST_HIDE_BUTTON, postCtrl.put);
});