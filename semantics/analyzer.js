// The Semantic Analyzer for HYPER!
const {
  Program,
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
  Arg,
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

module.exports = function(exp) {
  exp.analyze(Context.INITIAL);
};

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

// Program.prototype.analyze = function(context) {
//   this.body.analyze(context);
// };

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
  this.returnType = !this.returnType
    ? undefined // should be syntax error
    : context.lookup(this.returnType);
};

Func.prototype.analyze = function() {
  this.body.analyze(this.bodyContext);
  check.isAssignableTo(this.body, this.returnType);
  delete this.bodyContext;
};

Assignment.prototype.analyze = function(context) {
  this.target.analyze(context);
  this.source.analyze(context);
  check.isAssignableTo(this.source, this.target.type);
};

Declaration.prototype.analyze = function(context) {
  this.exp.analyze(context);
  this.type = this.type.analyze(context);
  check.isAssignableTo(this.exp, this.type);
  context.add(this.id, this);
};

ArrayType.prototype.analyze = function(context) {
  this.memberType = context.lookup(this.memberType);
};

DictType.prototype.analyze = function(context) {
  this.keyType = context.lookup(this.keyType);
  this.valueType = context.lookup(this.valueType);
};

TupleType.prototype.analyze = function(context) {
  this.memberTypes.forEach((type) => type.analyze(context));
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
    this.type = FltType;
  }
};
