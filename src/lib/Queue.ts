import { log } from "console";

export class Queue<T> {
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

    debug() {
        log(this);
    }
}