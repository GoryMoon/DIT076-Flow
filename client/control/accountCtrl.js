"use strict";

import {
serverService as server
} from "../model/serverService.js"
import {
EVENT_ACCOUNT_VIEW_LOGIN,
EVENT_ACCOUNT_VIEW_REGISTER,
EVENT_ACCOUNT_LOGIN,
EVENT_ACCOUNT_REGISTER,
EVENT_ACCOUNT_LOGOUT,
EVENT_ACCOUNT_GET,
EVENT_ACCOUNT_PUT,
eventBus as eB
} from "../util/eventBus.js"
import {
getInput,
validate,
ACCOUNT_LOGIN_EMAIL,
ACCOUNT_LOGIN_PASSWORD,
ACCOUNT_REGISTER_EMAIL,
ACCOUNT_REGISTER_NICK,
ACCOUNT_REGISTER_PASSWORD,
ACCOUNT_REGISTER_PASSWORD_CONFIRM,
ACCOUNT_LOGIN_BUTTON,
ACCOUNT_REGISTER_BUTTON,
ACCOUNT_LOGOUT_BUTTON
} from "../util/general.js"

class AccountCtrl {
    viewLogin(ctx) {
        eB.notify(EVENT_ACCOUNT_VIEW_LOGIN, ctx);
    }

    viewRegister(ctx) {
        eB.notify(EVENT_ACCOUNT_VIEW_REGISTER, ctx);
    }
    
    get() { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let accountGetData = {userid: null, groupid: null, id: null, email: null, nick: null, count: null};
        accountGetData.userid = store.get('user').id; // verify this user CAN access this information.
        server.rpcGetAccount(accountGetData, data => { eB.notify(EVENT_ACCOUNT_GET, data); });
    }

    login(event) { // PROTOCOL 3.0 COMPLIANT - TODO CLEANUP - NOT TESTED
        if (validate(ACCOUNT_LOGIN_EMAIL, ACCOUNT_LOGIN_PASSWORD)) {
            event.preventDefault();
            let accountLoginData = {email: null, password: null};
            accountLoginData.email = getInput(ACCOUNT_LOGIN_EMAIL);
            accountLoginData.password = getInput(ACCOUNT_LOGIN_PASSWORD);
            server.rpcLoginAccount(accountLoginData, data => { 
                store.set('user', data);
                eB.notify(EVENT_ACCOUNT_LOGIN, data);
                page('/');
            });
        }
    }
    
    put() { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        let accountPutData = {userid: null, id: null, email: null, nick: null, password: null};
        accountPutData.userid = store.get('user').id; // id of editor.
        accountPutData.id = store.get('user').id;   // id of account to be modified.
        server.rpcPutAccount(accountPutData, data => { eB.notify(EVENT_ACCOUNT_PUT, data); });
    }
    
    register(event) { // PROTOCOL 3.0 COMPLIANT - TODO CLEANUP - NOT TESTED
        if (validate(ACCOUNT_REGISTER_EMAIL, ACCOUNT_REGISTER_NICK, ACCOUNT_REGISTER_PASSWORD, ACCOUNT_REGISTER_PASSWORD_CONFIRM)) {
            event.preventDefault();
            let accountRegisterData = {email: null, nick: null, password: null};
            accountRegisterData.email = getInput(ACCOUNT_REGISTER_EMAIL);
            accountRegisterData.nick = getInput(ACCOUNT_REGISTER_NICK);
            accountRegisterData.password = getInput(ACCOUNT_REGISTER_PASSWORD);
            server.rpcRegisterAccount(accountRegisterData, data => {
                eB.notify(EVENT_ACCOUNT_REGISTER, data);
                page('/');
            });
        }
    }
    
    logout() { // PROTOCOL 3.0 COMPLIANT - TODO CLEANUP - NOT TESTED
        event.preventDefault();
        //let accountLogoutData = {id: null};
        //accountLogoutData.id = getInput(ACCOUNT_ID);
//        server.rpcLoginAccount(accountLogoutData, data => { return eB.notify("ACCOUNT_LOGOUT", data); });
        store.remove('user');
        eB.notify(EVENT_ACCOUNT_LOGOUT); // Logout is client-side
        page('/');
    }
}

const accountCtrl = new AccountCtrl();

page('/login', accountCtrl.viewLogin);
page('/register', accountCtrl.viewRegister);

$(document).ready(function () {
    $(document).on("click", ACCOUNT_LOGIN_BUTTON, accountCtrl.login);
    $(document).on("click", ACCOUNT_REGISTER_BUTTON, accountCtrl.register);
    $(document).on("click", ACCOUNT_LOGOUT_BUTTON, accountCtrl.logout);
 //   $(ACCOUNT_LOGIN_BUTTON).on("click", accountCtrl.login);
 //   $(ACCOUNT_REGISTER_BUTTON).on("click", accountCtrl.register);
 //   $(ACCOUNT_LOGOUT_BUTTON).on("click", accountCtrl.logout);
});