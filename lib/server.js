'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _HelloWorld = require('./components/HelloWorld');

var _HelloWorld2 = _interopRequireDefault(_HelloWorld);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(_express2.default.static('public'));

// GET /
app.get('/', function (req, res) {
  res.render('layout', {
    content: _server2.default.renderToString(_react2.default.createElement(_HelloWorld2.default, null))
  });
});

// Start server
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  if (host === '::') {
    host = 'localhost';
  }

  console.log('Example app listening at http://%s:%s', host, port);
});