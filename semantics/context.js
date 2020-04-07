/*
 * Semantic Analysis Context
 *
 * A context object holds state for the semantic analysis phase.
 *
 *   const Context = require('./semantics/context');
 */

const { Declaration } = require("../ast");
const {
  BoolType,
  FloatType,
  IntType,
  NoneType,
  StringType,
  StandardFunctions
} = require("./builtins");

require("./analyzer");

// When doing semantic analysis we pass around context objects.
//
// A context object holds:
//
//   1. A reference to the parent context (or null if this is the root context).
//      This allows to search for declarations from the current context outward.
//
//   2. A reference to the current function we are analyzing, if any. If we are
//      inside a function, then return expressions are legal, and we will be
//      able to type check them.
//
//   3. Whether we are in a loop (to know that a `break` is okay).
//
//   4. A map for looking up all identifiers declared in this context.

class Context {
  constructor({ parent = null, currentFunction = null, inLoop = false } = {}) {
    Object.assign(this, {
      parent,
      currentFunction,
      inLoop,
      declarations: new Map()
    });
  }
}

Context.INITIAL = new Context();
[
  BoolType,
  FloatType,
  IntType,
  NoneType,
  StringType,
  ...StandardFunctions
].forEach(entity => {
  Context.INITIAL.add(entity);
});

module.exports = Context;
