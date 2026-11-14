// Sound effects (made in code with Web Audio) and the spoken voice (Web Speech API).
(function () {
  'use strict';
  const TT = (window.TT = window.TT || {});
  let ctx = null;
  const settings = { voice: true, sound: true };

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC(); } catch (e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, o) {
    o = o || {};
    if (!settings.sound) return;
    const c = ensure();
    if (!c) return;
    const t = c.currentTime + (o.delay || 0);
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(o.slide, t + dur);
    const vol = o.vol == null ? 0.12 : o.vol;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  const sfx = {
    key: () => tone(700, 0.06, { type: 'triangle', vol: 0.07 }),
    miss: () => tone(240, 0.18, { vol: 0.12, slide: 170 }),
    line: () => [523, 659, 784].forEach((f, i) => tone(f, 0.14, { type: 'triangle', delay: i * 0.07, vol: 0.1 })),
    star: (i) => {
      tone(880 + i * 220, 0.3, { vol: 0.12 });
      tone(1320 + i * 220, 0.25, { type: 'triangle', delay: 0.05, vol: 0.06 });
    },
    fanfare: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i === 3 ? 0.5 : 0.16, { type: 'square', vol: 0.045, delay: i * 0.13 })),
    unlock: () => [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.18, { type: 'triangle', delay: i * 0.06, vol: 0.08 })),
    click: () => tone(500, 0.05, { type: 'triangle', vol: 0.06 }),
    boing: () => tone(300, 0.25, { type: 'sine', vol: 0.1, slide: 600 })
  };

  // Voice
  const hasSpeech = 'speechSynthesis' in window;
  let voice = null;
  function pickVoice() {
    if (!hasSpeech) return;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return;
    const norm = (v) => (v.lang || '').replace('_', '-');
    for (const lang of ['en-CA', 'en-US', 'en-GB', 'en-AU']) {
      const v = voices.find((x) => norm(x) === lang);
      if (v) { voice = v; return; }
    }
    voice = voices.find((x) => norm(x).startsWith('en')) || null;
  }
  if (hasSpeech) {
    pickVoice();
    if (speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', pickVoice);
  }

  let sayTimer = null;
  function say(text) {
    if (!settings.voice || !hasSpeech || !text) return;
    try {
      speechSynthesis.cancel();
      clearTimeout(sayTimer);
      // Small delay: some browsers drop an utterance spoken right after cancel().
      sayTimer = setTimeout(() => {
        const u = new SpeechSynthesisUtterance(text);
        if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = 'en-US'; }
        u.rate = 0.92;
        u.pitch = 1.15;
        speechSynthesis.speak(u);
      }, 60);
    } catch (e) { /* speech is optional */ }
  }

  function stop() {
    clearTimeout(sayTimer);
    if (hasSpeech) { try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } }
  }

  TT.Audio = {
    sfx,
    say,
    stop,
    unlock: ensure,
    setSettings(s) {
      settings.voice = !!s.voice;
      settings.sound = !!s.sound;
      if (!settings.voice) stop();
    }
  };
})();
