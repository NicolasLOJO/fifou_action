import { Action } from "../src/model/Action";
import { percentOf } from "../src/utils/number";

describe('action', () => {
    it('should have 80% credit min', () => {
        const action = new Action('foo', 20, jest.fn);
        const { credit } = action;
        const percent = percentOf(80, 20);
        expect(credit).toBeGreaterThanOrEqual(percent);
    });

    it('should decrease credit on action', () => {
        const action = new Action('foo', 20, jest.fn);
        const { credit } = action;
        action.getAction();
        expect(credit).toBeGreaterThan(action.credit);
    })

    it('should throw exception when credit is 0', () => {
        const action = new Action('foo', 0, jest.fn);
        expect(() => action.getAction()).toThrow("No more credit");
    });

    it('should reset credit', () => {
        const action = new Action('foo', 20, jest.fn);
        while (action.credit) {
            action.getAction();
        }
        expect(action.credit).toBe(0);
        action.init();
        const percent = percentOf(80, 20);
        expect(action.credit).toBeGreaterThanOrEqual(percent);
    })
})