/*
   Collection of Books
*/
import {
  Book
} from "./book.js"
import {
  eventBus as eB
} from "../util/eventBus.js"
import {
  bookService as bs
} from "../service/bookService.js"

class BookRegistry {

  constructor() {
    // Test data used when not connected to back end
    this.books = [
        new Book("222222222", "Title 1", 29, "NOVEL"),
        new Book("111111111", "Title 2", 30, "NOVEL"),
        new Book("333333333", "Title 3", 31, "NOVEL")
      ];

  } 

  find(isbn) {
    //return this.books.find(b => b.isbn === isbn);
    bs.find(id, data => {
      return data;
    });
  }

  findAll() {
    // When using AJAX uncomment this
    bs.findAll(data => {
      return eB.notify("", data);
    })
    // No backend use this, comment out when using AJAX
    //return this.books;
  }

  create(book) {
    bs.create(book, () => {
      bookReg.findAll();
    });
    // TODO Add AJAX
    /*this.books.push(book);
    eB.notify("ADD", this.books); // First param not used*/
  }

  update(book) {
    bs.update(book, () => {
        bookReg.findAll();
    });
    // TODO Add AJAX
    /*var b = this.find(book.isbn);
    this.books = this.books.filter(elem => elem !== b);
    this.books.push(book);
    eB.notify("UPDATE", this.books);*/
  }

  delete(isbn) {
    bs.delete(id, () => {
      bookReg.findAll();
    });
    // TODO Add AJAX
    /*var a = this.find(isbn);
    this.books = this.books.filter(elem => elem !== a);
    eB.notify("DELETE", this.books);*/
  }
}

// Singleton
export const bookReg = new BookRegistry();
