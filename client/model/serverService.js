"use strict";

class ServerService {
    constructor() {
        this.serverUrl = "http://localhost:8080/";
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

    rpcRegisterAccount(registerAccountData, callback) { // NOT TESTED
        this.sendingFunc(registerAccountData, "rpcRegisterAccount");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "register/",
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
    
    rpcLoginAccount(loginAccountData, callback) { // NOT TESTED
        this.sendingFunc(loginAccountData, "rpcLoginAccount");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "login/",
            data: JSON.stringify(loginAccountData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcLoginAccount");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcLoginAccount"); 
        });
    }
    
    rpcRetrievePosts(postFilterData, callback) { // NOT TESTED
        this.sendingFunc(postFilterData, "rpcRetrievePosts");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "posts/",
            data: JSON.stringify(postFilterData),
            method: "GET",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcRetrievePosts");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcRetrievePosts"); 
        });
    }
    
    rpcSendPost(postData, callback) { // NOT TESTED
        this.sendingFunc(postData, "rpcSendPost");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "posts/",
            data: JSON.stringify(postData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcSendPost");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcSendPost"); 
        });
    }
    
    rpcHidePost(postData, callback) { // NOT TESTED
        this.sendingFunc(postData, "rpcHidePost");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "posts/hide/",
            data: JSON.stringify(postData),
            method: "DELETE",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcHidePost");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcHidePost"); 
        });
    }
    
    rpcRetrieveComments(commentFilterData, callback) { // NOT TESTED
        this.sendingFunc(commentFilterData, "rpcRetrieveComments");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "comments/",
            data: JSON.stringify(commentFilterData),
            method: "GET",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcRetrieveComments");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcRetrieveComments"); 
        });
    }
    
    rpcSendComment(commentData, callback) { // NOT TESTED
        this.sendingFunc(commentData, "rpcSendComments");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "comments/",
            data: JSON.stringify(commentData),
            method: "GET",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcSendComments");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcSendComments"); 
        });
    }
    
    rpcHideComment(commentData, callback) { // NOT TESTED
        this.sendingFunc(commentData, "rpcHideComment");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "comments/remove/",
            data: JSON.stringify(commentData),
            method: "DELETE",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcHideComment");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcHideComment"); 
        });
    }
    
    rpcRetrieveGroups(groupFilterData, callback) { // NOT TESTED
        this.sendingFunc(groupFilterData, "rpcRetrieveGroups");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "groups/",
            data: JSON.stringify(groupFilterData),
            method: "GET",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcRetrieveGroups");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcRetrieveGroups"); 
        });
    }
    
    rpcSendGroup(groupData, callback) { // NOT TESTED
        this.sendingFunc(groupData, "rpcSendGroup");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "groups/",
            data: JSON.stringify(groupData),
            method: "POST",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcSendGroup");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcSendGroup"); 
        });
    }
    
    rpcRemoveGroup(groupData, callback) { // NOT TESTED
        this.sendingFunc(groupData, "rpcRemoveGroup");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "groups/",
            data: JSON.stringify(groupData),
            method: "DELETE",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcRemoveGroup");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcRemoveGroup"); 
        });
    }
}

// Export object
export const serverService = new ServerService();
