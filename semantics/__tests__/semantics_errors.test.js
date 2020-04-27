/*
 * Semantic Error Tests
 *
 * These tests check that the analyzer will reject programs with various
 * static semantic errors.
 */

const parse = require("../../ast/parser");
const Context = require("../context");

const errors = [
  ["type mismatch in assignment", 'INT x IS 5!\nx IS "blue"!\n'],
  ["use of an undeclared variable", "SAY(x)!"],
  ["type mismatch in declaration", 'INT x IS "blue"!'],
  ["variable already declared", 'STR s IS "bree"!\nSTR s IS "blue"!\n'],
  ["break outside of loop", "LEAVE!"],
  [
    "for loop doesn't use array or range",
    'DICT<STR:BOO> a IS {"hey": TRUE}!\nLOOKAT INT x IN a:\n⇨SAY(x)!\n⇦',
  ],
  [
    "mismatch in forloop types",
    "ARR<INT> a IS [1,2,3]!\nc IS PUSH(c, 4)!\nLOOKAT STR x IN a:\n⇨SAY(x)!\n⇦",
  ],
  [
    "too many function arguments",
    'STR x IS "hey"!\nSTR y IS "there"!\nSIZE(x,y)\n',
  ],
  [
    "too few function arguments",
    'ARR<STR> c IS ["hey"]!\nSTR b IS x(c, "3")!\nFUNC STR x(ARR<STR> x, STR y, FLT z):\n⇨GIMME y!\n⇦',
  ],
  [
    "parameter type mismatch",
    'STR b IS x("green", "3")!\nFUNC STR x(ARR<STR> x, STR y, FLT z):\n⇨GIMME y!\n⇦',
  ],
  ["function return type mismatch", "FUNC STR num(INT x):\n⇨GIMME x!\n⇦"],
  [
    "dict key/value pair mismatch",
    'ARR<STR> c IS ["hey"]!\nINT s IS SIZE(c)!\nARR<FLT> evens IS [2, 4.3, 6, 8]!\nevens IS PUSH(evens, 10)!\nSTR b IS c(1)!\n',
  ],
  ["tuple type mismatch", 'TUP<STR,INT,FLT> tup IS (TRUE,"blue",2.3)!\n'],
  ["while loop test is not a boolean", "UNTIL 3 ADD 5:\n⇨SAY(TRUE)!\n⇦"],
  [
    "no return statement in function",
    'INT c IS SIZE("hello!")!\nFUNC INT x(INT y):\n⇨y IS y GRT 3!\n⇦',
  ],
  ["unary expressions mismatch", "-TRUE\n"],
  ["unary expressions mismatch 2", "~5.2\n"],
  ["non-integer range type", "RANGE[0, TRUE, 1.0]"],
  [
    "void function has return type",
    "FUNC LITERALLYNOTHING say(STR this):\n⇨GIMME!\n⇦",
  ],
  ["call of non-function", 'ARR<STR> c IS ["hey"]!\nSTR b IS c(1)!'],
  [
    "return statement out of function",
    'TRY 3 EQUALS 2:\n⇨SAY("yes")!\n⇦NO?TRY 4 GRT 1:\n⇨SAY("yep")!\n⇦NO???:\n⇨GIMME "here"!\n⇦',
  ],
  ["empty DictExp", "DICT<INT:STR> v IS {}!\n"],
  ["range has floats", 'RANGE[13, 2)\nINT x IS "blue"!\n'],
  [
    "SIZE() builtin function on non-sequence type",
    "FLT x IS 5!\nINT size IS SIZE(x)!\n",
  ],
];

describe("The semantic analyzer", () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, (done) => {
      const astRoot = parse(program);
      expect(astRoot).toBeTruthy();
      expect(() => astRoot.analyze(Context.INITIAL)).toThrow();
      done();
    });
  });
});
