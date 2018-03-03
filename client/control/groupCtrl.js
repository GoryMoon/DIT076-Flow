"use strict";

import {
serverService as server
} from "../model/serverService.js"
import {
EVENT_GROUP_RETRIEVE,
EVENT_GROUP_SEND,
eventBus as eB
} from "../util/eventBus.js"
import {
getData,
ACCOUNT_ID,
GROUP_FILTER_TEXT,
GROUP_FILTER_TIME,
GROUP_FILTER_COUNT,
GROUP_SEND_NAME,
GROUP_RETRIEVE_BUTTON,
GROUP_SEND_BUTTON
} from "../util/general.js"

class GroupCtrl {
    retrieve() { // NOT TESTED
        let getGroupData = {userid: null, search: null, from: null, count: null};
        getGroupData.userid = getData(ACCOUNT_ID);
        getGroupData.search = getData(GROUP_FILTER_TEXT);
        getGroupData.from = getData(GROUP_FILTER_TIME);
        getGroupData.count = getData(GROUP_FILTER_COUNT);
        server.rpcGetGroup(getGroupData, data => { return eB.notify(EVENT_GROUP_RETRIEVE, data); });
    }
    
    send() { // NOT TESTED
        let postGroupData = {userid: null, groupname: null};
        postGroupData.userid = getData(ACCOUNT_ID);
        postGroupData.groupname = getData(GROUP_SEND_NAME);
        server.rpcPostGroup(postGroupData, data => { return eB.notify(EVENT_GROUP_SEND, data); });
    }
    
//    hide() { // NOT SPECIFIED
        //let commentHideData = {userid: null, commentid: null};
       // commentHideData.userid = getData(ACCOUNT_ID);
      //  commentHideData.commentid = getData(COMMENT_ID);
     //   server.rpcLoginAccount(commentHideData, data => { return eB.notify("COMMENT_HIDE", data); });
//    }
}

const groupCtrl = new GroupCtrl();

$(document).ready(function () {
    
    $(document).on("click", GROUP_RETRIEVE_BUTTON, groupCtrl.retrieve);
    $(document).on("click", GROUP_SEND_BUTTON, groupCtrl.send);
   // $(GROUP_RETRIEVE_BUTTON).on("click", groupCtrl.retrieve);
   // $(GROUP_SEND_BUTTON).on("click", groupCtrl.send);
//    $(COMMENT_HIDE_BUTTON).on("click", commentCtrl.hide);
});
