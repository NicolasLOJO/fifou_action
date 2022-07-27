import { CreditAction } from "../src/lib/CreditAction"
import { percentOf } from "../src/utils/number";
// Test class because of abstract creditaction
describe('Action', () => {
    it('should have 80% credit min', () => {
        const action = new CreditAction(20, jest.fn);
        const { credit } = action;
        const percent = percentOf(80, 20);
        expect(credit).toBeGreaterThanOrEqual(percent);
    });

    it('should decrease credit on action', () => {
        const action = new CreditAction(20, jest.fn);
        const { credit } = action;
        action.action();
        expect(credit).toBeGreaterThan(action.credit);
    })

    it('should throw exception when credit is 0', () => {
        const action = new CreditAction(0, jest.fn);
        expect(() => action.action()).toThrow("No more credit");
    });

    it('should reset credit', () => {
        const action = new CreditAction(20, jest.fn);
        while (action.credit) {
            action.action();
        }
        expect(action.credit).toBe(0);
        action.reset();
        const percent = percentOf(80, 20);
        expect(action.credit).toBeGreaterThanOrEqual(percent);
    })
})