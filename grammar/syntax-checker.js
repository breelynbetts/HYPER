const ohm = require("ohm-js");
const fs = require("fs");

const grammar = ohm.grammar(fs.readFileSync("grammar/hyper.ohm"));

module.exports = text => grammar.match(text).succeeded();
