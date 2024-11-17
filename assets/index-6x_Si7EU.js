import{r,M as R,T as U,i as K,L as I,j as h,c as k,F as V,a as T,p as X,D as P,b as z,S as G,d as H}from"./index-C8wO7Npz.js";import{c as E,E as p,s as L}from"./style-BzKcKm9k.js";import{d as M,s as b,a as A}from"./shortcut-BELoZDUZ.js";const W="_wrap_1flh9_49",q="_show_1flh9_53",d={"formula-bar-wrapper":"_formula-bar-wrapper_1flh9_1","defined-name":"_defined-name_1flh9_11","defined-name-editor":"_defined-name-editor_1flh9_16","formula-bar-editor-wrapper":"_formula-bar-editor-wrapper_1flh9_28","formula-bar-value":"_formula-bar-value_1flh9_38",wrap:W,show:q,"formula-editor":"_formula-editor_1flh9_58","edit-cell":"_edit-cell_1flh9_73"};function D(e,t=!0){const a={};return e!=null&&e.isItalic&&(a.fontStyle="italic"),e!=null&&e.isBold&&(a.fontWeight="bold"),e!=null&&e.fontFamily&&(a.fontFamily=e==null?void 0:e.fontFamily),e!=null&&e.fontSize&&!t&&(a.fontSize=e==null?void 0:e.fontSize),e!=null&&e.fillColor&&!t&&(a.backgroundColor=e.fillColor),e!=null&&e.fontColor&&!t&&(a.color=e==null?void 0:e.fontColor),e!=null&&e.underline&&(e!=null&&e.isStrike)?a.textDecorationLine="underline line-through":e!=null&&e.underline?a.textDecorationLine="underline":e!=null&&e.isStrike&&(a.textDecorationLine="line-through"),a}function J(e,t,a){if(t===p.NONE)return;const o=t===p.EDIT_FORMULA_BAR,i=D(a,o);return o?i:{...i,top:e.top,left:e.left,width:e.width,height:e.height}}const v=1;function N(e){return Math.max(Math.min(U,e),v)}const F=r.memo(({initValue:e,style:t,testId:a,isMergeCell:o,controller:i,className:u})=>{const g=r.useRef(null),[S,_]=r.useState(v);r.useEffect(()=>{var s;if(o){const n=e.split(R).length;_(N(n))}else{const n=Math.ceil((((s=g.current)==null?void 0:s.scrollHeight)||20)/20);_(N(n))}},[o,e]);const C=r.useCallback(s=>{if(s.stopPropagation(),s.key==="Enter"||s.key==="Tab"){let n=s.currentTarget.value;const{range:l,isMerged:m}=i.getActiveRange(),c=i.getCell(l);typeof(c==null?void 0:c.value)=="string"&&K(m,c==null?void 0:c.value)&&(n=n.replaceAll(I,R)),i.batchUpdate(()=>(i.setCellValue(n,l),s.key==="Enter"?i.setNextActiveCell("down"):i.setNextActiveCell("right"),!0)),E.setState({editorStatus:p.NONE}),s.currentTarget.value="",s.currentTarget.blur()}else{const n=Math.ceil(s.currentTarget.scrollHeight/20);_(N(n))}},[]);return h.jsx("textarea",{spellCheck:!0,autoFocus:!0,ref:g,style:t,maxLength:T*100,"data-testid":a,"data-role":V,onKeyDown:C,className:k(d["formula-editor"],u),defaultValue:e,rows:S})});F.displayName="MultipleLineEditor";const O=r.memo(({controller:e,displayName:t,defineName:a})=>{const o=r.useRef(null),[i,u]=r.useState(t),g=r.useSyncExternalStore(M.subscribe,M.getSnapshot),S=r.useMemo(()=>g.map(n=>({disabled:!1,value:n,label:n})),[g]);r.useEffect(()=>{u(t)},[t]);const _=r.useCallback(n=>{var l;if(n.stopPropagation(),n.key==="Enter"){const m=n.currentTarget.value.trim().toLowerCase();if((l=o.current)==null||l.blur(),!m){u(t);return}const c=e.checkDefineName(m);if(c){u(t),b(e,c);return}const f=X(m,j=>{const w=e.getSheetList().find(B=>B.name===j);return(w==null?void 0:w.sheetId)||""}),x=e.getSheetInfo((f==null?void 0:f.sheetId)||e.getCurrentSheetId());if(f&&f.col<x.colCount&&f.row<x.rowCount){f.sheetId=f.sheetId||e.getCurrentSheetId(),u(t),b(e,f);return}P.test(m)&&m.length<=z?e.setDefineName(e.getActiveRange().range,m):u(t)}},[t]),C=r.useCallback(n=>{u(n.target.value)},[]),s=r.useCallback(n=>{const l=e.checkDefineName(n);l&&b(e,l)},[]);return h.jsx(G,{testId:"formula-bar-name",value:a,data:S,onChange:s,className:d["defined-name"],children:h.jsx("input",{value:i,ref:o,spellCheck:!0,type:"text",onChange:C,className:d["defined-name-editor"],onKeyDown:_,maxLength:T*8,"data-testid":"formula-bar-name-input"})})});O.displayName="DefineName";const Q=r.memo(({controller:e})=>{const t=r.useSyncExternalStore(A.subscribe,A.getSnapshot),a=r.useSyncExternalStore(L.subscribe,L.getSnapshot),{editorStatus:o}=r.useSyncExternalStore(E.subscribe,E.getSnapshot),i=r.useMemo(()=>t.defineName||H({row:t.row,col:t.col,rowCount:1,colCount:1,sheetId:""}),[t.defineName,t.col,t.row]),u=r.useCallback(()=>{E.setState({editorStatus:p.EDIT_FORMULA_BAR})},[]),g=r.useMemo(()=>D(a),[a]);return h.jsxs("div",{className:d["formula-bar-wrapper"],"data-testid":"formula-bar",children:[h.jsx(O,{controller:e,displayName:i,defineName:t.defineName}),h.jsxs("div",{className:d["formula-bar-editor-wrapper"],children:[o!==p.NONE&&h.jsx(F,{initValue:t.value,controller:e,style:J(t,o,a),testId:"formula-editor",isMergeCell:a.isMergeCell,className:o===p.EDIT_CELL?d["edit-cell"]:""}),h.jsx("div",{className:k(d["formula-bar-value"],{[d.show]:o!==p.EDIT_FORMULA_BAR,[d.wrap]:a.isMergeCell&&t.displayValue.includes(I)}),style:g,onClick:u,"data-testid":"formula-editor-trigger",children:t.displayValue})]})]})});Q.displayName="FormulaBarContainer";export{Q as FormulaBarContainer,Q as default};
//# sourceMappingURL=index-6x_Si7EU.js.map
