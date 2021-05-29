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
  interpretAST(astNodeTree, null, globalData.gScope); // code generate
}
export { addBuildInMethod, jsParser };
const mock1 = `//Let's do something , like a array sort
function quickSort(list,len) {
    let a = 0;
    let b = len-1;
    let c = list[a];
    while (a < b){
        while (list[b]>c && a < b){
            b = b-1;
        }
        if(list[b] < c){
            list[a] = list[b];
            list[b] = c;
            b = b-1;
            c = list[b];
        }
         while (list[a] < c && a < b){
            a = a + 1;
         }
        if(list[a] > c){
            list[b] = list[a];
            list[a] = c;
            a = a + 1;
            c = list[a];
        }
    }
    return list;
}

let arr = [9,3,2,1,5,-2,6];
quickSort(arr,7);

log(arr);`;

function init(data: string) {
  addBuildInMethod("log", (...result: unknown[]) => {
    console.log(result);
  });
  jsParser(data);
}
if (process.env.NODE_ENV !== "test") {
  init(mock1);
}
