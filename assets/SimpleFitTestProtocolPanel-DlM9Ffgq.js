import{q as Pd,k as Ad,l as Ca,r as Oa,b as Td,j as kn}from"./index-D-emp8u7.js";function zd(s){return Array.isArray(s)}function Nd(s){return s!==null&&typeof s=="object"&&(s.constructor===void 0||s.constructor.name==="Object")}function Rd(s){return s.slice(0,s.length-1)}function Dd(s){return s[s.length-1]}function Id(s,e){let t=s,n=0;for(;n<e.length;)Nd(t)?t=t[e[n]]:zd(t)?t=t[parseInt(e[n])]:t=void 0,n++;return t}function qd(s){const e=s.split("/");return e.shift(),e.map(t=>t.replace(/~1/g,"/").replace(/~0/g,"~"))}function Bd(s,e){if(Dd(e)!=="-")return e;const t=Rd(e),n=Id(s,t);return t.concat(n.length)}function Ld(s,e){return Bd(s,qd(e))}var Fd={exports:{}};/*
 * @version    1.4.0
 * @date       2015-10-26
 * @stability  3 - Stable
 * @author     Lauri Rooden (https://github.com/litejs/natural-compare-lite)
 * @license    MIT License
 */var $a=function(s,e){var t,n,r=1,i=0,o=0,a=String.alphabet;function l(c,h,d){if(d){for(t=h;d=l(c,t),d<76&&d>65;)++t;return+c.slice(h-1,t)}return d=a&&a.indexOf(c.charAt(h)),d>-1?d+76:(d=c.charCodeAt(h)||0,d<45||d>127?d:d<46?65:d<48?d-1:d<58?d+18:d<65?d-11:d<91?d+11:d<97?d-37:d<123?d+5:d-63)}if((s+="")!=(e+="")){for(;r;)if(n=l(s,i++),r=l(e,o++),n<76&&r<76&&n>66&&r>66&&(n=l(s,i,i),r=l(e,o,i=t),o=t),n!=r)return n<r?-1:1}return 0};try{Fd.exports=$a}catch{String.naturalCompare=$a}var wi={exports:{}},fc={},dt={},zn={},Ts={},oe={},_s={};(function(s){Object.defineProperty(s,"__esModule",{value:!0}),s.regexpCode=s.getEsmExportName=s.getProperty=s.safeStringify=s.stringify=s.strConcat=s.addCodeArg=s.str=s._=s.nil=s._Code=s.Name=s.IDENTIFIER=s._CodeOrName=void 0;class e{}s._CodeOrName=e,s.IDENTIFIER=/^[a-z$_][a-z$_0-9]*$/i;class t extends e{constructor(x){if(super(),!s.IDENTIFIER.test(x))throw new Error("CodeGen: name must be a valid identifier");this.str=x}toString(){return this.str}emptyStr(){return!1}get names(){return{[this.str]:1}}}s.Name=t;class n extends e{constructor(x){super(),this._items=typeof x=="string"?[x]:x}toString(){return this.str}emptyStr(){if(this._items.length>1)return!1;const x=this._items[0];return x===""||x==='""'}get str(){var x;return(x=this._str)!==null&&x!==void 0?x:this._str=this._items.reduce((C,P)=>`${C}${P}`,"")}get names(){var x;return(x=this._names)!==null&&x!==void 0?x:this._names=this._items.reduce((C,P)=>(P instanceof t&&(C[P.str]=(C[P.str]||0)+1),C),{})}}s._Code=n,s.nil=new n("");function r(g,...x){const C=[g[0]];let P=0;for(;P<x.length;)a(C,x[P]),C.push(g[++P]);return new n(C)}s._=r;const i=new n("+");function o(g,...x){const C=[f(g[0])];let P=0;for(;P<x.length;)C.push(i),a(C,x[P]),C.push(i,f(g[++P]));return l(C),new n(C)}s.str=o;function a(g,x){x instanceof n?g.push(...x._items):x instanceof t?g.push(x):g.push(d(x))}s.addCodeArg=a;function l(g){let x=1;for(;x<g.length-1;){if(g[x]===i){const C=c(g[x-1],g[x+1]);if(C!==void 0){g.splice(x-1,3,C);continue}g[x++]="+"}x++}}function c(g,x){if(x==='""')return g;if(g==='""')return x;if(typeof g=="string")return x instanceof t||g[g.length-1]!=='"'?void 0:typeof x!="string"?`${g.slice(0,-1)}${x}"`:x[0]==='"'?g.slice(0,-1)+x.slice(1):void 0;if(typeof x=="string"&&x[0]==='"'&&!(g instanceof t))return`"${g}${x.slice(1)}`}function h(g,x){return x.emptyStr()?g:g.emptyStr()?x:o`${g}${x}`}s.strConcat=h;function d(g){return typeof g=="number"||typeof g=="boolean"||g===null?g:f(Array.isArray(g)?g.join(","):g)}function u(g){return new n(f(g))}s.stringify=u;function f(g){return JSON.stringify(g).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}s.safeStringify=f;function m(g){return typeof g=="string"&&s.IDENTIFIER.test(g)?new n(`.${g}`):r`[${g}]`}s.getProperty=m;function y(g){if(typeof g=="string"&&s.IDENTIFIER.test(g))return new n(`${g}`);throw new Error(`CodeGen: invalid export name: ${g}, use explicit $id name mapping`)}s.getEsmExportName=y;function b(g){return new n(g.toString())}s.regexpCode=b})(_s);var ji={};(function(s){Object.defineProperty(s,"__esModule",{value:!0}),s.ValueScope=s.ValueScopeName=s.Scope=s.varKinds=s.UsedValueState=void 0;const e=_s;class t extends Error{constructor(c){super(`CodeGen: "code" for ${c} not defined`),this.value=c.value}}var n;(function(l){l[l.Started=0]="Started",l[l.Completed=1]="Completed"})(n||(s.UsedValueState=n={})),s.varKinds={const:new e.Name("const"),let:new e.Name("let"),var:new e.Name("var")};class r{constructor({prefixes:c,parent:h}={}){this._names={},this._prefixes=c,this._parent=h}toName(c){return c instanceof e.Name?c:this.name(c)}name(c){return new e.Name(this._newName(c))}_newName(c){const h=this._names[c]||this._nameGroup(c);return`${c}${h.index++}`}_nameGroup(c){var h,d;if(!((d=(h=this._parent)===null||h===void 0?void 0:h._prefixes)===null||d===void 0)&&d.has(c)||this._prefixes&&!this._prefixes.has(c))throw new Error(`CodeGen: prefix "${c}" is not allowed in this scope`);return this._names[c]={prefix:c,index:0}}}s.Scope=r;class i extends e.Name{constructor(c,h){super(h),this.prefix=c}setValue(c,{property:h,itemIndex:d}){this.value=c,this.scopePath=(0,e._)`.${new e.Name(h)}[${d}]`}}s.ValueScopeName=i;const o=(0,e._)`\n`;class a extends r{constructor(c){super(c),this._values={},this._scope=c.scope,this.opts={...c,_n:c.lines?o:e.nil}}get(){return this._scope}name(c){return new i(c,this._newName(c))}value(c,h){var d;if(h.ref===void 0)throw new Error("CodeGen: ref must be passed in value");const u=this.toName(c),{prefix:f}=u,m=(d=h.key)!==null&&d!==void 0?d:h.ref;let y=this._values[f];if(y){const x=y.get(m);if(x)return x}else y=this._values[f]=new Map;y.set(m,u);const b=this._scope[f]||(this._scope[f]=[]),g=b.length;return b[g]=h.ref,u.setValue(h,{property:f,itemIndex:g}),u}getValue(c,h){const d=this._values[c];if(d)return d.get(h)}scopeRefs(c,h=this._values){return this._reduceValues(h,d=>{if(d.scopePath===void 0)throw new Error(`CodeGen: name "${d}" has no value`);return(0,e._)`${c}${d.scopePath}`})}scopeCode(c=this._values,h,d){return this._reduceValues(c,u=>{if(u.value===void 0)throw new Error(`CodeGen: name "${u}" has no value`);return u.value.code},h,d)}_reduceValues(c,h,d={},u){let f=e.nil;for(const m in c){const y=c[m];if(!y)continue;const b=d[m]=d[m]||new Map;y.forEach(g=>{if(b.has(g))return;b.set(g,n.Started);let x=h(g);if(x){const C=this.opts.es5?s.varKinds.var:s.varKinds.const;f=(0,e._)`${f}${C} ${g} = ${x};${this.opts._n}`}else if(x=u?.(g))f=(0,e._)`${f}${x}${this.opts._n}`;else throw new t(g);b.set(g,n.Completed)})}return f}}s.ValueScope=a})(ji);(function(s){Object.defineProperty(s,"__esModule",{value:!0}),s.or=s.and=s.not=s.CodeGen=s.operators=s.varKinds=s.ValueScopeName=s.ValueScope=s.Scope=s.Name=s.regexpCode=s.stringify=s.getProperty=s.nil=s.strConcat=s.str=s._=void 0;const e=_s,t=ji;var n=_s;Object.defineProperty(s,"_",{enumerable:!0,get:function(){return n._}}),Object.defineProperty(s,"str",{enumerable:!0,get:function(){return n.str}}),Object.defineProperty(s,"strConcat",{enumerable:!0,get:function(){return n.strConcat}}),Object.defineProperty(s,"nil",{enumerable:!0,get:function(){return n.nil}}),Object.defineProperty(s,"getProperty",{enumerable:!0,get:function(){return n.getProperty}}),Object.defineProperty(s,"stringify",{enumerable:!0,get:function(){return n.stringify}}),Object.defineProperty(s,"regexpCode",{enumerable:!0,get:function(){return n.regexpCode}}),Object.defineProperty(s,"Name",{enumerable:!0,get:function(){return n.Name}});var r=ji;Object.defineProperty(s,"Scope",{enumerable:!0,get:function(){return r.Scope}}),Object.defineProperty(s,"ValueScope",{enumerable:!0,get:function(){return r.ValueScope}}),Object.defineProperty(s,"ValueScopeName",{enumerable:!0,get:function(){return r.ValueScopeName}}),Object.defineProperty(s,"varKinds",{enumerable:!0,get:function(){return r.varKinds}}),s.operators={GT:new e._Code(">"),GTE:new e._Code(">="),LT:new e._Code("<"),LTE:new e._Code("<="),EQ:new e._Code("==="),NEQ:new e._Code("!=="),NOT:new e._Code("!"),OR:new e._Code("||"),AND:new e._Code("&&"),ADD:new e._Code("+")};class i{optimizeNodes(){return this}optimizeNames(v,j){return this}}class o extends i{constructor(v,j,M){super(),this.varKind=v,this.name=j,this.rhs=M}render({es5:v,_n:j}){const M=v?t.varKinds.var:this.varKind,U=this.rhs===void 0?"":` = ${this.rhs}`;return`${M} ${this.name}${U};`+j}optimizeNames(v,j){if(v[this.name.str])return this.rhs&&(this.rhs=re(this.rhs,v,j)),this}get names(){return this.rhs instanceof e._CodeOrName?this.rhs.names:{}}}class a extends i{constructor(v,j,M){super(),this.lhs=v,this.rhs=j,this.sideEffects=M}render({_n:v}){return`${this.lhs} = ${this.rhs};`+v}optimizeNames(v,j){if(!(this.lhs instanceof e.Name&&!v[this.lhs.str]&&!this.sideEffects))return this.rhs=re(this.rhs,v,j),this}get names(){const v=this.lhs instanceof e.Name?{}:{...this.lhs.names};return ae(v,this.rhs)}}class l extends a{constructor(v,j,M,U){super(v,M,U),this.op=j}render({_n:v}){return`${this.lhs} ${this.op}= ${this.rhs};`+v}}class c extends i{constructor(v){super(),this.label=v,this.names={}}render({_n:v}){return`${this.label}:`+v}}class h extends i{constructor(v){super(),this.label=v,this.names={}}render({_n:v}){return`break${this.label?` ${this.label}`:""};`+v}}class d extends i{constructor(v){super(),this.error=v}render({_n:v}){return`throw ${this.error};`+v}get names(){return this.error.names}}class u extends i{constructor(v){super(),this.code=v}render({_n:v}){return`${this.code};`+v}optimizeNodes(){return`${this.code}`?this:void 0}optimizeNames(v,j){return this.code=re(this.code,v,j),this}get names(){return this.code instanceof e._CodeOrName?this.code.names:{}}}class f extends i{constructor(v=[]){super(),this.nodes=v}render(v){return this.nodes.reduce((j,M)=>j+M.render(v),"")}optimizeNodes(){const{nodes:v}=this;let j=v.length;for(;j--;){const M=v[j].optimizeNodes();Array.isArray(M)?v.splice(j,1,...M):M?v[j]=M:v.splice(j,1)}return v.length>0?this:void 0}optimizeNames(v,j){const{nodes:M}=this;let U=M.length;for(;U--;){const V=M[U];V.optimizeNames(v,j)||(me(v,V.names),M.splice(U,1))}return M.length>0?this:void 0}get names(){return this.nodes.reduce((v,j)=>F(v,j.names),{})}}class m extends f{render(v){return"{"+v._n+super.render(v)+"}"+v._n}}class y extends f{}class b extends m{}b.kind="else";class g extends m{constructor(v,j){super(j),this.condition=v}render(v){let j=`if(${this.condition})`+super.render(v);return this.else&&(j+="else "+this.else.render(v)),j}optimizeNodes(){super.optimizeNodes();const v=this.condition;if(v===!0)return this.nodes;let j=this.else;if(j){const M=j.optimizeNodes();j=this.else=Array.isArray(M)?new b(M):M}if(j)return v===!1?j instanceof g?j:j.nodes:this.nodes.length?this:new g(Ae(v),j instanceof g?[j]:j.nodes);if(!(v===!1||!this.nodes.length))return this}optimizeNames(v,j){var M;if(this.else=(M=this.else)===null||M===void 0?void 0:M.optimizeNames(v,j),!!(super.optimizeNames(v,j)||this.else))return this.condition=re(this.condition,v,j),this}get names(){const v=super.names;return ae(v,this.condition),this.else&&F(v,this.else.names),v}}g.kind="if";class x extends m{}x.kind="for";class C extends x{constructor(v){super(),this.iteration=v}render(v){return`for(${this.iteration})`+super.render(v)}optimizeNames(v,j){if(super.optimizeNames(v,j))return this.iteration=re(this.iteration,v,j),this}get names(){return F(super.names,this.iteration.names)}}class P extends x{constructor(v,j,M,U){super(),this.varKind=v,this.name=j,this.from=M,this.to=U}render(v){const j=v.es5?t.varKinds.var:this.varKind,{name:M,from:U,to:V}=this;return`for(${j} ${M}=${U}; ${M}<${V}; ${M}++)`+super.render(v)}get names(){const v=ae(super.names,this.from);return ae(v,this.to)}}class A extends x{constructor(v,j,M,U){super(),this.loop=v,this.varKind=j,this.name=M,this.iterable=U}render(v){return`for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})`+super.render(v)}optimizeNames(v,j){if(super.optimizeNames(v,j))return this.iterable=re(this.iterable,v,j),this}get names(){return F(super.names,this.iterable.names)}}class N extends m{constructor(v,j,M){super(),this.name=v,this.args=j,this.async=M}render(v){return`${this.async?"async ":""}function ${this.name}(${this.args})`+super.render(v)}}N.kind="func";class D extends f{render(v){return"return "+super.render(v)}}D.kind="return";class te extends m{render(v){let j="try"+super.render(v);return this.catch&&(j+=this.catch.render(v)),this.finally&&(j+=this.finally.render(v)),j}optimizeNodes(){var v,j;return super.optimizeNodes(),(v=this.catch)===null||v===void 0||v.optimizeNodes(),(j=this.finally)===null||j===void 0||j.optimizeNodes(),this}optimizeNames(v,j){var M,U;return super.optimizeNames(v,j),(M=this.catch)===null||M===void 0||M.optimizeNames(v,j),(U=this.finally)===null||U===void 0||U.optimizeNames(v,j),this}get names(){const v=super.names;return this.catch&&F(v,this.catch.names),this.finally&&F(v,this.finally.names),v}}class Z extends m{constructor(v){super(),this.error=v}render(v){return`catch(${this.error})`+super.render(v)}}Z.kind="catch";class he extends m{render(v){return"finally"+super.render(v)}}he.kind="finally";class Q{constructor(v,j={}){this._values={},this._blockStarts=[],this._constants={},this.opts={...j,_n:j.lines?`
`:""},this._extScope=v,this._scope=new t.Scope({parent:v}),this._nodes=[new y]}toString(){return this._root.render(this.opts)}name(v){return this._scope.name(v)}scopeName(v){return this._extScope.name(v)}scopeValue(v,j){const M=this._extScope.value(v,j);return(this._values[M.prefix]||(this._values[M.prefix]=new Set)).add(M),M}getScopeValue(v,j){return this._extScope.getValue(v,j)}scopeRefs(v){return this._extScope.scopeRefs(v,this._values)}scopeCode(){return this._extScope.scopeCode(this._values)}_def(v,j,M,U){const V=this._scope.toName(j);return M!==void 0&&U&&(this._constants[V.str]=M),this._leafNode(new o(v,V,M)),V}const(v,j,M){return this._def(t.varKinds.const,v,j,M)}let(v,j,M){return this._def(t.varKinds.let,v,j,M)}var(v,j,M){return this._def(t.varKinds.var,v,j,M)}assign(v,j,M){return this._leafNode(new a(v,j,M))}add(v,j){return this._leafNode(new l(v,s.operators.ADD,j))}code(v){return typeof v=="function"?v():v!==e.nil&&this._leafNode(new u(v)),this}object(...v){const j=["{"];for(const[M,U]of v)j.length>1&&j.push(","),j.push(M),(M!==U||this.opts.es5)&&(j.push(":"),(0,e.addCodeArg)(j,U));return j.push("}"),new e._Code(j)}if(v,j,M){if(this._blockNode(new g(v)),j&&M)this.code(j).else().code(M).endIf();else if(j)this.code(j).endIf();else if(M)throw new Error('CodeGen: "else" body without "then" body');return this}elseIf(v){return this._elseNode(new g(v))}else(){return this._elseNode(new b)}endIf(){return this._endBlockNode(g,b)}_for(v,j){return this._blockNode(v),j&&this.code(j).endFor(),this}for(v,j){return this._for(new C(v),j)}forRange(v,j,M,U,V=this.opts.es5?t.varKinds.var:t.varKinds.let){const le=this._scope.toName(v);return this._for(new P(V,le,j,M),()=>U(le))}forOf(v,j,M,U=t.varKinds.const){const V=this._scope.toName(v);if(this.opts.es5){const le=j instanceof e.Name?j:this.var("_arr",j);return this.forRange("_i",0,(0,e._)`${le}.length`,ce=>{this.var(V,(0,e._)`${le}[${ce}]`),M(V)})}return this._for(new A("of",U,V,j),()=>M(V))}forIn(v,j,M,U=this.opts.es5?t.varKinds.var:t.varKinds.const){if(this.opts.ownProperties)return this.forOf(v,(0,e._)`Object.keys(${j})`,M);const V=this._scope.toName(v);return this._for(new A("in",U,V,j),()=>M(V))}endFor(){return this._endBlockNode(x)}label(v){return this._leafNode(new c(v))}break(v){return this._leafNode(new h(v))}return(v){const j=new D;if(this._blockNode(j),this.code(v),j.nodes.length!==1)throw new Error('CodeGen: "return" should have one node');return this._endBlockNode(D)}try(v,j,M){if(!j&&!M)throw new Error('CodeGen: "try" without "catch" and "finally"');const U=new te;if(this._blockNode(U),this.code(v),j){const V=this.name("e");this._currNode=U.catch=new Z(V),j(V)}return M&&(this._currNode=U.finally=new he,this.code(M)),this._endBlockNode(Z,he)}throw(v){return this._leafNode(new d(v))}block(v,j){return this._blockStarts.push(this._nodes.length),v&&this.code(v).endBlock(j),this}endBlock(v){const j=this._blockStarts.pop();if(j===void 0)throw new Error("CodeGen: not in self-balancing block");const M=this._nodes.length-j;if(M<0||v!==void 0&&M!==v)throw new Error(`CodeGen: wrong number of nodes: ${M} vs ${v} expected`);return this._nodes.length=j,this}func(v,j=e.nil,M,U){return this._blockNode(new N(v,j,M)),U&&this.code(U).endFunc(),this}endFunc(){return this._endBlockNode(N)}optimize(v=1){for(;v-- >0;)this._root.optimizeNodes(),this._root.optimizeNames(this._root.names,this._constants)}_leafNode(v){return this._currNode.nodes.push(v),this}_blockNode(v){this._currNode.nodes.push(v),this._nodes.push(v)}_endBlockNode(v,j){const M=this._currNode;if(M instanceof v||j&&M instanceof j)return this._nodes.pop(),this;throw new Error(`CodeGen: not in block "${j?`${v.kind}/${j.kind}`:v.kind}"`)}_elseNode(v){const j=this._currNode;if(!(j instanceof g))throw new Error('CodeGen: "else" without "if"');return this._currNode=j.else=v,this}get _root(){return this._nodes[0]}get _currNode(){const v=this._nodes;return v[v.length-1]}set _currNode(v){const j=this._nodes;j[j.length-1]=v}}s.CodeGen=Q;function F(E,v){for(const j in v)E[j]=(E[j]||0)+(v[j]||0);return E}function ae(E,v){return v instanceof e._CodeOrName?F(E,v.names):E}function re(E,v,j){if(E instanceof e.Name)return M(E);if(!U(E))return E;return new e._Code(E._items.reduce((V,le)=>(le instanceof e.Name&&(le=M(le)),le instanceof e._Code?V.push(...le._items):V.push(le),V),[]));function M(V){const le=j[V.str];return le===void 0||v[V.str]!==1?V:(delete v[V.str],le)}function U(V){return V instanceof e._Code&&V._items.some(le=>le instanceof e.Name&&v[le.str]===1&&j[le.str]!==void 0)}}function me(E,v){for(const j in v)E[j]=(E[j]||0)-(v[j]||0)}function Ae(E){return typeof E=="boolean"||typeof E=="number"||E===null?!E:(0,e._)`!${T(E)}`}s.not=Ae;const Ge=S(s.operators.AND);function Je(...E){return E.reduce(Ge)}s.and=Je;const Te=S(s.operators.OR);function R(...E){return E.reduce(Te)}s.or=R;function S(E){return(v,j)=>v===e.nil?j:j===e.nil?v:(0,e._)`${T(v)} ${E} ${T(j)}`}function T(E){return E instanceof e.Name?E:(0,e._)`(${E})`}})(oe);var B={};Object.defineProperty(B,"__esModule",{value:!0});B.checkStrictMode=B.getErrorPath=B.Type=B.useFunc=B.setEvaluated=B.evaluatedPropsToName=B.mergeEvaluated=B.eachItem=B.unescapeJsonPointer=B.escapeJsonPointer=B.escapeFragment=B.unescapeFragment=B.schemaRefOrVal=B.schemaHasRulesButRef=B.schemaHasRules=B.checkUnknownRules=B.alwaysValidSchema=B.toHash=void 0;const ge=oe,Ud=_s;function Hd(s){const e={};for(const t of s)e[t]=!0;return e}B.toHash=Hd;function Vd(s,e){return typeof e=="boolean"?e:Object.keys(e).length===0?!0:(pc(s,e),!mc(e,s.self.RULES.all))}B.alwaysValidSchema=Vd;function pc(s,e=s.schema){const{opts:t,self:n}=s;if(!t.strictSchema||typeof e=="boolean")return;const r=n.RULES.keywords;for(const i in e)r[i]||bc(s,`unknown keyword: "${i}"`)}B.checkUnknownRules=pc;function mc(s,e){if(typeof s=="boolean")return!s;for(const t in s)if(e[t])return!0;return!1}B.schemaHasRules=mc;function Wd(s,e){if(typeof s=="boolean")return!s;for(const t in s)if(t!=="$ref"&&e.all[t])return!0;return!1}B.schemaHasRulesButRef=Wd;function Kd({topSchemaRef:s,schemaPath:e},t,n,r){if(!r){if(typeof t=="number"||typeof t=="boolean")return t;if(typeof t=="string")return(0,ge._)`${t}`}return(0,ge._)`${s}${e}${(0,ge.getProperty)(n)}`}B.schemaRefOrVal=Kd;function Gd(s){return gc(decodeURIComponent(s))}B.unescapeFragment=Gd;function Yd(s){return encodeURIComponent(fo(s))}B.escapeFragment=Yd;function fo(s){return typeof s=="number"?`${s}`:s.replace(/~/g,"~0").replace(/\//g,"~1")}B.escapeJsonPointer=fo;function gc(s){return s.replace(/~1/g,"/").replace(/~0/g,"~")}B.unescapeJsonPointer=gc;function Xd(s,e){if(Array.isArray(s))for(const t of s)e(t);else e(s)}B.eachItem=Xd;function Ma({mergeNames:s,mergeToName:e,mergeValues:t,resultToName:n}){return(r,i,o,a)=>{const l=o===void 0?i:o instanceof ge.Name?(i instanceof ge.Name?s(r,i,o):e(r,i,o),o):i instanceof ge.Name?(e(r,o,i),i):t(i,o);return a===ge.Name&&!(l instanceof ge.Name)?n(r,l):l}}B.mergeEvaluated={props:Ma({mergeNames:(s,e,t)=>s.if((0,ge._)`${t} !== true && ${e} !== undefined`,()=>{s.if((0,ge._)`${e} === true`,()=>s.assign(t,!0),()=>s.assign(t,(0,ge._)`${t} || {}`).code((0,ge._)`Object.assign(${t}, ${e})`))}),mergeToName:(s,e,t)=>s.if((0,ge._)`${t} !== true`,()=>{e===!0?s.assign(t,!0):(s.assign(t,(0,ge._)`${t} || {}`),po(s,t,e))}),mergeValues:(s,e)=>s===!0?!0:{...s,...e},resultToName:vc}),items:Ma({mergeNames:(s,e,t)=>s.if((0,ge._)`${t} !== true && ${e} !== undefined`,()=>s.assign(t,(0,ge._)`${e} === true ? true : ${t} > ${e} ? ${t} : ${e}`)),mergeToName:(s,e,t)=>s.if((0,ge._)`${t} !== true`,()=>s.assign(t,e===!0?!0:(0,ge._)`${t} > ${e} ? ${t} : ${e}`)),mergeValues:(s,e)=>s===!0?!0:Math.max(s,e),resultToName:(s,e)=>s.var("items",e)})};function vc(s,e){if(e===!0)return s.var("props",!0);const t=s.var("props",(0,ge._)`{}`);return e!==void 0&&po(s,t,e),t}B.evaluatedPropsToName=vc;function po(s,e,t){Object.keys(t).forEach(n=>s.assign((0,ge._)`${e}${(0,ge.getProperty)(n)}`,!0))}B.setEvaluated=po;const Pa={};function Qd(s,e){return s.scopeValue("func",{ref:e,code:Pa[e.code]||(Pa[e.code]=new Ud._Code(e.code))})}B.useFunc=Qd;var xi;(function(s){s[s.Num=0]="Num",s[s.Str=1]="Str"})(xi||(B.Type=xi={}));function Jd(s,e,t){if(s instanceof ge.Name){const n=e===xi.Num;return t?n?(0,ge._)`"[" + ${s} + "]"`:(0,ge._)`"['" + ${s} + "']"`:n?(0,ge._)`"/" + ${s}`:(0,ge._)`"/" + ${s}.replace(/~/g, "~0").replace(/\\//g, "~1")`}return t?(0,ge.getProperty)(s).toString():"/"+fo(s)}B.getErrorPath=Jd;function bc(s,e,t=s.opts.strictSchema){if(t){if(e=`strict mode: ${e}`,t===!0)throw new Error(e);s.self.logger.warn(e)}}B.checkStrictMode=bc;var Ct={};Object.defineProperty(Ct,"__esModule",{value:!0});const Be=oe,Zd={data:new Be.Name("data"),valCxt:new Be.Name("valCxt"),instancePath:new Be.Name("instancePath"),parentData:new Be.Name("parentData"),parentDataProperty:new Be.Name("parentDataProperty"),rootData:new Be.Name("rootData"),dynamicAnchors:new Be.Name("dynamicAnchors"),vErrors:new Be.Name("vErrors"),errors:new Be.Name("errors"),this:new Be.Name("this"),self:new Be.Name("self"),scope:new Be.Name("scope"),json:new Be.Name("json"),jsonPos:new Be.Name("jsonPos"),jsonLen:new Be.Name("jsonLen"),jsonPart:new Be.Name("jsonPart")};Ct.default=Zd;(function(s){Object.defineProperty(s,"__esModule",{value:!0}),s.extendErrors=s.resetErrorsCount=s.reportExtraError=s.reportError=s.keyword$DataError=s.keywordError=void 0;const e=oe,t=B,n=Ct;s.keywordError={message:({keyword:b})=>(0,e.str)`must pass "${b}" keyword validation`},s.keyword$DataError={message:({keyword:b,schemaType:g})=>g?(0,e.str)`"${b}" keyword must be ${g} ($data)`:(0,e.str)`"${b}" keyword is invalid ($data)`};function r(b,g=s.keywordError,x,C){const{it:P}=b,{gen:A,compositeRule:N,allErrors:D}=P,te=d(b,g,x);C??(N||D)?l(A,te):c(P,(0,e._)`[${te}]`)}s.reportError=r;function i(b,g=s.keywordError,x){const{it:C}=b,{gen:P,compositeRule:A,allErrors:N}=C,D=d(b,g,x);l(P,D),A||N||c(C,n.default.vErrors)}s.reportExtraError=i;function o(b,g){b.assign(n.default.errors,g),b.if((0,e._)`${n.default.vErrors} !== null`,()=>b.if(g,()=>b.assign((0,e._)`${n.default.vErrors}.length`,g),()=>b.assign(n.default.vErrors,null)))}s.resetErrorsCount=o;function a({gen:b,keyword:g,schemaValue:x,data:C,errsCount:P,it:A}){if(P===void 0)throw new Error("ajv implementation error");const N=b.name("err");b.forRange("i",P,n.default.errors,D=>{b.const(N,(0,e._)`${n.default.vErrors}[${D}]`),b.if((0,e._)`${N}.instancePath === undefined`,()=>b.assign((0,e._)`${N}.instancePath`,(0,e.strConcat)(n.default.instancePath,A.errorPath))),b.assign((0,e._)`${N}.schemaPath`,(0,e.str)`${A.errSchemaPath}/${g}`),A.opts.verbose&&(b.assign((0,e._)`${N}.schema`,x),b.assign((0,e._)`${N}.data`,C))})}s.extendErrors=a;function l(b,g){const x=b.const("err",g);b.if((0,e._)`${n.default.vErrors} === null`,()=>b.assign(n.default.vErrors,(0,e._)`[${x}]`),(0,e._)`${n.default.vErrors}.push(${x})`),b.code((0,e._)`${n.default.errors}++`)}function c(b,g){const{gen:x,validateName:C,schemaEnv:P}=b;P.$async?x.throw((0,e._)`new ${b.ValidationError}(${g})`):(x.assign((0,e._)`${C}.errors`,g),x.return(!1))}const h={keyword:new e.Name("keyword"),schemaPath:new e.Name("schemaPath"),params:new e.Name("params"),propertyName:new e.Name("propertyName"),message:new e.Name("message"),schema:new e.Name("schema"),parentSchema:new e.Name("parentSchema")};function d(b,g,x){const{createErrors:C}=b.it;return C===!1?(0,e._)`{}`:u(b,g,x)}function u(b,g,x={}){const{gen:C,it:P}=b,A=[f(P,x),m(b,x)];return y(b,g,A),C.object(...A)}function f({errorPath:b},{instancePath:g}){const x=g?(0,e.str)`${b}${(0,t.getErrorPath)(g,t.Type.Str)}`:b;return[n.default.instancePath,(0,e.strConcat)(n.default.instancePath,x)]}function m({keyword:b,it:{errSchemaPath:g}},{schemaPath:x,parentSchema:C}){let P=C?g:(0,e.str)`${g}/${b}`;return x&&(P=(0,e.str)`${P}${(0,t.getErrorPath)(x,t.Type.Str)}`),[h.schemaPath,P]}function y(b,{params:g,message:x},C){const{keyword:P,data:A,schemaValue:N,it:D}=b,{opts:te,propertyName:Z,topSchemaRef:he,schemaPath:Q}=D;C.push([h.keyword,P],[h.params,typeof g=="function"?g(b):g||(0,e._)`{}`]),te.messages&&C.push([h.message,typeof x=="function"?x(b):x]),te.verbose&&C.push([h.schema,N],[h.parentSchema,(0,e._)`${he}${Q}`],[n.default.data,A]),Z&&C.push([h.propertyName,Z])}})(Ts);Object.defineProperty(zn,"__esModule",{value:!0});zn.boolOrEmptySchema=zn.topBoolOrEmptySchema=void 0;const eu=Ts,tu=oe,nu=Ct,su={message:"boolean schema is false"};function ru(s){const{gen:e,schema:t,validateName:n}=s;t===!1?yc(s,!1):typeof t=="object"&&t.$async===!0?e.return(nu.default.data):(e.assign((0,tu._)`${n}.errors`,null),e.return(!0))}zn.topBoolOrEmptySchema=ru;function iu(s,e){const{gen:t,schema:n}=s;n===!1?(t.var(e,!1),yc(s)):t.var(e,!0)}zn.boolOrEmptySchema=iu;function yc(s,e){const{gen:t,data:n}=s,r={gen:t,keyword:"false schema",data:n,schema:!1,schemaCode:!1,schemaValue:!1,params:{},it:s};(0,eu.reportError)(r,su,void 0,e)}var Oe={},pn={};Object.defineProperty(pn,"__esModule",{value:!0});pn.getRules=pn.isJSONType=void 0;const ou=["string","number","integer","boolean","null","object","array"],au=new Set(ou);function lu(s){return typeof s=="string"&&au.has(s)}pn.isJSONType=lu;function cu(){const s={number:{type:"number",rules:[]},string:{type:"string",rules:[]},array:{type:"array",rules:[]},object:{type:"object",rules:[]}};return{types:{...s,integer:!0,boolean:!0,null:!0},rules:[{rules:[]},s.number,s.string,s.array,s.object],post:{rules:[]},all:{},keywords:{}}}pn.getRules=cu;var zt={};Object.defineProperty(zt,"__esModule",{value:!0});zt.shouldUseRule=zt.shouldUseGroup=zt.schemaHasRulesForType=void 0;function hu({schema:s,self:e},t){const n=e.RULES.types[t];return n&&n!==!0&&wc(s,n)}zt.schemaHasRulesForType=hu;function wc(s,e){return e.rules.some(t=>jc(s,t))}zt.shouldUseGroup=wc;function jc(s,e){var t;return s[e.keyword]!==void 0||((t=e.definition.implements)===null||t===void 0?void 0:t.some(n=>s[n]!==void 0))}zt.shouldUseRule=jc;Object.defineProperty(Oe,"__esModule",{value:!0});Oe.reportTypeError=Oe.checkDataTypes=Oe.checkDataType=Oe.coerceAndCheckDataType=Oe.getJSONTypes=Oe.getSchemaTypes=Oe.DataType=void 0;const du=pn,uu=zt,fu=Ts,se=oe,xc=B;var $n;(function(s){s[s.Correct=0]="Correct",s[s.Wrong=1]="Wrong"})($n||(Oe.DataType=$n={}));function pu(s){const e=kc(s.type);if(e.includes("null")){if(s.nullable===!1)throw new Error("type: null contradicts nullable: false")}else{if(!e.length&&s.nullable!==void 0)throw new Error('"nullable" cannot be used without "type"');s.nullable===!0&&e.push("null")}return e}Oe.getSchemaTypes=pu;function kc(s){const e=Array.isArray(s)?s:s?[s]:[];if(e.every(du.isJSONType))return e;throw new Error("type must be JSONType or JSONType[]: "+e.join(","))}Oe.getJSONTypes=kc;function mu(s,e){const{gen:t,data:n,opts:r}=s,i=gu(e,r.coerceTypes),o=e.length>0&&!(i.length===0&&e.length===1&&(0,uu.schemaHasRulesForType)(s,e[0]));if(o){const a=mo(e,n,r.strictNumbers,$n.Wrong);t.if(a,()=>{i.length?vu(s,e,i):go(s)})}return o}Oe.coerceAndCheckDataType=mu;const Sc=new Set(["string","number","integer","boolean","null"]);function gu(s,e){return e?s.filter(t=>Sc.has(t)||e==="array"&&t==="array"):[]}function vu(s,e,t){const{gen:n,data:r,opts:i}=s,o=n.let("dataType",(0,se._)`typeof ${r}`),a=n.let("coerced",(0,se._)`undefined`);i.coerceTypes==="array"&&n.if((0,se._)`${o} == 'object' && Array.isArray(${r}) && ${r}.length == 1`,()=>n.assign(r,(0,se._)`${r}[0]`).assign(o,(0,se._)`typeof ${r}`).if(mo(e,r,i.strictNumbers),()=>n.assign(a,r))),n.if((0,se._)`${a} !== undefined`);for(const c of t)(Sc.has(c)||c==="array"&&i.coerceTypes==="array")&&l(c);n.else(),go(s),n.endIf(),n.if((0,se._)`${a} !== undefined`,()=>{n.assign(r,a),bu(s,a)});function l(c){switch(c){case"string":n.elseIf((0,se._)`${o} == "number" || ${o} == "boolean"`).assign(a,(0,se._)`"" + ${r}`).elseIf((0,se._)`${r} === null`).assign(a,(0,se._)`""`);return;case"number":n.elseIf((0,se._)`${o} == "boolean" || ${r} === null
              || (${o} == "string" && ${r} && ${r} == +${r})`).assign(a,(0,se._)`+${r}`);return;case"integer":n.elseIf((0,se._)`${o} === "boolean" || ${r} === null
              || (${o} === "string" && ${r} && ${r} == +${r} && !(${r} % 1))`).assign(a,(0,se._)`+${r}`);return;case"boolean":n.elseIf((0,se._)`${r} === "false" || ${r} === 0 || ${r} === null`).assign(a,!1).elseIf((0,se._)`${r} === "true" || ${r} === 1`).assign(a,!0);return;case"null":n.elseIf((0,se._)`${r} === "" || ${r} === 0 || ${r} === false`),n.assign(a,null);return;case"array":n.elseIf((0,se._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${r} === null`).assign(a,(0,se._)`[${r}]`)}}}function bu({gen:s,parentData:e,parentDataProperty:t},n){s.if((0,se._)`${e} !== undefined`,()=>s.assign((0,se._)`${e}[${t}]`,n))}function ki(s,e,t,n=$n.Correct){const r=n===$n.Correct?se.operators.EQ:se.operators.NEQ;let i;switch(s){case"null":return(0,se._)`${e} ${r} null`;case"array":i=(0,se._)`Array.isArray(${e})`;break;case"object":i=(0,se._)`${e} && typeof ${e} == "object" && !Array.isArray(${e})`;break;case"integer":i=o((0,se._)`!(${e} % 1) && !isNaN(${e})`);break;case"number":i=o();break;default:return(0,se._)`typeof ${e} ${r} ${s}`}return n===$n.Correct?i:(0,se.not)(i);function o(a=se.nil){return(0,se.and)((0,se._)`typeof ${e} == "number"`,a,t?(0,se._)`isFinite(${e})`:se.nil)}}Oe.checkDataType=ki;function mo(s,e,t,n){if(s.length===1)return ki(s[0],e,t,n);let r;const i=(0,xc.toHash)(s);if(i.array&&i.object){const o=(0,se._)`typeof ${e} != "object"`;r=i.null?o:(0,se._)`!${e} || ${o}`,delete i.null,delete i.array,delete i.object}else r=se.nil;i.number&&delete i.integer;for(const o in i)r=(0,se.and)(r,ki(o,e,t,n));return r}Oe.checkDataTypes=mo;const yu={message:({schema:s})=>`must be ${s}`,params:({schema:s,schemaValue:e})=>typeof s=="string"?(0,se._)`{type: ${s}}`:(0,se._)`{type: ${e}}`};function go(s){const e=wu(s);(0,fu.reportError)(e,yu)}Oe.reportTypeError=go;function wu(s){const{gen:e,data:t,schema:n}=s,r=(0,xc.schemaRefOrVal)(s,n,"type");return{gen:e,keyword:"type",data:t,schema:n.type,schemaCode:r,schemaValue:r,parentSchema:n,params:{},it:s}}var Dr={};Object.defineProperty(Dr,"__esModule",{value:!0});Dr.assignDefaults=void 0;const Sn=oe,ju=B;function xu(s,e){const{properties:t,items:n}=s.schema;if(e==="object"&&t)for(const r in t)Aa(s,r,t[r].default);else e==="array"&&Array.isArray(n)&&n.forEach((r,i)=>Aa(s,i,r.default))}Dr.assignDefaults=xu;function Aa(s,e,t){const{gen:n,compositeRule:r,data:i,opts:o}=s;if(t===void 0)return;const a=(0,Sn._)`${i}${(0,Sn.getProperty)(e)}`;if(r){(0,ju.checkStrictMode)(s,`default is ignored for: ${a}`);return}let l=(0,Sn._)`${a} === undefined`;o.useDefaults==="empty"&&(l=(0,Sn._)`${l} || ${a} === null || ${a} === ""`),n.if(l,(0,Sn._)`${a} = ${(0,Sn.stringify)(t)}`)}var jt={},ie={};Object.defineProperty(ie,"__esModule",{value:!0});ie.validateUnion=ie.validateArray=ie.usePattern=ie.callValidateCode=ie.schemaProperties=ie.allSchemaProperties=ie.noPropertyInData=ie.propertyInData=ie.isOwnProperty=ie.hasPropFunc=ie.reportMissingProp=ie.checkMissingProp=ie.checkReportMissingProp=void 0;const xe=oe,vo=B,Bt=Ct,ku=B;function Su(s,e){const{gen:t,data:n,it:r}=s;t.if(yo(t,n,e,r.opts.ownProperties),()=>{s.setParams({missingProperty:(0,xe._)`${e}`},!0),s.error()})}ie.checkReportMissingProp=Su;function _u({gen:s,data:e,it:{opts:t}},n,r){return(0,xe.or)(...n.map(i=>(0,xe.and)(yo(s,e,i,t.ownProperties),(0,xe._)`${r} = ${i}`)))}ie.checkMissingProp=_u;function Eu(s,e){s.setParams({missingProperty:e},!0),s.error()}ie.reportMissingProp=Eu;function _c(s){return s.scopeValue("func",{ref:Object.prototype.hasOwnProperty,code:(0,xe._)`Object.prototype.hasOwnProperty`})}ie.hasPropFunc=_c;function bo(s,e,t){return(0,xe._)`${_c(s)}.call(${e}, ${t})`}ie.isOwnProperty=bo;function Cu(s,e,t,n){const r=(0,xe._)`${e}${(0,xe.getProperty)(t)} !== undefined`;return n?(0,xe._)`${r} && ${bo(s,e,t)}`:r}ie.propertyInData=Cu;function yo(s,e,t,n){const r=(0,xe._)`${e}${(0,xe.getProperty)(t)} === undefined`;return n?(0,xe.or)(r,(0,xe.not)(bo(s,e,t))):r}ie.noPropertyInData=yo;function Ec(s){return s?Object.keys(s).filter(e=>e!=="__proto__"):[]}ie.allSchemaProperties=Ec;function Ou(s,e){return Ec(e).filter(t=>!(0,vo.alwaysValidSchema)(s,e[t]))}ie.schemaProperties=Ou;function $u({schemaCode:s,data:e,it:{gen:t,topSchemaRef:n,schemaPath:r,errorPath:i},it:o},a,l,c){const h=c?(0,xe._)`${s}, ${e}, ${n}${r}`:e,d=[[Bt.default.instancePath,(0,xe.strConcat)(Bt.default.instancePath,i)],[Bt.default.parentData,o.parentData],[Bt.default.parentDataProperty,o.parentDataProperty],[Bt.default.rootData,Bt.default.rootData]];o.opts.dynamicRef&&d.push([Bt.default.dynamicAnchors,Bt.default.dynamicAnchors]);const u=(0,xe._)`${h}, ${t.object(...d)}`;return l!==xe.nil?(0,xe._)`${a}.call(${l}, ${u})`:(0,xe._)`${a}(${u})`}ie.callValidateCode=$u;const Mu=(0,xe._)`new RegExp`;function Pu({gen:s,it:{opts:e}},t){const n=e.unicodeRegExp?"u":"",{regExp:r}=e.code,i=r(t,n);return s.scopeValue("pattern",{key:i.toString(),ref:i,code:(0,xe._)`${r.code==="new RegExp"?Mu:(0,ku.useFunc)(s,r)}(${t}, ${n})`})}ie.usePattern=Pu;function Au(s){const{gen:e,data:t,keyword:n,it:r}=s,i=e.name("valid");if(r.allErrors){const a=e.let("valid",!0);return o(()=>e.assign(a,!1)),a}return e.var(i,!0),o(()=>e.break()),i;function o(a){const l=e.const("len",(0,xe._)`${t}.length`);e.forRange("i",0,l,c=>{s.subschema({keyword:n,dataProp:c,dataPropType:vo.Type.Num},i),e.if((0,xe.not)(i),a)})}}ie.validateArray=Au;function Tu(s){const{gen:e,schema:t,keyword:n,it:r}=s;if(!Array.isArray(t))throw new Error("ajv implementation error");if(t.some(l=>(0,vo.alwaysValidSchema)(r,l))&&!r.opts.unevaluated)return;const o=e.let("valid",!1),a=e.name("_valid");e.block(()=>t.forEach((l,c)=>{const h=s.subschema({keyword:n,schemaProp:c,compositeRule:!0},a);e.assign(o,(0,xe._)`${o} || ${a}`),s.mergeValidEvaluated(h,a)||e.if((0,xe.not)(o))})),s.result(o,()=>s.reset(),()=>s.error(!0))}ie.validateUnion=Tu;Object.defineProperty(jt,"__esModule",{value:!0});jt.validateKeywordUsage=jt.validSchemaType=jt.funcKeywordCode=jt.macroKeywordCode=void 0;const We=oe,on=Ct,zu=ie,Nu=Ts;function Ru(s,e){const{gen:t,keyword:n,schema:r,parentSchema:i,it:o}=s,a=e.macro.call(o.self,r,i,o),l=Cc(t,n,a);o.opts.validateSchema!==!1&&o.self.validateSchema(a,!0);const c=t.name("valid");s.subschema({schema:a,schemaPath:We.nil,errSchemaPath:`${o.errSchemaPath}/${n}`,topSchemaRef:l,compositeRule:!0},c),s.pass(c,()=>s.error(!0))}jt.macroKeywordCode=Ru;function Du(s,e){var t;const{gen:n,keyword:r,schema:i,parentSchema:o,$data:a,it:l}=s;qu(l,e);const c=!a&&e.compile?e.compile.call(l.self,i,o,l):e.validate,h=Cc(n,r,c),d=n.let("valid");s.block$data(d,u),s.ok((t=e.valid)!==null&&t!==void 0?t:d);function u(){if(e.errors===!1)y(),e.modifying&&Ta(s),b(()=>s.error());else{const g=e.async?f():m();e.modifying&&Ta(s),b(()=>Iu(s,g))}}function f(){const g=n.let("ruleErrs",null);return n.try(()=>y((0,We._)`await `),x=>n.assign(d,!1).if((0,We._)`${x} instanceof ${l.ValidationError}`,()=>n.assign(g,(0,We._)`${x}.errors`),()=>n.throw(x))),g}function m(){const g=(0,We._)`${h}.errors`;return n.assign(g,null),y(We.nil),g}function y(g=e.async?(0,We._)`await `:We.nil){const x=l.opts.passContext?on.default.this:on.default.self,C=!("compile"in e&&!a||e.schema===!1);n.assign(d,(0,We._)`${g}${(0,zu.callValidateCode)(s,h,x,C)}`,e.modifying)}function b(g){var x;n.if((0,We.not)((x=e.valid)!==null&&x!==void 0?x:d),g)}}jt.funcKeywordCode=Du;function Ta(s){const{gen:e,data:t,it:n}=s;e.if(n.parentData,()=>e.assign(t,(0,We._)`${n.parentData}[${n.parentDataProperty}]`))}function Iu(s,e){const{gen:t}=s;t.if((0,We._)`Array.isArray(${e})`,()=>{t.assign(on.default.vErrors,(0,We._)`${on.default.vErrors} === null ? ${e} : ${on.default.vErrors}.concat(${e})`).assign(on.default.errors,(0,We._)`${on.default.vErrors}.length`),(0,Nu.extendErrors)(s)},()=>s.error())}function qu({schemaEnv:s},e){if(e.async&&!s.$async)throw new Error("async keyword in sync schema")}function Cc(s,e,t){if(t===void 0)throw new Error(`keyword "${e}" failed to compile`);return s.scopeValue("keyword",typeof t=="function"?{ref:t}:{ref:t,code:(0,We.stringify)(t)})}function Bu(s,e,t=!1){return!e.length||e.some(n=>n==="array"?Array.isArray(s):n==="object"?s&&typeof s=="object"&&!Array.isArray(s):typeof s==n||t&&typeof s>"u")}jt.validSchemaType=Bu;function Lu({schema:s,opts:e,self:t,errSchemaPath:n},r,i){if(Array.isArray(r.keyword)?!r.keyword.includes(i):r.keyword!==i)throw new Error("ajv implementation error");const o=r.dependencies;if(o?.some(a=>!Object.prototype.hasOwnProperty.call(s,a)))throw new Error(`parent schema must have dependencies of ${i}: ${o.join(",")}`);if(r.validateSchema&&!r.validateSchema(s[i])){const l=`keyword "${i}" value is invalid at path "${n}": `+t.errorsText(r.validateSchema.errors);if(e.validateSchema==="log")t.logger.error(l);else throw new Error(l)}}jt.validateKeywordUsage=Lu;var Gt={};Object.defineProperty(Gt,"__esModule",{value:!0});Gt.extendSubschemaMode=Gt.extendSubschemaData=Gt.getSubschema=void 0;const bt=oe,Oc=B;function Fu(s,{keyword:e,schemaProp:t,schema:n,schemaPath:r,errSchemaPath:i,topSchemaRef:o}){if(e!==void 0&&n!==void 0)throw new Error('both "keyword" and "schema" passed, only one allowed');if(e!==void 0){const a=s.schema[e];return t===void 0?{schema:a,schemaPath:(0,bt._)`${s.schemaPath}${(0,bt.getProperty)(e)}`,errSchemaPath:`${s.errSchemaPath}/${e}`}:{schema:a[t],schemaPath:(0,bt._)`${s.schemaPath}${(0,bt.getProperty)(e)}${(0,bt.getProperty)(t)}`,errSchemaPath:`${s.errSchemaPath}/${e}/${(0,Oc.escapeFragment)(t)}`}}if(n!==void 0){if(r===void 0||i===void 0||o===void 0)throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');return{schema:n,schemaPath:r,topSchemaRef:o,errSchemaPath:i}}throw new Error('either "keyword" or "schema" must be passed')}Gt.getSubschema=Fu;function Uu(s,e,{dataProp:t,dataPropType:n,data:r,dataTypes:i,propertyName:o}){if(r!==void 0&&t!==void 0)throw new Error('both "data" and "dataProp" passed, only one allowed');const{gen:a}=e;if(t!==void 0){const{errorPath:c,dataPathArr:h,opts:d}=e,u=a.let("data",(0,bt._)`${e.data}${(0,bt.getProperty)(t)}`,!0);l(u),s.errorPath=(0,bt.str)`${c}${(0,Oc.getErrorPath)(t,n,d.jsPropertySyntax)}`,s.parentDataProperty=(0,bt._)`${t}`,s.dataPathArr=[...h,s.parentDataProperty]}if(r!==void 0){const c=r instanceof bt.Name?r:a.let("data",r,!0);l(c),o!==void 0&&(s.propertyName=o)}i&&(s.dataTypes=i);function l(c){s.data=c,s.dataLevel=e.dataLevel+1,s.dataTypes=[],e.definedProperties=new Set,s.parentData=e.data,s.dataNames=[...e.dataNames,c]}}Gt.extendSubschemaData=Uu;function Hu(s,{jtdDiscriminator:e,jtdMetadata:t,compositeRule:n,createErrors:r,allErrors:i}){n!==void 0&&(s.compositeRule=n),r!==void 0&&(s.createErrors=r),i!==void 0&&(s.allErrors=i),s.jtdDiscriminator=e,s.jtdMetadata=t}Gt.extendSubschemaMode=Hu;var Re={},$c=function s(e,t){if(e===t)return!0;if(e&&t&&typeof e=="object"&&typeof t=="object"){if(e.constructor!==t.constructor)return!1;var n,r,i;if(Array.isArray(e)){if(n=e.length,n!=t.length)return!1;for(r=n;r--!==0;)if(!s(e[r],t[r]))return!1;return!0}if(e.constructor===RegExp)return e.source===t.source&&e.flags===t.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===t.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===t.toString();if(i=Object.keys(e),n=i.length,n!==Object.keys(t).length)return!1;for(r=n;r--!==0;)if(!Object.prototype.hasOwnProperty.call(t,i[r]))return!1;for(r=n;r--!==0;){var o=i[r];if(!s(e[o],t[o]))return!1}return!0}return e!==e&&t!==t},Mc={exports:{}},Ht=Mc.exports=function(s,e,t){typeof e=="function"&&(t=e,e={}),t=e.cb||t;var n=typeof t=="function"?t:t.pre||function(){},r=t.post||function(){};ar(e,n,r,s,"",s)};Ht.keywords={additionalItems:!0,items:!0,contains:!0,additionalProperties:!0,propertyNames:!0,not:!0,if:!0,then:!0,else:!0};Ht.arrayKeywords={items:!0,allOf:!0,anyOf:!0,oneOf:!0};Ht.propsKeywords={$defs:!0,definitions:!0,properties:!0,patternProperties:!0,dependencies:!0};Ht.skipKeywords={default:!0,enum:!0,const:!0,required:!0,maximum:!0,minimum:!0,exclusiveMaximum:!0,exclusiveMinimum:!0,multipleOf:!0,maxLength:!0,minLength:!0,pattern:!0,format:!0,maxItems:!0,minItems:!0,uniqueItems:!0,maxProperties:!0,minProperties:!0};function ar(s,e,t,n,r,i,o,a,l,c){if(n&&typeof n=="object"&&!Array.isArray(n)){e(n,r,i,o,a,l,c);for(var h in n){var d=n[h];if(Array.isArray(d)){if(h in Ht.arrayKeywords)for(var u=0;u<d.length;u++)ar(s,e,t,d[u],r+"/"+h+"/"+u,i,r,h,n,u)}else if(h in Ht.propsKeywords){if(d&&typeof d=="object")for(var f in d)ar(s,e,t,d[f],r+"/"+h+"/"+Vu(f),i,r,h,n,f)}else(h in Ht.keywords||s.allKeys&&!(h in Ht.skipKeywords))&&ar(s,e,t,d,r+"/"+h,i,r,h,n)}t(n,r,i,o,a,l,c)}}function Vu(s){return s.replace(/~/g,"~0").replace(/\//g,"~1")}var Wu=Mc.exports;Object.defineProperty(Re,"__esModule",{value:!0});Re.getSchemaRefs=Re.resolveUrl=Re.normalizeId=Re._getFullPath=Re.getFullPath=Re.inlineRef=void 0;const Ku=B,Gu=$c,Yu=Wu,Xu=new Set(["type","format","pattern","maxLength","minLength","maxProperties","minProperties","maxItems","minItems","maximum","minimum","uniqueItems","multipleOf","required","enum","const"]);function Qu(s,e=!0){return typeof s=="boolean"?!0:e===!0?!Si(s):e?Pc(s)<=e:!1}Re.inlineRef=Qu;const Ju=new Set(["$ref","$recursiveRef","$recursiveAnchor","$dynamicRef","$dynamicAnchor"]);function Si(s){for(const e in s){if(Ju.has(e))return!0;const t=s[e];if(Array.isArray(t)&&t.some(Si)||typeof t=="object"&&Si(t))return!0}return!1}function Pc(s){let e=0;for(const t in s){if(t==="$ref")return 1/0;if(e++,!Xu.has(t)&&(typeof s[t]=="object"&&(0,Ku.eachItem)(s[t],n=>e+=Pc(n)),e===1/0))return 1/0}return e}function Ac(s,e="",t){t!==!1&&(e=Mn(e));const n=s.parse(e);return Tc(s,n)}Re.getFullPath=Ac;function Tc(s,e){return s.serialize(e).split("#")[0]+"#"}Re._getFullPath=Tc;const Zu=/#\/?$/;function Mn(s){return s?s.replace(Zu,""):""}Re.normalizeId=Mn;function ef(s,e,t){return t=Mn(t),s.resolve(e,t)}Re.resolveUrl=ef;const tf=/^[a-z_][-a-z0-9._]*$/i;function nf(s,e){if(typeof s=="boolean")return{};const{schemaId:t,uriResolver:n}=this.opts,r=Mn(s[t]||e),i={"":r},o=Ac(n,r,!1),a={},l=new Set;return Yu(s,{allKeys:!0},(d,u,f,m)=>{if(m===void 0)return;const y=o+u;let b=i[m];typeof d[t]=="string"&&(b=g.call(this,d[t])),x.call(this,d.$anchor),x.call(this,d.$dynamicAnchor),i[u]=b;function g(C){const P=this.opts.uriResolver.resolve;if(C=Mn(b?P(b,C):C),l.has(C))throw h(C);l.add(C);let A=this.refs[C];return typeof A=="string"&&(A=this.refs[A]),typeof A=="object"?c(d,A.schema,C):C!==Mn(y)&&(C[0]==="#"?(c(d,a[C],C),a[C]=d):this.refs[C]=y),C}function x(C){if(typeof C=="string"){if(!tf.test(C))throw new Error(`invalid anchor "${C}"`);g.call(this,`#${C}`)}}}),a;function c(d,u,f){if(u!==void 0&&!Gu(d,u))throw h(f)}function h(d){return new Error(`reference "${d}" resolves to more than one schema`)}}Re.getSchemaRefs=nf;Object.defineProperty(dt,"__esModule",{value:!0});dt.getData=dt.KeywordCxt=dt.validateFunctionCode=void 0;const zc=zn,za=Oe,wo=zt,yr=Oe,sf=Dr,gs=jt,Zr=Gt,W=oe,J=Ct,rf=Re,Nt=B,ss=Ts;function of(s){if(Dc(s)&&(Ic(s),Rc(s))){cf(s);return}Nc(s,()=>(0,zc.topBoolOrEmptySchema)(s))}dt.validateFunctionCode=of;function Nc({gen:s,validateName:e,schema:t,schemaEnv:n,opts:r},i){r.code.es5?s.func(e,(0,W._)`${J.default.data}, ${J.default.valCxt}`,n.$async,()=>{s.code((0,W._)`"use strict"; ${Na(t,r)}`),lf(s,r),s.code(i)}):s.func(e,(0,W._)`${J.default.data}, ${af(r)}`,n.$async,()=>s.code(Na(t,r)).code(i))}function af(s){return(0,W._)`{${J.default.instancePath}="", ${J.default.parentData}, ${J.default.parentDataProperty}, ${J.default.rootData}=${J.default.data}${s.dynamicRef?(0,W._)`, ${J.default.dynamicAnchors}={}`:W.nil}}={}`}function lf(s,e){s.if(J.default.valCxt,()=>{s.var(J.default.instancePath,(0,W._)`${J.default.valCxt}.${J.default.instancePath}`),s.var(J.default.parentData,(0,W._)`${J.default.valCxt}.${J.default.parentData}`),s.var(J.default.parentDataProperty,(0,W._)`${J.default.valCxt}.${J.default.parentDataProperty}`),s.var(J.default.rootData,(0,W._)`${J.default.valCxt}.${J.default.rootData}`),e.dynamicRef&&s.var(J.default.dynamicAnchors,(0,W._)`${J.default.valCxt}.${J.default.dynamicAnchors}`)},()=>{s.var(J.default.instancePath,(0,W._)`""`),s.var(J.default.parentData,(0,W._)`undefined`),s.var(J.default.parentDataProperty,(0,W._)`undefined`),s.var(J.default.rootData,J.default.data),e.dynamicRef&&s.var(J.default.dynamicAnchors,(0,W._)`{}`)})}function cf(s){const{schema:e,opts:t,gen:n}=s;Nc(s,()=>{t.$comment&&e.$comment&&Bc(s),pf(s),n.let(J.default.vErrors,null),n.let(J.default.errors,0),t.unevaluated&&hf(s),qc(s),vf(s)})}function hf(s){const{gen:e,validateName:t}=s;s.evaluated=e.const("evaluated",(0,W._)`${t}.evaluated`),e.if((0,W._)`${s.evaluated}.dynamicProps`,()=>e.assign((0,W._)`${s.evaluated}.props`,(0,W._)`undefined`)),e.if((0,W._)`${s.evaluated}.dynamicItems`,()=>e.assign((0,W._)`${s.evaluated}.items`,(0,W._)`undefined`))}function Na(s,e){const t=typeof s=="object"&&s[e.schemaId];return t&&(e.code.source||e.code.process)?(0,W._)`/*# sourceURL=${t} */`:W.nil}function df(s,e){if(Dc(s)&&(Ic(s),Rc(s))){uf(s,e);return}(0,zc.boolOrEmptySchema)(s,e)}function Rc({schema:s,self:e}){if(typeof s=="boolean")return!s;for(const t in s)if(e.RULES.all[t])return!0;return!1}function Dc(s){return typeof s.schema!="boolean"}function uf(s,e){const{schema:t,gen:n,opts:r}=s;r.$comment&&t.$comment&&Bc(s),mf(s),gf(s);const i=n.const("_errs",J.default.errors);qc(s,i),n.var(e,(0,W._)`${i} === ${J.default.errors}`)}function Ic(s){(0,Nt.checkUnknownRules)(s),ff(s)}function qc(s,e){if(s.opts.jtd)return Ra(s,[],!1,e);const t=(0,za.getSchemaTypes)(s.schema),n=(0,za.coerceAndCheckDataType)(s,t);Ra(s,t,!n,e)}function ff(s){const{schema:e,errSchemaPath:t,opts:n,self:r}=s;e.$ref&&n.ignoreKeywordsWithRef&&(0,Nt.schemaHasRulesButRef)(e,r.RULES)&&r.logger.warn(`$ref: keywords ignored in schema at path "${t}"`)}function pf(s){const{schema:e,opts:t}=s;e.default!==void 0&&t.useDefaults&&t.strictSchema&&(0,Nt.checkStrictMode)(s,"default is ignored in the schema root")}function mf(s){const e=s.schema[s.opts.schemaId];e&&(s.baseId=(0,rf.resolveUrl)(s.opts.uriResolver,s.baseId,e))}function gf(s){if(s.schema.$async&&!s.schemaEnv.$async)throw new Error("async schema in sync schema")}function Bc({gen:s,schemaEnv:e,schema:t,errSchemaPath:n,opts:r}){const i=t.$comment;if(r.$comment===!0)s.code((0,W._)`${J.default.self}.logger.log(${i})`);else if(typeof r.$comment=="function"){const o=(0,W.str)`${n}/$comment`,a=s.scopeValue("root",{ref:e.root});s.code((0,W._)`${J.default.self}.opts.$comment(${i}, ${o}, ${a}.schema)`)}}function vf(s){const{gen:e,schemaEnv:t,validateName:n,ValidationError:r,opts:i}=s;t.$async?e.if((0,W._)`${J.default.errors} === 0`,()=>e.return(J.default.data),()=>e.throw((0,W._)`new ${r}(${J.default.vErrors})`)):(e.assign((0,W._)`${n}.errors`,J.default.vErrors),i.unevaluated&&bf(s),e.return((0,W._)`${J.default.errors} === 0`))}function bf({gen:s,evaluated:e,props:t,items:n}){t instanceof W.Name&&s.assign((0,W._)`${e}.props`,t),n instanceof W.Name&&s.assign((0,W._)`${e}.items`,n)}function Ra(s,e,t,n){const{gen:r,schema:i,data:o,allErrors:a,opts:l,self:c}=s,{RULES:h}=c;if(i.$ref&&(l.ignoreKeywordsWithRef||!(0,Nt.schemaHasRulesButRef)(i,h))){r.block(()=>Uc(s,"$ref",h.all.$ref.definition));return}l.jtd||yf(s,e),r.block(()=>{for(const u of h.rules)d(u);d(h.post)});function d(u){(0,wo.shouldUseGroup)(i,u)&&(u.type?(r.if((0,yr.checkDataType)(u.type,o,l.strictNumbers)),Da(s,u),e.length===1&&e[0]===u.type&&t&&(r.else(),(0,yr.reportTypeError)(s)),r.endIf()):Da(s,u),a||r.if((0,W._)`${J.default.errors} === ${n||0}`))}}function Da(s,e){const{gen:t,schema:n,opts:{useDefaults:r}}=s;r&&(0,sf.assignDefaults)(s,e.type),t.block(()=>{for(const i of e.rules)(0,wo.shouldUseRule)(n,i)&&Uc(s,i.keyword,i.definition,e.type)})}function yf(s,e){s.schemaEnv.meta||!s.opts.strictTypes||(wf(s,e),s.opts.allowUnionTypes||jf(s,e),xf(s,s.dataTypes))}function wf(s,e){if(e.length){if(!s.dataTypes.length){s.dataTypes=e;return}e.forEach(t=>{Lc(s.dataTypes,t)||jo(s,`type "${t}" not allowed by context "${s.dataTypes.join(",")}"`)}),Sf(s,e)}}function jf(s,e){e.length>1&&!(e.length===2&&e.includes("null"))&&jo(s,"use allowUnionTypes to allow union type keyword")}function xf(s,e){const t=s.self.RULES.all;for(const n in t){const r=t[n];if(typeof r=="object"&&(0,wo.shouldUseRule)(s.schema,r)){const{type:i}=r.definition;i.length&&!i.some(o=>kf(e,o))&&jo(s,`missing type "${i.join(",")}" for keyword "${n}"`)}}}function kf(s,e){return s.includes(e)||e==="number"&&s.includes("integer")}function Lc(s,e){return s.includes(e)||e==="integer"&&s.includes("number")}function Sf(s,e){const t=[];for(const n of s.dataTypes)Lc(e,n)?t.push(n):e.includes("integer")&&n==="number"&&t.push("integer");s.dataTypes=t}function jo(s,e){const t=s.schemaEnv.baseId+s.errSchemaPath;e+=` at "${t}" (strictTypes)`,(0,Nt.checkStrictMode)(s,e,s.opts.strictTypes)}class Fc{constructor(e,t,n){if((0,gs.validateKeywordUsage)(e,t,n),this.gen=e.gen,this.allErrors=e.allErrors,this.keyword=n,this.data=e.data,this.schema=e.schema[n],this.$data=t.$data&&e.opts.$data&&this.schema&&this.schema.$data,this.schemaValue=(0,Nt.schemaRefOrVal)(e,this.schema,n,this.$data),this.schemaType=t.schemaType,this.parentSchema=e.schema,this.params={},this.it=e,this.def=t,this.$data)this.schemaCode=e.gen.const("vSchema",Hc(this.$data,e));else if(this.schemaCode=this.schemaValue,!(0,gs.validSchemaType)(this.schema,t.schemaType,t.allowUndefined))throw new Error(`${n} value must be ${JSON.stringify(t.schemaType)}`);("code"in t?t.trackErrors:t.errors!==!1)&&(this.errsCount=e.gen.const("_errs",J.default.errors))}result(e,t,n){this.failResult((0,W.not)(e),t,n)}failResult(e,t,n){this.gen.if(e),n?n():this.error(),t?(this.gen.else(),t(),this.allErrors&&this.gen.endIf()):this.allErrors?this.gen.endIf():this.gen.else()}pass(e,t){this.failResult((0,W.not)(e),void 0,t)}fail(e){if(e===void 0){this.error(),this.allErrors||this.gen.if(!1);return}this.gen.if(e),this.error(),this.allErrors?this.gen.endIf():this.gen.else()}fail$data(e){if(!this.$data)return this.fail(e);const{schemaCode:t}=this;this.fail((0,W._)`${t} !== undefined && (${(0,W.or)(this.invalid$data(),e)})`)}error(e,t,n){if(t){this.setParams(t),this._error(e,n),this.setParams({});return}this._error(e,n)}_error(e,t){(e?ss.reportExtraError:ss.reportError)(this,this.def.error,t)}$dataError(){(0,ss.reportError)(this,this.def.$dataError||ss.keyword$DataError)}reset(){if(this.errsCount===void 0)throw new Error('add "trackErrors" to keyword definition');(0,ss.resetErrorsCount)(this.gen,this.errsCount)}ok(e){this.allErrors||this.gen.if(e)}setParams(e,t){t?Object.assign(this.params,e):this.params=e}block$data(e,t,n=W.nil){this.gen.block(()=>{this.check$data(e,n),t()})}check$data(e=W.nil,t=W.nil){if(!this.$data)return;const{gen:n,schemaCode:r,schemaType:i,def:o}=this;n.if((0,W.or)((0,W._)`${r} === undefined`,t)),e!==W.nil&&n.assign(e,!0),(i.length||o.validateSchema)&&(n.elseIf(this.invalid$data()),this.$dataError(),e!==W.nil&&n.assign(e,!1)),n.else()}invalid$data(){const{gen:e,schemaCode:t,schemaType:n,def:r,it:i}=this;return(0,W.or)(o(),a());function o(){if(n.length){if(!(t instanceof W.Name))throw new Error("ajv implementation error");const l=Array.isArray(n)?n:[n];return(0,W._)`${(0,yr.checkDataTypes)(l,t,i.opts.strictNumbers,yr.DataType.Wrong)}`}return W.nil}function a(){if(r.validateSchema){const l=e.scopeValue("validate$data",{ref:r.validateSchema});return(0,W._)`!${l}(${t})`}return W.nil}}subschema(e,t){const n=(0,Zr.getSubschema)(this.it,e);(0,Zr.extendSubschemaData)(n,this.it,e),(0,Zr.extendSubschemaMode)(n,e);const r={...this.it,...n,items:void 0,props:void 0};return df(r,t),r}mergeEvaluated(e,t){const{it:n,gen:r}=this;n.opts.unevaluated&&(n.props!==!0&&e.props!==void 0&&(n.props=Nt.mergeEvaluated.props(r,e.props,n.props,t)),n.items!==!0&&e.items!==void 0&&(n.items=Nt.mergeEvaluated.items(r,e.items,n.items,t)))}mergeValidEvaluated(e,t){const{it:n,gen:r}=this;if(n.opts.unevaluated&&(n.props!==!0||n.items!==!0))return r.if(t,()=>this.mergeEvaluated(e,W.Name)),!0}}dt.KeywordCxt=Fc;function Uc(s,e,t,n){const r=new Fc(s,t,e);"code"in t?t.code(r,n):r.$data&&t.validate?(0,gs.funcKeywordCode)(r,t):"macro"in t?(0,gs.macroKeywordCode)(r,t):(t.compile||t.validate)&&(0,gs.funcKeywordCode)(r,t)}const _f=/^\/(?:[^~]|~0|~1)*$/,Ef=/^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;function Hc(s,{dataLevel:e,dataNames:t,dataPathArr:n}){let r,i;if(s==="")return J.default.rootData;if(s[0]==="/"){if(!_f.test(s))throw new Error(`Invalid JSON-pointer: ${s}`);r=s,i=J.default.rootData}else{const c=Ef.exec(s);if(!c)throw new Error(`Invalid JSON-pointer: ${s}`);const h=+c[1];if(r=c[2],r==="#"){if(h>=e)throw new Error(l("property/index",h));return n[e-h]}if(h>e)throw new Error(l("data",h));if(i=t[e-h],!r)return i}let o=i;const a=r.split("/");for(const c of a)c&&(i=(0,W._)`${i}${(0,W.getProperty)((0,Nt.unescapeJsonPointer)(c))}`,o=(0,W._)`${o} && ${i}`);return o;function l(c,h){return`Cannot access ${c} ${h} levels up, current level is ${e}`}}dt.getData=Hc;var zs={};Object.defineProperty(zs,"__esModule",{value:!0});class Cf extends Error{constructor(e){super("validation failed"),this.errors=e,this.ajv=this.validation=!0}}zs.default=Cf;var Wn={};Object.defineProperty(Wn,"__esModule",{value:!0});const ei=Re;class Of extends Error{constructor(e,t,n,r){super(r||`can't resolve reference ${n} from id ${t}`),this.missingRef=(0,ei.resolveUrl)(e,t,n),this.missingSchema=(0,ei.normalizeId)((0,ei.getFullPath)(e,this.missingRef))}}Wn.default=Of;var Qe={};Object.defineProperty(Qe,"__esModule",{value:!0});Qe.resolveSchema=Qe.getCompilingSchema=Qe.resolveRef=Qe.compileSchema=Qe.SchemaEnv=void 0;const lt=oe,$f=zs,sn=Ct,ht=Re,Ia=B,Mf=dt;class Ir{constructor(e){var t;this.refs={},this.dynamicAnchors={};let n;typeof e.schema=="object"&&(n=e.schema),this.schema=e.schema,this.schemaId=e.schemaId,this.root=e.root||this,this.baseId=(t=e.baseId)!==null&&t!==void 0?t:(0,ht.normalizeId)(n?.[e.schemaId||"$id"]),this.schemaPath=e.schemaPath,this.localRefs=e.localRefs,this.meta=e.meta,this.$async=n?.$async,this.refs={}}}Qe.SchemaEnv=Ir;function xo(s){const e=Vc.call(this,s);if(e)return e;const t=(0,ht.getFullPath)(this.opts.uriResolver,s.root.baseId),{es5:n,lines:r}=this.opts.code,{ownProperties:i}=this.opts,o=new lt.CodeGen(this.scope,{es5:n,lines:r,ownProperties:i});let a;s.$async&&(a=o.scopeValue("Error",{ref:$f.default,code:(0,lt._)`require("ajv/dist/runtime/validation_error").default`}));const l=o.scopeName("validate");s.validateName=l;const c={gen:o,allErrors:this.opts.allErrors,data:sn.default.data,parentData:sn.default.parentData,parentDataProperty:sn.default.parentDataProperty,dataNames:[sn.default.data],dataPathArr:[lt.nil],dataLevel:0,dataTypes:[],definedProperties:new Set,topSchemaRef:o.scopeValue("schema",this.opts.code.source===!0?{ref:s.schema,code:(0,lt.stringify)(s.schema)}:{ref:s.schema}),validateName:l,ValidationError:a,schema:s.schema,schemaEnv:s,rootId:t,baseId:s.baseId||t,schemaPath:lt.nil,errSchemaPath:s.schemaPath||(this.opts.jtd?"":"#"),errorPath:(0,lt._)`""`,opts:this.opts,self:this};let h;try{this._compilations.add(s),(0,Mf.validateFunctionCode)(c),o.optimize(this.opts.code.optimize);const d=o.toString();h=`${o.scopeRefs(sn.default.scope)}return ${d}`,this.opts.code.process&&(h=this.opts.code.process(h,s));const f=new Function(`${sn.default.self}`,`${sn.default.scope}`,h)(this,this.scope.get());if(this.scope.value(l,{ref:f}),f.errors=null,f.schema=s.schema,f.schemaEnv=s,s.$async&&(f.$async=!0),this.opts.code.source===!0&&(f.source={validateName:l,validateCode:d,scopeValues:o._values}),this.opts.unevaluated){const{props:m,items:y}=c;f.evaluated={props:m instanceof lt.Name?void 0:m,items:y instanceof lt.Name?void 0:y,dynamicProps:m instanceof lt.Name,dynamicItems:y instanceof lt.Name},f.source&&(f.source.evaluated=(0,lt.stringify)(f.evaluated))}return s.validate=f,s}catch(d){throw delete s.validate,delete s.validateName,h&&this.logger.error("Error compiling schema, function code:",h),d}finally{this._compilations.delete(s)}}Qe.compileSchema=xo;function Pf(s,e,t){var n;t=(0,ht.resolveUrl)(this.opts.uriResolver,e,t);const r=s.refs[t];if(r)return r;let i=zf.call(this,s,t);if(i===void 0){const o=(n=s.localRefs)===null||n===void 0?void 0:n[t],{schemaId:a}=this.opts;o&&(i=new Ir({schema:o,schemaId:a,root:s,baseId:e}))}if(i!==void 0)return s.refs[t]=Af.call(this,i)}Qe.resolveRef=Pf;function Af(s){return(0,ht.inlineRef)(s.schema,this.opts.inlineRefs)?s.schema:s.validate?s:xo.call(this,s)}function Vc(s){for(const e of this._compilations)if(Tf(e,s))return e}Qe.getCompilingSchema=Vc;function Tf(s,e){return s.schema===e.schema&&s.root===e.root&&s.baseId===e.baseId}function zf(s,e){let t;for(;typeof(t=this.refs[e])=="string";)e=t;return t||this.schemas[e]||qr.call(this,s,e)}function qr(s,e){const t=this.opts.uriResolver.parse(e),n=(0,ht._getFullPath)(this.opts.uriResolver,t);let r=(0,ht.getFullPath)(this.opts.uriResolver,s.baseId,void 0);if(Object.keys(s.schema).length>0&&n===r)return ti.call(this,t,s);const i=(0,ht.normalizeId)(n),o=this.refs[i]||this.schemas[i];if(typeof o=="string"){const a=qr.call(this,s,o);return typeof a?.schema!="object"?void 0:ti.call(this,t,a)}if(typeof o?.schema=="object"){if(o.validate||xo.call(this,o),i===(0,ht.normalizeId)(e)){const{schema:a}=o,{schemaId:l}=this.opts,c=a[l];return c&&(r=(0,ht.resolveUrl)(this.opts.uriResolver,r,c)),new Ir({schema:a,schemaId:l,root:s,baseId:r})}return ti.call(this,t,o)}}Qe.resolveSchema=qr;const Nf=new Set(["properties","patternProperties","enum","dependencies","definitions"]);function ti(s,{baseId:e,schema:t,root:n}){var r;if(((r=s.fragment)===null||r===void 0?void 0:r[0])!=="/")return;for(const a of s.fragment.slice(1).split("/")){if(typeof t=="boolean")return;const l=t[(0,Ia.unescapeFragment)(a)];if(l===void 0)return;t=l;const c=typeof t=="object"&&t[this.opts.schemaId];!Nf.has(a)&&c&&(e=(0,ht.resolveUrl)(this.opts.uriResolver,e,c))}let i;if(typeof t!="boolean"&&t.$ref&&!(0,Ia.schemaHasRulesButRef)(t,this.RULES)){const a=(0,ht.resolveUrl)(this.opts.uriResolver,e,t.$ref);i=qr.call(this,n,a)}const{schemaId:o}=this.opts;if(i=i||new Ir({schema:t,schemaId:o,root:n,baseId:e}),i.schema!==i.root.schema)return i}const Rf="https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",Df="Meta-schema for $data reference (JSON AnySchema extension proposal)",If="object",qf=["$data"],Bf={$data:{type:"string",anyOf:[{format:"relative-json-pointer"},{format:"json-pointer"}]}},Lf=!1,Ff={$id:Rf,description:Df,type:If,required:qf,properties:Bf,additionalProperties:Lf};var ko={},Br={exports:{}};const Uf={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,a:10,A:10,b:11,B:11,c:12,C:12,d:13,D:13,e:14,E:14,f:15,F:15};var Hf={HEX:Uf};const{HEX:Vf}=Hf;function Wc(s){if(Gc(s,".")<3)return{host:s,isIPV4:!1};const e=s.match(/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/u)||[],[t]=e;return t?{host:Kf(t,"."),isIPV4:!0}:{host:s,isIPV4:!1}}function _i(s,e=!1){let t="",n=!0;for(const r of s){if(Vf[r]===void 0)return;r!=="0"&&n===!0&&(n=!1),n||(t+=r)}return e&&t.length===0&&(t="0"),t}function Wf(s){let e=0;const t={error:!1,address:"",zone:""},n=[],r=[];let i=!1,o=!1,a=!1;function l(){if(r.length){if(i===!1){const c=_i(r);if(c!==void 0)n.push(c);else return t.error=!0,!1}r.length=0}return!0}for(let c=0;c<s.length;c++){const h=s[c];if(!(h==="["||h==="]"))if(h===":"){if(o===!0&&(a=!0),!l())break;if(e++,n.push(":"),e>7){t.error=!0;break}c-1>=0&&s[c-1]===":"&&(o=!0);continue}else if(h==="%"){if(!l())break;i=!0}else{r.push(h);continue}}return r.length&&(i?t.zone=r.join(""):a?n.push(r.join("")):n.push(_i(r))),t.address=n.join(""),t}function Kc(s,e={}){if(Gc(s,":")<2)return{host:s,isIPV6:!1};const t=Wf(s);if(t.error)return{host:s,isIPV6:!1};{let n=t.address,r=t.address;return t.zone&&(n+="%"+t.zone,r+="%25"+t.zone),{host:n,escapedHost:r,isIPV6:!0}}}function Kf(s,e){let t="",n=!0;const r=s.length;for(let i=0;i<r;i++){const o=s[i];o==="0"&&n?(i+1<=r&&s[i+1]===e||i+1===r)&&(t+=o,n=!1):(o===e?n=!0:n=!1,t+=o)}return t}function Gc(s,e){let t=0;for(let n=0;n<s.length;n++)s[n]===e&&t++;return t}const qa=/^\.\.?\//u,Ba=/^\/\.(?:\/|$)/u,La=/^\/\.\.(?:\/|$)/u,Gf=/^\/?(?:.|\n)*?(?=\/|$)/u;function Yf(s){const e=[];for(;s.length;)if(s.match(qa))s=s.replace(qa,"");else if(s.match(Ba))s=s.replace(Ba,"/");else if(s.match(La))s=s.replace(La,"/"),e.pop();else if(s==="."||s==="..")s="";else{const t=s.match(Gf);if(t){const n=t[0];s=s.slice(n.length),e.push(n)}else throw new Error("Unexpected dot segment condition")}return e.join("")}function Xf(s,e){const t=e!==!0?escape:unescape;return s.scheme!==void 0&&(s.scheme=t(s.scheme)),s.userinfo!==void 0&&(s.userinfo=t(s.userinfo)),s.host!==void 0&&(s.host=t(s.host)),s.path!==void 0&&(s.path=t(s.path)),s.query!==void 0&&(s.query=t(s.query)),s.fragment!==void 0&&(s.fragment=t(s.fragment)),s}function Qf(s,e){const t=[];if(s.userinfo!==void 0&&(t.push(s.userinfo),t.push("@")),s.host!==void 0){let n=unescape(s.host);const r=Wc(n);if(r.isIPV4)n=r.host;else{const i=Kc(r.host,{isIPV4:!1});i.isIPV6===!0?n=`[${i.escapedHost}]`:n=s.host}t.push(n)}return(typeof s.port=="number"||typeof s.port=="string")&&(t.push(":"),t.push(String(s.port))),t.length?t.join(""):void 0}var Jf={recomposeAuthority:Qf,normalizeComponentEncoding:Xf,removeDotSegments:Yf,normalizeIPv4:Wc,normalizeIPv6:Kc,stringArrayToHexStripped:_i};const Zf=/^[\da-f]{8}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{4}\b-[\da-f]{12}$/iu,ep=/([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;function Yc(s){return typeof s.secure=="boolean"?s.secure:String(s.scheme).toLowerCase()==="wss"}function Xc(s){return s.host||(s.error=s.error||"HTTP URIs must have a host."),s}function Qc(s){const e=String(s.scheme).toLowerCase()==="https";return(s.port===(e?443:80)||s.port==="")&&(s.port=void 0),s.path||(s.path="/"),s}function tp(s){return s.secure=Yc(s),s.resourceName=(s.path||"/")+(s.query?"?"+s.query:""),s.path=void 0,s.query=void 0,s}function np(s){if((s.port===(Yc(s)?443:80)||s.port==="")&&(s.port=void 0),typeof s.secure=="boolean"&&(s.scheme=s.secure?"wss":"ws",s.secure=void 0),s.resourceName){const[e,t]=s.resourceName.split("?");s.path=e&&e!=="/"?e:void 0,s.query=t,s.resourceName=void 0}return s.fragment=void 0,s}function sp(s,e){if(!s.path)return s.error="URN can not be parsed",s;const t=s.path.match(ep);if(t){const n=e.scheme||s.scheme||"urn";s.nid=t[1].toLowerCase(),s.nss=t[2];const r=`${n}:${e.nid||s.nid}`,i=So[r];s.path=void 0,i&&(s=i.parse(s,e))}else s.error=s.error||"URN can not be parsed.";return s}function rp(s,e){const t=e.scheme||s.scheme||"urn",n=s.nid.toLowerCase(),r=`${t}:${e.nid||n}`,i=So[r];i&&(s=i.serialize(s,e));const o=s,a=s.nss;return o.path=`${n||e.nid}:${a}`,e.skipEscape=!0,o}function ip(s,e){const t=s;return t.uuid=t.nss,t.nss=void 0,!e.tolerant&&(!t.uuid||!Zf.test(t.uuid))&&(t.error=t.error||"UUID is not valid."),t}function op(s){const e=s;return e.nss=(s.uuid||"").toLowerCase(),e}const Jc={scheme:"http",domainHost:!0,parse:Xc,serialize:Qc},ap={scheme:"https",domainHost:Jc.domainHost,parse:Xc,serialize:Qc},lr={scheme:"ws",domainHost:!0,parse:tp,serialize:np},lp={scheme:"wss",domainHost:lr.domainHost,parse:lr.parse,serialize:lr.serialize},cp={scheme:"urn",parse:sp,serialize:rp,skipNormalize:!0},hp={scheme:"urn:uuid",parse:ip,serialize:op,skipNormalize:!0},So={http:Jc,https:ap,ws:lr,wss:lp,urn:cp,"urn:uuid":hp};var dp=So;const{normalizeIPv6:up,normalizeIPv4:fp,removeDotSegments:cs,recomposeAuthority:pp,normalizeComponentEncoding:Ls}=Jf,_o=dp;function mp(s,e){return typeof s=="string"?s=xt(It(s,e),e):typeof s=="object"&&(s=It(xt(s,e),e)),s}function gp(s,e,t){const n=Object.assign({scheme:"null"},t),r=Zc(It(s,n),It(e,n),n,!0);return xt(r,{...n,skipEscape:!0})}function Zc(s,e,t,n){const r={};return n||(s=It(xt(s,t),t),e=It(xt(e,t),t)),t=t||{},!t.tolerant&&e.scheme?(r.scheme=e.scheme,r.userinfo=e.userinfo,r.host=e.host,r.port=e.port,r.path=cs(e.path||""),r.query=e.query):(e.userinfo!==void 0||e.host!==void 0||e.port!==void 0?(r.userinfo=e.userinfo,r.host=e.host,r.port=e.port,r.path=cs(e.path||""),r.query=e.query):(e.path?(e.path.charAt(0)==="/"?r.path=cs(e.path):((s.userinfo!==void 0||s.host!==void 0||s.port!==void 0)&&!s.path?r.path="/"+e.path:s.path?r.path=s.path.slice(0,s.path.lastIndexOf("/")+1)+e.path:r.path=e.path,r.path=cs(r.path)),r.query=e.query):(r.path=s.path,e.query!==void 0?r.query=e.query:r.query=s.query),r.userinfo=s.userinfo,r.host=s.host,r.port=s.port),r.scheme=s.scheme),r.fragment=e.fragment,r}function vp(s,e,t){return typeof s=="string"?(s=unescape(s),s=xt(Ls(It(s,t),!0),{...t,skipEscape:!0})):typeof s=="object"&&(s=xt(Ls(s,!0),{...t,skipEscape:!0})),typeof e=="string"?(e=unescape(e),e=xt(Ls(It(e,t),!0),{...t,skipEscape:!0})):typeof e=="object"&&(e=xt(Ls(e,!0),{...t,skipEscape:!0})),s.toLowerCase()===e.toLowerCase()}function xt(s,e){const t={host:s.host,scheme:s.scheme,userinfo:s.userinfo,port:s.port,path:s.path,query:s.query,nid:s.nid,nss:s.nss,uuid:s.uuid,fragment:s.fragment,reference:s.reference,resourceName:s.resourceName,secure:s.secure,error:""},n=Object.assign({},e),r=[],i=_o[(n.scheme||t.scheme||"").toLowerCase()];i&&i.serialize&&i.serialize(t,n),t.path!==void 0&&(n.skipEscape?t.path=unescape(t.path):(t.path=escape(t.path),t.scheme!==void 0&&(t.path=t.path.split("%3A").join(":")))),n.reference!=="suffix"&&t.scheme&&r.push(t.scheme,":");const o=pp(t,n);if(o!==void 0&&(n.reference!=="suffix"&&r.push("//"),r.push(o),t.path&&t.path.charAt(0)!=="/"&&r.push("/")),t.path!==void 0){let a=t.path;!n.absolutePath&&(!i||!i.absolutePath)&&(a=cs(a)),o===void 0&&(a=a.replace(/^\/\//u,"/%2F")),r.push(a)}return t.query!==void 0&&r.push("?",t.query),t.fragment!==void 0&&r.push("#",t.fragment),r.join("")}const bp=Array.from({length:127},(s,e)=>/[^!"$&'()*+,\-.;=_`a-z{}~]/u.test(String.fromCharCode(e)));function yp(s){let e=0;for(let t=0,n=s.length;t<n;++t)if(e=s.charCodeAt(t),e>126||bp[e])return!0;return!1}const wp=/^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;function It(s,e){const t=Object.assign({},e),n={scheme:void 0,userinfo:void 0,host:"",port:void 0,path:"",query:void 0,fragment:void 0},r=s.indexOf("%")!==-1;let i=!1;t.reference==="suffix"&&(s=(t.scheme?t.scheme+":":"")+"//"+s);const o=s.match(wp);if(o){if(n.scheme=o[1],n.userinfo=o[3],n.host=o[4],n.port=parseInt(o[5],10),n.path=o[6]||"",n.query=o[7],n.fragment=o[8],isNaN(n.port)&&(n.port=o[5]),n.host){const l=fp(n.host);if(l.isIPV4===!1){const c=up(l.host,{isIPV4:!1});n.host=c.host.toLowerCase(),i=c.isIPV6}else n.host=l.host,i=!0}n.scheme===void 0&&n.userinfo===void 0&&n.host===void 0&&n.port===void 0&&!n.path&&n.query===void 0?n.reference="same-document":n.scheme===void 0?n.reference="relative":n.fragment===void 0?n.reference="absolute":n.reference="uri",t.reference&&t.reference!=="suffix"&&t.reference!==n.reference&&(n.error=n.error||"URI is not a "+t.reference+" reference.");const a=_o[(t.scheme||n.scheme||"").toLowerCase()];if(!t.unicodeSupport&&(!a||!a.unicodeSupport)&&n.host&&(t.domainHost||a&&a.domainHost)&&i===!1&&yp(n.host))try{n.host=URL.domainToASCII(n.host.toLowerCase())}catch(l){n.error=n.error||"Host's domain name can not be converted to ASCII: "+l}(!a||a&&!a.skipNormalize)&&(r&&n.scheme!==void 0&&(n.scheme=unescape(n.scheme)),r&&n.host!==void 0&&(n.host=unescape(n.host)),n.path!==void 0&&n.path.length&&(n.path=escape(unescape(n.path))),n.fragment!==void 0&&n.fragment.length&&(n.fragment=encodeURI(decodeURIComponent(n.fragment)))),a&&a.parse&&a.parse(n,t)}else n.error=n.error||"URI can not be parsed.";return n}const Eo={SCHEMES:_o,normalize:mp,resolve:gp,resolveComponents:Zc,equal:vp,serialize:xt,parse:It};Br.exports=Eo;Br.exports.default=Eo;Br.exports.fastUri=Eo;var jp=Br.exports;Object.defineProperty(ko,"__esModule",{value:!0});const eh=jp;eh.code='require("ajv/dist/runtime/uri").default';ko.default=eh;(function(s){Object.defineProperty(s,"__esModule",{value:!0}),s.CodeGen=s.Name=s.nil=s.stringify=s.str=s._=s.KeywordCxt=void 0;var e=dt;Object.defineProperty(s,"KeywordCxt",{enumerable:!0,get:function(){return e.KeywordCxt}});var t=oe;Object.defineProperty(s,"_",{enumerable:!0,get:function(){return t._}}),Object.defineProperty(s,"str",{enumerable:!0,get:function(){return t.str}}),Object.defineProperty(s,"stringify",{enumerable:!0,get:function(){return t.stringify}}),Object.defineProperty(s,"nil",{enumerable:!0,get:function(){return t.nil}}),Object.defineProperty(s,"Name",{enumerable:!0,get:function(){return t.Name}}),Object.defineProperty(s,"CodeGen",{enumerable:!0,get:function(){return t.CodeGen}});const n=zs,r=Wn,i=pn,o=Qe,a=oe,l=Re,c=Oe,h=B,d=Ff,u=ko,f=(R,S)=>new RegExp(R,S);f.code="new RegExp";const m=["removeAdditional","useDefaults","coerceTypes"],y=new Set(["validate","serialize","parse","wrapper","root","schema","keyword","pattern","formats","validate$data","func","obj","Error"]),b={errorDataPath:"",format:"`validateFormats: false` can be used instead.",nullable:'"nullable" keyword is supported by default.',jsonPointers:"Deprecated jsPropertySyntax can be used instead.",extendRefs:"Deprecated ignoreKeywordsWithRef can be used instead.",missingRefs:"Pass empty schema with $id that should be ignored to ajv.addSchema.",processCode:"Use option `code: {process: (code, schemaEnv: object) => string}`",sourceCode:"Use option `code: {source: true}`",strictDefaults:"It is default now, see option `strict`.",strictKeywords:"It is default now, see option `strict`.",uniqueItems:'"uniqueItems" keyword is always validated.',unknownFormats:"Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",cache:"Map is used as cache, schema object as key.",serialize:"Map is used as cache, schema object as key.",ajvErrors:"It is default now."},g={ignoreKeywordsWithRef:"",jsPropertySyntax:"",unicode:'"minLength"/"maxLength" account for unicode characters by default.'},x=200;function C(R){var S,T,E,v,j,M,U,V,le,ce,ke,Ot,Xn,Qn,Jn,wn,Zn,tn,X,nn,jn,xn,es,ts,ns;const p=R.strict,w=(S=R.code)===null||S===void 0?void 0:S.optimize,k=w===!0||w===void 0?1:w||0,O=(E=(T=R.code)===null||T===void 0?void 0:T.regExp)!==null&&E!==void 0?E:f,z=(v=R.uriResolver)!==null&&v!==void 0?v:u.default;return{strictSchema:(M=(j=R.strictSchema)!==null&&j!==void 0?j:p)!==null&&M!==void 0?M:!0,strictNumbers:(V=(U=R.strictNumbers)!==null&&U!==void 0?U:p)!==null&&V!==void 0?V:!0,strictTypes:(ce=(le=R.strictTypes)!==null&&le!==void 0?le:p)!==null&&ce!==void 0?ce:"log",strictTuples:(Ot=(ke=R.strictTuples)!==null&&ke!==void 0?ke:p)!==null&&Ot!==void 0?Ot:"log",strictRequired:(Qn=(Xn=R.strictRequired)!==null&&Xn!==void 0?Xn:p)!==null&&Qn!==void 0?Qn:!1,code:R.code?{...R.code,optimize:k,regExp:O}:{optimize:k,regExp:O},loopRequired:(Jn=R.loopRequired)!==null&&Jn!==void 0?Jn:x,loopEnum:(wn=R.loopEnum)!==null&&wn!==void 0?wn:x,meta:(Zn=R.meta)!==null&&Zn!==void 0?Zn:!0,messages:(tn=R.messages)!==null&&tn!==void 0?tn:!0,inlineRefs:(X=R.inlineRefs)!==null&&X!==void 0?X:!0,schemaId:(nn=R.schemaId)!==null&&nn!==void 0?nn:"$id",addUsedSchema:(jn=R.addUsedSchema)!==null&&jn!==void 0?jn:!0,validateSchema:(xn=R.validateSchema)!==null&&xn!==void 0?xn:!0,validateFormats:(es=R.validateFormats)!==null&&es!==void 0?es:!0,unicodeRegExp:(ts=R.unicodeRegExp)!==null&&ts!==void 0?ts:!0,int32range:(ns=R.int32range)!==null&&ns!==void 0?ns:!0,uriResolver:z}}class P{constructor(S={}){this.schemas={},this.refs={},this.formats={},this._compilations=new Set,this._loading={},this._cache=new Map,S=this.opts={...S,...C(S)};const{es5:T,lines:E}=this.opts.code;this.scope=new a.ValueScope({scope:{},prefixes:y,es5:T,lines:E}),this.logger=F(S.logger);const v=S.validateFormats;S.validateFormats=!1,this.RULES=(0,i.getRules)(),A.call(this,b,S,"NOT SUPPORTED"),A.call(this,g,S,"DEPRECATED","warn"),this._metaOpts=he.call(this),S.formats&&te.call(this),this._addVocabularies(),this._addDefaultMetaSchema(),S.keywords&&Z.call(this,S.keywords),typeof S.meta=="object"&&this.addMetaSchema(S.meta),D.call(this),S.validateFormats=v}_addVocabularies(){this.addKeyword("$async")}_addDefaultMetaSchema(){const{$data:S,meta:T,schemaId:E}=this.opts;let v=d;E==="id"&&(v={...d},v.id=v.$id,delete v.$id),T&&S&&this.addMetaSchema(v,v[E],!1)}defaultMeta(){const{meta:S,schemaId:T}=this.opts;return this.opts.defaultMeta=typeof S=="object"?S[T]||S:void 0}validate(S,T){let E;if(typeof S=="string"){if(E=this.getSchema(S),!E)throw new Error(`no schema with key or ref "${S}"`)}else E=this.compile(S);const v=E(T);return"$async"in E||(this.errors=E.errors),v}compile(S,T){const E=this._addSchema(S,T);return E.validate||this._compileSchemaEnv(E)}compileAsync(S,T){if(typeof this.opts.loadSchema!="function")throw new Error("options.loadSchema should be a function");const{loadSchema:E}=this.opts;return v.call(this,S,T);async function v(ce,ke){await j.call(this,ce.$schema);const Ot=this._addSchema(ce,ke);return Ot.validate||M.call(this,Ot)}async function j(ce){ce&&!this.getSchema(ce)&&await v.call(this,{$ref:ce},!0)}async function M(ce){try{return this._compileSchemaEnv(ce)}catch(ke){if(!(ke instanceof r.default))throw ke;return U.call(this,ke),await V.call(this,ke.missingSchema),M.call(this,ce)}}function U({missingSchema:ce,missingRef:ke}){if(this.refs[ce])throw new Error(`AnySchema ${ce} is loaded but ${ke} cannot be resolved`)}async function V(ce){const ke=await le.call(this,ce);this.refs[ce]||await j.call(this,ke.$schema),this.refs[ce]||this.addSchema(ke,ce,T)}async function le(ce){const ke=this._loading[ce];if(ke)return ke;try{return await(this._loading[ce]=E(ce))}finally{delete this._loading[ce]}}}addSchema(S,T,E,v=this.opts.validateSchema){if(Array.isArray(S)){for(const M of S)this.addSchema(M,void 0,E,v);return this}let j;if(typeof S=="object"){const{schemaId:M}=this.opts;if(j=S[M],j!==void 0&&typeof j!="string")throw new Error(`schema ${M} must be string`)}return T=(0,l.normalizeId)(T||j),this._checkUnique(T),this.schemas[T]=this._addSchema(S,E,T,v,!0),this}addMetaSchema(S,T,E=this.opts.validateSchema){return this.addSchema(S,T,!0,E),this}validateSchema(S,T){if(typeof S=="boolean")return!0;let E;if(E=S.$schema,E!==void 0&&typeof E!="string")throw new Error("$schema must be a string");if(E=E||this.opts.defaultMeta||this.defaultMeta(),!E)return this.logger.warn("meta-schema not available"),this.errors=null,!0;const v=this.validate(E,S);if(!v&&T){const j="schema is invalid: "+this.errorsText();if(this.opts.validateSchema==="log")this.logger.error(j);else throw new Error(j)}return v}getSchema(S){let T;for(;typeof(T=N.call(this,S))=="string";)S=T;if(T===void 0){const{schemaId:E}=this.opts,v=new o.SchemaEnv({schema:{},schemaId:E});if(T=o.resolveSchema.call(this,v,S),!T)return;this.refs[S]=T}return T.validate||this._compileSchemaEnv(T)}removeSchema(S){if(S instanceof RegExp)return this._removeAllSchemas(this.schemas,S),this._removeAllSchemas(this.refs,S),this;switch(typeof S){case"undefined":return this._removeAllSchemas(this.schemas),this._removeAllSchemas(this.refs),this._cache.clear(),this;case"string":{const T=N.call(this,S);return typeof T=="object"&&this._cache.delete(T.schema),delete this.schemas[S],delete this.refs[S],this}case"object":{const T=S;this._cache.delete(T);let E=S[this.opts.schemaId];return E&&(E=(0,l.normalizeId)(E),delete this.schemas[E],delete this.refs[E]),this}default:throw new Error("ajv.removeSchema: invalid parameter")}}addVocabulary(S){for(const T of S)this.addKeyword(T);return this}addKeyword(S,T){let E;if(typeof S=="string")E=S,typeof T=="object"&&(this.logger.warn("these parameters are deprecated, see docs for addKeyword"),T.keyword=E);else if(typeof S=="object"&&T===void 0){if(T=S,E=T.keyword,Array.isArray(E)&&!E.length)throw new Error("addKeywords: keyword must be string or non-empty array")}else throw new Error("invalid addKeywords parameters");if(re.call(this,E,T),!T)return(0,h.eachItem)(E,j=>me.call(this,j)),this;Ge.call(this,T);const v={...T,type:(0,c.getJSONTypes)(T.type),schemaType:(0,c.getJSONTypes)(T.schemaType)};return(0,h.eachItem)(E,v.type.length===0?j=>me.call(this,j,v):j=>v.type.forEach(M=>me.call(this,j,v,M))),this}getKeyword(S){const T=this.RULES.all[S];return typeof T=="object"?T.definition:!!T}removeKeyword(S){const{RULES:T}=this;delete T.keywords[S],delete T.all[S];for(const E of T.rules){const v=E.rules.findIndex(j=>j.keyword===S);v>=0&&E.rules.splice(v,1)}return this}addFormat(S,T){return typeof T=="string"&&(T=new RegExp(T)),this.formats[S]=T,this}errorsText(S=this.errors,{separator:T=", ",dataVar:E="data"}={}){return!S||S.length===0?"No errors":S.map(v=>`${E}${v.instancePath} ${v.message}`).reduce((v,j)=>v+T+j)}$dataMetaSchema(S,T){const E=this.RULES.all;S=JSON.parse(JSON.stringify(S));for(const v of T){const j=v.split("/").slice(1);let M=S;for(const U of j)M=M[U];for(const U in E){const V=E[U];if(typeof V!="object")continue;const{$data:le}=V.definition,ce=M[U];le&&ce&&(M[U]=Te(ce))}}return S}_removeAllSchemas(S,T){for(const E in S){const v=S[E];(!T||T.test(E))&&(typeof v=="string"?delete S[E]:v&&!v.meta&&(this._cache.delete(v.schema),delete S[E]))}}_addSchema(S,T,E,v=this.opts.validateSchema,j=this.opts.addUsedSchema){let M;const{schemaId:U}=this.opts;if(typeof S=="object")M=S[U];else{if(this.opts.jtd)throw new Error("schema must be object");if(typeof S!="boolean")throw new Error("schema must be object or boolean")}let V=this._cache.get(S);if(V!==void 0)return V;E=(0,l.normalizeId)(M||E);const le=l.getSchemaRefs.call(this,S,E);return V=new o.SchemaEnv({schema:S,schemaId:U,meta:T,baseId:E,localRefs:le}),this._cache.set(V.schema,V),j&&!E.startsWith("#")&&(E&&this._checkUnique(E),this.refs[E]=V),v&&this.validateSchema(S,!0),V}_checkUnique(S){if(this.schemas[S]||this.refs[S])throw new Error(`schema with key or id "${S}" already exists`)}_compileSchemaEnv(S){if(S.meta?this._compileMetaSchema(S):o.compileSchema.call(this,S),!S.validate)throw new Error("ajv implementation error");return S.validate}_compileMetaSchema(S){const T=this.opts;this.opts=this._metaOpts;try{o.compileSchema.call(this,S)}finally{this.opts=T}}}P.ValidationError=n.default,P.MissingRefError=r.default,s.default=P;function A(R,S,T,E="error"){for(const v in R){const j=v;j in S&&this.logger[E](`${T}: option ${v}. ${R[j]}`)}}function N(R){return R=(0,l.normalizeId)(R),this.schemas[R]||this.refs[R]}function D(){const R=this.opts.schemas;if(R)if(Array.isArray(R))this.addSchema(R);else for(const S in R)this.addSchema(R[S],S)}function te(){for(const R in this.opts.formats){const S=this.opts.formats[R];S&&this.addFormat(R,S)}}function Z(R){if(Array.isArray(R)){this.addVocabulary(R);return}this.logger.warn("keywords option as map is deprecated, pass array");for(const S in R){const T=R[S];T.keyword||(T.keyword=S),this.addKeyword(T)}}function he(){const R={...this.opts};for(const S of m)delete R[S];return R}const Q={log(){},warn(){},error(){}};function F(R){if(R===!1)return Q;if(R===void 0)return console;if(R.log&&R.warn&&R.error)return R;throw new Error("logger must implement log, warn and error methods")}const ae=/^[a-z_$][a-z0-9_$:-]*$/i;function re(R,S){const{RULES:T}=this;if((0,h.eachItem)(R,E=>{if(T.keywords[E])throw new Error(`Keyword ${E} is already defined`);if(!ae.test(E))throw new Error(`Keyword ${E} has invalid name`)}),!!S&&S.$data&&!("code"in S||"validate"in S))throw new Error('$data keyword must have "code" or "validate" function')}function me(R,S,T){var E;const v=S?.post;if(T&&v)throw new Error('keyword with "post" flag cannot have "type"');const{RULES:j}=this;let M=v?j.post:j.rules.find(({type:V})=>V===T);if(M||(M={type:T,rules:[]},j.rules.push(M)),j.keywords[R]=!0,!S)return;const U={keyword:R,definition:{...S,type:(0,c.getJSONTypes)(S.type),schemaType:(0,c.getJSONTypes)(S.schemaType)}};S.before?Ae.call(this,M,U,S.before):M.rules.push(U),j.all[R]=U,(E=S.implements)===null||E===void 0||E.forEach(V=>this.addKeyword(V))}function Ae(R,S,T){const E=R.rules.findIndex(v=>v.keyword===T);E>=0?R.rules.splice(E,0,S):(R.rules.push(S),this.logger.warn(`rule ${T} is not defined`))}function Ge(R){let{metaSchema:S}=R;S!==void 0&&(R.$data&&this.opts.$data&&(S=Te(S)),R.validateSchema=this.compile(S,!0))}const Je={$ref:"https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"};function Te(R){return{anyOf:[R,Je]}}})(fc);var Co={},Oo={},$o={};Object.defineProperty($o,"__esModule",{value:!0});const xp={keyword:"id",code(){throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID')}};$o.default=xp;var mn={};Object.defineProperty(mn,"__esModule",{value:!0});mn.callRef=mn.getValidate=void 0;const kp=Wn,Fa=ie,Ye=oe,_n=Ct,Ua=Qe,Fs=B,Sp={keyword:"$ref",schemaType:"string",code(s){const{gen:e,schema:t,it:n}=s,{baseId:r,schemaEnv:i,validateName:o,opts:a,self:l}=n,{root:c}=i;if((t==="#"||t==="#/")&&r===c.baseId)return d();const h=Ua.resolveRef.call(l,c,r,t);if(h===void 0)throw new kp.default(n.opts.uriResolver,r,t);if(h instanceof Ua.SchemaEnv)return u(h);return f(h);function d(){if(i===c)return cr(s,o,i,i.$async);const m=e.scopeValue("root",{ref:c});return cr(s,(0,Ye._)`${m}.validate`,c,c.$async)}function u(m){const y=th(s,m);cr(s,y,m,m.$async)}function f(m){const y=e.scopeValue("schema",a.code.source===!0?{ref:m,code:(0,Ye.stringify)(m)}:{ref:m}),b=e.name("valid"),g=s.subschema({schema:m,dataTypes:[],schemaPath:Ye.nil,topSchemaRef:y,errSchemaPath:t},b);s.mergeEvaluated(g),s.ok(b)}}};function th(s,e){const{gen:t}=s;return e.validate?t.scopeValue("validate",{ref:e.validate}):(0,Ye._)`${t.scopeValue("wrapper",{ref:e})}.validate`}mn.getValidate=th;function cr(s,e,t,n){const{gen:r,it:i}=s,{allErrors:o,schemaEnv:a,opts:l}=i,c=l.passContext?_n.default.this:Ye.nil;n?h():d();function h(){if(!a.$async)throw new Error("async schema referenced by sync schema");const m=r.let("valid");r.try(()=>{r.code((0,Ye._)`await ${(0,Fa.callValidateCode)(s,e,c)}`),f(e),o||r.assign(m,!0)},y=>{r.if((0,Ye._)`!(${y} instanceof ${i.ValidationError})`,()=>r.throw(y)),u(y),o||r.assign(m,!1)}),s.ok(m)}function d(){s.result((0,Fa.callValidateCode)(s,e,c),()=>f(e),()=>u(e))}function u(m){const y=(0,Ye._)`${m}.errors`;r.assign(_n.default.vErrors,(0,Ye._)`${_n.default.vErrors} === null ? ${y} : ${_n.default.vErrors}.concat(${y})`),r.assign(_n.default.errors,(0,Ye._)`${_n.default.vErrors}.length`)}function f(m){var y;if(!i.opts.unevaluated)return;const b=(y=t?.validate)===null||y===void 0?void 0:y.evaluated;if(i.props!==!0)if(b&&!b.dynamicProps)b.props!==void 0&&(i.props=Fs.mergeEvaluated.props(r,b.props,i.props));else{const g=r.var("props",(0,Ye._)`${m}.evaluated.props`);i.props=Fs.mergeEvaluated.props(r,g,i.props,Ye.Name)}if(i.items!==!0)if(b&&!b.dynamicItems)b.items!==void 0&&(i.items=Fs.mergeEvaluated.items(r,b.items,i.items));else{const g=r.var("items",(0,Ye._)`${m}.evaluated.items`);i.items=Fs.mergeEvaluated.items(r,g,i.items,Ye.Name)}}}mn.callRef=cr;mn.default=Sp;Object.defineProperty(Oo,"__esModule",{value:!0});const _p=$o,Ep=mn,Cp=["$schema","$id","$defs","$vocabulary",{keyword:"$comment"},"definitions",_p.default,Ep.default];Oo.default=Cp;var Mo={},Po={};Object.defineProperty(Po,"__esModule",{value:!0});const wr=oe,Lt=wr.operators,jr={maximum:{okStr:"<=",ok:Lt.LTE,fail:Lt.GT},minimum:{okStr:">=",ok:Lt.GTE,fail:Lt.LT},exclusiveMaximum:{okStr:"<",ok:Lt.LT,fail:Lt.GTE},exclusiveMinimum:{okStr:">",ok:Lt.GT,fail:Lt.LTE}},Op={message:({keyword:s,schemaCode:e})=>(0,wr.str)`must be ${jr[s].okStr} ${e}`,params:({keyword:s,schemaCode:e})=>(0,wr._)`{comparison: ${jr[s].okStr}, limit: ${e}}`},$p={keyword:Object.keys(jr),type:"number",schemaType:"number",$data:!0,error:Op,code(s){const{keyword:e,data:t,schemaCode:n}=s;s.fail$data((0,wr._)`${t} ${jr[e].fail} ${n} || isNaN(${t})`)}};Po.default=$p;var Ao={};Object.defineProperty(Ao,"__esModule",{value:!0});const vs=oe,Mp={message:({schemaCode:s})=>(0,vs.str)`must be multiple of ${s}`,params:({schemaCode:s})=>(0,vs._)`{multipleOf: ${s}}`},Pp={keyword:"multipleOf",type:"number",schemaType:"number",$data:!0,error:Mp,code(s){const{gen:e,data:t,schemaCode:n,it:r}=s,i=r.opts.multipleOfPrecision,o=e.let("res"),a=i?(0,vs._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${i}`:(0,vs._)`${o} !== parseInt(${o})`;s.fail$data((0,vs._)`(${n} === 0 || (${o} = ${t}/${n}, ${a}))`)}};Ao.default=Pp;var To={},zo={};Object.defineProperty(zo,"__esModule",{value:!0});function nh(s){const e=s.length;let t=0,n=0,r;for(;n<e;)t++,r=s.charCodeAt(n++),r>=55296&&r<=56319&&n<e&&(r=s.charCodeAt(n),(r&64512)===56320&&n++);return t}zo.default=nh;nh.code='require("ajv/dist/runtime/ucs2length").default';Object.defineProperty(To,"__esModule",{value:!0});const an=oe,Ap=B,Tp=zo,zp={message({keyword:s,schemaCode:e}){const t=s==="maxLength"?"more":"fewer";return(0,an.str)`must NOT have ${t} than ${e} characters`},params:({schemaCode:s})=>(0,an._)`{limit: ${s}}`},Np={keyword:["maxLength","minLength"],type:"string",schemaType:"number",$data:!0,error:zp,code(s){const{keyword:e,data:t,schemaCode:n,it:r}=s,i=e==="maxLength"?an.operators.GT:an.operators.LT,o=r.opts.unicode===!1?(0,an._)`${t}.length`:(0,an._)`${(0,Ap.useFunc)(s.gen,Tp.default)}(${t})`;s.fail$data((0,an._)`${o} ${i} ${n}`)}};To.default=Np;var No={};Object.defineProperty(No,"__esModule",{value:!0});const Rp=ie,xr=oe,Dp={message:({schemaCode:s})=>(0,xr.str)`must match pattern "${s}"`,params:({schemaCode:s})=>(0,xr._)`{pattern: ${s}}`},Ip={keyword:"pattern",type:"string",schemaType:"string",$data:!0,error:Dp,code(s){const{data:e,$data:t,schema:n,schemaCode:r,it:i}=s,o=i.opts.unicodeRegExp?"u":"",a=t?(0,xr._)`(new RegExp(${r}, ${o}))`:(0,Rp.usePattern)(s,n);s.fail$data((0,xr._)`!${a}.test(${e})`)}};No.default=Ip;var Ro={};Object.defineProperty(Ro,"__esModule",{value:!0});const bs=oe,qp={message({keyword:s,schemaCode:e}){const t=s==="maxProperties"?"more":"fewer";return(0,bs.str)`must NOT have ${t} than ${e} properties`},params:({schemaCode:s})=>(0,bs._)`{limit: ${s}}`},Bp={keyword:["maxProperties","minProperties"],type:"object",schemaType:"number",$data:!0,error:qp,code(s){const{keyword:e,data:t,schemaCode:n}=s,r=e==="maxProperties"?bs.operators.GT:bs.operators.LT;s.fail$data((0,bs._)`Object.keys(${t}).length ${r} ${n}`)}};Ro.default=Bp;var Do={};Object.defineProperty(Do,"__esModule",{value:!0});const rs=ie,ys=oe,Lp=B,Fp={message:({params:{missingProperty:s}})=>(0,ys.str)`must have required property '${s}'`,params:({params:{missingProperty:s}})=>(0,ys._)`{missingProperty: ${s}}`},Up={keyword:"required",type:"object",schemaType:"array",$data:!0,error:Fp,code(s){const{gen:e,schema:t,schemaCode:n,data:r,$data:i,it:o}=s,{opts:a}=o;if(!i&&t.length===0)return;const l=t.length>=a.loopRequired;if(o.allErrors?c():h(),a.strictRequired){const f=s.parentSchema.properties,{definedProperties:m}=s.it;for(const y of t)if(f?.[y]===void 0&&!m.has(y)){const b=o.schemaEnv.baseId+o.errSchemaPath,g=`required property "${y}" is not defined at "${b}" (strictRequired)`;(0,Lp.checkStrictMode)(o,g,o.opts.strictRequired)}}function c(){if(l||i)s.block$data(ys.nil,d);else for(const f of t)(0,rs.checkReportMissingProp)(s,f)}function h(){const f=e.let("missing");if(l||i){const m=e.let("valid",!0);s.block$data(m,()=>u(f,m)),s.ok(m)}else e.if((0,rs.checkMissingProp)(s,t,f)),(0,rs.reportMissingProp)(s,f),e.else()}function d(){e.forOf("prop",n,f=>{s.setParams({missingProperty:f}),e.if((0,rs.noPropertyInData)(e,r,f,a.ownProperties),()=>s.error())})}function u(f,m){s.setParams({missingProperty:f}),e.forOf(f,n,()=>{e.assign(m,(0,rs.propertyInData)(e,r,f,a.ownProperties)),e.if((0,ys.not)(m),()=>{s.error(),e.break()})},ys.nil)}}};Do.default=Up;var Io={};Object.defineProperty(Io,"__esModule",{value:!0});const ws=oe,Hp={message({keyword:s,schemaCode:e}){const t=s==="maxItems"?"more":"fewer";return(0,ws.str)`must NOT have ${t} than ${e} items`},params:({schemaCode:s})=>(0,ws._)`{limit: ${s}}`},Vp={keyword:["maxItems","minItems"],type:"array",schemaType:"number",$data:!0,error:Hp,code(s){const{keyword:e,data:t,schemaCode:n}=s,r=e==="maxItems"?ws.operators.GT:ws.operators.LT;s.fail$data((0,ws._)`${t}.length ${r} ${n}`)}};Io.default=Vp;var qo={},Ns={};Object.defineProperty(Ns,"__esModule",{value:!0});const sh=$c;sh.code='require("ajv/dist/runtime/equal").default';Ns.default=sh;Object.defineProperty(qo,"__esModule",{value:!0});const ni=Oe,ze=oe,Wp=B,Kp=Ns,Gp={message:({params:{i:s,j:e}})=>(0,ze.str)`must NOT have duplicate items (items ## ${e} and ${s} are identical)`,params:({params:{i:s,j:e}})=>(0,ze._)`{i: ${s}, j: ${e}}`},Yp={keyword:"uniqueItems",type:"array",schemaType:"boolean",$data:!0,error:Gp,code(s){const{gen:e,data:t,$data:n,schema:r,parentSchema:i,schemaCode:o,it:a}=s;if(!n&&!r)return;const l=e.let("valid"),c=i.items?(0,ni.getSchemaTypes)(i.items):[];s.block$data(l,h,(0,ze._)`${o} === false`),s.ok(l);function h(){const m=e.let("i",(0,ze._)`${t}.length`),y=e.let("j");s.setParams({i:m,j:y}),e.assign(l,!0),e.if((0,ze._)`${m} > 1`,()=>(d()?u:f)(m,y))}function d(){return c.length>0&&!c.some(m=>m==="object"||m==="array")}function u(m,y){const b=e.name("item"),g=(0,ni.checkDataTypes)(c,b,a.opts.strictNumbers,ni.DataType.Wrong),x=e.const("indices",(0,ze._)`{}`);e.for((0,ze._)`;${m}--;`,()=>{e.let(b,(0,ze._)`${t}[${m}]`),e.if(g,(0,ze._)`continue`),c.length>1&&e.if((0,ze._)`typeof ${b} == "string"`,(0,ze._)`${b} += "_"`),e.if((0,ze._)`typeof ${x}[${b}] == "number"`,()=>{e.assign(y,(0,ze._)`${x}[${b}]`),s.error(),e.assign(l,!1).break()}).code((0,ze._)`${x}[${b}] = ${m}`)})}function f(m,y){const b=(0,Wp.useFunc)(e,Kp.default),g=e.name("outer");e.label(g).for((0,ze._)`;${m}--;`,()=>e.for((0,ze._)`${y} = ${m}; ${y}--;`,()=>e.if((0,ze._)`${b}(${t}[${m}], ${t}[${y}])`,()=>{s.error(),e.assign(l,!1).break(g)})))}}};qo.default=Yp;var Bo={};Object.defineProperty(Bo,"__esModule",{value:!0});const Ei=oe,Xp=B,Qp=Ns,Jp={message:"must be equal to constant",params:({schemaCode:s})=>(0,Ei._)`{allowedValue: ${s}}`},Zp={keyword:"const",$data:!0,error:Jp,code(s){const{gen:e,data:t,$data:n,schemaCode:r,schema:i}=s;n||i&&typeof i=="object"?s.fail$data((0,Ei._)`!${(0,Xp.useFunc)(e,Qp.default)}(${t}, ${r})`):s.fail((0,Ei._)`${i} !== ${t}`)}};Bo.default=Zp;var Lo={};Object.defineProperty(Lo,"__esModule",{value:!0});const hs=oe,em=B,tm=Ns,nm={message:"must be equal to one of the allowed values",params:({schemaCode:s})=>(0,hs._)`{allowedValues: ${s}}`},sm={keyword:"enum",schemaType:"array",$data:!0,error:nm,code(s){const{gen:e,data:t,$data:n,schema:r,schemaCode:i,it:o}=s;if(!n&&r.length===0)throw new Error("enum must have non-empty array");const a=r.length>=o.opts.loopEnum;let l;const c=()=>l??(l=(0,em.useFunc)(e,tm.default));let h;if(a||n)h=e.let("valid"),s.block$data(h,d);else{if(!Array.isArray(r))throw new Error("ajv implementation error");const f=e.const("vSchema",i);h=(0,hs.or)(...r.map((m,y)=>u(f,y)))}s.pass(h);function d(){e.assign(h,!1),e.forOf("v",i,f=>e.if((0,hs._)`${c()}(${t}, ${f})`,()=>e.assign(h,!0).break()))}function u(f,m){const y=r[m];return typeof y=="object"&&y!==null?(0,hs._)`${c()}(${t}, ${f}[${m}])`:(0,hs._)`${t} === ${y}`}}};Lo.default=sm;Object.defineProperty(Mo,"__esModule",{value:!0});const rm=Po,im=Ao,om=To,am=No,lm=Ro,cm=Do,hm=Io,dm=qo,um=Bo,fm=Lo,pm=[rm.default,im.default,om.default,am.default,lm.default,cm.default,hm.default,dm.default,{keyword:"type",schemaType:["string","array"]},{keyword:"nullable",schemaType:"boolean"},um.default,fm.default];Mo.default=pm;var Fo={},Kn={};Object.defineProperty(Kn,"__esModule",{value:!0});Kn.validateAdditionalItems=void 0;const ln=oe,Ci=B,mm={message:({params:{len:s}})=>(0,ln.str)`must NOT have more than ${s} items`,params:({params:{len:s}})=>(0,ln._)`{limit: ${s}}`},gm={keyword:"additionalItems",type:"array",schemaType:["boolean","object"],before:"uniqueItems",error:mm,code(s){const{parentSchema:e,it:t}=s,{items:n}=e;if(!Array.isArray(n)){(0,Ci.checkStrictMode)(t,'"additionalItems" is ignored when "items" is not an array of schemas');return}rh(s,n)}};function rh(s,e){const{gen:t,schema:n,data:r,keyword:i,it:o}=s;o.items=!0;const a=t.const("len",(0,ln._)`${r}.length`);if(n===!1)s.setParams({len:e.length}),s.pass((0,ln._)`${a} <= ${e.length}`);else if(typeof n=="object"&&!(0,Ci.alwaysValidSchema)(o,n)){const c=t.var("valid",(0,ln._)`${a} <= ${e.length}`);t.if((0,ln.not)(c),()=>l(c)),s.ok(c)}function l(c){t.forRange("i",e.length,a,h=>{s.subschema({keyword:i,dataProp:h,dataPropType:Ci.Type.Num},c),o.allErrors||t.if((0,ln.not)(c),()=>t.break())})}}Kn.validateAdditionalItems=rh;Kn.default=gm;var Uo={},Gn={};Object.defineProperty(Gn,"__esModule",{value:!0});Gn.validateTuple=void 0;const Ha=oe,hr=B,vm=ie,bm={keyword:"items",type:"array",schemaType:["object","array","boolean"],before:"uniqueItems",code(s){const{schema:e,it:t}=s;if(Array.isArray(e))return ih(s,"additionalItems",e);t.items=!0,!(0,hr.alwaysValidSchema)(t,e)&&s.ok((0,vm.validateArray)(s))}};function ih(s,e,t=s.schema){const{gen:n,parentSchema:r,data:i,keyword:o,it:a}=s;h(r),a.opts.unevaluated&&t.length&&a.items!==!0&&(a.items=hr.mergeEvaluated.items(n,t.length,a.items));const l=n.name("valid"),c=n.const("len",(0,Ha._)`${i}.length`);t.forEach((d,u)=>{(0,hr.alwaysValidSchema)(a,d)||(n.if((0,Ha._)`${c} > ${u}`,()=>s.subschema({keyword:o,schemaProp:u,dataProp:u},l)),s.ok(l))});function h(d){const{opts:u,errSchemaPath:f}=a,m=t.length,y=m===d.minItems&&(m===d.maxItems||d[e]===!1);if(u.strictTuples&&!y){const b=`"${o}" is ${m}-tuple, but minItems or maxItems/${e} are not specified or different at path "${f}"`;(0,hr.checkStrictMode)(a,b,u.strictTuples)}}}Gn.validateTuple=ih;Gn.default=bm;Object.defineProperty(Uo,"__esModule",{value:!0});const ym=Gn,wm={keyword:"prefixItems",type:"array",schemaType:["array"],before:"uniqueItems",code:s=>(0,ym.validateTuple)(s,"items")};Uo.default=wm;var Ho={};Object.defineProperty(Ho,"__esModule",{value:!0});const Va=oe,jm=B,xm=ie,km=Kn,Sm={message:({params:{len:s}})=>(0,Va.str)`must NOT have more than ${s} items`,params:({params:{len:s}})=>(0,Va._)`{limit: ${s}}`},_m={keyword:"items",type:"array",schemaType:["object","boolean"],before:"uniqueItems",error:Sm,code(s){const{schema:e,parentSchema:t,it:n}=s,{prefixItems:r}=t;n.items=!0,!(0,jm.alwaysValidSchema)(n,e)&&(r?(0,km.validateAdditionalItems)(s,r):s.ok((0,xm.validateArray)(s)))}};Ho.default=_m;var Vo={};Object.defineProperty(Vo,"__esModule",{value:!0});const tt=oe,Us=B,Em={message:({params:{min:s,max:e}})=>e===void 0?(0,tt.str)`must contain at least ${s} valid item(s)`:(0,tt.str)`must contain at least ${s} and no more than ${e} valid item(s)`,params:({params:{min:s,max:e}})=>e===void 0?(0,tt._)`{minContains: ${s}}`:(0,tt._)`{minContains: ${s}, maxContains: ${e}}`},Cm={keyword:"contains",type:"array",schemaType:["object","boolean"],before:"uniqueItems",trackErrors:!0,error:Em,code(s){const{gen:e,schema:t,parentSchema:n,data:r,it:i}=s;let o,a;const{minContains:l,maxContains:c}=n;i.opts.next?(o=l===void 0?1:l,a=c):o=1;const h=e.const("len",(0,tt._)`${r}.length`);if(s.setParams({min:o,max:a}),a===void 0&&o===0){(0,Us.checkStrictMode)(i,'"minContains" == 0 without "maxContains": "contains" keyword ignored');return}if(a!==void 0&&o>a){(0,Us.checkStrictMode)(i,'"minContains" > "maxContains" is always invalid'),s.fail();return}if((0,Us.alwaysValidSchema)(i,t)){let y=(0,tt._)`${h} >= ${o}`;a!==void 0&&(y=(0,tt._)`${y} && ${h} <= ${a}`),s.pass(y);return}i.items=!0;const d=e.name("valid");a===void 0&&o===1?f(d,()=>e.if(d,()=>e.break())):o===0?(e.let(d,!0),a!==void 0&&e.if((0,tt._)`${r}.length > 0`,u)):(e.let(d,!1),u()),s.result(d,()=>s.reset());function u(){const y=e.name("_valid"),b=e.let("count",0);f(y,()=>e.if(y,()=>m(b)))}function f(y,b){e.forRange("i",0,h,g=>{s.subschema({keyword:"contains",dataProp:g,dataPropType:Us.Type.Num,compositeRule:!0},y),b()})}function m(y){e.code((0,tt._)`${y}++`),a===void 0?e.if((0,tt._)`${y} >= ${o}`,()=>e.assign(d,!0).break()):(e.if((0,tt._)`${y} > ${a}`,()=>e.assign(d,!1).break()),o===1?e.assign(d,!0):e.if((0,tt._)`${y} >= ${o}`,()=>e.assign(d,!0)))}}};Vo.default=Cm;var oh={};(function(s){Object.defineProperty(s,"__esModule",{value:!0}),s.validateSchemaDeps=s.validatePropertyDeps=s.error=void 0;const e=oe,t=B,n=ie;s.error={message:({params:{property:l,depsCount:c,deps:h}})=>{const d=c===1?"property":"properties";return(0,e.str)`must have ${d} ${h} when property ${l} is present`},params:({params:{property:l,depsCount:c,deps:h,missingProperty:d}})=>(0,e._)`{property: ${l},
    missingProperty: ${d},
    depsCount: ${c},
    deps: ${h}}`};const r={keyword:"dependencies",type:"object",schemaType:"object",error:s.error,code(l){const[c,h]=i(l);o(l,c),a(l,h)}};function i({schema:l}){const c={},h={};for(const d in l){if(d==="__proto__")continue;const u=Array.isArray(l[d])?c:h;u[d]=l[d]}return[c,h]}function o(l,c=l.schema){const{gen:h,data:d,it:u}=l;if(Object.keys(c).length===0)return;const f=h.let("missing");for(const m in c){const y=c[m];if(y.length===0)continue;const b=(0,n.propertyInData)(h,d,m,u.opts.ownProperties);l.setParams({property:m,depsCount:y.length,deps:y.join(", ")}),u.allErrors?h.if(b,()=>{for(const g of y)(0,n.checkReportMissingProp)(l,g)}):(h.if((0,e._)`${b} && (${(0,n.checkMissingProp)(l,y,f)})`),(0,n.reportMissingProp)(l,f),h.else())}}s.validatePropertyDeps=o;function a(l,c=l.schema){const{gen:h,data:d,keyword:u,it:f}=l,m=h.name("valid");for(const y in c)(0,t.alwaysValidSchema)(f,c[y])||(h.if((0,n.propertyInData)(h,d,y,f.opts.ownProperties),()=>{const b=l.subschema({keyword:u,schemaProp:y},m);l.mergeValidEvaluated(b,m)},()=>h.var(m,!0)),l.ok(m))}s.validateSchemaDeps=a,s.default=r})(oh);var Wo={};Object.defineProperty(Wo,"__esModule",{value:!0});const ah=oe,Om=B,$m={message:"property name must be valid",params:({params:s})=>(0,ah._)`{propertyName: ${s.propertyName}}`},Mm={keyword:"propertyNames",type:"object",schemaType:["object","boolean"],error:$m,code(s){const{gen:e,schema:t,data:n,it:r}=s;if((0,Om.alwaysValidSchema)(r,t))return;const i=e.name("valid");e.forIn("key",n,o=>{s.setParams({propertyName:o}),s.subschema({keyword:"propertyNames",data:o,dataTypes:["string"],propertyName:o,compositeRule:!0},i),e.if((0,ah.not)(i),()=>{s.error(!0),r.allErrors||e.break()})}),s.ok(i)}};Wo.default=Mm;var Lr={};Object.defineProperty(Lr,"__esModule",{value:!0});const Hs=ie,ct=oe,Pm=Ct,Vs=B,Am={message:"must NOT have additional properties",params:({params:s})=>(0,ct._)`{additionalProperty: ${s.additionalProperty}}`},Tm={keyword:"additionalProperties",type:["object"],schemaType:["boolean","object"],allowUndefined:!0,trackErrors:!0,error:Am,code(s){const{gen:e,schema:t,parentSchema:n,data:r,errsCount:i,it:o}=s;if(!i)throw new Error("ajv implementation error");const{allErrors:a,opts:l}=o;if(o.props=!0,l.removeAdditional!=="all"&&(0,Vs.alwaysValidSchema)(o,t))return;const c=(0,Hs.allSchemaProperties)(n.properties),h=(0,Hs.allSchemaProperties)(n.patternProperties);d(),s.ok((0,ct._)`${i} === ${Pm.default.errors}`);function d(){e.forIn("key",r,b=>{!c.length&&!h.length?m(b):e.if(u(b),()=>m(b))})}function u(b){let g;if(c.length>8){const x=(0,Vs.schemaRefOrVal)(o,n.properties,"properties");g=(0,Hs.isOwnProperty)(e,x,b)}else c.length?g=(0,ct.or)(...c.map(x=>(0,ct._)`${b} === ${x}`)):g=ct.nil;return h.length&&(g=(0,ct.or)(g,...h.map(x=>(0,ct._)`${(0,Hs.usePattern)(s,x)}.test(${b})`))),(0,ct.not)(g)}function f(b){e.code((0,ct._)`delete ${r}[${b}]`)}function m(b){if(l.removeAdditional==="all"||l.removeAdditional&&t===!1){f(b);return}if(t===!1){s.setParams({additionalProperty:b}),s.error(),a||e.break();return}if(typeof t=="object"&&!(0,Vs.alwaysValidSchema)(o,t)){const g=e.name("valid");l.removeAdditional==="failing"?(y(b,g,!1),e.if((0,ct.not)(g),()=>{s.reset(),f(b)})):(y(b,g),a||e.if((0,ct.not)(g),()=>e.break()))}}function y(b,g,x){const C={keyword:"additionalProperties",dataProp:b,dataPropType:Vs.Type.Str};x===!1&&Object.assign(C,{compositeRule:!0,createErrors:!1,allErrors:!1}),s.subschema(C,g)}}};Lr.default=Tm;var Ko={};Object.defineProperty(Ko,"__esModule",{value:!0});const zm=dt,Wa=ie,si=B,Ka=Lr,Nm={keyword:"properties",type:"object",schemaType:"object",code(s){const{gen:e,schema:t,parentSchema:n,data:r,it:i}=s;i.opts.removeAdditional==="all"&&n.additionalProperties===void 0&&Ka.default.code(new zm.KeywordCxt(i,Ka.default,"additionalProperties"));const o=(0,Wa.allSchemaProperties)(t);for(const d of o)i.definedProperties.add(d);i.opts.unevaluated&&o.length&&i.props!==!0&&(i.props=si.mergeEvaluated.props(e,(0,si.toHash)(o),i.props));const a=o.filter(d=>!(0,si.alwaysValidSchema)(i,t[d]));if(a.length===0)return;const l=e.name("valid");for(const d of a)c(d)?h(d):(e.if((0,Wa.propertyInData)(e,r,d,i.opts.ownProperties)),h(d),i.allErrors||e.else().var(l,!0),e.endIf()),s.it.definedProperties.add(d),s.ok(l);function c(d){return i.opts.useDefaults&&!i.compositeRule&&t[d].default!==void 0}function h(d){s.subschema({keyword:"properties",schemaProp:d,dataProp:d},l)}}};Ko.default=Nm;var Go={};Object.defineProperty(Go,"__esModule",{value:!0});const Ga=ie,Ws=oe,Ya=B,Xa=B,Rm={keyword:"patternProperties",type:"object",schemaType:"object",code(s){const{gen:e,schema:t,data:n,parentSchema:r,it:i}=s,{opts:o}=i,a=(0,Ga.allSchemaProperties)(t),l=a.filter(y=>(0,Ya.alwaysValidSchema)(i,t[y]));if(a.length===0||l.length===a.length&&(!i.opts.unevaluated||i.props===!0))return;const c=o.strictSchema&&!o.allowMatchingProperties&&r.properties,h=e.name("valid");i.props!==!0&&!(i.props instanceof Ws.Name)&&(i.props=(0,Xa.evaluatedPropsToName)(e,i.props));const{props:d}=i;u();function u(){for(const y of a)c&&f(y),i.allErrors?m(y):(e.var(h,!0),m(y),e.if(h))}function f(y){for(const b in c)new RegExp(y).test(b)&&(0,Ya.checkStrictMode)(i,`property ${b} matches pattern ${y} (use allowMatchingProperties)`)}function m(y){e.forIn("key",n,b=>{e.if((0,Ws._)`${(0,Ga.usePattern)(s,y)}.test(${b})`,()=>{const g=l.includes(y);g||s.subschema({keyword:"patternProperties",schemaProp:y,dataProp:b,dataPropType:Xa.Type.Str},h),i.opts.unevaluated&&d!==!0?e.assign((0,Ws._)`${d}[${b}]`,!0):!g&&!i.allErrors&&e.if((0,Ws.not)(h),()=>e.break())})})}}};Go.default=Rm;var Yo={};Object.defineProperty(Yo,"__esModule",{value:!0});const Dm=B,Im={keyword:"not",schemaType:["object","boolean"],trackErrors:!0,code(s){const{gen:e,schema:t,it:n}=s;if((0,Dm.alwaysValidSchema)(n,t)){s.fail();return}const r=e.name("valid");s.subschema({keyword:"not",compositeRule:!0,createErrors:!1,allErrors:!1},r),s.failResult(r,()=>s.reset(),()=>s.error())},error:{message:"must NOT be valid"}};Yo.default=Im;var Xo={};Object.defineProperty(Xo,"__esModule",{value:!0});const qm=ie,Bm={keyword:"anyOf",schemaType:"array",trackErrors:!0,code:qm.validateUnion,error:{message:"must match a schema in anyOf"}};Xo.default=Bm;var Qo={};Object.defineProperty(Qo,"__esModule",{value:!0});const dr=oe,Lm=B,Fm={message:"must match exactly one schema in oneOf",params:({params:s})=>(0,dr._)`{passingSchemas: ${s.passing}}`},Um={keyword:"oneOf",schemaType:"array",trackErrors:!0,error:Fm,code(s){const{gen:e,schema:t,parentSchema:n,it:r}=s;if(!Array.isArray(t))throw new Error("ajv implementation error");if(r.opts.discriminator&&n.discriminator)return;const i=t,o=e.let("valid",!1),a=e.let("passing",null),l=e.name("_valid");s.setParams({passing:a}),e.block(c),s.result(o,()=>s.reset(),()=>s.error(!0));function c(){i.forEach((h,d)=>{let u;(0,Lm.alwaysValidSchema)(r,h)?e.var(l,!0):u=s.subschema({keyword:"oneOf",schemaProp:d,compositeRule:!0},l),d>0&&e.if((0,dr._)`${l} && ${o}`).assign(o,!1).assign(a,(0,dr._)`[${a}, ${d}]`).else(),e.if(l,()=>{e.assign(o,!0),e.assign(a,d),u&&s.mergeEvaluated(u,dr.Name)})})}}};Qo.default=Um;var Jo={};Object.defineProperty(Jo,"__esModule",{value:!0});const Hm=B,Vm={keyword:"allOf",schemaType:"array",code(s){const{gen:e,schema:t,it:n}=s;if(!Array.isArray(t))throw new Error("ajv implementation error");const r=e.name("valid");t.forEach((i,o)=>{if((0,Hm.alwaysValidSchema)(n,i))return;const a=s.subschema({keyword:"allOf",schemaProp:o},r);s.ok(r),s.mergeEvaluated(a)})}};Jo.default=Vm;var Zo={};Object.defineProperty(Zo,"__esModule",{value:!0});const kr=oe,lh=B,Wm={message:({params:s})=>(0,kr.str)`must match "${s.ifClause}" schema`,params:({params:s})=>(0,kr._)`{failingKeyword: ${s.ifClause}}`},Km={keyword:"if",schemaType:["object","boolean"],trackErrors:!0,error:Wm,code(s){const{gen:e,parentSchema:t,it:n}=s;t.then===void 0&&t.else===void 0&&(0,lh.checkStrictMode)(n,'"if" without "then" and "else" is ignored');const r=Qa(n,"then"),i=Qa(n,"else");if(!r&&!i)return;const o=e.let("valid",!0),a=e.name("_valid");if(l(),s.reset(),r&&i){const h=e.let("ifClause");s.setParams({ifClause:h}),e.if(a,c("then",h),c("else",h))}else r?e.if(a,c("then")):e.if((0,kr.not)(a),c("else"));s.pass(o,()=>s.error(!0));function l(){const h=s.subschema({keyword:"if",compositeRule:!0,createErrors:!1,allErrors:!1},a);s.mergeEvaluated(h)}function c(h,d){return()=>{const u=s.subschema({keyword:h},a);e.assign(o,a),s.mergeValidEvaluated(u,o),d?e.assign(d,(0,kr._)`${h}`):s.setParams({ifClause:h})}}}};function Qa(s,e){const t=s.schema[e];return t!==void 0&&!(0,lh.alwaysValidSchema)(s,t)}Zo.default=Km;var ea={};Object.defineProperty(ea,"__esModule",{value:!0});const Gm=B,Ym={keyword:["then","else"],schemaType:["object","boolean"],code({keyword:s,parentSchema:e,it:t}){e.if===void 0&&(0,Gm.checkStrictMode)(t,`"${s}" without "if" is ignored`)}};ea.default=Ym;Object.defineProperty(Fo,"__esModule",{value:!0});const Xm=Kn,Qm=Uo,Jm=Gn,Zm=Ho,eg=Vo,tg=oh,ng=Wo,sg=Lr,rg=Ko,ig=Go,og=Yo,ag=Xo,lg=Qo,cg=Jo,hg=Zo,dg=ea;function ug(s=!1){const e=[og.default,ag.default,lg.default,cg.default,hg.default,dg.default,ng.default,sg.default,tg.default,rg.default,ig.default];return s?e.push(Qm.default,Zm.default):e.push(Xm.default,Jm.default),e.push(eg.default),e}Fo.default=ug;var ta={},na={};Object.defineProperty(na,"__esModule",{value:!0});const Se=oe,fg={message:({schemaCode:s})=>(0,Se.str)`must match format "${s}"`,params:({schemaCode:s})=>(0,Se._)`{format: ${s}}`},pg={keyword:"format",type:["number","string"],schemaType:"string",$data:!0,error:fg,code(s,e){const{gen:t,data:n,$data:r,schema:i,schemaCode:o,it:a}=s,{opts:l,errSchemaPath:c,schemaEnv:h,self:d}=a;if(!l.validateFormats)return;r?u():f();function u(){const m=t.scopeValue("formats",{ref:d.formats,code:l.code.formats}),y=t.const("fDef",(0,Se._)`${m}[${o}]`),b=t.let("fType"),g=t.let("format");t.if((0,Se._)`typeof ${y} == "object" && !(${y} instanceof RegExp)`,()=>t.assign(b,(0,Se._)`${y}.type || "string"`).assign(g,(0,Se._)`${y}.validate`),()=>t.assign(b,(0,Se._)`"string"`).assign(g,y)),s.fail$data((0,Se.or)(x(),C()));function x(){return l.strictSchema===!1?Se.nil:(0,Se._)`${o} && !${g}`}function C(){const P=h.$async?(0,Se._)`(${y}.async ? await ${g}(${n}) : ${g}(${n}))`:(0,Se._)`${g}(${n})`,A=(0,Se._)`(typeof ${g} == "function" ? ${P} : ${g}.test(${n}))`;return(0,Se._)`${g} && ${g} !== true && ${b} === ${e} && !${A}`}}function f(){const m=d.formats[i];if(!m){x();return}if(m===!0)return;const[y,b,g]=C(m);y===e&&s.pass(P());function x(){if(l.strictSchema===!1){d.logger.warn(A());return}throw new Error(A());function A(){return`unknown format "${i}" ignored in schema at path "${c}"`}}function C(A){const N=A instanceof RegExp?(0,Se.regexpCode)(A):l.code.formats?(0,Se._)`${l.code.formats}${(0,Se.getProperty)(i)}`:void 0,D=t.scopeValue("formats",{key:i,ref:A,code:N});return typeof A=="object"&&!(A instanceof RegExp)?[A.type||"string",A.validate,(0,Se._)`${D}.validate`]:["string",A,D]}function P(){if(typeof m=="object"&&!(m instanceof RegExp)&&m.async){if(!h.$async)throw new Error("async format in sync schema");return(0,Se._)`await ${g}(${n})`}return typeof b=="function"?(0,Se._)`${g}(${n})`:(0,Se._)`${g}.test(${n})`}}}};na.default=pg;Object.defineProperty(ta,"__esModule",{value:!0});const mg=na,gg=[mg.default];ta.default=gg;var Nn={};Object.defineProperty(Nn,"__esModule",{value:!0});Nn.contentVocabulary=Nn.metadataVocabulary=void 0;Nn.metadataVocabulary=["title","description","default","deprecated","readOnly","writeOnly","examples"];Nn.contentVocabulary=["contentMediaType","contentEncoding","contentSchema"];Object.defineProperty(Co,"__esModule",{value:!0});const vg=Oo,bg=Mo,yg=Fo,wg=ta,Ja=Nn,jg=[vg.default,bg.default,(0,yg.default)(),wg.default,Ja.metadataVocabulary,Ja.contentVocabulary];Co.default=jg;var sa={},Fr={};Object.defineProperty(Fr,"__esModule",{value:!0});Fr.DiscrError=void 0;var Za;(function(s){s.Tag="tag",s.Mapping="mapping"})(Za||(Fr.DiscrError=Za={}));Object.defineProperty(sa,"__esModule",{value:!0});const Cn=oe,Oi=Fr,el=Qe,xg=Wn,kg=B,Sg={message:({params:{discrError:s,tagName:e}})=>s===Oi.DiscrError.Tag?`tag "${e}" must be string`:`value of tag "${e}" must be in oneOf`,params:({params:{discrError:s,tag:e,tagName:t}})=>(0,Cn._)`{error: ${s}, tag: ${t}, tagValue: ${e}}`},_g={keyword:"discriminator",type:"object",schemaType:"object",error:Sg,code(s){const{gen:e,data:t,schema:n,parentSchema:r,it:i}=s,{oneOf:o}=r;if(!i.opts.discriminator)throw new Error("discriminator: requires discriminator option");const a=n.propertyName;if(typeof a!="string")throw new Error("discriminator: requires propertyName");if(n.mapping)throw new Error("discriminator: mapping is not supported");if(!o)throw new Error("discriminator: requires oneOf keyword");const l=e.let("valid",!1),c=e.const("tag",(0,Cn._)`${t}${(0,Cn.getProperty)(a)}`);e.if((0,Cn._)`typeof ${c} == "string"`,()=>h(),()=>s.error(!1,{discrError:Oi.DiscrError.Tag,tag:c,tagName:a})),s.ok(l);function h(){const f=u();e.if(!1);for(const m in f)e.elseIf((0,Cn._)`${c} === ${m}`),e.assign(l,d(f[m]));e.else(),s.error(!1,{discrError:Oi.DiscrError.Mapping,tag:c,tagName:a}),e.endIf()}function d(f){const m=e.name("valid"),y=s.subschema({keyword:"oneOf",schemaProp:f},m);return s.mergeEvaluated(y,Cn.Name),m}function u(){var f;const m={},y=g(r);let b=!0;for(let P=0;P<o.length;P++){let A=o[P];if(A?.$ref&&!(0,kg.schemaHasRulesButRef)(A,i.self.RULES)){const D=A.$ref;if(A=el.resolveRef.call(i.self,i.schemaEnv.root,i.baseId,D),A instanceof el.SchemaEnv&&(A=A.schema),A===void 0)throw new xg.default(i.opts.uriResolver,i.baseId,D)}const N=(f=A?.properties)===null||f===void 0?void 0:f[a];if(typeof N!="object")throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${a}"`);b=b&&(y||g(A)),x(N,P)}if(!b)throw new Error(`discriminator: "${a}" must be required`);return m;function g({required:P}){return Array.isArray(P)&&P.includes(a)}function x(P,A){if(P.const)C(P.const,A);else if(P.enum)for(const N of P.enum)C(N,A);else throw new Error(`discriminator: "properties/${a}" must have "const" or "enum"`)}function C(P,A){if(typeof P!="string"||P in m)throw new Error(`discriminator: "${a}" values must be unique strings`);m[P]=A}}}};sa.default=_g;const Eg="http://json-schema.org/draft-07/schema#",Cg="http://json-schema.org/draft-07/schema#",Og="Core schema meta-schema",$g={schemaArray:{type:"array",minItems:1,items:{$ref:"#"}},nonNegativeInteger:{type:"integer",minimum:0},nonNegativeIntegerDefault0:{allOf:[{$ref:"#/definitions/nonNegativeInteger"},{default:0}]},simpleTypes:{enum:["array","boolean","integer","null","number","object","string"]},stringArray:{type:"array",items:{type:"string"},uniqueItems:!0,default:[]}},Mg=["object","boolean"],Pg={$id:{type:"string",format:"uri-reference"},$schema:{type:"string",format:"uri"},$ref:{type:"string",format:"uri-reference"},$comment:{type:"string"},title:{type:"string"},description:{type:"string"},default:!0,readOnly:{type:"boolean",default:!1},examples:{type:"array",items:!0},multipleOf:{type:"number",exclusiveMinimum:0},maximum:{type:"number"},exclusiveMaximum:{type:"number"},minimum:{type:"number"},exclusiveMinimum:{type:"number"},maxLength:{$ref:"#/definitions/nonNegativeInteger"},minLength:{$ref:"#/definitions/nonNegativeIntegerDefault0"},pattern:{type:"string",format:"regex"},additionalItems:{$ref:"#"},items:{anyOf:[{$ref:"#"},{$ref:"#/definitions/schemaArray"}],default:!0},maxItems:{$ref:"#/definitions/nonNegativeInteger"},minItems:{$ref:"#/definitions/nonNegativeIntegerDefault0"},uniqueItems:{type:"boolean",default:!1},contains:{$ref:"#"},maxProperties:{$ref:"#/definitions/nonNegativeInteger"},minProperties:{$ref:"#/definitions/nonNegativeIntegerDefault0"},required:{$ref:"#/definitions/stringArray"},additionalProperties:{$ref:"#"},definitions:{type:"object",additionalProperties:{$ref:"#"},default:{}},properties:{type:"object",additionalProperties:{$ref:"#"},default:{}},patternProperties:{type:"object",additionalProperties:{$ref:"#"},propertyNames:{format:"regex"},default:{}},dependencies:{type:"object",additionalProperties:{anyOf:[{$ref:"#"},{$ref:"#/definitions/stringArray"}]}},propertyNames:{$ref:"#"},const:!0,enum:{type:"array",items:!0,minItems:1,uniqueItems:!0},type:{anyOf:[{$ref:"#/definitions/simpleTypes"},{type:"array",items:{$ref:"#/definitions/simpleTypes"},minItems:1,uniqueItems:!0}]},format:{type:"string"},contentMediaType:{type:"string"},contentEncoding:{type:"string"},if:{$ref:"#"},then:{$ref:"#"},else:{$ref:"#"},allOf:{$ref:"#/definitions/schemaArray"},anyOf:{$ref:"#/definitions/schemaArray"},oneOf:{$ref:"#/definitions/schemaArray"},not:{$ref:"#"}},Ag={$schema:Eg,$id:Cg,title:Og,definitions:$g,type:Mg,properties:Pg,default:!0};(function(s,e){Object.defineProperty(e,"__esModule",{value:!0}),e.MissingRefError=e.ValidationError=e.CodeGen=e.Name=e.nil=e.stringify=e.str=e._=e.KeywordCxt=e.Ajv=void 0;const t=fc,n=Co,r=sa,i=Ag,o=["/properties"],a="http://json-schema.org/draft-07/schema";class l extends t.default{_addVocabularies(){super._addVocabularies(),n.default.forEach(m=>this.addVocabulary(m)),this.opts.discriminator&&this.addKeyword(r.default)}_addDefaultMetaSchema(){if(super._addDefaultMetaSchema(),!this.opts.meta)return;const m=this.opts.$data?this.$dataMetaSchema(i,o):i;this.addMetaSchema(m,a,!1),this.refs["http://json-schema.org/schema"]=a}defaultMeta(){return this.opts.defaultMeta=super.defaultMeta()||(this.getSchema(a)?a:void 0)}}e.Ajv=l,s.exports=e=l,s.exports.Ajv=l,Object.defineProperty(e,"__esModule",{value:!0}),e.default=l;var c=dt;Object.defineProperty(e,"KeywordCxt",{enumerable:!0,get:function(){return c.KeywordCxt}});var h=oe;Object.defineProperty(e,"_",{enumerable:!0,get:function(){return h._}}),Object.defineProperty(e,"str",{enumerable:!0,get:function(){return h.str}}),Object.defineProperty(e,"stringify",{enumerable:!0,get:function(){return h.stringify}}),Object.defineProperty(e,"nil",{enumerable:!0,get:function(){return h.nil}}),Object.defineProperty(e,"Name",{enumerable:!0,get:function(){return h.Name}}),Object.defineProperty(e,"CodeGen",{enumerable:!0,get:function(){return h.CodeGen}});var d=zs;Object.defineProperty(e,"ValidationError",{enumerable:!0,get:function(){return d.default}});var u=Wn;Object.defineProperty(e,"MissingRefError",{enumerable:!0,get:function(){return u.default}})})(wi,wi.exports);var Tg=wi.exports;const zg=Pd(Tg);var Ng={};(function(s){(function(e){function t(p){return p!==null?Object.prototype.toString.call(p)==="[object Array]":!1}function n(p){return p!==null?Object.prototype.toString.call(p)==="[object Object]":!1}function r(p,w){if(p===w)return!0;var k=Object.prototype.toString.call(p);if(k!==Object.prototype.toString.call(w))return!1;if(t(p)===!0){if(p.length!==w.length)return!1;for(var O=0;O<p.length;O++)if(r(p[O],w[O])===!1)return!1;return!0}if(n(p)===!0){var z={};for(var L in p)if(hasOwnProperty.call(p,L)){if(r(p[L],w[L])===!1)return!1;z[L]=!0}for(var ne in w)if(hasOwnProperty.call(w,ne)&&z[ne]!==!0)return!1;return!0}return!1}function i(p){if(p===""||p===!1||p===null)return!0;if(t(p)&&p.length===0)return!0;if(n(p)){for(var w in p)if(p.hasOwnProperty(w))return!1;return!0}else return!1}function o(p){for(var w=Object.keys(p),k=[],O=0;O<w.length;O++)k.push(p[w[O]]);return k}var a;typeof String.prototype.trimLeft=="function"?a=function(p){return p.trimLeft()}:a=function(p){return p.match(/^\s*(.*)/)[1]};var l=0,c=1,h=2,d=3,u=4,f=5,m=6,y=7,b=8,g=9,x={0:"number",1:"any",2:"string",3:"array",4:"object",5:"boolean",6:"expression",7:"null",8:"Array<number>",9:"Array<string>"},C="EOF",P="UnquotedIdentifier",A="QuotedIdentifier",N="Rbracket",D="Rparen",te="Comma",Z="Colon",he="Rbrace",Q="Number",F="Current",ae="Expref",re="Pipe",me="Or",Ae="And",Ge="EQ",Je="GT",Te="LT",R="GTE",S="LTE",T="NE",E="Flatten",v="Star",j="Filter",M="Dot",U="Not",V="Lbrace",le="Lbracket",ce="Lparen",ke="Literal",Ot={".":M,"*":v,",":te,":":Z,"{":V,"}":he,"]":N,"(":ce,")":D,"@":F},Xn={"<":!0,">":!0,"=":!0,"!":!0},Qn={" ":!0,"	":!0,"\n":!0};function Jn(p){return p>="a"&&p<="z"||p>="A"&&p<="Z"||p==="_"}function wn(p){return p>="0"&&p<="9"||p==="-"}function Zn(p){return p>="a"&&p<="z"||p>="A"&&p<="Z"||p>="0"&&p<="9"||p==="_"}function tn(){}tn.prototype={tokenize:function(p){var w=[];this._current=0;for(var k,O,z;this._current<p.length;)if(Jn(p[this._current]))k=this._current,O=this._consumeUnquotedIdentifier(p),w.push({type:P,value:O,start:k});else if(Ot[p[this._current]]!==void 0)w.push({type:Ot[p[this._current]],value:p[this._current],start:this._current}),this._current++;else if(wn(p[this._current]))z=this._consumeNumber(p),w.push(z);else if(p[this._current]==="[")z=this._consumeLBracket(p),w.push(z);else if(p[this._current]==='"')k=this._current,O=this._consumeQuotedIdentifier(p),w.push({type:A,value:O,start:k});else if(p[this._current]==="'")k=this._current,O=this._consumeRawStringLiteral(p),w.push({type:ke,value:O,start:k});else if(p[this._current]==="`"){k=this._current;var L=this._consumeLiteral(p);w.push({type:ke,value:L,start:k})}else if(Xn[p[this._current]]!==void 0)w.push(this._consumeOperator(p));else if(Qn[p[this._current]]!==void 0)this._current++;else if(p[this._current]==="&")k=this._current,this._current++,p[this._current]==="&"?(this._current++,w.push({type:Ae,value:"&&",start:k})):w.push({type:ae,value:"&",start:k});else if(p[this._current]==="|")k=this._current,this._current++,p[this._current]==="|"?(this._current++,w.push({type:me,value:"||",start:k})):w.push({type:re,value:"|",start:k});else{var ne=new Error("Unknown character:"+p[this._current]);throw ne.name="LexerError",ne}return w},_consumeUnquotedIdentifier:function(p){var w=this._current;for(this._current++;this._current<p.length&&Zn(p[this._current]);)this._current++;return p.slice(w,this._current)},_consumeQuotedIdentifier:function(p){var w=this._current;this._current++;for(var k=p.length;p[this._current]!=='"'&&this._current<k;){var O=this._current;p[O]==="\\"&&(p[O+1]==="\\"||p[O+1]==='"')?O+=2:O++,this._current=O}return this._current++,JSON.parse(p.slice(w,this._current))},_consumeRawStringLiteral:function(p){var w=this._current;this._current++;for(var k=p.length;p[this._current]!=="'"&&this._current<k;){var O=this._current;p[O]==="\\"&&(p[O+1]==="\\"||p[O+1]==="'")?O+=2:O++,this._current=O}this._current++;var z=p.slice(w+1,this._current-1);return z.replace("\\'","'")},_consumeNumber:function(p){var w=this._current;this._current++;for(var k=p.length;wn(p[this._current])&&this._current<k;)this._current++;var O=parseInt(p.slice(w,this._current));return{type:Q,value:O,start:w}},_consumeLBracket:function(p){var w=this._current;return this._current++,p[this._current]==="?"?(this._current++,{type:j,value:"[?",start:w}):p[this._current]==="]"?(this._current++,{type:E,value:"[]",start:w}):{type:le,value:"[",start:w}},_consumeOperator:function(p){var w=this._current,k=p[w];if(this._current++,k==="!")return p[this._current]==="="?(this._current++,{type:T,value:"!=",start:w}):{type:U,value:"!",start:w};if(k==="<")return p[this._current]==="="?(this._current++,{type:S,value:"<=",start:w}):{type:Te,value:"<",start:w};if(k===">")return p[this._current]==="="?(this._current++,{type:R,value:">=",start:w}):{type:Je,value:">",start:w};if(k==="="&&p[this._current]==="=")return this._current++,{type:Ge,value:"==",start:w}},_consumeLiteral:function(p){this._current++;for(var w=this._current,k=p.length,O;p[this._current]!=="`"&&this._current<k;){var z=this._current;p[z]==="\\"&&(p[z+1]==="\\"||p[z+1]==="`")?z+=2:z++,this._current=z}var L=a(p.slice(w,this._current));return L=L.replace("\\`","`"),this._looksLikeJSON(L)?O=JSON.parse(L):O=JSON.parse('"'+L+'"'),this._current++,O},_looksLikeJSON:function(p){var w='[{"',k=["true","false","null"],O="-0123456789";if(p==="")return!1;if(w.indexOf(p[0])>=0)return!0;if(k.indexOf(p)>=0)return!0;if(O.indexOf(p[0])>=0)try{return JSON.parse(p),!0}catch{return!1}else return!1}};var X={};X[C]=0,X[P]=0,X[A]=0,X[N]=0,X[D]=0,X[te]=0,X[he]=0,X[Q]=0,X[F]=0,X[ae]=0,X[re]=1,X[me]=2,X[Ae]=3,X[Ge]=5,X[Je]=5,X[Te]=5,X[R]=5,X[S]=5,X[T]=5,X[E]=9,X[v]=20,X[j]=21,X[M]=40,X[U]=45,X[V]=50,X[le]=55,X[ce]=60;function nn(){}nn.prototype={parse:function(p){this._loadTokens(p),this.index=0;var w=this.expression(0);if(this._lookahead(0)!==C){var k=this._lookaheadToken(0),O=new Error("Unexpected token type: "+k.type+", value: "+k.value);throw O.name="ParserError",O}return w},_loadTokens:function(p){var w=new tn,k=w.tokenize(p);k.push({type:C,value:"",start:p.length}),this.tokens=k},expression:function(p){var w=this._lookaheadToken(0);this._advance();for(var k=this.nud(w),O=this._lookahead(0);p<X[O];)this._advance(),k=this.led(O,k),O=this._lookahead(0);return k},_lookahead:function(p){return this.tokens[this.index+p].type},_lookaheadToken:function(p){return this.tokens[this.index+p]},_advance:function(){this.index++},nud:function(p){var w,k,O;switch(p.type){case ke:return{type:"Literal",value:p.value};case P:return{type:"Field",name:p.value};case A:var z={type:"Field",name:p.value};if(this._lookahead(0)===ce)throw new Error("Quoted identifier not allowed for function names.");return z;case U:return k=this.expression(X.Not),{type:"NotExpression",children:[k]};case v:return w={type:"Identity"},k=null,this._lookahead(0)===N?k={type:"Identity"}:k=this._parseProjectionRHS(X.Star),{type:"ValueProjection",children:[w,k]};case j:return this.led(p.type,{type:"Identity"});case V:return this._parseMultiselectHash();case E:return w={type:E,children:[{type:"Identity"}]},k=this._parseProjectionRHS(X.Flatten),{type:"Projection",children:[w,k]};case le:return this._lookahead(0)===Q||this._lookahead(0)===Z?(k=this._parseIndexExpression(),this._projectIfSlice({type:"Identity"},k)):this._lookahead(0)===v&&this._lookahead(1)===N?(this._advance(),this._advance(),k=this._parseProjectionRHS(X.Star),{type:"Projection",children:[{type:"Identity"},k]}):this._parseMultiselectList();case F:return{type:F};case ae:return O=this.expression(X.Expref),{type:"ExpressionReference",children:[O]};case ce:for(var L=[];this._lookahead(0)!==D;)this._lookahead(0)===F?(O={type:F},this._advance()):O=this.expression(0),L.push(O);return this._match(D),L[0];default:this._errorToken(p)}},led:function(p,w){var k;switch(p){case M:var O=X.Dot;return this._lookahead(0)!==v?(k=this._parseDotRHS(O),{type:"Subexpression",children:[w,k]}):(this._advance(),k=this._parseProjectionRHS(O),{type:"ValueProjection",children:[w,k]});case re:return k=this.expression(X.Pipe),{type:re,children:[w,k]};case me:return k=this.expression(X.Or),{type:"OrExpression",children:[w,k]};case Ae:return k=this.expression(X.And),{type:"AndExpression",children:[w,k]};case ce:for(var z=w.name,L=[],ne,de;this._lookahead(0)!==D;)this._lookahead(0)===F?(ne={type:F},this._advance()):ne=this.expression(0),this._lookahead(0)===te&&this._match(te),L.push(ne);return this._match(D),de={type:"Function",name:z,children:L},de;case j:var Ve=this.expression(0);return this._match(N),this._lookahead(0)===E?k={type:"Identity"}:k=this._parseProjectionRHS(X.Filter),{type:"FilterProjection",children:[w,k,Ve]};case E:var $t={type:E,children:[w]},Ce=this._parseProjectionRHS(X.Flatten);return{type:"Projection",children:[$t,Ce]};case Ge:case T:case Je:case R:case Te:case S:return this._parseComparator(w,p);case le:var Y=this._lookaheadToken(0);return Y.type===Q||Y.type===Z?(k=this._parseIndexExpression(),this._projectIfSlice(w,k)):(this._match(v),this._match(N),k=this._parseProjectionRHS(X.Star),{type:"Projection",children:[w,k]});default:this._errorToken(this._lookaheadToken(0))}},_match:function(p){if(this._lookahead(0)===p)this._advance();else{var w=this._lookaheadToken(0),k=new Error("Expected "+p+", got: "+w.type);throw k.name="ParserError",k}},_errorToken:function(p){var w=new Error("Invalid token ("+p.type+'): "'+p.value+'"');throw w.name="ParserError",w},_parseIndexExpression:function(){if(this._lookahead(0)===Z||this._lookahead(1)===Z)return this._parseSliceExpression();var p={type:"Index",value:this._lookaheadToken(0).value};return this._advance(),this._match(N),p},_projectIfSlice:function(p,w){var k={type:"IndexExpression",children:[p,w]};return w.type==="Slice"?{type:"Projection",children:[k,this._parseProjectionRHS(X.Star)]}:k},_parseSliceExpression:function(){for(var p=[null,null,null],w=0,k=this._lookahead(0);k!==N&&w<3;){if(k===Z)w++,this._advance();else if(k===Q)p[w]=this._lookaheadToken(0).value,this._advance();else{var O=this._lookahead(0),z=new Error("Syntax error, unexpected token: "+O.value+"("+O.type+")");throw z.name="Parsererror",z}k=this._lookahead(0)}return this._match(N),{type:"Slice",children:p}},_parseComparator:function(p,w){var k=this.expression(X[w]);return{type:"Comparator",name:w,children:[p,k]}},_parseDotRHS:function(p){var w=this._lookahead(0),k=[P,A,v];if(k.indexOf(w)>=0)return this.expression(p);if(w===le)return this._match(le),this._parseMultiselectList();if(w===V)return this._match(V),this._parseMultiselectHash()},_parseProjectionRHS:function(p){var w;if(X[this._lookahead(0)]<10)w={type:"Identity"};else if(this._lookahead(0)===le)w=this.expression(p);else if(this._lookahead(0)===j)w=this.expression(p);else if(this._lookahead(0)===M)this._match(M),w=this._parseDotRHS(p);else{var k=this._lookaheadToken(0),O=new Error("Sytanx error, unexpected token: "+k.value+"("+k.type+")");throw O.name="ParserError",O}return w},_parseMultiselectList:function(){for(var p=[];this._lookahead(0)!==N;){var w=this.expression(0);if(p.push(w),this._lookahead(0)===te&&(this._match(te),this._lookahead(0)===N))throw new Error("Unexpected token Rbracket")}return this._match(N),{type:"MultiSelectList",children:p}},_parseMultiselectHash:function(){for(var p=[],w=[P,A],k,O,z,L;;){if(k=this._lookaheadToken(0),w.indexOf(k.type)<0)throw new Error("Expecting an identifier token, got: "+k.type);if(O=k.value,this._advance(),this._match(Z),z=this.expression(0),L={type:"KeyValuePair",name:O,value:z},p.push(L),this._lookahead(0)===te)this._match(te);else if(this._lookahead(0)===he){this._match(he);break}}return{type:"MultiSelectHash",children:p}}};function jn(p){this.runtime=p}jn.prototype={search:function(p,w){return this.visit(p,w)},visit:function(p,w){var k,O,z,L,ne,de,Ve,$t,Ce,Y;switch(p.type){case"Field":return w!==null&&n(w)?(de=w[p.name],de===void 0?null:de):null;case"Subexpression":for(z=this.visit(p.children[0],w),Y=1;Y<p.children.length;Y++)if(z=this.visit(p.children[1],z),z===null)return null;return z;case"IndexExpression":return Ve=this.visit(p.children[0],w),$t=this.visit(p.children[1],Ve),$t;case"Index":if(!t(w))return null;var Mt=p.value;return Mt<0&&(Mt=w.length+Mt),z=w[Mt],z===void 0&&(z=null),z;case"Slice":if(!t(w))return null;var Md=p.children.slice(0),Kr=this.computeSliceParams(w.length,Md),ja=Kr[0],xa=Kr[1],Gr=Kr[2];if(z=[],Gr>0)for(Y=ja;Y<xa;Y+=Gr)z.push(w[Y]);else for(Y=ja;Y>xa;Y+=Gr)z.push(w[Y]);return z;case"Projection":var at=this.visit(p.children[0],w);if(!t(at))return null;for(Ce=[],Y=0;Y<at.length;Y++)O=this.visit(p.children[1],at[Y]),O!==null&&Ce.push(O);return Ce;case"ValueProjection":if(at=this.visit(p.children[0],w),!n(at))return null;Ce=[];var ka=o(at);for(Y=0;Y<ka.length;Y++)O=this.visit(p.children[1],ka[Y]),O!==null&&Ce.push(O);return Ce;case"FilterProjection":if(at=this.visit(p.children[0],w),!t(at))return null;var Yr=[],Sa=[];for(Y=0;Y<at.length;Y++)k=this.visit(p.children[2],at[Y]),i(k)||Yr.push(at[Y]);for(var Xr=0;Xr<Yr.length;Xr++)O=this.visit(p.children[1],Yr[Xr]),O!==null&&Sa.push(O);return Sa;case"Comparator":switch(L=this.visit(p.children[0],w),ne=this.visit(p.children[1],w),p.name){case Ge:z=r(L,ne);break;case T:z=!r(L,ne);break;case Je:z=L>ne;break;case R:z=L>=ne;break;case Te:z=L<ne;break;case S:z=L<=ne;break;default:throw new Error("Unknown comparator: "+p.name)}return z;case E:var Qr=this.visit(p.children[0],w);if(!t(Qr))return null;var Bs=[];for(Y=0;Y<Qr.length;Y++)O=Qr[Y],t(O)?Bs.push.apply(Bs,O):Bs.push(O);return Bs;case"Identity":return w;case"MultiSelectList":if(w===null)return null;for(Ce=[],Y=0;Y<p.children.length;Y++)Ce.push(this.visit(p.children[Y],w));return Ce;case"MultiSelectHash":if(w===null)return null;Ce={};var Jr;for(Y=0;Y<p.children.length;Y++)Jr=p.children[Y],Ce[Jr.name]=this.visit(Jr.value,w);return Ce;case"OrExpression":return k=this.visit(p.children[0],w),i(k)&&(k=this.visit(p.children[1],w)),k;case"AndExpression":return L=this.visit(p.children[0],w),i(L)===!0?L:this.visit(p.children[1],w);case"NotExpression":return L=this.visit(p.children[0],w),i(L);case"Literal":return p.value;case re:return Ve=this.visit(p.children[0],w),this.visit(p.children[1],Ve);case F:return w;case"Function":var _a=[];for(Y=0;Y<p.children.length;Y++)_a.push(this.visit(p.children[Y],w));return this.runtime.callFunction(p.name,_a);case"ExpressionReference":var Ea=p.children[0];return Ea.jmespathType=ae,Ea;default:throw new Error("Unknown node type: "+p.type)}},computeSliceParams:function(p,w){var k=w[0],O=w[1],z=w[2],L=[null,null,null];if(z===null)z=1;else if(z===0){var ne=new Error("Invalid slice, step cannot be 0");throw ne.name="RuntimeError",ne}var de=z<0;return k===null?k=de?p-1:0:k=this.capSliceRange(p,k,z),O===null?O=de?-1:p:O=this.capSliceRange(p,O,z),L[0]=k,L[1]=O,L[2]=z,L},capSliceRange:function(p,w,k){return w<0?(w+=p,w<0&&(w=k<0?-1:0)):w>=p&&(w=k<0?p-1:p),w}};function xn(p){this._interpreter=p,this.functionTable={abs:{_func:this._functionAbs,_signature:[{types:[l]}]},avg:{_func:this._functionAvg,_signature:[{types:[b]}]},ceil:{_func:this._functionCeil,_signature:[{types:[l]}]},contains:{_func:this._functionContains,_signature:[{types:[h,d]},{types:[c]}]},ends_with:{_func:this._functionEndsWith,_signature:[{types:[h]},{types:[h]}]},floor:{_func:this._functionFloor,_signature:[{types:[l]}]},length:{_func:this._functionLength,_signature:[{types:[h,d,u]}]},map:{_func:this._functionMap,_signature:[{types:[m]},{types:[d]}]},max:{_func:this._functionMax,_signature:[{types:[b,g]}]},merge:{_func:this._functionMerge,_signature:[{types:[u],variadic:!0}]},max_by:{_func:this._functionMaxBy,_signature:[{types:[d]},{types:[m]}]},sum:{_func:this._functionSum,_signature:[{types:[b]}]},starts_with:{_func:this._functionStartsWith,_signature:[{types:[h]},{types:[h]}]},min:{_func:this._functionMin,_signature:[{types:[b,g]}]},min_by:{_func:this._functionMinBy,_signature:[{types:[d]},{types:[m]}]},type:{_func:this._functionType,_signature:[{types:[c]}]},keys:{_func:this._functionKeys,_signature:[{types:[u]}]},values:{_func:this._functionValues,_signature:[{types:[u]}]},sort:{_func:this._functionSort,_signature:[{types:[g,b]}]},sort_by:{_func:this._functionSortBy,_signature:[{types:[d]},{types:[m]}]},join:{_func:this._functionJoin,_signature:[{types:[h]},{types:[g]}]},reverse:{_func:this._functionReverse,_signature:[{types:[h,d]}]},to_array:{_func:this._functionToArray,_signature:[{types:[c]}]},to_string:{_func:this._functionToString,_signature:[{types:[c]}]},to_number:{_func:this._functionToNumber,_signature:[{types:[c]}]},not_null:{_func:this._functionNotNull,_signature:[{types:[c],variadic:!0}]}}}xn.prototype={callFunction:function(p,w){var k=this.functionTable[p];if(k===void 0)throw new Error("Unknown function: "+p+"()");return this._validateArgs(p,w,k._signature),k._func.call(this,w)},_validateArgs:function(p,w,k){var O;if(k[k.length-1].variadic){if(w.length<k.length)throw O=k.length===1?" argument":" arguments",new Error("ArgumentError: "+p+"() takes at least"+k.length+O+" but received "+w.length)}else if(w.length!==k.length)throw O=k.length===1?" argument":" arguments",new Error("ArgumentError: "+p+"() takes "+k.length+O+" but received "+w.length);for(var z,L,ne,de=0;de<k.length;de++){ne=!1,z=k[de].types,L=this._getTypeName(w[de]);for(var Ve=0;Ve<z.length;Ve++)if(this._typeMatches(L,z[Ve],w[de])){ne=!0;break}if(!ne){var $t=z.map(function(Ce){return x[Ce]}).join(",");throw new Error("TypeError: "+p+"() expected argument "+(de+1)+" to be type "+$t+" but received type "+x[L]+" instead.")}}},_typeMatches:function(p,w,k){if(w===c)return!0;if(w===g||w===b||w===d){if(w===d)return p===d;if(p===d){var O;w===b?O=l:w===g&&(O=h);for(var z=0;z<k.length;z++)if(!this._typeMatches(this._getTypeName(k[z]),O,k[z]))return!1;return!0}}else return p===w},_getTypeName:function(p){switch(Object.prototype.toString.call(p)){case"[object String]":return h;case"[object Number]":return l;case"[object Array]":return d;case"[object Boolean]":return f;case"[object Null]":return y;case"[object Object]":return p.jmespathType===ae?m:u}},_functionStartsWith:function(p){return p[0].lastIndexOf(p[1])===0},_functionEndsWith:function(p){var w=p[0],k=p[1];return w.indexOf(k,w.length-k.length)!==-1},_functionReverse:function(p){var w=this._getTypeName(p[0]);if(w===h){for(var k=p[0],O="",z=k.length-1;z>=0;z--)O+=k[z];return O}else{var L=p[0].slice(0);return L.reverse(),L}},_functionAbs:function(p){return Math.abs(p[0])},_functionCeil:function(p){return Math.ceil(p[0])},_functionAvg:function(p){for(var w=0,k=p[0],O=0;O<k.length;O++)w+=k[O];return w/k.length},_functionContains:function(p){return p[0].indexOf(p[1])>=0},_functionFloor:function(p){return Math.floor(p[0])},_functionLength:function(p){return n(p[0])?Object.keys(p[0]).length:p[0].length},_functionMap:function(p){for(var w=[],k=this._interpreter,O=p[0],z=p[1],L=0;L<z.length;L++)w.push(k.visit(O,z[L]));return w},_functionMerge:function(p){for(var w={},k=0;k<p.length;k++){var O=p[k];for(var z in O)w[z]=O[z]}return w},_functionMax:function(p){if(p[0].length>0){var w=this._getTypeName(p[0][0]);if(w===l)return Math.max.apply(Math,p[0]);for(var k=p[0],O=k[0],z=1;z<k.length;z++)O.localeCompare(k[z])<0&&(O=k[z]);return O}else return null},_functionMin:function(p){if(p[0].length>0){var w=this._getTypeName(p[0][0]);if(w===l)return Math.min.apply(Math,p[0]);for(var k=p[0],O=k[0],z=1;z<k.length;z++)k[z].localeCompare(O)<0&&(O=k[z]);return O}else return null},_functionSum:function(p){for(var w=0,k=p[0],O=0;O<k.length;O++)w+=k[O];return w},_functionType:function(p){switch(this._getTypeName(p[0])){case l:return"number";case h:return"string";case d:return"array";case u:return"object";case f:return"boolean";case m:return"expref";case y:return"null"}},_functionKeys:function(p){return Object.keys(p[0])},_functionValues:function(p){for(var w=p[0],k=Object.keys(w),O=[],z=0;z<k.length;z++)O.push(w[k[z]]);return O},_functionJoin:function(p){var w=p[0],k=p[1];return k.join(w)},_functionToArray:function(p){return this._getTypeName(p[0])===d?p[0]:[p[0]]},_functionToString:function(p){return this._getTypeName(p[0])===h?p[0]:JSON.stringify(p[0])},_functionToNumber:function(p){var w=this._getTypeName(p[0]),k;return w===l?p[0]:w===h&&(k=+p[0],!isNaN(k))?k:null},_functionNotNull:function(p){for(var w=0;w<p.length;w++)if(this._getTypeName(p[w])!==y)return p[w];return null},_functionSort:function(p){var w=p[0].slice(0);return w.sort(),w},_functionSortBy:function(p){var w=p[0].slice(0);if(w.length===0)return w;var k=this._interpreter,O=p[1],z=this._getTypeName(k.visit(O,w[0]));if([l,h].indexOf(z)<0)throw new Error("TypeError");for(var L=this,ne=[],de=0;de<w.length;de++)ne.push([de,w[de]]);ne.sort(function($t,Ce){var Y=k.visit(O,$t[1]),Mt=k.visit(O,Ce[1]);if(L._getTypeName(Y)!==z)throw new Error("TypeError: expected "+z+", received "+L._getTypeName(Y));if(L._getTypeName(Mt)!==z)throw new Error("TypeError: expected "+z+", received "+L._getTypeName(Mt));return Y>Mt?1:Y<Mt?-1:$t[0]-Ce[0]});for(var Ve=0;Ve<ne.length;Ve++)w[Ve]=ne[Ve][1];return w},_functionMaxBy:function(p){for(var w=p[1],k=p[0],O=this.createKeyFunction(w,[l,h]),z=-1/0,L,ne,de=0;de<k.length;de++)ne=O(k[de]),ne>z&&(z=ne,L=k[de]);return L},_functionMinBy:function(p){for(var w=p[1],k=p[0],O=this.createKeyFunction(w,[l,h]),z=1/0,L,ne,de=0;de<k.length;de++)ne=O(k[de]),ne<z&&(z=ne,L=k[de]);return L},createKeyFunction:function(p,w){var k=this,O=this._interpreter,z=function(L){var ne=O.visit(p,L);if(w.indexOf(k._getTypeName(ne))<0){var de="TypeError: expected one of "+w+", received "+k._getTypeName(ne);throw new Error(de)}return ne};return z}};function es(p){var w=new nn,k=w.parse(p);return k}function ts(p){var w=new tn;return w.tokenize(p)}function ns(p,w){var k=new nn,O=new xn,z=new jn(O);O._interpreter=z;var L=k.parse(w);return z.search(L,p)}e.tokenize=ts,e.compile=es,e.search=ns,e.strictDeepEqual=r})(s)})(Ng);class Rg{add(e,t,n){if(typeof arguments[0]!="string")for(let r in arguments[0])this.add(r,arguments[0][r],arguments[1]);else(Array.isArray(e)?e:[e]).forEach(function(r){this[r]=this[r]||[],t&&this[r][n?"unshift":"push"](t)},this)}run(e,t){this[e]=this[e]||[],this[e].forEach(function(n){n.call(t&&t.context?t.context:t,t)})}}class Dg{constructor(e){this.jsep=e,this.registered={}}register(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];t.forEach(r=>{if(typeof r!="object"||!r.name||!r.init)throw new Error("Invalid JSEP plugin format");this.registered[r.name]||(r.init(this.jsep),this.registered[r.name]=r)})}}class ${static get version(){return"1.4.0"}static toString(){return"JavaScript Expression Parser (JSEP) v"+$.version}static addUnaryOp(e){return $.max_unop_len=Math.max(e.length,$.max_unop_len),$.unary_ops[e]=1,$}static addBinaryOp(e,t,n){return $.max_binop_len=Math.max(e.length,$.max_binop_len),$.binary_ops[e]=t,n?$.right_associative.add(e):$.right_associative.delete(e),$}static addIdentifierChar(e){return $.additional_identifier_chars.add(e),$}static addLiteral(e,t){return $.literals[e]=t,$}static removeUnaryOp(e){return delete $.unary_ops[e],e.length===$.max_unop_len&&($.max_unop_len=$.getMaxKeyLen($.unary_ops)),$}static removeAllUnaryOps(){return $.unary_ops={},$.max_unop_len=0,$}static removeIdentifierChar(e){return $.additional_identifier_chars.delete(e),$}static removeBinaryOp(e){return delete $.binary_ops[e],e.length===$.max_binop_len&&($.max_binop_len=$.getMaxKeyLen($.binary_ops)),$.right_associative.delete(e),$}static removeAllBinaryOps(){return $.binary_ops={},$.max_binop_len=0,$}static removeLiteral(e){return delete $.literals[e],$}static removeAllLiterals(){return $.literals={},$}get char(){return this.expr.charAt(this.index)}get code(){return this.expr.charCodeAt(this.index)}constructor(e){this.expr=e,this.index=0}static parse(e){return new $(e).parse()}static getMaxKeyLen(e){return Math.max(0,...Object.keys(e).map(t=>t.length))}static isDecimalDigit(e){return e>=48&&e<=57}static binaryPrecedence(e){return $.binary_ops[e]||0}static isIdentifierStart(e){return e>=65&&e<=90||e>=97&&e<=122||e>=128&&!$.binary_ops[String.fromCharCode(e)]||$.additional_identifier_chars.has(String.fromCharCode(e))}static isIdentifierPart(e){return $.isIdentifierStart(e)||$.isDecimalDigit(e)}throwError(e){const t=new Error(e+" at character "+this.index);throw t.index=this.index,t.description=e,t}runHook(e,t){if($.hooks[e]){const n={context:this,node:t};return $.hooks.run(e,n),n.node}return t}searchHook(e){if($.hooks[e]){const t={context:this};return $.hooks[e].find(function(n){return n.call(t.context,t),t.node}),t.node}}gobbleSpaces(){let e=this.code;for(;e===$.SPACE_CODE||e===$.TAB_CODE||e===$.LF_CODE||e===$.CR_CODE;)e=this.expr.charCodeAt(++this.index);this.runHook("gobble-spaces")}parse(){this.runHook("before-all");const e=this.gobbleExpressions(),t=e.length===1?e[0]:{type:$.COMPOUND,body:e};return this.runHook("after-all",t)}gobbleExpressions(e){let t=[],n,r;for(;this.index<this.expr.length;)if(n=this.code,n===$.SEMCOL_CODE||n===$.COMMA_CODE)this.index++;else if(r=this.gobbleExpression())t.push(r);else if(this.index<this.expr.length){if(n===e)break;this.throwError('Unexpected "'+this.char+'"')}return t}gobbleExpression(){const e=this.searchHook("gobble-expression")||this.gobbleBinaryExpression();return this.gobbleSpaces(),this.runHook("after-expression",e)}gobbleBinaryOp(){this.gobbleSpaces();let e=this.expr.substr(this.index,$.max_binop_len),t=e.length;for(;t>0;){if($.binary_ops.hasOwnProperty(e)&&(!$.isIdentifierStart(this.code)||this.index+e.length<this.expr.length&&!$.isIdentifierPart(this.expr.charCodeAt(this.index+e.length))))return this.index+=t,e;e=e.substr(0,--t)}return!1}gobbleBinaryExpression(){let e,t,n,r,i,o,a,l,c;if(o=this.gobbleToken(),!o||(t=this.gobbleBinaryOp(),!t))return o;for(i={value:t,prec:$.binaryPrecedence(t),right_a:$.right_associative.has(t)},a=this.gobbleToken(),a||this.throwError("Expected expression after "+t),r=[o,i,a];t=this.gobbleBinaryOp();){if(n=$.binaryPrecedence(t),n===0){this.index-=t.length;break}i={value:t,prec:n,right_a:$.right_associative.has(t)},c=t;const h=d=>i.right_a&&d.right_a?n>d.prec:n<=d.prec;for(;r.length>2&&h(r[r.length-2]);)a=r.pop(),t=r.pop().value,o=r.pop(),e={type:$.BINARY_EXP,operator:t,left:o,right:a},r.push(e);e=this.gobbleToken(),e||this.throwError("Expected expression after "+c),r.push(i,e)}for(l=r.length-1,e=r[l];l>1;)e={type:$.BINARY_EXP,operator:r[l-1].value,left:r[l-2],right:e},l-=2;return e}gobbleToken(){let e,t,n,r;if(this.gobbleSpaces(),r=this.searchHook("gobble-token"),r)return this.runHook("after-token",r);if(e=this.code,$.isDecimalDigit(e)||e===$.PERIOD_CODE)return this.gobbleNumericLiteral();if(e===$.SQUOTE_CODE||e===$.DQUOTE_CODE)r=this.gobbleStringLiteral();else if(e===$.OBRACK_CODE)r=this.gobbleArray();else{for(t=this.expr.substr(this.index,$.max_unop_len),n=t.length;n>0;){if($.unary_ops.hasOwnProperty(t)&&(!$.isIdentifierStart(this.code)||this.index+t.length<this.expr.length&&!$.isIdentifierPart(this.expr.charCodeAt(this.index+t.length)))){this.index+=n;const i=this.gobbleToken();return i||this.throwError("missing unaryOp argument"),this.runHook("after-token",{type:$.UNARY_EXP,operator:t,argument:i,prefix:!0})}t=t.substr(0,--n)}$.isIdentifierStart(e)?(r=this.gobbleIdentifier(),$.literals.hasOwnProperty(r.name)?r={type:$.LITERAL,value:$.literals[r.name],raw:r.name}:r.name===$.this_str&&(r={type:$.THIS_EXP})):e===$.OPAREN_CODE&&(r=this.gobbleGroup())}return r?(r=this.gobbleTokenProperty(r),this.runHook("after-token",r)):this.runHook("after-token",!1)}gobbleTokenProperty(e){this.gobbleSpaces();let t=this.code;for(;t===$.PERIOD_CODE||t===$.OBRACK_CODE||t===$.OPAREN_CODE||t===$.QUMARK_CODE;){let n;if(t===$.QUMARK_CODE){if(this.expr.charCodeAt(this.index+1)!==$.PERIOD_CODE)break;n=!0,this.index+=2,this.gobbleSpaces(),t=this.code}this.index++,t===$.OBRACK_CODE?(e={type:$.MEMBER_EXP,computed:!0,object:e,property:this.gobbleExpression()},e.property||this.throwError('Unexpected "'+this.char+'"'),this.gobbleSpaces(),t=this.code,t!==$.CBRACK_CODE&&this.throwError("Unclosed ["),this.index++):t===$.OPAREN_CODE?e={type:$.CALL_EXP,arguments:this.gobbleArguments($.CPAREN_CODE),callee:e}:(t===$.PERIOD_CODE||n)&&(n&&this.index--,this.gobbleSpaces(),e={type:$.MEMBER_EXP,computed:!1,object:e,property:this.gobbleIdentifier()}),n&&(e.optional=!0),this.gobbleSpaces(),t=this.code}return e}gobbleNumericLiteral(){let e="",t,n;for(;$.isDecimalDigit(this.code);)e+=this.expr.charAt(this.index++);if(this.code===$.PERIOD_CODE)for(e+=this.expr.charAt(this.index++);$.isDecimalDigit(this.code);)e+=this.expr.charAt(this.index++);if(t=this.char,t==="e"||t==="E"){for(e+=this.expr.charAt(this.index++),t=this.char,(t==="+"||t==="-")&&(e+=this.expr.charAt(this.index++));$.isDecimalDigit(this.code);)e+=this.expr.charAt(this.index++);$.isDecimalDigit(this.expr.charCodeAt(this.index-1))||this.throwError("Expected exponent ("+e+this.char+")")}return n=this.code,$.isIdentifierStart(n)?this.throwError("Variable names cannot start with a number ("+e+this.char+")"):(n===$.PERIOD_CODE||e.length===1&&e.charCodeAt(0)===$.PERIOD_CODE)&&this.throwError("Unexpected period"),{type:$.LITERAL,value:parseFloat(e),raw:e}}gobbleStringLiteral(){let e="";const t=this.index,n=this.expr.charAt(this.index++);let r=!1;for(;this.index<this.expr.length;){let i=this.expr.charAt(this.index++);if(i===n){r=!0;break}else if(i==="\\")switch(i=this.expr.charAt(this.index++),i){case"n":e+=`
`;break;case"r":e+="\r";break;case"t":e+="	";break;case"b":e+="\b";break;case"f":e+="\f";break;case"v":e+="\v";break;default:e+=i}else e+=i}return r||this.throwError('Unclosed quote after "'+e+'"'),{type:$.LITERAL,value:e,raw:this.expr.substring(t,this.index)}}gobbleIdentifier(){let e=this.code,t=this.index;for($.isIdentifierStart(e)?this.index++:this.throwError("Unexpected "+this.char);this.index<this.expr.length&&(e=this.code,$.isIdentifierPart(e));)this.index++;return{type:$.IDENTIFIER,name:this.expr.slice(t,this.index)}}gobbleArguments(e){const t=[];let n=!1,r=0;for(;this.index<this.expr.length;){this.gobbleSpaces();let i=this.code;if(i===e){n=!0,this.index++,e===$.CPAREN_CODE&&r&&r>=t.length&&this.throwError("Unexpected token "+String.fromCharCode(e));break}else if(i===$.COMMA_CODE){if(this.index++,r++,r!==t.length){if(e===$.CPAREN_CODE)this.throwError("Unexpected token ,");else if(e===$.CBRACK_CODE)for(let o=t.length;o<r;o++)t.push(null)}}else if(t.length!==r&&r!==0)this.throwError("Expected comma");else{const o=this.gobbleExpression();(!o||o.type===$.COMPOUND)&&this.throwError("Expected comma"),t.push(o)}}return n||this.throwError("Expected "+String.fromCharCode(e)),t}gobbleGroup(){this.index++;let e=this.gobbleExpressions($.CPAREN_CODE);if(this.code===$.CPAREN_CODE)return this.index++,e.length===1?e[0]:e.length?{type:$.SEQUENCE_EXP,expressions:e}:!1;this.throwError("Unclosed (")}gobbleArray(){return this.index++,{type:$.ARRAY_EXP,elements:this.gobbleArguments($.CBRACK_CODE)}}}const Ig=new Rg;Object.assign($,{hooks:Ig,plugins:new Dg($),COMPOUND:"Compound",SEQUENCE_EXP:"SequenceExpression",IDENTIFIER:"Identifier",MEMBER_EXP:"MemberExpression",LITERAL:"Literal",THIS_EXP:"ThisExpression",CALL_EXP:"CallExpression",UNARY_EXP:"UnaryExpression",BINARY_EXP:"BinaryExpression",ARRAY_EXP:"ArrayExpression",TAB_CODE:9,LF_CODE:10,CR_CODE:13,SPACE_CODE:32,PERIOD_CODE:46,COMMA_CODE:44,SQUOTE_CODE:39,DQUOTE_CODE:34,OPAREN_CODE:40,CPAREN_CODE:41,OBRACK_CODE:91,CBRACK_CODE:93,QUMARK_CODE:63,SEMCOL_CODE:59,COLON_CODE:58,unary_ops:{"-":1,"!":1,"~":1,"+":1},binary_ops:{"||":1,"??":1,"&&":2,"|":3,"^":4,"&":5,"==":6,"!=":6,"===":6,"!==":6,"<":7,">":7,"<=":7,">=":7,"<<":8,">>":8,">>>":8,"+":9,"-":9,"*":10,"/":10,"%":10,"**":11},right_associative:new Set(["**"]),additional_identifier_chars:new Set(["$","_"]),literals:{true:!0,false:!1,null:null},this_str:"this"});$.max_unop_len=$.getMaxKeyLen($.unary_ops);$.max_binop_len=$.getMaxKeyLen($.binary_ops);const Yt=s=>new $(s).parse(),qg=Object.getOwnPropertyNames(class{});Object.getOwnPropertyNames($).filter(s=>!qg.includes(s)&&Yt[s]===void 0).forEach(s=>{Yt[s]=$[s]});Yt.Jsep=$;const Bg="ConditionalExpression";var Lg={name:"ternary",init(s){s.hooks.add("after-expression",function(t){if(t.node&&this.code===s.QUMARK_CODE){this.index++;const n=t.node,r=this.gobbleExpression();if(r||this.throwError("Expected expression"),this.gobbleSpaces(),this.code===s.COLON_CODE){this.index++;const i=this.gobbleExpression();if(i||this.throwError("Expected expression"),t.node={type:Bg,test:n,consequent:r,alternate:i},n.operator&&s.binary_ops[n.operator]<=.9){let o=n;for(;o.right.operator&&s.binary_ops[o.right.operator]<=.9;)o=o.right;t.node.test=o.right,o.right=t.node,t.node=n}}else this.throwError("Expected :")}})}};Yt.plugins.register(Lg);const tl=47,Fg=92;var Ug={name:"regex",init(s){s.hooks.add("gobble-token",function(t){if(this.code===tl){const n=++this.index;let r=!1;for(;this.index<this.expr.length;){if(this.code===tl&&!r){const i=this.expr.slice(n,this.index);let o="";for(;++this.index<this.expr.length;){const l=this.code;if(l>=97&&l<=122||l>=65&&l<=90||l>=48&&l<=57)o+=this.char;else break}let a;try{a=new RegExp(i,o)}catch(l){this.throwError(l.message)}return t.node={type:s.LITERAL,value:a,raw:this.expr.slice(n-1,this.index)},t.node=this.gobbleTokenProperty(t.node),t.node}this.code===s.OBRACK_CODE?r=!0:r&&this.code===s.CBRACK_CODE&&(r=!1),this.index+=this.code===Fg?2:1}this.throwError("Unclosed Regex")}})}};const ri=43,Hg=45,On={name:"assignment",assignmentOperators:new Set(["=","*=","**=","/=","%=","+=","-=","<<=",">>=",">>>=","&=","^=","|=","||=","&&=","??="]),updateOperators:[ri,Hg],assignmentPrecedence:.9,init(s){const e=[s.IDENTIFIER,s.MEMBER_EXP];On.assignmentOperators.forEach(n=>s.addBinaryOp(n,On.assignmentPrecedence,!0)),s.hooks.add("gobble-token",function(r){const i=this.code;On.updateOperators.some(o=>o===i&&o===this.expr.charCodeAt(this.index+1))&&(this.index+=2,r.node={type:"UpdateExpression",operator:i===ri?"++":"--",argument:this.gobbleTokenProperty(this.gobbleIdentifier()),prefix:!0},(!r.node.argument||!e.includes(r.node.argument.type))&&this.throwError(`Unexpected ${r.node.operator}`))}),s.hooks.add("after-token",function(r){if(r.node){const i=this.code;On.updateOperators.some(o=>o===i&&o===this.expr.charCodeAt(this.index+1))&&(e.includes(r.node.type)||this.throwError(`Unexpected ${r.node.operator}`),this.index+=2,r.node={type:"UpdateExpression",operator:i===ri?"++":"--",argument:r.node,prefix:!1})}}),s.hooks.add("after-expression",function(r){r.node&&t(r.node)});function t(n){On.assignmentOperators.has(n.operator)?(n.type="AssignmentExpression",t(n.left),t(n.right)):n.operator||Object.values(n).forEach(r=>{r&&typeof r=="object"&&t(r)})}}};Yt.plugins.register(Ug,On);Yt.addUnaryOp("typeof");Yt.addLiteral("null",null);Yt.addLiteral("undefined",void 0);let $i=[],ch=[];(()=>{let s="lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map(e=>e?parseInt(e,36):1);for(let e=0,t=0;e<s.length;e++)(e%2?ch:$i).push(t=t+s[e])})();function Vg(s){if(s<768)return!1;for(let e=0,t=$i.length;;){let n=e+t>>1;if(s<$i[n])t=n;else if(s>=ch[n])e=n+1;else return!0;if(e==t)return!1}}function nl(s){return s>=127462&&s<=127487}const sl=8205;function Wg(s,e,t=!0,n=!0){return(t?hh:Kg)(s,e,n)}function hh(s,e,t){if(e==s.length)return e;e&&dh(s.charCodeAt(e))&&uh(s.charCodeAt(e-1))&&e--;let n=ii(s,e);for(e+=rl(n);e<s.length;){let r=ii(s,e);if(n==sl||r==sl||t&&Vg(r))e+=rl(r),n=r;else if(nl(r)){let i=0,o=e-2;for(;o>=0&&nl(ii(s,o));)i++,o-=2;if(i%2==0)break;e+=2}else break}return e}function Kg(s,e,t){for(;e>0;){let n=hh(s,e-2,t);if(n<e)return n;e--}return 0}function ii(s,e){let t=s.charCodeAt(e);if(!uh(t)||e+1==s.length)return t;let n=s.charCodeAt(e+1);return dh(n)?(t-55296<<10)+(n-56320)+65536:t}function dh(s){return s>=56320&&s<57344}function uh(s){return s>=55296&&s<56320}function rl(s){return s<65536?1:2}class fe{lineAt(e){if(e<0||e>this.length)throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);return this.lineInner(e,!1,1,0)}line(e){if(e<1||e>this.lines)throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);return this.lineInner(e,!0,1,0)}replace(e,t,n){[e,t]=Rn(this,e,t);let r=[];return this.decompose(0,e,r,2),n.length&&n.decompose(0,n.length,r,3),this.decompose(t,this.length,r,1),yt.from(r,this.length-(t-e)+n.length)}append(e){return this.replace(this.length,this.length,e)}slice(e,t=this.length){[e,t]=Rn(this,e,t);let n=[];return this.decompose(e,t,n,0),yt.from(n,t-e)}eq(e){if(e==this)return!0;if(e.length!=this.length||e.lines!=this.lines)return!1;let t=this.scanIdentical(e,1),n=this.length-this.scanIdentical(e,-1),r=new js(this),i=new js(e);for(let o=t,a=t;;){if(r.next(o),i.next(o),o=0,r.lineBreak!=i.lineBreak||r.done!=i.done||r.value!=i.value)return!1;if(a+=r.value.length,r.done||a>=n)return!0}}iter(e=1){return new js(this,e)}iterRange(e,t=this.length){return new fh(this,e,t)}iterLines(e,t){let n;if(e==null)n=this.iter();else{t==null&&(t=this.lines+1);let r=this.line(e).from;n=this.iterRange(r,Math.max(r,t==this.lines+1?this.length:t<=1?0:this.line(t-1).to))}return new ph(n)}toString(){return this.sliceString(0)}toJSON(){let e=[];return this.flatten(e),e}constructor(){}static of(e){if(e.length==0)throw new RangeError("A document must have at least one line");return e.length==1&&!e[0]?fe.empty:e.length<=32?new _e(e):yt.from(_e.split(e,[]))}}class _e extends fe{constructor(e,t=Gg(e)){super(),this.text=e,this.length=t}get lines(){return this.text.length}get children(){return null}lineInner(e,t,n,r){for(let i=0;;i++){let o=this.text[i],a=r+o.length;if((t?n:a)>=e)return new Yg(r,a,n,o);r=a+1,n++}}decompose(e,t,n,r){let i=e<=0&&t>=this.length?this:new _e(il(this.text,e,t),Math.min(t,this.length)-Math.max(0,e));if(r&1){let o=n.pop(),a=ur(i.text,o.text.slice(),0,i.length);if(a.length<=32)n.push(new _e(a,o.length+i.length));else{let l=a.length>>1;n.push(new _e(a.slice(0,l)),new _e(a.slice(l)))}}else n.push(i)}replace(e,t,n){if(!(n instanceof _e))return super.replace(e,t,n);[e,t]=Rn(this,e,t);let r=ur(this.text,ur(n.text,il(this.text,0,e)),t),i=this.length+n.length-(t-e);return r.length<=32?new _e(r,i):yt.from(_e.split(r,[]),i)}sliceString(e,t=this.length,n=`
`){[e,t]=Rn(this,e,t);let r="";for(let i=0,o=0;i<=t&&o<this.text.length;o++){let a=this.text[o],l=i+a.length;i>e&&o&&(r+=n),e<l&&t>i&&(r+=a.slice(Math.max(0,e-i),t-i)),i=l+1}return r}flatten(e){for(let t of this.text)e.push(t)}scanIdentical(){return 0}static split(e,t){let n=[],r=-1;for(let i of e)n.push(i),r+=i.length+1,n.length==32&&(t.push(new _e(n,r)),n=[],r=-1);return r>-1&&t.push(new _e(n,r)),t}}class yt extends fe{constructor(e,t){super(),this.children=e,this.length=t,this.lines=0;for(let n of e)this.lines+=n.lines}lineInner(e,t,n,r){for(let i=0;;i++){let o=this.children[i],a=r+o.length,l=n+o.lines-1;if((t?l:a)>=e)return o.lineInner(e,t,n,r);r=a+1,n=l+1}}decompose(e,t,n,r){for(let i=0,o=0;o<=t&&i<this.children.length;i++){let a=this.children[i],l=o+a.length;if(e<=l&&t>=o){let c=r&((o<=e?1:0)|(l>=t?2:0));o>=e&&l<=t&&!c?n.push(a):a.decompose(e-o,t-o,n,c)}o=l+1}}replace(e,t,n){if([e,t]=Rn(this,e,t),n.lines<this.lines)for(let r=0,i=0;r<this.children.length;r++){let o=this.children[r],a=i+o.length;if(e>=i&&t<=a){let l=o.replace(e-i,t-i,n),c=this.lines-o.lines+l.lines;if(l.lines<c>>4&&l.lines>c>>6){let h=this.children.slice();return h[r]=l,new yt(h,this.length-(t-e)+n.length)}return super.replace(i,a,l)}i=a+1}return super.replace(e,t,n)}sliceString(e,t=this.length,n=`
`){[e,t]=Rn(this,e,t);let r="";for(let i=0,o=0;i<this.children.length&&o<=t;i++){let a=this.children[i],l=o+a.length;o>e&&i&&(r+=n),e<l&&t>o&&(r+=a.sliceString(e-o,t-o,n)),o=l+1}return r}flatten(e){for(let t of this.children)t.flatten(e)}scanIdentical(e,t){if(!(e instanceof yt))return 0;let n=0,[r,i,o,a]=t>0?[0,0,this.children.length,e.children.length]:[this.children.length-1,e.children.length-1,-1,-1];for(;;r+=t,i+=t){if(r==o||i==a)return n;let l=this.children[r],c=e.children[i];if(l!=c)return n+l.scanIdentical(c,t);n+=l.length+1}}static from(e,t=e.reduce((n,r)=>n+r.length+1,-1)){let n=0;for(let f of e)n+=f.lines;if(n<32){let f=[];for(let m of e)m.flatten(f);return new _e(f,t)}let r=Math.max(32,n>>5),i=r<<1,o=r>>1,a=[],l=0,c=-1,h=[];function d(f){let m;if(f.lines>i&&f instanceof yt)for(let y of f.children)d(y);else f.lines>o&&(l>o||!l)?(u(),a.push(f)):f instanceof _e&&l&&(m=h[h.length-1])instanceof _e&&f.lines+m.lines<=32?(l+=f.lines,c+=f.length+1,h[h.length-1]=new _e(m.text.concat(f.text),m.length+1+f.length)):(l+f.lines>r&&u(),l+=f.lines,c+=f.length+1,h.push(f))}function u(){l!=0&&(a.push(h.length==1?h[0]:yt.from(h,c)),c=-1,l=h.length=0)}for(let f of e)d(f);return u(),a.length==1?a[0]:new yt(a,t)}}fe.empty=new _e([""],0);function Gg(s){let e=-1;for(let t of s)e+=t.length+1;return e}function ur(s,e,t=0,n=1e9){for(let r=0,i=0,o=!0;i<s.length&&r<=n;i++){let a=s[i],l=r+a.length;l>=t&&(l>n&&(a=a.slice(0,n-r)),r<t&&(a=a.slice(t-r)),o?(e[e.length-1]+=a,o=!1):e.push(a)),r=l+1}return e}function il(s,e,t){return ur(s,[""],e,t)}class js{constructor(e,t=1){this.dir=t,this.done=!1,this.lineBreak=!1,this.value="",this.nodes=[e],this.offsets=[t>0?1:(e instanceof _e?e.text.length:e.children.length)<<1]}nextInner(e,t){for(this.done=this.lineBreak=!1;;){let n=this.nodes.length-1,r=this.nodes[n],i=this.offsets[n],o=i>>1,a=r instanceof _e?r.text.length:r.children.length;if(o==(t>0?a:0)){if(n==0)return this.done=!0,this.value="",this;t>0&&this.offsets[n-1]++,this.nodes.pop(),this.offsets.pop()}else if((i&1)==(t>0?0:1)){if(this.offsets[n]+=t,e==0)return this.lineBreak=!0,this.value=`
`,this;e--}else if(r instanceof _e){let l=r.text[o+(t<0?-1:0)];if(this.offsets[n]+=t,l.length>Math.max(0,e))return this.value=e==0?l:t>0?l.slice(e):l.slice(0,l.length-e),this;e-=l.length}else{let l=r.children[o+(t<0?-1:0)];e>l.length?(e-=l.length,this.offsets[n]+=t):(t<0&&this.offsets[n]--,this.nodes.push(l),this.offsets.push(t>0?1:(l instanceof _e?l.text.length:l.children.length)<<1))}}}next(e=0){return e<0&&(this.nextInner(-e,-this.dir),e=this.value.length),this.nextInner(e,this.dir)}}class fh{constructor(e,t,n){this.value="",this.done=!1,this.cursor=new js(e,t>n?-1:1),this.pos=t>n?e.length:0,this.from=Math.min(t,n),this.to=Math.max(t,n)}nextInner(e,t){if(t<0?this.pos<=this.from:this.pos>=this.to)return this.value="",this.done=!0,this;e+=Math.max(0,t<0?this.pos-this.to:this.from-this.pos);let n=t<0?this.pos-this.from:this.to-this.pos;e>n&&(e=n),n-=e;let{value:r}=this.cursor.next(e);return this.pos+=(r.length+e)*t,this.value=r.length<=n?r:t<0?r.slice(r.length-n):r.slice(0,n),this.done=!this.value,this}next(e=0){return e<0?e=Math.max(e,this.from-this.pos):e>0&&(e=Math.min(e,this.to-this.pos)),this.nextInner(e,this.cursor.dir)}get lineBreak(){return this.cursor.lineBreak&&this.value!=""}}class ph{constructor(e){this.inner=e,this.afterBreak=!0,this.value="",this.done=!1}next(e=0){let{done:t,lineBreak:n,value:r}=this.inner.next(e);return t&&this.afterBreak?(this.value="",this.afterBreak=!1):t?(this.done=!0,this.value=""):n?this.afterBreak?this.value="":(this.afterBreak=!0,this.next()):(this.value=r,this.afterBreak=!1),this}get lineBreak(){return!1}}typeof Symbol<"u"&&(fe.prototype[Symbol.iterator]=function(){return this.iter()},js.prototype[Symbol.iterator]=fh.prototype[Symbol.iterator]=ph.prototype[Symbol.iterator]=function(){return this});class Yg{constructor(e,t,n,r){this.from=e,this.to=t,this.number=n,this.text=r}get length(){return this.to-this.from}}function Rn(s,e,t){return e=Math.max(0,Math.min(s.length,e)),[e,Math.max(e,Math.min(s.length,t))]}function At(s,e,t=!0,n=!0){return Wg(s,e,t,n)}const Mi=/\r\n?|\n/;var et=function(s){return s[s.Simple=0]="Simple",s[s.TrackDel=1]="TrackDel",s[s.TrackBefore=2]="TrackBefore",s[s.TrackAfter=3]="TrackAfter",s}(et||(et={}));class Rt{constructor(e){this.sections=e}get length(){let e=0;for(let t=0;t<this.sections.length;t+=2)e+=this.sections[t];return e}get newLength(){let e=0;for(let t=0;t<this.sections.length;t+=2){let n=this.sections[t+1];e+=n<0?this.sections[t]:n}return e}get empty(){return this.sections.length==0||this.sections.length==2&&this.sections[1]<0}iterGaps(e){for(let t=0,n=0,r=0;t<this.sections.length;){let i=this.sections[t++],o=this.sections[t++];o<0?(e(n,r,i),r+=i):r+=o,n+=i}}iterChangedRanges(e,t=!1){Pi(this,e,t)}get invertedDesc(){let e=[];for(let t=0;t<this.sections.length;){let n=this.sections[t++],r=this.sections[t++];r<0?e.push(n,r):e.push(r,n)}return new Rt(e)}composeDesc(e){return this.empty?e:e.empty?this:mh(this,e)}mapDesc(e,t=!1){return e.empty?this:Ai(this,e,t)}mapPos(e,t=-1,n=et.Simple){let r=0,i=0;for(let o=0;o<this.sections.length;){let a=this.sections[o++],l=this.sections[o++],c=r+a;if(l<0){if(c>e)return i+(e-r);i+=a}else{if(n!=et.Simple&&c>=e&&(n==et.TrackDel&&r<e&&c>e||n==et.TrackBefore&&r<e||n==et.TrackAfter&&c>e))return null;if(c>e||c==e&&t<0&&!a)return e==r||t<0?i:i+l;i+=l}r=c}if(e>r)throw new RangeError(`Position ${e} is out of range for changeset of length ${r}`);return i}touchesRange(e,t=e){for(let n=0,r=0;n<this.sections.length&&r<=t;){let i=this.sections[n++],o=this.sections[n++],a=r+i;if(o>=0&&r<=t&&a>=e)return r<e&&a>t?"cover":!0;r=a}return!1}toString(){let e="";for(let t=0;t<this.sections.length;){let n=this.sections[t++],r=this.sections[t++];e+=(e?" ":"")+n+(r>=0?":"+r:"")}return e}toJSON(){return this.sections}static fromJSON(e){if(!Array.isArray(e)||e.length%2||e.some(t=>typeof t!="number"))throw new RangeError("Invalid JSON representation of ChangeDesc");return new Rt(e)}static create(e){return new Rt(e)}}class Pe extends Rt{constructor(e,t){super(e),this.inserted=t}apply(e){if(this.length!=e.length)throw new RangeError("Applying change set to a document with the wrong length");return Pi(this,(t,n,r,i,o)=>e=e.replace(r,r+(n-t),o),!1),e}mapDesc(e,t=!1){return Ai(this,e,t,!0)}invert(e){let t=this.sections.slice(),n=[];for(let r=0,i=0;r<t.length;r+=2){let o=t[r],a=t[r+1];if(a>=0){t[r]=a,t[r+1]=o;let l=r>>1;for(;n.length<l;)n.push(fe.empty);n.push(o?e.slice(i,i+o):fe.empty)}i+=o}return new Pe(t,n)}compose(e){return this.empty?e:e.empty?this:mh(this,e,!0)}map(e,t=!1){return e.empty?this:Ai(this,e,t,!0)}iterChanges(e,t=!1){Pi(this,e,t)}get desc(){return Rt.create(this.sections)}filter(e){let t=[],n=[],r=[],i=new Es(this);e:for(let o=0,a=0;;){let l=o==e.length?1e9:e[o++];for(;a<l||a==l&&i.len==0;){if(i.done)break e;let h=Math.min(i.len,l-a);Le(r,h,-1);let d=i.ins==-1?-1:i.off==0?i.ins:0;Le(t,h,d),d>0&&Vt(n,t,i.text),i.forward(h),a+=h}let c=e[o++];for(;a<c;){if(i.done)break e;let h=Math.min(i.len,c-a);Le(t,h,-1),Le(r,h,i.ins==-1?-1:i.off==0?i.ins:0),i.forward(h),a+=h}}return{changes:new Pe(t,n),filtered:Rt.create(r)}}toJSON(){let e=[];for(let t=0;t<this.sections.length;t+=2){let n=this.sections[t],r=this.sections[t+1];r<0?e.push(n):r==0?e.push([n]):e.push([n].concat(this.inserted[t>>1].toJSON()))}return e}static of(e,t,n){let r=[],i=[],o=0,a=null;function l(h=!1){if(!h&&!r.length)return;o<t&&Le(r,t-o,-1);let d=new Pe(r,i);a=a?a.compose(d.map(a)):d,r=[],i=[],o=0}function c(h){if(Array.isArray(h))for(let d of h)c(d);else if(h instanceof Pe){if(h.length!=t)throw new RangeError(`Mismatched change set length (got ${h.length}, expected ${t})`);l(),a=a?a.compose(h.map(a)):h}else{let{from:d,to:u=d,insert:f}=h;if(d>u||d<0||u>t)throw new RangeError(`Invalid change range ${d} to ${u} (in doc of length ${t})`);let m=f?typeof f=="string"?fe.of(f.split(n||Mi)):f:fe.empty,y=m.length;if(d==u&&y==0)return;d<o&&l(),d>o&&Le(r,d-o,-1),Le(r,u-d,y),Vt(i,r,m),o=u}}return c(e),l(!a),a}static empty(e){return new Pe(e?[e,-1]:[],[])}static fromJSON(e){if(!Array.isArray(e))throw new RangeError("Invalid JSON representation of ChangeSet");let t=[],n=[];for(let r=0;r<e.length;r++){let i=e[r];if(typeof i=="number")t.push(i,-1);else{if(!Array.isArray(i)||typeof i[0]!="number"||i.some((o,a)=>a&&typeof o!="string"))throw new RangeError("Invalid JSON representation of ChangeSet");if(i.length==1)t.push(i[0],0);else{for(;n.length<r;)n.push(fe.empty);n[r]=fe.of(i.slice(1)),t.push(i[0],n[r].length)}}}return new Pe(t,n)}static createSet(e,t){return new Pe(e,t)}}function Le(s,e,t,n=!1){if(e==0&&t<=0)return;let r=s.length-2;r>=0&&t<=0&&t==s[r+1]?s[r]+=e:r>=0&&e==0&&s[r]==0?s[r+1]+=t:n?(s[r]+=e,s[r+1]+=t):s.push(e,t)}function Vt(s,e,t){if(t.length==0)return;let n=e.length-2>>1;if(n<s.length)s[s.length-1]=s[s.length-1].append(t);else{for(;s.length<n;)s.push(fe.empty);s.push(t)}}function Pi(s,e,t){let n=s.inserted;for(let r=0,i=0,o=0;o<s.sections.length;){let a=s.sections[o++],l=s.sections[o++];if(l<0)r+=a,i+=a;else{let c=r,h=i,d=fe.empty;for(;c+=a,h+=l,l&&n&&(d=d.append(n[o-2>>1])),!(t||o==s.sections.length||s.sections[o+1]<0);)a=s.sections[o++],l=s.sections[o++];e(r,c,i,h,d),r=c,i=h}}}function Ai(s,e,t,n=!1){let r=[],i=n?[]:null,o=new Es(s),a=new Es(e);for(let l=-1;;){if(o.done&&a.len||a.done&&o.len)throw new Error("Mismatched change set lengths");if(o.ins==-1&&a.ins==-1){let c=Math.min(o.len,a.len);Le(r,c,-1),o.forward(c),a.forward(c)}else if(a.ins>=0&&(o.ins<0||l==o.i||o.off==0&&(a.len<o.len||a.len==o.len&&!t))){let c=a.len;for(Le(r,a.ins,-1);c;){let h=Math.min(o.len,c);o.ins>=0&&l<o.i&&o.len<=h&&(Le(r,0,o.ins),i&&Vt(i,r,o.text),l=o.i),o.forward(h),c-=h}a.next()}else if(o.ins>=0){let c=0,h=o.len;for(;h;)if(a.ins==-1){let d=Math.min(h,a.len);c+=d,h-=d,a.forward(d)}else if(a.ins==0&&a.len<h)h-=a.len,a.next();else break;Le(r,c,l<o.i?o.ins:0),i&&l<o.i&&Vt(i,r,o.text),l=o.i,o.forward(o.len-h)}else{if(o.done&&a.done)return i?Pe.createSet(r,i):Rt.create(r);throw new Error("Mismatched change set lengths")}}}function mh(s,e,t=!1){let n=[],r=t?[]:null,i=new Es(s),o=new Es(e);for(let a=!1;;){if(i.done&&o.done)return r?Pe.createSet(n,r):Rt.create(n);if(i.ins==0)Le(n,i.len,0,a),i.next();else if(o.len==0&&!o.done)Le(n,0,o.ins,a),r&&Vt(r,n,o.text),o.next();else{if(i.done||o.done)throw new Error("Mismatched change set lengths");{let l=Math.min(i.len2,o.len),c=n.length;if(i.ins==-1){let h=o.ins==-1?-1:o.off?0:o.ins;Le(n,l,h,a),r&&h&&Vt(r,n,o.text)}else o.ins==-1?(Le(n,i.off?0:i.len,l,a),r&&Vt(r,n,i.textBit(l))):(Le(n,i.off?0:i.len,o.off?0:o.ins,a),r&&!o.off&&Vt(r,n,o.text));a=(i.ins>l||o.ins>=0&&o.len>l)&&(a||n.length>c),i.forward2(l),o.forward(l)}}}}class Es{constructor(e){this.set=e,this.i=0,this.next()}next(){let{sections:e}=this.set;this.i<e.length?(this.len=e[this.i++],this.ins=e[this.i++]):(this.len=0,this.ins=-2),this.off=0}get done(){return this.ins==-2}get len2(){return this.ins<0?this.len:this.ins}get text(){let{inserted:e}=this.set,t=this.i-2>>1;return t>=e.length?fe.empty:e[t]}textBit(e){let{inserted:t}=this.set,n=this.i-2>>1;return n>=t.length&&!e?fe.empty:t[n].slice(this.off,e==null?void 0:this.off+e)}forward(e){e==this.len?this.next():(this.len-=e,this.off+=e)}forward2(e){this.ins==-1?this.forward(e):e==this.ins?this.next():(this.ins-=e,this.off+=e)}}class dn{constructor(e,t,n){this.from=e,this.to=t,this.flags=n}get anchor(){return this.flags&32?this.to:this.from}get head(){return this.flags&32?this.from:this.to}get empty(){return this.from==this.to}get assoc(){return this.flags&8?-1:this.flags&16?1:0}get bidiLevel(){let e=this.flags&7;return e==7?null:e}get goalColumn(){let e=this.flags>>6;return e==16777215?void 0:e}map(e,t=-1){let n,r;return this.empty?n=r=e.mapPos(this.from,t):(n=e.mapPos(this.from,1),r=e.mapPos(this.to,-1)),n==this.from&&r==this.to?this:new dn(n,r,this.flags)}extend(e,t=e){if(e<=this.anchor&&t>=this.anchor)return K.range(e,t);let n=Math.abs(e-this.anchor)>Math.abs(t-this.anchor)?e:t;return K.range(this.anchor,n)}eq(e,t=!1){return this.anchor==e.anchor&&this.head==e.head&&(!t||!this.empty||this.assoc==e.assoc)}toJSON(){return{anchor:this.anchor,head:this.head}}static fromJSON(e){if(!e||typeof e.anchor!="number"||typeof e.head!="number")throw new RangeError("Invalid JSON representation for SelectionRange");return K.range(e.anchor,e.head)}static create(e,t,n){return new dn(e,t,n)}}class K{constructor(e,t){this.ranges=e,this.mainIndex=t}map(e,t=-1){return e.empty?this:K.create(this.ranges.map(n=>n.map(e,t)),this.mainIndex)}eq(e,t=!1){if(this.ranges.length!=e.ranges.length||this.mainIndex!=e.mainIndex)return!1;for(let n=0;n<this.ranges.length;n++)if(!this.ranges[n].eq(e.ranges[n],t))return!1;return!0}get main(){return this.ranges[this.mainIndex]}asSingle(){return this.ranges.length==1?this:new K([this.main],0)}addRange(e,t=!0){return K.create([e].concat(this.ranges),t?0:this.mainIndex+1)}replaceRange(e,t=this.mainIndex){let n=this.ranges.slice();return n[t]=e,K.create(n,this.mainIndex)}toJSON(){return{ranges:this.ranges.map(e=>e.toJSON()),main:this.mainIndex}}static fromJSON(e){if(!e||!Array.isArray(e.ranges)||typeof e.main!="number"||e.main>=e.ranges.length)throw new RangeError("Invalid JSON representation for EditorSelection");return new K(e.ranges.map(t=>dn.fromJSON(t)),e.main)}static single(e,t=e){return new K([K.range(e,t)],0)}static create(e,t=0){if(e.length==0)throw new RangeError("A selection needs at least one range");for(let n=0,r=0;r<e.length;r++){let i=e[r];if(i.empty?i.from<=n:i.from<n)return K.normalized(e.slice(),t);n=i.to}return new K(e,t)}static cursor(e,t=0,n,r){return dn.create(e,e,(t==0?0:t<0?8:16)|(n==null?7:Math.min(6,n))|(r??16777215)<<6)}static range(e,t,n,r){let i=(n??16777215)<<6|(r==null?7:Math.min(6,r));return t<e?dn.create(t,e,48|i):dn.create(e,t,(t>e?8:0)|i)}static normalized(e,t=0){let n=e[t];e.sort((r,i)=>r.from-i.from),t=e.indexOf(n);for(let r=1;r<e.length;r++){let i=e[r],o=e[r-1];if(i.empty?i.from<=o.to:i.from<o.to){let a=o.from,l=Math.max(i.to,o.to);r<=t&&t--,e.splice(--r,2,i.anchor>i.head?K.range(l,a):K.range(a,l))}}return new K(e,t)}}function gh(s,e){for(let t of s.ranges)if(t.to>e)throw new RangeError("Selection points outside of document")}let ra=0;class ee{constructor(e,t,n,r,i){this.combine=e,this.compareInput=t,this.compare=n,this.isStatic=r,this.id=ra++,this.default=e([]),this.extensions=typeof i=="function"?i(this):i}get reader(){return this}static define(e={}){return new ee(e.combine||(t=>t),e.compareInput||((t,n)=>t===n),e.compare||(e.combine?(t,n)=>t===n:ia),!!e.static,e.enables)}of(e){return new fr([],this,0,e)}compute(e,t){if(this.isStatic)throw new Error("Can't compute a static facet");return new fr(e,this,1,t)}computeN(e,t){if(this.isStatic)throw new Error("Can't compute a static facet");return new fr(e,this,2,t)}from(e,t){return t||(t=n=>n),this.compute([e],n=>t(n.field(e)))}}function ia(s,e){return s==e||s.length==e.length&&s.every((t,n)=>t===e[n])}class fr{constructor(e,t,n,r){this.dependencies=e,this.facet=t,this.type=n,this.value=r,this.id=ra++}dynamicSlot(e){var t;let n=this.value,r=this.facet.compareInput,i=this.id,o=e[i]>>1,a=this.type==2,l=!1,c=!1,h=[];for(let d of this.dependencies)d=="doc"?l=!0:d=="selection"?c=!0:((t=e[d.id])!==null&&t!==void 0?t:1)&1||h.push(e[d.id]);return{create(d){return d.values[o]=n(d),1},update(d,u){if(l&&u.docChanged||c&&(u.docChanged||u.selection)||Ti(d,h)){let f=n(d);if(a?!ol(f,d.values[o],r):!r(f,d.values[o]))return d.values[o]=f,1}return 0},reconfigure:(d,u)=>{let f,m=u.config.address[i];if(m!=null){let y=_r(u,m);if(this.dependencies.every(b=>b instanceof ee?u.facet(b)===d.facet(b):b instanceof yn?u.field(b,!1)==d.field(b,!1):!0)||(a?ol(f=n(d),y,r):r(f=n(d),y)))return d.values[o]=y,0}else f=n(d);return d.values[o]=f,1}}}}function ol(s,e,t){if(s.length!=e.length)return!1;for(let n=0;n<s.length;n++)if(!t(s[n],e[n]))return!1;return!0}function Ti(s,e){let t=!1;for(let n of e)xs(s,n)&1&&(t=!0);return t}function Xg(s,e,t){let n=t.map(l=>s[l.id]),r=t.map(l=>l.type),i=n.filter(l=>!(l&1)),o=s[e.id]>>1;function a(l){let c=[];for(let h=0;h<n.length;h++){let d=_r(l,n[h]);if(r[h]==2)for(let u of d)c.push(u);else c.push(d)}return e.combine(c)}return{create(l){for(let c of n)xs(l,c);return l.values[o]=a(l),1},update(l,c){if(!Ti(l,i))return 0;let h=a(l);return e.compare(h,l.values[o])?0:(l.values[o]=h,1)},reconfigure(l,c){let h=Ti(l,n),d=c.config.facets[e.id],u=c.facet(e);if(d&&!h&&ia(t,d))return l.values[o]=u,0;let f=a(l);return e.compare(f,u)?(l.values[o]=u,0):(l.values[o]=f,1)}}}const al=ee.define({static:!0});class yn{constructor(e,t,n,r,i){this.id=e,this.createF=t,this.updateF=n,this.compareF=r,this.spec=i,this.provides=void 0}static define(e){let t=new yn(ra++,e.create,e.update,e.compare||((n,r)=>n===r),e);return e.provide&&(t.provides=e.provide(t)),t}create(e){let t=e.facet(al).find(n=>n.field==this);return(t?.create||this.createF)(e)}slot(e){let t=e[this.id]>>1;return{create:n=>(n.values[t]=this.create(n),1),update:(n,r)=>{let i=n.values[t],o=this.updateF(i,r);return this.compareF(i,o)?0:(n.values[t]=o,1)},reconfigure:(n,r)=>r.config.address[this.id]!=null?(n.values[t]=r.field(this),0):(n.values[t]=this.create(n),1)}}init(e){return[this,al.of({field:this,create:e})]}get extension(){return this}}const cn={lowest:4,low:3,default:2,high:1,highest:0};function is(s){return e=>new bh(e,s)}const vh={highest:is(cn.highest),high:is(cn.high),default:is(cn.default),low:is(cn.low),lowest:is(cn.lowest)};class bh{constructor(e,t){this.inner=e,this.prec=t}}class Ur{of(e){return new zi(this,e)}reconfigure(e){return Ur.reconfigure.of({compartment:this,extension:e})}get(e){return e.config.compartments.get(this)}}class zi{constructor(e,t){this.compartment=e,this.inner=t}}class Sr{constructor(e,t,n,r,i,o){for(this.base=e,this.compartments=t,this.dynamicSlots=n,this.address=r,this.staticValues=i,this.facets=o,this.statusTemplate=[];this.statusTemplate.length<n.length;)this.statusTemplate.push(0)}staticFacet(e){let t=this.address[e.id];return t==null?e.default:this.staticValues[t>>1]}static resolve(e,t,n){let r=[],i=Object.create(null),o=new Map;for(let u of Qg(e,t,o))u instanceof yn?r.push(u):(i[u.facet.id]||(i[u.facet.id]=[])).push(u);let a=Object.create(null),l=[],c=[];for(let u of r)a[u.id]=c.length<<1,c.push(f=>u.slot(f));let h=n?.config.facets;for(let u in i){let f=i[u],m=f[0].facet,y=h&&h[u]||[];if(f.every(b=>b.type==0))if(a[m.id]=l.length<<1|1,ia(y,f))l.push(n.facet(m));else{let b=m.combine(f.map(g=>g.value));l.push(n&&m.compare(b,n.facet(m))?n.facet(m):b)}else{for(let b of f)b.type==0?(a[b.id]=l.length<<1|1,l.push(b.value)):(a[b.id]=c.length<<1,c.push(g=>b.dynamicSlot(g)));a[m.id]=c.length<<1,c.push(b=>Xg(b,m,f))}}let d=c.map(u=>u(a));return new Sr(e,o,d,a,l,i)}}function Qg(s,e,t){let n=[[],[],[],[],[]],r=new Map;function i(o,a){let l=r.get(o);if(l!=null){if(l<=a)return;let c=n[l].indexOf(o);c>-1&&n[l].splice(c,1),o instanceof zi&&t.delete(o.compartment)}if(r.set(o,a),Array.isArray(o))for(let c of o)i(c,a);else if(o instanceof zi){if(t.has(o.compartment))throw new RangeError("Duplicate use of compartment in extensions");let c=e.get(o.compartment)||o.inner;t.set(o.compartment,c),i(c,a)}else if(o instanceof bh)i(o.inner,o.prec);else if(o instanceof yn)n[a].push(o),o.provides&&i(o.provides,a);else if(o instanceof fr)n[a].push(o),o.facet.extensions&&i(o.facet.extensions,cn.default);else{let c=o.extension;if(!c)throw new Error(`Unrecognized extension value in extension set (${o}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);i(c,a)}}return i(s,cn.default),n.reduce((o,a)=>o.concat(a))}function xs(s,e){if(e&1)return 2;let t=e>>1,n=s.status[t];if(n==4)throw new Error("Cyclic dependency between fields and/or facets");if(n&2)return n;s.status[t]=4;let r=s.computeSlot(s,s.config.dynamicSlots[t]);return s.status[t]=2|r}function _r(s,e){return e&1?s.config.staticValues[e>>1]:s.values[e>>1]}const yh=ee.define(),Ni=ee.define({combine:s=>s.some(e=>e),static:!0}),wh=ee.define({combine:s=>s.length?s[0]:void 0,static:!0}),jh=ee.define(),xh=ee.define(),kh=ee.define(),Sh=ee.define({combine:s=>s.length?s[0]:!1});class Yn{constructor(e,t){this.type=e,this.value=t}static define(){return new Jg}}class Jg{of(e){return new Yn(this,e)}}class Zg{constructor(e){this.map=e}of(e){return new $e(this,e)}}class $e{constructor(e,t){this.type=e,this.value=t}map(e){let t=this.type.map(this.value,e);return t===void 0?void 0:t==this.value?this:new $e(this.type,t)}is(e){return this.type==e}static define(e={}){return new Zg(e.map||(t=>t))}static mapEffects(e,t){if(!e.length)return e;let n=[];for(let r of e){let i=r.map(t);i&&n.push(i)}return n}}$e.reconfigure=$e.define();$e.appendConfig=$e.define();class Ue{constructor(e,t,n,r,i,o){this.startState=e,this.changes=t,this.selection=n,this.effects=r,this.annotations=i,this.scrollIntoView=o,this._doc=null,this._state=null,n&&gh(n,t.newLength),i.some(a=>a.type==Ue.time)||(this.annotations=i.concat(Ue.time.of(Date.now())))}static create(e,t,n,r,i,o){return new Ue(e,t,n,r,i,o)}get newDoc(){return this._doc||(this._doc=this.changes.apply(this.startState.doc))}get newSelection(){return this.selection||this.startState.selection.map(this.changes)}get state(){return this._state||this.startState.applyTransaction(this),this._state}annotation(e){for(let t of this.annotations)if(t.type==e)return t.value}get docChanged(){return!this.changes.empty}get reconfigured(){return this.startState.config!=this.state.config}isUserEvent(e){let t=this.annotation(Ue.userEvent);return!!(t&&(t==e||t.length>e.length&&t.slice(0,e.length)==e&&t[e.length]=="."))}}Ue.time=Yn.define();Ue.userEvent=Yn.define();Ue.addToHistory=Yn.define();Ue.remote=Yn.define();function ev(s,e){let t=[];for(let n=0,r=0;;){let i,o;if(n<s.length&&(r==e.length||e[r]>=s[n]))i=s[n++],o=s[n++];else if(r<e.length)i=e[r++],o=e[r++];else return t;!t.length||t[t.length-1]<i?t.push(i,o):t[t.length-1]<o&&(t[t.length-1]=o)}}function _h(s,e,t){var n;let r,i,o;return t?(r=e.changes,i=Pe.empty(e.changes.length),o=s.changes.compose(e.changes)):(r=e.changes.map(s.changes),i=s.changes.mapDesc(e.changes,!0),o=s.changes.compose(r)),{changes:o,selection:e.selection?e.selection.map(i):(n=s.selection)===null||n===void 0?void 0:n.map(r),effects:$e.mapEffects(s.effects,r).concat($e.mapEffects(e.effects,i)),annotations:s.annotations.length?s.annotations.concat(e.annotations):e.annotations,scrollIntoView:s.scrollIntoView||e.scrollIntoView}}function Ri(s,e,t){let n=e.selection,r=Pn(e.annotations);return e.userEvent&&(r=r.concat(Ue.userEvent.of(e.userEvent))),{changes:e.changes instanceof Pe?e.changes:Pe.of(e.changes||[],t,s.facet(wh)),selection:n&&(n instanceof K?n:K.single(n.anchor,n.head)),effects:Pn(e.effects),annotations:r,scrollIntoView:!!e.scrollIntoView}}function Eh(s,e,t){let n=Ri(s,e.length?e[0]:{},s.doc.length);e.length&&e[0].filter===!1&&(t=!1);for(let i=1;i<e.length;i++){e[i].filter===!1&&(t=!1);let o=!!e[i].sequential;n=_h(n,Ri(s,e[i],o?n.changes.newLength:s.doc.length),o)}let r=Ue.create(s,n.changes,n.selection,n.effects,n.annotations,n.scrollIntoView);return nv(t?tv(r):r)}function tv(s){let e=s.startState,t=!0;for(let r of e.facet(jh)){let i=r(s);if(i===!1){t=!1;break}Array.isArray(i)&&(t=t===!0?i:ev(t,i))}if(t!==!0){let r,i;if(t===!1)i=s.changes.invertedDesc,r=Pe.empty(e.doc.length);else{let o=s.changes.filter(t);r=o.changes,i=o.filtered.mapDesc(o.changes).invertedDesc}s=Ue.create(e,r,s.selection&&s.selection.map(i),$e.mapEffects(s.effects,i),s.annotations,s.scrollIntoView)}let n=e.facet(xh);for(let r=n.length-1;r>=0;r--){let i=n[r](s);i instanceof Ue?s=i:Array.isArray(i)&&i.length==1&&i[0]instanceof Ue?s=i[0]:s=Eh(e,Pn(i),!1)}return s}function nv(s){let e=s.startState,t=e.facet(kh),n=s;for(let r=t.length-1;r>=0;r--){let i=t[r](s);i&&Object.keys(i).length&&(n=_h(n,Ri(e,i,s.changes.newLength),!0))}return n==s?s:Ue.create(e,s.changes,s.selection,n.effects,n.annotations,n.scrollIntoView)}const sv=[];function Pn(s){return s==null?sv:Array.isArray(s)?s:[s]}var Tt=function(s){return s[s.Word=0]="Word",s[s.Space=1]="Space",s[s.Other=2]="Other",s}(Tt||(Tt={}));const rv=/[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;let Di;try{Di=new RegExp("[\\p{Alphabetic}\\p{Number}_]","u")}catch{}function iv(s){if(Di)return Di.test(s);for(let e=0;e<s.length;e++){let t=s[e];if(/\w/.test(t)||t>""&&(t.toUpperCase()!=t.toLowerCase()||rv.test(t)))return!0}return!1}function ov(s){return e=>{if(!/\S/.test(e))return Tt.Space;if(iv(e))return Tt.Word;for(let t=0;t<s.length;t++)if(e.indexOf(s[t])>-1)return Tt.Word;return Tt.Other}}class pe{constructor(e,t,n,r,i,o){this.config=e,this.doc=t,this.selection=n,this.values=r,this.status=e.statusTemplate.slice(),this.computeSlot=i,o&&(o._state=this);for(let a=0;a<this.config.dynamicSlots.length;a++)xs(this,a<<1);this.computeSlot=null}field(e,t=!0){let n=this.config.address[e.id];if(n==null){if(t)throw new RangeError("Field is not present in this state");return}return xs(this,n),_r(this,n)}update(...e){return Eh(this,e,!0)}applyTransaction(e){let t=this.config,{base:n,compartments:r}=t;for(let a of e.effects)a.is(Ur.reconfigure)?(t&&(r=new Map,t.compartments.forEach((l,c)=>r.set(c,l)),t=null),r.set(a.value.compartment,a.value.extension)):a.is($e.reconfigure)?(t=null,n=a.value):a.is($e.appendConfig)&&(t=null,n=Pn(n).concat(a.value));let i;t?i=e.startState.values.slice():(t=Sr.resolve(n,r,this),i=new pe(t,this.doc,this.selection,t.dynamicSlots.map(()=>null),(l,c)=>c.reconfigure(l,this),null).values);let o=e.startState.facet(Ni)?e.newSelection:e.newSelection.asSingle();new pe(t,e.newDoc,o,i,(a,l)=>l.update(a,e),e)}replaceSelection(e){return typeof e=="string"&&(e=this.toText(e)),this.changeByRange(t=>({changes:{from:t.from,to:t.to,insert:e},range:K.cursor(t.from+e.length)}))}changeByRange(e){let t=this.selection,n=e(t.ranges[0]),r=this.changes(n.changes),i=[n.range],o=Pn(n.effects);for(let a=1;a<t.ranges.length;a++){let l=e(t.ranges[a]),c=this.changes(l.changes),h=c.map(r);for(let u=0;u<a;u++)i[u]=i[u].map(h);let d=r.mapDesc(c,!0);i.push(l.range.map(d)),r=r.compose(h),o=$e.mapEffects(o,h).concat($e.mapEffects(Pn(l.effects),d))}return{changes:r,selection:K.create(i,t.mainIndex),effects:o}}changes(e=[]){return e instanceof Pe?e:Pe.of(e,this.doc.length,this.facet(pe.lineSeparator))}toText(e){return fe.of(e.split(this.facet(pe.lineSeparator)||Mi))}sliceDoc(e=0,t=this.doc.length){return this.doc.sliceString(e,t,this.lineBreak)}facet(e){let t=this.config.address[e.id];return t==null?e.default:(xs(this,t),_r(this,t))}toJSON(e){let t={doc:this.sliceDoc(),selection:this.selection.toJSON()};if(e)for(let n in e){let r=e[n];r instanceof yn&&this.config.address[r.id]!=null&&(t[n]=r.spec.toJSON(this.field(e[n]),this))}return t}static fromJSON(e,t={},n){if(!e||typeof e.doc!="string")throw new RangeError("Invalid JSON representation for EditorState");let r=[];if(n){for(let i in n)if(Object.prototype.hasOwnProperty.call(e,i)){let o=n[i],a=e[i];r.push(o.init(l=>o.spec.fromJSON(a,l)))}}return pe.create({doc:e.doc,selection:K.fromJSON(e.selection),extensions:t.extensions?r.concat([t.extensions]):r})}static create(e={}){let t=Sr.resolve(e.extensions||[],new Map),n=e.doc instanceof fe?e.doc:fe.of((e.doc||"").split(t.staticFacet(pe.lineSeparator)||Mi)),r=e.selection?e.selection instanceof K?e.selection:K.single(e.selection.anchor,e.selection.head):K.single(0);return gh(r,n.length),t.staticFacet(Ni)||(r=r.asSingle()),new pe(t,n,r,t.dynamicSlots.map(()=>null),(i,o)=>o.create(i),null)}get tabSize(){return this.facet(pe.tabSize)}get lineBreak(){return this.facet(pe.lineSeparator)||`
`}get readOnly(){return this.facet(Sh)}phrase(e,...t){for(let n of this.facet(pe.phrases))if(Object.prototype.hasOwnProperty.call(n,e)){e=n[e];break}return t.length&&(e=e.replace(/\$(\$|\d*)/g,(n,r)=>{if(r=="$")return"$";let i=+(r||1);return!i||i>t.length?n:t[i-1]})),e}languageDataAt(e,t,n=-1){let r=[];for(let i of this.facet(yh))for(let o of i(this,t,n))Object.prototype.hasOwnProperty.call(o,e)&&r.push(o[e]);return r}charCategorizer(e){return ov(this.languageDataAt("wordChars",e).join(""))}wordAt(e){let{text:t,from:n,length:r}=this.doc.lineAt(e),i=this.charCategorizer(e),o=e-n,a=e-n;for(;o>0;){let l=At(t,o,!1);if(i(t.slice(l,o))!=Tt.Word)break;o=l}for(;a<r;){let l=At(t,a);if(i(t.slice(a,l))!=Tt.Word)break;a=l}return o==a?null:K.range(o+n,a+n)}}pe.allowMultipleSelections=Ni;pe.tabSize=ee.define({combine:s=>s.length?s[0]:4});pe.lineSeparator=wh;pe.readOnly=Sh;pe.phrases=ee.define({compare(s,e){let t=Object.keys(s),n=Object.keys(e);return t.length==n.length&&t.every(r=>s[r]==e[r])}});pe.languageData=yh;pe.changeFilter=jh;pe.transactionFilter=xh;pe.transactionExtender=kh;Ur.reconfigure=$e.define();class Dn{eq(e){return this==e}range(e,t=e){return Ii.create(e,t,this)}}Dn.prototype.startSide=Dn.prototype.endSide=0;Dn.prototype.point=!1;Dn.prototype.mapMode=et.TrackDel;let Ii=class Ch{constructor(e,t,n){this.from=e,this.to=t,this.value=n}static create(e,t,n){return new Ch(e,t,n)}};function qi(s,e){return s.from-e.from||s.value.startSide-e.value.startSide}class oa{constructor(e,t,n,r){this.from=e,this.to=t,this.value=n,this.maxPoint=r}get length(){return this.to[this.to.length-1]}findIndex(e,t,n,r=0){let i=n?this.to:this.from;for(let o=r,a=i.length;;){if(o==a)return o;let l=o+a>>1,c=i[l]-e||(n?this.value[l].endSide:this.value[l].startSide)-t;if(l==o)return c>=0?o:a;c>=0?a=l:o=l+1}}between(e,t,n,r){for(let i=this.findIndex(t,-1e9,!0),o=this.findIndex(n,1e9,!1,i);i<o;i++)if(r(this.from[i]+e,this.to[i]+e,this.value[i])===!1)return!1}map(e,t){let n=[],r=[],i=[],o=-1,a=-1;for(let l=0;l<this.value.length;l++){let c=this.value[l],h=this.from[l]+e,d=this.to[l]+e,u,f;if(h==d){let m=t.mapPos(h,c.startSide,c.mapMode);if(m==null||(u=f=m,c.startSide!=c.endSide&&(f=t.mapPos(h,c.endSide),f<u)))continue}else if(u=t.mapPos(h,c.startSide),f=t.mapPos(d,c.endSide),u>f||u==f&&c.startSide>0&&c.endSide<=0)continue;(f-u||c.endSide-c.startSide)<0||(o<0&&(o=u),c.point&&(a=Math.max(a,f-u)),n.push(c),r.push(u-o),i.push(f-o))}return{mapped:n.length?new oa(r,i,n,a):null,pos:o}}}class je{constructor(e,t,n,r){this.chunkPos=e,this.chunk=t,this.nextLayer=n,this.maxPoint=r}static create(e,t,n,r){return new je(e,t,n,r)}get length(){let e=this.chunk.length-1;return e<0?0:Math.max(this.chunkEnd(e),this.nextLayer.length)}get size(){if(this.isEmpty)return 0;let e=this.nextLayer.size;for(let t of this.chunk)e+=t.value.length;return e}chunkEnd(e){return this.chunkPos[e]+this.chunk[e].length}update(e){let{add:t=[],sort:n=!1,filterFrom:r=0,filterTo:i=this.length}=e,o=e.filter;if(t.length==0&&!o)return this;if(n&&(t=t.slice().sort(qi)),this.isEmpty)return t.length?je.of(t):this;let a=new Oh(this,null,-1).goto(0),l=0,c=[],h=new In;for(;a.value||l<t.length;)if(l<t.length&&(a.from-t[l].from||a.startSide-t[l].value.startSide)>=0){let d=t[l++];h.addInner(d.from,d.to,d.value)||c.push(d)}else a.rangeIndex==1&&a.chunkIndex<this.chunk.length&&(l==t.length||this.chunkEnd(a.chunkIndex)<t[l].from)&&(!o||r>this.chunkEnd(a.chunkIndex)||i<this.chunkPos[a.chunkIndex])&&h.addChunk(this.chunkPos[a.chunkIndex],this.chunk[a.chunkIndex])?a.nextChunk():((!o||r>a.to||i<a.from||o(a.from,a.to,a.value))&&(h.addInner(a.from,a.to,a.value)||c.push(Ii.create(a.from,a.to,a.value))),a.next());return h.finishInner(this.nextLayer.isEmpty&&!c.length?je.empty:this.nextLayer.update({add:c,filter:o,filterFrom:r,filterTo:i}))}map(e){if(e.empty||this.isEmpty)return this;let t=[],n=[],r=-1;for(let o=0;o<this.chunk.length;o++){let a=this.chunkPos[o],l=this.chunk[o],c=e.touchesRange(a,a+l.length);if(c===!1)r=Math.max(r,l.maxPoint),t.push(l),n.push(e.mapPos(a));else if(c===!0){let{mapped:h,pos:d}=l.map(a,e);h&&(r=Math.max(r,h.maxPoint),t.push(h),n.push(d))}}let i=this.nextLayer.map(e);return t.length==0?i:new je(n,t,i||je.empty,r)}between(e,t,n){if(!this.isEmpty){for(let r=0;r<this.chunk.length;r++){let i=this.chunkPos[r],o=this.chunk[r];if(t>=i&&e<=i+o.length&&o.between(i,e-i,t-i,n)===!1)return}this.nextLayer.between(e,t,n)}}iter(e=0){return Cs.from([this]).goto(e)}get isEmpty(){return this.nextLayer==this}static iter(e,t=0){return Cs.from(e).goto(t)}static compare(e,t,n,r,i=-1){let o=e.filter(d=>d.maxPoint>0||!d.isEmpty&&d.maxPoint>=i),a=t.filter(d=>d.maxPoint>0||!d.isEmpty&&d.maxPoint>=i),l=ll(o,a,n),c=new os(o,l,i),h=new os(a,l,i);n.iterGaps((d,u,f)=>cl(c,d,h,u,f,r)),n.empty&&n.length==0&&cl(c,0,h,0,0,r)}static eq(e,t,n=0,r){r==null&&(r=999999999);let i=e.filter(h=>!h.isEmpty&&t.indexOf(h)<0),o=t.filter(h=>!h.isEmpty&&e.indexOf(h)<0);if(i.length!=o.length)return!1;if(!i.length)return!0;let a=ll(i,o),l=new os(i,a,0).goto(n),c=new os(o,a,0).goto(n);for(;;){if(l.to!=c.to||!Bi(l.active,c.active)||l.point&&(!c.point||!l.point.eq(c.point)))return!1;if(l.to>r)return!0;l.next(),c.next()}}static spans(e,t,n,r,i=-1){let o=new os(e,null,i).goto(t),a=t,l=o.openStart;for(;;){let c=Math.min(o.to,n);if(o.point){let h=o.activeForPoint(o.to),d=o.pointFrom<t?h.length+1:o.point.startSide<0?h.length:Math.min(h.length,l);r.point(a,c,o.point,h,d,o.pointRank),l=Math.min(o.openEnd(c),h.length)}else c>a&&(r.span(a,c,o.active,l),l=o.openEnd(c));if(o.to>n)return l+(o.point&&o.to>n?1:0);a=o.to,o.next()}}static of(e,t=!1){let n=new In;for(let r of e instanceof Ii?[e]:t?av(e):e)n.add(r.from,r.to,r.value);return n.finish()}static join(e){if(!e.length)return je.empty;let t=e[e.length-1];for(let n=e.length-2;n>=0;n--)for(let r=e[n];r!=je.empty;r=r.nextLayer)t=new je(r.chunkPos,r.chunk,t,Math.max(r.maxPoint,t.maxPoint));return t}}je.empty=new je([],[],null,-1);function av(s){if(s.length>1)for(let e=s[0],t=1;t<s.length;t++){let n=s[t];if(qi(e,n)>0)return s.slice().sort(qi);e=n}return s}je.empty.nextLayer=je.empty;class In{finishChunk(e){this.chunks.push(new oa(this.from,this.to,this.value,this.maxPoint)),this.chunkPos.push(this.chunkStart),this.chunkStart=-1,this.setMaxPoint=Math.max(this.setMaxPoint,this.maxPoint),this.maxPoint=-1,e&&(this.from=[],this.to=[],this.value=[])}constructor(){this.chunks=[],this.chunkPos=[],this.chunkStart=-1,this.last=null,this.lastFrom=-1e9,this.lastTo=-1e9,this.from=[],this.to=[],this.value=[],this.maxPoint=-1,this.setMaxPoint=-1,this.nextLayer=null}add(e,t,n){this.addInner(e,t,n)||(this.nextLayer||(this.nextLayer=new In)).add(e,t,n)}addInner(e,t,n){let r=e-this.lastTo||n.startSide-this.last.endSide;if(r<=0&&(e-this.lastFrom||n.startSide-this.last.startSide)<0)throw new Error("Ranges must be added sorted by `from` position and `startSide`");return r<0?!1:(this.from.length==250&&this.finishChunk(!0),this.chunkStart<0&&(this.chunkStart=e),this.from.push(e-this.chunkStart),this.to.push(t-this.chunkStart),this.last=n,this.lastFrom=e,this.lastTo=t,this.value.push(n),n.point&&(this.maxPoint=Math.max(this.maxPoint,t-e)),!0)}addChunk(e,t){if((e-this.lastTo||t.value[0].startSide-this.last.endSide)<0)return!1;this.from.length&&this.finishChunk(!0),this.setMaxPoint=Math.max(this.setMaxPoint,t.maxPoint),this.chunks.push(t),this.chunkPos.push(e);let n=t.value.length-1;return this.last=t.value[n],this.lastFrom=t.from[n]+e,this.lastTo=t.to[n]+e,!0}finish(){return this.finishInner(je.empty)}finishInner(e){if(this.from.length&&this.finishChunk(!1),this.chunks.length==0)return e;let t=je.create(this.chunkPos,this.chunks,this.nextLayer?this.nextLayer.finishInner(e):e,this.setMaxPoint);return this.from=null,t}}function ll(s,e,t){let n=new Map;for(let i of s)for(let o=0;o<i.chunk.length;o++)i.chunk[o].maxPoint<=0&&n.set(i.chunk[o],i.chunkPos[o]);let r=new Set;for(let i of e)for(let o=0;o<i.chunk.length;o++){let a=n.get(i.chunk[o]);a!=null&&(t?t.mapPos(a):a)==i.chunkPos[o]&&!t?.touchesRange(a,a+i.chunk[o].length)&&r.add(i.chunk[o])}return r}class Oh{constructor(e,t,n,r=0){this.layer=e,this.skip=t,this.minPoint=n,this.rank=r}get startSide(){return this.value?this.value.startSide:0}get endSide(){return this.value?this.value.endSide:0}goto(e,t=-1e9){return this.chunkIndex=this.rangeIndex=0,this.gotoInner(e,t,!1),this}gotoInner(e,t,n){for(;this.chunkIndex<this.layer.chunk.length;){let r=this.layer.chunk[this.chunkIndex];if(!(this.skip&&this.skip.has(r)||this.layer.chunkEnd(this.chunkIndex)<e||r.maxPoint<this.minPoint))break;this.chunkIndex++,n=!1}if(this.chunkIndex<this.layer.chunk.length){let r=this.layer.chunk[this.chunkIndex].findIndex(e-this.layer.chunkPos[this.chunkIndex],t,!0);(!n||this.rangeIndex<r)&&this.setRangeIndex(r)}this.next()}forward(e,t){(this.to-e||this.endSide-t)<0&&this.gotoInner(e,t,!0)}next(){for(;;)if(this.chunkIndex==this.layer.chunk.length){this.from=this.to=1e9,this.value=null;break}else{let e=this.layer.chunkPos[this.chunkIndex],t=this.layer.chunk[this.chunkIndex],n=e+t.from[this.rangeIndex];if(this.from=n,this.to=e+t.to[this.rangeIndex],this.value=t.value[this.rangeIndex],this.setRangeIndex(this.rangeIndex+1),this.minPoint<0||this.value.point&&this.to-this.from>=this.minPoint)break}}setRangeIndex(e){if(e==this.layer.chunk[this.chunkIndex].value.length){if(this.chunkIndex++,this.skip)for(;this.chunkIndex<this.layer.chunk.length&&this.skip.has(this.layer.chunk[this.chunkIndex]);)this.chunkIndex++;this.rangeIndex=0}else this.rangeIndex=e}nextChunk(){this.chunkIndex++,this.rangeIndex=0,this.next()}compare(e){return this.from-e.from||this.startSide-e.startSide||this.rank-e.rank||this.to-e.to||this.endSide-e.endSide}}class Cs{constructor(e){this.heap=e}static from(e,t=null,n=-1){let r=[];for(let i=0;i<e.length;i++)for(let o=e[i];!o.isEmpty;o=o.nextLayer)o.maxPoint>=n&&r.push(new Oh(o,t,n,i));return r.length==1?r[0]:new Cs(r)}get startSide(){return this.value?this.value.startSide:0}goto(e,t=-1e9){for(let n of this.heap)n.goto(e,t);for(let n=this.heap.length>>1;n>=0;n--)oi(this.heap,n);return this.next(),this}forward(e,t){for(let n of this.heap)n.forward(e,t);for(let n=this.heap.length>>1;n>=0;n--)oi(this.heap,n);(this.to-e||this.value.endSide-t)<0&&this.next()}next(){if(this.heap.length==0)this.from=this.to=1e9,this.value=null,this.rank=-1;else{let e=this.heap[0];this.from=e.from,this.to=e.to,this.value=e.value,this.rank=e.rank,e.value&&e.next(),oi(this.heap,0)}}}function oi(s,e){for(let t=s[e];;){let n=(e<<1)+1;if(n>=s.length)break;let r=s[n];if(n+1<s.length&&r.compare(s[n+1])>=0&&(r=s[n+1],n++),t.compare(r)<0)break;s[n]=t,s[e]=r,e=n}}class os{constructor(e,t,n){this.minPoint=n,this.active=[],this.activeTo=[],this.activeRank=[],this.minActive=-1,this.point=null,this.pointFrom=0,this.pointRank=0,this.to=-1e9,this.endSide=0,this.openStart=-1,this.cursor=Cs.from(e,t,n)}goto(e,t=-1e9){return this.cursor.goto(e,t),this.active.length=this.activeTo.length=this.activeRank.length=0,this.minActive=-1,this.to=e,this.endSide=t,this.openStart=-1,this.next(),this}forward(e,t){for(;this.minActive>-1&&(this.activeTo[this.minActive]-e||this.active[this.minActive].endSide-t)<0;)this.removeActive(this.minActive);this.cursor.forward(e,t)}removeActive(e){Ks(this.active,e),Ks(this.activeTo,e),Ks(this.activeRank,e),this.minActive=hl(this.active,this.activeTo)}addActive(e){let t=0,{value:n,to:r,rank:i}=this.cursor;for(;t<this.activeRank.length&&(i-this.activeRank[t]||r-this.activeTo[t])>0;)t++;Gs(this.active,t,n),Gs(this.activeTo,t,r),Gs(this.activeRank,t,i),e&&Gs(e,t,this.cursor.from),this.minActive=hl(this.active,this.activeTo)}next(){let e=this.to,t=this.point;this.point=null;let n=this.openStart<0?[]:null;for(;;){let r=this.minActive;if(r>-1&&(this.activeTo[r]-this.cursor.from||this.active[r].endSide-this.cursor.startSide)<0){if(this.activeTo[r]>e){this.to=this.activeTo[r],this.endSide=this.active[r].endSide;break}this.removeActive(r),n&&Ks(n,r)}else if(this.cursor.value)if(this.cursor.from>e){this.to=this.cursor.from,this.endSide=this.cursor.startSide;break}else{let i=this.cursor.value;if(!i.point)this.addActive(n),this.cursor.next();else if(t&&this.cursor.to==this.to&&this.cursor.from<this.cursor.to)this.cursor.next();else{this.point=i,this.pointFrom=this.cursor.from,this.pointRank=this.cursor.rank,this.to=this.cursor.to,this.endSide=i.endSide,this.cursor.next(),this.forward(this.to,this.endSide);break}}else{this.to=this.endSide=1e9;break}}if(n){this.openStart=0;for(let r=n.length-1;r>=0&&n[r]<e;r--)this.openStart++}}activeForPoint(e){if(!this.active.length)return this.active;let t=[];for(let n=this.active.length-1;n>=0&&!(this.activeRank[n]<this.pointRank);n--)(this.activeTo[n]>e||this.activeTo[n]==e&&this.active[n].endSide>=this.point.endSide)&&t.push(this.active[n]);return t.reverse()}openEnd(e){let t=0;for(let n=this.activeTo.length-1;n>=0&&this.activeTo[n]>e;n--)t++;return t}}function cl(s,e,t,n,r,i){s.goto(e),t.goto(n);let o=n+r,a=n,l=n-e;for(;;){let c=s.to+l-t.to,h=c||s.endSide-t.endSide,d=h<0?s.to+l:t.to,u=Math.min(d,o);if(s.point||t.point?s.point&&t.point&&(s.point==t.point||s.point.eq(t.point))&&Bi(s.activeForPoint(s.to),t.activeForPoint(t.to))||i.comparePoint(a,u,s.point,t.point):u>a&&!Bi(s.active,t.active)&&i.compareRange(a,u,s.active,t.active),d>o)break;(c||s.openEnd!=t.openEnd)&&i.boundChange&&i.boundChange(d),a=d,h<=0&&s.next(),h>=0&&t.next()}}function Bi(s,e){if(s.length!=e.length)return!1;for(let t=0;t<s.length;t++)if(s[t]!=e[t]&&!s[t].eq(e[t]))return!1;return!0}function Ks(s,e){for(let t=e,n=s.length-1;t<n;t++)s[t]=s[t+1];s.pop()}function Gs(s,e,t){for(let n=s.length-1;n>=e;n--)s[n+1]=s[n];s[e]=t}function hl(s,e){let t=-1,n=1e9;for(let r=0;r<e.length;r++)(e[r]-n||s[r].endSide-s[t].endSide)<0&&(t=r,n=e[r]);return t}function lv(s,e,t,n){for(let r=0,i=0;;){if(i>=e)return r;if(r==s.length)break;i+=s.charCodeAt(r)==9?t-i%t:1,r=At(s,r)}return n===!0?-1:s.length}const Li="ͼ",dl=typeof Symbol>"u"?"__"+Li:Symbol.for(Li),Fi=typeof Symbol>"u"?"__styleSet"+Math.floor(Math.random()*1e8):Symbol("styleSet"),ul=typeof globalThis<"u"?globalThis:typeof window<"u"?window:{};class Xt{constructor(e,t){this.rules=[];let{finish:n}=t||{};function r(o){return/^@/.test(o)?[o]:o.split(/,\s*/)}function i(o,a,l,c){let h=[],d=/^@(\w+)\b/.exec(o[0]),u=d&&d[1]=="keyframes";if(d&&a==null)return l.push(o[0]+";");for(let f in a){let m=a[f];if(/&/.test(f))i(f.split(/,\s*/).map(y=>o.map(b=>y.replace(/&/,b))).reduce((y,b)=>y.concat(b)),m,l);else if(m&&typeof m=="object"){if(!d)throw new RangeError("The value of a property ("+f+") should be a primitive value.");i(r(f),m,h,u)}else m!=null&&h.push(f.replace(/_.*/,"").replace(/[A-Z]/g,y=>"-"+y.toLowerCase())+": "+m+";")}(h.length||u)&&l.push((n&&!d&&!c?o.map(n):o).join(", ")+" {"+h.join(" ")+"}")}for(let o in e)i(r(o),e[o],this.rules)}getRules(){return this.rules.join(`
`)}static newName(){let e=ul[dl]||1;return ul[dl]=e+1,Li+e.toString(36)}static mount(e,t,n){let r=e[Fi],i=n&&n.nonce;r?i&&r.setNonce(i):r=new cv(e,i),r.mount(Array.isArray(t)?t:[t],e)}}let fl=new Map;class cv{constructor(e,t){let n=e.ownerDocument||e,r=n.defaultView;if(!e.head&&e.adoptedStyleSheets&&r.CSSStyleSheet){let i=fl.get(n);if(i)return e[Fi]=i;this.sheet=new r.CSSStyleSheet,fl.set(n,this)}else this.styleTag=n.createElement("style"),t&&this.styleTag.setAttribute("nonce",t);this.modules=[],e[Fi]=this}mount(e,t){let n=this.sheet,r=0,i=0;for(let o=0;o<e.length;o++){let a=e[o],l=this.modules.indexOf(a);if(l<i&&l>-1&&(this.modules.splice(l,1),i--,l=-1),l==-1){if(this.modules.splice(i++,0,a),n)for(let c=0;c<a.rules.length;c++)n.insertRule(a.rules[c],r++)}else{for(;i<l;)r+=this.modules[i++].rules.length;r+=a.rules.length,i++}}if(n)t.adoptedStyleSheets.indexOf(this.sheet)<0&&(t.adoptedStyleSheets=[this.sheet,...t.adoptedStyleSheets]);else{let o="";for(let l=0;l<this.modules.length;l++)o+=this.modules[l].getRules()+`
`;this.styleTag.textContent=o;let a=t.head||t;this.styleTag.parentNode!=a&&a.insertBefore(this.styleTag,a.firstChild)}}setNonce(e){this.styleTag&&this.styleTag.getAttribute("nonce")!=e&&this.styleTag.setAttribute("nonce",e)}}var qn={8:"Backspace",9:"Tab",10:"Enter",12:"NumLock",13:"Enter",16:"Shift",17:"Control",18:"Alt",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",44:"PrintScreen",45:"Insert",46:"Delete",59:";",61:"=",91:"Meta",92:"Meta",106:"*",107:"+",108:",",109:"-",110:".",111:"/",144:"NumLock",145:"ScrollLock",160:"Shift",161:"Shift",162:"Control",163:"Control",164:"Alt",165:"Alt",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},Ui={48:")",49:"!",50:"@",51:"#",52:"$",53:"%",54:"^",55:"&",56:"*",57:"(",59:":",61:"+",173:"_",186:":",187:"+",188:"<",189:"_",190:">",191:"?",192:"~",219:"{",220:"|",221:"}",222:'"'};for(var De=0;De<10;De++)qn[48+De]=qn[96+De]=String(De);for(var De=1;De<=24;De++)qn[De+111]="F"+De;for(var De=65;De<=90;De++)qn[De]=String.fromCharCode(De+32),Ui[De]=String.fromCharCode(De);for(var ai in qn)Ui.hasOwnProperty(ai)||(Ui[ai]=qn[ai]);function Os(s){let e;return s.nodeType==11?e=s.getSelection?s:s.ownerDocument:e=s,e.getSelection()}function Hi(s,e){return e?s==e||s.contains(e.nodeType!=1?e.parentNode:e):!1}function pr(s,e){if(!e.anchorNode)return!1;try{return Hi(s,e.anchorNode)}catch{return!1}}function $s(s){return s.nodeType==3?vn(s,0,s.nodeValue.length).getClientRects():s.nodeType==1?s.getClientRects():[]}function ks(s,e,t,n){return t?pl(s,e,t,n,-1)||pl(s,e,t,n,1):!1}function gn(s){for(var e=0;;e++)if(s=s.previousSibling,!s)return e}function Er(s){return s.nodeType==1&&/^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(s.nodeName)}function pl(s,e,t,n,r){for(;;){if(s==t&&e==n)return!0;if(e==(r<0?0:Et(s))){if(s.nodeName=="DIV")return!1;let i=s.parentNode;if(!i||i.nodeType!=1)return!1;e=gn(s)+(r<0?0:1),s=i}else if(s.nodeType==1){if(s=s.childNodes[e+(r<0?-1:0)],s.nodeType==1&&s.contentEditable=="false")return!1;e=r<0?Et(s):0}else return!1}}function Et(s){return s.nodeType==3?s.nodeValue.length:s.childNodes.length}function Hr(s,e){let t=e?s.left:s.right;return{left:t,right:t,top:s.top,bottom:s.bottom}}function hv(s){let e=s.visualViewport;return e?{left:0,right:e.width,top:0,bottom:e.height}:{left:0,right:s.innerWidth,top:0,bottom:s.innerHeight}}function $h(s,e){let t=e.width/s.offsetWidth,n=e.height/s.offsetHeight;return(t>.995&&t<1.005||!isFinite(t)||Math.abs(e.width-s.offsetWidth)<1)&&(t=1),(n>.995&&n<1.005||!isFinite(n)||Math.abs(e.height-s.offsetHeight)<1)&&(n=1),{scaleX:t,scaleY:n}}function dv(s,e,t,n,r,i,o,a){let l=s.ownerDocument,c=l.defaultView||window;for(let h=s,d=!1;h&&!d;)if(h.nodeType==1){let u,f=h==l.body,m=1,y=1;if(f)u=hv(c);else{if(/^(fixed|sticky)$/.test(getComputedStyle(h).position)&&(d=!0),h.scrollHeight<=h.clientHeight&&h.scrollWidth<=h.clientWidth){h=h.assignedSlot||h.parentNode;continue}let x=h.getBoundingClientRect();({scaleX:m,scaleY:y}=$h(h,x)),u={left:x.left,right:x.left+h.clientWidth*m,top:x.top,bottom:x.top+h.clientHeight*y}}let b=0,g=0;if(r=="nearest")e.top<u.top?(g=-(u.top-e.top+o),t>0&&e.bottom>u.bottom+g&&(g=e.bottom-u.bottom+g+o)):e.bottom>u.bottom&&(g=e.bottom-u.bottom+o,t<0&&e.top-g<u.top&&(g=-(u.top+g-e.top+o)));else{let x=e.bottom-e.top,C=u.bottom-u.top;g=(r=="center"&&x<=C?e.top+x/2-C/2:r=="start"||r=="center"&&t<0?e.top-o:e.bottom-C+o)-u.top}if(n=="nearest"?e.left<u.left?(b=-(u.left-e.left+i),t>0&&e.right>u.right+b&&(b=e.right-u.right+b+i)):e.right>u.right&&(b=e.right-u.right+i,t<0&&e.left<u.left+b&&(b=-(u.left+b-e.left+i))):b=(n=="center"?e.left+(e.right-e.left)/2-(u.right-u.left)/2:n=="start"==a?e.left-i:e.right-(u.right-u.left)+i)-u.left,b||g)if(f)c.scrollBy(b,g);else{let x=0,C=0;if(g){let P=h.scrollTop;h.scrollTop+=g/y,C=(h.scrollTop-P)*y}if(b){let P=h.scrollLeft;h.scrollLeft+=b/m,x=(h.scrollLeft-P)*m}e={left:e.left-x,top:e.top-C,right:e.right-x,bottom:e.bottom-C},x&&Math.abs(x-b)<1&&(n="nearest"),C&&Math.abs(C-g)<1&&(r="nearest")}if(f)break;h=h.assignedSlot||h.parentNode}else if(h.nodeType==11)h=h.host;else break}function uv(s){let e=s.ownerDocument,t,n;for(let r=s.parentNode;r&&!(r==e.body||t&&n);)if(r.nodeType==1)!n&&r.scrollHeight>r.clientHeight&&(n=r),!t&&r.scrollWidth>r.clientWidth&&(t=r),r=r.assignedSlot||r.parentNode;else if(r.nodeType==11)r=r.host;else break;return{x:t,y:n}}class fv{constructor(){this.anchorNode=null,this.anchorOffset=0,this.focusNode=null,this.focusOffset=0}eq(e){return this.anchorNode==e.anchorNode&&this.anchorOffset==e.anchorOffset&&this.focusNode==e.focusNode&&this.focusOffset==e.focusOffset}setRange(e){let{anchorNode:t,focusNode:n}=e;this.set(t,Math.min(e.anchorOffset,t?Et(t):0),n,Math.min(e.focusOffset,n?Et(n):0))}set(e,t,n,r){this.anchorNode=e,this.anchorOffset=t,this.focusNode=n,this.focusOffset=r}}let En=null;function Mh(s){if(s.setActive)return s.setActive();if(En)return s.focus(En);let e=[];for(let t=s;t&&(e.push(t,t.scrollTop,t.scrollLeft),t!=t.ownerDocument);t=t.parentNode);if(s.focus(En==null?{get preventScroll(){return En={preventScroll:!0},!0}}:void 0),!En){En=!1;for(let t=0;t<e.length;){let n=e[t++],r=e[t++],i=e[t++];n.scrollTop!=r&&(n.scrollTop=r),n.scrollLeft!=i&&(n.scrollLeft=i)}}}let ml;function vn(s,e,t=e){let n=ml||(ml=document.createRange());return n.setEnd(s,t),n.setStart(s,e),n}function An(s,e,t,n){let r={key:e,code:e,keyCode:t,which:t,cancelable:!0};n&&({altKey:r.altKey,ctrlKey:r.ctrlKey,shiftKey:r.shiftKey,metaKey:r.metaKey}=n);let i=new KeyboardEvent("keydown",r);i.synthetic=!0,s.dispatchEvent(i);let o=new KeyboardEvent("keyup",r);return o.synthetic=!0,s.dispatchEvent(o),i.defaultPrevented||o.defaultPrevented}function pv(s){for(;s;){if(s&&(s.nodeType==9||s.nodeType==11&&s.host))return s;s=s.assignedSlot||s.parentNode}return null}function Ph(s){for(;s.attributes.length;)s.removeAttributeNode(s.attributes[0])}function mv(s,e){let t=e.focusNode,n=e.focusOffset;if(!t||e.anchorNode!=t||e.anchorOffset!=n)return!1;for(n=Math.min(n,Et(t));;)if(n){if(t.nodeType!=1)return!1;let r=t.childNodes[n-1];r.contentEditable=="false"?n--:(t=r,n=Et(t))}else{if(t==s)return!0;n=gn(t),t=t.parentNode}}function Ah(s){return s.scrollTop>Math.max(1,s.scrollHeight-s.clientHeight-4)}function Th(s,e){for(let t=s,n=e;;){if(t.nodeType==3&&n>0)return{node:t,offset:n};if(t.nodeType==1&&n>0){if(t.contentEditable=="false")return null;t=t.childNodes[n-1],n=Et(t)}else if(t.parentNode&&!Er(t))n=gn(t),t=t.parentNode;else return null}}function zh(s,e){for(let t=s,n=e;;){if(t.nodeType==3&&n<t.nodeValue.length)return{node:t,offset:n};if(t.nodeType==1&&n<t.childNodes.length){if(t.contentEditable=="false")return null;t=t.childNodes[n],n=0}else if(t.parentNode&&!Er(t))n=gn(t)+1,t=t.parentNode;else return null}}class Fe{constructor(e,t,n=!0){this.node=e,this.offset=t,this.precise=n}static before(e,t){return new Fe(e.parentNode,gn(e),t)}static after(e,t){return new Fe(e.parentNode,gn(e)+1,t)}}const aa=[];class be{constructor(){this.parent=null,this.dom=null,this.flags=2}get overrideDOMText(){return null}get posAtStart(){return this.parent?this.parent.posBefore(this):0}get posAtEnd(){return this.posAtStart+this.length}posBefore(e){let t=this.posAtStart;for(let n of this.children){if(n==e)return t;t+=n.length+n.breakAfter}throw new RangeError("Invalid child in posBefore")}posAfter(e){return this.posBefore(e)+e.length}sync(e,t){if(this.flags&2){let n=this.dom,r=null,i;for(let o of this.children){if(o.flags&7){if(!o.dom&&(i=r?r.nextSibling:n.firstChild)){let a=be.get(i);(!a||!a.parent&&a.canReuseDOM(o))&&o.reuseDOM(i)}o.sync(e,t),o.flags&=-8}if(i=r?r.nextSibling:n.firstChild,t&&!t.written&&t.node==n&&i!=o.dom&&(t.written=!0),o.dom.parentNode==n)for(;i&&i!=o.dom;)i=gl(i);else n.insertBefore(o.dom,i);r=o.dom}for(i=r?r.nextSibling:n.firstChild,i&&t&&t.node==n&&(t.written=!0);i;)i=gl(i)}else if(this.flags&1)for(let n of this.children)n.flags&7&&(n.sync(e,t),n.flags&=-8)}reuseDOM(e){}localPosFromDOM(e,t){let n;if(e==this.dom)n=this.dom.childNodes[t];else{let r=Et(e)==0?0:t==0?-1:1;for(;;){let i=e.parentNode;if(i==this.dom)break;r==0&&i.firstChild!=i.lastChild&&(e==i.firstChild?r=-1:r=1),e=i}r<0?n=e:n=e.nextSibling}if(n==this.dom.firstChild)return 0;for(;n&&!be.get(n);)n=n.nextSibling;if(!n)return this.length;for(let r=0,i=0;;r++){let o=this.children[r];if(o.dom==n)return i;i+=o.length+o.breakAfter}}domBoundsAround(e,t,n=0){let r=-1,i=-1,o=-1,a=-1;for(let l=0,c=n,h=n;l<this.children.length;l++){let d=this.children[l],u=c+d.length;if(c<e&&u>t)return d.domBoundsAround(e,t,c);if(u>=e&&r==-1&&(r=l,i=c),c>t&&d.dom.parentNode==this.dom){o=l,a=h;break}h=u,c=u+d.breakAfter}return{from:i,to:a<0?n+this.length:a,startDOM:(r?this.children[r-1].dom.nextSibling:null)||this.dom.firstChild,endDOM:o<this.children.length&&o>=0?this.children[o].dom:null}}markDirty(e=!1){this.flags|=2,this.markParentsDirty(e)}markParentsDirty(e){for(let t=this.parent;t;t=t.parent){if(e&&(t.flags|=2),t.flags&1)return;t.flags|=1,e=!1}}setParent(e){this.parent!=e&&(this.parent=e,this.flags&7&&this.markParentsDirty(!0))}setDOM(e){this.dom!=e&&(this.dom&&(this.dom.cmView=null),this.dom=e,e.cmView=this)}get rootView(){for(let e=this;;){let t=e.parent;if(!t)return e;e=t}}replaceChildren(e,t,n=aa){this.markDirty();for(let r=e;r<t;r++){let i=this.children[r];i.parent==this&&n.indexOf(i)<0&&i.destroy()}n.length<250?this.children.splice(e,t-e,...n):this.children=[].concat(this.children.slice(0,e),n,this.children.slice(t));for(let r=0;r<n.length;r++)n[r].setParent(this)}ignoreMutation(e){return!1}ignoreEvent(e){return!1}childCursor(e=this.length){return new Nh(this.children,e,this.children.length)}childPos(e,t=1){return this.childCursor().findPos(e,t)}toString(){let e=this.constructor.name.replace("View","");return e+(this.children.length?"("+this.children.join()+")":this.length?"["+(e=="Text"?this.text:this.length)+"]":"")+(this.breakAfter?"#":"")}static get(e){return e.cmView}get isEditable(){return!0}get isWidget(){return!1}get isHidden(){return!1}merge(e,t,n,r,i,o){return!1}become(e){return!1}canReuseDOM(e){return e.constructor==this.constructor&&!((this.flags|e.flags)&8)}getSide(){return 0}destroy(){for(let e of this.children)e.parent==this&&e.destroy();this.parent=null}}be.prototype.breakAfter=0;function gl(s){let e=s.nextSibling;return s.parentNode.removeChild(s),e}class Nh{constructor(e,t,n){this.children=e,this.pos=t,this.i=n,this.off=0}findPos(e,t=1){for(;;){if(e>this.pos||e==this.pos&&(t>0||this.i==0||this.children[this.i-1].breakAfter))return this.off=e-this.pos,this;let n=this.children[--this.i];this.pos-=n.length+n.breakAfter}}}function Rh(s,e,t,n,r,i,o,a,l){let{children:c}=s,h=c.length?c[e]:null,d=i.length?i[i.length-1]:null,u=d?d.breakAfter:o;if(!(e==n&&h&&!o&&!u&&i.length<2&&h.merge(t,r,i.length?d:null,t==0,a,l))){if(n<c.length){let f=c[n];f&&(r<f.length||f.breakAfter&&d?.breakAfter)?(e==n&&(f=f.split(r),r=0),!u&&d&&f.merge(0,r,d,!0,0,l)?i[i.length-1]=f:((r||f.children.length&&!f.children[0].length)&&f.merge(0,r,null,!1,0,l),i.push(f))):f?.breakAfter&&(d?d.breakAfter=1:o=1),n++}for(h&&(h.breakAfter=o,t>0&&(!o&&i.length&&h.merge(t,h.length,i[0],!1,a,0)?h.breakAfter=i.shift().breakAfter:(t<h.length||h.children.length&&h.children[h.children.length-1].length==0)&&h.merge(t,h.length,null,!1,a,0),e++));e<n&&i.length;)if(c[n-1].become(i[i.length-1]))n--,i.pop(),l=i.length?0:a;else if(c[e].become(i[0]))e++,i.shift(),a=i.length?0:l;else break;!i.length&&e&&n<c.length&&!c[e-1].breakAfter&&c[n].merge(0,0,c[e-1],!1,a,l)&&e--,(e<n||i.length)&&s.replaceChildren(e,n,i)}}function Dh(s,e,t,n,r,i){let o=s.childCursor(),{i:a,off:l}=o.findPos(t,1),{i:c,off:h}=o.findPos(e,-1),d=e-t;for(let u of n)d+=u.length;s.length+=d,Rh(s,c,h,a,l,n,0,r,i)}let Xe=typeof navigator<"u"?navigator:{userAgent:"",vendor:"",platform:""},Vi=typeof document<"u"?document:{documentElement:{style:{}}};const Wi=/Edge\/(\d+)/.exec(Xe.userAgent),Ih=/MSIE \d/.test(Xe.userAgent),Ki=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Xe.userAgent),Vr=!!(Ih||Ki||Wi),vl=!Vr&&/gecko\/(\d+)/i.test(Xe.userAgent),li=!Vr&&/Chrome\/(\d+)/.exec(Xe.userAgent),bl="webkitFontSmoothing"in Vi.documentElement.style,qh=!Vr&&/Apple Computer/.test(Xe.vendor),yl=qh&&(/Mobile\/\w+/.test(Xe.userAgent)||Xe.maxTouchPoints>2);var H={mac:yl||/Mac/.test(Xe.platform),windows:/Win/.test(Xe.platform),linux:/Linux|X11/.test(Xe.platform),ie:Vr,ie_version:Ih?Vi.documentMode||6:Ki?+Ki[1]:Wi?+Wi[1]:0,gecko:vl,gecko_version:vl?+(/Firefox\/(\d+)/.exec(Xe.userAgent)||[0,0])[1]:0,chrome:!!li,chrome_version:li?+li[1]:0,ios:yl,android:/Android\b/.test(Xe.userAgent),webkit:bl,safari:qh,webkit_version:bl?+(/\bAppleWebKit\/(\d+)/.exec(Xe.userAgent)||[0,0])[1]:0,tabSize:Vi.documentElement.style.tabSize!=null?"tab-size":"-moz-tab-size"};const gv=256;class ut extends be{constructor(e){super(),this.text=e}get length(){return this.text.length}createDOM(e){this.setDOM(e||document.createTextNode(this.text))}sync(e,t){this.dom||this.createDOM(),this.dom.nodeValue!=this.text&&(t&&t.node==this.dom&&(t.written=!0),this.dom.nodeValue=this.text)}reuseDOM(e){e.nodeType==3&&this.createDOM(e)}merge(e,t,n){return this.flags&8||n&&(!(n instanceof ut)||this.length-(t-e)+n.length>gv||n.flags&8)?!1:(this.text=this.text.slice(0,e)+(n?n.text:"")+this.text.slice(t),this.markDirty(),!0)}split(e){let t=new ut(this.text.slice(e));return this.text=this.text.slice(0,e),this.markDirty(),t.flags|=this.flags&8,t}localPosFromDOM(e,t){return e==this.dom?t:t?this.text.length:0}domAtPos(e){return new Fe(this.dom,e)}domBoundsAround(e,t,n){return{from:n,to:n+this.length,startDOM:this.dom,endDOM:this.dom.nextSibling}}coordsAt(e,t){return vv(this.dom,e,t)}}class qt extends be{constructor(e,t=[],n=0){super(),this.mark=e,this.children=t,this.length=n;for(let r of t)r.setParent(this)}setAttrs(e){if(Ph(e),this.mark.class&&(e.className=this.mark.class),this.mark.attrs)for(let t in this.mark.attrs)e.setAttribute(t,this.mark.attrs[t]);return e}canReuseDOM(e){return super.canReuseDOM(e)&&!((this.flags|e.flags)&8)}reuseDOM(e){e.nodeName==this.mark.tagName.toUpperCase()&&(this.setDOM(e),this.flags|=6)}sync(e,t){this.dom?this.flags&4&&this.setAttrs(this.dom):this.setDOM(this.setAttrs(document.createElement(this.mark.tagName))),super.sync(e,t)}merge(e,t,n,r,i,o){return n&&(!(n instanceof qt&&n.mark.eq(this.mark))||e&&i<=0||t<this.length&&o<=0)?!1:(Dh(this,e,t,n?n.children.slice():[],i-1,o-1),this.markDirty(),!0)}split(e){let t=[],n=0,r=-1,i=0;for(let a of this.children){let l=n+a.length;l>e&&t.push(n<e?a.split(e-n):a),r<0&&n>=e&&(r=i),n=l,i++}let o=this.length-e;return this.length=e,r>-1&&(this.children.length=r,this.markDirty()),new qt(this.mark,t,o)}domAtPos(e){return Bh(this,e)}coordsAt(e,t){return Fh(this,e,t)}}function vv(s,e,t){let n=s.nodeValue.length;e>n&&(e=n);let r=e,i=e,o=0;e==0&&t<0||e==n&&t>=0?H.chrome||H.gecko||(e?(r--,o=1):i<n&&(i++,o=-1)):t<0?r--:i<n&&i++;let a=vn(s,r,i).getClientRects();if(!a.length)return null;let l=a[(o?o<0:t>=0)?0:a.length-1];return H.safari&&!o&&l.width==0&&(l=Array.prototype.find.call(a,c=>c.width)||l),o?Hr(l,o<0):l||null}class un extends be{static create(e,t,n){return new un(e,t,n)}constructor(e,t,n){super(),this.widget=e,this.length=t,this.side=n,this.prevWidget=null}split(e){let t=un.create(this.widget,this.length-e,this.side);return this.length-=e,t}sync(e){(!this.dom||!this.widget.updateDOM(this.dom,e))&&(this.dom&&this.prevWidget&&this.prevWidget.destroy(this.dom),this.prevWidget=null,this.setDOM(this.widget.toDOM(e)),this.widget.editable||(this.dom.contentEditable="false"))}getSide(){return this.side}merge(e,t,n,r,i,o){return n&&(!(n instanceof un)||!this.widget.compare(n.widget)||e>0&&i<=0||t<this.length&&o<=0)?!1:(this.length=e+(n?n.length:0)+(this.length-t),!0)}become(e){return e instanceof un&&e.side==this.side&&this.widget.constructor==e.widget.constructor?(this.widget.compare(e.widget)||this.markDirty(!0),this.dom&&!this.prevWidget&&(this.prevWidget=this.widget),this.widget=e.widget,this.length=e.length,!0):!1}ignoreMutation(){return!0}ignoreEvent(e){return this.widget.ignoreEvent(e)}get overrideDOMText(){if(this.length==0)return fe.empty;let e=this;for(;e.parent;)e=e.parent;let{view:t}=e,n=t&&t.state.doc,r=this.posAtStart;return n?n.slice(r,r+this.length):fe.empty}domAtPos(e){return(this.length?e==0:this.side>0)?Fe.before(this.dom):Fe.after(this.dom,e==this.length)}domBoundsAround(){return null}coordsAt(e,t){let n=this.widget.coordsAt(this.dom,e,t);if(n)return n;let r=this.dom.getClientRects(),i=null;if(!r.length)return null;let o=this.side?this.side<0:e>0;for(let a=o?r.length-1:0;i=r[a],!(e>0?a==0:a==r.length-1||i.top<i.bottom);a+=o?-1:1);return Hr(i,!o)}get isEditable(){return!1}get isWidget(){return!0}get isHidden(){return this.widget.isHidden}destroy(){super.destroy(),this.dom&&this.widget.destroy(this.dom)}}class Bn extends be{constructor(e){super(),this.side=e}get length(){return 0}merge(){return!1}become(e){return e instanceof Bn&&e.side==this.side}split(){return new Bn(this.side)}sync(){if(!this.dom){let e=document.createElement("img");e.className="cm-widgetBuffer",e.setAttribute("aria-hidden","true"),this.setDOM(e)}}getSide(){return this.side}domAtPos(e){return this.side>0?Fe.before(this.dom):Fe.after(this.dom)}localPosFromDOM(){return 0}domBoundsAround(){return null}coordsAt(e){return this.dom.getBoundingClientRect()}get overrideDOMText(){return fe.empty}get isHidden(){return!0}}ut.prototype.children=un.prototype.children=Bn.prototype.children=aa;function Bh(s,e){let t=s.dom,{children:n}=s,r=0;for(let i=0;r<n.length;r++){let o=n[r],a=i+o.length;if(!(a==i&&o.getSide()<=0)){if(e>i&&e<a&&o.dom.parentNode==t)return o.domAtPos(e-i);if(e<=i)break;i=a}}for(let i=r;i>0;i--){let o=n[i-1];if(o.dom.parentNode==t)return o.domAtPos(o.length)}for(let i=r;i<n.length;i++){let o=n[i];if(o.dom.parentNode==t)return o.domAtPos(0)}return new Fe(t,0)}function Lh(s,e,t){let n,{children:r}=s;t>0&&e instanceof qt&&r.length&&(n=r[r.length-1])instanceof qt&&n.mark.eq(e.mark)?Lh(n,e.children[0],t-1):(r.push(e),e.setParent(s)),s.length+=e.length}function Fh(s,e,t){let n=null,r=-1,i=null,o=-1;function a(c,h){for(let d=0,u=0;d<c.children.length&&u<=h;d++){let f=c.children[d],m=u+f.length;m>=h&&(f.children.length?a(f,h-u):(!i||i.isHidden&&t>0)&&(m>h||u==m&&f.getSide()>0)?(i=f,o=h-u):(u<h||u==m&&f.getSide()<0&&!f.isHidden)&&(n=f,r=h-u)),u=m}}a(s,e);let l=(t<0?n:i)||n||i;return l?l.coordsAt(Math.max(0,l==n?r:o),t):bv(s)}function bv(s){let e=s.dom.lastChild;if(!e)return s.dom.getBoundingClientRect();let t=$s(e);return t[t.length-1]||null}function Gi(s,e){for(let t in s)t=="class"&&e.class?e.class+=" "+s.class:t=="style"&&e.style?e.style+=";"+s.style:e[t]=s[t];return e}const wl=Object.create(null);function Cr(s,e,t){if(s==e)return!0;s||(s=wl),e||(e=wl);let n=Object.keys(s),r=Object.keys(e);if(n.length-(t&&n.indexOf(t)>-1?1:0)!=r.length-(t&&r.indexOf(t)>-1?1:0))return!1;for(let i of n)if(i!=t&&(r.indexOf(i)==-1||s[i]!==e[i]))return!1;return!0}function Yi(s,e,t){let n=!1;if(e)for(let r in e)t&&r in t||(n=!0,r=="style"?s.style.cssText="":s.removeAttribute(r));if(t)for(let r in t)e&&e[r]==t[r]||(n=!0,r=="style"?s.style.cssText=t[r]:s.setAttribute(r,t[r]));return n}function yv(s){let e=Object.create(null);for(let t=0;t<s.attributes.length;t++){let n=s.attributes[t];e[n.name]=n.value}return e}class la{eq(e){return!1}updateDOM(e,t){return!1}compare(e){return this==e||this.constructor==e.constructor&&this.eq(e)}get estimatedHeight(){return-1}get lineBreaks(){return 0}ignoreEvent(e){return!0}coordsAt(e,t,n){return null}get isHidden(){return!1}get editable(){return!1}destroy(e){}}var _t=function(s){return s[s.Text=0]="Text",s[s.WidgetBefore=1]="WidgetBefore",s[s.WidgetAfter=2]="WidgetAfter",s[s.WidgetRange=3]="WidgetRange",s}(_t||(_t={}));class Me extends Dn{constructor(e,t,n,r){super(),this.startSide=e,this.endSide=t,this.widget=n,this.spec=r}get heightRelevant(){return!1}static mark(e){return new Rs(e)}static widget(e){let t=Math.max(-1e4,Math.min(1e4,e.side||0)),n=!!e.block;return t+=n&&!e.inlineOrder?t>0?3e8:-4e8:t>0?1e8:-1e8,new Qt(e,t,t,n,e.widget||null,!1)}static replace(e){let t=!!e.block,n,r;if(e.isBlockGap)n=-5e8,r=4e8;else{let{start:i,end:o}=Uh(e,t);n=(i?t?-3e8:-1:5e8)-1,r=(o?t?2e8:1:-6e8)+1}return new Qt(e,n,r,t,e.widget||null,!0)}static line(e){return new Ds(e)}static set(e,t=!1){return je.of(e,t)}hasHeight(){return this.widget?this.widget.estimatedHeight>-1:!1}}Me.none=je.empty;class Rs extends Me{constructor(e){let{start:t,end:n}=Uh(e);super(t?-1:5e8,n?1:-6e8,null,e),this.tagName=e.tagName||"span",this.class=e.class||"",this.attrs=e.attributes||null}eq(e){var t,n;return this==e||e instanceof Rs&&this.tagName==e.tagName&&(this.class||((t=this.attrs)===null||t===void 0?void 0:t.class))==(e.class||((n=e.attrs)===null||n===void 0?void 0:n.class))&&Cr(this.attrs,e.attrs,"class")}range(e,t=e){if(e>=t)throw new RangeError("Mark decorations may not be empty");return super.range(e,t)}}Rs.prototype.point=!1;class Ds extends Me{constructor(e){super(-2e8,-2e8,null,e)}eq(e){return e instanceof Ds&&this.spec.class==e.spec.class&&Cr(this.spec.attributes,e.spec.attributes)}range(e,t=e){if(t!=e)throw new RangeError("Line decoration ranges must be zero-length");return super.range(e,t)}}Ds.prototype.mapMode=et.TrackBefore;Ds.prototype.point=!0;class Qt extends Me{constructor(e,t,n,r,i,o){super(t,n,i,e),this.block=r,this.isReplace=o,this.mapMode=r?t<=0?et.TrackBefore:et.TrackAfter:et.TrackDel}get type(){return this.startSide!=this.endSide?_t.WidgetRange:this.startSide<=0?_t.WidgetBefore:_t.WidgetAfter}get heightRelevant(){return this.block||!!this.widget&&(this.widget.estimatedHeight>=5||this.widget.lineBreaks>0)}eq(e){return e instanceof Qt&&wv(this.widget,e.widget)&&this.block==e.block&&this.startSide==e.startSide&&this.endSide==e.endSide}range(e,t=e){if(this.isReplace&&(e>t||e==t&&this.startSide>0&&this.endSide<=0))throw new RangeError("Invalid range for replacement decoration");if(!this.isReplace&&t!=e)throw new RangeError("Widget decorations can only have zero-length ranges");return super.range(e,t)}}Qt.prototype.point=!0;function Uh(s,e=!1){let{inclusiveStart:t,inclusiveEnd:n}=s;return t==null&&(t=s.inclusive),n==null&&(n=s.inclusive),{start:t??e,end:n??e}}function wv(s,e){return s==e||!!(s&&e&&s.compare(e))}function mr(s,e,t,n=0){let r=t.length-1;r>=0&&t[r]+n>=s?t[r]=Math.max(t[r],e):t.push(s,e)}class Ee extends be{constructor(){super(...arguments),this.children=[],this.length=0,this.prevAttrs=void 0,this.attrs=null,this.breakAfter=0}merge(e,t,n,r,i,o){if(n){if(!(n instanceof Ee))return!1;this.dom||n.transferDOM(this)}return r&&this.setDeco(n?n.attrs:null),Dh(this,e,t,n?n.children.slice():[],i,o),!0}split(e){let t=new Ee;if(t.breakAfter=this.breakAfter,this.length==0)return t;let{i:n,off:r}=this.childPos(e);r&&(t.append(this.children[n].split(r),0),this.children[n].merge(r,this.children[n].length,null,!1,0,0),n++);for(let i=n;i<this.children.length;i++)t.append(this.children[i],0);for(;n>0&&this.children[n-1].length==0;)this.children[--n].destroy();return this.children.length=n,this.markDirty(),this.length=e,t}transferDOM(e){this.dom&&(this.markDirty(),e.setDOM(this.dom),e.prevAttrs=this.prevAttrs===void 0?this.attrs:this.prevAttrs,this.prevAttrs=void 0,this.dom=null)}setDeco(e){Cr(this.attrs,e)||(this.dom&&(this.prevAttrs=this.attrs,this.markDirty()),this.attrs=e)}append(e,t){Lh(this,e,t)}addLineDeco(e){let t=e.spec.attributes,n=e.spec.class;t&&(this.attrs=Gi(t,this.attrs||{})),n&&(this.attrs=Gi({class:n},this.attrs||{}))}domAtPos(e){return Bh(this,e)}reuseDOM(e){e.nodeName=="DIV"&&(this.setDOM(e),this.flags|=6)}sync(e,t){var n;this.dom?this.flags&4&&(Ph(this.dom),this.dom.className="cm-line",this.prevAttrs=this.attrs?null:void 0):(this.setDOM(document.createElement("div")),this.dom.className="cm-line",this.prevAttrs=this.attrs?null:void 0),this.prevAttrs!==void 0&&(Yi(this.dom,this.prevAttrs,this.attrs),this.dom.classList.add("cm-line"),this.prevAttrs=void 0),super.sync(e,t);let r=this.dom.lastChild;for(;r&&be.get(r)instanceof qt;)r=r.lastChild;if(!r||!this.length||r.nodeName!="BR"&&((n=be.get(r))===null||n===void 0?void 0:n.isEditable)==!1&&(!H.ios||!this.children.some(i=>i instanceof ut))){let i=document.createElement("BR");i.cmIgnore=!0,this.dom.appendChild(i)}}measureTextSize(){if(this.children.length==0||this.length>20)return null;let e=0,t;for(let n of this.children){if(!(n instanceof ut)||/[^ -~]/.test(n.text))return null;let r=$s(n.dom);if(r.length!=1)return null;e+=r[0].width,t=r[0].height}return e?{lineHeight:this.dom.getBoundingClientRect().height,charWidth:e/this.length,textHeight:t}:null}coordsAt(e,t){let n=Fh(this,e,t);if(!this.children.length&&n&&this.parent){let{heightOracle:r}=this.parent.view.viewState,i=n.bottom-n.top;if(Math.abs(i-r.lineHeight)<2&&r.textHeight<i){let o=(i-r.textHeight)/2;return{top:n.top+o,bottom:n.bottom-o,left:n.left,right:n.left}}}return n}become(e){return e instanceof Ee&&this.children.length==0&&e.children.length==0&&Cr(this.attrs,e.attrs)&&this.breakAfter==e.breakAfter}covers(){return!0}static find(e,t){for(let n=0,r=0;n<e.children.length;n++){let i=e.children[n],o=r+i.length;if(o>=t){if(i instanceof Ee)return i;if(o>t)break}r=o+i.breakAfter}return null}}class Dt extends be{constructor(e,t,n){super(),this.widget=e,this.length=t,this.deco=n,this.breakAfter=0,this.prevWidget=null}merge(e,t,n,r,i,o){return n&&(!(n instanceof Dt)||!this.widget.compare(n.widget)||e>0&&i<=0||t<this.length&&o<=0)?!1:(this.length=e+(n?n.length:0)+(this.length-t),!0)}domAtPos(e){return e==0?Fe.before(this.dom):Fe.after(this.dom,e==this.length)}split(e){let t=this.length-e;this.length=e;let n=new Dt(this.widget,t,this.deco);return n.breakAfter=this.breakAfter,n}get children(){return aa}sync(e){(!this.dom||!this.widget.updateDOM(this.dom,e))&&(this.dom&&this.prevWidget&&this.prevWidget.destroy(this.dom),this.prevWidget=null,this.setDOM(this.widget.toDOM(e)),this.widget.editable||(this.dom.contentEditable="false"))}get overrideDOMText(){return this.parent?this.parent.view.state.doc.slice(this.posAtStart,this.posAtEnd):fe.empty}domBoundsAround(){return null}become(e){return e instanceof Dt&&e.widget.constructor==this.widget.constructor?(e.widget.compare(this.widget)||this.markDirty(!0),this.dom&&!this.prevWidget&&(this.prevWidget=this.widget),this.widget=e.widget,this.length=e.length,this.deco=e.deco,this.breakAfter=e.breakAfter,!0):!1}ignoreMutation(){return!0}ignoreEvent(e){return this.widget.ignoreEvent(e)}get isEditable(){return!1}get isWidget(){return!0}coordsAt(e,t){let n=this.widget.coordsAt(this.dom,e,t);return n||(this.widget instanceof Xi?null:Hr(this.dom.getBoundingClientRect(),this.length?e==0:t<=0))}destroy(){super.destroy(),this.dom&&this.widget.destroy(this.dom)}covers(e){let{startSide:t,endSide:n}=this.deco;return t==n?!1:e<0?t<0:n>0}}class Xi extends la{constructor(e){super(),this.height=e}toDOM(){let e=document.createElement("div");return e.className="cm-gap",this.updateDOM(e),e}eq(e){return e.height==this.height}updateDOM(e){return e.style.height=this.height+"px",!0}get editable(){return!0}get estimatedHeight(){return this.height}ignoreEvent(){return!1}}class Ss{constructor(e,t,n,r){this.doc=e,this.pos=t,this.end=n,this.disallowBlockEffectsFor=r,this.content=[],this.curLine=null,this.breakAtStart=0,this.pendingBuffer=0,this.bufferMarks=[],this.atCursorPos=!0,this.openStart=-1,this.openEnd=-1,this.text="",this.textOff=0,this.cursor=e.iter(),this.skip=t}posCovered(){if(this.content.length==0)return!this.breakAtStart&&this.doc.lineAt(this.pos).from!=this.pos;let e=this.content[this.content.length-1];return!(e.breakAfter||e instanceof Dt&&e.deco.endSide<0)}getLine(){return this.curLine||(this.content.push(this.curLine=new Ee),this.atCursorPos=!0),this.curLine}flushBuffer(e=this.bufferMarks){this.pendingBuffer&&(this.curLine.append(Ys(new Bn(-1),e),e.length),this.pendingBuffer=0)}addBlockWidget(e){this.flushBuffer(),this.curLine=null,this.content.push(e)}finish(e){this.pendingBuffer&&e<=this.bufferMarks.length?this.flushBuffer():this.pendingBuffer=0,!this.posCovered()&&!(e&&this.content.length&&this.content[this.content.length-1]instanceof Dt)&&this.getLine()}buildText(e,t,n){for(;e>0;){if(this.textOff==this.text.length){let{value:i,lineBreak:o,done:a}=this.cursor.next(this.skip);if(this.skip=0,a)throw new Error("Ran out of text content when drawing inline views");if(o){this.posCovered()||this.getLine(),this.content.length?this.content[this.content.length-1].breakAfter=1:this.breakAtStart=1,this.flushBuffer(),this.curLine=null,this.atCursorPos=!0,e--;continue}else this.text=i,this.textOff=0}let r=Math.min(this.text.length-this.textOff,e,512);this.flushBuffer(t.slice(t.length-n)),this.getLine().append(Ys(new ut(this.text.slice(this.textOff,this.textOff+r)),t),n),this.atCursorPos=!0,this.textOff+=r,e-=r,n=0}}span(e,t,n,r){this.buildText(t-e,n,r),this.pos=t,this.openStart<0&&(this.openStart=r)}point(e,t,n,r,i,o){if(this.disallowBlockEffectsFor[o]&&n instanceof Qt){if(n.block)throw new RangeError("Block decorations may not be specified via plugins");if(t>this.doc.lineAt(this.pos).to)throw new RangeError("Decorations that replace line breaks may not be specified via plugins")}let a=t-e;if(n instanceof Qt)if(n.block)n.startSide>0&&!this.posCovered()&&this.getLine(),this.addBlockWidget(new Dt(n.widget||Ln.block,a,n));else{let l=un.create(n.widget||Ln.inline,a,a?0:n.startSide),c=this.atCursorPos&&!l.isEditable&&i<=r.length&&(e<t||n.startSide>0),h=!l.isEditable&&(e<t||i>r.length||n.startSide<=0),d=this.getLine();this.pendingBuffer==2&&!c&&!l.isEditable&&(this.pendingBuffer=0),this.flushBuffer(r),c&&(d.append(Ys(new Bn(1),r),i),i=r.length+Math.max(0,i-r.length)),d.append(Ys(l,r),i),this.atCursorPos=h,this.pendingBuffer=h?e<t||i>r.length?1:2:0,this.pendingBuffer&&(this.bufferMarks=r.slice())}else this.doc.lineAt(this.pos).from==this.pos&&this.getLine().addLineDeco(n);a&&(this.textOff+a<=this.text.length?this.textOff+=a:(this.skip+=a-(this.text.length-this.textOff),this.text="",this.textOff=0),this.pos=t),this.openStart<0&&(this.openStart=i)}static build(e,t,n,r,i){let o=new Ss(e,t,n,i);return o.openEnd=je.spans(r,t,n,o),o.openStart<0&&(o.openStart=o.openEnd),o.finish(o.openEnd),o}}function Ys(s,e){for(let t of e)s=new qt(t,[s],s.length);return s}class Ln extends la{constructor(e){super(),this.tag=e}eq(e){return e.tag==this.tag}toDOM(){return document.createElement(this.tag)}updateDOM(e){return e.nodeName.toLowerCase()==this.tag}get isHidden(){return!0}}Ln.inline=new Ln("span");Ln.block=new Ln("div");var qe=function(s){return s[s.LTR=0]="LTR",s[s.RTL=1]="RTL",s}(qe||(qe={}));const bn=qe.LTR,ca=qe.RTL;function Hh(s){let e=[];for(let t=0;t<s.length;t++)e.push(1<<+s[t]);return e}const jv=Hh("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"),xv=Hh("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"),Qi=Object.create(null),pt=[];for(let s of["()","[]","{}"]){let e=s.charCodeAt(0),t=s.charCodeAt(1);Qi[e]=t,Qi[t]=-e}function Vh(s){return s<=247?jv[s]:1424<=s&&s<=1524?2:1536<=s&&s<=1785?xv[s-1536]:1774<=s&&s<=2220?4:8192<=s&&s<=8204?256:64336<=s&&s<=65023?4:1}const kv=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;class Wt{get dir(){return this.level%2?ca:bn}constructor(e,t,n){this.from=e,this.to=t,this.level=n}side(e,t){return this.dir==t==e?this.to:this.from}forward(e,t){return e==(this.dir==t)}static find(e,t,n,r){let i=-1;for(let o=0;o<e.length;o++){let a=e[o];if(a.from<=t&&a.to>=t){if(a.level==n)return o;(i<0||(r!=0?r<0?a.from<t:a.to>t:e[i].level>a.level))&&(i=o)}}if(i<0)throw new RangeError("Index out of range");return i}}function Wh(s,e){if(s.length!=e.length)return!1;for(let t=0;t<s.length;t++){let n=s[t],r=e[t];if(n.from!=r.from||n.to!=r.to||n.direction!=r.direction||!Wh(n.inner,r.inner))return!1}return!0}const ve=[];function Sv(s,e,t,n,r){for(let i=0;i<=n.length;i++){let o=i?n[i-1].to:e,a=i<n.length?n[i].from:t,l=i?256:r;for(let c=o,h=l,d=l;c<a;c++){let u=Vh(s.charCodeAt(c));u==512?u=h:u==8&&d==4&&(u=16),ve[c]=u==4?2:u,u&7&&(d=u),h=u}for(let c=o,h=l,d=l;c<a;c++){let u=ve[c];if(u==128)c<a-1&&h==ve[c+1]&&h&24?u=ve[c]=h:ve[c]=256;else if(u==64){let f=c+1;for(;f<a&&ve[f]==64;)f++;let m=c&&h==8||f<t&&ve[f]==8?d==1?1:8:256;for(let y=c;y<f;y++)ve[y]=m;c=f-1}else u==8&&d==1&&(ve[c]=1);h=u,u&7&&(d=u)}}}function _v(s,e,t,n,r){let i=r==1?2:1;for(let o=0,a=0,l=0;o<=n.length;o++){let c=o?n[o-1].to:e,h=o<n.length?n[o].from:t;for(let d=c,u,f,m;d<h;d++)if(f=Qi[u=s.charCodeAt(d)])if(f<0){for(let y=a-3;y>=0;y-=3)if(pt[y+1]==-f){let b=pt[y+2],g=b&2?r:b&4?b&1?i:r:0;g&&(ve[d]=ve[pt[y]]=g),a=y;break}}else{if(pt.length==189)break;pt[a++]=d,pt[a++]=u,pt[a++]=l}else if((m=ve[d])==2||m==1){let y=m==r;l=y?0:1;for(let b=a-3;b>=0;b-=3){let g=pt[b+2];if(g&2)break;if(y)pt[b+2]|=2;else{if(g&4)break;pt[b+2]|=4}}}}}function Ev(s,e,t,n){for(let r=0,i=n;r<=t.length;r++){let o=r?t[r-1].to:s,a=r<t.length?t[r].from:e;for(let l=o;l<a;){let c=ve[l];if(c==256){let h=l+1;for(;;)if(h==a){if(r==t.length)break;h=t[r++].to,a=r<t.length?t[r].from:e}else if(ve[h]==256)h++;else break;let d=i==1,u=(h<e?ve[h]:n)==1,f=d==u?d?1:2:n;for(let m=h,y=r,b=y?t[y-1].to:s;m>l;)m==b&&(m=t[--y].from,b=y?t[y-1].to:s),ve[--m]=f;l=h}else i=c,l++}}}function Ji(s,e,t,n,r,i,o){let a=n%2?2:1;if(n%2==r%2)for(let l=e,c=0;l<t;){let h=!0,d=!1;if(c==i.length||l<i[c].from){let y=ve[l];y!=a&&(h=!1,d=y==16)}let u=!h&&a==1?[]:null,f=h?n:n+1,m=l;e:for(;;)if(c<i.length&&m==i[c].from){if(d)break e;let y=i[c];if(!h)for(let b=y.to,g=c+1;;){if(b==t)break e;if(g<i.length&&i[g].from==b)b=i[g++].to;else{if(ve[b]==a)break e;break}}if(c++,u)u.push(y);else{y.from>l&&o.push(new Wt(l,y.from,f));let b=y.direction==bn!=!(f%2);Zi(s,b?n+1:n,r,y.inner,y.from,y.to,o),l=y.to}m=y.to}else{if(m==t||(h?ve[m]!=a:ve[m]==a))break;m++}u?Ji(s,l,m,n+1,r,u,o):l<m&&o.push(new Wt(l,m,f)),l=m}else for(let l=t,c=i.length;l>e;){let h=!0,d=!1;if(!c||l>i[c-1].to){let y=ve[l-1];y!=a&&(h=!1,d=y==16)}let u=!h&&a==1?[]:null,f=h?n:n+1,m=l;e:for(;;)if(c&&m==i[c-1].to){if(d)break e;let y=i[--c];if(!h)for(let b=y.from,g=c;;){if(b==e)break e;if(g&&i[g-1].to==b)b=i[--g].from;else{if(ve[b-1]==a)break e;break}}if(u)u.push(y);else{y.to<l&&o.push(new Wt(y.to,l,f));let b=y.direction==bn!=!(f%2);Zi(s,b?n+1:n,r,y.inner,y.from,y.to,o),l=y.from}m=y.from}else{if(m==e||(h?ve[m-1]!=a:ve[m-1]==a))break;m--}u?Ji(s,m,l,n+1,r,u,o):m<l&&o.push(new Wt(m,l,f)),l=m}}function Zi(s,e,t,n,r,i,o){let a=e%2?2:1;Sv(s,r,i,n,a),_v(s,r,i,n,a),Ev(r,i,n,a),Ji(s,r,i,e,t,n,o)}function Cv(s,e,t){if(!s)return[new Wt(0,0,e==ca?1:0)];if(e==bn&&!t.length&&!kv.test(s))return Kh(s.length);if(t.length)for(;s.length>ve.length;)ve[ve.length]=256;let n=[],r=e==bn?0:1;return Zi(s,r,r,t,0,s.length,n),n}function Kh(s){return[new Wt(0,s,0)]}let Gh="";function Ov(s,e,t,n,r){var i;let o=n.head-s.from,a=Wt.find(e,o,(i=n.bidiLevel)!==null&&i!==void 0?i:-1,n.assoc),l=e[a],c=l.side(r,t);if(o==c){let u=a+=r?1:-1;if(u<0||u>=e.length)return null;l=e[a=u],o=l.side(!r,t),c=l.side(r,t)}let h=At(s.text,o,l.forward(r,t));(h<l.from||h>l.to)&&(h=c),Gh=s.text.slice(Math.min(o,h),Math.max(o,h));let d=a==(r?e.length-1:0)?null:e[a+(r?1:-1)];return d&&h==c&&d.level+(r?0:1)<l.level?K.cursor(d.side(!r,t)+s.from,d.forward(r,t)?1:-1,d.level):K.cursor(h+s.from,l.forward(r,t)?-1:1,l.level)}function $v(s,e,t){for(let n=e;n<t;n++){let r=Vh(s.charCodeAt(n));if(r==1)return bn;if(r==2||r==4)return ca}return bn}const Yh=ee.define(),Xh=ee.define(),Qh=ee.define(),Jh=ee.define(),eo=ee.define(),Zh=ee.define(),ed=ee.define(),ha=ee.define(),da=ee.define(),td=ee.define({combine:s=>s.some(e=>e)}),Mv=ee.define({combine:s=>s.some(e=>e)}),nd=ee.define();class Tn{constructor(e,t="nearest",n="nearest",r=5,i=5,o=!1){this.range=e,this.y=t,this.x=n,this.yMargin=r,this.xMargin=i,this.isSnapshot=o}map(e){return e.empty?this:new Tn(this.range.map(e),this.y,this.x,this.yMargin,this.xMargin,this.isSnapshot)}clip(e){return this.range.to<=e.doc.length?this:new Tn(K.cursor(e.doc.length),this.y,this.x,this.yMargin,this.xMargin,this.isSnapshot)}}const Xs=$e.define({map:(s,e)=>s.map(e)}),sd=$e.define();function kt(s,e,t){let n=s.facet(Jh);n.length?n[0](e):window.onerror?window.onerror(String(e),t,void 0,void 0,e):t?console.error(t+":",e):console.error(e)}const Pt=ee.define({combine:s=>s.length?s[0]:!0});let Pv=0;const ds=ee.define();class Jt{constructor(e,t,n,r,i){this.id=e,this.create=t,this.domEventHandlers=n,this.domEventObservers=r,this.extension=i(this)}static define(e,t){const{eventHandlers:n,eventObservers:r,provide:i,decorations:o}=t||{};return new Jt(Pv++,e,n,r,a=>{let l=[ds.of(a)];return o&&l.push(Ms.of(c=>{let h=c.plugin(a);return h?o(h):Me.none})),i&&l.push(i(a)),l})}static fromClass(e,t){return Jt.define(n=>new e(n),t)}}class ci{constructor(e){this.spec=e,this.mustUpdate=null,this.value=null}update(e){if(this.value){if(this.mustUpdate){let t=this.mustUpdate;if(this.mustUpdate=null,this.value.update)try{this.value.update(t)}catch(n){if(kt(t.state,n,"CodeMirror plugin crashed"),this.value.destroy)try{this.value.destroy()}catch{}this.deactivate()}}}else if(this.spec)try{this.value=this.spec.create(e)}catch(t){kt(e.state,t,"CodeMirror plugin crashed"),this.deactivate()}return this}destroy(e){var t;if(!((t=this.value)===null||t===void 0)&&t.destroy)try{this.value.destroy()}catch(n){kt(e.state,n,"CodeMirror plugin crashed")}}deactivate(){this.spec=this.value=null}}const rd=ee.define(),ua=ee.define(),Ms=ee.define(),id=ee.define(),fa=ee.define(),od=ee.define();function jl(s,e){let t=s.state.facet(od);if(!t.length)return t;let n=t.map(i=>i instanceof Function?i(s):i),r=[];return je.spans(n,e.from,e.to,{point(){},span(i,o,a,l){let c=i-e.from,h=o-e.from,d=r;for(let u=a.length-1;u>=0;u--,l--){let f=a[u].spec.bidiIsolate,m;if(f==null&&(f=$v(e.text,c,h)),l>0&&d.length&&(m=d[d.length-1]).to==c&&m.direction==f)m.to=h,d=m.inner;else{let y={from:c,to:h,direction:f,inner:[]};d.push(y),d=y.inner}}}}),r}const ad=ee.define();function ld(s){let e=0,t=0,n=0,r=0;for(let i of s.state.facet(ad)){let o=i(s);o&&(o.left!=null&&(e=Math.max(e,o.left)),o.right!=null&&(t=Math.max(t,o.right)),o.top!=null&&(n=Math.max(n,o.top)),o.bottom!=null&&(r=Math.max(r,o.bottom)))}return{left:e,right:t,top:n,bottom:r}}const us=ee.define();class st{constructor(e,t,n,r){this.fromA=e,this.toA=t,this.fromB=n,this.toB=r}join(e){return new st(Math.min(this.fromA,e.fromA),Math.max(this.toA,e.toA),Math.min(this.fromB,e.fromB),Math.max(this.toB,e.toB))}addToSet(e){let t=e.length,n=this;for(;t>0;t--){let r=e[t-1];if(!(r.fromA>n.toA)){if(r.toA<n.fromA)break;n=n.join(r),e.splice(t-1,1)}}return e.splice(t,0,n),e}static extendWithRanges(e,t){if(t.length==0)return e;let n=[];for(let r=0,i=0,o=0,a=0;;r++){let l=r==e.length?null:e[r],c=o-a,h=l?l.fromB:1e9;for(;i<t.length&&t[i]<h;){let d=t[i],u=t[i+1],f=Math.max(a,d),m=Math.min(h,u);if(f<=m&&new st(f+c,m+c,f,m).addToSet(n),u>h)break;i+=2}if(!l)return n;new st(l.fromA,l.toA,l.fromB,l.toB).addToSet(n),o=l.toA,a=l.toB}}}class Or{constructor(e,t,n){this.view=e,this.state=t,this.transactions=n,this.flags=0,this.startState=e.state,this.changes=Pe.empty(this.startState.doc.length);for(let i of n)this.changes=this.changes.compose(i.changes);let r=[];this.changes.iterChangedRanges((i,o,a,l)=>r.push(new st(i,o,a,l))),this.changedRanges=r}static create(e,t,n){return new Or(e,t,n)}get viewportChanged(){return(this.flags&4)>0}get viewportMoved(){return(this.flags&8)>0}get heightChanged(){return(this.flags&2)>0}get geometryChanged(){return this.docChanged||(this.flags&18)>0}get focusChanged(){return(this.flags&1)>0}get docChanged(){return!this.changes.empty}get selectionSet(){return this.transactions.some(e=>e.selection)}get empty(){return this.flags==0&&this.transactions.length==0}}class xl extends be{get length(){return this.view.state.doc.length}constructor(e){super(),this.view=e,this.decorations=[],this.dynamicDecorationMap=[!1],this.domChanged=null,this.hasComposition=null,this.markedForComposition=new Set,this.editContextFormatting=Me.none,this.lastCompositionAfterCursor=!1,this.minWidth=0,this.minWidthFrom=0,this.minWidthTo=0,this.impreciseAnchor=null,this.impreciseHead=null,this.forceSelection=!1,this.lastUpdate=Date.now(),this.setDOM(e.contentDOM),this.children=[new Ee],this.children[0].setParent(this),this.updateDeco(),this.updateInner([new st(0,0,0,e.state.doc.length)],0,null)}update(e){var t;let n=e.changedRanges;this.minWidth>0&&n.length&&(n.every(({fromA:c,toA:h})=>h<this.minWidthFrom||c>this.minWidthTo)?(this.minWidthFrom=e.changes.mapPos(this.minWidthFrom,1),this.minWidthTo=e.changes.mapPos(this.minWidthTo,1)):this.minWidth=this.minWidthFrom=this.minWidthTo=0),this.updateEditContextFormatting(e);let r=-1;this.view.inputState.composing>=0&&!this.view.observer.editContext&&(!((t=this.domChanged)===null||t===void 0)&&t.newSel?r=this.domChanged.newSel.head:!Iv(e.changes,this.hasComposition)&&!e.selectionSet&&(r=e.state.selection.main.head));let i=r>-1?Tv(this.view,e.changes,r):null;if(this.domChanged=null,this.hasComposition){this.markedForComposition.clear();let{from:c,to:h}=this.hasComposition;n=new st(c,h,e.changes.mapPos(c,-1),e.changes.mapPos(h,1)).addToSet(n.slice())}this.hasComposition=i?{from:i.range.fromB,to:i.range.toB}:null,(H.ie||H.chrome)&&!i&&e&&e.state.doc.lines!=e.startState.doc.lines&&(this.forceSelection=!0);let o=this.decorations,a=this.updateDeco(),l=Rv(o,a,e.changes);return n=st.extendWithRanges(n,l),!(this.flags&7)&&n.length==0?!1:(this.updateInner(n,e.startState.doc.length,i),e.transactions.length&&(this.lastUpdate=Date.now()),!0)}updateInner(e,t,n){this.view.viewState.mustMeasureContent=!0,this.updateChildren(e,t,n);let{observer:r}=this.view;r.ignore(()=>{this.dom.style.height=this.view.viewState.contentHeight/this.view.scaleY+"px",this.dom.style.flexBasis=this.minWidth?this.minWidth+"px":"";let o=H.chrome||H.ios?{node:r.selectionRange.focusNode,written:!1}:void 0;this.sync(this.view,o),this.flags&=-8,o&&(o.written||r.selectionRange.focusNode!=o.node)&&(this.forceSelection=!0),this.dom.style.height=""}),this.markedForComposition.forEach(o=>o.flags&=-9);let i=[];if(this.view.viewport.from||this.view.viewport.to<this.view.state.doc.length)for(let o of this.children)o instanceof Dt&&o.widget instanceof Xi&&i.push(o.dom);r.updateGaps(i)}updateChildren(e,t,n){let r=n?n.range.addToSet(e.slice()):e,i=this.childCursor(t);for(let o=r.length-1;;o--){let a=o>=0?r[o]:null;if(!a)break;let{fromA:l,toA:c,fromB:h,toB:d}=a,u,f,m,y;if(n&&n.range.fromB<d&&n.range.toB>h){let P=Ss.build(this.view.state.doc,h,n.range.fromB,this.decorations,this.dynamicDecorationMap),A=Ss.build(this.view.state.doc,n.range.toB,d,this.decorations,this.dynamicDecorationMap);f=P.breakAtStart,m=P.openStart,y=A.openEnd;let N=this.compositionView(n);A.breakAtStart?N.breakAfter=1:A.content.length&&N.merge(N.length,N.length,A.content[0],!1,A.openStart,0)&&(N.breakAfter=A.content[0].breakAfter,A.content.shift()),P.content.length&&N.merge(0,0,P.content[P.content.length-1],!0,0,P.openEnd)&&P.content.pop(),u=P.content.concat(N).concat(A.content)}else({content:u,breakAtStart:f,openStart:m,openEnd:y}=Ss.build(this.view.state.doc,h,d,this.decorations,this.dynamicDecorationMap));let{i:b,off:g}=i.findPos(c,1),{i:x,off:C}=i.findPos(l,-1);Rh(this,x,C,b,g,u,f,m,y)}n&&this.fixCompositionDOM(n)}updateEditContextFormatting(e){this.editContextFormatting=this.editContextFormatting.map(e.changes);for(let t of e.transactions)for(let n of t.effects)n.is(sd)&&(this.editContextFormatting=n.value)}compositionView(e){let t=new ut(e.text.nodeValue);t.flags|=8;for(let{deco:r}of e.marks)t=new qt(r,[t],t.length);let n=new Ee;return n.append(t,0),n}fixCompositionDOM(e){let t=(i,o)=>{o.flags|=8|(o.children.some(l=>l.flags&7)?1:0),this.markedForComposition.add(o);let a=be.get(i);a&&a!=o&&(a.dom=null),o.setDOM(i)},n=this.childPos(e.range.fromB,1),r=this.children[n.i];t(e.line,r);for(let i=e.marks.length-1;i>=-1;i--)n=r.childPos(n.off,1),r=r.children[n.i],t(i>=0?e.marks[i].node:e.text,r)}updateSelection(e=!1,t=!1){(e||!this.view.observer.selectionRange.focusNode)&&this.view.observer.readSelectionRange();let n=this.view.root.activeElement,r=n==this.dom,i=!r&&!(this.view.state.facet(Pt)||this.dom.tabIndex>-1)&&pr(this.dom,this.view.observer.selectionRange)&&!(n&&this.dom.contains(n));if(!(r||t||i))return;let o=this.forceSelection;this.forceSelection=!1;let a=this.view.state.selection.main,l=this.moveToLine(this.domAtPos(a.anchor)),c=a.empty?l:this.moveToLine(this.domAtPos(a.head));if(H.gecko&&a.empty&&!this.hasComposition&&Av(l)){let d=document.createTextNode("");this.view.observer.ignore(()=>l.node.insertBefore(d,l.node.childNodes[l.offset]||null)),l=c=new Fe(d,0),o=!0}let h=this.view.observer.selectionRange;(o||!h.focusNode||(!ks(l.node,l.offset,h.anchorNode,h.anchorOffset)||!ks(c.node,c.offset,h.focusNode,h.focusOffset))&&!this.suppressWidgetCursorChange(h,a))&&(this.view.observer.ignore(()=>{H.android&&H.chrome&&this.dom.contains(h.focusNode)&&Dv(h.focusNode,this.dom)&&(this.dom.blur(),this.dom.focus({preventScroll:!0}));let d=Os(this.view.root);if(d)if(a.empty){if(H.gecko){let u=zv(l.node,l.offset);if(u&&u!=3){let f=(u==1?Th:zh)(l.node,l.offset);f&&(l=new Fe(f.node,f.offset))}}d.collapse(l.node,l.offset),a.bidiLevel!=null&&d.caretBidiLevel!==void 0&&(d.caretBidiLevel=a.bidiLevel)}else if(d.extend){d.collapse(l.node,l.offset);try{d.extend(c.node,c.offset)}catch{}}else{let u=document.createRange();a.anchor>a.head&&([l,c]=[c,l]),u.setEnd(c.node,c.offset),u.setStart(l.node,l.offset),d.removeAllRanges(),d.addRange(u)}i&&this.view.root.activeElement==this.dom&&(this.dom.blur(),n&&n.focus())}),this.view.observer.setSelectionRange(l,c)),this.impreciseAnchor=l.precise?null:new Fe(h.anchorNode,h.anchorOffset),this.impreciseHead=c.precise?null:new Fe(h.focusNode,h.focusOffset)}suppressWidgetCursorChange(e,t){return this.hasComposition&&t.empty&&ks(e.focusNode,e.focusOffset,e.anchorNode,e.anchorOffset)&&this.posFromDOM(e.focusNode,e.focusOffset)==t.head}enforceCursorAssoc(){if(this.hasComposition)return;let{view:e}=this,t=e.state.selection.main,n=Os(e.root),{anchorNode:r,anchorOffset:i}=e.observer.selectionRange;if(!n||!t.empty||!t.assoc||!n.modify)return;let o=Ee.find(this,t.head);if(!o)return;let a=o.posAtStart;if(t.head==a||t.head==a+o.length)return;let l=this.coordsAt(t.head,-1),c=this.coordsAt(t.head,1);if(!l||!c||l.bottom>c.top)return;let h=this.domAtPos(t.head+t.assoc);n.collapse(h.node,h.offset),n.modify("move",t.assoc<0?"forward":"backward","lineboundary"),e.observer.readSelectionRange();let d=e.observer.selectionRange;e.docView.posFromDOM(d.anchorNode,d.anchorOffset)!=t.from&&n.collapse(r,i)}moveToLine(e){let t=this.dom,n;if(e.node!=t)return e;for(let r=e.offset;!n&&r<t.childNodes.length;r++){let i=be.get(t.childNodes[r]);i instanceof Ee&&(n=i.domAtPos(0))}for(let r=e.offset-1;!n&&r>=0;r--){let i=be.get(t.childNodes[r]);i instanceof Ee&&(n=i.domAtPos(i.length))}return n?new Fe(n.node,n.offset,!0):e}nearest(e){for(let t=e;t;){let n=be.get(t);if(n&&n.rootView==this)return n;t=t.parentNode}return null}posFromDOM(e,t){let n=this.nearest(e);if(!n)throw new RangeError("Trying to find position for a DOM position outside of the document");return n.localPosFromDOM(e,t)+n.posAtStart}domAtPos(e){let{i:t,off:n}=this.childCursor().findPos(e,-1);for(;t<this.children.length-1;){let r=this.children[t];if(n<r.length||r instanceof Ee)break;t++,n=0}return this.children[t].domAtPos(n)}coordsAt(e,t){let n=null,r=0;for(let i=this.length,o=this.children.length-1;o>=0;o--){let a=this.children[o],l=i-a.breakAfter,c=l-a.length;if(l<e)break;if(c<=e&&(c<e||a.covers(-1))&&(l>e||a.covers(1))&&(!n||a instanceof Ee&&!(n instanceof Ee&&t>=0)))n=a,r=c;else if(n&&c==e&&l==e&&a instanceof Dt&&Math.abs(t)<2){if(a.deco.startSide<0)break;o&&(n=null)}i=c}return n?n.coordsAt(e-r,t):null}coordsForChar(e){let{i:t,off:n}=this.childPos(e,1),r=this.children[t];if(!(r instanceof Ee))return null;for(;r.children.length;){let{i:a,off:l}=r.childPos(n,1);for(;;a++){if(a==r.children.length)return null;if((r=r.children[a]).length)break}n=l}if(!(r instanceof ut))return null;let i=At(r.text,n);if(i==n)return null;let o=vn(r.dom,n,i).getClientRects();for(let a=0;a<o.length;a++){let l=o[a];if(a==o.length-1||l.top<l.bottom&&l.left<l.right)return l}return null}measureVisibleLineHeights(e){let t=[],{from:n,to:r}=e,i=this.view.contentDOM.clientWidth,o=i>Math.max(this.view.scrollDOM.clientWidth,this.minWidth)+1,a=-1,l=this.view.textDirection==qe.LTR;for(let c=0,h=0;h<this.children.length;h++){let d=this.children[h],u=c+d.length;if(u>r)break;if(c>=n){let f=d.dom.getBoundingClientRect();if(t.push(f.height),o){let m=d.dom.lastChild,y=m?$s(m):[];if(y.length){let b=y[y.length-1],g=l?b.right-f.left:f.right-b.left;g>a&&(a=g,this.minWidth=i,this.minWidthFrom=c,this.minWidthTo=u)}}}c=u+d.breakAfter}return t}textDirectionAt(e){let{i:t}=this.childPos(e,1);return getComputedStyle(this.children[t].dom).direction=="rtl"?qe.RTL:qe.LTR}measureTextSize(){for(let i of this.children)if(i instanceof Ee){let o=i.measureTextSize();if(o)return o}let e=document.createElement("div"),t,n,r;return e.className="cm-line",e.style.width="99999px",e.style.position="absolute",e.textContent="abc def ghi jkl mno pqr stu",this.view.observer.ignore(()=>{this.dom.appendChild(e);let i=$s(e.firstChild)[0];t=e.getBoundingClientRect().height,n=i?i.width/27:7,r=i?i.height:t,e.remove()}),{lineHeight:t,charWidth:n,textHeight:r}}childCursor(e=this.length){let t=this.children.length;return t&&(e-=this.children[--t].length),new Nh(this.children,e,t)}computeBlockGapDeco(){let e=[],t=this.view.viewState;for(let n=0,r=0;;r++){let i=r==t.viewports.length?null:t.viewports[r],o=i?i.from-1:this.length;if(o>n){let a=(t.lineBlockAt(o).bottom-t.lineBlockAt(n).top)/this.view.scaleY;e.push(Me.replace({widget:new Xi(a),block:!0,inclusive:!0,isBlockGap:!0}).range(n,o))}if(!i)break;n=i.to+1}return Me.set(e)}updateDeco(){let e=1,t=this.view.state.facet(Ms).map(i=>(this.dynamicDecorationMap[e++]=typeof i=="function")?i(this.view):i),n=!1,r=this.view.state.facet(id).map((i,o)=>{let a=typeof i=="function";return a&&(n=!0),a?i(this.view):i});for(r.length&&(this.dynamicDecorationMap[e++]=n,t.push(je.join(r))),this.decorations=[this.editContextFormatting,...t,this.computeBlockGapDeco(),this.view.viewState.lineGapDeco];e<this.decorations.length;)this.dynamicDecorationMap[e++]=!1;return this.decorations}scrollIntoView(e){if(e.isSnapshot){let c=this.view.viewState.lineBlockAt(e.range.head);this.view.scrollDOM.scrollTop=c.top-e.yMargin,this.view.scrollDOM.scrollLeft=e.xMargin;return}for(let c of this.view.state.facet(nd))try{if(c(this.view,e.range,e))return!0}catch(h){kt(this.view.state,h,"scroll handler")}let{range:t}=e,n=this.coordsAt(t.head,t.empty?t.assoc:t.head>t.anchor?-1:1),r;if(!n)return;!t.empty&&(r=this.coordsAt(t.anchor,t.anchor>t.head?-1:1))&&(n={left:Math.min(n.left,r.left),top:Math.min(n.top,r.top),right:Math.max(n.right,r.right),bottom:Math.max(n.bottom,r.bottom)});let i=ld(this.view),o={left:n.left-i.left,top:n.top-i.top,right:n.right+i.right,bottom:n.bottom+i.bottom},{offsetWidth:a,offsetHeight:l}=this.view.scrollDOM;dv(this.view.scrollDOM,o,t.head<t.anchor?-1:1,e.x,e.y,Math.max(Math.min(e.xMargin,a),-a),Math.max(Math.min(e.yMargin,l),-l),this.view.textDirection==qe.LTR)}}function Av(s){return s.node.nodeType==1&&s.node.firstChild&&(s.offset==0||s.node.childNodes[s.offset-1].contentEditable=="false")&&(s.offset==s.node.childNodes.length||s.node.childNodes[s.offset].contentEditable=="false")}function cd(s,e){let t=s.observer.selectionRange;if(!t.focusNode)return null;let n=Th(t.focusNode,t.focusOffset),r=zh(t.focusNode,t.focusOffset),i=n||r;if(r&&n&&r.node!=n.node){let a=be.get(r.node);if(!a||a instanceof ut&&a.text!=r.node.nodeValue)i=r;else if(s.docView.lastCompositionAfterCursor){let l=be.get(n.node);!l||l instanceof ut&&l.text!=n.node.nodeValue||(i=r)}}if(s.docView.lastCompositionAfterCursor=i!=n,!i)return null;let o=e-i.offset;return{from:o,to:o+i.node.nodeValue.length,node:i.node}}function Tv(s,e,t){let n=cd(s,t);if(!n)return null;let{node:r,from:i,to:o}=n,a=r.nodeValue;if(/[\n\r]/.test(a)||s.state.doc.sliceString(n.from,n.to)!=a)return null;let l=e.invertedDesc,c=new st(l.mapPos(i),l.mapPos(o),i,o),h=[];for(let d=r.parentNode;;d=d.parentNode){let u=be.get(d);if(u instanceof qt)h.push({node:d,deco:u.mark});else{if(u instanceof Ee||d.nodeName=="DIV"&&d.parentNode==s.contentDOM)return{range:c,text:r,marks:h,line:d};if(d!=s.contentDOM)h.push({node:d,deco:new Rs({inclusive:!0,attributes:yv(d),tagName:d.tagName.toLowerCase()})});else return null}}}function zv(s,e){return s.nodeType!=1?0:(e&&s.childNodes[e-1].contentEditable=="false"?1:0)|(e<s.childNodes.length&&s.childNodes[e].contentEditable=="false"?2:0)}let Nv=class{constructor(){this.changes=[]}compareRange(e,t){mr(e,t,this.changes)}comparePoint(e,t){mr(e,t,this.changes)}boundChange(e){mr(e,e,this.changes)}};function Rv(s,e,t){let n=new Nv;return je.compare(s,e,t,n),n.changes}function Dv(s,e){for(let t=s;t&&t!=e;t=t.assignedSlot||t.parentNode)if(t.nodeType==1&&t.contentEditable=="false")return!0;return!1}function Iv(s,e){let t=!1;return e&&s.iterChangedRanges((n,r)=>{n<e.to&&r>e.from&&(t=!0)}),t}function qv(s,e,t=1){let n=s.charCategorizer(e),r=s.doc.lineAt(e),i=e-r.from;if(r.length==0)return K.cursor(e);i==0?t=1:i==r.length&&(t=-1);let o=i,a=i;t<0?o=At(r.text,i,!1):a=At(r.text,i);let l=n(r.text.slice(o,a));for(;o>0;){let c=At(r.text,o,!1);if(n(r.text.slice(c,o))!=l)break;o=c}for(;a<r.length;){let c=At(r.text,a);if(n(r.text.slice(a,c))!=l)break;a=c}return K.range(o+r.from,a+r.from)}function Bv(s,e){return e.left>s?e.left-s:Math.max(0,s-e.right)}function Lv(s,e){return e.top>s?e.top-s:Math.max(0,s-e.bottom)}function hi(s,e){return s.top<e.bottom-1&&s.bottom>e.top+1}function kl(s,e){return e<s.top?{top:e,left:s.left,right:s.right,bottom:s.bottom}:s}function Sl(s,e){return e>s.bottom?{top:s.top,left:s.left,right:s.right,bottom:e}:s}function to(s,e,t){let n,r,i,o,a=!1,l,c,h,d;for(let m=s.firstChild;m;m=m.nextSibling){let y=$s(m);for(let b=0;b<y.length;b++){let g=y[b];r&&hi(r,g)&&(g=kl(Sl(g,r.bottom),r.top));let x=Bv(e,g),C=Lv(t,g);if(x==0&&C==0)return m.nodeType==3?_l(m,e,t):to(m,e,t);if(!n||o>C||o==C&&i>x){n=m,r=g,i=x,o=C;let P=C?t<g.top?-1:1:x?e<g.left?-1:1:0;a=!P||(P>0?b<y.length-1:b>0)}x==0?t>g.bottom&&(!h||h.bottom<g.bottom)?(l=m,h=g):t<g.top&&(!d||d.top>g.top)&&(c=m,d=g):h&&hi(h,g)?h=Sl(h,g.bottom):d&&hi(d,g)&&(d=kl(d,g.top))}}if(h&&h.bottom>=t?(n=l,r=h):d&&d.top<=t&&(n=c,r=d),!n)return{node:s,offset:0};let u=Math.max(r.left,Math.min(r.right,e));if(n.nodeType==3)return _l(n,u,t);if(a&&n.contentEditable!="false")return to(n,u,t);let f=Array.prototype.indexOf.call(s.childNodes,n)+(e>=(r.left+r.right)/2?1:0);return{node:s,offset:f}}function _l(s,e,t){let n=s.nodeValue.length,r=-1,i=1e9,o=0;for(let a=0;a<n;a++){let l=vn(s,a,a+1).getClientRects();for(let c=0;c<l.length;c++){let h=l[c];if(h.top==h.bottom)continue;o||(o=e-h.left);let d=(h.top>t?h.top-t:t-h.bottom)-1;if(h.left-1<=e&&h.right+1>=e&&d<i){let u=e>=(h.left+h.right)/2,f=u;if((H.chrome||H.gecko)&&vn(s,a).getBoundingClientRect().left==h.right&&(f=!u),d<=0)return{node:s,offset:a+(f?1:0)};r=a+(f?1:0),i=d}}}return{node:s,offset:r>-1?r:o>0?s.nodeValue.length:0}}function hd(s,e,t,n=-1){var r,i;let o=s.contentDOM.getBoundingClientRect(),a=o.top+s.viewState.paddingTop,l,{docHeight:c}=s.viewState,{x:h,y:d}=e,u=d-a;if(u<0)return 0;if(u>c)return s.state.doc.length;for(let P=s.viewState.heightOracle.textHeight/2,A=!1;l=s.elementAtHeight(u),l.type!=_t.Text;)for(;u=n>0?l.bottom+P:l.top-P,!(u>=0&&u<=c);){if(A)return t?null:0;A=!0,n=-n}d=a+u;let f=l.from;if(f<s.viewport.from)return s.viewport.from==0?0:t?null:El(s,o,l,h,d);if(f>s.viewport.to)return s.viewport.to==s.state.doc.length?s.state.doc.length:t?null:El(s,o,l,h,d);let m=s.dom.ownerDocument,y=s.root.elementFromPoint?s.root:m,b=y.elementFromPoint(h,d);b&&!s.contentDOM.contains(b)&&(b=null),b||(h=Math.max(o.left+1,Math.min(o.right-1,h)),b=y.elementFromPoint(h,d),b&&!s.contentDOM.contains(b)&&(b=null));let g,x=-1;if(b&&((r=s.docView.nearest(b))===null||r===void 0?void 0:r.isEditable)!=!1){if(m.caretPositionFromPoint){let P=m.caretPositionFromPoint(h,d);P&&({offsetNode:g,offset:x}=P)}else if(m.caretRangeFromPoint){let P=m.caretRangeFromPoint(h,d);P&&({startContainer:g,startOffset:x}=P,(!s.contentDOM.contains(g)||H.safari&&Fv(g,x,h)||H.chrome&&Uv(g,x,h))&&(g=void 0))}g&&(x=Math.min(Et(g),x))}if(!g||!s.docView.dom.contains(g)){let P=Ee.find(s.docView,f);if(!P)return u>l.top+l.height/2?l.to:l.from;({node:g,offset:x}=to(P.dom,h,d))}let C=s.docView.nearest(g);if(!C)return null;if(C.isWidget&&((i=C.dom)===null||i===void 0?void 0:i.nodeType)==1){let P=C.dom.getBoundingClientRect();return e.y<P.top||e.y<=P.bottom&&e.x<=(P.left+P.right)/2?C.posAtStart:C.posAtEnd}else return C.localPosFromDOM(g,x)+C.posAtStart}function El(s,e,t,n,r){let i=Math.round((n-e.left)*s.defaultCharacterWidth);if(s.lineWrapping&&t.height>s.defaultLineHeight*1.5){let a=s.viewState.heightOracle.textHeight,l=Math.floor((r-t.top-(s.defaultLineHeight-a)*.5)/a);i+=l*s.viewState.heightOracle.lineLength}let o=s.state.sliceDoc(t.from,t.to);return t.from+lv(o,i,s.state.tabSize)}function Fv(s,e,t){let n;if(s.nodeType!=3||e!=(n=s.nodeValue.length))return!1;for(let r=s.nextSibling;r;r=r.nextSibling)if(r.nodeType!=1||r.nodeName!="BR")return!1;return vn(s,n-1,n).getBoundingClientRect().left>t}function Uv(s,e,t){if(e!=0)return!1;for(let r=s;;){let i=r.parentNode;if(!i||i.nodeType!=1||i.firstChild!=r)return!1;if(i.classList.contains("cm-line"))break;r=i}let n=s.nodeType==1?s.getBoundingClientRect():vn(s,0,Math.max(s.nodeValue.length,1)).getBoundingClientRect();return t-n.left>5}function Hv(s,e){let t=s.lineBlockAt(e);if(Array.isArray(t.type)){for(let n of t.type)if(n.to>e||n.to==e&&(n.to==t.to||n.type==_t.Text))return n}return t}function Vv(s,e,t,n){let r=Hv(s,e.head),i=!n||r.type!=_t.Text||!(s.lineWrapping||r.widgetLineBreaks)?null:s.coordsAtPos(e.assoc<0&&e.head>r.from?e.head-1:e.head);if(i){let o=s.dom.getBoundingClientRect(),a=s.textDirectionAt(r.from),l=s.posAtCoords({x:t==(a==qe.LTR)?o.right-1:o.left+1,y:(i.top+i.bottom)/2});if(l!=null)return K.cursor(l,t?-1:1)}return K.cursor(t?r.to:r.from,t?-1:1)}function Cl(s,e,t,n){let r=s.state.doc.lineAt(e.head),i=s.bidiSpans(r),o=s.textDirectionAt(r.from);for(let a=e,l=null;;){let c=Ov(r,i,o,a,t),h=Gh;if(!c){if(r.number==(t?s.state.doc.lines:1))return a;h=`
`,r=s.state.doc.line(r.number+(t?1:-1)),i=s.bidiSpans(r),c=s.visualLineSide(r,!t)}if(l){if(!l(h))return a}else{if(!n)return c;l=n(h)}a=c}}function Wv(s,e,t){let n=s.state.charCategorizer(e),r=n(t);return i=>{let o=n(i);return r==Tt.Space&&(r=o),r==o}}function Kv(s,e,t,n){let r=e.head,i=t?1:-1;if(r==(t?s.state.doc.length:0))return K.cursor(r,e.assoc);let o=e.goalColumn,a,l=s.contentDOM.getBoundingClientRect(),c=s.coordsAtPos(r,e.assoc||-1),h=s.documentTop;if(c)o==null&&(o=c.left-l.left),a=i<0?c.top:c.bottom;else{let f=s.viewState.lineBlockAt(r);o==null&&(o=Math.min(l.right-l.left,s.defaultCharacterWidth*(r-f.from))),a=(i<0?f.top:f.bottom)+h}let d=l.left+o,u=n??s.viewState.heightOracle.textHeight>>1;for(let f=0;;f+=10){let m=a+(u+f)*i,y=hd(s,{x:d,y:m},!1,i);if(m<l.top||m>l.bottom||(i<0?y<r:y>r)){let b=s.docView.coordsForChar(y),g=!b||m<b.top?-1:1;return K.cursor(y,g,void 0,o)}}}function gr(s,e,t){for(;;){let n=0;for(let r of s)r.between(e-1,e+1,(i,o,a)=>{if(e>i&&e<o){let l=n||t||(e-i<o-e?-1:1);e=l<0?i:o,n=l}});if(!n)return e}}function di(s,e,t){let n=gr(s.state.facet(fa).map(r=>r(s)),t.from,e.head>t.from?-1:1);return n==t.from?t:K.cursor(n,n<t.from?1:-1)}const fs="￿";class Gv{constructor(e,t){this.points=e,this.text="",this.lineSeparator=t.facet(pe.lineSeparator)}append(e){this.text+=e}lineBreak(){this.text+=fs}readRange(e,t){if(!e)return this;let n=e.parentNode;for(let r=e;;){this.findPointBefore(n,r);let i=this.text.length;this.readNode(r);let o=r.nextSibling;if(o==t)break;let a=be.get(r),l=be.get(o);(a&&l?a.breakAfter:(a?a.breakAfter:Er(r))||Er(o)&&(r.nodeName!="BR"||r.cmIgnore)&&this.text.length>i)&&this.lineBreak(),r=o}return this.findPointBefore(n,t),this}readTextNode(e){let t=e.nodeValue;for(let n of this.points)n.node==e&&(n.pos=this.text.length+Math.min(n.offset,t.length));for(let n=0,r=this.lineSeparator?null:/\r\n?|\n/g;;){let i=-1,o=1,a;if(this.lineSeparator?(i=t.indexOf(this.lineSeparator,n),o=this.lineSeparator.length):(a=r.exec(t))&&(i=a.index,o=a[0].length),this.append(t.slice(n,i<0?t.length:i)),i<0)break;if(this.lineBreak(),o>1)for(let l of this.points)l.node==e&&l.pos>this.text.length&&(l.pos-=o-1);n=i+o}}readNode(e){if(e.cmIgnore)return;let t=be.get(e),n=t&&t.overrideDOMText;if(n!=null){this.findPointInside(e,n.length);for(let r=n.iter();!r.next().done;)r.lineBreak?this.lineBreak():this.append(r.value)}else e.nodeType==3?this.readTextNode(e):e.nodeName=="BR"?e.nextSibling&&this.lineBreak():e.nodeType==1&&this.readRange(e.firstChild,null)}findPointBefore(e,t){for(let n of this.points)n.node==e&&e.childNodes[n.offset]==t&&(n.pos=this.text.length)}findPointInside(e,t){for(let n of this.points)(e.nodeType==3?n.node==e:e.contains(n.node))&&(n.pos=this.text.length+(Yv(e,n.node,n.offset)?t:0))}}function Yv(s,e,t){for(;;){if(!e||t<Et(e))return!1;if(e==s)return!0;t=gn(e)+1,e=e.parentNode}}class Ol{constructor(e,t){this.node=e,this.offset=t,this.pos=-1}}class Xv{constructor(e,t,n,r){this.typeOver=r,this.bounds=null,this.text="",this.domChanged=t>-1;let{impreciseHead:i,impreciseAnchor:o}=e.docView;if(e.state.readOnly&&t>-1)this.newSel=null;else if(t>-1&&(this.bounds=e.docView.domBoundsAround(t,n,0))){let a=i||o?[]:Zv(e),l=new Gv(a,e.state);l.readRange(this.bounds.startDOM,this.bounds.endDOM),this.text=l.text,this.newSel=eb(a,this.bounds.from)}else{let a=e.observer.selectionRange,l=i&&i.node==a.focusNode&&i.offset==a.focusOffset||!Hi(e.contentDOM,a.focusNode)?e.state.selection.main.head:e.docView.posFromDOM(a.focusNode,a.focusOffset),c=o&&o.node==a.anchorNode&&o.offset==a.anchorOffset||!Hi(e.contentDOM,a.anchorNode)?e.state.selection.main.anchor:e.docView.posFromDOM(a.anchorNode,a.anchorOffset),h=e.viewport;if((H.ios||H.chrome)&&e.state.selection.main.empty&&l!=c&&(h.from>0||h.to<e.state.doc.length)){let d=Math.min(l,c),u=Math.max(l,c),f=h.from-d,m=h.to-u;(f==0||f==1||d==0)&&(m==0||m==-1||u==e.state.doc.length)&&(l=0,c=e.state.doc.length)}this.newSel=K.single(c,l)}}}function dd(s,e){let t,{newSel:n}=e,r=s.state.selection.main,i=s.inputState.lastKeyTime>Date.now()-100?s.inputState.lastKeyCode:-1;if(e.bounds){let{from:o,to:a}=e.bounds,l=r.from,c=null;(i===8||H.android&&e.text.length<a-o)&&(l=r.to,c="end");let h=Jv(s.state.doc.sliceString(o,a,fs),e.text,l-o,c);h&&(H.chrome&&i==13&&h.toB==h.from+2&&e.text.slice(h.from,h.toB)==fs+fs&&h.toB--,t={from:o+h.from,to:o+h.toA,insert:fe.of(e.text.slice(h.from,h.toB).split(fs))})}else n&&(!s.hasFocus&&s.state.facet(Pt)||n.main.eq(r))&&(n=null);if(!t&&!n)return!1;if(!t&&e.typeOver&&!r.empty&&n&&n.main.empty?t={from:r.from,to:r.to,insert:s.state.doc.slice(r.from,r.to)}:t&&t.from>=r.from&&t.to<=r.to&&(t.from!=r.from||t.to!=r.to)&&r.to-r.from-(t.to-t.from)<=4?t={from:r.from,to:r.to,insert:s.state.doc.slice(r.from,t.from).append(t.insert).append(s.state.doc.slice(t.to,r.to))}:(H.mac||H.android)&&t&&t.from==t.to&&t.from==r.head-1&&/^\. ?$/.test(t.insert.toString())&&s.contentDOM.getAttribute("autocorrect")=="off"?(n&&t.insert.length==2&&(n=K.single(n.main.anchor-1,n.main.head-1)),t={from:r.from,to:r.to,insert:fe.of([" "])}):H.chrome&&t&&t.from==t.to&&t.from==r.head&&t.insert.toString()==`
 `&&s.lineWrapping&&(n&&(n=K.single(n.main.anchor-1,n.main.head-1)),t={from:r.from,to:r.to,insert:fe.of([" "])}),t)return pa(s,t,n,i);if(n&&!n.main.eq(r)){let o=!1,a="select";return s.inputState.lastSelectionTime>Date.now()-50&&(s.inputState.lastSelectionOrigin=="select"&&(o=!0),a=s.inputState.lastSelectionOrigin),s.dispatch({selection:n,scrollIntoView:o,userEvent:a}),!0}else return!1}function pa(s,e,t,n=-1){if(H.ios&&s.inputState.flushIOSKey(e))return!0;let r=s.state.selection.main;if(H.android&&(e.to==r.to&&(e.from==r.from||e.from==r.from-1&&s.state.sliceDoc(e.from,r.from)==" ")&&e.insert.length==1&&e.insert.lines==2&&An(s.contentDOM,"Enter",13)||(e.from==r.from-1&&e.to==r.to&&e.insert.length==0||n==8&&e.insert.length<e.to-e.from&&e.to>r.head)&&An(s.contentDOM,"Backspace",8)||e.from==r.from&&e.to==r.to+1&&e.insert.length==0&&An(s.contentDOM,"Delete",46)))return!0;let i=e.insert.toString();s.inputState.composing>=0&&s.inputState.composing++;let o,a=()=>o||(o=Qv(s,e,t));return s.state.facet(Zh).some(l=>l(s,e.from,e.to,i,a))||s.dispatch(a()),!0}function Qv(s,e,t){let n,r=s.state,i=r.selection.main;if(e.from>=i.from&&e.to<=i.to&&e.to-e.from>=(i.to-i.from)/3&&(!t||t.main.empty&&t.main.from==e.from+e.insert.length)&&s.inputState.composing<0){let a=i.from<e.from?r.sliceDoc(i.from,e.from):"",l=i.to>e.to?r.sliceDoc(e.to,i.to):"";n=r.replaceSelection(s.state.toText(a+e.insert.sliceString(0,void 0,s.state.lineBreak)+l))}else{let a=r.changes(e),l=t&&t.main.to<=a.newLength?t.main:void 0;if(r.selection.ranges.length>1&&s.inputState.composing>=0&&e.to<=i.to&&e.to>=i.to-10){let c=s.state.sliceDoc(e.from,e.to),h,d=t&&cd(s,t.main.head);if(d){let m=e.insert.length-(e.to-e.from);h={from:d.from,to:d.to-m}}else h=s.state.doc.lineAt(i.head);let u=i.to-e.to,f=i.to-i.from;n=r.changeByRange(m=>{if(m.from==i.from&&m.to==i.to)return{changes:a,range:l||m.map(a)};let y=m.to-u,b=y-c.length;if(m.to-m.from!=f||s.state.sliceDoc(b,y)!=c||m.to>=h.from&&m.from<=h.to)return{range:m};let g=r.changes({from:b,to:y,insert:e.insert}),x=m.to-i.to;return{changes:g,range:l?K.range(Math.max(0,l.anchor+x),Math.max(0,l.head+x)):m.map(g)}})}else n={changes:a,selection:l&&r.selection.replaceRange(l)}}let o="input.type";return(s.composing||s.inputState.compositionPendingChange&&s.inputState.compositionEndedAt>Date.now()-50)&&(s.inputState.compositionPendingChange=!1,o+=".compose",s.inputState.compositionFirstChange&&(o+=".start",s.inputState.compositionFirstChange=!1)),r.update(n,{userEvent:o,scrollIntoView:!0})}function Jv(s,e,t,n){let r=Math.min(s.length,e.length),i=0;for(;i<r&&s.charCodeAt(i)==e.charCodeAt(i);)i++;if(i==r&&s.length==e.length)return null;let o=s.length,a=e.length;for(;o>0&&a>0&&s.charCodeAt(o-1)==e.charCodeAt(a-1);)o--,a--;if(n=="end"){let l=Math.max(0,i-Math.min(o,a));t-=o+l-i}if(o<i&&s.length<e.length){let l=t<=i&&t>=o?i-t:0;i-=l,a=i+(a-o),o=i}else if(a<i){let l=t<=i&&t>=a?i-t:0;i-=l,o=i+(o-a),a=i}return{from:i,toA:o,toB:a}}function Zv(s){let e=[];if(s.root.activeElement!=s.contentDOM)return e;let{anchorNode:t,anchorOffset:n,focusNode:r,focusOffset:i}=s.observer.selectionRange;return t&&(e.push(new Ol(t,n)),(r!=t||i!=n)&&e.push(new Ol(r,i))),e}function eb(s,e){if(s.length==0)return null;let t=s[0].pos,n=s.length==2?s[1].pos:t;return t>-1&&n>-1?K.single(t+e,n+e):null}class tb{setSelectionOrigin(e){this.lastSelectionOrigin=e,this.lastSelectionTime=Date.now()}constructor(e){this.view=e,this.lastKeyCode=0,this.lastKeyTime=0,this.lastTouchTime=0,this.lastFocusTime=0,this.lastScrollTop=0,this.lastScrollLeft=0,this.pendingIOSKey=void 0,this.tabFocusMode=-1,this.lastSelectionOrigin=null,this.lastSelectionTime=0,this.lastContextMenu=0,this.scrollHandlers=[],this.handlers=Object.create(null),this.composing=-1,this.compositionFirstChange=null,this.compositionEndedAt=0,this.compositionPendingKey=!1,this.compositionPendingChange=!1,this.mouseSelection=null,this.draggedContent=null,this.handleEvent=this.handleEvent.bind(this),this.notifiedFocused=e.hasFocus,H.safari&&e.contentDOM.addEventListener("input",()=>null),H.gecko&&bb(e.contentDOM.ownerDocument)}handleEvent(e){!hb(this.view,e)||this.ignoreDuringComposition(e)||e.type=="keydown"&&this.keydown(e)||this.runHandlers(e.type,e)}runHandlers(e,t){let n=this.handlers[e];if(n){for(let r of n.observers)r(this.view,t);for(let r of n.handlers){if(t.defaultPrevented)break;if(r(this.view,t)){t.preventDefault();break}}}}ensureHandlers(e){let t=nb(e),n=this.handlers,r=this.view.contentDOM;for(let i in t)if(i!="scroll"){let o=!t[i].handlers.length,a=n[i];a&&o!=!a.handlers.length&&(r.removeEventListener(i,this.handleEvent),a=null),a||r.addEventListener(i,this.handleEvent,{passive:o})}for(let i in n)i!="scroll"&&!t[i]&&r.removeEventListener(i,this.handleEvent);this.handlers=t}keydown(e){if(this.lastKeyCode=e.keyCode,this.lastKeyTime=Date.now(),e.keyCode==9&&this.tabFocusMode>-1&&(!this.tabFocusMode||Date.now()<=this.tabFocusMode))return!0;if(this.tabFocusMode>0&&e.keyCode!=27&&rb.indexOf(e.keyCode)<0&&(this.tabFocusMode=-1),H.android&&H.chrome&&!e.synthetic&&(e.keyCode==13||e.keyCode==8))return this.view.observer.delayAndroidKey(e.key,e.keyCode),!0;let t;return H.ios&&!e.synthetic&&!e.altKey&&!e.metaKey&&((t=ud.find(n=>n.keyCode==e.keyCode))&&!e.ctrlKey||sb.indexOf(e.key)>-1&&e.ctrlKey&&!e.shiftKey)?(this.pendingIOSKey=t||e,setTimeout(()=>this.flushIOSKey(),250),!0):(e.keyCode!=229&&this.view.observer.forceFlush(),!1)}flushIOSKey(e){let t=this.pendingIOSKey;return!t||t.key=="Enter"&&e&&e.from<e.to&&/^\S+$/.test(e.insert.toString())?!1:(this.pendingIOSKey=void 0,An(this.view.contentDOM,t.key,t.keyCode,t instanceof KeyboardEvent?t:void 0))}ignoreDuringComposition(e){return/^key/.test(e.type)?this.composing>0?!0:H.safari&&!H.ios&&this.compositionPendingKey&&Date.now()-this.compositionEndedAt<100?(this.compositionPendingKey=!1,!0):!1:!1}startMouseSelection(e){this.mouseSelection&&this.mouseSelection.destroy(),this.mouseSelection=e}update(e){this.view.observer.update(e),this.mouseSelection&&this.mouseSelection.update(e),this.draggedContent&&e.docChanged&&(this.draggedContent=this.draggedContent.map(e.changes)),e.transactions.length&&(this.lastKeyCode=this.lastSelectionTime=0)}destroy(){this.mouseSelection&&this.mouseSelection.destroy()}}function $l(s,e){return(t,n)=>{try{return e.call(s,n,t)}catch(r){kt(t.state,r)}}}function nb(s){let e=Object.create(null);function t(n){return e[n]||(e[n]={observers:[],handlers:[]})}for(let n of s){let r=n.spec;if(r&&r.domEventHandlers)for(let i in r.domEventHandlers){let o=r.domEventHandlers[i];o&&t(i).handlers.push($l(n.value,o))}if(r&&r.domEventObservers)for(let i in r.domEventObservers){let o=r.domEventObservers[i];o&&t(i).observers.push($l(n.value,o))}}for(let n in ft)t(n).handlers.push(ft[n]);for(let n in it)t(n).observers.push(it[n]);return e}const ud=[{key:"Backspace",keyCode:8,inputType:"deleteContentBackward"},{key:"Enter",keyCode:13,inputType:"insertParagraph"},{key:"Enter",keyCode:13,inputType:"insertLineBreak"},{key:"Delete",keyCode:46,inputType:"deleteContentForward"}],sb="dthko",rb=[16,17,18,20,91,92,224,225],Qs=6;function Js(s){return Math.max(0,s)*.7+8}function ib(s,e){return Math.max(Math.abs(s.clientX-e.clientX),Math.abs(s.clientY-e.clientY))}class ob{constructor(e,t,n,r){this.view=e,this.startEvent=t,this.style=n,this.mustSelect=r,this.scrollSpeed={x:0,y:0},this.scrolling=-1,this.lastEvent=t,this.scrollParents=uv(e.contentDOM),this.atoms=e.state.facet(fa).map(o=>o(e));let i=e.contentDOM.ownerDocument;i.addEventListener("mousemove",this.move=this.move.bind(this)),i.addEventListener("mouseup",this.up=this.up.bind(this)),this.extend=t.shiftKey,this.multiple=e.state.facet(pe.allowMultipleSelections)&&ab(e,t),this.dragging=cb(e,t)&&md(t)==1?null:!1}start(e){this.dragging===!1&&this.select(e)}move(e){if(e.buttons==0)return this.destroy();if(this.dragging||this.dragging==null&&ib(this.startEvent,e)<10)return;this.select(this.lastEvent=e);let t=0,n=0,r=0,i=0,o=this.view.win.innerWidth,a=this.view.win.innerHeight;this.scrollParents.x&&({left:r,right:o}=this.scrollParents.x.getBoundingClientRect()),this.scrollParents.y&&({top:i,bottom:a}=this.scrollParents.y.getBoundingClientRect());let l=ld(this.view);e.clientX-l.left<=r+Qs?t=-Js(r-e.clientX):e.clientX+l.right>=o-Qs&&(t=Js(e.clientX-o)),e.clientY-l.top<=i+Qs?n=-Js(i-e.clientY):e.clientY+l.bottom>=a-Qs&&(n=Js(e.clientY-a)),this.setScrollSpeed(t,n)}up(e){this.dragging==null&&this.select(this.lastEvent),this.dragging||e.preventDefault(),this.destroy()}destroy(){this.setScrollSpeed(0,0);let e=this.view.contentDOM.ownerDocument;e.removeEventListener("mousemove",this.move),e.removeEventListener("mouseup",this.up),this.view.inputState.mouseSelection=this.view.inputState.draggedContent=null}setScrollSpeed(e,t){this.scrollSpeed={x:e,y:t},e||t?this.scrolling<0&&(this.scrolling=setInterval(()=>this.scroll(),50)):this.scrolling>-1&&(clearInterval(this.scrolling),this.scrolling=-1)}scroll(){let{x:e,y:t}=this.scrollSpeed;e&&this.scrollParents.x&&(this.scrollParents.x.scrollLeft+=e,e=0),t&&this.scrollParents.y&&(this.scrollParents.y.scrollTop+=t,t=0),(e||t)&&this.view.win.scrollBy(e,t),this.dragging===!1&&this.select(this.lastEvent)}skipAtoms(e){let t=null;for(let n=0;n<e.ranges.length;n++){let r=e.ranges[n],i=null;if(r.empty){let o=gr(this.atoms,r.from,0);o!=r.from&&(i=K.cursor(o,-1))}else{let o=gr(this.atoms,r.from,-1),a=gr(this.atoms,r.to,1);(o!=r.from||a!=r.to)&&(i=K.range(r.from==r.anchor?o:a,r.from==r.head?o:a))}i&&(t||(t=e.ranges.slice()),t[n]=i)}return t?K.create(t,e.mainIndex):e}select(e){let{view:t}=this,n=this.skipAtoms(this.style.get(e,this.extend,this.multiple));(this.mustSelect||!n.eq(t.state.selection,this.dragging===!1))&&this.view.dispatch({selection:n,userEvent:"select.pointer"}),this.mustSelect=!1}update(e){e.transactions.some(t=>t.isUserEvent("input.type"))?this.destroy():this.style.update(e)&&setTimeout(()=>this.select(this.lastEvent),20)}}function ab(s,e){let t=s.state.facet(Yh);return t.length?t[0](e):H.mac?e.metaKey:e.ctrlKey}function lb(s,e){let t=s.state.facet(Xh);return t.length?t[0](e):H.mac?!e.altKey:!e.ctrlKey}function cb(s,e){let{main:t}=s.state.selection;if(t.empty)return!1;let n=Os(s.root);if(!n||n.rangeCount==0)return!0;let r=n.getRangeAt(0).getClientRects();for(let i=0;i<r.length;i++){let o=r[i];if(o.left<=e.clientX&&o.right>=e.clientX&&o.top<=e.clientY&&o.bottom>=e.clientY)return!0}return!1}function hb(s,e){if(!e.bubbles)return!0;if(e.defaultPrevented)return!1;for(let t=e.target,n;t!=s.contentDOM;t=t.parentNode)if(!t||t.nodeType==11||(n=be.get(t))&&n.ignoreEvent(e))return!1;return!0}const ft=Object.create(null),it=Object.create(null),fd=H.ie&&H.ie_version<15||H.ios&&H.webkit_version<604;function db(s){let e=s.dom.parentNode;if(!e)return;let t=e.appendChild(document.createElement("textarea"));t.style.cssText="position: fixed; left: -10000px; top: 10px",t.focus(),setTimeout(()=>{s.focus(),t.remove(),pd(s,t.value)},50)}function Wr(s,e,t){for(let n of s.facet(e))t=n(t,s);return t}function pd(s,e){e=Wr(s.state,ha,e);let{state:t}=s,n,r=1,i=t.toText(e),o=i.lines==t.selection.ranges.length;if(no!=null&&t.selection.ranges.every(l=>l.empty)&&no==i.toString()){let l=-1;n=t.changeByRange(c=>{let h=t.doc.lineAt(c.from);if(h.from==l)return{range:c};l=h.from;let d=t.toText((o?i.line(r++).text:e)+t.lineBreak);return{changes:{from:h.from,insert:d},range:K.cursor(c.from+d.length)}})}else o?n=t.changeByRange(l=>{let c=i.line(r++);return{changes:{from:l.from,to:l.to,insert:c.text},range:K.cursor(l.from+c.length)}}):n=t.replaceSelection(i);s.dispatch(n,{userEvent:"input.paste",scrollIntoView:!0})}it.scroll=s=>{s.inputState.lastScrollTop=s.scrollDOM.scrollTop,s.inputState.lastScrollLeft=s.scrollDOM.scrollLeft};ft.keydown=(s,e)=>(s.inputState.setSelectionOrigin("select"),e.keyCode==27&&s.inputState.tabFocusMode!=0&&(s.inputState.tabFocusMode=Date.now()+2e3),!1);it.touchstart=(s,e)=>{s.inputState.lastTouchTime=Date.now(),s.inputState.setSelectionOrigin("select.pointer")};it.touchmove=s=>{s.inputState.setSelectionOrigin("select.pointer")};ft.mousedown=(s,e)=>{if(s.observer.flush(),s.inputState.lastTouchTime>Date.now()-2e3)return!1;let t=null;for(let n of s.state.facet(Qh))if(t=n(s,e),t)break;if(!t&&e.button==0&&(t=pb(s,e)),t){let n=!s.hasFocus;s.inputState.startMouseSelection(new ob(s,e,t,n)),n&&s.observer.ignore(()=>{Mh(s.contentDOM);let i=s.root.activeElement;i&&!i.contains(s.contentDOM)&&i.blur()});let r=s.inputState.mouseSelection;if(r)return r.start(e),r.dragging===!1}return!1};function Ml(s,e,t,n){if(n==1)return K.cursor(e,t);if(n==2)return qv(s.state,e,t);{let r=Ee.find(s.docView,e),i=s.state.doc.lineAt(r?r.posAtEnd:e),o=r?r.posAtStart:i.from,a=r?r.posAtEnd:i.to;return a<s.state.doc.length&&a==i.to&&a++,K.range(o,a)}}let Pl=(s,e,t)=>e>=t.top&&e<=t.bottom&&s>=t.left&&s<=t.right;function ub(s,e,t,n){let r=Ee.find(s.docView,e);if(!r)return 1;let i=e-r.posAtStart;if(i==0)return 1;if(i==r.length)return-1;let o=r.coordsAt(i,-1);if(o&&Pl(t,n,o))return-1;let a=r.coordsAt(i,1);return a&&Pl(t,n,a)?1:o&&o.bottom>=n?-1:1}function Al(s,e){let t=s.posAtCoords({x:e.clientX,y:e.clientY},!1);return{pos:t,bias:ub(s,t,e.clientX,e.clientY)}}const fb=H.ie&&H.ie_version<=11;let Tl=null,zl=0,Nl=0;function md(s){if(!fb)return s.detail;let e=Tl,t=Nl;return Tl=s,Nl=Date.now(),zl=!e||t>Date.now()-400&&Math.abs(e.clientX-s.clientX)<2&&Math.abs(e.clientY-s.clientY)<2?(zl+1)%3:1}function pb(s,e){let t=Al(s,e),n=md(e),r=s.state.selection;return{update(i){i.docChanged&&(t.pos=i.changes.mapPos(t.pos),r=r.map(i.changes))},get(i,o,a){let l=Al(s,i),c,h=Ml(s,l.pos,l.bias,n);if(t.pos!=l.pos&&!o){let d=Ml(s,t.pos,t.bias,n),u=Math.min(d.from,h.from),f=Math.max(d.to,h.to);h=u<h.from?K.range(u,f):K.range(f,u)}return o?r.replaceRange(r.main.extend(h.from,h.to)):a&&n==1&&r.ranges.length>1&&(c=mb(r,l.pos))?c:a?r.addRange(h):K.create([h])}}}function mb(s,e){for(let t=0;t<s.ranges.length;t++){let{from:n,to:r}=s.ranges[t];if(n<=e&&r>=e)return K.create(s.ranges.slice(0,t).concat(s.ranges.slice(t+1)),s.mainIndex==t?0:s.mainIndex-(s.mainIndex>t?1:0))}return null}ft.dragstart=(s,e)=>{let{selection:{main:t}}=s.state;if(e.target.draggable){let r=s.docView.nearest(e.target);if(r&&r.isWidget){let i=r.posAtStart,o=i+r.length;(i>=t.to||o<=t.from)&&(t=K.range(i,o))}}let{inputState:n}=s;return n.mouseSelection&&(n.mouseSelection.dragging=!0),n.draggedContent=t,e.dataTransfer&&(e.dataTransfer.setData("Text",Wr(s.state,da,s.state.sliceDoc(t.from,t.to))),e.dataTransfer.effectAllowed="copyMove"),!1};ft.dragend=s=>(s.inputState.draggedContent=null,!1);function Rl(s,e,t,n){if(t=Wr(s.state,ha,t),!t)return;let r=s.posAtCoords({x:e.clientX,y:e.clientY},!1),{draggedContent:i}=s.inputState,o=n&&i&&lb(s,e)?{from:i.from,to:i.to}:null,a={from:r,insert:t},l=s.state.changes(o?[o,a]:a);s.focus(),s.dispatch({changes:l,selection:{anchor:l.mapPos(r,-1),head:l.mapPos(r,1)},userEvent:o?"move.drop":"input.drop"}),s.inputState.draggedContent=null}ft.drop=(s,e)=>{if(!e.dataTransfer)return!1;if(s.state.readOnly)return!0;let t=e.dataTransfer.files;if(t&&t.length){let n=Array(t.length),r=0,i=()=>{++r==t.length&&Rl(s,e,n.filter(o=>o!=null).join(s.state.lineBreak),!1)};for(let o=0;o<t.length;o++){let a=new FileReader;a.onerror=i,a.onload=()=>{/[\x00-\x08\x0e-\x1f]{2}/.test(a.result)||(n[o]=a.result),i()},a.readAsText(t[o])}return!0}else{let n=e.dataTransfer.getData("Text");if(n)return Rl(s,e,n,!0),!0}return!1};ft.paste=(s,e)=>{if(s.state.readOnly)return!0;s.observer.flush();let t=fd?null:e.clipboardData;return t?(pd(s,t.getData("text/plain")||t.getData("text/uri-list")),!0):(db(s),!1)};function gb(s,e){let t=s.dom.parentNode;if(!t)return;let n=t.appendChild(document.createElement("textarea"));n.style.cssText="position: fixed; left: -10000px; top: 10px",n.value=e,n.focus(),n.selectionEnd=e.length,n.selectionStart=0,setTimeout(()=>{n.remove(),s.focus()},50)}function vb(s){let e=[],t=[],n=!1;for(let r of s.selection.ranges)r.empty||(e.push(s.sliceDoc(r.from,r.to)),t.push(r));if(!e.length){let r=-1;for(let{from:i}of s.selection.ranges){let o=s.doc.lineAt(i);o.number>r&&(e.push(o.text),t.push({from:o.from,to:Math.min(s.doc.length,o.to+1)})),r=o.number}n=!0}return{text:Wr(s,da,e.join(s.lineBreak)),ranges:t,linewise:n}}let no=null;ft.copy=ft.cut=(s,e)=>{let{text:t,ranges:n,linewise:r}=vb(s.state);if(!t&&!r)return!1;no=r?t:null,e.type=="cut"&&!s.state.readOnly&&s.dispatch({changes:n,scrollIntoView:!0,userEvent:"delete.cut"});let i=fd?null:e.clipboardData;return i?(i.clearData(),i.setData("text/plain",t),!0):(gb(s,t),!1)};const gd=Yn.define();function vd(s,e){let t=[];for(let n of s.facet(ed)){let r=n(s,e);r&&t.push(r)}return t?s.update({effects:t,annotations:gd.of(!0)}):null}function bd(s){setTimeout(()=>{let e=s.hasFocus;if(e!=s.inputState.notifiedFocused){let t=vd(s.state,e);t?s.dispatch(t):s.update([])}},10)}it.focus=s=>{s.inputState.lastFocusTime=Date.now(),!s.scrollDOM.scrollTop&&(s.inputState.lastScrollTop||s.inputState.lastScrollLeft)&&(s.scrollDOM.scrollTop=s.inputState.lastScrollTop,s.scrollDOM.scrollLeft=s.inputState.lastScrollLeft),bd(s)};it.blur=s=>{s.observer.clearSelectionRange(),bd(s)};it.compositionstart=it.compositionupdate=s=>{s.observer.editContext||(s.inputState.compositionFirstChange==null&&(s.inputState.compositionFirstChange=!0),s.inputState.composing<0&&(s.inputState.composing=0))};it.compositionend=s=>{s.observer.editContext||(s.inputState.composing=-1,s.inputState.compositionEndedAt=Date.now(),s.inputState.compositionPendingKey=!0,s.inputState.compositionPendingChange=s.observer.pendingRecords().length>0,s.inputState.compositionFirstChange=null,H.chrome&&H.android?s.observer.flushSoon():s.inputState.compositionPendingChange?Promise.resolve().then(()=>s.observer.flush()):setTimeout(()=>{s.inputState.composing<0&&s.docView.hasComposition&&s.update([])},50))};it.contextmenu=s=>{s.inputState.lastContextMenu=Date.now()};ft.beforeinput=(s,e)=>{var t,n;if(e.inputType=="insertReplacementText"&&s.observer.editContext){let i=(t=e.dataTransfer)===null||t===void 0?void 0:t.getData("text/plain"),o=e.getTargetRanges();if(i&&o.length){let a=o[0],l=s.posAtDOM(a.startContainer,a.startOffset),c=s.posAtDOM(a.endContainer,a.endOffset);return pa(s,{from:l,to:c,insert:s.state.toText(i)},null),!0}}let r;if(H.chrome&&H.android&&(r=ud.find(i=>i.inputType==e.inputType))&&(s.observer.delayAndroidKey(r.key,r.keyCode),r.key=="Backspace"||r.key=="Delete")){let i=((n=window.visualViewport)===null||n===void 0?void 0:n.height)||0;setTimeout(()=>{var o;(((o=window.visualViewport)===null||o===void 0?void 0:o.height)||0)>i+10&&s.hasFocus&&(s.contentDOM.blur(),s.focus())},100)}return H.ios&&e.inputType=="deleteContentForward"&&s.observer.flushSoon(),H.safari&&e.inputType=="insertText"&&s.inputState.composing>=0&&setTimeout(()=>it.compositionend(s,e),20),!1};const Dl=new Set;function bb(s){Dl.has(s)||(Dl.add(s),s.addEventListener("copy",()=>{}),s.addEventListener("cut",()=>{}))}const Il=["pre-wrap","normal","pre-line","break-spaces"];let Fn=!1;function ql(){Fn=!1}class yb{constructor(e){this.lineWrapping=e,this.doc=fe.empty,this.heightSamples={},this.lineHeight=14,this.charWidth=7,this.textHeight=14,this.lineLength=30}heightForGap(e,t){let n=this.doc.lineAt(t).number-this.doc.lineAt(e).number+1;return this.lineWrapping&&(n+=Math.max(0,Math.ceil((t-e-n*this.lineLength*.5)/this.lineLength))),this.lineHeight*n}heightForLine(e){return this.lineWrapping?(1+Math.max(0,Math.ceil((e-this.lineLength)/(this.lineLength-5))))*this.lineHeight:this.lineHeight}setDoc(e){return this.doc=e,this}mustRefreshForWrapping(e){return Il.indexOf(e)>-1!=this.lineWrapping}mustRefreshForHeights(e){let t=!1;for(let n=0;n<e.length;n++){let r=e[n];r<0?n++:this.heightSamples[Math.floor(r*10)]||(t=!0,this.heightSamples[Math.floor(r*10)]=!0)}return t}refresh(e,t,n,r,i,o){let a=Il.indexOf(e)>-1,l=Math.round(t)!=Math.round(this.lineHeight)||this.lineWrapping!=a;if(this.lineWrapping=a,this.lineHeight=t,this.charWidth=n,this.textHeight=r,this.lineLength=i,l){this.heightSamples={};for(let c=0;c<o.length;c++){let h=o[c];h<0?c++:this.heightSamples[Math.floor(h*10)]=!0}}return l}}class wb{constructor(e,t){this.from=e,this.heights=t,this.index=0}get more(){return this.index<this.heights.length}}class wt{constructor(e,t,n,r,i){this.from=e,this.length=t,this.top=n,this.height=r,this._content=i}get type(){return typeof this._content=="number"?_t.Text:Array.isArray(this._content)?this._content:this._content.type}get to(){return this.from+this.length}get bottom(){return this.top+this.height}get widget(){return this._content instanceof Qt?this._content.widget:null}get widgetLineBreaks(){return typeof this._content=="number"?this._content:0}join(e){let t=(Array.isArray(this._content)?this._content:[this]).concat(Array.isArray(e._content)?e._content:[e]);return new wt(this.from,this.length+e.length,this.top,this.height+e.height,t)}}var we=function(s){return s[s.ByPos=0]="ByPos",s[s.ByHeight=1]="ByHeight",s[s.ByPosNoHeight=2]="ByPosNoHeight",s}(we||(we={}));const vr=.001;class Ke{constructor(e,t,n=2){this.length=e,this.height=t,this.flags=n}get outdated(){return(this.flags&2)>0}set outdated(e){this.flags=(e?2:0)|this.flags&-3}setHeight(e){this.height!=e&&(Math.abs(this.height-e)>vr&&(Fn=!0),this.height=e)}replace(e,t,n){return Ke.of(n)}decomposeLeft(e,t){t.push(this)}decomposeRight(e,t){t.push(this)}applyChanges(e,t,n,r){let i=this,o=n.doc;for(let a=r.length-1;a>=0;a--){let{fromA:l,toA:c,fromB:h,toB:d}=r[a],u=i.lineAt(l,we.ByPosNoHeight,n.setDoc(t),0,0),f=u.to>=c?u:i.lineAt(c,we.ByPosNoHeight,n,0,0);for(d+=f.to-c,c=f.to;a>0&&u.from<=r[a-1].toA;)l=r[a-1].fromA,h=r[a-1].fromB,a--,l<u.from&&(u=i.lineAt(l,we.ByPosNoHeight,n,0,0));h+=u.from-l,l=u.from;let m=ma.build(n.setDoc(o),e,h,d);i=$r(i,i.replace(l,c,m))}return i.updateHeight(n,0)}static empty(){return new Ze(0,0)}static of(e){if(e.length==1)return e[0];let t=0,n=e.length,r=0,i=0;for(;;)if(t==n)if(r>i*2){let a=e[t-1];a.break?e.splice(--t,1,a.left,null,a.right):e.splice(--t,1,a.left,a.right),n+=1+a.break,r-=a.size}else if(i>r*2){let a=e[n];a.break?e.splice(n,1,a.left,null,a.right):e.splice(n,1,a.left,a.right),n+=2+a.break,i-=a.size}else break;else if(r<i){let a=e[t++];a&&(r+=a.size)}else{let a=e[--n];a&&(i+=a.size)}let o=0;return e[t-1]==null?(o=1,t--):e[t]==null&&(o=1,n++),new jb(Ke.of(e.slice(0,t)),o,Ke.of(e.slice(n)))}}function $r(s,e){return s==e?s:(s.constructor!=e.constructor&&(Fn=!0),e)}Ke.prototype.size=1;class yd extends Ke{constructor(e,t,n){super(e,t),this.deco=n}blockAt(e,t,n,r){return new wt(r,this.length,n,this.height,this.deco||0)}lineAt(e,t,n,r,i){return this.blockAt(0,n,r,i)}forEachLine(e,t,n,r,i,o){e<=i+this.length&&t>=i&&o(this.blockAt(0,n,r,i))}updateHeight(e,t=0,n=!1,r){return r&&r.from<=t&&r.more&&this.setHeight(r.heights[r.index++]),this.outdated=!1,this}toString(){return`block(${this.length})`}}class Ze extends yd{constructor(e,t){super(e,t,null),this.collapsed=0,this.widgetHeight=0,this.breaks=0}blockAt(e,t,n,r){return new wt(r,this.length,n,this.height,this.breaks)}replace(e,t,n){let r=n[0];return n.length==1&&(r instanceof Ze||r instanceof Ne&&r.flags&4)&&Math.abs(this.length-r.length)<10?(r instanceof Ne?r=new Ze(r.length,this.height):r.height=this.height,this.outdated||(r.outdated=!1),r):Ke.of(n)}updateHeight(e,t=0,n=!1,r){return r&&r.from<=t&&r.more?this.setHeight(r.heights[r.index++]):(n||this.outdated)&&this.setHeight(Math.max(this.widgetHeight,e.heightForLine(this.length-this.collapsed))+this.breaks*e.lineHeight),this.outdated=!1,this}toString(){return`line(${this.length}${this.collapsed?-this.collapsed:""}${this.widgetHeight?":"+this.widgetHeight:""})`}}class Ne extends Ke{constructor(e){super(e,0)}heightMetrics(e,t){let n=e.doc.lineAt(t).number,r=e.doc.lineAt(t+this.length).number,i=r-n+1,o,a=0;if(e.lineWrapping){let l=Math.min(this.height,e.lineHeight*i);o=l/i,this.length>i+1&&(a=(this.height-l)/(this.length-i-1))}else o=this.height/i;return{firstLine:n,lastLine:r,perLine:o,perChar:a}}blockAt(e,t,n,r){let{firstLine:i,lastLine:o,perLine:a,perChar:l}=this.heightMetrics(t,r);if(t.lineWrapping){let c=r+(e<t.lineHeight?0:Math.round(Math.max(0,Math.min(1,(e-n)/this.height))*this.length)),h=t.doc.lineAt(c),d=a+h.length*l,u=Math.max(n,e-d/2);return new wt(h.from,h.length,u,d,0)}else{let c=Math.max(0,Math.min(o-i,Math.floor((e-n)/a))),{from:h,length:d}=t.doc.line(i+c);return new wt(h,d,n+a*c,a,0)}}lineAt(e,t,n,r,i){if(t==we.ByHeight)return this.blockAt(e,n,r,i);if(t==we.ByPosNoHeight){let{from:f,to:m}=n.doc.lineAt(e);return new wt(f,m-f,0,0,0)}let{firstLine:o,perLine:a,perChar:l}=this.heightMetrics(n,i),c=n.doc.lineAt(e),h=a+c.length*l,d=c.number-o,u=r+a*d+l*(c.from-i-d);return new wt(c.from,c.length,Math.max(r,Math.min(u,r+this.height-h)),h,0)}forEachLine(e,t,n,r,i,o){e=Math.max(e,i),t=Math.min(t,i+this.length);let{firstLine:a,perLine:l,perChar:c}=this.heightMetrics(n,i);for(let h=e,d=r;h<=t;){let u=n.doc.lineAt(h);if(h==e){let m=u.number-a;d+=l*m+c*(e-i-m)}let f=l+c*u.length;o(new wt(u.from,u.length,d,f,0)),d+=f,h=u.to+1}}replace(e,t,n){let r=this.length-t;if(r>0){let i=n[n.length-1];i instanceof Ne?n[n.length-1]=new Ne(i.length+r):n.push(null,new Ne(r-1))}if(e>0){let i=n[0];i instanceof Ne?n[0]=new Ne(e+i.length):n.unshift(new Ne(e-1),null)}return Ke.of(n)}decomposeLeft(e,t){t.push(new Ne(e-1),null)}decomposeRight(e,t){t.push(null,new Ne(this.length-e-1))}updateHeight(e,t=0,n=!1,r){let i=t+this.length;if(r&&r.from<=t+this.length&&r.more){let o=[],a=Math.max(t,r.from),l=-1;for(r.from>t&&o.push(new Ne(r.from-t-1).updateHeight(e,t));a<=i&&r.more;){let h=e.doc.lineAt(a).length;o.length&&o.push(null);let d=r.heights[r.index++];l==-1?l=d:Math.abs(d-l)>=vr&&(l=-2);let u=new Ze(h,d);u.outdated=!1,o.push(u),a+=h+1}a<=i&&o.push(null,new Ne(i-a).updateHeight(e,a));let c=Ke.of(o);return(l<0||Math.abs(c.height-this.height)>=vr||Math.abs(l-this.heightMetrics(e,t).perLine)>=vr)&&(Fn=!0),$r(this,c)}else(n||this.outdated)&&(this.setHeight(e.heightForGap(t,t+this.length)),this.outdated=!1);return this}toString(){return`gap(${this.length})`}}class jb extends Ke{constructor(e,t,n){super(e.length+t+n.length,e.height+n.height,t|(e.outdated||n.outdated?2:0)),this.left=e,this.right=n,this.size=e.size+n.size}get break(){return this.flags&1}blockAt(e,t,n,r){let i=n+this.left.height;return e<i?this.left.blockAt(e,t,n,r):this.right.blockAt(e,t,i,r+this.left.length+this.break)}lineAt(e,t,n,r,i){let o=r+this.left.height,a=i+this.left.length+this.break,l=t==we.ByHeight?e<o:e<a,c=l?this.left.lineAt(e,t,n,r,i):this.right.lineAt(e,t,n,o,a);if(this.break||(l?c.to<a:c.from>a))return c;let h=t==we.ByPosNoHeight?we.ByPosNoHeight:we.ByPos;return l?c.join(this.right.lineAt(a,h,n,o,a)):this.left.lineAt(a,h,n,r,i).join(c)}forEachLine(e,t,n,r,i,o){let a=r+this.left.height,l=i+this.left.length+this.break;if(this.break)e<l&&this.left.forEachLine(e,t,n,r,i,o),t>=l&&this.right.forEachLine(e,t,n,a,l,o);else{let c=this.lineAt(l,we.ByPos,n,r,i);e<c.from&&this.left.forEachLine(e,c.from-1,n,r,i,o),c.to>=e&&c.from<=t&&o(c),t>c.to&&this.right.forEachLine(c.to+1,t,n,a,l,o)}}replace(e,t,n){let r=this.left.length+this.break;if(t<r)return this.balanced(this.left.replace(e,t,n),this.right);if(e>this.left.length)return this.balanced(this.left,this.right.replace(e-r,t-r,n));let i=[];e>0&&this.decomposeLeft(e,i);let o=i.length;for(let a of n)i.push(a);if(e>0&&Bl(i,o-1),t<this.length){let a=i.length;this.decomposeRight(t,i),Bl(i,a)}return Ke.of(i)}decomposeLeft(e,t){let n=this.left.length;if(e<=n)return this.left.decomposeLeft(e,t);t.push(this.left),this.break&&(n++,e>=n&&t.push(null)),e>n&&this.right.decomposeLeft(e-n,t)}decomposeRight(e,t){let n=this.left.length,r=n+this.break;if(e>=r)return this.right.decomposeRight(e-r,t);e<n&&this.left.decomposeRight(e,t),this.break&&e<r&&t.push(null),t.push(this.right)}balanced(e,t){return e.size>2*t.size||t.size>2*e.size?Ke.of(this.break?[e,null,t]:[e,t]):(this.left=$r(this.left,e),this.right=$r(this.right,t),this.setHeight(e.height+t.height),this.outdated=e.outdated||t.outdated,this.size=e.size+t.size,this.length=e.length+this.break+t.length,this)}updateHeight(e,t=0,n=!1,r){let{left:i,right:o}=this,a=t+i.length+this.break,l=null;return r&&r.from<=t+i.length&&r.more?l=i=i.updateHeight(e,t,n,r):i.updateHeight(e,t,n),r&&r.from<=a+o.length&&r.more?l=o=o.updateHeight(e,a,n,r):o.updateHeight(e,a,n),l?this.balanced(i,o):(this.height=this.left.height+this.right.height,this.outdated=!1,this)}toString(){return this.left+(this.break?" ":"-")+this.right}}function Bl(s,e){let t,n;s[e]==null&&(t=s[e-1])instanceof Ne&&(n=s[e+1])instanceof Ne&&s.splice(e-1,3,new Ne(t.length+1+n.length))}const xb=5;class ma{constructor(e,t){this.pos=e,this.oracle=t,this.nodes=[],this.lineStart=-1,this.lineEnd=-1,this.covering=null,this.writtenTo=e}get isCovered(){return this.covering&&this.nodes[this.nodes.length-1]==this.covering}span(e,t){if(this.lineStart>-1){let n=Math.min(t,this.lineEnd),r=this.nodes[this.nodes.length-1];r instanceof Ze?r.length+=n-this.pos:(n>this.pos||!this.isCovered)&&this.nodes.push(new Ze(n-this.pos,-1)),this.writtenTo=n,t>n&&(this.nodes.push(null),this.writtenTo++,this.lineStart=-1)}this.pos=t}point(e,t,n){if(e<t||n.heightRelevant){let r=n.widget?n.widget.estimatedHeight:0,i=n.widget?n.widget.lineBreaks:0;r<0&&(r=this.oracle.lineHeight);let o=t-e;n.block?this.addBlock(new yd(o,r,n)):(o||i||r>=xb)&&this.addLineDeco(r,i,o)}else t>e&&this.span(e,t);this.lineEnd>-1&&this.lineEnd<this.pos&&(this.lineEnd=this.oracle.doc.lineAt(this.pos).to)}enterLine(){if(this.lineStart>-1)return;let{from:e,to:t}=this.oracle.doc.lineAt(this.pos);this.lineStart=e,this.lineEnd=t,this.writtenTo<e&&((this.writtenTo<e-1||this.nodes[this.nodes.length-1]==null)&&this.nodes.push(this.blankContent(this.writtenTo,e-1)),this.nodes.push(null)),this.pos>e&&this.nodes.push(new Ze(this.pos-e,-1)),this.writtenTo=this.pos}blankContent(e,t){let n=new Ne(t-e);return this.oracle.doc.lineAt(e).to==t&&(n.flags|=4),n}ensureLine(){this.enterLine();let e=this.nodes.length?this.nodes[this.nodes.length-1]:null;if(e instanceof Ze)return e;let t=new Ze(0,-1);return this.nodes.push(t),t}addBlock(e){this.enterLine();let t=e.deco;t&&t.startSide>0&&!this.isCovered&&this.ensureLine(),this.nodes.push(e),this.writtenTo=this.pos=this.pos+e.length,t&&t.endSide>0&&(this.covering=e)}addLineDeco(e,t,n){let r=this.ensureLine();r.length+=n,r.collapsed+=n,r.widgetHeight=Math.max(r.widgetHeight,e),r.breaks+=t,this.writtenTo=this.pos=this.pos+n}finish(e){let t=this.nodes.length==0?null:this.nodes[this.nodes.length-1];this.lineStart>-1&&!(t instanceof Ze)&&!this.isCovered?this.nodes.push(new Ze(0,-1)):(this.writtenTo<this.pos||t==null)&&this.nodes.push(this.blankContent(this.writtenTo,this.pos));let n=e;for(let r of this.nodes)r instanceof Ze&&r.updateHeight(this.oracle,n),n+=r?r.length:1;return this.nodes}static build(e,t,n,r){let i=new ma(n,e);return je.spans(t,n,r,i,0),i.finish(n)}}function kb(s,e,t){let n=new Sb;return je.compare(s,e,t,n,0),n.changes}class Sb{constructor(){this.changes=[]}compareRange(){}comparePoint(e,t,n,r){(e<t||n&&n.heightRelevant||r&&r.heightRelevant)&&mr(e,t,this.changes,5)}}function _b(s,e){let t=s.getBoundingClientRect(),n=s.ownerDocument,r=n.defaultView||window,i=Math.max(0,t.left),o=Math.min(r.innerWidth,t.right),a=Math.max(0,t.top),l=Math.min(r.innerHeight,t.bottom);for(let c=s.parentNode;c&&c!=n.body;)if(c.nodeType==1){let h=c,d=window.getComputedStyle(h);if((h.scrollHeight>h.clientHeight||h.scrollWidth>h.clientWidth)&&d.overflow!="visible"){let u=h.getBoundingClientRect();i=Math.max(i,u.left),o=Math.min(o,u.right),a=Math.max(a,u.top),l=Math.min(c==s.parentNode?r.innerHeight:l,u.bottom)}c=d.position=="absolute"||d.position=="fixed"?h.offsetParent:h.parentNode}else if(c.nodeType==11)c=c.host;else break;return{left:i-t.left,right:Math.max(i,o)-t.left,top:a-(t.top+e),bottom:Math.max(a,l)-(t.top+e)}}function Eb(s,e){let t=s.getBoundingClientRect();return{left:0,right:t.right-t.left,top:e,bottom:t.bottom-(t.top+e)}}class ui{constructor(e,t,n,r){this.from=e,this.to=t,this.size=n,this.displaySize=r}static same(e,t){if(e.length!=t.length)return!1;for(let n=0;n<e.length;n++){let r=e[n],i=t[n];if(r.from!=i.from||r.to!=i.to||r.size!=i.size)return!1}return!0}draw(e,t){return Me.replace({widget:new Cb(this.displaySize*(t?e.scaleY:e.scaleX),t)}).range(this.from,this.to)}}class Cb extends la{constructor(e,t){super(),this.size=e,this.vertical=t}eq(e){return e.size==this.size&&e.vertical==this.vertical}toDOM(){let e=document.createElement("div");return this.vertical?e.style.height=this.size+"px":(e.style.width=this.size+"px",e.style.height="2px",e.style.display="inline-block"),e}get estimatedHeight(){return this.vertical?this.size:-1}}class Ll{constructor(e){this.state=e,this.pixelViewport={left:0,right:window.innerWidth,top:0,bottom:0},this.inView=!0,this.paddingTop=0,this.paddingBottom=0,this.contentDOMWidth=0,this.contentDOMHeight=0,this.editorHeight=0,this.editorWidth=0,this.scrollTop=0,this.scrolledToBottom=!1,this.scaleX=1,this.scaleY=1,this.scrollAnchorPos=0,this.scrollAnchorHeight=-1,this.scaler=Fl,this.scrollTarget=null,this.printing=!1,this.mustMeasureContent=!0,this.defaultTextDirection=qe.LTR,this.visibleRanges=[],this.mustEnforceCursorAssoc=!1;let t=e.facet(ua).some(n=>typeof n!="function"&&n.class=="cm-lineWrapping");this.heightOracle=new yb(t),this.stateDeco=e.facet(Ms).filter(n=>typeof n!="function"),this.heightMap=Ke.empty().applyChanges(this.stateDeco,fe.empty,this.heightOracle.setDoc(e.doc),[new st(0,0,0,e.doc.length)]);for(let n=0;n<2&&(this.viewport=this.getViewport(0,null),!!this.updateForViewport());n++);this.updateViewportLines(),this.lineGaps=this.ensureLineGaps([]),this.lineGapDeco=Me.set(this.lineGaps.map(n=>n.draw(this,!1))),this.computeVisibleRanges()}updateForViewport(){let e=[this.viewport],{main:t}=this.state.selection;for(let n=0;n<=1;n++){let r=n?t.head:t.anchor;if(!e.some(({from:i,to:o})=>r>=i&&r<=o)){let{from:i,to:o}=this.lineBlockAt(r);e.push(new Zs(i,o))}}return this.viewports=e.sort((n,r)=>n.from-r.from),this.updateScaler()}updateScaler(){let e=this.scaler;return this.scaler=this.heightMap.height<=7e6?Fl:new ga(this.heightOracle,this.heightMap,this.viewports),e.eq(this.scaler)?0:2}updateViewportLines(){this.viewportLines=[],this.heightMap.forEachLine(this.viewport.from,this.viewport.to,this.heightOracle.setDoc(this.state.doc),0,0,e=>{this.viewportLines.push(ps(e,this.scaler))})}update(e,t=null){this.state=e.state;let n=this.stateDeco;this.stateDeco=this.state.facet(Ms).filter(h=>typeof h!="function");let r=e.changedRanges,i=st.extendWithRanges(r,kb(n,this.stateDeco,e?e.changes:Pe.empty(this.state.doc.length))),o=this.heightMap.height,a=this.scrolledToBottom?null:this.scrollAnchorAt(this.scrollTop);ql(),this.heightMap=this.heightMap.applyChanges(this.stateDeco,e.startState.doc,this.heightOracle.setDoc(this.state.doc),i),(this.heightMap.height!=o||Fn)&&(e.flags|=2),a?(this.scrollAnchorPos=e.changes.mapPos(a.from,-1),this.scrollAnchorHeight=a.top):(this.scrollAnchorPos=-1,this.scrollAnchorHeight=this.heightMap.height);let l=i.length?this.mapViewport(this.viewport,e.changes):this.viewport;(t&&(t.range.head<l.from||t.range.head>l.to)||!this.viewportIsAppropriate(l))&&(l=this.getViewport(0,t));let c=l.from!=this.viewport.from||l.to!=this.viewport.to;this.viewport=l,e.flags|=this.updateForViewport(),(c||!e.changes.empty||e.flags&2)&&this.updateViewportLines(),(this.lineGaps.length||this.viewport.to-this.viewport.from>4e3)&&this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps,e.changes))),e.flags|=this.computeVisibleRanges(e.changes),t&&(this.scrollTarget=t),!this.mustEnforceCursorAssoc&&e.selectionSet&&e.view.lineWrapping&&e.state.selection.main.empty&&e.state.selection.main.assoc&&!e.state.facet(Mv)&&(this.mustEnforceCursorAssoc=!0)}measure(e){let t=e.contentDOM,n=window.getComputedStyle(t),r=this.heightOracle,i=n.whiteSpace;this.defaultTextDirection=n.direction=="rtl"?qe.RTL:qe.LTR;let o=this.heightOracle.mustRefreshForWrapping(i),a=t.getBoundingClientRect(),l=o||this.mustMeasureContent||this.contentDOMHeight!=a.height;this.contentDOMHeight=a.height,this.mustMeasureContent=!1;let c=0,h=0;if(a.width&&a.height){let{scaleX:P,scaleY:A}=$h(t,a);(P>.005&&Math.abs(this.scaleX-P)>.005||A>.005&&Math.abs(this.scaleY-A)>.005)&&(this.scaleX=P,this.scaleY=A,c|=16,o=l=!0)}let d=(parseInt(n.paddingTop)||0)*this.scaleY,u=(parseInt(n.paddingBottom)||0)*this.scaleY;(this.paddingTop!=d||this.paddingBottom!=u)&&(this.paddingTop=d,this.paddingBottom=u,c|=18),this.editorWidth!=e.scrollDOM.clientWidth&&(r.lineWrapping&&(l=!0),this.editorWidth=e.scrollDOM.clientWidth,c|=16);let f=e.scrollDOM.scrollTop*this.scaleY;this.scrollTop!=f&&(this.scrollAnchorHeight=-1,this.scrollTop=f),this.scrolledToBottom=Ah(e.scrollDOM);let m=(this.printing?Eb:_b)(t,this.paddingTop),y=m.top-this.pixelViewport.top,b=m.bottom-this.pixelViewport.bottom;this.pixelViewport=m;let g=this.pixelViewport.bottom>this.pixelViewport.top&&this.pixelViewport.right>this.pixelViewport.left;if(g!=this.inView&&(this.inView=g,g&&(l=!0)),!this.inView&&!this.scrollTarget)return 0;let x=a.width;if((this.contentDOMWidth!=x||this.editorHeight!=e.scrollDOM.clientHeight)&&(this.contentDOMWidth=a.width,this.editorHeight=e.scrollDOM.clientHeight,c|=16),l){let P=e.docView.measureVisibleLineHeights(this.viewport);if(r.mustRefreshForHeights(P)&&(o=!0),o||r.lineWrapping&&Math.abs(x-this.contentDOMWidth)>r.charWidth){let{lineHeight:A,charWidth:N,textHeight:D}=e.docView.measureTextSize();o=A>0&&r.refresh(i,A,N,D,x/N,P),o&&(e.docView.minWidth=0,c|=16)}y>0&&b>0?h=Math.max(y,b):y<0&&b<0&&(h=Math.min(y,b)),ql();for(let A of this.viewports){let N=A.from==this.viewport.from?P:e.docView.measureVisibleLineHeights(A);this.heightMap=(o?Ke.empty().applyChanges(this.stateDeco,fe.empty,this.heightOracle,[new st(0,0,0,e.state.doc.length)]):this.heightMap).updateHeight(r,0,o,new wb(A.from,N))}Fn&&(c|=2)}let C=!this.viewportIsAppropriate(this.viewport,h)||this.scrollTarget&&(this.scrollTarget.range.head<this.viewport.from||this.scrollTarget.range.head>this.viewport.to);return C&&(c&2&&(c|=this.updateScaler()),this.viewport=this.getViewport(h,this.scrollTarget),c|=this.updateForViewport()),(c&2||C)&&this.updateViewportLines(),(this.lineGaps.length||this.viewport.to-this.viewport.from>4e3)&&this.updateLineGaps(this.ensureLineGaps(o?[]:this.lineGaps,e)),c|=this.computeVisibleRanges(),this.mustEnforceCursorAssoc&&(this.mustEnforceCursorAssoc=!1,e.docView.enforceCursorAssoc()),c}get visibleTop(){return this.scaler.fromDOM(this.pixelViewport.top)}get visibleBottom(){return this.scaler.fromDOM(this.pixelViewport.bottom)}getViewport(e,t){let n=.5-Math.max(-.5,Math.min(.5,e/1e3/2)),r=this.heightMap,i=this.heightOracle,{visibleTop:o,visibleBottom:a}=this,l=new Zs(r.lineAt(o-n*1e3,we.ByHeight,i,0,0).from,r.lineAt(a+(1-n)*1e3,we.ByHeight,i,0,0).to);if(t){let{head:c}=t.range;if(c<l.from||c>l.to){let h=Math.min(this.editorHeight,this.pixelViewport.bottom-this.pixelViewport.top),d=r.lineAt(c,we.ByPos,i,0,0),u;t.y=="center"?u=(d.top+d.bottom)/2-h/2:t.y=="start"||t.y=="nearest"&&c<l.from?u=d.top:u=d.bottom-h,l=new Zs(r.lineAt(u-1e3/2,we.ByHeight,i,0,0).from,r.lineAt(u+h+1e3/2,we.ByHeight,i,0,0).to)}}return l}mapViewport(e,t){let n=t.mapPos(e.from,-1),r=t.mapPos(e.to,1);return new Zs(this.heightMap.lineAt(n,we.ByPos,this.heightOracle,0,0).from,this.heightMap.lineAt(r,we.ByPos,this.heightOracle,0,0).to)}viewportIsAppropriate({from:e,to:t},n=0){if(!this.inView)return!0;let{top:r}=this.heightMap.lineAt(e,we.ByPos,this.heightOracle,0,0),{bottom:i}=this.heightMap.lineAt(t,we.ByPos,this.heightOracle,0,0),{visibleTop:o,visibleBottom:a}=this;return(e==0||r<=o-Math.max(10,Math.min(-n,250)))&&(t==this.state.doc.length||i>=a+Math.max(10,Math.min(n,250)))&&r>o-2*1e3&&i<a+2*1e3}mapLineGaps(e,t){if(!e.length||t.empty)return e;let n=[];for(let r of e)t.touchesRange(r.from,r.to)||n.push(new ui(t.mapPos(r.from),t.mapPos(r.to),r.size,r.displaySize));return n}ensureLineGaps(e,t){let n=this.heightOracle.lineWrapping,r=n?1e4:2e3,i=r>>1,o=r<<1;if(this.defaultTextDirection!=qe.LTR&&!n)return[];let a=[],l=(h,d,u,f)=>{if(d-h<i)return;let m=this.state.selection.main,y=[m.from];m.empty||y.push(m.to);for(let g of y)if(g>h&&g<d){l(h,g-10,u,f),l(g+10,d,u,f);return}let b=$b(e,g=>g.from>=u.from&&g.to<=u.to&&Math.abs(g.from-h)<i&&Math.abs(g.to-d)<i&&!y.some(x=>g.from<x&&g.to>x));if(!b){if(d<u.to&&t&&n&&t.visibleRanges.some(C=>C.from<=d&&C.to>=d)){let C=t.moveToLineBoundary(K.cursor(d),!1,!0).head;C>h&&(d=C)}let g=this.gapSize(u,h,d,f),x=n||g<2e6?g:2e6;b=new ui(h,d,g,x)}a.push(b)},c=h=>{if(h.length<o||h.type!=_t.Text)return;let d=Ob(h.from,h.to,this.stateDeco);if(d.total<o)return;let u=this.scrollTarget?this.scrollTarget.range.head:null,f,m;if(n){let y=r/this.heightOracle.lineLength*this.heightOracle.lineHeight,b,g;if(u!=null){let x=tr(d,u),C=((this.visibleBottom-this.visibleTop)/2+y)/h.height;b=x-C,g=x+C}else b=(this.visibleTop-h.top-y)/h.height,g=(this.visibleBottom-h.top+y)/h.height;f=er(d,b),m=er(d,g)}else{let y=d.total*this.heightOracle.charWidth,b=r*this.heightOracle.charWidth,g=0;if(y>2e6)for(let N of e)N.from>=h.from&&N.from<h.to&&N.size!=N.displaySize&&N.from*this.heightOracle.charWidth+g<this.pixelViewport.left&&(g=N.size-N.displaySize);let x=this.pixelViewport.left+g,C=this.pixelViewport.right+g,P,A;if(u!=null){let N=tr(d,u),D=((C-x)/2+b)/y;P=N-D,A=N+D}else P=(x-b)/y,A=(C+b)/y;f=er(d,P),m=er(d,A)}f>h.from&&l(h.from,f,h,d),m<h.to&&l(m,h.to,h,d)};for(let h of this.viewportLines)Array.isArray(h.type)?h.type.forEach(c):c(h);return a}gapSize(e,t,n,r){let i=tr(r,n)-tr(r,t);return this.heightOracle.lineWrapping?e.height*i:r.total*this.heightOracle.charWidth*i}updateLineGaps(e){ui.same(e,this.lineGaps)||(this.lineGaps=e,this.lineGapDeco=Me.set(e.map(t=>t.draw(this,this.heightOracle.lineWrapping))))}computeVisibleRanges(e){let t=this.stateDeco;this.lineGaps.length&&(t=t.concat(this.lineGapDeco));let n=[];je.spans(t,this.viewport.from,this.viewport.to,{span(i,o){n.push({from:i,to:o})},point(){}},20);let r=0;if(n.length!=this.visibleRanges.length)r=12;else for(let i=0;i<n.length&&!(r&8);i++){let o=this.visibleRanges[i],a=n[i];(o.from!=a.from||o.to!=a.to)&&(r|=4,e&&e.mapPos(o.from,-1)==a.from&&e.mapPos(o.to,1)==a.to||(r|=8))}return this.visibleRanges=n,r}lineBlockAt(e){return e>=this.viewport.from&&e<=this.viewport.to&&this.viewportLines.find(t=>t.from<=e&&t.to>=e)||ps(this.heightMap.lineAt(e,we.ByPos,this.heightOracle,0,0),this.scaler)}lineBlockAtHeight(e){return e>=this.viewportLines[0].top&&e<=this.viewportLines[this.viewportLines.length-1].bottom&&this.viewportLines.find(t=>t.top<=e&&t.bottom>=e)||ps(this.heightMap.lineAt(this.scaler.fromDOM(e),we.ByHeight,this.heightOracle,0,0),this.scaler)}scrollAnchorAt(e){let t=this.lineBlockAtHeight(e+8);return t.from>=this.viewport.from||this.viewportLines[0].top-e>200?t:this.viewportLines[0]}elementAtHeight(e){return ps(this.heightMap.blockAt(this.scaler.fromDOM(e),this.heightOracle,0,0),this.scaler)}get docHeight(){return this.scaler.toDOM(this.heightMap.height)}get contentHeight(){return this.docHeight+this.paddingTop+this.paddingBottom}}class Zs{constructor(e,t){this.from=e,this.to=t}}function Ob(s,e,t){let n=[],r=s,i=0;return je.spans(t,s,e,{span(){},point(o,a){o>r&&(n.push({from:r,to:o}),i+=o-r),r=a}},20),r<e&&(n.push({from:r,to:e}),i+=e-r),{total:i,ranges:n}}function er({total:s,ranges:e},t){if(t<=0)return e[0].from;if(t>=1)return e[e.length-1].to;let n=Math.floor(s*t);for(let r=0;;r++){let{from:i,to:o}=e[r],a=o-i;if(n<=a)return i+n;n-=a}}function tr(s,e){let t=0;for(let{from:n,to:r}of s.ranges){if(e<=r){t+=e-n;break}t+=r-n}return t/s.total}function $b(s,e){for(let t of s)if(e(t))return t}const Fl={toDOM(s){return s},fromDOM(s){return s},scale:1,eq(s){return s==this}};class ga{constructor(e,t,n){let r=0,i=0,o=0;this.viewports=n.map(({from:a,to:l})=>{let c=t.lineAt(a,we.ByPos,e,0,0).top,h=t.lineAt(l,we.ByPos,e,0,0).bottom;return r+=h-c,{from:a,to:l,top:c,bottom:h,domTop:0,domBottom:0}}),this.scale=(7e6-r)/(t.height-r);for(let a of this.viewports)a.domTop=o+(a.top-i)*this.scale,o=a.domBottom=a.domTop+(a.bottom-a.top),i=a.bottom}toDOM(e){for(let t=0,n=0,r=0;;t++){let i=t<this.viewports.length?this.viewports[t]:null;if(!i||e<i.top)return r+(e-n)*this.scale;if(e<=i.bottom)return i.domTop+(e-i.top);n=i.bottom,r=i.domBottom}}fromDOM(e){for(let t=0,n=0,r=0;;t++){let i=t<this.viewports.length?this.viewports[t]:null;if(!i||e<i.domTop)return n+(e-r)/this.scale;if(e<=i.domBottom)return i.top+(e-i.domTop);n=i.bottom,r=i.domBottom}}eq(e){return e instanceof ga?this.scale==e.scale&&this.viewports.length==e.viewports.length&&this.viewports.every((t,n)=>t.from==e.viewports[n].from&&t.to==e.viewports[n].to):!1}}function ps(s,e){if(e.scale==1)return s;let t=e.toDOM(s.top),n=e.toDOM(s.bottom);return new wt(s.from,s.length,t,n-t,Array.isArray(s._content)?s._content.map(r=>ps(r,e)):s._content)}const nr=ee.define({combine:s=>s.join(" ")}),so=ee.define({combine:s=>s.indexOf(!0)>-1}),ro=Xt.newName(),wd=Xt.newName(),jd=Xt.newName(),xd={"&light":"."+wd,"&dark":"."+jd};function io(s,e,t){return new Xt(e,{finish(n){return/&/.test(n)?n.replace(/&\w*/,r=>{if(r=="&")return s;if(!t||!t[r])throw new RangeError(`Unsupported selector: ${r}`);return t[r]}):s+" "+n}})}const Mb=io("."+ro,{"&":{position:"relative !important",boxSizing:"border-box","&.cm-focused":{outline:"1px dotted #212121"},display:"flex !important",flexDirection:"column"},".cm-scroller":{display:"flex !important",alignItems:"flex-start !important",fontFamily:"monospace",lineHeight:1.4,height:"100%",overflowX:"auto",position:"relative",zIndex:0,overflowAnchor:"none"},".cm-content":{margin:0,flexGrow:2,flexShrink:0,display:"block",whiteSpace:"pre",wordWrap:"normal",boxSizing:"border-box",minHeight:"100%",padding:"4px 0",outline:"none","&[contenteditable=true]":{WebkitUserModify:"read-write-plaintext-only"}},".cm-lineWrapping":{whiteSpace_fallback:"pre-wrap",whiteSpace:"break-spaces",wordBreak:"break-word",overflowWrap:"anywhere",flexShrink:1},"&light .cm-content":{caretColor:"black"},"&dark .cm-content":{caretColor:"white"},".cm-line":{display:"block",padding:"0 2px 0 6px"},".cm-layer":{position:"absolute",left:0,top:0,contain:"size style","& > *":{position:"absolute"}},"&light .cm-selectionBackground":{background:"#d9d9d9"},"&dark .cm-selectionBackground":{background:"#222"},"&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":{background:"#d7d4f0"},"&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":{background:"#233"},".cm-cursorLayer":{pointerEvents:"none"},"&.cm-focused > .cm-scroller > .cm-cursorLayer":{animation:"steps(1) cm-blink 1.2s infinite"},"@keyframes cm-blink":{"0%":{},"50%":{opacity:0},"100%":{}},"@keyframes cm-blink2":{"0%":{},"50%":{opacity:0},"100%":{}},".cm-cursor, .cm-dropCursor":{borderLeft:"1.2px solid black",marginLeft:"-0.6px",pointerEvents:"none"},".cm-cursor":{display:"none"},"&dark .cm-cursor":{borderLeftColor:"#ddd"},".cm-dropCursor":{position:"absolute"},"&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor":{display:"block"},".cm-iso":{unicodeBidi:"isolate"},".cm-announced":{position:"fixed",top:"-10000px"},"@media print":{".cm-announced":{display:"none"}},"&light .cm-activeLine":{backgroundColor:"#cceeff44"},"&dark .cm-activeLine":{backgroundColor:"#99eeff33"},"&light .cm-specialChar":{color:"red"},"&dark .cm-specialChar":{color:"#f78"},".cm-gutters":{flexShrink:0,display:"flex",height:"100%",boxSizing:"border-box",insetInlineStart:0,zIndex:200},"&light .cm-gutters":{backgroundColor:"#f5f5f5",color:"#6c6c6c",borderRight:"1px solid #ddd"},"&dark .cm-gutters":{backgroundColor:"#333338",color:"#ccc"},".cm-gutter":{display:"flex !important",flexDirection:"column",flexShrink:0,boxSizing:"border-box",minHeight:"100%",overflow:"hidden"},".cm-gutterElement":{boxSizing:"border-box"},".cm-lineNumbers .cm-gutterElement":{padding:"0 3px 0 5px",minWidth:"20px",textAlign:"right",whiteSpace:"nowrap"},"&light .cm-activeLineGutter":{backgroundColor:"#e2f2ff"},"&dark .cm-activeLineGutter":{backgroundColor:"#222227"},".cm-panels":{boxSizing:"border-box",position:"sticky",left:0,right:0,zIndex:300},"&light .cm-panels":{backgroundColor:"#f5f5f5",color:"black"},"&light .cm-panels-top":{borderBottom:"1px solid #ddd"},"&light .cm-panels-bottom":{borderTop:"1px solid #ddd"},"&dark .cm-panels":{backgroundColor:"#333338",color:"white"},".cm-tab":{display:"inline-block",overflow:"hidden",verticalAlign:"bottom"},".cm-widgetBuffer":{verticalAlign:"text-top",height:"1em",width:0,display:"inline"},".cm-placeholder":{color:"#888",display:"inline-block",verticalAlign:"top"},".cm-highlightSpace":{backgroundImage:"radial-gradient(circle at 50% 55%, #aaa 20%, transparent 5%)",backgroundPosition:"center"},".cm-highlightTab":{backgroundImage:`url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,backgroundSize:"auto 100%",backgroundPosition:"right 90%",backgroundRepeat:"no-repeat"},".cm-trailingSpace":{backgroundColor:"#ff332255"},".cm-button":{verticalAlign:"middle",color:"inherit",fontSize:"70%",padding:".2em 1em",borderRadius:"1px"},"&light .cm-button":{backgroundImage:"linear-gradient(#eff1f5, #d9d9df)",border:"1px solid #888","&:active":{backgroundImage:"linear-gradient(#b4b4b4, #d0d3d6)"}},"&dark .cm-button":{backgroundImage:"linear-gradient(#393939, #111)",border:"1px solid #888","&:active":{backgroundImage:"linear-gradient(#111, #333)"}},".cm-textfield":{verticalAlign:"middle",color:"inherit",fontSize:"70%",border:"1px solid silver",padding:".2em .5em"},"&light .cm-textfield":{backgroundColor:"white"},"&dark .cm-textfield":{border:"1px solid #555",backgroundColor:"inherit"}},xd),Pb={childList:!0,characterData:!0,subtree:!0,attributes:!0,characterDataOldValue:!0},fi=H.ie&&H.ie_version<=11;class Ab{constructor(e){this.view=e,this.active=!1,this.editContext=null,this.selectionRange=new fv,this.selectionChanged=!1,this.delayedFlush=-1,this.resizeTimeout=-1,this.queue=[],this.delayedAndroidKey=null,this.flushingAndroidKey=-1,this.lastChange=0,this.scrollTargets=[],this.intersection=null,this.resizeScroll=null,this.intersecting=!1,this.gapIntersection=null,this.gaps=[],this.printQuery=null,this.parentCheck=-1,this.dom=e.contentDOM,this.observer=new MutationObserver(t=>{for(let n of t)this.queue.push(n);(H.ie&&H.ie_version<=11||H.ios&&e.composing)&&t.some(n=>n.type=="childList"&&n.removedNodes.length||n.type=="characterData"&&n.oldValue.length>n.target.nodeValue.length)?this.flushSoon():this.flush()}),window.EditContext&&e.constructor.EDIT_CONTEXT!==!1&&!(H.chrome&&H.chrome_version<126)&&(this.editContext=new zb(e),e.state.facet(Pt)&&(e.contentDOM.editContext=this.editContext.editContext)),fi&&(this.onCharData=t=>{this.queue.push({target:t.target,type:"characterData",oldValue:t.prevValue}),this.flushSoon()}),this.onSelectionChange=this.onSelectionChange.bind(this),this.onResize=this.onResize.bind(this),this.onPrint=this.onPrint.bind(this),this.onScroll=this.onScroll.bind(this),window.matchMedia&&(this.printQuery=window.matchMedia("print")),typeof ResizeObserver=="function"&&(this.resizeScroll=new ResizeObserver(()=>{var t;((t=this.view.docView)===null||t===void 0?void 0:t.lastUpdate)<Date.now()-75&&this.onResize()}),this.resizeScroll.observe(e.scrollDOM)),this.addWindowListeners(this.win=e.win),this.start(),typeof IntersectionObserver=="function"&&(this.intersection=new IntersectionObserver(t=>{this.parentCheck<0&&(this.parentCheck=setTimeout(this.listenForScroll.bind(this),1e3)),t.length>0&&t[t.length-1].intersectionRatio>0!=this.intersecting&&(this.intersecting=!this.intersecting,this.intersecting!=this.view.inView&&this.onScrollChanged(document.createEvent("Event")))},{threshold:[0,.001]}),this.intersection.observe(this.dom),this.gapIntersection=new IntersectionObserver(t=>{t.length>0&&t[t.length-1].intersectionRatio>0&&this.onScrollChanged(document.createEvent("Event"))},{})),this.listenForScroll(),this.readSelectionRange()}onScrollChanged(e){this.view.inputState.runHandlers("scroll",e),this.intersecting&&this.view.measure()}onScroll(e){this.intersecting&&this.flush(!1),this.editContext&&this.view.requestMeasure(this.editContext.measureReq),this.onScrollChanged(e)}onResize(){this.resizeTimeout<0&&(this.resizeTimeout=setTimeout(()=>{this.resizeTimeout=-1,this.view.requestMeasure()},50))}onPrint(e){(e.type=="change"||!e.type)&&!e.matches||(this.view.viewState.printing=!0,this.view.measure(),setTimeout(()=>{this.view.viewState.printing=!1,this.view.requestMeasure()},500))}updateGaps(e){if(this.gapIntersection&&(e.length!=this.gaps.length||this.gaps.some((t,n)=>t!=e[n]))){this.gapIntersection.disconnect();for(let t of e)this.gapIntersection.observe(t);this.gaps=e}}onSelectionChange(e){let t=this.selectionChanged;if(!this.readSelectionRange()||this.delayedAndroidKey)return;let{view:n}=this,r=this.selectionRange;if(n.state.facet(Pt)?n.root.activeElement!=this.dom:!pr(this.dom,r))return;let i=r.anchorNode&&n.docView.nearest(r.anchorNode);if(i&&i.ignoreEvent(e)){t||(this.selectionChanged=!1);return}(H.ie&&H.ie_version<=11||H.android&&H.chrome)&&!n.state.selection.main.empty&&r.focusNode&&ks(r.focusNode,r.focusOffset,r.anchorNode,r.anchorOffset)?this.flushSoon():this.flush(!1)}readSelectionRange(){let{view:e}=this,t=Os(e.root);if(!t)return!1;let n=H.safari&&e.root.nodeType==11&&e.root.activeElement==this.dom&&Tb(this.view,t)||t;if(!n||this.selectionRange.eq(n))return!1;let r=pr(this.dom,n);return r&&!this.selectionChanged&&e.inputState.lastFocusTime>Date.now()-200&&e.inputState.lastTouchTime<Date.now()-300&&mv(this.dom,n)?(this.view.inputState.lastFocusTime=0,e.docView.updateSelection(),!1):(this.selectionRange.setRange(n),r&&(this.selectionChanged=!0),!0)}setSelectionRange(e,t){this.selectionRange.set(e.node,e.offset,t.node,t.offset),this.selectionChanged=!1}clearSelectionRange(){this.selectionRange.set(null,0,null,0)}listenForScroll(){this.parentCheck=-1;let e=0,t=null;for(let n=this.dom;n;)if(n.nodeType==1)!t&&e<this.scrollTargets.length&&this.scrollTargets[e]==n?e++:t||(t=this.scrollTargets.slice(0,e)),t&&t.push(n),n=n.assignedSlot||n.parentNode;else if(n.nodeType==11)n=n.host;else break;if(e<this.scrollTargets.length&&!t&&(t=this.scrollTargets.slice(0,e)),t){for(let n of this.scrollTargets)n.removeEventListener("scroll",this.onScroll);for(let n of this.scrollTargets=t)n.addEventListener("scroll",this.onScroll)}}ignore(e){if(!this.active)return e();try{return this.stop(),e()}finally{this.start(),this.clear()}}start(){this.active||(this.observer.observe(this.dom,Pb),fi&&this.dom.addEventListener("DOMCharacterDataModified",this.onCharData),this.active=!0)}stop(){this.active&&(this.active=!1,this.observer.disconnect(),fi&&this.dom.removeEventListener("DOMCharacterDataModified",this.onCharData))}clear(){this.processRecords(),this.queue.length=0,this.selectionChanged=!1}delayAndroidKey(e,t){var n;if(!this.delayedAndroidKey){let r=()=>{let i=this.delayedAndroidKey;i&&(this.clearDelayedAndroidKey(),this.view.inputState.lastKeyCode=i.keyCode,this.view.inputState.lastKeyTime=Date.now(),!this.flush()&&i.force&&An(this.dom,i.key,i.keyCode))};this.flushingAndroidKey=this.view.win.requestAnimationFrame(r)}(!this.delayedAndroidKey||e=="Enter")&&(this.delayedAndroidKey={key:e,keyCode:t,force:this.lastChange<Date.now()-50||!!(!((n=this.delayedAndroidKey)===null||n===void 0)&&n.force)})}clearDelayedAndroidKey(){this.win.cancelAnimationFrame(this.flushingAndroidKey),this.delayedAndroidKey=null,this.flushingAndroidKey=-1}flushSoon(){this.delayedFlush<0&&(this.delayedFlush=this.view.win.requestAnimationFrame(()=>{this.delayedFlush=-1,this.flush()}))}forceFlush(){this.delayedFlush>=0&&(this.view.win.cancelAnimationFrame(this.delayedFlush),this.delayedFlush=-1),this.flush()}pendingRecords(){for(let e of this.observer.takeRecords())this.queue.push(e);return this.queue}processRecords(){let e=this.pendingRecords();e.length&&(this.queue=[]);let t=-1,n=-1,r=!1;for(let i of e){let o=this.readMutation(i);o&&(o.typeOver&&(r=!0),t==-1?{from:t,to:n}=o:(t=Math.min(o.from,t),n=Math.max(o.to,n)))}return{from:t,to:n,typeOver:r}}readChange(){let{from:e,to:t,typeOver:n}=this.processRecords(),r=this.selectionChanged&&pr(this.dom,this.selectionRange);if(e<0&&!r)return null;e>-1&&(this.lastChange=Date.now()),this.view.inputState.lastFocusTime=0,this.selectionChanged=!1;let i=new Xv(this.view,e,t,n);return this.view.docView.domChanged={newSel:i.newSel?i.newSel.main:null},i}flush(e=!0){if(this.delayedFlush>=0||this.delayedAndroidKey)return!1;e&&this.readSelectionRange();let t=this.readChange();if(!t)return this.view.requestMeasure(),!1;let n=this.view.state,r=dd(this.view,t);return this.view.state==n&&(t.domChanged||t.newSel&&!t.newSel.main.eq(this.view.state.selection.main))&&this.view.update([]),r}readMutation(e){let t=this.view.docView.nearest(e.target);if(!t||t.ignoreMutation(e))return null;if(t.markDirty(e.type=="attributes"),e.type=="attributes"&&(t.flags|=4),e.type=="childList"){let n=Ul(t,e.previousSibling||e.target.previousSibling,-1),r=Ul(t,e.nextSibling||e.target.nextSibling,1);return{from:n?t.posAfter(n):t.posAtStart,to:r?t.posBefore(r):t.posAtEnd,typeOver:!1}}else return e.type=="characterData"?{from:t.posAtStart,to:t.posAtEnd,typeOver:e.target.nodeValue==e.oldValue}:null}setWindow(e){e!=this.win&&(this.removeWindowListeners(this.win),this.win=e,this.addWindowListeners(this.win))}addWindowListeners(e){e.addEventListener("resize",this.onResize),this.printQuery?this.printQuery.addEventListener?this.printQuery.addEventListener("change",this.onPrint):this.printQuery.addListener(this.onPrint):e.addEventListener("beforeprint",this.onPrint),e.addEventListener("scroll",this.onScroll),e.document.addEventListener("selectionchange",this.onSelectionChange)}removeWindowListeners(e){e.removeEventListener("scroll",this.onScroll),e.removeEventListener("resize",this.onResize),this.printQuery?this.printQuery.removeEventListener?this.printQuery.removeEventListener("change",this.onPrint):this.printQuery.removeListener(this.onPrint):e.removeEventListener("beforeprint",this.onPrint),e.document.removeEventListener("selectionchange",this.onSelectionChange)}update(e){this.editContext&&(this.editContext.update(e),e.startState.facet(Pt)!=e.state.facet(Pt)&&(e.view.contentDOM.editContext=e.state.facet(Pt)?this.editContext.editContext:null))}destroy(){var e,t,n;this.stop(),(e=this.intersection)===null||e===void 0||e.disconnect(),(t=this.gapIntersection)===null||t===void 0||t.disconnect(),(n=this.resizeScroll)===null||n===void 0||n.disconnect();for(let r of this.scrollTargets)r.removeEventListener("scroll",this.onScroll);this.removeWindowListeners(this.win),clearTimeout(this.parentCheck),clearTimeout(this.resizeTimeout),this.win.cancelAnimationFrame(this.delayedFlush),this.win.cancelAnimationFrame(this.flushingAndroidKey),this.editContext&&(this.view.contentDOM.editContext=null,this.editContext.destroy())}}function Ul(s,e,t){for(;e;){let n=be.get(e);if(n&&n.parent==s)return n;let r=e.parentNode;e=r!=s.dom?r:t>0?e.nextSibling:e.previousSibling}return null}function Hl(s,e){let t=e.startContainer,n=e.startOffset,r=e.endContainer,i=e.endOffset,o=s.docView.domAtPos(s.state.selection.main.anchor);return ks(o.node,o.offset,r,i)&&([t,n,r,i]=[r,i,t,n]),{anchorNode:t,anchorOffset:n,focusNode:r,focusOffset:i}}function Tb(s,e){if(e.getComposedRanges){let r=e.getComposedRanges(s.root)[0];if(r)return Hl(s,r)}let t=null;function n(r){r.preventDefault(),r.stopImmediatePropagation(),t=r.getTargetRanges()[0]}return s.contentDOM.addEventListener("beforeinput",n,!0),s.dom.ownerDocument.execCommand("indent"),s.contentDOM.removeEventListener("beforeinput",n,!0),t?Hl(s,t):null}class zb{constructor(e){this.from=0,this.to=0,this.pendingContextChange=null,this.handlers=Object.create(null),this.composing=null,this.resetRange(e.state);let t=this.editContext=new window.EditContext({text:e.state.doc.sliceString(this.from,this.to),selectionStart:this.toContextPos(Math.max(this.from,Math.min(this.to,e.state.selection.main.anchor))),selectionEnd:this.toContextPos(e.state.selection.main.head)});this.handlers.textupdate=n=>{let{anchor:r}=e.state.selection.main,i=this.toEditorPos(n.updateRangeStart),o=this.toEditorPos(n.updateRangeEnd);e.inputState.composing>=0&&!this.composing&&(this.composing={contextBase:n.updateRangeStart,editorBase:i,drifted:!1});let a={from:i,to:o,insert:fe.of(n.text.split(`
`))};if(a.from==this.from&&r<this.from?a.from=r:a.to==this.to&&r>this.to&&(a.to=r),!(a.from==a.to&&!a.insert.length)){if(this.pendingContextChange=a,!e.state.readOnly){let l=this.to-this.from+(a.to-a.from+a.insert.length);pa(e,a,K.single(this.toEditorPos(n.selectionStart,l),this.toEditorPos(n.selectionEnd,l)))}this.pendingContextChange&&(this.revertPending(e.state),this.setSelection(e.state))}},this.handlers.characterboundsupdate=n=>{let r=[],i=null;for(let o=this.toEditorPos(n.rangeStart),a=this.toEditorPos(n.rangeEnd);o<a;o++){let l=e.coordsForChar(o);i=l&&new DOMRect(l.left,l.top,l.right-l.left,l.bottom-l.top)||i||new DOMRect,r.push(i)}t.updateCharacterBounds(n.rangeStart,r)},this.handlers.textformatupdate=n=>{let r=[];for(let i of n.getTextFormats()){let o=i.underlineStyle,a=i.underlineThickness;if(o!="None"&&a!="None"){let l=this.toEditorPos(i.rangeStart),c=this.toEditorPos(i.rangeEnd);if(l<c){let h=`text-decoration: underline ${o=="Dashed"?"dashed ":o=="Squiggle"?"wavy ":""}${a=="Thin"?1:2}px`;r.push(Me.mark({attributes:{style:h}}).range(l,c))}}}e.dispatch({effects:sd.of(Me.set(r))})},this.handlers.compositionstart=()=>{e.inputState.composing<0&&(e.inputState.composing=0,e.inputState.compositionFirstChange=!0)},this.handlers.compositionend=()=>{if(e.inputState.composing=-1,e.inputState.compositionFirstChange=null,this.composing){let{drifted:n}=this.composing;this.composing=null,n&&this.reset(e.state)}};for(let n in this.handlers)t.addEventListener(n,this.handlers[n]);this.measureReq={read:n=>{this.editContext.updateControlBounds(n.contentDOM.getBoundingClientRect());let r=Os(n.root);r&&r.rangeCount&&this.editContext.updateSelectionBounds(r.getRangeAt(0).getBoundingClientRect())}}}applyEdits(e){let t=0,n=!1,r=this.pendingContextChange;return e.changes.iterChanges((i,o,a,l,c)=>{if(n)return;let h=c.length-(o-i);if(r&&o>=r.to)if(r.from==i&&r.to==o&&r.insert.eq(c)){r=this.pendingContextChange=null,t+=h,this.to+=h;return}else r=null,this.revertPending(e.state);if(i+=t,o+=t,o<=this.from)this.from+=h,this.to+=h;else if(i<this.to){if(i<this.from||o>this.to||this.to-this.from+c.length>3e4){n=!0;return}this.editContext.updateText(this.toContextPos(i),this.toContextPos(o),c.toString()),this.to+=h}t+=h}),r&&!n&&this.revertPending(e.state),!n}update(e){let t=this.pendingContextChange;this.composing&&(this.composing.drifted||e.transactions.some(n=>!n.isUserEvent("input.type")&&n.changes.touchesRange(this.from,this.to)))?(this.composing.drifted=!0,this.composing.editorBase=e.changes.mapPos(this.composing.editorBase)):!this.applyEdits(e)||!this.rangeIsValid(e.state)?(this.pendingContextChange=null,this.reset(e.state)):(e.docChanged||e.selectionSet||t)&&this.setSelection(e.state),(e.geometryChanged||e.docChanged||e.selectionSet)&&e.view.requestMeasure(this.measureReq)}resetRange(e){let{head:t}=e.selection.main;this.from=Math.max(0,t-1e4),this.to=Math.min(e.doc.length,t+1e4)}reset(e){this.resetRange(e),this.editContext.updateText(0,this.editContext.text.length,e.doc.sliceString(this.from,this.to)),this.setSelection(e)}revertPending(e){let t=this.pendingContextChange;this.pendingContextChange=null,this.editContext.updateText(this.toContextPos(t.from),this.toContextPos(t.from+t.insert.length),e.doc.sliceString(t.from,t.to))}setSelection(e){let{main:t}=e.selection,n=this.toContextPos(Math.max(this.from,Math.min(this.to,t.anchor))),r=this.toContextPos(t.head);(this.editContext.selectionStart!=n||this.editContext.selectionEnd!=r)&&this.editContext.updateSelection(n,r)}rangeIsValid(e){let{head:t}=e.selection.main;return!(this.from>0&&t-this.from<500||this.to<e.doc.length&&this.to-t<500||this.to-this.from>1e4*3)}toEditorPos(e,t=this.to-this.from){e=Math.min(e,t);let n=this.composing;return n&&n.drifted?n.editorBase+(e-n.contextBase):e+this.from}toContextPos(e){let t=this.composing;return t&&t.drifted?t.contextBase+(e-t.editorBase):e-this.from}destroy(){for(let e in this.handlers)this.editContext.removeEventListener(e,this.handlers[e])}}class ue{get state(){return this.viewState.state}get viewport(){return this.viewState.viewport}get visibleRanges(){return this.viewState.visibleRanges}get inView(){return this.viewState.inView}get composing(){return this.inputState.composing>0}get compositionStarted(){return this.inputState.composing>=0}get root(){return this._root}get win(){return this.dom.ownerDocument.defaultView||window}constructor(e={}){var t;this.plugins=[],this.pluginMap=new Map,this.editorAttrs={},this.contentAttrs={},this.bidiCache=[],this.destroyed=!1,this.updateState=2,this.measureScheduled=-1,this.measureRequests=[],this.contentDOM=document.createElement("div"),this.scrollDOM=document.createElement("div"),this.scrollDOM.tabIndex=-1,this.scrollDOM.className="cm-scroller",this.scrollDOM.appendChild(this.contentDOM),this.announceDOM=document.createElement("div"),this.announceDOM.className="cm-announced",this.announceDOM.setAttribute("aria-live","polite"),this.dom=document.createElement("div"),this.dom.appendChild(this.announceDOM),this.dom.appendChild(this.scrollDOM),e.parent&&e.parent.appendChild(this.dom);let{dispatch:n}=e;this.dispatchTransactions=e.dispatchTransactions||n&&(r=>r.forEach(i=>n(i,this)))||(r=>this.update(r)),this.dispatch=this.dispatch.bind(this),this._root=e.root||pv(e.parent)||document,this.viewState=new Ll(e.state||pe.create(e)),e.scrollTo&&e.scrollTo.is(Xs)&&(this.viewState.scrollTarget=e.scrollTo.value.clip(this.viewState.state)),this.plugins=this.state.facet(ds).map(r=>new ci(r));for(let r of this.plugins)r.update(this);this.observer=new Ab(this),this.inputState=new tb(this),this.inputState.ensureHandlers(this.plugins),this.docView=new xl(this),this.mountStyles(),this.updateAttrs(),this.updateState=0,this.requestMeasure(),!((t=document.fonts)===null||t===void 0)&&t.ready&&document.fonts.ready.then(()=>this.requestMeasure())}dispatch(...e){let t=e.length==1&&e[0]instanceof Ue?e:e.length==1&&Array.isArray(e[0])?e[0]:[this.state.update(...e)];this.dispatchTransactions(t,this)}update(e){if(this.updateState!=0)throw new Error("Calls to EditorView.update are not allowed while an update is in progress");let t=!1,n=!1,r,i=this.state;for(let u of e){if(u.startState!=i)throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");i=u.state}if(this.destroyed){this.viewState.state=i;return}let o=this.hasFocus,a=0,l=null;e.some(u=>u.annotation(gd))?(this.inputState.notifiedFocused=o,a=1):o!=this.inputState.notifiedFocused&&(this.inputState.notifiedFocused=o,l=vd(i,o),l||(a=1));let c=this.observer.delayedAndroidKey,h=null;if(c?(this.observer.clearDelayedAndroidKey(),h=this.observer.readChange(),(h&&!this.state.doc.eq(i.doc)||!this.state.selection.eq(i.selection))&&(h=null)):this.observer.clear(),i.facet(pe.phrases)!=this.state.facet(pe.phrases))return this.setState(i);r=Or.create(this,i,e),r.flags|=a;let d=this.viewState.scrollTarget;try{this.updateState=2;for(let u of e){if(d&&(d=d.map(u.changes)),u.scrollIntoView){let{main:f}=u.state.selection;d=new Tn(f.empty?f:K.cursor(f.head,f.head>f.anchor?-1:1))}for(let f of u.effects)f.is(Xs)&&(d=f.value.clip(this.state))}this.viewState.update(r,d),this.bidiCache=Mr.update(this.bidiCache,r.changes),r.empty||(this.updatePlugins(r),this.inputState.update(r)),t=this.docView.update(r),this.state.facet(us)!=this.styleModules&&this.mountStyles(),n=this.updateAttrs(),this.showAnnouncements(e),this.docView.updateSelection(t,e.some(u=>u.isUserEvent("select.pointer")))}finally{this.updateState=0}if(r.startState.facet(nr)!=r.state.facet(nr)&&(this.viewState.mustMeasureContent=!0),(t||n||d||this.viewState.mustEnforceCursorAssoc||this.viewState.mustMeasureContent)&&this.requestMeasure(),t&&this.docViewUpdate(),!r.empty)for(let u of this.state.facet(eo))try{u(r)}catch(f){kt(this.state,f,"update listener")}(l||h)&&Promise.resolve().then(()=>{l&&this.state==l.startState&&this.dispatch(l),h&&!dd(this,h)&&c.force&&An(this.contentDOM,c.key,c.keyCode)})}setState(e){if(this.updateState!=0)throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");if(this.destroyed){this.viewState.state=e;return}this.updateState=2;let t=this.hasFocus;try{for(let n of this.plugins)n.destroy(this);this.viewState=new Ll(e),this.plugins=e.facet(ds).map(n=>new ci(n)),this.pluginMap.clear();for(let n of this.plugins)n.update(this);this.docView.destroy(),this.docView=new xl(this),this.inputState.ensureHandlers(this.plugins),this.mountStyles(),this.updateAttrs(),this.bidiCache=[]}finally{this.updateState=0}t&&this.focus(),this.requestMeasure()}updatePlugins(e){let t=e.startState.facet(ds),n=e.state.facet(ds);if(t!=n){let r=[];for(let i of n){let o=t.indexOf(i);if(o<0)r.push(new ci(i));else{let a=this.plugins[o];a.mustUpdate=e,r.push(a)}}for(let i of this.plugins)i.mustUpdate!=e&&i.destroy(this);this.plugins=r,this.pluginMap.clear()}else for(let r of this.plugins)r.mustUpdate=e;for(let r=0;r<this.plugins.length;r++)this.plugins[r].update(this);t!=n&&this.inputState.ensureHandlers(this.plugins)}docViewUpdate(){for(let e of this.plugins){let t=e.value;if(t&&t.docViewUpdate)try{t.docViewUpdate(this)}catch(n){kt(this.state,n,"doc view update listener")}}}measure(e=!0){if(this.destroyed)return;if(this.measureScheduled>-1&&this.win.cancelAnimationFrame(this.measureScheduled),this.observer.delayedAndroidKey){this.measureScheduled=-1,this.requestMeasure();return}this.measureScheduled=0,e&&this.observer.forceFlush();let t=null,n=this.scrollDOM,r=n.scrollTop*this.scaleY,{scrollAnchorPos:i,scrollAnchorHeight:o}=this.viewState;Math.abs(r-this.viewState.scrollTop)>1&&(o=-1),this.viewState.scrollAnchorHeight=-1;try{for(let a=0;;a++){if(o<0)if(Ah(n))i=-1,o=this.viewState.heightMap.height;else{let f=this.viewState.scrollAnchorAt(r);i=f.from,o=f.top}this.updateState=1;let l=this.viewState.measure(this);if(!l&&!this.measureRequests.length&&this.viewState.scrollTarget==null)break;if(a>5){console.warn(this.measureRequests.length?"Measure loop restarted more than 5 times":"Viewport failed to stabilize");break}let c=[];l&4||([this.measureRequests,c]=[c,this.measureRequests]);let h=c.map(f=>{try{return f.read(this)}catch(m){return kt(this.state,m),Vl}}),d=Or.create(this,this.state,[]),u=!1;d.flags|=l,t?t.flags|=l:t=d,this.updateState=2,d.empty||(this.updatePlugins(d),this.inputState.update(d),this.updateAttrs(),u=this.docView.update(d),u&&this.docViewUpdate());for(let f=0;f<c.length;f++)if(h[f]!=Vl)try{let m=c[f];m.write&&m.write(h[f],this)}catch(m){kt(this.state,m)}if(u&&this.docView.updateSelection(!0),!d.viewportChanged&&this.measureRequests.length==0){if(this.viewState.editorHeight)if(this.viewState.scrollTarget){this.docView.scrollIntoView(this.viewState.scrollTarget),this.viewState.scrollTarget=null,o=-1;continue}else{let m=(i<0?this.viewState.heightMap.height:this.viewState.lineBlockAt(i).top)-o;if(m>1||m<-1){r=r+m,n.scrollTop=r/this.scaleY,o=-1;continue}}break}}}finally{this.updateState=0,this.measureScheduled=-1}if(t&&!t.empty)for(let a of this.state.facet(eo))a(t)}get themeClasses(){return ro+" "+(this.state.facet(so)?jd:wd)+" "+this.state.facet(nr)}updateAttrs(){let e=Wl(this,rd,{class:"cm-editor"+(this.hasFocus?" cm-focused ":" ")+this.themeClasses}),t={spellcheck:"false",autocorrect:"off",autocapitalize:"off",writingsuggestions:"false",translate:"no",contenteditable:this.state.facet(Pt)?"true":"false",class:"cm-content",style:`${H.tabSize}: ${this.state.tabSize}`,role:"textbox","aria-multiline":"true"};this.state.readOnly&&(t["aria-readonly"]="true"),Wl(this,ua,t);let n=this.observer.ignore(()=>{let r=Yi(this.contentDOM,this.contentAttrs,t),i=Yi(this.dom,this.editorAttrs,e);return r||i});return this.editorAttrs=e,this.contentAttrs=t,n}showAnnouncements(e){let t=!0;for(let n of e)for(let r of n.effects)if(r.is(ue.announce)){t&&(this.announceDOM.textContent=""),t=!1;let i=this.announceDOM.appendChild(document.createElement("div"));i.textContent=r.value}}mountStyles(){this.styleModules=this.state.facet(us);let e=this.state.facet(ue.cspNonce);Xt.mount(this.root,this.styleModules.concat(Mb).reverse(),e?{nonce:e}:void 0)}readMeasured(){if(this.updateState==2)throw new Error("Reading the editor layout isn't allowed during an update");this.updateState==0&&this.measureScheduled>-1&&this.measure(!1)}requestMeasure(e){if(this.measureScheduled<0&&(this.measureScheduled=this.win.requestAnimationFrame(()=>this.measure())),e){if(this.measureRequests.indexOf(e)>-1)return;if(e.key!=null){for(let t=0;t<this.measureRequests.length;t++)if(this.measureRequests[t].key===e.key){this.measureRequests[t]=e;return}}this.measureRequests.push(e)}}plugin(e){let t=this.pluginMap.get(e);return(t===void 0||t&&t.spec!=e)&&this.pluginMap.set(e,t=this.plugins.find(n=>n.spec==e)||null),t&&t.update(this).value}get documentTop(){return this.contentDOM.getBoundingClientRect().top+this.viewState.paddingTop}get documentPadding(){return{top:this.viewState.paddingTop,bottom:this.viewState.paddingBottom}}get scaleX(){return this.viewState.scaleX}get scaleY(){return this.viewState.scaleY}elementAtHeight(e){return this.readMeasured(),this.viewState.elementAtHeight(e)}lineBlockAtHeight(e){return this.readMeasured(),this.viewState.lineBlockAtHeight(e)}get viewportLineBlocks(){return this.viewState.viewportLines}lineBlockAt(e){return this.viewState.lineBlockAt(e)}get contentHeight(){return this.viewState.contentHeight}moveByChar(e,t,n){return di(this,e,Cl(this,e,t,n))}moveByGroup(e,t){return di(this,e,Cl(this,e,t,n=>Wv(this,e.head,n)))}visualLineSide(e,t){let n=this.bidiSpans(e),r=this.textDirectionAt(e.from),i=n[t?n.length-1:0];return K.cursor(i.side(t,r)+e.from,i.forward(!t,r)?1:-1)}moveToLineBoundary(e,t,n=!0){return Vv(this,e,t,n)}moveVertically(e,t,n){return di(this,e,Kv(this,e,t,n))}domAtPos(e){return this.docView.domAtPos(e)}posAtDOM(e,t=0){return this.docView.posFromDOM(e,t)}posAtCoords(e,t=!0){return this.readMeasured(),hd(this,e,t)}coordsAtPos(e,t=1){this.readMeasured();let n=this.docView.coordsAt(e,t);if(!n||n.left==n.right)return n;let r=this.state.doc.lineAt(e),i=this.bidiSpans(r),o=i[Wt.find(i,e-r.from,-1,t)];return Hr(n,o.dir==qe.LTR==t>0)}coordsForChar(e){return this.readMeasured(),this.docView.coordsForChar(e)}get defaultCharacterWidth(){return this.viewState.heightOracle.charWidth}get defaultLineHeight(){return this.viewState.heightOracle.lineHeight}get textDirection(){return this.viewState.defaultTextDirection}textDirectionAt(e){return!this.state.facet(td)||e<this.viewport.from||e>this.viewport.to?this.textDirection:(this.readMeasured(),this.docView.textDirectionAt(e))}get lineWrapping(){return this.viewState.heightOracle.lineWrapping}bidiSpans(e){if(e.length>Nb)return Kh(e.length);let t=this.textDirectionAt(e.from),n;for(let i of this.bidiCache)if(i.from==e.from&&i.dir==t&&(i.fresh||Wh(i.isolates,n=jl(this,e))))return i.order;n||(n=jl(this,e));let r=Cv(e.text,t,n);return this.bidiCache.push(new Mr(e.from,e.to,t,n,!0,r)),r}get hasFocus(){var e;return(this.dom.ownerDocument.hasFocus()||H.safari&&((e=this.inputState)===null||e===void 0?void 0:e.lastContextMenu)>Date.now()-3e4)&&this.root.activeElement==this.contentDOM}focus(){this.observer.ignore(()=>{Mh(this.contentDOM),this.docView.updateSelection()})}setRoot(e){this._root!=e&&(this._root=e,this.observer.setWindow((e.nodeType==9?e:e.ownerDocument).defaultView||window),this.mountStyles())}destroy(){this.root.activeElement==this.contentDOM&&this.contentDOM.blur();for(let e of this.plugins)e.destroy(this);this.plugins=[],this.inputState.destroy(),this.docView.destroy(),this.dom.remove(),this.observer.destroy(),this.measureScheduled>-1&&this.win.cancelAnimationFrame(this.measureScheduled),this.destroyed=!0}static scrollIntoView(e,t={}){return Xs.of(new Tn(typeof e=="number"?K.cursor(e):e,t.y,t.x,t.yMargin,t.xMargin))}scrollSnapshot(){let{scrollTop:e,scrollLeft:t}=this.scrollDOM,n=this.viewState.scrollAnchorAt(e);return Xs.of(new Tn(K.cursor(n.from),"start","start",n.top-e,t,!0))}setTabFocusMode(e){e==null?this.inputState.tabFocusMode=this.inputState.tabFocusMode<0?0:-1:typeof e=="boolean"?this.inputState.tabFocusMode=e?0:-1:this.inputState.tabFocusMode!=0&&(this.inputState.tabFocusMode=Date.now()+e)}static domEventHandlers(e){return Jt.define(()=>({}),{eventHandlers:e})}static domEventObservers(e){return Jt.define(()=>({}),{eventObservers:e})}static theme(e,t){let n=Xt.newName(),r=[nr.of(n),us.of(io(`.${n}`,e))];return t&&t.dark&&r.push(so.of(!0)),r}static baseTheme(e){return vh.lowest(us.of(io("."+ro,e,xd)))}static findFromDOM(e){var t;let n=e.querySelector(".cm-content"),r=n&&be.get(n)||be.get(e);return((t=r?.rootView)===null||t===void 0?void 0:t.view)||null}}ue.styleModule=us;ue.inputHandler=Zh;ue.clipboardInputFilter=ha;ue.clipboardOutputFilter=da;ue.scrollHandler=nd;ue.focusChangeEffect=ed;ue.perLineTextDirection=td;ue.exceptionSink=Jh;ue.updateListener=eo;ue.editable=Pt;ue.mouseSelectionStyle=Qh;ue.dragMovesSelection=Xh;ue.clickAddsSelectionRange=Yh;ue.decorations=Ms;ue.outerDecorations=id;ue.atomicRanges=fa;ue.bidiIsolatedRanges=od;ue.scrollMargins=ad;ue.darkTheme=so;ue.cspNonce=ee.define({combine:s=>s.length?s[0]:""});ue.contentAttributes=ua;ue.editorAttributes=rd;ue.lineWrapping=ue.contentAttributes.of({class:"cm-lineWrapping"});ue.announce=$e.define();const Nb=4096,Vl={};class Mr{constructor(e,t,n,r,i,o){this.from=e,this.to=t,this.dir=n,this.isolates=r,this.fresh=i,this.order=o}static update(e,t){if(t.empty&&!e.some(i=>i.fresh))return e;let n=[],r=e.length?e[e.length-1].dir:qe.LTR;for(let i=Math.max(0,e.length-10);i<e.length;i++){let o=e[i];o.dir==r&&!t.touchesRange(o.from,o.to)&&n.push(new Mr(t.mapPos(o.from,1),t.mapPos(o.to,-1),o.dir,o.isolates,!1,o.order))}return n}}function Wl(s,e,t){for(let n=s.state.facet(e),r=n.length-1;r>=0;r--){let i=n[r],o=typeof i=="function"?i(s):i;o&&Gi(o,t)}return t}const Rb=!(H.ios&&H.webkit&&H.webkit_version<534),Kl={".cm-line":{"& ::selection, &::selection":{backgroundColor:"transparent !important"}},".cm-content":{"& :focus":{caretColor:"initial !important","&::selection, & ::selection":{backgroundColor:"Highlight !important"}}}};Rb&&(Kl[".cm-line"].caretColor=Kl[".cm-content"].caretColor="transparent !important");class Un extends Dn{compare(e){return this==e||this.constructor==e.constructor&&this.eq(e)}eq(e){return!1}destroy(e){}}Un.prototype.elementClass="";Un.prototype.toDOM=void 0;Un.prototype.mapMode=et.TrackBefore;Un.prototype.startSide=Un.prototype.endSide=-1;Un.prototype.point=!0;const Db=1024;let Ib=0;class pi{constructor(e,t){this.from=e,this.to=t}}class ye{constructor(e={}){this.id=Ib++,this.perNode=!!e.perNode,this.deserialize=e.deserialize||(()=>{throw new Error("This node type doesn't define a deserialize function")})}add(e){if(this.perNode)throw new RangeError("Can't add per-node props to node types");return typeof e!="function"&&(e=ot.match(e)),t=>{let n=e(t);return n===void 0?null:[this,n]}}}ye.closedBy=new ye({deserialize:s=>s.split(" ")});ye.openedBy=new ye({deserialize:s=>s.split(" ")});ye.group=new ye({deserialize:s=>s.split(" ")});ye.isolate=new ye({deserialize:s=>{if(s&&s!="rtl"&&s!="ltr"&&s!="auto")throw new RangeError("Invalid value for isolate: "+s);return s||"auto"}});ye.contextHash=new ye({perNode:!0});ye.lookAhead=new ye({perNode:!0});ye.mounted=new ye({perNode:!0});class Pr{constructor(e,t,n){this.tree=e,this.overlay=t,this.parser=n}static get(e){return e&&e.props&&e.props[ye.mounted.id]}}const qb=Object.create(null);class ot{constructor(e,t,n,r=0){this.name=e,this.props=t,this.id=n,this.flags=r}static define(e){let t=e.props&&e.props.length?Object.create(null):qb,n=(e.top?1:0)|(e.skipped?2:0)|(e.error?4:0)|(e.name==null?8:0),r=new ot(e.name||"",t,e.id,n);if(e.props){for(let i of e.props)if(Array.isArray(i)||(i=i(r)),i){if(i[0].perNode)throw new RangeError("Can't store a per-node prop on a node type");t[i[0].id]=i[1]}}return r}prop(e){return this.props[e.id]}get isTop(){return(this.flags&1)>0}get isSkipped(){return(this.flags&2)>0}get isError(){return(this.flags&4)>0}get isAnonymous(){return(this.flags&8)>0}is(e){if(typeof e=="string"){if(this.name==e)return!0;let t=this.prop(ye.group);return t?t.indexOf(e)>-1:!1}return this.id==e}static match(e){let t=Object.create(null);for(let n in e)for(let r of n.split(" "))t[r]=e[n];return n=>{for(let r=n.prop(ye.group),i=-1;i<(r?r.length:0);i++){let o=t[i<0?n.name:r[i]];if(o)return o}}}}ot.none=new ot("",Object.create(null),0,8);const sr=new WeakMap,Gl=new WeakMap;var Ie;(function(s){s[s.ExcludeBuffers=1]="ExcludeBuffers",s[s.IncludeAnonymous=2]="IncludeAnonymous",s[s.IgnoreMounts=4]="IgnoreMounts",s[s.IgnoreOverlays=8]="IgnoreOverlays"})(Ie||(Ie={}));class He{constructor(e,t,n,r,i){if(this.type=e,this.children=t,this.positions=n,this.length=r,this.props=null,i&&i.length){this.props=Object.create(null);for(let[o,a]of i)this.props[typeof o=="number"?o:o.id]=a}}toString(){let e=Pr.get(this);if(e&&!e.overlay)return e.tree.toString();let t="";for(let n of this.children){let r=n.toString();r&&(t&&(t+=","),t+=r)}return this.type.name?(/\W/.test(this.type.name)&&!this.type.isError?JSON.stringify(this.type.name):this.type.name)+(t.length?"("+t+")":""):t}cursor(e=0){return new ao(this.topNode,e)}cursorAt(e,t=0,n=0){let r=sr.get(this)||this.topNode,i=new ao(r);return i.moveTo(e,t),sr.set(this,i._tree),i}get topNode(){return new rt(this,0,0,null)}resolve(e,t=0){let n=Ps(sr.get(this)||this.topNode,e,t,!1);return sr.set(this,n),n}resolveInner(e,t=0){let n=Ps(Gl.get(this)||this.topNode,e,t,!0);return Gl.set(this,n),n}resolveStack(e,t=0){return Fb(this,e,t)}iterate(e){let{enter:t,leave:n,from:r=0,to:i=this.length}=e,o=e.mode||0,a=(o&Ie.IncludeAnonymous)>0;for(let l=this.cursor(o|Ie.IncludeAnonymous);;){let c=!1;if(l.from<=i&&l.to>=r&&(!a&&l.type.isAnonymous||t(l)!==!1)){if(l.firstChild())continue;c=!0}for(;c&&n&&(a||!l.type.isAnonymous)&&n(l),!l.nextSibling();){if(!l.parent())return;c=!0}}}prop(e){return e.perNode?this.props?this.props[e.id]:void 0:this.type.prop(e)}get propValues(){let e=[];if(this.props)for(let t in this.props)e.push([+t,this.props[t]]);return e}balance(e={}){return this.children.length<=8?this:ya(ot.none,this.children,this.positions,0,this.children.length,0,this.length,(t,n,r)=>new He(this.type,t,n,r,this.propValues),e.makeTree||((t,n,r)=>new He(ot.none,t,n,r)))}static build(e){return Ub(e)}}He.empty=new He(ot.none,[],[],0);class va{constructor(e,t){this.buffer=e,this.index=t}get id(){return this.buffer[this.index-4]}get start(){return this.buffer[this.index-3]}get end(){return this.buffer[this.index-2]}get size(){return this.buffer[this.index-1]}get pos(){return this.index}next(){this.index-=4}fork(){return new va(this.buffer,this.index)}}class Zt{constructor(e,t,n){this.buffer=e,this.length=t,this.set=n}get type(){return ot.none}toString(){let e=[];for(let t=0;t<this.buffer.length;)e.push(this.childString(t)),t=this.buffer[t+3];return e.join(",")}childString(e){let t=this.buffer[e],n=this.buffer[e+3],r=this.set.types[t],i=r.name;if(/\W/.test(i)&&!r.isError&&(i=JSON.stringify(i)),e+=4,n==e)return i;let o=[];for(;e<n;)o.push(this.childString(e)),e=this.buffer[e+3];return i+"("+o.join(",")+")"}findChild(e,t,n,r,i){let{buffer:o}=this,a=-1;for(let l=e;l!=t&&!(kd(i,r,o[l+1],o[l+2])&&(a=l,n>0));l=o[l+3]);return a}slice(e,t,n){let r=this.buffer,i=new Uint16Array(t-e),o=0;for(let a=e,l=0;a<t;){i[l++]=r[a++],i[l++]=r[a++]-n;let c=i[l++]=r[a++]-n;i[l++]=r[a++]-e,o=Math.max(o,c)}return new Zt(i,o,this.set)}}function kd(s,e,t,n){switch(s){case-2:return t<e;case-1:return n>=e&&t<e;case 0:return t<e&&n>e;case 1:return t<=e&&n>e;case 2:return n>e;case 4:return!0}}function Ps(s,e,t,n){for(var r;s.from==s.to||(t<1?s.from>=e:s.from>e)||(t>-1?s.to<=e:s.to<e);){let o=!n&&s instanceof rt&&s.index<0?null:s.parent;if(!o)return s;s=o}let i=n?0:Ie.IgnoreOverlays;if(n)for(let o=s,a=o.parent;a;o=a,a=o.parent)o instanceof rt&&o.index<0&&((r=a.enter(e,t,i))===null||r===void 0?void 0:r.from)!=o.from&&(s=a);for(;;){let o=s.enter(e,t,i);if(!o)return s;s=o}}class Sd{cursor(e=0){return new ao(this,e)}getChild(e,t=null,n=null){let r=Yl(this,e,t,n);return r.length?r[0]:null}getChildren(e,t=null,n=null){return Yl(this,e,t,n)}resolve(e,t=0){return Ps(this,e,t,!1)}resolveInner(e,t=0){return Ps(this,e,t,!0)}matchContext(e){return oo(this.parent,e)}enterUnfinishedNodesBefore(e){let t=this.childBefore(e),n=this;for(;t;){let r=t.lastChild;if(!r||r.to!=t.to)break;r.type.isError&&r.from==r.to?(n=t,t=r.prevSibling):t=r}return n}get node(){return this}get next(){return this.parent}}class rt extends Sd{constructor(e,t,n,r){super(),this._tree=e,this.from=t,this.index=n,this._parent=r}get type(){return this._tree.type}get name(){return this._tree.type.name}get to(){return this.from+this._tree.length}nextChild(e,t,n,r,i=0){for(let o=this;;){for(let{children:a,positions:l}=o._tree,c=t>0?a.length:-1;e!=c;e+=t){let h=a[e],d=l[e]+o.from;if(kd(r,n,d,d+h.length)){if(h instanceof Zt){if(i&Ie.ExcludeBuffers)continue;let u=h.findChild(0,h.buffer.length,t,n-d,r);if(u>-1)return new Kt(new Bb(o,h,e,d),null,u)}else if(i&Ie.IncludeAnonymous||!h.type.isAnonymous||ba(h)){let u;if(!(i&Ie.IgnoreMounts)&&(u=Pr.get(h))&&!u.overlay)return new rt(u.tree,d,e,o);let f=new rt(h,d,e,o);return i&Ie.IncludeAnonymous||!f.type.isAnonymous?f:f.nextChild(t<0?h.children.length-1:0,t,n,r)}}}if(i&Ie.IncludeAnonymous||!o.type.isAnonymous||(o.index>=0?e=o.index+t:e=t<0?-1:o._parent._tree.children.length,o=o._parent,!o))return null}}get firstChild(){return this.nextChild(0,1,0,4)}get lastChild(){return this.nextChild(this._tree.children.length-1,-1,0,4)}childAfter(e){return this.nextChild(0,1,e,2)}childBefore(e){return this.nextChild(this._tree.children.length-1,-1,e,-2)}enter(e,t,n=0){let r;if(!(n&Ie.IgnoreOverlays)&&(r=Pr.get(this._tree))&&r.overlay){let i=e-this.from;for(let{from:o,to:a}of r.overlay)if((t>0?o<=i:o<i)&&(t<0?a>=i:a>i))return new rt(r.tree,r.overlay[0].from+this.from,-1,this)}return this.nextChild(0,1,e,t,n)}nextSignificantParent(){let e=this;for(;e.type.isAnonymous&&e._parent;)e=e._parent;return e}get parent(){return this._parent?this._parent.nextSignificantParent():null}get nextSibling(){return this._parent&&this.index>=0?this._parent.nextChild(this.index+1,1,0,4):null}get prevSibling(){return this._parent&&this.index>=0?this._parent.nextChild(this.index-1,-1,0,4):null}get tree(){return this._tree}toTree(){return this._tree}toString(){return this._tree.toString()}}function Yl(s,e,t,n){let r=s.cursor(),i=[];if(!r.firstChild())return i;if(t!=null){for(let o=!1;!o;)if(o=r.type.is(t),!r.nextSibling())return i}for(;;){if(n!=null&&r.type.is(n))return i;if(r.type.is(e)&&i.push(r.node),!r.nextSibling())return n==null?i:[]}}function oo(s,e,t=e.length-1){for(let n=s;t>=0;n=n.parent){if(!n)return!1;if(!n.type.isAnonymous){if(e[t]&&e[t]!=n.name)return!1;t--}}return!0}class Bb{constructor(e,t,n,r){this.parent=e,this.buffer=t,this.index=n,this.start=r}}class Kt extends Sd{get name(){return this.type.name}get from(){return this.context.start+this.context.buffer.buffer[this.index+1]}get to(){return this.context.start+this.context.buffer.buffer[this.index+2]}constructor(e,t,n){super(),this.context=e,this._parent=t,this.index=n,this.type=e.buffer.set.types[e.buffer.buffer[n]]}child(e,t,n){let{buffer:r}=this.context,i=r.findChild(this.index+4,r.buffer[this.index+3],e,t-this.context.start,n);return i<0?null:new Kt(this.context,this,i)}get firstChild(){return this.child(1,0,4)}get lastChild(){return this.child(-1,0,4)}childAfter(e){return this.child(1,e,2)}childBefore(e){return this.child(-1,e,-2)}enter(e,t,n=0){if(n&Ie.ExcludeBuffers)return null;let{buffer:r}=this.context,i=r.findChild(this.index+4,r.buffer[this.index+3],t>0?1:-1,e-this.context.start,t);return i<0?null:new Kt(this.context,this,i)}get parent(){return this._parent||this.context.parent.nextSignificantParent()}externalSibling(e){return this._parent?null:this.context.parent.nextChild(this.context.index+e,e,0,4)}get nextSibling(){let{buffer:e}=this.context,t=e.buffer[this.index+3];return t<(this._parent?e.buffer[this._parent.index+3]:e.buffer.length)?new Kt(this.context,this._parent,t):this.externalSibling(1)}get prevSibling(){let{buffer:e}=this.context,t=this._parent?this._parent.index+4:0;return this.index==t?this.externalSibling(-1):new Kt(this.context,this._parent,e.findChild(t,this.index,-1,0,4))}get tree(){return null}toTree(){let e=[],t=[],{buffer:n}=this.context,r=this.index+4,i=n.buffer[this.index+3];if(i>r){let o=n.buffer[this.index+1];e.push(n.slice(r,i,o)),t.push(0)}return new He(this.type,e,t,this.to-this.from)}toString(){return this.context.buffer.childString(this.index)}}function _d(s){if(!s.length)return null;let e=0,t=s[0];for(let i=1;i<s.length;i++){let o=s[i];(o.from>t.from||o.to<t.to)&&(t=o,e=i)}let n=t instanceof rt&&t.index<0?null:t.parent,r=s.slice();return n?r[e]=n:r.splice(e,1),new Lb(r,t)}class Lb{constructor(e,t){this.heads=e,this.node=t}get next(){return _d(this.heads)}}function Fb(s,e,t){let n=s.resolveInner(e,t),r=null;for(let i=n instanceof rt?n:n.context.parent;i;i=i.parent)if(i.index<0){let o=i.parent;(r||(r=[n])).push(o.resolve(e,t)),i=o}else{let o=Pr.get(i.tree);if(o&&o.overlay&&o.overlay[0].from<=e&&o.overlay[o.overlay.length-1].to>=e){let a=new rt(o.tree,o.overlay[0].from+i.from,-1,i);(r||(r=[n])).push(Ps(a,e,t,!1))}}return r?_d(r):n}class ao{get name(){return this.type.name}constructor(e,t=0){if(this.mode=t,this.buffer=null,this.stack=[],this.index=0,this.bufferNode=null,e instanceof rt)this.yieldNode(e);else{this._tree=e.context.parent,this.buffer=e.context;for(let n=e._parent;n;n=n._parent)this.stack.unshift(n.index);this.bufferNode=e,this.yieldBuf(e.index)}}yieldNode(e){return e?(this._tree=e,this.type=e.type,this.from=e.from,this.to=e.to,!0):!1}yieldBuf(e,t){this.index=e;let{start:n,buffer:r}=this.buffer;return this.type=t||r.set.types[r.buffer[e]],this.from=n+r.buffer[e+1],this.to=n+r.buffer[e+2],!0}yield(e){return e?e instanceof rt?(this.buffer=null,this.yieldNode(e)):(this.buffer=e.context,this.yieldBuf(e.index,e.type)):!1}toString(){return this.buffer?this.buffer.buffer.childString(this.index):this._tree.toString()}enterChild(e,t,n){if(!this.buffer)return this.yield(this._tree.nextChild(e<0?this._tree._tree.children.length-1:0,e,t,n,this.mode));let{buffer:r}=this.buffer,i=r.findChild(this.index+4,r.buffer[this.index+3],e,t-this.buffer.start,n);return i<0?!1:(this.stack.push(this.index),this.yieldBuf(i))}firstChild(){return this.enterChild(1,0,4)}lastChild(){return this.enterChild(-1,0,4)}childAfter(e){return this.enterChild(1,e,2)}childBefore(e){return this.enterChild(-1,e,-2)}enter(e,t,n=this.mode){return this.buffer?n&Ie.ExcludeBuffers?!1:this.enterChild(1,e,t):this.yield(this._tree.enter(e,t,n))}parent(){if(!this.buffer)return this.yieldNode(this.mode&Ie.IncludeAnonymous?this._tree._parent:this._tree.parent);if(this.stack.length)return this.yieldBuf(this.stack.pop());let e=this.mode&Ie.IncludeAnonymous?this.buffer.parent:this.buffer.parent.nextSignificantParent();return this.buffer=null,this.yieldNode(e)}sibling(e){if(!this.buffer)return this._tree._parent?this.yield(this._tree.index<0?null:this._tree._parent.nextChild(this._tree.index+e,e,0,4,this.mode)):!1;let{buffer:t}=this.buffer,n=this.stack.length-1;if(e<0){let r=n<0?0:this.stack[n]+4;if(this.index!=r)return this.yieldBuf(t.findChild(r,this.index,-1,0,4))}else{let r=t.buffer[this.index+3];if(r<(n<0?t.buffer.length:t.buffer[this.stack[n]+3]))return this.yieldBuf(r)}return n<0?this.yield(this.buffer.parent.nextChild(this.buffer.index+e,e,0,4,this.mode)):!1}nextSibling(){return this.sibling(1)}prevSibling(){return this.sibling(-1)}atLastNode(e){let t,n,{buffer:r}=this;if(r){if(e>0){if(this.index<r.buffer.buffer.length)return!1}else for(let i=0;i<this.index;i++)if(r.buffer.buffer[i+3]<this.index)return!1;({index:t,parent:n}=r)}else({index:t,_parent:n}=this._tree);for(;n;{index:t,_parent:n}=n)if(t>-1)for(let i=t+e,o=e<0?-1:n._tree.children.length;i!=o;i+=e){let a=n._tree.children[i];if(this.mode&Ie.IncludeAnonymous||a instanceof Zt||!a.type.isAnonymous||ba(a))return!1}return!0}move(e,t){if(t&&this.enterChild(e,0,4))return!0;for(;;){if(this.sibling(e))return!0;if(this.atLastNode(e)||!this.parent())return!1}}next(e=!0){return this.move(1,e)}prev(e=!0){return this.move(-1,e)}moveTo(e,t=0){for(;(this.from==this.to||(t<1?this.from>=e:this.from>e)||(t>-1?this.to<=e:this.to<e))&&this.parent(););for(;this.enterChild(1,e,t););return this}get node(){if(!this.buffer)return this._tree;let e=this.bufferNode,t=null,n=0;if(e&&e.context==this.buffer)e:for(let r=this.index,i=this.stack.length;i>=0;){for(let o=e;o;o=o._parent)if(o.index==r){if(r==this.index)return o;t=o,n=i+1;break e}r=this.stack[--i]}for(let r=n;r<this.stack.length;r++)t=new Kt(this.buffer,t,this.stack[r]);return this.bufferNode=new Kt(this.buffer,t,this.index)}get tree(){return this.buffer?null:this._tree._tree}iterate(e,t){for(let n=0;;){let r=!1;if(this.type.isAnonymous||e(this)!==!1){if(this.firstChild()){n++;continue}this.type.isAnonymous||(r=!0)}for(;;){if(r&&t&&t(this),r=this.type.isAnonymous,!n)return;if(this.nextSibling())break;this.parent(),n--,r=!0}}}matchContext(e){if(!this.buffer)return oo(this.node.parent,e);let{buffer:t}=this.buffer,{types:n}=t.set;for(let r=e.length-1,i=this.stack.length-1;r>=0;i--){if(i<0)return oo(this._tree,e,r);let o=n[t.buffer[this.stack[i]]];if(!o.isAnonymous){if(e[r]&&e[r]!=o.name)return!1;r--}}return!0}}function ba(s){return s.children.some(e=>e instanceof Zt||!e.type.isAnonymous||ba(e))}function Ub(s){var e;let{buffer:t,nodeSet:n,maxBufferLength:r=Db,reused:i=[],minRepeatType:o=n.types.length}=s,a=Array.isArray(t)?new va(t,t.length):t,l=n.types,c=0,h=0;function d(A,N,D,te,Z,he){let{id:Q,start:F,end:ae,size:re}=a,me=h,Ae=c;for(;re<0;)if(a.next(),re==-1){let S=i[Q];D.push(S),te.push(F-A);return}else if(re==-3){c=Q;return}else if(re==-4){h=Q;return}else throw new RangeError(`Unrecognized record size: ${re}`);let Ge=l[Q],Je,Te,R=F-A;if(ae-F<=r&&(Te=b(a.pos-N,Z))){let S=new Uint16Array(Te.size-Te.skip),T=a.pos-Te.size,E=S.length;for(;a.pos>T;)E=g(Te.start,S,E);Je=new Zt(S,ae-Te.start,n),R=Te.start-A}else{let S=a.pos-re;a.next();let T=[],E=[],v=Q>=o?Q:-1,j=0,M=ae;for(;a.pos>S;)v>=0&&a.id==v&&a.size>=0?(a.end<=M-r&&(m(T,E,F,j,a.end,M,v,me,Ae),j=T.length,M=a.end),a.next()):he>2500?u(F,S,T,E):d(F,S,T,E,v,he+1);if(v>=0&&j>0&&j<T.length&&m(T,E,F,j,F,M,v,me,Ae),T.reverse(),E.reverse(),v>-1&&j>0){let U=f(Ge,Ae);Je=ya(Ge,T,E,0,T.length,0,ae-F,U,U)}else Je=y(Ge,T,E,ae-F,me-ae,Ae)}D.push(Je),te.push(R)}function u(A,N,D,te){let Z=[],he=0,Q=-1;for(;a.pos>N;){let{id:F,start:ae,end:re,size:me}=a;if(me>4)a.next();else{if(Q>-1&&ae<Q)break;Q<0&&(Q=re-r),Z.push(F,ae,re),he++,a.next()}}if(he){let F=new Uint16Array(he*4),ae=Z[Z.length-2];for(let re=Z.length-3,me=0;re>=0;re-=3)F[me++]=Z[re],F[me++]=Z[re+1]-ae,F[me++]=Z[re+2]-ae,F[me++]=me;D.push(new Zt(F,Z[2]-ae,n)),te.push(ae-A)}}function f(A,N){return(D,te,Z)=>{let he=0,Q=D.length-1,F,ae;if(Q>=0&&(F=D[Q])instanceof He){if(!Q&&F.type==A&&F.length==Z)return F;(ae=F.prop(ye.lookAhead))&&(he=te[Q]+F.length+ae)}return y(A,D,te,Z,he,N)}}function m(A,N,D,te,Z,he,Q,F,ae){let re=[],me=[];for(;A.length>te;)re.push(A.pop()),me.push(N.pop()+D-Z);A.push(y(n.types[Q],re,me,he-Z,F-he,ae)),N.push(Z-D)}function y(A,N,D,te,Z,he,Q){if(he){let F=[ye.contextHash,he];Q=Q?[F].concat(Q):[F]}if(Z>25){let F=[ye.lookAhead,Z];Q=Q?[F].concat(Q):[F]}return new He(A,N,D,te,Q)}function b(A,N){let D=a.fork(),te=0,Z=0,he=0,Q=D.end-r,F={size:0,start:0,skip:0};e:for(let ae=D.pos-A;D.pos>ae;){let re=D.size;if(D.id==N&&re>=0){F.size=te,F.start=Z,F.skip=he,he+=4,te+=4,D.next();continue}let me=D.pos-re;if(re<0||me<ae||D.start<Q)break;let Ae=D.id>=o?4:0,Ge=D.start;for(D.next();D.pos>me;){if(D.size<0)if(D.size==-3)Ae+=4;else break e;else D.id>=o&&(Ae+=4);D.next()}Z=Ge,te+=re,he+=Ae}return(N<0||te==A)&&(F.size=te,F.start=Z,F.skip=he),F.size>4?F:void 0}function g(A,N,D){let{id:te,start:Z,end:he,size:Q}=a;if(a.next(),Q>=0&&te<o){let F=D;if(Q>4){let ae=a.pos-(Q-4);for(;a.pos>ae;)D=g(A,N,D)}N[--D]=F,N[--D]=he-A,N[--D]=Z-A,N[--D]=te}else Q==-3?c=te:Q==-4&&(h=te);return D}let x=[],C=[];for(;a.pos>0;)d(s.start||0,s.bufferStart||0,x,C,-1,0);let P=(e=s.length)!==null&&e!==void 0?e:x.length?C[0]+x[0].length:0;return new He(l[s.topID],x.reverse(),C.reverse(),P)}const Xl=new WeakMap;function br(s,e){if(!s.isAnonymous||e instanceof Zt||e.type!=s)return 1;let t=Xl.get(e);if(t==null){t=1;for(let n of e.children){if(n.type!=s||!(n instanceof He)){t=1;break}t+=br(s,n)}Xl.set(e,t)}return t}function ya(s,e,t,n,r,i,o,a,l){let c=0;for(let m=n;m<r;m++)c+=br(s,e[m]);let h=Math.ceil(c*1.5/8),d=[],u=[];function f(m,y,b,g,x){for(let C=b;C<g;){let P=C,A=y[C],N=br(s,m[C]);for(C++;C<g;C++){let D=br(s,m[C]);if(N+D>=h)break;N+=D}if(C==P+1){if(N>h){let D=m[P];f(D.children,D.positions,0,D.children.length,y[P]+x);continue}d.push(m[P])}else{let D=y[C-1]+m[C-1].length-A;d.push(ya(s,m,y,P,C,A,D,null,l))}u.push(A+x-i)}}return f(e,t,n,r,0),(a||l)(d,u,o)}class fn{constructor(e,t,n,r,i=!1,o=!1){this.from=e,this.to=t,this.tree=n,this.offset=r,this.open=(i?1:0)|(o?2:0)}get openStart(){return(this.open&1)>0}get openEnd(){return(this.open&2)>0}static addTree(e,t=[],n=!1){let r=[new fn(0,e.length,e,0,!1,n)];for(let i of t)i.to>e.length&&r.push(i);return r}static applyChanges(e,t,n=128){if(!t.length)return e;let r=[],i=1,o=e.length?e[0]:null;for(let a=0,l=0,c=0;;a++){let h=a<t.length?t[a]:null,d=h?h.fromA:1e9;if(d-l>=n)for(;o&&o.from<d;){let u=o;if(l>=u.from||d<=u.to||c){let f=Math.max(u.from,l)-c,m=Math.min(u.to,d)-c;u=f>=m?null:new fn(f,m,u.tree,u.offset+c,a>0,!!h)}if(u&&r.push(u),o.to>d)break;o=i<e.length?e[i++]:null}if(!h)break;l=h.toA,c=h.toA-h.toB}return r}}class Hb{startParse(e,t,n){return typeof e=="string"&&(e=new Vb(e)),n=n?n.length?n.map(r=>new pi(r.from,r.to)):[new pi(0,0)]:[new pi(0,e.length)],this.createParse(e,t||[],n)}parse(e,t,n){let r=this.startParse(e,t,n);for(;;){let i=r.advance();if(i)return i}}}class Vb{constructor(e){this.string=e}get length(){return this.string.length}chunk(e){return this.string.slice(e)}get lineChunks(){return!1}read(e,t){return this.string.slice(e,t)}}new ye({perNode:!0});let Wb=0;class nt{constructor(e,t,n,r){this.name=e,this.set=t,this.base=n,this.modified=r,this.id=Wb++}toString(){let{name:e}=this;for(let t of this.modified)t.name&&(e=`${t.name}(${e})`);return e}static define(e,t){let n=typeof e=="string"?e:"?";if(e instanceof nt&&(t=e),t?.base)throw new Error("Can not derive from a modified tag");let r=new nt(n,[],null,[]);if(r.set.push(r),t)for(let i of t.set)r.set.push(i);return r}static defineModifier(e){let t=new Ar(e);return n=>n.modified.indexOf(t)>-1?n:Ar.get(n.base||n,n.modified.concat(t).sort((r,i)=>r.id-i.id))}}let Kb=0;class Ar{constructor(e){this.name=e,this.instances=[],this.id=Kb++}static get(e,t){if(!t.length)return e;let n=t[0].instances.find(a=>a.base==e&&Gb(t,a.modified));if(n)return n;let r=[],i=new nt(e.name,r,e,t);for(let a of t)a.instances.push(i);let o=Yb(t);for(let a of e.set)if(!a.modified.length)for(let l of o)r.push(Ar.get(a,l));return i}}function Gb(s,e){return s.length==e.length&&s.every((t,n)=>t==e[n])}function Yb(s){let e=[[]];for(let t=0;t<s.length;t++)for(let n=0,r=e.length;n<r;n++)e.push(e[n].concat(s[t]));return e.sort((t,n)=>n.length-t.length)}function Xb(s){let e=Object.create(null);for(let t in s){let n=s[t];Array.isArray(n)||(n=[n]);for(let r of t.split(" "))if(r){let i=[],o=2,a=r;for(let d=0;;){if(a=="..."&&d>0&&d+3==r.length){o=1;break}let u=/^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(a);if(!u)throw new RangeError("Invalid path: "+r);if(i.push(u[0]=="*"?"":u[0][0]=='"'?JSON.parse(u[0]):u[0]),d+=u[0].length,d==r.length)break;let f=r[d++];if(d==r.length&&f=="!"){o=0;break}if(f!="/")throw new RangeError("Invalid path: "+r);a=r.slice(d)}let l=i.length-1,c=i[l];if(!c)throw new RangeError("Invalid path: "+r);let h=new Tr(n,o,l>0?i.slice(0,l):null);e[c]=h.sort(e[c])}}return Ed.add(e)}const Ed=new ye;class Tr{constructor(e,t,n,r){this.tags=e,this.mode=t,this.context=n,this.next=r}get opaque(){return this.mode==0}get inherit(){return this.mode==1}sort(e){return!e||e.depth<this.depth?(this.next=e,this):(e.next=this.sort(e.next),e)}get depth(){return this.context?this.context.length:0}}Tr.empty=new Tr([],2,null);function Cd(s,e){let t=Object.create(null);for(let i of s)if(!Array.isArray(i.tag))t[i.tag.id]=i.class;else for(let o of i.tag)t[o.id]=i.class;let{scope:n,all:r=null}=e||{};return{style:i=>{let o=r;for(let a of i)for(let l of a.set){let c=t[l.id];if(c){o=o?o+" "+c:c;break}}return o},scope:n}}function Qb(s,e){let t=null;for(let n of s){let r=n.style(e);r&&(t=t?t+" "+r:r)}return t}function Jb(s,e,t,n=0,r=s.length){let i=new Zb(n,Array.isArray(e)?e:[e],t);i.highlightRange(s.cursor(),n,r,"",i.highlighters),i.flush(r)}class Zb{constructor(e,t,n){this.at=e,this.highlighters=t,this.span=n,this.class=""}startSpan(e,t){t!=this.class&&(this.flush(e),e>this.at&&(this.at=e),this.class=t)}flush(e){e>this.at&&this.class&&this.span(this.at,e,this.class)}highlightRange(e,t,n,r,i){let{type:o,from:a,to:l}=e;if(a>=n||l<=t)return;o.isTop&&(i=this.highlighters.filter(f=>!f.scope||f.scope(o)));let c=r,h=e0(e)||Tr.empty,d=Qb(i,h.tags);if(d&&(c&&(c+=" "),c+=d,h.mode==1&&(r+=(r?" ":"")+d)),this.startSpan(Math.max(t,a),c),h.opaque)return;let u=e.tree&&e.tree.prop(ye.mounted);if(u&&u.overlay){let f=e.node.enter(u.overlay[0].from+a,1),m=this.highlighters.filter(b=>!b.scope||b.scope(u.tree.type)),y=e.firstChild();for(let b=0,g=a;;b++){let x=b<u.overlay.length?u.overlay[b]:null,C=x?x.from+a:l,P=Math.max(t,g),A=Math.min(n,C);if(P<A&&y)for(;e.from<A&&(this.highlightRange(e,P,A,r,i),this.startSpan(Math.min(A,e.to),c),!(e.to>=C||!e.nextSibling())););if(!x||C>n)break;g=x.to+a,g>t&&(this.highlightRange(f.cursor(),Math.max(t,x.from+a),Math.min(n,g),"",m),this.startSpan(Math.min(n,g),c))}y&&e.parent()}else if(e.firstChild()){u&&(r="");do if(!(e.to<=t)){if(e.from>=n)break;this.highlightRange(e,t,n,r,i),this.startSpan(Math.min(n,e.to),c)}while(e.nextSibling());e.parent()}}}function e0(s){let e=s.type.prop(Ed);for(;e&&e.context&&!s.matchContext(e.context);)e=e.next;return e||null}const q=nt.define,rr=q(),Ft=q(),Ql=q(Ft),Jl=q(Ft),Ut=q(),ir=q(Ut),mi=q(Ut),vt=q(),rn=q(vt),mt=q(),gt=q(),lo=q(),as=q(lo),or=q(),I={comment:rr,lineComment:q(rr),blockComment:q(rr),docComment:q(rr),name:Ft,variableName:q(Ft),typeName:Ql,tagName:q(Ql),propertyName:Jl,attributeName:q(Jl),className:q(Ft),labelName:q(Ft),namespace:q(Ft),macroName:q(Ft),literal:Ut,string:ir,docString:q(ir),character:q(ir),attributeValue:q(ir),number:mi,integer:q(mi),float:q(mi),bool:q(Ut),regexp:q(Ut),escape:q(Ut),color:q(Ut),url:q(Ut),keyword:mt,self:q(mt),null:q(mt),atom:q(mt),unit:q(mt),modifier:q(mt),operatorKeyword:q(mt),controlKeyword:q(mt),definitionKeyword:q(mt),moduleKeyword:q(mt),operator:gt,derefOperator:q(gt),arithmeticOperator:q(gt),logicOperator:q(gt),bitwiseOperator:q(gt),compareOperator:q(gt),updateOperator:q(gt),definitionOperator:q(gt),typeOperator:q(gt),controlOperator:q(gt),punctuation:lo,separator:q(lo),bracket:as,angleBracket:q(as),squareBracket:q(as),paren:q(as),brace:q(as),content:vt,heading:rn,heading1:q(rn),heading2:q(rn),heading3:q(rn),heading4:q(rn),heading5:q(rn),heading6:q(rn),contentSeparator:q(vt),list:q(vt),quote:q(vt),emphasis:q(vt),strong:q(vt),link:q(vt),monospace:q(vt),strikethrough:q(vt),inserted:q(),deleted:q(),changed:q(),invalid:q(),meta:or,documentMeta:q(or),annotation:q(or),processingInstruction:q(or),definition:nt.defineModifier("definition"),constant:nt.defineModifier("constant"),function:nt.defineModifier("function"),standard:nt.defineModifier("standard"),local:nt.defineModifier("local"),special:nt.defineModifier("special")};for(let s in I){let e=I[s];e instanceof nt&&(e.name=s)}Cd([{tag:I.link,class:"tok-link"},{tag:I.heading,class:"tok-heading"},{tag:I.emphasis,class:"tok-emphasis"},{tag:I.strong,class:"tok-strong"},{tag:I.keyword,class:"tok-keyword"},{tag:I.atom,class:"tok-atom"},{tag:I.bool,class:"tok-bool"},{tag:I.url,class:"tok-url"},{tag:I.labelName,class:"tok-labelName"},{tag:I.inserted,class:"tok-inserted"},{tag:I.deleted,class:"tok-deleted"},{tag:I.literal,class:"tok-literal"},{tag:I.string,class:"tok-string"},{tag:I.number,class:"tok-number"},{tag:[I.regexp,I.escape,I.special(I.string)],class:"tok-string2"},{tag:I.variableName,class:"tok-variableName"},{tag:I.local(I.variableName),class:"tok-variableName tok-local"},{tag:I.definition(I.variableName),class:"tok-variableName tok-definition"},{tag:I.special(I.variableName),class:"tok-variableName2"},{tag:I.definition(I.propertyName),class:"tok-propertyName tok-definition"},{tag:I.typeName,class:"tok-typeName"},{tag:I.namespace,class:"tok-namespace"},{tag:I.className,class:"tok-className"},{tag:I.macroName,class:"tok-macroName"},{tag:I.propertyName,class:"tok-propertyName"},{tag:I.operator,class:"tok-operator"},{tag:I.comment,class:"tok-comment"},{tag:I.meta,class:"tok-meta"},{tag:I.invalid,class:"tok-invalid"},{tag:I.punctuation,class:"tok-punctuation"}]);var gi;const ms=new ye,t0=new ye;class St{constructor(e,t,n=[],r=""){this.data=e,this.name=r,pe.prototype.hasOwnProperty("tree")||Object.defineProperty(pe.prototype,"tree",{get(){return As(this)}}),this.parser=t,this.extension=[Vn.of(this),pe.languageData.of((i,o,a)=>{let l=Zl(i,o,a),c=l.type.prop(ms);if(!c)return[];let h=i.facet(c),d=l.type.prop(t0);if(d){let u=l.resolve(o-l.from,a);for(let f of d)if(f.test(u,i)){let m=i.facet(f.facet);return f.type=="replace"?m:m.concat(h)}}return h})].concat(n)}isActiveAt(e,t,n=-1){return Zl(e,t,n).type.prop(ms)==this.data}findRegions(e){let t=e.facet(Vn);if(t?.data==this.data)return[{from:0,to:e.doc.length}];if(!t||!t.allowsNesting)return[];let n=[],r=(i,o)=>{if(i.prop(ms)==this.data){n.push({from:o,to:o+i.length});return}let a=i.prop(ye.mounted);if(a){if(a.tree.prop(ms)==this.data){if(a.overlay)for(let l of a.overlay)n.push({from:l.from+o,to:l.to+o});else n.push({from:o,to:o+i.length});return}else if(a.overlay){let l=n.length;if(r(a.tree,a.overlay[0].from+o),n.length>l)return}}for(let l=0;l<i.children.length;l++){let c=i.children[l];c instanceof He&&r(c,i.positions[l]+o)}};return r(As(e),0),n}get allowsNesting(){return!0}}St.setState=$e.define();function Zl(s,e,t){let n=s.facet(Vn),r=As(s).topNode;if(!n||n.allowsNesting)for(let i=r;i;i=i.enter(e,t,Ie.ExcludeBuffers))i.type.isTop&&(r=i);return r}function As(s){let e=s.field(St.state,!1);return e?e.tree:He.empty}class n0{constructor(e){this.doc=e,this.cursorPos=0,this.string="",this.cursor=e.iter()}get length(){return this.doc.length}syncTo(e){return this.string=this.cursor.next(e-this.cursorPos).value,this.cursorPos=e+this.string.length,this.cursorPos-this.string.length}chunk(e){return this.syncTo(e),this.string}get lineChunks(){return!0}read(e,t){let n=this.cursorPos-this.string.length;return e<n||t>=this.cursorPos?this.doc.sliceString(e,t):this.string.slice(e-n,t-n)}}let ls=null;class zr{constructor(e,t,n=[],r,i,o,a,l){this.parser=e,this.state=t,this.fragments=n,this.tree=r,this.treeLen=i,this.viewport=o,this.skipped=a,this.scheduleOn=l,this.parse=null,this.tempSkipped=[]}static create(e,t,n){return new zr(e,t,[],He.empty,0,n,[],null)}startParse(){return this.parser.startParse(new n0(this.state.doc),this.fragments)}work(e,t){return t!=null&&t>=this.state.doc.length&&(t=void 0),this.tree!=He.empty&&this.isDone(t??this.state.doc.length)?(this.takeTree(),!0):this.withContext(()=>{var n;if(typeof e=="number"){let r=Date.now()+e;e=()=>Date.now()>r}for(this.parse||(this.parse=this.startParse()),t!=null&&(this.parse.stoppedAt==null||this.parse.stoppedAt>t)&&t<this.state.doc.length&&this.parse.stopAt(t);;){let r=this.parse.advance();if(r)if(this.fragments=this.withoutTempSkipped(fn.addTree(r,this.fragments,this.parse.stoppedAt!=null)),this.treeLen=(n=this.parse.stoppedAt)!==null&&n!==void 0?n:this.state.doc.length,this.tree=r,this.parse=null,this.treeLen<(t??this.state.doc.length))this.parse=this.startParse();else return!0;if(e())return!1}})}takeTree(){let e,t;this.parse&&(e=this.parse.parsedPos)>=this.treeLen&&((this.parse.stoppedAt==null||this.parse.stoppedAt>e)&&this.parse.stopAt(e),this.withContext(()=>{for(;!(t=this.parse.advance()););}),this.treeLen=e,this.tree=t,this.fragments=this.withoutTempSkipped(fn.addTree(this.tree,this.fragments,!0)),this.parse=null)}withContext(e){let t=ls;ls=this;try{return e()}finally{ls=t}}withoutTempSkipped(e){for(let t;t=this.tempSkipped.pop();)e=ec(e,t.from,t.to);return e}changes(e,t){let{fragments:n,tree:r,treeLen:i,viewport:o,skipped:a}=this;if(this.takeTree(),!e.empty){let l=[];if(e.iterChangedRanges((c,h,d,u)=>l.push({fromA:c,toA:h,fromB:d,toB:u})),n=fn.applyChanges(n,l),r=He.empty,i=0,o={from:e.mapPos(o.from,-1),to:e.mapPos(o.to,1)},this.skipped.length){a=[];for(let c of this.skipped){let h=e.mapPos(c.from,1),d=e.mapPos(c.to,-1);h<d&&a.push({from:h,to:d})}}}return new zr(this.parser,t,n,r,i,o,a,this.scheduleOn)}updateViewport(e){if(this.viewport.from==e.from&&this.viewport.to==e.to)return!1;this.viewport=e;let t=this.skipped.length;for(let n=0;n<this.skipped.length;n++){let{from:r,to:i}=this.skipped[n];r<e.to&&i>e.from&&(this.fragments=ec(this.fragments,r,i),this.skipped.splice(n--,1))}return this.skipped.length>=t?!1:(this.reset(),!0)}reset(){this.parse&&(this.takeTree(),this.parse=null)}skipUntilInView(e,t){this.skipped.push({from:e,to:t})}static getSkippingParser(e){return new class extends Hb{createParse(t,n,r){let i=r[0].from,o=r[r.length-1].to;return{parsedPos:i,advance(){let l=ls;if(l){for(let c of r)l.tempSkipped.push(c);e&&(l.scheduleOn=l.scheduleOn?Promise.all([l.scheduleOn,e]):e)}return this.parsedPos=o,new He(ot.none,[],[],o-i)},stoppedAt:null,stopAt(){}}}}}isDone(e){e=Math.min(e,this.state.doc.length);let t=this.fragments;return this.treeLen>=e&&t.length&&t[0].from==0&&t[0].to>=e}static get(){return ls}}function ec(s,e,t){return fn.applyChanges(s,[{fromA:e,toA:t,fromB:e,toB:t}])}class Hn{constructor(e){this.context=e,this.tree=e.tree}apply(e){if(!e.docChanged&&this.tree==this.context.tree)return this;let t=this.context.changes(e.changes,e.state),n=this.context.treeLen==e.startState.doc.length?void 0:Math.max(e.changes.mapPos(this.context.treeLen),t.viewport.to);return t.work(20,n)||t.takeTree(),new Hn(t)}static init(e){let t=Math.min(3e3,e.doc.length),n=zr.create(e.facet(Vn).parser,e,{from:0,to:t});return n.work(20,t)||n.takeTree(),new Hn(n)}}St.state=yn.define({create:Hn.init,update(s,e){for(let t of e.effects)if(t.is(St.setState))return t.value;return e.startState.facet(Vn)!=e.state.facet(Vn)?Hn.init(e.state):s.apply(e)}});let Od=s=>{let e=setTimeout(()=>s(),500);return()=>clearTimeout(e)};typeof requestIdleCallback<"u"&&(Od=s=>{let e=-1,t=setTimeout(()=>{e=requestIdleCallback(s,{timeout:400})},100);return()=>e<0?clearTimeout(t):cancelIdleCallback(e)});const vi=typeof navigator<"u"&&(!((gi=navigator.scheduling)===null||gi===void 0)&&gi.isInputPending)?()=>navigator.scheduling.isInputPending():null,s0=Jt.fromClass(class{constructor(e){this.view=e,this.working=null,this.workScheduled=0,this.chunkEnd=-1,this.chunkBudget=-1,this.work=this.work.bind(this),this.scheduleWork()}update(e){let t=this.view.state.field(St.state).context;(t.updateViewport(e.view.viewport)||this.view.viewport.to>t.treeLen)&&this.scheduleWork(),(e.docChanged||e.selectionSet)&&(this.view.hasFocus&&(this.chunkBudget+=50),this.scheduleWork()),this.checkAsyncSchedule(t)}scheduleWork(){if(this.working)return;let{state:e}=this.view,t=e.field(St.state);(t.tree!=t.context.tree||!t.context.isDone(e.doc.length))&&(this.working=Od(this.work))}work(e){this.working=null;let t=Date.now();if(this.chunkEnd<t&&(this.chunkEnd<0||this.view.hasFocus)&&(this.chunkEnd=t+3e4,this.chunkBudget=3e3),this.chunkBudget<=0)return;let{state:n,viewport:{to:r}}=this.view,i=n.field(St.state);if(i.tree==i.context.tree&&i.context.isDone(r+1e5))return;let o=Date.now()+Math.min(this.chunkBudget,100,e&&!vi?Math.max(25,e.timeRemaining()-5):1e9),a=i.context.treeLen<r&&n.doc.length>r+1e3,l=i.context.work(()=>vi&&vi()||Date.now()>o,r+(a?0:1e5));this.chunkBudget-=Date.now()-t,(l||this.chunkBudget<=0)&&(i.context.takeTree(),this.view.dispatch({effects:St.setState.of(new Hn(i.context))})),this.chunkBudget>0&&!(l&&!a)&&this.scheduleWork(),this.checkAsyncSchedule(i.context)}checkAsyncSchedule(e){e.scheduleOn&&(this.workScheduled++,e.scheduleOn.then(()=>this.scheduleWork()).catch(t=>kt(this.view.state,t)).then(()=>this.workScheduled--),e.scheduleOn=null)}destroy(){this.working&&this.working()}isWorking(){return!!(this.working||this.workScheduled>0)}},{eventHandlers:{focus(){this.scheduleWork()}}}),Vn=ee.define({combine(s){return s.length?s[0]:null},enables:s=>[St.state,s0,ue.contentAttributes.compute([s],e=>{let t=e.facet(s);return t&&t.name?{"data-language":t.name}:{}})]}),r0=ee.define({combine:s=>{if(!s.length)return"  ";let e=s[0];if(!e||/\S/.test(e)||Array.from(e).some(t=>t!=e[0]))throw new Error("Invalid indent unit: "+JSON.stringify(s[0]));return e}});function tc(s){let e=s.facet(r0);return e.charCodeAt(0)==9?s.tabSize*e.length:e.length}class Is{constructor(e,t){this.specs=e;let n;function r(a){let l=Xt.newName();return(n||(n=Object.create(null)))["."+l]=a,l}const i=typeof t.all=="string"?t.all:t.all?r(t.all):void 0,o=t.scope;this.scope=o instanceof St?a=>a.prop(ms)==o.data:o?a=>a==o:void 0,this.style=Cd(e.map(a=>({tag:a.tag,class:a.class||r(Object.assign({},a,{tag:null}))})),{all:i}).style,this.module=n?new Xt(n):null,this.themeType=t.themeType}static define(e,t){return new Is(e,t||{})}}const co=ee.define(),i0=ee.define({combine(s){return s.length?[s[0]]:null}});function bi(s){let e=s.facet(co);return e.length?e:s.facet(i0)}function o0(s,e){let t=[l0],n;return s instanceof Is&&(s.module&&t.push(ue.styleModule.of(s.module)),n=s.themeType),n?t.push(co.computeN([ue.darkTheme],r=>r.facet(ue.darkTheme)==(n=="dark")?[s]:[])):t.push(co.of(s)),t}class a0{constructor(e){this.markCache=Object.create(null),this.tree=As(e.state),this.decorations=this.buildDeco(e,bi(e.state)),this.decoratedTo=e.viewport.to}update(e){let t=As(e.state),n=bi(e.state),r=n!=bi(e.startState),{viewport:i}=e.view,o=e.changes.mapPos(this.decoratedTo,1);t.length<i.to&&!r&&t.type==this.tree.type&&o>=i.to?(this.decorations=this.decorations.map(e.changes),this.decoratedTo=o):(t!=this.tree||e.viewportChanged||r)&&(this.tree=t,this.decorations=this.buildDeco(e.view,n),this.decoratedTo=i.to)}buildDeco(e,t){if(!t||!this.tree.length)return Me.none;let n=new In;for(let{from:r,to:i}of e.visibleRanges)Jb(this.tree,t,(o,a,l)=>{n.add(o,a,this.markCache[l]||(this.markCache[l]=Me.mark({class:l})))},r,i);return n.finish()}}const l0=vh.high(Jt.fromClass(a0,{decorations:s=>s.decorations}));I.meta,I.link,I.heading,I.emphasis,I.strong,I.strikethrough,I.keyword,I.atom,I.bool,I.url,I.contentSeparator,I.labelName,I.literal,I.inserted,I.string,I.deleted,I.regexp,I.escape,I.string,I.variableName,I.variableName,I.typeName,I.namespace,I.className,I.variableName,I.macroName,I.propertyName,I.comment,I.invalid;const c0=Object.create(null),nc=[ot.none],sc=[],rc=Object.create(null),h0=Object.create(null);for(let[s,e]of[["variable","variableName"],["variable-2","variableName.special"],["string-2","string.special"],["def","variableName.definition"],["tag","tagName"],["attribute","attributeName"],["type","typeName"],["builtin","variableName.standard"],["qualifier","modifier"],["error","invalid"],["header","heading"],["property","propertyName"]])h0[s]=d0(c0,e);function yi(s,e){sc.indexOf(s)>-1||(sc.push(s),console.warn(e))}function d0(s,e){let t=[];for(let a of e.split(" ")){let l=[];for(let c of a.split(".")){let h=s[c]||I[c];h?typeof h=="function"?l.length?l=l.map(h):yi(c,`Modifier ${c} used at start of tag`):l.length?yi(c,`Tag ${c} used as modifier`):l=Array.isArray(h)?h:[h]:yi(c,`Unknown highlighting tag ${c}`)}for(let c of l)t.push(c)}if(!t.length)return 0;let n=e.replace(/ /g,"_"),r=n+" "+t.map(a=>a.id),i=rc[r];if(i)return i.id;let o=rc[r]=ot.define({id:nc.length,name:n,props:[Xb({[n]:t})]});return nc.push(o),o.id}qe.RTL,qe.LTR;class u0{constructor(e){this.view=e,this.indentUnit=tc(e.state),this.initialPaddingLeft=null,this.isChrome=window?.navigator.userAgent.includes("Chrome"),this.generate(e.state)}update(e){const t=tc(e.state);(t!==this.indentUnit||e.docChanged||e.viewportChanged)&&(this.indentUnit=t,this.generate(e.state))}generate(e){const t=new In;this.initialPaddingLeft?this.addStyleToBuilder(t,e,this.initialPaddingLeft):this.view.requestMeasure({read:n=>{const r=n.contentDOM.querySelector(".cm-line");r&&(this.initialPaddingLeft=window.getComputedStyle(r).getPropertyValue("padding-left"),this.addStyleToBuilder(t,n.state,this.initialPaddingLeft)),this.decorations=t.finish()}}),this.decorations=t.finish()}addStyleToBuilder(e,t,n){const r=this.getVisibleLines(t);for(const i of r){const{numColumns:o,containsTab:a}=this.numColumns(i.text,t.tabSize),l=`calc(${o+this.indentUnit}ch + ${n})`,c=this.isChrome?`calc(-${o+this.indentUnit}ch - ${a?1:0}px)`:`-${o+this.indentUnit}ch`;e.add(i.from,i.from,Me.line({attributes:{style:`padding-left: ${l}; text-indent: ${c};`}}))}}getVisibleLines(e){const t=new Set;let n=null;for(const{from:r,to:i}of this.view.visibleRanges){let o=r;for(;o<=i;){const a=e.doc.lineAt(o);n!==a&&(t.add(a),n=a),o=a.to+1}}return t}numColumns(e,t){let n=0,r=!1;e:for(let i=0;i<e.length;i++)switch(e[i]){case" ":{n+=1;continue e}case"	":{n+=t-n%t,r=!0;continue e}case"\r":continue e;default:break e}return{numColumns:n,containsTab:r}}}Jt.fromClass(u0,{decorations:s=>s.decorations});var ic;function oc(s,e){var t=Object.keys(s);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(s);e&&(n=n.filter(function(r){return Object.getOwnPropertyDescriptor(s,r).enumerable})),t.push.apply(t,n)}return t}function ho(s){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?oc(Object(t),!0).forEach(function(n){f0(s,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(s,Object.getOwnPropertyDescriptors(t)):oc(Object(t)).forEach(function(n){Object.defineProperty(s,n,Object.getOwnPropertyDescriptor(t,n))})}return s}function f0(s,e,t){return(e=function(n){var r=function(i,o){if(typeof i!="object"||!i)return i;var a=i[Symbol.toPrimitive];if(a!==void 0){var l=a.call(i,o||"default");if(typeof l!="object")return l;throw new TypeError("@@toPrimitive must return a primitive value.")}return(o==="string"?String:Number)(i)}(n,"string");return typeof r=="symbol"?r:r+""}(e))in s?Object.defineProperty(s,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):s[e]=t,s}typeof window<"u"&&((ic=window).__svelte||(ic.__svelte={v:new Set})).v.add("5");var p0;function hn(s){return p0.call(s)}var m0=null;function $d(s){var e=document.createElement("template");return e.innerHTML=s,e.content}function Nr(s,e){var t=m0;t.nodes_start===null&&(t.nodes_start=s,t.nodes_end=e)}function _(s,e){var t,n=!!(1&e),r=!!(2&e),i=!s.startsWith("<!>");return()=>{t===void 0&&(t=$d(i?s:"<!>"+s),n||(t=hn(t)));var o=r?document.importNode(t,!0):t.cloneNode(!0);return n?Nr(hn(o),o.lastChild):Nr(o,o),o}}function en(s,e){var t,n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"svg",r=!s.startsWith("<!>"),i=!!(1&e),o="<".concat(n,">").concat(r?s:"<!>"+s,"</").concat(n,">");return()=>{if(!t){var a=hn($d(o));if(i)for(t=document.createDocumentFragment();hn(a);)t.appendChild(hn(a));else t=hn(a)}var l=t.cloneNode(!0);return i?Nr(hn(l),l.lastChild):Nr(l,l),l}}function qs(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:function(n){var r=function(i){try{if(typeof window<"u"&&window.localStorage!==void 0)return window.localStorage[i]}catch{}}("debug");return r!=null&&r.endsWith("*")?n.startsWith(r.slice(0,-1)):n===r}(s);if(!e)return g0;var t=function(n){for(var r=0,i=0;i<n.length;i++)r=(r<<5)-r+n.charCodeAt(i),r|=0;return ac[Math.abs(r)%ac.length]}(s);return function(){for(var n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];console.log("%c".concat(s),"color:".concat(t),...r)}}function g0(){}var ac=["#0000CC","#0099FF","#009400","#8dd200","#CCCC00","#CC9933","#ae04e7","#ff35d7","#FF3333","#FF6600","#FF9933","#FFCC33"];function v0(s){return typeof s=="object"&&s!==null&&(s.constructor===void 0||s.constructor.name==="Object")}function b0(s){return v0(s)&&s.json!==void 0}function y0(s){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:JSON;return b0(s)?s:{json:e.parse(s.text)}}var lc,cc,hc,uo,dc,Rr,uc;(function(s){s.text="text",s.tree="tree",s.table="table"})(lc||(lc={})),function(s){s.after="after",s.inside="inside",s.key="key",s.value="value",s.multi="multi",s.text="text"}(cc||(cc={})),function(s){s.after="after",s.key="key",s.value="value",s.inside="inside"}(hc||(hc={})),function(s){s.info="info",s.warning="warning",s.error="error"}(uo||(uo={})),function(s){s.key="key",s.value="value"}(dc||(dc={})),function(s){s.asc="asc",s.desc="desc"}(Rr||(Rr={})),function(s){s.no="no",s.self="self",s.nextInside="nextInside"}(uc||(uc={}));function G(s,e){e===void 0&&(e={});var t=e.insertAt;if(s&&typeof document<"u"){var n=document.head||document.getElementsByTagName("head")[0],r=document.createElement("style");r.type="text/css",t==="top"&&n.firstChild?n.insertBefore(r,n.firstChild):n.appendChild(r),r.styleSheet?r.styleSheet.cssText=s:r.appendChild(document.createTextNode(s))}}G(`.jse-absolute-popup.svelte-1r8q3m8 {
  position: relative;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  z-index: 1001;
}
.jse-absolute-popup.svelte-1r8q3m8 .jse-hidden-input:where(.svelte-1r8q3m8) {
  position: fixed;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  overflow: hidden;
}
.jse-absolute-popup.svelte-1r8q3m8 .jse-absolute-popup-content:where(.svelte-1r8q3m8) {
  position: absolute;
}`);_('<div class="jse-absolute-popup-content svelte-1r8q3m8"><input type="text" readonly="" tabindex="-1" class="jse-hidden-input svelte-1r8q3m8"> <!></div>');_('<div role="none" class="jse-absolute-popup svelte-1r8q3m8"><!></div>');_("<!> <!>",1);en("<g><!></g>");G(`
  .fa-icon.svelte-1mc5hvj {
    display: inline-block;
    fill: currentColor;
  }
  .fa-flip-horizontal.svelte-1mc5hvj {
    transform: scale(-1, 1);
  }
  .fa-flip-vertical.svelte-1mc5hvj {
    transform: scale(1, -1);
  }
  .fa-spin.svelte-1mc5hvj {
    animation: svelte-1mc5hvj-fa-spin 1s 0s infinite linear;
  }
  .fa-inverse.svelte-1mc5hvj {
    color: #fff;
  }
  .fa-pulse.svelte-1mc5hvj {
    animation: svelte-1mc5hvj-fa-spin 1s infinite steps(8);
  }
  @keyframes svelte-1mc5hvj-fa-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`);en("<svg><!></svg>");en("<path></path>");en("<polygon></polygon>");en("<!><!><!>",1);G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-boolean-toggle.svelte-1ryp01u {
  padding: 0;
  margin: 1px 0 0;
  vertical-align: top;
  display: inline-flex;
  color: var(--jse-value-color-boolean, #ff8c00);
}

.jse-boolean-toggle.svelte-1ryp01u:not(.jse-readonly) {
  cursor: pointer;
}`);_('<div role="checkbox" tabindex="-1" class="jse-boolean-toggle svelte-1ryp01u"><!></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-color-picker-popup.svelte-s1wu8v .picker_wrapper.popup,
.jse-color-picker-popup.svelte-s1wu8v .picker_wrapper.popup .picker_arrow::before,
.jse-color-picker-popup.svelte-s1wu8v .picker_wrapper.popup .picker_arrow::after {
  background: var(--jse-color-picker-background, var(--jse-panel-background, #ebebeb));
  line-height: normal;
}
.jse-color-picker-popup.svelte-s1wu8v .picker_slider,
.jse-color-picker-popup.svelte-s1wu8v .picker_sl,
.jse-color-picker-popup.svelte-s1wu8v .picker_editor input,
.jse-color-picker-popup.svelte-s1wu8v .picker_sample,
.jse-color-picker-popup.svelte-s1wu8v .picker_done button {
  box-shadow: var(--jse-color-picker-border-box-shadow, #cbcbcb 0 0 0 1px);
}
.jse-color-picker-popup.svelte-s1wu8v .picker_editor input {
  background: var(--jse-background-color, #fff);
  color: var(--jse-text-color, #4d4d4d);
}
.jse-color-picker-popup.svelte-s1wu8v .picker_done button {
  background: var(--jse-button-background, #e0e0e0);
  color: var(--jse-button-color, var(--jse-text-color, #4d4d4d));
}
.jse-color-picker-popup.svelte-s1wu8v .picker_done button:hover {
  background: var(--jse-button-background-highlight, #e7e7e7);
}`);_('<div class="jse-color-picker-popup svelte-s1wu8v"></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-color-picker-button.svelte-xeg9n6 {
  font-size: var(--jse-font-size-mono, 14px);
  width: var(--jse-color-picker-button-size, 1em);
  height: var(--jse-color-picker-button-size, 1em);
  box-sizing: border-box;
  padding: 0;
  margin: 2px 0 0 calc(0.5 * var(--jse-padding, 10px));
  display: inline-flex;
  vertical-align: top;
  border: 1px solid var(--jse-text-color, #4d4d4d);
  border-radius: 2px;
  background: inherit;
  outline: none;
}

.jse-color-picker-button.svelte-xeg9n6:not(.jse-readonly) {
  cursor: pointer;
}`);_('<button type="button" class="jse-color-picker-button svelte-xeg9n6"></button>');Rr.asc+"",Rr.desc+"";G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-value.jse-string.svelte-f9kmxj {
  color: var(--jse-value-color-string, #008000);
}
.jse-value.jse-object.svelte-f9kmxj, .jse-value.jse-array.svelte-f9kmxj {
  min-width: 16px;
  color: var(--jse-delimiter-color, rgba(0, 0, 0, 0.38));
}
.jse-value.jse-number.svelte-f9kmxj {
  color: var(--jse-value-color-number, #ee422e);
}
.jse-value.jse-boolean.svelte-f9kmxj {
  color: var(--jse-value-color-boolean, #ff8c00);
}
.jse-value.jse-null.svelte-f9kmxj {
  color: var(--jse-value-color-null, #004ed0);
}
.jse-value.jse-invalid.svelte-f9kmxj {
  color: var(--jse-text-color, #4d4d4d);
}
.jse-value.jse-url.svelte-f9kmxj {
  color: var(--jse-value-color-url, #008000);
  text-decoration: underline;
}

div.jse-editable-div.svelte-f9kmxj {
  min-width: 2em;
  padding: 0 5px;
  box-sizing: border-box;
  outline: none;
  border-radius: 1px;
  vertical-align: top;
  cursor: text !important;
  word-break: normal;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
div.jse-editable-div.jse-short-text.svelte-f9kmxj {
  overflow-wrap: normal;
}
div.jse-editable-div.jse-table-cell.svelte-f9kmxj {
  overflow-wrap: normal;
  white-space: nowrap;
}
div.jse-editable-div[contenteditable=true].svelte-f9kmxj {
  outline: var(--jse-edit-outline, 2px solid #656565);
  background: var(--jse-background-color, #fff);
  position: relative;
  display: inline-block;
  border-radius: 0;
  z-index: 3;
}
div.jse-editable-div.jse-empty.svelte-f9kmxj:not(:focus) {
  outline: 1px dotted var(--jse-tag-background, rgba(0, 0, 0, 0.2));
  -moz-outline-radius: 2px;
}
div.jse-editable-div.jse-empty.svelte-f9kmxj::after {
  pointer-events: none;
  color: var(--jse-tag-background, rgba(0, 0, 0, 0.2));
}`);_('<div role="textbox" tabindex="0" contenteditable="true" spellcheck="false"></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-highlight.svelte-5fb7bl {
  background-color: var(--jse-search-match-color, #ffe665);
  outline: var(--jse-search-match-outline, none);
}
.jse-highlight.jse-active.svelte-5fb7bl {
  background-color: var(--jse-search-match-active-color, var(--jse-search-match-color, #ffe665));
  outline: var(--jse-search-match-outline, 2px solid #e0be00);
}`);_('<span class="jse-highlight svelte-5fb7bl"> </span>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-value.jse-string.svelte-c0g9qz {
  color: var(--jse-value-color-string, #008000);
}
.jse-value.jse-object.svelte-c0g9qz, .jse-value.jse-array.svelte-c0g9qz {
  min-width: 16px;
  color: var(--jse-delimiter-color, rgba(0, 0, 0, 0.38));
}
.jse-value.jse-number.svelte-c0g9qz {
  color: var(--jse-value-color-number, #ee422e);
}
.jse-value.jse-boolean.svelte-c0g9qz {
  color: var(--jse-value-color-boolean, #ff8c00);
}
.jse-value.jse-null.svelte-c0g9qz {
  color: var(--jse-value-color-null, #004ed0);
}
.jse-value.jse-invalid.svelte-c0g9qz {
  color: var(--jse-text-color, #4d4d4d);
}
.jse-value.jse-url.svelte-c0g9qz {
  color: var(--jse-value-color-url, #008000);
  text-decoration: underline;
}

.jse-value.svelte-c0g9qz {
  display: inline-block;
  min-width: 2em;
  padding: 0 5px;
  box-sizing: border-box;
  outline: none;
  border-radius: 1px;
  vertical-align: top;
  word-break: normal;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.jse-value.jse-table-cell.svelte-c0g9qz {
  overflow-wrap: normal;
  white-space: nowrap;
}
.jse-value.jse-empty.svelte-c0g9qz {
  min-width: 4em;
  outline: 1px dotted var(--jse-tag-background, rgba(0, 0, 0, 0.2));
  -moz-outline-radius: 2px;
}
.jse-value.jse-empty.svelte-c0g9qz::after {
  pointer-events: none;
  color: var(--jse-tag-background, rgba(0, 0, 0, 0.2));
  content: "value";
}`);_('<div role="button" tabindex="-1" data-type="selectable-value"><!></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-tooltip.svelte-14y3y8t {
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  line-height: normal;
  padding: calc(0.5 * var(--jse-padding, 10px)) var(--jse-padding, 10px);
  border-radius: 3px;
  background: var(--jse-context-menu-background, #656565);
  color: var(--jse-context-menu-color, var(--jse-text-color-inverse, #fff));
  white-space: nowrap;
  box-shadow: var(--jse-controls-box-shadow, 0 2px 6px 0 rgba(0, 0, 0, 0.24));
}`);_('<div class="jse-tooltip svelte-14y3y8t"> </div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-timestamp.svelte-1jla5ec {
  padding: 0;
  margin: 0;
  vertical-align: middle;
  display: inline-flex;
  color: var(--jse-value-color-number, #ee422e);
}`);_('<div class="jse-timestamp svelte-1jla5ec"><!></div>');G(`
  svg.svelte-qbd276 {
      width: var(--chevron-icon-width, 20px);
      height: var(--chevron-icon-width, 20px);
      color: var(--chevron-icon-colour, currentColor);
  }
`);en(`<svg width="100%" height="100%" viewBox="0 0 20 20" focusable="false" aria-hidden="true" class="svelte-qbd276"><path fill="currentColor" d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747
          3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0
          1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502
          0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0
          0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>`);G(`
    svg.svelte-whdbu1 {
        width: var(--clear-icon-width, 20px);
        height: var(--clear-icon-width, 20px);
        color: var(--clear-icon-color, currentColor);
    }
`);en(`<svg width="100%" height="100%" viewBox="-2 -2 50 50" focusable="false" aria-hidden="true" role="presentation" class="svelte-whdbu1"><path fill="currentColor" d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124
    l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"></path></svg>`);G(`
    .loading.svelte-1p3nqvd {
        width: var(--spinner-width, 20px);
        height: var(--spinner-height, 20px);
        color: var(--spinner-color, var(--icons-color));
        animation: svelte-1p3nqvd-rotate 0.75s linear infinite;
        transform-origin: center center;
        transform: none;
    }

    .circle_path.svelte-1p3nqvd {
        stroke-dasharray: 90;
        stroke-linecap: round;
    }

    @keyframes svelte-1p3nqvd-rotate {
        100% {
            transform: rotate(360deg);
        }
    }
`);en('<svg class="loading svelte-1p3nqvd" viewBox="25 25 50 50"><circle class="circle_path svelte-1p3nqvd" cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-miterlimit="10"></circle></svg>');G(`
    .svelte-select.svelte-82qwg8 {
        /* deprecating camelCase custom props in favour of kebab-case for v5 */
        --borderRadius: var(--border-radius);
        --clearSelectColor: var(--clear-select-color);
        --clearSelectWidth: var(--clear-select-width);
        --disabledBackground: var(--disabled-background);
        --disabledBorderColor: var(--disabled-border-color);
        --disabledColor: var(--disabled-color);
        --disabledPlaceholderColor: var(--disabled-placeholder-color);
        --disabledPlaceholderOpacity: var(--disabled-placeholder-opacity);
        --errorBackground: var(--error-background);
        --errorBorder: var(--error-border);
        --groupItemPaddingLeft: var(--group-item-padding-left);
        --groupTitleColor: var(--group-title-color);
        --groupTitleFontSize: var(--group-title-font-size);
        --groupTitleFontWeight: var(--group-title-font-weight);
        --groupTitlePadding: var(--group-title-padding);
        --groupTitleTextTransform: var(--group-title-text-transform);
        --groupTitleBorderColor: var(--group-title-border-color);
        --groupTitleBorderWidth: var(--group-title-border-width);
        --groupTitleBorderStyle: var(--group-title-border-style);
        --indicatorColor: var(--chevron-color);
        --indicatorHeight: var(--chevron-height);
        --indicatorWidth: var(--chevron-width);
        --inputColor: var(--input-color);
        --inputLeft: var(--input-left);
        --inputLetterSpacing: var(--input-letter-spacing);
        --inputMargin: var(--input-margin);
        --inputPadding: var(--input-padding);
        --itemActiveBackground: var(--item-active-background);
        --itemColor: var(--item-color);
        --itemFirstBorderRadius: var(--item-first-border-radius);
        --itemHoverBG: var(--item-hover-bg);
        --itemHoverColor: var(--item-hover-color);
        --itemIsActiveBG: var(--item-is-active-bg);
        --itemIsActiveColor: var(--item-is-active-color);
        --itemIsNotSelectableColor: var(--item-is-not-selectable-color);
        --itemPadding: var(--item-padding);
        --listBackground: var(--list-background);
        --listBorder: var(--list-border);
        --listBorderRadius: var(--list-border-radius);
        --listEmptyColor: var(--list-empty-color);
        --listEmptyPadding: var(--list-empty-padding);
        --listEmptyTextAlign: var(--list-empty-text-align);
        --listMaxHeight: var(--list-max-height);
        --listPosition: var(--list-position);
        --listShadow: var(--list-shadow);
        --listZIndex: var(--list-z-index);
        --multiItemBG: var(--multi-item-bg);
        --multiItemBorderRadius: var(--multi-item-border-radius);
        --multiItemDisabledHoverBg: var(--multi-item-disabled-hover-bg);
        --multiItemDisabledHoverColor: var(--multi-item-disabled-hover-color);
        --multiItemHeight: var(--multi-item-height);
        --multiItemMargin: var(--multi-item-margin);
        --multiItemPadding: var(--multi-item-padding);
        --multiSelectInputMargin: var(--multi-select-input-margin);
        --multiSelectInputPadding: var(--multi-select-input-padding);
        --multiSelectPadding: var(--multi-select-padding);
        --placeholderColor: var(--placeholder-color);
        --placeholderOpacity: var(--placeholder-opacity);
        --selectedItemPadding: var(--selected-item-padding);
        --spinnerColor: var(--spinner-color);
        --spinnerHeight: var(--spinner-height);
        --spinnerWidth: var(--spinner-width);

        --internal-padding: 0 0 0 16px;

        border: var(--border, 1px solid #d8dbdf);
        border-radius: var(--border-radius, 6px);
        min-height: var(--height, 42px);
        position: relative;
        display: flex;
        align-items: stretch;
        padding: var(--padding, var(--internal-padding));
        background: var(--background, #fff);
        margin: var(--margin, 0);
        width: var(--width, 100%);
        font-size: var(--font-size, 16px);
        max-height: var(--max-height);
    }

    .svelte-82qwg8 {
        box-sizing: var(--box-sizing, border-box);
    }

    .svelte-select.svelte-82qwg8:hover {
        border: var(--border-hover, 1px solid #b2b8bf);
    }

    .value-container.svelte-82qwg8 {
        display: flex;
        flex: 1 1 0%;
        flex-wrap: wrap;
        align-items: center;
        gap: 5px 10px;
        padding: var(--value-container-padding, 5px 0);
        position: relative;
        overflow: var(--value-container-overflow, hidden);
        align-self: stretch;
    }

    .prepend.svelte-82qwg8,
    .indicators.svelte-82qwg8 {
        display: flex;
        flex-shrink: 0;
        align-items: center;
    }

    .indicators.svelte-82qwg8 {
        position: var(--indicators-position);
        top: var(--indicators-top);
        right: var(--indicators-right);
        bottom: var(--indicators-bottom);
    }

    input.svelte-82qwg8 {
        position: absolute;
        cursor: default;
        border: none;
        color: var(--input-color, var(--item-color));
        padding: var(--input-padding, 0);
        letter-spacing: var(--input-letter-spacing, inherit);
        margin: var(--input-margin, 0);
        min-width: 10px;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: transparent;
        font-size: var(--font-size, 16px);
    }

    .svelte-82qwg8:not(.multi) > .value-container:where(.svelte-82qwg8) > input:where(.svelte-82qwg8) {
        width: 100%;
        height: 100%;
    }

    input.svelte-82qwg8::placeholder {
        color: var(--placeholder-color, #78848f);
        opacity: var(--placeholder-opacity, 1);
    }

    input.svelte-82qwg8:focus {
        outline: none;
    }

    .svelte-select.focused.svelte-82qwg8 {
        border: var(--border-focused, 1px solid #006fe8);
        border-radius: var(--border-radius-focused, var(--border-radius, 6px));
    }

    .disabled.svelte-82qwg8 {
        background: var(--disabled-background, #ebedef);
        border-color: var(--disabled-border-color, #ebedef);
        color: var(--disabled-color, #c1c6cc);
    }

    .disabled.svelte-82qwg8 input:where(.svelte-82qwg8)::placeholder {
        color: var(--disabled-placeholder-color, #c1c6cc);
        opacity: var(--disabled-placeholder-opacity, 1);
    }

    .selected-item.svelte-82qwg8 {
        position: relative;
        overflow: var(--selected-item-overflow, hidden);
        padding: var(--selected-item-padding, 0 20px 0 0);
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--selected-item-color, inherit);
        font-size: var(--font-size, 16px);
    }

    .multi.svelte-82qwg8 .selected-item:where(.svelte-82qwg8) {
        position: absolute;
        line-height: var(--height, 42px);
        height: var(--height, 42px);
    }

    .selected-item.svelte-82qwg8:focus {
        outline: none;
    }

    .hide-selected-item.svelte-82qwg8 {
        opacity: 0;
    }

    .icon.svelte-82qwg8 {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .clear-select.svelte-82qwg8 {
        all: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--clear-select-width, 40px);
        height: var(--clear-select-height, 100%);
        color: var(--clear-select-color, var(--icons-color));
        margin: var(--clear-select-margin, 0);
        pointer-events: all;
        flex-shrink: 0;
    }

    .clear-select.svelte-82qwg8:focus {
        outline: var(--clear-select-focus-outline, 1px solid #006fe8);
    }

    .loading.svelte-82qwg8 {
        width: var(--loading-width, 40px);
        height: var(--loading-height);
        color: var(--loading-color, var(--icons-color));
        margin: var(--loading--margin, 0);
        flex-shrink: 0;
    }

    .chevron.svelte-82qwg8 {
        width: var(--chevron-width, 40px);
        height: var(--chevron-height, 40px);
        background: var(--chevron-background, transparent);
        pointer-events: var(--chevron-pointer-events, none);
        color: var(--chevron-color, var(--icons-color));
        border: var(--chevron-border, 0 0 0 1px solid #d8dbdf);
        flex-shrink: 0;
    }

    .multi.svelte-82qwg8 {
        padding: var(--multi-select-padding, var(--internal-padding));
    }

    .multi.svelte-82qwg8 input:where(.svelte-82qwg8) {
        padding: var(--multi-select-input-padding, 0);
        position: relative;
        margin: var(--multi-select-input-margin, 5px 0);
        flex: 1 1 40px;
    }

    .svelte-select.error.svelte-82qwg8 {
        border: var(--error-border, 1px solid #ff2d55);
        background: var(--error-background, #fff);
    }

    .a11y-text.svelte-82qwg8 {
        z-index: 9999;
        border: 0px;
        clip: rect(1px, 1px, 1px, 1px);
        height: 1px;
        width: 1px;
        position: absolute;
        overflow: hidden;
        padding: 0px;
        white-space: nowrap;
    }

    .multi-item.svelte-82qwg8 {
        background: var(--multi-item-bg, #ebedef);
        margin: var(--multi-item-margin, 0);
        outline: var(--multi-item-outline, 1px solid #ddd);
        border-radius: var(--multi-item-border-radius, 4px);
        height: var(--multi-item-height, 25px);
        line-height: var(--multi-item-height, 25px);
        display: flex;
        cursor: default;
        padding: var(--multi-item-padding, 0 5px);
        overflow: hidden;
        gap: var(--multi-item-gap, 4px);
        outline-offset: -1px;
        max-width: var(--multi-max-width, none);
        color: var(--multi-item-color, var(--item-color));
    }

    .multi-item.disabled.svelte-82qwg8:hover {
        background: var(--multi-item-disabled-hover-bg, #ebedef);
        color: var(--multi-item-disabled-hover-color, #c1c6cc);
    }

    .multi-item-text.svelte-82qwg8 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .multi-item-clear.svelte-82qwg8 {
        display: flex;
        align-items: center;
        justify-content: center;
        --clear-icon-color: var(--multi-item-clear-icon-color, #000);
    }

    .multi-item.active.svelte-82qwg8 {
        outline: var(--multi-item-active-outline, 1px solid #006fe8);
    }

    .svelte-select-list.svelte-82qwg8 {
        box-shadow: var(--list-shadow, 0 2px 3px 0 rgba(44, 62, 80, 0.24));
        border-radius: var(--list-border-radius, 4px);
        max-height: var(--list-max-height, 252px);
        overflow-y: auto;
        background: var(--list-background, #fff);
        position: var(--list-position, absolute);
        z-index: var(--list-z-index, 2);
        border: var(--list-border);
    }

    .prefloat.svelte-82qwg8 {
        opacity: 0;
        pointer-events: none;
    }

    .list-group-title.svelte-82qwg8 {
        color: var(--group-title-color, #8f8f8f);
        cursor: default;
        font-size: var(--group-title-font-size, 16px);
        font-weight: var(--group-title-font-weight, 600);
        height: var(--height, 42px);
        line-height: var(--height, 42px);
        padding: var(--group-title-padding, 0 20px);
        text-overflow: ellipsis;
        overflow-x: hidden;
        white-space: nowrap;
        text-transform: var(--group-title-text-transform, uppercase);
        border-width: var(--group-title-border-width, medium);
        border-style: var(--group-title-border-style, none);
        border-color: var(--group-title-border-color, color);
    }

    .empty.svelte-82qwg8 {
        text-align: var(--list-empty-text-align, center);
        padding: var(--list-empty-padding, 20px 0);
        color: var(--list-empty-color, #78848f);
    }

    .item.svelte-82qwg8 {
        cursor: default;
        height: var(--item-height, var(--height, 42px));
        line-height: var(--item-line-height, var(--height, 42px));
        padding: var(--item-padding, 0 20px);
        color: var(--item-color, inherit);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        transition: var(--item-transition, all 0.2s);
        align-items: center;
        width: 100%;
    }

    .item.group-item.svelte-82qwg8 {
        padding-left: var(--group-item-padding-left, 40px);
    }

    .item.svelte-82qwg8:active {
        background: var(--item-active-background, #b9daff);
    }

    .item.active.svelte-82qwg8 {
        background: var(--item-is-active-bg, #007aff);
        color: var(--item-is-active-color, #fff);
    }

    .item.first.svelte-82qwg8 {
        border-radius: var(--item-first-border-radius, 4px 4px 0 0);
    }

    .item.hover.svelte-82qwg8:not(.active) {
        background: var(--item-hover-bg, #e7f2ff);
        color: var(--item-hover-color, inherit);
    }

    .item.not-selectable.svelte-82qwg8,
    .item.hover.item.not-selectable.svelte-82qwg8,
    .item.active.item.not-selectable.svelte-82qwg8,
    .item.not-selectable.svelte-82qwg8:active {
        color: var(--item-is-not-selectable-color, #999);
        background: transparent;
    }

    .required.svelte-82qwg8 {
        opacity: 0;
        z-index: -1;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
`);_('<div class="list-item svelte-82qwg8" tabindex="-1" role="none"><div class="item svelte-82qwg8"><!></div></div>');_('<div class="empty svelte-82qwg8">No options</div>');_('<div class="svelte-select-list svelte-82qwg8" role="none"><!> <!> <!></div>');_('<span id="aria-selection" class="svelte-82qwg8"> </span> <span id="aria-context" class="svelte-82qwg8"> </span>',1);_('<div class="multi-item-clear svelte-82qwg8"><!></div>');_('<div class="multi-item svelte-82qwg8" role="none"><span class="multi-item-text svelte-82qwg8"><!></span> <!></div>');_('<div class="selected-item svelte-82qwg8"><!></div>');_('<div class="icon loading svelte-82qwg8" aria-hidden="true"><!></div>');_('<button type="button" class="icon clear-select svelte-82qwg8"><!></button>');_('<div class="icon chevron svelte-82qwg8" aria-hidden="true"><!></div>');_('<input type="hidden" class="svelte-82qwg8">');_('<select class="required svelte-82qwg8" required tabindex="-1" aria-hidden="true"></select>');_('<div role="none"><!> <span aria-live="polite" aria-atomic="false" aria-relevant="additions text" class="a11y-text svelte-82qwg8"><!></span> <div class="prepend svelte-82qwg8"><!></div> <div class="value-container svelte-82qwg8"><!> <input></div> <div class="indicators svelte-82qwg8"><!> <!> <!></div> <!> <!></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
table.jse-transform-wizard.svelte-qbze6z {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
}
table.jse-transform-wizard.svelte-qbze6z input:where(.svelte-qbze6z) {
  font-family: inherit;
  font-size: inherit;
}
table.jse-transform-wizard.svelte-qbze6z tr:where(.svelte-qbze6z) th:where(.svelte-qbze6z) {
  font-weight: normal;
  text-align: left;
  width: 60px;
}
table.jse-transform-wizard.svelte-qbze6z tr:where(.svelte-qbze6z) td:where(.svelte-qbze6z) .jse-horizontal:where(.svelte-qbze6z) {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: calc(0.5 * var(--jse-padding, 10px));
}
table.jse-transform-wizard.svelte-qbze6z tr:where(.svelte-qbze6z) td:where(.svelte-qbze6z) .jse-horizontal:where(.svelte-qbze6z) .svelte-select .multi-item {
  align-items: center;
}
table.jse-transform-wizard.svelte-qbze6z tr:where(.svelte-qbze6z) td:where(.svelte-qbze6z) .jse-horizontal:where(.svelte-qbze6z) .svelte-select .value-container {
  gap: 0 !important;
}
table.jse-transform-wizard.svelte-qbze6z tr:where(.svelte-qbze6z) td:where(.svelte-qbze6z) .jse-horizontal:where(.svelte-qbze6z) .svelte-select.jse-filter-path {
  flex: 4;
  margin-right: calc(0.5 * var(--jse-padding, 10px));
}
table.jse-transform-wizard.svelte-qbze6z tr:where(.svelte-qbze6z) td:where(.svelte-qbze6z) .jse-horizontal:where(.svelte-qbze6z) .svelte-select.jse-filter-relation {
  flex: 1.5;
  margin-right: calc(0.5 * var(--jse-padding, 10px));
}
table.jse-transform-wizard.svelte-qbze6z tr:where(.svelte-qbze6z) td:where(.svelte-qbze6z) .jse-horizontal:where(.svelte-qbze6z) .svelte-select.jse-sort-path {
  flex: 3;
  margin-right: calc(0.5 * var(--jse-padding, 10px));
}
table.jse-transform-wizard.svelte-qbze6z tr:where(.svelte-qbze6z) td:where(.svelte-qbze6z) .jse-horizontal:where(.svelte-qbze6z) .svelte-select.jse-sort-direction {
  flex: 1;
}
table.jse-transform-wizard.svelte-qbze6z tr:where(.svelte-qbze6z) td:where(.svelte-qbze6z) .jse-horizontal:where(.svelte-qbze6z) .svelte-select.jse-projection-paths {
  flex: 1;
}
table.jse-transform-wizard.svelte-qbze6z tr:where(.svelte-qbze6z) td:where(.svelte-qbze6z) .jse-horizontal:where(.svelte-qbze6z) .svelte-select input {
  box-sizing: border-box;
}
table.jse-transform-wizard.svelte-qbze6z tr:where(.svelte-qbze6z) td:where(.svelte-qbze6z) .jse-horizontal:where(.svelte-qbze6z) .jse-filter-value:where(.svelte-qbze6z) {
  flex: 4;
  padding: 4px 8px;
  border: var(--jse-input-border, 1px solid #d8dbdf);
  border-radius: var(--jse-input-radius, 3px);
  outline: none;
  background: var(--jse-input-background, var(--jse-background-color, #fff));
  color: inherit;
}
table.jse-transform-wizard.svelte-qbze6z tr:where(.svelte-qbze6z) td:where(.svelte-qbze6z) .jse-horizontal:where(.svelte-qbze6z) .jse-filter-value:where(.svelte-qbze6z):focus {
  border: var(--jse-input-border-focus, 1px solid var(--jse-input-border-focus, var(--jse-theme-color, #3883fa)));
}`);_('<table class="jse-transform-wizard svelte-qbze6z"><tbody><tr class="svelte-qbze6z"><th class="svelte-qbze6z">Filter</th><td class="svelte-qbze6z"><div class="jse-horizontal svelte-qbze6z"><!> <!> <input class="jse-filter-value svelte-qbze6z"></div></td></tr><tr class="svelte-qbze6z"><th class="svelte-qbze6z">Sort</th><td class="svelte-qbze6z"><div class="jse-horizontal svelte-qbze6z"><!> <!></div></td></tr><tr class="svelte-qbze6z"><th class="svelte-qbze6z">Pick</th><td class="svelte-qbze6z"><div class="jse-horizontal svelte-qbze6z"><!></div></td></tr></tbody></table>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-select-query-language.svelte-atm4um {
  position: relative;
  width: 32px;
}
.jse-select-query-language.svelte-atm4um .jse-select-query-language-container:where(.svelte-atm4um) {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  box-shadow: var(--jse-controls-box-shadow, 0 2px 6px 0 rgba(0, 0, 0, 0.24));
}
.jse-select-query-language.svelte-atm4um .jse-select-query-language-container:where(.svelte-atm4um) .jse-query-language:where(.svelte-atm4um) {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  text-align: left;
  padding: var(--jse-padding, 10px) calc(2 * var(--jse-padding, 10px));
  white-space: nowrap;
  color: var(--jse-context-menu-color, var(--jse-text-color-inverse, #fff));
  background: var(--jse-context-menu-background, #656565);
}
.jse-select-query-language.svelte-atm4um .jse-select-query-language-container:where(.svelte-atm4um) .jse-query-language:where(.svelte-atm4um):hover {
  background: var(--jse-context-menu-background-highlight, #7a7a7a);
}`);_('<button type="button" class="jse-query-language svelte-atm4um"><!> </button>');_('<div class="jse-select-query-language svelte-atm4um"><div class="jse-select-query-language-container svelte-atm4um"></div></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-header.svelte-1y24war {
  display: flex;
  background: var(--jse-theme-color, #3883fa);
  color: var(--jse-menu-color, var(--jse-text-color-inverse, #fff));
}
.jse-header.svelte-1y24war .jse-title:where(.svelte-1y24war) {
  flex: 1;
  padding: 5px;
  vertical-align: middle;
}
.jse-header.svelte-1y24war button:where(.svelte-1y24war) {
  border: none;
  background: transparent;
  min-width: 32px;
  color: inherit;
  cursor: pointer;
}
.jse-header.svelte-1y24war button:where(.svelte-1y24war):hover {
  background: rgba(255, 255, 255, 0.1);
}`);_('<button type="button" class="jse-fullscreen svelte-1y24war" title="Toggle full screen"><!></button>');_('<div class="jse-header svelte-1y24war"><div class="jse-title svelte-1y24war"> </div> <!> <!> <button type="button" class="jse-close svelte-1y24war"><!></button></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-config.svelte-1kpylsp {
  border: none;
  background: transparent;
  min-width: 32px;
  color: inherit;
  cursor: pointer;
}
.jse-config.svelte-1kpylsp:hover {
  background: rgba(255, 255, 255, 0.1);
}
.jse-config.hide.svelte-1kpylsp {
  display: none;
}`);_('<button slot="actions" type="button" class="jse-config svelte-1kpylsp" title="Select a query language"><!></button>');qs("jsoneditor:AutoScrollHandler");qs("validation");qs("jsoneditor:FocusTracker");G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-message.svelte-czprfx {
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  padding: var(--jse-padding, 10px);
  display: flex;
  gap: var(--jse-padding, 10px);
  flex-wrap: wrap;
  align-items: stretch;
}
.jse-message.jse-success.svelte-czprfx {
  background: var(--message-success-background, #9ac45d);
  color: var(--jse-message-success-color, #fff);
}
.jse-message.svelte-czprfx .jse-text:where(.svelte-czprfx) {
  display: flex;
  flex: 1;
  min-width: 60%;
  align-items: center;
}
.jse-message.svelte-czprfx .jse-text.jse-clickable:where(.svelte-czprfx) {
  cursor: pointer;
}
.jse-message.svelte-czprfx .jse-text.jse-clickable:where(.svelte-czprfx):hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.jse-message.jse-error.svelte-czprfx {
  background: var(--jse-message-error-background, var(--jse-error-color, #ee5341));
  color: var(--jse-message-error-color, #fff);
}
.jse-message.jse-warning.svelte-czprfx {
  background: var(--jse-message-warning-background, #ffde5c);
  color: var(--jse-message-warning-color, #4d4d4d);
}
.jse-message.jse-info.svelte-czprfx {
  background: var(--jse-message-info-background, #4f91ff);
  color: var(--jse-message-info-color, #fff);
}
.jse-message.svelte-czprfx .jse-actions:where(.svelte-czprfx) {
  display: flex;
  gap: var(--jse-padding, 10px);
}
.jse-message.svelte-czprfx .jse-actions:where(.svelte-czprfx) button.jse-action:where(.svelte-czprfx) {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  background: var(--jse-message-action-background, rgba(255, 255, 255, 0.2));
  color: inherit;
  padding: calc(0.5 * var(--jse-padding, 10px)) var(--jse-padding, 10px);
}
.jse-message.svelte-czprfx .jse-actions:where(.svelte-czprfx) button.jse-action:where(.svelte-czprfx):hover {
  background: var(--jse-message-action-background-highlight, rgba(255, 255, 255, 0.3));
}`);_('<button type="button" class="jse-button jse-action jse-primary svelte-czprfx"><!> </button>');_('<div><div role="button" tabindex="-1" class="jse-text svelte-czprfx"><div class="jse-text-centered"><!> </div></div> <div class="jse-actions svelte-czprfx"></div></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-validation-errors-overview.svelte-1uindol {
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  overflow: auto;
  max-height: 25%;
}
.jse-validation-errors-overview.svelte-1uindol table:where(.svelte-1uindol) {
  border-collapse: collapse;
  width: 100%;
}
.jse-validation-errors-overview.svelte-1uindol table:where(.svelte-1uindol) tr:where(.svelte-1uindol) {
  cursor: pointer;
}
.jse-validation-errors-overview.svelte-1uindol table:where(.svelte-1uindol) tr.jse-validation-error:where(.svelte-1uindol) {
  background: var(--jse-message-error-background, var(--jse-error-color, #ee5341));
  color: var(--jse-message-error-color, #fff);
}
.jse-validation-errors-overview.svelte-1uindol table:where(.svelte-1uindol) tr.jse-validation-warning:where(.svelte-1uindol) {
  background: var(--jse-message-warning-background, #ffde5c);
  color: var(--jse-message-warning-color, #4d4d4d);
}
.jse-validation-errors-overview.svelte-1uindol table:where(.svelte-1uindol) tr.jse-validation-warning:where(.svelte-1uindol):hover {
  filter: brightness(105%);
}
.jse-validation-errors-overview.svelte-1uindol table:where(.svelte-1uindol) tr.jse-validation-info:where(.svelte-1uindol) {
  background: var(--jse-message-info-background, #4f91ff);
  color: var(--jse-message-info-color, #fff);
}
.jse-validation-errors-overview.svelte-1uindol table:where(.svelte-1uindol) tr:where(.svelte-1uindol):hover {
  filter: brightness(110%);
}
.jse-validation-errors-overview.svelte-1uindol table:where(.svelte-1uindol) tr:where(.svelte-1uindol) td:where(.svelte-1uindol) {
  padding: 4px var(--jse-padding, 10px);
  vertical-align: middle;
}
.jse-validation-errors-overview.svelte-1uindol table:where(.svelte-1uindol) tr:where(.svelte-1uindol) td.jse-validation-error-icon:where(.svelte-1uindol) {
  width: 36px;
  box-sizing: border-box;
}
.jse-validation-errors-overview.svelte-1uindol table:where(.svelte-1uindol) tr:where(.svelte-1uindol) td.jse-validation-error-action:where(.svelte-1uindol) {
  width: 36px;
  box-sizing: border-box;
  padding: 0;
}
.jse-validation-errors-overview.svelte-1uindol table:where(.svelte-1uindol) tr:where(.svelte-1uindol) td.jse-validation-error-action:where(.svelte-1uindol) button.jse-validation-errors-collapse:where(.svelte-1uindol) {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  width: 36px;
  height: 26px;
  cursor: pointer;
}
.jse-validation-errors-overview.svelte-1uindol table:where(.svelte-1uindol) tr:where(.svelte-1uindol) td.jse-validation-error-action:where(.svelte-1uindol) button.jse-validation-errors-collapse:where(.svelte-1uindol):hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.jse-validation-errors-overview.svelte-1uindol table:where(.svelte-1uindol) tr:where(.svelte-1uindol) td:where(.svelte-1uindol) div.jse-validation-errors-expand:where(.svelte-1uindol) {
  display: inline-block;
  position: relative;
  top: 3px;
}`);_('<button type="button" class="jse-validation-errors-collapse svelte-1uindol" title="Collapse validation errors"><!></button>');_('<tr tabindex="0"><td class="jse-validation-error-icon svelte-1uindol"><!></td><td class="jse-validation-error-path svelte-1uindol"> </td><td class="jse-validation-error-message svelte-1uindol"> </td><td class="jse-validation-error-action svelte-1uindol"><!></td></tr>');_('<tr class="jse-validation-error svelte-1uindol"><td class="svelte-1uindol"></td><td class="svelte-1uindol"></td><td class="svelte-1uindol"> </td><td class="svelte-1uindol"></td></tr>');_('<table class="jse-validation-errors-overview-expanded svelte-1uindol"><tbody><!><!></tbody></table>');_('<table class="jse-validation-errors-overview-collapsed svelte-1uindol"><tbody><tr><td class="jse-validation-error-icon svelte-1uindol"><!></td><td class="jse-validation-error-count svelte-1uindol"> <div class="jse-validation-errors-expand svelte-1uindol"><!></div></td></tr></tbody></table>');_('<div class="jse-validation-errors-overview svelte-1uindol"><!></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
dialog.jse-modal.svelte-1s9c2ql {
  border-radius: 3px;
  font-size: var(--jse-padding, 10px);
  border: none;
  padding: 0;
  display: flex;
  min-width: 0;
  margin: auto;
  overflow: visible;
  transition: width 0.1s ease-in-out, height 0.1s ease-in-out;
}
dialog.jse-modal.jse-sort-modal.svelte-1s9c2ql {
  width: 400px;
}
dialog.jse-modal.jse-repair-modal.svelte-1s9c2ql {
  width: 600px;
  height: 500px;
}
dialog.jse-modal.jse-jsoneditor-modal.svelte-1s9c2ql {
  width: 800px;
  height: 600px;
}
dialog.jse-modal.jse-transform-modal.svelte-1s9c2ql {
  width: 1200px;
  height: 800px;
}
dialog.jse-modal.jse-fullscreen.svelte-1s9c2ql {
  width: 100%;
  height: 100%;
}
dialog.jse-modal.svelte-1s9c2ql::backdrop {
  background: var(--jse-overlay-background, rgba(0, 0, 0, 0.3));
}
dialog.jse-modal[open].svelte-1s9c2ql {
  animation: svelte-1s9c2ql-zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
dialog.jse-modal[open].svelte-1s9c2ql::backdrop {
  animation: svelte-1s9c2ql-fade 0.2s ease-out;
}
dialog.jse-modal.svelte-1s9c2ql .jse-modal-inner:where(.svelte-1s9c2ql) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 0;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  line-height: normal;
  background: var(--jse-modal-background, #f5f5f5);
  color: var(--jse-text-color, #4d4d4d);
}
@keyframes svelte-1s9c2ql-zoom {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}
@keyframes svelte-1s9c2ql-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
dialog.jse-modal.svelte-1s9c2ql .svelte-select {
  --border: var(--jse-svelte-select-border, 1px solid #d8dbdf);
  --item-is-active-bg: var(--jse-item-is-active-bg, #3883fa);
  --border-radius: var(--jse-svelte-select-border-radius, 3px);
  --background: var(--jse-svelte-select-background, #fff);
  --padding: var(--jse-svelte-select-padding, 0 10px);
  --multi-select-padding: var(--jse-svelte-select-multi-select-padding, 0 10px);
  --font-size: var(--jse-svelte-select-font-size, var(--jse-font-size, 16px));
  --height: 36px;
  --multi-item-height: 28px;
  --multi-item-margin: 2px;
  --multi-item-padding: 2px 8px;
  --multi-item-border-radius: 6px;
  --indicator-top: 8px;
}`);_('<dialog><div class="jse-modal-inner svelte-1s9c2ql"><!></div></dialog>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-modal-contents.svelte-189qksl {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: auto;
  min-width: 0;
  min-height: 0;
}
.jse-modal-contents.svelte-189qksl .jse-actions:where(.svelte-189qksl) {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-top: var(--jse-padding, 10px);
}
.jse-modal-contents.svelte-189qksl .jse-actions:where(.svelte-189qksl) button.jse-primary:where(.svelte-189qksl) {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  background: var(--jse-button-primary-background, var(--jse-theme-color, #3883fa));
  color: var(--jse-button-primary-color, #fff);
  padding: var(--jse-padding, 10px) calc(2 * var(--jse-padding, 10px));
  border-radius: 3px;
}
.jse-modal-contents.svelte-189qksl .jse-actions:where(.svelte-189qksl) button.jse-primary:where(.svelte-189qksl):hover {
  background: var(--jse-button-primary-background-highlight, var(--jse-theme-color-highlight, #5f9dff));
}
.jse-modal-contents.svelte-189qksl .jse-actions:where(.svelte-189qksl) button.jse-primary:where(.svelte-189qksl):disabled {
  background: var(--jse-button-primary-background-disabled, #9d9d9d);
}

.jse-shortcuts.svelte-189qksl {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: calc(2 * var(--jse-padding, 10px)) 0;
}
.jse-shortcuts.svelte-189qksl .jse-shortcut:where(.svelte-189qksl) .jse-key:where(.svelte-189qksl) {
  font-size: 200%;
  color: var(--jse-theme-color, #3883fa);
}`);_('<!> <div class="jse-modal-contents svelte-189qksl"><div>These actions are unavailable via the menu. Please use:</div> <div class="jse-shortcuts svelte-189qksl"><div class="jse-shortcut svelte-189qksl"><div class="jse-key svelte-189qksl"></div> for copy</div> <div class="jse-shortcut svelte-189qksl"><div class="jse-key svelte-189qksl"></div> for cut</div> <div class="jse-shortcut svelte-189qksl"><div class="jse-key svelte-189qksl"></div> for paste</div></div> <div class="jse-actions svelte-189qksl"><button type="button" class="jse-primary svelte-189qksl">Close</button></div></div>',1);G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-menu.svelte-pf7s2l {
  background: var(--jse-theme-color, #3883fa);
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size-main-menu, 14px);
  color: var(--jse-menu-color, var(--jse-text-color-inverse, #fff));
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  position: relative;
}
.jse-menu.svelte-pf7s2l .jse-button:where(.svelte-pf7s2l) {
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5em;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  width: var(--jse-menu-button-size, 32px);
  height: var(--jse-menu-button-size, 32px);
  padding: calc(0.5 * var(--jse-padding, 10px));
  margin: 0;
  border-radius: 0;
  display: inline-flex;
  align-items: center;
  text-align: center;
  justify-content: center;
}
.jse-menu.svelte-pf7s2l .jse-button:where(.svelte-pf7s2l):hover, .jse-menu.svelte-pf7s2l .jse-button:where(.svelte-pf7s2l):focus {
  background: var(--jse-theme-color-highlight, #5f9dff);
}
.jse-menu.svelte-pf7s2l .jse-button:where(.svelte-pf7s2l):disabled {
  color: var(--jse-menu-color, var(--jse-text-color-inverse, #fff));
  opacity: 0.5;
  background: transparent;
}
.jse-menu.svelte-pf7s2l .jse-button.jse-group-button:where(.svelte-pf7s2l) {
  width: auto;
  height: calc(var(--jse-menu-button-size, 32px) - var(--jse-padding, 10px));
  margin: calc(0.5 * var(--jse-padding, 10px)) 0;
  padding: 0 calc(0.5 * var(--jse-padding, 10px)) 1px;
  border: 1px solid var(--jse-menu-color, var(--jse-text-color-inverse, #fff));
}
.jse-menu.svelte-pf7s2l .jse-button.jse-group-button:where(.svelte-pf7s2l):not(.jse-last) {
  border-right: none;
}
.jse-menu.svelte-pf7s2l .jse-button.jse-group-button.jse-first:where(.svelte-pf7s2l) {
  margin-left: calc(0.5 * var(--jse-padding, 10px));
}
.jse-menu.svelte-pf7s2l .jse-button.jse-group-button.jse-last:where(.svelte-pf7s2l) {
  margin-right: calc(0.5 * var(--jse-padding, 10px));
}
.jse-menu.svelte-pf7s2l .jse-button.jse-group-button:where(.svelte-pf7s2l):hover, .jse-menu.svelte-pf7s2l .jse-button.jse-group-button:where(.svelte-pf7s2l):focus {
  background: var(--jse-theme-color-highlight, #5f9dff);
}
.jse-menu.svelte-pf7s2l .jse-button.jse-group-button.jse-selected:where(.svelte-pf7s2l) {
  background: var(--jse-menu-color, var(--jse-text-color-inverse, #fff));
  color: var(--jse-theme-color, #3883fa);
}
.jse-menu.svelte-pf7s2l .jse-space:where(.svelte-pf7s2l) {
  flex: 1;
}
.jse-menu.svelte-pf7s2l .jse-separator:where(.svelte-pf7s2l) {
  background: var(--jse-menu-color, var(--jse-text-color-inverse, #fff));
  opacity: 0.3;
  width: 1px;
  margin: 3px;
}`);_('<div class="jse-separator svelte-pf7s2l"></div>');_('<div class="jse-space svelte-pf7s2l"></div>');_('<button type="button"><!> <!></button>');_('<div class="jse-menu svelte-pf7s2l"><!> <!> <!></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-json-repair-component.svelte-3golau {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--jse-background-color, #fff);
  color: var(--jse-text-color, #4d4d4d);
}
.jse-json-repair-component.svelte-3golau .jse-info:where(.svelte-3golau) {
  padding: calc(0.5 * var(--jse-padding, 10px));
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  vertical-align: center;
}
.jse-json-repair-component.svelte-3golau .jse-json-text:where(.svelte-3golau) {
  flex: 1;
  border: none;
  padding: 2px;
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  background: var(--jse-input-background, var(--jse-background-color, #fff));
  color: var(--jse-text-color, #4d4d4d);
  resize: none;
  outline: none;
}`);_('<div slot="left" class="jse-info svelte-3golau">Repair invalid JSON, then click apply</div>');_('<div class="jse-json-repair-component svelte-3golau"><!> <!> <textarea class="jse-json-text svelte-3golau" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
div.jse-collapsed-items.svelte-1h6hzoq {
  margin-left: calc(var(--level) * var(--jse-indent-size, calc(1em + 4px)));
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  color: var(--jse-collapsed-items-link-color, rgba(0, 0, 0, 0.38));
  padding: calc(0.5 * var(--jse-padding, 10px));
  border: 8px solid transparent;
  border-width: 8px 0;
  background-color: var(--jse-contents-background-color, transparent);
  background-image: linear-gradient(var(--jse-collapsed-items-background-color, #f5f5f5), var(--jse-collapsed-items-background-color, #f5f5f5)), linear-gradient(to bottom right, transparent 50.5%, var(--jse-collapsed-items-background-color, #f5f5f5) 50.5%), linear-gradient(to bottom left, transparent 50.5%, var(--jse-collapsed-items-background-color, #f5f5f5) 50.5%), linear-gradient(to top right, transparent 50.5%, var(--jse-collapsed-items-background-color, #f5f5f5) 50.5%), linear-gradient(to top left, transparent 50.5%, var(--jse-collapsed-items-background-color, #f5f5f5) 50.5%);
  background-repeat: repeat, repeat-x, repeat-x, repeat-x, repeat-x;
  background-position: 0 0, 8px 0, 8px 0, 8px 100%, 8px 100%;
  background-size: auto auto, 16px 16px, 16px 16px, 16px 16px, 16px 16px;
  background-clip: padding-box, border-box, border-box, border-box, border-box;
  background-origin: padding-box, border-box, border-box, border-box, border-box;
  display: flex;
}
div.jse-collapsed-items.jse-selected.svelte-1h6hzoq {
  background-color: var(--jse-selection-background-color, #d3d3d3);
  --jse-collapsed-items-background-color: var(--jse-collapsed-items-selected-background-color, #c2c2c2);
}
div.jse-collapsed-items.svelte-1h6hzoq div.jse-text:where(.svelte-1h6hzoq),
div.jse-collapsed-items.svelte-1h6hzoq button.jse-expand-items:where(.svelte-1h6hzoq) {
  margin: 0 calc(0.5 * var(--jse-padding, 10px));
}
div.jse-collapsed-items.svelte-1h6hzoq div.jse-text:where(.svelte-1h6hzoq) {
  display: inline;
}
div.jse-collapsed-items.svelte-1h6hzoq button.jse-expand-items:where(.svelte-1h6hzoq) {
  font-family: inherit;
  font-size: inherit;
  color: var(--jse-collapsed-items-link-color, rgba(0, 0, 0, 0.38));
  background: none;
  border: none;
  padding: 0;
  text-decoration: underline;
  cursor: pointer;
}
div.jse-collapsed-items.svelte-1h6hzoq button.jse-expand-items:where(.svelte-1h6hzoq):hover, div.jse-collapsed-items.svelte-1h6hzoq button.jse-expand-items:where(.svelte-1h6hzoq):focus {
  color: var(--jse-collapsed-items-link-color-highlight, #ee5341);
}`);_('<button type="button" class="jse-expand-items svelte-1h6hzoq"> </button>');_('<div role="none" class="jse-collapsed-items svelte-1h6hzoq"><div><div class="jse-text svelte-1h6hzoq"> </div> <!></div></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-context-menu-pointer.svelte-137iwnw {
  position: absolute;
  top: calc(-0.5 * var(--jse-context-menu-pointer-size, calc(1em + 4px)));
  right: calc(-0.5 * var(--jse-context-menu-pointer-size, calc(1em + 4px)));
  width: var(--jse-context-menu-pointer-size, calc(1em + 4px));
  height: var(--jse-context-menu-pointer-size, calc(1em + 4px));
  padding: 0;
  margin: 0;
  cursor: pointer;
  background: transparent;
  border-radius: 2px;
  background: var(--jse-context-menu-pointer-hover-background, #b2b2b2);
  color: var(--jse-context-menu-pointer-color, var(--jse-context-menu-color, var(--jse-text-color-inverse, #fff)));
  border: none;
  box-shadow: var(--jse-controls-box-shadow, 0 2px 6px 0 rgba(0, 0, 0, 0.24));
}
.jse-context-menu-pointer.jse-root.svelte-137iwnw {
  top: 0;
  right: calc(-2px - var(--jse-context-menu-pointer-size, calc(1em + 4px)));
}
.jse-context-menu-pointer.jse-insert.svelte-137iwnw {
  right: -1px;
}
.jse-context-menu-pointer.svelte-137iwnw:hover {
  background: var(--jse-context-menu-pointer-background-highlight, var(--jse-context-menu-background-highlight, #7a7a7a));
}
.jse-context-menu-pointer.jse-selected.svelte-137iwnw {
  background: var(--jse-context-menu-pointer-background, var(--jse-context-menu-background, #656565));
}
.jse-context-menu-pointer.jse-selected.svelte-137iwnw:hover {
  background: var(--jse-context-menu-pointer-background-highlight, var(--jse-context-menu-background-highlight, #7a7a7a));
}`);_('<button type="button" class="jse-context-menu-pointer svelte-137iwnw"><!></button>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-key.svelte-2iqnqn {
  display: inline-block;
  min-width: 2em;
  padding: 0 5px;
  box-sizing: border-box;
  outline: none;
  border-radius: 1px;
  vertical-align: top;
  color: var(--jse-key-color, #1a1a1a);
  word-break: normal;
  overflow-wrap: normal;
  white-space: pre-wrap;
}
.jse-key.jse-empty.svelte-2iqnqn {
  min-width: 3em;
  outline: 1px dotted var(--jse-tag-background, rgba(0, 0, 0, 0.2));
  -moz-outline-radius: 2px;
}
.jse-key.jse-empty.svelte-2iqnqn::after {
  pointer-events: none;
  color: var(--jse-tag-background, rgba(0, 0, 0, 0.2));
  content: "key";
}`);_('<div role="none" data-type="selectable-key" class="jse-key svelte-2iqnqn"><!></div>');_("<!> <!>",1);_('<div role="button" tabindex="-1" class="jse-value" data-type="selectable-value"></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
button.jse-validation-error.svelte-1a8aobl {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  padding: 0;
  margin: 0;
  vertical-align: top;
  display: inline-flex;
  color: var(--jse-error-color, #ee5341);
}

button.jse-validation-info.svelte-1a8aobl {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  padding: 0;
  margin: 0;
  vertical-align: top;
  display: inline-flex;
  color: var(--jse-info-color, #4f91ff);
}

button.jse-validation-warning.svelte-1a8aobl {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  padding: 0;
  margin: 0;
  vertical-align: top;
  display: inline-flex;
  color: var(--jse-warning-color, #fdc539);
}`);_('<button type="button"><!></button>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-expand.svelte-wovgt4 {
  width: var(--jse-indent-size, calc(1em + 4px));
  padding: 0;
  margin: 0;
  border: none;
  cursor: pointer;
  background: transparent;
  color: var(--jse-delimiter-color, rgba(0, 0, 0, 0.38));
  font-size: var(--jse-font-size-mono, 14px);
  height: var(--jse-line-height, calc(1em + 4px));
}
.jse-expand.svelte-wovgt4:hover {
  opacity: 0.8;
}

.jse-meta.svelte-wovgt4,
.jse-separator.svelte-wovgt4,
.jse-index.svelte-wovgt4,
.jse-bracket.svelte-wovgt4 {
  vertical-align: top;
  color: var(--jse-delimiter-color, rgba(0, 0, 0, 0.38));
}

.jse-index.svelte-wovgt4 {
  padding: 0 calc(0.5 * var(--jse-padding, 10px));
}

.jse-bracket.svelte-wovgt4 {
  padding: 0 2px;
}
.jse-bracket.jse-expanded.svelte-wovgt4 {
  padding-right: var(--jse-padding, 10px);
}

.jse-tag.svelte-wovgt4 {
  border: none;
  font-size: 80%;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  color: var(--jse-tag-color, var(--jse-text-color-inverse, #fff));
  background: var(--jse-tag-background, rgba(0, 0, 0, 0.2));
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  padding: 0 4px;
  line-height: normal;
  margin: 1px 0;
}
.jse-tag.svelte-wovgt4:hover {
  opacity: 0.8;
}
.jse-tag.jse-expanded.svelte-wovgt4 {
  opacity: 0.7;
  cursor: inherit;
}

.jse-identifier.svelte-wovgt4 {
  vertical-align: top;
  position: relative;
}

.jse-json-node.svelte-wovgt4 {
  position: relative;
  color: var(--jse-text-color, #4d4d4d);
}
.jse-json-node.jse-root.svelte-wovgt4 {
  min-height: 100%;
  padding-bottom: 2px;
  box-sizing: border-box;
}
.jse-json-node.jse-root.svelte-wovgt4 > .jse-contents-outer:where(.svelte-wovgt4) > .jse-contents:where(.svelte-wovgt4) {
  padding-left: 0;
}
.jse-json-node.svelte-wovgt4 .jse-props:where(.svelte-wovgt4),
.jse-json-node.svelte-wovgt4 .jse-items:where(.svelte-wovgt4) {
  position: relative;
}
.jse-json-node.svelte-wovgt4 .jse-header-outer:where(.svelte-wovgt4),
.jse-json-node.svelte-wovgt4 .jse-footer-outer:where(.svelte-wovgt4) {
  display: flex;
  margin-left: calc(var(--level) * var(--jse-indent-size, calc(1em + 4px)));
}
.jse-json-node.svelte-wovgt4 .jse-header:where(.svelte-wovgt4) {
  position: relative;
}
.jse-json-node.svelte-wovgt4 .jse-header:where(.svelte-wovgt4) .jse-meta:where(.svelte-wovgt4) > .jse-meta-inner:where(.svelte-wovgt4) {
  display: flex;
  justify-content: center;
}
.jse-json-node.svelte-wovgt4 .jse-contents-outer:where(.svelte-wovgt4) {
  display: flex;
  margin-left: calc(var(--level) * var(--jse-indent-size, calc(1em + 4px)));
}
.jse-json-node.svelte-wovgt4 .jse-header:where(.svelte-wovgt4),
.jse-json-node.svelte-wovgt4 .jse-contents:where(.svelte-wovgt4) {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
.jse-json-node.svelte-wovgt4 .jse-contents:where(.svelte-wovgt4) {
  padding-left: var(--jse-indent-size, calc(1em + 4px));
  cursor: var(--jse-contents-cursor, pointer);
}
.jse-json-node.svelte-wovgt4 .jse-contents:where(.svelte-wovgt4) .jse-value-outer:where(.svelte-wovgt4) {
  display: inline-flex;
}
.jse-json-node.svelte-wovgt4 .jse-footer:where(.svelte-wovgt4) {
  display: inline-flex;
  padding-left: calc(var(--jse-indent-size, calc(1em + 4px)) + 5px);
}
.jse-json-node.svelte-wovgt4 .jse-header:where(.svelte-wovgt4),
.jse-json-node.svelte-wovgt4 .jse-contents:where(.svelte-wovgt4),
.jse-json-node.svelte-wovgt4 .jse-footer:where(.svelte-wovgt4) {
  background: var(--jse-contents-background-color, transparent);
}
.jse-json-node.svelte-wovgt4 .jse-insert-selection-area:where(.svelte-wovgt4) {
  padding: 0 calc(0.5 * var(--jse-padding, 10px));
  flex: 1;
}
.jse-json-node.svelte-wovgt4 .jse-insert-selection-area.jse-inside:where(.svelte-wovgt4) {
  display: inline-flex;
  align-items: center;
}
.jse-json-node.svelte-wovgt4 .jse-insert-selection-area.jse-after:where(.svelte-wovgt4) {
  display: flex;
  align-items: flex-end;
}
.jse-json-node.svelte-wovgt4 .jse-context-menu-pointer-anchor:where(.svelte-wovgt4) {
  position: relative;
}
.jse-json-node.svelte-wovgt4 .jse-insert-area:where(.svelte-wovgt4) {
  display: flex;
  position: relative;
  z-index: 1;
  margin-left: calc(var(--level) * var(--jse-indent-size, calc(1em + 4px)));
  max-width: 250px;
  min-width: 100px;
  height: 0;
  margin-right: calc(0.5 * var(--jse-padding, 10px));
  outline: 1px solid;
}
.jse-json-node.svelte-wovgt4 .jse-insert-area.jse-hovered:where(.svelte-wovgt4) {
  outline-color: var(--jse-context-menu-pointer-hover-background, #b2b2b2);
}
.jse-json-node.svelte-wovgt4 .jse-key-outer:where(.svelte-wovgt4) {
  position: relative;
}
.jse-json-node.svelte-wovgt4 .jse-key-outer:where(.svelte-wovgt4):hover,
.jse-json-node.svelte-wovgt4 .jse-value-outer:where(.svelte-wovgt4):hover,
.jse-json-node.svelte-wovgt4 .jse-meta:where(.svelte-wovgt4):hover,
.jse-json-node.svelte-wovgt4 .jse-footer:where(.svelte-wovgt4):hover {
  background: var(--jse-hover-background-color, rgba(0, 0, 0, 0.06));
  cursor: var(--jse-contents-cursor, pointer);
}
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-value-outer,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-meta,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-items .jse-header,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-items .jse-contents,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-props .jse-header,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-props .jse-contents,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-footer {
  background: var(--jse-hover-background-color, rgba(0, 0, 0, 0.06));
  cursor: var(--jse-contents-cursor, pointer);
}
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-value-outer .jse-value-outer,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-value-outer .jse-meta,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-meta .jse-value-outer,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-meta .jse-meta,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-items .jse-header .jse-value-outer,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-items .jse-header .jse-meta,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-items .jse-contents .jse-value-outer,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-items .jse-contents .jse-meta,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-props .jse-header .jse-value-outer,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-props .jse-header .jse-meta,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-props .jse-contents .jse-value-outer,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-props .jse-contents .jse-meta,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-footer .jse-value-outer,
.jse-json-node.jse-hovered.svelte-wovgt4:not(.jse-selected):not(.jse-selected-value) .jse-footer .jse-meta {
  background: none;
}
.jse-json-node.jse-selected.svelte-wovgt4 .jse-header:where(.svelte-wovgt4),
.jse-json-node.jse-selected.svelte-wovgt4 .jse-contents:where(.svelte-wovgt4),
.jse-json-node.jse-selected.svelte-wovgt4 .jse-footer:where(.svelte-wovgt4) {
  background: var(--jse-selection-background-color, #d3d3d3);
  cursor: var(--jse-contents-selected-cursor, grab);
}
.jse-json-node.jse-selected.svelte-wovgt4 .jse-key-outer:where(.svelte-wovgt4):hover,
.jse-json-node.jse-selected.svelte-wovgt4 .jse-value-outer:where(.svelte-wovgt4):hover,
.jse-json-node.jse-selected.svelte-wovgt4 .jse-meta:where(.svelte-wovgt4):hover,
.jse-json-node.jse-selected.svelte-wovgt4 .jse-footer:where(.svelte-wovgt4):hover {
  background: inherit;
  cursor: inherit;
}
.jse-json-node.svelte-wovgt4 .jse-key-outer.jse-selected-key:where(.svelte-wovgt4) {
  background: var(--jse-selection-background-color, #d3d3d3);
  cursor: var(--jse-contents-selected-cursor, grab);
}
.jse-json-node.jse-selected-value.svelte-wovgt4 .jse-value-outer,
.jse-json-node.jse-selected-value.svelte-wovgt4 .jse-meta,
.jse-json-node.jse-selected-value.svelte-wovgt4 .jse-items .jse-header,
.jse-json-node.jse-selected-value.svelte-wovgt4 .jse-items .jse-contents,
.jse-json-node.jse-selected-value.svelte-wovgt4 .jse-props .jse-header,
.jse-json-node.jse-selected-value.svelte-wovgt4 .jse-props .jse-contents,
.jse-json-node.jse-selected-value.svelte-wovgt4 .jse-footer {
  background: var(--jse-selection-background-color, #d3d3d3);
  cursor: var(--jse-contents-selected-cursor, grab);
}
.jse-json-node.jse-selected-value.svelte-wovgt4 .jse-value-outer .jse-key-outer:hover,
.jse-json-node.jse-selected-value.svelte-wovgt4 .jse-meta .jse-key-outer:hover,
.jse-json-node.jse-selected-value.svelte-wovgt4 .jse-items .jse-header .jse-key-outer:hover,
.jse-json-node.jse-selected-value.svelte-wovgt4 .jse-items .jse-contents .jse-key-outer:hover,
.jse-json-node.jse-selected-value.svelte-wovgt4 .jse-props .jse-header .jse-key-outer:hover,
.jse-json-node.jse-selected-value.svelte-wovgt4 .jse-props .jse-contents .jse-key-outer:hover,
.jse-json-node.jse-selected-value.svelte-wovgt4 .jse-footer .jse-key-outer:hover {
  background: inherit;
  cursor: inherit;
}
.jse-json-node.jse-readonly.svelte-wovgt4 {
  --jse-contents-selected-cursor: pointer;
}
.jse-json-node.svelte-wovgt4 .jse-insert-area.jse-selected:where(.svelte-wovgt4) {
  outline-color: var(--jse-context-menu-pointer-background, var(--jse-context-menu-background, #656565));
}`);_('<div class="jse-separator svelte-wovgt4">:</div>');_('<div class="jse-bracket svelte-wovgt4">[</div> <span class="jse-tag jse-expanded svelte-wovgt4"> </span> &nbsp;',1);_('<div class="jse-bracket svelte-wovgt4">[</div> <button type="button" class="jse-tag svelte-wovgt4"> </button> <div class="jse-bracket svelte-wovgt4">]</div>',1);_('<div class="jse-context-menu-pointer-anchor svelte-wovgt4"><!></div>');_('<div role="none" class="jse-insert-selection-area jse-inside svelte-wovgt4" data-type="insert-selection-area-inside"></div>');_('<div role="none" class="jse-insert-selection-area jse-after svelte-wovgt4" data-type="insert-selection-area-after"></div>');_('<div class="jse-insert-area jse-inside svelte-wovgt4" data-type="insert-selection-area-inside"><!></div>');_('<div slot="identifier" class="jse-identifier svelte-wovgt4"><div class="jse-index svelte-wovgt4"> </div></div>');_("<!> <!>",1);_('<div role="none" class="jse-insert-selection-area jse-after svelte-wovgt4" data-type="insert-selection-area-after"></div>');_('<div class="jse-items svelte-wovgt4"><!> <!></div> <div class="jse-footer-outer svelte-wovgt4"><div data-type="selectable-value" class="jse-footer svelte-wovgt4"><span class="jse-bracket svelte-wovgt4">]</span></div> <!></div>',1);_('<div class="jse-header-outer svelte-wovgt4"><div class="jse-header svelte-wovgt4"><button type="button" class="jse-expand svelte-wovgt4" title="Expand or collapse this array (Ctrl+Click to expand/collapse recursively)"><!></button> <!> <!> <div class="jse-meta svelte-wovgt4"><div class="jse-meta-inner svelte-wovgt4" data-type="selectable-value"><!></div></div> <!></div> <!> <!></div> <!>',1);_('<div class="jse-separator svelte-wovgt4">:</div>');_('<div class="jse-bracket jse-expanded svelte-wovgt4">&lbrace;</div>');_('<div class="jse-bracket svelte-wovgt4">&lbrace;</div> <button type="button" class="jse-tag svelte-wovgt4"> </button> <div class="jse-bracket svelte-wovgt4">&rbrace;</div>',1);_('<div class="jse-context-menu-pointer-anchor svelte-wovgt4"><!></div>');_('<div role="none" class="jse-insert-selection-area jse-inside svelte-wovgt4" data-type="insert-selection-area-inside"></div>');_('<div role="none" class="jse-insert-selection-area jse-after svelte-wovgt4" data-type="insert-selection-area-after"></div>');_('<div class="jse-insert-area jse-inside svelte-wovgt4" data-type="insert-selection-area-inside"><!></div>');_('<div slot="identifier" class="jse-key-outer svelte-wovgt4"><!></div>');_('<div role="none" class="jse-insert-selection-area jse-after svelte-wovgt4" data-type="insert-selection-area-after"></div>');_('<div class="jse-props svelte-wovgt4"><!> <!></div> <div class="jse-footer-outer svelte-wovgt4"><div data-type="selectable-value" class="jse-footer svelte-wovgt4"><div class="jse-bracket svelte-wovgt4">&rbrace;</div></div> <!></div>',1);_('<div class="jse-header-outer svelte-wovgt4"><div class="jse-header svelte-wovgt4"><button type="button" class="jse-expand svelte-wovgt4" title="Expand or collapse this object (Ctrl+Click to expand/collapse recursively)"><!></button> <!> <!> <div class="jse-meta svelte-wovgt4" data-type="selectable-value"><div class="jse-meta-inner svelte-wovgt4"><!></div></div> <!></div> <!> <!></div> <!>',1);_('<div class="jse-separator svelte-wovgt4">:</div>');_('<div class="jse-context-menu-pointer-anchor svelte-wovgt4"><!></div>');_('<div role="none" class="jse-insert-selection-area jse-after svelte-wovgt4" data-type="insert-selection-area-after"></div>');_('<div class="jse-contents-outer svelte-wovgt4"><div class="jse-contents svelte-wovgt4"><!> <!> <div class="jse-value-outer svelte-wovgt4"><!></div> <!></div> <!> <!></div>');_('<div class="jse-insert-area jse-after svelte-wovgt4" data-type="insert-selection-area-after"><!></div>');_('<div role="treeitem" tabindex="-1"><!> <!></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-welcome.svelte-1eamlhk {
  flex: 1;
  overflow: auto;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: var(--jse-main-border, 1px solid #d7d7d7);
  border-right: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-welcome.svelte-1eamlhk:last-child {
  border-bottom: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-welcome.svelte-1eamlhk .jse-space.jse-before:where(.svelte-1eamlhk) {
  flex: 1;
}
.jse-welcome.svelte-1eamlhk .jse-space.jse-after:where(.svelte-1eamlhk) {
  flex: 2;
}
.jse-welcome.svelte-1eamlhk .jse-contents:where(.svelte-1eamlhk) {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 2em var(--jse-padding, 10px);
  gap: var(--jse-padding, 10px);
}
.jse-welcome.svelte-1eamlhk .jse-contents:where(.svelte-1eamlhk) .jse-welcome-info:where(.svelte-1eamlhk) {
  color: var(--jse-panel-color-readonly, #b2b2b2);
}
.jse-welcome.svelte-1eamlhk .jse-contents:where(.svelte-1eamlhk) button:where(.svelte-1eamlhk) {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  background: var(--jse-button-primary-background, var(--jse-theme-color, #3883fa));
  color: var(--jse-button-primary-color, #fff);
  padding: var(--jse-padding, 10px) calc(2 * var(--jse-padding, 10px));
  border-radius: 3px;
}
.jse-welcome.svelte-1eamlhk .jse-contents:where(.svelte-1eamlhk) button:where(.svelte-1eamlhk):hover {
  background: var(--jse-button-primary-background-highlight, var(--jse-theme-color-highlight, #5f9dff));
}
.jse-welcome.svelte-1eamlhk .jse-contents:where(.svelte-1eamlhk) button:where(.svelte-1eamlhk):disabled {
  background: var(--jse-button-primary-background-disabled, #9d9d9d);
}`);_('<div class="jse-welcome-info svelte-1eamlhk">You can paste clipboard data using <b>Ctrl+V</b>, or use the following options:</div> <button class="svelte-1eamlhk">Create object</button> <button class="svelte-1eamlhk">Create array</button>',1);_('<div class="jse-welcome svelte-1eamlhk" role="none"><div class="jse-space jse-before svelte-1eamlhk"></div> <div class="jse-contents svelte-1eamlhk"><div class="jse-welcome-title">Empty document</div> <!></div> <div class="jse-space jse-after svelte-1eamlhk"></div></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-navigation-bar-dropdown.svelte-2nnd2m {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 3;
  background: var(--jse-navigation-bar-background, var(--jse-background-color, #fff));
  color: var(--jse-navigation-bar-dropdown-color, #656565);
  box-shadow: var(--jse-controls-box-shadow, 0 2px 6px 0 rgba(0, 0, 0, 0.24));
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow: auto;
  min-width: 80px;
}
.jse-navigation-bar-dropdown.svelte-2nnd2m button.jse-navigation-bar-dropdown-item:where(.svelte-2nnd2m) {
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  outline: none;
  text-align: left;
  white-space: nowrap;
  box-sizing: border-box;
  padding: calc(0.5 * var(--jse-padding, 10px)) 36px;
}
.jse-navigation-bar-dropdown.svelte-2nnd2m button.jse-navigation-bar-dropdown-item:where(.svelte-2nnd2m):focus, .jse-navigation-bar-dropdown.svelte-2nnd2m button.jse-navigation-bar-dropdown-item:where(.svelte-2nnd2m):hover {
  background: var(--jse-navigation-bar-background-highlight, #e5e5e5);
}
.jse-navigation-bar-dropdown.svelte-2nnd2m button.jse-navigation-bar-dropdown-item.jse-selected:where(.svelte-2nnd2m) {
  background: var(--jse-navigation-bar-dropdown-color, #656565);
  color: var(--jse-navigation-bar-background, var(--jse-background-color, #fff));
}`);_('<button type="button" class="jse-navigation-bar-dropdown-item svelte-2nnd2m"> </button>');_('<button type="button" class="jse-navigation-bar-dropdown-item svelte-2nnd2m">...</button>');_('<div class="jse-navigation-bar-dropdown svelte-2nnd2m"><!> <!></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-navigation-bar-item.svelte-752ro1 {
  position: relative;
  display: flex;
}
.jse-navigation-bar-item.svelte-752ro1 button.jse-navigation-bar-button:where(.svelte-752ro1) {
  font-family: inherit;
  font-size: inherit;
  padding: calc(0.5 * var(--jse-padding, 10px)) 2px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  outline: none;
  min-width: 2em;
  white-space: nowrap;
}
.jse-navigation-bar-item.svelte-752ro1 button.jse-navigation-bar-button:where(.svelte-752ro1):focus, .jse-navigation-bar-item.svelte-752ro1 button.jse-navigation-bar-button:where(.svelte-752ro1):hover {
  background: var(--jse-panel-button-background-highlight, #e0e0e0);
  color: var(--panel-button-color-highlight, var(--jse-text-color, #4d4d4d));
}
.jse-navigation-bar-item.svelte-752ro1 button.jse-navigation-bar-button.jse-navigation-bar-arrow:where(.svelte-752ro1) {
  padding: 2px var(--jse-padding, 10px) 0;
}
.jse-navigation-bar-item.svelte-752ro1 button.jse-navigation-bar-button.jse-navigation-bar-arrow.jse-open:where(.svelte-752ro1) {
  background: var(--jse-navigation-bar-background, var(--jse-background-color, #fff));
  color: var(--jse-navigation-bar-dropdown-color, #656565);
}
.jse-navigation-bar-item.svelte-752ro1:last-child {
  padding-right: var(--jse-padding, 10px);
}`);_('<button type="button" class="jse-navigation-bar-button svelte-752ro1"> </button>');_('<div class="jse-navigation-bar-item svelte-752ro1"><button type="button" class="jse-navigation-bar-button jse-navigation-bar-arrow svelte-752ro1"><!></button> <!></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-navigation-bar-path-editor.svelte-zc2wx7 {
  flex: 1;
  display: flex;
  border: var(--jse-edit-outline, 2px solid #656565);
  background: var(--jse-background-color, #fff);
}
.jse-navigation-bar-path-editor.svelte-zc2wx7 input.jse-navigation-bar-text:where(.svelte-zc2wx7) {
  flex: 1;
  font-family: inherit;
  font-size: inherit;
  padding: 0 5px 1px;
  background: var(--jse-background-color, #fff);
  color: var(--jse-text-color, #4d4d4d);
  border: none;
  outline: none;
}
.jse-navigation-bar-path-editor.svelte-zc2wx7 button:where(.svelte-zc2wx7) {
  border: none;
  background: var(--jse-background-color, #fff);
  cursor: pointer;
  font-family: inherit;
  font-size: 80%;
  color: inherit;
}
.jse-navigation-bar-path-editor.svelte-zc2wx7 button.jse-navigation-bar-copy.copied:where(.svelte-zc2wx7) {
  color: var(--message-success-background, #9ac45d);
}
.jse-navigation-bar-path-editor.svelte-zc2wx7 button.jse-navigation-bar-validation-error:where(.svelte-zc2wx7) {
  color: var(--jse-error-color, #ee5341);
}
.jse-navigation-bar-path-editor.error.svelte-zc2wx7 {
  border-color: var(--jse-error-color, #ee5341);
}
.jse-navigation-bar-path-editor.error.svelte-zc2wx7 input.jse-navigation-bar-text:where(.svelte-zc2wx7) {
  color: var(--jse-error-color, #ee5341);
}
.jse-navigation-bar-path-editor.svelte-zc2wx7 .jse-copied-text:where(.svelte-zc2wx7) {
  background: var(--message-success-background, #9ac45d);
  color: var(--jse-message-success-color, #fff);
  position: relative;
  margin: 2px;
  padding: 0 5px;
  border-radius: 3px;
}`);_('<button type="button" class="jse-navigation-bar-validation-error svelte-zc2wx7"><!></button>');_('<div class="jse-copied-text svelte-zc2wx7">Copied!</div>');_('<div class="jse-navigation-bar-path-editor svelte-zc2wx7"><input type="text" class="jse-navigation-bar-text svelte-zc2wx7"> <!> <!> <button type="button" class="jse-navigation-bar-copy svelte-zc2wx7" title="Copy selected path to the clipboard"><!></button></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-navigation-bar.svelte-xs03gj {
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  background: var(--jse-panel-background, #ebebeb);
  color: var(--jse-panel-button-color, inherit);
  padding: 0;
  margin: 0;
  display: flex;
  overflow: auto;
  border-left: var(--jse-main-border, 1px solid #d7d7d7);
  border-right: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-navigation-bar.svelte-xs03gj .jse-navigation-bar-edit:where(.svelte-xs03gj) {
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  padding: calc(0.5 * var(--jse-padding, 10px)) var(--jse-padding, 10px);
  color: var(--jse-panel-color-readonly, #b2b2b2);
  background: transparent;
  border: none;
  display: flex;
  cursor: pointer;
  outline: none;
  align-items: center;
}
.jse-navigation-bar.svelte-xs03gj .jse-navigation-bar-edit.flex:where(.svelte-xs03gj) {
  flex: 1;
}
.jse-navigation-bar.svelte-xs03gj .jse-navigation-bar-edit:where(.svelte-xs03gj):focus, .jse-navigation-bar.svelte-xs03gj .jse-navigation-bar-edit:where(.svelte-xs03gj):hover, .jse-navigation-bar.svelte-xs03gj .jse-navigation-bar-edit.editing:where(.svelte-xs03gj) {
  background: var(--jse-panel-button-background-highlight, #e0e0e0);
  color: var(--panel-button-color-highlight, var(--jse-text-color, #4d4d4d));
  transition: color 0.2s ease-in, background 0.2s ease-in;
}
.jse-navigation-bar.svelte-xs03gj .jse-navigation-bar-edit:where(.svelte-xs03gj) .jse-navigation-bar-space:where(.svelte-xs03gj) {
  flex: 1;
  text-align: left;
}`);_("<!> <!>",1);_('<div class="jse-navigation-bar svelte-xs03gj"><!> <button type="button" class="jse-navigation-bar-edit svelte-xs03gj"><span class="jse-navigation-bar-space svelte-xs03gj"> </span> <!></button></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-search-box.svelte-1mxl2uo {
  border: var(--jse-panel-border, var(--jse-main-border, 1px solid #d7d7d7));
  border-radius: 3px;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  background: var(--jse-panel-background, #ebebeb);
  color: var(--jse-panel-color-readonly, #b2b2b2);
  box-shadow: var(--jse-controls-box-shadow, 0 2px 6px 0 rgba(0, 0, 0, 0.24));
  display: inline-block;
  width: 400px;
  max-width: 100%;
  overflow: auto;
}
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) {
  display: flex;
  align-items: stretch;
}
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) button:where(.svelte-1mxl2uo),
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) input:where(.svelte-1mxl2uo) {
  font-family: inherit;
  font-size: inherit;
}
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) button:where(.svelte-1mxl2uo) {
  display: block;
  text-align: center;
  border: none;
  padding: 0 5px;
  margin: 0;
  cursor: pointer;
  color: var(--jse-panel-button-color, inherit);
  background: var(--jse-panel-button-background, transparent);
}
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) button:where(.svelte-1mxl2uo):hover {
  color: var(--panel-button-color-highlight, var(--jse-text-color, #4d4d4d));
  background: var(--jse-panel-button-background-highlight, #e0e0e0);
}
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) input:where(.svelte-1mxl2uo) {
  color: var(--jse-panel-color, var(--jse-text-color, #4d4d4d));
  border: var(--jse-input-border, 1px solid #d8dbdf);
  border-radius: 3px;
  background: var(--jse-input-background, var(--jse-background-color, #fff));
  height: 28px;
  padding: 0 5px;
  margin: 0;
  flex: 1;
  width: 0;
  min-width: 50px;
  outline: none;
}
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) .jse-replace-toggle:where(.svelte-1mxl2uo) {
  padding: var(--jse-padding, 10px) calc(0.5 * var(--jse-padding, 10px));
  min-width: 20px;
  background: var(--jse-panel-button-background-highlight, #e0e0e0);
}
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) .jse-search-contents:where(.svelte-1mxl2uo) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: calc(0.5 * var(--jse-padding, 10px));
  gap: calc(0.5 * var(--jse-padding, 10px));
}
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) .jse-search-contents:where(.svelte-1mxl2uo) .jse-search-section:where(.svelte-1mxl2uo) {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
}
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) .jse-search-contents:where(.svelte-1mxl2uo) .jse-search-section:where(.svelte-1mxl2uo) .jse-search-icon:where(.svelte-1mxl2uo) {
  color: inherit;
  cursor: inherit;
  background: inherit;
  width: 32px;
  text-align: center;
}
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) .jse-search-contents:where(.svelte-1mxl2uo) .jse-search-section:where(.svelte-1mxl2uo) label.jse-search-input-label:where(.svelte-1mxl2uo) {
  flex: 1;
  display: flex;
}
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) .jse-search-contents:where(.svelte-1mxl2uo) .jse-search-section:where(.svelte-1mxl2uo) .jse-search-count:where(.svelte-1mxl2uo) {
  color: inherit;
  font-size: 80%;
  visibility: hidden;
  padding: 0 5px;
  min-width: 36px;
  text-align: center;
}
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) .jse-search-contents:where(.svelte-1mxl2uo) .jse-search-section:where(.svelte-1mxl2uo) .jse-search-count.jse-visible:where(.svelte-1mxl2uo) {
  visibility: visible;
}
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) .jse-search-contents:where(.svelte-1mxl2uo) .jse-replace-section:where(.svelte-1mxl2uo) {
  flex: 1;
  display: flex;
  padding-left: 32px;
}
.jse-search-box.svelte-1mxl2uo .jse-search-form:where(.svelte-1mxl2uo) .jse-search-contents:where(.svelte-1mxl2uo) .jse-replace-section:where(.svelte-1mxl2uo) button:where(.svelte-1mxl2uo) {
  width: auto;
}`);_('<button type="button" class="jse-replace-toggle svelte-1mxl2uo" title="Toggle visibility of replace options (Ctrl+H)"><!></button>');_('<div class="jse-replace-section svelte-1mxl2uo"><input class="jse-replace-input svelte-1mxl2uo" title="Enter replacement text" type="text" placeholder="Replace"> <button type="button" title="Replace current occurrence (Ctrl+Enter)" class="svelte-1mxl2uo">Replace</button> <button type="button" title="Replace all occurrences" class="svelte-1mxl2uo">All</button></div>');_('<div class="jse-search-box svelte-1mxl2uo"><form class="jse-search-form svelte-1mxl2uo"><!> <div class="jse-search-contents svelte-1mxl2uo"><div class="jse-search-section svelte-1mxl2uo"><div class="jse-search-icon svelte-1mxl2uo"><!></div> <label class="jse-search-input-label svelte-1mxl2uo" about="jse-search input"><input class="jse-search-input svelte-1mxl2uo" title="Enter text to search" type="text" placeholder="Find"></label> <div class="jse-search-count svelte-1mxl2uo"> </div> <button type="button" class="jse-search-next svelte-1mxl2uo" title="Go to next search result (Enter)"><!></button> <button type="button" class="jse-search-previous svelte-1mxl2uo" title="Go to previous search result (Shift+Enter)"><!></button> <button type="button" class="jse-search-clear svelte-1mxl2uo" title="Close search box (Esc)"><!></button></div> <!></div></form></div>');qs("jsoneditor:actions");G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-json-preview.svelte-1vjn89h {
  flex: 1;
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  color: var(--jse-panel-color-readonly, #b2b2b2);
  overflow: auto;
  white-space: pre-wrap;
  padding: 2px;
  border-left: var(--jse-main-border, 1px solid #d7d7d7);
  border-right: var(--jse-main-border, 1px solid #d7d7d7);
  border-bottom: var(--jse-main-border, 1px solid #d7d7d7);
}`);_('<div class="jse-json-preview svelte-1vjn89h"> </div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
button.jse-context-menu-button.svelte-1idfykj {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  flex: 1;
  white-space: nowrap;
  padding: var(--jse-padding, 10px);
  color: inherit;
}
button.jse-context-menu-button.svelte-1idfykj:hover {
  background: var(--jse-context-menu-background-highlight, #7a7a7a);
}
button.jse-context-menu-button.svelte-1idfykj:focus {
  background: var(--jse-context-menu-background-highlight, #7a7a7a);
  z-index: 1;
}
button.jse-context-menu-button.svelte-1idfykj:disabled {
  color: var(--jse-context-menu-color-disabled, #9d9d9d);
  background: unset;
}
button.jse-context-menu-button.left.svelte-1idfykj {
  text-align: left;
}
button.jse-context-menu-button.svelte-1idfykj svg {
  width: 16px;
}`);_('<button type="button"><!> <!></button>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-dropdown-button.svelte-11rxb2m {
  flex: 1;
  line-height: normal;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  position: relative;
  padding: 0;
  display: flex;
}
.jse-dropdown-button.svelte-11rxb2m ul:where(.svelte-11rxb2m) {
  margin: 0;
  padding: 0;
}
.jse-dropdown-button.svelte-11rxb2m ul:where(.svelte-11rxb2m) li:where(.svelte-11rxb2m) {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.jse-dropdown-button.svelte-11rxb2m button.jse-open-dropdown:where(.svelte-11rxb2m) {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  width: 2em;
  background: var(--jse-context-menu-background, #656565);
  color: var(--jse-context-menu-color, var(--jse-text-color-inverse, #fff));
  border-radius: 0;
}
.jse-dropdown-button.svelte-11rxb2m button.jse-open-dropdown.jse-visible:where(.svelte-11rxb2m) {
  background: var(--jse-context-menu-background, #656565);
}
.jse-dropdown-button.svelte-11rxb2m button.jse-open-dropdown:where(.svelte-11rxb2m):hover {
  background: var(--jse-context-menu-background-highlight, #7a7a7a);
}
.jse-dropdown-button.svelte-11rxb2m button.jse-open-dropdown:where(.svelte-11rxb2m):focus {
  z-index: 1;
}
.jse-dropdown-button.svelte-11rxb2m button.jse-open-dropdown:where(.svelte-11rxb2m):disabled {
  color: var(--jse-context-menu-color-disabled, #9d9d9d);
  background: unset;
}
.jse-dropdown-button.svelte-11rxb2m .jse-dropdown-items:where(.svelte-11rxb2m) {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  background: var(--jse-context-menu-background, #656565);
  color: var(--jse-context-menu-color, var(--jse-text-color-inverse, #fff));
  box-shadow: var(--jse-controls-box-shadow, 0 2px 6px 0 rgba(0, 0, 0, 0.24));
}
.jse-dropdown-button.svelte-11rxb2m .jse-dropdown-items.jse-visible:where(.svelte-11rxb2m) {
  display: block;
}
.jse-dropdown-button.svelte-11rxb2m .jse-dropdown-items:where(.svelte-11rxb2m) button:where(.svelte-11rxb2m) {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  width: 100%;
  text-align: left;
  padding: var(--jse-padding, 10px);
  margin: 0;
}
.jse-dropdown-button.svelte-11rxb2m .jse-dropdown-items:where(.svelte-11rxb2m) button:where(.svelte-11rxb2m):hover {
  background: var(--jse-context-menu-background-highlight, #7a7a7a);
}
.jse-dropdown-button.svelte-11rxb2m .jse-dropdown-items:where(.svelte-11rxb2m) button:where(.svelte-11rxb2m):disabled {
  color: var(--jse-context-menu-color-disabled, #9d9d9d);
  background: unset;
}`);_('<li class="svelte-11rxb2m"><button type="button"><!> </button></li>');_('<div role="button" tabindex="0" class="jse-dropdown-button svelte-11rxb2m"><!> <button type="button" class="jse-open-dropdown svelte-11rxb2m" data-type="jse-open-dropdown"><!></button> <div class="jse-dropdown-items svelte-11rxb2m"><ul class="svelte-11rxb2m"></ul></div></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
button.jse-context-menu-button.svelte-1idfykj {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  flex: 1;
  white-space: nowrap;
  padding: var(--jse-padding, 10px);
  color: inherit;
}
button.jse-context-menu-button.svelte-1idfykj:hover {
  background: var(--jse-context-menu-background-highlight, #7a7a7a);
}
button.jse-context-menu-button.svelte-1idfykj:focus {
  background: var(--jse-context-menu-background-highlight, #7a7a7a);
  z-index: 1;
}
button.jse-context-menu-button.svelte-1idfykj:disabled {
  color: var(--jse-context-menu-color-disabled, #9d9d9d);
  background: unset;
}
button.jse-context-menu-button.left.svelte-1idfykj {
  text-align: left;
}
button.jse-context-menu-button.svelte-1idfykj svg {
  width: 16px;
}`);_('<button type="button" slot="defaultItem"><!> </button>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-contextmenu.svelte-12z7bz1 {
  box-shadow: var(--jse-controls-box-shadow, 0 2px 6px 0 rgba(0, 0, 0, 0.24));
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  background: var(--jse-context-menu-background, #656565);
  color: var(--jse-context-menu-color, var(--jse-text-color-inverse, #fff));
}
.jse-contextmenu.svelte-12z7bz1 .jse-row:where(.svelte-12z7bz1) {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: stretch;
}
.jse-contextmenu.svelte-12z7bz1 .jse-row:where(.svelte-12z7bz1) div.jse-label:where(.svelte-12z7bz1) {
  flex: 1;
  white-space: nowrap;
  padding: var(--jse-padding, 10px);
  color: var(--jse-context-menu-color-disabled, #9d9d9d);
  line-height: normal;
}
.jse-contextmenu.svelte-12z7bz1 .jse-row:where(.svelte-12z7bz1) div.jse-tip:where(.svelte-12z7bz1) {
  flex: 1;
  background: var(--jse-context-menu-tip-background, rgba(255, 255, 255, 0.2));
  color: var(--context-menu-tip-color, inherit);
  margin: calc(0.5 * var(--jse-padding, 10px));
  padding: calc(0.5 * var(--jse-padding, 10px)) var(--jse-padding, 10px);
  font-size: 80%;
  line-height: 1.3em;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--jse-padding, 10px);
  border-radius: 3px;
}
.jse-contextmenu.svelte-12z7bz1 .jse-row:where(.svelte-12z7bz1) div.jse-tip:where(.svelte-12z7bz1) div.jse-tip-icon:where(.svelte-12z7bz1) {
  padding-top: calc(0.5 * var(--jse-padding, 10px));
}
.jse-contextmenu.svelte-12z7bz1 .jse-column:where(.svelte-12z7bz1) {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.jse-contextmenu.svelte-12z7bz1 .jse-column:where(.svelte-12z7bz1):not(:last-child) {
  border-right: 1px solid var(--jse-context-menu-separator-color, #7a7a7a);
}
.jse-contextmenu.svelte-12z7bz1 .jse-separator:where(.svelte-12z7bz1) {
  width: 100%;
  height: 1px;
  background: var(--jse-context-menu-separator-color, #7a7a7a);
}`);_('<div class="jse-separator svelte-12z7bz1"></div>');_('<div class="jse-label svelte-12z7bz1"> </div>');_('<div class="jse-column svelte-12z7bz1"></div>');_('<div class="jse-separator svelte-12z7bz1"></div>');_('<div class="jse-row svelte-12z7bz1"></div>');_('<div class="jse-separator svelte-12z7bz1"></div>');_('<div class="jse-row svelte-12z7bz1"><div class="jse-tip svelte-12z7bz1"><div class="jse-tip-icon svelte-12z7bz1"><!></div> <div class="jse-tip-text"> </div></div></div>');_('<div role="menu" tabindex="-1" class="jse-contextmenu svelte-12z7bz1"><!> <!></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-value.jse-string.svelte-6ttr41 {
  color: var(--jse-value-color-string, #008000);
}
.jse-value.jse-object.svelte-6ttr41, .jse-value.jse-array.svelte-6ttr41 {
  min-width: 16px;
  color: var(--jse-delimiter-color, rgba(0, 0, 0, 0.38));
}
.jse-value.jse-number.svelte-6ttr41 {
  color: var(--jse-value-color-number, #ee422e);
}
.jse-value.jse-boolean.svelte-6ttr41 {
  color: var(--jse-value-color-boolean, #ff8c00);
}
.jse-value.jse-null.svelte-6ttr41 {
  color: var(--jse-value-color-null, #004ed0);
}
.jse-value.jse-invalid.svelte-6ttr41 {
  color: var(--jse-text-color, #4d4d4d);
}
.jse-value.jse-url.svelte-6ttr41 {
  color: var(--jse-value-color-url, #008000);
  text-decoration: underline;
}

.jse-enum-value.svelte-6ttr41 {
  background: var(--jse-hover-background-color, rgba(0, 0, 0, 0.06));
  border: none;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  outline: none;
}
.jse-enum-value.jse-selected.svelte-6ttr41 {
  background: var(--jse-selection-background-color, #d3d3d3);
  color: inherit;
}
.jse-enum-value.jse-value.svelte-6ttr41:focus {
  color: var(--jse-text-color, #4d4d4d);
}`);_("<option> </option>");_("<select></select>");function w0(s){var e=function(n){var{schemaDefinitions:r,ajvOptions:i}=n,o=new zg(ho({allErrors:!0,verbose:!0,$data:!0},i));return r&&Object.keys(r).forEach(a=>{o.addSchema(r[a],a)}),o}(s);if(s.onCreateAjv!==void 0&&(e=s.onCreateAjv(e)||e).opts.verbose===!1)throw new Error("Ajv must be configured with the option verbose=true");var t=e.compile(s.schema);if(t.errors)throw t.errors[0];return function(n){return t(n),(t.errors||[]).map(j0).map(r=>function(i,o){return{path:Ld(i,o.instancePath),message:o.message||"Unknown error",severity:uo.warning}}(n,r))}}function j0(s){var e=void 0;if(s.keyword==="enum"&&Array.isArray(s.schema)){var t=s.schema;if(t){if((t=t.map(r=>JSON.stringify(r))).length>5){var n=["("+(t.length-5)+" more...)"];(t=t.slice(0,5)).push(n)}e="should be equal to one of: "+t.join(", ")}}return s.keyword==="additionalProperties"&&(e="should NOT have additional property: "+s.params.additionalProperty),e?ho(ho({},s),{},{message:e}):s}G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-tree-mode.svelte-vrx1dr {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--jse-background-color, #fff);
  min-width: 0;
  min-height: 0;
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  color: var(--jse-text-color, #4d4d4d);
  line-height: var(--jse-line-height, calc(1em + 4px));
}
.jse-tree-mode.svelte-vrx1dr .jse-hidden-input-label:where(.svelte-vrx1dr) .jse-hidden-input:where(.svelte-vrx1dr) {
  position: fixed;
  top: -10px;
  left: -10px;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  outline: none;
}
.jse-tree-mode.no-main-menu.svelte-vrx1dr {
  border-top: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-tree-mode.svelte-vrx1dr .jse-search-box-container:where(.svelte-vrx1dr) {
  position: relative;
  height: 0;
  top: var(--jse-padding, 10px);
  margin-right: calc(var(--jse-padding, 10px) + 20px);
  margin-left: var(--jse-padding, 10px);
  text-align: right;
  z-index: 3;
}
.jse-tree-mode.svelte-vrx1dr .jse-contents:where(.svelte-vrx1dr) {
  flex: 1;
  overflow: auto;
  position: relative;
  padding: 2px;
  display: flex;
  flex-direction: column;
  border-left: var(--jse-main-border, 1px solid #d7d7d7);
  border-right: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-tree-mode.svelte-vrx1dr .jse-contents:where(.svelte-vrx1dr):last-child {
  border-bottom: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-tree-mode.svelte-vrx1dr .jse-contents:where(.svelte-vrx1dr) .jse-loading-space:where(.svelte-vrx1dr) {
  flex: 1;
}
.jse-tree-mode.svelte-vrx1dr .jse-contents:where(.svelte-vrx1dr) .jse-loading:where(.svelte-vrx1dr) {
  flex: 2;
  text-align: center;
  color: var(--jse-panel-color-readonly, #b2b2b2);
  box-sizing: border-box;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
}
.jse-tree-mode.svelte-vrx1dr .jse-contents:where(.svelte-vrx1dr) .jse-search-box-background:where(.svelte-vrx1dr) {
  border: 50px solid var(--jse-modal-background, #f5f5f5);
  margin: -2px;
  margin-bottom: 2px;
  display: inline-block;
}`);_("<!> <!>",1);_('<div class="jse-search-box-background svelte-vrx1dr"></div>');_('<div class="jse-search-box-container svelte-vrx1dr"><!></div> <div class="jse-contents svelte-vrx1dr"><!> <!></div> <!> <!> <!>',1);_('<label class="jse-hidden-input-label svelte-vrx1dr"><input type="text" tabindex="-1" class="jse-hidden-input svelte-vrx1dr"></label> <!>',1);_('<div class="jse-contents svelte-vrx1dr"><div class="jse-loading-space svelte-vrx1dr"></div> <div class="jse-loading svelte-vrx1dr">loading...</div></div>');_('<div role="tree" tabindex="-1" class="jse-tree-mode svelte-vrx1dr"><!> <!> <!></div> <!> <!>',1);qs("jsoneditor:History");G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-transform-modal-inner.svelte-rrrjnb {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) {
  color: inherit;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: auto;
  min-width: 0;
  min-height: 0;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-actions:where(.svelte-rrrjnb) {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-top: var(--jse-padding, 10px);
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-actions:where(.svelte-rrrjnb) button.jse-primary:where(.svelte-rrrjnb) {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  background: var(--jse-button-primary-background, var(--jse-theme-color, #3883fa));
  color: var(--jse-button-primary-color, #fff);
  padding: var(--jse-padding, 10px) calc(2 * var(--jse-padding, 10px));
  border-radius: 3px;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-actions:where(.svelte-rrrjnb) button.jse-primary:where(.svelte-rrrjnb):hover {
  background: var(--jse-button-primary-background-highlight, var(--jse-theme-color-highlight, #5f9dff));
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-actions:where(.svelte-rrrjnb) button.jse-primary:where(.svelte-rrrjnb):disabled {
  background: var(--jse-button-primary-background-disabled, #9d9d9d);
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) {
  flex: 1;
  display: flex;
  gap: calc(2 * var(--jse-padding, 10px));
  min-height: 0;
  box-sizing: border-box;
  padding: 0 calc(2 * var(--jse-padding, 10px)) var(--jse-padding, 10px);
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) .jse-query-contents:where(.svelte-rrrjnb) {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) .jse-query-contents:where(.svelte-rrrjnb) .jse-description:where(.svelte-rrrjnb) p {
  margin: var(--jse-padding, 10px) 0;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) .jse-query-contents:where(.svelte-rrrjnb) .jse-description:where(.svelte-rrrjnb) p:first-child {
  margin-top: 0;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) .jse-query-contents:where(.svelte-rrrjnb) .jse-description:where(.svelte-rrrjnb) p:last-child {
  margin-bottom: 0;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) .jse-query-contents:where(.svelte-rrrjnb) .jse-description:where(.svelte-rrrjnb) code {
  background: var(--jse-modal-code-background, rgba(0, 0, 0, 0.05));
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) .jse-query-contents:where(.svelte-rrrjnb) .query-error:where(.svelte-rrrjnb) {
  color: var(--jse-error-color, #ee5341);
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) .jse-query-contents:where(.svelte-rrrjnb) textarea.jse-query:where(.svelte-rrrjnb) {
  flex: 1;
  outline: none;
  resize: vertical;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) .jse-data-contents:where(.svelte-rrrjnb) {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: calc(2 * var(--jse-padding, 10px));
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) .jse-data-contents:where(.svelte-rrrjnb) .jse-original-data:where(.svelte-rrrjnb) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-sizing: border-box;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) .jse-data-contents:where(.svelte-rrrjnb) .jse-original-data.jse-hide:where(.svelte-rrrjnb) {
  flex: none;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) .jse-data-contents:where(.svelte-rrrjnb) .jse-preview-data:where(.svelte-rrrjnb) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-sizing: border-box;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) .jse-data-contents.jse-hide-original-data:where(.svelte-rrrjnb) {
  flex-direction: column;
  gap: 0;
  margin-bottom: 0;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-actions:where(.svelte-rrrjnb) {
  padding: var(--jse-padding, 10px) calc(2 * var(--jse-padding, 10px)) calc(2 * var(--jse-padding, 10px));
}
@media screen and (max-width: 1200px) {
  .jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) {
    flex-direction: column;
    overflow: auto;
  }
  .jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) .jse-query-contents:where(.svelte-rrrjnb) textarea.jse-query:where(.svelte-rrrjnb) {
    min-height: 150px;
    flex: none;
  }
  .jse-transform-modal-inner.svelte-rrrjnb .jse-modal-contents:where(.svelte-rrrjnb) .jse-main-contents:where(.svelte-rrrjnb) .jse-data-contents:where(.svelte-rrrjnb) .jse-tree-mode {
    height: 300px;
    flex: none;
  }
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-label:where(.svelte-rrrjnb) {
  font-weight: bold;
  display: block;
  box-sizing: border-box;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-label:where(.svelte-rrrjnb) .jse-label-inner:where(.svelte-rrrjnb) {
  margin-top: calc(2 * var(--jse-padding, 10px));
  margin-bottom: calc(0.5 * var(--jse-padding, 10px));
  box-sizing: border-box;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-label:where(.svelte-rrrjnb) .jse-label-inner:where(.svelte-rrrjnb) button:where(.svelte-rrrjnb) {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  font-weight: bold;
  padding: 0;
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-tree-mode {
  flex: 1;
  background: var(--jse-input-background-readonly, transparent);
  box-shadow: none;
  box-sizing: border-box;
  --jse-main-border: var(--jse-input-border, 1px solid #d8dbdf);
}
.jse-transform-modal-inner.svelte-rrrjnb input:where(.svelte-rrrjnb),
.jse-transform-modal-inner.svelte-rrrjnb textarea:where(.svelte-rrrjnb) {
  border: var(--jse-input-border, 1px solid #d8dbdf);
  outline: none;
  box-sizing: border-box;
  padding: calc(0.5 * var(--jse-padding, 10px));
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  color: inherit;
  background: var(--jse-input-background, var(--jse-background-color, #fff));
}
.jse-transform-modal-inner.svelte-rrrjnb input:where(.svelte-rrrjnb):focus,
.jse-transform-modal-inner.svelte-rrrjnb textarea:where(.svelte-rrrjnb):focus {
  border: var(--jse-input-border-focus, 1px solid var(--jse-input-border-focus, var(--jse-theme-color, #3883fa)));
}
.jse-transform-modal-inner.svelte-rrrjnb input:where(.svelte-rrrjnb):read-only,
.jse-transform-modal-inner.svelte-rrrjnb textarea:where(.svelte-rrrjnb):read-only {
  background: var(--jse-input-background-readonly, transparent);
}
.jse-transform-modal-inner.svelte-rrrjnb .jse-preview.jse-error:where(.svelte-rrrjnb) {
  flex: 1;
  background: var(--jse-input-background-readonly, transparent);
  border: var(--jse-input-border, 1px solid #d8dbdf);
  color: var(--jse-error-color, #ee5341);
  padding: calc(0.5 * var(--jse-padding, 10px));
}
.jse-transform-modal-inner.svelte-rrrjnb a {
  color: var(--jse-a-color, #156fc5);
}
.jse-transform-modal-inner.svelte-rrrjnb a:hover {
  color: var(--jse-a-color-highlight, #0f508d);
}`);_('<div class="query-error svelte-rrrjnb"> </div>');_("<!> <!>",1);_('<div class="jse-preview jse-error svelte-rrrjnb"> </div>');_('<!> <div class="jse-modal-contents svelte-rrrjnb"><div class="jse-main-contents svelte-rrrjnb"><div class="jse-query-contents svelte-rrrjnb"><div class="jse-label svelte-rrrjnb"><div class="jse-label-inner svelte-rrrjnb">Language</div></div> <div class="jse-description svelte-rrrjnb"><!></div> <div class="jse-label svelte-rrrjnb"><div class="jse-label-inner svelte-rrrjnb">Path</div></div> <input class="jse-path svelte-rrrjnb" type="text" readonly="" title="Selected path"> <div class="jse-label svelte-rrrjnb"><div class="jse-label-inner svelte-rrrjnb"><button type="button" class="svelte-rrrjnb"><!> Wizard</button></div></div> <!> <div class="jse-label svelte-rrrjnb"><div class="jse-label-inner svelte-rrrjnb">Query</div></div> <textarea class="jse-query svelte-rrrjnb" spellcheck="false"></textarea></div> <div class="jse-data-contents svelte-rrrjnb"><div class="jse-original-data svelte-rrrjnb"><div class="jse-label svelte-rrrjnb"><div class="jse-label-inner svelte-rrrjnb"><button type="button" class="svelte-rrrjnb"><!> Original</button></div></div> <!></div> <div class="jse-preview-data svelte-rrrjnb"><div class="jse-label svelte-rrrjnb"><div class="jse-label-inner svelte-rrrjnb">Preview</div></div> <!></div></div></div> <div class="jse-actions svelte-rrrjnb"><button type="button" class="jse-primary svelte-rrrjnb">Transform</button></div></div>',1);_('<div class="jse-transform-modal-inner svelte-rrrjnb"><!></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-status-bar.svelte-1ulj7zd {
  background: var(--jse-panel-background, #ebebeb);
  color: var(--jse-panel-color-readonly, #b2b2b2);
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  margin: 0;
  border-top: var(--jse-panel-border, var(--jse-main-border, 1px solid #d7d7d7));
  border-left: var(--jse-main-border, 1px solid #d7d7d7);
  border-right: var(--jse-main-border, 1px solid #d7d7d7);
  display: flex;
  gap: var(--jse-padding, 10px);
}
.jse-status-bar.svelte-1ulj7zd:last-child {
  border-bottom: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-status-bar.svelte-1ulj7zd .jse-status-bar-info:where(.svelte-1ulj7zd) {
  padding: 2px;
}`);_('<div class="jse-status-bar-info svelte-1ulj7zd"> </div>');_('<div class="jse-status-bar-info svelte-1ulj7zd"> </div>');_('<div class="jse-status-bar-info svelte-1ulj7zd"> </div>');_('<div class="jse-status-bar svelte-1ulj7zd"><!> <!> <!></div>');var wa=Is.define([{tag:I.propertyName,color:"var(--internal-key-color)"},{tag:I.number,color:"var(--internal-value-color-number)"},{tag:I.bool,color:"var(--internal-value-color-boolean)"},{tag:I.string,color:"var(--internal-value-color-string)"},{tag:I.keyword,color:"var(--internal-value-color-null)"}]);o0(wa);var x0=wa.style;wa.style=s=>x0(s||[]);G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-text-mode.svelte-xt61xw {
  --internal-key-color: var(--jse-key-color, #1a1a1a);
  --internal-value-color-number: var(--jse-value-color-number, #ee422e);
  --internal-value-color-boolean: var(--jse-value-color-boolean, #ff8c00);
  --internal-value-color-string: var(--jse-value-color-string, #008000);
  --internal-value-color-null: var(--jse-value-color-null, #004ed0);
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: var(--jse-background-color, #fff);
}
.jse-text-mode.no-main-menu.svelte-xt61xw {
  border-top: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) {
  flex: 1;
  display: flex;
  position: relative;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
  border-left: var(--jse-main-border, 1px solid #d7d7d7);
  border-right: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw):last-child {
  border-bottom: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-text-mode.svelte-xt61xw .jse-contents.jse-hidden:where(.svelte-xt61xw) {
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor {
  flex: 1;
  overflow: hidden;
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-scroller {
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  line-height: var(--jse-line-height, calc(1em + 4px));
  color: var(--jse-delimiter-color, rgba(0, 0, 0, 0.38));
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-gutters {
  background: var(--jse-panel-background, #ebebeb);
  color: var(--jse-panel-color-readonly, #b2b2b2);
  border-right: var(--jse-panel-border, var(--jse-main-border, 1px solid #d7d7d7));
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-activeLine,
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-activeLineGutter {
  background: var(--jse-active-line-background-color, rgba(0, 0, 0, 0.06));
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-selectionBackground {
  background: var(--jse-selection-background-color, #d3d3d3);
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-searchMatch {
  background-color: var(--jse-search-match-color, #ffe665);
  outline: var(--jse-search-match-outline, none);
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-searchMatch.cm-searchMatch-selected {
  background-color: var(--jse-search-match-active-color, var(--jse-search-match-color, #ffe665));
  outline: var(--jse-search-match-outline, 2px solid #e0be00);
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-selectionMatch {
  background-color: var(--jse-search-match-background-color, rgba(153, 255, 119, 0.5019607843));
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-foldPlaceholder {
  background: var(--jse-tag-background, rgba(0, 0, 0, 0.2));
  color: var(--jse-tag-color, var(--jse-text-color-inverse, #fff));
  border: none;
  padding: 0 var(--jse-padding, 10px);
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-tooltip {
  font-size: var(--jse-font-size, 16px);
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  color: var(--jse-tooltip-color, var(--jse-text-color, #4d4d4d));
  background: var(--jse-tooltip-background, var(--jse-modal-background, #f5f5f5));
  border: var(--jse-tooltip-border, var(--jse-main-border, 1px solid #d7d7d7));
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-diagnosticAction {
  background: var(--jse-tooltip-action-button-color, var(--jse-text-color-inverse, #fff));
  background: var(--jse-tooltip-action-button-background, #4d4d4d);
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-panels {
  border-bottom: var(--jse-panel-border, var(--jse-main-border, 1px solid #d7d7d7));
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-search {
  background: var(--jse-panel-background, #ebebeb);
  color: var(--jse-panel-color, var(--jse-text-color, #4d4d4d));
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-search input {
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size-text-mode-search, 80%);
  color: var(--jse-input-color, var(--jse-text-color, #4d4d4d));
  border: var(--jse-input-border, 1px solid #d8dbdf);
  background: var(--jse-input-background, var(--jse-background-color, #fff));
  margin-right: 2px;
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-search button {
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size-text-mode-search, 80%);
  color: var(--jse-panel-button-color, inherit);
  background: var(--jse-panel-button-background, transparent);
  border: none;
  cursor: pointer;
  text-transform: capitalize;
  padding: calc(0.5 * var(--jse-padding, 10px)) var(--jse-padding, 10px);
  margin: 0;
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-search button:hover {
  color: var(--panel-button-color-highlight, var(--jse-text-color, #4d4d4d));
  background: var(--jse-panel-button-background-highlight, #e0e0e0);
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-search label {
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size-text-mode-search, 80%);
  padding-left: var(--jse-padding, 10px);
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-search label input {
  margin-right: 2px;
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-search button[name="close"] {
  width: 32px;
  height: 32px;
  font-size: 24px;
  line-height: 24px;
  padding: 0;
  right: 0;
  top: -4px;
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .cm-editor .cm-cursor-primary {
  border-color: var(--jse-text-color, #4d4d4d);
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .jse-loading-space:where(.svelte-xt61xw) {
  flex: 1;
}
.jse-text-mode.svelte-xt61xw .jse-contents:where(.svelte-xt61xw) .jse-loading:where(.svelte-xt61xw) {
  flex: 2;
  text-align: center;
  color: var(--jse-panel-color-readonly, #b2b2b2);
  box-sizing: border-box;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
}
.jse-text-mode.svelte-xt61xw .jse-contents.jse-preview:where(.svelte-xt61xw) {
  flex: 1;
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  color: var(--jse-panel-color-readonly, #b2b2b2);
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  padding: 2px;
}`);_('<!> <div class="jse-contents jse-preview svelte-xt61xw"> </div>',1);_("<!> <!> <!> <!>",1);_('<div class="jse-contents svelte-xt61xw"></div> <!> <!>',1);_('<div class="jse-contents svelte-xt61xw"><div class="jse-loading-space svelte-xt61xw"></div> <div class="jse-loading svelte-xt61xw">loading...</div></div>');_('<div class="jse-text-mode svelte-xt61xw"><!> <!></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-inline-value.svelte-h57m0p {
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  line-height: var(--jse-line-height, calc(1em + 4px));
  border: none;
  padding: 0 calc(0.5 * var(--jse-padding, 10px));
  background: transparent;
  color: inherit;
  cursor: inherit;
}
.jse-inline-value.jse-highlight.svelte-h57m0p {
  background-color: var(--jse-search-match-color, #ffe665);
  outline: var(--jse-search-match-outline, none);
}
.jse-inline-value.jse-highlight.jse-active.svelte-h57m0p {
  background-color: var(--jse-search-match-active-color, var(--jse-search-match-color, #ffe665));
  outline: var(--jse-search-match-outline, 2px solid #e0be00);
}`);_('<button type="button" class="jse-inline-value svelte-h57m0p"> </button>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-column-header.svelte-2i3vdx {
  background: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  display: flex;
  gap: var(--jse-padding, 10px);
  padding: calc(0.5 * var(--jse-padding, 10px)) var(--jse-padding, 10px) calc(0.5 * var(--jse-padding, 10px)) calc(0.5 * var(--jse-padding, 10px));
  width: 100%;
}
.jse-column-header.svelte-2i3vdx:hover {
  background: var(--jse-table-header-background-highlight, #e8e8e8);
}
.jse-column-header.svelte-2i3vdx:not(.jse-column-header.jse-readonly) {
  cursor: pointer;
}
.jse-column-header.svelte-2i3vdx span.jse-column-sort-icon:where(.svelte-2i3vdx) {
  height: 1em;
}`);_('<span class="jse-column-sort-icon svelte-2i3vdx"><!></span>');_('<button type="button" class="jse-column-header svelte-2i3vdx"><span class="jse-column-name"> </span> <!></button>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-table-mode-welcome.svelte-1q0ce0e {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  align-items: center;
  border-left: var(--jse-main-border, 1px solid #d7d7d7);
  border-right: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-table-mode-welcome.svelte-1q0ce0e:last-child {
  border-bottom: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-table-mode-welcome.svelte-1q0ce0e .jse-space.jse-before:where(.svelte-1q0ce0e) {
  flex: 1;
}
.jse-table-mode-welcome.svelte-1q0ce0e .jse-nested-arrays:where(.svelte-1q0ce0e) {
  display: flex;
  flex-direction: column;
  gap: var(--jse-padding, 10px);
  max-width: 300px;
  margin: 2em var(--jse-padding, 10px);
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
}
.jse-table-mode-welcome.svelte-1q0ce0e .jse-nested-arrays:where(.svelte-1q0ce0e) .jse-nested-arrays-info:where(.svelte-1q0ce0e) {
  color: var(--jse-panel-color-readonly, #b2b2b2);
}
.jse-table-mode-welcome.svelte-1q0ce0e .jse-nested-arrays:where(.svelte-1q0ce0e) button.jse-nested-array-action:where(.svelte-1q0ce0e) {
  text-align: left;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  background: var(--jse-button-primary-background, var(--jse-theme-color, #3883fa));
  color: var(--jse-button-primary-color, #fff);
  padding: var(--jse-padding, 10px) calc(2 * var(--jse-padding, 10px));
  border-radius: 3px;
}
.jse-table-mode-welcome.svelte-1q0ce0e .jse-nested-arrays:where(.svelte-1q0ce0e) button.jse-nested-array-action:where(.svelte-1q0ce0e):hover {
  background: var(--jse-button-primary-background-highlight, var(--jse-theme-color-highlight, #5f9dff));
}
.jse-table-mode-welcome.svelte-1q0ce0e .jse-nested-arrays:where(.svelte-1q0ce0e) button.jse-nested-array-action:where(.svelte-1q0ce0e):disabled {
  background: var(--jse-button-primary-background-disabled, #9d9d9d);
}
.jse-table-mode-welcome.svelte-1q0ce0e .jse-nested-arrays:where(.svelte-1q0ce0e) button.jse-nested-array-action:where(.svelte-1q0ce0e) .jse-nested-array-count:where(.svelte-1q0ce0e) {
  opacity: 0.5;
  white-space: nowrap;
}
.jse-table-mode-welcome.svelte-1q0ce0e .jse-space.jse-after:where(.svelte-1q0ce0e) {
  flex: 2;
}`);_("You can open the document in tree mode instead, or paste a JSON Array using <b>Ctrl+V</b>.",1);_('<button type="button" class="jse-nested-array-action svelte-1q0ce0e"> <span class="jse-nested-array-count svelte-1q0ce0e"> </span></button>');_('<div class="jse-table-mode-welcome svelte-1q0ce0e" role="none"><div class="jse-space jse-before svelte-1q0ce0e"></div> <div class="jse-nested-arrays svelte-1q0ce0e"><div class="jse-nested-arrays-title"> </div> <div class="jse-nested-arrays-info svelte-1q0ce0e"><!> <!></div> <!> <button type="button" class="jse-nested-array-action svelte-1q0ce0e"> </button></div> <div class="jse-space jse-after svelte-1q0ce0e"></div></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-column-header.svelte-fzj761 {
  background: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  display: flex;
  gap: var(--jse-padding, 10px);
  padding: calc(0.5 * var(--jse-padding, 10px)) var(--jse-padding, 10px) calc(0.5 * var(--jse-padding, 10px)) calc(0.5 * var(--jse-padding, 10px));
  width: 100%;
}
.jse-column-header.svelte-fzj761:hover {
  background: var(--jse-table-header-background-highlight, #e8e8e8);
}
.jse-column-header.svelte-fzj761:not(.jse-column-header.jse-readonly) {
  cursor: pointer;
}`);_('<button type="button" class="jse-column-header svelte-fzj761"><!></button>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-table-mode.svelte-u14cgx {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--jse-background-color, #fff);
  min-width: 0;
  min-height: 0;
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  color: var(--jse-text-color, #4d4d4d);
  line-height: var(--jse-line-height, calc(1em + 4px));
}
.jse-table-mode.no-main-menu.svelte-u14cgx {
  border-top: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-table-mode.svelte-u14cgx .jse-search-box-container:where(.svelte-u14cgx) {
  position: relative;
  height: 0;
  top: calc(var(--jse-line-height, calc(1em + 4px)) + 2 * var(--jse-padding, 10px));
  margin-right: calc(var(--jse-padding, 10px) + 20px);
  margin-left: var(--jse-padding, 10px);
  text-align: right;
  z-index: 3;
}
.jse-table-mode.svelte-u14cgx .jse-hidden-input-label:where(.svelte-u14cgx) {
  position: fixed;
  right: 0;
  top: 0;
  width: 0;
  height: 0;
}
.jse-table-mode.svelte-u14cgx .jse-hidden-input-label:where(.svelte-u14cgx) .jse-hidden-input:where(.svelte-u14cgx) {
  width: 0;
  height: 0;
  padding: 0;
  border: 0;
  outline: none;
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) {
  flex: 1;
  align-items: flex-start;
  flex-direction: column;
  display: flex;
  overflow: auto;
  overflow-anchor: none;
  scrollbar-gutter: stable;
  border-left: var(--jse-main-border, 1px solid #d7d7d7);
  border-right: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx):last-child {
  border-bottom: var(--jse-main-border, 1px solid #d7d7d7);
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) {
  border-collapse: collapse;
  border-spacing: 0;
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-table-invisible-start-section:where(.svelte-u14cgx) td:where(.svelte-u14cgx),
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-table-invisible-end-section:where(.svelte-u14cgx) td:where(.svelte-u14cgx) {
  margin: 0;
  padding: 0;
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-search-box-background:where(.svelte-u14cgx) {
  background: var(--jse-table-header-background, #f5f5f5);
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-table-invisible-end-section:where(.svelte-u14cgx) td:where(.svelte-u14cgx) {
  padding-bottom: var(--jse-padding, 10px);
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-table-row:where(.svelte-u14cgx):hover {
  background-color: var(--jse-table-row-odd-background, rgba(0, 0, 0, 0.05));
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-table-row:where(.svelte-u14cgx) .jse-table-cell:where(.svelte-u14cgx) {
  padding: 0 var(--jse-padding, 10px) 0 0;
  vertical-align: top;
  white-space: nowrap;
  height: var(--jse-line-height, calc(1em + 4px));
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-table-row:where(.svelte-u14cgx) .jse-table-cell.jse-table-cell-header:where(.svelte-u14cgx), .jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-table-row:where(.svelte-u14cgx) .jse-table-cell.jse-table-cell-gutter:where(.svelte-u14cgx) {
  font-weight: normal;
  text-align: left;
  color: var(--jse-text-readonly, #8d8d8d);
  background: var(--jse-table-header-background, #f5f5f5);
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-table-row:where(.svelte-u14cgx) .jse-table-cell.jse-table-cell-header:where(.svelte-u14cgx) {
  padding: 0;
  position: sticky;
  top: 0;
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-table-row:where(.svelte-u14cgx) .jse-table-cell.jse-table-cell-header:where(.svelte-u14cgx) .jse-table-root-error:where(.svelte-u14cgx) {
  padding: calc(0.5 * var(--jse-padding, 10px)) var(--jse-padding, 10px) calc(0.5 * var(--jse-padding, 10px)) calc(0.5 * var(--jse-padding, 10px));
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-table-row:where(.svelte-u14cgx) .jse-table-cell.jse-table-cell-gutter:where(.svelte-u14cgx) {
  padding: 0 var(--jse-padding, 10px) 0 calc(0.5 * var(--jse-padding, 10px));
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-table-row:where(.svelte-u14cgx) .jse-table-cell:where(.svelte-u14cgx) .jse-value-outer:where(.svelte-u14cgx) {
  display: inline-block;
  cursor: var(--jse-contents-cursor, pointer);
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-table-row:where(.svelte-u14cgx) .jse-table-cell:where(.svelte-u14cgx) .jse-value-outer:where(.svelte-u14cgx):hover {
  background: var(--jse-hover-background-color, rgba(0, 0, 0, 0.06));
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-table-row:where(.svelte-u14cgx) .jse-table-cell:where(.svelte-u14cgx) .jse-value-outer.jse-selected-value:where(.svelte-u14cgx) {
  background: var(--jse-selection-background-color, #d3d3d3);
}
.jse-table-mode.svelte-u14cgx .jse-contents:where(.svelte-u14cgx) table.jse-table-main:where(.svelte-u14cgx) .jse-table-row:where(.svelte-u14cgx) .jse-table-cell:where(.svelte-u14cgx) .jse-context-menu-anchor:where(.svelte-u14cgx) {
  display: inline-flex;
  position: relative;
  vertical-align: top;
}
.jse-table-mode.svelte-u14cgx .jse-contents.jse-contents-loading:where(.svelte-u14cgx) {
  align-items: unset;
}
.jse-table-mode.svelte-u14cgx .jse-contents.jse-contents-loading:where(.svelte-u14cgx) .jse-loading-space:where(.svelte-u14cgx) {
  flex: 1;
}
.jse-table-mode.svelte-u14cgx .jse-contents.jse-contents-loading:where(.svelte-u14cgx) .jse-loading:where(.svelte-u14cgx) {
  flex: 2;
  text-align: center;
  color: var(--jse-panel-color-readonly, #b2b2b2);
  box-sizing: border-box;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
}`);_('<div class="jse-table-root-error svelte-u14cgx"><!></div>');_('<th class="jse-table-cell jse-table-cell-header svelte-u14cgx"><!></th>');_('<th class="jse-table-cell jse-table-cell-header svelte-u14cgx"><!></th>');_('<th class="jse-table-cell jse-table-cell-gutter svelte-u14cgx"> <!></th>');_('<div class="jse-context-menu-anchor svelte-u14cgx"><!></div>');_('<td class="jse-table-cell svelte-u14cgx"><div class="jse-value-outer svelte-u14cgx"><!><!></div> <!></td>');_('<td class="jse-table-cell svelte-u14cgx"></td>');_('<tr class="jse-table-row svelte-u14cgx"><!><!><!></tr>');_('<div class="jse-search-box-container svelte-u14cgx"><!></div> <div class="jse-contents svelte-u14cgx"><table class="jse-table-main svelte-u14cgx"><tbody><tr class="jse-table-row jse-table-row-header svelte-u14cgx"><th class="jse-table-cell jse-table-cell-header svelte-u14cgx"><!></th><!><!></tr><tr class="jse-table-invisible-start-section svelte-u14cgx"><td class="svelte-u14cgx"></td></tr><!><tr class="jse-table-invisible-end-section svelte-u14cgx"><td class="svelte-u14cgx"></td></tr></tbody></table></div> <!> <!> <!>',1);_("<!> <!>",1);_('<label class="jse-hidden-input-label svelte-u14cgx"><input type="text" tabindex="-1" class="jse-hidden-input svelte-u14cgx"></label> <!>',1);_('<div class="jse-contents jse-contents-loading svelte-u14cgx"><div class="jse-loading-space svelte-u14cgx"></div> <div class="jse-loading svelte-u14cgx">loading...</div></div>');_('<div role="table" class="jse-table-mode svelte-u14cgx"><!> <!></div> <!> <!>',1);G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-modal-wrapper.svelte-v0el4e {
  flex: 1;
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
}
.jse-modal-wrapper.svelte-v0el4e .jse-modal-contents:where(.svelte-v0el4e) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: auto;
  min-width: 0;
  min-height: 0;
}
.jse-modal-wrapper.svelte-v0el4e .jse-modal-contents:where(.svelte-v0el4e) .jse-actions:where(.svelte-v0el4e) {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-top: var(--jse-padding, 10px);
}
.jse-modal-wrapper.svelte-v0el4e .jse-modal-contents:where(.svelte-v0el4e) .jse-actions:where(.svelte-v0el4e) button.jse-primary:where(.svelte-v0el4e) {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  background: var(--jse-button-primary-background, var(--jse-theme-color, #3883fa));
  color: var(--jse-button-primary-color, #fff);
  padding: var(--jse-padding, 10px) calc(2 * var(--jse-padding, 10px));
  border-radius: 3px;
}
.jse-modal-wrapper.svelte-v0el4e .jse-modal-contents:where(.svelte-v0el4e) .jse-actions:where(.svelte-v0el4e) button.jse-primary:where(.svelte-v0el4e):hover {
  background: var(--jse-button-primary-background-highlight, var(--jse-theme-color-highlight, #5f9dff));
}
.jse-modal-wrapper.svelte-v0el4e .jse-modal-contents:where(.svelte-v0el4e) .jse-actions:where(.svelte-v0el4e) button.jse-primary:where(.svelte-v0el4e):disabled {
  background: var(--jse-button-primary-background-disabled, #9d9d9d);
}
.jse-modal-wrapper.svelte-v0el4e .jse-modal-contents:where(.svelte-v0el4e) .jse-label:where(.svelte-v0el4e) {
  font-weight: bold;
  display: block;
  box-sizing: border-box;
}
.jse-modal-wrapper.svelte-v0el4e .jse-modal-contents:where(.svelte-v0el4e) .jse-label:where(.svelte-v0el4e) .jse-label-inner:where(.svelte-v0el4e) {
  margin-top: calc(2 * var(--jse-padding, 10px));
  margin-bottom: calc(0.5 * var(--jse-padding, 10px));
  box-sizing: border-box;
}
.jse-modal-wrapper.svelte-v0el4e .jse-modal-contents:where(.svelte-v0el4e) .jse-modal-inline-editor:where(.svelte-v0el4e) {
  flex: 1;
  min-height: 150px;
  min-width: 0;
  max-width: 100%;
  display: flex;
  --jse-theme-color: var(--jse-modal-editor-theme-color, #707070);
  --jse-theme-color-highlight: var(--jse-modal-editor-theme-color-highlight, #646464);
}
.jse-modal-wrapper.svelte-v0el4e .jse-actions:where(.svelte-v0el4e) {
  gap: var(--jse-padding, 10px);
  align-items: center;
}
.jse-modal-wrapper.svelte-v0el4e .jse-actions:where(.svelte-v0el4e) .jse-error:where(.svelte-v0el4e) {
  flex: 1;
  color: var(--jse-error-color, #ee5341);
}
.jse-modal-wrapper.svelte-v0el4e .jse-actions:where(.svelte-v0el4e) button.jse-secondary:where(.svelte-v0el4e) {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  background: var(--jse-button-secondary-background, #d3d3d3);
  color: var(--jse-button-secondary-color, var(--jse-text-color, #4d4d4d));
  padding: var(--jse-padding, 10px) calc(2 * var(--jse-padding, 10px));
  border-radius: 3px;
}
.jse-modal-wrapper.svelte-v0el4e .jse-actions:where(.svelte-v0el4e) button.jse-secondary:where(.svelte-v0el4e):hover {
  background: var(--jse-button-secondary-background-highlight, #e1e1e1);
}
.jse-modal-wrapper.svelte-v0el4e .jse-actions:where(.svelte-v0el4e) button.jse-secondary:where(.svelte-v0el4e):disabled {
  background: var(--jse-button-secondary-background-disabled, #9d9d9d);
}
.jse-modal-wrapper.svelte-v0el4e input:where(.svelte-v0el4e) {
  border: var(--jse-input-border, 1px solid #d8dbdf);
  outline: none;
  box-sizing: border-box;
  padding: calc(0.5 * var(--jse-padding, 10px));
  font-family: var(--jse-font-family-mono, consolas, menlo, monaco, "Ubuntu Mono", "source-code-pro", monospace);
  font-size: var(--jse-font-size-mono, 14px);
  color: inherit;
  background: var(--jse-input-background, var(--jse-background-color, #fff));
}
.jse-modal-wrapper.svelte-v0el4e input:where(.svelte-v0el4e):focus {
  border: var(--jse-input-border-focus, 1px solid var(--jse-input-border-focus, var(--jse-theme-color, #3883fa)));
}
.jse-modal-wrapper.svelte-v0el4e input:where(.svelte-v0el4e):read-only {
  background: var(--jse-input-background-readonly, transparent);
}`);_('<div class="jse-error svelte-v0el4e"> </div>');_('<button type="button" class="jse-secondary svelte-v0el4e"><!> Back</button>');_('<button type="button" class="jse-primary svelte-v0el4e">Apply</button>');_('<button type="button" class="jse-primary svelte-v0el4e">Close</button>');_('<!> <div class="jse-modal-contents svelte-v0el4e"><div class="jse-label svelte-v0el4e"><div class="jse-label-inner svelte-v0el4e">Path</div></div> <input class="jse-path svelte-v0el4e" type="text" readonly="" title="Selected path"> <div class="jse-label svelte-v0el4e"><div class="jse-label-inner svelte-v0el4e">Contents</div></div> <div class="jse-modal-inline-editor svelte-v0el4e"><!></div> <div class="jse-actions svelte-v0el4e"><!> <!> <!></div></div>',1);_('<div class="jse-modal-wrapper svelte-v0el4e"><!></div>');G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-modal-contents.svelte-1v9c92j {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: auto;
  min-width: 0;
  min-height: 0;
}
.jse-modal-contents.svelte-1v9c92j .jse-actions:where(.svelte-1v9c92j) {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-top: var(--jse-padding, 10px);
}
.jse-modal-contents.svelte-1v9c92j .jse-actions:where(.svelte-1v9c92j) button.jse-primary:where(.svelte-1v9c92j) {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  padding: 5px;
  margin: 0;
  background: var(--jse-button-primary-background, var(--jse-theme-color, #3883fa));
  color: var(--jse-button-primary-color, #fff);
  padding: var(--jse-padding, 10px) calc(2 * var(--jse-padding, 10px));
  border-radius: 3px;
}
.jse-modal-contents.svelte-1v9c92j .jse-actions:where(.svelte-1v9c92j) button.jse-primary:where(.svelte-1v9c92j):hover {
  background: var(--jse-button-primary-background-highlight, var(--jse-theme-color-highlight, #5f9dff));
}
.jse-modal-contents.svelte-1v9c92j .jse-actions:where(.svelte-1v9c92j) button.jse-primary:where(.svelte-1v9c92j):disabled {
  background: var(--jse-button-primary-background-disabled, #9d9d9d);
}
.jse-modal-contents.svelte-1v9c92j table:where(.svelte-1v9c92j) {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
.jse-modal-contents.svelte-1v9c92j table:where(.svelte-1v9c92j) th:where(.svelte-1v9c92j),
.jse-modal-contents.svelte-1v9c92j table:where(.svelte-1v9c92j) td:where(.svelte-1v9c92j) {
  text-align: left;
  vertical-align: middle;
  font-weight: normal;
  padding-bottom: var(--jse-padding, 10px);
}
.jse-modal-contents.svelte-1v9c92j input.jse-path:where(.svelte-1v9c92j) {
  width: 100%;
  box-sizing: border-box;
  padding: 5px 10px;
  border: var(--jse-input-border, 1px solid #d8dbdf);
  border-radius: var(--jse-input-radius, 3px);
  font-family: inherit;
  font-size: inherit;
  background: inherit;
  background: var(--jse-input-background-readonly, transparent);
  color: inherit;
  outline: none;
}
.jse-modal-contents.svelte-1v9c92j .svelte-select input {
  box-sizing: border-box;
}
.jse-modal-contents.svelte-1v9c92j .jse-space:where(.svelte-1v9c92j) {
  height: 200px;
}
.jse-modal-contents.svelte-1v9c92j .jse-space:where(.svelte-1v9c92j) .jse-error:where(.svelte-1v9c92j) {
  color: var(--jse-error-color, #ee5341);
}`);_('<tr><th class="svelte-1v9c92j">Property</th><td class="svelte-1v9c92j"><!></td></tr>');_('<div class="jse-error svelte-1v9c92j"> </div>');_('<!> <div class="jse-modal-contents svelte-1v9c92j"><table class="svelte-1v9c92j"><colgroup><col width="25%"><col width="75%"></colgroup><tbody><tr><th class="svelte-1v9c92j">Path</th><td class="svelte-1v9c92j"><input class="jse-path svelte-1v9c92j" type="text" readonly="" title="Selected path"></td></tr><!><tr><th class="svelte-1v9c92j">Direction</th><td class="svelte-1v9c92j"><!></td></tr></tbody></table> <div class="jse-space svelte-1v9c92j"><!></div> <div class="jse-actions svelte-1v9c92j"><button type="button" class="jse-primary svelte-1v9c92j">Sort</button></div></div>',1);G(`/* over all fonts, sizes, and colors */
/* "consolas" for Windows, "menlo" for Mac with fallback to "monaco", 'Ubuntu Mono' for Ubuntu */
/* (at Mac this font looks too large at 14px, but 13px is too small for the font on Windows) */
/* main, menu, modal */
/* jsoneditor modal */
/* tooltip in text mode */
/* panels: navigation bar, gutter, search box */
/* navigation-bar */
/* context menu */
/* contents: json key and values */
/* contents: selected or hovered */
/* contents: section of collapsed items in an array */
/* contents: highlighting of search matches */
/* contents: inline tags inside the JSON document */
/* contents: table */
/* controls in modals: inputs, buttons, and \`a\` */
/* messages */
/* svelte-select */
/* color picker */
.jse-main.svelte-57bmz4 {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 150px;
  font-family: var(--jse-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif);
  font-size: var(--jse-font-size, 16px);
  line-height: normal;
  position: relative;
  display: flex;
  flex-direction: row;
}
.jse-main.svelte-57bmz4:not(.jse-focus) {
  --jse-selection-background-color: var(--jse-selection-background-inactive-color, #e8e8e8);
  --jse-context-menu-pointer-background: var(--jse-context-menu-pointer-hover-background, #b2b2b2);
}`);_('<div class="jse-main svelte-57bmz4"><!></div> <!> <!> <!>',1);function C0(){const[s,e]=Ad(Ca.PROTOCOL_INSTRUCTION_SETS),t=Oa.useContext(Td),[n,r]=Oa.useState(JSON.stringify(s.json,null,2));function i(){console.debug("resetting protocols to defaults"),e(t.settings.getDefault(Ca.PROTOCOL_INSTRUCTION_SETS))}const a=w0({schema:{type:"object",properties:{},additionalProperties:{type:"array",items:{oneOf:[{type:"string"},{oneOf:[{type:"object",properties:{instructions:{type:"string"},ambient_purge:{type:"integer",minimum:0,maximum:10},ambient_sample:{type:"integer",minimum:0,maximum:60},mask_purge:{type:"integer",minimum:0,maximum:10},mask_sample:{type:"integer",minimum:0,maximum:600}},required:["instructions"],additionalProperties:!1},{type:"object",properties:{instructions:{type:"string"},purge_duration:{type:"integer",minimum:0,maximum:10},ambient_duration:{type:"integer",minimum:0,maximum:60},sample_duration:{type:"integer",minimum:0,maximum:60}},required:["instructions"],additionalProperties:!1},{type:"object",properties:{i:{type:"string"},p:{type:"integer",minimum:0,maximum:10},a:{type:"integer",minimum:0,maximum:60},s:{type:"integer",minimum:0,maximum:60}},required:["i"],additionalProperties:!1}]}]}}}});function l(c){const h=a(JSON.parse(c));r(c),h.length>0?console.error(h):e(y0({text:c}))}return kn.jsxs(kn.Fragment,{children:[kn.jsx("section",{id:"controls",children:kn.jsx("button",{id:"reset",onDoubleClick:i,children:"Reset to default (double click)"})}),kn.jsx("section",{id:"editor",style:{display:"contents"},children:kn.jsx("textarea",{style:{height:"90%",width:"90%"},onChange:c=>l(c.target.value),value:n})})]})}export{C0 as default};
