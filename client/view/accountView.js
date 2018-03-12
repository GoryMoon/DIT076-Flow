"use strict";

import {
    EVENT_ACCOUNT_VIEW_LOGIN,
    EVENT_ACCOUNT_VIEW_REGISTER,
    EVENT_ACCOUNT_VIEW,
    EVENT_ACCOUNT_LOGIN,
    EVENT_ACCOUNT_REGISTER,
    EVENT_ACCOUNT_LOGOUT,
    EVENT_ACCOUNT_GET,
    EVENT_ACCOUNT_PUT,
    EVENT_UPDATE_GROUPINFO,
    eventBus as eB
} from "../util/eventBus.js"
import { groupCtrl as gc } from "../control/groupCtrl.js"
import { 
    setTitle, 
    getUser,
    getTemplate, 
    GROUP_UPDATE_BUTTON,
    POST_RETRIEVE_BUTTON
} from "../util/general.js"
import Mustache from 'mustache'

class AccountView {
 
    onModelEvent(event, data) {
        switch(event) {
            case EVENT_ACCOUNT_VIEW_LOGIN:
                this.accountViewLogin(data);
                break;
            case EVENT_ACCOUNT_VIEW_REGISTER:
                this.accountViewRegister(data);
                break;
            case EVENT_ACCOUNT_VIEW:
                this.accountView(data);
                break;
            case EVENT_ACCOUNT_LOGIN:
                this.accountLogin(data);
                break;
            case EVENT_ACCOUNT_REGISTER:
                this.accountRegister(data);
                break;
            case EVENT_ACCOUNT_LOGOUT:
                this.accountLogout(data);
                break;
            case EVENT_ACCOUNT_GET:
                this.accountGet(data);
                break;
            case EVENT_ACCOUNT_PUT:
                this.accountPut(data);
                break;
        }
    }

    accountViewLogin(ctx) {
        setTitle('Login');
        getTemplate('/templates/login.mustache', (template) => $('#content').html(Mustache.render(template)));
    }

    accountViewRegister(ctx) {
        setTitle('Register');
        getTemplate('/templates/register.mustache', (template) => $('#content').html(Mustache.render(template)));
    }

    accountView(data) {
        $("#mainModalTitle").text("Profile");
        getTemplate('/templates/account-profile.mustache', (template) => {
            $('#modal-content').html(Mustache.render(template, data));
            $('#mainModal').modal('show');
        });
    }

    accountLogin(data) {
        this.refreshHeader();
    }

    accountRegister(data) {
        this.refreshHeader();
    }

    accountLogout(data) {        
        this.refreshHeader();
    }
    
    accountGet(data) {}
    
    accountPut(data) {
        this.refreshHeader();
        page(location.pathname);
        $('#mainModal').modal('hide');
        $.notify({
            message: 'Successfully updated info'
        },{
            type: 'success',
            z_index: 1100
        });
    }
    
    updateHeader() {
        $("#nav-group").remove();
        $("#nav-drop").remove();

        var userData = getUser();
        if (userData !== undefined) {
            let groupInfo = gc.getGroupInfo();
            let invites = 0;
            let owner = false;
            for (var i = 0; i < groupInfo.length; i++) {
                if (groupInfo[i].status === 2) {
                    invites++;
                } else if (groupInfo[i].status === 0) {
                    owner = true;
                }
            };
            let data = {user: userData, group: {hasGroups: groupInfo.length > 0,info: groupInfo, isOwner: owner}};
            if (invites > 0) {
                data.group.invites = invites;
            }
            getTemplate('/templates/nav-user.mustache', (template) => $('#navBarNav').append($(Mustache.render(template, data))));
        }
    }

    refreshHeader() {
        gc.get(() => {
            accountView.updateHeader();
        });
    }
}

export const accountView = new AccountView();
eB.register(accountView);
accountView.refreshHeader();

$(document).ready(function () {    
    $(document).on("click", GROUP_UPDATE_BUTTON, accountView.refreshHeader);
});
