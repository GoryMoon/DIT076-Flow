/*
      Control layer. Set up and handle events
      Used in author.html
*/
import {
  bookReg
} from "../model/bookRegistry.js"
import {
  Book
} from "../model/book.js"
import {
  eventBus as eB
} from "../util/eventBus.js"

// Handle events
class Listener {
  // Events from model (must register, see below)
  onModelEvent(event, data) {
    // Even ADD, DELETE, UPDATE sent by AuthorRegistry not used
    // Table in author.html
    var table = $('#book').DataTable();
    table.rows().remove(); // Remove everything
    table.rows.add(data).draw(); // Add everything

  }
  // Event from GUI
  showEditDeleteModal(rowData) {
    //console.log("click " + rowData.id);
    // Elements in author.html modal dialog
    $("#misbn").val(rowData.isbn);
    $("#mtitle").val(rowData.title);
    $("#mprice").val(rowData.price);
    $("#mgenre").val(rowData.genre);
    $("#editDeleteModal").modal('show');
  }
  // Event from GUI
  update() {
    //console.log("update");
    let isbn = $("#misbn").val();
    let ti = $("#mtitle").val();
    let pr = $("#mprice").val();
    let ge = $("#mgenre").val();
    let book = new Book(isbn, ti, pr, ge);
    bookReg.update(book);
    $("#editDeleteModal").modal('hide');
  }
  // Event from GUI
  delete() {
    //console.log("delete");
    let isbn = $("#misbn").val();
    bookReg.delete(isbn);
    $("#editDeleteModal").modal('hide');
  }
  // Event from GUI
  create() {
    //console.log("create");
    // Elements in author.html
    let isbn = $("#id").val();
    let ti = $("#title").val();
    let pr = $("#price").val();
    let ge = $("#genre").val();
    let book = new Book(isbn, te, pr, ge);
    //console.log(auth);
    authReg.create(book);
  }
}
const listener = new Listener();
// To be able to get events from model must register listener
eB.register(listener);

// Run when DOM fully constructed
$(document).ready(function() {
  // NOTE: Table created and initialized in authortable.js
  // For watchify order of js files matter (dependencies!)
  let table = $('#book').dataTable().api();
  table.on("click", "tbody tr", function(e) {
    listener.showEditDeleteModal(table.row(this).data());
  });
  // Set listeners for element in author.html model dialog
  $("#update").on("click", listener.update);
  $("#delete").on("click", listener.delete);
  $("#add").on("click", listener.create);
});
  