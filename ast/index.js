class Assignment {
    constructor(target, source) {
        Object.assign(this, {target, source});
    }
}
class BinaryExp {
    constructor(left, op, right) {
        Object.assign(this, {left, op, right});
    }
}

class Identifier {
    constructor(value) {
        this.value = value;
    }
}

class NumericLiteral {
    constructor(value) {
        this.value = value;
    }
}

class PrintStatement {
    constructor(expression) {
        this.expression = expression;
    }
}

class UnaryExp {
    constructor(op, operand) {
        Object.assign(this, {op, operand});
    }
}

class WhileExp {
    constructor(test, body) {
        Object.assign(this, {test, body});
    }
}

module.exports = {


}