"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authReg = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        Collection of Authors
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */


var _author = require("./author.js");

var _eventBus = require("../util/eventBus.js");

var _authorService = require("../service/authorService.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AuthorRegistry = function () {
  function AuthorRegistry() {
    _classCallCheck(this, AuthorRegistry);

    // Test data used when not connected to back end
    this.authors = [
      /*new Author("OO", "ollesson", "olle", "olle@com", "ollev"),
      new Author("FF", "fiasson", "fia", "fia@com", "fiav"),
      new Author("LL", "lisasson", "lisa", "lisa@com", "lisav")*/
    ];
  }

  _createClass(AuthorRegistry, [{
    key: "find",
    value: function find(id) {
      //return this.authors.find(a => a.id === id);
      _authorService.authService.find(id, function (data) {
        return data;
      });
    }
  }, {
    key: "findAll",
    value: function findAll() {
      // When using AJAX uncomment this
      _authorService.authService.findAll(function (data) {
        return _eventBus.eventBus.notify("", data);
      });
      // No backend use this, comment out when using AJAX
      //return this.authors;
    }
  }, {
    key: "create",
    value: function create(author) {
      _authorService.authService.create(author, function () {
        authReg.findAll();
      });
      // TODO Add AJAX
      /*this.authors.push(author);
      eB.notify("ADD", this.authors);*/ // First param not used
    }
  }, {
    key: "update",
    value: function update(author) {
      _authorService.authService.update(author, function () {
        authReg.findAll();
      });
      /*
      var a = this.find(author.id);
      this.authors = this.authors.filter(elem => elem !== a);
      this.authors.push(author);*/
      //eB.notify("UPDATE", this.authors);
    }
  }, {
    key: "delete",
    value: function _delete(id) {
      _authorService.authService.delete(id, function () {
        authReg.findAll();
      });
      // TODO Add AJAX
      /*var a = this.find(id);
      this.authors = this.authors.filter(elem => elem !== a);
      eB.notify("DELETE", this.authors);*/
    }
  }]);

  return AuthorRegistry;
}();

// Singleton


var authReg = exports.authReg = new AuthorRegistry();