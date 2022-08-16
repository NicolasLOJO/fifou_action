export class Container {
    private _container: { [key: string]: any } = {};
    get(key: string) {
        if (!this._container[key]) {
            throw new Error(`${key} is not defined in container`)
        }
        return this._container[key];
    }

    set(key: string, value: any) {
        if (this._container[key]) {
            throw new Error(`${key} is already defined in container`);
        }
        this._container[key] = value;
    }
}