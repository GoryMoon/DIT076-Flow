"use strict";

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
import { setTitle, getTemplate } from "../util/general.js"
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

    accountLogin(data) {
        this.refreshHeader();
    }

    accountRegister(data) {
        this.refreshHeader();
    }

    accountLogout(data) {        
        this.refreshHeader();
    }
    
    accountGet(data) {
        console.log("Unused event sent: EVENT_ACCOUNT_GET, with data: " + JSON.stringify(data));
    }
    
    accountPut(data) {
        console.log("Unused event sent: EVENT_ACCOUNT_PUT, with data: " + JSON.stringify(data));
    }

    refreshHeader() {
        var user = store.get('user');
        if (user !== undefined) {
            getTemplate('/templates/nav-user.mustache', (template) => $(Mustache.render(template, user)).insertAfter('#nav-user'));
        } else {
            $("#nav-group").remove();
            $("#nav-drop").remove();
        }
    }
}

const accountView = new AccountView();
eB.register(accountView);
accountView.refreshHeader();
