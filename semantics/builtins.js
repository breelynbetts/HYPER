const {
  Func,
  Param,
  ArrayType,
  DictType,
  PrimitiveType,
  AnyType,
  SequenceType,
  UnionType,
} = require("../ast");

const BoolType = new PrimitiveType("BOO");
const FloatType = new PrimitiveType("FLT");
const IntType = new PrimitiveType("INT");
const NoneType = new PrimitiveType("LITERALLYNOTHING");
const StringType = new PrimitiveType("STR");

const StandardFunctions = [
  new Func(NoneType, "SAY", [new Param(AnyType, "s")]),
  new Func(IntType, "SIZE", [new Param(new SequenceType(SequenceType), "s")]),
  new Func(NoneType, "EXIT", [new Param(IntType, "code")]),
  new Func(StringType, "CONCAT", [
    new Param(StringType, "s"),
    new Param(StringType, "t"),
  ]),
  new Func(StringType, "SUBSTRING", [
    new Param(StringType, "s"),
    new Param(IntType, "start"),
    new Param(IntType, "end"),
  ]),
  new Func(new ArrayType(AnyType), "PUSH", [
    new Param(new ArrayType(AnyType), "a"),
    new Param(new UnionType(BoolType, FloatType, IntType, StringType), "u"),
  ]),
  new Func(new ArrayType(AnyType), "KEYS", [
    new Param(new DictType(AnyType, AnyType), "d"),
  ]),
  new Func(new ArrayType(AnyType), "VALUES", [
    new Param(new DictType(AnyType, AnyType), "d"),
  ]),
  new Func(AnyType, "GET", [new Param(AnyType, "d")]),
];

StandardFunctions.forEach((f) => {
  f.builtin = true;
});

module.exports = {
  BoolType,
  FloatType,
  IntType,
  NoneType,
  StringType,
  StandardFunctions,
};
