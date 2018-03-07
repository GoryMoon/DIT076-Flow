"use strict";

import {
serverService as server
} from "../model/serverService.js"
import {
    EVENT_GROUP_CREATE_VIEW,
    EVENT_GROUP_INVITE_VIEW,
    EVENT_GROUP_MANAGE_VIEW,
    EVENT_GROUP_GET,
    EVENT_GROUP_POST,
    EVENT_GROUP_PUT,
    EVENT_GROUP_JOIN,
    EVENT_GROUP_LEAVE,
    EVENT_GROUP_INVITE,
    EVENT_GROUP_KICK,
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
    GROUP_CHANGE_NAME,
    GROUP_CREATE_VIEW_BUTTON,
    GROUP_INVITE_VIEW_BUTTON,
    GROUP_OWNER_VIEW_BUTTON,
    GROUP_RETRIEVE_BUTTON,
    GROUP_SEND_BUTTON,
    GROUP_ACCEPT_INVITE_BUTTON,
    GROUP_LEAVE_BUTTON,
    GROUP_CHANGE_NAME_BUTTON,
    GROUP_INVITE_BUTTON,
    GROUP_KICK_BUTTON
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

    manageView() {
        eB.notify(EVENT_GROUP_MANAGE_VIEW);
    }
    
    put(event) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let id = $(event.target).data('id');
        if (validate("#change_name-" + id)) {
            event.preventDefault();
            let putGroupData = {userid: null, id: null, name: null};
            putGroupData.userid = store.get('user').id;
            putGroupData.id = id;
            putGroupData.name = $("#change_name-" + id).val();
            server.rpcPutGroup(putGroupData, data => { 
                eB.notify(EVENT_GROUP_PUT, data);
                this.get(() => {});
            });
        }
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

    kick() { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let leaveGroupData = {userid: null, leaveid: null, id: null};
        leaveGroupData.userid = store.get('user').id;
        let id = $(event.target).data('id');
        leaveGroupData.leaveid = id.id; // id of user to leave or kick
        leaveGroupData.id = id.groupid; // ID OF GROUP THE USER TRIES TO JOIN.
        server.rpcLeaveGroup(leaveGroupData, data => { 
            return eB.notify(EVENT_GROUP_KICK, data);}
        );
    }
    
    invite() { // PROTOCOL 3.1 COMPLIANT - NOT TESTED
        let id = $(event.target).data('id');
        if (validate("#invite_user-" + id)) {
            event.preventDefault();
            let inviteGroupData = {userid: null, inviteid: null, id: null};
            inviteGroupData.userid = store.get('user').id; // id of inviter
            inviteGroupData.invitedid = parseInt($('#invite_user-' + id).val());
            inviteGroupData.id = id; // id of group
            server.rpcInviteGroup(inviteGroupData, data => { return eB.notify(EVENT_GROUP_INVITE, data);});
        }
    }
}

export const groupCtrl = new GroupCtrl();

page('/group', groupCtrl.manageView);

$(document).ready(function () {    
    $(document).on("click", GROUP_CREATE_VIEW_BUTTON, groupCtrl.createView);
    $(document).on("click", GROUP_INVITE_VIEW_BUTTON, groupCtrl.inviteView);
    $(document).on("click", GROUP_SEND_BUTTON, groupCtrl.post);
    $(document).on("click", GROUP_LEAVE_BUTTON, groupCtrl.leave);
    $(document).on("click", GROUP_KICK_BUTTON, groupCtrl.kick);
    $(document).on("click", GROUP_ACCEPT_INVITE_BUTTON, groupCtrl.join);
    $(document).on("click", GROUP_CHANGE_NAME_BUTTON, groupCtrl.put);
    $(document).on("click", GROUP_INVITE_BUTTON, groupCtrl.invite);
});
