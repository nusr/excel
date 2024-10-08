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
var M=Symbol("Comlink.proxy"),O=Symbol("Comlink.endpoint"),z=Symbol("Comlink.releaseProxy"),P=Symbol("Comlink.finalizer"),h=Symbol("Comlink.thrown"),S=e=>typeof e=="object"&&e!==null||typeof e=="function",N={canHandle:e=>S(e)&&e[M],serialize(e){let{port1:t,port2:n}=new MessageChannel;return T(e,t),[n,[n]]},deserialize(e){return e.start(),I(e)}},H={canHandle:e=>S(e)&&h in e,serialize({value:e}){let t;return e instanceof Error?t={isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:t={isError:!1,value:e},[t,[]]},deserialize(e){throw e.isError?Object.assign(new Error(e.value.message),e.value):e.value}},x=new Map([["proxy",N],["throw",H]]);function V(e,t){for(let n of e)if(t===n||n==="*"||n instanceof RegExp&&n.test(t))return!0;return!1}function T(e,t=globalThis,n=["*"]){t.addEventListener("message",function u(r){if(!r||!r.data)return;if(!V(n,r.origin)){console.warn(`Invalid origin '${r.origin}' for comlink proxy`);return}let{id:g,type:s,path:i}=Object.assign({path:[]},r.data),l=(r.data.argumentList||[]).map(d),a;try{let o=i.slice(0,-1).reduce((c,y)=>c[y],e),f=i.reduce((c,y)=>c[y],e);switch(s){case"GET":a=f;break;case"SET":o[i.slice(-1)[0]]=d(r.data.value),a=!0;break;case"APPLY":a=f.apply(o,l);break;case"CONSTRUCT":{let c=new f(...l);a=U(c)}break;case"ENDPOINT":{let{port1:c,port2:y}=new MessageChannel;T(e,y),a=F(c,[c])}break;case"RELEASE":a=void 0;break;default:return}}catch(o){a={value:o,[h]:0}}Promise.resolve(a).catch(o=>({value:o,[h]:0})).then(o=>{let[f,c]=p(o);t.postMessage(Object.assign(Object.assign({},f),{id:g}),c),s==="RELEASE"&&(t.removeEventListener("message",u),A(t),P in e&&typeof e[P]=="function"&&e[P]())}).catch(o=>{let[f,c]=p({value:new TypeError("Unserializable return value"),[h]:0});t.postMessage(Object.assign(Object.assign({},f),{id:g}),c)})}),t.start&&t.start()}function _(e){return e.constructor.name==="MessagePort"}function A(e){_(e)&&e.close()}function I(e,t){return k(e,[],t)}function E(e){if(e)throw new Error("Proxy has been released and is not useable")}function R(e){return m(e,{type:"RELEASE"}).then(()=>{A(e)})}var w=new WeakMap,b="FinalizationRegistry"in globalThis&&new FinalizationRegistry(e=>{let t=(w.get(e)||0)-1;w.set(e,t),t===0&&R(e)});function W(e,t){let n=(w.get(t)||0)+1;w.set(t,n),b&&b.register(e,t,e)}function j(e){b&&b.unregister(e)}function k(e,t=[],n=function(){}){let u=!1,r=new Proxy(n,{get(g,s){if(E(u),s===z)return()=>{j(r),R(e),u=!0};if(s==="then"){if(t.length===0)return{then:()=>r};let i=m(e,{type:"GET",path:t.map(l=>l.toString())}).then(d);return i.then.bind(i)}return k(e,[...t,s])},set(g,s,i){E(u);let[l,a]=p(i);return m(e,{type:"SET",path:[...t,s].map(o=>o.toString()),value:l},a).then(d)},apply(g,s,i){E(u);let l=t[t.length-1];if(l===O)return m(e,{type:"ENDPOINT"}).then(d);if(l==="bind")return k(e,t.slice(0,-1));let[a,o]=L(i);return m(e,{type:"APPLY",path:t.map(f=>f.toString()),argumentList:a},o).then(d)},construct(g,s){E(u);let[i,l]=L(s);return m(e,{type:"CONSTRUCT",path:t.map(a=>a.toString()),argumentList:i},l).then(d)}});return W(r,e),r}function D(e){return Array.prototype.concat.apply([],e)}function L(e){let t=e.map(p);return[t.map(n=>n[0]),D(t.map(n=>n[1]))]}var C=new WeakMap;function F(e,t){return C.set(e,t),e}function U(e){return Object.assign(e,{[M]:!0})}function p(e){for(let[t,n]of x)if(n.canHandle(e)){let[u,r]=n.serialize(e);return[{type:"HANDLER",name:t,value:u},r]}return[{type:"RAW",value:e},C.get(e)||[]]}function d(e){switch(e.type){case"HANDLER":return x.get(e.name).deserialize(e.value);case"RAW":return e.value}}function m(e,t,n){return new Promise(u=>{let r=v();e.addEventListener("message",function g(s){!s.data||!s.data.id||s.data.id!==r||(e.removeEventListener("message",g),u(s.data))}),e.start&&e.start(),e.postMessage(Object.assign({id:r},t),n)})}function v(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}export{T as a,I as b,F as c,U as d};
/*! Bundled license information:

comlink/dist/esm/comlink.mjs:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
//# sourceMappingURL=chunk-PRJU7QU5.js.map
