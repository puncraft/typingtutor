// Startup, the splash screen, and switching between screens (#hub, #lesson/3, ...).
(function () {
  'use strict';
  const TT = window.TT;
  let started = false;
  let current = null;
  let currentName = null;

  const Splash = {
    show(el) {
      const touchOnly = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      el.innerHTML = `
        <div class="splash">
          <div class="splash-rocket">${TT.Art.rocket({ fins: true, cockpit: true, nose: true, flame: true })}</div>
          <h1 class="title">Space Cadet Typing</h1>
          <p class="splash-sub">Learn to type. Build a rocket. Blast off!</p>
          <p class="splash-by">A game by Mr. Gary</p>
          <button class="btn btn-big" data-act="start">Start</button>
          <div class="hint">or press any key</div>
          ${touchOnly ? '<div class="notice">This game needs a real keyboard. Try it on a laptop or a computer.</div>' : ''}
          ${TT.Storage.isAvailable() ? '' : '<div class="notice">This browser is not letting the game save. You can still play, but stars and unlocks will be lost when the page closes.</div>'}
        </div>`;
      el.onclick = (e) => {
        if (e.target.closest('[data-act="start"]')) start();
      };
    },
    onKey(e) {
      if (['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock'].indexOf(e.key) !== -1) return;
      e.preventDefault();
      start();
    }
  };

  function start() {
    if (started) return;
    started = true;
    TT.Audio.unlock();
    TT.Audio.sfx.click();
    route();
  }

  const SCREENS = () => ({ splash: Splash, profiles: TT.Profiles, hub: TT.Hub, lesson: TT.Lesson, results: TT.Results });

  function route() {
    const screens = SCREENS();
    const requested = (location.hash.replace(/^#/, '') || 'hub').split('/');
    let name = requested[0];
    let args = requested.slice(1);
    if (!started) {
      name = 'splash';
    } else {
      if (!screens[name] || name === 'splash') { name = 'hub'; args = []; }
      if (name !== 'profiles' && !TT.Storage.current()) { name = 'profiles'; args = []; }
      const want = [name].concat(args).join('/');
      if (want !== requested.join('/')) history.replaceState(null, '', '#' + want);
    }
    if (current && current.hide) current.hide();
    TT.App.prev = currentName;
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === 'screen-' + name));
    current = screens[name];
    currentName = name;
    current.show(document.getElementById('screen-' + name), args);
    window.scrollTo(0, 0);
  }

  let toastTimer = null;
  TT.App = {
    prev: null,
    lastResult: null,
    go(hash) {
      if (location.hash === '#' + hash) route();
      else location.hash = hash;
    },
    toast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { t.hidden = true; }, 2500);
    }
  };

  window.addEventListener('hashchange', route);

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (current && current.onKey) current.onKey(e);
  });

  // After a mouse click, drop focus from the button so the space bar
  // does not "click" it again while typing.
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('button');
    if (b && e.detail > 0) b.blur();
  });

  route();
})();
