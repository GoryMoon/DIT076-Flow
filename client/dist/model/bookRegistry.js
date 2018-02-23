"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bookReg = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        Collection of Books
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */


var _book = require("./book.js");

var _eventBus = require("../util/eventBus.js");

var _bookService = require("../service/bookService.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BookRegistry = function () {
  function BookRegistry() {
    _classCallCheck(this, BookRegistry);

    // Test data used when not connected to back end
    this.books = [new _book.Book("222222222", "Title 1", 29, "NOVEL"), new _book.Book("111111111", "Title 2", 30, "NOVEL"), new _book.Book("333333333", "Title 3", 31, "NOVEL")];
  }

  _createClass(BookRegistry, [{
    key: "find",
    value: function find(isbn) {
      //return this.books.find(b => b.isbn === isbn);
      _bookService.bookService.find(id, function (data) {
        return data;
      });
    }
  }, {
    key: "findAll",
    value: function findAll() {
      // When using AJAX uncomment this
      _bookService.bookService.findAll(function (data) {
        return _eventBus.eventBus.notify("", data);
      });
      // No backend use this, comment out when using AJAX
      //return this.books;
    }
  }, {
    key: "create",
    value: function create(book) {
      _bookService.bookService.create(book, function () {
        bookReg.findAll();
      });
      // TODO Add AJAX
      /*this.books.push(book);
      eB.notify("ADD", this.books); // First param not used*/
    }
  }, {
    key: "update",
    value: function update(book) {
      _bookService.bookService.update(book, function () {
        bookReg.findAll();
      });
      // TODO Add AJAX
      /*var b = this.find(book.isbn);
      this.books = this.books.filter(elem => elem !== b);
      this.books.push(book);
      eB.notify("UPDATE", this.books);*/
    }
  }, {
    key: "delete",
    value: function _delete(isbn) {
      _bookService.bookService.delete(id, function () {
        bookReg.findAll();
      });
      // TODO Add AJAX
      /*var a = this.find(isbn);
      this.books = this.books.filter(elem => elem !== a);
      eB.notify("DELETE", this.books);*/
    }
  }]);

  return BookRegistry;
}();

// Singleton


var bookReg = exports.bookReg = new BookRegistry();