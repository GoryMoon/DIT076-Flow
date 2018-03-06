"use strict";

import {
serverService as server
} from "../model/serverService.js"
import {
    EVENT_GROUP_CREATE_VIEW,
    EVENT_GROUP_INVITE_VIEW,
    EVENT_GROUP_OWNER_VIEW,
    EVENT_GROUP_GET,
    EVENT_GROUP_POST,
    EVENT_GROUP_PUT,
    EVENT_GROUP_JOIN,
    EVENT_GROUP_LEAVE,
    EVENT_GROUP_INVITE,
    EVENT_UPDATE_HEADER,
    EVENT_UPDATE_GROUP_INFO,
    eventBus as eB
} from "../util/eventBus.js"
import {
    getInput,
    hasUser,
    validate,
    ACCOUNT_ID,
    GROUP_FILTER_TEXT,
    GROUP_FILTER_TIME,
    GROUP_FILTER_COUNT,
    GROUP_SEND_NAME,
    GROUP_CREATE_VIEW_BUTTON,
    GROUP_INVITE_VIEW_BUTTON,
    GROUP_OWNER_VIEW_BUTTON,
    GROUP_RETRIEVE_BUTTON,
    GROUP_SEND_BUTTON,
    GROUP_ACCEPT_INVITE_BUTTON,
    GROUP_LEAVE_BUTTON
} from "../util/general.js"

class GroupCtrl {

    getGroupInfo() {
        return this.groupInfo;
    }

    get(callback) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        if (hasUser()) {
            let getGroupData = {userid: null, ownerid: null, id: null, name: null, before: null, after: null, count: null};
            getGroupData.userid = store.get('user').id; // used to verify user CAN access this info.
            server.rpcGetGroup(getGroupData, data => { 
                this.groupInfo = data;
                eB.notify(EVENT_GROUP_GET, data);
                eB.notify(EVENT_UPDATE_GROUP_INFO, data);
                callback();
            });
        } else {
            callback();
        }
    }

    createView() {
        eB.notify(EVENT_GROUP_CREATE_VIEW);
    }

    inviteView() {
        eB.notify(EVENT_GROUP_INVITE_VIEW);
    }

    ownerView() {
        eB.notify(EVENT_GROUP_OWNER_VIEW);
    }
    
    put() { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let commentPutData = {userid: null, id: null, name: null};
        commentPutData.userid = store.get('user').id;
        server.rpcPutGroup(commentPutData, data => { return eB.notify(EVENT_GROUP_PUT, data); });
    }
    
    post(event) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        if (validate(GROUP_SEND_NAME)) {
            event.preventDefault();
            let postGroupData = {userid: null, name: null};
            postGroupData.userid = store.get('user').id;
            postGroupData.name = getInput(GROUP_SEND_NAME);
            server.rpcPostGroup(postGroupData, data => { 
                eB.notify(EVENT_GROUP_POST, data);
                this.get(() => {});
            });
        }
    }
    
    join(event) { // PROTOCOL 3.1 COMPLIANT - NOT TESTED
        let joinGroupData = {userid: null, id: null};
        joinGroupData.userid = store.get('user').id;
        joinGroupData.id = $(event.target).data('id'); // ID OF GROUP THE USER TRIES TO JOIN.
        server.rpcJoinGroup(joinGroupData, data => { 
            return eB.notify(EVENT_GROUP_JOIN, data);}
        );
    }
    
    leave() { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let leaveGroupData = {userid: null, leaveid: null, id: null};
        leaveGroupData.userid = store.get('user').id;
        leaveGroupData.leaveid = store.get('user').id; // id of user to leave or kick
        leaveGroupData.id = $(event.target).data('id'); // ID OF GROUP THE USER TRIES TO JOIN.
        server.rpcLeaveGroup(leaveGroupData, data => { 
            return eB.notify(EVENT_GROUP_LEAVE, data);}
        );
    }
    
    invite() { // PROTOCOL 3.1 COMPLIANT - NOT TESTED
        let inviteGroupData = {userid: null, inviteid: null, id: null};
        inviteGroupData.userid = store.get('user').id; // id of inviter
        inviteGroupData.inviteid = 0; // id of user to be invited
        inviteGroupData.id = 0; // id of group
        server.rpcInviteGroup(inviteGroupData, data => { return eB.notify(EVENT_GROUP_INVITE, data);});
    }
}

export const groupCtrl = new GroupCtrl();

$(document).ready(function () {    
    $(document).on("click", GROUP_CREATE_VIEW_BUTTON, groupCtrl.createView);
    $(document).on("click", GROUP_INVITE_VIEW_BUTTON, groupCtrl.inviteView);
    $(document).on("click", GROUP_OWNER_VIEW_BUTTON, groupCtrl.ownerView);
    $(document).on("click", GROUP_SEND_BUTTON, groupCtrl.post);
    $(document).on("click", GROUP_LEAVE_BUTTON, groupCtrl.leave);
    $(document).on("click", GROUP_ACCEPT_INVITE_BUTTON, groupCtrl.join);
   // $(GROUP_RETRIEVE_BUTTON).on("click", groupCtrl.retrieve);
   // $(GROUP_SEND_BUTTON).on("click", groupCtrl.send);
//    $(COMMENT_HIDE_BUTTON).on("click", commentCtrl.hide);
});
