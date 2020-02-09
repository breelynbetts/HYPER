
/* 
 *  Grammar Success Checker
 *   
 */
const syntaxCheck = require('../syntax-checker');

const program = String.raw`
SAY 1; 

`;

describe('Syntax Checker', () => {
    test('accepts all syntactic forms', (done) => {
        expect(syntaxCheck(program)).toBe(true);
        done();
    });
})