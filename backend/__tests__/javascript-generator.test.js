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
⇨LOOKAT INT x IN RANGE(0, 10, 1):
⇨total IS total ADD x!
⇦SAY("hey")!
⇦`,
    /let total_(\d+);\s*function hey_(\d+)\(\)/,
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
