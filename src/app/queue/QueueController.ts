import { Request, Response, Router } from "express";
import { Container } from "../../lib/Container";
import { Controller } from "../../lib/Controller";
import { CreditAction } from "../../lib/CreditAction";
import { Queue } from "../../lib/Queue";

export class QueueController extends Controller {
    queue!: Queue<CreditAction>;
    initRouter(container: Container): Router {
        this.queue = container.get('Queue');
        this.router.get('/queue', this.getQueue.bind(this));
        return this.router;
    }
    getQueue(req: Request, res: Response) {
        return res.json({ queue: this.queue.queue });
    }
}