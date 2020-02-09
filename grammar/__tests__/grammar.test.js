
/* 
 *  Grammar Success Checker
 *   
 */
const syntaxCheck = require('../syntax-checker');

const program = String.raw`
INT x!

LOOKAT INT x IN range(0,10):
    SAY x!

`;


describe('The syntax checker', () => {
  test('accepts the mega program with all syntactic forms', (done) => {
    expect(syntaxCheck(program)).toBe(true);
    done();
  });
});