// The Semantic Analyzer for HYPER!
const {
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
  PrimitiveType,
  SequenceType,
  AnyType,
  UnionType,
  PrintStatement,
  ReturnStatement,
  Break,
  BinaryExp,
  UnaryExp,
  ArrayExp,
  DictExp,
  TupleExp,
  CallExp,
  RangeExp,
  // MemberExp,
  SubscriptedExp,
  Param,
  KeyValue,
  Literal,
  Identifier,
} = require("../ast");
const {
  BoolType,
  FloatType,
  IntType,
  NoneType,
  StringType,
} = require("./builtins");
const check = require("./check");
const Context = require("./context");

module.exports = (exp) => exp.analyze(Context.INITIAL);

Program.prototype.analyze = function(context) {
  this.block.analyze(context);
};

Block.prototype.analyze = function(context) {
  const newContext = context.createChildContextForBlock();
  this.statements
    .filter((s) => s.constructor === Func)
    .map((s) => s.analyzeSignature(newContext));
  this.statements
    .filter((s) => s.constructor === Func)
    .map((s) => newContext.add(s.id, s));
  this.statements.forEach((s) => s.analyze(newContext));
};

// TODO: make forloops compatible with DictTypes
// type, index, collection, body
ForStatement.prototype.analyze = function(context) {
  this.collection.analyze(context);
  this.type = context.lookup(this.type);
  check.isRangeOrArray(this.collection);
  const bodyContext = context.createChildContextForLoop();
  // if (this.collection.type.constructor === ArrayType)
  if (this.collection.constructor === RangeExp) {
    check.isInteger(this);
  } else {
    check.isAssignableTo(this, this.collection.type.memberType);
  }
  this.index = new Declaration(this.type, this.index.ref);
  bodyContext.add(this.index.id, this.index);
  this.body.forEach((b) => b.analyze(bodyContext));
};

WhileStatement.prototype.analyze = function(context) {
  this.test.analyze(context);
  check.isBoolean(this.test);
  const newContext = context.createChildContextForLoop();
  this.body.forEach((b) => b.analyze(newContext));
};

IfStatement.prototype.analyze = function(context) {
  this.tests.forEach((test) => test.analyze(context));
  this.tests.forEach((test) => check.isBoolean(test));
  this.consequents.forEach((consequent) =>
    consequent.analyze(context.createChildContextForBlock())
  );
  if (this.alternate) {
    this.alternate.forEach((alt) => alt.analyze(context));
  }
};

Func.prototype.analyzeSignature = function(context) {
  this.bodyContext = context.createChildContextForFunctionBody(this);
  if (this.params) {
    this.params.forEach((p) => p.analyze(this.bodyContext));
  }
  // if (!this.returnType) {
  //   this.returnType = undefined;
  // }
  if (typeof this.returnType === "string") {
    this.returnType = context.lookup(this.returnType);
  } else {
    this.returnType.analyze(context);
  }
};

Func.prototype.analyze = function() {
  this.body.forEach((b) => b.analyze(this.bodyContext));
  check.functionHasReturnStatement(this);
  // check.isAssignableTo(this.body, this.returnType);
  delete this.bodyContext;
};

Assignment.prototype.analyze = function(context) {
  this.target.analyze(context);
  this.source.analyze(context);
  check.isAssignableTo(this.source, this.target.type);
};

// TODO: initialize uninitialized values to default values!
//         INT s!     =>    this.init = 0
//         STR s!     =>    this.init = ""
//         BOO b!     =>    this.init = FALSE
//         DICT<KeyType:ValueType>  b!    =>  this.init.keyType = keyType, this.init.valueType = valueType

Declaration.prototype.analyze = function(context) {
  context.variableMustNotBeDeclared(this.id);
  if (typeof this.type === "string") {
    this.type = context.lookup(this.type);
  } else {
    this.type.analyze(context);
  }
  if (this.init) {
    this.init.analyze(context);
    check.isAssignableTo(this.init, this.type);
  }
  context.add(this.id, this);
};
// TODO: HYPER! does not currently support nested Arrays, so
// later must alternate Grammar to support this functionality
ArrayType.prototype.analyze = function(context) {
  check.isArrayType(this);
  if (typeof this.memberType === "string") {
    this.memberType = context.lookup(this.memberType);
  }
  // else if (this.memberType.constructor === PrimitiveType) {
  //   this.type = this.type;
  // }
};

DictType.prototype.analyze = function(context) {
  check.isDictType(this);
  // if (typeof this.keyType === "string") {
  this.keyType = context.lookup(this.keyType);
  // } else {
  //   this.keyType.analyze(context);
  // }
  // if (typeof this.valueType === "string") {
  this.valueType = context.lookup(this.valueType);
  // } else {
  //   this.valueType.analyze(context);
  // }
};

TupleType.prototype.analyze = function(context) {
  check.isTupleType(this);
  for (let i = 0; i < this.memberTypes.length; i++) {
    // if (typeof this.memberTypes[i] === "string") {
    this.memberTypes[i] = context.lookup(this.memberTypes[i]);
    // } else {
    //   this.memberTypes[i].analyze(this.memberTypes[i]);
    // }
  }
};

PrintStatement.prototype.analyze = function(context) {
  this.expression.analyze(context);
};

ReturnStatement.prototype.analyze = function(context) {
  check.inFunction(context);
  if (this.expression) {
    if (this.expression.constructor === ArrayExp) {
      const newType = context.lookup(this.expression.members[0].ref);
      this.expression.type.memberType = newType.type;
    }
    this.expression.analyze(context);
  }
  check.returnTypeMatchesFunctionReturnType(
    this.expression,
    context.currentFunction
  );
};

Break.prototype.analyze = function(context) {
  check.inLoop(context, "LEAVE");
};

BinaryExp.prototype.analyze = function(context) {
  this.left.analyze(context);
  this.right.analyze(context);
  let left = this.left.constructor === Identifier ? this.left.ref : this.left;
  let right =
    this.right.constructor === Identifier ? this.right.ref : this.right;

  if (["LESSEQ", "GRTEQ", "LESS", "GRT"].includes(this.op)) {
    check.isNumber(left);
    check.isNumber(right);
    this.type = BoolType;
  } else if (["EQUALS", "NOTEQ"].includes(this.op)) {
    check.expressionsHaveSameType(left, right);
    this.type = BoolType;
  } else if (["AND", "OR"].includes(this.op)) {
    check.isBoolean(left);
    check.isBoolean(right);
    this.type = BoolType;
  } else {
    // All other binary operators are arithmetic
    check.isNumber(left);
    check.isNumber(right);
    // FIND A WAY TO GET THIS TYPE
    this.type = IntType;
  }
};

UnaryExp.prototype.analyze = function(context) {
  this.operand.analyze(context);
  if (this.op === "~") {
    check.isBoolean(this.operand);
    this.type = BoolType;
  } else {
    check.isNumber(this.operand);
    if (this.operand.type === IntType) {
      this.type = IntType;
    } else this.type = FloatType;
  }
};

ArrayExp.prototype.analyze = function(context) {
  this.type.analyze(context);
  check.isArrayType(this.type);
  this.size.analyze(context);
  check.isInteger(this.size);
  this.members.forEach((member) => {
    member.analyze(context);
    if (this.type.memberType === IntType && member.type === FloatType) {
      this.type.memberType = FloatType;
    }

    check.isAssignableTo(member, this.type.memberType);
  });
};

DictExp.prototype.analyze = function(context) {
  this.keyValuePairs.forEach((keyValue) => {
    keyValue.analyze(context);
    check.isAssignableTo(keyValue.key, this.keyValuePairs[0].key.type);
    check.isAssignableTo(keyValue.value, this.keyValuePairs[0].value.type);
  });
  let keyType = null;
  let valueType = null;
  if (this.keyValuePairs.length > 0) {
    keyType = this.keyValuePairs[0].key.type;
    valueType = this.keyValuePairs[0].value.type;
  }
  this.type = new DictType(keyType, valueType);
};

TupleExp.prototype.analyze = function(context) {
  this.values.forEach((value, index) => {
    value.analyze(context);
    check.expressionsHaveSameType(value.type, this.values[index].type);
  });
  const valueTypes = [];
  this.values.forEach((value) => valueTypes.push(value.type));
  this.type = new TupleType(valueTypes);
};

CallExp.prototype.analyze = function(context) {
  this.callee.analyze(context);
  check.isFunction(this.callee.ref);
  this.args.forEach((arg) => arg.analyze(context));
  check.legalArguments(this.args, this.callee.ref.params);
  this.type = this.callee.ref.returnType;
};

RangeExp.prototype.analyze = function(context) {
  this.start.analyze(context);
  check.isInteger(this.start);
  this.end.analyze(context);
  check.isInteger(this.end);
  if (this.step) {
    this.step.analyze(context);
    check.isInteger(this.step);
  }
};
// value / subscript
// MemberExp.prototype.analyze = function(context) {
//   this.value.analyze(context);
//   check.isDict(this.value);
//   this.subscript.analyze(context);
// };

SubscriptedExp.prototype.analyze = function(context) {
  this.array.analyze(context);
  check.isArray(this.array.ref);
  this.subscript.analyze(context);
  check.isInteger(this.subscript);
  this.type = this.array.ref.type.memberType;
};

Param.prototype.analyze = function(context) {
  if (typeof this.type === "string") {
    this.type = context.lookup(this.type);
  }
  // else if (this.type.constructor === PrimitiveType) {
  //   this.type = this.type;
  // }
  else {
    this.type.analyze(context);
  }
  context.add(this.id, this);
};

KeyValue.prototype.analyze = function(context) {
  this.key.analyze(context);
  this.value.analyze(context);
};

Literal.prototype.analyze = function() {
  if (this.type === "STR") {
    this.type = StringType;
  } else if (this.type === "FLT") {
    this.type = FloatType;
  } else if (this.type === "BOO") {
    this.type = BoolType;
  } else if (this.type === "INT") {
    this.type = IntType;
  }
  // else {
  //   this.type = NoneType;
  // }
};

Identifier.prototype.analyze = function(context) {
  this.ref = context.lookup(this.ref);
  this.type = this.ref.type;
};
