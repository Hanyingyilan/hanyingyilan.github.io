
const ELECTION = new Date('2026-11-28T00:00:00+08:00');
const $ = s => document.querySelector(s);
const fmt = n => Math.round(n).toLocaleString('zh-TW');
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const {PIL, WHO, PL} = window.POLICY_DATA;
const pv = k => { const q = k === 'gov' ? 'traffic' : k; return `--c:var(--c-${q});--on:var(--on-${q});--ts:var(--ts-${q},none)`; };

/* countdown */
const left = Math.ceil((ELECTION - new Date()) / 86400000);
(function () {
  const n = $('#days'), top = $('#dtop'), tk = $('#dtk');
  if (left > 0) n.textContent = left;
  else { tk.hidden = true; top.textContent = left === 0 ? '今天是投票日' : '11/28 投票日已過'; }
})();

/* ---------- card ---------- */
function card(x, opts = {}) {
  const pl = PIL[x.p];
  const el = document.createElement('article');
  if (x.plain) {
    el.className = 'pcard'; el.style.cssText = pv(x.p);
    el.innerHTML = `<div class="hd"><span>${pl.n}</span></div><div class="bd"><h3>${esc(x.t)}</h3></div>`;
    return el;
  }
  el.className = 'pcard'; el.style.cssText = pv(x.p);
  const why = opts.why ? `<p class="why">${esc(opts.why)}</p>` : '';
  const acts = [
    `<button class="mini" data-act="more" aria-expanded="${opts.open ? 'true' : 'false'}">${opts.open ? '收合' : '看細節'}</button>`,
    x.go ? `<a class="mini" style="text-decoration:none" href="#${x.go}">${x.go === 'clean' ? '看清潔隊新品牌' : '去試算'}</a>` : ''
  ].join('');
  el.innerHTML = `
    ${opts.panel ? '' : `<div class="hd"><span>${pl.n}</span></div>`}
    <div class="bd">
      <h3>${esc(x.t)}</h3>${why}
      <ul ${opts.open ? '' : 'hidden'}>${x.body.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
      <div class="acts">${acts}</div>
      <div class="meta">出處：${esc(x.ref)}</div>${window.POLICY_CITATIONS[x.id]}
    </div>`;
  el.querySelector('[data-act=more]').onclick = e => {
    const ul = el.querySelector('ul'); const o = ul.hidden;
    ul.hidden = !o; e.target.textContent = o ? '收合' : '看細節'; e.target.setAttribute('aria-expanded', o);
  };
  return el;
}

/* ---------- personas ---------- */
const sel = new Set(['parent']);
function drawPick() {
  const box = $('#pick');
  if (box.children.length) {
    for (const b of box.children) b.setAttribute('aria-pressed', sel.has(b.dataset.persona));
    return;
  }
  Object.entries(WHO).forEach(([k, w]) => {
    const b = document.createElement('button');
    b.dataset.persona = k;
    b.className = 'who'; b.style.cssText = `--c:var(--c-${w.c});--on:var(--on-${w.c})`;
    b.setAttribute('aria-pressed', sel.has(k));
    b.innerHTML = `${w.n}<small>${w.d}</small>`;
    b.onclick = () => { sel.has(k) ? sel.delete(k) : sel.add(k); drawPick(); drawCards(); };
    box.append(b);
  });
}
function matches() {
  return PL.filter(x => [...sel].some(k => x.who[k])).map(x => ({x, why: x.who[[...sel].find(k => x.who[k])]}));
}
function drawCards() {
  const m = matches(); const c = $('#cards'); c.innerHTML = '';
  $('#resn').textContent = sel.size ? `有 ${m.length} 項政見跟你有關` : '先選一個身分吧';
  m.forEach((r, i) => c.append(card(r.x, {why: r.why, i})));
  if (!m.length) c.innerHTML = '<p class="sub">還沒選身分。上面點一個看看。</p>';
}
$('#selall').onclick = () => { Object.keys(WHO).forEach(k => sel.add(k)); drawPick(); drawCards(); };
$('#selnone').onclick = () => { sel.clear(); drawPick(); drawCards(); };
$('#copy').onclick = async () => {
  const txt = '韓瑩政見（依我的身分整理）\n' + matches().map(r => `・${r.x.t}`).join('\n');
  let ok = false;
  try { await navigator.clipboard.writeText(txt); ok = true; } catch (e) {}
  $('#copied').textContent = ok ? '已複製' : '此環境無法複製，請手動選取文字';
  setTimeout(() => $('#copied').textContent = '', 2500);
};

/* ---------- pillars ---------- */
let curP = 'intl';
function drawTiles() {
  const t = $('#tiles');
  if (t.children.length) {
    for (const b of t.children) b.setAttribute('aria-pressed', b.dataset.category === curP);
    return;
  }
  Object.keys(PIL).filter(k => k !== 'gov').forEach(k => {
    const b = document.createElement('button'); b.dataset.category = k; b.className = 'tile'; b.style.cssText = pv(k);
    b.setAttribute('aria-pressed', k === curP);
    b.innerHTML = `<span class="big" aria-hidden="true">${PIL[k].g}</span><b>${PIL[k].n}</b><span>${PIL[k].s}</span>`;
    b.onclick = event => {
      curP = k; drawTiles(); drawPanel(); window.policyStamp?.(k);
      const pn = $('#panel'), top = pn.getBoundingClientRect().top;
      if (event.detail > 0 && (top > innerHeight * 0.45 || top < 0)) pn.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block: 'start'});
    };
    t.append(b);
  });
}
function drawPanel() {
  const p = $('#panel'); p.style.cssText = pv(curP);
  p.innerHTML = `<h3>${PIL[curP].n}　${PIL[curP].s}！</h3><div class="pl"></div>`;
  const box = p.querySelector('.pl');
  PL.filter(x => x.p === curP).forEach((x, i) => box.append(card(x, {panel: true, open: false})));
  const sb = document.createElement('div'); sb.className = 'sharebar';
  sb.innerHTML = `<a class="btn line" target="_blank" rel="noopener">傳到 LINE</a><a class="btn" href="#six" style="margin-left:auto">↑ 回到六個面向</a>`;
  wireShare(sb.querySelector('a'), null, null, 'six-' + curP, `韓瑩「${PIL[curP].n}」政見：${PIL[curP].s}`);
  p.append(sb);
}

/* ---------- truck ---------- */
const STOPS = [
  {tx:40, name:'公開招考',
    nowT:'進用不夠公開透明', now:['長年有關說與紅包的疑慮。','清潔隊隊員抱怨過，隊內有不合理的內規。','進用與考核的管道不夠公開、公平。'],
    newT:'公開招考、擴大人力', aft:['建立公開、公平的招考與考核管道，終結關說與紅包疑慮。','廢除不合理的內規。']},
  {tx:545, name:'增班次定點',
    nowT:'路線少、趕點壓力大', now:['宜蘭市只有 11 條清運路線。','審計室指出，垃圾車單月超速 71 次。','隊員趕點壓力大，長輩得拿著垃圾追垃圾車，有危險。'],
    newT:'增班次、增定點', aft:['改善清運路網，增加班次與路線。','增設定時定點收運站，減輕隊員趕點壓力。','長輩不用再追垃圾車，隊員行車也更安全。']},
  {tx:600, name:'品牌美學',
    nowT:'形象與安全有待提升', now:['垃圾車是傳統的黃色塗層。','韓瑩認為隊員制服在美學與安全機能上還有提升空間。'],
    newT:'品牌美學：新制服與新配色', aft:['更換具設計感、兼具安全功能的新制服（參考竹北市，比照日本職人風格）。','升級垃圾車的車輛配色，跳脫傳統黃色。','提升職業榮譽感，讓付出被更多人看見。']}
];
let stopI = 0, after = false;
function drawSteps() {
  const s = $('#steps');
  if (s.children.length) {
    for (const b of s.children) b.setAttribute('aria-pressed', Number(b.dataset.stop) === stopI);
    return;
  }
  STOPS.forEach((st, i) => {
    const b = document.createElement('button'); b.dataset.stop = i; b.className = 'step'; b.setAttribute('aria-pressed', i === stopI);
    b.innerHTML = `<i>${i + 1}</i>${st.name}`;
    b.onclick = () => { stopI = i; moveTruck(); drawSteps(); };
    s.append(b);
  });
}
let moveTimer;
function moveTruck() {
  const rig = $('#rig'); const x = STOPS[stopI].tx;
  const stage = $('.stage'); stage.classList.add('moving');
  rig.setAttribute('transform', `translate(${x} 0)`);
  const road = $('.road'), sv = $('#truck');
  sv.classList.toggle('near', stopI >= 1);
  const gt = $('#gtxt'); if (gt) gt.textContent = stopI >= 1 ? '倒好了！' : '在定點等車';
  if (road && sv) { const k = sv.clientWidth / 900; road.scrollTo({left: Math.max(0, (x - 85) * k), behavior: reduce ? 'auto' : 'smooth'}); }
  clearTimeout(moveTimer); moveTimer = setTimeout(() => stage.classList.remove('moving'), reduce ? 0 : 1100);
  drawSay();
}
function drawSay() {
  const st = STOPS[stopI];
  const t = after ? st.newT : st.nowT, list = after ? st.aft : st.now;
  const lbl = after ? '改革之後' : '現況問題';
  $('#say').className = 'say ' + (after ? 'is-after' : 'is-now');
  $('#say').innerHTML = `<span class="lbl">${lbl}</span><b>${stopI + 1}．${esc(t)}</b><ul>${list.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
}
function setAfter(a) {
  after = a;
  const svg = $('#truck');
  svg.style.setProperty('--truck', a ? '#17a2f0' : '#f2c200');
  svg.style.setProperty('--stripe', a ? '#ffffff' : '#c99a00');
  svg.style.setProperty('--vest', a ? '#ff6a2b' : '#8a8f98');
  svg.style.setProperty('--hat', a ? '#ffffff' : '#8a8f98');
  $('#chase').style.opacity = a ? 0 : 1; $('#chase').style.transition = 'opacity .5s';
  $('#granWait').style.opacity = a ? 1 : 0;
  $('#tNow').setAttribute('aria-pressed', !a); $('#tNew').setAttribute('aria-pressed', a);
  drawSay();
}
$('#tNow').onclick = () => setAfter(false);
$('#tNew').onclick = () => setAfter(true);

/* count-up */
function tween(el, to, ms = 900) {
  if (reduce) { el.textContent = to; return; }
  const t0 = performance.now();
  (function f(t) { const p = Math.min(1, (t - t0) / ms); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0);
}
if ('IntersectionObserver' in window) {
  new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { tween($('#n71'), 71); tween($('#n11'), 11); o.disconnect(); } }), {threshold: .3}).observe($('.stats'));
}

/* ---------- calculator ---------- */
const S = {...DEFAULT_COUNTS};
const MAXV = MAX_COUNTS;
let mon = MAX_MONTHS, shown = 0, totalFrame = 0;
function calc() {
  const {birth:babyBirth,nutrition:babyNut,annual:el,total,rise}=calculateBenefits(S,mon);
  const parts = [];
  if (S.baby) { parts.push(['生育津貼 ×' + S.baby, babyBirth], ['營養費 ' + mon + ' 個月 ×' + S.baby, babyNut]); }
  if (el) parts.push(['提案每年重陽禮金', el]);
  $('#parts').innerHTML = parts.map(p => `<div class="part"><span>${p[0]}</span><span>${fmt(p[1])}</span></div>`).join('') +
    (S.baby ? `<div class="part"><span>生育津貼比報導原額多</span><span>＋${fmt(rise)}</span></div>` : '');
  cancelAnimationFrame(totalFrame);
  const from = shown, t0 = performance.now();
  const settle = () => { shown=total; $('#tot').textContent=fmt(total); $('#calc-status').textContent='提案情境合計 '+fmt(total)+' 元'; };
  if(reduce)settle();
  else totalFrame=requestAnimationFrame(function frame(t){
    const p=Math.min(1,(t-t0)/600);shown=from+(total-from)*(1-Math.pow(1-p,3));$('#tot').textContent=fmt(shown);
    if(p<1)totalFrame=requestAnimationFrame(frame);else settle();
  });
}
document.querySelectorAll('.stepper button').forEach(b => b.onclick = () => {
  const k = b.dataset.k; S[k] = Math.max(0, Math.min(MAXV[k], S[k] + (+b.dataset.d)));
  $('#o-' + k).textContent = S[k]; calc();
});
$('#mon').oninput = e => { mon = +e.target.value; $('#o-mon').textContent = mon; calc(); };

/* theme */
$('#theme').onclick = () => {
  const r = document.documentElement;
  const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  r.dataset.theme = dark ? 'light' : 'dark';
};

/* ---------- share ---------- */
const SITE_URL = window.SITE_URL;
function wireShare(a, btn, msg, hash, text) {
  const url = SITE_URL + (hash ? '#' + hash : '');
  a.href = 'https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text);
  if (btn) btn.onclick = async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(url); ok = true; } catch (e) {}
    msg.textContent = ok ? '已複製連結' : '請手動複製：' + url;
    setTimeout(() => msg.textContent = '', 3500);
  };
}
wireShare($('#lineAll'), $('#copyAll'), $('#copyMsg'), '', '韓瑩政見一覽：六新市政、清潔隊改革、福利升級，每項都附出處');

/* deep link: #six-welfare opens that pillar */
function openFromHash() {
  const m = location.hash.match(/^#six-(\w+)$/);
  if (m && PIL[m[1]] && m[1] !== 'gov') { curP = m[1]; drawTiles(); drawPanel(); window.policyStamp?.(m[1]); const s = $('#six'); if (s) s.scrollIntoView(); }
}

/* large text mode */
(function () {
  const b = $('#sizebtn'), r = document.documentElement;
  let on = false;
  try { on = localStorage.getItem('bigtext') === '1'; } catch (e) {}
  const apply = () => { r.classList.toggle('big', on); b.setAttribute('aria-pressed', on); b.textContent = on ? '標準字' : '大字'; };
  b.onclick = () => { on = !on; try { localStorage.setItem('bigtext', on ? '1' : '0'); } catch (e) {} apply(); };
  apply();
})();

drawPick(); drawCards(); drawTiles(); drawPanel();
drawSteps(); setAfter(false); moveTruck(); calc();
openFromHash(); addEventListener('hashchange', openFromHash);

// Keep native fragment targets clear of the wrapping sticky navigation.
const navBar = document.querySelector('.bar');
if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => {
 document.documentElement.style.setProperty('--nav-height', (navBar.getBoundingClientRect().height + 16) + 'px');
}).observe(navBar);
