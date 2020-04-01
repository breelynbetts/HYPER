/*
 * Semantic Analysis Context
 *
 * A context object holds state for the semantic analysis phase.
 *
 *   const Context = require('./semantics/context');
 */

const {} = require("../ast");
const {
  BoolType,
  FloatType,
  IntType,
  NoneType,
  StringType,
  StandardFunctions
} = require("./builtins");

require("./analyzer");
