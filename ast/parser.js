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
    
})