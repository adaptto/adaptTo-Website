import{f as e,h as t,i as n,n as a,a as o,t as i,e as s,d as r}from"./scripts.js";function c(e,t,n,a){if(!n)return;const i=o(e,"li",t),s=o(i,"a");s.href=n,s.textContent=a}async function f(f){!function(e,t,r){const c=n(a("speakers")).map((e=>r.getSpeaker(e,t))).filter((e=>void 0!==e));if(0===c.length)return;o(e,"h4").textContent="Speakers";const f=o(e,"ul","speakers");c.forEach((e=>{const n=o(f,"li"),a=i(e,t),r=o(n,"a");r.href=a,e.image?r.append(s(e.image,e.title,!1,[{width:"150"}])):o(r,"img").src="/resources/img/speaker_placeholder.svg";const c=o(n,"a");c.href=a,c.textContent=e.title,e.affiliation&&n.append(`, ${e.affiliation}`)}))}(f,e(window.location.pathname),await t()),function(e){const t=a("presentation"),n=a("source-code"),i=a("video-link");if(!t&&!n&&!i)return;const s=o(e,"ul","talk-links");c(s,"download",t,"Presentation download"),c(s,"code",n,"Source code"),c(s,"video",i,"Video"),r(e)}(f)}export{f as default};
//# sourceMappingURL=talk-detail-after-outline-063db410.js.map
