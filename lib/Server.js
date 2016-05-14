import {Route} from 'rille';
import socketio from 'socket.io';

function Server(server) {
    var io = socketio(server);

    var route = Route({
        route(route) {
            route.subscribe((...entry) => {
                route.entry = entry;
            });
            route.entry = undefined;
        },
        wrap(wrapper, route) {
            wrapper.entry = () => route.entry;
        }
    });

    io.on('connection', socket => {
        var subscriptions = {};

        socket.on('message', entry => {
            route(entry[0]).push(...(entry.slice(1)));
        });

        socket.on('subscribe', key => {
            subscriptions[key] = route(key).subscribe((...entry) => {
                socket.emit('message', entry);
            });
        });

        socket.on('unsubscribe', key => {
            if (subscriptions[key]) {
                subscriptions[key]();
                delete subscriptions[key];
            }
        });

        socket.on('disconnect', () => {
            for (var key in subscriptions) {
                subscriptions[key]();
            }
        });
    });

    return route;
}

export default Server;
export {Server};