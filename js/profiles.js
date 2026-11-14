// "Who is typing today?" screen and new cadet form.
(function () {
  'use strict';
  const TT = window.TT;
  const esc = TT.esc;
  const COLORS = ['#ff5d5d', '#ff8a3d', '#ffd23f', '#3ddc84', '#4fa3ff', '#b07cff'];
  let root = null;
  let mode = 'list';
  let color = COLORS[4];

  function show(el) {
    root = el;
    mode = TT.Storage.list().length ? 'list' : 'create';
    render();
  }

  function render() {
    if (mode === 'create') return renderCreate();
    const cards = TT.Storage.list().map((p) => `
      <div class="profile-card" data-act="pick" data-id="${esc(p.id)}" role="button" tabindex="0">
        <button class="pc-remove" data-act="remove" data-id="${esc(p.id)}" title="Remove this cadet" aria-label="Remove ${esc(p.name)}">✕</button>
        <div class="pc-art">${TT.Art.cadet(p.color, TT.Progress.has(p, 'helmet'))}</div>
        <div class="pc-name">${esc(p.name)}</div>
        <div class="pc-stars">${TT.Art.star(true)} ${TT.Progress.totalStars(p)}</div>
      </div>`).join('');
    root.innerHTML = `
      <div class="profiles">
        <h1 class="title">Space Cadet Typing</h1>
        <h2 class="subtitle">Who is typing today?</h2>
        <div class="profile-grid">
          ${cards}
          <button class="profile-card new" data-act="new">+ New cadet</button>
        </div>
      </div>`;
    root.onclick = onClick;
  }

  function renderCreate() {
    const canCancel = TT.Storage.list().length > 0;
    root.innerHTML = `
      <div class="create">
        <h2>New space cadet!</h2>
        <div class="create-row">
          <div class="create-art" id="create-art">${TT.Art.cadet(color, false)}</div>
          <div class="create-form">
            <label for="cadet-name">What's your name?</label>
            <input id="cadet-name" maxlength="14" autocomplete="off" spellcheck="false">
            <div class="label">Pick your suit colour</div>
            <div class="swatches">
              ${COLORS.map((c) => `<button class="swatch${c === color ? ' sel' : ''}" data-act="color" data-c="${c}" style="--c:${c}" aria-label="Colour"></button>`).join('')}
            </div>
            <div class="error" id="create-error"></div>
            <div class="form-actions">
              <button class="btn btn-big" data-act="create">Let's go!</button>
              ${canCancel ? '<button class="btn btn-ghost" data-act="cancel">Cancel</button>' : ''}
            </div>
          </div>
        </div>
      </div>`;
    root.onclick = onClick;
    const input = root.querySelector('#cadet-name');
    input.focus();
    TT.Audio.say("Hi! What's your name, space cadet? A grown-up can help you type it.");
  }

  function create() {
    const input = root.querySelector('#cadet-name');
    const name = input.value.trim();
    if (!name) {
      root.querySelector('#create-error').textContent = 'Type your name first!';
      input.focus();
      return;
    }
    TT.Audio.sfx.unlock();
    TT.Storage.create(name, color);
    TT.App.go('hub');
  }

  function onClick(e) {
    const t = e.target.closest('[data-act]');
    if (!t) return;
    const act = t.dataset.act;
    if (act === 'remove') {
      e.stopPropagation();
      const p = TT.Storage.get(t.dataset.id);
      if (p && window.confirm(`Remove ${p.name}? All of their progress will be deleted.`)) {
        TT.Storage.remove(p.id);
        mode = TT.Storage.list().length ? 'list' : 'create';
        render();
      }
    } else if (act === 'pick') {
      TT.Audio.sfx.click();
      TT.Storage.setCurrent(t.dataset.id);
      TT.App.go('hub');
    } else if (act === 'new') {
      TT.Audio.sfx.click();
      mode = 'create';
      render();
    } else if (act === 'cancel') {
      mode = 'list';
      render();
    } else if (act === 'color') {
      color = t.dataset.c;
      TT.Audio.sfx.click();
      root.querySelectorAll('.swatch').forEach((s) => s.classList.toggle('sel', s === t));
      root.querySelector('#create-art').innerHTML = TT.Art.cadet(color, false);
    } else if (act === 'create') {
      create();
    }
  }

  function onKey(e) {
    if (mode === 'create' && e.key === 'Enter') {
      e.preventDefault();
      create();
    } else if (mode === 'list' && e.key === 'Enter' && e.target.classList && e.target.classList.contains('profile-card')) {
      e.target.click();
    }
  }

  TT.Profiles = { show, onKey, hide: () => TT.Audio.stop() };
})();
