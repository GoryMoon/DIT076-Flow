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
eventBus as eB
} from "../util/eventBus.js"
import {
getData,
ACCOUNT_LOGIN_EMAIL,
ACCOUNT_LOGIN_PASSWORD,
ACCOUNT_REGISTER_EMAIL,
ACCOUNT_REGISTER_NICK,
ACCOUNT_REGISTER_PASSWORD,
ACCOUNT_ID,
ACCOUNT_LOGIN_BUTTON,
ACCOUNT_REGISTER_BUTTON,
ACCOUNT_LOGOUT_BUTTON
} from "../util/general.js"

class AccountCtrl {
    viewLogin() {
        eB.notify(EVENT_ACCOUNT_VIEW_LOGIN);
    }

    viewRegister() {
        eB.notify(EVENT_ACCOUNT_VIEW_REGISTER);
    }

    login() { // NOT TESTED
        let accountLoginData = {email: null, password: null};
        accountLoginData.email = getData(ACCOUNT_LOGIN_EMAIL);
        accountLoginData.password = getData(ACCOUNT_LOGIN_PASSWORD);
        server.rpcLoginAccount(accountLoginData, data => { return eB.notify(EVENT_ACCOUNT_LOGIN, data); });
    }
    
    register() { // NOT TESTED
        let accountRegisterData = {email: null, nick: null, password: null};
        accountRegisterData.email = getData(ACCOUNT_REGISTER_EMAIL);
        accountRegisterData.nick = getData(ACCOUNT_REGISTER_NICK);
        accountRegisterData.password = getData(ACCOUNT_REGISTER_PASSWORD);
        server.rpcRegisterAccount(accountRegisterData, data => { return eB.notify(EVENT_ACCOUNT_REGISTER, data); });
    }
    
    logout() { // NOT TESTED
        let accountLogoutData = {id: null};
        accountLogoutData.id = getData(ACCOUNT_ID);
//        server.rpcLoginAccount(accountLogoutData, data => { return eB.notify("ACCOUNT_LOGOUT", data); });
        eB.notify(EVENT_ACCOUNT_LOGOUT, accountLogoutData); // Logout is client-side
    }
}

const accountCtrl = new AccountCtrl();

page('/login', accountCtrl.viewLogin);
page('/register', accountCtrl.viewRegister);

$(document).ready(function () {
    $(ACCOUNT_LOGIN_BUTTON).on("click", accountCtrl.login);
    $(ACCOUNT_REGISTER_BUTTON).on("click", accountCtrl.register);
    $(ACCOUNT_LOGOUT_BUTTON).on("click", accountCtrl.logout);
});