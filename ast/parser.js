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
        return new 
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
})