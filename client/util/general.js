"use strict";

import Mustache from 'mustache'
import moment from 'moment';

export function getInput(s) {
    let x = $(s).val();
    return (x === "" ? null : x);
}

export function hasUser() {
    return store.get('user') !== undefined;
}

export function setUser(user) {
    store.set('user', btoa(JSON.stringify(user)));
}

export function getUser() {
    let u = store.get('user');
    if (u == undefined) { 
        return u;
    }
    return JSON.parse(atob(u));
}

export function setTitle(title) {
    document.title = "Flow - " + title;
}

export function validate() {
    for (var i = 0; i < arguments.length; i++) {
        if ($(arguments[i]).length <= 0 || $(arguments[i])[0].checkValidity() === false)
            return false;
    };
    return true;
}

export function getMomentTime(data) {
    return moment(data.toLowerCase(), "MMM DD, YYYY hh:mm:ss a");
}

export function getFancyTimeData(data) {
    let time = data.time;
    data.raw_time = time;
    time = getMomentTime(time);
    data.tooltip_time = time.format("ddd DD MMM YYYY HH:mm");
    time = getFancyTime(time);
    data.time = time;
    return data;
}

export function getFancyTime(time) {
    let yesterday = moment().subtract(1, 'd');
    if (time.isSameOrAfter(yesterday)) {
        time = time.fromNow();
    } else {
        time = time.format("DD MMM YYYY HH:mm");
    }
    return time;
}

var templateCache = {};

export function getTemplate(template, callback) {
    let t = templateCache[template];
    if (t == undefined) {
        $.get(template, function(temp) {
            Mustache.parse(temp);
            templateCache[template] = temp;
            callback(temp);
        });
    } else {
       callback(t);
    }
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// ACTIVE ACCOUNT DATA
export const ACCOUNT_ID = "#account_id";
export const ACCOUNT_NICK = "#account_nick"; // should be added to result in login.

// ACCOUNT INPUT
export const ACCOUNT_LOGIN_EMAIL = "#account_login_email";
export const ACCOUNT_LOGIN_PASSWORD = "#account_login_password";

export const ACCOUNT_REGISTER_EMAIL = "#account_register_email";
export const ACCOUNT_REGISTER_NICK = "#account_register_nick";
export const ACCOUNT_REGISTER_PASSWORD = "#account_register_password";
export const ACCOUNT_REGISTER_PASSWORD_CONFIRM = "#account_register_password_confirm";
export const ACCOUNT_CHANGE_PASSWORD = "#account_change_password";
export const ACCOUNT_CHANGE_PASSWORD_CONFIRM = "#account_change_password_confirm";
export const ACCOUNT_CHANGE_EMAIL = "#account_change_email";
export const ACCOUNT_CHANGE_NICK = "#account_change_nick";

// ACCOUNT BUTTONS
export const ACCOUNT_LOGIN_BUTTON = "#account_login_button";
export const ACCOUNT_LOGOUT_BUTTON = "#account_logout_button";
export const ACCOUNT_REGISTER_BUTTON = "#account_register_button";
export const ACCOUNT_PROFILE_BUTTON = "#account_profile_button";
export const ACCOUNT_UPDATE_INFO_BUTTON = "#account_update_info_button";
export const ACCOUNT_UPDATE_PASSWORD_BUTTON = "#account_update_password_button";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// ACTIVE COMMENT DATA
export const COMMENT_POST_ID = "#comment_post_id";
export const COMMENT_ID = "#comment_id";

// COMMENT INPUT
export const COMMENT_FILTER_POSTID = "#comment_filter_postid";
export const COMMENT_FILTER_TIME = "#comment_filter_time";
export const COMMENT_FILTER_COUNT = "#comment_filter_count";
export const COMMENT_SEND_TEXT = ".comment_send_text";

// COMMENT BUTTONS
export const COMMENT_RETRIEVE_BUTTON = ".comment_retrieve_button";
export const COMMENT_SEND_BUTTON = ".comment_send_button";
export const COMMENT_HIDE_BUTTON = ".comment_hide_button";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// ACTIVE GROUP DATA

// GROUP INPUT
export const GROUP_FILTER_TEXT = "#group_filter_text";
export const GROUP_FILTER_TIME = "#group_filter_time";
export const GROUP_FILTER_COUNT = "#group_filter_count";
export const GROUP_SEND_NAME = "#group_send_name";
export const GROUP_CHANGE_NAME = ".group_change_name";
export const GROUP_INVITE = ".group_invite";

// GROUP BUTTONS
export const GROUP_CREATE_VIEW_BUTTON = "#group_create_view_button";
export const GROUP_INVITE_VIEW_BUTTON = "#group_invite_view_button";
export const GROUP_OWNER_VIEW_BUTTON = "#group_owner_view_button";
export const GROUP_RETRIEVE_BUTTON = ".group_retrieve_button";
export const GROUP_SEND_BUTTON = "#group_send_button";
export const GROUP_CHANGE_NAME_BUTTON = ".group_change_name_button";
export const GROUP_INVITE_BUTTON = ".group_invite_button";
export const GROUP_ACCEPT_INVITE_BUTTON = ".group_accept_invite_button";
export const GROUP_DECLINE_INVITE_BUTTON = ".group_decline_invite_button";
export const GROUP_UPDATE_BUTTON = ".group_update_button";
export const GROUP_LEAVE_BUTTON = "#group_leave_button";
export const GROUP_KICK_BUTTON = "#group_kick_button";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// ACTIVE POST DATA

// POST INPUT
export const POST_FILTER_GROUP = "#post_filter_group";
export const POST_FILTER_TIME = "#post_filter_time";
export const POST_FILTER_COUNT = "#post_filter_count";
export const POST_SEND_GROUP_ID = "#post_send_group_id";
export const POST_SEND_TITLE = "#post_send_title";
export const POST_SEND_TEXT = "#post_send_text";
export const POST_HIDE_ID = "#post_hide_id";

// POST BUTTONS
export const POST_RETRIEVE_BUTTON = ".post_retrieve_button";
export const POST_SEND_BUTTON = "#post_send_button";
export const POST_HIDE_BUTTON = ".post_hide_button";

