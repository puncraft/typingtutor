// On-screen keyboard, finger colours, and the hands diagram.
(function () {
  'use strict';
  const TT = window.TT;

  const FINGERS = {
    'L-pinky': { name: 'left pinky', color: '#b07cff' },
    'L-ring': { name: 'left ring finger', color: '#4fa3ff' },
    'L-middle': { name: 'left middle finger', color: '#3ddc84' },
    'L-index': { name: 'left pointer finger', color: '#ffb02e' },
    'R-index': { name: 'right pointer finger', color: '#ffb02e' },
    'R-middle': { name: 'right middle finger', color: '#3ddc84' },
    'R-ring': { name: 'right ring finger', color: '#4fa3ff' },
    'R-pinky': { name: 'right pinky', color: '#b07cff' },
    thumb: { name: 'thumb', color: '#ff7eb6' }
  };

  const KEY_FINGER = { ' ': 'thumb' };
  const assign = (f, keys) => keys.split('').forEach((k) => { KEY_FINGER[k] = f; });
  assign('L-pinky', 'qaz');
  assign('L-ring', 'wsx');
  assign('L-middle', 'edc');
  assign('L-index', 'rfvtgb');
  assign('R-index', 'yhnujm');
  assign('R-middle', 'ik,');
  assign('R-ring', 'ol.');
  assign('R-pinky', 'p;/');

  const fingerOf = (ch) => KEY_FINGER[ch] || null;
  const colorOf = (ch) => (fingerOf(ch) ? FINGERS[fingerOf(ch)].color : '#888');
  const keyLabel = (ch) => (ch === ' ' ? 'space' : ch.toUpperCase());

  const NAMES = { ' ': 'the space bar', ';': 'the semicolon key', ',': 'the comma key', '.': 'the period key', '/': 'the slash key' };
  const keyName = (ch) => NAMES[ch] || 'the letter ' + ch.toUpperCase();

  function hint(ch) {
    const f = fingerOf(ch);
    return f ? `Press ${keyName(ch)} with your ${FINGERS[f].name}.` : `Press ${keyName(ch)}.`;
  }

  // Use the physical key position (event.code) so the finger chart always matches,
  // whatever keyboard layout the computer is set to.
  const CODE_MAP = { Space: ' ', Semicolon: ';', Comma: ',', Period: '.', Slash: '/' };
  function charFromEvent(e) {
    if (CODE_MAP[e.code] !== undefined) return CODE_MAP[e.code];
    if (/^Key[A-Z]$/.test(e.code)) return e.code.charAt(3).toLowerCase();
    if (e.key === ' ') return ' ';
    if (e.key && e.key.length === 1) return e.key.toLowerCase();
    return null;
  }

  const ROWS = [['qwertyuiop', 0], ['asdfghjkl;', 0.3], ['zxcvbnm,./', 0.8]];

  function createKeyboard(container, opts) {
    opts = opts || {};
    const known = opts.known || new Set();
    const fresh = new Set(opts.newKeys || []);
    let html = '<div class="kb">';
    ROWS.forEach(([keys, off]) => {
      html += `<div class="kb-row" style="--off:${off}">`;
      keys.split('').forEach((k) => {
        const cls = ['key', known.has(k) ? 'learned' : 'unlearned', fresh.has(k) ? 'fresh' : '', k === 'f' || k === 'j' ? 'bump' : '']
          .filter(Boolean).join(' ');
        html += `<div class="${cls}" data-k="${TT.esc(k)}" style="--fc:${colorOf(k)}">${TT.esc(keyLabel(k))}</div>`;
      });
      html += '</div>';
    });
    html += `<div class="kb-row" style="--off:2.6"><div class="key space-key learned" data-k=" " style="--fc:${FINGERS.thumb.color}">space</div></div>`;
    html += '</div>';
    container.innerHTML = html;

    const map = {};
    container.querySelectorAll('.key').forEach((el) => { map[el.dataset.k] = el; });
    let cur = null;
    return {
      target(ch) {
        if (cur) cur.classList.remove('target');
        cur = ch == null ? null : map[ch] || null;
        if (cur) cur.classList.add('target');
      },
      press(ch) {
        const el = map[ch];
        if (!el) return;
        el.classList.add('pressed');
        setTimeout(() => el.classList.remove('pressed'), 120);
      },
      wrong(ch) {
        const el = map[ch];
        if (!el) return;
        el.classList.remove('wrong');
        void el.offsetWidth;
        el.classList.add('wrong');
        setTimeout(() => el.classList.remove('wrong'), 350);
      }
    };
  }

  function handGroup(side) {
    const fingers = [['pinky', 20, 62, 30, 78], ['ring', 56, 36, 32, 104], ['middle', 94, 24, 32, 116], ['index', 132, 38, 32, 102]];
    let s = `<g class="finger" data-f="thumb"><line x1="150" y1="166" x2="200" y2="130" stroke="${FINGERS.thumb.color}" stroke-width="28" stroke-linecap="round"/></g>`;
    fingers.forEach(([n, x, y, w, h]) => {
      const id = side + '-' + n;
      s += `<g class="finger" data-f="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2}" fill="${FINGERS[id].color}"/>` +
        `<ellipse cx="${x + w / 2}" cy="${y + 15}" rx="${w * 0.28}" ry="8" fill="rgba(255,255,255,.45)"/></g>`;
    });
    s += '<rect class="palm" x="18" y="100" width="150" height="80" rx="36" fill="#f2c79c"/>';
    return s;
  }

  function createHands(container) {
    container.innerHTML = `<svg class="hands" viewBox="0 0 560 204" aria-hidden="true">
      <g transform="translate(10 0)">${handGroup('L')}</g>
      <g transform="translate(550 0) scale(-1 1)">${handGroup('R')}</g>
      <text x="103" y="200" text-anchor="middle">left hand</text>
      <text x="457" y="200" text-anchor="middle">right hand</text>
    </svg>`;
    const svg = container.querySelector('svg');
    const groups = Array.from(svg.querySelectorAll('.finger'));
    function many(list) {
      svg.classList.toggle('has-target', list.length > 0);
      groups.forEach((g) => g.classList.toggle('on', list.indexOf(g.dataset.f) !== -1));
    }
    return {
      target: (f) => many(f ? [f] : []),
      many
    };
  }

  TT.Keyboard = { create: createKeyboard, charFromEvent, fingerOf, colorOf, keyLabel, keyName, hint, FINGERS };
  TT.Hands = { create: createHands };
})();
