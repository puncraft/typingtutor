// Stars, lesson unlocking, and the rewards each lesson gives.
(function () {
  'use strict';
  const TT = window.TT;

  // ready:false means it is unlocked but still "being built" (arrives in a later phase).
  const DEFS = {
    lights: { name: 'Launch Pad Lights', desc: 'Your launch pad lights up!' },
    helmet: { name: 'Space Helmet', desc: 'Every space cadet needs a helmet.' },
    asteroids: { name: 'Asteroid Blaster', desc: 'A blaster game! The builders are working on it.', ready: false },
    alien: { name: 'Blip the Alien', desc: 'Your new alien buddy! Click Blip to say hi.' },
    fins: { name: 'Rocket Fins', desc: 'Fins help your rocket fly straight.' },
    cockpit: { name: 'Rocket Cockpit', desc: 'A window so you can see the stars!' },
    megalaser: { name: 'Mega Laser', desc: 'A super blast for Asteroid Blaster.', ready: false },
    garage: { name: 'Truck Garage', desc: 'Moon trucks are coming! The builders are working on it.', ready: false },
    'trophy-moon': { name: 'Moon Base Trophy', desc: 'You learned the whole home row!' },
    stadium: { name: 'Space Stadium', desc: 'Space soccer!', ready: false }
  };

  const BY_LESSON = {
    1: ['lights', 'helmet'],
    2: ['asteroids'],
    3: ['alien'],
    4: ['fins'],
    5: ['cockpit', 'megalaser'],
    6: ['garage', 'trophy-moon']
  };

  const starsFor = (acc) => (acc >= 0.97 ? 3 : acc >= 0.9 ? 2 : 1);
  const has = (p, id) => p.unlocks.indexOf(id) !== -1;

  function isOpen(p, id) {
    if (!TT.lessonById(id)) return false;
    if (id === 1) return true;
    const prev = p.lessons[id - 1];
    return !!(prev && prev.stars >= 1);
  }

  // First open lesson not yet finished, or null when everything available is done.
  function nextLesson(p) {
    for (const l of TT.LESSONS) {
      if (!p.lessons[l.id] && isOpen(p, l.id)) return l;
    }
    return null;
  }

  function unlockLesson(id) {
    for (const k of Object.keys(BY_LESSON)) {
      if (BY_LESSON[k].indexOf(id) !== -1) return Number(k);
    }
    return null;
  }

  function complete(p, lessonId, acc, correct, wrong) {
    const stars = starsFor(acc);
    const prev = p.lessons[lessonId];
    const rec = prev || { stars: 0, best: 0, plays: 0 };
    const improved = stars > rec.stars;
    rec.stars = Math.max(rec.stars, stars);
    rec.best = Math.max(rec.best, acc);
    rec.plays += 1;
    rec.last = Date.now();
    p.lessons[lessonId] = rec;

    const newUnlocks = [];
    (BY_LESSON[lessonId] || []).forEach((id) => {
      if (!has(p, id)) {
        p.unlocks.push(id);
        newUnlocks.push(id);
      }
    });
    TT.Storage.save();
    return { lessonId, stars, accuracy: acc, correct, wrong, first: !prev, improved, newUnlocks, bestStars: rec.stars };
  }

  TT.Progress = {
    DEFS,
    BY_LESSON,
    starsFor,
    has,
    isOpen,
    nextLesson,
    unlockLesson,
    complete,
    totalStars: (p) => Object.values(p.lessons).reduce((n, r) => n + (r.stars || 0), 0),
    rocketParts: (p) => ({ fins: has(p, 'fins'), cockpit: has(p, 'cockpit'), boosters: has(p, 'boosters'), nose: has(p, 'nose') })
  };
})();
