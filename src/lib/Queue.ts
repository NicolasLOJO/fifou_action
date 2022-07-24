import { log } from "console";

export class Queue<T> {
    private inter: NodeJS.Timer | undefined;
    queue: T[] = [];
    constructor(...items: T[]) {
        this.queue = items;
    }

    enqueue(item: T): void {
        this.queue.push(item);
    }

    dequeue(): T | undefined {
        return this.queue.shift();
    }

    count() {
        return this.queue.length;
    }

    execute(interval: number, callback: () => void) {
        this.inter && clearInterval(this.inter);
        this.inter = setInterval(() => {
            callback();
        }, interval);
    }

    stop() {
        clearInterval(this.inter);
    }

    debug() {
        log(this);
    }
}