/*
 * JavaScript Code Generator Tests
 *
 * These tests check that the JavaScript generator produces the target
 * JavaScript that we expect.
 */

const parse = require("../../ast/parser");
const analyze = require("../../semantics/analyzer");
const generate = require("../javascript-generator");

const fixture = {
  hello: [
    String.raw`SAY("hello, world")
  `,
    String.raw`console.log("hello, world")`,
  ],
  arithmetic: [
    String.raw`5 MULT -3 ADD 2
  `,
    String.raw`((5 * (-(3))) + 2)`,
  ],
  declAndAssign: [
    String.raw`INT x IS 5!
x IS 3!
STR sub IS SUBSTRING("hello, world", 1, 5)!
`,
    /let x_(\d+) = 5;\s*x_\1 = 3;\s*let sub_(\d+) = "hello, world".substr\(1, 5\)/,
  ],
  call: [
    String.raw`ARR<STR> c IS ["hey"]!
STR b IS x(c, "3", 1)!
FUNC STR x(ARR<STR> x, STR y, FLT z):
⇨GIMME y!
⇦`,
    /let c_(\d+) = \["hey"\];\s*let b_(\d+) = x_(\d+)\(c_\1, "3", 1\);\s*function x_(\d+)\(x_(\d+), y_(\d+), z_(\d+)\) \{\s*return y_(\d+);\s*\}/,
  ],
  for: [
    String.raw`INT total!
FUNC LITERALLYNOTHING hey():
⇨LOOKAT INT x IN RANGE(0, 10):
⇨total IS total ADD x!
⇦SAY(RANGE[3, 12, 3])!
⇦`,
    /let total_(\d+);\s*function hey_(\d+)\(\) \{\s*for \(let x_(\d+) of Array.from\(\{\s*length: \(10 - 01 \+ 1\) \/ 1\s*\}, \(_, i\) => 01 \+ i \* 1\)\) \{\s*total_\1 = \(total_\1 \+ x_\3\);\s*\};/,
  ],
  if: [
    String.raw`FUNC STR isZero(INT x):
⇨TRY x GRT 0:
⇨GIMME CONCAT("x ", "> 0")!
⇦NO?TRY x LESS 0:
⇨GIMME CONCAT("x ", "< 0")!
⇦GIMME "yes"!
⇦`,
    /function isZero_(\d+)\(x_(\d+)\)/,
  ],
  while: [
    String.raw`INT x IS -5!
INT y IS 7!
UNTIL x EQUALS y AND x GRT 2:
⇨x IS x ADD 1!
LEAVE!
⇦`,
    /let x_(\d+) = \(-\(5\)\);\s*let y_(\d+) = 7;\s*while \(\(\(x_\1 === y_\2\) && \(x_\1 > 2\)\)\) \{\s*x_\1 = \(x_\1 \+ 1\);\s*break;\s*\};/,
  ],
  dict: [
    String.raw`DICT<STR:FLT> sizes IS {"red": 2.4, "blue": 3, "green": 5.6}!`,
    /let sizes_(\d+) = \{\s*"red": 2.4,\s*"blue": 3,\s*"green": 5.6\s*};/,
  ],
  tup: [
    String.raw`ARR<FLT> evens IS [2, 4.3, 6, 8]!
INT size IS SIZE(evens)!
evens IS PUSH(evens, 10)!
FLT x IS evens[2]!
SAY(x)!
TUP<STR,FLT,FLT> tuple IS ("hello!", 2, 2.4)!
`,
    /let evens_(\d+) = \[2, 4.3, 6, 8\];\s*let size_(\d+) = evens_\1.length;\s*evens_\1 = evens_\1.push\(10\);\s*let x_(\d+) = evens_\1\[2\];\s*console.log\(x_\3\);\s*let tuple_(\d+) = \["hello!", 2, 2.4\];/,
  ],
  builtins: [
    String.raw`EXIT(3)
`,
    /process\.exit\(3\)/,
  ],
  anotherIf: [
    String.raw`FUNC STR isZero(INT x):
⇨TRY x GRTEQ 0:
⇨GIMME CONCAT("x ", "> 0")!
⇦NO?TRY x NOTEQ 0:
⇨GIMME CONCAT("x ", "< 0")!
⇦NO???:
⇨GIMME "x is zero"!
⇦GIMME "idk"!
⇦`,
    /function isZero_(\d+)\(x_(\d+)\)/,
  ],
  boolean: [
    String.raw`BOO b IS ~TRUE!
BOO c IS FALSE!
  `,
    /let b_(\d+) = \(!\(true\)\);\s*let c_(\d+) = false;\s*/,
  ],
  builtins2: [
    String.raw`DICT<STR:FLT> d IS {"a": 2.4, "b": 5.6}!
ARR<STR> keys IS KEYS(d)!
ARR<STR> values IS VALUES(d)!
`,
    /let d_(\d+) = \{\s*"a": 2.4,\s*"b": 5.6\s*\};\s*let keys_(\d+) = Object.keys\(d_\1\);\s*let values_(\d+) = Object.values\(d_\1\);/,
  ],
  evenMoreBuiltin: [
    String.raw`DICT<STR:INT> d IS {"hey": 1, "there": 3}!
SAY(d.GET("hey"))!
`,
    /let d_(\d+) = \{\s*"hey": 1,\s*"there": 3\s*\};\s*console.log\(d_(\d+)\["hey"\]\);/,
  ],
};
describe("The JavaScript generator", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct output for ${name}`, (done) => {
      const ast = parse(source);
      analyze(ast);
      expect(generate(ast)).toMatch(expected);
      done();
    });
  });
});
