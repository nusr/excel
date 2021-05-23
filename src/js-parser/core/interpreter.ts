import { ASTNodeTypes } from "./token";
import { errPrint } from "../init/commons";
import { assignVal, findVar, readVal, assignArr } from "./data";
import { Scope } from "./scope";
import { buildInMethods } from "../init/buildInFn";
import { ASTNode } from "./ASTnode";

function interpretIfAST(astNode: ASTNode, scope: Scope): any {
  const state = interpretAST(astNode.left, null, scope);
  if (state) {
    return interpretAST(astNode.mid, null, scope);
  } else {
    if (astNode.right) {
      return interpretAST(astNode.right, null, scope);
    }
  }
}

function interpretWhileAST(astNode: ASTNode, scope: Scope) {
  const condition = astNode.left;
  const body = astNode.right;
  const state = interpretAST(condition, null, scope);
  if (state) {
    interpretAST(body, null, scope);
    interpretWhileAST(astNode, scope);
  }
}

function interpretFunCallAST(astNode: ASTNode, scope: Scope): any {
  const childScope = new Scope(scope, "block");
  const argument: Record<number, any> = {};
  if (
    astNode.left &&
    astNode.left.op === ASTNodeTypes.T_FUNARGS &&
    Array.isArray(astNode.left.value) &&
    astNode.left.value.length > 0
  ) {
    astNode.left.value.forEach((item: any, index: number) => {
      let result = interpretAST(item, null, scope);
      result = Scope.warpVal(result);
      argument[index] = result;
    });
  }

  if (buildInMethods[astNode.value as string]) {
    const arr = [];
    let i = 0;
    while (typeof argument[i] !== "undefined") {
      arr.push(argument[i] ? argument[i].value : argument[i]);
      ++i;
    }
    buildInMethods[astNode.value as string](...arr);
  } else {
    childScope.set("arguments", argument, ASTNodeTypes.T_ARGUMENT);
    const fnAST = scope.get(astNode.value as string).value;
    fnAST.option = "run";
    return interpretAST(fnAST, null, childScope);
  }
}

function interpretAST(
  astNode: ASTNode | null,
  result = null,
  scope: Scope
): any {
  if (!astNode) {
    return;
  }
  if (scope && scope.returnValue !== null) {
    return;
  }
  switch (astNode.op) {
    case ASTNodeTypes.T_IF:
      return interpretIfAST(astNode, scope);
    case ASTNodeTypes.T_GLUE:
      interpretAST(astNode.left, null, scope);
      interpretAST(astNode.right, null, scope);
      return;
    case ASTNodeTypes.T_AND: {
      const leftState = interpretAST(astNode.left, null, scope);
      if (leftState) {
        const rightState = interpretAST(astNode.right, leftState, scope);
        if (rightState) {
          return true;
        }
      }
      return false;
    }

    case ASTNodeTypes.T_OR: {
      const leftState1 = interpretAST(astNode.left, null, scope);
      if (leftState1) {
        return true;
      }
      return !!interpretAST(astNode.right, leftState1, scope);
    }
    case ASTNodeTypes.T_WHILE:
      return interpretWhileAST(astNode, scope);
    case ASTNodeTypes.T_FUN:
      if (astNode.option === "run") {
        astNode.option = "";
        break;
      } else {
        scope.add(astNode.value);
        scope.set(astNode.value, astNode, ASTNodeTypes.T_FUN);
        return;
      }
    case ASTNodeTypes.T_FUNCALL:
      return interpretFunCallAST(astNode, scope);
  }

  let leftResult;
  let rightResult;

  if (astNode.left) {
    leftResult = interpretAST(astNode.left, null, scope);
  }

  if (astNode.right) {
    rightResult = interpretAST(astNode.right, leftResult, scope);
  }

  result = readVal(result);

  switch (astNode.op) {
    case ASTNodeTypes.T_LVALUE:
      if (leftResult && leftResult._inner && leftResult._parent) {
        return assignArr(leftResult, result);
      }
      return assignVal(astNode.value, result, scope);
  }

  leftResult = readVal(leftResult);
  rightResult = readVal(rightResult);
  switch (astNode.op) {
    case ASTNodeTypes.T_VAR:
      scope.add(astNode.value);
      return;
    case ASTNodeTypes.T_ARGUMENT:
      scope.set(
        astNode.value,
        scope.get("arguments").value[astNode.option].value,
        astNode.type
      );
      return;
    case ASTNodeTypes.T_RETURN:
      scope.returnValue = leftResult;
      return;
    case ASTNodeTypes.T_FUN:
      return scope.returnValue;
    case ASTNodeTypes.T_INT:
      return astNode.value;
    case ASTNodeTypes.T_STRING:
      return astNode.value;
    case ASTNodeTypes.T_ARRAY:
      return (astNode.value || []).map((item: any) => interpretAST(item, null, scope));
    case ASTNodeTypes.T_ADD:
      if (rightResult === null || typeof rightResult === "undefined") {
        return leftResult;
      }
      return leftResult + rightResult;
    case ASTNodeTypes.T_SUB:
      if (rightResult === null || typeof rightResult === "undefined") {
        return -leftResult;
      }
      return leftResult - rightResult;
    case ASTNodeTypes.T_MUL:
      return leftResult * rightResult;
    case ASTNodeTypes.T_DIV:
      return leftResult / rightResult;
    case ASTNodeTypes.T_ASSIGN:
      return rightResult;
    case ASTNodeTypes.T_IDENT:
      return findVar(astNode.value, scope);
    case ASTNodeTypes.T_GE:
      return leftResult >= rightResult;
    case ASTNodeTypes.T_GT:
      return leftResult > rightResult;
    case ASTNodeTypes.T_LE:
      return leftResult <= rightResult;
    case ASTNodeTypes.T_LT:
      return leftResult < rightResult;
    case ASTNodeTypes.T_EQ:
      return leftResult === rightResult;
    case ASTNodeTypes.T_NEQ:
      return leftResult !== rightResult;
    case ASTNodeTypes.T_VISIT:
      return scope.getProperty(astNode.value, leftResult);
    default:
      errPrint(`unknown ASTNode op : ${astNode.op}`);
  }
}

export { interpretAST };
