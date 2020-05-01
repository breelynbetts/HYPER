const parse = require("../../ast/parser");
const analyze = require("../../semantics/analyzer");
const generate = require("../../backend/javascript-generator");
require("../../semantics/optimizer");

const fixture = {
  arithmetic: [String.raw`5 MULT -2 ADD 8`, String.raw`-2`],
  assignAndDec: [
    String.raw`INT s IS 4.5 POW 2!
s IS (((10 DIV 5) MOD 2) MULT 10)!
  `,
    /let s_(\d+) = 20.25;\s*s_\1 = 0;/,
  ],
  operations: [
    String.raw`FALSE OR ~FALSE
TRUE AND ~FALSE
(5 LESS 2) AND (100 LESS 5)
(7 GRT 2) OR (100 LESS 5)
(7 GRT 2) OR (100 GRTEQ 5)
`,
    /idk/,
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
