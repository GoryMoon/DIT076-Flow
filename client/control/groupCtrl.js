"use strict";

import {
serverService as server
} from "../model/serverService.js"
import {
EVENT_GROUP_GET,
EVENT_GROUP_POST,
EVENT_GROUP_PUT,
EVENT_GROUP_JOIN,
EVENT_GROUP_INVITE,
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
    get() { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let getGroupData = {userid: null, ownerid: null, id: null, name: null, before: null, after: null, count: null};
        getGroupData.userid = store.get('user').id; // used to verify user CAN access this info.
        server.rpcGetGroup(getGroupData, data => { return eB.notify(EVENT_GROUP_GET, data); });
    }
    
    put() { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let commentPutData = {userid: null, id: null, name: null};
        commentPutData.userid = store.get('user').id;
        server.rpcPutGroup(commentPutData, data => { return eB.notify(EVENT_GROUP_PUT, data); });
    }
    
    post() { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let postGroupData = {userid: null, name: null};
        postGroupData.userid = store.get('user').id;
        postGroupData.name = getData(GROUP_SEND_NAME);
        server.rpcPostGroup(postGroupData, data => { return eB.notify(EVENT_GROUP_POST, data); });
    }
    
    join() { // PROTOCOL 3.1 COMPLIANT - NOT TESTED
        let joinGroupData = {userid: null, id: null};
        joinGroupData.userid = store.get('user').id;
        joinGroupData.id = 0; // ID OF GROUP THE USER TRIES TO JOIN.
        server.rpcJoinGroup(joinGroupData, data => { return eB.notify(EVENT_GROUP_JOIN, data);});
    }
    
    invite() { // PROTOCOL 3.1 COMPLIANT - NOT TESTED
        let inviteGroupData = {userid: null, inviteid: null, id: null};
        inviteGroupData.userid = store.get('user').id; // id of inviter
        inviteGroupData.inviteid = 0; // id of user to be invited
        inviteGroupData.id = 0; // id of group
        server.rpcInviteGroup(inviteGroupData, data => { return eB.notify(EVENT_GROUP_INVITE, data);});
    }
}

const groupCtrl = new GroupCtrl();

$(document).ready(function () {
    
    $(document).on("click", GROUP_RETRIEVE_BUTTON, groupCtrl.get);
    $(document).on("click", GROUP_SEND_BUTTON, groupCtrl.post);
   // $(GROUP_RETRIEVE_BUTTON).on("click", groupCtrl.retrieve);
   // $(GROUP_SEND_BUTTON).on("click", groupCtrl.send);
//    $(COMMENT_HIDE_BUTTON).on("click", commentCtrl.hide);
});
