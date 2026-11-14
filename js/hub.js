// The Launch Pad: the home screen that grows as lessons are finished.
(function () {
  'use strict';
  const TT = window.TT;
  const esc = TT.esc;
  let root = null;
  let p = null;

  function rand(seed) {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  function background(lit) {
    const r = rand(7);
    let stars = '';
    for (let i = 0; i < 80; i++) {
      const x = (r() * 1000).toFixed(1);
      const y = (r() * 290).toFixed(1);
      const rad = (r() * 1.6 + 0.4).toFixed(2);
      const tw = i % 4 === 0 ? ` class="twinkle" style="animation-delay:${(r() * 3).toFixed(2)}s"` : '';
      stars += `<circle cx="${x}" cy="${y}" r="${rad}"${tw}/>`;
    }
    const lights = [712, 878].map((x) => lit
      ? `<circle cx="${x}" cy="312" r="20" fill="url(#glow)" class="pad-glow"/><circle cx="${x}" cy="312" r="6" fill="#ffd23f"/>`
      : `<circle cx="${x}" cy="312" r="6" fill="#5b6378"/>`).join('');
    return `<svg class="scene-bg" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b24"/><stop offset="1" stop-color="#22306b"/></linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a3abbf"/><stop offset="1" stop-color="#6b7389"/></linearGradient>
        <radialGradient id="glow"><stop offset="0" stop-color="#ffd23f" stop-opacity=".9"/><stop offset="1" stop-color="#ffd23f" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1000" height="420" fill="url(#sky)"/>
      <g fill="#fff">${stars}</g>
      <g transform="translate(470 70)">
        <ellipse rx="70" ry="14" fill="none" stroke="#ffd9a8" stroke-width="6" transform="rotate(-15)"/>
        <circle r="40" fill="#ff9f5a"/>
        <path d="M-37 -10 Q0 -2 37 -14" stroke="#e57c3a" stroke-width="6" fill="none"/>
        <path d="M-70 0 A70 14 0 0 0 70 0" fill="none" stroke="#ffd9a8" stroke-width="6" transform="rotate(-15)"/>
      </g>
      <g transform="translate(955 58)">
        <circle r="26" fill="#3d8bff"/>
        <path d="M-14 -12 q8 -6 14 2 q-2 8 -10 8 z M4 6 q10 -4 14 6 q-6 8 -14 2z" fill="#3ddc84"/>
      </g>
      <path d="M0 318 Q160 296 330 312 T660 306 T1000 312 L1000 420 L0 420 Z" fill="url(#ground)"/>
      <ellipse cx="120" cy="385" rx="40" ry="9" fill="#7c849a"/>
      <ellipse cx="430" cy="400" rx="55" ry="10" fill="#7c849a"/>
      <ellipse cx="640" cy="362" rx="26" ry="6" fill="#868ea3"/>
      <ellipse cx="930" cy="398" rx="45" ry="9" fill="#7c849a"/>
      <g stroke="#9aa3b5" stroke-width="4" fill="none">
        <line x1="892" y1="120" x2="892" y2="318"/><line x1="914" y1="120" x2="914" y2="318"/>
        <path d="M892 120 L914 150 L892 180 L914 210 L892 240 L914 270 L892 300"/>
        <line x1="892" y1="165" x2="866" y2="165"/>
      </g>
      <rect x="700" y="318" width="220" height="16" rx="4" fill="#4a5268"/>
      <rect x="720" y="334" width="180" height="10" fill="#3a4157"/>
      ${lights}
    </svg>`;
  }

  function bldState(id) {
    const d = TT.Progress.DEFS[id];
    if (!d || !TT.Progress.has(p, id)) return 'locked';
    return d.ready === false ? 'building' : 'ready';
  }

  function bldSprite(id, kind, label) {
    const state = bldState(id);
    return `<div class="sprite sp-${kind}" data-act="bld" data-id="${id}" title="${esc(label)}">
      ${TT.Art.building(kind, state)}
      <div class="bld-label">${state === 'locked' ? '???' : esc(label)}</div>
    </div>`;
  }

  function nodeHtml(l, next) {
    const rec = p.lessons[l.id];
    const open = TT.Progress.isOpen(p, l.id);
    const state = next && next.id === l.id ? 'next' : rec ? 'done' : open ? 'open' : 'locked';
    const keys = l.newKeys.length ? l.newKeys.map((k) => k.toUpperCase()).join(' ') : 'Review';
    const stars = [1, 2, 3].map((i) => TT.Art.star(rec && rec.stars >= i)).join('');
    return `<div class="node-wrap">
      <button class="node ${state}" data-act="lesson" data-id="${l.id}" ${open ? '' : 'disabled'} title="Lesson ${l.id}: ${esc(l.title)}">
        <span class="node-num">${open ? l.id : TT.Art.lock()}</span>
        <span class="node-keys">${esc(keys)}</span>
      </button>
      <div class="node-stars">${stars}</div>
    </div>`;
  }

  function planetCard(planet, idx, next) {
    const lessons = planet.lessons.map(TT.lessonById).filter(Boolean);
    const dot = `<div class="planet-dot" style="--pc:${planet.color}"></div>`;
    if (!lessons.length) {
      const prev = TT.PLANETS[idx - 1];
      return `<div class="planet-card locked">
        <div class="planet-head">${dot}<div><div class="planet-name">${esc(planet.name)}</div><div class="planet-row">${esc(planet.row)}</div></div></div>
        <div class="soon-text">${TT.Art.lock()} <span>Finish ${esc(prev ? prev.name : 'the last planet')} to fly here. Coming soon!</span></div>
      </div>`;
    }
    const won = planet.trophy && TT.Progress.has(p, planet.trophy);
    return `<div class="planet-card">
      <div class="planet-head">${dot}<div><div class="planet-name">${esc(planet.name)}</div><div class="planet-row">${esc(planet.row)}</div></div>
        ${won ? `<div class="planet-trophy" title="Trophy won!">${TT.Art.trophy()}</div>` : ''}
      </div>
      <div class="nodes">${lessons.map((l) => nodeHtml(l, next)).join('')}</div>
    </div>`;
  }

  function settingLabel(name, on) {
    return `${name}: ${on ? 'On' : 'Off'}`;
  }

  function render() {
    const next = TT.Progress.nextLesson(p);
    const parts = TT.Progress.rocketParts(p);
    parts.showGhosts = true;
    root.innerHTML = `
      <header class="topbar">
        <div class="me">${TT.Art.cadet(p.color, TT.Progress.has(p, 'helmet'))}<span>${esc(p.name)}</span></div>
        <div class="stat" title="Stars">${TT.Art.star(true)}<b>${TT.Progress.totalStars(p)}</b></div>
        <div class="spacer"></div>
        <button class="btn btn-small btn-ghost" data-act="voice">${settingLabel('Voice', p.settings.voice)}</button>
        <button class="btn btn-small btn-ghost" data-act="sound">${settingLabel('Sounds', p.settings.sound)}</button>
        <button class="btn btn-small btn-ghost" data-act="switch">Switch cadet</button>
      </header>
      <div class="scene">
        ${background(TT.Progress.has(p, 'lights'))}
        <div class="sprite sp-cadet" data-act="cadet">${TT.Art.cadet(p.color, TT.Progress.has(p, 'helmet'))}</div>
        ${TT.Progress.has(p, 'alien') ? `<div class="sprite sp-alien" data-act="alien">${TT.Art.alien()}</div>` : ''}
        ${bldSprite('asteroids', 'asteroids', 'Asteroid Blaster')}
        ${bldSprite('garage', 'garage', 'Truck Garage')}
        ${bldSprite('stadium', 'stadium', 'Space Stadium')}
        <div class="sprite sp-rocket" data-act="rocket">${TT.Art.rocket(parts)}</div>
        ${TT.Progress.has(p, 'trophy-moon') ? `<div class="sprite sp-trophy" data-act="trophy">${TT.Art.trophy()}</div>` : ''}
        <div class="scene-guide"><div class="mini-robot">${TT.Art.robot()}</div><div class="scene-bubble" id="hub-bubble"></div></div>
      </div>
      <section class="map">${TT.PLANETS.map((pl, i) => planetCard(pl, i, next)).join('')}</section>
      ${next ? `<p class="start-hint">Press the <b>space bar</b> to start Lesson ${next.id}</p>` : ''}
    `;
    root.onclick = onClick;
  }

  function bubble(text, speak) {
    const b = root.querySelector('#hub-bubble');
    if (!b) return;
    b.textContent = text;
    b.classList.remove('pop');
    void b.offsetWidth;
    b.classList.add('pop');
    if (speak) TT.Audio.say(text);
  }

  function greet(speak) {
    const next = TT.Progress.nextLesson(p);
    let text;
    if (next && next.id === 1) {
      text = `Welcome to your launch pad, ${p.name}! Your rocket is not finished yet. Every lesson adds something new. Press the space bar to start lesson 1!`;
    } else if (next) {
      const keys = next.newKeys.length ? `Let's learn ${next.newKeys.map((k) => (k === ';' ? 'semicolon' : k.toUpperCase())).join(' and ')}.` : "Let's review everything.";
      text = `Welcome back, ${p.name}! Ready for lesson ${next.id}? ${keys}`;
    } else {
      text = `You finished Moon Base, ${p.name}! Turbo Planet is coming soon. You can play any lesson again to win more stars.`;
    }
    bubble(text, speak);
  }

  function onClick(e) {
    const t = e.target.closest('[data-act]');
    if (!t) return;
    const act = t.dataset.act;
    if (act === 'lesson') {
      TT.Audio.sfx.click();
      TT.App.go('lesson/' + t.dataset.id);
    } else if (act === 'voice' || act === 'sound') {
      p.settings[act] = !p.settings[act];
      TT.Storage.save();
      TT.Audio.setSettings(p.settings);
      t.textContent = settingLabel(act === 'voice' ? 'Voice' : 'Sounds', p.settings[act]);
      TT.Audio.sfx.click();
      if (act === 'voice' && p.settings.voice) TT.Audio.say('Voice is on!');
    } else if (act === 'switch') {
      TT.App.go('profiles');
    } else if (act === 'alien') {
      const lines = ['Bleep bloop!', 'Blip says hi!', 'Zoom zoom!', 'You are a super typer!', 'Blip loves rockets!'];
      t.classList.remove('jump');
      void t.offsetWidth;
      t.classList.add('jump');
      TT.Audio.sfx.boing();
      bubble(lines[Math.floor(Math.random() * lines.length)], true);
    } else if (act === 'cadet') {
      bubble(`That's you, ${p.name}! Space cadet in training.`, true);
    } else if (act === 'rocket') {
      const parts = TT.Progress.rocketParts(p);
      const missing = Object.values(parts).filter((v) => !v).length;
      bubble(missing ? 'This is your rocket! The dotted lines show parts you can still earn. Keep doing lessons to build it!' : 'Your rocket is ready to fly!', true);
    } else if (act === 'trophy') {
      TT.Audio.sfx.unlock();
      bubble('The Moon Base trophy! You learned the whole home row!', true);
    } else if (act === 'bld') {
      const id = t.dataset.id;
      const d = TT.Progress.DEFS[id];
      const state = bldState(id);
      let text;
      if (state === 'locked') {
        const n = TT.Progress.unlockLesson(id);
        text = n ? `Finish lesson ${n} to unlock something here!` : 'Keep learning to unlock something here!';
      } else {
        text = `The builders are working on the ${d.name}. Coming soon!`;
      }
      bubble(text, true);
    }
  }

  function onKey(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      if (e.target && e.target.tagName === 'BUTTON' && e.key === 'Enter') return;
      const next = TT.Progress.nextLesson(p);
      e.preventDefault();
      if (next) TT.App.go('lesson/' + next.id);
    }
  }

  function show(el) {
    root = el;
    p = TT.Storage.current();
    TT.Audio.setSettings(p.settings);
    render();
    const fromPlay = TT.App.prev === 'results' || TT.App.prev === 'lesson';
    greet(!fromPlay);
  }

  TT.Hub = { show, onKey, hide: () => TT.Audio.stop() };
})();
