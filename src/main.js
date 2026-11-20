import './style.css';
import { TIERS, T, TOTAL_W, CRATES } from './data.js';
import { bottle, crateArt } from './art.js';

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const eur = v => '€' + v.toLocaleString('en-US', { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
function rollTier() {
  let r = Math.random() * TOTAL_W;
  for (const t of TIERS) { if ((r -= t.w) < 0) return t.id; }
  return 'table';
}
function roll(crate) {
  // walk down tiers if a crate is missing one
  let tier = rollTier();
  let pool = crate.items.filter(i => i.tier === tier);
  while (!pool.length) { tier = TIERS[T[tier].i - 1].id; pool = crate.items.filter(i => i.tier === tier); }
  return pool[Math.floor(Math.random() * pool.length)];
}
function cellHTML(item, extra = '') {
  const t = T[item.tier];
  return `<div class="cell" style="--c:${t.color}">${bottle(item)}<div class="n">${item.name}</div><div class="t">${t.name}</div>${extra}</div>`;
}
let toastTimer;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

/* ---------- sound ---------- */
let actx, muted = false;
function beep(freq = 900, dur = 0.03, type = 'square', vol = 0.04) {
  if (muted) return;
  actx = actx || new (window.AudioContext || window.webkitAudioContext)();
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, actx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
  o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime + dur);
}
function fanfare(tierIdx) {
  const notes = tierIdx >= 5 ? [523, 659, 784, 1046, 1318] : tierIdx >= 3 ? [523, 659, 784, 1046] : [440, 554];
  notes.forEach((f, i) => setTimeout(() => beep(f, .18, 'triangle', .08), i * 110));
}
$('#mute').onclick = () => { muted = !muted; $('#mute').textContent = muted ? '🔇' : '🔊'; };

/* ---------- state ---------- */
let balance = 250, inventory = [], current = CRATES[2], spinning = false;
function setBal(v) { balance = Math.round(v * 100) / 100; $('#bal').textContent = eur(balance); updateOpenBtn(); }
$('#addFunds').onclick = () => { setBal(balance + 100); toast('Added €100 of demo credit'); };

/* ---------- crate grid ---------- */
function renderGrid() {
  $('#crateGrid').innerHTML = CRATES.map(c => {
    const top = c.items.find(i => i.tier === 'legend');
    return `<button class="ccard ${c === current ? 'active' : ''}" data-id="${c.id}" style="--band:${c.band}">
      ${c.hot ? '<span class="hot">HOT</span>' : ''}
      <div class="crate" data-art="${c.id}"></div>
      <h3>${c.name}</h3><p>${c.desc}</p>
      <div class="row"><span class="price">${eur(c.price)}</span><span class="tag">Top: ${eur(top.value)}</span></div>
    </button>`;
  }).join('');
  document.querySelectorAll('[data-art]').forEach(el => crateArt(el, CRATES.find(c => c.id === el.dataset.art)));
  document.querySelectorAll('.ccard').forEach(b => b.onclick = () => {
    if (spinning) return;
    select(CRATES.find(c => c.id === b.dataset.id));
    $('#open').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ---------- opener ---------- */
const STRIP_N = 64, WIN_IDX = 54;
function select(crate) {
  current = crate;
  document.querySelectorAll('.ccard').forEach(b => b.classList.toggle('active', b.dataset.id === crate.id));
  crateArt($('#openCrate'), crate);
  $('#openName').textContent = crate.name;
  $('#openDesc').textContent = crate.desc;
  $('#odds').innerHTML = TIERS.map(t => `<span style="--c:${t.color}">${t.name} ${(t.w / TOTAL_W * 100).toFixed(t.w < 10 ? 1 : 0)}%</span>`).join('');
  $('#contents').innerHTML = [...crate.items].sort((a, b) => T[b.tier].i - T[a.tier].i)
    .map(i => cellHTML(i, `<div class="v">${eur(i.value)}</div>`)).join('');
  fillStrip(Array.from({ length: STRIP_N }, () => roll(crate)));
  updateOpenBtn();
}
function fillStrip(items) {
  const strip = $('#strip');
  strip.style.transition = 'none';
  strip.style.transform = 'translateX(0)';
  strip.innerHTML = items.map(i => cellHTML(i)).join('');
}
function updateOpenBtn() {
  const b = $('#openBtn');
  b.disabled = spinning || balance < current.price;
  b.textContent = spinning ? 'Opening…' : balance < current.price ? `Need ${eur(current.price)}, top up above` : `Open for ${eur(current.price)}`;
}

$('#openBtn').onclick = () => {
  if (spinning || balance < current.price) return;
  spinning = true;
  setBal(balance - current.price);
  const winner = roll(current);
  const items = Array.from({ length: STRIP_N }, (_, i) => i === WIN_IDX ? winner : roll(current));
  // tease: put a near-miss legendary/cult right next to the winner sometimes
  if (Math.random() < .45) {
    const teaser = current.items.filter(i => T[i.tier].i >= 5)[Math.floor(Math.random() * 2)] || current.items.at(-1);
    items[WIN_IDX + (Math.random() < .5 ? 1 : -1)] = teaser;
  }
  fillStrip(items);

  const strip = $('#strip'), reel = $('#reel');
  const cells = strip.children;
  const step = cells[1].getBoundingClientRect().left - cells[0].getBoundingClientRect().left;
  const cellW = cells[0].offsetWidth;
  const jitter = (Math.random() - .5) * cellW * .8;
  const target = WIN_IDX * step + cellW / 2 - reel.clientWidth / 2 + jitter;
  const dur = $('#fast').checked ? 1600 : 6500;

  void strip.offsetWidth; // reflow so the reset sticks
  strip.style.transition = `transform ${dur}ms cubic-bezier(.06,.72,.1,1)`;
  strip.style.transform = `translateX(${-target}px)`;

  let last = -1, running = true;
  (function tick() {
    if (!running) return;
    const x = new DOMMatrix(getComputedStyle(strip).transform).m41;
    const idx = Math.floor((-x + reel.clientWidth / 2) / step);
    if (idx !== last) { last = idx; beep(1200 + Math.random() * 200, .02, 'square', .025); }
    requestAnimationFrame(tick);
  })();

  strip.addEventListener('transitionend', function done(e) {
    if (e.target !== strip) return;
    strip.removeEventListener('transitionend', done);
    running = false;
    setTimeout(() => reveal(winner), 350);
  });
};

function reveal(item) {
  const t = T[item.tier];
  const pl = item.value - current.price;
  const ref = { ...item, key: Date.now() + Math.random(), shipped: false };
  inventory.unshift(ref);
  renderInv();
  pushDrop('you', item);

  $('#modal').style.setProperty('--c', t.color);
  $('#modal').innerHTML = `<div class="rays"></div>${bottle(item)}
    <div class="tier">${t.name}</div>
    <h3>${item.name}</h3>
    <div class="meta">${item.detail}</div>
    <div class="val">${eur(item.value)}</div>
    <div class="pl ${pl >= 0 ? 'up' : 'down'}">${pl >= 0 ? '▲ +' + eur(pl) : '▼ ' + eur(pl).replace('€-', '-€')} vs crate price</div>
    <div class="acts">
      <button class="btn ghost" id="mSell">Sell for ${eur(item.value * .85)}</button>
      <button class="btn" id="mKeep">Keep in cellar</button>
    </div>`;
  $('#overlay').classList.add('show');
  fanfare(t.i);
  if (t.i >= 3) confetti(t.hex, t.i >= 5 ? 160 : 80);

  $('#mKeep').onclick = closeModal;
  $('#mSell').onclick = () => { sell(ref); closeModal(); };
}
function closeModal() {
  $('#overlay').classList.remove('show');
  spinning = false; updateOpenBtn();
}
$('#overlay').onclick = e => { if (e.target.id === 'overlay') closeModal(); };
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#overlay').classList.contains('show')) closeModal(); });

function confetti(color, n) {
  const box = $('#confetti');
  const cols = [color, '#fff', '#e4ae39', '#c2274a'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    const a = Math.random() * Math.PI * 2, d = 200 + Math.random() * 500;
    p.style.cssText = `background:${cols[i % cols.length]};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d + 200}px;--r:${Math.random() * 900}deg;animation-delay:${Math.random() * .15}s`;
    box.appendChild(p);
  }
  setTimeout(() => box.innerHTML = '', 2000);
}

/* ---------- inventory ---------- */
function sell(ref) {
  inventory = inventory.filter(i => i !== ref);
  setBal(balance + ref.value * .85);
  toast(`Sold ${ref.name} for ${eur(ref.value * .85)}`);
  renderInv();
}
function renderInv() {
  const el = $('#inv');
  if (!inventory.length) {
    el.innerHTML = `<div class="inv-empty">Your cellar is empty. <a href="#open">Open a crate</a> to start collecting.</div>`;
    $('#invSub').textContent = 'Bottles you’ve pulled. Ship them home or sell them back for 85% of value.';
    return;
  }
  const total = inventory.reduce((s, i) => s + i.value, 0);
  $('#invSub').textContent = `${inventory.length} bottle${inventory.length > 1 ? 's' : ''} · cellar value ${eur(total)}`;
  el.innerHTML = `<div class="inv">${inventory.map((i, n) => cellHTML(i,
    `${i.shipped ? '<span class="shipped">SHIPPING</span>' : ''}<div class="v" style="position:relative;color:var(--gold);font-weight:800;font-size:12px">${eur(i.value)}</div>
     <div class="acts"><button data-sell="${n}">Sell ${eur(i.value * .85)}</button>${i.shipped ? '' : `<button class="ship" data-ship="${n}">Ship</button>`}</div>`)).join('')}</div>`;
  el.querySelectorAll('[data-sell]').forEach(b => b.onclick = () => sell(inventory[b.dataset.sell]));
  el.querySelectorAll('[data-ship]').forEach(b => b.onclick = () => {
    const it = inventory[b.dataset.ship]; it.shipped = true; renderInv();
    toast(`🚚 ${it.name} is on its way (not really, this is a demo)`);
  });
}

/* ---------- live feed ---------- */
const NAMES = ['sommelier_sam', 'grapeEscape', 'tannin_tom', 'corkd', 'malbecMike', 'brutForce', 'decant_this', 'pinotNoir404', 'vinny', 'oak_n_roll', 'sipster', 'rieslingRick', 'merlot_mel', 'bubblyBea', 'terroirist', 'xX_magnum_Xx'];
function pushDrop(user, item) {
  const t = T[item.tier], feed = $('#feed');
  const d = document.createElement('div');
  d.className = 'drop'; d.style.setProperty('--c', t.color);
  d.innerHTML = `${bottle(item)}<div><div class="u">${user === 'you' ? '<b style="color:var(--gold)">You</b>' : user}</div><div class="n">${item.name}</div></div>`;
  feed.prepend(d);
  while (feed.children.length > 14) feed.lastChild.remove();
}
function fakeDrop() {
  const crate = CRATES[Math.floor(Math.random() * CRATES.length)];
  let item = roll(crate);
  if (Math.random() < .25) item = roll(crate).tier === 'table' ? crate.items.find(i => i.tier === 'premier') : item; // spice it up a bit
  pushDrop(NAMES[Math.floor(Math.random() * NAMES.length)], item);
  const sb = $('#statBottles'); sb.textContent = (parseInt(sb.textContent.replace(/,/g, '')) + 1).toLocaleString('en-US');
  if (item.tier === 'legend') $('#statLegend').textContent = +$('#statLegend').textContent + 1;
}

/* ---------- init ---------- */
crateArt($('#heroCrate'), CRATES[3]);
renderGrid();
select(current);
renderInv();
setBal(balance);
for (let i = 0; i < 12; i++) fakeDrop();
(function loop() { fakeDrop(); setTimeout(loop, 1400 + Math.random() * 2200); })();
