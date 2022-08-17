import { Socket } from "socket.io";
import { Queue } from "../utils/Queue"
import { Action } from "./Action";

interface UserQueue {
    [username: string]: Queue;
}

export class UsersQueue {
    queue: UserQueue = {};
    interval: NodeJS.Timer | undefined;
    timeout: NodeJS.Timeout | undefined;
    reset = ((1000 * 60) * 60) * 24; // [24 hours, 2 minutes]
    dequeue = (1000 * 60) * 2;
    createUserQueue(username: string) {
        this.queue[username] = new Queue('fifo');
    }
    getUserQueue(username: string) {
        return this.queue[username];
    }

    initListener(username: string, socket: Socket, actions: Action[]) {
        // Queue event to handle socket io
        let queue = this.queue[username];
        queue.on('enqueue', () => {
            const items = queue.getItems().map(x => ({
                name: x.name,
                credit: x.credit
            }));
            socket.emit('queue/list', items);
            if (this.interval) {
                clearInterval(this.interval);
            }
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.interval = setInterval(() => {
                queue.dequeue();
                if (queue.count() === 0) {
                    clearInterval(this.interval);
                }
            }, this.dequeue);
        })
        queue.on('dequeue', (item: Action) => {
            if (queue.count() > 0) {
                const action = item.getAction();
                socket.emit('queue/action', action);
                this.timeout = setTimeout(() => {
                    actions.forEach(x => x.init())
                }, this.reset);
            }
            const items = queue.getItems().map(x => ({
                name: x.name,
                credit: x.credit
            }));
            socket.emit('queue/list', items);
        })
    }
}