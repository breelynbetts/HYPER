const parse = require("../../ast/parser");
const analyze = require("../../semantics/analyzer");
const generate = require("../../backend/javascript-generator");
require("../../semantics/optimizer");

const fixture = {
  arithmetic: [String.raw`5 MULT -2 ADD 8`, String.raw`-2`],
  assignAndDec: [
    String.raw`INT s IS 4 POW 2!
s IS (((10 DIV 5) MOD 2) MULT 10)!
  `,
    /let s_(\d+) = 16;\s*s_\1 = 0;/,
  ],
  while: [
    String.raw`UNTIL 7 EQUALS 7:
⇨LEAVE!
⇦`,
    /while \(true\) \{\s*break;\s*\}/,
  ],
  subscriptedExp: [
    String.raw`ARR<FLT> evens IS [2, 4.3, 6, 8]!
FLT x IS evens[2]!`,
    /let nothing/,
  ],
};

describe("The JavaScript generator with optimization", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct output for ${name}`, (done) => {
      const ast = parse(source);
      analyze(ast);
      ast.optimize();
      expect(generate(ast)).toMatch(expected);
      done();
    });
  });
});
