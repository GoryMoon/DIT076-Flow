"use strict";

import {
EVENT_ACCOUNT_VIEW_LOGIN,
EVENT_ACCOUNT_VIEW_REGISTER,
EVENT_ACCOUNT_LOGIN,
EVENT_ACCOUNT_REGISTER,
EVENT_ACCOUNT_LOGOUT,
eventBus as eB
} from "../util/eventBus.js"
import { setTitle } from "../util/general.js"
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
        }
    }

    accountViewLogin(ctx) {
        setTitle('Login');
        //TODO optimize with saving of templates?
        $.get('/templates/login.mustache', function(template) {
            var rendered = Mustache.render(template);
            $('#content').html(rendered);
        });
    }

    accountViewRegister(ctx) {
        setTitle('Register');
        $.get('/templates/register.mustache', function(template) {
            var rendered = Mustache.render(template);
            $('#content').html(rendered);
        });
    }

    accountLogin(data) { // NOT TESTED
        store.set('user', data);
    }

    accountRegister(data) { // NOT TESTED
        
    }

    accountLogout(data) { // NOT TESTED
        store.remove('user');
        this.loadPage();
    }

    loadPage() {
        var user = store.get('user');
        if (user != undefined) {
            $.get('/templates/nav-user.mustache', function(template) {
                var rendered = Mustache.render(template, user);
                $(rendered).insertAfter('#nav-user');
            });
        }
    }
}

const accountView = new AccountView();
eB.register(accountView);

$(document).ready(function () {
    accountView.loadPage();
});
