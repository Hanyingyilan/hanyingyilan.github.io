/* tap the portrait to cycle through the photos (the first one keeps the wind-blown hair overlay) */
(function () {
  const box = $('.pbox'), img = $('#portraitImg2'), hair = $('#hair'), btn = $('#swapPhoto'); if (!box || !img) return;
  const LIST = [{src: 'portrait2.jpg', z: 1.22}, {src: 'p4.jpg', z: 1}, {src: 'p5.jpg', z: 1}, {src: 'p6.jpg', z: 1}, {src: 'p7.jpg', z: 1}, {src: 'p8.jpg', z: 1}, {src: 'p9.jpg', z: 1}, {src: 'p10.jpg', z: 1}, {src: 'p11.jpg', z: 1}, {src: 'p12.jpg', z: 1}, {src: 'p13.jpg', z: 1}, {src: 'p14.jpg', z: 1}];
  let i = -1;
  const show = n => {
    i = n; const alt = i >= 0;
    img.hidden = !alt; box.classList.toggle('alt', alt); if (hair) hair.style.display = alt ? 'none' : '';
    if (alt) { img.src = LIST[i].src; img.style.transform = 'scale(' + LIST[i].z + ')'; }
  };
  const next = () => show(i + 1 >= LIST.length ? -1 : i + 1);
  box.addEventListener('click', next); btn.addEventListener('click', next);
  addEventListener('load', () => setTimeout(() => LIST.forEach(p => { const im = new Image(); im.src = p.src; }), 1500));
})();

/* hair overlay shares the portrait image */
(function(){ const a = $('#portraitImg'), b = $('#hairImg'); if (a && b) b.src = a.src; })();

/* ballot number: set BALLOT_NO to the drawn number once it is known, e.g. const BALLOT_NO = 3; */
const BALLOT_NO = 3;
(function(){
  const n = $('#ballotNo');
  if (BALLOT_NO != null) {
    n.textContent = BALLOT_NO; if (String(BALLOT_NO).length > 1) n.classList.add('long');
    $('#ballotNote').textContent = '韓瑩OK　宜蘭OK';
    const en = $('#eyebrowNo'); if (en) en.textContent = BALLOT_NO;
    $('#ballot').setAttribute('aria-label', '候選人號次 ' + BALLOT_NO);
  }
})();

/* hero letters: 市長 in white with a dark outline, everything else dark ink */
(function(){
  const rot = [-4,3,-2,4,3,-4,2,-3];
  const pal = ['intl','city','tour','resil','welfare'];
  const rows = [
    [['新','intl'],['好','welfare'],['市','city',1],['長','tour',1]],
    [['改','resil'],['變','welfare'],['宜','intl'],['蘭','city']]
  ];
  const h = $('#heroLetters');
  rows.forEach((line, li) => {
    const row = document.createElement('span'); row.className = 'row';
    line.forEach(([ch, k, white], i) => {
      const b = document.createElement('button');
      b.className = 'ch' + (white ? ' w' : ''); b.textContent = ch; b.setAttribute('aria-hidden', 'true'); b.tabIndex = -1;
      b.style.cssText = `--c:var(--c-${k});--r:${rot[li*4+i]}deg`;
      b.onclick = () => {
        b.classList.add('hop'); setTimeout(() => b.classList.remove('hop'), 350);
        b.style.setProperty('--c', `var(--c-${pal[Math.floor(Math.random() * pal.length)]})`);
      };
      row.append(b);
    });
    h.append(row);
  });
})();

/* soft "plop" for a bag landing in the truck: low thump, a short rustle, two tiny rising notes (quiet on purpose) */
function plop() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    actx = actx || new AC(); if (actx.state === 'suspended') actx.resume();
    const t = actx.currentTime, out = actx.createGain(); out.gain.value = 0.5; out.connect(actx.destination);
    const th = actx.createOscillator(), tg = actx.createGain(); th.type = 'sine';
    th.frequency.setValueAtTime(190, t); th.frequency.exponentialRampToValueAtTime(70, t + 0.16);
    tg.gain.setValueAtTime(0.0001, t); tg.gain.exponentialRampToValueAtTime(0.32, t + 0.012); tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    th.connect(tg); tg.connect(out); th.start(t); th.stop(t + 0.22);
    const n = actx.createBuffer(1, Math.floor(actx.sampleRate * 0.12), actx.sampleRate), d = n.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const ns = actx.createBufferSource(), nf = actx.createBiquadFilter(), ng = actx.createGain(); ns.buffer = n; nf.type = 'bandpass'; nf.frequency.value = 2400; nf.Q.value = 0.7;
    ng.gain.value = 0.12; ns.connect(nf); nf.connect(ng); ng.connect(out); ns.start(t);
    [660, 880].forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain(), s0 = t + 0.14 + i * 0.09; o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, s0); g.gain.exponentialRampToValueAtTime(0.16, s0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, s0 + 0.22);
      o.connect(g); g.connect(out); o.start(s0); o.stop(s0 + 0.25);
    });
  } catch (e) {}
}

/* meow, synthesised with Web Audio (plays only after a click) */
let actx = null;
function meow() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    actx = actx || new AC(); if (actx.state === 'suspended') actx.resume();
    const t = actx.currentTime, dur = 0.62, k = 0.9 + Math.random() * 0.25;
    const o = actx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(520 * k, t);
    o.frequency.exponentialRampToValueAtTime(980 * k, t + 0.16);
    o.frequency.exponentialRampToValueAtTime(760 * k, t + 0.4);
    o.frequency.exponentialRampToValueAtTime(430 * k, t + dur);
    const lfo = actx.createOscillator(), lg = actx.createGain(); lfo.frequency.value = 7; lg.gain.value = 16; lfo.connect(lg); lg.connect(o.frequency);
    const f1 = actx.createBiquadFilter(); f1.type = 'bandpass'; f1.Q.value = 4;
    f1.frequency.setValueAtTime(900, t); f1.frequency.linearRampToValueAtTime(1500, t + 0.25); f1.frequency.linearRampToValueAtTime(800, t + dur);
    const f2 = actx.createBiquadFilter(); f2.type = 'bandpass'; f2.Q.value = 6; f2.frequency.value = 2600;
    const g2 = actx.createGain(); g2.gain.value = 0.3;
    const g = actx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.45, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.3, t + 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f1); f1.connect(g); o.connect(f2); f2.connect(g2); g2.connect(g); g.connect(actx.destination);
    o.start(t); lfo.start(t); o.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
  } catch (e) {}
}

/* black pixel cat that roams the whole page */
(function () {
  const SVG = `<svg viewBox="0 0 104 64" preserveAspectRatio="xMidYMax meet" shape-rendering="crispEdges" aria-hidden="true"><g class="g pa"><path fill="#17141f" d="M76 0h4v4h-4zM92 0h4v4h-4zM72 4h4v4h-4zM92 4h8v4h-8zM12 8h8v4h-8zM72 8h28v4h-28zM8 12h8v4h-8zM72 12h4v4h-4zM84 12h4v4h-4zM96 12h4v4h-4zM4 16h8v4h-8zM72 16h4v4h-4zM84 16h4v4h-4zM96 16h4v4h-4zM4 20h8v4h-8zM72 20h12v4h-12zM88 20h12v4h-12zM4 24h8v4h-8zM28 24h72v4h-72zM8 28h8v4h-8zM20 28h76v4h-76zM12 32h64v4h-64zM24 36h48v4h-48zM28 40h40v4h-40zM24 44h4v4h-4zM36 44h4v4h-4zM56 44h4v4h-4zM68 44h4v4h-4zM20 48h4v4h-4zM36 48h4v4h-4zM56 48h4v4h-4zM72 48h4v4h-4zM16 52h4v4h-4zM36 52h4v4h-4zM56 52h4v4h-4zM76 52h4v4h-4zM16 56h4v4h-4zM36 56h4v4h-4zM56 56h4v4h-4zM80 56h4v4h-4zM12 60h4v4h-4zM36 60h4v4h-4zM56 60h4v4h-4zM84 60h4v4h-4z"/><path fill="#ffd23f" d="M76 12h8v4h-8zM88 12h8v4h-8zM76 16h4v4h-4zM88 16h4v4h-4z"/><path fill="#ff9bb8" d="M76 4h4v4h-4zM84 20h4v4h-4z"/><path fill="#17141f" d="M80 16h4v4h-4zM92 16h4v4h-4z"/></g><g class="g pb"><path fill="#17141f" d="M12 0h8v4h-8zM72 0h4v4h-4zM92 0h8v4h-8zM8 4h8v4h-8zM72 4h28v4h-28zM4 8h8v4h-8zM72 8h4v4h-4zM84 8h4v4h-4zM96 8h4v4h-4zM72 12h4v4h-4zM84 12h4v4h-4zM96 12h4v4h-4zM4 16h8v4h-8zM72 16h12v4h-12zM88 16h12v4h-12zM4 20h8v4h-8zM28 20h72v4h-72zM8 24h8v4h-8zM20 24h76v4h-76zM12 28h64v4h-64zM24 32h48v4h-48zM28 36h40v4h-40zM24 40h8v4h-8zM52 40h4v4h-4zM64 40h4v4h-4zM24 44h8v4h-8zM52 44h4v4h-4zM64 44h4v4h-4zM24 48h4v4h-4zM32 48h4v4h-4zM48 48h4v4h-4zM64 48h4v4h-4zM24 52h4v4h-4zM36 52h4v4h-4zM48 52h4v4h-4zM64 52h4v4h-4zM24 56h4v4h-4zM36 56h4v4h-4zM44 56h4v4h-4zM64 56h4v4h-4zM24 60h4v4h-4zM40 60h8v4h-8zM64 60h4v4h-4z"/><path fill="#ffd23f" d="M76 8h8v4h-8zM88 8h8v4h-8zM76 12h4v4h-4zM88 12h4v4h-4z"/><path fill="#ff9bb8" d="M76 0h4v4h-4zM84 16h4v4h-4z"/><path fill="#17141f" d="M80 12h4v4h-4zM92 12h4v4h-4z"/></g><g class="g sa"><path fill="#17141f" d="M76 0h4v4h-4zM92 0h4v4h-4zM72 4h4v4h-4zM92 4h8v4h-8zM72 8h28v4h-28zM72 12h4v4h-4zM84 12h4v4h-4zM96 12h4v4h-4zM72 16h4v4h-4zM84 16h4v4h-4zM96 16h4v4h-4zM72 20h12v4h-12zM88 20h12v4h-12zM72 24h28v4h-28zM76 28h20v4h-20zM72 32h24v4h-24zM68 36h28v4h-28zM64 40h32v4h-32zM56 44h40v4h-40zM12 48h8v4h-8zM48 48h48v4h-48zM12 52h4v4h-4zM44 52h48v4h-48zM12 56h80v4h-80zM12 60h32v4h-32zM52 60h16v4h-16zM84 60h8v4h-8z"/><path fill="#ffd23f" d="M76 12h8v4h-8zM88 12h8v4h-8zM76 16h4v4h-4zM88 16h4v4h-4z"/><path fill="#ff9bb8" d="M76 4h4v4h-4zM84 20h4v4h-4z"/><path fill="#17141f" d="M80 16h4v4h-4zM92 16h4v4h-4z"/></g><g class="g sb"><path fill="#17141f" d="M76 0h4v4h-4zM92 0h4v4h-4zM72 4h4v4h-4zM92 4h8v4h-8zM72 8h28v4h-28zM72 12h28v4h-28zM72 16h4v4h-4zM84 16h4v4h-4zM96 16h4v4h-4zM72 20h12v4h-12zM88 20h12v4h-12zM72 24h28v4h-28zM76 28h20v4h-20zM72 32h24v4h-24zM68 36h28v4h-28zM64 40h32v4h-32zM8 44h4v4h-4zM56 44h40v4h-40zM8 48h4v4h-4zM48 48h48v4h-48zM12 52h4v4h-4zM44 52h48v4h-48zM12 56h80v4h-80zM12 60h32v4h-32zM52 60h16v4h-16zM84 60h8v4h-8z"/><path fill="#ff9bb8" d="M76 4h4v4h-4zM84 20h4v4h-4z"/><path fill="#17141f" d="M76 16h8v4h-8zM88 16h8v4h-8z"/></g><g class="bowg"><rect x="64" y="28" width="12" height="8" fill="#ff4d6d"/><rect x="68" y="28" width="4" height="8" fill="#ffd23f"/><rect x="60" y="32" width="4" height="4" fill="#ff4d6d"/><rect x="76" y="32" width="4" height="4" fill="#ff4d6d"/></g></svg>`;
  const reduceM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.createElement('div'); root.className = 'rc'; root.dataset.pose = 'sit'; root.dataset.f = '0';
  root.innerHTML = '<button class="rcb" aria-label="辦公室的黑貓，點一下會喵"><span class="fl">' + SVG + '</span><span class="meow"></span></button>';
  document.body.append(root);
  const btn = root.querySelector('.rcb'), fl = root.querySelector('.fl'), say = root.querySelector('.meow');
  const lines = ['喵～', '喵！', '嗚喵～', '喵喵？'];
  const CW = 92, CH = 57;
  let x = 40, y = 0, dir = 1, tgt = null, wait = 0, tPrev = 0, fT = 0, pause = 0;
  const vis = r => r.width > 30 && r.height > 12 && r.bottom > 80 && r.top < innerHeight - 24 && r.right > 0 && r.left < innerWidth;
  const SEL = '.pcard,.tile,.who,.step,.btn,.bank,.box,.stage,.notice,.ticket,.ballot,.portrait,h2,.src li,.cap,.say';
  function place() { root.style.transform = `translate(${x - CW / 2}px, ${y - CH}px)`; fl.style.setProperty('--dir', dir); }
  function ground() { return scrollY + innerHeight - 6; }
  function pick() {
    const list = [...document.querySelectorAll(SEL)].map(e => e.getBoundingClientRect()).filter(vis);
    const useGround = !list.length || Math.random() < 0.3;
    if (useGround) return {x: 30 + Math.random() * (innerWidth - 60), y: ground(), jump: 0};
    const r = list[Math.floor(Math.random() * list.length)];
    const lo = Math.max(r.left + 14, 20), hi = Math.min(r.right - 14, innerWidth - 20);
    return {x: lo + Math.random() * Math.max(0, hi - lo), y: Math.max(r.top, 76) + scrollY, jump: 1};
  }
  function go() {
    sleeping = false; root.classList.remove('said');
    if (y < scrollY - 60 || y > scrollY + innerHeight + 60) { x = Math.random() < 0.5 ? -40 : innerWidth + 40; y = ground(); }
    const t = pick(); const dx = t.x - x, dy = t.y - y, d = Math.hypot(dx, dy);
    const jump = Math.abs(dy) > 28 ? Math.min(90, 28 + Math.abs(dy) * 0.35) : 0;
    tgt = {x0: x, y0: y, x1: t.x, y1: t.y, t: 0, dur: Math.max(0.5, d / (jump ? 170 : 210)), arc: jump};
    if (Math.abs(dx) > 4) dir = dx > 0 ? 1 : -1;
    root.dataset.pose = 'run';
  }
  let sleeping = false;
  const isDark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  function dance() {
    if (reduceM) return;
    pause = 2.6; tgt = null; wait = 2.7; sleeping = false; root.dataset.pose = 'run';
    say.textContent = 'OK！'; root.classList.add('said', 'cheer');
    let n = 0; const iv = setInterval(() => { root.classList.toggle('hop2'); dir = -dir; place(); say.textContent = n % 2 ? 'OK！' : 'OK OK！'; if (++n >= 14) { clearInterval(iv); root.classList.remove('hop2', 'said', 'cheer'); root.dataset.pose = 'sit'; } }, 180);
  }
  window.catDance = dance;
  window.catSvg = SVG;
  window.catBow = on => root.classList.toggle('has-bow', !!on);
  window.catGo = (px, py, cb) => {
    if (reduceM) return; sleeping = false; root.classList.remove('said'); pause = 0; wait = 0;
    if (y < scrollY - 60 || y > scrollY + innerHeight + 60) { x = px < innerWidth / 2 ? innerWidth + 40 : -40; y = ground(); }
    const dx = px - x, dy = py - y, d = Math.hypot(dx, dy), jump = Math.abs(dy) > 28 ? Math.min(90, 28 + Math.abs(dy) * 0.35) : 0;
    tgt = {x0: x, y0: y, x1: px, y1: py, t: 0, dur: cb ? Math.min(1.1, Math.max(0.4, d / (jump ? 420 : 520))) : Math.min(2.2, Math.max(0.5, d / (jump ? 190 : 240))), arc: jump, cb};
    if (Math.abs(dx) > 4) dir = dx > 0 ? 1 : -1; root.dataset.pose = 'run';
  };
  document.addEventListener('pointerup', e => {
    if (reduceM || (e.button && e.button > 0)) return;
    if (e.target.closest('a,button,input,textarea,select,label,summary,canvas,[role=button],[role=dialog],.rc,.pcard,.tile,.who,.stage,.btn,.mini,.passport,.stepper,.portrait')) return;
    window.catGo(Math.max(30, Math.min(innerWidth - 30, e.pageX)), e.pageY);
  });
  function frame(now) {
    const dt = Math.min(0.05, (now - tPrev) / 1000 || 0); tPrev = now;
    fT += dt;
    if (pause > 0) { pause -= dt; }
    else if (tgt) {
      tgt.t += dt / tgt.dur; const k = Math.min(1, tgt.t);
      x = tgt.x0 + (tgt.x1 - tgt.x0) * k;
      y = tgt.y0 + (tgt.y1 - tgt.y0) * k - tgt.arc * Math.sin(Math.PI * k);
      if (k >= 1) {
        const cb = tgt.cb; tgt = null; root.dataset.pose = 'sit'; wait = 1.2 + Math.random() * 3; if (cb) cb();
        if (isDark() && Math.random() < 0.6) { sleeping = true; wait = 7 + Math.random() * 4; say.textContent = 'z z z'; root.classList.add('said'); }
      }
    } else { wait -= dt; if (wait <= 0) go(); }
    root.dataset.f = sleeping ? '1' : String(Math.floor(fT / (root.dataset.pose === 'run' ? 0.17 : 0.8)) % 2);
    place(); requestAnimationFrame(frame);
  }
  btn.onclick = () => {
    meow();
    say.textContent = lines[Math.floor(Math.random() * lines.length)];
    root.classList.add('said'); setTimeout(() => root.classList.remove('said'), 1500);
    root.classList.add('hop'); setTimeout(() => root.classList.remove('hop'), 220);
    if (!reduceM) { pause = 0.5; tgt = null; wait = 0.55; }
  };
  const start = () => {
    const six = document.querySelector('#six');
    y = six ? six.getBoundingClientRect().top + scrollY : innerHeight - 6; x = 46; dir = 1; place();
    if (!reduceM) { wait = 0.6; requestAnimationFrame(t => { tPrev = t; requestAnimationFrame(frame); }); }
  };
  if (document.readyState === 'complete') start(); else addEventListener('load', start);
})();

/* ---------- toast + confetti ---------- */
function toast(msg, ms = 2400) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
  t.textContent = msg; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), ms);
}
function confetti(cx, cy) {
  if (reduce) return;
  const cols = ['--c-intl', '--c-city', '--c-tour', '--c-resil', '--c-welfare', '--c-traffic'];
  for (let i = 0; i < 40; i++) {
    const d = document.createElement('i'); d.className = 'cf';
    d.style.cssText = `left:${cx}px;top:${cy}px;background:var(${cols[i % 6]})`; document.body.append(d);
    const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 220;
    d.animate([{transform: 'translate(0,0) rotate(0)', opacity: 1}, {transform: `translate(${Math.cos(a) * v}px,${Math.sin(a) * v + 170}px) rotate(${Math.random() * 720}deg)`, opacity: 0}],
      {duration: 1100 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.4,1)'}).onfinish = () => d.remove();
  }
}

/* confetti that shoots up from above the cat's head and never falls back onto it */
function catConfetti(cx, cy) {
  if (reduce) return;
  const cols = ['--c-intl', '--c-city', '--c-tour', '--c-resil', '--c-welfare', '--c-traffic'];
  for (let i = 0; i < 90; i++) {
    const d = document.createElement('i'); d.className = 'cf';
    d.style.cssText = `left:${cx}px;top:${cy}px;background:var(${cols[i % 6]});width:${8 + Math.random() * 8}px;height:${12 + Math.random() * 8}px`; document.body.append(d);
    const a = -Math.PI * (0.2 + Math.random() * 0.6), v = 170 + Math.random() * 260;
    d.animate([{transform: 'translate(0,0) rotate(0)', opacity: 1}, {transform: `translate(${Math.cos(a) * v * 1.2}px,${Math.sin(a) * v + 20}px) rotate(${Math.random() * 900}deg)`, opacity: 0}],
      {duration: 1300 + Math.random() * 900, easing: 'cubic-bezier(.2,.7,.4,1)', delay: Math.random() * 250, fill: 'backwards'}).onfinish = () => d.remove();
  }
}

/* ---------- six-pillar passport ---------- */
const SIX = ['intl', 'traffic', 'city', 'tour', 'resil', 'welfare'];
let stamps = new Set();
try { localStorage.removeItem('han-stamps'); } catch (e) {}
function drawPassport() {
  const w = $('#stamps'); if (!w) return; w.innerHTML = '';
  SIX.forEach(k => {
    const s = document.createElement('span'); s.className = 'stamp' + (stamps.has(k) ? ' on' : ''); s.style.cssText = pv(k);
    s.title = PIL[k].n; s.textContent = PIL[k].g; w.append(s);
  });
  $('#pcount').textContent = `${stamps.size}/6`;
  $('#pnote').textContent = stamps.size === 6 ? '集滿了！' : '打開每個面向就蓋一個章';
}
function stamp(k) {
  if (!SIX.includes(k) || stamps.has(k)) return;
  stamps.add(k);
  drawPassport(); const el = $('#stamps').children[SIX.indexOf(k)]; if (el) el.classList.add('pop');
  if (stamps.size === 6) {
    const r = $('#passport').getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + 20);
    toast('集滿六新！六隻小貓大遊行，辦公室黑貓戴上蝴蝶結了', 6500); if (window.catBow) window.catBow(true); catParade(); if (window.catDance) window.catDance();
  } else toast(`蓋章 ${stamps.size}/6：${PIL[k].n}`);
}

/* ---------- six stamps: kitten parade + bow tie for the office cat ---------- */
function catParade() {
  if (reduce || !window.catSvg) return;
  SIX.forEach((k, i) => {
    const el = document.createElement('div'); el.className = 'kit'; el.dataset.f = '0';
    el.innerHTML = window.catSvg.replace('<g class="bowg">', `<rect x="66" y="24" width="10" height="9" style="fill:var(--c-${k})"/><g class="bowg">`);
    document.body.append(el);
    const iv = setInterval(() => { el.dataset.f = el.dataset.f === '0' ? '1' : '0'; }, 140);
    const an = el.animate([{transform: 'translateX(-90px)'}, {transform: `translateX(${innerWidth + 90}px)`}], {duration: 3800, delay: i * 280, easing: 'linear', fill: 'both'});
    an.onfinish = () => { clearInterval(iv); el.remove(); };
  });
}
window.catParade = catParade;

/* ---------- "3" badge celebration ---------- */
(function () {
  const b = $('#ballot'); if (!b) return;
  b.style.cursor = 'pointer'; b.setAttribute('role', 'button'); b.tabIndex = 0; b.setAttribute('aria-label', '候選人號次 3，點一下慶祝');
  const fire = () => {
    const r = b.getBoundingClientRect(); confetti(r.left + 50, r.top + r.height / 2);
    toast('3 號　韓瑩 OK　宜蘭 OK！');
    if (window.catGo) window.catGo(Math.min(innerWidth - 80, r.right + 40), r.bottom + scrollY - 4, () => { if (window.catDance) window.catDance(); const c = document.querySelector('.rc').getBoundingClientRect(); catConfetti(c.left + c.width / 2, c.top - 70); });
  };
  b.addEventListener('click', fire); b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); } });
})();

/* ---------- personal policy card (canvas image) ---------- */
function wrapText(g, text, maxW) {
  const out = []; let line = '';
  for (const ch of text) { const t = line + ch; if (g.measureText(t).width > maxW && line) { out.push(line); line = ch; } else line = t; }
  if (line) out.push(line); return out;
}
async function makeCard() {
  const picks = matches();
  if (!sel.size || !picks.length) { toast('先選一個身分，再做圖卡'); return; }
  try { await document.fonts.load('900 48px "Noto Sans TC"'); await document.fonts.load('700 32px "Noto Sans TC"'); } catch (e) {}
  const W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
  if (!g) { toast('此瀏覽器無法製作圖片，請閱讀下方文字政見'); return; }
  const F = '"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif', INK = '#1f1b4d';
  const HEX = {intl: '#7bd33a', traffic: '#0b7a57', city: '#ff6fae', tour: '#17a2f0', resil: '#ffb400', welfare: '#ff6a2b'};
  const ON = {intl: INK, traffic: '#fff', city: INK, tour: '#10213d', resil: INK, welfare: INK};
  const rr = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  g.fillStyle = '#f4f1ff'; g.fillRect(0, 0, W, H);
  SIX.forEach((k, i) => { g.fillStyle = HEX[k]; g.fillRect(i * W / 6, 0, W / 6 + 1, 28); });
  g.fillStyle = INK; g.fillRect(0, 28, W, 6);
  // header
  const names = [...sel].map(k => WHO[k].n).join('、');
  const L = 72;
  g.fillStyle = INK; g.textBaseline = 'alphabetic';
  const inkText = (s, y) => { g.textAlign = 'left'; const m = g.measureText(s); g.fillText(s, L + (m.actualBoundingBoxLeft || 0), y); };
  g.font = `700 34px ${F}`; inkText('韓瑩　新好市長・六新市政', 110);
  let fs = 72; g.font = `900 ${fs}px ${F}`; const title = `給「${names}」的政見`;
  while (g.measureText(title).width > W - 2 * L && fs > 40) { fs -= 4; g.font = `900 ${fs}px ${F}`; }
  inkText(title, 200);
  // items: one per pillar first
  const order = {}; SIX.forEach((k, i) => order[k] = i);
  const sorted = picks.map(r => r.x).sort((a, b) => order[a.p] - order[b.p]);
  const seen = new Set(), items = [];
  sorted.forEach(x => { if (!seen.has(x.p) && items.length < 4) { seen.add(x.p); items.push(x); } });
  sorted.forEach(x => { if (items.length < 4 && !items.includes(x)) items.push(x); });
  const top = 250, ch = 160, gap = 16;
  items.forEach((x, i) => {
    const y = top + i * (ch + gap);
    const CX = L + 2.5, CW = W - 2 * L - 5;
    rr(CX + 6, y + 8, CW, ch, 26); g.fillStyle = INK; g.fill();
    rr(CX, y, CW, ch, 26); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 5; g.strokeStyle = INK; g.stroke();
    rr(CX, y, 210, ch, 26); g.fillStyle = HEX[x.p]; g.fill(); g.stroke();
    g.fillStyle = ON[x.p]; g.font = `900 42px ${F}`; g.textAlign = 'center'; g.fillText(PIL[x.p].n, CX + 105, y + ch / 2 - 2);
    g.font = `700 24px ${F}`; g.fillText(PIL[x.p].s, CX + 105, y + ch / 2 + 34); g.textAlign = 'left';
    g.fillStyle = INK; g.font = `800 40px ${F}`;
    let lines = wrapText(g, x.t, CW - 210 - 48);
    if (lines.length > 2) { g.font = `800 34px ${F}`; lines = wrapText(g, x.t.split('：')[0], CW - 210 - 48); }
    const lh = 50, y0 = y + ch / 2 - (lines.length - 1) * lh / 2 + 12;
    lines.slice(0, 3).forEach((l, j) => g.fillText(l, CX + 210 + 28, y0 + j * lh));
  });
  // footer
  g.fillStyle = INK; g.font = `800 44px ${F}`; inkText('宜蘭市長候選人', 1072);
  {
    const r = 64, cx = L + r + 3, cy = 1165;
    g.beginPath(); g.arc(cx + 5, cy + 6, r, 0, Math.PI * 2); g.fillStyle = INK; g.fill();
    g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
    g.fillStyle = INK; g.textAlign = 'center'; g.font = `900 92px ${F}`; g.fillText('3', cx, cy + 32);
    g.textAlign = 'left'; g.font = `900 112px ${F}`; g.fillText('韓瑩', cx + r + 30, cy + 40);
  }
  g.fillStyle = INK; g.font = `900 56px ${F}`; inkText('韓瑩OK　宜蘭OK', 1296);
  // 右下角：去背的半身照，頭髮和肩膀探出黃色底板
  const pc = new Image(); pc.src = 'portrait-cut.png';
  try { await pc.decode(); } catch (e) {}
  if (pc.naturalWidth) {
    g.save(); g.translate(868, 1262); g.rotate(-0.07);
    rr(-205 + 8, -180 + 9, 410, 360, 34); g.fillStyle = INK; g.fill();
    rr(-205, -180, 410, 360, 34); g.fillStyle = '#ffb400'; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
    g.restore();
    const sc = 0.72, pw = pc.naturalWidth * sc, ph = pc.naturalHeight * sc;
    g.drawImage(pc, W - pw + 10, H - ph, pw, ph);
  }
  if (stamps.size === 6) { g.save(); g.translate(960, 70); g.rotate(-0.2); g.fillStyle = '#ffb400'; rr(-110, -34, 220, 68, 16); g.fill(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke(); g.fillStyle = INK; g.font = `900 30px ${F}`; g.textAlign = 'center'; g.fillText('六新集章完成', 0, 10); g.restore(); }
  const url = cv.toDataURL('image/png');
  cv.toBlob(blob => showCard(url, blob), 'image/png');
}
function showCard(url, blob) {
  let m = $('#cardModal'); if (m) m.remove();
  m = document.createElement('div'); m.id = 'cardModal'; m.className = 'cardmodal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-label', '我的專屬政見卡');
  const touch = matchMedia('(pointer:coarse)').matches;
  const hint = touch ? '👇 長按下面的圖片，選「儲存圖片」<small>iPhone 選「加入照片」<br>Android 選「下載圖片」</small>' : '👇 在圖片上按右鍵，選「另存圖片」<small>也可以按下面的「下載」</small>';
  m.innerHTML = `<div class="cardbox"><div class="savehint">${hint}</div><img alt="我的專屬政見卡，長按可儲存" src="${url}">
    <div class="row2"><button class="btn line" id="cShare">分享圖片</button><a class="btn" id="cDl" download="韓瑩政見卡.png" href="${url}">下載</a><button class="btn" id="cClose">關閉</button></div></div>`;
  document.body.append(m);
  const close = () => { m.remove(); document.removeEventListener('keydown', esc); };
  const esc = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', esc);
  m.addEventListener('click', e => { if (e.target === m) close(); });
  $('#cClose').onclick = close;
  $('#cShare').onclick = async () => {
    try {
      const file = new File([blob], '韓瑩政見卡.png', {type: 'image/png'});
      if (navigator.canShare && navigator.canShare({files: [file]})) { await navigator.share({files: [file], title: '韓瑩政見卡', text: '韓瑩政見一覽 ' + SITE_URL}); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    toast('這個瀏覽器不能直接分享圖片，請長按圖片儲存');
  };
  $('#cShare').focus();
}
$('#mkcard').onclick = makeCard;

/* ---------- mini game: help an elder throw the garbage ---------- */
(function () {
  const open = $('#gameOpen'), box = $('#game'), cv = $('#gc'), g = cv.getContext('2d'), msg = $('#gmsg'), btn = $('#gthrow');
  if (!g) { open.onclick = () => toast('此瀏覽器無法執行遊戲，仍可閱讀清潔隊改革比較'); return; }
  const GX = 150, L = 330, GY = 214;
  let mode = 'after', round = 0, hits = 0, truck = null, bag = null, state = 'idle', last = 0, raf = 0, nextAt = 0, finished = false;
  const setMode = m => { mode = m; $('#gNow').setAttribute('aria-pressed', m === 'now'); $('#gNew').setAttribute('aria-pressed', m === 'after'); restart(); };
  function restart() { round = 0; hits = 0; finished = false; btn.textContent = '丟！'; nextRound(); if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }
  function nextRound() {
    round++; if (round > 5) { finish(); return; }
    truck = {x: -190, v: mode === 'now' ? 330 : 260, phase: 'in', wait: 0}; bag = null; state = 'play';
    msg.textContent = `第 ${round} / 5 袋：看準車子，按「丟！」`;
  }
  function finish() {
    finished = true; state = 'end'; truck = null;
    msg.textContent = `倒進去 ${hits} / 5。` + (mode === 'now' ? '沒有定點，車子一直開，很難趕上。' : '定點等車，車子停下來，穩穩倒進去。') + '再按一次可以重玩。';
    btn.textContent = '再玩一次';
    if (hits >= 4) { const r = cv.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + 40); }
  }
  function throwBag() {
    if (finished) { restart(); return; }
    if (state !== 'play' || bag) return;
    bag = {t: 0, dur: 0.45, x0: GX + 26, y0: GY - 62, x1: L, y1: GY - 70, res: null};
  }
  function update(dt) {
    if (truck) {
      if (mode === 'now') { truck.x += 330 * dt; if (truck.x > cv.width + 30) endRound(false, '來不及了'); }
      else {
        const stopX = L - 60;
        if (truck.phase === 'in') { truck.v = Math.max(30, Math.min(260, 40 + (stopX - truck.x) * 1.15)); truck.x += truck.v * dt; if (stopX - truck.x < 1.5) { truck.x = stopX; truck.phase = 'stop'; truck.wait = 2.4; } }
        else if (truck.phase === 'stop') { truck.wait -= dt; if (truck.wait <= 0) { truck.phase = 'out'; truck.v = 40; } }
        else { truck.v = Math.min(320, truck.v + 260 * dt); truck.x += truck.v * dt; if (truck.x > cv.width + 30) endRound(false, '來不及了'); }
      }
    }
    if (bag) {
      bag.t += dt; const k = Math.min(1, bag.t / bag.dur);
      bag.x = bag.x0 + (bag.x1 - bag.x0) * k; bag.y = bag.y0 + (bag.y1 - bag.y0) * k - 70 * Math.sin(Math.PI * k);
      if (k >= 1 && bag.res === null) {
        const hx = truck ? truck.x + 60 : -999, tol = mode === 'now' ? 24 : 70;
        bag.res = Math.abs(hx - L) < tol;
        if (bag.res) { hits++; plop(); msg.textContent = '倒進去了！'; } else msg.textContent = '沒丟中，垃圾袋掉在路上';
        state = 'wait'; nextAt = performance.now() + 1100; if (bag.res) truck && (truck.bagged = true);
      }
    }
    if (state === 'wait' && performance.now() > nextAt) { state = 'idle'; nextRound(); }
  }
  function endRound(hit, text) { if (state !== 'play') return; msg.textContent = text; state = 'wait'; nextAt = performance.now() + 900; truck = null; }
  function draw() {
    g.clearRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#eaf2ff'; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#d9d2ff'; g.fillRect(0, GY, cv.width, cv.height - GY);
    g.fillStyle = '#1f1b4d'; g.fillRect(0, GY, cv.width, 4);
    // fixed point sign
    g.fillStyle = '#7bd33a'; g.fillRect(GX - 56, GY - 140, 112, 30); g.strokeStyle = '#1f1b4d'; g.lineWidth = 3; g.strokeRect(GX - 56, GY - 140, 112, 30);
    g.fillStyle = '#1f1b4d'; g.font = '900 18px "Noto Sans TC",sans-serif'; g.textAlign = 'center'; g.fillText(mode === 'after' ? '定時定點' : '路邊', GX, GY - 118); g.textAlign = 'left';
    if (mode === 'after') { g.fillStyle = '#1f1b4d'; g.fillRect(GX - 3, GY - 110, 6, 40); }
    // landing marker
    g.setLineDash([6, 6]); g.strokeStyle = 'rgba(31,27,77,.35)'; g.beginPath(); g.moveTo(L, GY - 150); g.lineTo(L, GY); g.stroke(); g.setLineDash([]);
    // elder
    g.fillStyle = '#ffd9b0'; g.beginPath(); g.arc(GX, GY - 70, 14, 0, 7); g.fill(); g.stroke();
    g.fillStyle = '#d8d8e8'; g.fillRect(GX - 14, GY - 86, 28, 8);
    g.fillStyle = '#7bd33a'; g.fillRect(GX - 12, GY - 56, 24, 40); g.strokeRect(GX - 12, GY - 56, 24, 40);
    g.lineWidth = 5; g.beginPath(); g.moveTo(GX - 6, GY - 16); g.lineTo(GX - 9, GY); g.moveTo(GX + 6, GY - 16); g.lineTo(GX + 9, GY); g.moveTo(GX + 10, GY - 46); g.lineTo(GX + 26, GY - 62); g.stroke(); g.lineWidth = 3;
    if (!bag || bag.t < 0.01) { g.fillStyle = '#3b3b4f'; g.beginPath(); g.arc(GX + 28, GY - 66, 9, 0, 7); g.fill(); g.stroke(); }
    // truck
    if (truck) {
      const x = truck.x, y = GY - 78, body = mode === 'now' ? '#f2c200' : '#17a2f0';
      g.fillStyle = body; g.fillRect(x, y, 130, 74); g.strokeRect(x, y, 130, 74);
      g.fillRect(x + 130, y + 22, 52, 52); g.strokeRect(x + 130, y + 22, 52, 52);
      g.fillStyle = '#bfe8ff'; g.fillRect(x + 142, y + 30, 30, 20); g.strokeRect(x + 142, y + 30, 30, 20);
      g.fillStyle = '#1f1b4d'; g.fillRect(x + 22, y - 6, 76, 10);
      [x + 34, x + 150].forEach(wx => { g.fillStyle = '#1f1b4d'; g.beginPath(); g.arc(wx, GY, 17, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(wx, GY, 6, 0, 7); g.fill(); });
    }
    // bag
    if (bag && !(bag.res && truck)) { g.fillStyle = '#3b3b4f'; g.strokeStyle = '#1f1b4d'; g.beginPath(); g.arc(bag.res === false ? bag.x1 : bag.x, bag.res === false ? GY - 8 : bag.y, 9, 0, 7); g.fill(); g.stroke(); }
    if (finished) { g.fillStyle = 'rgba(244,241,255,.85)'; g.fillRect(0, 70, cv.width, 90); g.fillStyle = '#1f1b4d'; g.font = '900 40px "Noto Sans TC",sans-serif'; g.textAlign = 'center'; g.fillText(`倒進去 ${hits} / 5`, cv.width / 2, 128); g.textAlign = 'left'; }
  }
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!box.hidden) { update(dt); draw(); }
    raf = box.hidden ? 0 : requestAnimationFrame(loop);
  }
  open.onclick = () => { box.hidden = !box.hidden; open.textContent = box.hidden ? '開始玩' : '收起來'; if (!box.hidden) restart(); };
  $('#gNow').onclick = () => setMode('now'); $('#gNew').onclick = () => setMode('after');
  btn.onclick = throwBag; cv.addEventListener('pointerdown', e => { e.preventDefault(); throwBag(); });
  addEventListener('keydown', e => { if (!box.hidden && e.code === 'Space' && document.activeElement && document.activeElement.tagName !== 'BUTTON') { e.preventDefault(); throwBag(); } });
})();

(function(){ const vs = document.querySelectorAll('.vcard video'); vs.forEach(v => v.addEventListener('play', () => vs.forEach(o => { if (o !== v) o.pause(); }))); })();

/* 點進臉書播放器時，播放器會搶焦點把頁面捲走：回到點擊前的位置 */
(function(){
  const hist = []; let hold = null;
  const stop = () => { hold = null; };
  addEventListener('scroll', () => {
    const now = Date.now();
    if (hold) { if (Date.now() < hold.until) { if (Math.abs(scrollY - hold.y) > 2) scrollTo({ top: hold.y, behavior: 'instant' }); } else hold = null; return; }
    hist.push({ t: now, y: scrollY }); while (hist.length > 1 && now - hist[0].t > 1500) hist.shift();
  }, { passive: true });
  addEventListener('blur', () => {
    const a = document.activeElement;
    if (!a || a.tagName !== 'IFRAME' || !a.closest('.vcard')) return;
    const now = Date.now(); let y = scrollY;
    for (const h of hist) if (now - h.t >= 300) y = h.y;
    hold = { y, until: now + 2500 };
    if (Math.abs(scrollY - y) > 2) scrollTo({ top: y, behavior: 'instant' });
  });
  ['wheel', 'touchmove', 'keydown'].forEach(ev => addEventListener(ev, stop, { passive: true }));
})();


window.policyStamp = stamp; window.policyPlop = plop; drawPassport();

const initialCategory=location.hash.match(/^#six-(\w+)$/)?.[1];
if(initialCategory && SIX.includes(initialCategory))stamp(initialCategory);
