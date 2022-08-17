import { Request, Response, Router } from "express";
import { Action } from "../model/Action";
import { Container } from "../utils/Container";
import { Queue } from "../utils/Queue";

export class ActionController {
    actions: Action[];
    constructor(private _container: Container, private _action: Action[]) {
        this.actions = _action;
    }
    initRoute(router: Router) {
        router.get('/action', this.getAllAction.bind(this));
        router.get('/action/:key/queue', this.addActionToQueue.bind(this));
        return router;
    }

    getAllAction(req: Request, res: Response) {
        res.json({ result: this.actions.map(x => x.name) });
    }

    addActionToQueue(req: Request, res: Response) {
        const { key } = req.params;
        const user = <string>req.headers['x-user-api'];
        if (!this._container[user]) {
            this._container[user] = new Queue('fifo');
        }
        this._container[user].enqueue(this.actions.find(x => x.name === key));
        return res.json({ result: 'Action queued' })
    }
}