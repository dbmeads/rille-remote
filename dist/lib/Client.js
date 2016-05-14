'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Client = undefined;

var _rille = require('rille');

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Client(host) {
    var socket = (0, _socket2.default)(host);

    var route = (0, _rille.Route)({
        route: function route(_route) {
            _route.entry = undefined;
            _route.subscribe(function () {
                for (var _len = arguments.length, entry = Array(_len), _key = 0; _key < _len; _key++) {
                    entry[_key] = arguments[_key];
                }

                _route.entry = entry;
            });
        },
        wrap: function wrap(wrapper, route) {
            wrapper.entry = function () {
                return route.entry;
            };
            wrapper.push = function () {
                for (var _len2 = arguments.length, entry = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    entry[_key2] = arguments[_key2];
                }

                entry.unshift(_rille.Key.stringify(route.keys));
                socket.emit('message', entry);
            };
            wrapper.oldPush = route.push;
            wrapper.subscribe = function (callback) {
                var unsubscribe = route.subscribe(callback);
                var key = _rille.Key.stringify(route.keys);

                socket.emit('subscribe', key);

                return function () {
                    socket.emit('unsubscribe', key);
                    unsubscribe();
                };
            };
        }
    });

    socket.on('message', function (entry) {
        var _route2;

        (_route2 = route(entry[0])).oldPush.apply(_route2, _toConsumableArray(entry.slice(1)));
    });

    return route;
}

exports.default = Client;
exports.Client = Client;