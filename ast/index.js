class Program {
    constructor(body) {
        this.body = body;
    }
}

class ForStatement  {
    constructor(test, body) {
        Object.assign(this, {test, body});
    }
}

class WhileStatement  {
    constructor(test, body) {
        Object.assign(this, {test, body});
    }
}
class IfStatement {
    constructor(test, consequent, alternate) {
        Object.assign(this, {test, consequent, alternate});
    }
}

class Function {
    constructor(returnType, id, params, body) {
        Object.assign(this, {returnType, id, params, body});
    } 
}

class Assignment {
    constructor(target, source) {
        Object.assign(this, {target, source});
    }
}

class Declaration {
    constructor(id, type) {
        Object.assign(this, {id, type});
    }
}

class PrintStatement {
    constructor(expression) {
        this.expression = expression;
    }
}

class ReturnStatement {
    constructor(expression) {
        this.expression = expression;
    }
}

class Break {
}

class Block {
    constructor(statements) {
        this.statements = statements;
    }
}
class Expression {}

class BinaryExp extends Expression {
    constructor(left, op, right) {
        super();
        Object.assign(this, {left, op, right});
    }
}

class UnaryExp extends Expression {
    constructor(op, operand) {
        super();
        Object.assign(this, {op, operand});
    }
}
class ArrayExp extends Expression {
    constructor(members) {
        super();
        Object.assign(this, {members});
    }
}

class DictExp extends Expression {
    //todo
}

class TupleExp extends Expression {
    //todo
}

class CallExp extends Expression {
    // todo 
}

class RangeExp extends Expression {
    // todo 
}

class MemberExp extends Expression {
    // todo
}

class SubscriptedExp extends Expression {
    // todo
}

class Type {
    // todo
}

class Param {
    // todo
}

class Literal {
    constructor(value) {
        this.value = value;
    }
}

class Identifier {
    constructor(value) {
        this.value = value;
    }
}

module.exports = {


}