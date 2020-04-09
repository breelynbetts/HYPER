// The Semantic Analyzer for HYPER!
const {
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
  DictType,
  TupleType,
  ArrayType,
} = require("./builtins");
const check = require("./check");
const Context = require("./context");

module.exports = function(exp) {
  exp.analyze(Context.INITIAL);
};

function getParameterizedType(typeString) {
  switch (typeString) {
    case "DICT":
      return DictType;
    case "TUP":
      return TupleType;
    case "ARR":
      return ArrayType;
    default:
      return typeString;
  }
}
