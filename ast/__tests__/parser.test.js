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

  // for: [
  //   String.raw`LOOKAT INT x IN RANGE(0, 10):`,
  //   new ForStatement(
  //     "i",
  //     new Literal(0),
  //     new Literal(9),
  //     new IfExp(
  //       new IdExp("i"),
  //       new Assignment(new IdExp("i"), new Literal(100)),
  //       null
  //     )
  //   )
  // ],

  // while: [
  //   String.raw`UNTIL TRUE:`,
  //   new ForStatement(
  //     "i",
  //     new Literal(0),
  //     new Literal(9),
  //     new IfExp(
  //       new IdExp("i"),
  //       new Assignment(new IdExp("i"), new Literal(100)),
  //       null
  //     )
  //   )
  // ],

  // if: [
  //   String.raw`TRY 4 GRT 0:`,
  //   new ForStatement(
  //     "i",
  //     new Literal(0),
  //     new Literal(9),
  //     new IfExp(
  //       new IdExp("i"),
  //       new Assignment(new IdExp("i"), new Literal(100)),
  //       null
  //     )
  //   )
  // ],

  // arrays: [
  //   String.raw`ARR c IS ["Hi", "I", "am", "hyper"]`,
  //   new LetExp(
  //     [
  //       new TypeDec("list", new ArrayType("int")),
  //       new Variable(
  //         "x",
  //         "list",
  //         new ArrayExp("list", new Literal(1), new NegationExp(new Literal(9)))
  //       )
  //     ],
  //     [new SubscriptedExp(new IdExp("x"), new Literal(0))]
  //   )
  // ],

  // dict: [
  //   String.raw`DICT e IS {1: "Hi", 2: "I", 3: "am", 4: "hyper"}`,
  //   new LetExp(
  //     [
  //       new TypeDec("list", new ArrayType("int")),
  //       new Variable(
  //         "x",
  //         "list",
  //         new ArrayExp("list", new Literal(1), new NegationExp(new Literal(9)))
  //       )
  //     ],
  //     [new SubscriptedExp(new IdExp("x"), new Literal(0))]
  //   )
  // ],

  // tuple: [
  //   String.raw`TUP d IS (1, 2.5, "hello")`,
  //   new LetExp(
  //     [
  //       new TypeDec("list", new ArrayType("int")),
  //       new Variable(
  //         "x",
  //         "list",
  //         new ArrayExp("list", new Literal(1), new NegationExp(new Literal(9)))
  //       )
  //     ],
  //     [new SubscriptedExp(new IdExp("x"), new Literal(0))]
  //   )
  // ],

  // range: [
  //   String.raw`INT x IN RANGE(0, 10):)`,
  //   new LetExp(
  //     [
  //       new TypeDec("list", new ArrayType("int")),
  //       new Variable(
  //         "x",
  //         "list",
  //         new ArrayExp("list", new Literal(1), new NegationExp(new Literal(9)))
  //       )
  //     ],
  //     [new SubscriptedExp(new IdExp("x"), new Literal(0))]
  //   )
  // ],

  // simpleFunction: [
  //   String.raw`FUNC BOO isEven(INT num):
  //   GIMME num MOD 2 EQUALS 0!`,
  //   new LetExp(
  //     [
  //       new Func(
  //         "addTwo",
  //         [new Param("x", "int")],
  //         "int",
  //         new BinaryExp("+", new IdExp("x"), new Literal(2))
  //       )
  //     ],
  //     [new Call("addTwo", [new Call("ord", [new Literal("dog")])])]
  //   )
  // ]
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
