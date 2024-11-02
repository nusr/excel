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
import{c as E}from"./chunk-CNAOVIPO.js";import{b as L,c as g,g as M,h as I}from"./chunk-3OKLWJMM.js";import"./chunk-PRJU7QU5.js";import{a as N,k as O}from"./chunk-PUNHOOU4.js";import{L as H,X as C,b as y,c as b,fa as z,g as k,ha as B,r as F}from"./chunk-UR5ZFE2U.js";import{c as w}from"./chunk-AI5EXC2Q.js";var i=w(N());var m=w(N());var u={"formula-bar-wrapper":"Lr","defined-name":"Sr","defined-name-editor":"Mr","formula-bar-editor-wrapper":"Ur","formula-bar-value":"p",wrap:"Yr",show:"qr","formula-editor":"C","edit-cell":"Dr"};function R(e,t=!0){let r={};return e?.isItalic&&(r.fontStyle="italic"),e?.isBold&&(r.fontWeight="bold"),e?.fontFamily&&(r.fontFamily=e?.fontFamily),e?.fontSize&&!t&&(r.fontSize=e?.fontSize),e?.fillColor&&!t&&(r.backgroundColor=e.fillColor),e?.fontColor&&!t&&(r.color=e?.fontColor),e?.underline&&e?.isStrike?r.textDecorationLine="underline line-through":e?.underline?r.textDecorationLine="underline":e?.isStrike&&(r.textDecorationLine="line-through"),r}function K(e,t,r){if(t===0)return;let l=t===2,s=R(r,l);return l?s:{...s,top:e.top,left:e.left,width:e.width,height:e.height}}var U=1;function T(e){return Math.max(Math.min(10,e),U)}var _=(0,m.memo)(({initValue:e,style:t,testId:r,isMergeCell:l,controller:s,className:c})=>{let p=(0,m.useRef)(null),[x,h]=(0,m.useState)(U);(0,m.useEffect)(()=>{if(l){let a=e.split(y).length;h(T(a))}else{let a=Math.ceil((p.current?.scrollHeight||20)/20);h(T(a))}},[l,e]);let v=(0,m.useCallback)(a=>{if(a.stopPropagation(),a.key==="Enter"||a.key==="Tab"){let n=a.currentTarget.value,{range:d,isMerged:S}=s.getActiveRange(),f=s.getCell(d);typeof f?.value=="string"&&H(S,f?.value)&&(n=n.replaceAll(b,y)),s.batchUpdate(()=>(s.setCellValue(n,d),a.key==="Enter"?s.setNextActiveCell("down"):s.setNextActiveCell("right"),!0)),g.setState({editorStatus:0}),a.currentTarget.value="",a.currentTarget.blur()}else{let n=Math.ceil(a.currentTarget.scrollHeight/20);h(T(n))}},[]);return m.default.createElement("textarea",{spellCheck:!0,autoFocus:!0,ref:p,style:t,maxLength:35*100,"data-testid":r,"data-role":k,onKeyDown:v,className:C(u["formula-editor"],c),defaultValue:e,rows:x})});_.displayName="MultipleLineEditor";var o=w(N());var D=(0,o.memo)(({controller:e,displayName:t,defineName:r})=>{let l=(0,o.useRef)(null),[s,c]=(0,o.useState)(t),p=(0,o.useSyncExternalStore)(M.subscribe,M.getSnapshot),x=(0,o.useMemo)(()=>p.map(n=>({disabled:!1,value:n,label:n})),[p]);(0,o.useEffect)(()=>{c(t)},[t]);let h=(0,o.useCallback)(n=>{if(n.stopPropagation(),n.key==="Enter"){let d=n.currentTarget.value.trim().toLowerCase();if(l.current?.blur(),!d){c(t);return}let S=e.checkDefineName(d);if(S){c(t),E(e,S);return}let f=z(d,X=>e.getSheetList().find(G=>G.name===X)?.sheetId||""),P=e.getSheetInfo(f?.sheetId||e.getCurrentSheetId());if(f&&f.col<P.colCount&&f.row<P.rowCount){f.sheetId=f.sheetId||e.getCurrentSheetId(),c(t),E(e,f);return}F.test(d)&&d.length<=256?e.setDefineName(e.getActiveRange().range,d):c(t)}},[t]),v=(0,o.useCallback)(n=>{c(n.target.value)},[]),a=(0,o.useCallback)(n=>{let d=e.checkDefineName(n);d&&E(e,d)},[]);return o.default.createElement(O,{testId:"formula-bar-name",value:r,data:x,onChange:a,className:u["defined-name"]},o.default.createElement("input",{value:s,ref:l,spellCheck:!0,type:"text",onChange:v,className:u["defined-name-editor"],onKeyDown:h,maxLength:35*8,"data-testid":"formula-bar-name-input"}))});D.displayName="DefineName";var V=(0,i.memo)(({controller:e})=>{let t=(0,i.useSyncExternalStore)(L.subscribe,L.getSnapshot),r=(0,i.useSyncExternalStore)(I.subscribe,I.getSnapshot),{editorStatus:l}=(0,i.useSyncExternalStore)(g.subscribe,g.getSnapshot),s=(0,i.useMemo)(()=>t.defineName||B({row:t.row,col:t.col,rowCount:1,colCount:1,sheetId:""}),[t.defineName,t.col,t.row]),c=(0,i.useCallback)(()=>{g.setState({editorStatus:2})},[]),p=(0,i.useMemo)(()=>R(r),[r]);return i.default.createElement("div",{className:u["formula-bar-wrapper"],"data-testid":"formula-bar"},i.default.createElement(D,{controller:e,displayName:s,defineName:t.defineName}),i.default.createElement("div",{className:u["formula-bar-editor-wrapper"]},l!==0&&i.default.createElement(_,{initValue:t.value,controller:e,style:K(t,l,r),testId:"formula-editor",isMergeCell:r.isMergeCell,className:l===1?u["edit-cell"]:""}),i.default.createElement("div",{className:C(u["formula-bar-value"],{[u.show]:l!==2,[u.wrap]:r.isMergeCell&&t.displayValue.includes(b)}),style:p,onClick:c,"data-testid":"formula-editor-trigger"},t.displayValue)))});V.displayName="FormulaBarContainer";var xe=V;export{V as FormulaBarContainer,xe as default};
//# sourceMappingURL=FormulaBar-SODRWETN.js.map
