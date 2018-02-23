"use strict";

import {
serverService as server
} from "../model/serverService.js"
import {
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
        let groupRetrieveData = {userid: null, search: null, from: null, count: null};
        groupRetrieveData.userid = getData(ACCOUNT_ID);
        groupRetrieveData.search = getData(GROUP_FILTER_TEXT);
        groupRetrieveData.from = getData(GROUP_FILTER_TIME);
        groupRetrieveData.count = getData(GROUP_FILTER_COUNT);
        server.rpcRetrieveGroups(groupRetrieveData, data => { return eB.notify("GROUP_RETRIEVE", data); });
    }
    
    send() { // NOT TESTED
        let groupSendData = {userid: null, groupname: null};
        groupSendData.userid = getData(ACCOUNT_ID);
        groupSendData.groupname = getData(GROUP_SEND_NAME);
        server.rpcSendGroup(groupSendData, data => { return eB.notify("GROUP_SEND", data); });
    }
    
    hide() { // NOT SPECIFIED
        //let commentHideData = {userid: null, commentid: null};
       // commentHideData.userid = getData(ACCOUNT_ID);
      //  commentHideData.commentid = getData(COMMENT_ID);
     //   server.rpcLoginAccount(commentHideData, data => { return eB.notify("COMMENT_HIDE", data); });
    }
}

const groupCtrl = new GroupCtrl();

$(document).ready(function () {
    $(GROUP_RETRIEVE_BUTTON).on("click", groupCtrl.retrieve);
    $(GROUP_SEND_BUTTON).on("click", groupCtrl.send);
//    $(COMMENT_HIDE_BUTTON).on("click", commentCtrl.hide);
});
