"use strict";

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
eventBus as eB
} from "../util/eventBus.js"
import { getTemplate } from "../util/general.js"
import { groupCtrl as gc } from "../control/groupCtrl.js"
import { accountView as av } from "../view/accountView.js"
import Mustache from 'mustache'

class GroupView {
 
    onModelEvent(event, data) {
        switch(event) {
            case EVENT_GROUP_CREATE_VIEW:
                this.groupCreateView();
                break;
            case EVENT_GROUP_INVITE_VIEW:
                this.groupInviteView();
                break;
            case EVENT_GROUP_OWNER_VIEW:
                this.groupOwnerView();
                break;
            case EVENT_GROUP_GET:
                this.groupGet(data);
                break;
            case EVENT_GROUP_POST:
                this.groupPost(data);
                break;
            case EVENT_GROUP_PUT:
                this.groupPut(data);
                break;
            case EVENT_GROUP_JOIN:
                this.groupJoin(data);
                break;
            case EVENT_GROUP_LEAVE:
                this.groupLeave(data);
                break;
            case EVENT_GROUP_INVITE:
                this.groupInvite(data);
                break;
        }
    }

    groupCreateView() {
        $("#groupModalTitle").text("Create Group");
        getTemplate('/templates/create-group.mustache', (template) => {
            $('#modal-content').html(Mustache.render(template));
            $('#groupModal').modal('show');
            $('#groupModal').on('shown.bs.modal', function () {
                $('#group_send_name').trigger('focus')
            });
        });
    }
    
    groupInviteView() {
        gc.get(() => {
            av.updateHeader();
            $("#groupModalTitle").text("Group Invites");
            getTemplate('/templates/invite-group.mustache', (template) => {
                let info = gc.getGroupInfo();
                let inviteList = [];
                for (var i = 0; i < info.length; i++) {
                    if (info[i].status == 2) {
                        inviteList.push(info[i]);
                    }
                };
                $('#modal-content').html(Mustache.render(template, { invites: inviteList}));
                
                $('#groupModal').modal('show');
            });
        });
    }

    groupOwnerView() {
        $("#groupModalTitle").text("Manage Group");
        getTemplate('/templates/owner-group.mustache', (template) => {
            $('#modal-content').html(Mustache.render(template));
            
            $('#groupModal').modal('show');
        });
    }

    groupGet(data) {}
    
    groupPost(data) {
        $('#groupModal').modal('hide');
    }
    
    groupPut(data) {
        console.log("Unused event sent: EVENT_GROUP_PUT, with data: " + JSON.stringify(data));
    }
    
    groupJoin(data) {
        $('.group-invite-' + data.id).parent().remove();
        let list = $('#group-invite-list');
        if (list.children().length === 0) {
            $('#groupModal').modal('hide');
        }
        av.refreshHeader();
    }
    
    groupLeave(data) {
        console.log("Unused event sent: EVENT_GROUP_PUT, with data: " + JSON.stringify(data));
    }
    
    groupInvite(data) {
        console.log("Unused event sent: EVENT_GROUP_INVITE, with data: " + JSON.stringify(data));
    }
  
}

const groupView = new GroupView();
eB.register(groupView);

$('#groupModal').on('hidden.bs.modal', function (e) {
    $('#modal-content').empty();
    $("#groupModalTitle").text("Group");
})

