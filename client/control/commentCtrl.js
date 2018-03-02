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
getInput,
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
    retrieve(postid) { // NOT TESTED
        let getCommentData = {userid: null, postid: null, from: null, count: null};
        //commentRetrieveData.userid = getData(ACCOUNT_ID);
        getCommentData.postid = postid;
        //commentRetrieveData.from = getData(COMMENT_FILTER_TIME);
        //commentRetrieveData.count = getData(COMMENT_FILTER_COUNT);
        server.rpcGetComments(getCommentData, data => { return eB.notify(EVENT_COMMENT_RETRIEVE, data); });
    }
    
    send() { // NOT TESTED
        let postCommentData = {userid: null, postid: null, commenttext: null};
        postCommentData.userid = getData(ACCOUNT_ID);
        postCommentData.postid = getData(COMMENT_POST_ID);
        postCommentData.commenttext = getData(COMMENT_SEND_TEXT);
        server.rpcPostComment(postCommentData, data => { return eB.notify(EVENT_COMMENT_SEND, data); });
    }
    
    hide() { // NOT TESTED
        let putCommentData = {userid: null, commentid: null};
        putCommentData.userid = getData(ACCOUNT_ID);
        putCommentData.commentid = getData(COMMENT_ID);
        server.rpcPutComment(putCommentData, data => { return eB.notify(EVENT_COMMENT_HIDE, data); });
    }
}

const commentCtrl = new CommentCtrl();

export function retriveComments(postid) {
    commentCtrl.retrieve(postid);
}

$(document).ready(function () {
    $(document).on("click", COMMENT_SEND_BUTTON, commentCtrl.send);
    $(document).on("click", COMMENT_HIDE_BUTTON, commentCtrl.hide);
    //$(COMMENT_RETRIEVE_BUTTON).on("click", commentCtrl.retrieve);
    //$(COMMENT_SEND_BUTTON).on("click", commentCtrl.send);
    //$(COMMENT_HIDE_BUTTON).on("click", commentCtrl.hide);
});