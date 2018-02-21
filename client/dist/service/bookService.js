"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
    Service to execute AJAX call to backend
*/

var BookService = function () {
  function BookService() {
    _classCallCheck(this, BookService);

    // Possible need to modify this
    this.baseUrl = "http://localhost:8080/books/";
    //this.baseUrl = "http://localhost:8080/ws4/rest/book/";
    //this.baseUrl = "http://localhost:8080/api/book/";
  }

  _createClass(BookService, [{
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
    value: function create(book, callback) {
      $.ajax({
        url: this.baseUrl,
        data: JSON.stringify(book),
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
    value: function update(book, callback) {
      $.ajax({
        url: this.baseUrl + book.id,
        data: JSON.stringify(book),
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

  return BookService;
}();

// Export object


var bookService = exports.bookService = new BookService();