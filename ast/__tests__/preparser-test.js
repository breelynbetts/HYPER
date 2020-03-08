/*
 * Preparser Tests
 * credit to : https://github.com/rtoal/plainscript/blob/master/src/__tests__/preparser/preparser-test.ts
 *
 */

const fs = require("fs");
const assert = require("assert");
const withIndentsAndDedents = require("../preparser");

describe("The pre-parser", () => {
  // When testing that the preprocessor works as intended, we scan a bunch of
  // files in this directory, including both source code files (.ps) and the
  // expected results (.pls.expected). The test script picks up all the files
  // it finds, based on file names, and processes them and checks them against
  // their expectations.
  fs.readdirSync(__dirname).forEach(name => {
    if (name.endsWith(".hyper")) {
      it(`produces the correct indent/dedent markup for ${name}`, done => {
        fs.readFile(`${__dirname}/${name}`, "utf-8", (err, input) => {
          fs.readFile(
            `${__dirname}/${name}.expected`,
            "utf-8",
            (_err, expected) => {
              assert.equal(withIndentsAndDedents(input), expected);
              done();
            }
          );
        });
      });
    } else if (name.endsWith(".indent-error")) {
      test(`detects indentation errors in ${name}`, done => {
        fs.readFile(`${__dirname}/${name}`, "utf-8", (err, input) => {
          expect(() => withIndentsAndDedents(input)).toThrow(/Indent Error/);
          done();
        });
      });
    }
  });

  it("handles files that do not end with newlines", done => {
    const input = "def f():\n  return 0";
    assert.equal(withIndentsAndDedents(input), "def f():\n⇨return 0\n⇦\n");
    done();
  });

  it("detects leading tab characters and says they are bad", done => {
    const input = "def f():\n\treturn 0\n";
    assert.throws(
      () => withIndentsAndDedents(input),
      /Illegal whitespace.*?\{9\}/
    );
    done();
  });
  it("detects tab characters after spaces and says they are bad", done => {
    const input = "def f():\n   \treturn 0\n";
    assert.throws(
      () => withIndentsAndDedents(input),
      /Illegal whitespace.*?\{9\}/
    );
    done();
  });
  it("detects non-breaking spaces and says they are bad", done => {
    const input = "def f():\n\xA0return 0";
    assert.throws(
      () => withIndentsAndDedents(input),
      /Illegal whitespace.*?\{a0\}/
    );
    done();
  });
});
