"use strict";(()=>{var e={};e.id=912,e.ids=[912],e.modules={53524:e=>{e.exports=require("@prisma/client")},72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},86624:e=>{e.exports=require("querystring")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},49410:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>h,patchFetch:()=>q,requestAsyncStorage:()=>c,routeModule:()=>d,serverHooks:()=>m,staticGenerationAsyncStorage:()=>x});var a={};t.r(a),t.d(a,{GET:()=>l,POST:()=>l});var s=t(49303),i=t(88716),n=t(60670),o=t(75571),u=t.n(o),p=t(95456);let l=u()(p.L),d=new s.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/auth/[...nextauth]/route",pathname:"/api/auth/[...nextauth]",filename:"route",bundlePath:"app/api/auth/[...nextauth]/route"},resolvedPagePath:"c:\\Users\\Black\\CascadeProjects\\manufacturing-system\\src\\app\\api\\auth\\[...nextauth]\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:c,staticGenerationAsyncStorage:x,serverHooks:m}=d,h="/api/auth/[...nextauth]/route";function q(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:x})}},95456:(e,r,t)=>{t.d(r,{L:()=>o});var a=t(13539),s=t(53797),i=t(13538),n=t(42023);let o={adapter:(0,a.N)(i._),session:{strategy:"jwt"},pages:{signIn:"/login"},providers:[(0,s.Z)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(!e?.email||!e?.password)return null;let r=await i._.user.findUnique({where:{email:e.email}});return r&&await (0,n.compare)(e.password,r.password)?{id:r.id+"",email:r.email,name:r.name,role:r.role}:null}})],callbacks:{session:({session:e,token:r})=>(r&&e.user&&(e.user.id=r.id,e.user.role=r.role),e),jwt:({token:e,user:r})=>(r&&(e.id=r.id,e.role=r.role),e)}}},13538:(e,r,t)=>{t.d(r,{_:()=>s});var a=t(53524);let s=globalThis.prisma??new a.PrismaClient}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[276,421],()=>t(49410));module.exports=a})();