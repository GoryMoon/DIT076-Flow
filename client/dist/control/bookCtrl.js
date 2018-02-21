"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           Control layer. Set up and handle events
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           Used in author.html
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */


var _bookRegistry = require("../model/bookRegistry.js");

var _book = require("../model/book.js");

var _eventBus = require("../util/eventBus.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Handle events
var Listener = function () {
  function Listener() {
    _classCallCheck(this, Listener);
  }

  _createClass(Listener, [{
    key: "onModelEvent",

    // Events from model (must register, see below)
    value: function onModelEvent(event, data) {
      // Even ADD, DELETE, UPDATE sent by AuthorRegistry not used
      // Table in author.html
      var table = $('#book').DataTable();
      table.rows().remove(); // Remove everything
      table.rows.add(data).draw(); // Add everything
    }
    // Event from GUI

  }, {
    key: "showEditDeleteModal",
    value: function showEditDeleteModal(rowData) {
      //console.log("click " + rowData.id);
      // Elements in author.html modal dialog
      $("#misbn").val(rowData.isbn);
      $("#mtitle").val(rowData.title);
      $("#mprice").val(rowData.price);
      $("#mgenre").val(rowData.genre);
      $("#editDeleteModal").modal('show');
    }
    // Event from GUI

  }, {
    key: "update",
    value: function update() {
      //console.log("update");
      var isbn = $("#misbn").val();
      var ti = $("#mtitle").val();
      var pr = $("#mprice").val();
      var ge = $("#mgenre").val();
      var book = new _book.Book(isbn, ti, pr, ge);
      _bookRegistry.bookReg.update(book);
      $("#editDeleteModal").modal('hide');
    }
    // Event from GUI

  }, {
    key: "delete",
    value: function _delete() {
      //console.log("delete");
      var isbn = $("#misbn").val();
      _bookRegistry.bookReg.delete(isbn);
      $("#editDeleteModal").modal('hide');
    }
    // Event from GUI

  }, {
    key: "create",
    value: function create() {
      //console.log("create");
      // Elements in author.html
      var isbn = $("#id").val();
      var ti = $("#title").val();
      var pr = $("#price").val();
      var ge = $("#genre").val();
      var book = new _book.Book(isbn, te, pr, ge);
      //console.log(auth);
      authReg.create(book);
    }
  }]);

  return Listener;
}();

var listener = new Listener();
// To be able to get events from model must register listener
_eventBus.eventBus.register(listener);

// Run when DOM fully constructed
$(document).ready(function () {
  // NOTE: Table created and initialized in authortable.js
  // For watchify order of js files matter (dependencies!)
  var table = $('#book').dataTable().api();
  table.on("click", "tbody tr", function (e) {
    listener.showEditDeleteModal(table.row(this).data());
  });
  // Set listeners for element in author.html model dialog
  $("#update").on("click", listener.update);
  $("#delete").on("click", listener.delete);
  $("#add").on("click", listener.create);
});