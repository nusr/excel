import { TokenType } from '@/types';
export class BinaryExpression {
    left;
    right;
    operator;
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitBinaryExpression(this);
    }
    handleConcatenate(value) {
        const result = value.toString();
        const check = this.operator.type === TokenType.CONCATENATE &&
            value instanceof LiteralExpression &&
            value.value.type === TokenType.STRING;
        if (check) {
            return JSON.stringify(result);
        }
        return result;
    }
    toString() {
        const left = this.handleConcatenate(this.left);
        const right = this.handleConcatenate(this.right);
        return `${left}${this.operator.toString()}${right}`;
    }
}
export class UnaryExpression {
    right;
    operator;
    constructor(operator, right) {
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitUnaryExpression(this);
    }
    toString() {
        return this.operator.toString() + this.right.toString();
    }
}
export class PostUnaryExpression {
    left;
    operator;
    constructor(operator, left) {
        this.operator = operator;
        this.left = left;
    }
    accept(visitor) {
        return visitor.visitPostUnaryExpression(this);
    }
    toString() {
        return this.left.toString() + this.operator.toString();
    }
}
export class LiteralExpression {
    value;
    constructor(value) {
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitLiteralExpression(this);
    }
    toString() {
        return this.value.toString();
    }
}
export class CellExpression {
    value;
    sheetName;
    type;
    constructor(value, type, sheetName) {
        this.value = value;
        this.sheetName = sheetName;
        this.type = type;
    }
    accept(visitor) {
        return visitor.visitCellExpression(this);
    }
    toString() {
        if (this.sheetName) {
            return this.sheetName.toString() + '!' + this.value.toString();
        }
        else {
            return this.value.toString();
        }
    }
}
export class CallExpression {
    name;
    params;
    constructor(name, params) {
        this.name = name;
        this.params = params;
    }
    accept(visitor) {
        return visitor.visitCallExpression(this);
    }
    toString() {
        return `${this.name.toString().toUpperCase()}(${this.params
            .map((item) => item.toString())
            .join(',')})`;
    }
}
export class CellRangeExpression {
    left;
    right;
    operator;
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitCellRangeExpression(this);
    }
    toString() {
        return (this.left.toString() + this.operator.toString() + this.right.toString());
    }
}
export class GroupExpression {
    value;
    constructor(value) {
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitGroupExpression(this);
    }
    toString() {
        return `(${this.value.toString()})`;
    }
}
export class TokenExpression {
    value;
    constructor(value) {
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitTokenExpression(this);
    }
    toString() {
        return this.value.toString();
    }
}
//# sourceMappingURL=expression.js.map