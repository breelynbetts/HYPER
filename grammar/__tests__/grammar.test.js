
/* 
 *  Grammar Success Checker
 *   
 */
const syntaxCheck = require('../syntax-checker');

const program = String.raw`
INT x!
`;


describe('Syntax Checker', () => {
    test('accepts all syntactic forms', (done) => {
        expect(syntaxCheck(program)).toBe(true);
        done();
    });
})