const parse = require("../../ast/parser");
const analyze = require("../../semantics/analyzer");
const generate = require("../../backend/javascript-generator");
const optimize = require("../../semantics/optimizer");

const fixture = {
  arithmetic: [String.raw`5 MULT -2 ADD 8`, String.raw`-2`],
  assignAndDec: [
    String.raw`INT s IS 4.5 POW 2!
s IS (((10 DIV 5) MOD 2) MULT 10)!
  `,
    /let s_(\d+) = 20.25;\s*s_\1 = 0;/,
  ],
  operations: [
    String.raw`INT z IS -12412!
z IS -z!
FALSE OR (~FALSE)
TRUE AND ~FALSE
FALSE OR TRUE
(5 LESS 2) AND (100 LESS 5)
(7 GRT 2) OR (100 LESS 5)
(7 GRT 2) OR (100 GRTEQ 5)
5000 ADD 0
0 ADD 23502
2000 SUB 0
0 SUB 12421904
1 MULT 12421
149502 MULT 1
INT x IS -(-(100 ADD 5))!
35 LESSEQ 5
`,
    /let z_(\d+) = -12412;\s*z_\1 = \(-\(z_\1\)\);/,
  ],
  while: [
    String.raw`UNTIL 7 EQUALS 7:
⇨LEAVE!
⇦`,
    /while \(true\) \{\s*break;\s*\}/,
  ],
  whileOpt: [
    String.raw`INT x IS 3 MULT 0!
UNTIL 7 NOTEQ 7:
⇨LEAVE!
⇦`,
    /let x_(\d+) = 0;/,
  ],
  subscriptedExp: [
    String.raw`ARR<FLT> evens IS [2, 4.3, 6, 8]!
FLT x IS evens[2]!`,
    /let evens_(\d+) = \[2, 4.3, 6, 8\];\s*let x_(\d+) = evens_\1\[2\];/,
  ],
  dictExp: [
    String.raw`DICT<INT:STR> colors IS {1: "red", 2: "blue", 3: "orange"}!`,
    /let colors_(\d+) = \{\s*1: "red",\s*2: "blue",\s*3: "orange"\s*\};/,
  ],
  func: [
    String.raw`STR s IS "the function should be GONE"!
FUNC STR isZero(INT x):
⇨TRY x GRT 0:
⇨GIMME "> 0"!
⇦NO?TRY 0 NOTEQ 0:
⇨SAY("removeTHIS")!
⇦NO?TRY x LESS 0:
⇨GIMME "< 0"!
⇦GIMME "yes"!
⇦`,
    /let s_(\d+) = "the function should be GONE";/,
  ],
  forExp: [
    String.raw`INT total IS 1!
DICT<STR:INT> d IS {"a": 1, "b": 2, "c": 3}!
FUNC LITERALLYNOTHING hey():
⇨LOOKAT INT x IN VALUES(d):
⇨total IS total ADD x!
SAY(total)!
⇦SAY("done")!
⇦`,
    /let total_(\d+) = 1;\s*let d_(\d+) = \{\s*"a": 1,\s*"b": 2,\s*"c": 3\s*\};/,
  ],
  memberExp: [
    String.raw`DICT<STR:INT> d IS {"hey": 1, "there": 3}!
SAY(d.GET("hey"))!
`,
    /let d_(\d+) = \{\s*"hey": 1,\s*"there": 3\s*\};\s*console.log\(d_\1\["hey"\]\);/,
  ],
  rangeAndTuple: [
    String.raw`TUP<INT,STR,BOO> a IS (2, "hey", FALSE)!
INT total IS 1!
FUNC LITERALLYNOTHING hey():
⇨LOOKAT INT x IN RANGE(0 ADD 2, 10):
⇨total IS total ADD x!
⇦SAY(RANGE(3, 12 ADD 5, 3])!
⇦
`,
    /let a_(\d+) = \[2, "hey", false\];\s*let total_(\d+) = 1;/,
  ],
  removeLinesAfterReturn: [
    String.raw`SAY(gcd(10, 25))!
FUNC INT gcd(INT x, INT y):
⇨UNTIL y NOTEQ 0:
⇨INT t IS y!
y IS x MOD y!
x IS t!
⇦GIMME x!
x IS 3 MOD 2!
SAY("REMOVE THIS LINE!")!
⇦`,
    /console.log\(gcd_(\d+)\(10, 25\)\);\s*function gcd_\1\(x_(\d+), y_(\d+)\) \{\s*while \(\(y_\3 !== 0\)\) \{\s*let t_(\d+) = y_\3;\s*y_\3 = \(x_\2 % y_\3\);\s*x_\2 = t_\4;\s*\};\s*return x_\2;\s*\};/,
  ],
};

describe("The JavaScript generator with optimization", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct output for ${name}`, (done) => {
      const ast = parse(source);
      analyze(ast);
      optimize(ast);
      expect(generate(ast)).toMatch(expected);
      done();
    });
  });
});
