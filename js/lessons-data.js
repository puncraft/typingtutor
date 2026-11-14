// Lesson content. Each line is typed in order; "say" is spoken and shown by Sparky.
(function () {
  'use strict';
  const TT = window.TT;

  TT.PLANETS = [
    { id: 'moon', name: 'Moon Base', row: 'Home row', lessons: [1, 2, 3, 4, 5, 6], trophy: 'trophy-moon', color: '#c9d1e6' },
    { id: 'turbo', name: 'Turbo Planet', row: 'Top row', lessons: [], color: '#ff8a3d' },
    { id: 'goal', name: 'Goal Planet', row: 'Bottom row', lessons: [], color: '#3ddc84' }
  ];

  TT.LESSONS = [
    {
      id: 1, planet: 'moon', title: 'F and J', newKeys: ['f', 'j'],
      intro: {
        text: 'Find the two keys with little bumps: F and J. Put your pointer fingers on the bumps. Rest your thumbs on the space bar.',
        say: "Hi space cadet! I'm Sparky. Let's learn our very first keys. Find the two keys with little bumps. They are F and J. Put your pointer fingers on the bumps, and rest your thumbs on the space bar."
      },
      lines: [
        { text: 'f f f f', say: 'Press F with your left pointer finger. Tap the space bar with your thumb.' },
        { text: 'f f f f' },
        { text: 'j j j j', say: 'Now J, with your right pointer finger.' },
        { text: 'j j j j' },
        { text: 'f j f j', say: 'Now switch back and forth.' },
        { text: 'j f j f' },
        { text: 'ff jj ff jj' },
        { text: 'fj fj fj fj' },
        { text: 'jf jf jf jf' },
        { text: 'fff jjj fff', say: 'Last one. You can do it!' }
      ]
    },
    {
      id: 2, planet: 'moon', title: 'D and K', newKeys: ['d', 'k'],
      intro: {
        text: 'D and K live right next to F and J. Press them with your middle fingers. Keep your pointer fingers on the bumps!',
        say: 'D and K live right next to F and J. Press them with your middle fingers. Keep your pointer fingers on the bumps!'
      },
      lines: [
        { text: 'd d d d', say: 'Press D with your left middle finger.' },
        { text: 'd d d d' },
        { text: 'k k k k', say: 'Press K with your right middle finger.' },
        { text: 'k k k k' },
        { text: 'd k d k' },
        { text: 'dd kk dd kk' },
        { text: 'fd fd jk jk', say: 'Now mix them with F and J.' },
        { text: 'dfd kjk dfd' },
        { text: 'fdk jkd fdk' },
        { text: 'dk fj dk fj' },
        { text: 'kkd ddk fjf', say: 'Last one!' }
      ]
    },
    {
      id: 3, planet: 'moon', title: 'S and L', newKeys: ['s', 'l'],
      intro: {
        text: 'S and L are next. Press them with your ring fingers. Those are the fingers next to your pinkies.',
        say: 'S and L are next. Press them with your ring fingers. Those are the fingers next to your pinkies.'
      },
      lines: [
        { text: 's s s s', say: 'Press S with your left ring finger.' },
        { text: 's s s s' },
        { text: 'l l l l', say: 'Press L with your right ring finger.' },
        { text: 'l l l l' },
        { text: 's l s l' },
        { text: 'ss ll ss ll' },
        { text: 'sd sd lk lk' },
        { text: 'sdf sdf jkl jkl', say: 'Like walking. S, D, F. J, K, L.' },
        { text: 'fds fds lkj lkj' },
        { text: 'sl dk fj' },
        { text: 'lsd kjs fld', say: 'Last one!' }
      ]
    },
    {
      id: 4, planet: 'moon', title: 'A and ;', newKeys: ['a', ';'],
      intro: {
        text: 'Your pinkies get a job too! The left pinky presses A. The right pinky presses the semicolon key. Now you can type real words!',
        say: 'Your pinkies get a job too! Your left pinky presses the letter A. Your right pinky presses the semicolon key. After this, you can type real words!'
      },
      lines: [
        { text: 'a a a a', say: 'Press the letter A with your left pinky.' },
        { text: 'a a a a' },
        { text: '; ; ; ;', say: 'This is the semicolon. Press it with your right pinky.' },
        { text: '; ; ; ;' },
        { text: 'a ; a ;' },
        { text: 'asdf asdf', say: 'All four left fingers.' },
        { text: 'jkl; jkl;', say: 'All four right fingers.' },
        { text: 'asdf jkl;' },
        { text: 'as as ad ad', say: 'Now some real words!' },
        { text: 'dad sad lad' },
        { text: 'ask add all' },
        { text: 'fall flask', say: 'Last one!' }
      ]
    },
    {
      id: 5, planet: 'moon', title: 'G and H', newKeys: ['g', 'h'],
      intro: {
        text: 'G and H are in the middle. Stretch your pointer fingers over to reach them, then bring them back to the bumps.',
        say: 'G and H are in the middle. Stretch your pointer fingers over to reach them. Then bring them back home to the bumps.'
      },
      lines: [
        { text: 'g g g g', say: 'Stretch your left pointer finger over to G.' },
        { text: 'g g g g' },
        { text: 'h h h h', say: 'Stretch your right pointer finger over to H.' },
        { text: 'h h h h' },
        { text: 'fg fg jh jh' },
        { text: 'fgf jhj fgf jhj' },
        { text: 'had has gas', say: 'Word time!' },
        { text: 'glad flag' },
        { text: 'dash half' },
        { text: 'hall glass' },
        { text: 'flash shall', say: 'Last one!' }
      ]
    },
    {
      id: 6, planet: 'moon', title: 'Home Row Review', newKeys: [],
      intro: {
        text: 'You know the whole home row! Let\'s put it all together. Finish this one to win the Moon Base trophy!',
        say: "Wow, you know the whole home row! Let's put it all together. Finish this one to win the Moon Base trophy!"
      },
      lines: [
        { text: 'asdfg hjkl;', say: 'The whole home row!' },
        { text: ';lkjh gfdsa', say: 'Now backwards!' },
        { text: 'a s d f g h j k l ;' },
        { text: 'dad has a flag', say: 'Now some sentences!' },
        { text: 'a sad lad' },
        { text: 'ask dad' },
        { text: 'half a salad' },
        { text: 'all fall' },
        { text: 'ha ha ha', say: 'Ha ha!' },
        { text: 'a glad lad has a flag', say: 'Last one. Win that trophy!' }
      ]
    }
  ];

  TT.lessonById = (id) => TT.LESSONS.find((l) => l.id === id) || null;

  // All keys learned up to and including this lesson (plus space).
  TT.knownKeys = function (lessonId) {
    const keys = new Set([' ']);
    TT.LESSONS.forEach((l) => {
      if (l.id <= lessonId) l.newKeys.forEach((k) => keys.add(k));
    });
    return keys;
  };
})();
