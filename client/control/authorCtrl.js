/*
      Control layer. Set up and handle events
      Used in author.html
*/
import {
  authReg
} from "../model/authorRegistry.js"
import {
  Author
} from "../model/author.js"
import {
  eventBus as eB
} from "../util/eventBus.js"

// Handle events
class Listener {
  // Events from model (must register, see below)
  onModelEvent(event, data) {
    // Even ADD, DELETE, UPDATE sent by AuthorRegistry not used
    // Table in author.html
    var table = $('#author').DataTable();
    table.rows().remove(); // Remove everything
    table.rows.add(data).draw(); // Add everything

  }
  // Event from GUI
  showEditDeleteModal(rowData) {
    //console.log("click " + rowData.id);
    // Elements in author.html modal dialog
    $("#mid").val(rowData.id);
    $("#mfirstName").val(rowData.firstName);
    $("#mlastName").val(rowData.lastName);
    $("#memail").val(rowData.email);
    //$("#maddress").val(rowData.address);
    $("#editDeleteModal").modal('show');
  }
  // Event from GUI
  update() {
    //console.log("update");
    let id = $("#mid").val();
    let fn = $("#mfirstName").val();
    let ln = $("#mlastName").val();
    let email = $("#memail").val();
    //let ad = $("#maddress").val();
    let auth = new Author(id, ln, fn, email);
    authReg.update(auth);
    $("#editDeleteModal").modal('hide');
  }
  // Event from GUI
  delete() {
    //console.log("delete");
    let id = $("#mid").val();
    authReg.delete(id);
    $("#editDeleteModal").modal('hide');
  }
  // Event from GUI
  create() {
    //console.log("create");
    // Elements in author.html
    let id = $("#id").val();
    let fn = $("#firstName").val();
    let ln = $("#lastName").val();
    let email = $("#email").val();
    let auth = new Author(id, ln, fn, email);
    //console.log(auth);
    authReg.create(auth);
  }
}
const listener = new Listener();
// To be able to get events from model must register listener
eB.register(listener);

// Run when DOM fully constructed
$(document).ready(function() {
  // NOTE: Table created and initialized in authortable.js
  // For watchify order of js files matter (dependencies!)
  let table = $('#author').dataTable().api();
  table.on("click", "tbody tr", function(e) {
    listener.showEditDeleteModal(table.row(this).data());
  });
  // Set listeners for element in author.html model dialog
  $("#update").on("click", listener.update);
  $("#delete").on("click", listener.delete);
  $("#add").on("click", listener.create);
});
