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
import{Ta as p,a as n,p as l,w as a}from"./chunk-3OL4F4KC.js";var e=class{constructor(t){this.listeners=new Set;this.setState=(t,o)=>{Array.isArray(t)&&(o=!0);let i=!o&&t&&typeof t=="object"&&Object.entries(t).every(([r,s])=>Object.is(this.state[r],s));if(i)return i;if(!Object.is(this.state,t)){let r=this.state;this.state=o??(typeof t!="object"||t===null)?t:Object.assign({},this.state,t);for(let s of this.listeners)s(this.state,r)}};this.subscribe=t=>(this.listeners.add(t),()=>this.listeners.delete(t));this.getSnapshot=()=>this.state;this.state=t}};var m=new e([]);var f={value:"",displayValue:"",row:0,col:0,left:l,top:l,width:0,height:0,defineName:"",rowCount:1,colCount:1},c=new e(f);var S=new e({editorStatus:0,canRedo:!1,canUndo:!1,activeUuid:"",currentSheetId:""});var y=new e([]);var T=new e([]);var u={isBold:!1,isItalic:!1,isStrike:!1,fontColor:p("contentColor"),fontSize:n,fontFamily:"",fillColor:"",isWrapText:!1,underline:0,verticalAlign:0,horizontalAlign:0,numberFormat:a,isMergeCell:!1,mergeType:""},d=new e(u);var h=new e({scrollTop:0,scrollLeft:0,showBottomBar:!1});var b=new e([]);export{m as a,c as b,S as c,y as d,h as e,T as f,b as g,d as h};
//# sourceMappingURL=chunk-BKOMAG5H.js.map
