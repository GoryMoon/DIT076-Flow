/*
   Collection of Authors
*/
import {
  Author
} from "./author.js"
import {
  eventBus as eB
} from "../util/eventBus.js"
import {
  authService as as
} from "../service/authorService.js"

class AuthorRegistry {

  constructor() {
    // Test data used when not connected to back end
    this.authors = [
        /*new Author("OO", "ollesson", "olle", "olle@com", "ollev"),
        new Author("FF", "fiasson", "fia", "fia@com", "fiav"),
        new Author("LL", "lisasson", "lisa", "lisa@com", "lisav")*/
      ];

  } 

  find(id) {
    //return this.authors.find(a => a.id === id);
    as.find(id, data => {
      return data;
    });
  }

  findAll() {
    // When using AJAX uncomment this
    as.findAll(data => {
      return eB.notify("", data);
    })
    // No backend use this, comment out when using AJAX
    //return this.authors;
  }

  create(author) {
    as.create(author, () => {
      authReg.findAll();
    });
    // TODO Add AJAX
    /*this.authors.push(author);
    eB.notify("ADD", this.authors);*/ // First param not used
  }

  update(author) {
    as.update(author, () => {
        authReg.findAll();
    });
    /*
    var a = this.find(author.id);
    this.authors = this.authors.filter(elem => elem !== a);
    this.authors.push(author);*/
    //eB.notify("UPDATE", this.authors);
  }

  delete(id) {
    as.delete(id, () => {
      authReg.findAll();
    });
    // TODO Add AJAX
    /*var a = this.find(id);
    this.authors = this.authors.filter(elem => elem !== a);
    eB.notify("DELETE", this.authors);*/
  }
}

// Singleton
export const authReg = new AuthorRegistry();
