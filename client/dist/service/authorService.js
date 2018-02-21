"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
    Service to execute AJAX call to backend
*/

var AuthorService = function () {
  function AuthorService() {
    _classCallCheck(this, AuthorService);

    // Possible need to modify this
    this.baseUrl = "http://localhost:8080/authors/";
    //this.baseUrl = "http://localhost:8080/ws4/rest/author/";
    //this.baseUrl = "http://localhost:8080/api/authors/";
  }

  _createClass(AuthorService, [{
    key: "findAll",
    value: function findAll(callback) {
      // Callback is a function
      $.ajax({ // Use ugly global variable!
        url: this.baseUrl,
        method: "GET",
        context: this // MUST have!!!
      }).done(function (data) {
        // Success!
        callback(data);
      }).fail(function (msg) {
        // Exception!
        console.log(msg);
      });
    }
  }, {
    key: "create",
    value: function create(author, callback) {
      $.ajax({
        url: this.baseUrl,
        data: JSON.stringify(author),
        method: "POST",
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        context: this // MUST have!!!
      }).done(function () {
        callback();
      }).fail(function (msg) {
        console.log(msg);
      });
    }
  }, {
    key: "find",
    value: function find(id, callback) {
      $.ajax({
        url: this.baseUrl + id,
        method: "GET"
      }).done(function (data) {
        callback(data);
      }).fail(function (msg) {
        console.log(msg);
      });
    }
  }, {
    key: "delete",
    value: function _delete(id, callback) {
      $.ajax({
        url: this.baseUrl + id,
        method: "DELETE",
        crossDomain: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        context: this // MUST have!!!
      }).done(function () {
        callback();
      }).fail(function (msg) {
        console.log(msg);
      });
    }
  }, {
    key: "update",
    value: function update(author, callback) {
      $.ajax({
        url: this.baseUrl + author.id,
        data: JSON.stringify(author),
        method: "PUT",
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        context: this // MUST have!!!
      }).done(function () {
        callback();
      }).fail(function (msg) {
        console.log(msg);
      });
    }
  }]);

  return AuthorService;
}();

// Export object


var authService = exports.authService = new AuthorService();