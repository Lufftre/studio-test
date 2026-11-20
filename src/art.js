import { T } from './data.js';

const GLASS = { red: '#2a1013', white: '#b8c46c', rose: '#f2a3ab', sparkling: '#1f3b26', rosesp: '#e3909a' };
const FOIL  = { red: '#7a1426', white: '#d9d2bd', rose: '#f6e3e6', sparkling: '#d4ad52', rosesp: '#e8c36a' };
const SHAPES = {
  bdx:   'M24 4h12v44q0 8 10 14q4 3 4 10v76q0 6-6 6H16q-6 0-6-6V72q0-7 4-10q10-6 10-14z',
  burg:  'M25 4h10v28q0 22 13 36q2 3 2 8v68q0 6-6 6H16q-6 0-6-6V76q0-5 2-8q13-14 13-36z',
  champ: 'M24 4h12v26q0 22 14 38q4 5 4 12v68q0 6-6 6H12q-6 0-6-6V80q0-7 4-12q14-16 14-38z',
};
let uid = 0;
export function bottle(item) {
  const id = 'g' + (uid++);
  const t = T[item.tier], glass = GLASS[item.type], foil = item.tier === 'legend' ? '#e4ae39' : FOIL[item.type];
  const foilH = item.shape === 'champ' ? 30 : 20;
  const labelY = item.shape === 'champ' ? 96 : 92;
  return `<svg viewBox="0 0 60 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" x2="1">
      <stop offset="0" stop-color="${glass}" stop-opacity=".95"/><stop offset=".35" stop-color="${glass}"/>
      <stop offset=".45" stop-color="#fff" stop-opacity=".35"/><stop offset=".55" stop-color="${glass}"/>
      <stop offset="1" stop-color="#000" stop-opacity=".9"/></linearGradient></defs>
    <path d="${SHAPES[item.shape]}" fill="url(#${id})" stroke="rgba(0,0,0,.5)" stroke-width="1"/>
    <rect x="${item.shape === 'champ' ? 22 : 23}" y="2" width="${item.shape === 'champ' ? 16 : 14}" height="${foilH}" rx="2" fill="${foil}"/>
    <rect x="${item.shape === 'champ' ? 22 : 23}" y="${foilH - 2}" width="${item.shape === 'champ' ? 16 : 14}" height="3" fill="rgba(0,0,0,.3)"/>
    <rect x="14" y="${labelY}" width="32" height="38" rx="2" fill="#f3ead7"/>
    <rect x="14" y="${labelY}" width="32" height="5" fill="${t.hex}"/>
    <rect x="18" y="${labelY + 11}" width="24" height="2.5" rx="1" fill="#3a2a22" opacity=".8"/>
    <rect x="21" y="${labelY + 17}" width="18" height="1.6" rx=".8" fill="#3a2a22" opacity=".5"/>
    <rect x="21" y="${labelY + 21}" width="18" height="1.6" rx=".8" fill="#3a2a22" opacity=".5"/>
    <circle cx="30" cy="${labelY + 30}" r="3.2" fill="none" stroke="${t.hex}" stroke-width="1.2"/>
  </svg>`;
}

export function crateArt(el, crate) {
  const picks = [...crate.items].sort((a, b) => T[b.tier].i - T[a.tier].i).slice(0, 3);
  el.style.setProperty('--band', crate.band);
  el.style.setProperty('--wood1', crate.wood[0]);
  el.style.setProperty('--wood2', crate.wood[1]);
  el.innerHTML = `<div class="bottles">${[picks[2], picks[0], picks[1]].map(bottle).join('')}</div>
    <div class="box"><div class="band"></div><div class="brand">${crate.name}</div></div>`;
}
