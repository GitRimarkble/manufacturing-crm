"use strict";(()=>{var e={};e.id=636,e.ids=[636],e.modules={53524:e=>{e.exports=require("@prisma/client")},72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},86624:e=>{e.exports=require("querystring")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},96213:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>v,patchFetch:()=>h,requestAsyncStorage:()=>w,routeModule:()=>g,serverHooks:()=>y,staticGenerationAsyncStorage:()=>q});var s={};t.r(s),t.d(s,{GET:()=>x,POST:()=>m});var a=t(49303),n=t(88716),i=t(60670),o=t(87070),u=t(13538),l=t(61252),p=t(75571),c=t(95456),d=t(53524);async function m(e){try{let r=await (0,p.getServerSession)(c.L);if(!r||!["ADMIN","MANAGER"].includes(r.user.role))return new o.NextResponse("Unauthorized",{status:401});let t=await e.json(),s=l.l.parse(t),a=await u._.customer.create({data:s});return o.NextResponse.json(a)}catch(e){return console.error("Error in POST /api/customers:",e),new o.NextResponse("Internal Server Error",{status:500})}}async function x(e){try{if(!await (0,p.getServerSession)(c.L))return new o.NextResponse("Unauthorized",{status:401});let{searchParams:r}=new URL(e.url),t=r.get("query"),s={deleted:!1};t&&(s={...s,OR:[{name:{contains:t,mode:d.Prisma.QueryMode.insensitive}},{email:{contains:t,mode:d.Prisma.QueryMode.insensitive}}]});let a=await u._.customer.findMany({where:s,orderBy:{createdAt:"desc"},select:{id:!0,name:!0,email:!0,phone:!0,address:!0,createdAt:!0,_count:{select:{orders:!0}}}});return o.NextResponse.json(a)}catch(e){return console.error("Error in GET /api/customers:",e),new o.NextResponse("Internal Server Error",{status:500})}}let g=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/customers/route",pathname:"/api/customers",filename:"route",bundlePath:"app/api/customers/route"},resolvedPagePath:"c:\\Users\\Black\\CascadeProjects\\manufacturing-system\\src\\app\\api\\customers\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:w,staticGenerationAsyncStorage:q,serverHooks:y}=g,v="/api/customers/route";function h(){return(0,i.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:q})}},95456:(e,r,t)=>{t.d(r,{L:()=>o});var s=t(13539),a=t(53797),n=t(13538),i=t(42023);let o={adapter:(0,s.N)(n._),session:{strategy:"jwt"},pages:{signIn:"/login"},providers:[(0,a.Z)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(!e?.email||!e?.password)return null;let r=await n._.user.findUnique({where:{email:e.email}});return r&&await (0,i.compare)(e.password,r.password)?{id:r.id+"",email:r.email,name:r.name,role:r.role}:null}})],callbacks:{session:({session:e,token:r})=>(r&&e.user&&(e.user.id=r.id,e.user.role=r.role),e),jwt:({token:e,user:r})=>(r&&(e.id=r.id,e.role=r.role),e)}}},13538:(e,r,t)=>{t.d(r,{_:()=>a});var s=t(53524);let a=globalThis.prisma??new s.PrismaClient},61252:(e,r,t)=>{t.d(r,{l:()=>a,r:()=>n});var s=t(7410);let a=s.z.object({name:s.z.string().min(2),email:s.z.string().email(),phone:s.z.string().optional(),address:s.z.string().optional()}),n=a.partial()}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[276,421,570],()=>t(96213));module.exports=s})();