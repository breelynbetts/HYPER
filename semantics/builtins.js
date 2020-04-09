const { Func, Param, PrimitiveType, Type } = require("../ast");

const BoolType = new PrimitiveType("BOO");
const FloatType = new PrimitiveType("FLT");
const IntType = new PrimitiveType("INT");
const NoneType = new PrimitiveType("LITERALLYNOTHING");
const StringType = new PrimitiveType("STR");

const DictType = new Type("DICT", true, 2);
// how do we check our heterogenous type tuple? is this too hard?
// for example : TUP<INT,FLT,STR> tuple IS (2, 3.5, "hey")!
//      numParams is based on number entered, could create another
//      check for this in our check.js?
const TupleType = new Type("TUP", true, 2);
const ArrayType = new Type("ARR", true, 1);

//  do we need to do range ...?
//      - if so, do we use a `ParameterizedType` class ??
//      could we just make range a builtin function ??

//  how to get ParameterizedType.baseType = DictType | TupleType | ArrayType

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
  DictType,
  TupleType,
  ArrayType,
  StandardFunctions,
};
