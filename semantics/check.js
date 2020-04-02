const util = require("util");
const { ArrayType, Function, RecordType, Identifier } = require("../ast");
const {
  BoolType,
  FloatType,
  IntType,
  NoneType,
  StringType
} = require("./builtins");

function doCheck(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

module.exports = {};
