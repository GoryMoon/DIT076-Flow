/*
    Service to execute AJAX call to backend
*/

class BookService {

  constructor() {
    // Possible need to modify this
    this.baseUrl = "http://localhost:8080/books/";
    //this.baseUrl = "http://localhost:8080/ws4/rest/book/";
    //this.baseUrl = "http://localhost:8080/api/book/";
  }

  findAll(callback) { // Callback is a function
    $.ajax({ // Use ugly global variable!
        url: this.baseUrl,
        method: "GET",
        context: this // MUST have!!!
      }).done(data => { // Success!
        callback(data);
      })
      .fail(msg => { // Exception!
        console.log(msg);
      })
  }

  create(book, callback) {
    $.ajax({
        url: this.baseUrl,
        data: JSON.stringify(book),
        method: "POST",
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        context: this, // MUST have!!!
      }).done(() => {
        callback();
      })
      .fail(msg => {
        console.log(msg);
      })
  }

  find(id, callback) {
    $.ajax({
        url: this.baseUrl + id,
        method: "GET"
      }).done(data => {
        callback(data);
      })
      .fail(msg => {
        console.log(msg);
      })
  }
  delete(id, callback) {
    $.ajax({
        url: this.baseUrl + id,
        method: "DELETE",
        crossDomain: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        context: this, // MUST have!!!
      }).done(() => {
        callback();
      })
      .fail(msg => {
        console.log(msg);
      })
  }

  update(book, callback) {
    $.ajax({
        url: this.baseUrl + book.id,
        data: JSON.stringify(book),
        method: "PUT",
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        context: this, // MUST have!!!
      }).done(() => {
        callback();
      })
      .fail(msg => {
        console.log(msg);
      })
  }
}

// Export object
export const bookService = new BookService();
