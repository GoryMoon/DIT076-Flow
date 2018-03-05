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

    rpcRegisterAccount(registerAccountData, callback) { // NOT TESTED
        this.sendingFunc(registerAccountData, "rpcRegisterAccount");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "user/register/",
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
            url: this.serverUrl + "user/login/",
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
    
    rpcGetPost(postFilterData, callback) { // NOT TESTED
        this.sendingFunc(postFilterData, "rpcGetPost");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "post/",
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
    
    rpcPostPost(postData, callback) { // NOT TESTED
        this.sendingFunc(postData, "rpcPostPost");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "post/create?title=" + postData.title + "&text=" + postData.text + "&userGroupId=" + postData.userGroupId + "&posterId=" + postData.posterId,
            method: "POST",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            crossDomain: true,
            context: this
        }).done(data => {
            this.successFunc(data, "rpcSendPost");
            callback(data);
        }).fail(function (msg, ajaxOpt, thrownError) { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcSendPost"); 
        });
    }
    
    rpcPutPost(postData, callback) { // NOT TESTED
        this.sendingFunc(postData, "rpcPutPost");
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
    
    rpcGetComment(commentFilterData, callback) { // NOT TESTED
        this.sendingFunc(commentFilterData, "rpcGetComment");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "comment?postId=" + commentFilterData.postid,
            method: "POST",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            crossDomain: true,
        }).done(data => {
            this.successFunc(data, "rpcRetrieveComments");
            callback(data);
        }).fail((msg, ajaxOpt, thrownError) => { 
            this.errorFunc(msg, ajaxOpt, thrownError, "rpcRetrieveComments"); 
        });
    }
    
    rpcPostComment(commentData, callback) { // NOT TESTED
        this.sendingFunc(commentData, "rpcPostComment");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "comment/create/",
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
    
    rpcPutComment(commentData, callback) { // NOT TESTED
        this.sendingFunc(commentData, "rpcPutComment");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "comment/hide/",
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
    
    rpcGetGroup(groupFilterData, callback) { // NOT TESTED
        this.sendingFunc(groupFilterData, "rpcGetGroup");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "group/",
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
    
    rpcPostGroup(groupData, callback) { // NOT TESTED
        this.sendingFunc(groupData, "rpcPostGroup");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "group/create/",
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
    
    rpcPutGroup(groupData, callback) { // NOT TESTED
        this.sendingFunc(groupData, "rpcDeleteGroup");
        $.ajax({
            headers: {'Access-Control-Allow-Origin': '*'},
            url: this.serverUrl + "group/hide/",
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
