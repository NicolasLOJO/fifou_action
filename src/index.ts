import express, { NextFunction, Request, Response, Router } from "express";
import { createServer } from "http";
import { AddressInfo } from "net";
import { ActionController } from "./controller/ActionController";
import { Action } from "./model/Action";
import { Queue } from "./utils/Queue";
import { Server } from 'socket.io';
import { Container } from "./utils/Container";

const port = 3005;
const app = express();

// Config Queue
const userQueue: { [user: string]: Queue<Action> } = {};
const queue = new Queue<Action>('fifo');
let interval: NodeJS.Timer;
let timeout: NodeJS.Timeout;
const [reset, dequeue] = [((1000 * 60) * 60) * 24, (1000 * 1) * 2]; // [24 hours, 2 minutes]
const actions = [
    new Action('up', 30, 'up'),
    new Action('right', 20, 'right'),
    new Action('down', 10, 'down'),
    new Action('left', 25, 'left'),
]

// Config server
const container: Container = {};
const actionCtrl = new ActionController(container, actions);
app.use(actionCtrl.initRoute(Router()));

// Config socket io
const http = createServer(app);
const io = new Server(http, {
    cors: {
        origin: '*'
    }
});
io.on('connection', (socket) => {
    socket.on('init', (user) => {
        if (!container[user]) container[user] = new Queue('fifo');
        // Queue event to handle socket io
        container[user].on('enqueue', () => {
            const items = container[user].getItems().map((x: Action) => ({
                name: x.name,
                credit: x.credit
            }));
            socket.emit('queue/list', items);
            if (interval) {
                clearInterval(interval);
            }
            if (timeout) {
                clearTimeout(timeout);
            }
            interval = setInterval(() => {
                container[user].dequeue();
                if (container[user].count() === 0) {
                    clearInterval(interval);
                }
            }, dequeue);
        })
        container[user].on('dequeue', (item: Action) => {
            if (container[user].count() > 0) {
                try {
                    const action = item.getAction();
                    socket.emit('queue/action', action);
                } catch (err) {
                    socket.emit('queue/action', (<Error>err).message);
                }
                timeout = setTimeout(() => {
                    actions.forEach(x => x.init())
                }, reset);
            }
            const items = container[user].getItems().map((x: Action) => ({
                name: x.name,
                credit: x.credit
            }));
            socket.emit('queue/list', items);
        })
    })
})


const server = http.listen(port, () => {
    console.log(`Server started on port : ${(<AddressInfo>server.address()).port}`)
})