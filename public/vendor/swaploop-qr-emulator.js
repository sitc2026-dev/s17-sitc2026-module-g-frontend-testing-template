var SwapLoopQrEmulator=(function(j){"use strict";function ne(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var _={},Q,bt;function re(){return bt||(bt=1,Q=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}),Q}var J={},k={},Et;function x(){if(Et)return k;Et=1;let i;const r=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];return k.getSymbolSize=function(e){if(!e)throw new Error('"version" cannot be null or undefined');if(e<1||e>40)throw new Error('"version" should be in range from 1 to 40');return e*4+17},k.getSymbolTotalCodewords=function(e){return r[e]},k.getBCHDigit=function(o){let e=0;for(;o!==0;)e++,o>>>=1;return e},k.setToSJISFunction=function(e){if(typeof e!="function")throw new Error('"toSJISFunc" is not a valid function.');i=e},k.isKanjiModeEnabled=function(){return typeof i<"u"},k.toSJIS=function(e){return i(e)},k}var O={},Ct;function Y(){return Ct||(Ct=1,(function(i){i.L={bit:1},i.M={bit:0},i.Q={bit:3},i.H={bit:2};function r(o){if(typeof o!="string")throw new Error("Param is not a string");switch(o.toLowerCase()){case"l":case"low":return i.L;case"m":case"medium":return i.M;case"q":case"quartile":return i.Q;case"h":case"high":return i.H;default:throw new Error("Unknown EC Level: "+o)}}i.isValid=function(e){return e&&typeof e.bit<"u"&&e.bit>=0&&e.bit<4},i.from=function(e,t){if(i.isValid(e))return e;try{return r(e)}catch{return t}}})(O)),O}var $,Bt;function ie(){if(Bt)return $;Bt=1;function i(){this.buffer=[],this.length=0}return i.prototype={get:function(r){const o=Math.floor(r/8);return(this.buffer[o]>>>7-r%8&1)===1},put:function(r,o){for(let e=0;e<o;e++)this.putBit((r>>>o-e-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(r){const o=Math.floor(this.length/8);this.buffer.length<=o&&this.buffer.push(0),r&&(this.buffer[o]|=128>>>this.length%8),this.length++}},$=i,$}var G,Rt;function oe(){if(Rt)return G;Rt=1;function i(r){if(!r||r<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=r,this.data=new Uint8Array(r*r),this.reservedBit=new Uint8Array(r*r)}return i.prototype.set=function(r,o,e,t){const n=r*this.size+o;this.data[n]=e,t&&(this.reservedBit[n]=!0)},i.prototype.get=function(r,o){return this.data[r*this.size+o]},i.prototype.xor=function(r,o,e){this.data[r*this.size+o]^=e},i.prototype.isReserved=function(r,o){return this.reservedBit[r*this.size+o]},G=i,G}var W={},vt;function se(){return vt||(vt=1,(function(i){const r=x().getSymbolSize;i.getRowColCoords=function(e){if(e===1)return[];const t=Math.floor(e/7)+2,n=r(e),s=n===145?26:Math.ceil((n-13)/(2*t-2))*2,u=[n-7];for(let a=1;a<t-1;a++)u[a]=u[a-1]-s;return u.push(6),u.reverse()},i.getPositions=function(e){const t=[],n=i.getRowColCoords(e),s=n.length;for(let u=0;u<s;u++)for(let a=0;a<s;a++)u===0&&a===0||u===0&&a===s-1||u===s-1&&a===0||t.push([n[u],n[a]]);return t}})(W)),W}var Z={},St;function ae(){if(St)return Z;St=1;const i=x().getSymbolSize,r=7;return Z.getPositions=function(e){const t=i(e);return[[0,0],[t-r,0],[0,t-r]]},Z}var X={},Mt;function ue(){return Mt||(Mt=1,(function(i){i.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const r={N1:3,N2:3,N3:40,N4:10};i.isValid=function(t){return t!=null&&t!==""&&!isNaN(t)&&t>=0&&t<=7},i.from=function(t){return i.isValid(t)?parseInt(t,10):void 0},i.getPenaltyN1=function(t){const n=t.size;let s=0,u=0,a=0,c=null,f=null;for(let E=0;E<n;E++){u=a=0,c=f=null;for(let g=0;g<n;g++){let l=t.get(E,g);l===c?u++:(u>=5&&(s+=r.N1+(u-5)),c=l,u=1),l=t.get(g,E),l===f?a++:(a>=5&&(s+=r.N1+(a-5)),f=l,a=1)}u>=5&&(s+=r.N1+(u-5)),a>=5&&(s+=r.N1+(a-5))}return s},i.getPenaltyN2=function(t){const n=t.size;let s=0;for(let u=0;u<n-1;u++)for(let a=0;a<n-1;a++){const c=t.get(u,a)+t.get(u,a+1)+t.get(u+1,a)+t.get(u+1,a+1);(c===4||c===0)&&s++}return s*r.N2},i.getPenaltyN3=function(t){const n=t.size;let s=0,u=0,a=0;for(let c=0;c<n;c++){u=a=0;for(let f=0;f<n;f++)u=u<<1&2047|t.get(c,f),f>=10&&(u===1488||u===93)&&s++,a=a<<1&2047|t.get(f,c),f>=10&&(a===1488||a===93)&&s++}return s*r.N3},i.getPenaltyN4=function(t){let n=0;const s=t.data.length;for(let a=0;a<s;a++)n+=t.data[a];return Math.abs(Math.ceil(n*100/s/5)-10)*r.N4};function o(e,t,n){switch(e){case i.Patterns.PATTERN000:return(t+n)%2===0;case i.Patterns.PATTERN001:return t%2===0;case i.Patterns.PATTERN010:return n%3===0;case i.Patterns.PATTERN011:return(t+n)%3===0;case i.Patterns.PATTERN100:return(Math.floor(t/2)+Math.floor(n/3))%2===0;case i.Patterns.PATTERN101:return t*n%2+t*n%3===0;case i.Patterns.PATTERN110:return(t*n%2+t*n%3)%2===0;case i.Patterns.PATTERN111:return(t*n%3+(t+n)%2)%2===0;default:throw new Error("bad maskPattern:"+e)}}i.applyMask=function(t,n){const s=n.size;for(let u=0;u<s;u++)for(let a=0;a<s;a++)n.isReserved(a,u)||n.xor(a,u,o(t,a,u))},i.getBestMask=function(t,n){const s=Object.keys(i.Patterns).length;let u=0,a=1/0;for(let c=0;c<s;c++){n(c),i.applyMask(c,t);const f=i.getPenaltyN1(t)+i.getPenaltyN2(t)+i.getPenaltyN3(t)+i.getPenaltyN4(t);i.applyMask(c,t),f<a&&(a=f,u=c)}return u}})(X)),X}var V={},At;function Tt(){if(At)return V;At=1;const i=Y(),r=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],o=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];return V.getBlocksCount=function(t,n){switch(n){case i.L:return r[(t-1)*4+0];case i.M:return r[(t-1)*4+1];case i.Q:return r[(t-1)*4+2];case i.H:return r[(t-1)*4+3];default:return}},V.getTotalCodewordsCount=function(t,n){switch(n){case i.L:return o[(t-1)*4+0];case i.M:return o[(t-1)*4+1];case i.Q:return o[(t-1)*4+2];case i.H:return o[(t-1)*4+3];default:return}},V}var tt={},z={},It;function ce(){if(It)return z;It=1;const i=new Uint8Array(512),r=new Uint8Array(256);return(function(){let e=1;for(let t=0;t<255;t++)i[t]=e,r[e]=t,e<<=1,e&256&&(e^=285);for(let t=255;t<512;t++)i[t]=i[t-255]})(),z.log=function(e){if(e<1)throw new Error("log("+e+")");return r[e]},z.exp=function(e){return i[e]},z.mul=function(e,t){return e===0||t===0?0:i[r[e]+r[t]]},z}var Nt;function le(){return Nt||(Nt=1,(function(i){const r=ce();i.mul=function(e,t){const n=new Uint8Array(e.length+t.length-1);for(let s=0;s<e.length;s++)for(let u=0;u<t.length;u++)n[s+u]^=r.mul(e[s],t[u]);return n},i.mod=function(e,t){let n=new Uint8Array(e);for(;n.length-t.length>=0;){const s=n[0];for(let a=0;a<t.length;a++)n[a]^=r.mul(t[a],s);let u=0;for(;u<n.length&&n[u]===0;)u++;n=n.slice(u)}return n},i.generateECPolynomial=function(e){let t=new Uint8Array([1]);for(let n=0;n<e;n++)t=i.mul(t,new Uint8Array([1,r.exp(n)]));return t}})(tt)),tt}var et,Pt;function de(){if(Pt)return et;Pt=1;const i=le();function r(o){this.genPoly=void 0,this.degree=o,this.degree&&this.initialize(this.degree)}return r.prototype.initialize=function(e){this.degree=e,this.genPoly=i.generateECPolynomial(this.degree)},r.prototype.encode=function(e){if(!this.genPoly)throw new Error("Encoder not initialized");const t=new Uint8Array(e.length+this.degree);t.set(e);const n=i.mod(t,this.genPoly),s=this.degree-n.length;if(s>0){const u=new Uint8Array(this.degree);return u.set(n,s),u}return n},et=r,et}var nt={},rt={},it={},Lt;function qt(){return Lt||(Lt=1,it.isValid=function(r){return!isNaN(r)&&r>=1&&r<=40}),it}var P={},kt;function Dt(){if(kt)return P;kt=1;const i="[0-9]+",r="[A-Z $%*+\\-./:]+";let o="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";o=o.replace(/u/g,"\\u");const e="(?:(?![A-Z0-9 $%*+\\-./:]|"+o+`)(?:.|[\r
]))+`;P.KANJI=new RegExp(o,"g"),P.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),P.BYTE=new RegExp(e,"g"),P.NUMERIC=new RegExp(i,"g"),P.ALPHANUMERIC=new RegExp(r,"g");const t=new RegExp("^"+o+"$"),n=new RegExp("^"+i+"$"),s=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");return P.testKanji=function(a){return t.test(a)},P.testNumeric=function(a){return n.test(a)},P.testAlphanumeric=function(a){return s.test(a)},P}var xt;function U(){return xt||(xt=1,(function(i){const r=qt(),o=Dt();i.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},i.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},i.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},i.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},i.MIXED={bit:-1},i.getCharCountIndicator=function(n,s){if(!n.ccBits)throw new Error("Invalid mode: "+n);if(!r.isValid(s))throw new Error("Invalid version: "+s);return s>=1&&s<10?n.ccBits[0]:s<27?n.ccBits[1]:n.ccBits[2]},i.getBestModeForData=function(n){return o.testNumeric(n)?i.NUMERIC:o.testAlphanumeric(n)?i.ALPHANUMERIC:o.testKanji(n)?i.KANJI:i.BYTE},i.toString=function(n){if(n&&n.id)return n.id;throw new Error("Invalid mode")},i.isValid=function(n){return n&&n.bit&&n.ccBits};function e(t){if(typeof t!="string")throw new Error("Param is not a string");switch(t.toLowerCase()){case"numeric":return i.NUMERIC;case"alphanumeric":return i.ALPHANUMERIC;case"kanji":return i.KANJI;case"byte":return i.BYTE;default:throw new Error("Unknown mode: "+t)}}i.from=function(n,s){if(i.isValid(n))return n;try{return e(n)}catch{return s}}})(rt)),rt}var Ut;function fe(){return Ut||(Ut=1,(function(i){const r=x(),o=Tt(),e=Y(),t=U(),n=qt(),s=7973,u=r.getBCHDigit(s);function a(g,l,M){for(let A=1;A<=40;A++)if(l<=i.getCapacity(A,M,g))return A}function c(g,l){return t.getCharCountIndicator(g,l)+4}function f(g,l){let M=0;return g.forEach(function(A){const I=c(A.mode,l);M+=I+A.getBitsLength()}),M}function E(g,l){for(let M=1;M<=40;M++)if(f(g,M)<=i.getCapacity(M,l,t.MIXED))return M}i.from=function(l,M){return n.isValid(l)?parseInt(l,10):M},i.getCapacity=function(l,M,A){if(!n.isValid(l))throw new Error("Invalid QR Code version");typeof A>"u"&&(A=t.BYTE);const I=r.getSymbolTotalCodewords(l),R=o.getTotalCodewordsCount(l,M),T=(I-R)*8;if(A===t.MIXED)return T;const v=T-c(A,l);switch(A){case t.NUMERIC:return Math.floor(v/10*3);case t.ALPHANUMERIC:return Math.floor(v/11*2);case t.KANJI:return Math.floor(v/13);case t.BYTE:default:return Math.floor(v/8)}},i.getBestVersionForData=function(l,M){let A;const I=e.from(M,e.M);if(Array.isArray(l)){if(l.length>1)return E(l,I);if(l.length===0)return 1;A=l[0]}else A=l;return a(A.mode,A.getLength(),I)},i.getEncodedBits=function(l){if(!n.isValid(l)||l<7)throw new Error("Invalid QR Code version");let M=l<<12;for(;r.getBCHDigit(M)-u>=0;)M^=s<<r.getBCHDigit(M)-u;return l<<12|M}})(nt)),nt}var ot={},_t;function he(){if(_t)return ot;_t=1;const i=x(),r=1335,o=21522,e=i.getBCHDigit(r);return ot.getEncodedBits=function(n,s){const u=n.bit<<3|s;let a=u<<10;for(;i.getBCHDigit(a)-e>=0;)a^=r<<i.getBCHDigit(a)-e;return(u<<10|a)^o},ot}var st={},at,Ft;function ge(){if(Ft)return at;Ft=1;const i=U();function r(o){this.mode=i.NUMERIC,this.data=o.toString()}return r.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(e){let t,n,s;for(t=0;t+3<=this.data.length;t+=3)n=this.data.substr(t,3),s=parseInt(n,10),e.put(s,10);const u=this.data.length-t;u>0&&(n=this.data.substr(t),s=parseInt(n,10),e.put(s,u*3+1))},at=r,at}var ut,zt;function pe(){if(zt)return ut;zt=1;const i=U(),r=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function o(e){this.mode=i.ALPHANUMERIC,this.data=e}return o.getBitsLength=function(t){return 11*Math.floor(t/2)+6*(t%2)},o.prototype.getLength=function(){return this.data.length},o.prototype.getBitsLength=function(){return o.getBitsLength(this.data.length)},o.prototype.write=function(t){let n;for(n=0;n+2<=this.data.length;n+=2){let s=r.indexOf(this.data[n])*45;s+=r.indexOf(this.data[n+1]),t.put(s,11)}this.data.length%2&&t.put(r.indexOf(this.data[n]),6)},ut=o,ut}var ct,Ht;function me(){if(Ht)return ct;Ht=1;const i=U();function r(o){this.mode=i.BYTE,typeof o=="string"?this.data=new TextEncoder().encode(o):this.data=new Uint8Array(o)}return r.getBitsLength=function(e){return e*8},r.prototype.getLength=function(){return this.data.length},r.prototype.getBitsLength=function(){return r.getBitsLength(this.data.length)},r.prototype.write=function(o){for(let e=0,t=this.data.length;e<t;e++)o.put(this.data[e],8)},ct=r,ct}var lt,Vt;function we(){if(Vt)return lt;Vt=1;const i=U(),r=x();function o(e){this.mode=i.KANJI,this.data=e}return o.getBitsLength=function(t){return t*13},o.prototype.getLength=function(){return this.data.length},o.prototype.getBitsLength=function(){return o.getBitsLength(this.data.length)},o.prototype.write=function(e){let t;for(t=0;t<this.data.length;t++){let n=r.toSJIS(this.data[t]);if(n>=33088&&n<=40956)n-=33088;else if(n>=57408&&n<=60351)n-=49472;else throw new Error("Invalid SJIS character: "+this.data[t]+`
Make sure your charset is UTF-8`);n=(n>>>8&255)*192+(n&255),e.put(n,13)}},lt=o,lt}var dt={exports:{}},Kt;function ye(){return Kt||(Kt=1,(function(i){var r={single_source_shortest_paths:function(o,e,t){var n={},s={};s[e]=0;var u=r.PriorityQueue.make();u.push(e,0);for(var a,c,f,E,g,l,M,A,I;!u.empty();){a=u.pop(),c=a.value,E=a.cost,g=o[c]||{};for(f in g)g.hasOwnProperty(f)&&(l=g[f],M=E+l,A=s[f],I=typeof s[f]>"u",(I||A>M)&&(s[f]=M,u.push(f,M),n[f]=c))}if(typeof t<"u"&&typeof s[t]>"u"){var R=["Could not find a path from ",e," to ",t,"."].join("");throw new Error(R)}return n},extract_shortest_path_from_predecessor_list:function(o,e){for(var t=[],n=e;n;)t.push(n),o[n],n=o[n];return t.reverse(),t},find_path:function(o,e,t){var n=r.single_source_shortest_paths(o,e,t);return r.extract_shortest_path_from_predecessor_list(n,t)},PriorityQueue:{make:function(o){var e=r.PriorityQueue,t={},n;o=o||{};for(n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t.queue=[],t.sorter=o.sorter||e.default_sorter,t},default_sorter:function(o,e){return o.cost-e.cost},push:function(o,e){var t={value:o,cost:e};this.queue.push(t),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};i.exports=r})(dt)),dt.exports}var jt;function be(){return jt||(jt=1,(function(i){const r=U(),o=ge(),e=pe(),t=me(),n=we(),s=Dt(),u=x(),a=ye();function c(R){return unescape(encodeURIComponent(R)).length}function f(R,T,v){const C=[];let N;for(;(N=R.exec(v))!==null;)C.push({data:N[0],index:N.index,mode:T,length:N[0].length});return C}function E(R){const T=f(s.NUMERIC,r.NUMERIC,R),v=f(s.ALPHANUMERIC,r.ALPHANUMERIC,R);let C,N;return u.isKanjiModeEnabled()?(C=f(s.BYTE,r.BYTE,R),N=f(s.KANJI,r.KANJI,R)):(C=f(s.BYTE_KANJI,r.BYTE,R),N=[]),T.concat(v,C,N).sort(function(y,w){return y.index-w.index}).map(function(y){return{data:y.data,mode:y.mode,length:y.length}})}function g(R,T){switch(T){case r.NUMERIC:return o.getBitsLength(R);case r.ALPHANUMERIC:return e.getBitsLength(R);case r.KANJI:return n.getBitsLength(R);case r.BYTE:return t.getBitsLength(R)}}function l(R){return R.reduce(function(T,v){const C=T.length-1>=0?T[T.length-1]:null;return C&&C.mode===v.mode?(T[T.length-1].data+=v.data,T):(T.push(v),T)},[])}function M(R){const T=[];for(let v=0;v<R.length;v++){const C=R[v];switch(C.mode){case r.NUMERIC:T.push([C,{data:C.data,mode:r.ALPHANUMERIC,length:C.length},{data:C.data,mode:r.BYTE,length:C.length}]);break;case r.ALPHANUMERIC:T.push([C,{data:C.data,mode:r.BYTE,length:C.length}]);break;case r.KANJI:T.push([C,{data:C.data,mode:r.BYTE,length:c(C.data)}]);break;case r.BYTE:T.push([{data:C.data,mode:r.BYTE,length:c(C.data)}])}}return T}function A(R,T){const v={},C={start:{}};let N=["start"];for(let h=0;h<R.length;h++){const y=R[h],w=[];for(let d=0;d<y.length;d++){const B=y[d],p=""+h+d;w.push(p),v[p]={node:B,lastCount:0},C[p]={};for(let b=0;b<N.length;b++){const m=N[b];v[m]&&v[m].node.mode===B.mode?(C[m][p]=g(v[m].lastCount+B.length,B.mode)-g(v[m].lastCount,B.mode),v[m].lastCount+=B.length):(v[m]&&(v[m].lastCount=B.length),C[m][p]=g(B.length,B.mode)+4+r.getCharCountIndicator(B.mode,T))}}N=w}for(let h=0;h<N.length;h++)C[N[h]].end=0;return{map:C,table:v}}function I(R,T){let v;const C=r.getBestModeForData(R);if(v=r.from(T,C),v!==r.BYTE&&v.bit<C.bit)throw new Error('"'+R+'" cannot be encoded with mode '+r.toString(v)+`.
 Suggested mode is: `+r.toString(C));switch(v===r.KANJI&&!u.isKanjiModeEnabled()&&(v=r.BYTE),v){case r.NUMERIC:return new o(R);case r.ALPHANUMERIC:return new e(R);case r.KANJI:return new n(R);case r.BYTE:return new t(R)}}i.fromArray=function(T){return T.reduce(function(v,C){return typeof C=="string"?v.push(I(C,null)):C.data&&v.push(I(C.data,C.mode)),v},[])},i.fromString=function(T,v){const C=E(T,u.isKanjiModeEnabled()),N=M(C),h=A(N,v),y=a.find_path(h.map,"start","end"),w=[];for(let d=1;d<y.length-1;d++)w.push(h.table[y[d]].node);return i.fromArray(l(w))},i.rawSplit=function(T){return i.fromArray(E(T,u.isKanjiModeEnabled()))}})(st)),st}var Qt;function Ee(){if(Qt)return J;Qt=1;const i=x(),r=Y(),o=ie(),e=oe(),t=se(),n=ae(),s=ue(),u=Tt(),a=de(),c=fe(),f=he(),E=U(),g=be();function l(h,y){const w=h.size,d=n.getPositions(y);for(let B=0;B<d.length;B++){const p=d[B][0],b=d[B][1];for(let m=-1;m<=7;m++)if(!(p+m<=-1||w<=p+m))for(let S=-1;S<=7;S++)b+S<=-1||w<=b+S||(m>=0&&m<=6&&(S===0||S===6)||S>=0&&S<=6&&(m===0||m===6)||m>=2&&m<=4&&S>=2&&S<=4?h.set(p+m,b+S,!0,!0):h.set(p+m,b+S,!1,!0))}}function M(h){const y=h.size;for(let w=8;w<y-8;w++){const d=w%2===0;h.set(w,6,d,!0),h.set(6,w,d,!0)}}function A(h,y){const w=t.getPositions(y);for(let d=0;d<w.length;d++){const B=w[d][0],p=w[d][1];for(let b=-2;b<=2;b++)for(let m=-2;m<=2;m++)b===-2||b===2||m===-2||m===2||b===0&&m===0?h.set(B+b,p+m,!0,!0):h.set(B+b,p+m,!1,!0)}}function I(h,y){const w=h.size,d=c.getEncodedBits(y);let B,p,b;for(let m=0;m<18;m++)B=Math.floor(m/3),p=m%3+w-8-3,b=(d>>m&1)===1,h.set(B,p,b,!0),h.set(p,B,b,!0)}function R(h,y,w){const d=h.size,B=f.getEncodedBits(y,w);let p,b;for(p=0;p<15;p++)b=(B>>p&1)===1,p<6?h.set(p,8,b,!0):p<8?h.set(p+1,8,b,!0):h.set(d-15+p,8,b,!0),p<8?h.set(8,d-p-1,b,!0):p<9?h.set(8,15-p-1+1,b,!0):h.set(8,15-p-1,b,!0);h.set(d-8,8,1,!0)}function T(h,y){const w=h.size;let d=-1,B=w-1,p=7,b=0;for(let m=w-1;m>0;m-=2)for(m===6&&m--;;){for(let S=0;S<2;S++)if(!h.isReserved(B,m-S)){let D=!1;b<y.length&&(D=(y[b]>>>p&1)===1),h.set(B,m-S,D),p--,p===-1&&(b++,p=7)}if(B+=d,B<0||w<=B){B-=d,d=-d;break}}}function v(h,y,w){const d=new o;w.forEach(function(S){d.put(S.mode.bit,4),d.put(S.getLength(),E.getCharCountIndicator(S.mode,h)),S.write(d)});const B=i.getSymbolTotalCodewords(h),p=u.getTotalCodewordsCount(h,y),b=(B-p)*8;for(d.getLengthInBits()+4<=b&&d.put(0,4);d.getLengthInBits()%8!==0;)d.putBit(0);const m=(b-d.getLengthInBits())/8;for(let S=0;S<m;S++)d.put(S%2?17:236,8);return C(d,h,y)}function C(h,y,w){const d=i.getSymbolTotalCodewords(y),B=u.getTotalCodewordsCount(y,w),p=d-B,b=u.getBlocksCount(y,w),m=d%b,S=b-m,D=Math.floor(d/b),H=Math.floor(p/b),Me=H+1,Xt=D-H,Ae=new a(Xt);let pt=0;const K=new Array(b),te=new Array(b);let mt=0;const Te=new Uint8Array(h.buffer);for(let F=0;F<b;F++){const yt=F<S?H:Me;K[F]=Te.slice(pt,pt+yt),te[F]=Ae.encode(K[F]),pt+=yt,mt=Math.max(mt,yt)}const wt=new Uint8Array(d);let ee=0,L,q;for(L=0;L<mt;L++)for(q=0;q<b;q++)L<K[q].length&&(wt[ee++]=K[q][L]);for(L=0;L<Xt;L++)for(q=0;q<b;q++)wt[ee++]=te[q][L];return wt}function N(h,y,w,d){let B;if(Array.isArray(h))B=g.fromArray(h);else if(typeof h=="string"){let D=y;if(!D){const H=g.rawSplit(h);D=c.getBestVersionForData(H,w)}B=g.fromString(h,D||40)}else throw new Error("Invalid data");const p=c.getBestVersionForData(B,w);if(!p)throw new Error("The amount of data is too big to be stored in a QR Code");if(!y)y=p;else if(y<p)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+p+`.
`);const b=v(y,w,B),m=i.getSymbolSize(y),S=new e(m);return l(S,y),M(S),A(S,y),R(S,w,0),y>=7&&I(S,y),T(S,b),isNaN(d)&&(d=s.getBestMask(S,R.bind(null,S,w))),s.applyMask(d,S),R(S,w,d),{modules:S,version:y,errorCorrectionLevel:w,maskPattern:d,segments:B}}return J.create=function(y,w){if(typeof y>"u"||y==="")throw new Error("No input text");let d=r.M,B,p;return typeof w<"u"&&(d=r.from(w.errorCorrectionLevel,r.M),B=c.from(w.version),p=s.from(w.maskPattern),w.toSJISFunc&&i.setToSJISFunction(w.toSJISFunc)),N(y,B,d,p)},J}var ft={},ht={},Jt;function Ot(){return Jt||(Jt=1,(function(i){function r(o){if(typeof o=="number"&&(o=o.toString()),typeof o!="string")throw new Error("Color should be defined as hex string");let e=o.slice().replace("#","").split("");if(e.length<3||e.length===5||e.length>8)throw new Error("Invalid hex color: "+o);(e.length===3||e.length===4)&&(e=Array.prototype.concat.apply([],e.map(function(n){return[n,n]}))),e.length===6&&e.push("F","F");const t=parseInt(e.join(""),16);return{r:t>>24&255,g:t>>16&255,b:t>>8&255,a:t&255,hex:"#"+e.slice(0,6).join("")}}i.getOptions=function(e){e||(e={}),e.color||(e.color={});const t=typeof e.margin>"u"||e.margin===null||e.margin<0?4:e.margin,n=e.width&&e.width>=21?e.width:void 0,s=e.scale||4;return{width:n,scale:n?4:s,margin:t,color:{dark:r(e.color.dark||"#000000ff"),light:r(e.color.light||"#ffffffff")},type:e.type,rendererOpts:e.rendererOpts||{}}},i.getScale=function(e,t){return t.width&&t.width>=e+t.margin*2?t.width/(e+t.margin*2):t.scale},i.getImageWidth=function(e,t){const n=i.getScale(e,t);return Math.floor((e+t.margin*2)*n)},i.qrToImageData=function(e,t,n){const s=t.modules.size,u=t.modules.data,a=i.getScale(s,n),c=Math.floor((s+n.margin*2)*a),f=n.margin*a,E=[n.color.light,n.color.dark];for(let g=0;g<c;g++)for(let l=0;l<c;l++){let M=(g*c+l)*4,A=n.color.light;if(g>=f&&l>=f&&g<c-f&&l<c-f){const I=Math.floor((g-f)/a),R=Math.floor((l-f)/a);A=E[u[I*s+R]?1:0]}e[M++]=A.r,e[M++]=A.g,e[M++]=A.b,e[M]=A.a}}})(ht)),ht}var Yt;function Ce(){return Yt||(Yt=1,(function(i){const r=Ot();function o(t,n,s){t.clearRect(0,0,n.width,n.height),n.style||(n.style={}),n.height=s,n.width=s,n.style.height=s+"px",n.style.width=s+"px"}function e(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}i.render=function(n,s,u){let a=u,c=s;typeof a>"u"&&(!s||!s.getContext)&&(a=s,s=void 0),s||(c=e()),a=r.getOptions(a);const f=r.getImageWidth(n.modules.size,a),E=c.getContext("2d"),g=E.createImageData(f,f);return r.qrToImageData(g.data,n,a),o(E,c,f),E.putImageData(g,0,0),c},i.renderToDataURL=function(n,s,u){let a=u;typeof a>"u"&&(!s||!s.getContext)&&(a=s,s=void 0),a||(a={});const c=i.render(n,s,a),f=a.type||"image/png",E=a.rendererOpts||{};return c.toDataURL(f,E.quality)}})(ft)),ft}var gt={},$t;function Be(){if($t)return gt;$t=1;const i=Ot();function r(t,n){const s=t.a/255,u=n+'="'+t.hex+'"';return s<1?u+" "+n+'-opacity="'+s.toFixed(2).slice(1)+'"':u}function o(t,n,s){let u=t+n;return typeof s<"u"&&(u+=" "+s),u}function e(t,n,s){let u="",a=0,c=!1,f=0;for(let E=0;E<t.length;E++){const g=Math.floor(E%n),l=Math.floor(E/n);!g&&!c&&(c=!0),t[E]?(f++,E>0&&g>0&&t[E-1]||(u+=c?o("M",g+s,.5+l+s):o("m",a,0),a=0,c=!1),g+1<n&&t[E+1]||(u+=o("h",f),f=0)):a++}return u}return gt.render=function(n,s,u){const a=i.getOptions(s),c=n.modules.size,f=n.modules.data,E=c+a.margin*2,g=a.color.light.a?"<path "+r(a.color.light,"fill")+' d="M0 0h'+E+"v"+E+'H0z"/>':"",l="<path "+r(a.color.dark,"stroke")+' d="'+e(f,c,a.margin)+'"/>',M='viewBox="0 0 '+E+" "+E+'"',I='<svg xmlns="http://www.w3.org/2000/svg" '+(a.width?'width="'+a.width+'" height="'+a.width+'" ':"")+M+' shape-rendering="crispEdges">'+g+l+`</svg>
`;return typeof u=="function"&&u(null,I),I},gt}var Gt;function Re(){if(Gt)return _;Gt=1;const i=re(),r=Ee(),o=Ce(),e=Be();function t(n,s,u,a,c){const f=[].slice.call(arguments,1),E=f.length,g=typeof f[E-1]=="function";if(!g&&!i())throw new Error("Callback required as last argument");if(g){if(E<2)throw new Error("Too few arguments provided");E===2?(c=u,u=s,s=a=void 0):E===3&&(s.getContext&&typeof c>"u"?(c=a,a=void 0):(c=a,a=u,u=s,s=void 0))}else{if(E<1)throw new Error("Too few arguments provided");return E===1?(u=s,s=a=void 0):E===2&&!s.getContext&&(a=u,u=s,s=void 0),new Promise(function(l,M){try{const A=r.create(u,a);l(n(A,s,a))}catch(A){M(A)}})}try{const l=r.create(u,a);c(null,n(l,s,a))}catch(l){c(l)}}return _.create=r.create,_.toCanvas=t.bind(null,o.render),_.toDataURL=t.bind(null,o.renderToDataURL),_.toString=t.bind(null,function(n,s,u){return e.render(n,u)}),_}var ve=Re();const Se=ne(ve),Wt="swaploop-qr-emulator";class Zt extends HTMLElement{static observedAttributes=["service-url","scan-duration","scan-request-id","cancel-request-id","reset-request-id"];#r=null;#t=!1;#i="idle";#e="";constructor(){super(),this.attachShadow({mode:"open"})}connectedCallback(){this.#s()}disconnectedCallback(){this.#o()}attributeChangedCallback(r,o,e){if(!(!this.isConnected||o===e)){if(r==="scan-request-id"&&o!==null){this.startScan();return}if(r==="cancel-request-id"&&o!==null){this.cancelScan();return}if(r==="reset-request-id"&&o!==null){this.reset();return}this.#s()}}get serviceUrl(){return(this.getAttribute("service-url")||"http://localhost:4020").replace(/\/$/,"")}set serviceUrl(r){this.setAttribute("service-url",r)}get scanDuration(){const r=Number(this.getAttribute("scan-duration")||2500);return Number.isFinite(r)&&r>=0?r:2500}async startScan(){this.#o(),this.#t=!0,this.#e="";const r=new AbortController;this.#r=r,this.#n("scanning","Reading the current QR code…"),await this.#a(r)}cancelScan(){this.#o(),this.#n("idle","Scan cancelled.")}reset(){this.#o(),this.#e="",this.#n("idle","Ready to scan a simulated QR code.")}async#a(r){if(!this.#t)return;const o=Date.now();try{const e=await fetch(`${this.serviceUrl}/api/qr/current`,{headers:{Accept:"application/json"},signal:r.signal});if(!this.#t)return;if(e.status===404){this.#t=!1,this.#n("error","No QR code is currently selected.");return}if(!e.ok)throw new Error(`Station Service returned HTTP ${e.status}`);const t=await e.json();if(typeof t.payload!="string"||t.payload.length===0)throw new Error("The Station Service returned an invalid QR payload");if(this.#e=await Se.toDataURL(t.payload,{width:260,margin:2,color:{dark:"#102a2a",light:"#ffffff"},errorCorrectionLevel:"M"}),!this.#t)return;this.#s();const n=Date.now()-o,s=Math.max(0,this.scanDuration-n);if(await this.#u(r.signal,s),!this.#t)return;this.#t=!1,this.#n("success","QR code scanned successfully."),this.dispatchEvent(new CustomEvent("qr-scan",{detail:{payload:t.payload},bubbles:!0,composed:!0}))}catch(e){if(e instanceof DOMException&&e.name==="AbortError")return;this.#t=!1,this.#n("error",e instanceof Error?e.message:"Unable to reach the Station Service")}finally{this.#r===r&&(this.#r=null)}}#u(r,o=this.scanDuration){return new Promise(e=>{const t=()=>{window.clearTimeout(n),r.removeEventListener("abort",t),e()},n=window.setTimeout(t,o);r.addEventListener("abort",t,{once:!0})})}#n(r,o){this.#i=r,this.#s(),this.dispatchEvent(new CustomEvent("qr-scan-state",{detail:{state:r,message:o},bubbles:!0,composed:!0}))}#o(){this.#r?.abort(),this.#r=null,this.#t=!1}#s(){const r=this.#i==="scanning",o=!!this.#e&&r,e={idle:"Ready",scanning:"Scanning",success:"Scanned",error:"Error"}[this.#i];this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          color: #102a2a;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        * { box-sizing: border-box; }

        .scanner {
          overflow: hidden;
          border: 1px solid rgba(16, 42, 42, 0.12);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 24px 60px rgba(16, 42, 42, 0.14);
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 22px;
          border-bottom: 1px solid #e6ece9;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          font-size: 15px;
          font-weight: 750;
          letter-spacing: -0.01em;
        }

        .mark {
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          border-radius: 11px;
          color: #fff;
          background: #0d766e;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.18);
        }

        .status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 28px;
          padding: 5px 10px;
          border-radius: 999px;
          color: #31504d;
          background: #eef5f2;
          font-size: 12px;
          font-weight: 700;
        }

        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: ${this.#i==="error"?"#d97706":this.#i==="success"?"#0d9488":"#6b817e"};
          ${r?"animation: pulse 1.4s ease-in-out infinite;":""}
        }

        .body { padding: 22px; }

        .viewport {
          position: relative;
          display: grid;
          min-height: 330px;
          place-items: center;
          overflow: hidden;
          border-radius: 21px;
          color: #d9f5ee;
          background:
            radial-gradient(circle at 25% 15%, rgba(35, 166, 153, .24), transparent 35%),
            linear-gradient(145deg, #173d3a, #0b2524 72%);
        }

        .grid {
          position: absolute;
          inset: 0;
          opacity: .13;
          background-image:
            linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .frame {
          position: relative;
          display: grid;
          width: 230px;
          height: 230px;
          place-items: center;
        }

        .corner {
          position: absolute;
          z-index: 3;
          width: 42px;
          height: 42px;
          border-color: #73e1cc;
          border-style: solid;
        }
        .tl { top: 0; left: 0; border-width: 3px 0 0 3px; border-radius: 14px 0 0 0; }
        .tr { top: 0; right: 0; border-width: 3px 3px 0 0; border-radius: 0 14px 0 0; }
        .bl { bottom: 0; left: 0; border-width: 0 0 3px 3px; border-radius: 0 0 0 14px; }
        .br { right: 0; bottom: 0; border-width: 0 3px 3px 0; border-radius: 0 0 14px 0; }

        .scan-line {
          position: absolute;
          z-index: 4;
          top: 18px;
          right: 13px;
          left: 13px;
          height: 2px;
          opacity: ${r?1:0};
          background: linear-gradient(90deg, transparent, #73e1cc 15%, #fff 50%, #73e1cc 85%, transparent);
          filter: drop-shadow(0 0 7px #73e1cc);
          animation: scan 2.4s ease-in-out infinite;
        }

        .placeholder {
          width: 112px;
          text-align: center;
          color: rgba(224, 250, 244, .82);
          font-size: 13px;
          line-height: 1.45;
        }

        .placeholder svg { margin-bottom: 10px; opacity: .84; }

        .qr {
          z-index: 1;
          width: 194px;
          height: 194px;
          padding: 8px;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 16px 35px rgba(0,0,0,.28);
        }

        .qr--live {
          opacity: 0.94;
          filter: contrast(0.96) brightness(0.98);
          animation: camera-jitter 1.35s ease-in-out infinite;
        }

        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(192px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: .45; transform: scale(.85); }
          50% { opacity: 1; transform: scale(1); }
        }

        /* Slight handheld-camera drift while the QR is being "acquired". */
        @keyframes camera-jitter {
          0%   { transform: translate(0px, 0px) rotate(0deg) scale(0.985); }
          18%  { transform: translate(5px, -4px) rotate(0.55deg) scale(1.01); }
          36%  { transform: translate(-4px, 3px) rotate(-0.45deg) scale(0.99); }
          54%  { transform: translate(3px, 5px) rotate(0.35deg) scale(1.015); }
          72%  { transform: translate(-5px, -2px) rotate(-0.6deg) scale(0.995); }
          100% { transform: translate(0px, 0px) rotate(0deg) scale(0.985); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
        }
      </style>

      <section class="scanner" aria-label="SwapLoop QR scanner emulator">
        <header class="header">
          <div class="brand">
            <span class="mark" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"/><path d="M15 14h2v2h-2zM19 14h1v5h-5v1M14 18h2"/>
              </svg>
            </span>
            SwapLoop scanner
          </div>
          <span class="status"><span class="dot"></span>${e}</span>
        </header>

        <div class="body">
          <div class="viewport">
            <div class="grid"></div>
            <div class="frame">
              <span class="corner tl"></span><span class="corner tr"></span>
              <span class="corner bl"></span><span class="corner br"></span>
              <span class="scan-line"></span>
              ${this.#e?`<img class="qr${o?" qr--live":""}" src="${this.#e}" alt="Simulated QR code" />`:`<div class="placeholder">
                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                      <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h1v1h-1zM17 14v3h-3"/>
                    </svg>
                    Position the simulated code inside the frame
                  </div>`}
            </div>
          </div>
        </div>
      </section>
    `}}return customElements.get(Wt)||customElements.define(Wt,Zt),j.SwapLoopQrEmulator=Zt,Object.defineProperty(j,Symbol.toStringTag,{value:"Module"}),j})({});
