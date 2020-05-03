const {
  Program,
  Block,
  ForStatement,
  WhileStatement,
  IfStatement,
  Func,
  Assignment,
  Declaration,
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
  KeyValue,
  Literal,
  Identifier,
  Ignore,
} = require("../ast");

const { BoolType, FloatType, IntType } = require("./builtins");

module.exports = (program) => program.optimize();

function isZero(e) {
  return e instanceof Literal && e.value === 0;
}

function isOne(e) {
  return e instanceof Literal && e.value === 1;
}

function bothNumLiterals(e) {
  const isLiteral = e.left instanceof Literal && e.right instanceof Literal;
  const isLeftNum = e.left.type === IntType || e.left.type === FloatType;
  const isRightNum = e.left.type === IntType || e.left.type === FloatType;
  return isLiteral && isLeftNum && isRightNum;
}

function isFalse(item) {
  return item instanceof Literal && item.value === false;
}

function declaredFuncIsCalled(decl, calls, stmts) {
  decl = decl.filter((d) => !calls.includes(d));
  return stmts.filter((s) => !(s instanceof Func && decl.includes(s.id)));
}

let functionDeclarations = [];
let calledFunctions = [];

Program.prototype.optimize = function() {
  this.block = this.block.optimize();
  return this;
};

Block.prototype.optimize = function() {
  functionDeclarations = [];
  calledFunctions = [];
  this.statements = this.statements
    .map((s) => s.optimize())
    .filter((s) => s != null);
  this.statements = declaredFuncIsCalled(
    functionDeclarations,
    calledFunctions,
    this.statements
  );
  return this;
};

ForStatement.prototype.optimize = function() {
  this.index = this.index.optimize();
  this.collection = this.collection.optimize();
  this.body = this.body.map((s) => s.optimize());
  return this;
};

WhileStatement.prototype.optimize = function() {
  this.test = this.test.optimize();
  if (this.test instanceof Literal && this.test.value === false) {
    return new Ignore();
  }
  this.body = this.body.map((s) => s.optimize()).filter((s) => s != null);
  return this;
};

IfStatement.prototype.optimize = function() {
  this.tests = this.tests.map((t) => t.optimize());
  let toRemove = [];

  this.tests.forEach((test, i) => {
    if (isFalse(test)) {
      toRemove.push(i);
    }
  });
  toRemove.forEach((i) => {
    this.tests.splice(i, 1);
    this.consequents.splice(i, 1);
  });
  return this;
};

Func.prototype.optimize = function() {
  this.builtin ? "" : functionDeclarations.push(this.id);
  if (this.body) {
    this.body = this.body.map((s) => s.optimize());
  }
  return this;
};

Assignment.prototype.optimize = function() {
  this.source = this.source.optimize();
  return this;
};

Declaration.prototype.optimize = function() {
  if (this.init) {
    this.init = this.init.optimize();
  }
  return this;
};

ReturnStatement.prototype.optimize = function() {
  this.expression = this.expression.optimize();
  return this;
};

Break.prototype.optimize = function() {
  return this;
};

BinaryExp.prototype.optimize = function() {
  this.left = this.left.optimize();
  this.right = this.right.optimize();

  const leftType = this.left.type;
  const rightType = this.right.type;

  if (this.op === "ADD" && isZero(this.right)) return this.left;
  if (this.op === "ADD" && isZero(this.left)) return this.right;
  if (this.op === "SUB" && isZero(this.right)) return this.left;
  if (this.op === "MULT" && isZero(this.right))
    return new Literal(leftType, "0");
  if (this.op === "MULT" && isZero(this.left))
    return new Literal(rightType, "0");
  if (this.op === "MULT" && isOne(this.right)) return this.left;
  if (this.op === "MULT" && isOne(this.left)) return this.right;

  if (this.op === "AND" && (isFalse(this.right) || isFalse(this.left))) {
    return new Literal(BoolType, false);
  }
  if (this.op === "OR") {
    return new Literal(BoolType, this.left.value || this.right.value);
  }

  if (bothNumLiterals(this)) {
    const [x, y] = [parseFloat(this.left.value), parseFloat(this.right.value)];
    let resultType = IntType;
    if (leftType === FloatType || rightType === FloatType) {
      resultType = FloatType;
    }
    if (this.op === "ADD") return new Literal(resultType, x + y);
    if (this.op === "MULT") return new Literal(resultType, x * y);
    if (this.op === "DIV") return new Literal(resultType, x / y);
    if (this.op === "MOD") return new Literal(resultType, x % y);
    if (this.op === "POW") return new Literal(resultType, x ** y);
    if (this.op === "LESS") return new Literal(BoolType, x < y);
    if (this.op === "GRT") return new Literal(BoolType, x > y);
    if (this.op === "LESSEQ") return new Literal(BoolType, x <= y);
    if (this.op === "GRTEQ") return new Literal(BoolType, x >= y);
    if (this.op === "NOTEQ") return new Literal(BoolType, x !== y);
    if (this.op === "EQUALS") return new Literal(BoolType, x === y);
  }
  return this;
};

UnaryExp.prototype.optimize = function() {
  this.operand = this.operand.optimize();
  if (this.op === "~" && this.operand instanceof Literal) {
    return new Literal(BoolType, !this.operand.value);
  }
  if (this.op === "-" && this.operand instanceof Literal) {
    return new Literal(this.operand.type, -this.operand.value);
  }
  return this;
};
ArrayExp.prototype.optimize = function() {
  this.members = this.members.map((e) => e.optimize());
  return this;
};

DictExp.prototype.optimize = function() {
  this.keyValuePairs = this.keyValuePairs.map((kv) => kv.optimize());
  return this;
};

TupleExp.prototype.optimize = function() {
  this.values = this.values.map((l) => l.optimize());
  return this;
};

CallExp.prototype.optimize = function() {
  this.callee.ref ? calledFunctions.push(this.callee.ref.id) : "";
  this.callee = this.callee.optimize();
  this.args = this.args.map((a) => a.optimize());
  return this;
};

RangeExp.prototype.optimize = function() {
  this.start = this.start.optimize();
  this.end = this.end.optimize();
  this.step = this.step ? this.step.optimize() : null;
  return this;
};

MemberExp.prototype.optimize = function() {
  this.subscript = this.subscript.optimize();
  return this;
};

SubscriptedExp.prototype.optimize = function() {
  this.array = this.array.optimize();
  this.subscript = this.subscript.optimize();
  return this;
};

KeyValue.prototype.optimize = function() {
  this.key = this.key.optimize();
  this.value = this.value.optimize();
  return this;
};

Literal.prototype.optimize = function() {
  return this;
};

Identifier.prototype.optimize = function() {
  return this;
};
