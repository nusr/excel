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
import{a as I,c as k}from"./chunk-BKOMAG5H.js";import{a as B,c as d,f as w,g as L,i as A,j as H,l as F,p as _,q as D}from"./chunk-2WXICHEX.js";import{Da as l,ka as M,p as S,q as E,s as T}from"./chunk-3OL4F4KC.js";import{c as P}from"./chunk-AI5EXC2Q.js";var e=P(B());var r=P(B());var o={"sheet-bar-wrapper":"A","sheet-bar-list":"Co","sheet-bar-item":"F",active:"zo","sheet-bar-item-text":"Po","sheet-bar-item-color":"Ro","sheet-bar-context-menu":"L","sheet-bar-input":"jo","show-block":"Io","sheet-bar-unhide":"Zo","add-button":"Bo","menu-button":"Ho","select-popup":"Ao","unhide-select":"Fo"};var y=(0,r.memo)(({controller:s,position:h,sheetList:u,currentSheetId:b,hideMenu:a,editSheetName:f})=>{let[c]=L(a),g=(0,r.useMemo)(()=>u.find(n=>n.sheetId===b)?.tabColor||"",[u,b]),p=(0,r.useMemo)(()=>u.filter(n=>n.isHide).map(n=>({value:String(n.sheetId),label:n.name,disabled:!1})),[u]),x=()=>{let n=String(p[0]?.value)||"";F({visible:!0,title:l("unhide-sheet"),testId:"sheet-bar-context-menu-unhide-dialog",children:r.default.createElement(A,{data:p,onChange:C=>{n=String(C)},className:o["unhide-select"],defaultValue:n,testId:"sheet-bar-context-menu-unhide-dialog-select"}),onCancel:a,onOk(){if(!n)return _.error(l("sheet-id-can-not-be-empty"));s.unhideSheet(n),a()}})},m=n=>{s.updateSheetInfo({tabColor:n}),a()};return r.default.createElement("div",{className:o["sheet-bar-context-menu"],style:{left:h},ref:c,"data-testid":"sheet-bar-context-menu"},r.default.createElement(d,{testId:"sheet-bar-context-menu-insert",onClick:()=>{a(),s.addSheet()}},l("insert")),r.default.createElement(d,{testId:"sheet-bar-context-menu-delete",onClick:()=>{a(),s.deleteSheet()}},l("delete")),r.default.createElement(d,{testId:"sheet-bar-context-menu-rename",onClick:()=>{a(),f()}},l("rename")),r.default.createElement(d,{testId:"sheet-bar-context-menu-hide",onClick:()=>{a(),s.hideSheet()}},l("hide")),r.default.createElement(d,{testId:"sheet-bar-context-menu-unhide",className:o["sheet-bar-unhide"],disabled:p.length===0,onClick:x},l("unhide")),r.default.createElement(D,{color:g,onChange:m,position:"top",testId:"sheet-bar-context-menu-tab-color"},r.default.createElement(d,{className:o["sheet-bar-unhide"],testId:"sheet-bar-context-menu-tab-color"},l("tab-color"))))});y.displayName="SheetBarContextMenu";var O=(0,e.memo)(({controller:s})=>{let h=(0,e.useSyncExternalStore)(I.subscribe,I.getSnapshot),u=(0,e.useMemo)(()=>h.filter(t=>!t.isHide),[h]),b=(0,e.useMemo)(()=>h.filter(t=>!t.isHide).map(t=>({value:t.sheetId,label:t.name,disabled:!1})),[h]),[a,f]=(0,e.useState)(!1),{currentSheetId:c}=(0,e.useSyncExternalStore)(k.subscribe,k.getSnapshot),[g,p]=(0,e.useState)(S),[x,m]=(0,e.useState)(!1),n=(0,e.useCallback)(t=>{t.preventDefault();let i=t.clientX-30;return p(i),!1},[]),C=(0,e.useCallback)(t=>{if(t.stopPropagation(),t.key==="Enter"){let i=t.currentTarget.value;if(m(!1),!i)return;s.renameSheet(i)}},[]),K=(0,e.useCallback)(t=>{f(!1),s.setCurrentSheetId(t)},[]),X=(0,e.useCallback)(()=>{s.addSheet()},[]),$=(0,e.useCallback)(()=>{p(S)},[]),j=(0,e.useCallback)(()=>{m(!0)},[]),z=(0,e.useCallback)(()=>{f(t=>!t)},[]);return e.default.createElement("div",{className:o["sheet-bar-wrapper"],"data-testid":"sheet-bar"},e.default.createElement("div",null,e.default.createElement(d,{onClick:z,className:o["menu-button"],testId:"sheet-bar-select-sheet"},e.default.createElement(w,{name:"menu"})),a&&e.default.createElement(H,{data:b,onChange:K,active:!0,position:"top",value:c,testId:"sheet-bar-select-sheet-popup",className:o["select-popup"]})),e.default.createElement("div",{className:o["sheet-bar-list"],"data-testid":"sheet-bar-list"},u.map(t=>{let i=c===t.sheetId,U=i&&x,v=t.tabColor||"",V=M(o["sheet-bar-item"],{[o.active]:i}),N;!i&&!x&&v&&(N={backgroundColor:v});let G=i?"sheet-bar-active-item":void 0;return e.default.createElement("div",{"data-testid":`${E}${t.sheetId}`,key:t.sheetId,className:V,style:N,onContextMenu:n,onClick:()=>{c!==t.sheetId&&(m(!1),s.setCurrentSheetId(t.sheetId))}},U?e.default.createElement("input",{className:o["sheet-bar-input"],defaultValue:t.name,onKeyDown:C,type:"text",spellCheck:!0,maxLength:T,"data-testid":"sheet-bar-rename-input"}):e.default.createElement(e.default.Fragment,null,i&&v&&e.default.createElement("span",{className:o["sheet-bar-item-color"],style:{backgroundColor:v},"data-testid":"sheet-bar-tab-color-item"}),e.default.createElement("span",{className:o["sheet-bar-item-text"],"data-testid":G},t.name)))})),e.default.createElement(d,{onClick:X,type:"circle",className:o["add-button"],testId:"sheet-bar-add-sheet"},e.default.createElement(w,{name:"plus"})),g>=0&&e.default.createElement(y,{controller:s,position:g,sheetList:h,currentSheetId:c,hideMenu:$,editSheetName:j}))});O.displayName="SheetBarContainer";var ae=O;export{O as SheetBarContainer,ae as default};
//# sourceMappingURL=SheetBar-EX2J6RRH.js.map
