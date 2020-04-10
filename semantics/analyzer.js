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
} = require('../ast');
const {
  BoolType,
  FloatType,
  IntType,
  NoneType,
  StringType,
  DictType,
  TupleType,
  ArrayType,
} = require('./builtins');
const check = require('./check');
const Context = require('./context');

module.exports = function(exp) {
  exp.analyze(Context.INITIAL);
};

Program.prototype.analyze = function() {
  this.body.analyze(Context());
};

WhileStatement.prototype.analyze = function(context) {
  this.test.analyze(context);
  check.isBoolean(test);
  this.body.analyze(context.createChildContextForLoop());
};

IfStatement.prototype.analyze = function(context) {
  this.tests.forEach(test => test.analyze(context));
  this.tests.forEach(test => check.isBoolean(test));
  this.consequents.forEach(consequent => consequent.analyze(context.createChildContextForBlock));
  this.alternate.analyze(context.createChildContextForBlock);
};

Declaration.prototype.analyze = function(context) {
  this.exp.analyze(context);
  this.type = this.type.analyze(context);
  check.isAssignableTo(this.exp, this.type);
  context.add(this.id, this);
};

Assignment.prototype.analyze = function(context) {
  this.target.analyze(context);
  this.source.analyze(context);
  check.isAssignableTo(this.source, this.target.type);
};
