// All artwork is drawn here as inline SVG strings. Original art, no image files.
(function () {
  'use strict';
  const TT = (window.TT = window.TT || {});

  TT.esc = function (s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  };

  const STAR_PATH = 'M12 2.5l2.8 6 6.6.7-4.9 4.5 1.4 6.5L12 16.9l-5.9 3.3 1.4-6.5L2.6 9.2l6.6-.7z';

  function star(filled, cls) {
    return `<svg class="star-icon${filled ? ' filled' : ''}${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR_PATH}"/></svg>`;
  }

  // Sparky, the robot guide
  function robot() {
    return `<svg class="art-robot" viewBox="0 0 120 140" aria-hidden="true">
      <line x1="60" y1="20" x2="60" y2="9" stroke="#9fb3d9" stroke-width="4" stroke-linecap="round"/>
      <circle class="robot-light" cx="60" cy="8" r="6" fill="#ff5d73"/>
      <rect x="10" y="88" width="16" height="32" rx="8" fill="#b9c8f0"/>
      <rect x="94" y="88" width="16" height="32" rx="8" fill="#b9c8f0"/>
      <rect x="30" y="82" width="60" height="44" rx="14" fill="#d9e4ff" stroke="#7b8fc4" stroke-width="3"/>
      <circle cx="60" cy="104" r="9" fill="#ffb02e"/>
      <rect x="22" y="18" width="76" height="60" rx="18" fill="#d9e4ff" stroke="#7b8fc4" stroke-width="3"/>
      <rect x="32" y="30" width="56" height="34" rx="12" fill="#1b2350"/>
      <circle class="robot-eye" cx="48" cy="45" r="7" fill="#59f0ff"/>
      <circle class="robot-eye" cx="72" cy="45" r="7" fill="#59f0ff"/>
      <path d="M50 56 Q60 63 70 56" stroke="#59f0ff" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  // Blip, the alien buddy
  function alien() {
    return `<svg class="art-alien" viewBox="0 0 100 110" aria-hidden="true">
      <line x1="42" y1="26" x2="34" y2="9" stroke="#5be37d" stroke-width="4" stroke-linecap="round"/>
      <line x1="58" y1="26" x2="66" y2="9" stroke="#5be37d" stroke-width="4" stroke-linecap="round"/>
      <circle cx="34" cy="8" r="5" fill="#ffd23f"/><circle cx="66" cy="8" r="5" fill="#ffd23f"/>
      <ellipse cx="34" cy="102" rx="11" ry="6" fill="#3fb862"/><ellipse cx="66" cy="102" rx="11" ry="6" fill="#3fb862"/>
      <path d="M14 70 Q14 24 50 24 Q86 24 86 70 Q86 100 50 100 Q14 100 14 70Z" fill="#5be37d"/>
      <circle cx="50" cy="56" r="17" fill="#fff"/>
      <circle cx="53" cy="58" r="9" fill="#1b2350"/><circle cx="56" cy="54" r="3" fill="#fff"/>
      <path d="M38 82 Q50 92 62 82" stroke="#1b6b35" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="28" cy="76" r="5" fill="#ff9fb3" opacity=".6"/><circle cx="72" cy="76" r="5" fill="#ff9fb3" opacity=".6"/>
    </svg>`;
  }

  // The kid's character
  function cadet(color, helmet) {
    const c = color || '#4fa3ff';
    return `<svg class="art-cadet" viewBox="0 0 100 150" aria-hidden="true">
      <rect x="30" y="116" width="16" height="26" rx="7" fill="${c}"/>
      <rect x="54" y="116" width="16" height="26" rx="7" fill="${c}"/>
      <ellipse cx="38" cy="143" rx="12" ry="6" fill="#2a3150"/>
      <ellipse cx="62" cy="143" rx="12" ry="6" fill="#2a3150"/>
      <rect x="12" y="76" width="16" height="38" rx="8" fill="${c}"/>
      <rect x="72" y="76" width="16" height="38" rx="8" fill="${c}"/>
      <circle cx="20" cy="114" r="7" fill="#e8ecf8"/>
      <circle cx="80" cy="114" r="7" fill="#e8ecf8"/>
      <rect x="24" y="70" width="52" height="54" rx="18" fill="${c}"/>
      <rect x="24" y="102" width="52" height="7" fill="rgba(0,0,0,.22)"/>
      <path d="${STAR_PATH}" fill="#ffd23f" transform="translate(41 78) scale(.75)"/>
      <circle cx="50" cy="44" r="22" fill="#f2c79c"/>
      <path d="M28 40 Q32 18 50 18 Q70 18 72 40 Q62 30 50 31 Q38 30 28 40Z" fill="#6b4226"/>
      <circle cx="42" cy="46" r="3.2" fill="#1b2350"/>
      <circle cx="58" cy="46" r="3.2" fill="#1b2350"/>
      <path d="M42 55 Q50 61 58 55" stroke="#1b2350" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${helmet ? `<circle cx="50" cy="44" r="31" fill="rgba(170,225,255,.22)" stroke="#d8eeff" stroke-width="4"/>
      <path d="M33 30 Q40 20 52 18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
      <line x1="70" y1="20" x2="78" y2="6" stroke="#d8eeff" stroke-width="3"/><circle cx="78" cy="6" r="4" fill="#ff5d73"/>` : ''}
    </svg>`;
  }

  // Rocket. Parts not yet earned can be shown as dashed outlines (showGhosts).
  function rocket(p) {
    p = p || {};
    const body = p.color || '#f4f6ff';
    const g = 'class="ghost"';
    let s = '<svg class="art-rocket" viewBox="0 0 200 330" aria-hidden="true">';
    if (p.flame) {
      s += '<g class="flame"><path d="M76 292 Q100 350 124 292Z" fill="#ffb02e"/><path d="M88 292 Q100 328 112 292Z" fill="#fff3a0"/></g>';
    }
    if (p.boosters) {
      s += '<rect x="42" y="196" width="22" height="84" rx="10" fill="#d0d6ee" stroke="#aab4d4" stroke-width="3"/><rect x="136" y="196" width="22" height="84" rx="10" fill="#d0d6ee" stroke="#aab4d4" stroke-width="3"/>';
    } else if (p.showGhosts) {
      s += `<rect ${g} x="42" y="196" width="22" height="84" rx="10"/><rect ${g} x="136" y="196" width="22" height="84" rx="10"/>`;
    }
    const finL = 'M62 205 L22 270 L22 298 L62 268 Z';
    const finR = 'M138 205 L178 270 L178 298 L138 268 Z';
    if (p.fins) s += `<path d="${finL}" fill="#ff5d5d"/><path d="${finR}" fill="#ff5d5d"/>`;
    else if (p.showGhosts) s += `<path ${g} d="${finL}"/><path ${g} d="${finR}"/>`;
    s += `<path d="M60 112 L140 112 L140 268 Q100 284 60 268 Z" fill="${body}" stroke="#aab4d4" stroke-width="3"/>`;
    s += '<rect x="61" y="228" width="78" height="14" fill="#4fa3ff"/>';
    const nose = 'M60 114 Q64 40 100 14 Q136 40 140 114 Z';
    if (p.nose) {
      s += `<path d="${nose}" fill="#ff5d5d" stroke="#d94848" stroke-width="3"/>`;
    } else {
      if (p.showGhosts) s += `<path ${g} d="${nose}"/>`;
      s += '<rect x="54" y="102" width="92" height="14" rx="4" fill="#ffd23f"/>';
      s += '<path d="M62 102 l8 14 M80 102 l8 14 M98 102 l8 14 M116 102 l8 14 M134 102 l6 10" stroke="#2a3150" stroke-width="5"/>';
    }
    if (p.cockpit) {
      s += '<circle cx="100" cy="165" r="24" fill="#59f0ff" stroke="#aab4d4" stroke-width="7"/><path d="M88 158 a14 14 0 0 1 12 -9" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>';
    } else if (p.showGhosts) {
      s += `<circle ${g} cx="100" cy="165" r="24"/>`;
    } else {
      s += '<circle cx="100" cy="165" r="24" fill="#59f0ff" stroke="#aab4d4" stroke-width="7"/>';
    }
    s += '<path d="M76 272 L124 272 L132 294 L68 294 Z" fill="#6b7487"/>';
    s += '</svg>';
    return s;
  }

  function trophy() {
    return `<svg class="art-trophy" viewBox="0 0 64 72" aria-hidden="true">
      <path d="M17 12H7a10 10 0 0 0 12 13M47 12h10a10 10 0 0 1-12 13" fill="none" stroke="#ffd23f" stroke-width="5"/>
      <path d="M16 6h32v14a16 16 0 0 1-32 0z" fill="#ffd23f"/>
      <rect x="28" y="34" width="8" height="14" fill="#e0a800"/>
      <rect x="18" y="47" width="28" height="10" rx="3" fill="#8a5a00"/>
      <rect x="14" y="57" width="36" height="9" rx="3" fill="#6b4500"/>
      <path d="${STAR_PATH}" fill="#fff6c2" transform="translate(23 8) scale(.75)"/>
    </svg>`;
  }

  const LOCK_INNER = '<path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="#cfd6f5" stroke-width="2.5"/><rect x="4.5" y="10" width="15" height="11" rx="3" fill="#cfd6f5"/><circle cx="12" cy="15.5" r="1.8" fill="#2a3670"/>';

  function lock() {
    return `<svg class="art-lock" viewBox="0 0 24 24" aria-hidden="true">${LOCK_INNER}</svg>`;
  }

  function bulb() {
    return `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="27" r="16" fill="#ffd23f"/><rect x="25" y="41" width="14" height="12" rx="3" fill="#aab4d4"/><path d="M32 3v6M6 27h6M52 27h6M13 8l4 4M51 8l-4 4" stroke="#ffd23f" stroke-width="4" stroke-linecap="round"/></svg>`;
  }

  function bolt() {
    return `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M36 4 L12 36 H30 L26 60 L52 26 H34 Z" fill="#59f0ff" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`;
  }

  const BUILDINGS = {
    asteroids: `<rect x="20" y="85" width="120" height="25" rx="6" fill="#5b6687"/>
      <rect x="70" y="18" width="16" height="52" rx="6" fill="#ff5d5d" transform="rotate(30 78 70)"/>
      <path d="M30 86 A50 50 0 0 1 130 86 Z" fill="#7fd3ff" fill-opacity=".85" stroke="#cfe8ff" stroke-width="3"/>
      <circle cx="80" cy="86" r="9" fill="#ffd23f"/>`,
    garage: `<rect x="15" y="40" width="130" height="70" rx="6" fill="#ff8a3d"/>
      <path d="M8 44 L80 12 L152 44 Z" fill="#c95a1a"/>
      <rect x="35" y="62" width="90" height="48" fill="#3a4466"/>
      <path d="M35 74h90M35 86h90M35 98h90" stroke="#59648a" stroke-width="3"/>
      <rect x="50" y="46" width="60" height="12" rx="4" fill="#fff"/>`,
    stadium: `<rect x="10" y="22" width="5" height="62" fill="#9aa3b5"/><rect x="4" y="14" width="18" height="10" rx="2" fill="#fff6c2"/>
      <rect x="145" y="22" width="5" height="62" fill="#9aa3b5"/><rect x="138" y="14" width="18" height="10" rx="2" fill="#fff6c2"/>
      <ellipse cx="80" cy="86" rx="72" ry="26" fill="#4fa3ff"/>
      <ellipse cx="80" cy="81" rx="60" ry="18" fill="#3ddc84"/>
      <path d="M80 63v36" stroke="#fff" stroke-width="2"/>
      <ellipse cx="80" cy="81" rx="10" ry="4" fill="none" stroke="#fff" stroke-width="2"/>`
  };

  const CONSTRUCTION = `<g class="construction">
      <path d="M26 112 L35 90 L44 112Z" fill="#ff8a3d"/><rect x="28" y="102" width="14" height="3" fill="#fff"/>
      <path d="M116 112 L125 90 L134 112Z" fill="#ff8a3d"/><rect x="118" y="102" width="14" height="3" fill="#fff"/>
      <rect x="78" y="58" width="4" height="34" fill="#7a5a2a"/>
      <rect x="58" y="38" width="44" height="24" rx="4" fill="#ffd23f" stroke="#222" stroke-width="2"/>
      <text x="80" y="55" text-anchor="middle" font-size="12" font-weight="700" font-family="Fredoka, sans-serif" fill="#222">SOON</text>
    </g>`;

  // state: 'locked' | 'building' | 'ready'
  function building(kind, state) {
    let s = `<svg class="art-building state-${state}" viewBox="0 0 160 120" aria-hidden="true"><g class="bld-body">${BUILDINGS[kind] || ''}</g>`;
    if (state === 'building') s += CONSTRUCTION;
    if (state === 'locked') s += `<g transform="translate(56 30) scale(2)">${LOCK_INNER}</g>`;
    return s + '</svg>';
  }

  function unlockIcon(id, profile) {
    const color = profile ? profile.color : '#4fa3ff';
    switch (id) {
      case 'lights': return bulb();
      case 'helmet': return cadet(color, true);
      case 'alien': return alien();
      case 'fins': return rocket({ fins: true });
      case 'cockpit': return rocket({ fins: true, cockpit: true });
      case 'asteroids': return building('asteroids', 'building');
      case 'garage': return building('garage', 'building');
      case 'megalaser': return bolt();
      case 'trophy-moon': return trophy();
      default: return star(true);
    }
  }

  TT.Art = { star, robot, alien, cadet, rocket, trophy, lock, bulb, bolt, building, unlockIcon };
})();
