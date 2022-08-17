import { EventEmitter } from "stream";

export class Queue<T = any> extends EventEmitter {
    private queue: T[] = [];
    constructor(private _type: 'fifo' | 'lifo', ...items: T[]) {
        super();
        this.queue.push(...items);
    }
    enqueue(item: T): void {
        this.queue.push(item);
        this.emit('enqueue');
    }

    dequeue(): T | undefined {
        let item: T | undefined;
        if (this._type === 'fifo') {
            item = this.queue.shift();
        } else if (this._type === 'lifo') {
            item = this.queue.pop();
        }
        this.emit('dequeue', item);
        return item;
    }

    count(): number {
        return this.queue.length;
    }

    getItems(): T[] {
        return this.queue;
    }
}