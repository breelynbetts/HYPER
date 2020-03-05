const fs = require("fs");
const ohm = require("ohm-js");
const withIndentsAndDedents = require("./preparser.js");

const {
  Program,
  ForStatement,
  WhileStatement,
  IfStatement,
  Function,
  Assignment,
  Declaration,
  PrintStatement,
  ReturnStatement,
  Break,
  Block,
  BinaryExp,
  UnaryExp,
  ArrayExp,
  DictExp,
  TupleExp,
  CallExp,
  RangeExp,
  MemberExp,
  SubscriptedExp,
  IdExp,
  Param,
  Literal,
  Identifier
} = require("../ast");

const grammar = ohm.grammar(fs.readFileSync("grammar/hyper.ohm"));

function arrayToNullable(a) {
  return a.length === 0 ? null : a[0];
}

const astGenerator = grammar.createSemantics().addOperation("ast", {
  Program(_new, stmts, _) {
    return new Program(stmts.ast());
  },
  Statement_simple(stmts, _newline) {
    return stmts.ast();
  },
  Assignment_assign(id, _is, exp) {
    return new Assignment(id.ast(), exp.ast());
  },
  SimpleStmt_declaration(type, id, _is, exp) {
    return new Declaration(type.ast(), id.ast(), exp.ast());
  },
  SimpleStmt_print(_print, e, _exclamation) {
    return new PrintStatement(e.ast());
  },
  SimpleStmt_return(_return, e) {
    return new ReturnStatement(arrayToNullable(e.ast()));
  },
  SimpleStmt_break(_break) {
    return new Break();
  },
  Suite_small(_colon, stmt, _newline) {
    return [stmt.ast()];
  },
  Suite_complex(_colon, _newline, _indent, stmts, _dedent) {
    return stmts.ast();
  },
  // TODO : figure out right structure for this guy
  Loop_for(_for, type, id, _in, types, _do, body) {
    return new ForStatement();
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
    const t = [test1.ast(), ...moreTests.ast()];
    const consequents = [block1.ast(), ...moreBlocks.ast()];
    const alternate = arrayToNullable(endBlock.ast());
    return new IfStatement(t, consequents, alternate);
  },
  Function(_func, type, id, _open, params, _close, body) {
    return new Function(type.ast(), id.ast(), params.ast(), body.ast());
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
  Exp5_call(callee, _open, args, _close) {
    return new CallExp(callee.ast(), args.ast());
  },
  Exp5_parens(_open, e, _close) {
    return e.ast();
  },
  Array(_open, members, _close) {
    return new ArrayExp(members.ast());
  },
  Dictionary(_open, values, _close) {
    return new DictExp(values.ast());
  },
  Tuple(_open, inner, _close) {
    return new TupleExp(inner.ast());
  },
  Range(_dots, open, start, _sep, end, _sep2, step, close) {
    const openParen = open.primitiveValue;
    const closeParen = close.primitiveValue;
    return new RangeExp(
      openParen,
      start.ast(),
      end.ast(),
      step.ast(),
      closeParen
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
  boollit(_) {
    return new Literal(this.sourceString === "true");
  },
  numlit(digits) {
    return new Literal(+this.sourceString);
  },
  strlit(_open, chars, _close) {
    return new Literal(this.sourceString.slice(1, -1));
  },
  NonemptyListOf(first, _sep, rest) {
    return [first.ast(), ...rest.ast()];
  },
  ListOf(args) {
    return [...args.ast()];
  },
  id(_firstChar, _restChar) {
    return new Identifier(this.sourceString);
  },
  _terminal() {
    return this.sourceString;
  }
});

module.exports = text => {
  const match = grammar.match(withIndentsAndDedents(text));
  if (!match.succeeded()) {
    throw new Error(`Syntax Error: ${match.message}`);
  }
  return astGenerator(match).ast();
};
