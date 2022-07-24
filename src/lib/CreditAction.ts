import { percentOf, randomBetween } from "../utils/number";

interface ICreditAction {
    credit: number;
    action: any;
}

export abstract class CreditAction implements ICreditAction {
    private _credit!: number;
    public get credit(): number {
        return this._credit;
    };
    public get action() {
        if (this.credit <= 0) {
            throw "No more credit";
        }
        this._credit--;
        return this._action;
    }
    constructor(private defaultCredit: number, private _action: any) {
        this.reset();
    }

    reset() {
        const percent = Math.floor(randomBetween(80, 100));
        this._credit = Math.floor(percentOf(percent, this.defaultCredit));
    }
}