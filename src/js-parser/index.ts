import { scan } from "./core/scanner";
import { statement } from "./core/parse";
import { interpretAST } from "./core/interpreter";
import { globalData } from "./core/token";
import { buildInMethodHandler } from "./init/buildInFn";

function jsParser(content = ""): void {
  globalData.reset();
  globalData.content = content;
  scan(); // get first token
  const astNodeTree = statement(); // get AST
  // console.log(astNodeTree);
  interpretAST(astNodeTree, null, globalData.globalScope); // code generate
}
export { buildInMethodHandler, jsParser };
const mock1 = `let i;
let result;
i = 0;
while (i < 10) {
  i = i + 1;
}
result = i * 2;
log(result);
`;

function init(data: string) {
  buildInMethodHandler.register("log", (...result: unknown[]) => {
    console.log(...result);
  });
  jsParser(data);
}
if (process.env.NODE_ENV !== "test") {
  init(mock1);
}
