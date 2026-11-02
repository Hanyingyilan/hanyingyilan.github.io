import {citation,sourceList} from './sources.mjs';
export const escapeHTML=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const categoryPath=key=>`policies/${key}.html`;
export function renderMetadata(site,{title=site.title,description=site.description,path='',prefix=''}={}){
 const url=new URL(path,site.url).href,image=new URL(site.image,site.url).href;
 const graph={'@context':'https://schema.org','@graph':[
  {'@type':'WebSite','@id':site.url+'#website',url:site.url,name:site.name,inLanguage:'zh-Hant'},
  {'@type':'WebPage','@id':url+'#webpage',url,name:title,description,inLanguage:'zh-Hant',isPartOf:{'@id':site.url+'#website'}}
 ]};
 const meta=(attr,key,value)=>`<meta ${attr}="${key}" content="${escapeHTML(value)}">`;
 return [
  `<title>${escapeHTML(title)}</title>`,meta('name','description',description),
  `<link rel="canonical" href="${escapeHTML(url)}">`,
  meta('property','og:type','website'),meta('property','og:url',url),meta('property','og:title',title),
  meta('property','og:description',description),meta('property','og:site_name',site.name),meta('property','og:locale','zh_TW'),
  meta('property','og:image',image),meta('property','og:image:type','image/png'),meta('property','og:image:width','1200'),meta('property','og:image:height','630'),meta('property','og:image:alt',site.imageAlt),
  meta('name','twitter:card','summary_large_image'),meta('name','twitter:title',title),meta('name','twitter:description',description),meta('name','twitter:image',image),meta('name','twitter:image:alt',site.imageAlt),
  `<link rel="icon" href="${prefix}assets/images/site-icon.svg" type="image/svg+xml" sizes="any">`,
  `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g,'\\u003c')}</script>`
 ].join('\n');
}
export function renderPolicy(p,sources,{level=4,home=''}={}){
 return `<article class="pcard" id="policy-${p.id}"><div class="bd"><h${level}>${escapeHTML(p.t)}</h${level}><ul>${p.body.map(b=>`<li>${escapeHTML(b)}</li>`).join('')}</ul><p class="meta">出處：${escapeHTML(p.ref)}</p>${citation(p,sources)}${p.go?`<a href="${home}#${p.go}">查看相關互動</a>`:''}</div></article>`;
}
export function renderOverview(data,sources){
 return '<section id="policy-overview"><div class="wrap"><h2>完整政見與出處</h2>'+Object.entries(data.PIL).map(([key,pillar])=>`<section id="six-${key}"><h3>${escapeHTML(pillar.n)}</h3><p><a href="${categoryPath(key)}">閱讀${escapeHTML(pillar.n)}完整分類頁</a></p><div class="cards">${data.PL.filter(p=>p.p===key).map(p=>renderPolicy(p,sources)).join('')}</div></section>`).join('')+'</div></section>';
}
export function renderCategory(data,sources,site,key){
 const pillar=data.PIL[key],policies=data.PL.filter(p=>p.p===key);
 const title=`${pillar.n}政見｜韓瑩 2026 宜蘭市長政見`;
 const description=`韓瑩 2026 宜蘭市長「${pillar.n}」政見：${pillar.s}。整理${policies.map(p=>p.t).join('、')}，附提案狀態與來源。`;
 const refs=new Set(policies.flatMap(p=>p.sourceRefs));
 const relevantSources=Object.fromEntries(Object.entries(sources).filter(([id])=>refs.has(id)));
 return `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${renderMetadata(site,{title,description,path:categoryPath(key),prefix:'../'})}
<link rel="stylesheet" href="../assets/site.css"></head>
<body class="category-page"><a class="skip-link" href="#main-content">跳至主要內容</a>
<header class="wrap"><p><a href="../#policy-overview">回到完整政見總覽</a></p>
<nav class="category-nav" aria-label="政見分類">${Object.entries(data.PIL).map(([k,v])=>`<a href="${k}.html"${k===key?' aria-current="page"':''}>${escapeHTML(v.n)}</a>`).join('')}</nav></header>
<main id="main-content" class="wrap" tabindex="-1"><h1>${escapeHTML(pillar.n)}政見｜韓瑩</h1>
<p class="lead">${escapeHTML(pillar.s)}</p><p>2026 宜蘭市長候選人政見整理。提案不等於現行給付或已實施政策；查核狀態與出處列於各項政見。</p>
<div class="cards">${policies.map(p=>renderPolicy(p,relevantSources,{level:2,home:'../'})).join('')}</div>
<section id="sources"><h2>資料出處</h2>${sourceList(relevantSources)}</section>
<p><a href="../#six-${key}">在首頁開啟${escapeHTML(pillar.n)}互動分類</a></p></main>
<footer><div class="wrap">發布單位：韓瑩市長候選人辦公室<br>來源查閱日期另列，未列者待查證；部署時間不代表內容審查。</div></footer>
</body></html>\n`;
}
