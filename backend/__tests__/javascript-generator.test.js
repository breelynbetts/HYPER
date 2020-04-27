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
    /let x_(\d+) = 5;\s+x_\1 = 3/,
  ],
  // NEED TO EXPAND ON CHECK
  call: [
    String.raw`ARR<STR> c IS ["hey"]! 
STR b IS x(c, "3", 1)!
FUNC STR x(ARR<STR> x, STR y, FLT z):
⇨GIMME y!
⇦`,
    /let c_(\d+) = Array\(1\).fill\(\"hey\"\);\s*/,
  ],
  for: [
    String.raw`INT total!
FUNC LITERALLYNOTHING hey(): 
⇨LOOKAT INT x IN RANGE(0, 10):
⇨total IS total ADD x!
⇦SAY(RANGE[3, 12, 3])!
⇦`,
    /let total_(\d+);\s*function hey_(\d+)\(\)/,
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
    /let x_(\d+) = \(-\(5\)\);\s*/,
  ],
  dict: [
    String.raw`DICT<STR:FLT> sizes IS {"red": 2.4, "blue": 3, "green": 5.6}!`,
    /let sizes_(\d+) /,
  ],
  tup: [
    String.raw`ARR<FLT> evens IS [2, 4.3, 6, 8]!
INT size IS SIZE(evens)!
evens IS PUSH(evens, 10)!
FLT x IS evens[2]!
SAY(x)!
TUP<STR,FLT,FLT> tuple IS ("hello!", 2, 2.4)!
`,
    /let evens_(\d+) = Array\(4\).fill\(2, 4.3, 6, 8\);\s*/,
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
