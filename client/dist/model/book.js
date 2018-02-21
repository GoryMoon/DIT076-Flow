"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
    Book model
*/

var Book = exports.Book = function Book(isbn, title, price, genre) {
  _classCallCheck(this, Book);

  this.isbn = isbn;
  this.title = title;
  this.price = price;
  this.genre = genre;
};