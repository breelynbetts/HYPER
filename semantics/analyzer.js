// The Semantic Analyzer for HYPER!
const {
  Program,
  ForStatement,
  WhileStatement,
  IfStatement,
  Func,
  Assignment,
  Declaration,
  ParameterizedType,
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
