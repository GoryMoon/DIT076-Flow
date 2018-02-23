"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
    Author model
*/

var Author = exports.Author = function Author(id, lastName, firstName, email /*, address*/) {
  _classCallCheck(this, Author);

  this.id = id;
  this.lastName = lastName;
  this.firstName = firstName;
  this.email = email;
  //this.address = address;
};