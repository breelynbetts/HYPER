class Program {
  constructor(body) {
    this.body = body;
  }
}

class ForStatement {
  constructor(type, id, test, body) {
    Object.assign(this, {
      type,
      id,
      test,
      body
    });
  }
}

class WhileStatement {
  constructor(test, body) {
    Object.assign(this, {
      test,
      body
    });
  }
}
class IfStatement {
  constructor(test, consequent, alternate) {
    Object.assign(this, {
      test,
      consequent,
      alternate
    });
  }
}

class Function {
  constructor(returnType, id, params, body) {
    Object.assign(this, {
      returnType,
      id,
      params,
      body
    });
  }
}

class Assignment {
  constructor(target, source) {
    Object.assign(this, {
      target,
      source
    });
  }
}

class Declaration {
  constructor(type, id, exp) {
    Object.assign(this, {
      type,
      id,
      exp
    });
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

class Break {}

class Block {
  constructor(statements) {
    this.statements = statements;
  }
}
class Expression {}

class BinaryExp extends Expression {
  constructor(left, op, right) {
    super();
    Object.assign(this, {
      left,
      op,
      right
    });
  }
}

class UnaryExp extends Expression {
  constructor(op, operand) {
    super();
    Object.assign(this, {
      op,
      operand
    });
  }
}
class ArrayExp extends Expression {
  constructor(members) {
    super();
    Object.assign(this, {
      members
    });
  }
}

class DictExp extends Expression {
  constructor(values) {
    super();
    Object.assign(this, {
      values
    });
  }
}

class TupleExp extends Expression {
  constructor(values) {
    super();
    Object.assign(this, {
      values
    });
  }
}

class CallExp extends Expression {
  constructor(callee, args) {
    super();
    Object.assign(this, {
      callee,
      args
    });
  }
}

class RangeExp extends Expression {
  constructor(open, start, end, step, close) {
    super();
    Object.assign(this, {
      open,
      start,
      end,
      step,
      close
    });
  }
}

class MemberExp extends Expression {
  constructor(value, subscript) {
    super();
    Object.assign(this, {
      value,
      subscript
    });
  }
}

class SubscriptedExp extends Expression {
  constructor(array, subscript) {
    super();
    Object.assign(this, {
      array,
      subscript
    });
  }
}

class Param {
  constructor(type, id) {
    Object.assign(this, {
      type,
      id
    });
  }
}

class Arg {
  constructor(exp) {
    Object.assign(this, { exp });
  }
}

class KeyValue {
  constructor(id, exp) {
    Object.assign(this, { id, exp });
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
  Param,
  Arg,
  KeyValue,
  Literal,
  Identifier
};
