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
import{B as i6,Da as V,L as s6,M as l6,Za as U,ka as c}from"./chunk-3OL4F4KC.js";import{b as Q,c as m}from"./chunk-AI5EXC2Q.js";var f=Q((co,c6)=>{"use strict";c6.exports=window.React});var o6=Q((po,p6)=>{"use strict";p6.exports=window.ReactDOM});var P6=Q((Qe,H6)=>{"use strict";H6.exports=window.ReactDOM});var Z=m(f());var L={buttonWrapper:"r",circle:"J",disabled:"K",active:"N",plain:"O",primary:"Q"};var z=(0,Z.memo)(o=>{let{className:e="",onClick:t=l6,disabled:r=!1,active:n=!1,type:a="normal",style:i,testId:l,title:s,dataType:v,buttonType:p,children:d}=o,M=c(L.buttonWrapper,e,{[L.disabled]:r,[L.active]:n,[L.circle]:a==="circle",[L.plain]:a==="plain",[L.primary]:a==="primary"});return Z.default.createElement("button",{onClick:t,style:i,title:s,disabled:r,className:M,"data-testid":l,"data-type":v,type:p},d)});z.displayName="Button";var w=m(f());var d6={githubWrapper:"T"};var m6={transformOrigin:"130px 106px"},E6=(0,w.memo)(()=>w.default.createElement("a",{href:"https://github.com/nusr/excel","aria-label":"View source on Github",target:"_blank",title:"github link",rel:"noreferrer"},w.default.createElement("svg",{className:d6.githubWrapper,viewBox:"0 0 250 250","aria-hidden":!0},w.default.createElement("path",{d:"M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"}),w.default.createElement("path",{d:"M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2",fill:"currentColor",style:m6}),w.default.createElement("path",{d:"M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z",fill:"currentColor",style:m6}))));E6.displayName="Github";var v6=m(f());var u6={baseIcon:"V"};var e6=m(f()),D=({className:o="",paths:e,testId:t})=>e6.default.createElement("svg",{className:c(u6.baseIcon,o),viewBox:"0 0 1137 1024","aria-hidden":!0,"data-testid":t},e.map((r,n)=>e6.default.createElement("path",{d:r.d,key:n,fillOpacity:r["fill-opacity"]})));D.displayName="BaseIcon";var f6=(0,v6.memo)(()=>D({paths:[{d:"M0 0h1024v1024H0z","fill-opacity":".01"},{d:"M496.512 32a128 128 0 0 1 127.84 121.6l0.16 6.4-0.032 113.504 264.256 264.256a32 32 0 0 1-8.16 51.2l-144.064 72.96-269.12 269.12a64 64 0 0 1-90.496 0l-294.144-294.176a64 64 0 0 1 0-90.496l286.016-286.08-0.192-2.048-0.064-2.08V160a128 128 0 0 1 128-128z m-6.464 197.568L128 591.616l294.144 294.144 276.32-276.32 113.792-57.632-187.776-187.776V416a32 32 0 0 1-28.256 31.776l-3.712 0.224a32 32 0 0 1-31.808-28.256L560.512 416l-0.032-115.968-70.432-70.464z m402.016 395.936l1.792 2.24 5.472 8.416c30.112 46.752 45.184 80.032 45.184 99.84a64 64 0 1 1-128 0c0-20.96 16.864-57.024 50.624-108.224a16 16 0 0 1 24.928-2.24zM496.512 96a64 64 0 0 0-63.84 59.2l-0.16 4.8-0.032 36.576 34.944-34.88a32 32 0 0 1 45.248 0l47.808 47.808V160a64 64 0 0 0-59.2-63.84L496.48 96z"}]}));f6.displayName="FillColorIcon";var b6=m(f());var F6={alignCenter:["M142.2 227.6h739.6v56.9H142.2zM142.2 568.9h739.6v56.9H142.2zM256 398.2h512v56.9H256zM256 739.6h512v56.9H256z"],alignLeft:["M627.712 788.48c11.305 0 20.48-9.155 20.48-20.48s-9.175-20.48-20.48-20.48H218.46c-11.305 0-20.48 9.155-20.48 20.48s9.175 20.48 20.48 20.48h409.252zM832.86 583.68h-614.4c-11.305 0-20.48 9.155-20.48 20.48s9.175 20.48 20.48 20.48h614.4c11.305 0 20.48-9.155 20.48-20.48s-9.175-20.48-20.48-20.48zM832.86 256h-614.4c-11.305 0-20.48 9.155-20.48 20.48s9.175 20.48 20.48 20.48h614.4c11.305 0 20.48-9.155 20.48-20.48S844.165 256 832.86 256zM218.46 460.8h409.252c11.305 0 20.48-9.155 20.48-20.48s-9.175-20.48-20.48-20.48H218.46c-11.305 0-20.48 9.155-20.48 20.48s9.155 20.48 20.48 20.48z"],alignRight:["M832.86 747.52H423.588a20.48 20.48 0 1 0 0 40.96H832.84a20.48 20.48 0 0 0 0.02-40.96z m20.48-143.36a20.48 20.48 0 0 0-20.48-20.48h-614.4a20.48 20.48 0 1 0 0 40.96h614.4a20.48 20.48 0 0 0 20.48-20.48zM832.86 256h-614.4a20.48 20.48 0 1 0 0 40.96h614.4a20.48 20.48 0 1 0 0-40.96z m0 163.84H423.588a20.48 20.48 0 1 0 0 40.96H832.84a20.48 20.48 0 0 0 0.02-40.96z"],bold:["M724.342857 477.028571c38.4-40 61.942857-94.057143 61.942857-153.485714v-11.657143C786.285714 188.914286 685.6 89.142857 561.485714 89.142857H223.314286c-17.257143 0-31.314286 14.057143-31.314286 31.314286v776.114286c0 18.628571 15.085714 33.714286 33.714286 33.714285h364.228571c133.714286 0 242.057143-107.657143 242.057143-240.571428v-12.571429c0-83.428571-42.742857-156.914286-107.657143-200.114286zM301.714286 198.857143h256.8c65.257143 0 118.057143 50.742857 118.057143 113.485714v10.857143c0 62.628571-52.914286 113.485714-118.057143 113.485714H301.714286V198.857143z m418.971428 490.742857c0 71.885714-59.085714 130.171429-132 130.171429H301.714286V547.085714h286.971428c72.914286 0 132 58.285714 132 130.171429v12.342857z"],fontColor:["M650.496 597.333333H373.504l-68.266667 170.666667H213.333333l256-640h85.333334l256 640h-91.904l-68.266667-170.666667z m-34.133333-85.333333L512 251.093333 407.637333 512h208.725334zM128 853.333333h768v85.333334H128v-85.333334z"],italic:["M219.428571 949.714286l9.714286-48.571429q3.428571-1.142857 46.571429-12.285714t63.714286-21.428571q16-20 23.428571-57.714286 0.571429-4 35.428571-165.142857t65.142857-310.571429 29.714286-169.428571l0-14.285714q-13.714286-7.428571-31.142857-10.571429t-39.714286-4.571429-33.142857-3.142857l10.857143-58.857143q18.857143 1.142857 68.571429 3.714286t85.428571 4 68.857143 1.428571q27.428571 0 56.285714-1.428571t69.142857-4 56.285714-3.714286q-2.857143 22.285714-10.857143 50.857143-17.142857 5.714286-58 16.285714t-62 19.142857q-4.571429 10.857143-8 24.285714t-5.142857 22.857143-4.285714 26-3.714286 24q-15.428571 84.571429-50 239.714286t-44.285714 203.142857q-1.142857 5.142857-7.428571 33.142857t-11.428571 51.428571-9.142857 47.714286-3.428571 32.857143l0.571429 10.285714q9.714286 2.285714 105.714286 17.714286-1.714286 25.142857-9.142857 56.571429-6.285714 0-18.571429 0.857143t-18.571429 0.857143q-16.571429 0-49.714286-5.714286t-49.142857-5.714286q-78.857143-1.142857-117.714286-1.142857-29.142857 0-81.714286 5.142857t-69.142857 6.285714z"],middleAlign:["M740.43392 788.48c11.30496 0 20.48-9.15456 20.48-20.48s-9.17504-20.48-20.48-20.48L331.18208 747.52c-11.30496 0-20.48 9.15456-20.48 20.48s9.17504 20.48 20.48 20.48L740.43392 788.48zM863.49824 604.16c0-11.32544-9.17504-20.48-20.48-20.48l-614.4 0c-11.30496 0-20.48 9.15456-20.48 20.48s9.17504 20.48 20.48 20.48l614.4 0C854.3232 624.64 863.49824 615.48544 863.49824 604.16zM208.13824 276.48c0 11.32544 9.17504 20.48 20.48 20.48l614.4 0c11.30496 0 20.48-9.15456 20.48-20.48s-9.17504-20.48-20.48-20.48l-614.4 0C217.2928 256 208.13824 265.15456 208.13824 276.48zM740.43392 460.8c11.30496 0 20.48-9.15456 20.48-20.48s-9.17504-20.48-20.48-20.48L331.18208 419.84c-11.30496 0-20.48 9.15456-20.48 20.48s9.17504 20.48 20.48 20.48L740.43392 460.8z"],plus:["M896 468.571429H555.428571V100.571429h-86.857142v368H128c-5.028571 0-9.142857 4.114286-9.142857 9.142857v68.571428c0 5.028571 4.114286 9.142857 9.142857 9.142857h340.571429v368h86.857142V555.428571h340.571429c5.028571 0 9.142857-4.114286 9.142857-9.142857v-68.571428c0-5.028571-4.114286-9.142857-9.142857-9.142857z"],redo:["M611.783111 569.344L549.622519 644.740741h284.444444l-65.498074-265.481482-59.922963 72.666074c-35.422815-28.48237-108.278519-68.342519-238.667852-68.342518-202.827852 0-280.651852 206.01363-280.651852 206.013629s116.318815-132.778667 246.215111-132.778666c97.204148-0.037926 153.865481 74.827852 176.241778 112.526222z"],underline:["M512 725.333333c166.4 0 298.666667-132.266667 298.666667-298.666666V128c0-25.6-17.066667-42.666667-42.666667-42.666667s-42.666667 17.066667-42.666667 42.666667v298.666667c0 119.466667-93.866667 213.333333-213.333333 213.333333s-213.333333-93.866667-213.333333-213.333333V128c0-25.6-17.066667-42.666667-42.666667-42.666667s-42.666667 17.066667-42.666667 42.666667v298.666667c0 166.4 132.266667 298.666667 298.666667 298.666666zM853.333333 853.333333H170.666667c-25.6 0-42.666667 17.066667-42.666667 42.666667s17.066667 42.666667 42.666667 42.666667h682.666666c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666667z"],undo:["M489.244444 568.888889l60.681482 75.851852H265.481481l64.474075-265.481482 60.681481 72.05926c34.133333-30.340741 109.985185-68.266667 238.933333-68.266667 201.007407 0 280.651852 204.8 280.651852 204.8S792.651852 455.111111 663.703704 455.111111c-98.607407 0-155.496296 75.851852-174.45926 113.777778z"],success:["M666.272 472.288l-175.616 192a31.904 31.904 0 0 1-23.616 10.4h-0.192a32 32 0 0 1-23.68-10.688l-85.728-96a32 32 0 1 1 47.744-42.624l62.144 69.6 151.712-165.888a32 32 0 1 1 47.232 43.2m-154.24-344.32C300.224 128 128 300.32 128 512c0 211.776 172.224 384 384 384 211.68 0 384-172.224 384-384 0-211.68-172.32-384-384-384"],info:["M512 97.52381c228.912762 0 414.47619 185.563429 414.47619 414.47619s-185.563429 414.47619-414.47619 414.47619S97.52381 740.912762 97.52381 512 283.087238 97.52381 512 97.52381z m36.571429 341.333333h-73.142858v292.571428h73.142858V438.857143z m0-121.904762h-73.142858v73.142857h73.142858v-73.142857z"],warning:["M512 64q190.016 4.992 316.512 131.488T960 512q-4.992 190.016-131.488 316.512T512 960q-190.016-4.992-316.512-131.488T64 512q4.992-190.016 131.488-316.512T512 64z m0 192q-26.016 0-43.008 19.008T453.984 320l23.008 256q2.016 14.016 11.488 22.496t23.488 8.512 23.488-8.512 11.488-22.496l23.008-256q2.016-26.016-15.008-44.992T511.936 256z m0 512q22.016-0.992 36.512-15.008t14.496-36-14.496-36.512T512 665.984t-36.512 14.496-14.496 36.512 14.496 36T512 768z"],error:["M512 97.52381c228.912762 0 414.47619 185.563429 414.47619 414.47619s-185.563429 414.47619-414.47619 414.47619S97.52381 740.912762 97.52381 512 283.087238 97.52381 512 97.52381z m129.29219 233.447619l-129.267809 129.29219-129.316571-129.29219-51.736381 51.736381 129.316571 129.267809-129.316571 129.316571 51.736381 51.736381L512 563.687619l129.29219 129.316571 51.736381-51.73638L563.687619 512l129.316571-129.29219-51.73638-51.736381z"],rotate:["M934.08 416.448h-220.352a46.4 46.4 0 0 1-47.232-47.232c0-26.752 20.48-47.232 47.232-47.232h173.184V148.8c0-26.752 20.48-47.168 47.168-47.168 26.816 0 47.232 20.48 47.232 47.168V369.28a47.36 47.36 0 0 1-47.232 47.232z","M509.056 978.432A470.976 470.976 0 0 1 38.4 507.712 470.976 470.976 0 0 1 509.056 37.12a472.32 472.32 0 0 1 434.56 288.064c9.408 23.68-1.6 51.968-25.216 61.44-23.68 9.408-51.968-1.6-61.44-25.216a377.92 377.92 0 0 0-347.904-229.824 376.192 376.192 0 1 0 0 752.448c190.528 0 351.104-141.696 373.12-328.96a47.36 47.36 0 0 1 51.904-40.96 47.36 47.36 0 0 1 40.96 51.904 469.504 469.504 0 0 1-465.92 412.48z"],moon:["M735.996 244.2C693.136 221.106 644.1 208 592 208c-167.894 0-304 136.106-304 304s136.106 304 304 304c52.1 0 101.136-13.106 143.996-36.2C621.368 744.742 538 638.108 538 512s83.368-232.742 197.996-267.8z m26.32 86.064C683.17 354.472 628 427.888 628 512s55.168 157.528 134.318 181.736c76.442 23.378 86.74 127.376 16.37 165.294C721.764 889.702 657.958 906 592 906c-217.6 0-394-176.4-394-394S374.4 118 592 118c65.96 0 129.764 16.298 186.688 46.97 70.372 37.918 60.072 141.916-16.37 165.294z"],sun:["M512 768c-140.8 0-256-115.2-256-256s115.2-256 256-256 256 115.2 256 256-115.2 256-256 256z m0-426.666667c-93.866667 0-170.666667 76.8-170.666667 170.666667s76.8 170.666667 170.666667 170.666667 170.666667-76.8 170.666667-170.666667-76.8-170.666667-170.666667-170.666667zM512 170.666667c-25.6 0-42.666667-17.066667-42.666667-42.666667V42.666667c0-25.6 17.066667-42.666667 42.666667-42.666667s42.666667 17.066667 42.666667 42.666667v85.333333c0 25.6-17.066667 42.666667-42.666667 42.666667zM512 1024c-25.6 0-42.666667-17.066667-42.666667-42.666667v-85.333333c0-25.6 17.066667-42.666667 42.666667-42.666667s42.666667 17.066667 42.666667 42.666667v85.333333c0 25.6-17.066667 42.666667-42.666667 42.666667zM238.933333 281.6c-12.8 0-21.333333-4.266667-29.866666-12.8L149.333333 209.066667c-17.066667-17.066667-17.066667-42.666667 0-59.733334s42.666667-17.066667 59.733334 0l59.733333 59.733334c17.066667 17.066667 17.066667 42.666667 0 59.733333-4.266667 8.533333-17.066667 12.8-29.866667 12.8zM844.8 887.466667c-12.8 0-21.333333-4.266667-29.866667-12.8l-59.733333-59.733334c-17.066667-17.066667-17.066667-42.666667 0-59.733333s42.666667-17.066667 59.733333 0l59.733334 59.733333c17.066667 17.066667 17.066667 42.666667 0 59.733334-8.533333 8.533333-21.333333 12.8-29.866667 12.8zM128 554.666667H42.666667c-25.6 0-42.666667-17.066667-42.666667-42.666667s17.066667-42.666667 42.666667-42.666667h85.333333c25.6 0 42.666667 17.066667 42.666667 42.666667s-17.066667 42.666667-42.666667 42.666667zM981.333333 554.666667h-85.333333c-25.6 0-42.666667-17.066667-42.666667-42.666667s17.066667-42.666667 42.666667-42.666667h85.333333c25.6 0 42.666667 17.066667 42.666667 42.666667s-17.066667 42.666667-42.666667 42.666667zM179.2 887.466667c-12.8 0-21.333333-4.266667-29.866667-12.8-17.066667-17.066667-17.066667-42.666667 0-59.733334l59.733334-59.733333c17.066667-17.066667 42.666667-17.066667 59.733333 0s17.066667 42.666667 0 59.733333l-59.733333 59.733334c-8.533333 8.533333-17.066667 12.8-29.866667 12.8zM785.066667 281.6c-12.8 0-21.333333-4.266667-29.866667-12.8-17.066667-17.066667-17.066667-42.666667 0-59.733333l59.733333-59.733334c17.066667-17.066667 42.666667-17.066667 59.733334 0s17.066667 42.666667 0 59.733334l-59.733334 59.733333c-8.533333 8.533333-21.333333 12.8-29.866666 12.8z"],down:["M512.146286 619.52L245.296762 352.792381 193.584762 404.48l318.585905 318.415238 318.268952-318.415238-51.736381-51.687619z"],menu:["M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zM904 784H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zM904 472H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"],confirm:["M394.792 797.429c-9.71 0-19.443-3.513-27.137-10.622L87.488 527.917c-16.225-14.993-17.224-40.3-2.231-56.525 14.993-16.226 40.3-17.225 56.524-2.231l280.167 258.89c16.225 14.993 17.224 40.3 2.231 56.524-7.883 8.532-18.62 12.854-29.387 12.854z","M394.808 797.429c-10.555 0-21.088-4.15-28.949-12.391-15.249-15.984-14.652-41.304 1.333-56.553l514.564-490.858c15.983-15.249 41.303-14.652 56.553 1.333 15.248 15.985 14.651 41.305-1.334 56.553l-514.563 490.86c-7.745 7.387-17.684 11.056-27.604 11.056z"],horizontalLeft:["M484.693 477.013h-371.2a32 32 0 0 0-32 32v32a32 32 0 0 0 32 32h371.2a32 32 0 0 0 32-32v-32a32 32 0 0 0-32-32z m435.2-338.133h-806.4a32 32 0 0 0-32 31.787v32a32 32 0 0 0 32 32h806.4a32 32 0 0 0 32-32v-32a32 32 0 0 0-32-32z m0 674.133h-806.4a32 32 0 0 0-32 32v32a32 32 0 0 0 32 32h806.4a32 32 0 0 0 32-32v-32a32 32 0 0 0-32-32z"],horizontalRight:["M922.453 472.107H551.04a32 32 0 0 0-32 32v32a32 32 0 0 0 32 32h371.413a32 32 0 0 0 32-32v-32a32 32 0 0 0-32-32z m0 337.066H115.84a32 32 0 0 0-32 32v32a32 32 0 0 0 32 32h806.613a32 32 0 0 0 32-32v-32a32 32 0 0 0-32-32z m0-674.133H115.84a32 32 0 0 0-32 32v32a32 32 0 0 0 32 32h806.613a32 32 0 0 0 32-32v-32a32 32 0 0 0-32-32z"],horizontalCenter:["M697.6 472.107H326.4a32 32 0 0 0-32 32v32a32 32 0 0 0 32 32h371.2a32 32 0 0 0 32-32v-32a32 32 0 0 0-32-32zM915.2 135.04H108.8a32 32 0 0 0-32 32v32a32 32 0 0 0 32 32h806.4a32 32 0 0 0 32-32v-32a32 32 0 0 0-32-32z m0 674.133H108.8a32 32 0 0 0-32 32v32a32 32 0 0 0 32 32h806.4a32 32 0 0 0 32-32v-32a32 32 0 0 0-32-32z"],verticalTop:["M902.890667 125.482667H121.109333a9.045333 9.045333 0 0 0-9.109333 8.981333v67.413333c0 4.949333 4.053333 9.002667 9.109333 9.002667h781.781334c5.056 0 9.109333-4.053333 9.109333-9.002667v-67.413333a9.045333 9.045333 0 0 0-9.109333-8.981333z m-383.808 210.112a8.96 8.96 0 0 0-14.165334 0l-125.845333 159.210666a8.96 8.96 0 0 0 7.082667 14.506667h83.029333v380.224c0 4.928 4.053333 8.981333 9.002667 8.981333h67.413333c4.949333 0 8.981333-4.053333 8.981333-8.981333V509.418667H637.866667a8.96 8.96 0 0 0 7.082666-14.506667l-125.866666-159.317333z"],verticalMiddle:["M512 614.4l117.028571 153.6h-73.142857V950.857143H468.114286v-182.857143h-73.142857L512 614.4z m438.857143-153.6v102.4H73.142857V460.8h877.714286zM555.885714 73.142857v182.857143h73.142857L512 409.6 394.971429 256h73.142857V73.142857h87.771428z"],verticalBottom:["M902.890667 813.12H121.109333a9.045333 9.045333 0 0 0-9.109333 9.002667v67.413333c0 4.928 4.053333 8.981333 9.109333 8.981333h781.781334c5.056 0 9.109333-4.053333 9.109333-8.981333v-67.413333a9.045333 9.045333 0 0 0-9.109333-9.002667zM504.917333 688.426667a8.96 8.96 0 0 0 14.165334 0l125.845333-159.210667a8.96 8.96 0 0 0-7.082667-14.506667h-83.264V134.464a9.024 9.024 0 0 0-8.981333-8.981333h-67.413333a9.024 9.024 0 0 0-9.002667 8.981333v380.117333h-83.029333a8.96 8.96 0 0 0-7.082667 14.506667l125.866667 159.317333z"]},g6=F6;var q=(0,b6.memo)(({name:o,className:e="",testId:t})=>{let r=g6[o].map(n=>({d:n}));return D({className:e,paths:r,testId:t})});q.displayName="Icon";var u=m(f());var k={selectList:"W",selectItem:"d",disabled:"g","popup-container":"a",top:"X",active:"x","popup-item":"c","popup-item-icon":"_","popup-item-content":"rr","select-list-container":"n","select-list-trigger":"h"};var X=m(f());function _(o){let e=(0,X.useRef)(null);function t(r){if(!e?.current)return;let n=r.target;e.current===n||e.current.contains(n)||o()}return(0,X.useEffect)(()=>(document.addEventListener("pointerdown",t),()=>{document.removeEventListener("pointerdown",t)}),[]),[e]}var t6=m(f());function $(o){let e=(0,t6.useRef)(o),t=(0,t6.useRef)(r=>{e.current&&e.current(r)});return e.current=o,t.current}var G=m(f());function q6(){let[o,e]=(0,G.useState)(0);return(0,G.useEffect)(()=>{let t=0,r=performance.now(),n;function a(){t++;let i=(performance.now()-r)/1e3;if(i>1){let l=t/i;e(Math.round(l)),t=0,r=performance.now()}n=requestAnimationFrame(a)}return n=requestAnimationFrame(a),()=>{cancelAnimationFrame(n)}},[]),o}var V6=(0,u.memo)(o=>{let{data:e,value:t,className:r,onChange:n,getItemStyle:a,title:i,defaultValue:l,testId:s}=o,v=(0,u.useCallback)(p=>{n(p.target.value)},[]);return u.default.createElement("select",{onChange:v,value:t,defaultValue:l,name:"select",className:c(k.selectList,r),title:i,"data-testid":s},e.map(p=>{let d=typeof p=="object"?p.value:p,M=typeof p=="object"?p.label:p,I=typeof p=="object"?p.disabled:!1,S;return typeof a=="function"&&(S=a(d)),u.default.createElement("option",{key:d,value:d,disabled:!!I,className:c(k.selectItem,{[k.disabled]:I}),style:S},M)}))});V6.displayName="Select";var h6=(0,u.memo)(({onChange:o,value:e,active:t,data:r,className:n,position:a="bottom",testId:i})=>{let[l]=_(()=>o("")),s=(0,u.useCallback)(v=>{let p=v.target.dataset?.value;p&&o(p)},[o]);return u.default.createElement("div",{className:c(k["popup-container"],n,a==="top"?k.top:"",{[k.active]:t}),onClick:s,ref:l,"data-testid":i},r.map(v=>u.default.createElement("div",{key:v.value,className:k["popup-item"]},u.default.createElement("span",{className:k["popup-item-content"],"data-value":v.value},v.label),v.value==e&&u.default.createElement("span",{className:k["popup-item-icon"]},u.default.createElement(q,{name:"confirm"})))))});h6.displayName="SelectPopup";var D6=(0,u.memo)(({children:o,value:e,data:t,onChange:r,position:n,testId:a,className:i})=>{let[l,s]=(0,u.useState)(!1),v=(0,u.useCallback)(()=>{s(d=>!d)},[]),p=(0,u.useCallback)(d=>{s(!1),d&&r(d)},[r]);return u.default.createElement("div",{className:c(k["select-list-container"],i,{[k.active]:l}),"data-testid":a},o,u.default.createElement(z,{className:k["select-list-trigger"],onClick:v,testId:`${a}-trigger`,type:"plain"},u.default.createElement(q,{name:"down"})),l&&t.length>0&&u.default.createElement(h6,{active:!0,value:e,data:t,onChange:p,position:n,testId:`${a}-popup`}))});D6.displayName="SelectList";var b=m(f());var C={container:"nr",portal:"lr",menuContainer:"v",bottom:"sr",subMenuContainer:"pr",menu:"br",small:"gr",menuItem:"o",active:"xr",trigger:"cr"};var re=({onClick:o,children:e,testId:t,active:r=!1})=>b.default.createElement("li",{className:c(C.menuItem,{[C.active]:r}),onClick:o,"data-testid":t},e),ne=({label:o,children:e,testId:t,className:r,portalClassName:n})=>{let[a,i]=(0,b.useState)(!1),l=(0,b.useCallback)(()=>{i(s=>!s)},[]);return b.default.createElement("li",{className:c(C.menuItem,r),onClick:l,"data-testid":t},b.default.createElement("div",null,o),a&&b.default.createElement("div",{className:c(C.subMenuContainer,C.portal,n)},b.default.createElement("ul",{className:C.menu},e)))},A6=(0,b.memo)(({label:o,children:e,testId:t,className:r,isPlain:n=!1,position:a="right",size:i="normal",portalClassName:l})=>{let s=n?"plain":void 0,[v,p]=(0,b.useState)(!1),d=(0,b.useCallback)(()=>{p(S=>!S)},[]),M=(0,b.useCallback)(()=>{p(!1)},[]),[I]=_(M);return b.default.createElement("div",{className:c(C.container,r,{[C.small]:i==="small"}),ref:I,"data-testid":t},b.default.createElement(z,{onClick:d,testId:`${t}-trigger`,type:s,className:C.trigger},o),v&&b.default.createElement("div",{className:c(C.menuContainer,C.portal,l,{[C.bottom]:a==="bottom"}),"data-testid":`${t}-portal`},b.default.createElement("ul",{className:C.menu},e)))});A6.displayName="Menu";var h=m(f());var H={"color-picker":"l","color-picker-wrapper":"s",top:"Zr",right:"Br","color-picker-list":"Hr","color-picker-item":"p","no-fill":"Ar",reset:"Fr"};var B=m(f());var W=m(f());var P=m(f());var r6=(o,e=0,t=1)=>o>t?t:o<e?e:o;var x={"color-picker-panel":"Lr","color-picker-panel__saturation":"f","color-picker-panel__pointer-fill":"Sr","color-picker-panel__hue":"m","color-picker-panel__last-control":"Mr","color-picker-panel__interactive":"w","color-picker-panel__pointer":"y","color-picker-panel__saturation-pointer":"Ur","color-picker-panel__hue-pointer":"Yr"};var j6=200,Z6=234,C6=(o,e,t)=>{let r=o.getBoundingClientRect();return{left:r6((e-r.left)/(r.width||Z6)),top:r6((t-r.top)/(r.height||j6))}},X6=({onMove:o,testId:e,...t})=>{let r=(0,P.useRef)(null),n=$(o),[a,i]=(0,P.useMemo)(()=>{let l=d=>{r.current&&(d.preventDefault(),r.current.focus(),n(C6(r.current,d.clientX,d.clientY)),p(!0))},s=d=>{d.buttons<=0||r.current&&(d.preventDefault(),n(C6(r.current,d.clientX,d.clientY)))},v=()=>p(!1);function p(d){let M=d?document.body.addEventListener:document.body.removeEventListener;M("pointermove",s),M("pointerup",v)}return[l,p]},[n]);return(0,P.useEffect)(()=>i,[i]),P.default.createElement("div",{...t,onPointerDown:a,className:x["color-picker-panel__interactive"],ref:r,tabIndex:0,role:"slider","data-testid":e})},J=P.default.memo(X6);var n6=m(f());var Y=({className:o,color:e,left:t,top:r=.5})=>{let n={top:`${r*100}%`,left:`${t*100}%`};return n6.default.createElement("div",{className:c(x["color-picker-panel__pointer"],o),style:n},n6.default.createElement("div",{className:x["color-picker-panel__pointer-fill"],style:{backgroundColor:e}}))};var g=(o,e=0,t=Math.pow(10,e))=>Math.round(t*o)/t;var x6=o=>{let e=G6(o);return Q6(e)},G6=o=>(o[0]==="#"&&(o=o.substring(1)),o.length<6?{r:parseInt(o[0]+o[0],16),g:parseInt(o[1]+o[1],16),b:parseInt(o[2]+o[2],16),a:o.length===4?g(parseInt(o[3]+o[3],16)/255,2):1}:{r:parseInt(o.substring(0,2),16),g:parseInt(o.substring(2,4),16),b:parseInt(o.substring(4,6),16),a:o.length===8?g(parseInt(o.substring(6,8),16)/255,2):1}),k6=o=>K6(Y6(o)),J6=({h:o,s:e,v:t,a:r})=>{let n=(200-e)*t/100;return{h:g(o),s:g(n>0&&n<200?e*t/100/(n<=100?n:200-n)*100:0),l:g(n/2),a:g(r,2)}},A=o=>{let{h:e,s:t,l:r}=J6(o);return`hsl(${e}, ${t}%, ${r}%)`},Y6=({h:o,s:e,v:t,a:r})=>{o=o/360*6,e=e/100,t=t/100;let n=Math.floor(o),a=t*(1-e),i=t*(1-(o-n)*e),l=t*(1-(1-o+n)*e),s=n%6;return{r:g([t,i,a,a,l,t][s]*255),g:g([l,t,t,i,a,a][s]*255),b:g([a,a,l,t,t,i][s]*255),a:g(r,2)}},K=o=>{let e=o.toString(16);return e.length<2?"0"+e:e},K6=({r:o,g:e,b:t,a:r})=>{let n=r<1?K(g(r*255)):"";return"#"+K(o)+K(e)+K(t)+n},Q6=({r:o,g:e,b:t,a:r})=>{let n=Math.max(o,e,t),a=n-Math.min(o,e,t),i=a?n===o?(e-t)/a:n===e?2+(t-o)/a:4+(o-e)/a:0;return{h:g(60*(i<0?i+6:i)),s:g(n?a/n*100:0),v:g(n/255*100),a:r}};var U6=({className:o,hue:e,testId:t,onChange:r})=>{let n=a=>{r({h:360*a.left})};return W.default.createElement("div",{className:c(x["color-picker-panel__hue"],o)},W.default.createElement(J,{onMove:n,"aria-label":"Hue","aria-valuenow":g(e),"aria-valuemax":"360","aria-valuemin":"0",testId:`${t}-hue`},W.default.createElement(Y,{className:x["color-picker-panel__hue-pointer"],left:e/360,color:A({h:e,s:100,v:100,a:1})})))},y6=W.default.memo(U6);var E=m(f());var oo=({hsva:o,testId:e,onChange:t})=>{let r=(0,E.useCallback)(a=>{t({s:a.left*100,v:100-a.top*100})},[]),n={backgroundColor:A({h:o.h,s:100,v:100,a:1})};return E.default.createElement("div",{className:x["color-picker-panel__saturation"],style:n},E.default.createElement(J,{onMove:r,"aria-label":"Color","aria-valuetext":`Saturation ${g(o.s)}%, Brightness ${g(o.v)}%`,testId:`${e}-saturation`},E.default.createElement(Y,{className:x["color-picker-panel__saturation-pointer"],top:1-o.v/100,left:o.s/100,color:A(o)})))},M6=E.default.memo(oo);var N=m(f());function I6(o,e,t){let r=$(t),[n,a]=(0,N.useState)(()=>o.toHsva(e)),i=(0,N.useRef)({color:e,hsva:n});(0,N.useEffect)(()=>{if(!o.equal(e,i.current.color)){let s=o.toHsva(e);i.current={hsva:s,color:e},a(s)}},[e,o]),(0,N.useEffect)(()=>{let s;!s6(n,i.current.hsva)&&!o.equal(s=o.fromHsva(n),i.current.color)&&(i.current={hsva:n,color:s},r(s))},[n,o,r]);let l=(0,N.useCallback)(s=>{a(v=>Object.assign({},v,s))},[]);return[n,l]}var eo=({className:o,colorModel:e,color:t,onChange:r,testId:n})=>{let[a,i]=I6(e,t||e.defaultColor,r);return B.default.createElement("div",{className:c(x["color-picker-panel"],o)},B.default.createElement(M6,{hsva:a,onChange:i,testId:n}),B.default.createElement(y6,{hue:a.h,onChange:i,className:x["color-picker-panel__last-control"],testId:n}))},to={defaultColor:"#000",toHsva:x6,fromHsva:({h:o,s:e,v:t})=>k6({h:o,s:e,v:t,a:1}),equal:(o,e)=>{let t=U(o),r=U(e);return t===r}},z6=(0,B.memo)(o=>B.default.createElement(eo,{className:o.className,color:o.color,onChange:o.onChange,testId:o.testId,colorModel:to}));var ro=(0,h.memo)(o=>{let{onChange:e,children:t,color:r,position:n="bottom",testId:a,className:i}=o,[l,s]=(0,h.useState)(!1),[v]=_(()=>{s(!1)}),p=(0,h.useCallback)(()=>{s(!0)},[]),d=(0,h.useCallback)(()=>{e("")},[]),M=(0,h.useCallback)(I=>{let S=I.target?.dataset?.value;S&&e(S)},[]);return h.default.createElement("div",{className:c(H["color-picker"],i,{[H.top]:n==="top",[H.right]:n==="right"}),ref:v},h.default.createElement("div",{className:H["color-picker-trigger"],onClick:p,"data-testid":`${a}-trigger`},t),l&&h.default.createElement("div",{className:c(H["color-picker-wrapper"])},h.default.createElement("div",{className:H["color-picker-list"],onClick:M,"data-testid":`${a}-list`},i6.map(I=>h.default.createElement("div",{key:I,className:H["color-picker-item"],style:{backgroundColor:I},"data-value":I}))),h.default.createElement("div",null,h.default.createElement(z6,{color:r,onChange:e,testId:a})),h.default.createElement("div",null,h.default.createElement(z,{type:"normal",className:H.reset,onClick:d,testId:`${a}-reset`},V("reset")))))});ro.displayName="ColorPicker";var y=m(f()),N6=m(P6()),w6=m(o6());var F={"dialog-modal":"or","dialog-container":"er","dialog-title":"ir","dialog-content":"tr","dialog-button":"dr","dialog-cancel":"ar"};var T6=(0,y.memo)(o=>{let{children:e,title:t,className:r,onCancel:n,onOk:a,visible:i,getContainer:l=()=>document.body,testId:s}=o;if(!i)return;let v=s?`${s}-cancel`:void 0,p=s?`${s}-confirm`:void 0;return(0,N6.createPortal)(y.default.createElement("div",{className:F["dialog-modal"],"data-testid":s},y.default.createElement("div",{className:c(F["dialog-container"],r)},y.default.createElement("div",{className:F["dialog-title"]},t),y.default.createElement("div",{className:F["dialog-content"]},e),y.default.createElement("div",{className:F["dialog-button"]},y.default.createElement(z,{onClick:n,testId:v},V("cancel")),y.default.createElement(z,{onClick:a,className:F["dialog-cancel"],type:"primary",testId:p},V("confirm"))))),l())});T6.displayName="Dialog";function it(o){let e=document.createDocumentFragment(),t;function r(){t?.unmount(),t=void 0}function n(i){t=t||(0,w6.createRoot)(e),t.render(y.default.createElement(T6,{visible:i.visible,title:i.title,className:i.className,onCancel:l=>{l.stopPropagation(),i.onCancel&&i.onCancel(l),r()},onOk:l=>{l.stopPropagation(),i.onOk&&i.onOk(l),r()},testId:i.testId},i.children))}function a(i){n(i)}return n(o),{close:r,update:a}}var R=m(f()),S6=m(o6());var O={container:"hr",content:"vr",toast:"ur",icon:"fr",success:"mr",success_icon:"wr",error:"yr",error_icon:"kr",info:"Cr",info_icon:"zr",warning:"Pr",warning_icon:"Rr"};var io=({message:o,type:e,testId:t})=>R.default.createElement("div",{className:c(O.toast,O[e]),"data-testid":t},R.default.createElement(q,{name:e,className:c(O[`${e}_icon`],O.icon)}),R.default.createElement("div",{className:O.content},o));function T(o){let{duration:e=3,...t}=o,r=document.createElement("div");r.className=O.container,document.body.appendChild(r);let n=(0,S6.createRoot)(r);n.render(R.default.createElement(io,{...t}));function a(){r&&(n.unmount(),document.body.removeChild(r),r=void 0)}return setTimeout(a,e*1e3),a}T.error=function(o,e="error-toast"){return T({message:o,type:"error",testId:e})};T.info=function(o,e="info-toast"){return T({message:o,type:"info",testId:e})};T.warning=function(o,e="warning-toast"){return T({message:o,type:"warning",testId:e})};T.success=function(o,e="success-toast"){return T({message:o,type:"success",testId:e})};var j=m(f());var a6={container:"jr",loading:"Ir",rotation:"u"};var lo=(0,j.memo)(()=>j.default.createElement("div",{className:a6.container},j.default.createElement("div",{className:a6.loading})));lo.displayName="Loading";export{f as a,o6 as b,z as c,E6 as d,f6 as e,q as f,_ as g,q6 as h,V6 as i,h6 as j,D6 as k,it as l,re as m,ne as n,A6 as o,T as p,ro as q};
//# sourceMappingURL=chunk-2WXICHEX.js.map
