import { deepEqual } from '@/util';
export class BaseStore {
    listeners = [];
    state;
    constructor(initValue) {
        this.state = initValue;
    }
    setState = (data) => {
        if (deepEqual(data, this.state)) {
            return;
        }
        this.state = data;
        this.emitChange();
    };
    mergeState = (data) => {
        const newState = {
            ...this.state,
            ...data,
        };
        if (deepEqual(newState, this.state)) {
            return;
        }
        this.state = newState;
        this.emitChange();
    };
    subscribe = (listener) => {
        this.listeners = [...this.listeners, listener];
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    };
    getSnapshot = () => {
        return this.state;
    };
    emitChange() {
        for (const listener of this.listeners) {
            listener();
        }
    }
}
//# sourceMappingURL=base.js.map