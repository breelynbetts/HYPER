// The Semantic Analyzer for HYPER!
const {
  Program,
  Block,
  ForStatement,
  WhileStatement,
  IfStatement,
  Func,
  Assignment,
  Declaration,
  ArrayType,
  DictType,
  TupleType,
  SequenceType,
  AnyType,
  UnionType,
  PrintStatement,
  ReturnStatement,
  Break,
  BinaryExp,
  UnaryExp,
  ArrayExp,
  DictExp,
  TupleExp,
  CallExp,
  RangeExp,
  MemberExp,
  SubscriptedExp,
  Param,
  KeyValue,
  Literal,
  Identifier,
} = require("../ast");
const {
  BoolType,
  FloatType,
  IntType,
  NoneType,
  StringType,
} = require("./builtins");
const check = require("./check");
const Context = require("./context");

module.exports = (exp) => exp.analyze(Context.INITIAL);

function getType(typeString) {
  switch (typeString) {
    case "STR":
      return StringType;
    case "BOO":
      return BoolType;
    case "FLT":
      return FloatType;
    case "INT":
      return IntType;
    case "LITERALLYNOTHING":
      return NoneType;
    default:
      return typeString;
  }
}

Program.prototype.analyze = function(context) {
  this.block.analyze(context);
};

Block.prototype.analyze = function(context) {
  const localContext = context.createChildContextForBlock();
  this.statements.forEach((s) => s.analyze(localContext));
};

// class ForStatement {
//   constructor(type, id, test, body) {
//     Object.assign(this, {
//       type,
//       id,
//       test,
//       body,
//     });
//   }
// }
ForStatement.prototype.analyze = function(context) {
  const bodyContext = context.createChildContextForLoop();
  // come back to this
  // need to figure out how to check for something like:
  //        ARR<STR> friends IS ["Lexi", "Maya", "Bree"]!
  //        LOOKAT STR friend IN friends:
  //    => check that test.type === type
  //      => add id to context & make sure that test is in context if there
};

WhileStatement.prototype.analyze = function(context) {
  this.test.analyze(context);
  check.isBoolean(test);
  this.body.analyze(context.createChildContextForLoop());
};

IfStatement.prototype.analyze = function(context) {
  this.tests.forEach((test) => test.analyze(context));
  this.tests.forEach((test) => check.isBoolean(test));
  this.consequents.forEach((consequent) =>
    consequent.analyze(context.createChildContextForBlock())
  );
  this.alternate.analyze(context.createChildContextForBlock());
};

Func.prototype.analyzeSignature = function(context) {
  this.bodyContext = context.createChildContextForFunctionBody();
  this.params.forEach((p) => p.analyze(this.bodyContext));
  this.returnType = !this.returnType
    ? undefined // should be syntax error
    : context.lookup(this.returnType);
};

Func.prototype.analyze = function() {
  this.body.analyze(this.bodyContext);
  check.isAssignableTo(this.body, this.returnType);
  delete this.bodyContext;
};

Assignment.prototype.analyze = function(context) {
  this.target.analyze(context);
  this.source.analyze(context);
  check.isAssignableTo(this.source, this.target.type);
};

Declaration.prototype.analyze = function(context) {
  context.variableMustNotBeDeclared(this.id);
  console.log(this);
  this.init.analyze(context);
  console.log(this);
  this.type = this.type.analyze(context);
  console.log(this.type);
  console.log(this.init);
  check.isAssignableTo(this.init, this.type);

  context.add(this.id, this);
  console.log("DECLARARTIONS", context.declarations);
};

ArrayType.prototype.analyze = function(context) {
  check.isArrayType(this);
  this.type = getType(this.memberType);
  // this.memberType = context.lookup(this.memberType);
};

DictType.prototype.analyze = function(context) {
  console.log("HERE");
  console.log(this);
  this.keyType.analyze(context);
  console.log(this.keyType);
  this.valueType.analyze(context);
  console.log(this.valueType);
};

TupleType.prototype.analyze = function(context) {
  this.memberTypes.forEach((type) => type.analyze(context));
};

PrintStatement.prototype.analyze = function(context) {
  this.expression.analyze(context);
};

ReturnStatement.prototype.analyze = function(context) {
  check.inFunction(context);
  if (this.expression) {
    this.expression.analyze(context);
  }
  check.returnTypeMatchesFunctionReturnType(
    this.expression,
    context.currentFunction
  );
};

Break.prototype.analyze = function(context) {
  check.inLoop(context, "LEAVE");
};

BinaryExp.prototype.analyze = function(context) {
  this.left.analyze(context);
  this.right.analyze(context);
  if (["LESSEQ", "GRTEQ", "LESS", "GRT"].includes(this.op)) {
    check.isNumber(this.left);
    check.isNumber(this.right);
    this.type = BoolType;
  } else if (["EQUALS", "NOTEQ"].includes(this.op)) {
    check.expressionsHaveSameType(this.left, this.right);
    this.type = BoolType;
  } else if (["AND", "OR"].includes(this.op)) {
    check.isBoolean(this.left);
    check.isBoolean(this.right);
    this.type = BoolType;
  } else {
    // All other binary operators are arithmetic
    check.isNumber(this.left);
    check.isNumber(this.right);
    this.type = FltType;
  }
};

UnaryExp.prototype.analyze = function(context) {
  this.operand.analyze(context);
  if (this.op === "~") {
    check.isBoolean(this.operand.type);
    this.type = BoolType;
  } else {
    check.isNumber(this.operand.type);
    if (this.operand.type === IntType) {
      this.type = IntType;
    } else this.type = FltType;
  }
};

ArrayExp.prototype.analyze = function(context) {
  this.type = context.lookup(this.type);
  check.isArrayType(this.type);
  this.size.analyze(context);
  check.isInteger(this.size);
  this.members.forEach((member) => {
    member.analyze();
    if (this.type.type === IntType && member.type === FloatType) {
      this.type.type = FloatType;
    } else if (this.type.type === FloatType && member.type === IntType) {
      member.type = FloatType;
    }
    check.isAssignableTo(member, this.type.type);
  });
};

DictExp.prototype.analyze = function(context) {
  this.keyValuePairs.forEach((keyValue) => {
    keyValue.analyze(context);
    // console.log(keyValue.key.type.id === "STR");
    // console.log(getType(keyValue.key.type.id));
    // console.log(getType(this.keyValuePairs[0].key.type.id));
    // check.expressionsHaveSameType(
    //   getType(keyValue.key.type.id),
    //   getType(this.keyValuePairs[0].key.type.id)
    // );
    // check.expressionsHaveSameType(
    //   getType(keyValue.value.type.id),
    //   getType(this.keyValuePairs[0].value.type.id)
    // );
  });
  let keyType = null;
  let valueType = null;
  if (this.keyValuePairs.length > 0) {
    keyType = getType(this.keyValuePairs[0].key.type.id);
    valueType = getType(this.keyValuePairs[0].value.type.id);
  }

  this.type = new DictType(keyType, valueType);
};

TupleExp.prototype.analyze = function(context) {
  this.values.forEach(value, (index) => {
    value.analyze(context);
    check.expressionsHaveSameType(value.type, this.values[index].type);
  });
  const [valueTypes] = this.values;
  this.type = new TupleType(valueTypes);
};
// callee, args
CallExp.prototype.analyze = function(context) {
  this.callee = this.callee.analyze(context);
  check.isFunction(this.callee);
  this.args.forEach((arg) => arg.analyze(context));
  check.legalArguments(this.args, this.callee.params);
  this.type = this.callee.returnType;
};

// value, subscript
MemberExp.prototype.analyze = function(context) {
  this.record.analyze(context);
};

SubscriptedExp.prototype.analyze = function(context) {
  this.array.analyze(context);
  check.isArray(this.array);
  this.subscript.analyze(context);
  check.isInteger(this.subscript);
  this.type = this.array.type.memberType;
};

Param.prototype.analyze = function(context) {
  this.type = context.lookup(this.type);
  context.add(this.id, this);
  // console.log(context.declarations);
};

KeyValue.prototype.analyze = function(context) {
  this.key.analyze(context);
  this.value.analyze(context);
};

Literal.prototype.analyze = function(context) {
  console.log("HERE");
  this.type.analyze(context);
  this.type = getType(this.type);
};

Identifier.prototype.analyze = function(context) {
  this.ref = context.lookup(this.ref);

  // this.type = this.ref.type;
};
