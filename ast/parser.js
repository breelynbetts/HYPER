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

//   Params      =  ListOf<Param, ",">
//   Param       = Type id ( is Exp )?                              -- param
//   Assignment  = id is Exp "!"
//   Declaration = Type id  (is Exp)? "!"
//   id          = ~keyword (letter | "_") idrest*
//   idrest      =  "_" | alnum
//   Arg         = Exp
//   prefixop    = "-" | "~"
//   powop		= "POW"
//   logop       = "OR" | "AND"
//   relop       = relop_adv
//               | relop_sim
//   relop_adv   = "LESSEQ"
//               | "EQUALS"
//               | "NOTEQ"
//               | "GRTEQ"
//   relop_sim   = "LESS" | "GRT"
//   mulop       = "MULT" | "DIV" | "MOD"
//   addop       = "ADD" | "SUB"
//   boollit     = "TRUE" | "FALSE"
//   numlit      = digit+ ("." digit+)?
//   strlit      = "\"" (~"\\" ~"\"" ~"\n" any | escape)* "\""
//   nonelit     = "LITERALLYNOTHING"
//   Exps        = ListOf<Exp, ",">
//   KeyValue    = Key ":" Exp
//   Key         = boollit
//               |  numlit
//               |  strlit
//               |  nonelit
//               |  VarExp
//   say         = "SAY" ~alnum
//   gimme       = "GIMME" ~alnum
//   leave       = "LEAVE" ~alnum
//   lookat      = "LOOKAT" ~alnum
//   until       = "UNTIL" ~alnum
//   try         = "TRY" ~alnum
//   notry       = "NO?TRY" ~alnum
//   noqqq       = "NO???" ~alnum
//   in          = "IN" ~alnum
//   func        = "FUNC" ~alnum
//   void        = "VOID" ~alnum
//   is          = "IS" ~alnum
//   range       = "RANGE" ~alnum
//   keyword     = (basicType | "UNTIL" | "TRY" | "NO?TRY" | "NO???"
//               | "LOOKAT" | "GIMME" | "LEAVE" |"TUP"
//               | "ARR" | "DICT"| "FUNC"  | "RANGE" | "range") ~idrest
//   Type        = basicType | "TUP" | "ARR" | "DICT"
//               | "FUNC"  | "range"
//   basicType   = "BOO"
//               | "INT"
//               | "FLT"
//               | "STR"
//               | "LITERALLYNOTHING"
//   RangeType   = VarExp
//               | Exp
//   escape      = "\\" ("\\" | "\"" | "n")                           -- simple
//               | "\\u{" hexDigit+ "}"                               -- codepoint
//   newline     = "\n"+
//   indent      = "⇨"
//   dedent      = "⇦"
//   space       := " " | "\t" | comment
//   comment     = "!!!" (~"\n" any)* "\n"                            -- singleLine
//               | "!?" (~"?!" any)* "!?"                             -- multiLine
//

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
  //   Assignment  = id is Exp "!"
  Assignment(id, _is, exp, _exc) {
    return new Assignment(id.ast(), exp.ast());
  },
  Declaration(type, id, _is, exp, _exc) {
    return new Declaration(type.ast(), id.ast(), exp.ast());
  },
  SimpleStmt_print(_print, e, _exclamation) {
    return new PrintStatement(e.ast());
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
  Call(callee, _open, args, _close) {
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
  Range(_range, open, start, _sep, end, _sep2, step, close) {
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
  numlit(_digits, _dot, _digit) {
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
