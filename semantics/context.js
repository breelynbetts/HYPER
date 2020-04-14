/*
 *  https://cs.lmu.edu/~ray/notes/writingacompiler/
 *
 *  Semantic Analysis Context
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
  StandardFunctions,
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
      declarations: Object.create(null),
    });
  }
  createChildContextForFunctionBody(currentFunction) {
    // When entering a new function, we're not in a loop anymore
    return new Context({ parent: this, currentFunction, inLoop: false });
  }
  createChildContextForLoop() {
    // When entering a loop body, just set the inLoop field, retain others
    return new Context({
      parent: this,
      currentFunction: this.currentFunction,
      inLoop: true,
    });
  }
  createChildContextForBlock() {
    // For a block, we have to retain both the function and loop settings.
    return new Context({
      parent: this,
      currentFunction: this.currentFunction,
      inLoop: this.inLoop,
    });
  }

  variableMustNotBeDeclared(name) {
    if (this.declarations[name]) {
      throw `${id} already declared in this scope`;
    }
  }

  add(id, entity) {
    this.declarations[id] = entity;
  }

  lookup(id) {
    let variable = this.declarations[id];
    if (variable) {
      return variable;
    } else if (!this.parent) {
      throw `Variable ${id} not found`;
    }
    return this.parent.lookup(id);
  }
}

Context.INITIAL = new Context();
[
  BoolType,
  FloatType,
  IntType,
  NoneType,
  StringType,
  ...StandardFunctions,
].forEach((entity) => {
  Context.INITIAL.add(entity);
});

module.exports = Context;
