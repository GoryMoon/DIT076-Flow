'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressHistoryApiFallback = require('express-history-api-fallback');

var _expressHistoryApiFallback2 = _interopRequireDefault(_expressHistoryApiFallback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

var app = (0, _express2.default)();
var root = (0, _path.join)(__dirname, '../public');

app.use(_express2.default.static(root));
app.use((0, _expressHistoryApiFallback2.default)('index.html', { root: root }));

var server = app.listen(3000, function () {
  return console.log('Example app listening on port 3000!');
});
exports.default = server;