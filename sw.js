if(!self.define){let e,t={};const a=(a,i)=>(a=new URL(a+".js",i).href,t[a]||new Promise((t=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=t,document.head.appendChild(e)}else e=a,importScripts(a),t()})).then((()=>{let e=t[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(i,s)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(t[r])return;let d={};const o=e=>a(e,r),f={module:{uri:r},exports:d,require:o};t[r]=Promise.all(i.map((e=>f[e]||o(e)))).then((e=>(s(...e),d)))}}define(["./workbox-e3490c72"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-DatX5jgx.js",revision:null},{url:"assets/index-Fa811rHO.css",revision:null},{url:"assets/workbox-window.prod.es5-B9K5rw8f.js",revision:null},{url:"icons/mftc-icon-192.png",revision:"3b46a2af9ad00da86f38a64f31e4fbdf"},{url:"index.html",revision:"3d027abfdba1e9bacd4c0a8b59876d7a"},{url:"manifest.webmanifest",revision:"659e3ffe77048756e4e6eeb37edc0f99"},{url:"simulator-data/aborted-test-early.txt",revision:"2053f2a8cbcf348af8df8ec77d8a2dce"},{url:"simulator-data/aborted-test-low-particle-count.txt",revision:"fddcca07bbb61be6df09168d527f6e06"},{url:"simulator-data/aborted-test-mid-test.txt",revision:"f52882b9bb93e74bfc590353b459355e"},{url:"simulator-data/ambient-levels-wide-swing.txt",revision:"06de12fcbe9b3a1ae9fe8425b9585b16"},{url:"simulator-data/concentrations-only.txt",revision:"873f655c8afbc7a416b6ec3225b3adbb"},{url:"simulator-data/full-test-4-exercises.txt",revision:"73e14f59fb7fa287b807e77c8d6ffe6c"},{url:"simulator-data/startup-data.txt",revision:"aa78c2d13f680474b6b9e00324a0d00e"},{url:"simulator-data/test-data.txt",revision:"c1023dad08169fb7b58fe8ccfe873f49"},{url:"simulator-data/test-sample-1-condensed.txt",revision:"6acc49045deeadfe44d95371468785aa"},{url:"simulator-data/test-sample-1.txt",revision:"d7f2be6c9d713d70fd2dd8eb69d12377"},{url:"vite.svg",revision:"8e3a10e157f75ada21ab742c022d5430"},{url:"vite.svg",revision:"8e3a10e157f75ada21ab742c022d5430"},{url:"icons/mftc-icon-192.png",revision:"3b46a2af9ad00da86f38a64f31e4fbdf"},{url:"simulator-data/aborted-test-early.txt",revision:"2053f2a8cbcf348af8df8ec77d8a2dce"},{url:"simulator-data/aborted-test-low-particle-count.txt",revision:"fddcca07bbb61be6df09168d527f6e06"},{url:"simulator-data/aborted-test-mid-test.txt",revision:"f52882b9bb93e74bfc590353b459355e"},{url:"simulator-data/ambient-levels-wide-swing.txt",revision:"06de12fcbe9b3a1ae9fe8425b9585b16"},{url:"simulator-data/concentrations-only.txt",revision:"873f655c8afbc7a416b6ec3225b3adbb"},{url:"simulator-data/full-test-4-exercises.txt",revision:"73e14f59fb7fa287b807e77c8d6ffe6c"},{url:"simulator-data/startup-data.txt",revision:"aa78c2d13f680474b6b9e00324a0d00e"},{url:"simulator-data/test-data.txt",revision:"c1023dad08169fb7b58fe8ccfe873f49"},{url:"simulator-data/test-sample-1-condensed.txt",revision:"6acc49045deeadfe44d95371468785aa"},{url:"simulator-data/test-sample-1.txt",revision:"d7f2be6c9d713d70fd2dd8eb69d12377"},{url:"manifest.webmanifest",revision:"659e3ffe77048756e4e6eeb37edc0f99"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
