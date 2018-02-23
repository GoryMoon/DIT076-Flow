"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventBus = function () {
  function EventBus() {
    _classCallCheck(this, EventBus);

    this.observers = [];
  }

  _createClass(EventBus, [{
    key: "register",
    value: function register(observer) {
      this.observers.push(observer);
    }
  }, {
    key: "unregister",
    value: function unregister(observer) {
      var i = this.observers.indexOf(observer);
      this.observers.slice(i, 1);
    }
  }, {
    key: "notify",
    value: function notify(event, data) {
      this.observers.forEach(function (observer) {
        observer.onModelEvent(event, data);
        //console.log(item, index);
      });
    }
  }]);

  return EventBus;
}();

var eventBus = exports.eventBus = new EventBus();