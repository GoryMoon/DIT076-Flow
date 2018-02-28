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
ACCOUNT_ID,
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
    retrieve() { // NOT TESTED
        if (hasUser()) {
            eB.notify(EVENT_POST_VIEW);
            let postRetrieveData = {userid: null, group: null, from: null, count: null};
            postRetrieveData.userid = getInput(ACCOUNT_ID);
            postRetrieveData.group = getInput(POST_FILTER_GROUP);
            postRetrieveData.from = getInput(POST_FILTER_TIME);
            postRetrieveData.count = getInput(POST_FILTER_COUNT);
            //eB.notify(EVENT_POST_RETRIEVE, [{groupid: 1, groupname: "Global", userid: 42, usernick: "Gustaf", posttitle: "Test", posttime: 14551515, postid: 4, posttext: "This is a test"}, {groupid: 1, groupname: "Global", userid: 42, usernick: "Gustaf", posttitle: "Test", posttime: 14551515, postid: 5, posttext: "This is a test"}]);
            server.rpcRetrievePosts(postRetrieveData, data => { return eB.notify(EVENT_POST_RETRIEVE, data); });
        }
    }
    
    send() { // NOT TESTED
        let postSendData = {userid: null, groupid: null, posttitle: null, posttext: null};
        postSendData.userid = getInput(ACCOUNT_ID);
        postSendData.groupid = getInput(POST_SEND_GROUP_ID);
        postSendData.posttitle = getInput(POST_SEND_TITLE);
        postSendData.posttext = getInput(POST_SEND_TEXT);
        server.rpcSendPost(postSendData, data => { return eB.notify(EVENT_POST_SEND, data); });
    }
    
    hide() { // NOT TESTED
        let postHideData = {userid: null, postid: null};
        postHideData.userid = getInput(ACCOUNT_ID);
        postHideData.postid = getInput(POST_HIDE_ID);
        server.rpcHidePost(postHideData, data => { return eB.notify(EVENT_POST_HIDE, data); });
    }
}

const postCtrl = new PostCtrl();

//TODO add pathes for the data loading
page('/', postCtrl.retrieve);

$(document).ready(function () {
    $(POST_RETRIEVE_BUTTON).on("click", postCtrl.retrieve);
    $(POST_SEND_BUTTON).on("click", postCtrl.send);
    $(POST_HIDE_BUTTON).on("click", postCtrl.hide);
});