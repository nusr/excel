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
import{$ as Ae,A as ft,Aa as Ce,B as fe,Ba as Sn,C as sn,Ca as In,D as Se,Da as An,E as Ie,Ea as Ve,F as it,Fa as mo,G as ho,Ga as kn,H as q,Ha as L,I as Lt,Ia as yt,Ja as Xe,K as gt,Ka as En,L as ln,M as Nt,N as ze,O as We,P as Ue,Q as Mt,R as Dt,S as an,T as cn,U as po,V as hn,W as dn,X as Bt,Y as W,Z as je,_ as pe,a as J,aa as Ht,b as E,ba as Ot,c as ot,ca as K,d as ue,da as Ct,e as Ft,ea as zt,f as Zo,fa as Wt,g as Yo,ga as Ut,h as Rt,ha as jt,i as Jo,ia as Fe,j as qo,ja as ge,k as I,ka as pn,l as _o,la as ke,m as $o,ma as mn,n as ve,na as st,o as xe,oa as un,p as br,pa as fn,q as en,qa as gn,r as tn,ra as Cn,s as b,sa as yn,t as Ne,ta as lt,u as nt,ua as at,v as Pt,va as bn,w as on,wa as wn,x as nn,xa as vn,y as rt,ya as xn,z as rn,za as H}from"./chunk-XF62VRIS.js";import{a as j}from"./chunk-S76M7AWC.js";import{d as z}from"./chunk-RBTA6K5V.js";var Q=z(j());var te={"canvas-container":"xr","vertical-scroll-bar":"hr","vertical-scroll-bar-content":"p","horizontal-scroll-bar":"vr","horizontal-scroll-bar-content":"c","context-menu":"x","bottom-bar":"ur","bottom-bar-text":"fr","add-button":"mr"};var ie=class{constructor(e){this.listeners=[];this.setState=e=>{this.state=e,this.emitChange()};this.mergeState=e=>{let t={...this.state,...e};Sn(t,this.state)||(this.state=t,this.emitChange())};this.subscribe=e=>(this.listeners=[...this.listeners,e],()=>{this.listeners=this.listeners.filter(t=>t!==e)});this.getSnapshot=()=>this.state;this.state=e}emitChange(){for(let e of this.listeners)e()}};var ct=new ie([]);var vr={value:"",formula:"",row:0,col:0,left:q,top:q,width:0,height:0,defineName:"",isMergeCell:!1,rowCount:1,colCount:1,sheetId:""},oe=new ie(vr);var O=new ie({editorStatus:0,canRedo:!1,canUndo:!1,activeUuid:""});var Ke=new ie(yn());var Re=new ie({scrollTop:0,scrollLeft:0});var ht=new ie([]);var me=z(j());var uo=new Map;function Tn(n,e){let t=`${e}__${n.font}`;if(uo.has(t))return uo.get(t);let o=n.measureText(e),{actualBoundingBoxAscent:r,actualBoundingBoxDescent:i}=o,s=r+i,a=o.width,l=Math.ceil(a/J()),c=Math.ceil(s/J()),h={width:l,height:c};return uo.set(t,h),h}function ne(n,e,t,o,r){n.fillRect(E(e),E(t),E(o),E(r))}function Qe(n,e,t,o,r){n.strokeRect(E(e),E(t),E(o),E(r))}function go(n,e,t,o,r){n.clearRect(E(e),E(t),E(o),E(r))}function Ge(n,e,t,o){n.fillText(e,E(t),E(o))}function fo(n,e,t,o,r,i,s){let a=[];if(t?.underline){let l=[],c=t?.underline===2,h=Math.floor(i+o);e?l=[[r-s,h],[r,h]]:l=[[r,h],[r+s,h]],a=a.concat(Fn(l,c))}if(t?.isStrike){let l=[],c=Math.floor(i+o*.2);e?l=[[r-s,c],[r,c]]:l=[[r,c],[r+s,c]],a=a.concat(Fn(l,!1))}Me(n,a)}function wt(n,e,t,o){let r={row:t,col:o,colCount:1,rowCount:1,sheetId:""},i=n.getCell(r),s={width:0,height:0};if(!i)return s;let a=n.getCellSize(r);if(a.width<=0||a.height<=0)return s;let l=n.computeCellPosition(r),c=xr(e,{...i,top:l.top,left:l.left,width:a.width,height:a.height});return s.height=Math.ceil(c.height),s.width=Math.ceil(c.width),s}function xr(n,e){let{style:t,value:o,left:r,top:i,width:s,height:a}=e,l={height:0,width:0};if(Ce(e.value)&&Ce(e.style))return l;let c=an(o),h=Rt,d=L("contentColor"),p=t?.fontSize?t.fontSize:Ft;Ce(t)||(h=Yo(t?.isItalic?"italic":"normal",t?.isBold?"bold":"500",E(p),t?.fontFamily),d=t?.fontColor||L("contentColor"),t?.fillColor&&(n.fillStyle=t?.fillColor,ne(n,r,i,s,a)));let f=Bt(o);ln.has(f)&&(d=L("errorFormulaColor"));let y=dn(f);if(y.length===0||(n.textAlign=c?"right":"left",n.font=h,n.fillStyle=d,n.textBaseline="middle",y.length===0))return l;t?.underline&&(n.strokeStyle=d);let u=Math.ceil(p*Ve.lineHeight),m=Math.ceil(p*(Ve.lineHeight-1)/2),g=r+(c?s-m:m);if(l.height=u,t?.isWrapText){l.height=m*2;let w=i+l.height,x="",v=0,S=0;for(let C=0;C<y.length;C++){let A=x+y[C],k=Tn(n,A);k.width>s?(w+=m,C===0?(v=k.width,S=k.height,Ge(n,y[C],g,w),x=""):(Ge(n,x,g,w),x=y[C]),fo(n,c,t,S,g,w,v),w+=S+m,l.height+=S+m*2,l.width=Math.max(v,l.width)):(v=k.width,S=k.height,x=A)}x&&(l.height+=S+m,l.width=Math.max(v,l.width),Ge(n,x,g,w),fo(n,c,t,S,g,w,v)),l.width+=m*2}else{let w="",x=0,v=0;for(let A=0;A<y.length;A++){let k=w+y[A],N=Tn(n,k);if(N.width>s){A===0&&(x=N.width,v=N.height,w=k);break}else x=N.width,v=N.height,w=k}let S=v>a?v:a,C=i+S/2;l.height=v,Ge(n,w,g,C),fo(n,c,t,v,g,C,x),l.width=x+m*2}return l}function Me(n,e){if(e.length!==0){n.beginPath();for(let t=0;t<e.length;t+=2){let o=e[t],r=e[t+1];n.moveTo(E(o[0]),E(o[1])),n.lineTo(E(r[0]),E(r[1]))}n.stroke()}}function Rn(n,e,t,o){n.beginPath(),n.moveTo(E(e[0]),E(e[1])),n.lineTo(E(t[0]),E(t[1])),n.lineTo(E(o[0]),E(o[1])),n.fill()}function Pn(n,e,t,o,r){let i=n.getLineDash();n.setLineDash([E(8),E(6)]);let s=J()/2;Qe(n,e+s,t+s,o-s*2,r-s*2),n.setLineDash(i)}function Fn(n,e){let[t,o]=n,r=J(),i=[[t[0],t[1]-r],[o[0],o[1]-r]];if(e){let s=r*2;i.push([t[0],t[1]-s],[o[0],o[1]-s])}return i}function Vt(n,e,t){n.style.width=`${e}px`,n.style.height=`${t}px`;let o=E(e),r=E(t);n.width=o,n.height=r}function Co(){return{textAlign:"center",textBaseline:"middle",font:Rt,fillStyle:L("black"),lineWidth:ot(),strokeStyle:L("borderColor")}}var vt=class{constructor(e,t){this.isRendering=!1;this.render=e=>{if(e.changeSet.size===0)return;if(this.isRendering){st("It is rendering");return}this.isRendering=!0,this.content.render(e),this.clear(),this.ctx.drawImage(this.content.getCanvas(),0,0);let{width:t,height:o}=this.controller.getDomRect(),r=this.controller.getHeaderSize(),i=t-r.width,s=o-r.height;this.renderGrid(i,s),this.renderRowsHeader(s),this.renderColsHeader(i),this.renderTriangle();let a=this.renderSelection();this.renderAntLine(a),this.renderMergeCell(),this.isRendering=!1};let o=e.getMainDom().canvas;this.controller=e,this.ctx=o.getContext("2d"),this.content=t;let r=J();this.ctx.scale(r,r)}resize(){let e=this.controller.getDomRect(),{width:t,height:o}=e;Vt(this.ctx.canvas,t,o),this.content.resize()}clear(){let{width:e,height:t}=this.controller.getDomRect();this.ctx.clearRect(0,0,E(e),E(t))}renderMergeCell(){let{controller:e}=this,t=e.getActiveCell(),o=e.getMergeCells(e.getCurrentSheetId());if(o.length!==0)for(let r of o){let i=e.computeCellPosition(r),s=e.getCellSize(r);s.width<=0||s.height<=0||(go(this.ctx,i.left,i.top,s.width,s.height),wt(e,this.ctx,r.row,r.col),!(Ct(t)||zt(t)||Wt(t))&&jt(t.row,t.col,r)&&(this.ctx.strokeStyle=L("primaryColor"),this.ctx.lineWidth=J(),Qe(this.ctx,i.left,i.top,s.width,s.height)))}}renderGrid(e,t){let{controller:o}=this,r=o.getHeaderSize(),{row:i,col:s}=o.getScroll(),{rowCount:a,colCount:l}=this.controller.getSheetInfo(this.controller.getCurrentSheetId()),c=ot();this.ctx.save(),this.ctx.fillStyle=L("white"),this.ctx.lineWidth=c,this.ctx.strokeStyle=L("borderColor"),this.ctx.translate(E(r.width),E(r.height));let h=[],d=0,p=0,f=0;for(let m=s;m<l&&(f+=o.getColWidth(m).len,!(f>e));m++);let y=Math.min(f,e),u=!1;for(let m=i;m<a;m++){u?u=!1:h.push([0,d],[y,d]);let g=o.getRowHeight(m).len;if(g===0&&(u=!0),d+=g,d>t)break}for(let m=s;m<l;m++){u?u=!1:h.push([p,0],[p,d]);let g=o.getColWidth(m).len;if(g===0&&(u=!0),p+=g,p>y)break}h.push([0,d],[p,d]),h.push([p,0],[p,d]),Me(this.ctx,h),this.ctx.restore()}isHighlightRow(e,t,o){return Ct(t)||Wt(t)||o>=t.row&&o<t.row+t.rowCount?!0:e.some(r=>o>=r.row&&o<r.row+r.rowCount)}isHighlightCol(e,t,o){return Ct(t)||zt(t)||o>=t.col&&o<t.col+t.colCount?!0:e.some(r=>o>=r.col&&o<r.col+r.colCount)}renderRowsHeader(e){let{controller:t}=this,{row:o}=t.getScroll(),r=t.getHeaderSize(),{rowCount:i}=t.getSheetInfo(t.getCurrentSheetId()),s=t.getMergeCells(t.getCurrentSheetId());this.ctx.save();let a=this.controller.getActiveCell();this.ctx.fillStyle=L("white"),ne(this.ctx,0,r.height,r.width,e),Object.assign(this.ctx,Co());let l=[],c=r.height,h=o;for(;h<i;h++){let d=t.getRowHeight(h).len,p=c;if(h===o&&(p+=ot()/2),l.push([0,p],[r.width,p]),d>0){let f=this.isHighlightRow(s,a,h);this.ctx.fillStyle=f?L("primaryColor"):L("black"),Ge(this.ctx,String(h+1),r.width/2,p+d/2)}if(c+=d,c>e)break}l.push([0,c],[r.width,c]),l.push([0,0],[0,c]),Me(this.ctx,l),this.ctx.restore()}renderColsHeader(e){let{controller:t}=this,{col:o}=t.getScroll(),r=t.getHeaderSize(),{colCount:i}=t.getSheetInfo(t.getCurrentSheetId()),s=t.getMergeCells(t.getCurrentSheetId()),a=this.controller.getActiveCell(),l=[];this.ctx.save(),this.ctx.fillStyle=L("white"),ne(this.ctx,r.width,0,e,r.height),Object.assign(this.ctx,Co());let c=r.width,h=o;for(;h<i;h++){let d=t.getColWidth(h).len,p=c;if(h===o&&(p+=ot()/2),l.push([p,0],[p,r.height]),d>0){let f=this.isHighlightCol(s,a,h);this.ctx.fillStyle=f?L("primaryColor"):L("black"),Ge(this.ctx,Ot(h),p+d/2,r.height/2+J())}if(c+=d,c>e)break}l.push([c,0],[c,r.height]),l.push([0,0],[c,0]),Me(this.ctx,l),this.ctx.restore()}renderTriangle(){let e=this.controller.getHeaderSize();this.ctx.save(),this.ctx.fillStyle=L("white"),ne(this.ctx,0,0,e.width,e.height),this.ctx.fillStyle=L("triangleFillColor");let t=2,o=Math.floor(t),r=Math.floor(e.height-t),i=Math.floor(e.width*.4),s=Math.floor(e.width-t);Rn(this.ctx,[s,o],[i,r],[s,r]),this.ctx.restore()}renderAntLine(e){let{controller:t}=this,o=t.getCopyRanges();if(o.length===0)return;let[r]=o;r.sheetId===t.getCurrentSheetId()&&(st("render canvas ant line"),this.ctx.strokeStyle=L("primaryColor"),this.ctx.lineWidth=J(),Pn(this.ctx,e.left,e.top,e.width,e.height))}renderSelection(){let{controller:e}=this,t=e.getActiveCell();return st("render canvas selection"),Ct(t)?this.renderSelectAll():Wt(t)?this.renderSelectCol():zt(t)?this.renderSelectRow():this.renderSelectRange()}renderActiveCell(){let{controller:e}=this,t=e.getActiveCell();if(t.rowCount===t.colCount&&t.rowCount===1)return;let o={row:t.row,col:t.col,rowCount:1,colCount:1,sheetId:""},r=e.computeCellPosition(o),i=e.getCellSize(o);go(this.ctx,r.left,r.top,i.width,i.height),wt(e,this.ctx,t.row,t.col)}renderSelectRange(){let{controller:e}=this,t=e.getHeaderSize(),o=e.getActiveCell(),r=e.computeCellPosition({row:o.row,col:o.col,rowCount:1,colCount:1,sheetId:""}),i=o.row+o.rowCount-1,s=o.col+o.colCount-1,a={row:i,col:s,rowCount:1,colCount:1,sheetId:""},l=e.computeCellPosition(a),c=e.getCellSize(a),h=l.left+c.width-r.left,d=l.top+c.height-r.top;this.ctx.fillStyle=L("selectionColor"),ne(this.ctx,r.left,0,h,t.height),ne(this.ctx,0,r.top,t.width,d);let p=o.rowCount>1||o.colCount>1;p&&ne(this.ctx,r.left,r.top,h,d),this.ctx.strokeStyle=L("primaryColor"),this.ctx.lineWidth=J();let f=[[r.left,t.height],[r.left+h,t.height]];return f.push([t.width,r.top],[t.width,r.top+d]),Me(this.ctx,f),p&&this.renderActiveCell(),Qe(this.ctx,r.left,r.top,h,d),{left:r.left,top:r.top,width:h,height:d}}renderSelectAll(){let{controller:e}=this,{width:t,height:o}=this.controller.getDomRect();this.ctx.fillStyle=L("selectionColor"),ne(this.ctx,0,0,t,o);let r=e.getHeaderSize();return this.ctx.strokeStyle=L("primaryColor"),this.ctx.lineWidth=J(),this.renderActiveCell(),Qe(this.ctx,r.width,r.height,t,o),{left:r.width,top:r.height,width:t,height:o}}renderSelectCol(){let{controller:e}=this,t=e.getHeaderSize(),o=e.getActiveCell(),{height:r}=e.getDomRect();this.ctx.fillStyle=L("selectionColor");let i=e.computeCellPosition({row:o.row,col:o.col,colCount:1,rowCount:1,sheetId:""}),s=0;for(let l=o.col,c=o.col+o.colCount;l<c;l++)s+=e.getColWidth(l).len;ne(this.ctx,i.left,0,s,t.height),ne(this.ctx,0,i.top,t.width,r),ne(this.ctx,i.left,i.top,s,r),this.ctx.strokeStyle=L("primaryColor"),this.ctx.lineWidth=J();let a=[[t.width,t.height],[t.width,r]];return Me(this.ctx,a),this.renderActiveCell(),Qe(this.ctx,i.left,i.top,s,r),{left:i.left,top:i.top,width:s,height:r}}renderSelectRow(){let{controller:e}=this,t=e.getHeaderSize(),o=e.getActiveCell(),{width:r}=e.getDomRect();this.ctx.fillStyle=L("selectionColor");let i=e.computeCellPosition({row:o.row,col:o.col,colCount:1,rowCount:1,sheetId:""}),s=0;for(let l=o.row,c=o.row+o.rowCount;l<c;l++)s+=e.getRowHeight(l).len;ne(this.ctx,i.left,0,r,t.height),ne(this.ctx,0,i.top,t.width,s),ne(this.ctx,i.left,i.top,r,s),this.ctx.strokeStyle=L("primaryColor"),this.ctx.lineWidth=J();let a=[[i.left,t.height],[r,t.height]];return Me(this.ctx,a),this.renderActiveCell(),Qe(this.ctx,i.left,i.top,r,s),{left:i.left,top:i.top,width:r,height:s}}};function Xt(n){De(n),n.setNextActiveCell("right"),Gt(n)}function Kt(n){De(n),n.setNextActiveCell("down"),Gt(n)}function Qt(n,e,t){let o=n.getScroll(),{row:r,col:i}=o;if(o.top!==t){r=0;let s=t;for(;s>0;){let a=n.getRowHeight(r).len;if(a>s)break;s-=a,r++}}if(o.left!==e){i=0;let s=e;for(;s>0;){let a=n.getColWidth(i).len;if(a>s)break;s-=a,i++}}return{row:r,col:i}}function xt(n,e,t){let o=n.getDomRect(),r=n.getViewSize(),i=r.height-o.height+ho,s=r.width-o.width+ho,a=o.height-it*1,l=o.width-it*1,c=Math.floor(t*a/i),h=Math.floor(e*l/s);return{maxHeight:i,maxWidth:s,maxScrollHeight:a,maxScrollWidth:l,scrollTop:c,scrollLeft:h}}function Pe(n,e,t){let o=n.getScroll(),{maxHeight:r,maxWidth:i,maxScrollHeight:s,maxScrollWidth:a}=xt(n,o.left,o.top),l=o.top+Math.ceil(t);l<0?l=0:l>r&&(l=r);let c=o.left+Math.ceil(e);c<0?c=0:c>i&&(c=i);let{row:h,col:d}=Qt(n,c,l),p=Math.floor(l*s/r),f=Math.floor(c*a/i);n.setScroll({row:h,col:d,top:l,left:c,scrollTop:p,scrollLeft:f})}function Gt(n){let e=n.getActiveCell(),t={row:e.row,col:e.col,colCount:1,rowCount:1,sheetId:""},o=n.computeCellPosition(t),r=n.getCellSize(t),i=n.getDomRect(),s=n.getScroll(),a=n.getSheetInfo(n.getCurrentSheetId()),l=n.getHeaderSize(),c=5,{maxHeight:h,maxWidth:d,maxScrollHeight:p,maxScrollWidth:f}=xt(n,s.left,s.top);if(o.left+r.width+c>i.width&&s.col<=a.colCount-2){let y=s.col+1,u=s.left+n.getColWidth(s.col).len,m=Math.floor(u*f/d);n.setScroll({...s,col:y,left:u,scrollLeft:m})}if(o.left-l.width<i.left+c&&s.col>=1){let y=s.col-1,u=s.left-n.getColWidth(s.col).len,m=Math.floor(u*f/d);n.setScroll({...s,col:y,left:u,scrollLeft:m})}if(o.top+r.height+c>i.height&&s.row<=a.rowCount-2){let y=s.row+1,u=s.top+n.getRowHeight(s.row).len,m=Math.floor(u*p/h);n.setScroll({...s,row:y,top:u,scrollTop:m})}if(o.top-l.height<i.top+c&&s.row>=1){let y=s.row-1,u=s.top-n.getRowHeight(s.row).len,m=Math.floor(u*p/h);n.setScroll({...s,row:y,top:u,scrollTop:m})}}function _(n){let e=n.getMainDom()?.input;return e?document.activeElement===e:!1}function Zt(n){let e=n.getMainDom().input;n.setCellValues([[e.value]],[],[n.getActiveRange().range]),e.value="",e.blur(),O.mergeState({editorStatus:0})}function De(n){return _(n)?(Zt(n),!0):!1}var Ln=[{key:"Enter",modifierKey:[],handler:Kt},{key:"Tab",modifierKey:[],handler:Xt},{key:"ArrowDown",modifierKey:[ue()?"meta":"ctrl"],handler:n=>{if(_(n))return;De(n);let e=n.getViewSize();Pe(n,0,e.height)}},{key:"ArrowUp",modifierKey:[ue()?"meta":"ctrl"],handler:n=>{if(_(n))return;De(n);let e=n.getViewSize();Pe(n,0,-e.height)}},{key:"ArrowRight",modifierKey:[ue()?"meta":"ctrl"],handler:n=>{if(_(n))return;De(n);let e=n.getViewSize();Pe(n,e.width,0)}},{key:"ArrowLeft",modifierKey:[ue()?"meta":"ctrl"],handler:n=>{if(_(n))return;De(n);let e=n.getViewSize();Pe(n,-e.width,0)}},{key:"ArrowDown",modifierKey:[],handler:n=>{_(n)||Kt(n)}},{key:"ArrowUp",modifierKey:[],handler:n=>{_(n)||(De(n),n.setNextActiveCell("up"),Gt(n))}},{key:"ArrowRight",modifierKey:[],handler:n=>{_(n)||Xt(n)}},{key:"ArrowLeft",modifierKey:[],handler:n=>{_(n)||(De(n),n.setNextActiveCell("left"),Gt(n))}},{key:"b",modifierKey:[ue()?"meta":"ctrl"],handler:n=>{if(_(n))return;let e=n.getCell(n.getActiveCell());n.updateCellStyle({isBold:!e?.style?.isBold},[n.getActiveCell()])}},{key:"i",modifierKey:[ue()?"meta":"ctrl"],handler:n=>{if(_(n))return;let e=n.getCell(n.getActiveCell());n.updateCellStyle({isItalic:!e?.style?.isItalic},[n.getActiveCell()])}},{key:"5",modifierKey:[ue()?"meta":"ctrl"],handler:n=>{if(_(n))return;let e=n.getCell(n.getActiveCell());n.updateCellStyle({isStrike:!e?.style?.isStrike},[n.getActiveCell()])}},{key:"u",modifierKey:[ue()?"meta":"ctrl"],handler:n=>{if(_(n))return;let t=n.getCell(n.getActiveCell())?.style?.underline,o=0;t===void 0||t===0?o=1:o=0,n.updateCellStyle({underline:o},[n.getActiveCell()])}},{key:"z",modifierKey:[ue()?"meta":"ctrl"],handler:n=>{n.undo()}},{key:"y",modifierKey:[ue()?"meta":"ctrl"],handler:n=>{n.redo()}}];function Yt(n){let e=(n?.target?.tagName||"").toLowerCase();return e==="input"||e==="textarea"}function yo(n,e){function t(l){if(Yt(l))return;let c=Ln.filter(d=>d.key===l.key);c.sort((d,p)=>p.modifierKey.length-d.modifierKey.length);let h=null;for(let d of c)if(d.modifierKey.length>0){if(d.modifierKey.some(p=>l[`${p}Key`])){h=d;break}}else{h=d;break}if(h){l.preventDefault(),h.handler(n);return}l.metaKey||l.ctrlKey||(O.mergeState({editorStatus:1}),n.getMainDom().input?.focus())}let o=xn(l=>{l.target===n.getMainDom().canvas&&Pe(n,l.deltaX,l.deltaY)},1e3/60);function r(l){Yt(l)||(l.preventDefault(),n.paste(l))}function i(l){Yt(l)||(l.preventDefault(),n.copy(l))}function s(l){Yt(l)||(l.preventDefault(),n.cut(l))}function a(){e(new Set(["row"]))}return window.addEventListener("resize",a),document.body.addEventListener("keydown",t),document.body.addEventListener("wheel",o),document.body.addEventListener("paste",r),document.body.addEventListener("copy",i),document.body.addEventListener("cut",s),()=>{window.removeEventListener("resize",a),document.body.removeEventListener("keydown",t),document.body.removeEventListener("wheel",o),document.body.removeEventListener("paste",r),document.body.removeEventListener("copy",i),document.body.removeEventListener("cut",s)}}var St=class{constructor(e,t){this.controller=e;let o=t.getContext("2d");this.ctx=o;let r=J();this.ctx.scale(r,r)}getCanvas(){return this.ctx.canvas}resize(){let{width:e,height:t}=this.controller.getDomRect();Vt(this.ctx.canvas,e,t)}render({changeSet:e}){e.size===0||!(e.has("row")||e.has("col")||e.has("sheetList")||e.has("sheetId")||e.has("cellStyle")||e.has("cellValue")||e.has("scroll"))||(st("render canvas content"),this.clear(),this.renderContent())}clear(){let{width:e,height:t}=this.controller.getDomRect();this.ctx.clearRect(0,0,E(e),E(t))}renderContent(){let{controller:e,ctx:t}=this,{width:o,height:r}=e.getDomRect(),i=e.getHeaderSize(),{row:s,col:a}=e.getScroll(),l=i.width,c=a,h=i.height,d=s;for(;l+e.getColWidth(c).len<o;)l+=e.getColWidth(c).len,c++;for(;h+e.getRowHeight(d).len<r;)h+=e.getRowHeight(d).len,d++;let p=d,f=c;t.save();let y=new Map,u=new Map;for(let m=s;m<p;m++)for(let g=a;g<f;g++){let w=wt(e,t,m,g);y.set(m,Math.max(y.get(m)||0,ze,w.height)),u.set(g,Math.max(u.get(g)||0,We,w.width))}for(let[m,g]of y.entries())g<=0||e.setRowHeight(m,g,!1);for(let[m,g]of u.entries())g<=0||e.setColWidth(m,g,!1);t.restore()}};function Nn(n,e,t){let o=n.getScroll(),{maxHeight:r,maxScrollHeight:i,maxScrollWidth:s,maxWidth:a}=xt(n,o.left,o.top),l=o.scrollTop+Math.ceil(t),c=o.scrollLeft+Math.ceil(e);l<0?l=0:l>i&&(l=i),c<0?c=0:c>s&&(c=s);let h=Math.floor(r*l/i),d=Math.floor(a*c/s),{row:p,col:f}=Qt(n,d,h),y={top:h,left:d,row:p,col:f,scrollLeft:c,scrollTop:l};n.setScroll(y)}var bo=({controller:n})=>{let e=(0,me.useRef)({prevPageX:0,prevPageY:0,scrollStatus:0}),{scrollLeft:t,scrollTop:o}=(0,me.useSyncExternalStore)(Re.subscribe,Re.getSnapshot);function r(a){a.buttons===1&&(a.stopPropagation(),e.current.scrollStatus===1?(e.current.prevPageY&&Nn(n,0,a.pageY-e.current.prevPageY),e.current.prevPageY=a.pageY):e.current.scrollStatus===2&&(e.current.prevPageX&&Nn(n,a.pageX-e.current.prevPageX,0),e.current.prevPageX=a.pageX))}function i(){e.current.scrollStatus=0,e.current.prevPageY=0,e.current.prevPageX=0,document.removeEventListener("pointermove",r),document.removeEventListener("pointerup",i)}function s(a,l){a.buttons===1&&(e.current.scrollStatus||(e.current.scrollStatus=l,document.addEventListener("pointermove",r),document.addEventListener("pointerup",i)))}return me.default.createElement(me.Fragment,null,me.default.createElement("div",{className:te["vertical-scroll-bar"],"data-testid":"vertical-scroll-bar",onPointerLeave:i,onPointerDown:a=>{s(a,1)}},me.default.createElement("div",{className:te["vertical-scroll-bar-content"],style:{height:it,transform:`translateY(${o}px)`}})),me.default.createElement("div",{className:te["horizontal-scroll-bar"],"data-testid":"horizontal-scroll-bar",onPointerLeave:i,onPointerDown:a=>{s(a,2)}},me.default.createElement("div",{className:te["horizontal-scroll-bar-content"],style:{width:it,transform:`translateX(${t}px)`}})))};bo.displayName="ScrollBar";var D=z(j());var Mn=110,wo=20;function Sr(n,e,t){let o=n.getHeaderSize(),r=n.getMainDom().canvas.getBoundingClientRect(),i=3,s=wo*3,a=e-r.top,l=t-r.left;a<o.height&&l<o.width?i=2:a<o.height?(i=0,s=wo*6):l<o.width&&(i=1,s=wo*6);let c=e,h=t,d=18,p=r.height+r.top;return c+s>p&&(c=p-s-d),h+Mn>r.width&&(h=r.width-Mn-d),{style:{top:c,left:h},position:i}}var vo=(0,D.memo)(n=>{let{controller:e,top:t,left:o,hideContextMenu:r}=n,{row:i,col:s,colCount:a,rowCount:l}=(0,D.useSyncExternalStore)(oe.subscribe,oe.getSnapshot),[c]=nt(r),{style:h,position:d}=(0,D.useMemo)(()=>Sr(e,t,o),[t,o]),p=f=>{let y=f?e.getRowHeight(i).len:e.getColWidth(s).len,u=m=>{y=parseInt(m.currentTarget.value,10),m.stopPropagation()};Ne({visible:!0,title:f?b("row-height"):b("column-width"),children:D.default.createElement("input",{type:"number",min:"0",max:"10000",style:{width:"200px"},defaultValue:y,onChange:u}),onOk:()=>{if(y<0){rt({type:"error",message:b("greater-than-zero")});return}if(f)for(let m=0;m<l;m++)e.setRowHeight(i+m,y,!0);else for(let m=0;m<a;m++)e.setColWidth(s+m,y,!0);r()},onCancel:()=>{r()}})};return D.default.createElement("div",{className:te["context-menu"],"data-testid":"context-menu",style:h,ref:c},D.default.createElement(I,{onClick:()=>{r(),e.setFloatElementUuid(""),e.copy()}},b("copy")),D.default.createElement(I,{onClick:()=>{r(),e.setFloatElementUuid(""),e.cut()}},b("cut")),D.default.createElement(I,{onClick:()=>{r(),e.paste()}},b("paste")),d===2&&D.default.createElement(I,{onClick:()=>{r(),e.deleteAll(e.getCurrentSheetId())}},b("delete")),d===0&&D.default.createElement(D.Fragment,null,D.default.createElement(I,{onClick:()=>{r(),e.addCol(s,a)}},b("insert-columns")),D.default.createElement(I,{onClick:()=>{r(),e.deleteCol(s,a)}},b("delete-columns")),D.default.createElement(I,{onClick:()=>{r(),e.hideCol(s,a)}},b("hide-columns")),D.default.createElement(I,{onClick:()=>{p(!1)}},b("column-width"))),d===1&&D.default.createElement(D.Fragment,null,D.default.createElement(I,{onClick:()=>{r(),e.addRow(i,l)}},b("insert-rows")),D.default.createElement(I,{onClick:()=>{r(),e.deleteRow(i,l)}},b("delete-rows")),D.default.createElement(I,{onClick:()=>{r(),e.hideRow(i,l)}},b("hide-rows")),D.default.createElement(I,{onClick:()=>{p(!0)}},b("row-height"))))});vo.displayName="ContextMenuContainer";function Ir(){let n=document.createElement("canvas");return n.style.display="none",document.body.appendChild(n),n}function Ar(n,e){let{row:t,col:o,rowCount:r,colCount:i,sheetId:s}=n,a={labels:[],datasets:[]};for(let l=t,c=1,h=t+r;l<h;l++,c++){if(e.getRowHeight(l).len===Ue)continue;let p=[];for(let f=o,y=o+i;f<y;f++){let u=e.getCell({row:l,col:f,rowCount:1,colCount:1,sheetId:s});!u||typeof u.value>"u"||p.push(cn(u.value))}p.length>0&&a.datasets.push({label:`Series${c}`,data:p})}return a.datasets[0]&&a.datasets[0].data.length>0&&(a.labels=Array.from({length:a.datasets[0].data.length}).fill("").map((l,c)=>String(c+1))),a}function kr(n){let{top:e}=n.getDomRect(),{range:t,isMerged:o}=n.getActiveRange(),r=t.sheetId||n.getCurrentSheetId(),i=n.getCell(t),s=n.getDefineName(new Fe(t.row,t.col,1,1,r)),a=n.getCellSize(t),l=n.computeCellPosition(t);l.top=e+l.top;let c=i?.style?.fontFamily||"";if(!c){let x="",v=Ke.getSnapshot();for(let S of v)if(!S.disabled){x=String(S.value);break}c=x}let{isBold:h=!1,isItalic:d=!1,isStrike:p=!1,fontSize:f=Ft,fontColor:y=L("contentColor"),fillColor:u="",isWrapText:m=!1,underline:g=0,numberFormat:w=0}=i?.style||{};oe.setState({top:l.top,left:l.left,width:a.width,height:a.height,row:t.row,col:t.col,rowCount:t.rowCount,colCount:t.colCount,sheetId:r,value:i?.value,formula:i?.formula,isBold:h,isItalic:d,isStrike:p,fontColor:y,fontSize:f,fontFamily:c,fillColor:u,isWrapText:m,underline:g,numberFormat:w,defineName:s,isMergeCell:o})}var Dn=(n,e)=>{if((n.has("range")||n.has("cellStyle")||n.has("cellValue"))&&kr(e),n.has("sheetList")){let t=e.getSheetList().map(o=>({sheetId:o.sheetId,name:o.name,isHide:o.isHide,tabColor:o.tabColor}));ct.setState(t)}if(n.has("sheetId")?O.mergeState({canRedo:e.canRedo(),canUndo:e.canUndo(),activeUuid:""}):O.mergeState({canRedo:e.canRedo(),canUndo:e.canUndo()}),n.has("scroll")){let t=e.getScroll();Re.setState({scrollLeft:t.scrollLeft,scrollTop:t.scrollTop})}if(n.has("floatElement")||n.has("cellValue")||n.has("row")||n.has("col")||n.has("sheetId")||n.has("scroll")){let t=e.getScroll(),o=e.getDomRect(),r=t.left,i=t.top,s=o.width+r,a=o.height+i,l=e.getFloatElementList(e.getCurrentSheetId()),c=[];for(let h of l){let d=e.computeCellPosition({row:h.fromRow,col:h.fromCol,colCount:1,rowCount:1,sheetId:""}),p=d.top+h.marginY,f=d.left+h.marginX;if(p>i&&p<a||f>r&&f<s||p+h.height>i&&p+h.height<a||f+h.width>r&&f+h.width<s){let u={...h,top:p,left:f,labels:[],datasets:[]};if(h.type==="chart"){let m=Ar(h.chartRange,e);u.labels=m.labels,u.datasets=m.datasets}c.push(u)}}ht.setState(c)}};function Bn(n){let e=new vt(n,new St(n,Ir())),t=s=>{e.render({changeSet:s}),e.render({changeSet:n.getChangeSet()})},o=s=>{e.resize(),t(s)},r=yo(n,o);n.setHooks({copyOrCut:bn,paste:wn,modelChange:s=>{Dn(s,n),t(s)}});let i=new Set(["sheetId","scroll","range","sheetList","floatElement","cellValue","row","col","cellStyle","defineName","mergeCell","undoRedo","antLine"]);return Dn(i,n),o(i),setTimeout(()=>{o(i)},10),()=>{r()}}var Ee=z(j());var Hn=({controller:n})=>{let{scrollTop:e}=(0,Ee.useSyncExternalStore)(Re.subscribe,Re.getSnapshot),t=n.getHeaderSize(),o=n.getDomRect(),[r,i]=(0,Ee.useState)(10),s=l=>{let c=l.currentTarget.value;i(parseInt(c,10)),l.stopPropagation()},a=()=>{let l=n.getSheetInfo(n.getCurrentSheetId());n.addRow(l.rowCount-1,r);let c=n.getViewSize();Pe(n,0,c.height)};return Ee.default.createElement("div",{className:te["bottom-bar"],"data-testid":"canvas-bottom-bar",style:{left:t.width,display:e/o.height>=.856?"flex":"none"}},Ee.default.createElement("div",{className:te["bottom-bar-text"]},b("add-at-the-bottom")),Ee.default.createElement("input",{value:r,onChange:s,type:"number",min:1,max:200}),Ee.default.createElement("div",{className:te["bottom-bar-text"]},b("rows")),Ee.default.createElement(I,{className:te["add-button"],onClick:a},b("add")))};var G=z(j());var T=z(j());var F={"float-element":"h",active:"v","float-element-mask":"u","context-menu":"f",title:"wr",image:"kr","resize-handler":"yr","resize-handler-rect":"zr","scale-dot":"Cr","rotate-icon":"Pr",top:"Rr",bottom:"Ir","top-right":"Zr","top-left":"jr","bottom-right":"Br","bottom-left":"Ar",right:"Fr",left:"Hr",rotate:"m"};var V=z(j());function Tr(n){let e="data:image/",t=e.length;for(;t<n.length&&n[t]!==";";t++);return n.slice(e.length,t)}var Fr=[{value:"line",label:b("line-chart")},{value:"bar",label:b("bar-chart")},{value:"pie",label:b("pie-chart")},{value:"scatter",label:b("scatter-chart")},{value:"radar",label:b("radar-chart")},{value:"polarArea",label:b("polar-area-chart")}],xo=(0,V.memo)(n=>{let{controller:e,menuLeft:t,menuTop:o,uuid:r,type:i,chartType:s,title:a,resetResize:l,hideContextMenu:c,originHeight:h,originWidth:d,width:p,height:f}=n,[y]=nt(c),u=()=>{let x=ke(n.chartRange,"absolute",S=>e.getSheetInfo(S)?.name||""),v=S=>{x=S.currentTarget.value,S.stopPropagation()};Ne({visible:!0,title:b("edit-data-source"),children:V.default.createElement("input",{type:"text",spellCheck:!0,style:{width:"400px"},defaultValue:x,onChange:v}),onOk:()=>{let S=x.trim();if(!S){rt({type:"error",message:b("reference-is-empty")});return}let C=e.getSheetList(),A=ge(S,k=>C.find(N=>N.name===k)?.sheetId||"");if(!A||!A.isValid()||Ut(A,n.chartRange)){rt({type:"error",message:b("reference-is-not-valid")});return}e.updateFloatElement(r,{chartRange:A}),c()},onCancel:()=>{c()}})},m=()=>{let x=a,v=S=>{x=S.currentTarget.value,S.stopPropagation()};Ne({visible:!0,title:b("change-chart-title"),children:V.default.createElement("input",{type:"text",spellCheck:!0,style:{width:"200px"},defaultValue:x,onChange:v}),onOk:()=>{let S=x.trim();if(!S){rt({type:"error",message:b("the-value-cannot-be-empty")});return}e.updateFloatElement(r,{title:S}),c()},onCancel:()=>{c()}})},g=()=>{let x=s;Ne({title:b("change-chart-title"),visible:!0,children:V.default.createElement(xe,{style:{width:"100%"},defaultValue:x,data:Fr.map(v=>({...v,disabled:!1})),onChange:v=>x=String(v)}),onCancel(){c()},onOk(){e.updateFloatElement(r,{chartType:x}),c()}})},w=()=>{c();let v=e.getFloatElementList(e.getCurrentSheetId()).find(S=>S.uuid===r);if(v&&(i==="floating-picture"&&v.imageSrc&&Xe(v.imageSrc,v.title+"."+Tr(v.imageSrc)),i==="chart")){let S=document.querySelector(`canvas[data-uuid="${r}"]`);if(!S)return;Xe(S.toDataURL(),v.title+".png")}};return V.default.createElement("div",{className:F["context-menu"],"data-testid":"float-element-context-menu",ref:y,style:{top:o,left:t}},V.default.createElement(I,{onClick:()=>{c(),e.setFloatElementUuid(r),e.copy()}},b("copy")),V.default.createElement(I,{onClick:()=>{c(),e.setFloatElementUuid(r),e.cut()}},b("cut")),V.default.createElement(I,{onClick:()=>{c(),e.paste()}},b("paste")),V.default.createElement(I,{onClick:()=>{c(),e.setFloatElementUuid(r),e.copy(),e.paste(),e.setFloatElementUuid("")}},b("duplicate")),i==="chart"?V.default.createElement(V.default.Fragment,null,V.default.createElement(I,{onClick:u},b("select-data")),V.default.createElement(I,{onClick:m},b("change-chart-title")),V.default.createElement(I,{onClick:g},b("change-chart-type"))):null,V.default.createElement(I,{onClick:w},b("save-as-picture")),V.default.createElement(I,{disabled:p===d&&f===h,onClick:()=>{c(),e.updateFloatElement(r,{height:h,width:d}),l({width:d,height:h})}},b("reset-size")),V.default.createElement(I,{onClick:()=>{c(),e.deleteFloatElement(r)}},b("delete")))});xo.displayName="FloatElementContextMenu";var Ze={resizePosition:"",moveStartX:0,moveStartY:0,position:{width:-1,height:-1,imageAngle:0,top:-1,left:-1}};function So(n,e,t){let o=t.getHeaderSize(),r=t.getDomRect(),i=o.height,s=o.width;return n<i&&(n=i),n>r.height&&(n=r.height),e<s&&(e=s),e>r.width&&(e=r.width),{top:n,left:e}}var Pr=(0,T.lazy)(()=>import("./Chart-JEGWHO7N.js")),On=(0,T.memo)(n=>{let{top:e,left:t,active:o,width:r,height:i,type:s,imageAngle:a=0,resetResize:l,pointerDown:c,resizeDown:h}=n,[d,p]=(0,T.useState)({top:q,left:q}),f=m=>(m.preventDefault(),m.stopPropagation(),p({top:m.clientY,left:m.clientX}),!1),y=()=>{p({top:q,left:q})},u=null;return s==="floating-picture"?u=T.default.createElement("img",{title:n.title,alt:n.title,src:n.imageSrc,className:F.image}):s==="chart"&&(u=T.default.createElement(T.Suspense,{fallback:T.default.createElement(rn,null)},T.default.createElement(Pr,{...n}),";")),u?T.default.createElement(T.default.Fragment,null,T.default.createElement("div",{onPointerDown:c,onContextMenu:f,className:K(F["float-element"],{[F.active]:o}),style:{transform:`translateX(${t}px) translateY(${e}px) ${s==="floating-picture"?`rotate(${a}deg)`:""} `,width:r,height:i}},u,o&&T.default.createElement(T.default.Fragment,null,T.default.createElement("div",{className:K(F["resize-handler"],F.top),"data-position":"top",onPointerDown:h},T.default.createElement("div",{className:F["scale-dot"]})),T.default.createElement("div",{className:K(F["resize-handler"],F["top-right"]),"data-position":"top-right",onPointerDown:h},T.default.createElement("div",{className:F["scale-dot"]})),T.default.createElement("div",{className:K(F["resize-handler"],F["top-left"]),"data-position":"top-left",onPointerDown:h},T.default.createElement("div",{className:F["scale-dot"]})),T.default.createElement("div",{className:K(F["resize-handler"],F.left),"data-position":"left",onPointerDown:h},T.default.createElement("div",{className:F["scale-dot"]})),T.default.createElement("div",{className:K(F["resize-handler"],F.right),"data-position":"right",onPointerDown:h},T.default.createElement("div",{className:F["scale-dot"]})),T.default.createElement("div",{className:K(F["resize-handler"],F["bottom-right"]),"data-position":"bottom-right",onPointerDown:h},T.default.createElement("div",{className:F["scale-dot"]})),T.default.createElement("div",{className:K(F["resize-handler"],F["bottom-left"]),"data-position":"bottom-left",onPointerDown:h},T.default.createElement("div",{className:F["scale-dot"]})),T.default.createElement("div",{className:K(F["resize-handler"],F.bottom),"data-position":"bottom",onPointerDown:h},T.default.createElement("div",{className:F["scale-dot"]})),s==="floating-picture"&&T.default.createElement("div",{className:K(F["resize-handler"],F.rotate),"data-position":"rotate",onPointerDown:h},T.default.createElement("div",{className:F["rotate-icon"]},T.default.createElement(ve,{name:"rotate"}))))),d.top>=0&&d.left>=0&&T.default.createElement(xo,{...n,resetResize:l,menuLeft:d.left,menuTop:d.top,hideContextMenu:y})):null});var Ye=z(j());var Io=({controller:n})=>{let e=(0,Ye.useRef)(null),t=(r,i)=>{let s=new Image;s.src=r,s.onload=function(){let a=n.getActiveCell();n.addFloatElement({width:s.width,height:s.height,originHeight:s.height,originWidth:s.width,title:i,type:"floating-picture",uuid:Ae(),imageSrc:r,sheetId:a.sheetId,fromRow:a.row,fromCol:a.col,marginX:0,marginY:0})}};return Ye.default.createElement(I,null,Ye.default.createElement("input",{type:"file",hidden:!0,onChange:async r=>{r.stopPropagation();let i=r.target.files?.[0];if(!i)return;let s=i.name,a=i.type.slice(6);s=s.slice(0,-(a.length+1));let l=new FileReader;l.onload=function(c){e.current.value="",e.current.blur();let h=c.target?.result;!h||typeof h!="string"||t(h,s)},l.readAsDataURL(i)},accept:"image/*",ref:e,id:"upload_float_image"}),Ye.default.createElement("label",{htmlFor:"upload_float_image"},b("floating-picture")))},Ao=({controller:n})=>Ye.default.createElement(I,{onClick:()=>{let t=n.getActiveCell();n.addFloatElement({width:400,height:300,originHeight:300,originWidth:400,title:"Chart Title",type:"chart",uuid:Ae(),sheetId:t.sheetId,fromRow:t.row,fromCol:t.col,chartRange:t,chartType:"line",marginX:0,marginY:0})}},b("chart"));var zn=(0,G.memo)(({controller:n})=>{let e=(0,G.useSyncExternalStore)(ht.subscribe,ht.getSnapshot),{activeUuid:t}=(0,G.useSyncExternalStore)(O.subscribe,O.getSnapshot),o=(0,G.useRef)({...Ze}),[r,i]=(0,G.useState)({...Ze.position}),s=c=>{if(c.stopPropagation(),c.preventDefault(),c.buttons!==1)return;let h=c.currentTarget.dataset.position||"";h&&(o.current.resizePosition=h,o.current.moveStartX=c.clientX,o.current.moveStartY=c.clientY)},a=c=>{let h=Math.round(c.clientX-o.current.moveStartX),d=Math.round(c.clientY-o.current.moveStartY);i(p=>{let f=o.current.resizePosition,{top:y,left:u,width:m,height:g}=p;["top-right","top-left","top"].includes(f)?(g-=d,y+=d):["bottom-right","bottom","bottom-left"].includes(f)&&(g+=d),["top-left","bottom-left","left"].includes(f)?(m-=h,u+=h):["top-right","bottom-right","right"].includes(f)&&(m+=h);let w={...So(y,u,n),imageAngle:p.imageAngle,width:m,height:g};return o.current.position=w,w})},l=c=>{let h=c.clientX-o.current.moveStartX,d=c.clientY-o.current.moveStartY,p=Math.atan2(d,h)*180/Math.PI;i(f=>{let y={...f,imageAngle:p};return o.current.position=y,y})};return(0,G.useEffect)(()=>{let c=d=>{if(d.stopPropagation(),d.preventDefault(),!t){o.current={...Ze};return}o.current.resizePosition&&(o.current.resizePosition==="rotate"?n.updateFloatElement(t,{imageAngle:o.current.position.imageAngle}):o.current.position.height>0&&o.current.position.width>0&&n.updateFloatElement(t,{height:o.current.position.height,width:o.current.position.width}));let p=n.getDomRect(),{left:f,top:y}=o.current.position;if(f>=0&&y>=0&&f<p.width&&y<p.height){let u=yt(n,f,y);u&&n.updateFloatElement(t,{fromCol:u.col,fromRow:u.row,marginX:u.marginX,marginY:u.marginY})}o.current={...Ze}},h=d=>{if(!t||d.buttons!==1)return;if(d.stopPropagation(),d.preventDefault(),o.current.resizePosition){o.current.resizePosition==="rotate"?l(d):(a(d),o.current.moveStartX=d.clientX,o.current.moveStartY=d.clientY);return}let p=Math.round(d.clientX-o.current.moveStartX),f=Math.round(d.clientY-o.current.moveStartY);i(y=>{let u=y.top+f,m=y.left+p,g={...So(u,m,n),imageAngle:y.imageAngle,width:y.width,height:y.height};return o.current.position=g,g}),o.current.moveStartX=d.clientX,o.current.moveStartY=d.clientY};return document.addEventListener("pointerup",c),document.addEventListener("pointermove",h),()=>{document.removeEventListener("pointerup",c),document.removeEventListener("pointermove",h)}},[t]),G.default.createElement(G.Fragment,null,G.default.createElement("div",{className:K(F["float-element-mask"],{[F.active]:!!t}),onPointerDown:()=>{o.current={...Ze},O.mergeState({activeUuid:""}),n.setFloatElementUuid("")}}),e.map(c=>{let h=c.uuid===t,d={...c,...h?r:{}};return G.default.createElement(On,{key:c.uuid,...d,active:h,controller:n,resetResize:p=>i(f=>({...f,...p})),pointerDown:p=>{p.stopPropagation(),p.preventDefault(),p.buttons===1&&(o.current.moveStartX=p.clientX,o.current.moveStartY=p.clientY,o.current.position={...Ze.position},n.setFloatElementUuid(c.uuid),O.mergeState({activeUuid:c.uuid}),i({top:c.top,left:c.left,width:c.width,height:c.height,imageAngle:c.imageAngle||0}))},resizeDown:s})}))});var Lr=300,ko=n=>{let{controller:e}=n,t=(0,Q.useRef)({timeStamp:0}),[o,r]=(0,Q.useState)({top:q,left:q}),i=(0,Q.useRef)(null);(0,Q.useEffect)(()=>{if(i.current)return e.setMainDom({canvas:i.current}),Bn(e)},[]);let s=h=>(h.preventDefault(),r({top:h.clientY,left:h.clientX}),!1),a=()=>{r({top:q,left:q})},l=h=>{if(h.buttons!==1)return;let d=e.getHeaderSize(),p=e.getDomRect(),{clientX:f,clientY:y}=h,u=f-p.left,m=y-p.top,g=yt(e,u,m);if(!g)return;let w=e.getActiveCell();if(!(w.row===g.row&&w.col===g.col)){if(u>d.width&&m>d.height){let x=Math.abs(g.col-w.col)+1,v=Math.abs(g.row-w.row)+1;e.setActiveCell({row:Math.min(g.row,w.row),col:Math.min(g.col,w.col),rowCount:v,colCount:x,sheetId:""});return}if(d.width>u&&d.height<=m){let x=Math.abs(g.row-w.row)+1;e.setActiveCell({row:Math.min(g.row,w.row),col:Math.min(g.col,w.col),rowCount:x,colCount:0,sheetId:""});return}if(d.width<=u&&d.height>m){let x=Math.abs(g.col-w.col)+1;e.setActiveCell({row:Math.min(g.row,w.row),col:Math.min(g.col,w.col),rowCount:0,colCount:x,sheetId:""});return}}},c=h=>{if(h.buttons!==1)return;let d=e.getHeaderSize(),p=e.getDomRect(),{timeStamp:f,clientX:y,clientY:u}=h,m=y-p.left,g=u-p.top,w=yt(e,m,g);if(!w)return;if(d.width>m&&d.height>g){e.setActiveCell({row:0,col:0,colCount:0,rowCount:0,sheetId:""});return}if(d.width>m&&d.height<=g){e.setActiveCell({row:w.row,col:w.col,rowCount:1,colCount:0,sheetId:""});return}if(d.width<=m&&d.height>g){e.setActiveCell({row:w.row,col:w.col,rowCount:0,colCount:1,sheetId:""});return}let x=e.getActiveCell();x.row>=0&&x.row===w.row&&x.col===w.col?f-t.current.timeStamp<Lr&&O.mergeState({editorStatus:1}):(_(e)&&Zt(e),e.setActiveCell({row:w.row,col:w.col,rowCount:1,colCount:1,sheetId:""})),t.current.timeStamp=f};return Q.default.createElement(Q.Fragment,null,Q.default.createElement("div",{className:te["canvas-container"],"data-testid":"canvas-container"},Q.default.createElement("canvas",{className:te["canvas-content"],onContextMenu:s,onPointerMove:l,onPointerDown:c,ref:i,"data-testid":"canvas-main"}),Q.default.createElement(bo,{controller:e}),Q.default.createElement(Hn,{controller:e}),Q.default.createElement(zn,{controller:e})),o.top>=0&&o.left>=0&&Q.default.createElement(vo,{...o,controller:e,hideContextMenu:a}))};ko.displayName="CanvasContainer";var ye=z(j());var pt=z(j());var Te={"formula-bar-wrapper":"Lr","formula-bar-name":"Mr","formula-bar-name-editor":"Ur","formula-bar-editor-wrapper":"Yr","formula-bar-value":"w",show:"qr","base-editor":"Dr"};function Eo(n,e=!0){let t={};return n?.isItalic&&(t.fontStyle="italic"),n?.isBold&&(t.fontWeight="bold"),n?.fontFamily&&(t.fontFamily=n?.fontFamily),n?.fontSize&&!e&&(t.fontSize=n?.fontSize),n?.fillColor&&!e&&(t.backgroundColor=n.fillColor),n?.fontColor&&!e&&(t.color=n?.fontColor),n?.underline&&n?.isStrike?t.textDecorationLine="underline line-through":n?.underline?t.textDecorationLine="underline":n?.isStrike&&(t.textDecorationLine="line-through"),t}function Wn(n,e){if(e===0)return;let t=e===2,o=Eo(n,t);if(t)return o;let r={top:n.top,left:n.left,width:n.width,height:n.height};return{...o,...r,border:"1px solid var(--primaryColor)"}}var To=({controller:n,initValue:e,style:t,testId:o})=>{let r=(0,pt.useRef)(null);(0,pt.useEffect)(()=>{r.current&&n.setMainDom({input:r.current})},[]);let i=s=>{s.stopPropagation(),s.key==="Enter"?Kt(n):s.key==="Tab"&&Xt(n)};return pt.default.createElement("input",{className:Te["base-editor"],ref:r,spellCheck:!0,defaultValue:e,onKeyDown:i,type:"text",style:t,"data-testid":o})};To.displayName="FormulaEditor";var Le=z(j());var Un=({controller:n,displayName:e})=>{let t=(0,Le.useRef)(null),[o,r]=(0,Le.useState)(e);(0,Le.useEffect)(()=>{r(e)},[e]);let i=a=>{if(a.stopPropagation(),a.key==="Enter"){let l=a.currentTarget.value.trim().toLowerCase();if(!l)return;t.current?.blur();let c=n.checkDefineName(l);if(c){r(e),n.setActiveCell(c);return}let h=ge(l),d=n.getSheetInfo(n.getCurrentSheetId());if(h&&h.col<d.colCount&&h.row<d.rowCount){r(e),n.setActiveCell(h);return}/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(l)&&l.length<=255?n.setDefineName(n.getActiveCell(),l):r(e)}},s=a=>{r(a.currentTarget.value)};return Le.default.createElement("div",{className:Te["formula-bar-name"],"data-testid":"formula-bar-name"},Le.default.createElement("input",{value:o,ref:t,spellCheck:!0,type:"text",onChange:s,className:Te["formula-bar-name-editor"],onKeyDown:i}))};var Fo=({controller:n})=>{let e=(0,ye.useSyncExternalStore)(oe.subscribe,oe.getSnapshot),{editorStatus:t}=(0,ye.useSyncExternalStore)(O.subscribe,O.getSnapshot),o=(0,ye.useMemo)(()=>e.defineName||`${Ot(e.col)}${e.row+1}`,[e]),r=e.formula||String(e.value||""),i=()=>{O.mergeState({editorStatus:2}),n.getMainDom().input?.focus()};return ye.default.createElement("div",{className:Te["formula-bar-wrapper"],"data-testid":"formula-bar"},ye.default.createElement(Un,{controller:n,displayName:o}),ye.default.createElement("div",{className:Te["formula-bar-editor-wrapper"]},t!==0?ye.default.createElement(To,{controller:n,initValue:r,style:Wn(e,t),testId:"formula-editor"}):null,ye.default.createElement("div",{className:K(Te["formula-bar-value"],{[Te.show]:t!==2}),style:Eo(e),onClick:i},r)))};Fo.displayName="FormulaBarContainer";var P=z(j());var jn={"toolbar-wrapper":"k"};var Dr=[{value:0,label:"none",disabled:!1},{value:1,label:"single underline",disabled:!1},{value:2,label:"double underline",disabled:!1}],Ro=({controller:n})=>{let{canRedo:e,canUndo:t}=(0,P.useSyncExternalStore)(O.subscribe,O.getSnapshot),o=(0,P.useSyncExternalStore)(oe.subscribe,oe.getSnapshot),r=(0,P.useSyncExternalStore)(Ke.subscribe,Ke.getSnapshot),i=g=>({fontFamily:String(g),fontSize:"16px"}),s=g=>{n.updateCellStyle(g,[n.getActiveCell()])},{isBold:a,isItalic:l,isStrike:c,fontSize:h,fontColor:d="",fillColor:p="",isWrapText:f,underline:y,fontFamily:u}=o,m=g=>{let w=String(g),x=window.queryLocalFonts;w===fn&&typeof x=="function"?x().then(v=>{let S=v.map(A=>A.fullName);S=Array.from(new Set(S)).filter(A=>Cn(A)),S.sort((A,k)=>A.localeCompare(k)),localStorage.setItem(gn,JSON.stringify(S));let C=S.map(A=>({label:A,value:A,disabled:!1}));Ke.setState(C)}):s({fontFamily:String(g)})};return P.default.createElement("div",{className:jn["toolbar-wrapper"],"data-testid":"toolbar"},P.default.createElement(I,{disabled:!t,onClick:()=>n.undo(),testId:"toolbar-undo",title:"undo"},P.default.createElement(ve,{name:"undo"})),P.default.createElement(I,{disabled:!e,onClick:()=>n.redo(),testId:"toolbar-redo",title:"redo"},P.default.createElement(ve,{name:"redo"})),P.default.createElement(I,{onClick:()=>n.copy(),testId:"toolbar-copy"},b("copy")),P.default.createElement(I,{onClick:()=>n.cut(),testId:"toolbar-cut"},b("cut")),P.default.createElement(I,{onClick:()=>n.paste(),testId:"toolbar-paste"},b("paste")),P.default.createElement(xe,{data:r,value:u,style:{width:140},getItemStyle:i,onChange:m}),P.default.createElement(xe,{data:Zo,value:h,onChange:g=>s({fontSize:Number(g)})}),P.default.createElement(I,{active:a,onClick:()=>s({isBold:!a}),testId:"toolbar-bold",title:"Bold"},P.default.createElement("span",{style:{fontWeight:"bold"}},"B")),P.default.createElement(I,{active:l,onClick:()=>s({isItalic:!l}),testId:"toolbar-italic",title:"Italic"},P.default.createElement("span",{style:{fontStyle:"italic"}},"I")),P.default.createElement(I,{active:c,onClick:()=>s({isStrike:!c}),testId:"toolbar-strike",title:"Strike"},P.default.createElement("span",{style:{textDecorationLine:"line-through"}},"A")),P.default.createElement(xe,{data:Dr,value:y,style:{width:130},title:"Underline",onChange:g=>s({underline:Number(g)})}),P.default.createElement(ft,{key:"fill-color",color:p,onChange:g=>s({fillColor:g})},P.default.createElement(I,{style:{color:p}},P.default.createElement($o,null))),P.default.createElement(ft,{key:"font-color",color:d,onChange:g=>s({fontColor:g})},P.default.createElement(I,{style:{color:d}},P.default.createElement(ve,{name:"fontColor"}))),P.default.createElement(I,{active:f,onClick:()=>s({isWrapText:!f}),testId:"toolbar-wrap-text",style:{minWidth:80}},b("wrap-text")),P.default.createElement(Io,{controller:n}),Ht()?null:P.default.createElement(Ao,{controller:n}),P.default.createElement(_o,null))};Ro.displayName="ToolbarContainer";var X=z(j());var ae=z(j());var se={"sheet-bar-wrapper":"Er","sheet-bar-list":"Gr","sheet-bar-item":"y",active:"Jr","sheet-bar-item-color":"Kr","sheet-bar-context-menu":"z","sheet-bar-input":"Nr","show-block":"Or","sheet-bar-add":"Qr","sheet-bar-unhide":"Tr","add-button":"Vr"};var Po=({controller:n,position:e,sheetList:t,currentSheetId:o,hideMenu:r,editSheetName:i})=>{let[s]=nt(()=>{r()}),a=(0,ae.useMemo)(()=>t.find(d=>d.sheetId===o)?.tabColor||"",[t,o]),l=(0,ae.useMemo)(()=>t.filter(d=>d.isHide).map(d=>({value:String(d.sheetId),label:d.name,disabled:!1})),[t]),c=()=>{let d=String(l[0]?.value)||"";Ne({visible:!0,title:b("unhide-sheet"),children:ae.default.createElement(xe,{data:l,onChange:p=>d=String(p),style:{width:300},defaultValue:d}),onCancel:r,onOk(){n.unhideSheet(d),r()}})},h=d=>{n.setTabColor(d),r()};return ae.default.createElement("div",{className:se["sheet-bar-context-menu"],style:{left:e},ref:s,"data-testid":"sheet-bar-context-menu"},ae.default.createElement(I,{onClick:()=>{r(),n.addSheet()}},b("insert")),ae.default.createElement(I,{onClick:()=>{r(),n.deleteSheet()}},b("delete")),ae.default.createElement(I,{onClick:()=>{r(),i()}},b("rename")),ae.default.createElement(I,{onClick:()=>{r(),n.hideSheet()}},b("hide")),ae.default.createElement(I,{className:se["sheet-bar-unhide"],disabled:l.length===0,onClick:c},b("unhide")),ae.default.createElement(ft,{color:a,onChange:h,position:"top"},ae.default.createElement(I,{className:se["sheet-bar-unhide"]},b("tab-color"))))};Po.displayName="SheetBarContextMenu";var Lo=({controller:n})=>{let e=(0,X.useSyncExternalStore)(ct.subscribe,ct.getSnapshot),t=e.filter(d=>!d.isHide),{sheetId:o}=(0,X.useSyncExternalStore)(oe.subscribe,oe.getSnapshot),[r,i]=(0,X.useState)(q),[s,a]=(0,X.useState)(!1),l=d=>{n.renameSheet(d),a(!1)},c=d=>{d.preventDefault();let p=(d.clientX||0)-30;return i(p),!1},h=d=>{if(d.stopPropagation(),d.key==="Enter"){let p=d.currentTarget.value;if(!p)return;l(p)}};return X.default.createElement("div",{className:se["sheet-bar-wrapper"]},X.default.createElement("div",{className:se["sheet-bar-list"],"data-testid":"sheet-bar-list"},t.map(d=>{let p=o===d.sheetId,f=p&&s,y=d.tabColor||"",u=K(se["sheet-bar-item"],{[se.active]:p}),m;return!p&&!s&&y&&(m={backgroundColor:y}),X.default.createElement("div",{key:d.sheetId,className:u,style:m,onContextMenu:c,onClick:()=>{a(!1),n.setCurrentSheetId(d.sheetId)}},f?X.default.createElement("input",{className:se["sheet-bar-input"],defaultValue:d.name,onKeyDown:h,type:"text",spellCheck:!0}):X.default.createElement(X.default.Fragment,null,p&&y&&X.default.createElement("span",{className:se["sheet-bar-item-color"],style:{backgroundColor:y}}),X.default.createElement("span",{className:se["sheet-bar-item-text"]},d.name)))})),X.default.createElement("div",{className:se["sheet-bar-add"]},X.default.createElement(I,{onClick:()=>n.addSheet(),type:"circle",className:se["add-button"]},X.default.createElement(ve,{name:"plus"}))),r>=0&&X.default.createElement(Po,{controller:n,position:r,sheetList:e,currentSheetId:o,hideMenu:()=>i(q),editSheetName:()=>a(!0)}))};Lo.displayName="SheetBarContainer";var Vn={"app-container":"Wr"};var _e=z(j());var re=z(j());function Wr(n){return new Promise((e,t)=>{let o=new Image;o.onload=()=>{let r=o.width,i=o.height;e({width:r,height:i})},o.onerror=r=>{t(r)},o.src=n})}var No="xl",Ur="xl/styles.xml",jr="xl/workbook.xml",Vr="xl/_rels/workbook.xml.rels",Xr="xl/theme/theme1.xml",Kr="xl/sharedStrings.xml",Je="#text",Xn="xl/drawings/",Kn="../drawings/",Gr={"image/apng":[".apng"],"image/bmp":[".bmp"],"image/x-icon":[".ico",".cur"],"image/png":[".png"],"image/webp":[".webp"],"image/svg+xml":[".svg"],"image/avif":[".avif"],"image/gif":[".gif"],"image/jpeg":[".jpeg",".jpg",".jfif",".pjpeg",".pjp"]},Qr=["bar","line","pie"],Ho=8;function Bo(n){let e={};if(n.nodeType===Node.ELEMENT_NODE){if(n.attributes.length>0)for(let t of n.attributes)e[t.nodeName]=t.nodeValue}else n.nodeType===Node.TEXT_NODE&&(e=n.nodeValue);if(n.childNodes.length>0)for(let t of n.childNodes){let o=t.nodeName;typeof t.nodeValue=="string"&&!t.nodeValue.trim()||(typeof e[o]>"u"?e[o]=Bo(t):(typeof e[o].push>"u"&&(e[o]=[e[o]]),e[o].push(Bo(t))))}return e}function Zr(n){let t=new DOMParser().parseFromString(n,"text/xml");return Bo(t)}function Mo(n){if(!n)return"";let e="#";return n.length===6?e+n:n.length===8&&n.startsWith("FF")?e+n.slice(2):""}function Do(n,e){if(!e)return"";if(e.theme){let t=["a:lt1","a:dk1","a:lt2","a:dk2","a:accent1","a:accent2","a:accent3","a:accent4","a:accent5","a:accent6"],o=parseInt(e.theme,10);if(o>=0&&o<=1)return Mo(n[t[o]]["a:sysClr"].lastClr);if(o>1&&o<t.length)return Mo(n[t[o]]["a:srgbClr"].val)}return Mo(e.rgb)}function Yr(n,e,t){let o={},r=H(n,"styleSheet.cellXfs.xf",[]);if(!e||r.length===0||!r[e])return o;let i=r[e];if(i.applyAlignment&&i.alignment){if(i.alignment.horizontal){let s={left:0,center:1,right:2};o.horizontalAlign=s[i.alignment.horizontal]}if(i.alignment.vertical){let s={top:0,center:1,bottom:2};o.verticalAlign=s[i.alignment.vertical]}else o.verticalAlign=2;o.isWrapText=!!i.alignment.wrapText}if(i.applyFont&&i.fontId){let s=H(n,"styleSheet.fonts.font",[]),a=parseInt(i.fontId,10);if(!isNaN(a)&&s.length>0&&s[a]){let l=s[a],c=l?.sz?.val?parseInt(l?.sz?.val,10):void 0;o.fontSize=c||void 0,o.isBold=!!l?.b,o.isItalic=!!l?.i,o.isStrike=!!l?.strike,o.underline=l.u?1:0,o.fontFamily=l?.name?.val;let h=Do(t,l.color);h&&(o.fontColor=h)}}if(i.applyNumberFormat&&i.numFmtId){let s=parseInt(i.numFmtId,10);Nt.some(a=>a.id===s)&&(o.numberFormat=s)}if(i.applyFill&&i.fillId){let s=H(n,"styleSheet.fills.fill",[]),a=parseInt(i.fillId,10);if(s.length>0&&!isNaN(a)&&s[a]){let l=s[a].gradientFill,c=s[a].patternFill;if(l&&l.stop[0]){let h=Do(t,l.stop[0].color);h&&(o.fillColor=h)}else if(c){let h=Do(t,c.fgColor);h&&(o.fillColor=h)}}}return o}function Jr(n,e){let t=n[jr],o=H(n[Kr],"sst.si",[]);Array.isArray(o)||(o=[o]);let r=H(n[Xr],"a:theme.a:themeElements.a:clrScheme",{}),i={workbook:{},mergeCells:{},customHeight:{},customWidth:{},definedNames:{},currentSheetId:"",drawings:{},rangeMap:{},worksheets:{}},s=H(n[Vr],"Relationships.Relationship",[]),a={},l={},c=0,h=H(t,"workbook.sheets.sheet",[]);Array.isArray(h)||(h=[h]);let d=0;for(let u of h){if(!u)continue;let m=s.find(k=>k.Id===u["r:id"])?.Target||"",g="worksheets/",w=m.slice(g.length),x=`${No}/${g}_rels/${w}.rels`;if(n[x]){let k=H(n[x],"Relationships.Relationship",[]);Array.isArray(k)||(k=[k]);for(let N of k)l[u.sheetId]||(l[u.sheetId]=[]),l[u.sheetId].push(N.Target),N.Target.startsWith(Kn)&&c++}let v=`${No}/${m}`;a[u.sheetId]=v;let S=ge(H(n[v],"worksheet.sheetViews.sheetView.selection.sqref",""));H(n[v],"worksheet.sheetViews.sheetView.tabSelected","")==="1"&&(i.currentSheetId=u.sheetId);let A={sheetId:u.sheetId,name:u.name,isHide:u.state==="hidden",rowCount:200,colCount:200,sort:d++};i.workbook[A.sheetId]=A,S&&(i.rangeMap[u.sheetId]=S,S.sheetId=u.sheetId)}let p=Object.values(i.workbook);p.sort((u,m)=>u.sort-m.sort),i.currentSheetId=i.currentSheetId||p[0].sheetId;for(let u of p){let m=a[u.sheetId],g=H(n[m],"worksheet.sheetData.row");Array.isArray(g)||(g=[g]);let w=H(n[m],"worksheet.cols.col",[]);w=Array.isArray(w)?w:[w];let x=H(n[m],"worksheet.sheetFormatPr",{defaultColWidth:"",defaultRowHeight:"",outlineLevelRow:""});if(w.length>0){for(let C of w)if(C&&C.customWidth&&C.width&&C.min&&C.max){let k=x.defaultColWidth===C.width?We:parseFloat(C.width)*Ho,N=!!C.hidden;for(let le=parseInt(C.min,10)-1,$=parseInt(C.max,10);le<$;le++)i.customWidth[pe(u.sheetId,le)]={len:k,isHide:N}}}if(g.length===0)continue;let{colCount:v}=u,{rowCount:S}=u;for(let C of g){if(!C)continue;let A=parseInt(C.r,10)-1;if(S=Math.max(S,A+1),S>Dt)continue;if(C.customHeight&&C.ht){let N=x.defaultRowHeight===C.ht;i.customHeight[pe(u.sheetId,A)]={len:N?ze:parseFloat(C.ht),isHide:!!C.hidden}}let k=Array.isArray(C.c)?C.c:[C.c];for(let N of k){if(!N)continue;let le=ge(N.r);if(!le||(v=Math.max(v,le.col+1),v>Mt))continue;let $=N?.v?.[Je]||"",we=parseInt(N.s,10),he={style:Yr(n[Ur],we,r)};if(N.t==="s"){let Y=parseInt($,10);if(!isNaN(Y)){let de=o[Y]?.t?.[Je]||"";de&&($=de)}}$.startsWith("=")?he.formula=$:he.value=$,i.worksheets[u.sheetId]=i.worksheets[u.sheetId]||{},i.worksheets[u.sheetId][W(A,le.col)]=he,v=Math.max(v,le.col+1)}}u.rowCount=Math.max(u.rowCount,S),u.colCount=Math.max(u.colCount,v)}let f=H(t,"workbook.definedNames.definedName",[]);f=Array.isArray(f)?f:[f];let y=u=>Object.values(i.workbook).find(g=>g.name===u)?.sheetId||"";for(let u of f){let m=ge(u[Je],y);m&&m.sheetId&&m.isValid()&&u?.name&&(i.definedNames[u.name.toLowerCase()]=m.toIRange())}for(let u=1;u<=c;u++){let m=`drawing${u}.xml`,g=`${Xn}${m}`,w=`${Xn}_rels/${m}.rels`;if(!n[g]||!n[w])break;let x=H(n[w],"Relationships.Relationship",[]);Array.isArray(x)||(x=[x]);let v="";for(let[C,A]of Object.entries(l))if(A.some(k=>k===Kn+m)){v=C;break}let S=H(n[g],"xdr:wsDr.xdr:twoCellAnchor",[]);Array.isArray(S)||(S=[S]);for(let C of S){let A=H(C,"xdr:graphicFrame.a:graphic.a:graphicData.c:chart.r:id",""),k=H(C,"xdr:pic.xdr:blipFill.a:blip.r:embed",""),N=!!k,le=N?k:A,$=x.find(de=>de.Id===le)?.Target||"";if(!$)continue;let we=No+$.slice(2),tt=C["xdr:from"]["xdr:col"][Je],he=C["xdr:from"]["xdr:row"][Je];if(!tt||!he)continue;let Y=Ae(),U={title:"",type:N?"floating-picture":"chart",uuid:Y,width:300,height:300,originHeight:300,originWidth:300,fromCol:parseInt(he,10),fromRow:parseInt(tt,10),sheetId:v,marginX:0,marginY:0};if(N){if(!n[we])continue;let de=H(C,"xdr:pic.xdr:nvPicPr.xdr:cNvPr.name",""),Oe=H(C,"xdr:pic.xdr:nvPicPr.xdr:cNvPr.title","");U.title=Oe||de,U.imageAngle=0,U.imageSrc=n[we]||"";let ee=e[we];ee&&ee.width>0&&ee.height>0&&(U.width=ee.width,U.height=ee.height,U.originWidth=ee.width,U.originHeight=ee.height)}else{U.title=H(n[we],"c:chartSpace.c:chart.c:title.c:tx.c:rich.a:p.0.a:r.a:t."+Je,"");let de="";for(let ee of Qr){let ut=H(n[we],`c:chartSpace.c:chart.c:plotArea.c:${ee}Chart.c:ser.0.c:val.c:numRef.c:f.${Je}`,"");if(ut){de=ut,U.chartType=ee;break}}if(!de)continue;let Oe=ge(de,ee=>Object.values(i.workbook).find(Tt=>Tt.name===ee)?.sheetId||"");if(!Oe)continue;U.chartRange=Oe}i.drawings[Y]=U}}return i}async function Gn(n){let t=await(await import("./jszip.min-5GWVJJCY.js")).default.loadAsync(n),{files:o}=t,r={},i={};for(let a of Object.keys(o))if(!o[a].dir)if(a.includes(".xml")){let l=await o[a].async("string");l&&(r[a]=Zr(l))}else{let l="";for(let[h,d]of Object.entries(Gr))if(d.some(p=>a.endsWith(p))){l=h;break}if(!l)continue;let c=await o[a].async("base64");c&&(r[a]=`data:${l};base64,${c}`,i[a]=await Wr(r[a]))}return Jr(r,i)}function Qn(){let n=new Date().toLocaleDateString("zh").replaceAll("/","-"),e=new Date().toLocaleTimeString("zh");return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:dcterms="http://purl.org/dc/terms/"
  xmlns:dcmitype="http://purl.org/dc/dcmitype/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>Steve Xu</dc:creator>
  <cp:lastModifiedBy>Steve Xu</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${n}T${e}Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${n}T${e}Z</dcterms:modified>
</cp:coreProperties>`}function Zn(n){return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
    xmlns:xr9="http://schemas.microsoft.com/office/spreadsheetml/2016/revision9">
    <numFmts count="${n.numFmts.length}">
    ${n.numFmts.join(`
`)}
    </numFmts>
    <fonts count="${n.fonts.length}">
    ${n.fonts.join(`
`)}
    </fonts>
    <fills count="${n.fills.length}">
    ${n.fills.join(`
`)}
    </fills>
    <borders count="9">
      <border>
        <left/>
        <right/>
        <top/>
        <bottom/>
        <diagonal/>
      </border>
      <border>
        <left style="thin">
          <color rgb="FFB2B2B2"/>
        </left>
        <right style="thin">
          <color rgb="FFB2B2B2"/>
        </right>
        <top style="thin">
          <color rgb="FFB2B2B2"/>
        </top>
        <bottom style="thin">
          <color rgb="FFB2B2B2"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left/>
        <right/>
        <top/>
        <bottom style="medium">
          <color theme="4"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left/>
        <right/>
        <top/>
        <bottom style="medium">
          <color theme="4" tint="0.499984740745262"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left style="thin">
          <color rgb="FF7F7F7F"/>
        </left>
        <right style="thin">
          <color rgb="FF7F7F7F"/>
        </right>
        <top style="thin">
          <color rgb="FF7F7F7F"/>
        </top>
        <bottom style="thin">
          <color rgb="FF7F7F7F"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left style="thin">
          <color rgb="FF3F3F3F"/>
        </left>
        <right style="thin">
          <color rgb="FF3F3F3F"/>
        </right>
        <top style="thin">
          <color rgb="FF3F3F3F"/>
        </top>
        <bottom style="thin">
          <color rgb="FF3F3F3F"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left style="double">
          <color rgb="FF3F3F3F"/>
        </left>
        <right style="double">
          <color rgb="FF3F3F3F"/>
        </right>
        <top style="double">
          <color rgb="FF3F3F3F"/>
        </top>
        <bottom style="double">
          <color rgb="FF3F3F3F"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left/>
        <right/>
        <top/>
        <bottom style="double">
          <color rgb="FFFF8001"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left/>
        <right/>
        <top style="thin">
          <color theme="4"/>
        </top>
        <bottom style="double">
          <color theme="4"/>
        </bottom>
        <diagonal/>
      </border>
    </borders>
    <cellStyleXfs count="49">
      <xf numFmtId="0" fontId="0" fillId="0" borderId="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="43" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="44" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="9" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="41" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="42" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyNumberFormat="0" applyFont="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="5" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="6" fillId="0" borderId="2" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="7" fillId="0" borderId="2" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="8" fillId="0" borderId="3" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="8" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="9" fillId="3" borderId="4" applyNumberFormat="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="10" fillId="4" borderId="5" applyNumberFormat="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="11" fillId="4" borderId="4" applyNumberFormat="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="12" fillId="5" borderId="6" applyNumberFormat="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="13" fillId="0" borderId="7" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="14" fillId="0" borderId="8" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="15" fillId="6" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="16" fillId="7" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="17" fillId="8" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="9" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="10" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="11" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="12" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="13" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="14" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="15" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="16" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="17" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="18" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="19" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="20" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="21" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="22" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="23" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="24" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="25" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="26" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="27" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="28" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="29" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="30" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="31" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="32" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
    </cellStyleXfs>
    <cellXfs count="${n.cellXfs.length}">
    ${n.cellXfs.join(`
`)}
    </cellXfs>
    <cellStyles count="49">
      <cellStyle name="Normal" xfId="0" builtinId="0"/>
      <cellStyle name="Comma" xfId="1" builtinId="3"/>
      <cellStyle name="Currency" xfId="2" builtinId="4"/>
      <cellStyle name="Percent" xfId="3" builtinId="5"/>
      <cellStyle name="Comma [0]" xfId="4" builtinId="6"/>
      <cellStyle name="Currency [0]" xfId="5" builtinId="7"/>
      <cellStyle name="Hyperlink" xfId="6" builtinId="8"/>
      <cellStyle name="Followed Hyperlink" xfId="7" builtinId="9"/>
      <cellStyle name="Note" xfId="8" builtinId="10"/>
      <cellStyle name="Warning Text" xfId="9" builtinId="11"/>
      <cellStyle name="Title" xfId="10" builtinId="15"/>
      <cellStyle name="CExplanatory Text" xfId="11" builtinId="53"/>
      <cellStyle name="Heading 1" xfId="12" builtinId="16"/>
      <cellStyle name="Heading 2" xfId="13" builtinId="17"/>
      <cellStyle name="Heading 3" xfId="14" builtinId="18"/>
      <cellStyle name="Heading 4" xfId="15" builtinId="19"/>
      <cellStyle name="Input" xfId="16" builtinId="20"/>
      <cellStyle name="Output" xfId="17" builtinId="21"/>
      <cellStyle name="Calculation" xfId="18" builtinId="22"/>
      <cellStyle name="Check Cell" xfId="19" builtinId="23"/>
      <cellStyle name="Linked Cell" xfId="20" builtinId="24"/>
      <cellStyle name="Total" xfId="21" builtinId="25"/>
      <cellStyle name="Good" xfId="22" builtinId="26"/>
      <cellStyle name="Bad" xfId="23" builtinId="27"/>
      <cellStyle name="Neutral" xfId="24" builtinId="28"/>
      <cellStyle name="Accent1" xfId="25" builtinId="29"/>
      <cellStyle name="20% - Accent1" xfId="26" builtinId="30"/>
      <cellStyle name="40% - Accent1" xfId="27" builtinId="31"/>
      <cellStyle name="60% - Accent1" xfId="28" builtinId="32"/>
      <cellStyle name="Accent2" xfId="29" builtinId="33"/>
      <cellStyle name="20% - Accent2" xfId="30" builtinId="34"/>
      <cellStyle name="40% - Accent2" xfId="31" builtinId="35"/>
      <cellStyle name="60% - Accent2" xfId="32" builtinId="36"/>
      <cellStyle name="Accent3" xfId="33" builtinId="37"/>
      <cellStyle name="20% - Accent3" xfId="34" builtinId="38"/>
      <cellStyle name="40% - Accent3" xfId="35" builtinId="39"/>
      <cellStyle name="60% - Accent3" xfId="36" builtinId="40"/>
      <cellStyle name="Accent4" xfId="37" builtinId="41"/>
      <cellStyle name="20% - Accent4" xfId="38" builtinId="42"/>
      <cellStyle name="40% - Accent4" xfId="39" builtinId="43"/>
      <cellStyle name="60% - Accent4" xfId="40" builtinId="44"/>
      <cellStyle name="Accent5" xfId="41" builtinId="45"/>
      <cellStyle name="20% - Accent5" xfId="42" builtinId="46"/>
      <cellStyle name="40% - Accent5" xfId="43" builtinId="47"/>
      <cellStyle name="60% - Accent5" xfId="44" builtinId="48"/>
      <cellStyle name="Accent6" xfId="45" builtinId="49"/>
      <cellStyle name="20% - Accent6" xfId="46" builtinId="50"/>
      <cellStyle name="40% - Accent6" xfId="47" builtinId="51"/>
      <cellStyle name="60% - Accent6" xfId="48" builtinId="52"/>
    </cellStyles>
    <dxfs count="17">
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
        <border>
          <top style="double">
            <color theme="4"/>
          </top>
        </border>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="0"/>
        </font>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4"/>
            <bgColor theme="4"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <font>
          <color theme="1"/>
        </font>
        <border>
          <left style="thin">
            <color theme="4"/>
          </left>
          <right style="thin">
            <color theme="4"/>
          </right>
          <top style="thin">
            <color theme="4"/>
          </top>
          <bottom style="thin">
            <color theme="4"/>
          </bottom>
          <horizontal style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </horizontal>
        </border>
      </dxf>
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
        <border>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
        </font>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
        <border>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <font>
          <color theme="1"/>
        </font>
      </dxf>
      <dxf>
        <font>
          <color theme="1"/>
        </font>
        <border>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
        <border>
          <top style="thin">
            <color theme="4"/>
          </top>
          <bottom style="thin">
            <color theme="4"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
        <border>
          <top style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </top>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
        <border>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
    </dxfs>
    <tableStyles count="2" defaultTableStyle="TableStylePreset3_Accent1" defaultPivotStyle="PivotStylePreset2_Accent1">
      <tableStyle name="TableStylePreset3_Accent1" pivot="0" count="7" xr9:uid="{59DB682C-5494-4EDE-A608-00C9E5F0F923}">
        <tableStyleElement type="wholeTable" dxfId="6"/>
        <tableStyleElement type="headerRow" dxfId="5"/>
        <tableStyleElement type="totalRow" dxfId="4"/>
        <tableStyleElement type="firstColumn" dxfId="3"/>
        <tableStyleElement type="lastColumn" dxfId="2"/>
        <tableStyleElement type="firstRowStripe" dxfId="1"/>
        <tableStyleElement type="firstColumnStripe" dxfId="0"/>
      </tableStyle>
      <tableStyle name="PivotStylePreset2_Accent1" table="0" count="10" xr9:uid="{267968C8-6FFD-4C36-ACC1-9EA1FD1885CA}">
        <tableStyleElement type="headerRow" dxfId="16"/>
        <tableStyleElement type="totalRow" dxfId="15"/>
        <tableStyleElement type="firstRowStripe" dxfId="14"/>
        <tableStyleElement type="firstColumnStripe" dxfId="13"/>
        <tableStyleElement type="firstSubtotalRow" dxfId="12"/>
        <tableStyleElement type="secondSubtotalRow" dxfId="11"/>
        <tableStyleElement type="firstRowSubheading" dxfId="10"/>
        <tableStyleElement type="secondRowSubheading" dxfId="9"/>
        <tableStyleElement type="pageFieldLabels" dxfId="8"/>
        <tableStyleElement type="pageFieldValues" dxfId="7"/>
      </tableStyle>
    </tableStyles>
    <extLst>
      <ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}"
        xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main">
        <x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/>
      </ext>
    </extLst>
  </styleSheet>`}var Yn=n=>`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
            <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
            <Default Extension="xml" ContentType="application/xml"/>
            <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
            <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
            <Override PartName="/docProps/custom.xml" ContentType="application/vnd.openxmlformats-officedocument.custom-properties+xml"/>
            <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
            <Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
            <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
            ${n}
          </Types>`,Jn=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
<Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties" Target="docProps/custom.xml"/>
</Relationships>`,qn=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="WPS">
  <a:themeElements>
    <a:clrScheme name="WPS">
      <a:dk1>
        <a:sysClr val="windowText" lastClr="000000"/>
      </a:dk1>
      <a:lt1>
        <a:sysClr val="window" lastClr="FFFFFF"/>
      </a:lt1>
      <a:dk2>
        <a:srgbClr val="44546A"/>
      </a:dk2>
      <a:lt2>
        <a:srgbClr val="E7E6E6"/>
      </a:lt2>
      <a:accent1>
        <a:srgbClr val="4874CB"/>
      </a:accent1>
      <a:accent2>
        <a:srgbClr val="EE822F"/>
      </a:accent2>
      <a:accent3>
        <a:srgbClr val="F2BA02"/>
      </a:accent3>
      <a:accent4>
        <a:srgbClr val="75BD42"/>
      </a:accent4>
      <a:accent5>
        <a:srgbClr val="30C0B4"/>
      </a:accent5>
      <a:accent6>
        <a:srgbClr val="E54C5E"/>
      </a:accent6>
      <a:hlink>
        <a:srgbClr val="0026E5"/>
      </a:hlink>
      <a:folHlink>
        <a:srgbClr val="7E1FAD"/>
      </a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="WPS">
      <a:majorFont>
        <a:latin typeface="Calibri Light"/>
        <a:ea typeface=""/>
        <a:cs typeface=""/>
        <a:font script="Jpan" typeface="\uFF2D\uFF33 \uFF30\u30B4\u30B7\u30C3\u30AF"/>
        <a:font script="Hang" typeface="\uB9D1\uC740 \uACE0\uB515"/>
        <a:font script="Hans" typeface="\u5B8B\u4F53"/>
        <a:font script="Hant" typeface="\u65B0\u7D30\u660E\u9AD4"/>
        <a:font script="Arab" typeface="Times New Roman"/>
        <a:font script="Hebr" typeface="Times New Roman"/>
        <a:font script="Thai" typeface="Tahoma"/>
        <a:font script="Ethi" typeface="Nyala"/>
        <a:font script="Beng" typeface="Vrinda"/>
        <a:font script="Gujr" typeface="Shruti"/>
        <a:font script="Khmr" typeface="MoolBoran"/>
        <a:font script="Knda" typeface="Tunga"/>
        <a:font script="Guru" typeface="Raavi"/>
        <a:font script="Cans" typeface="Euphemia"/>
        <a:font script="Cher" typeface="Plantagenet Cherokee"/>
        <a:font script="Yiii" typeface="Microsoft Yi Baiti"/>
        <a:font script="Tibt" typeface="Microsoft Himalaya"/>
        <a:font script="Thaa" typeface="MV Boli"/>
        <a:font script="Deva" typeface="Mangal"/>
        <a:font script="Telu" typeface="Gautami"/>
        <a:font script="Taml" typeface="Latha"/>
        <a:font script="Syrc" typeface="Estrangelo Edessa"/>
        <a:font script="Orya" typeface="Kalinga"/>
        <a:font script="Mlym" typeface="Kartika"/>
        <a:font script="Laoo" typeface="DokChampa"/>
        <a:font script="Sinh" typeface="Iskoola Pota"/>
        <a:font script="Mong" typeface="Mongolian Baiti"/>
        <a:font script="Viet" typeface="Times New Roman"/>
        <a:font script="Uigh" typeface="Microsoft Uighur"/>
        <a:font script="Geor" typeface="Sylfaen"/>
      </a:majorFont>
      <a:minorFont>
        <a:latin typeface="Calibri"/>
        <a:ea typeface=""/>
        <a:cs typeface=""/>
        <a:font script="Jpan" typeface="\uFF2D\uFF33 \uFF30\u30B4\u30B7\u30C3\u30AF"/>
        <a:font script="Hang" typeface="\uB9D1\uC740 \uACE0\uB515"/>
        <a:font script="Hans" typeface="\u5B8B\u4F53"/>
        <a:font script="Hant" typeface="\u65B0\u7D30\u660E\u9AD4"/>
        <a:font script="Arab" typeface="Arial"/>
        <a:font script="Hebr" typeface="Arial"/>
        <a:font script="Thai" typeface="Tahoma"/>
        <a:font script="Ethi" typeface="Nyala"/>
        <a:font script="Beng" typeface="Vrinda"/>
        <a:font script="Gujr" typeface="Shruti"/>
        <a:font script="Khmr" typeface="DaunPenh"/>
        <a:font script="Knda" typeface="Tunga"/>
        <a:font script="Guru" typeface="Raavi"/>
        <a:font script="Cans" typeface="Euphemia"/>
        <a:font script="Cher" typeface="Plantagenet Cherokee"/>
        <a:font script="Yiii" typeface="Microsoft Yi Baiti"/>
        <a:font script="Tibt" typeface="Microsoft Himalaya"/>
        <a:font script="Thaa" typeface="MV Boli"/>
        <a:font script="Deva" typeface="Mangal"/>
        <a:font script="Telu" typeface="Gautami"/>
        <a:font script="Taml" typeface="Latha"/>
        <a:font script="Syrc" typeface="Estrangelo Edessa"/>
        <a:font script="Orya" typeface="Kalinga"/>
        <a:font script="Mlym" typeface="Kartika"/>
        <a:font script="Laoo" typeface="DokChampa"/>
        <a:font script="Sinh" typeface="Iskoola Pota"/>
        <a:font script="Mong" typeface="Mongolian Baiti"/>
        <a:font script="Viet" typeface="Arial"/>
        <a:font script="Uigh" typeface="Microsoft Uighur"/>
        <a:font script="Geor" typeface="Sylfaen"/>
      </a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name="WPS">
      <a:fillStyleLst>
        <a:solidFill>
          <a:schemeClr val="phClr"/>
        </a:solidFill>
        <a:gradFill>
          <a:gsLst>
            <a:gs pos="0">
              <a:schemeClr val="phClr">
                <a:lumOff val="17500"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="100000">
              <a:schemeClr val="phClr"/>
            </a:gs>
          </a:gsLst>
          <a:lin ang="2700000" scaled="0"/>
        </a:gradFill>
        <a:gradFill>
          <a:gsLst>
            <a:gs pos="0">
              <a:schemeClr val="phClr">
                <a:hueOff val="-2520000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="100000">
              <a:schemeClr val="phClr"/>
            </a:gs>
          </a:gsLst>
          <a:lin ang="2700000" scaled="0"/>
        </a:gradFill>
      </a:fillStyleLst>
      <a:lnStyleLst>
        <a:ln w="12700" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="phClr"/>
          </a:solidFill>
          <a:prstDash val="solid"/>
          <a:miter lim="800000"/>
        </a:ln>
        <a:ln w="12700" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="phClr"/>
          </a:solidFill>
          <a:prstDash val="solid"/>
          <a:miter lim="800000"/>
        </a:ln>
        <a:ln w="12700" cap="flat" cmpd="sng" algn="ctr">
          <a:gradFill>
            <a:gsLst>
              <a:gs pos="0">
                <a:schemeClr val="phClr">
                  <a:hueOff val="-4200000"/>
                </a:schemeClr>
              </a:gs>
              <a:gs pos="100000">
                <a:schemeClr val="phClr"/>
              </a:gs>
            </a:gsLst>
            <a:lin ang="2700000" scaled="1"/>
          </a:gradFill>
          <a:prstDash val="solid"/>
          <a:miter lim="800000"/>
        </a:ln>
      </a:lnStyleLst>
      <a:effectStyleLst>
        <a:effectStyle>
          <a:effectLst>
            <a:outerShdw blurRad="101600" dist="50800" dir="5400000" algn="ctr" rotWithShape="0">
              <a:schemeClr val="phClr">
                <a:alpha val="60000"/>
              </a:schemeClr>
            </a:outerShdw>
          </a:effectLst>
        </a:effectStyle>
        <a:effectStyle>
          <a:effectLst>
            <a:reflection stA="50000" endA="300" endPos="40000" dist="25400" dir="5400000" sy="-100000" algn="bl" rotWithShape="0"/>
          </a:effectLst>
        </a:effectStyle>
        <a:effectStyle>
          <a:effectLst>
            <a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0">
              <a:srgbClr val="000000">
                <a:alpha val="63000"/>
              </a:srgbClr>
            </a:outerShdw>
          </a:effectLst>
        </a:effectStyle>
      </a:effectStyleLst>
      <a:bgFillStyleLst>
        <a:solidFill>
          <a:schemeClr val="phClr"/>
        </a:solidFill>
        <a:solidFill>
          <a:schemeClr val="phClr">
            <a:tint val="95000"/>
            <a:satMod val="170000"/>
          </a:schemeClr>
        </a:solidFill>
        <a:gradFill rotWithShape="1">
          <a:gsLst>
            <a:gs pos="0">
              <a:schemeClr val="phClr">
                <a:tint val="93000"/>
                <a:satMod val="150000"/>
                <a:shade val="98000"/>
                <a:lumMod val="102000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="50000">
              <a:schemeClr val="phClr">
                <a:tint val="98000"/>
                <a:satMod val="130000"/>
                <a:shade val="90000"/>
                <a:lumMod val="103000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="100000">
              <a:schemeClr val="phClr">
                <a:shade val="63000"/>
                <a:satMod val="120000"/>
              </a:schemeClr>
            </a:gs>
          </a:gsLst>
          <a:lin ang="5400000" scaled="0"/>
        </a:gradFill>
      </a:bgFillStyleLst>
    </a:fmtScheme>
  </a:themeElements>
  <a:objectDefaults/>
</a:theme>`,_n=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties"
xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
<property fmtid="{D5CDD505-2E9C-101B-9397-08002B2CF9AE}" pid="2" name="ICV">
  <vt:lpwstr>A43D6FDBA27248266CF32D6511460B89_41</vt:lpwstr>
</property>
<property fmtid="{D5CDD505-2E9C-101B-9397-08002B2CF9AE}" pid="3" name="KSOProductBuildVer">
  <vt:lpwstr>1033-6.2.1.8344</vt:lpwstr>
</property>
</Properties>`;function $n(n,e,t,o,r){let i="";if(o){let c=[];for(let[h,d]of Object.entries(o)){if(!h.startsWith(r)||!d)continue;let p=parseInt(h.slice(r.length+1),10)+1;c.push(`<col min="${p}" max="${p}" width="${d.len/Ho}" customWidth="1" ${d.isHide?'hidden="1"':""}/>`)}i=`<cols>${c.join("")}</cols>`}let s={...n,sheetId:""},a=e?`<sheetData>${e}</sheetData>`:"<sheetData/>";return`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
      xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
      xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"
      xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"
      xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
      xmlns:etc="http://www.wps.cn/officeDocument/2017/etCustomData">
      <sheetPr/>
      <dimension ref="A1:B1"/>
      <sheetViews>
        <sheetView ${t?'tabSelected="1"':""} workbookViewId="0">
          <selection activeCell="${ke({row:n.row,col:n.col,rowCount:1,colCount:1,sheetId:""})}" sqref="${ke(s)}"/>
        </sheetView>
      </sheetViews>
      <sheetFormatPr defaultColWidth="9" defaultRowHeight="16.8" outlineLevelCol="1"/>
      ${i}
      ${a}
      <pageMargins left="0.75" right="0.75" top="1" bottom="1" header="0.5" footer="0.5"/>
      <headerFooter/>
    </worksheet>`}function er(n){return`FF${En(n).slice(1,-2)}`}function qr(n,e){if(!e||Ce(e))return;let t=[],o={fontId:"0",fillId:"0",numFmtId:"0",applyAlignment:"",applyFill:"",applyFont:"",applyNumberFormat:""};e.fillColor&&(o.fillId=String(n.fills.length),t.push('applyFill="1"'),n.fills.push(`<fill>
    <patternFill patternType="solid">
      <fgColor rgb="${er(e.fillColor)}"/>
      <bgColor indexed="64"/>
    </patternFill>
  </fill>`));let r=[];(e.underline===1||e.underline===2)&&r.push("<u/>"),e.isBold&&r.push("<b/>"),e.isItalic&&r.push("<i/>"),e.isStrike&&r.push("<strike/>"),typeof e.fontSize<"u"&&r.push(`<sz val="${e.fontSize}"/>`),e.fontColor&&r.push(`<color rgb="${er(e.fontColor)}"/>`),e.fontFamily&&r.push(`<name val="${e.fontFamily}"/>`),r.length>0&&(o.fontId=String(n.fonts.length),t.push('applyFont="1"'),n.fonts.push(`<font>${r.join("")}<charset val="0"/><scheme val="minor"/></font>`));let i=Nt.find(l=>l.id===e.numberFormat);i&&(t.push('applyNumberFormat="1"'),o.numFmtId=String(e.numberFormat),n.numFmts.push(`<numFmt numFmtId="${e.numberFormat}" formatCode="${i.formatCode}"/>`));let s='<alignment vertical="center"/>';if(e.isWrapText||e.horizontalAlign!==void 0||e.verticalAlign!==void 0){let l=[];if(t.push('applyAlignment="1"'),e.isWrapText&&l.push('wrapText="1"'),e.horizontalAlign!==void 0){let c={0:"left",1:"center",2:"right"};l.push(`horizontal="${c[e.horizontalAlign]}"`)}if(e.verticalAlign!==void 0){let c={0:"top",1:"center",2:"bottom"};e.verticalAlign!==2&&l.push(`vertical="${c[e.verticalAlign]}"`)}s=`<alignment ${l.join(" ")}/>`}let a=`<xf numFmtId="${o.numFmtId}" fontId="${o.fontId}" fillId="${o.fillId}" borderId="0" xfId="0" ${t.join(" ")}>${s}</xf>`;n.cellXfs.push(a)}async function tr(n,e){let t=(await import("./jszip.min-5GWVJJCY.js")).default,o=e.toJSON(),r=e.getCurrentSheetId(),i=Object.values(o.workbook),s={};for(let C=0;C<i.length;C++){let A=i[C],k=C+1;s[A.sheetId]={rid:`rId${k}`,target:`sheet${k}.xml`}}let a=new t,l=i.map(C=>`<Override PartName="/xl/worksheets/${s[C.sheetId].target}" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("");a.file("[Content_Types].xml",Yn(l)),a.folder("_rels").file(".rels",Jn);let h=a.folder("docProps");h.file("app.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
  xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>WPS Spreadsheets</Application>
  <HeadingPairs>
    <vt:vector size="2" baseType="variant">
      <vt:variant>
        <vt:lpstr>\u5DE5\u4F5C\u8868</vt:lpstr>
      </vt:variant>
      <vt:variant>
        <vt:i4>1</vt:i4>
      </vt:variant>
    </vt:vector>
  </HeadingPairs>
  <TitlesOfParts>
    <vt:vector size="${i.length}" baseType="lpstr">
      ${i.map(C=>`<vt:lpstr>${s[C.sheetId].target}</vt:lpstr>`).join("")}
    </vt:vector>
  </TitlesOfParts>
</Properties>`),h.file("core.xml",Qn()),h.file("custom.xml",_n);let d=a.folder("xl"),p={cellXfs:[`<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0">
    <alignment vertical="center"/>
  </xf>`],numFmts:[],fonts:[`<font>
    <sz val="11"/>
    <color theme="1"/>
    <name val="Calibri"/>
    <charset val="134"/>
    <scheme val="minor"/>
  </font>`],fills:[`<fill>
    <patternFill patternType="none"/>
  </fill>`]},f=i.findIndex(C=>C.sheetId===r),y=C=>{let A=C||r;return i.find(k=>k.sheetId===A)?.name||""},u=[];for(let C of Object.keys(o.definedNames)){let A=o.definedNames[C],k=ke(A,"absolute",y);u.push(`<definedName name="${C}">${k}</definedName>`)}let m=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
    xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
    <fileVersion appName="xl" lastEdited="3" lowestEdited="5" rupBuild="9302"/>
    <workbookPr/>
    <bookViews>
      <workbookView windowWidth="28800" windowHeight="11340" ${f>0?`activeTab="${f}"`:""} />
    </bookViews>
    <sheets>
      ${i.map(C=>`<sheet name="${C.name}" sheetId="${C.sheetId}" r:id="${s[C.sheetId].rid}" ${C.isHide?'state="hidden"':""}/>`).join("")}
    </sheets>
    ${u.length>0?`<definedNames>${u.join("")}</definedNames>`:""}
    <calcPr calcId="144525"/>
  </workbook>`;d.file("workbook.xml",m);let g=d.folder("_rels"),w=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId${i.length+2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
    <Relationship Id="rId${i.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
    ${i.map(C=>{let A=s[C.sheetId];return`<Relationship Id="${A.rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/${A.target}"/>`}).reverse().join("")}
  </Relationships>`;g.file("workbook.xml.rels",w),d.folder("theme").file("theme1.xml",qn);let v=d.folder("worksheets");for(let C of i){let A=o.rangeMap[C.sheetId],k=s[C.sheetId],N=o.worksheets[C.sheetId],le=C.sheetId===r;if(!N){v.file(k.target,$n(A,"",le,o.customWidth,C.sheetId));continue}let $=new Map,we=[];for(let[he,Y]of Object.entries(N)){let U=je(he),de=ke({...U,rowCount:1,colCount:1,sheetId:""}),Oe=$.get(U.row)||[],ee=Y.formula?`<f>${Y.formula.slice(1)}</f>`:"",ut=ee?"":`<v>${Bt(Y.value)}</v>`,Tt="";Y.style&&!Ce(Y.style)&&(Tt=`s="${p.cellXfs.length}"`,qr(p,Y.style)),Oe.push(`<c r="${de}" ${Tt}>${ee}${ut}</c>`),$.set(U.row,Oe)}let tt=Array.from($.keys());tt.sort();for(let he of tt){let Y=o.customHeight[pe(C.sheetId,he)],U="";Y&&(U=`ht="${Y.len}" customHeight="1" ${Y.isHide?'hidden="1"':""}`),we.push(`<row r="${he+1}" ${U}>${$.get(he).join("")}</row>`)}v.file(k.target,$n(A,we.join(""),le,o.customWidth,C.sheetId))}d.file("styles.xml",Zn(p));let S=await a.generateAsync({type:"blob"});Xe(S,n)}var Jt=",",or=`
`;function _r(n){let e=typeof n;return e==="string"?n:e==="bigint"||e==="number"?""+n:e==="boolean"?n?"TRUE":"FALSE":n instanceof Date?""+n.getTime():e==="object"&&n!==null?JSON.stringify(n):""}function $r(n){let e='"',r='"',s="";for(let a=0;a<n.length;a++){let l=n[a],c=_r(l);if(c==="")s+=c;else if(c){let h=Jt.length&&c.indexOf(Jt)>=0,d=c.indexOf(e)>=0,p=c.indexOf(r)>=0&&r!==e,f=c.indexOf(or)>=0,y=!1;if(0)switch(c[0]){case"=":case"+":case"-":case"@":case"	":case"\r":case"\uFF1D":case"\uFF0B":case"\uFF0D":case"\uFF20":}let u=d===!0||h||f||!1||y;if(u===!0&&p===!0){let m=new RegExp(r,"g");c=c.replace(m,r+r)}if(d===!0){let m=new RegExp(e,"g");c=c.replace(m,r+e)}u===!0&&(c=e+c+e),s+=c}a!==n.length-1&&(s+=Jt)}return s}function nr(n,e){let t=e.toJSON().worksheets[e.getCurrentSheetId()],o=[],r=e.getSheetInfo(e.getCurrentSheetId());if(t)for(let a=0;a<r.rowCount;a++){let l=[];for(let c=0;c<r.colCount;c++){let h=W(a,c);l.push(t[h]?.value)}o.push($r(l))}let i=Array.from({length:r.colCount}).fill("").join(Jt);for(;o.length>0&&o[o.length-1]===i;)o.pop();let s=new Blob([o.join(or)],{type:"text/csv;charset=utf-8;"});Xe(s,n)}var qe={"menubar-container":"Xr","menubar-menu":"_r","theme-button":"ro",i18n:"oo"};var be=z(j());function Oo(n){let e=Object.keys(n);for(let t of e){let o=`--${t}`,r=String(n[t]||"");document.documentElement.style.setProperty(o,r)}}function rr(n){Oo(n==="dark"?An:In),document.documentElement.setAttribute("data-theme",n)}var ir=(0,be.memo)(({toggleTheme:n})=>{let[e,t]=(0,be.useState)("light");(0,be.useEffect)(()=>{Oo(Ve)},[]),(0,be.useEffect)(()=>{let r=i=>{t(i),mo(i),rr(i),n()};r(kn()),window.matchMedia&&typeof window.matchMedia=="function"&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",i=>{let{matches:s}=i;r(s?"dark":"light")})},[n]);let o=r=>{let i=r==="dark"?"light":"dark";rr(i),mo(i),t(i),n()};return be.default.createElement("div",null,be.default.createElement(I,{onClick:()=>o(e),className:qe["theme-button"]},be.default.createElement(ve,{name:e==="dark"?"sun":"moon"})))});var zo=z(j());var ti=sn.map(n=>({value:n,label:n,disabled:!1})),oi=en(),sr=()=>{let n=e=>{let t=String(e);tn(t),window.location.reload()};return zo.default.createElement("div",{className:qe.i18n},zo.default.createElement(xe,{data:ti,defaultValue:oi,onChange:n}))};var lr={width:150,flex:1},ar=({controller:n})=>{let e=(0,re.useRef)(null),t=()=>{tr(`excel_${Date.now()}.xlsx`,n)},o=()=>{nr(`excel_${Date.now()}.csv`,n)},r=async i=>{i.stopPropagation();let s=i.target.files?.[0];if(!s)return;let a=await Gn(s);n.fromJSON(a),e.current.value="",e.current.blur()};return re.default.createElement("div",{className:qe["menubar-container"],"data-testid":"menubar"},re.default.createElement("div",{className:qe["menubar-menu"]},re.default.createElement(nn,{menuButton:re.default.createElement(I,null,b("menu")),style:lr,testId:"menubar-excel"},re.default.createElement(Pt,{testId:"menubar-import-xlsx"},re.default.createElement("input",{type:"file",hidden:!0,onChange:r,accept:".xlsx",ref:e,id:"import_xlsx"}),re.default.createElement("label",{htmlFor:"import_xlsx"},b("import-xlsx"))),re.default.createElement(on,{label:"Export",style:lr,testId:"menubar-export"},re.default.createElement(Pt,{onClick:t,testId:"menubar-export-xlsx"},b("export-xlsx")),re.default.createElement(Pt,{testId:"menubar-export-csv",onClick:o},b("export-csv"))))),re.default.createElement(sr,null),re.default.createElement(ir,{toggleTheme:()=>n.setChangeSet(new Set(["cellStyle"]))}))};var Wo=({controller:n})=>_e.default.createElement("div",{className:Vn["app-container"],"data-testid":"app-container"},_e.default.createElement(ar,{controller:n}),_e.default.createElement(Ro,{controller:n}),_e.default.createElement(Fo,{controller:n}),_e.default.createElement(ko,{controller:n}),_e.default.createElement(Lo,{controller:n}));Wo.displayName="App";var yr=z(br()),Et=z(j());var Uo=24,jo=34,ni={top:0,left:0,row:0,col:0,scrollLeft:0,scrollTop:0},It=class{constructor(e){this.scrollValue={};this.changeSet=new Set;this.copyRanges=[];this.isCut=!1;this.floatElementUuid="";this.hooks={modelChange(){},async copyOrCut(){return""},async paste(){return{[at]:"",[lt]:""}}};this.viewSize={width:0,height:0};this.headerSize={width:jo,height:Uo};this.mainDom={};this.addSheet=()=>{this.changeSet.add("sheetList"),this.changeSet.add("range"),this.model.addSheet(),this.setScroll({top:0,left:0,row:0,col:0,scrollLeft:0,scrollTop:0})};this.deleteSheet=e=>{this.model.deleteSheet(e),this.changeSet.add("sheetList"),this.changeSet.add("sheetId"),this.changeSet.add("range"),this.emitChange()};this.getCell=e=>this.model.getCell(e);this.model=e}getCurrentSheetId(){return this.model.getCurrentSheetId()}getSheetList(){return this.model.getSheetList()}getSheetInfo(e){return this.model.getSheetInfo(e)}setHooks(e){this.hooks=e}emitChange(){if(this.changeSet.size===0)return;this.computeViewSize();let e=this.changeSet;this.changeSet=new Set,mn(e),this.model.emitChange(e),this.hooks.modelChange(e)}getActiveCell(){return this.model.getActiveCell()}getRange(e){let t=this.getMergeCells(this.getCurrentSheetId());if(t.length===0)return{range:e,isMerged:!1};for(let o of t)if(jt(e.row,e.col,o))return{range:{...o,sheetId:o.sheetId||this.getCurrentSheetId()},isMerged:!0};return{range:e,isMerged:!1}}getActiveRange(){let e=this.getActiveCell();return this.getRange(e)}setNextActiveCell(e){let t=this.getActiveCell(),o=t.col,r=t.row,i=this.getSheetInfo(t.sheetId),s=this.getMergeCells(t.sheetId),a={...t};if(e==="left"){for(o--;;){let c=!1,h=!1;for(let d of s)if(o>=d.col&&o<d.col+d.colCount){o=Math.min(o,d.col-1),c=!0;break}for(;o>0&&this.getColWidth(o).len<=0;)o--,h=!0;if(o<=0){o=0;break}if(!h&&!c)break}a.col=o}if(e==="right"){for(o++;;){let c=!1,h=!1;for(let d of s)if(o>=d.col&&o<d.col+d.colCount){o=Math.max(o,d.col+d.colCount),c=!0;break}for(;o<i.colCount&&this.getColWidth(o).len<=0;)o++,h=!0;if(o>=i.colCount-1){o=i.colCount-1;break}if(!h&&!c)break}a.col=o}if(e==="up"){for(r--;;){let c=!1,h=!1;for(let d of s)if(r>=d.row&&r<d.row+d.rowCount){r=Math.min(r,d.row-1),c=!0;break}for(;r>0&&this.getColWidth(r).len<=0;)r--,h=!0;if(r<=0){r=0;break}if(!h&&!c)break}a.row=r}if(e==="down"){for(r++;;){let c=!1,h=!1;for(let d of s)if(r>=d.row&&r<d.row+d.rowCount){r=Math.max(r,d.row+d.rowCount),c=!0;break}for(;r<i.rowCount&&this.getColWidth(r).len<=0;)r++,h=!0;if(r>=i.rowCount-1){r=i.rowCount-1;break}if(!h&&!c)break}a.row=r}let l=this.getRange(a).range;return this.setActiveCell(l),l}setSheetCell(e){let t=e.sheetId||this.model.getCurrentSheetId();e.sheetId=t,this.model.setActiveCell(e),this.changeSet.add("range")}setActiveCell(e){this.setSheetCell(e),this.emitChange()}setCurrentSheetId(e){if(e===this.getCurrentSheetId())return;this.model.setCurrentSheetId(e),this.changeSet.add("sheetId"),this.changeSet.add("cellValue");let t=this.getActiveCell();this.setSheetCell(t),this.setScroll(this.getScroll())}setTabColor(e,t){this.model.setTabColor(e,t),this.changeSet.add("sheetList"),this.emitChange()}hideSheet(e){this.model.hideSheet(e),this.changeSet.add("sheetList"),this.changeSet.add("sheetId"),this.changeSet.add("range"),this.emitChange()}unhideSheet(e){this.model.unhideSheet(e),this.changeSet.add("sheetList"),this.changeSet.add("sheetId"),this.changeSet.add("range"),this.emitChange()}renameSheet(e,t){this.model.renameSheet(e,t),this.changeSet.add("sheetList"),this.emitChange()}fromJSON(e){this.model.fromJSON(e),this.changeSet.add("sheetList"),this.changeSet.add("sheetId"),this.changeSet.add("range"),this.changeSet.add("floatElement"),this.changeSet.add("cellValue"),this.setSheetCell(this.getActiveCell()),this.emitChange()}toJSON(){return this.model.toJSON()}setCellValues(e,t,o){this.model.setCellValues(e,t,o),this.changeSet.add("cellValue"),this.emitChange()}updateCellStyle(e,t){this.model.updateCellStyle(e,t),this.changeSet.add("cellStyle"),this.emitChange()}canRedo(){return this.model.canRedo()}canUndo(){return this.model.canUndo()}undo(){this.model.undo(),this.changeSet.add("range"),this.changeSet.add("sheetList"),this.changeSet.add("sheetId"),this.changeSet.add("scroll"),this.changeSet.add("floatElement"),this.changeSet.add("cellValue"),this.changeSet.add("undoRedo"),this.emitChange()}redo(){this.model.redo(),this.changeSet.add("range"),this.changeSet.add("sheetList"),this.changeSet.add("sheetId"),this.changeSet.add("scroll"),this.changeSet.add("floatElement"),this.changeSet.add("cellValue"),this.changeSet.add("undoRedo"),this.emitChange()}getColWidth(e,t){return this.model.getColWidth(e,t)}setColWidth(e,t,o,r){this.model.setColWidth(e,t,o,r),this.changeSet.add("col"),o&&this.emitChange()}getRowHeight(e,t){return this.model.getRowHeight(e,t)}setRowHeight(e,t,o,r){this.model.setRowHeight(e,t,o,r),this.changeSet.add("row"),o&&this.emitChange()}computeViewSize(){let e=this.getHeaderSize(),t=this.model.getSheetInfo(this.model.getCurrentSheetId());if(!t)return;let{width:o}=e,{height:r}=e;for(let i=0;i<t.colCount;i++)o+=this.getColWidth(i).len;for(let i=0;i<t.rowCount;i++)r+=this.getRowHeight(i).len;this.viewSize={width:o,height:r}}getViewSize(){return{...this.viewSize}}getCellSize(e){return e.sheetId=e.sheetId||this.getCurrentSheetId(),this.getRangeSize(e)}getRangeSize(e){let{row:t,col:o,colCount:r,rowCount:i}=e,s=e.sheetId||this.getCurrentSheetId();if(r===0||i===0)return{width:this.getColWidth(o,s).len,height:this.getRowHeight(t,s).len};let a=0,l=0;for(let c=t,h=t+i;c<h;c++)l+=this.getRowHeight(c,s).len;for(let c=o,h=o+r;c<h;c++)a+=this.getColWidth(c,s).len;return{width:a,height:l}}getHeaderSize(){return{...this.headerSize}}computeCellPosition(e){let{row:t,col:o}=e,r=e.sheetId||this.model.getCurrentSheetId(),i=this.getHeaderSize(),s=this.getScroll(r),a=i.width,l=i.height,c=s.row,h=s.col;if(o>=s.col)for(;h<o;)a+=this.getColWidth(h,r).len,h++;else for(a=-i.width;h>o;)a-=this.getColWidth(h,r).len,h--;if(t>=s.row)for(;c<t;)l+=this.getRowHeight(c,r).len,c++;else for(l=-i.height;c>t;)l-=this.getRowHeight(c,r).len,c--;return{top:l,left:a}}addRow(e,t){this.model.addRow(e,t),this.changeSet.add("row"),this.emitChange()}addCol(e,t){this.model.addCol(e,t),this.changeSet.add("col"),this.emitChange()}deleteCol(e,t){this.model.deleteCol(e,t),this.changeSet.add("col"),this.emitChange()}deleteRow(e,t){this.model.deleteRow(e,t),this.changeSet.add("row"),this.emitChange()}hideCol(e,t){this.model.hideCol(e,t),this.changeSet.add("col"),this.emitChange()}hideRow(e,t){this.model.hideRow(e,t),this.changeSet.add("row"),this.emitChange()}getChangeSet(){let e=this.changeSet;return this.changeSet=new Set,e}setChangeSet(e){this.changeSet=e,this.emitChange()}getScroll(e){let t=e||this.model.getCurrentSheetId();return{...this.scrollValue[t]||{...ni}}}setScroll(e){let t=this.model.getCurrentSheetId();this.scrollValue[t]={...e},e.row>9999?this.headerSize={width:Math.floor(jo*2),height:Uo}:this.headerSize={width:jo,height:Uo},this.changeSet.add("scroll"),this.emitChange()}parseText(e){let t;if(e.indexOf(`\r
`)>-1?t=e.split(`\r
`).map(s=>s).map(s=>s.split("	")):t=e.split(`
`).map(s=>s).map(s=>s.split("	")),t[0].length!==t[t.length-1].length){let s=t[t.length-1];s.length===1&&!s[0]&&t.pop()}let o=t.length,r=0;for(let s of t)s.length>r&&(r=s.length);let i=this.getActiveCell();return{value:t,style:[],range:{...i,rowCount:o,colCount:r}}}parseHTML(e){let{textList:t,styleList:o}=qo(e),r=t.length,i=this.getActiveCell(),s=Math.max(...t.map(a=>a.length));return{value:t,style:o,range:{...i,rowCount:r,colCount:s}}}getCopyData(){let e=this.getActiveCell(),{row:t,col:o,rowCount:r,colCount:i}=e,s=[],a=[],l=1,c=[],h=this.model.getCurrentSheetId();for(let f=t,y=t+r;f<y;f++){let u=[],m=[];for(let g=o,w=o+i;g<w;g++){let x=this.model.getCell(new Fe(f,g,1,1,h));if(!x)continue;let v=String(x.value||"");if(u.push(v),x.style){let S=Jo(x.style);v||(S+="mso-pattern:black none;");let C=`xl${l++}`;c.push(`.${C}{${S}}`),m.push(`<td class="${C}"> ${v} </td>`)}else m.push(`<td> ${v} </td>`)}s.push(u),a.push(m)}let d=vn(c.join(`
`),a.map(f=>`<tr>${f.join(`
`)}</tr>`).join(`
`)),p=`${s.map(f=>f.join("	")).join(`\r
`)}\r
`;return{[lt]:p,[at]:d}}paste(e){if(this.floatElementUuid){if(this.isCut){let t=this.floatElementUuid,o=this.getActiveCell();this.model.updateFloatElement(t,{fromCol:o.col,fromRow:o.row,marginX:0,marginY:0}),this.changeSet.add("floatElement"),this.copyRanges=[],this.isCut=!1,this.floatElementUuid="",this.emitChange()}else{let o=this.getFloatElementList(this.getCurrentSheetId()).find(r=>r.uuid===this.floatElementUuid);if(o){let r=this.getCellSize({row:o.fromRow,col:o.fromCol,rowCount:1,colCount:1,sheetId:o.sheetId}),{marginX:i,marginY:s}=o,a=14;i+a<r.width?i+=a:i-a>=0&&(i-=a),s+a<r.width?s+=a:s-a>=0&&(s-=a),this.addFloatElement({...o,uuid:Ae(),marginX:i,marginY:s})}}return}this.basePaste(e)}async basePaste(e){let t="",o="";if(e)t=e.clipboardData?.getData(at)||"",o=e.clipboardData?.getData(lt)||"";else{let s=await this.hooks.paste();t=s[at],o=s[lt]}t=t.trim(),o=o.trim();let r=this.getActiveCell();this.changeSet.add("cellValue");let i=!1;if(t){let s=this.parseHTML(t);s.value.length>0&&(r=s.range,this.changeSet.add("cellStyle"),this.model.setCellValues(s.value,s.style,[s.range]),i=!0)}if(!i&&o){let s=this.parseText(o);s.value.length>0&&(r=s.range,this.model.setCellValues(s.value,[],[s.range]),i=!0)}if(!i&&this.copyRanges.length>0){let[s]=this.copyRanges.slice();this.changeSet.add("cellStyle"),r=this.model.pasteRange(s,this.isCut)}this.isCut&&(this.copyRanges=[],this.isCut=!1,this.hooks.copyOrCut({[lt]:"",[at]:""},"copy")),this.setActiveCell(r)}copy(e){this.copyRanges=[this.getActiveCell()],this.isCut=!1,this.baseCopy("copy",e)}cut(e){this.copyRanges=[this.getActiveCell()],this.isCut=!0,this.baseCopy("cut",e)}baseCopy(e,t){let o=this.getCopyData();if(t){let r=Object.keys(o);for(let i of r)t.clipboardData?.setData(i,o[i])}else this.hooks.copyOrCut(o,e);this.changeSet.add("antLine"),this.emitChange()}getCopyRanges(){return this.floatElementUuid?[]:this.copyRanges.slice()}getDomRect(){let{canvas:e}=this.getMainDom();if(!e)return{top:0,left:0,width:0,height:0};let t=e.parentElement,o=parseInt(Ve.scrollBarSize,10),r=t.getBoundingClientRect();return{top:r.top,left:r.left,width:t.clientWidth-o,height:t.clientHeight-o}}setMainDom(e){this.mainDom=Object.assign(this.mainDom,e)}getMainDom(){return this.mainDom}deleteAll(e){this.model.deleteAll(e),this.changeSet.add("cellValue"),this.emitChange()}getDefineName(e){return this.model.getDefineName(e)}setDefineName(e,t){this.model.setDefineName(e,t),this.changeSet.add("defineName"),this.changeSet.add("cellValue"),this.emitChange()}checkDefineName(e){return this.model.checkDefineName(e)}getFloatElementList(e){return this.model.getFloatElementList(e)}addFloatElement(e){this.model.addFloatElement(e),this.changeSet.add("floatElement"),this.emitChange()}updateFloatElement(e,t){this.model.updateFloatElement(e,t),this.changeSet.add("floatElement"),this.emitChange()}deleteFloatElement(e){this.model.deleteFloatElement(e),this.changeSet.add("floatElement"),this.emitChange()}getMergeCells(e){return this.model.getMergeCells(e)}addMergeCell(e){this.model.addMergeCell(e),this.changeSet.add("mergeCell"),this.changeSet.add("cellValue"),this.emitChange()}deleteMergeCell(e){this.model.deleteMergeCell(e),this.changeSet.add("mergeCell"),this.changeSet.add("cellValue"),this.emitChange()}setFloatElementUuid(e){this.floatElementUuid&&!e&&(this.copyRanges=[]),this.floatElementUuid=e}};var R=class extends Error{constructor(e){super(e),this.value=e}};function M(n,e="#VALUE!"){if(!n)throw new R(e)}function qt(n){M(n.length===1);let[e]=n;return e}function mt(n){let e=qt(n);return M(typeof e=="string"),e}function Z(n){let e=qt(n);return M(typeof e=="number"&&!isNaN(e)),e}function Vo(n){M(n.length===0)}var ri=(...n)=>{let e=qt(n);return typeof e=="string"?e:""},ii=(...n)=>mt(n).toLowerCase(),cr=(...n)=>{let e=Z(n);return String.fromCharCode(e)},hr=(...n)=>mt(n).charCodeAt(0),si=(...n)=>mt(n).length,li=(...n)=>{M(n.length===2);let[e,t]=n;return M(typeof e=="string"),M(typeof t=="string"),e.split(t)},ai=(...n)=>mt(n).toUpperCase(),ci=(...n)=>mt(n).replace(/ +/g," ").trim(),dr=(...n)=>(M(n.length<=gt),n.join("")),hi={CONCAT:dr,CONCATENATE:dr,SPLIT:li,CHAR:cr,CODE:hr,UNICHAR:cr,UNICODE:hr,LEN:si,LOWER:ii,UPPER:ai,TRIM:ci,T:ri},pr=hi;var di=(...n)=>{let e=Z(n);return Math.abs(e)},pi=(...n)=>{let e=Z(n);return Math.acos(e)},mi=(...n)=>{let e=Z(n);return Math.log(e+Math.sqrt(e*e-1))},ui=(...n)=>{let e=Z(n);return Math.atan(1/e)},fi=(...n)=>{let e=Z(n);return .5*Math.log((e+1)/(e-1))},gi=(...n)=>{let e=Z(n);return Math.asin(e)},Ci=(...n)=>{let e=Z(n);return Math.log(e+Math.sqrt(e*e+1))},yi=(...n)=>{let e=Z(n);return Math.atan(e)},bi=(...n)=>{M(n.length===2);let[e,t]=n;return M(typeof e=="number"),M(typeof t=="number"),Math.atan2(e,t)},wi=(...n)=>{let e=Z(n);return Math.log((1+e)/(e+1))/2},vi=(...n)=>{let e=Z(n);return Math.cos(e)},xi=(...n)=>{let e=Z(n);return 1/Math.tan(e)};var Si=(...n)=>{let e=Z(n);return Math.exp(e)},Ii=(...n)=>{let e=Z(n);return Math.floor(e)};var Ai=(...n)=>(Vo(n),Math.PI),ki=(...n)=>(Vo(n),Math.E),Ei=(...n)=>{let e=Z(n);return Math.sin(e)},Ti=(...n)=>{let e=po(n);return M(e.length<=gt),e.reduce((t,o)=>t+o,0)},Fi=(...n)=>{let e=po(n);return M(e.length<=gt&&e.length>=1),e.reduce((t,o)=>t+o,0)/e.length},Ri={ABS:di,ACOS:pi,ACOSH:mi,ACOT:ui,ACOTH:fi,ASIN:gi,ASINH:Ci,ATAN:yi,ATAN2:bi,ATANH:wi,AVERAGE:Fi,COT:xi,COS:vi,EXP:Si,INT:Ii,PI:Ai,E:ki,SIN:Ei,SUM:Ti},mr=Ri;var Pi={...pr,...mr},At=Pi;var ce=class{constructor(e,t){this.type=e,this.value=t}error(){return`type:${this.type},value:${this.value}`}toString(){return this.value}};var ur="",Li=new Map([["TRUE",19],["FALSE",20]]),_t=class{constructor(e){this.current=0;this.start=0;this.tokens=[];this.list=[...e]}scan(){for(;!this.isAtEnd();)this.start=this.current,this.scanToken();return this.tokens.push(new ce(27,"")),this.tokens.length>0&&this.tokens[0].type===0&&this.tokens.shift(),this.tokens}peek(){return this.isAtEnd()?ur:this.list[this.current]}match(e){return this.peek()!==e?!1:(this.next(),!0)}next(){return this.isAtEnd()?ur:this.list[this.current++]}isAtEnd(){return this.current>=this.list.length}addToken(e){let t=this.list.slice(this.start,this.current).join("");this.tokens.push(new ce(e,t))}string(e){for(;!this.isAtEnd()&&this.peek()!==e;)this.next();if(this.peek()!==e)throw new R("#VALUE!");this.next();let t=this.list.slice(this.start+1,this.current-1).join("");this.tokens.push(new ce(17,t))}allDigit(){for(;!this.isAtEnd()&&this.isDigit(this.peek());)this.next()}matchScientificCounting(){if(this.match("E")||this.match("e")){if(this.match("+")||this.match("-"))return this.allDigit(),this.addToken(18),!0;if(this.isDigit(this.peek()))return this.allDigit(),this.addToken(18),!0;throw new R("#VALUE!")}return!1}number(){this.allDigit(),!(this.matchScientificCounting()||(this.match(".")&&this.allDigit(),this.matchScientificCounting()))&&this.addToken(18)}isDigit(e){return e>="0"&&e<="9"}identifier(){for(;!this.isAtEnd()&&this.anyChar(this.peek());)this.next();let e=this.list.slice(this.start,this.current).join(""),t=Li.get(e.toUpperCase()),o=16;t&&(e=e.toUpperCase(),o=t),this.tokens.push(new ce(o,e))}scanToken(){let e=this.next();switch(e){case"(":this.addToken(21);break;case")":this.addToken(22);break;case",":this.addToken(11);break;case":":this.addToken(10);break;case Lt:this.addToken(0);break;case"<":this.match(">")?this.addToken(1):this.match("=")?this.addToken(15):this.addToken(14);break;case">":this.match("=")?this.addToken(8):this.addToken(7);break;case"+":this.addToken(2);break;case"-":this.addToken(3);break;case"*":this.addToken(4);break;case"/":this.addToken(5);break;case"^":this.addToken(6);break;case"&":this.addToken(9);break;case"%":this.addToken(13);break;case'"':this.string(e);break;case"!":this.addToken(26);break;case";":this.addToken(25);break;case"{":this.addToken(23);break;case"}":this.addToken(24);break;case" ":break;case"\r":case"	":case`
`:break;default:if(this.isDigit(e))this.number();else if(this.anyChar(e))this.identifier();else throw new R("#ERROR!");break}}anyChar(e){return!'(),:=<>+-*/^&%"{}!'.includes(e)&&!this.isWhiteSpace(e)}isWhiteSpace(e){return e===" "||e==="\r"||e===`
`||e==="	"}};var Be=class{constructor(e,t,o){this.left=e,this.operator=t,this.right=o}accept(e){return e.visitBinaryExpression(this)}handleConcatenate(e){let t=e.toString();return this.operator.type===9&&e instanceof $e&&e.value.type===17?JSON.stringify(t):t}toString(){let e=this.handleConcatenate(this.left),t=this.handleConcatenate(this.right);return`${e}${this.operator.toString()}${t}`}},$t=class{constructor(e,t){this.operator=e,this.right=t}accept(e){return e.visitUnaryExpression(this)}toString(){return this.operator.toString()+this.right.toString()}},eo=class{constructor(e,t){this.operator=e,this.left=t}accept(e){return e.visitPostUnaryExpression(this)}toString(){return this.left.toString()+this.operator.toString()}},$e=class{constructor(e){this.value=e}accept(e){return e.visitLiteralExpression(this)}toString(){return this.value.toString()}},He=class{constructor(e,t,o){this.value=e,this.sheetName=o,this.type=t}accept(e){return e.visitCellExpression(this)}toString(){return this.sheetName?`${this.sheetName.toString()}!${this.value.toString()}`:this.value.toString()}},to=class{constructor(e,t){this.name=e,this.params=t}accept(e){return e.visitCallExpression(this)}toString(){return`${this.name.toString().toUpperCase()}(${this.params.map(e=>e.toString()).join(",")})`}},oo=class{constructor(e,t,o){this.left=e,this.operator=t,this.right=o}accept(e){return e.visitCellRangeExpression(this)}toString(){return this.left.toString()+this.operator.toString()+this.right.toString()}},no=class{constructor(e){this.value=e}accept(e){return e.visitGroupExpression(this)}toString(){return`(${this.value.toString()})`}},et=class{constructor(e){this.value=e}accept(e){return e.visitTokenExpression(this)}toString(){return this.value.toString()}};var Ni=new Set(["#ERROR!","#DIV/0!","#NULL!","#NUM!","#REF!","#VALUE!","#N/A","#NAME?"]),ro=class{constructor(e){this.current=0;this.tokens=e}parse(){let e=[];for(;!this.isAtEnd();)e.push(this.expression());return e}expression(){return this.comparison()}comparison(){let e=this.concatenate();for(;this.match(0,1,7,8,14,15);){let t=this.previous(),o=this.concatenate();e=new Be(e,t,o)}return e}concatenate(){let e=this.term();for(;this.match(9);){let t=this.previous(),o=this.term();e=new Be(e,t,o)}return e}term(){let e=this.factor();for(;this.match(2,3);){let t=this.previous(),o=this.factor();e=new Be(e,t,o)}return e}factor(){let e=this.expo();for(;this.match(5,4);){let t=this.previous(),o=this.expo();e=new Be(e,t,o)}return e}expo(){let e=this.unary();for(;this.match(6);){let t=this.previous(),o=this.unary();e=new Be(e,t,o)}return e}unary(){if(this.match(2,3)){let e=this.previous(),t=this.unary();return new $t(e,t)}return this.postUnary()}postUnary(){let e=this.cellRange();if(this.match(13)){let t=this.previous();e=new eo(t,e)}return e}cellRange(){let e=this.call();for(;this.match(10,26);){let t=this.previous(),o=this.call();e=new oo(e,t,o)}return e}call(){let e=this.primary();for(;this.match(21);)e=this.finishCall(e);return e}finishCall(e){let t=[];if(!this.check(22))do{if(this.peek().type==22)break;t.push(this.expression())}while(this.match(11));return this.expect(22),new to(e,t)}primary(){if(this.match(21)){let e=this.expression();return this.expect(22),new no(e)}if(this.match(18,17,19,20))return new $e(this.previous());if(this.match(16)){let e=this.previous(),t=e.value.toUpperCase();if(Ni.has(t))throw new R(t);return new et(e)}throw new R("#ERROR!")}match(...e){let{type:t}=this.peek();return e.includes(t)?(this.next(),!0):!1}previous(){return this.tokens[this.current-1]}check(e){return this.peek().type===e}expect(e){if(this.check(e))return this.next(),this.previous();throw new R("#ERROR!")}next(){this.current++}isAtEnd(){return this.peek().type===27}peek(){return this.current<this.tokens.length?this.tokens[this.current]:new ce(27,"")}};var io=class{constructor(e,t,o,r){this.expressions=e,this.functionMap=r,this.cellDataMap=t,this.definedNamesMap=o}interpret(){let e=[];for(let t of this.expressions)e.push(this.evaluate(t));if(e.length===1)return this.getRangeCellValue(e[0]);throw new R("#ERROR!")}visitBinaryExpression(e){let t=this.evaluate(e.left),o=this.evaluate(e.right);switch(t=this.getRangeCellValue(t),o=this.getRangeCellValue(o),e.operator.type){case 3:return M(typeof t=="number"),M(typeof o=="number"),t-o;case 2:return M(typeof t=="number"),M(typeof o=="number"),t+o;case 5:if(M(typeof t=="number"),M(typeof o=="number"),o===0)throw new R("#DIV/0!");return t/o;case 4:return M(typeof t=="number"),M(typeof o=="number"),t*o;case 6:return M(typeof t=="number"),M(typeof o=="number"),Math.pow(t,o);case 0:return t===o;case 1:return t!==o;case 7:return t>o;case 8:return t>=o;case 14:return t<o;case 15:return t<=o;case 9:return`${t}${o}`;default:throw new R("#VALUE!")}}visitCallExpression(e){let t=this.evaluate(e.name);if(t&&typeof t=="function"){let o=[];for(let r of e.params){let i=this.evaluate(r);if(i instanceof Fe){let s=this.cellDataMap.get(i);o=o.concat(s)}else o.push(i)}return t(...o)}throw new R("#NAME?")}visitCellExpression(e){let t="";if(e.sheetName&&(t=this.cellDataMap.convertSheetNameToSheetId(e.sheetName.value),!t))throw new R("#NAME?");let o=ge(e.value.value);if(o===null)throw new R("#NAME?");return t&&(o.sheetId=t),o}visitLiteralExpression(e){let{type:t,value:o}=e.value;switch(t){case 17:return o;case 18:{let r=parseFloat(o);if(isNaN(r))throw new R("#VALUE!");return r}case 19:return!0;case 20:return!1;default:throw new R("#ERROR!")}}visitTokenExpression(e){let{value:t,type:o}=e.value,r=t.toLowerCase();if(this.definedNamesMap.has(r)){let c=this.definedNamesMap.get(r);return this.cellDataMap.get(c)[0]}let i=t.toUpperCase(),s=this.functionMap[i];if(s)return s;let a=i,l=new ce(o,a);if(/^\$[A-Z]+\$\d+$/.test(a)||/^\$[A-Z]+$/.test(a)||/^\$\d+$/.test(a))return this.addCellExpression(l,"absolute",null);if(/^\$[A-Z]+\d+$/.test(a)||/^[A-Z]+\$\d+$/.test(a))return this.addCellExpression(l,"mixed",null);if(/^[A-Z]+\d+$/.test(a)||/^[A-Z]+$/.test(a))return this.addCellExpression(l,"relative",null);throw new R("#NAME?")}visitUnaryExpression(e){let t=this.evaluate(e.right);switch(e.operator.type){case 3:return-t;case 2:return t;default:throw new R("#VALUE!")}}visitCellRangeExpression(e){switch(e.operator.type){case 10:{let t=this.convertToCellExpression(e.left),o=this.convertToCellExpression(e.right);if(t!==null&&o!==null){let r=this.visitCellExpression(t),i=this.visitCellExpression(o),s=pn(r,i);if(s===null)throw new R("#NAME?");return s}else throw new R("#NAME?")}case 26:{let t=this.convertToCellExpression(e.right);if(t===null)throw new R("#REF!");if(e.left instanceof et)return this.visitCellExpression(new He(t.value,t.type,e.left.value));throw new R("#NAME?")}default:throw new R("#NAME?")}}visitGroupExpression(e){return this.evaluate(e.value)}visitPostUnaryExpression(e){let t=this.evaluate(e.left);switch(e.operator.type){case 13:return M(typeof t=="number"),t*.01;default:throw new R("#VALUE!")}}evaluate(e){return e.accept(this)}convertToCellExpression(e){return e instanceof He?e:e instanceof et?new He(new ce(16,e.value.value.toUpperCase()),"relative",null):e instanceof $e&&e.value.type===18&&/^\d+$/.test(e.value.value)?new He(new ce(16,e.value.value),"relative",null):null}addCellExpression(e,t,o){e.value=e.value.toUpperCase();let r=new He(e,t,o);return this.visitCellExpression(r)}getRangeCellValue(e){if(e instanceof Fe){if(e.colCount===e.rowCount&&e.colCount===1)return this.cellDataMap.get(e)[0];throw new R("#REF!")}return e}};function Ko(n,e=new so,t=new lo,o=At){let r="";try{let i=new _t(n).scan(),s=new ro(i).parse(),a=new io(s,e,t,o).interpret(),l=[];for(let c of s)l.push(c.toString());return r=l.join(""),{result:a,error:null,expressionStr:r}}catch(i){if(i instanceof R)return{result:null,error:i.value,expressionStr:r}}return{result:null,error:"#ERROR!",expressionStr:r}}var so=class{constructor(){this.map=new Map;this.sheetNameMap={}}getKey(e,t,o="1"){return`${e}_${t}_${o}`}setSheetNameMap(e){this.sheetNameMap=e}set(e,t){let{row:o,col:r,sheetId:i}=e;for(let s=0;s<t.length;s++)for(let a=0;a<t[s].length;a++){let l=this.getKey(o+s,r+a,i);this.map.set(l,t[s][a])}}get(e){let t=[],{row:o,col:r,rowCount:i,colCount:s,sheetId:a}=e;for(let l=o,c=o+i;l<c;l++)for(let h=r,d=r+s;h<d;h++){let p=this.getKey(l,h,a);t.push(this.map.get(p))}return t}convertSheetNameToSheetId(e){return e&&this.sheetNameMap[e]||""}},lo=class{constructor(){this.map=new Map}set(e,t){this.map.set(e,t)}get(e){return this.map.get(e)}has(e){return this.map.has(e)}};var Go=()=>{},ao=class{constructor(e){this.position=-1;this.commandList=[];this.commands=[];this.options={change:Go,maxLength:100,redo:Go,undo:Go};this.clear(!0),this.options.maxLength=e.maxLength||this.options.maxLength,typeof e.change=="function"&&(this.options.change=e.change),typeof e.redo=="function"&&(this.options.redo=e.redo),typeof e.undo=="function"&&(this.options.undo=e.undo)}push(...e){e.length!==0&&(this.commands=this.commands.concat(e))}commit(){if(this.commands.length!==0){this.position++,this.commandList[this.position]=[...this.commands];for(let e=this.position+1;e<this.commandList.length;e++)this.commandList[e]=[];this.position>=this.options.maxLength&&(this.commandList[this.position-this.options.maxLength]=[]);for(let e=0;this.commandList.length>this.options.maxLength&&e<this.position;e++)this.commandList[0].length===0&&(this.commandList.shift(),this.position--);this.change(this.commands),this.commands=[]}}redo(){if(!this.canRedo())return;this.position++;let e=this.commandList[this.position];if(e.length>0)for(let t of e)this.options.redo(t);this.change(e)}undo(){if(!this.canUndo())return;let e=this.commandList[this.position];if(e.length>0)for(let t of e)this.options.undo(t);this.position--,this.change(e)}canRedo(){if(this.position>=this.commandList.length-1)return!1;let e=!1;for(let t=this.position+1;t<this.commandList.length;t++)if(this.commandList[t].length>0){e=!0;break}return e}canUndo(){let e=Math.max(this.commandList.length-this.options.maxLength,0);return this.position>e}clear(e=!1){e&&(this.position=-1,this.commandList=[]),this.commands=[]}change(e){this.options.change(e)}get(){return this.position>=0&&this.position<this.commandList.length?this.commandList[this.position]:[]}getLength(){return Math.min(this.commandList.length,this.options.maxLength)}};var B=Symbol("delete"),fr=n=>n.t+(n.k?"."+n.k:"");function gr(n,e,t){if(!n||typeof n!="object")return;e.split(".").reduce((r,i,s,a)=>(s===a.length-1?t===B?delete r[i]:r[i]=t:(r[i]===null||r[i]===void 0)&&(r[i]={}),r[i]),n)}var co=class{constructor(){this.currentSheetId="";this.rangeMap={};this.workbook={};this.mergeCells={};this.worksheets={};this.definedNames={};this.customWidth={};this.customHeight={};this.drawings={};this.fromJSON=e=>{let{workbook:t={},mergeCells:o={},customHeight:r={},customWidth:i={},definedNames:s={},currentSheetId:a="",drawings:l={},rangeMap:c={},worksheets:h={}}=e;this.workbook=t,this.mergeCells=o,this.customWidth=i,this.customHeight=r,this.definedNames=s,this.drawings=l,this.rangeMap=c,this.worksheets=h,t[a]&&!t[a].isHide?this.currentSheetId=a:this.currentSheetId=this.getSheetId(),this.history.clear(!0)};this.toJSON=()=>({workbook:{...this.workbook},mergeCells:{...this.mergeCells},customHeight:{...this.customHeight},customWidth:{...this.customWidth},definedNames:{...this.definedNames},currentSheetId:this.currentSheetId,drawings:{...this.drawings},rangeMap:{...this.rangeMap},worksheets:{...this.worksheets}});this.getCell=e=>{let{row:t,col:o,sheetId:r}=e,i=r||this.currentSheetId;if(this.getRowHeight(t,i).len===Ue||this.getColWidth(o,i).len===Ue)return null;let s=W(t,o);return this.worksheets[i]=this.worksheets[i]||{},{...this.worksheets[i]?.[s]||{},row:t,col:o}};this.convertSheetIdToName=e=>this.workbook[e]?.name||"";this.convertSheetNameToSheetId=e=>this.getSheetList().find(o=>o.name===e)?.sheetId||"";this.history=new ao({undo:e=>{if(e.t==="currentSheetId"){!this.workbook[e.o]||this.workbook[e.o].isHide?this.currentSheetId=this.getSheetId():this.currentSheetId=e.o;return}let t=fr(e);gr(this,t,e.o)},redo:e=>{if(e.t==="currentSheetId"){!this.workbook[e.n]||this.workbook[e.n].isHide?this.currentSheetId=this.getSheetId():this.currentSheetId=e.n;return}let t=fr(e);gr(this,t,e.n)},change:e=>{un(e)}})}getSheetList(){let e=Object.values(this.workbook);return e.sort((t,o)=>t.sort-o.sort),e}getActiveCell(){let e=this.currentSheetId,t=this.rangeMap[e];return t?{...t}:{row:0,col:0,rowCount:1,colCount:1,sheetId:e}}setActiveCell(e){e.sheetId=e.sheetId||this.currentSheetId;let t=this.workbook[e.sheetId];if(!t)return;let{row:o,col:r}=e;if(o<0||r<0||o>=t.rowCount||r>=t.colCount)return;let i=this.rangeMap[e.sheetId];i&&Ut(i,e)||(this.rangeMap[e.sheetId]=e)}addSheet(){let e=this.getSheetList(),o={...hn(e),isHide:!1,colCount:Ie,rowCount:Se,sort:e.length},r=this.workbook[o.sheetId];fe(!r,b("sheet-id-is-duplicate")),this.worksheets[o.sheetId]=this.worksheets[o.sheetId]||{},this.workbook[o.sheetId]=o,this.history.push({t:"workbook",k:o.sheetId,n:{...o},o:B}),this.setCurrentSheetId(o.sheetId),this.setActiveCell({row:0,col:0,rowCount:1,colCount:1,sheetId:o.sheetId})}deleteSheet(e){let t=e||this.currentSheetId;if(!this.workbook[t])return;let r=this.getSheetList().filter(l=>!l.isHide);fe(r.length>=2,b("a-workbook-must-contains-at-least-one-visible-worksheet"));let i=this.getNextSheetId(t),s=this.workbook[t];delete this.workbook[t];let a=this.worksheets[t];delete this.worksheets[t],this.history.push({t:"workbook",k:t,n:B,o:s}),this.history.push({t:"worksheets",k:t,n:B,o:a}),this.setCurrentSheetId(i)}setTabColor(e,t){let o=t||this.currentSheetId;if(!this.workbook[o]||this.workbook[o].tabColor===e)return;let r=this.workbook[o].tabColor;this.workbook[o].tabColor=e,this.history.push({t:"workbook",k:`${o}.tabColor`,n:e,o:r})}hideSheet(e){let t=e||this.currentSheetId;if(!this.workbook[t]||this.workbook[t].isHide)return;let r=this.getSheetList().filter(s=>!s.isHide);fe(r.length>=2,b("a-workbook-must-contains-at-least-one-visible-worksheet"));let i=this.getNextSheetId(e);this.workbook[t].isHide=!0,this.history.push({t:"workbook",k:`${t}.isHide`,n:!0,o:!1}),this.setCurrentSheetId(i)}unhideSheet(e){let t=e||this.currentSheetId;this.workbook[t]&&this.workbook[t].isHide&&(this.workbook[t].isHide=!1,this.history.push({t:"workbook",k:`${t}.isHide`,n:!1,o:!0}),this.setCurrentSheetId(t))}renameSheet(e,t){fe(!!e,b("the-value-cannot-be-empty"));let o=t||this.currentSheetId,i=this.getSheetList().find(l=>l.name===e);if(i){if(i.sheetId===t)return;fe(!1,b("sheet-name-is-duplicate"))}let s=this.workbook[o],a=s.name;s.name!==e&&(s.name=e,this.history.push({t:"workbook",k:`${o}.name`,n:e,o:a}))}getSheetInfo(e){let t=e||this.currentSheetId,o=this.workbook[t];return o&&(o.sheetId=t),o}setCurrentSheetId(e){if(this.currentSheetId!==e){let t=this.currentSheetId;this.currentSheetId=e,this.history.push({t:"currentSheetId",k:"",n:e,o:t})}}getCurrentSheetId(){return this.currentSheetId}setCellValues(e,t,o){if(Ce(e))return;let[r]=o,{row:i,col:s}=r;for(let a=0;a<e.length;a++)for(let l=0;l<e[a].length;l++){let c=e[a][l],h={row:i+a,col:s+l};t[a]&&t[a][l]&&this.setStyle(t[a][l],h),c&&typeof c=="string"&&c.startsWith(Lt)?this.setCellFormula(c,h):(this.setCellFormula("",h),this.setCellValue(c,h))}}updateCellStyle(e,t){if(Ce(e))return;let[o]=t,{row:r,col:i,rowCount:s,colCount:a}=o;for(let l=r,c=r+s;l<c;l++)for(let h=i,d=i+a;h<d;h++)this.updateStyle(e,{row:l,col:h})}addRow(e,t){let o=this.getSheetInfo();if(o.rowCount>=Dt)return;o.rowCount+=t;let r=this.currentSheetId,i=this.worksheets[r];if(!i)return;let s=Array.from(Object.keys(i)).map(a=>je(a));s.sort((a,l)=>a.row-l.row);for(let a=s.length-1;a>=0;a--){let l=s[a];if(l.row<=e)break;let c=W(l.row,l.col),h=W(l.row+t,l.col),d=i[c],p=d?{...d}:{},f=i[h]?{...i[h]}:{};i[h]={...p},delete i[c],this.history.push({t:"worksheets",k:`${r}.${c}`,n:B,o:p}),this.history.push({t:"worksheets",k:`${r}.${h}`,n:p,o:f})}}addCol(e,t){let o=this.getSheetInfo();if(o.colCount>=Mt)return;o.colCount+=t;let r=this.currentSheetId,i=this.worksheets[r];if(!i)return;let s=Array.from(Object.keys(i)).map(a=>je(a));s.sort((a,l)=>a.col-l.col);for(let a=s.length-1;a>=0;a--){let l=s[a];if(l.col<=e)break;let c=W(l.row,l.col),h=W(l.row,l.col+t),d=i[c],p=d?{...d}:{},f=i[h]?{...i[h]}:{};i[h]={...p},delete i[c],this.history.push({t:"worksheets",k:`${r}.${c}`,n:B,o:p}),this.history.push({t:"worksheets",k:`${r}.${h}`,n:p,o:f})}}deleteCol(e,t){let o=this.getSheetInfo();o.colCount-=t;let r=this.currentSheetId,i=this.worksheets[r];for(let[a,l]of Object.entries(this.drawings)){if(l.fromCol>=e){let c=l.fromCol;l.fromCol>=t?l.fromCol-=t:l.fromCol=0,this.history.push({t:"drawings",k:`${a}.fromCol`,n:l.fromCol,o:c})}if(l.type==="chart"&&l.chartRange.col>=e){let c=l.chartRange.col,h=l.chartRange.colCount;if(l.chartRange.col>=t)l.chartRange.col-=t;else{let d=t-l.chartRange.col;l.chartRange.col=0,l.chartRange.colCount>=d?l.chartRange.colCount-=d:l.chartRange.colCount=1,this.history.push({t:"drawings",k:`${a}.chartRange.colCount`,n:l.chartRange.col,o:h})}this.history.push({t:"drawings",k:`${a}.chartRange.col`,n:l.chartRange.col,o:c})}}if(!i)return;let s=Array.from(Object.keys(i)).map(a=>je(a));s.sort((a,l)=>a.col-l.col);for(let a=0;a<s.length;a++){let l=s[a];if(l.col<e)continue;let c=W(l.row,l.col),h=i[c]?{...i[c]}:{};if(l.col>=e+t){let d=W(l.row,l.col-t),p=i[d]?{...i[d]}:{};i[d]={...h},this.history.push({t:"worksheets",k:`${r}.${d}`,n:h,o:p})}delete i[c],this.history.push({t:"worksheets",k:`${r}.${c}`,n:B,o:h})}}deleteRow(e,t){let o=this.getSheetInfo();o.rowCount-=t;let r=this.currentSheetId,i=this.worksheets[r];for(let[a,l]of Object.entries(this.drawings)){if(l.fromRow>=e){let c=l.fromRow;l.fromRow>=t?l.fromRow-=t:l.fromRow=0,this.history.push({t:"drawings",k:`${a}.fromRow`,n:l.fromRow,o:c})}if(l.type==="chart"&&l.chartRange.row>=e){let c=l.chartRange.row,h=l.chartRange.rowCount;if(l.chartRange.row>=t)l.chartRange.row-=t;else{let d=t-l.chartRange.row;l.chartRange.row=0,l.chartRange.rowCount>=d?l.chartRange.rowCount-=d:l.chartRange.rowCount=1,this.history.push({t:"drawings",k:`${a}.chartRange.rowCount`,n:l.chartRange.row,o:h})}this.history.push({t:"drawings",k:`${a}.chartRange.row`,n:l.chartRange.row,o:c})}}if(!i)return;let s=Array.from(Object.keys(i)).map(a=>je(a));s.sort((a,l)=>a.row-l.row);for(let a=0;a<s.length;a++){let l=s[a];if(l.row<e)continue;let c=W(l.row,l.col),h=i[c]?{...i[c]}:{};if(l.row>=e+t){let d=W(l.row-t,l.col),p=i[d]?{...i[d]}:{};i[d]={...h},this.history.push({t:"worksheets",k:`${r}.${d}`,n:h,o:p})}delete i[c],this.history.push({t:"worksheets",k:`${r}.${c}`,n:B,o:h})}}hideCol(e,t){for(let o=0;o<t;o++){let r=e+o,i=pe(this.currentSheetId,r),s=this.customWidth[i];if(s&&s.isHide)continue;let a=s?{...s,isHide:!0}:{len:We,isHide:!0};this.customWidth[i]=a,this.history.push({t:"customWidth",k:i,n:{...a},o:{...s}})}}getColWidth(e,t){let o=t||this.currentSheetId,r=pe(o,e),i=this.customWidth[r];return i?i.isHide?{isHide:!0,len:Ue}:{...i}:{len:We,isHide:!1}}setColWidth(e,t,o,r){let i=r||this.currentSheetId,s=pe(i,e),a=this.getColWidth(e,r);if(a.len===t)return;let l={...a};l.len=t,this.customWidth[s]=l,o&&this.history.push({t:"customWidth",k:s,n:l,o:this.customWidth[s]?this.customWidth[s]:B})}hideRow(e,t){for(let o=0;o<t;o++){let r=e+o,i=pe(this.currentSheetId,r),s=this.customHeight[i];if(s&&s.isHide)continue;let a=s?{...s,isHide:!0}:{len:ze,isHide:!0};this.customHeight[i]=a,this.history.push({t:"customHeight",k:i,n:a,o:s})}}getRowHeight(e,t){let o=t||this.currentSheetId,r=pe(o,e),i=this.customHeight[r];return i?i.isHide?{isHide:!0,len:Ue}:{...i}:{len:ze,isHide:!1}}setRowHeight(e,t,o,r){let i=r||this.currentSheetId,s=pe(i,e),a=this.getRowHeight(e,r);if(a.len===t)return;let l={...a};l.len=t,this.customHeight[s]=l,o&&this.history.push({t:"customHeight",k:s,n:l,o:this.customHeight[s]?this.customHeight[s]:B})}canRedo(){return this.history.canRedo()}canUndo(){return this.history.canUndo()}undo(){this.history.undo()}redo(){this.history.redo()}pasteRange(e,t){let o=this.currentSheetId,r=this.getActiveCell(),{row:i,col:s,rowCount:a,colCount:l,sheetId:c}=e,h=c||o,d=this.worksheets[h],p={...r,rowCount:a,colCount:l};if(!d)return p;this.worksheets[o]=this.worksheets[o]||{};let f=this.worksheets[o];return this.iterateRange(e,(y,u)=>{let m=W(y,u),g=d[m]?{...d[m]}:{},w=r.row+(y-i),x=r.col+(u-s),v=W(w,x),S=f[v]?{...f[v]}:{};return f[v]={...g},this.history.push({t:"worksheets",k:`${o}.${v}`,n:g,o:S}),t&&(delete d[m],this.history.push({t:"worksheets",k:`${h}.${m}`,n:B,o:g})),!1}),p}deleteAll(e){let t=e||this.currentSheetId,o=this.worksheets[t]?{...this.worksheets[t]}:{};delete this.worksheets[t],this.history.push({t:"worksheets",k:t,n:B,o});for(let[r,i]of Object.entries(this.mergeCells))i.sheetId===t&&(delete this.mergeCells[r],this.history.push({t:"mergeCells",k:r,n:B,o:i}));for(let[r,i]of Object.entries(this.drawings))i.sheetId===t&&(delete this.drawings[r],this.history.push({t:"drawings",k:r,n:B,o:i}));for(let[r,i]of Object.entries(this.customHeight))r.startsWith(t)&&(delete this.customHeight[r],this.history.push({t:"customHeight",k:r,n:B,o:i}));for(let[r,i]of Object.entries(this.customWidth))r.startsWith(t)&&(delete this.customWidth[r],this.history.push({t:"customWidth",k:r,n:B,o:i}));for(let[r,i]of Object.entries(this.definedNames))r.startsWith(t)&&(delete this.definedNames[r],this.history.push({t:"definedNames",k:r,n:B,o:i}))}getDefineName(e){let t=e.sheetId||this.currentSheetId;for(let[o,r]of Object.entries(this.definedNames))if(r&&r.row===e.row&&r.col===e.col&&r.sheetId===t)return o;return""}setDefineName(e,t){let o=this.getDefineName(e);o&&Object.prototype.hasOwnProperty.call(this.definedNames,o)&&delete this.definedNames[o];let r={row:e.row,col:e.col,sheetId:this.currentSheetId,colCount:1,rowCount:1};this.definedNames[t]=r,o?(this.history.push({t:"definedNames",k:t,n:r,o:B}),this.history.push({t:"definedNames",k:o,n:B,o:r})):this.history.push({t:"definedNames",k:t,n:r,o:B})}checkDefineName(e){return this.definedNames[e]}setCellValue(e,t){let{row:o,col:r}=t,i=this.currentSheetId;this.worksheets[i]=this.worksheets[i]||{};let s=this.worksheets[i],a=W(o,r);s[a]=s[a]||{};let l=s[a];if(l.value===e)return;let c=l.value??"",h=e??"";s[a].value=h,this.history.push({t:"worksheets",k:`${i}.${a}.value`,n:h,o:c})}setCellFormula(e,t){let{row:o,col:r}=t,i=this.currentSheetId;this.worksheets[i]=this.worksheets[i]||{};let s=this.worksheets[i],a=W(o,r);s[a]=s[a]||{};let c=s[a].formula;c!==e&&(s[a].formula=e,this.history.push({t:"worksheets",k:`${i}.${a}.formula`,n:e,o:c}))}computeAllCell(){for(let[e,t]of Object.entries(this.worksheets))if(t){for(let[o,r]of Object.entries(t))if(r?.formula){let i=this.parseFormula(r.formula),s=i.error?i.error:i.result,a=r.value;s!==a&&(r.value=s,this.history.push({t:"worksheets",k:`${e}.${o}.value`,n:s,o:a}))}}}iterateRange(e,t){let{row:o,col:r,rowCount:i,colCount:s,sheetId:a}=e,l=this.getSheetInfo(a);if(l){if(s===0&&i>0)for(let c=o,h=o+l.rowCount;c<h&&!t(c,r);c++);else if(i===0&&s>0)for(let c=r,h=r+l.colCount;c<h&&!t(o,c);c++);else for(let c=o,h=o+(i||l.rowCount);c<h;c++)for(let d=r,p=r+(s||l.colCount);d<p;d++)if(t(c,d))return}}parseFormula(e){return Ko(e,{get:o=>{let{row:r,col:i,sheetId:s}=o,a=[],l=this.getSheetInfo(s);if(!l||r>=l.rowCount||i>=l.colCount)throw new R("#REF!");return this.iterateRange(o,(c,h)=>{let d=this.getCell(new Fe(c,h,1,1,s));return d&&a.push(d.value),!1}),a},set:()=>{throw new R("#REF!")},convertSheetNameToSheetId:this.convertSheetNameToSheetId},{set:()=>{throw new R("#REF!")},get:o=>this.checkDefineName(o),has:o=>!!this.checkDefineName(o)})}getNextSheetId(e){let t=e||this.currentSheetId,o=this.getSheetList(),r=o.findIndex(a=>a.sheetId===t);fe(r>=0);let i=r===o.length-1,s=i?(r-1+o.length)%o.length:(r+1)%o.length;for(;s!==r&&o[s].isHide;)s=i?(s-1+o.length)%o.length:(s+1)%o.length;return o[s].sheetId}getSheetId(){return this.getSheetList().filter(o=>!o.isHide)[0].sheetId}updateStyle(e,t){if(Ce(e))return;let o=W(t.row,t.col),r=this.currentSheetId;this.worksheets[r]=this.worksheets[r]||{};let i=this.worksheets[r];i[o]=i[o]||{},i[o].style=i[o].style||{};let s=Object.keys(e);for(let a of s){let l=i[o]?.style?.[a],c=e[a];i[o].style[a]=c,this.history.push({t:"worksheets",k:`${r}.${o}.style.${a}`,n:c,o:l===void 0?B:l})}}setStyle(e,t){let o=W(t.row,t.col),r=this.currentSheetId;this.worksheets[r]=this.worksheets[r]||{};let i=this.worksheets[r];i[o]=i[o]||{};let l={...i[o].style||{}};i[o].style=e,this.history.push({t:"worksheets",k:`${r}.${o}.style`,n:e,o:l})}getFloatElementList(e){let t=e||this.currentSheetId;return Object.values(this.drawings).filter(r=>r.sheetId===t)}addFloatElement(e){let t=this.drawings[e.uuid];if(fe(!t,b("uuid-is-duplicate")),e.type==="chart"){let o=e.chartRange,r=!1;this.iterateRange(o,(i,s)=>this.getCell({row:i,col:s,rowCount:1,colCount:1,sheetId:""})?.value?(r=!0,!0):!1),fe(r,b("cells-must-contain-data"))}else e.type==="floating-picture"&&(fe(!!e.imageSrc,b("image-source-is-empty")),typeof e.imageAngle!="number"&&(e.imageAngle=0));this.drawings[e.uuid]=e,this.history.push({t:"drawings",k:e.uuid,n:e,o:B})}updateFloatElement(e,t){let o=this.drawings[e];if(!o)return;let r=Object.keys(t);for(let i of r)if(o[i]!==t[i]){let s=o[i];o[i]=t[i],this.history.push({t:"drawings",k:`${e}.${i}`,n:o[i],o:s})}}deleteFloatElement(e){let t=this.drawings[e];t&&(delete this.drawings[e],this.history.push({t:"drawings",k:e,n:B,o:t}))}getMergeCells(e){let t=e||this.currentSheetId;return Object.values(this.mergeCells).filter(o=>o.sheetId===t)}addMergeCell(e){if(e.colCount>1||e.rowCount>1){e.sheetId=e.sheetId||this.currentSheetId;let t=ke(e,"absolute",this.convertSheetIdToName);fe(!this.mergeCells[t],b("merging-cell-is-duplicate")),this.mergeCells[t]=e,this.history.push({t:"mergeCells",k:t,n:e,o:B})}}deleteMergeCell(e){e.sheetId=e.sheetId||this.currentSheetId;let t=ke(e,"absolute",this.convertSheetIdToName);if(!this.mergeCells[t])return;let o=this.mergeCells[t];delete this.mergeCells[t],this.history.push({t:"mergeCells",k:t,n:B,o})}emitChange(e){e.has("cellValue")&&this.computeAllCell(),e.has("undoRedo")||this.history.commit(),this.history.clear(!1)}};var Cr="data:image/jpeg;base64,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";var kt={currentSheetId:"",rangeMap:{1:{row:2,col:2,rowCount:1,colCount:1,sheetId:"1"},2:{row:4,col:4,rowCount:2,colCount:2,sheetId:"2"},3:{row:4,col:4,rowCount:2,colCount:2,sheetId:"3"}},workbook:{1:{sheetId:"1",name:"basic",isHide:!1,colCount:Ie,rowCount:Se,sort:1},2:{sheetId:"2",name:"floating-picture",isHide:!1,colCount:Ie,rowCount:Se,sort:2,tabColor:"#FE4B4B"},3:{sheetId:"3",name:"hide",isHide:!0,colCount:Ie,rowCount:Se,sort:3},4:{sheetId:"4",name:"chart",isHide:!1,colCount:Ie,rowCount:Se,sort:4,tabColor:"#CEF273"},5:{sheetId:"5",name:"defined name",isHide:!1,colCount:Ie,rowCount:Se,sort:5,tabColor:"#76EFEF"},6:{sheetId:"6",name:"unicode",isHide:!1,colCount:Ie,rowCount:Se,sort:6,tabColor:"#9E6DE3"},7:{sheetId:"7",name:"formula",isHide:!1,colCount:Ie,rowCount:Se,sort:7,tabColor:"#E7258F"}},worksheets:{1:{"0_0":{value:"1",style:{fontColor:"#ff0000"}},"0_3":{value:"large text",style:{fontSize:36}},"0_4":{value:"This is a very long text that needs to be wrapped",style:{isWrapText:!0,isStrike:!0,isItalic:!0,underline:2}},"0_5":{value:"10"},"1_0":{formula:"=SUM(F:F)"},"1_5":{value:"5"},"3_0":{style:{fillColor:"red"}},"3_1":{style:{fillColor:"red"}},"4_0":{style:{fillColor:"red"}},"4_1":{style:{fillColor:"red"}}},2:{"0_0":{formula:"=basic!A1"}},4:{"6_6":{value:3},"6_7":{value:6},"6_8":{value:29},"7_6":{value:35},"7_7":{value:15},"7_8":{value:34},"8_6":{value:23},"8_7":{value:24},"8_8":{value:15}},5:{"0_0":{value:"1"},"0_2":{value:"",formula:"=foo"}},6:{"0_1":{value:"Z\u0351\u036B\u0343\u036A\u0302\u036B\u033D\u034F\u0334\u0319\u0324\u031E\u0349\u035A\u032F\u031E\u0320\u034DA\u036B\u0357\u0334\u0362\u0335\u031C\u0330\u0354L\u0368\u0367\u0369\u0358\u0320G\u0311\u0357\u030E\u0305\u035B\u0341\u0334\u033B\u0348\u034D\u0354\u0339O\u0342\u030C\u030C\u0358\u0328\u0335\u0339\u033B\u031D\u0333!\u033F\u030B\u0365\u0365\u0302\u0363\u0310\u0301\u0301\u035E\u035C\u0356\u032C\u0330\u0319\u0317",style:{fontSize:26}},"0_6":{formula:'=CONCAT("\u{1F60A}", "\u{1F468}\u200D\u{1F468}\u200D\u{1F467}\u200D\u{1F467}", "\u{1F466}\u{1F3FE}")',style:{fontSize:36}},"0_7":{value:"\u1103\u1167\u1109\u1170",style:{fontSize:36}},"0_8":{value:"L\u0301o\u0342r\u030Ce\u0327m\u0305",style:{fontSize:36}},"0_10":{value:"\u{1F337}\u{1F381}\u{1F4A9}\u{1F61C}\u{1F44D}\u{1F3F3}\uFE0F\u200D\u{1F308}"}},7:{"0_0":{formula:"=SUM(1,2)"},"0_1":{value:"test"},"0_2":{formula:"=CONCATENATE(A1,B1)"},"0_3":{formula:'=UNICODE("\u6D4B\u8BD5")'},"1_0":{formula:"=PI()"},"2_0":{formula:"=E()"},"3_0":{formula:"=E()*PI()"},"4_0":{formula:"=SUM(1, SIN(PI()/2),3)"}}},mergeCells:{},customHeight:{},customWidth:{},definedNames:{foo:{row:0,col:0,rowCount:1,colCount:1,sheetId:"5"}},drawings:{}};if(!Ht()){let n=Ae();kt.drawings[n]={title:"icon",type:"floating-picture",uuid:n,imageSrc:Cr,width:200,height:356,originHeight:356,originWidth:200,sheetId:"2",fromCol:1,fromRow:1,marginX:0,marginY:0};let e=Ae();kt.drawings[e]={title:"Chart Title",type:"chart",uuid:e,width:400,height:250,originHeight:250,originWidth:400,marginX:0,marginY:0,sheetId:"4",fromCol:4,fromRow:4,chartType:"bar",chartRange:{row:6,col:6,colCount:3,rowCount:3,sheetId:"4"}}}function Qo(){let n=new co,e=new It(n);return e.addSheet(),window.controller=e,window.model=n,e}function Mi(){location.hostname!=="localhost"&&import("./esm-GQ5D4K7G.js").then(n=>{n.init({dsn:"https://b292d91ba509038c141ecfc7d10e7bb7@o4506851168092160.ingest.sentry.io/4506851171041280",integrations:[n.browserTracingIntegration(),n.replayIntegration({maskAllText:!1,blockAllMedia:!1})],tracesSampleRate:1,tracePropagationTargets:["nusr.github.io"],replaysSessionSampleRate:.1,replaysOnErrorSampleRate:1})})}function Di(n="root"){let e=document.getElementById(n),t=Qo();return(0,yr.createRoot)(e).render(Et.default.createElement(Et.StrictMode,null,Et.default.createElement(Wo,{controller:t}))),t}var bd={initExcel:Di,defaultModel:kt,initSentry:Mi,allFormulas:At};export{bd as default};
//# sourceMappingURL=index.js.map
