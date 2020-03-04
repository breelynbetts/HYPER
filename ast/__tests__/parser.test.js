const parse = require('../parser');

const {
    Program, ForStatement, WhileStatement, IfStatement, Function,
    Assignment, Declaration, PrintStatement,ReturnStatement, Break,
    Block, BinaryExp, UnaryExp, ArrayExp, DictExp, TupleExp, CallExp,
    RangeExp, MemberExp, SubscriptedExp, IdExp, Param, Literal, Identifier
} = require('../../ast');

const fixture = {

} 