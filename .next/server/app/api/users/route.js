"use strict";(()=>{var e={};e.id=701,e.ids=[701],e.modules={53524:e=>{e.exports=require("@prisma/client")},72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},86624:e=>{e.exports=require("querystring")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},8724:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>q,patchFetch:()=>j,requestAsyncStorage:()=>w,routeModule:()=>g,serverHooks:()=>h,staticGenerationAsyncStorage:()=>f});var s={};t.r(s),t.d(s,{GET:()=>x,POST:()=>m});var a=t(49303),i=t(88716),n=t(60670),o=t(42023),u=t(13538),l=t(20396),p=t(7846),c=t(75571),d=t(95456);async function m(e){try{let r=await (0,c.getServerSession)(d.L);if(!r||"ADMIN"!==r.user.role)throw Error("Unauthorized");let t=await e.json(),s=l.J.parse(t);if(await u._.user.findUnique({where:{email:s.email}}))throw Error("User already exists");let a=await (0,o.hash)(s.password,10),i=await u._.user.create({data:{...s,password:a},select:{id:!0,email:!0,name:!0,role:!0,createdAt:!0}});return(0,p.Xj)(i)}catch(e){return(0,p.zG)(e)}}async function x(e){try{if(!await (0,c.getServerSession)(d.L))throw Error("Unauthorized");let e=await u._.user.findMany({select:{id:!0,email:!0,name:!0,role:!0,createdAt:!0}});return(0,p.Xj)(e)}catch(e){return(0,p.zG)(e)}}let g=new a.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/users/route",pathname:"/api/users",filename:"route",bundlePath:"app/api/users/route"},resolvedPagePath:"c:\\Users\\Black\\CascadeProjects\\manufacturing-system\\src\\app\\api\\users\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:w,staticGenerationAsyncStorage:f,serverHooks:h}=g,q="/api/users/route";function j(){return(0,n.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:f})}},7846:(e,r,t)=>{t.d(r,{Xj:()=>i,zG:()=>o});var s=t(87070),a=t(7410);function i(e){return s.NextResponse.json({success:!0,data:e})}function n(e,r=400){let t="An unexpected error occurred";return"string"==typeof e?t=e:e instanceof a.jm?t=e.errors.map(e=>e.message).join(", "):e instanceof Error&&(t=e.message),s.NextResponse.json({success:!1,error:t},{status:r})}async function o(e){return(console.error("API Error:",e),e instanceof a.jm)?n(e):e instanceof Error?n(e.message):n("An unexpected error occurred")}},95456:(e,r,t)=>{t.d(r,{L:()=>o});var s=t(13539),a=t(53797),i=t(13538),n=t(42023);let o={adapter:(0,s.N)(i._),session:{strategy:"jwt"},pages:{signIn:"/login"},providers:[(0,a.Z)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(!e?.email||!e?.password)return null;let r=await i._.user.findUnique({where:{email:e.email}});return r&&await (0,n.compare)(e.password,r.password)?{id:r.id+"",email:r.email,name:r.name,role:r.role}:null}})],callbacks:{session:({session:e,token:r})=>(r&&e.user&&(e.user.id=r.id,e.user.role=r.role),e),jwt:({token:e,user:r})=>(r&&(e.id=r.id,e.role=r.role),e)}}},13538:(e,r,t)=>{t.d(r,{_:()=>a});var s=t(53524);let a=globalThis.prisma??new s.PrismaClient},20396:(e,r,t)=>{t.d(r,{J:()=>a,g:()=>i});var s=t(7410);let a=s.z.object({email:s.z.string().email(),password:s.z.string().min(6),name:s.z.string().min(2),role:s.z.enum(["ADMIN","MANAGER","WORKER"])}),i=s.z.object({email:s.z.string().email().optional(),name:s.z.string().min(2).optional(),role:s.z.enum(["ADMIN","MANAGER","WORKER"]).optional()})}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[276,421,570],()=>t(8724));module.exports=s})();