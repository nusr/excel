import { scan } from "./core/scanner";
import { statement } from "./core/parse";
import { interpretAST } from "./core/interpreter";
import { globalData } from "./core/token";
import { addBuildInMethod } from "./init/buildInFn";

function jsParser(content = ""): void {
  globalData.reset();
  globalData.content = content;
  scan(); // get first token
  const astNodeTree = statement(); // get AST
  // console.log(astNodeTree);
  interpretAST(astNodeTree, null, globalData.globalScope); // code generate
}
export { addBuildInMethod, jsParser };
const mock1 = "log(333, 22);";

function init(data: string) {
  addBuildInMethod("log", (...result: unknown[]) => {
    console.log(...result);
  });
  jsParser(data);
}
if (process.env.NODE_ENV !== "test") {
  init(mock1);
}
