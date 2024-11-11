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
import{Aa as a,Qa as c,a as f,ya as l,za as m}from"./chunk-CRSUINH5.js";function u(s){let e=document.createElement("span");e.style.fontSize="72px",e.innerHTML="mmmmmmmmmmlli",e.style.fontFamily=s,document.body.appendChild(e);let{offsetWidth:n,offsetHeight:i}=e;return document.body.removeChild(e),{offsetHeight:i,offsetWidth:n}}function p(){let s=[f,"serif"],e={},n={};for(let t of s){let{offsetWidth:o,offsetHeight:r}=u(t);e[t]=o,n[t]=r}function i(t){for(let o of s){let{offsetWidth:r,offsetHeight:d}=u(t+","+o);if(r!==e[o]||d!==n[o])return!0}return!1}return i}var F=p();function b(s=F,e=a){let n=localStorage.getItem(m);if(n){let t=JSON.parse(n);if(t.length>0)return t.map(o=>({value:o,label:o,disabled:!1}))}let i=[];for(let t of e)s(t)&&i.push({label:t,value:t,disabled:!1});return typeof window.queryLocalFonts=="function"&&i.push({value:l,label:c("get-all-installed-fonts"),disabled:!1}),i}export{F as a,b};
//# sourceMappingURL=chunk-MBC4APJA.js.map
