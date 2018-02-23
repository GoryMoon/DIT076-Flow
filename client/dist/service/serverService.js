"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServerService = function () {
    function ServerService() {
        _classCallCheck(this, ServerService);

        this.serverUrl = "http://localhost:8080/";
        this.errorFunc = function (msg, ajaxOpt, thrownError, funcName) {
            console.log("Failiure in \"" + funcName + "\"");
            console.log("Error Message: " + JSON.stringify(msg));
            console.log("Ajax Options: " + ajaxOpt);
            console.log("Thrown Error: " + thrownError);
        };
        this.successFunc = function (data, funcName) {
            console.log("Request succeded for \"" + funcName + "\"");
            console.log("Response: " + JSON.stringify(data));
        };
        this.sendingFunc = function (data, funcName) {
            console.log("Sent request \"" + funcName + "\"");
            console.log("Data sent: " + JSON.stringify(data));
        };
    }

    _createClass(ServerService, [{
        key: "rpcRegisterAccount",
        value: function rpcRegisterAccount(registerAccountData, callback) {
            var _this = this;

            // NOT TESTED
            this.sendingFunc(registerAccountData, "rpcRegisterAccount");
            $.ajax({
                headers: { 'Access-Control-Allow-Origin': '*' },
                url: this.serverUrl + "register/",
                data: JSON.stringify(registerAccountData),
                method: "POST",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                context: this
            }).done(function (data) {
                _this.successFunc(data, "rpcRegisterAccount");
                callback(data);
            }).fail(function (msg, ajaxOpt, thrownError) {
                this.errorFunc(msg, ajaxOpt, thrownError, "rpcRegisterAccount");
            });
        }
    }, {
        key: "rpcLoginAccount",
        value: function rpcLoginAccount(loginAccountData, callback) {
            var _this2 = this;

            // NOT TESTED
            this.sendingFunc(loginAccountData, "rpcLoginAccount");
            $.ajax({
                headers: { 'Access-Control-Allow-Origin': '*' },
                url: this.serverUrl + "login/",
                data: JSON.stringify(loginAccountData),
                method: "POST",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                context: this
            }).done(function (data) {
                _this2.successFunc(data, "rpcLoginAccount");
                callback(data);
            }).fail(function (msg, ajaxOpt, thrownError) {
                this.errorFunc(msg, ajaxOpt, thrownError, "rpcLoginAccount");
            });
        }
    }, {
        key: "rpcRetrievePosts",
        value: function rpcRetrievePosts(postFilterData, callback) {
            var _this3 = this;

            // NOT TESTED
            this.sendingFunc(postFilterData, "rpcRetrievePosts");
            $.ajax({
                headers: { 'Access-Control-Allow-Origin': '*' },
                url: this.serverUrl + "posts/",
                data: JSON.stringify(postFilterData),
                method: "GET",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                context: this
            }).done(function (data) {
                _this3.successFunc(data, "rpcRetrievePosts");
                callback(data);
            }).fail(function (msg, ajaxOpt, thrownError) {
                this.errorFunc(msg, ajaxOpt, thrownError, "rpcRetrievePosts");
            });
        }
    }, {
        key: "rpcSendPost",
        value: function rpcSendPost(postData, callback) {
            var _this4 = this;

            // NOT TESTED
            this.sendingFunc(postData, "rpcSendPost");
            $.ajax({
                headers: { 'Access-Control-Allow-Origin': '*' },
                url: this.serverUrl + "posts/",
                data: JSON.stringify(postData),
                method: "POST",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                context: this
            }).done(function (data) {
                _this4.successFunc(data, "rpcSendPost");
                callback(data);
            }).fail(function (msg, ajaxOpt, thrownError) {
                this.errorFunc(msg, ajaxOpt, thrownError, "rpcSendPost");
            });
        }
    }, {
        key: "rpcHidePost",
        value: function rpcHidePost(postData, callback) {
            var _this5 = this;

            // NOT TESTED
            this.sendingFunc(postData, "rpcHidePost");
            $.ajax({
                headers: { 'Access-Control-Allow-Origin': '*' },
                url: this.serverUrl + "posts/hide/",
                data: JSON.stringify(postData),
                method: "DELETE",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                context: this
            }).done(function (data) {
                _this5.successFunc(data, "rpcHidePost");
                callback(data);
            }).fail(function (msg, ajaxOpt, thrownError) {
                this.errorFunc(msg, ajaxOpt, thrownError, "rpcHidePost");
            });
        }
    }, {
        key: "rpcRetrieveComments",
        value: function rpcRetrieveComments(commentFilterData, callback) {
            var _this6 = this;

            // NOT TESTED
            this.sendingFunc(commentFilterData, "rpcRetrieveComments");
            $.ajax({
                headers: { 'Access-Control-Allow-Origin': '*' },
                url: this.serverUrl + "comments/",
                data: JSON.stringify(commentFilterData),
                method: "GET",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                context: this
            }).done(function (data) {
                _this6.successFunc(data, "rpcRetrieveComments");
                callback(data);
            }).fail(function (msg, ajaxOpt, thrownError) {
                this.errorFunc(msg, ajaxOpt, thrownError, "rpcRetrieveComments");
            });
        }
    }, {
        key: "rpcSendComments",
        value: function rpcSendComments(commentData, callback) {
            var _this7 = this;

            // NOT TESTED
            this.sendingFunc(commentData, "rpcSendComments");
            $.ajax({
                headers: { 'Access-Control-Allow-Origin': '*' },
                url: this.serverUrl + "comments/",
                data: JSON.stringify(commentData),
                method: "GET",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                context: this
            }).done(function (data) {
                _this7.successFunc(data, "rpcSendComments");
                callback(data);
            }).fail(function (msg, ajaxOpt, thrownError) {
                this.errorFunc(msg, ajaxOpt, thrownError, "rpcSendComments");
            });
        }
    }, {
        key: "rpcHideComment",
        value: function rpcHideComment(commentData, callback) {
            var _this8 = this;

            // NOT TESTED
            this.sendingFunc(commentData, "rpcHideComment");
            $.ajax({
                headers: { 'Access-Control-Allow-Origin': '*' },
                url: this.serverUrl + "comments/remove/",
                data: JSON.stringify(commentData),
                method: "DELETE",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                context: this
            }).done(function (data) {
                _this8.successFunc(data, "rpcHideComment");
                callback(data);
            }).fail(function (msg, ajaxOpt, thrownError) {
                this.errorFunc(msg, ajaxOpt, thrownError, "rpcHideComment");
            });
        }
    }, {
        key: "rpcRetrieveGroups",
        value: function rpcRetrieveGroups(groupFilterData, callback) {
            var _this9 = this;

            // NOT TESTED
            this.sendingFunc(groupFilterData, "rpcRetrieveGroups");
            $.ajax({
                headers: { 'Access-Control-Allow-Origin': '*' },
                url: this.serverUrl + "groups/",
                data: JSON.stringify(groupFilterData),
                method: "GET",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                context: this
            }).done(function (data) {
                _this9.successFunc(data, "rpcRetrieveGroups");
                callback(data);
            }).fail(function (msg, ajaxOpt, thrownError) {
                this.errorFunc(msg, ajaxOpt, thrownError, "rpcRetrieveGroups");
            });
        }
    }, {
        key: "rpcSendGroup",
        value: function rpcSendGroup(groupData, callback) {
            var _this10 = this;

            // NOT TESTED
            this.sendingFunc(groupData, "rpcSendGroup");
            $.ajax({
                headers: { 'Access-Control-Allow-Origin': '*' },
                url: this.serverUrl + "groups/",
                data: JSON.stringify(groupData),
                method: "POST",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                context: this
            }).done(function (data) {
                _this10.successFunc(data, "rpcSendGroup");
                callback(data);
            }).fail(function (msg, ajaxOpt, thrownError) {
                this.errorFunc(msg, ajaxOpt, thrownError, "rpcSendGroup");
            });
        }
    }, {
        key: "rpcRemoveGroup",
        value: function rpcRemoveGroup(groupData, callback) {
            var _this11 = this;

            // NOT TESTED
            this.sendingFunc(groupData, "rpcRemoveGroup");
            $.ajax({
                headers: { 'Access-Control-Allow-Origin': '*' },
                url: this.serverUrl + "groups/",
                data: JSON.stringify(groupData),
                method: "DELETE",
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                context: this
            }).done(function (data) {
                _this11.successFunc(data, "rpcRemoveGroup");
                callback(data);
            }).fail(function (msg, ajaxOpt, thrownError) {
                this.errorFunc(msg, ajaxOpt, thrownError, "rpcRemoveGroup");
            });
        }
    }]);

    return ServerService;
}();

// Export object


var serverService = exports.serverService = new ServerService();