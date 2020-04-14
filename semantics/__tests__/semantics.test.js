/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require("../../ast/parser");
const analyze = require("../analyzer");

const program = String.raw`
INT x IS 1!
SAY(x)!
DICT<STR:FLT> sizes IS {"red": 2.4, "blue": 3, "green": 5.6}!
ARR<INT> evens IS [2, 4, 6, 8]!
evens[3] IS 10!
TUP<STR,INT,FLT> tuple IS ("hello!", 2, 2.4)!
FUNC INT getSum (INT a, INT b):
⇨INT sum IS a MULT b!
GIMME sum!
⇦
!?
INT sum IS getSum("3","4")!
FUNC INT getSum (STR a, STR b):
⇨INT strA IS strToInt(a)!
INT strB IS strToInt(b)!
INT sum IS a MULT b!
GIMME sum!
⇦
?!
`;

describe("The semantic analyzer", () => {
  test("accepts the mega program with all syntactic forms", (done) => {
    const astRoot = parse(program);
    expect(astRoot).toBeTruthy();
    analyze(astRoot);
    expect(astRoot).toBeTruthy();
    done();
  });
});
