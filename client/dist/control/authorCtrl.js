"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           Control layer. Set up and handle events
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           Used in author.html
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */


var _authorRegistry = require("../model/authorRegistry.js");

var _author = require("../model/author.js");

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
      var table = $('#author').DataTable();
      table.rows().remove(); // Remove everything
      table.rows.add(data).draw(); // Add everything
    }
    // Event from GUI

  }, {
    key: "showEditDeleteModal",
    value: function showEditDeleteModal(rowData) {
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

  }, {
    key: "update",
    value: function update() {
      //console.log("update");
      var id = $("#mid").val();
      var fn = $("#mfirstName").val();
      var ln = $("#mlastName").val();
      var email = $("#memail").val();
      //let ad = $("#maddress").val();
      var auth = new _author.Author(id, ln, fn, email);
      _authorRegistry.authReg.update(auth);
      $("#editDeleteModal").modal('hide');
    }
    // Event from GUI

  }, {
    key: "delete",
    value: function _delete() {
      //console.log("delete");
      var id = $("#mid").val();
      _authorRegistry.authReg.delete(id);
      $("#editDeleteModal").modal('hide');
    }
    // Event from GUI

  }, {
    key: "create",
    value: function create() {
      //console.log("create");
      // Elements in author.html
      var id = $("#id").val();
      var fn = $("#firstName").val();
      var ln = $("#lastName").val();
      var email = $("#email").val();
      var auth = new _author.Author(id, ln, fn, email);
      //console.log(auth);
      _authorRegistry.authReg.create(auth);
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
  var table = $('#author').dataTable().api();
  table.on("click", "tbody tr", function (e) {
    listener.showEditDeleteModal(table.row(this).data());
  });
  // Set listeners for element in author.html model dialog
  $("#update").on("click", listener.update);
  $("#delete").on("click", listener.delete);
  $("#add").on("click", listener.create);
});