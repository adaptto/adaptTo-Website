import{h as t,a as e,i as n,g as a,j as o,k as i,m as s}from"./scripts.js";function r(t,n,a){if(0===n.length)return;e(t,"h4").textContent=a;const o=e(t,"ul");n.forEach((t=>{const n=e(o,"li"),a=e(n,"a");a.href=t.path,a.textContent=i(t.title),n.append(` (${s(t.path)})`)}))}async function c(i){!function(n){const a=n.querySelector("h1");if(!a)return;const o=document.createElement("div");o.classList.add("speaker-data"),a.insertAdjacentElement("afterend",o);const i=t("twitter");if(i){const t=e(o,"div","twitter"),n=e(t,"a");n.href=`https://twitter.com/${i}`,n.textContent=i}const s=t("affiliation");s&&(e(o,"div","affiliation").textContent=s)}(i),async function(t){const i=await n(),s=i.getItem(window.location.pathname);if(!s)return;const c=i.getTalksForSpeaker(s);if(0===c.length)return;const f=await a(window.location.pathname,window.location.hash),l=c.filter((t=>0===t.path.indexOf(f))),h=c.filter((t=>0!==t.path.indexOf(f))),d=e(t,"div","talk-list");r(d,l,"Talks from this year"),r(d,h,"Talks from other years");const p=e(t,"p"),w=e(p,"a");w.href=o(f),w.textContent="Back to speaker overview"}(i),window.addEventListener("hashchange",(()=>{window.location.reload()}))}export{c as default};
