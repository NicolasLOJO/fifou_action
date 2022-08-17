import { percentOf, randomBetween } from "../utils/number";

export class Action<T = any> {
    private _userCredit!: number;
    name: string;
    get credit() {
        return this._userCredit
    }
    private set credit(value) {
        this._userCredit = value;
    }
    constructor(name: string, private _credit: number, private _action: T) {
        this.init();
        this.name = name;
    }
    init(): void {
        const percent = Math.floor(randomBetween(80, 100));
        this.credit = Math.floor(percentOf(percent, this._credit));
    }
    getAction(): T {
        if (this.credit === 0) {
            throw new Error('No more credit for this action');
        }
        this.credit--;
        return this._action;
    }
}