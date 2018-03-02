"use strict";

export function getInput(s) {
    let x = $(s).val();
    return (x === "" ? null : x);
}

export function hasUser() {
    return store.get('user') !== undefined;
}

export function setTitle(title) {
    document.title = "Flow - " + title;
}

export function validate() {
    for (var i = 0; i < arguments.length; i++) {
        if ($(arguments[i])[0].checkValidity() === false)
            return false;
    };
    return true;
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

// ACCOUNT BUTTONS
export const ACCOUNT_LOGIN_BUTTON = "#account_login_button";
export const ACCOUNT_LOGOUT_BUTTON = "#account_logout_button";
export const ACCOUNT_REGISTER_BUTTON = "#account_register_button";

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
export const COMMENT_SEND_TEXT = "#comment_send_text";

// COMMENT BUTTONS
export const COMMENT_RETRIEVE_BUTTON = "#comment_retrieve_button";
export const COMMENT_SEND_BUTTON = "#comment_send_button";
export const COMMENT_HIDE_BUTTON = "#comment_hide_button";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// ACTIVE GROUP DATA

// GROUP INPUT
export const GROUP_FILTER_TEXT = "#group_filter_text";
export const GROUP_FILTER_TIME = "#group_filter_time";
export const GROUP_FILTER_COUNT = "#group_filter_count";
export const GROUP_SEND_NAME = "#group_send_name";

// GROUP BUTTONS
export const GROUP_RETRIEVE_BUTTON = "#group_retrieve_button";
export const GROUP_SEND_BUTTON = "#group_send_button";

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
export const POST_RETRIEVE_BUTTON = "#post_retrieve_button";
export const POST_SEND_BUTTON = "#post_send_button";
export const POST_HIDE_BUTTON = "#post_hide_button";

