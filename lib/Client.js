import {Key, Route} from 'rille';
import Socket from 'socket.io-client';

function Client(host) {
    var socket = Socket(host);

    var route = Route({
        route(route) {
            route.entry = undefined;
            route.subscribe((...entry) => {
                route.entry = entry;
            });
        },
        wrap(wrapper, route) {
            wrapper.entry = () => route.entry;
            wrapper.push = (...entry) => {
                entry.unshift(Key.stringify(route.keys));
                socket.emit('data', entry);
            };
            wrapper.oldPush = route.push;
            wrapper.subscribe = callback => {
                var unsubscribe = route.subscribe(callback);
                var key = Key.stringify(route.keys);

                socket.emit('subscribe', key);

                return () => {
                    socket.emit('unsubscribe', key);
                    unsubscribe();
                };
            };
        }
    });

    socket.on('data', entry => {
        route(entry[0]).oldPush(...(entry.slice(1)));
    });

    return route;
}

export default Client;
export {Client};