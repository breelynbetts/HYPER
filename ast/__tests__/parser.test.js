// THINGS TO WORK ON : couldn't figure out how to get coverage on parenthesis and tuple

const parse = require("../parser");

const {
  Program,
  ForStatement,
  WhileStatement,
  IfStatement,
  Func,
  Assignment,
  Declaration,
  ParameterizedType,
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
  Arg,
  KeyValue,
  Literal,
  Identifier,
} = require("../../ast");

let fixture = {
  hello: [
    String.raw`SAY 3!
  `,
    new Program([new PrintStatement(new Literal(3))]),
  ],

  assignment: [
    String.raw`x IS 4 ADD 3!
    `,
    new Program([
      new Assignment(
        new Identifier("x"),
        new BinaryExp(new Literal(4), "ADD", new Literal(3))
      ),
    ]),
  ],

  declaration: [
    String.raw`INT x IS 5!
      `,
    new Program([new Declaration("INT", "x", new Literal(5))]),
  ],

  returnStatement: [
    String.raw`FUNC BOO isEven(INT num):
          GIMME num MOD 2 EQUALS 0!
      `,
    new Program([
      new Func("BOO", "isEven", new Param("INT", "num"), [
        new ReturnStatement(
          new BinaryExp(
            new BinaryExp(new Identifier("num"), "MOD", new Literal(2)),
            "EQUALS",
            new Literal(0)
          )
        ),
      ]),
    ]),
  ],

  binary: [
    String.raw`INT x IS 3!
INT y IS 5!
INT z IS x ADD y!
      `,
    new Program([
      new Declaration("INT", "x", new Literal(3)),
      new Declaration("INT", "y", new Literal(5)),
      new Declaration(
        "INT",
        "z",
        new BinaryExp(new Identifier("x"), "ADD", new Identifier("y"))
      ),
    ]),
  ],

  unary: [
    String.raw`INT x IS -10!
      `,
    new Program([
      new Declaration("INT", "x", new UnaryExp("-", new Literal(10))),
    ]),
  ],

  for: [
    String.raw`LOOKAT INT x IN RANGE(0, 10):
      SAY x POW x!
      `,
    new Program([
      new ForStatement(
        "INT",
        new Identifier("x"),
        new RangeExp("(", new Literal(0), new Literal(10), null, ")"),
        [
          new PrintStatement(
            new BinaryExp(new Identifier("x"), "POW", new Identifier("x"))
          ),
        ]
      ),
    ]),
  ],

  while: [
    String.raw`UNTIL TRUE:
      GIMME "I am hyper!"!
      `,
    new Program([
      new WhileStatement(new Literal(true), [
        new ReturnStatement(new Literal("I am hyper!")),
      ]),
    ]),
  ],

  if: [
    String.raw`INT num IS 3!
TRY num GRT 0:
    SAY "Positive number"!
NO?TRY num EQUALS 0:
    SAY "Zero"!
NO???:
    SAY "Negative number"!
    `,
    new Program([
      new Declaration("INT", "num", new Literal(3)),
      new IfStatement(
        [
          new BinaryExp(new Identifier("num"), "GRT", new Literal(0)),
          new BinaryExp(new Identifier("num"), "EQUALS", new Literal(0)),
        ],
        [
          [new PrintStatement(new Literal("Positive number"))],
          [new PrintStatement(new Literal("Zero"))],
        ],
        [new PrintStatement(new Literal("Negative number"))]
      ),
    ]),
  ],

  arrays: [
    String.raw`ARR<STR> c IS ["Hi", "I", "am", "hyper"]!
SAY c[1]!
      `,
    new Program([
      new Declaration(
        new ParameterizedType("ARR", ["STR"]),
        "c",
        new ArrayExp([
          [
            new Literal("Hi"),
            new Literal("I"),
            new Literal("am"),
            new Literal("hyper"),
          ],
        ])
      ),
      new PrintStatement(
        new SubscriptedExp(new Identifier("c"), new Literal(1))
      ),
    ]),
  ],

  dict: [
    String.raw`DICT<STR:STR> e IS {a: "Hi", b: "I", c: "am", d: "hyper"}!
GIMME e.a!
LEAVE!
  `,
    new Program([
      new Declaration(
        new ParameterizedType("DICT", ["STR", "STR"]),
        "e",
        new DictExp([
          new KeyValue(new Identifier("a"), new Literal("Hi")),
          new KeyValue(new Identifier("b"), new Literal("I")),
          new KeyValue(new Identifier("c"), new Literal("am")),
          new KeyValue(new Identifier("d"), new Literal("hyper")),
        ])
      ),
      new ReturnStatement(new MemberExp(new Identifier("e"), "a")),
      new Break(),
    ]),
  ],

  tuple: [
    String.raw`TUP<INT,FLT,STR> d IS (1, 2.5, "hello")!
      `,
    new Program([
      new Declaration(
        new ParameterizedType("TUP", ["INT", "FLT", "STR"]),
        "d",
        new TupleExp([new Literal(1), new Literal(2.5), new Literal("hello")])
      ),
    ]),
  ],
  simpleSuite: [
    String.raw`FUNC VOID hey () : GIMME "HELLO" OR "HEY"!
      `,
    new Program([
      new Func("VOID", "hey", null, [
        new ReturnStatement(
          new BinaryExp(new Literal("HELLO"), "OR", new Literal("HEY"))
        ),
      ]),
    ]),
  ],

  fibonacci: [
    String.raw`FUNC INT fibonacci(INT num):
    TRY num LESS 2:
        GIMME 1!
    GIMME fibonacci(num SUB 2) ADD fibonacci(num SUB 1)!
    `,
    new Program([
      new Func("INT", "fibonacci", new Param("INT", "num"), [
        new IfStatement(
          [new BinaryExp(new Identifier("num"), "LESS", new Literal(2))],
          [[new ReturnStatement(new Literal(1))]],
          null
        ),
        new ReturnStatement(
          new BinaryExp(
            new CallExp(new Identifier("fibonacci"), [
              new Arg(
                new BinaryExp(new Identifier("num"), "SUB", new Literal(2))
              ),
            ]),
            "ADD",
            new CallExp(new Identifier("fibonacci"), [
              new Arg(
                new BinaryExp(new Identifier("num"), "SUB", new Literal(1))
              ),
            ])
          )
        ),
      ]),
    ]),
  ],
};

describe("The parser", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct AST for ${name}`, (done) => {
      expect(parse(source)).toEqual(expected);
      done();
    });
  });
  test("throws an exception on a syntax error", (done) => {
    expect(() => parse("as$df^&%*$&")).toThrow();
    done();
  });
});
