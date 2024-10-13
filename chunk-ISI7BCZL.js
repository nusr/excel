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
import{a as l,q as r,y as i,ya as n}from"./chunk-5HPRGV2K.js";var e=class{constructor(t){this.listeners=new Set;this.setState=(t,s)=>{Array.isArray(t)&&(s=!0);let o=typeof t=="function"?t(this.state):t;if(!Object.is(this.state,o)){let a=this.state;this.state=s??(typeof o!="object"||o===null)?o:Object.assign({},this.state,o);for(let p of this.listeners)p(this.state,a)}};this.subscribe=t=>(this.listeners.add(t),()=>this.listeners.delete(t));this.getSnapshot=()=>this.state;this.state=t}};var m=new e([]);var S={value:"",displayValue:"",row:0,col:0,left:r,top:r,width:0,height:0,defineName:"",rowCount:1,colCount:1},f=new e(S);var c=new e({editorStatus:0,canRedo:!1,canUndo:!1,activeUuid:"",currentSheetId:""});var y=new e([]);var T=new e([]);var u={isBold:!1,isItalic:!1,isStrike:!1,fontColor:n("contentColor"),fontSize:l,fontFamily:"",fillColor:"",isWrapText:!1,underline:0,verticalAlign:0,horizontalAlign:0,numberFormat:i,isMergeCell:!1,mergeType:""},d=new e(u);var h=new e({scrollTop:0,scrollLeft:0,showBottomBar:!1});var x=new e([]);export{m as a,f as b,c,y as d,h as e,T as f,x as g,d as h};
//# sourceMappingURL=chunk-ISI7BCZL.js.map
