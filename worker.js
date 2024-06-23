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
import{A as m,B as k,F as nt,L as A,M as ot,N as j,V as rt,Y as L,a as W,ba as P,c as G,ca as u,d as U,da as st,ea as ht,fa as H,g as q,ga as O,ha as F,i as K,ja as lt,qa as _,ta as v,ua as V,va as at,wa as ct,x as Y,xa as dt,ya as ft,z as it}from"./chunk-YBCQVLAL.js";import"./chunk-AI5EXC2Q.js";function X(n){return n?typeof Intl>"u"||typeof Intl.Segmenter!="function"?[...n]:[...new Intl.Segmenter([],{granularity:"word"}).segment(n)].map(i=>i.segment):[]}var Z=new Map;function wt(n,t){let e=`${t}__${n.font}`;if(Z.has(e))return Z.get(e);let i=n.measureText(t),{actualBoundingBoxAscent:r,actualBoundingBoxDescent:h}=i,o=r+h,l=i.width,a=Math.ceil(l/P()),s=Math.ceil(o/P()),c={width:a,height:s};return Z.set(e,c),c}function R(n,t,e,i,r){n.fillRect(u(t),u(e),u(i),u(r))}function $(n,t,e,i,r){n.strokeRect(u(t),u(e),u(i),u(r))}function J(n,t,e,i,r){n.clearRect(u(t),u(e),u(i),u(r))}function B(n,t,e,i){n.fillText(t,u(e),u(i))}function b(n,t){if(t.length!==0){n.beginPath();for(let e=0;e<t.length;e+=2){let i=t[e],r=t[e+1];n.moveTo(u(i[0]),u(i[1])),n.lineTo(u(r[0]),u(r[1]))}n.stroke()}}function ut(n,t,e,i){n.beginPath(),n.moveTo(u(t[0]),u(t[1])),n.lineTo(u(e[0]),u(e[1])),n.lineTo(u(i[0]),u(i[1])),n.fill()}function gt(n,t,e){let i=n.slice(),[r,h]=n,o=m*2,l=e?o:0;return t==="bottom"?i.push([r[0]+l,r[1]-o],[h[0]-l,h[1]-o]):t==="top"?i.push([r[0]+l,r[1]+o],[h[0]-l,h[1]+o]):t==="left"?i.push([r[0]+o,r[1]+l],[h[0]+o,h[1]-l]):t==="right"&&i.push([r[0]-o,r[1]+l],[h[0]-o,h[1]-l]),i}function vt(n,t,e){return e?t?n.split(K):X(n.replaceAll(K,"")):X(n)}function mt(n,t,e,i,r){n.setLineDash([u(8),u(6)]);let h=m;$(n,t+h,e+h,i-h*2,r-h*2),n.setLineDash([])}function xt(n){let t=[];return n==="hair"?t=[m,m]:n==="dotted"||n==="mediumDashed"?t=[m*2,m*2]:n==="dashed"?t=[m*4,m*4]:n==="dashDot"||n==="mediumDashDot"?t=[m*4,m*4,m*8,m*4]:(n==="dashDotDot"||n==="mediumDashDotDot")&&(t=[m*4,m*4,m*8,m*4,m*4,m*4]),t}function E(n,t,e,i,r){if(!e)return;let{top:h,left:o,width:l,height:a}=t,s=[];i==="top"?s=[[o,h],[o+l,h]]:i==="bottom"?s=[[o,h+a],[o+l,h+a]]:i==="left"?s=[[o,h],[o,h+a]]:i==="right"&&(s=[[o+l,h],[o+l,h+a]]);let{type:c,color:d}=e;n.lineWidth=k[c],n.strokeStyle=d||v("black",r);let f=xt(c);c==="double"&&(s=gt(s,i,!0)),f.length>0&&n.setLineDash(f.map(g=>u(g))),b(n,s),f.length>0&&n.setLineDash([])}function pt(n,t,e,i,r,h){let o={height:0,width:0};if(e===""&&nt(i))return o;let l=i?.numberFormat||Y,a=l===Y&&typeof e=="number",s=dt(e,l),c=i?.fontSize?i.fontSize:W,d=L(i?.isItalic?"italic":"normal",i?.isBold?"bold":"500",u(c),i?.fontFamily);i?.fillColor&&(n.fillStyle=i?.fillColor,R(n,t.left,t.top,t.width,t.height));let f=i?.fontColor||v("contentColor",h);it.has(s)&&(f=v("errorFormulaColor",h)),n.font=d,n.fillStyle=f;let g=i?{...i}:{},p=g?.horizontalAlign;g?.horizontalAlign===void 0&&a&&(p=2),g.horizontalAlign=p;let x=(!g?.isWrapText&&ft(l)?[s]:vt(s,i?.isWrapText,r)).map(y=>{let S=wt(n,y);return{str:y,width:S.width,height:S.height===0?c:S.height}}),{width:M,height:T,resultList:I}=Dt(x,t,g,rt(!!r,s));if(M>0&&T>0){let y=Math.ceil(c*(_.lineHeight-1)/2),S=[];for(let D of I){if(B(n,D.text,D.x,D.y),g?.underline){n.strokeStyle=f;let z=D.y+D.height+y/2,et=[[D.x,z],[D.x+D.width,z]];g?.underline===2?S=S.concat(gt(et,"bottom",!1)):S=S.concat(et)}if(g?.isStrike){n.strokeStyle=f;let z=D.y+D.height/2+y/2;S=S.concat([[D.x,z],[D.x+D.width,z]])}}b(n,S)}return o.height=Math.ceil(T),o.width=Math.ceil(M),o}function Dt(n,t,e,i){let r=e?.fontSize?e.fontSize:W,h=Math.ceil(r*(_.lineHeight-1)/2),o=e?.verticalAlign??1,{left:l,top:a,height:s}=t,c=Math.max(t.width,...n.map(p=>p.width)),d=[],f=0,g=0;if(e?.isWrapText&&i){let p=0;for(let w=0;w<n.length;w++){let C=n[w];f=Math.max(f,C.width);let x=C.height+h*2;g+=x,d.push({text:C.str,x:0,y:p,width:C.width,height:C.height}),p+=x}}else if(e?.isWrapText){let p=0;for(let w=0;w<n.length;){let C=c,x="",M=0,T=0;for(;w<n.length;){let I=n[w];if(C>=I.width)M+=I.width,T=Math.max(T,I.height),C-=I.width,x+=I.str,w++;else break}if(x){f=Math.max(f,M);let I=T+h*2;g+=I,d.push({text:x,x:0,y:p,width:M,height:T}),p+=I}}}else{let p="",w=c;for(let C=0;C<n.length;C++){let x=n[C];if(w>=x.width)f+=x.width,g=Math.max(g,x.height),p+=x.str,w-=x.width;else break}d.push({text:p,x:0,y:0,width:f,height:g})}if(g=Math.max(g,r*_.lineHeight),f+=h,g+=h,f<=c&&g<=s){let p=l+h,w=a+(s-g)/2+h;o===0?w=a+h:o===2&&(w=a+(s-g)+h),e?.horizontalAlign===1?p=l+(c-f)/2:e?.horizontalAlign===2&&(p=l+(c-f)-h);for(let C of d)C.x=C.x+p,C.y=C.y+w}return{width:f,height:g,resultList:d}}function Q(n){return{textAlign:"center",textBaseline:"middle",font:L(void 0,"500",u(W)),fillStyle:v("black",n),lineWidth:m,strokeStyle:v("borderColor",n)}}var Ct=Math.max(...Object.values(k)),N=class{constructor(t){this.width=0;this.height=0;this.isRendering=!1;this.rowMap={};this.colMap={};this.eventData={theme:"light",sheetData:{},canvasSize:{top:0,left:0,width:0,height:0},headerSize:{width:0,height:0},currentSheetInfo:{isHide:!1,rowCount:0,colCount:0,name:"",sheetId:"",tabColor:"",sort:1},scroll:{left:0,top:0,row:0,col:0,scrollLeft:0,scrollTop:0},range:{row:0,col:0,rowCount:1,colCount:1,sheetId:""},copyRange:void 0,customHeight:{},customWidth:{},currentMergeCells:[]};this.canvas=t,this.ctx=t.getContext("2d");let e=P();this.ctx.scale(e,e)}render(t){if(t.changeSet.size===0||this.isRendering)return;this.isRendering=!0,this.eventData=t,this.clear();let{ctx:e}=this;e.strokeStyle=v("primaryColor",t.theme),e.fillStyle=v("white",t.theme),e.lineWidth=m*2;let{width:i,height:r}=this.eventData.canvasSize,h=this.eventData.headerSize,{endRow:o,contentHeight:l}=this.renderRowsHeader(r),{endCol:a,contentWidth:s}=this.renderColsHeader(i);this.renderGrid(i-h.width,r-h.height),this.renderTriangle(),this.renderMergeCell(),this.ctx.fillStyle=v("selectionColor",this.eventData.theme);let c=this.renderSelection({endRow:o,endCol:a,contentHeight:l,contentWidth:s});return this.renderAntLine(c),this.renderContent({endRow:o,endCol:a,contentHeight:l,contentWidth:s}),this.ctx.lineWidth=Ct,$(this.ctx,c.left,c.top,c.width,c.height),this.isRendering=!1,{rowMap:this.rowMap,colMap:this.colMap}}resize(t){this.width=t.width,this.height=t.height,this.canvas.width=u(t.width),this.canvas.height=u(t.height)}clear(){J(this.ctx,0,0,this.width,this.height)}renderRowsHeader(t){let{row:e}=this.eventData.scroll,i=this.eventData.headerSize,{rowCount:r}=this.eventData.currentSheetInfo;this.ctx.save();let h=this.eventData.range;R(this.ctx,0,i.height,i.width,t),Object.assign(this.ctx,Q(this.eventData.theme));let o=[],l=i.height,a=e;for(;a<r&&l<t;a++){let c=this.getRowHeight(a),d=l;if(a===e&&(d+=m/2),o.push([0,d],[i.width,d]),c>0){let f=this.isHighlightRow(h,a);this.ctx.fillStyle=f?v("primaryColor",this.eventData.theme):v("black",this.eventData.theme),B(this.ctx,String(a+1),i.width/2,d+c/2)}l+=c}o.push([0,l],[i.width,l]),o.push([0,0],[0,l]),b(this.ctx,o),this.ctx.restore();let s=a>=r?l:t;return{endRow:a,contentHeight:Math.floor(s)}}renderColsHeader(t){let{col:e}=this.eventData.scroll,i=this.eventData.headerSize,{colCount:r}=this.eventData.currentSheetInfo,h=this.eventData.range,o=[];this.ctx.save(),R(this.ctx,i.width,0,t,i.height),Object.assign(this.ctx,Q());let l=i.width,a=e;for(;a<r&&l<=t;a++){let c=this.getColWidth(a),d=l;if(a===e&&(d+=m/2),o.push([d,0],[d,i.height]),c>0){let f=this.isHighlightCol(h,a);this.ctx.fillStyle=f?v("primaryColor",this.eventData.theme):v("black",this.eventData.theme),B(this.ctx,ht(a),d+c/2,i.height/2)}l+=c}o.push([l,0],[l,i.height]),o.push([0,0],[l,0]),b(this.ctx,o),this.ctx.restore();let s=a>=r?l:t;return{endCol:a,contentWidth:Math.floor(s)}}renderGrid(t,e){let i=this.eventData.headerSize,{row:r,col:h}=this.eventData.scroll,{rowCount:o,colCount:l}=this.eventData.currentSheetInfo;this.ctx.save(),this.ctx.lineWidth=m,this.ctx.strokeStyle=v("borderColor",this.eventData.theme),this.ctx.translate(u(i.width),u(i.height));let a=[],s=0,c=0;for(let d=r;d<o&&s<=e;d++){for(;d<o&&this.getRowHeight(d)===0;)d++;a.push([0,s],[t,s]);let f=this.getRowHeight(d);s+=f}for(let d=h;d<l&&c<=t;d++){for(;d<l&&this.getColWidth(d)===0;)d++;a.push([c,0],[c,s]);let f=this.getColWidth(d);c+=f}a.push([0,s],[c,s]),a.push([c,0],[c,s]),b(this.ctx,a),this.ctx.restore()}renderTriangle(){let t=this.eventData.headerSize;this.ctx.save(),R(this.ctx,0,0,t.width,t.height),this.ctx.fillStyle=v("triangleFillColor",this.eventData.theme);let e=2,i=Math.floor(e),r=Math.floor(t.height-e),h=Math.floor(t.width*.4),o=Math.floor(t.width-e);ut(this.ctx,[o,i],[h,r],[o,r]),this.ctx.restore()}getRowHeight(t){let e=j(this.eventData.currentSheetInfo.sheetId,t),i=this.eventData.customHeight[e];return i?i.isHide?q:i.len:G}getColWidth(t){let e=j(this.eventData.currentSheetInfo.sheetId,t),i=this.eventData.customWidth[e];return i?i.isHide?q:i.len:U}isHighlightRow(t,e){return!!(H(t)||F(t)||e>=t.row&&e<t.row+t.rowCount)}isHighlightCol(t,e){return!!(H(t)||O(t)||e>=t.col&&e<t.col+t.colCount)}renderAntLine(t){let e=this.eventData.copyRange;!e||e.sheetId!==this.eventData.currentSheetInfo.sheetId||(this.ctx.lineWidth=Ct,this.ctx.strokeStyle=v("primaryColor",this.eventData.theme),mt(this.ctx,t.left,t.top,t.width,t.height))}renderMergeCell(){let t=this.eventData.currentMergeCells;if(t.length===0)return;let e=this.eventData.range;for(let i of t)e.row===i.row&&e.col===i.col||this.clearRect(i)}getCellSize(t){let{row:e,col:i,colCount:r,rowCount:h}=t,o=e,l=i,a=e+h,s=i+r,c=this.eventData.currentSheetInfo;H(t)?(l=0,s=c.colCount,o=0,a=c.rowCount):F(t)?(o=0,a=c.rowCount):O(t)&&(l=0,s=c.colCount);let d=0,f=0;for(;o<a;o++)f+=this.getRowHeight(o);for(;l<s;l++)d+=this.getColWidth(l);return{width:d,height:f}}computeCellPosition(t){let{row:e,col:i}=t,r=this.eventData.headerSize,h=this.eventData.scroll,o=r.width,l=r.height,a=h.row,s=h.col;if(i>=h.col)for(;s<i;)o+=this.getColWidth(s),s++;else for(o=-r.width;s>i;)o-=this.getColWidth(s),s--;if(e>=h.row)for(;a<e;)l+=this.getRowHeight(a),a++;else for(l=-r.height;a>e;)l-=this.getRowHeight(a),a--;return{top:l,left:o}}getActiveRange(t){let e=t||this.eventData.range,i=this.eventData.currentMergeCells;for(let r of i)if(lt(e,r))return{range:{...r,sheetId:r.sheetId},isMerged:!0};return{range:e,isMerged:!1}}clearRect(t){let e=this.getCellSize(t);if(e.width<=0||e.height<=0)return;let i=this.computeCellPosition(t),r=m;J(this.ctx,i.left+r,i.top+r,e.width-r*2,e.height-r*2)}renderContent(t){let{endCol:e,endRow:i,contentHeight:r,contentWidth:h}=t,{ctx:o}=this;o.textAlign="left",o.textBaseline="top",o.lineWidth=m*2;let l=this.eventData.headerSize,{row:a,col:s}=this.eventData.scroll,c=Math.floor(h-l.width),d=Math.floor(r-l.height);o.save(),this.rowMap={},this.colMap={};let f=this.eventData.currentMergeCells;for(let g=a;g<i;g++)for(let p=s;p<e;p++){let w=f.find(C=>C.row===g&&C.col===p);this.renderCell(g,p,w,c,d)}o.restore()}renderCell(t,e,i,r,h){let{ctx:o}=this,l={row:t,col:e,rowCount:1,colCount:1,sheetId:""},a=A(t,e),s=this.eventData.sheetData[a];if(!s)return;let c=this.getCellSize(i||l);if(c.width<=0||c.height<=0)return;let d=this.computeCellPosition(l);o.lineWidth=m*2;let f=this.eventData.theme,g=pt(o,{top:d.top,left:d.left,width:Math.min(c.width,r),height:Math.min(c.height,h)},s.value,s.style,!!i,f),p=Math.max(this.rowMap[t]??0,g.height),w=Math.max(this.colMap[e]??0,g.width);p>=G&&(this.rowMap[t]=p),w>=U&&(this.colMap[e]=w);let C={top:d.top,left:d.left,height:Math.max(p,c.height),width:Math.max(w,c.width)};E(o,C,s.style?.borderTop,"top",f),E(o,C,s.style?.borderBottom,"bottom",f),E(o,C,s.style?.borderLeft,"left",f),E(o,C,s.style?.borderRight,"right",f)}renderSelection(t){let e=this.eventData.range;return H(e)?this.renderSelectAll(t):F(e)?this.renderSelectCol(t):O(e)?this.renderSelectRow(t):this.renderSelectRange()}renderSelectRange(){let t=this.eventData.headerSize,e=this.eventData.range,i=this.computeCellPosition({row:e.row,col:e.col,rowCount:1,colCount:1,sheetId:""}),r=e.row+e.rowCount-1,h=e.col+e.colCount-1,o={row:r,col:h,rowCount:1,colCount:1,sheetId:""},l=this.computeCellPosition(o),a=this.getCellSize(o),s=l.left+a.width-i.left,c=l.top+a.height-i.top;R(this.ctx,i.left,0,s,t.height),R(this.ctx,0,i.top,t.width,c);let d=e.rowCount>1||e.colCount>1;d&&R(this.ctx,i.left,i.top,s,c);let f=[[i.left,t.height],[i.left+s,t.height]];return f.push([t.width,i.top],[t.width,i.top+c]),b(this.ctx,f),d&&this.renderActiveCell(),{left:i.left,top:i.top,width:s,height:c}}renderSelectAll(t){let{contentHeight:e,contentWidth:i}=t,r=this.eventData.headerSize;R(this.ctx,0,0,i,e),this.renderActiveCell();let h=i-r.width,o=e-r.height;return{left:r.width,top:r.height,width:h,height:o}}renderSelectCol({contentHeight:t}){let e=this.eventData.headerSize,i=this.eventData.range,r=this.computeCellPosition(i),h=0;for(let a=i.col,s=i.col+i.colCount;a<s;a++)h+=this.getColWidth(a);let o=t-e.height;R(this.ctx,r.left,0,h,t),R(this.ctx,0,r.top,e.width,o);let l=[[e.width,e.height],[e.width,t]];return b(this.ctx,l),this.renderActiveCell(),{left:r.left,top:e.height,width:h,height:o}}renderSelectRow({contentWidth:t}){let e=this.eventData.headerSize,i=this.eventData.range,r=this.computeCellPosition(i),h=0;for(let a=i.row,s=i.row+i.rowCount;a<s;a++)h+=this.getRowHeight(a);let o=t-e.width-m;R(this.ctx,r.left,0,o,e.height),R(this.ctx,0,r.top,t,h);let l=[[r.left,e.height],[t,e.height]];return b(this.ctx,l),this.renderActiveCell(),{left:e.width,top:r.top,width:o,height:h}}renderActiveCell(){let t=this.eventData.range,e=this.getActiveRange({row:t.row,col:t.col,rowCount:1,colCount:1,sheetId:t.sheetId}).range;this.clearRect(e)}};var tt;self.addEventListener("message",n=>{if(n.data.status==="formula"){let e={list:Rt(n.data),status:"formula"};self.postMessage(e)}else if(n.data.status==="init")tt=new N(n.data.canvas),st(n.data.dpr);else if(n.data.status==="render"){let t=tt.render(n.data);if(t){let e={...t,status:"render"};self.postMessage(e)}}else n.data.status==="resize"&&tt.resize(n.data)});function Rt(n){let{currentSheetId:t,worksheets:e,workbook:i,definedNames:r}=n,h=new Map,o=e[t]||{},l=[],a={handleCell:()=>[],getFunction:s=>at[s],getCell:s=>{let{row:c,col:d,sheetId:f}=s,p=e[f||t]||{},w=A(c,d);return p[w]},set:()=>{throw new V("#REF!")},getSheetInfo:(s,c)=>{if(c)return i.find(f=>f.name===c);let d=s||t;return i.find(f=>f.sheetId===d)},setDefinedName:()=>{throw new V("#REF!")},getDefinedName:s=>r[s]};for(let[s,c]of Object.entries(o)){if(!c?.formula)continue;let d=ct(c?.formula,ot(s),a,h);if(!d)continue;let f=d.result[0];f!==c.value&&l.push({key:s,newValue:f,sheetId:t})}return l}
//# sourceMappingURL=worker.js.map
