/*
 *  Grammar Error Checker
 *
 */
const syntaxCheck = require("../syntax-checker");

const errors = [
  ["ambigous operations ", "INT x IS 5++ ** 7!"],
  ["forgotten ! at end of line ", 'STR x IS "Hyper"'],
  [
    "no type declaration of FUNC",
    `FUNC isEven(INT num):
    ⇨ GIMME num MOD 2 EQUALS 0!
    ⇦`
  ]
];

describe("The syntax checker", () => {
  errors.forEach(([error, example]) => {
    test(`detects the error ${error}`, done => {
      expect(syntaxCheck(example)).toBe(false);
      done();
    });
  });
});
