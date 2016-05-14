import {Server} from '../lib/index';
import express from 'express';
import http from 'http';

const app = express();
const httpServer = http.createServer(app);
const port = 9000;
const route = Server(httpServer);

var messageCount = -1;

route('/lobby').subscribe((key, message) => {
    route('/lobby/' + (++messageCount)).push(message);
});

httpServer.listen(port);