'use strict';

var _index = require('../lib/index');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var httpServer = _http2.default.createServer(app);
var port = 9000;
var route = (0, _index.Server)(httpServer);

var messageCount = -1;

route('/lobby').subscribe(function (key, message) {
    route('/lobby/' + ++messageCount).push(message);
});

httpServer.listen(port);