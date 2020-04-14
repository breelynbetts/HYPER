/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require("../../ast/parser");
const analyze = require("../analyzer");

const program = String.raw`
DICT<STR:FLT> sizes IS {"red": 2.4, "blue": 3, "green": 5.6}!
sizes["orange"] IS 3.56!
TUP<STR,INT,FLT> tuple IS ("hello!", 2, 2.4)!
INT sum IS getSum("3","4")!
FUNC INT getSum (STR a, STR b):
⇨INT strA IS strToInt(a)!
INT strB IS strToInt(b)!
INT sum IS a MULT b!
GIMME sum! 
⇦
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
