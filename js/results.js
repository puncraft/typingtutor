// End-of-lesson celebration: stars, score, and new unlocks.
(function () {
  'use strict';
  const TT = window.TT;
  const esc = TT.esc;
  const CONFETTI = ['#ffd23f', '#ff5d5d', '#3ddc84', '#4fa3ff', '#b07cff', '#ff8a3d', '#59f0ff'];
  let root = null;
  let timers = [];
  let nextId = null;

  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  function confetti(n) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 1.2;
      const dur = 2.2 + Math.random() * 1.6;
      const c = CONFETTI[i % CONFETTI.length];
      s += `<span class="confetti" style="left:${left.toFixed(1)}%;background:${c};animation-delay:${delay.toFixed(2)}s;animation-duration:${dur.toFixed(2)}s"></span>`;
    }
    return s;
  }

  function joinAnd(list) {
    if (list.length < 2) return list.join('');
    return list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
  }

  function show(el) {
    root = el;
    const r = TT.App.lastResult;
    const p = TT.Storage.current();
    if (!r || !p) {
      TT.App.go('hub');
      return;
    }
    const L = TT.lessonById(r.lessonId);
    const next = TT.lessonById(r.lessonId + 1);
    nextId = next && TT.Progress.isOpen(p, next.id) ? next.id : null;
    const head = { 3: 'Amazing!', 2: 'Great job!', 1: 'You did it!' }[r.stars];
    const total = r.correct + r.wrong;
    const pct = Math.round(r.accuracy * 100);
    const tip = r.stars === 3
      ? 'Perfect flying, cadet!'
      : r.stars === 2
        ? 'Almost perfect gets 3 stars. You can try again any time!'
        : 'Get 9 out of 10 keys right for 2 stars. Go slow and steady!';
    const best = r.bestStars > r.stars ? `<div class="tip">Your best on this lesson: ${r.bestStars} stars</div>` : '';
    const unlocks = r.newUnlocks.map((id) => {
      const d = TT.Progress.DEFS[id];
      return `<div class="unlock-card">
        <div class="unlock-art">${TT.Art.unlockIcon(id, p)}</div>
        <div class="unlock-text">
          <div class="unlock-new">NEW!</div>
          <div class="unlock-name">${esc(d.name)}</div>
          <div class="unlock-desc">${esc(d.desc)}</div>
          ${d.ready === false ? '<div class="unlock-soon">Being built!</div>' : ''}
        </div>
      </div>`;
    }).join('');

    let nextHtml = '';
    if (nextId) nextHtml = '<button class="btn btn-big" data-act="next">Next lesson ▶</button>';
    else if (!next) nextHtml = '<div class="coming-soon">Turbo Planet is coming soon!</div>';

    root.innerHTML = `
      <div class="results">
        <div class="confetti-box" aria-hidden="true">${confetti(20 + r.stars * 15)}</div>
        <div class="results-card">
          <div class="results-guide">${TT.Art.robot()}</div>
          <h1 class="title">${head}</h1>
          <div class="results-sub">Lesson ${L.id}: ${esc(L.title)}</div>
          <div class="big-stars">${[0, 1, 2].map((i) => `<div class="big-star" data-i="${i}">${TT.Art.star(false)}</div>`).join('')}</div>
          <div class="score-line">You pressed <b>${total}</b> keys and got <b>${r.correct}</b> right!</div>
          <div class="acc-bar"><div class="acc-fill" style="width:${pct}%"></div><span>${pct}%</span></div>
          <div class="tip">${tip}</div>
          ${best}
          ${unlocks ? `<div class="unlocks">${unlocks}</div>` : ''}
          <div class="results-actions">
            <button class="btn btn-ghost" data-act="hub">Launch Pad</button>
            <button class="btn btn-blue" data-act="again">Try again</button>
            ${nextHtml}
          </div>
          <div class="hint">Press Enter for ${nextId ? 'the next lesson' : 'the launch pad'}</div>
        </div>
      </div>`;
    root.onclick = onClick;

    TT.Audio.sfx.fanfare();
    for (let i = 0; i < r.stars; i++) {
      later(() => {
        const s = root.querySelector(`.big-star[data-i="${i}"]`);
        if (s) {
          s.innerHTML = TT.Art.star(true);
          s.classList.add('pop');
        }
        TT.Audio.sfx.star(i);
      }, 700 + i * 450);
    }
    if (r.newUnlocks.length) later(() => TT.Audio.sfx.unlock(), 900 + r.stars * 450);

    let speech = `${head} You got ${r.stars} star${r.stars > 1 ? 's' : ''}!`;
    if (r.newUnlocks.length) speech += ` You unlocked ${joinAnd(r.newUnlocks.map((id) => TT.Progress.DEFS[id].name))}!`;
    later(() => TT.Audio.say(speech), 800 + r.stars * 450);
  }

  function onClick(e) {
    const t = e.target.closest('[data-act]');
    if (!t) return;
    const r = TT.App.lastResult;
    TT.Audio.sfx.click();
    if (t.dataset.act === 'hub') TT.App.go('hub');
    else if (t.dataset.act === 'again') TT.App.go('lesson/' + r.lessonId);
    else if (t.dataset.act === 'next' && nextId) TT.App.go('lesson/' + nextId);
  }

  function onKey(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      TT.App.go(nextId ? 'lesson/' + nextId : 'hub');
    } else if (e.key === 'Escape') {
      TT.App.go('hub');
    }
  }

  function hide() {
    timers.forEach(clearTimeout);
    timers = [];
    TT.Audio.stop();
  }

  TT.Results = { show, hide, onKey };
})();
