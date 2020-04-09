/*
 * Semantic Error Tests
 *
 * These tests check that the analyzer will reject programs with various
 * static semantic errors.
 */

const parse = require("../../ast/parser");
const Context = require("../context");

// ERRORS TO IMPLEMENT:
//     use of an undeclared variable,
//     types don’t match in declaration,
//     type mismatch in assignment,
//     too many/too few function arguments,
//     redeclared field,
//     array index out of range (int[] v = new int[10]; v[10] = 100;),
//     performing an impossible cast (boolean into int),
//     call of nonfunction,
//     no such field
//     type mismatch in DICTs => DICT<INT:STR> z IS {"abc": TRUE, 24: FALSE, 34: "good"}!\n
//     type mismatch in TUPs => TUP<INT,STR> z IS ("abc", TRUE)!\n
//     type mismatch in ARRs => ARR<INT> z IS ["abc", TRUE, 24, 34, "good"]!\n
//     non integer subscript

const errors = [
  ["type mismatch in assignment", 'INT x IS 5!\nx IS "blue"!\n'],
  [
    "type mismatch in dictionary",
    'DICT<INT:STR> z IS {"abc": TRUE, 24: FALSE, 34: "good"}!\n',
  ],
];

describe("The semantic analyzer", () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, (done) => {
      const astRoot = parse(program);
      expect(astRoot).toBeTruthy();
      expect(() => astRoot.analyze(Context.INITIAL)).toThrow();
      done();
    });
  });
});
