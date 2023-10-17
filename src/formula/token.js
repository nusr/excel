export class Token {
    type;
    value;
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    error() {
        return `type:${this.type},value:${this.value}`;
    }
    toString() {
        return this.value;
    }
}
//# sourceMappingURL=token.js.map