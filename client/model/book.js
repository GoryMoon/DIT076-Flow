/*
    Book model
*/

export class Book {

  constructor(isbn, title, price, genre) {
    this.isbn = isbn;
    this.title = title;
    this.price = price;
    this.genre = genre;
  }
}
