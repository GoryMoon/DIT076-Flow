"use strict";

import {
serverService as server
} from "../model/serverService.js"
import {
EVENT_POST_VIEW,
EVENT_POST_RETRIEVE,
EVENT_POST_SEND,
EVENT_POST_HIDE,
eventBus as eB
} from "../util/eventBus.js"
import {
getInput,
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

class PostCtrl {
    retrieve() {
        if (hasUser()) {
            eB.notify(EVENT_POST_VIEW);
            let getPostData = {userid: null, group: null, from: null, count: null}; // UNUSED AND DOES NOT MATCH NEW SERVER CLIENT INTERACTION DRAFT
            getPostData.userid = store.get('user').id;
            /*getPostData.group = getInput(POST_FILTER_GROUP);
            getPostData.from = getInput(POST_FILTER_TIME);
            getPostData.count = getInput(POST_FILTER_COUNT);*/
            server.rpcGetPost(getPostData, data => { return eB.notify(EVENT_POST_RETRIEVE, data); });
        }
    }
    
    send() { // NOT TESTED
        if (validate(POST_SEND_TITLE, POST_SEND_TEXT)) {
            event.preventDefault();
            let postPostData = {posterId: null, userGroupId: null, title: null, text: null};
            postPostData.posterId = store.get('user').id;
            postPostData.userGroupId = 0;//getInput(POST_SEND_GROUP_ID);
            postPostData.title = getInput(POST_SEND_TITLE);
            postPostData.text = getInput(POST_SEND_TEXT);
            server.rpcPostPost(postPostData, data => { 
                eB.notify(EVENT_POST_SEND, data); 
                page('/');
            });
        }
    }
    
    hide() { // NOT TESTED
        let putPostData = {userid: null, postid: null};
        putPostData.userid = store.get('user').id;
        putPostData.postid = getInput(POST_HIDE_ID);
        server.rpcPutPost(putPostData, data => { return eB.notify(EVENT_POST_HIDE, data); });
    }
}

const postCtrl = new PostCtrl();

//TODO add pathes for the data loading
page('/', postCtrl.retrieve);

$(document).ready(function () {
    
    $(document).on("click", POST_RETRIEVE_BUTTON, postCtrl.retrieve);
    $(document).on("click", POST_SEND_BUTTON, postCtrl.send);
    $(document).on("click", POST_HIDE_BUTTON, postCtrl.hide);
    
  //  $(POST_RETRIEVE_BUTTON).on("click", postCtrl.retrieve);
  //  $(POST_SEND_BUTTON).on("click", postCtrl.send);
  //  $(POST_HIDE_BUTTON).on("click", postCtrl.hide);
});