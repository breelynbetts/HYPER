const fs = require('fs');
const ohm = require('ohm-js');

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
} = require('../ast');

const grammar = ohm.grammar(fs.readFileSync('grammar/hyper.ohm')); 

function arrayToNullable(a) {
    return a.length === 0 ? null : a[0];
}

const astGenerator = grammar.createSemantics().addOperation('ast',{
    Program(_newline, stmts, _newline) {
        return new Program(stmts.ast());
    },
    Statement_simple(stmts, _newline) {
        return stmts.ast(); 
    },
    SimpleStmt_assignment(id, _is, exp) {
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
    Loop_for(_for, type, id, _in, types, _do, body ) {
        return new ForStatement();
    },
    Loop_while(_while, test, body) {
        return new WhileStatement(test.ast(), body.ast())
    },
    NonemptyListOf(first, _sep, rest) {
        return [first.ast(), ...rest.ast()];
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
    boollit(_) {
        return new Literal(this.sourceString === "true");
    },
    numlit(digits) {
        return new Literal(+this.sourceString);
    },
    strlit(_open, chars, _close) {
        return new Literal(this.sourceString.slice(1,-1));
    },
    id(_firstChar, _restChar) {
        return this.sourceString;
    },
    
})

module.exports = (text) => {
    const match = grammar.match(text);
    if (!match.succeeded()) {
        throw new Error(`Syntax Error: ${match.message}`);
    }
    return astGenerator(match).ast();
}