import { Request, Response, Router } from "express";
import { Container } from "../../lib/Container";
import { Controller } from "../../lib/Controller";
import { CreditAction } from "../../lib/CreditAction";
import { Queue } from "../../lib/Queue";
import { Socket } from "../../lib/Socket";

enum Action {
    UP = 'up',
    DOWN = 'down',
    RIGHT = 'right',
    LEFT = 'left',
}
export class ActionController extends Controller {
    queue!: Queue<CreditAction>;
    container!: Container;
    actions: { [key: string]: CreditAction } = {
        [Action.RIGHT]: new CreditAction(30, () => 'right'),
        [Action.LEFT]: new CreditAction(20, () => 'left'),
        [Action.DOWN]: new CreditAction(5, () => 'down'),
        [Action.UP]: new CreditAction(15, () => 'up'),
    }
    initRouter(container: Container): Router {
        this.queue = container.get('Queue');
        this.container = container;
        this.router.get('/action', this.getAction.bind(this));
        this.router.post('/action', this.createAction.bind(this))
        return this.router;
    }

    getAction(req: Request, res: Response) {
        return res.json(Object.keys(this.actions).map(x => {
            return {
                action: x,
                credit: this.actions[x].credit
            }
        }))
    }

    createAction(req: Request, res: Response) {
        const { action, username } = req.body;
        console.log(req.body);
        this.queue.enqueue(action);
        const socket = this.container.get('io').getByUser(username);
        socket.emit('queue', this.queue.queue);
        return res.status(201).json({ message: 'added' });
    }
}