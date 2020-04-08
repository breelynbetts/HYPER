const { Func, Param, PrimitiveType, ParameterizedType } = require("../ast");

const BoolType = new PrimitiveType("BOO");
const FloatType = new PrimitiveType("FLT");
const IntType = new PrimitiveType("INT");
const NoneType = new PrimitiveType("LITERALLYNOTHING");
const StringType = new PrimitiveType("STR");

//  do we need to do other types here, such as dict, array, range ...?
//      - if so, do we use a `ParameterizedType` class ??

const StandardFunctions = [
  // TODO : ADD NEW FUNCS
  new Func(null, "SAY", [new Param("LITERALLYNOTHING", "s")]),
  new Func(IntType, "SIZE", [new Param("LITERALLYNOTHING", "s")]),
  new Func(null, "EXIT", [new Param(IntType, "code")]),
  new Func(StringType, "CONCAT", [
    new Param(StringType, "s"),
    new Param(StringType, "t"),
  ]),
  new Func(StringType, "SUBSTRING", [
    new Param(StringType, "s"),
    new Param(IntType, "start"),
    new Param(IntType, "end"),
  ]),
];

// later down the road =>
//    split up builtin functions into
//       - string functions
//       - math functions
//       - dict functions
//       - array functions
//       - string functions
//       - tuple functions
//       - range functions

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
