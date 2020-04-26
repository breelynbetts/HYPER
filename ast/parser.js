const fs = require("fs");
const ohm = require("ohm-js");
const withIndentsAndDedents = require("./preparser.js");

const {
  Program,
  Block,
  ForStatement,
  WhileStatement,
  IfStatement,
  Func,
  Assignment,
  Declaration,
  ArrayType,
  TupleType,
  DictType,
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
  KeyValue,
  Literal,
  Identifier,
} = require("../ast");

const grammar = ohm.grammar(fs.readFileSync("grammar/hyper.ohm"));

function arrayToNullable(a) {
  return a.length === 0 ? null : a[0];
}

/* eslint-disable no-unused-vars */
const astGenerator = grammar.createSemantics().addOperation("ast", {
  Program(b) {
    return new Program(b.ast());
  },
  Block(_new, stmts, _) {
    return new Block(stmts.ast());
  },
  Statement_simple(stmts, _newline) {
    return stmts.ast();
  },
  // Assignment  = id is Exp "!"
  Assignment(id, _is, exp, _exc) {
    return new Assignment(id.ast(), exp.ast());
  },
  Declaration(type, id, _is, exp, _exc) {
    return new Declaration(type.ast(), id.ast(), arrayToNullable(exp.ast()));
  },
  // return new DictType(key.ast(), value.ast());
  DictType(_dict, key, _semi, value, _close) {
    return new DictType(key.ast(), value.ast());
  },
  TupleType(_tup, t, _close) {
    return new TupleType(t.ast());
  },
  ArrayType(_arr, t, _close) {
    return new ArrayType(t.ast());
  },
  SimpleStmt_print(print, _open, e, _close, _exclamation) {
    return new CallExp(print.ast(), [e.ast()]);
  },
  SimpleStmt_return(_return, e, _exc) {
    return new ReturnStatement(arrayToNullable(e.ast()));
  },
  SimpleStmt_break(_break, _exc) {
    return new Break();
  },
  Suite_small(_colon, stmt, _newline) {
    return [stmt.ast()];
  },
  Suite_complex(_colon, _newline, _indent, stmts, _dedent) {
    return stmts.ast();
  },
  Loop_for(_for, type, id, _in, exp, body) {
    const idExp = new Identifier(id.ast());
    return new ForStatement(type.ast(), idExp, exp.ast(), body.ast());
  },
  Loop_while(_while, test, body) {
    return new WhileStatement(test.ast(), body.ast());
  },
  Conditional_if(
    _if,
    test1,
    block1,
    _elif,
    moreTests,
    moreBlocks,
    _else,
    endBlock
  ) {
    const tests = [test1.ast(), ...moreTests.ast()];
    const consequents = [block1.ast(), ...moreBlocks.ast()];
    const alternate = arrayToNullable(endBlock.ast());
    return new IfStatement(tests, consequents.flat(), alternate);
  },
  Function(_func, type, id, _open, params, _close, body) {
    return new Func(type.ast(), id.ast(), params.ast(), body.ast());
  },
  Exp_binary(left, op, right) {
    return new BinaryExp(left.ast(), op.ast(), right.ast());
  },
  Exp1_binary(left, op, right) {
    return new BinaryExp(left.ast(), op.ast(), right.ast());
  },
  Exp2_binary(left, op, right) {
    return new BinaryExp(left.ast(), op.ast(), right.ast());
  },
  Exp3_binary(left, op, right) {
    return new BinaryExp(left.ast(), op.ast(), right.ast());
  },
  Exp4_negate(op, operand) {
    return new UnaryExp(op.ast(), operand.ast());
  },
  Exp4_pow(left, op, right) {
    return new BinaryExp(left.ast(), op.ast(), right.ast());
  },
  Call(callee, _open, args, _close) {
    return new CallExp(callee.ast(), args.ast());
  },
  Exp5_parens(_open, e, _close) {
    return e.ast();
  },
  Array(_open, members, _close) {
    const m = arrayToNullable(members.ast());
    const type = new ArrayType(m[0].type);
    return new ArrayExp(m, new Literal("INT", m.length), type);
  },
  Dictionary(_open, keyValues, _close) {
    return new DictExp(keyValues.ast());
  },
  Tuple(_open, inner, _close) {
    return new TupleExp(inner.ast());
  },
  Range(_range, open, start, _sep, end, _sep2, step, close) {
    const isOpenInclusive = open === "[";
    const isCloseInclusive = close === "]";
    return new RangeExp(
      isOpenInclusive,
      start.ast(),
      end.ast(),
      arrayToNullable(step.ast()),
      isCloseInclusive
    );
  },
  VarExp_subscripted(arr, _open, e, _close) {
    return new SubscriptedExp(arr.ast(), e.ast());
  },
  VarExp_field(record, _dot, id) {
    return new MemberExp(record.ast(), id.ast());
  },
  VarExp_id(id) {
    return new Identifier(id.ast());
  },
  Param(type, id, _is, exp) {
    return new Param(type.ast(), id.ast(), arrayToNullable(exp.ast()));
  },
  // Arg(exp) {
  //   return new Arg(exp.ast());
  // },
  KeyValue(key, _colon, value) {
    return new KeyValue(key.ast(), value.ast());
  },
  boollit(_) {
    return new Literal("BOO", this.sourceString === "TRUE");
  },
  intlit(_neg, _digits) {
    return new Literal("INT", +this.sourceString);
  },
  floatlit(_neg, _digits, _dot, _digit) {
    return new Literal("FLT", +this.sourceString);
  },
  strlit(_open, chars, _close) {
    return new Literal("STR", this.sourceString.slice(1, -1));
  },
  NonemptyListOf(first, _sep, rest) {
    return [first.ast(), ...rest.ast()];
  },
  EmptyListOf() {
    return [];
  },
  id(_firstChar, _restChar) {
    return this.sourceString;
  },
  _terminal() {
    return this.sourceString;
  },
});
/* eslint-enable no-unused-vars */

module.exports = (text) => {
  const match = grammar.match(withIndentsAndDedents(text));
  if (!match.succeeded()) {
    throw new Error(`Syntax Error: ${match.message}`);
  }
  return astGenerator(match).ast();
};
