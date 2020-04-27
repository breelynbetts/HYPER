class Program {
  constructor(block) {
    this.block = block;
  }
}

class Block {
  constructor(statements) {
    this.statements = statements;
  }
}

class ForStatement {
  constructor(type, index, collection, body) {
    Object.assign(this, {
      type,
      index,
      collection,
      body,
    });
  }
}

class WhileStatement {
  constructor(test, body) {
    Object.assign(this, {
      test,
      body,
    });
  }
}

class IfStatement {
  constructor(tests, consequents, alternate) {
    Object.assign(this, {
      tests,
      consequents,
      alternate,
    });
  }
}

class Func {
  constructor(returnType, id, params, body) {
    Object.assign(this, {
      returnType,
      id,
      params,
      body,
    });
  }
}

class Assignment {
  constructor(target, source) {
    Object.assign(this, {
      target,
      source,
    });
  }
}

class Declaration {
  constructor(type, id, init) {
    Object.assign(this, {
      type,
      id,
      init,
    });
  }
}

class ArrayType {
  constructor(memberType) {
    Object.assign(this, { memberType });
  }
}

class DictType {
  constructor(keyType, valueType) {
    Object.assign(this, { keyType, valueType });
  }
}

class TupleType {
  constructor(memberTypes) {
    Object.assign(this, { memberTypes });
  }
}

// Semantics only - for bool type, int type, etc.
class PrimitiveType {
  constructor(id) {
    Object.assign(this, { id });
  }
}

// Semantics only - any expression can have this type
const AnyType = {};

// Semantics only - represents things like "Integer or String"
class UnionType {
  constructor(...types) {
    Object.assign(this, { types });
  }
}

// Semantics only - represents strings, arrays, tuples, anything with a size
class SequenceType {
  constructor(...types) {
    Object.assign(this, { types });
  }
}

class ReturnStatement {
  constructor(expression) {
    this.expression = expression;
  }
}

class Break {}

class Expression {}

class BinaryExp extends Expression {
  constructor(left, op, right) {
    super();
    Object.assign(this, {
      left,
      op,
      right,
    });
  }
}

class UnaryExp extends Expression {
  constructor(op, operand) {
    super();
    Object.assign(this, {
      op,
      operand,
    });
  }
}

class ArrayExp extends Expression {
  constructor(members, size, type) {
    super();
    Object.assign(this, {
      members,
      size,
      type,
    });
  }
}

class DictExp extends Expression {
  constructor(keyValuePairs) {
    super();
    Object.assign(this, {
      keyValuePairs,
    });
  }
}

class TupleExp extends Expression {
  constructor(values) {
    super();
    Object.assign(this, {
      values,
    });
  }
}

class CallExp extends Expression {
  constructor(callee, args) {
    super();
    Object.assign(this, {
      callee,
      args,
    });
  }
}

class RangeExp extends Expression {
  constructor(isOpenInclusive, start, end, step, isCloseInclusive) {
    super();
    Object.assign(this, {
      isOpenInclusive,
      start,
      end,
      step,
      isCloseInclusive,
    });
  }
}

class MemberExp extends Expression {
  constructor(value, subscript) {
    super();
    Object.assign(this, {
      value,
      subscript,
    });
  }
}

class SubscriptedExp extends Expression {
  constructor(array, subscript) {
    super();
    Object.assign(this, {
      array,
      subscript,
    });
  }
}

class Param {
  constructor(type, id) {
    Object.assign(this, {
      type,
      id,
    });
  }
}

class KeyValue {
  constructor(key, value) {
    Object.assign(this, { key, value });
  }
}

class Literal {
  constructor(type, value) {
    Object.assign(this, { type, value });
  }
}

class Identifier {
  constructor(ref) {
    this.ref = ref;
  }
}

module.exports = {
  Program,
  Block,
  ForStatement,
  WhileStatement,
  IfStatement,
  Func,
  Assignment,
  Declaration,
  ArrayType,
  DictType,
  TupleType,
  SequenceType,
  PrimitiveType,
  AnyType,
  UnionType,
  ReturnStatement,
  Break,
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
  KeyValue,
  Literal,
  Identifier,
};
