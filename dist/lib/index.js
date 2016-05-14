'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Server = exports.Client = undefined;

var _Client = require('./Client');

var _Server = require('./Server');

var Remote = { Client: _Client.Client, Server: _Server.Server };

exports.default = Remote;
exports.Client = _Client.Client;
exports.Server = _Server.Server;