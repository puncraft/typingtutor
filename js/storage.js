// Profiles and progress, saved in this browser's localStorage. No server.
(function () {
  'use strict';
  const TT = (window.TT = window.TT || {});
  const KEY = 'typingtutor:v1';
  let available = true;

  function blank() {
    return { version: 1, currentId: null, profiles: {} };
  }

  function normalize(p) {
    p.lessons = p.lessons && typeof p.lessons === 'object' ? p.lessons : {};
    p.unlocks = Array.isArray(p.unlocks) ? p.unlocks : [];
    p.crystals = typeof p.crystals === 'number' ? p.crystals : 0;
    p.settings = Object.assign({ voice: true, sound: true }, p.settings || {});
    return p;
  }

  function probe() {
    try {
      localStorage.setItem(KEY + ':probe', '1');
      localStorage.removeItem(KEY + ':probe');
      return true;
    } catch (e) {
      return false;
    }
  }

  function parse(raw) {
    const d = JSON.parse(raw);
    if (!d || typeof d !== 'object' || !d.profiles || typeof d.profiles !== 'object') throw new Error('bad data');
    Object.keys(d.profiles).forEach((id) => normalize(d.profiles[id]));
    if (d.currentId && !d.profiles[d.currentId]) d.currentId = null;
    d.version = 1;
    return d;
  }

  function load() {
    available = probe();
    let raw = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch (e) {
      available = false;
      return blank();
    }
    if (!raw) return blank();
    try {
      return parse(raw);
    } catch (e) {
      // Keep a copy of unreadable data instead of silently losing it.
      try { localStorage.setItem(KEY + ':corrupt', raw); } catch (e2) { /* ignore */ }
      return blank();
    }
  }

  let data = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      available = true;
      return true;
    } catch (e) {
      available = false;
      return false;
    }
  }

  function makeId() {
    return 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
  }

  TT.Storage = {
    isAvailable: () => available,
    list() {
      return Object.values(data.profiles).sort((a, b) => a.created - b.created);
    },
    get: (id) => data.profiles[id] || null,
    current: () => (data.currentId ? data.profiles[data.currentId] || null : null),
    setCurrent(id) {
      data.currentId = data.profiles[id] ? id : null;
      save();
    },
    create(name, color) {
      const p = normalize({ id: makeId(), name: name, color: color, created: Date.now() });
      data.profiles[p.id] = p;
      data.currentId = p.id;
      save();
      return p;
    },
    remove(id) {
      delete data.profiles[id];
      if (data.currentId === id) data.currentId = null;
      save();
    },
    save,
    exportJSON: () => JSON.stringify(data, null, 2),
    importJSON(str) {
      try {
        data = parse(str);
        save();
        return true;
      } catch (e) {
        return false;
      }
    }
  };
})();
