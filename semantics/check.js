const util = require("util");
const {
  ArrayType,
  TupleType,
  DictType,
  SequenceType,
  NoneType,
  AnyType,
  Func,
} = require("../ast");
const { BoolType, FloatType, IntType, StringType } = require("./builtins");

function doCheck(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

module.exports = {
  // TODO: FIX HOW TO CHECK TYPES
  //    - add isRange() test

  isArrayType(type) {
    doCheck(type.constructor === ArrayType, "Not an ArrayType");
  },
  isDictType(type) {
    doCheck(type.constructor === DictType, "Not a DictType");
  },
  isTupleType(type) {
    doCheck(type.constructor === TupleType, "Not a TupleType");
  },
  isArray(expression) {
    doCheck(expression.type.constructor === ArrayType, "Not an array");
  },
  isDict(expression) {
    doCheck(expression.type.constructor === DictType, "Not a dictionary");
  },
  isTuple(expression) {
    doCheck(expression.type.constructor === TupleType, "Not a tuple");
  },
  isInteger(expression) {
    doCheck(expression.type === IntType, "Not an integer");
  },
  isFloat(expression) {
    doCheck(expression.type === FloatType, "Not a float");
  },
  isNumber(expression) {
    doCheck(
      expression.type === IntType || expression.type === FloatType,
      "Not a number"
    );
  },
  isString(expression) {
    doCheck(expression.type === StringType, "Not an string");
  },
  isStringOrArray(expression) {
    doCheck(
      expression.type === StringType ||
        expression.type.constructor === ArrayType
    );
  },
  isBoolean(expression) {
    doCheck(expression.type === BoolType, "Not a boolean");
  },
  isFunction(value) {
    doCheck(value.constructor === Func, "Not a function");
  },
  inFunction(context) {
    doCheck(context.currentFunction !== null, "Not a function");
  },
  expressionsHaveSameType(e1, e2) {
    doCheck(e1.type === e2.type, "Types must match exactly");
  },

  isAssignableTo(expression, type) {
    doCheck(
      expression.type === type ||
        (expression.type === IntType && type === FloatType) ||
        (expression.type === String && type === SequenceType) ||
        (expression.constructor === ArrayType && type === SequenceType) ||
        (this.isArray(expression) &&
          this.isArrayType(type) &&
          this.isAssignableTo(expression.type.memberType, type.memberType)) ||
        (this.isDict(expression) &&
          this.isDictType(type) &&
          this.isAssignableTo(expression.type.keyType, type.keyType) &&
          this.isAssignableTo(expression.type.valueType, type.valueType)) ||
        (this.isTuple(expression) &&
          this.isTupleType(type) &&
          expression.type.memberTypes.every(
            (t, i) => t === type.memberTypes[i]
          )) ||
        (expression.type !== NoneType && this.type === AnyType),
      `Expression of type ${util.format(
        expression.type
      )} not compatible with type ${util.format(type)}`
    );
  },
  inLoop(context, keyword) {
    doCheck(context.inLoop, `${keyword} can only be used in a loop`);
  },
  legalArguments(args, params) {
    doCheck(
      args.length === params.length,
      `Expected ${params.length} args in call, got ${args.length}`
    );
    args.forEach((arg, i) => {
      if (params[i].type === StringType && arg.type !== StringType) {
        arg.type = StringType;
      }
      this.isAssignableTo(arg, params[i].type);
    });
  },
  returnTypeMatchesFunctionReturnType(expression, func) {
    const expType = expression.type;
    const funcReturnType = func.returnType;
    doCheck(
      this.isAssignableTo(expType, funcReturnType),
      `Expected function to return expression of type ${util.format(
        funcReturnType
      )}, received type ${util.format(expType)}`
    );
  },
};
