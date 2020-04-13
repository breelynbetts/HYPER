const {
  Func,
  Param,
  ArrayType,
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
  new Func(IntType, "SIZE", [new Param(SequenceType, "s")]),
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
  new Func(ArrayType, "PUSH", [
    new Param(new UnionType(BoolType, FloatType, IntType, StringType), "u"),
  ]),
  // later down the road =>
  //    split up builtin functions into
  //       - string functions
  //       - math functions
  //       - dict functions
  //       - array functions
  //       - string functions
  //       - tuple functions
  //       - range functions
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
