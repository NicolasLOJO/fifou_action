import { CreditAction } from "./lib/CreditAction";
import { Queue } from "./lib/Queue";
import express from 'express';
import { Container } from "./lib/Container";
import { ActionController } from "./app/action/ActionController";
import { QueueController } from "./app/queue/QueueController";
import { createServer } from "http";
import { Socket } from "./lib/Socket";

const ACTION_INTERVAL = (1000 * 60) * 2;
const RESET_ACTION = ((1000 * 60) * 60) * 24

async function main() {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    const queue = new Queue<CreditAction>();
    const container = new Container();
    container.set('Queue', queue);

    app.use(new ActionController().initRouter(container));
    app.use(new QueueController().initRouter(container));

    const server = createServer(app);
    const s = new Socket(server);
    s.init();
    container.set('io', s);
    
    server.listen(3005, () => console.log('Started'));
}

main();