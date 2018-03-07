"use strict";

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
EVENT_ACCOUNT_GET,
eventBus as eB
} from "../util/eventBus.js"
import { getTemplate } from "../util/general.js"
import { groupCtrl as gc } from "../control/groupCtrl.js"
import { accountView as av } from "../view/accountView.js"
import { accountCtrl as ac } from "../control/accountCtrl.js"
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
            case EVENT_GROUP_MANAGE_VIEW:
                this.groupManageView();
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
            case EVENT_GROUP_KICK:
                this.groupKick(data);
                break;
            case EVENT_GROUP_INVITE:
                this.groupInvite(data);
                break;
            case EVENT_ACCOUNT_GET:
                this.accountGet(data);
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
        $("#groupModalTitle").text("Group Invites");
        gc.get(() => {
            av.updateHeader();
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

    groupManageView() {
        gc.get(() => {
            getTemplate('/templates/manage-group.mustache', (template) => {
                let info = gc.getGroupInfo();

                let leaveList = [];
                let ownerList = [];
                for (var i = 0; i < info.length; i++) {
                    if (info[i].status === 1) {
                        leaveList.push(info[i]);
                    }
                    if (info[i].status === 0) {
                        ownerList.push(info[i]);
                    }
                }
                $('#content').html(Mustache.render(template, {leave: leaveList, isOwner: ownerList.length > 0, owner: ownerList}));
                $('#leaveModal').on('show.bs.modal', (event) => {
                    let button = $(event.relatedTarget);
                    let id = button.data('id');
                    let name = button.data('name');

                    let modal = $(event.target);
                    modal.find('#leaveModalGroupName').text(name);
                    modal.find('#group_leave_button').data("id", id);
                });
                $('#kickModal').on('show.bs.modal', (event) => {
                    let button = $(event.relatedTarget);
                    let id = button.data('id');
                    let name = button.data('nick');
                    let groupid = $(event.relatedTarget).parents('.card').data('id');

                    let modal = $(event.target);
                    modal.find('#kickModalUserName').text(name);
                    modal.find('#group_kick_button').data("id", {id: id, groupid: groupid});
                });

                $(".show_hide.user_link.outer").click((event) => {
                    let self = $(event.target);
                    let drawer = self.next();
                    if (drawer.hasClass('show')) {
                        self.html("Show Users <i class=\"fas fa-angle-down\"></i>");
                    } else {
                        if (drawer.children('.users').children().length == 0) {
                            ac.get(self.data("id"));
                        }
                        self.html("Hide Users <i class=\"fas fa-angle-up\"></i>");
                    }
                    drawer.collapse('toggle');
                });
                //Bottom hide users button
                $(".show_hide.user_link.inner").click((event) => {
                    let drawer = $(event.target).parent();
                    if (drawer.hasClass('show')) {
                        drawer.prev().html("Show Users <i class=\"fas fa-angle-down\"></i>");
                    } else {
                        drawer.prev().html("Hide Users <i class=\"fas fa-angle-up\"></i>");
                    }
                    drawer.collapse('hide');
                });
            });
        });
    }

    accountGet(data) {
        let users = $('#groupid-' + data.id + ' .users');
        users.empty();
        getTemplate('/templates/user.mustache', (template) => {
            if (data.users.length == 0) {
                users.html('<div class="no-comment"><small>No Users</small></div>');
            } else {
                for (var i = 0; i < data.users.length; i++) {
                    var rendered = Mustache.render(template, data.users[i]);
                    users.append(rendered);
                }
            }
            $('[data-toggle="tooltip"]').tooltip();
        });
    }

    groupGet(data) {}
    
    groupPost(data) {
        av.refreshHeader();
        $('#groupModal').modal('hide');
        if (location.pathname == '/group') {
            page('/group');
        }
    }
    
    groupPut(data) {
        av.refreshHeader();
    }
    
    groupJoin(data) {
        $('.group-invite-' + data.id).parent().remove();
        if ($('#group-invite-list').children().length === 0) {
            $('#groupModal').modal('hide');
        }
        av.refreshHeader();
    }
    
    groupLeave(data) {
        av.refreshHeader();
        $('.group-leave-' + data.id).parent().remove();
        if ($('#group-leave-list').children().length === 0) {
            $('#group-leave-list').html('<li class="list-group-item">No group to leave</li>');
        }
        $('#leaveModal').modal('hide');
    }

    groupKick(data) {
        $('.group-kick-' + data.leaveid).parent().remove();
        if (data.leaveid == store.get('user').id) {
            $('#groupid-{{id}}').remove();
        }
        $('#kickModal').modal('hide');

        $.notify({
            message: 'Kick was successfullt'
        },{
            type: 'success'
        });
    }
    
    groupInvite(data) {
        $("#invite_user-" + data.id).val("");
        $.notify({
            message: 'You have invited ' + data.nick 
        },{
            type: 'success'
        });
    }
  
}

const groupView = new GroupView();
eB.register(groupView);

$('#groupModal').on('hidden.bs.modal', function (e) {
    $('#modal-content').empty();
    $("#groupModalTitle").text("Group");
})

