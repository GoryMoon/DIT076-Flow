"use strict";

import {
EVENT_ACCOUNT_VIEW_LOGIN,
EVENT_ACCOUNT_VIEW_REGISTER,
EVENT_ACCOUNT_LOGIN,
EVENT_ACCOUNT_REGISTER,
EVENT_ACCOUNT_LOGOUT,
eventBus as eB
} from "../util/eventBus.js"
import setTitle from "../util/general.js"
import Mustache from 'mustache'

class AccountView {
 
    onModelEvent(event, data) {
        switch(event) {
            case EVENT_ACCOUNT_VIEW_LOGIN:
                this.accountViewLogin();
                break;
            case EVENT_ACCOUNT_VIEW_REGISTER:
                this.accountViewRegister();
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
        }
    }

    accountViewLogin() {
        document.title = "Flow - Login"
        $.get('/templates/login.mustache', function(template) {
            var rendered = Mustache.render(template);
            $('#content').html(rendered);
        });
    }

    accountViewRegister() {
        document.title = "Flow - Register"
        $.get('/templates/register.mustache', function(template) {
            var rendered = Mustache.render(template);
            $('#content').html(rendered);
        });
    }

    accountLogin(data) { // NOT TESTED
        
    }

    accountRegister(data) { // NOT TESTED
        
    }

    accountLogout(data) { // NOT TESTED
        
    }

    loadPage() {
        var user = store.get('user');
        if (user != undefined) {
            //TODO add toolbar stuff
        }
    }
}

const accountView = new AccountView();
eB.register(accountView);

$(document).ready(function () {
    accountView.loadPage();
});
