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
  Identifier
} = require("../../ast");

let fixture = {
  hello: [
    String.raw`SAY 3!
  `,
    new Program([new PrintStatement(new Literal(3))])
  ],

  assignment: [
    String.raw`x IS 4 ADD 3!
    `,
    new Program([
      new Assignment(
        new Identifier("x"),
        new BinaryExp(new Literal(4), "ADD", new Literal(3))
      )
    ])
  ],

  declaration: [
    String.raw`INT x IS 5!
    `,
    new Program([new Declaration("INT", new Identifier("x"), new Literal(5))])
  ],

  returnStatement: [
    String.raw`FUNC BOO isEven(INT num):
        GIMME num MOD 2 EQUALS 0!
    `,
    new Program([
      new Function(
        "BOO",
        new Identifier("isEven"),
        [new Param("INT", new Identifier("num"))],
        [
          new ReturnStatement(
            new BinaryExp(
              new BinaryExp(
                new Identifier(new Identifier("num")),
                "MOD",
                new Literal(2)
              ),
              "EQUALS",
              new Literal(0)
            )
          )
        ]
      )
    ])
  ],

  binary: [
    String.raw`INT x IS 3!
INT y IS 5!
INT z IS x ADD y!
    `,
    new Program([
      new Declaration("INT", new Identifier("x"), new Literal(3)),
      new Declaration("INT", new Identifier("y"), new Literal(5)),
      new Declaration(
        "INT",
        new Identifier("z"),
        new BinaryExp(
          new Identifier(new Identifier("x")),
          "ADD",
          new Identifier(new Identifier("y"))
        )
      )
    ])
  ],

  unary: [
    String.raw`INT x IS -10!
    `,
    new Program([
      new Declaration(
        "INT",
        new Identifier("x"),
        new UnaryExp("-", new Literal(10))
      )
    ])
  ],

  for: [
    String.raw`LOOKAT INT x IN RANGE(0, 10):
    SAY x!
    `,

    new Program([
      new ForStatement(
        "INT",
        new Identifier(new Identifier("x")),
        new RangeExp("(", new Literal(0), new Literal(10), null, ")"),
        [new PrintStatement(new Identifier(new Identifier("x")))]
      )
    ])
  ],

  while: [
    String.raw`UNTIL x EQUALS 0:
    GIMME "I am hyper!"!
    `,
    new Program([
      new WhileStatement(
        new BinaryExp(
          new Identifier(new Identifier("x")),
          "EQUALS",
          new Literal(0)
        ),
        [new ReturnStatement(new Literal("I am hyper!"))]
      )
    ])
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
      new Declaration("INT", new Identifier("num"), new Literal(3)),
      new IfStatement(
        [
          new BinaryExp(
            new Identifier(new Identifier("num")),
            "GRT",
            new Literal(0)
          ),
          new BinaryExp(
            new Identifier(new Identifier("num")),
            "EQUALS",
            new Literal(0)
          )
        ],
        [
          [new PrintStatement(new Literal("Positive number"))],
          [new PrintStatement(new Literal("Zero"))]
        ],
        [new PrintStatement(new Literal("Negative number"))]
      )
    ])
  ],

  arrays: [
    String.raw`ARR c IS ["Hi", "I", "am", "hyper"]!
    `,
    new Program([
      new Declaration(
        "ARR",
        new Identifier("c"),
        new ArrayExp([
          [
            new Literal("Hi"),
            new Literal("I"),
            new Literal("am"),
            new Literal("hyper")
          ]
        ])
      )
    ])
  ],

  dict: [
    String.raw`DICT e IS {1: "Hi", 2: "I", 3: "am", 4: "hyper"}!
LEAVE!
`,
    new Program([
      new Declaration(
        "DICT",
        new Identifier("e"),
        new DictExp([
          new KeyValue(new Literal(1), new Literal("Hi")),
          new KeyValue(new Literal(2), new Literal("I")),
          new KeyValue(new Literal(3), new Literal("am")),
          new KeyValue(new Literal(4), new Literal("hyper"))
        ])
      ),
      new Break()
    ])
  ]

  // tuple: [
  //   String.raw`TUP d IS (1, 2.5, "hello")
  //   SAY d!`,
  //   new TupleExp(
  //     [
  //       new TypeDec("list", new ArrayType("int")),
  //       new Variable(
  //         "x",
  //         "list",
  //         new ArrayExp("list", new Literal(1), new NegationExp(new Literal(9)))
  //       )
  //     ],
  //     [new SubscriptedExp(new Identifier("x"), new Literal(0))]
  //   )
  // ],

  // range: [
  //   String.raw`LOOKAT INT x IN RANGE(0, 10):
  //   SAY x!`,
  //   new RangeExp(
  //     [
  //       new TypeDec("list", new ArrayType("int")),
  //       new Variable(
  //         "x",
  //         "list",
  //         new ArrayExp("list", new Literal(1), new NegationExp(new Literal(9)))
  //       )
  //     ],
  //     [new SubscriptedExp(new Identifier("x"), new Literal(0))]
  //   )
  // ],

  // id: [
  //   String.raw`INT x`,
  //   new Identifier("SAY", [new Literal("Hello World!\\n")])
  // ],

  // parameters: [
  //   String.raw`FUNC INT gcd(INT x, INT y):
  //   UNTIL y:
  //       x IS y!
  //       y IS x MOD y!
  //   GIMME x!`,
  //   new Param("SAY", [new Literal("Hello World!\\n")])
  // ],

  // simpleFunction: [
  //   String.raw`FUNC BOO isEven(INT num):
  //   GIMME num MOD 2 EQUALS 0!`,
  //   new Function(
  //     [
  //       new Func(
  //         "isEven",
  //         [new Param("x", "int")],
  //         "int",
  //         new BinaryExp("+", new Identifier("x"), new Literal(2))
  //       )
  //     ],
  //     [new Call("isEven", [new Call("ord", [new Literal("dog")])])]
  //   )
  // ]
};

describe("The parser", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct AST for ${name}`, done => {
      expect(parse(source)).toEqual(expected);
      done();
    });
  });
  test("throws an exception on a syntax error", done => {
    expect(() => parse("as$df^&%*$&")).toThrow();
    done();
  });
});
