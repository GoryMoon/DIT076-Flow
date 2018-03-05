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
validate,
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
    refresh(event) {
        event.preventDefault();
        let id = $(event.target).parents('.card').data('postid');
        commentCtrl.get(id);
    }

    get(postid) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let getCommentData = {userid: null, ownerid: null, postid: null, nick: null, id: null, text: null, before: null, after: null, count: null};
        getCommentData.userid = store.get('user').id;
        getCommentData.postid = postid;
        
        server.rpcGetComment(getCommentData, data => { return eB.notify(EVENT_COMMENT_GET, { id: postid, comments: data}); });
    }
    
    put(event) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let id = $(event.target).parents('.card').data('postid');
        let putCommentData = {userid: null, id: null, text: null, status: null};
        putCommentData.userid = store.get('user').id;
        putCommentData.id = id;
        putCommentData.status = 1; // 1 is hide, 0 is visible. null defaults to visible.
        
        server.rpcPutComment(putCommentData, data => { return eB.notify(EVENT_COMMENT_PUT, data); });
    }
    
    post(event) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let id = $(event.target).parents('.card').data('postid');
        if (validate("#postid-" + id + " " + COMMENT_SEND_TEXT)) {
            event.preventDefault();
            let postCommentData = {userid: null, postid: null, text: null, status: null};
            postCommentData.userid = store.get('user').id;
            postCommentData.postid = id;
            let inVal = $("#postid-" + id + " " + COMMENT_SEND_TEXT);
            postCommentData.text = inVal.val();

            server.rpcPostComment(postCommentData, data => { 
                eB.notify(EVENT_COMMENT_POST, data); 
                inVal.val("");
                commentCtrl.get(id);
            });
        }
    }
}

export const commentCtrl = new CommentCtrl();

$(document).ready(function () {
    $(document).on("click", COMMENT_SEND_BUTTON, commentCtrl.post);
    $(document).on("click", COMMENT_HIDE_BUTTON, commentCtrl.put);
    $(document).on("click", COMMENT_RETRIEVE_BUTTON, commentCtrl.refresh);
});