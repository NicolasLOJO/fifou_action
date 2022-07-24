import { Queue } from "../src/lib/Queue"

describe("Queue", () => {
    const queue = new Queue();
    it("should count 1", () => {
        queue.enqueue('first');
        expect(queue.count()).toBe(1);
    });

    it("should be a FIFO queue", () => {
        queue.enqueue('second');
        queue.enqueue('third');
        expect(queue.dequeue()).toBe('first');
        expect(queue.dequeue()).toBe('second');
        expect(queue.dequeue()).toBe('third');
    })

    it('should be an good interval', () => {
        const callback = jest.fn();
        queue.enqueue('first');
        queue.enqueue('second');
        queue.enqueue('third');
        queue.execute(1, callback);
        setTimeout(() => {
            expect(callback).toBeCalled();
            queue.stop();
        }, 30);
    })
})