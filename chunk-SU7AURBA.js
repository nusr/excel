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
import{c as b}from"./chunk-ISI7BCZL.js";import{c as F,d as P}from"./chunk-PRJU7QU5.js";import{A as B,o as x,r as W,u as C,v,w as E}from"./chunk-5LS7JK2T.js";import{F as N,I as D,U,V as m,X as O,ca as H,i as T,j as K,r as M,va as V,x as z,xa as _}from"./chunk-5HPRGV2K.js";var q=200;function j(e){e.batchUpdate(()=>(p(e),e.setNextActiveCell("right"),R(e),!0))}function $(e){e.batchUpdate(()=>(p(e),e.setNextActiveCell("down"),R(e),!0))}function G(e,t,i){let r=e.getScroll(),{row:s,col:a}=r;if(r.top!==i){s=0;let n=i;for(;n>0;){let l=e.getRowHeight(s).len;if(l>n)break;n-=l,s++}}if(r.left!==t){a=0;let n=t;for(;n>0;){let l=e.getColWidth(a).len;if(l>n)break;n-=l,a++}}return{row:s,col:a}}function Q(e){let t=`div[data-testid="${M}${e}"]`,i=document.querySelector(t);i&&typeof i.scrollIntoView=="function"&&i.scrollIntoView()}function Z(e,t){e.batchUpdate(()=>{let i=t.sheetId||e.getCurrentSheetId();i!==e.getCurrentSheetId()&&e.setCurrentSheetId(i);let r=e.getSheetInfo(i);if(!r||t.row<0||t.col<0||t.row>=r.rowCount||t.col>=r.colCount)return!0;let s=e.getScroll(i),a=e.computeCellPosition({row:s.row,col:s.col,colCount:1,rowCount:1,sheetId:i}),n=C.get(),l=E.get(),{top:o,left:c}=e.computeCellPosition(t),u=a.top,d=a.left,g=a.top+n.height-l.height,S=a.left+n.width-l.width;if(o>=u&&o<g&&c>=d&&c<=S)return e.setActiveRange(t),!0;let f=e.computeCellPosition(e.getActiveRange().range);return y(e,c-f.left,o-f.top),e.setActiveRange(t),!0})}function A(e,t){let i=parseInt(V.scrollBarContent,10),r=C.get(),s=v.get(),a=s.height-r.height+q,n=s.width-r.width+q,l=r.height-i,o=r.width-i,c=Math.floor(t*l/a),u=Math.floor(e*o/n);return{maxHeight:a,maxWidth:n,maxScrollHeight:l,maxScrollWidth:o,scrollTop:c,scrollLeft:u}}function y(e,t,i){let r=e.getScroll(),{maxHeight:s,maxWidth:a,maxScrollHeight:n,maxScrollWidth:l}=A(r.left,r.top),o=r.top+Math.ceil(i);o<0?o=0:o>s&&(o=s);let c=r.left+Math.ceil(t);c<0?c=0:c>a&&(c=a);let{row:u,col:d}=G(e,c,o),g=Math.floor(o*n/s),S=Math.floor(c*l/a),f={row:u,col:d,top:o,left:c,scrollTop:g,scrollLeft:S};e.setScroll(f)}function R(e){let t=e.getActiveRange().range,i={row:t.row,col:t.col,colCount:1,rowCount:1,sheetId:""},r=e.computeCellPosition(i),s=e.getCellSize(i),a=C.get(),n=e.getScroll(),l=e.getSheetInfo(e.getCurrentSheetId()),o=E.get(),c=5,{maxHeight:u,maxWidth:d,maxScrollHeight:g,maxScrollWidth:S}=A(n.left,n.top);if(r.left+s.width+c>a.width&&n.col<=l.colCount-2){let f=n.left+e.getColWidth(n.col).len,w=Math.floor(f*S/d);e.setScroll({...n,col:n.col+1,left:f,scrollLeft:w})}if(r.left-o.width<a.left+c&&n.col>=1){let f=n.left-e.getColWidth(n.col).len,w=Math.floor(f*S/d);e.setScroll({...n,col:n.col-1,left:f,scrollLeft:w})}if(r.top+s.height+c>a.height&&n.row<=l.rowCount-2){let f=n.top+e.getRowHeight(n.row).len,w=Math.floor(f*g/u);e.setScroll({...n,row:n.row+1,top:f,scrollTop:w})}if(r.top-o.height<a.top+c&&n.row>=1){let f=n.top-e.getRowHeight(n.row).len,w=Math.floor(f*g/u);e.setScroll({...n,row:n.row-1,top:f,scrollTop:w})}}function h(){let e=document.activeElement;return!(!e||e.getAttribute("data-role")!==z)}function X(e){let t=document.activeElement,{range:i,isMerged:r}=e.getActiveRange(),s=e.getCell(i),a=t.value;typeof s?.value=="string"&&O(r,s?.value)&&(a=a.replaceAll(K,T)),e.setCellValue(a,i),t.value="",t.blur(),b.setState(n=>n.editorStatus===0?n:{editorStatus:0})}function p(e){h()&&X(e)}var J=[{key:"Enter",modifierKey:[],handler:$},{key:"Tab",modifierKey:[],handler:j},{key:"ArrowDown",modifierKey:[m()?"meta":"ctrl"],handler:e=>{h()||e.batchUpdate(()=>{p(e);let t=v.get();return y(e,0,t.height),!0})}},{key:"ArrowUp",modifierKey:[m()?"meta":"ctrl"],handler:e=>{h()||e.batchUpdate(()=>{p(e);let t=v.get();return y(e,0,-t.height),!0})}},{key:"ArrowRight",modifierKey:[m()?"meta":"ctrl"],handler:e=>{h()||e.batchUpdate(()=>{p(e);let t=v.get();return y(e,t.width,0),!0})}},{key:"ArrowLeft",modifierKey:[m()?"meta":"ctrl"],handler:e=>{h()||e.batchUpdate(()=>{p(e);let t=v.get();return y(e,-t.width,0),!0})}},{key:"ArrowDown",modifierKey:[],handler:e=>{h()||$(e)}},{key:"ArrowUp",modifierKey:[],handler:e=>{h()||e.batchUpdate(()=>(p(e),e.setNextActiveCell("up"),R(e),!0))}},{key:"ArrowRight",modifierKey:[],handler:e=>{h()||j(e)}},{key:"ArrowLeft",modifierKey:[],handler:e=>{h()||e.batchUpdate(()=>(p(e),e.setNextActiveCell("left"),R(e),!0))}},{key:"b",modifierKey:[m()?"meta":"ctrl"],handler:e=>{if(h())return;let t=e.getCell(e.getActiveRange().range);e.updateCellStyle({isBold:!t?.style?.isBold},e.getActiveRange().range)}},{key:"i",modifierKey:[m()?"meta":"ctrl"],handler:e=>{if(h())return;let t=e.getCell(e.getActiveRange().range);e.updateCellStyle({isItalic:!t?.style?.isItalic},e.getActiveRange().range)}},{key:"5",modifierKey:[m()?"meta":"ctrl"],handler:e=>{if(h())return;let t=e.getCell(e.getActiveRange().range);e.updateCellStyle({isStrike:!t?.style?.isStrike},e.getActiveRange().range)}},{key:"u",modifierKey:[m()?"meta":"ctrl"],handler:e=>{if(h())return;let i=e.getCell(e.getActiveRange().range)?.style?.underline,r=0;i===void 0||i===0?r=1:r=0,e.updateCellStyle({underline:r},e.getActiveRange().range)}},{key:"z",modifierKey:[m()?"meta":"ctrl"],handler:e=>{e.undo()}},{key:"y",modifierKey:[m()?"meta":"ctrl"],handler:e=>{e.redo()}}];var L=class{constructor(t,i){this.renderCallback=t=>{let{rowMap:i,colMap:r}=t,s=Object.keys(i);Object.keys(r).length===0&&s.length===0||this.controller.batchUpdate(()=>{for(let[n,l]of Object.entries(i)){let o=parseInt(n,10);l!==this.controller.getRowHeight(o).len&&this.controller.setRowHeight(o,l)}for(let[n,l]of Object.entries(r)){let o=parseInt(n,10);l!==this.controller.getColWidth(o).len&&this.controller.setColWidth(o,l)}return!0},!0)};this.controller=t,this.canvas=i;let r;i&&typeof i.transferControlToOffscreen=="function"&&(r=i.transferControlToOffscreen());let s=this.controller.getWorker();if(s&&r){let a={canvas:r,dpr:H()};s.init(F(a,[a.canvas]))}}async render(t){let{controller:i}=this,r=i.getCurrentSheetId(),s=i.getSheetInfo(r);if(!s)return;let a=i.getCopyRange(),n=i.toJSON(),l={changeSet:t.changeSet,theme:_(),canvasSize:C.get(),headerSize:E.get(),currentSheetInfo:s,scroll:i.getScroll(r),range:i.getActiveRange().range,copyRange:a,currentMergeCells:i.getMergeCellList(r),customHeight:n.customHeight,customWidth:n.customWidth,sheetData:n.worksheets[r]||{}};this.controller.getWorker().render(l,P(this.renderCallback))}resize(){let{canvas:t}=this,{width:i,height:r}=C.get();t.style.width=`${i}px`,t.style.height=`${r}px`;let s={width:i,height:r};this.controller.getWorker().resize(s)}};function I(e){let t=(e?.target?.tagName??"").toLowerCase();return t==="input"||t==="textarea"}function ee(e,t){function i(o){if(I(o))return;let c=J.filter(d=>d.key===o.key);c.sort((d,g)=>g.modifierKey.length-d.modifierKey.length);let u;for(let d of c)if(d.modifierKey.length>0){if(d.modifierKey.some(g=>o[`${g}Key`])){u=d;break}}else{u=d;break}if(u){o.preventDefault(),u.handler(e);return}o.metaKey||o.ctrlKey||b.setState(d=>d.editorStatus===1?d:{editorStatus:1})}let r=N(o=>{(o?.target?.tagName?.toLowerCase()==="canvas"||U())&&y(e,o.deltaX,o.deltaY)},1e3/60);function s(o){I(o)||(o.preventDefault(),e.paste(o))}function a(o){I(o)||(o.preventDefault(),e.copy(o))}function n(o){I(o)||(o.preventDefault(),e.cut(o))}function l(){I(event)||W().then(o=>{let c=e.getCopyRange(),u;if(o[x]){let d=o[x];u=!d.floatElementUuid&&d.range?d.range:void 0,e.setFloatElementUuid(d.floatElementUuid)}else e.setFloatElementUuid("");D(u,c)||(e.setCopyRange(u),B.emit("modelChange",{changeSet:new Set(["cellStyle"])}))})}return window.addEventListener("resize",t),document.body.addEventListener("keydown",i),document.body.addEventListener("wheel",r),document.body.addEventListener("paste",s),document.body.addEventListener("copy",a),document.body.addEventListener("cut",n),window.addEventListener("focus",l),()=>{window.removeEventListener("resize",t),document.body.removeEventListener("keydown",i),document.body.removeEventListener("wheel",r),document.body.removeEventListener("paste",s),document.body.removeEventListener("copy",a),document.body.removeEventListener("cut",n),window.removeEventListener("focus",l)}}var k;function Ee(e,t){return k||(k=new L(e,t),k)}export{G as a,Q as b,Z as c,A as d,y as e,h as f,X as g,ee as h,Ee as i};
//# sourceMappingURL=chunk-SU7AURBA.js.map
