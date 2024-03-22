/* 
MIT License

Copyright (c) 2020 Steve Xu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
import{P as u,a as s}from"./chunk-4Q4N6XUW.js";import{d as l}from"./chunk-RBTA6K5V.js";var d=l(s());var t={buttonWrapper:"r",circle:"j",disabled:"B",active:"A",plain:"F",primary:"H"};var x=r=>{let{className:e="",onClick:a=()=>{},disabled:o=!1,active:c=!1,type:i="normal",style:b={},testId:m=void 0,title:v,dataType:f,buttonType:y,children:k}=r,C=u(t.buttonWrapper,e,{[t.disabled]:o,[t.active]:c,[t.circle]:i==="circle",[t.plain]:i==="plain",[t.primary]:i==="primary"});return d.default.createElement("button",{onClick:a,style:b,title:v,className:C,"data-testid":m,"data-type":f,type:y},k)};x.displayName="Button";var n=l(s());function T(r){let e=(0,n.useRef)(null),[a,o]=(0,n.useState)(!1);function c(i){e&&e.current&&(e.current.contains(i.target)?o(!1):(o(!0),r()))}return(0,n.useEffect)(()=>(document.addEventListener("pointerdown",c),()=>{document.removeEventListener("pointerdown",c)}),[]),[e,a]}var p=l(s());function h(r){let e=(0,p.useRef)(r),a=(0,p.useRef)(o=>{e.current&&e.current(o)});return e.current=r,a.current}export{x as a,T as b,h as c};
//# sourceMappingURL=chunk-V3AV6GBF.js.map
