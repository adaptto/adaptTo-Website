import{f as t,a as e}from"./scripts.js";import{g as a,f as n,a as s}from"./ScheduleData-862ee4f3.js";const o=/^#day-(\d)$/;function i(){const t=window.location.hash.match(o);if(t)return parseInt(t[1],10)}function c(t,e){t.querySelectorAll("a.active").forEach((t=>t.classList.remove("active"))),t.querySelector(`a[rel="id-day-${e}"]`)?.classList.add("active"),t.querySelectorAll(".tab-content.active").forEach((t=>t.classList.remove("active"))),t.querySelector(`#id-day-${e}`)?.classList.add("active")}function r(t,a,n){const o=e(t,"tr",a[0].type);a.forEach((t=>{const i=2*(n-a.length)+1;!function(t,a,n,o){const i=e(t,"td","time");e(i,"time").textContent=s(a.start),i.append(" - "),e(i,"time").textContent=s(a.end);const c=e(t,"td","title");if(n>1&&c.setAttribute("colspan",n),a.talkPath){const t=e(c,"a");t.href=a.talkPath,t.textContent=a.title}else c.textContent=a.title;o?e(t,"td","speaker").textContent=a.speakers.join(", "):e(c,"div","speaker").textContent=a.speakers.join(", ")}(o,t,i,1===n)}))}async function d(s){s.textContent="";const o=t(document.location.pathname),d=await a(`${o}schedule-data.json`);let l=i();l||(l=1,window.history.replaceState(null,null,`#day-${l}`)),window.addEventListener("hashchange",(()=>{const t=i();t&&c(s,t)}));const h=d.getDays();h.length>0&&(!function(t,a,n){const s=e(t,"div","tab-navigation");a.forEach((a=>{const o=e(s,"a");o.href=`#day-${a.day}`,o.rel=`id-day-${a.day}`,o.textContent=`Day ${a.day}`,a.day===n&&o.classList.add("active"),o.addEventListener("click",(e=>{e.preventDefault(),c(t,a.day),window.history.pushState(null,null,`#day-${a.day}`)}))}))}(s,h,l),h.forEach((t=>function(t,a,s){const o=e(t,"div","tab-content");o.id=`id-day-${a.day}`,a.day===s&&o.classList.add("active");let i=1;const c=[];a.entries.forEach((t=>{if(t.track>0){if(1===t.track){const e=[t,...a.entries.filter((e=>e.start.getTime()===t.start.getTime()&&e.track>1))];e.length>i&&(i=e.length),c.push(e)}}else c.push([t])}));const d=e(o,"h4"),l=e(d,"date");l.setAttribute("datetime",a.start.toISOString().substring(0,10)),l.textContent=n(a.start);const h=e(o,"table"),f=e(h,"thead"),u=e(f,"tr");e(u,"th","time").textContent="Time",e(u,"th","title").textContent="Topic",1===i&&(e(u,"th","speaker").textContent="Speaker");const y=e(h,"tbody");c.forEach((t=>r(y,t,i)))}(s,t,l))))}export{d as default};
//# sourceMappingURL=schedule-56ae7c12.js.map