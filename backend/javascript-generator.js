/*
 * Translation to JavaScript
 *
 * Requiring this module adds a gen() method to each of the AST classes, except
 * for types, and fields, which don’t figure into code generation. It exports a
 * function that generates a complete, pretty-printed JavaScript program for a
 * HYPER! expression, bundling the translation of the HYPER! standard library with
 * the expression's translation.
 *
 * Each gen() method returns a fragment of JavaScript.
 *
 *   const generate = require('./backend/javascript-generator');
 *   generate(hyperExpression);
 */

const beautify = require("js-beautify");
const {
  Program,
  Block,
  ForStatement,
  WhileStatement,
  IfStatement,
  Func,
  Assignment,
  Declaration,
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
  KeyValue,
  Literal,
  Identifier,
  Ignore,
} = require("../ast");
const { StringType, BoolType, IntType } = require("../semantics/builtins");

function makeOp(op) {
  return (
    {
      EQUALS: "===",
      NOTEQ: "!==",
      LESS: "<",
      LESSEQ: "<=",
      GRT: ">",
      GRTEQ: ">=",
      AND: "&&",
      OR: "||",
      ADD: "+",
      SUB: "-",
      MULT: "*",
      DIV: "/",
      MOD: "%",
      "~": "!",
    }[op] || op
  );
}

// javaScriptId(e) takes any HYPER! object with an id property, such as a Variable,
// Param, or Func, and produces a JavaScript name by appending a unique identifying
// suffix, such as '_1' or '_503'. It uses a cache so it can return the same exact
// string each time it is called with a particular entity.
const javaScriptId = (() => {
  let lastId = 0;
  const map = new Map();
  return (v) => {
    if (!map.has(v)) {
      map.set(v, ++lastId); // eslint-disable-line no-plusplus
    }
    return `${v.id}_${map.get(v)}`;
  };
})();

const builtin = {
  SAY([s]) {
    return `console.log(${s})`;
  },
  SIZE([s]) {
    return `${s}.length`;
  },
  SUBSTRING([s, i, n]) {
    return `${s}.substr(${i}, ${n})`;
  },
  CONCAT([s, t]) {
    return `${s}.concat(${t})`;
  },
  PUSH([a, u]) {
    return `${a}.push(${u})`;
  },
  KEYS([d]) {
    return `Object.keys(${d})`;
  },
  VALUES([d]) {
    return `Object.values(${d})`;
  },
  GET([d]) {
    return `[${d}]`;
  },
  EXIT(code) {
    return `process.exit(${code})`;
  },
};

function generateBlock(block) {
  return block.map((s) => `${s.gen()};`).join("");
}

const helperFunction = `
function RANGE(start, end, step) {
  const rangeArr = [];
  let current = start; 
  while (current <= end) {
    rangeArr.push(current);
    current += step;
  }
  return rangeArr;
}`;

module.exports = function(exp) {
  return beautify(exp.gen(), { indent_size: 2 });
};

Program.prototype.gen = function() {
  const functions = helperFunction;
  const block = this.block.gen();
  const body = block.includes("RANGE") ? `${functions}${block}` : `${block}`;
  return `${body}`;
};

Block.prototype.gen = function() {
  const statements = this.statements.map((s) =>
    s.gen() === "" ? `${s.gen()}` : `${s.gen()};`
  );
  return `${statements.join("")}`;
};

ForStatement.prototype.gen = function() {
  const body = generateBlock(this.body);
  return `for (${this.index.gen()} of ${this.collection.gen()}) {${body}}`;
};

WhileStatement.prototype.gen = function() {
  const body = generateBlock(this.body);
  return `while (${this.test.gen()}) {${body}}`;
};

IfStatement.prototype.gen = function() {
  const tests = this.tests.map((t) => t.gen());
  const consequents = this.consequents.map((s) => `${s.gen()}`);
  let elseIfs = "";
  const ifPart = `if (${tests[0]}) {${consequents[0]}}`;
  for (let i = 1; i < tests.length; i++) {
    elseIfs += `else if (${tests[i]}) {${consequents[i]}}`;
  }
  const alternate = this.alternate
    ? `else {${generateBlock(this.alternate)}}`
    : "";
  return `${ifPart} ${elseIfs} ${alternate}`;
};

Func.prototype.gen = function() {
  const name = javaScriptId(this);
  const params = this.params.map((p) => javaScriptId(p));
  const body = generateBlock(this.body);
  return `function ${name} (${params.join(",")}) {${body}}`;
};

Assignment.prototype.gen = function() {
  return `${this.target.gen()} = ${this.source.gen()}`;
};

Declaration.prototype.gen = function() {
  const exp = this.init ? this.init.gen() : undefined;
  const init = exp ? `= ${exp}` : ``;
  return `let ${javaScriptId(this)} ${init}`;
};

ReturnStatement.prototype.gen = function() {
  // const exp = this.expression ? this.expression.gen() :
  return `return ${this.expression.gen()}`;
};

Break.prototype.gen = function() {
  return "break";
};

BinaryExp.prototype.gen = function() {
  return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`;
};

UnaryExp.prototype.gen = function() {
  return `(${makeOp(this.op)} (${this.operand.gen()}))`;
};

ArrayExp.prototype.gen = function() {
  const elements = this.members.map((e) => e.gen());
  return `[${elements.join(",")}]`;
};

DictExp.prototype.gen = function() {
  const keyValuePairs = this.keyValuePairs.map((kv) => kv.gen());
  return `{${keyValuePairs}}`;
};

TupleExp.prototype.gen = function() {
  const values = this.values.map((v) => v.gen());
  return `[${values.join(",")}]`;
};

CallExp.prototype.gen = function() {
  const args = this.args.map((a) => a.gen());
  if (this.callee.builtin) {
    return builtin[this.callee.id](args);
  } else if (this.callee.subscript) {
    const mem = this.callee.gen();
    return `${mem}` + builtin[this.callee.subscript.id](args);
  } else if (this.callee.ref.builtin) {
    return builtin[this.callee.ref.id](args);
  }
  return `${javaScriptId(this.callee.ref)}(${args.join(",")})`;
};

RangeExp.prototype.gen = function() {
  let start = this.start.gen();
  start = this.isOpenInclusive ? start : start + 1;
  let end = this.end.gen();
  end = this.isCloseInclusive
    ? end
    : typeof end === "string"
    ? end + "- 1"
    : end - 1;
  const step = this.step ? this.step.gen() : 1;
  return `RANGE(${start}, ${end}, ${step})`;
};

MemberExp.prototype.gen = function() {
  const value = this.value.gen();
  return `${value}`;
};

SubscriptedExp.prototype.gen = function() {
  const id = this.array.gen();
  const sub = this.subscript.gen();
  return `${id}[${sub}]`;
};

KeyValue.prototype.gen = function() {
  return `${this.key.gen()} : ${this.value.gen()}`;
};

Literal.prototype.gen = function() {
  switch (this.type) {
    case StringType:
      return `"${this.value}"`;
    case BoolType:
      if (this.value === true) return "true";
      return "false";
    default:
      if (this.value === 0) return Number(0);
      return this.value;
  }
};

Identifier.prototype.gen = function() {
  return javaScriptId(this.ref);
};

Ignore.prototype.gen = function() {
  return "";
};
