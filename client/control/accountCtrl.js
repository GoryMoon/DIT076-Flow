"use strict";

import {
serverService as server
} from "../model/serverService.js"
import {
EVENT_ACCOUNT_VIEW_LOGIN,
EVENT_ACCOUNT_VIEW_REGISTER,
EVENT_ACCOUNT_VIEW,
EVENT_ACCOUNT_LOGIN,
EVENT_ACCOUNT_REGISTER,
EVENT_ACCOUNT_LOGOUT,
EVENT_ACCOUNT_GET,
EVENT_ACCOUNT_PUT,
eventBus as eB
} from "../util/eventBus.js"
import {
getInput,
getUser,
setUser,
validate,
ACCOUNT_LOGIN_EMAIL,
ACCOUNT_LOGIN_PASSWORD,
ACCOUNT_REGISTER_EMAIL,
ACCOUNT_REGISTER_NICK,
ACCOUNT_REGISTER_PASSWORD,
ACCOUNT_REGISTER_PASSWORD_CONFIRM,
ACCOUNT_LOGIN_BUTTON,
ACCOUNT_REGISTER_BUTTON,
ACCOUNT_LOGOUT_BUTTON,
ACCOUNT_PROFILE_BUTTON,
ACCOUNT_UPDATE_INFO_BUTTON,
ACCOUNT_UPDATE_PASSWORD_BUTTON,
ACCOUNT_CHANGE_PASSWORD,
ACCOUNT_CHANGE_PASSWORD_CONFIRM,
ACCOUNT_CHANGE_EMAIL,
ACCOUNT_CHANGE_NICK
} from "../util/general.js"

class AccountCtrl {
    viewLogin(event) {
        eB.notify(EVENT_ACCOUNT_VIEW_LOGIN, event);
    }

    viewRegister(event) {
        eB.notify(EVENT_ACCOUNT_VIEW_REGISTER, event);
    }

    viewAccount() {
        let accountGetData = {userid: null, groupid: null, id: null, email: null, nick: null, count: null};
        accountGetData.userid = getUser().id; // verify this user CAN access this information.
        accountGetData.id = getUser().id;
        server.rpcGetAccount(accountGetData, data => {
            eB.notify(EVENT_ACCOUNT_VIEW, data);
        });
    }
    
    get(groupid) {
        let accountGetData = {userid: null, groupid: null, id: null, email: null, nick: null, count: null};
        accountGetData.userid = getUser().id; // verify this user CAN access this information.
        accountGetData.groupid = groupid;
        server.rpcGetAccount(accountGetData, data => { eB.notify(EVENT_ACCOUNT_GET, {id: groupid, users: data}); });
    }

    login(event) {
        if (validate(ACCOUNT_LOGIN_EMAIL, ACCOUNT_LOGIN_PASSWORD)) {
            event.preventDefault();
            let accountLoginData = {email: null, password: null};
            accountLoginData.email = getInput(ACCOUNT_LOGIN_EMAIL);
            accountLoginData.password = getInput(ACCOUNT_LOGIN_PASSWORD);
            server.rpcLoginAccount(accountLoginData, data => { 
                setUser(data);
                eB.notify(EVENT_ACCOUNT_LOGIN, data);
                page('/');
            });
        }
    }
    
    updateInfo(event) {
        if (validate(ACCOUNT_CHANGE_EMAIL, ACCOUNT_CHANGE_NICK)) {
            event.preventDefault();
            let accountPutData = {userid: null, id: null, email: null, nick: null, password: null};
            accountPutData.userid = getUser().id; // id of editor.
            accountPutData.id = getUser().id;   // id of account to be modified.
            accountPutData.email = getInput(ACCOUNT_CHANGE_EMAIL);
            accountPutData.nick = getInput(ACCOUNT_CHANGE_NICK);
            server.rpcPutAccount(accountPutData, data => { 
                setUser(data);
                eB.notify(EVENT_ACCOUNT_PUT, data);
            });
        }
    }

    updatePassword(event) {
        if (validate(ACCOUNT_CHANGE_PASSWORD, ACCOUNT_CHANGE_PASSWORD_CONFIRM)) {
            event.preventDefault();
            let accountPutData = {userid: null, id: null, email: null, nick: null, password: null};
            accountPutData.userid = getUser().id; // id of editor.
            accountPutData.id = getUser().id;   // id of account to be modified.
            accountPutData.password = getInput(ACCOUNT_CHANGE_PASSWORD);
            server.rpcPutAccount(accountPutData, data => { eB.notify(EVENT_ACCOUNT_PUT, data); });
        }
    }
    
    register(event) {
        if (validate(ACCOUNT_REGISTER_EMAIL, ACCOUNT_REGISTER_NICK, ACCOUNT_REGISTER_PASSWORD, ACCOUNT_REGISTER_PASSWORD_CONFIRM)) {
            event.preventDefault();
            let accountRegisterData = {email: null, nick: null, password: null};
            accountRegisterData.email = getInput(ACCOUNT_REGISTER_EMAIL);
            accountRegisterData.nick = getInput(ACCOUNT_REGISTER_NICK);
            accountRegisterData.password = getInput(ACCOUNT_REGISTER_PASSWORD);
            server.rpcRegisterAccount(accountRegisterData, data => {
                setUser(data);
                eB.notify(EVENT_ACCOUNT_REGISTER, data);
                page('/');
            });
        }
    }
    
    logout() {
        event.preventDefault();
        store.remove('user');
        eB.notify(EVENT_ACCOUNT_LOGOUT); // Logout is client-side
        page('/');
    }
}

export const accountCtrl = new AccountCtrl();

page('/login', accountCtrl.viewLogin);
page('/register', accountCtrl.viewRegister);

$(document).ready(function () {
    $(document).on("click", ACCOUNT_LOGIN_BUTTON, accountCtrl.login);
    $(document).on("click", ACCOUNT_REGISTER_BUTTON, accountCtrl.register);
    $(document).on("click", ACCOUNT_LOGOUT_BUTTON, accountCtrl.logout);
    $(document).on("click", ACCOUNT_PROFILE_BUTTON, accountCtrl.viewAccount);
    $(document).on("click", ACCOUNT_UPDATE_INFO_BUTTON, accountCtrl.updateInfo);
    $(document).on("click", ACCOUNT_UPDATE_PASSWORD_BUTTON, accountCtrl.updatePassword);
});