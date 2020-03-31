const { Func, Param, PrimitiveType } = require("../ast");

const BoolType = new PrimitiveType("BOO");
const FloatType = new PrimitiveType("FLT");
const IntType = new PrimitiveType("INT");
const NoneType = new PrimitiveType("LITERALLYNOTHING");
const StringType = new PrimitiveType("STR");

//  do we need to do other types here, such as dict, array, range ...?

const StandardFunctions = [
  // TODO : ADD NEW FUNC
];

module.exports = {
  BoolType,
  FloatType,
  IntType,
  NoneType,
  StringType,
  StandardFunctions
};
