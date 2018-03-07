"use strict";

class ServerService {
    constructor() {
        this.serverUrl = "http://localhost:8080/api/";
        this.errorFunc = function(msg, ajaxOpt, thrownError, funcName) {
            console.log("Failiure in \"" + funcName + "\"");
            console.log("Error Message: " + JSON.stringify(msg));
            console.log("Ajax Options: " + ajaxOpt);
            console.log("Thrown Error: " + thrownError);
        };
        this.successFunc = function(data, funcName) {
            console.log("Request succeded for \"" + funcName + "\"");
            console.log("Response: " + JSON.stringify(data));
        };
        this.sendingFunc = function(data, funcName) {
            console.log("Sent request \"" + funcName + "\"");
            console.log("Data sent: " + JSON.stringify(data));
        };
        
    }

    rpcGetAccount(getAccountData, callback) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        this.sendingFunc(getAccountData, "rpcGetAccount");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "account/get/",
            data: JSON.stringify(getAccountData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcGetAccount");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcGetAccount"); 
        });
    }
    
    rpcLoginAccount(loginAccountData, callback) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        this.sendingFunc(loginAccountData, "rpcLoginAccount");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "account/login/",
            data: JSON.stringify(loginAccountData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcLoginAccount");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) {
            if (ajaxOpt == 401) {
                $.notify({
                    message: 'Email or password was wrong. Try again' 
                },{
                    type: 'danger'
                });
            } else if (ajaxOpt == 'error') {
                $.notify({
                    message: 'Can\'t reach the server. Try again later' 
                },{
                    type: 'warning'
                });
            }
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcLoginAccount"); 
        });
    }
    
    rpcPutAccount(putAccountData, callback) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        this.sendingFunc(putAccountData, "rpcPutAccount");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "account/login/",
            data: JSON.stringify(putAccountData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcPutAccount");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcPutAccount"); 
        });
    }
    
    rpcRegisterAccount(registerAccountData, callback) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        this.sendingFunc(registerAccountData, "rpcRegisterAccount");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "account/register/",
            data: JSON.stringify(registerAccountData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcRegisterAccount");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcRegisterAccount"); 
        });
    }
    
    rpcGetComment(commentGetData, callback) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        this.sendingFunc(commentGetData, "rpcGetComment");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "comment/get/",
            data: JSON.stringify(commentGetData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcGetComment");
            callback(data);
        }).fail((msg, ajaxOpt, thrownError) => { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcGetComment"); 
        });
    }
    
    rpcPutComment(commentData, callback) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        this.sendingFunc(commentData, "rpcPutComment");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "comment/put/",
            data: JSON.stringify(commentData),
            method: "PUT",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcPutComment");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcPutComment"); 
        });
    }
    
    rpcPostComment(commentPostData, callback) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        this.sendingFunc(commentPostData, "rpcPostComment");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "comment/post/",
            data: JSON.stringify(commentPostData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcPostComment");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcPostComment"); 
        });
    }
    
    rpcGetGroup(groupFilterData, callback) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        this.sendingFunc(groupFilterData, "rpcGetGroup");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "group/get/",
            data: JSON.stringify(groupFilterData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcGetGroup");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcGetGroup"); 
        });
    }
    
    rpcPutGroup(groupData, callback) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        this.sendingFunc(groupData, "rpcPutGroup");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "group/put/",
            data: JSON.stringify(groupData),
            method: "PUT",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcPutGroup");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcPutGroup"); 
        });
    }
    
    rpcPostGroup(groupData, callback) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        this.sendingFunc(groupData, "rpcPostGroup");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "group/post/",
            data: JSON.stringify(groupData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcPostGroup");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcPostGroup"); 
        });
    }
    
    rpcJoinGroup(groupData, callback) { // PROTOCOL 3.1 COMPLIANT - NOT TESTED
        this.sendingFunc(groupData, "rpcJoinGroup");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "group/join/",
            data: JSON.stringify(groupData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcJoinGroup");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcJoinGroup"); 
        });
    }
    
    rpcLeaveGroup(groupData, callback) { // PROTOCOL 3.0 COMPLIANT - NOT TESTED
        this.sendingFunc(groupData, "rpcLeaveGroup");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "group/leave/",
            data: JSON.stringify(groupData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcLeaveGroup");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcLeaveGroup"); 
        });
    }
    
    rpcInviteGroup(groupData, callback) { // PROTOCOL 3.1 COMPLIANT - NOT TESTED
        this.sendingFunc(groupData, "rpcInviteGroup");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "group/invite/",
            data: JSON.stringify(groupData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcInviteGroup");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) {
            if (ajaxOpt == 'error') {
                $.notify({
                    message: 'Couldn\'t find a user with that id'
                },{
                    type: 'danger'
                });
            };
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcInviteGroup"); 
        });
    }
    
    rpcGetPost(postFilterData, callback) { // PROTOCOL 3.1 COMPLIANT - NOT TESTED
        this.sendingFunc(postFilterData, "rpcGetPost");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "post/get/",
            data: JSON.stringify(postFilterData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcGetPost");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcGetPost"); 
        });
    }
    
    rpcPutPost(postData, callback) { // PROTOCOL 3.1 COMPLIANT - NOT TESTED
        this.sendingFunc(postData, "rpcPutPost");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "post/put/",
            data: JSON.stringify(postData),
            method: "PUT",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcPutPost");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcPutPost"); 
        });
    }
    
    rpcPostPost(postData, callback) { // PROTOCOL 3.1 COMPLIANT - NOT TESTED
        this.sendingFunc(postData, "rpcPostPost");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "post/post/",
            data: JSON.stringify(postData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcPostPost");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcPostPost"); 
        });
    }
}

// Export object
export const serverService = new ServerService();
