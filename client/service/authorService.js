/*
    Service to execute AJAX call to backend
*/

class AuthorService {

  constructor() {
    // Possible need to modify this
    this.baseUrl = "http://localhost:8080/authors/";
    //this.baseUrl = "http://localhost:8080/ws4/rest/author/";
    //this.baseUrl = "http://localhost:8080/api/authors/";
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

  create(author, callback) {
    $.ajax({
        url: this.baseUrl,
        data: JSON.stringify(author),
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

  update(author, callback) {
    $.ajax({
        url: this.baseUrl + author.id,
        data: JSON.stringify(author),
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
export const authService = new AuthorService();
