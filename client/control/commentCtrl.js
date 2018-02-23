"use strict";

import {
serverService as server
} from "../model/serverService.js"
import {
EVENT_COMMENT_RETRIEVE,
EVENT_COMMENT_SEND,
EVENT_COMMENT_HIDE,
eventBus as eB
} from "../util/eventBus.js"
import {
getData,
ACCOUNT_ID,
COMMENT_FILTER_POSTID,
COMMENT_FILTER_TIME,
COMMENT_FILTER_COUNT,
COMMENT_SEND_TEXT,
COMMENT_POST_ID,
COMMENT_ID,
COMMENT_RETRIEVE_BUTTON,
COMMENT_SEND_BUTTON,
COMMENT_HIDE_BUTTON
} from "../util/general.js"

class CommentCtrl {
    retrieve() { // NOT TESTED
        let commentRetrieveData = {userid: null, postid: null, from: null, count: null};
        commentRetrieveData.userid = getData(ACCOUNT_ID);
        commentRetrieveData.postid = getData(COMMENT_FILTER_POSTID);
        commentRetrieveData.from = getData(COMMENT_FILTER_TIME);
        commentRetrieveData.count = getData(COMMENT_FILTER_COUNT);
        server.rpcRetrieveComments(commentRetrieveData, data => { return eB.notify(EVENT_COMMENT_RETRIEVE, data); });
    }
    
    send() { // NOT TESTED
        let commentSendData = {userid: null, postid: null, commenttext: null};
        commentSendData.userid = getData(ACCOUNT_ID);
        commentSendData.postid = getData(COMMENT_POST_ID);
        commentSendData.commenttext = getData(COMMENT_SEND_TEXT);
        server.rpcSendComment(commentSendData, data => { return eB.notify(EVENT_COMMENT_SEND, data); });
    }
    
    hide() { // NOT TESTED
        let commentHideData = {userid: null, commentid: null};
        commentHideData.userid = getData(ACCOUNT_ID);
        commentHideData.commentid = getData(COMMENT_ID);
        server.rpcHideComment(commentHideData, data => { return eB.notify(EVENT_COMMENT_HIDE, data); });
    }
}

const commentCtrl = new CommentCtrl();

$(document).ready(function () {
    $(COMMENT_RETRIEVE_BUTTON).on("click", commentCtrl.retrieve);
    $(COMMENT_SEND_BUTTON).on("click", commentCtrl.send);
    $(COMMENT_HIDE_BUTTON).on("click", commentCtrl.hide);
});