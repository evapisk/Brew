(()=>{var e={};e.id=761,e.ids=[761],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:e=>{"use strict";e.exports=require("punycode")},27910:e=>{"use strict";e.exports=require("stream")},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},37313:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>f,routeModule:()=>l,serverHooks:()=>m,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>g});var s={};r.r(s),r.d(s,{POST:()=>c});var i=r(96559),a=r(48088),o=r(37719),n=r(32190),u=r(78290),p=r(42431);async function c(e){let t=new u.Ay,{linkedinUrl:r,resumeText:s}=await e.json();if(!r&&!s)return n.NextResponse.json({},{status:200});let i=Object.values(p.i).flat().join(", "),a=Object.values(p.C).flat().join(", "),o=r?`LinkedIn profile URL: ${r}`:`Resume text:
${s}`;try{let e=await t.messages.create({model:"claude-sonnet-4-6",max_tokens:600,system:"You are a profile parser for a college student networking app. Extract structured data. Respond only with JSON.",messages:[{role:"user",content:`Parse the following student profile and return structured data.

Available goal tags: ${i}
Available skill tags: ${a}

From the profile, infer:
- university: the university name (short form, e.g. "NYU", "MIT", "Stanford")
- year: academic year as integer 1-6 (1=freshman, 2=sophomore, 3=junior, 4=senior, 5=masters, 6=phd)
- goals: array of up to 5 matching goal tags from the list above
- skills_offer: array of matching skill tags the student likely has
- skills_want: array of matching skill tags they'd benefit from learning
- organizations: array of clubs/orgs mentioned (free text)

If a field can't be determined, omit it.

Respond with this JSON format:
{
  "university": "...",
  "year": 2,
  "goals": ["tag1", "tag2"],
  "skills_offer": ["tag1"],
  "skills_want": ["tag2"],
  "organizations": ["Club A"]
}

Profile:
${o}`}]}),r="text"===e.content[0].type?e.content[0].text:"{}",s=JSON.parse(r);return n.NextResponse.json(s)}catch{return n.NextResponse.json({error:"AI import failed"},{status:500})}}let l=new i.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/onboard/import/route",pathname:"/api/onboard/import",filename:"route",bundlePath:"app/api/onboard/import/route"},resolvedPagePath:"/Users/evapiskun/Desktop/cs personal/brew/app/api/onboard/import/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:d,workUnitAsyncStorage:g,serverHooks:m}=l;function f(){return(0,o.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:g})}},37830:e=>{"use strict";e.exports=require("node:stream/web")},42431:(e,t,r)=>{"use strict";r.d(t,{C:()=>i,i:()=>s});let s={careers:["break-into-consulting","break-into-finance","break-into-tech","break-into-vc","find-research-position","land-first-internship","get-into-grad-school","get-into-law-school","get-into-med-school"],building:["launch-a-startup","find-a-cofounder","build-a-portfolio","ship-a-side-project","start-a-club"],academic:["improve-my-gpa","survive-premed","ace-technical-interviews","publish-research","find-a-thesis-topic"],personal:["build-my-network","improve-public-speaking","find-my-career-direction","get-better-at-cold-outreach"]},i={technical:["python","javascript","sql","r","machine-learning","data-analysis","financial-modeling","excel"],creative:["figma","graphic-design","video-editing","writing","content-creation","brand-design"],professional:["public-speaking","pitch-decks","cold-outreach","linkedin-optimization","resume-writing","case-interviews"],domain:["venture-capital","investment-banking","product-management","consulting-frameworks","pre-med-advice","law-school-prep"]}},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55591:e=>{"use strict";e.exports=require("https")},57075:e=>{"use strict";e.exports=require("node:stream")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},73024:e=>{"use strict";e.exports=require("node:fs")},73566:e=>{"use strict";e.exports=require("worker_threads")},74075:e=>{"use strict";e.exports=require("zlib")},78335:()=>{},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},96487:()=>{}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,580,290],()=>r(37313));module.exports=s})();