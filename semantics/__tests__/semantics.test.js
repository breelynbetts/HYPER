/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require("../../ast/parser");
const analyze = require("../analyzer");

const program = {
  while: [
    String.raw`INT x IS -5!
INT y IS 7!
UNTIL x EQUALS y AND x GRT 2:
⇨ x IS x ADD 1!
⇦`,
  ],
  for: [
    String.raw`INT total!
FUNC LITERALLYNOTHING hey(): 
⇨LOOKAT INT x IN RANGE(0, 10, 1):
⇨total IS total ADD x!
⇦SAY("hey")!
⇦`,
  ],
  func: [
    String.raw`DICT<STR:FLT> sizes IS {"red": 2.4, "blue": 3, "green": 5.6}!
FLT t IS 2!
ARR<INT> evens IS [2, 4, 6, 8]!
evens[3] IS 10!
FLT c IS -3.4!
BOO s IS ~FALSE!
TUP<STR,FLT,FLT> tuple IS ("hello!", 2, 2.4)!
INT sum IS getSum(3,4)!
FUNC INT getSum (INT a, INT b):
⇨INT sum IS a MULT b!
GIMME sum!
⇦`,
  ],
  funcCoercion: [
    String.raw`ARR<STR> c IS ["hey"]! 
STR b IS x(c, "3")!
FUNC STR x(ARR<STR> x, STR y):
⇨GIMME y!
⇦`,
  ],
  for2: [
    String.raw`ARR<STR> a IS ["hyper", "needs", "hype"]!
LOOKAT STR s IN a:
⇨CONCAT(s, "!!!")
⇦`,
  ],
  if: [
    String.raw`FUNC STR isZero(INT x):
⇨TRY x GRT 0:
⇨GIMME "x > 0"!
⇦NO?TRY x LESS 0:
⇨GIMME "x < 0"!
⇦NO???:
⇨GIMME "x = 0"!
⇦GIMME "done!"!
⇦`,
  ],
  func2: [
    String.raw`FUNC ARR<STR> arrayStr(STR x):
⇨GIMME [x]!
⇦`,
  ],
  //   if2: [
  //     String.raw`INT x IS 4!
  // TRY x GRT 0:
  // ⇨GIMME "x > 0"!
  // ⇦NO???:
  // ⇨GIMME "x = 0"!
  // ⇦`,
  //   ],
};

// INT x IS 1!
// SAY(x)!

// INT sum IS getSum(3,4)!
// FUNC INT getSum (STR a, STR b):
// ⇨INT strA IS strToInt(a)!
// INT strB IS strToInt(b)!
// INT sum IS a MULT b!
// GIMME sum!
// ⇦
// ?!
// `;

describe("The semantic analyzer", () => {
  Object.entries(program).forEach(([name, [code]]) => {
    test(`accepts the mega program ${name} with all syntactic forms`, (done) => {
      const astRoot = parse(code);
      expect(astRoot).toBeTruthy();
      analyze(astRoot);
      expect(astRoot).toBeTruthy();
      done();
    });
  });
});
