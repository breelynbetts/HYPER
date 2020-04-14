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
  MemberExp,
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

function getType(typeString) {
  switch (typeString) {
    case "STR":
      return StringType;
    case "BOO":
      return BoolType;
    case "FLT":
      return FloatType;
    case "INT":
      return IntType;
    case "LITERALLYNOTHING":
      return NoneType;
    default:
      return typeString;
  }
}

Program.prototype.analyze = function(context) {
  this.block.analyze(context);
};

Block.prototype.analyze = function(context) {
  const newContext = context.createChildContextForBlock();
  // this.statements
  //   .filter((s) => s.constructor === Declaration)
  //   .map((s) => newContext.add());
  this.statements
    .filter((s) => s.constructor === Func)
    .map((s) => s.analyzeSignature(newContext));
  this.statements
    .filter((s) => s.constructor === Func)
    .map((s) => newContext.add(s.id, s));
  this.statements.forEach((s) => s.analyze(newContext));
};

// class ForStatement {
//   constructor(type, id, test, body) {
//     Object.assign(this, {
//       type,
//       id,
//       test,
//       body,
//     });
//   }
// }
ForStatement.prototype.analyze = function(context) {
  const bodyContext = context.createChildContextForLoop();
  // come back to this
  // need to figure out how to check for something like:
  //        ARR<STR> friends IS ["Lexi", "Maya", "Bree"]!
  //        LOOKAT STR friend IN friends:
  //    => check that test.type === type
  //      => add id to context & make sure that test is in context if there
};

WhileStatement.prototype.analyze = function(context) {
  this.test.analyze(context);
  check.isBoolean(test);
  this.body.analyze(context.createChildContextForLoop());
};

IfStatement.prototype.analyze = function(context) {
  this.tests.forEach((test) => test.analyze(context));
  this.tests.forEach((test) => check.isBoolean(test));
  this.consequents.forEach((consequent) =>
    consequent.analyze(context.createChildContextForBlock())
  );
  this.alternate.analyze(context.createChildContextForBlock());
};

Func.prototype.analyzeSignature = function(context) {
  this.bodyContext = context.createChildContextForFunctionBody();
  this.params.forEach((p) => p.analyze(this.bodyContext));
  if (!this.returnType) {
    this.returnType = undefined;
  }
  if (typeof this.returnType === "string") {
    this.returnType = context.lookup(this.returnType);
  } else {
    this.returnType.analyze(context);
  }
};

Func.prototype.analyze = function() {
  this.body.analyze(this.bodyContext);
  check.isAssignableTo(this.body, this.returnType);
  console.log("here");
  // delete this.bodyContext;
};

Assignment.prototype.analyze = function(context) {
  this.target.analyze(context);
  this.source.analyze(context);
  check.isAssignableTo(this.source, this.target.type);
};

Declaration.prototype.analyze = function(context) {
  context.variableMustNotBeDeclared(this.id);
  this.init.analyze(context);
  if (typeof this.type === "string") {
    this.type = context.lookup(this.type);
  } else {
    this.type.analyze(context);
  }
  check.isAssignableTo(this.init, this.type);
  context.add(this.id, this);
  // console.log("DECLARARTIONS", context.declarations);
};

ArrayType.prototype.analyze = function(context) {
  check.isArrayType(this);
  if (typeof this.memberType === "string") {
    this.memberType = context.lookup(this.memberType);
  } else {
    this.memberType.analyze(context);
  }
  // this.memberType = context.lookup(this.memberType);
};

DictType.prototype.analyze = function(context) {
  check.isDictType(this);
  if (typeof this.keyType === "string") {
    this.keyType = context.lookup(this.keyType);
  } else {
    this.keyType.analyze(context);
  }
  if (typeof this.valueType === "string") {
    this.valueType = context.lookup(this.valueType);
  } else {
    this.valueType.analyze(context);
  }
};

TupleType.prototype.analyze = function(context) {
  check.isTupleType(this);
  for (let i = 0; i < this.memberTypes.length; i++) {
    if (typeof this.memberTypes[i]) {
      this.memberTypes[i] = context.lookup(this.memberTypes[i]);
    } else {
      this.memberTypes[i].analyze(this.memberTypes[i]);
    }
  }
};

PrintStatement.prototype.analyze = function(context) {
  this.expression.analyze(context);
};

ReturnStatement.prototype.analyze = function(context) {
  check.inFunction(context);
  if (this.expression) {
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
  if (["LESSEQ", "GRTEQ", "LESS", "GRT"].includes(this.op)) {
    check.isNumber(this.left);
    check.isNumber(this.right);
    this.type = BoolType;
  } else if (["EQUALS", "NOTEQ"].includes(this.op)) {
    check.expressionsHaveSameType(this.left, this.right);
    this.type = BoolType;
  } else if (["AND", "OR"].includes(this.op)) {
    check.isBoolean(this.left);
    check.isBoolean(this.right);
    this.type = BoolType;
  } else {
    // All other binary operators are arithmetic
    check.isNumber(this.left);
    check.isNumber(this.right);
    this.type = FloatType;
  }
};

UnaryExp.prototype.analyze = function(context) {
  this.operand.analyze(context);
  if (this.op === "~") {
    check.isBoolean(this.operand.type);
    this.type = BoolType;
  } else {
    check.isNumber(this.operand.type);
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
    member.analyze();
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
    keyType = this.keyValuePairs[0].key.type.id;
    keyType = getType(keyType);
    valueType = this.keyValuePairs[0].value.type.id;
    valueType = getType(valueType);
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
  this.callee = this.callee.analyze(context);
  check.isFunction(this.callee);
  this.args.forEach((arg) => arg.analyze(context));
  check.legalArguments(this.args, this.callee.params);
  this.type = this.callee.returnType;
};

MemberExp.prototype.analyze = function(context) {
  this.record.analyze(context);
};

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
  } else {
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
  } else {
    this.type = NoneType;
  }
};

Identifier.prototype.analyze = function(context) {
  this.ref = context.lookup(this.ref);

  // this.type = this.ref.type;
};
