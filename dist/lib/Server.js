'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Server = undefined;

var _rille = require('rille');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function Server(server, options) {
    var io = (0, _socket2.default)(server);

    var route = (0, _rille.Route)(Object.assign({
        route: function route(_route) {
            _route.subscribe(function () {
                for (var _len = arguments.length, entry = Array(_len), _key = 0; _key < _len; _key++) {
                    entry[_key] = arguments[_key];
                }

                _route.entry = entry;
            });
            _route.entry = undefined;
        },
        wrap: function wrap(wrapper, route) {
            wrapper.entry = function () {
                return route.entry;
            };
        }
    }, options));

    io.on('connection', function (socket) {
        var subscriptions = {};

        socket.on('message', function (entry) {
            var _route2;

            (_route2 = route(entry[0])).push.apply(_route2, _toConsumableArray(entry.slice(1)));
        });

        socket.on('subscribe', function (key) {
            subscriptions[key] = route(key).subscribe(function () {
                for (var _len2 = arguments.length, entry = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    entry[_key2] = arguments[_key2];
                }

                socket.emit('message', entry);
            });
        });

        socket.on('unsubscribe', function (key) {
            if (subscriptions[key]) {
                subscriptions[key]();
                delete subscriptions[key];
            }
        });

        socket.on('disconnect', function () {
            for (var key in subscriptions) {
                subscriptions[key]();
            }
        });
    });

    return route;
}

exports.default = Server;
exports.Server = Server;