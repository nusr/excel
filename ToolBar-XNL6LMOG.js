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
import{c as J,d as N,h as K}from"./chunk-BKOMAG5H.js";import{a as $,c as a,d as ae,e as se,f as C,i as U,k as Q,m as h,n as de,o as ce,q as P}from"./chunk-2WXICHEX.js";import{$ as oe,A as te,Da as n,Ea as ne,U as j,bb as le,cb as ie,hb as x,ma as q,na as V,ya as X,za as re}from"./chunk-3OL4F4KC.js";import{c as Y}from"./chunk-AI5EXC2Q.js";var e=Y($());var s={"toolbar-wrapper":"e","merge-cell":"qr",border:"Dr","merge-cell-button":"Er","number-format":"Gr","number-format-value":"Jr",fontFamily:"Kr",bold:"Nr",italic:"Or",strike:"Qr","wrap-text":"Tr","icon-center":"Vr"};var m=Y($());var Z=(0,m.memo)(({controller:t})=>{let c=(0,m.useRef)(null),o=(0,m.useCallback)(async A=>{let w=A.target.files?.[0];if(!w)return;let f=w.name,u=w.type.slice(6);f=f.slice(0,-(u.length+1));let g=await le(w,!0);if(c.current&&(c.current.value="",c.current.blur()),!g)return;let p=await ie(g),I=t.getActiveRange().range;await t.addDrawing({width:p.width,height:p.height,originHeight:p.height,originWidth:p.width,title:f,type:"floating-picture",uuid:j(),imageSrc:g,sheetId:I.sheetId,fromRow:I.row,fromCol:I.col,marginX:0,marginY:0})},[]);return m.default.createElement(a,{testId:"toolbar-floating-picture",title:"Floating Picture"},m.default.createElement("input",{type:"file",hidden:!0,onChange:o,accept:"image/*",ref:c,id:"upload_float_image","data-testid":"toolbar-floating-picture-input"}),m.default.createElement("label",{htmlFor:"upload_float_image"},n("floating-picture")))});Z.displayName="InsertFloatingPicture";var R=(0,m.memo)(({controller:t})=>{let c=(0,m.useCallback)(async()=>{let o=t.getActiveRange().range;await t.addDrawing({width:400,height:300,originHeight:300,originWidth:400,title:n("chart-title"),type:"chart",uuid:j(),sheetId:o.sheetId,fromRow:o.row,fromCol:o.col,chartRange:o,chartType:"line",marginX:0,marginY:0})},[]);return m.default.createElement(a,{testId:"toolbar-chart",onClick:c,title:"Chart"},n("chart"))});R.displayName="InsertChart";var i=Y($());var z={container:"i",trigger:"Wr",main:"Xr",menu:"k",portal:"_r"};var ee=(0,i.memo)(({controller:t})=>{let[c,o]=(0,i.useState)(""),[A,w]=(0,i.useState)("thin"),[f,u]=(0,i.useState)("all-borders"),g=(0,i.useRef)({color:c,borderType:A,type:f}),p=()=>({color:g.current.color,type:g.current.borderType}),I=()=>{u("all-borders");let r=p();t.updateCellStyle({borderLeft:r,borderRight:r,borderTop:r,borderBottom:r},t.getActiveRange().range)},G=r=>{g.current.color=r,o(r),I()},W=r=>{g.current.borderType=r,w(r),I()},_=()=>{u("no-border"),t.updateCellStyle({borderLeft:void 0,borderRight:void 0,borderTop:void 0,borderBottom:void 0},t.getActiveRange().range)},F=()=>{u("bottom-border");let r=t.getActiveRange().range,v=p(),{row:S,col:B,colCount:T,rowCount:k}=r;t.updateCellStyle({borderBottom:v},{row:S+k-1,rowCount:1,colCount:T,col:q(r)?0:B,sheetId:""})},L=()=>{u("top-border");let r=t.getActiveRange().range,v=p(),{row:S,col:B,colCount:T}=r,k={row:S,rowCount:1,colCount:T,col:q(r)?0:B,sheetId:""};t.updateCellStyle({borderTop:v},k)},M=()=>{u("left-border");let r=t.getActiveRange().range,v=p(),{row:S,col:B,rowCount:T}=r;t.updateCellStyle({borderLeft:v},{row:V(r)?0:S,rowCount:T,colCount:1,col:B,sheetId:""})},E=()=>{u("right-border");let r=t.getActiveRange().range,v=p(),{row:S,col:B,rowCount:T,colCount:k}=r;t.updateCellStyle({borderRight:v},{row:V(r)?0:S,rowCount:T,colCount:1,col:B+k-1,sheetId:""})},O=()=>{L(),E(),F(),M(),u("outside-borders")},D=()=>{let r=g.current.borderType;g.current.borderType="medium",O(),g.current.borderType=r,u("thick-box-border")},H=()=>{({"all-borders":I,"no-border":_,"bottom-border":F,"top-border":L,"left-border":M,"right-border":E,"thick-box-border":D,"outside-borders":O})[f]()};return i.default.createElement("div",{className:z.container},i.default.createElement(a,{onClick:H,type:"plain",className:z.main,testId:"toolbar-border-shortcut",title:n(f)},n(f)),i.default.createElement(ce,{className:z.menu,label:i.default.createElement(C,{name:"down"}),isPlain:!0,testId:"toolbar-border",position:"bottom",size:"small",portalClassName:z.portal},i.default.createElement(h,{onClick:_,testId:"toolbar-no-border"},n("no-border")),i.default.createElement(h,{onClick:I,testId:"toolbar-all-borders"},n("all-borders")),i.default.createElement(h,{onClick:O,testId:"toolbar-outside-borders"},n("outside-borders")),i.default.createElement(h,{onClick:D,testId:"toolbar-thick-box-border"},n("thick-box-border")),i.default.createElement(h,{onClick:F,testId:"toolbar-bottom-border"},n("bottom-border")),i.default.createElement(h,{onClick:L,testId:"toolbar-top-border"},n("top-border")),i.default.createElement(h,{onClick:M,testId:"toolbar-left-border"},n("left-border")),i.default.createElement(h,{onClick:E,testId:"toolbar-right-border"},n("right-border")),i.default.createElement(h,null,i.default.createElement(P,{color:c,onChange:G,position:"right",testId:"toolbar-border-color"},i.default.createElement("span",{style:{color:c}},n("line-color")," >"))),i.default.createElement(de,{label:`${n("line-style")} >`,testId:"toolbar-border-style"},Object.keys(te).map(r=>i.default.createElement(h,{key:r,onClick:()=>W(r),testId:`toolbar-border-style-${r}`,active:A===r},r)))))});ee.displayName="BorderToolBar";var Se=[{value:0,label:n("none"),disabled:!1},{value:1,label:n("single-underline"),disabled:!1},{value:2,label:n("double-underline"),disabled:!1}],Be=[{value:0,label:n("merge-and-center"),disabled:!1},{value:1,label:n("merge-cells"),disabled:!1},{value:2,label:n("merge-content"),disabled:!1}],ge=(0,e.memo)(({controller:t})=>{let c=(0,e.useSyncExternalStore)(J.subscribe,J.getSnapshot),o=(0,e.useSyncExternalStore)(K.subscribe,K.getSnapshot),A=(0,e.useSyncExternalStore)(N.subscribe,N.getSnapshot),w=(0,e.useMemo)(()=>({color:o.fillColor}),[o.fillColor]),f=(0,e.useMemo)(()=>({color:o.fontColor}),[o.fontColor]),[u,g]=(0,e.useMemo)(()=>{let l=x[0];if(o.numberFormat){let b=x.find(d=>d.value===o.numberFormat);b?l=b:l=x[x.length-1]}return[l.label,String(l.value)]},[o.numberFormat]),p=(0,e.useCallback)(l=>({fontFamily:String(l)}),[]),I=(0,e.useCallback)(l=>{String(l)===X&&typeof window.queryLocalFonts=="function"?window.queryLocalFonts().then(b=>{let d=b.map(y=>y.fullName);d=Array.from(new Set(d)).filter(y=>ne(y)),d.sort((y,Ie)=>y.localeCompare(Ie));let fe=d.map(y=>({label:y,value:y,disabled:!1}));d.length>0?(N.setState(fe),localStorage.setItem(re,JSON.stringify(d))):N.setState(N.getSnapshot().filter(y=>y.value!==X))}):t.updateCellStyle({fontFamily:String(l)},t.getActiveRange().range)},[]),G=(0,e.useCallback)(()=>{t.undo()},[]),W=(0,e.useCallback)(()=>{t.redo()},[]),_=(0,e.useCallback)(()=>{t.copy()},[]),F=(0,e.useCallback)(()=>{t.cut()},[]),L=(0,e.useCallback)(()=>{t.paste()},[]),M=(0,e.useCallback)(l=>{t.updateCellStyle({fontSize:Number(l)},t.getActiveRange().range)},[]),E=(0,e.useCallback)(()=>{t.updateCellStyle({isBold:!o.isBold},t.getActiveRange().range)},[o.isBold]),O=(0,e.useCallback)(()=>{t.updateCellStyle({isItalic:!o.isItalic},t.getActiveRange().range)},[o.isItalic]),D=(0,e.useCallback)(()=>{t.updateCellStyle({isStrike:!o.isStrike},t.getActiveRange().range)},[o.isStrike]),H=(0,e.useCallback)(l=>{let b=Number(l),d=0;b===1?d=1:b===2&&(d=2),t.updateCellStyle({underline:d},t.getActiveRange().range)},[]),r=(0,e.useCallback)(l=>{t.updateCellStyle({fillColor:l},t.getActiveRange().range)},[]),v=(0,e.useCallback)(l=>{t.updateCellStyle({fontColor:l},t.getActiveRange().range)},[]),S=(0,e.useCallback)(()=>{t.updateCellStyle({isWrapText:!o.isWrapText},t.getActiveRange().range)},[o.isWrapText]),B=(0,e.useCallback)(()=>{let{range:l,isMerged:b}=t.getActiveRange();b?t.deleteMergeCell(l):t.addMergeCell(l)},[]),T=(0,e.useCallback)(l=>{if(!l)return;let{range:b,isMerged:d}=t.getActiveRange();d?t.deleteMergeCell(b):t.addMergeCell(b,Number(l))},[]),k=(0,e.useCallback)(l=>{l&&t.updateCellStyle({numberFormat:l},t.getActiveRange().range)},[]),me=(0,e.useCallback)(()=>{t.updateCellStyle({horizontalAlign:0},t.getActiveRange().range)},[]),ue=(0,e.useCallback)(()=>{t.updateCellStyle({horizontalAlign:1},t.getActiveRange().range)},[]),pe=(0,e.useCallback)(()=>{t.updateCellStyle({horizontalAlign:2},t.getActiveRange().range)},[]),be=(0,e.useCallback)(()=>{t.updateCellStyle({verticalAlign:0},t.getActiveRange().range)},[]),Ce=(0,e.useCallback)(()=>{t.updateCellStyle({verticalAlign:1},t.getActiveRange().range)},[]),he=(0,e.useCallback)(()=>{t.updateCellStyle({verticalAlign:2},t.getActiveRange().range)},[]);return e.default.createElement("div",{className:s["toolbar-wrapper"],"data-testid":"toolbar"},e.default.createElement(a,{disabled:!c.canUndo,onClick:G,testId:"toolbar-undo",title:"Undo",className:s["icon-center"]},e.default.createElement(C,{name:"undo"})),e.default.createElement(a,{disabled:!c.canRedo,onClick:W,testId:"toolbar-redo",title:"Redo",className:s["icon-center"]},e.default.createElement(C,{name:"redo"})),e.default.createElement(a,{onClick:_,testId:"toolbar-copy",title:"Copy"},n("copy")),e.default.createElement(a,{onClick:F,testId:"toolbar-cut",title:"Cut"},n("cut")),e.default.createElement(a,{onClick:L,testId:"toolbar-paste",title:"Paste"},n("paste")),e.default.createElement(U,{data:A,value:o.fontFamily,getItemStyle:p,onChange:I,testId:"toolbar-font-family",className:s.fontFamily}),e.default.createElement(U,{data:oe,value:o.fontSize,onChange:M,testId:"toolbar-font-size"}),e.default.createElement(a,{active:o.isBold,onClick:E,testId:"toolbar-bold",title:"Bold"},e.default.createElement("span",{className:s.bold},"B")),e.default.createElement(a,{active:o.isItalic,onClick:O,testId:"toolbar-italic",title:"Italic"},e.default.createElement("span",{className:s.italic},"I")),e.default.createElement(a,{active:o.isStrike,onClick:D,testId:"toolbar-strike",title:"Strike"},e.default.createElement("span",{className:s.strike},"A")),e.default.createElement(U,{data:Se,value:o.underline,title:"Underline",onChange:H,testId:"toolbar-underline"}),e.default.createElement(ee,{controller:t}),e.default.createElement(P,{key:"fill-color",color:o.fillColor,onChange:r,testId:"toolbar-fill-color"},e.default.createElement(a,{style:w,testId:"toolbar-fill-color",className:s["icon-center"],title:"Fill Color"},e.default.createElement(se,null))),e.default.createElement(P,{key:"font-color",color:o.fontColor,onChange:v,testId:"toolbar-font-color"},e.default.createElement(a,{style:f,testId:"toolbar-font-color",className:s["icon-center"],title:"Font Color"},e.default.createElement(C,{name:"fontColor"}))),e.default.createElement(a,{active:o.verticalAlign===0,onClick:be,testId:"toolbar-vertical-top",className:s["icon-center"],title:"Top Align"},e.default.createElement(C,{name:"verticalTop"})),e.default.createElement(a,{active:o.verticalAlign===1,onClick:Ce,testId:"toolbar-vertical-middle",className:s["icon-center"],title:"Middle Align"},e.default.createElement(C,{name:"verticalMiddle"})),e.default.createElement(a,{active:o.verticalAlign===2,onClick:he,testId:"toolbar-vertical-bottom",className:s["icon-center"],title:"Bottom Align"},e.default.createElement(C,{name:"verticalBottom"})),e.default.createElement(a,{active:o.horizontalAlign===0,onClick:me,testId:"toolbar-horizontal-left",className:s["icon-center"],title:"Align Text Left"},e.default.createElement(C,{name:"horizontalLeft"})),e.default.createElement(a,{active:o.horizontalAlign===1,onClick:ue,testId:"toolbar-horizontal-center",className:s["icon-center"],title:"Align Text Center"},e.default.createElement(C,{name:"horizontalCenter"})),e.default.createElement(a,{active:o.horizontalAlign===2,onClick:pe,testId:"toolbar-horizontal-right",className:s["icon-center"],title:"Align Text Right"},e.default.createElement(C,{name:"horizontalRight"})),e.default.createElement(a,{active:o.isWrapText,onClick:S,testId:"toolbar-wrap-text",className:s["wrap-text"],title:"Wrap Text"},n("wrap-text")),e.default.createElement(Q,{data:Be,value:o.mergeType,onChange:T,className:s["merge-cell"],testId:"toolbar-merge-cell-select"},e.default.createElement(a,{active:o.isMergeCell,onClick:B,testId:"toolbar-merge-cell",className:s["merge-cell-button"],type:"plain",title:"Merge And Center"},n("merge-and-center"))),e.default.createElement(Q,{data:x,value:g,onChange:k,className:s["number-format"],testId:"toolbar-number-format"},e.default.createElement("div",{className:s["number-format-value"],"data-testid":"toolbar-number-format-value"},u)),e.default.createElement(Z,{controller:t}),e.default.createElement(R,{controller:t}),e.default.createElement(ae,null))});ge.displayName="ToolbarContainer";var Ke=ge;export{ge as ToolbarContainer,Ke as default};
//# sourceMappingURL=ToolBar-XNL6LMOG.js.map
