import { Queue } from "../src/utils/Queue"

describe('queue', () => {
    it('should be empty at start', () => {
        const queue = new Queue('fifo');
        expect(queue.count()).toBe(0)
    });

    it('should have 1 item', () => {
        const queue = new Queue('fifo');
        queue.enqueue('foo');
        expect(queue.count()).toBe(1);
    })

    it('should be first in first out', () => {
        const queue = new Queue('fifo');
        queue.enqueue('foo');
        queue.enqueue('bar');
        expect(queue.dequeue()).toBe('foo');
    })

    it('should be last in first out', () => {
        const queue = new Queue('lifo');
        queue.enqueue('foo');
        queue.enqueue('bar');
        expect(queue.dequeue()).toBe('bar');
    })
})