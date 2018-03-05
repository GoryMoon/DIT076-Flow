"use strict";

import {
serverService as server
} from "../model/serverService.js"
import {
EVENT_COMMENT_GET,
EVENT_COMMENT_POST,
EVENT_COMMENT_PUT,
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
    get(postid) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let getCommentData = {userid: null, ownerid: null, postid: null, nick: null, id: null, text: null, before: null, after: null, count: null};
        getCommentData.userid = store.get('user').id;
        getCommentData.postid = postid;
        
        server.rpcGetComment(getCommentData, data => { return eB.notify(EVENT_COMMENT_GET, data); });
    }
    
    put() { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let putCommentData = {userid: null, id: null, text: null, status: null};
        putCommentData.userid = store.get('user').id;
        putCommentData.id = getData(COMMENT_ID);
        putCommentData.status = 1; // 1 is hide, 0 is visible. null defaults to visible.
        
        server.rpcPutComment(putCommentData, data => { return eB.notify(EVENT_COMMENT_PUT, data); });
    }
    
    post(postid, text) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let postCommentData = {userid: null, postid: null, text: null, status: null};
        postCommentData.userid = store.get('user').id;
        postCommentData.postid = postid;
        postCommentData.text = text;
        server.rpcPostComment(postCommentData, data => { return eB.notify(EVENT_COMMENT_POST, data); });
    }
}

export const commentCtrl = new CommentCtrl();

$(document).ready(function () {
    $(document).on("click", COMMENT_SEND_BUTTON, commentCtrl.post);
    $(document).on("click", COMMENT_HIDE_BUTTON, commentCtrl.put);
    //$(COMMENT_RETRIEVE_BUTTON).on("click", commentCtrl.get);
    //$(COMMENT_SEND_BUTTON).on("click", commentCtrl.post);
    //$(COMMENT_HIDE_BUTTON).on("click", commentCtrl.delete);
});