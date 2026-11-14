// The lesson engine: intro, typing lines, accuracy, finishing.
(function () {
  'use strict';
  const TT = window.TT;
  const esc = TT.esc;
  const CHEERS = ['Type the letters!', 'You got this!', 'Nice and steady.', 'Keep your fingers on the bumps.', 'Great typing!', 'Eyes on the screen!'];

  let root = null;
  let st = null;
  let kb = null;
  let hands = null;
  let timers = [];

  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function show(el, args) {
    root = el;
    clearTimers();
    const p = TT.Storage.current();
    const id = parseInt(args[0], 10);
    const lesson = TT.lessonById(id);
    if (!lesson || !TT.Progress.isOpen(p, id)) {
      TT.App.go('hub');
      return;
    }
    TT.Audio.setSettings(p.settings);
    st = { lesson, phase: 'intro', line: 0, pos: 0, correct: 0, wrong: 0, missRun: 0 };
    render();
    TT.Audio.say(lesson.intro.say);
  }

  function hide() {
    clearTimers();
    TT.Audio.stop();
    st = null;
  }

  function render() {
    const L = st.lesson;
    const known = TT.knownKeys(L.id);
    const introKeys = L.newKeys.length ? L.newKeys : Array.from(known).filter((k) => k !== ' ');
    root.innerHTML = `
      <div class="lesson">
        <header class="lesson-top">
          <button class="btn btn-small btn-ghost" data-act="exit" title="Back to the launch pad (Esc)">✕ Exit</button>
          <div class="lesson-title">Lesson ${L.id}: ${esc(L.title)}</div>
          <div class="track" aria-hidden="true"><div class="track-line"></div><div class="track-rocket">${TT.Art.rocket({ fins: true, cockpit: true, nose: true, flame: true })}</div><div class="track-moon"></div></div>
        </header>
        <div class="guide-row"><div class="guide-art">${TT.Art.robot()}</div><div class="bubble" id="bubble">Get ready!</div></div>
        <div class="tiles" id="tiles"></div>
        <div id="kb"></div>
        <div id="hands"></div>
        <div class="intro-overlay" id="intro">
          <div class="intro-card">
            <div class="intro-guide">${TT.Art.robot()}</div>
            <div class="intro-body">
              <h2>Lesson ${L.id}: ${esc(L.title)}</h2>
              <p>${esc(L.intro.text)}</p>
              <div class="intro-keys${introKeys.length > 4 ? ' small' : ''}">${introKeys.map((k) => `<div class="key learned${k === 'f' || k === 'j' ? ' bump' : ''}" style="--fc:${TT.Keyboard.colorOf(k)}">${esc(TT.Keyboard.keyLabel(k))}</div>`).join('')}</div>
              <div id="intro-hands"></div>
              <div class="intro-actions">
                <button class="btn btn-big" data-act="go">Let's go!</button>
                <span class="hint">or press the space bar</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    root.onclick = onClick;
    kb = TT.Keyboard.create(root.querySelector('#kb'), { known, newKeys: L.newKeys });
    hands = TT.Hands.create(root.querySelector('#hands'));
    const introHands = TT.Hands.create(root.querySelector('#intro-hands'));
    introHands.many(Array.from(new Set(introKeys.map(TT.Keyboard.fingerOf))));
    updateTrack();
  }

  function begin() {
    if (!st || st.phase !== 'intro') return;
    st.phase = 'typing';
    root.querySelector('#intro').hidden = true;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    TT.Audio.sfx.click();
    showLine();
  }

  function currentText() {
    return st.lesson.lines[st.line].text;
  }

  function setBubble(text, isHint) {
    const b = root.querySelector('#bubble');
    b.textContent = text;
    b.classList.toggle('hint', !!isHint);
  }

  function showLine() {
    const ln = st.lesson.lines[st.line];
    st.pos = 0;
    st.missRun = 0;
    const tiles = root.querySelector('#tiles');
    tiles.classList.remove('complete');
    tiles.innerHTML = Array.from(ln.text).map((ch) => `<span class="tile${ch === ' ' ? ' space' : ''}">${ch === ' ' ? '' : esc(ch)}</span>`).join('');
    if (ln.say) {
      setBubble(ln.say);
      TT.Audio.say(ln.say);
    } else {
      setBubble(CHEERS[st.line % CHEERS.length]);
    }
    updateTrack();
    updateTarget();
  }

  function updateTarget() {
    const tiles = root.querySelectorAll('#tiles .tile');
    tiles.forEach((t, i) => t.classList.toggle('current', i === st.pos));
    const ch = currentText()[st.pos];
    kb.target(ch);
    hands.target(TT.Keyboard.fingerOf(ch));
  }

  function updateTrack() {
    const total = st.lesson.lines.length;
    const done = st.phase === 'done' ? total : st.line;
    const track = root.querySelector('.track');
    if (track) track.style.setProperty('--p', (done / total).toFixed(3));
  }

  function onCorrect(ch) {
    const tiles = root.querySelectorAll('#tiles .tile');
    tiles[st.pos].classList.add('done');
    tiles[st.pos].classList.remove('current', 'shake');
    kb.press(ch);
    TT.Audio.sfx.key();
    st.correct++;
    if (st.missRun >= 2) setBubble(CHEERS[st.line % CHEERS.length]);
    st.missRun = 0;
    st.pos++;
    if (st.pos >= currentText().length) {
      lineComplete();
    } else {
      updateTarget();
    }
  }

  function onWrong(ch, want) {
    const tile = root.querySelectorAll('#tiles .tile')[st.pos];
    tile.classList.remove('shake');
    void tile.offsetWidth;
    tile.classList.add('shake');
    kb.wrong(ch);
    TT.Audio.sfx.miss();
    st.wrong++;
    st.missRun++;
    if (st.missRun === 2 || st.missRun % 5 === 0) {
      const h = TT.Keyboard.hint(want);
      setBubble(h, true);
      TT.Audio.say(h);
    }
  }

  function lineComplete() {
    st.phase = 'between';
    kb.target(null);
    hands.target(null);
    root.querySelector('#tiles').classList.add('complete');
    TT.Audio.sfx.line();
    later(() => {
      if (!st) return;
      st.line++;
      if (st.line >= st.lesson.lines.length) {
        finish();
      } else {
        st.phase = 'typing';
        showLine();
      }
    }, 550);
  }

  function finish() {
    st.phase = 'done';
    updateTrack();
    const total = st.correct + st.wrong;
    const acc = total ? st.correct / total : 1;
    const p = TT.Storage.current();
    TT.App.lastResult = TT.Progress.complete(p, st.lesson.id, acc, st.correct, st.wrong);
    setBubble('You made it to the moon!');
    later(() => TT.App.go('results'), 700);
  }

  function exit() {
    TT.App.go('hub');
  }

  function onClick(e) {
    const t = e.target.closest('[data-act]');
    if (!t) return;
    if (t.dataset.act === 'exit') exit();
    else if (t.dataset.act === 'go') begin();
  }

  function onKey(e) {
    if (!st) return;
    if (e.key === 'Escape') {
      exit();
      return;
    }
    if (st.phase === 'intro') {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        begin();
      }
      return;
    }
    const ch = TT.Keyboard.charFromEvent(e);
    if (ch === null) return;
    e.preventDefault();
    if (st.phase !== 'typing' || e.repeat) return;
    const want = currentText()[st.pos];
    if (ch === want) onCorrect(ch);
    else onWrong(ch, want);
  }

  TT.Lesson = { show, hide, onKey };
})();
