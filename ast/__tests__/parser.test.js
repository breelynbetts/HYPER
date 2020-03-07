const parse = require("../parser");

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
} = require("../../ast");

let fixture = {
  hello: [
    String.raw`SAY 3!
  `,
    new Program([new PrintStatement(new Literal(3))])
  ]

    assignment: [
    String.raw`x IS x + 3`,
    new Assignment("SAY", [new Literal("hello!\\n")])
  ],

  declaration: [
    String.raw`x IS 5`,
    new Declaration("SAY", [new Literal("hello!\\n")])
  ],

  print: [
    String.raw`SAY "Hello World!\n"`,
    new PrintStatement("SAY", [new Literal("Hello World!\\n")])
  ],

  returnStatement: [
    String.raw`FUNC BOO isEven(INT num):
    GIMME num MOD 2 EQUALS 0!`,
    new CallExp("SAY", [new Literal("hello!\\n")])
  ],

  binary: [
    String.raw`INT x IS 3
    INT y IS 5
    INT z IS x ADD y`,
    new BinaryExp("SAY", [new Literal("hello!\\n")])
  ],

  unary: [
    String.raw`INT x IS -10`,
    new UnaryExp("SAY", [new Literal("hello!\\n")])
  ],

  for: [
    String.raw`LOOKAT INT x IN RANGE(0, 10):
    SAY x!`,
    new ForStatement(
      'i',
      new Literal(0),
      new Literal(9),
      new IfExp(new IdExp('i'), new Assignment(new IdExp('i'), new Literal(100)), null),
    ),
  ],

  while: [
    String.raw`UNTIL TRUE:
    SAY "I am hyper!"!`,
    new WhileStatement(
      'i',
      new Literal(0),
      new Literal(9),
      new IfExp(new IdExp('i'), new Assignment(new IdExp('i'), new Literal(100)), null),
    ),
  ],

  if: [
    String.raw`INT num IS 3!
    TRY num GRT 0:
      SAY "Positive number"!
    NO?TRY num EQUALS 0:
      SAY "Zero"!
    NO???:
      SAY "Negative number"!`,
    new IfStatement(
      'i',
      new Literal(0),
      new Literal(9),
      new IfExp(new IdExp('i'), new Assignment(new IdExp('i'), new Literal(100)), null),
    ),
  ],

  arrays: [
    String.raw`ARR c IS ["Hi", "I", "am", "hyper"]
    SAY c!`,
    new ArrayExp(
      [
        new TypeDec('list', new ArrayType('int')),
        new Variable('x', 'list',
          new ArrayExp('list', new Literal(1), new NegationExp(new Literal(9)))),
      ],
      [new SubscriptedExp(new IdExp('x'), new Literal(0))],
    ),
  ],

  dict: [
    String.raw`DICT e IS {1: "Hi", 2: "I", 3: "am", 4: "hyper"}
    SAY e!`,
    new DictExp(
      [
        new TypeDec('list', new ArrayType('int')),
        new Variable('x', 'list',
          new ArrayExp('list', new Literal(1), new NegationExp(new Literal(9)))),
      ],
      [new SubscriptedExp(new IdExp('x'), new Literal(0))],
    ),
  ],

  tuple: [
    String.raw`TUP d IS (1, 2.5, "hello")
    SAY d!`,
    new TupleExp(
      [
        new TypeDec('list', new ArrayType('int')),
        new Variable('x', 'list',
          new ArrayExp('list', new Literal(1), new NegationExp(new Literal(9)))),
      ],
      [new SubscriptedExp(new IdExp('x'), new Literal(0))],
    ),
  ],

  range: [
    String.raw`LOOKAT INT x IN RANGE(0, 10):
    SAY x!`,
    new RangeExp(
      [
        new TypeDec('list', new ArrayType('int')),
        new Variable('x', 'list',
          new ArrayExp('list', new Literal(1), new NegationExp(new Literal(9)))),
      ],
      [new SubscriptedExp(new IdExp('x'), new Literal(0))],
    ),
  ],

  id: [
    String.raw`INT x`,
    new IdExp("SAY", [new Literal("Hello World!\\n")])
  ],

  parameters: [
    String.raw`FUNC INT gcd(INT x, INT y):
    UNTIL y:
        x IS y!
        y IS x MOD y!
    GIMME x!`,
    new Param("SAY", [new Literal("Hello World!\\n")])
  ],

  simpleFunction: [
    String.raw`FUNC BOO isEven(INT num):
    GIMME num MOD 2 EQUALS 0!`,
    new Function(
      [new Func('isEven', [new Param('x', 'int')], 'int',
        new BinaryExp('+', new IdExp('x'), new Literal(2)))],
      [new Call('isEven', [new Call('ord', [new Literal('dog')])])],
    ),
  ],
};

describe("The parser", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct AST for ${name}`, done => {
      expect(parse(source)).toEqual(expected);
    });
  });
  test("throws an exception on a syntax error", done => {
    expect(() => parse("as$df^&%*$&")).toThrow();
    done();
  });
});
