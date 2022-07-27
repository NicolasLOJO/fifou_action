import { log } from "console";
import { CreditAction } from "./lib/CreditAction";
import { Queue } from "./lib/Queue";
import express from 'express';

const ACTION_INTERVAL = (1000 * 60) * 2;
const RESET_ACTION = ((1000 * 60) * 60) * 24

enum Action {
    FOO = 'foo',
    BAR = 'bar',
    FOOBAR = 'foobar'
}

const actions: { [key: string]: CreditAction } = {
    [Action.FOO]: new CreditAction(5, () => console.log('foo')),
    [Action.BAR]: new CreditAction(20, () => console.log('bar')),
    [Action.FOOBAR]: new CreditAction(30, () => console.log('foobar')),
};

async function main() {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    const queue = new Queue<Action>();

    app.get('/queue', (req, res, next) => {
        return res.json(queue.queue);
    });

    let timer: NodeJS.Timer | undefined;
    app.post('/action', (req, res, next) => {
        const { action } = req.body;
        queue.enqueue(action);
        queue.execute(ACTION_INTERVAL, () => {
            timer && clearTimeout(timer);
            timer = setTimeout(() => {
                for (const key in actions) {
                    const action = actions[key];
                    action.reset();
                }
            }, RESET_ACTION);
            if (queue.count() === 0) queue.stop();
            if (queue.count() > 0) {
                const a = <Action>queue.dequeue();
                const aa = actions[a];
                if (aa.credit > 0) {
                    const func = aa.action;
                    if (typeof func === 'function') {
                        func();
                    }
                }
            }
        })
        return res.json(queue.queue);
    });
    app.get('/action', (req, res, next) => {
        return res.json(Object.keys(actions).map(x => {
            return {
                action: x,
                credit: actions[x].credit
            }
        }));
    })

    app.listen(3000, () => console.log('Started'));
}

main();