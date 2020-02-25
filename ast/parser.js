const fs = require('fs');
const ohm = require('ohm-js');

const {

} = require('../ast');

const grammar = ohm.grammar(fs.readFileSync('grammar/hyper.ohm')); 