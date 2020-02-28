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
    constructor(values) {
        Object.assign(this, {values});
    }
}

class TupleExp extends Expression {
    constructor(values) {
        Object.assign(this, {values});
    }
}

class CallExp extends Expression {
    constructor(callee, args) {
        Object.assign(this, {callee, args})
    }
}

class RangeExp extends Expression {
    constructor(open, start, end, step, close) {
        Object.assign(this, {open, start, end, step, close });
    }
}

class MemberExp extends Expression {
    constructor(value, subscript) {
        Object.assign(this, {value, subscript});
    }
}

class SubscriptedExp extends Expression {
    constructor(array, subscript) {
        Object.assign(this, {array, subscript});
    }
}

class IdExp extends Expression {
    constructor(ref) {
        Object.assign(this, {ref});
    }
}

class Param {
    constructor(id, type) {
        Object.assign(this, {id, type});
    }
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
    Program,
    ForStatement,
    WhileStatement,
    IfStatement,
    Function,
    Assignment,
    Declaration,
    PrintStatement,
    ReturnStatement,
    Break,
    Block,
    BinaryExp,
    UnaryExp,
    ArrayExp,
    DictExp,
    TupleExp,
    CallExp,
    RangeExp,
    MemberExp,
    SubscriptedExp,
    IdExp,
    Param,
    Literal,
    Identifier
}