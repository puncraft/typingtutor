# Typing Tutor Plan: "Space Cadet Typing" (working title)

A free, static typing tutor for a grade 1-2 kid. One central space theme: the kid is a space cadet with a launch pad that grows as he learns. Cars/trucks and soccer are folded in as places he unlocks (a moon truck garage and a low-gravity soccer stadium).

Hosting: separate GitHub repo `typingtutor` with Pages enabled, served at puncraft.ca/typingtutor. No server, no accounts, no build step.

## 1. Core principles

- Accuracy first, speed never required. Stars are based on accuracy.
- Unlocks never make the typing easier. Abilities reward good typing (streaks), plus a couple of small safety nets in mini-games only.
- Short sessions: lessons about 3 minutes, game rounds about 1-2 minutes.
- Mini-games only use keys the kid has already learned.
- Every attempt earns something (crystals), so no attempt feels wasted.
- No punishing streaks, no timers that cause FOMO, no random loot boxes.
- Readable without reading: big visuals, spoken instructions (with mute).

## 2. The hub: Launch Pad

The home screen. Everything comes back here.

- A rocket on the launch pad, built from parts that appear as lessons are completed.
- Buildings that appear when unlocked: Truck Garage, Space Stadium, Observatory (star map), Shop.
- The pet alien sidekick (unlocked early) waves and cheers.
- A star map showing the three planets (keyboard rows) and the final mission.
- Crystal counter and trophy shelf.

## 3. Lessons (version 1: letters only, 19 lessons)

### Planet 1: Moon Base (home row)
1. F and J (finding the bumps, pointer fingers, space bar with thumbs)
2. D and K
3. S and L
4. A and ; (semicolon matched by physical key position, so keyboard layout does not matter)
5. G and H (pointer fingers stretch)
6. Home Row Review (words: dad, sad, ask, lad, fall, glad, hall, flask)

### Planet 2: Turbo Planet (top row)
7. E and I
8. R and U
9. T and Y
10. W and O
11. Q and P
12. Top Row Review (words using everything so far: the, red, jet, kid, fast, rocket)

### Planet 3: Goal Planet (bottom row)
13. V and M
14. B and N
15. C and comma
16. X and period
17. Z
18. Bottom Row Review

### Final Mission
19. Grand Tour: all letters, short words and tiny sentences ("the red truck is fast")

Shift, numbers and other punctuation are left for a later version.

### Lesson structure (each lesson)
1. Intro: the robot guide shows the new key, which finger presses it (hand diagram with coloured fingers), and says it out loud.
2. Warm-up: the new keys alone (fff jjj fjfj).
3. Mix: new keys mixed with keys learned before.
4. Words: real short words when the known letters allow it.

During typing:
- The on-screen keyboard lights up the next key, coloured by finger.
- A wrong key gives a soft "boop", shows the correct finger, and does not advance. No backspace needed.
- Caps Lock warning if it is on (letters are compared lowercase anyway).

### Stars per lesson
- 1 star: finished
- 2 stars: 90% accuracy or better
- 3 stars: 97% accuracy or better
- The next lesson unlocks with 1 star. Replaying to get more stars is optional and earns crystals.

## 4. Unlocks (what each step gives)

| After | Unlock |
|-------|--------|
| Lesson 1 | Launch pad lights turn on, cadet helmet |
| Lesson 2 | Asteroid Blaster mini-game |
| Lesson 3 | Pet alien sidekick |
| Lesson 4 | Rocket fins |
| Lesson 5 | Rocket cockpit, Mega Laser ability in Asteroid Blaster |
| Lesson 6 (Planet 1 done) | Truck Garage + Moon Truck Rally mini-game, Moon Base trophy |
| Lesson 7 | Truck paint shop |
| Lesson 8 | Turbo Boost ability (Rally) |
| Lesson 9 | Rocket boosters |
| Lesson 10 | Shield ability (Asteroid Blaster) |
| Lesson 11 | Monster truck wheels |
| Lesson 12 (Planet 2 done) | Space Stadium + Space Soccer mini-game, Turbo Planet trophy |
| Lesson 13 | Team jersey colours |
| Lesson 14 | Power Kick ability (Soccer) |
| Lesson 15 | Rocket nose cone |
| Lesson 16 | Pit Stop ability (Rally) |
| Lesson 17 | Observatory telescope (shows the whole star map lit up) |
| Lesson 18 (Planet 3 done) | Rocket fully built, Goal Planet trophy |
| Lesson 19 | Rocket launch animation, Space Cadet Graduate trophy + certificate (printable) |

## 5. Mini-games

All use only learned keys, get gently faster as more keys are learned, and ease off if the kid is struggling (several misses in a row).

### Asteroid Blaster (unlocked after lesson 2)
Letters on asteroids drift down toward the rocket. Type the letter to zap it.
- Mega Laser: a perfect streak of 8 clears the screen.
- Shield: blocks one hit per round.

### Moon Truck Rally (unlocked after Planet 1)
Race 2 CPU trucks across the moon. Each correct key moves your truck forward. Short words later on.
- Turbo Boost: 5 correct in a row gives a flame burst.
- Pit Stop: one free mistake per race.
- Uses the truck the kid painted and upgraded.

### Space Soccer (unlocked after Planet 2)
Penalty shootout in low gravity. A letter or short word appears on the ball; type it before the goalie dives.
- Power Kick: a streak makes a curving super-shot the goalie cannot stop.
- Uses the kid's jersey colours.

Games earn crystals based on score. No game is required to progress through lessons.

## 6. Rewards and economy

- Crystals: earned from lessons (more for more stars) and games. Spent in the Shop.
- Shop (cosmetic only): rocket paint colours, truck decals, helmet styles, alien sidekick hats, stadium banner.
- Trophies: one per planet, graduation trophy, plus a few fun ones (first 3-star lesson, 50 asteroids zapped, first hat-trick in soccer).
- Prices tuned so something is affordable after every 1-2 sessions.

## 7. Sound and voice

- Spoken instructions using the browser's built-in voice (Web Speech API): "Put your pointer fingers on the bumps", "Press F with your left pointer finger".
- Sound effects made in code (Web Audio API): key click, soft boop for a miss, zaps, engine, crowd cheer, fanfare. No audio files needed.
- Mute buttons for voice and sound, saved per profile.

## 8. Profiles and saving

- Simple profiles: name + pick an avatar colour. Supports siblings on one computer.
- Saved in localStorage under a single key `typingtutor:v1` (prefixed so it never clashes with other pages on puncraft.ca such as gravitywheel).
- Saved data: lesson stars, best accuracy, unlocks, crystals, owned/equipped cosmetics, trophies, settings.
- Export progress (downloads a small .json file) and Import progress, for backup or moving to another computer.
- Grown-up page (behind a simple "hold the button for 3 seconds" gate): see progress per lesson, reset profile, export/import.

## 9. Technical design

- Plain HTML, CSS and JavaScript. No frameworks, no build step, no external libraries.
- Plain `<script>` tags (not ES modules) so it also works when index.html is double-clicked locally, not just on GitHub Pages.
- Single page app (`index.html`) with screens swapped by JavaScript and a hash in the URL (#hub, #lesson/3, #game/rally).
- Art drawn with inline SVG and CSS so it is crisp at any size, works offline, and has no image licensing questions. All characters and art original.
- Physical keyboard required (desktop or laptop). Show a friendly message on phones/tablets.
- Large layout aimed at a laptop screen; works in Chrome, Edge, Firefox, Safari.

### File structure

```
typingtutor/
  index.html
  css/
    style.css
  js/
    storage.js      profiles, save/load, export/import
    audio.js        sound effects and voice
    keyboard.js     on-screen keyboard, finger colours, hand diagram
    lessons-data.js lesson definitions (keys, drills, words)
    lesson.js       lesson engine (typing, accuracy, stars)
    unlocks.js      unlock table, crystals, shop items, trophies
    hub.js          launch pad screen and star map
    shop.js
    grownups.js
    games/
      asteroids.js
      rally.js
      soccer.js
    app.js          screen routing and startup
  art/              (optional) any SVG files that get too big to inline
  PLAN.md
  README.md
```

## 10. Build phases

1. Foundation: storage + profiles, audio/voice, on-screen keyboard with finger colours, lesson engine, Planet 1 lessons (1-6), basic launch pad hub. Goal: something the kid can try within the first build.
2. Fun layer: Asteroid Blaster, unlock system, crystals, rocket parts appearing on the pad, alien sidekick.
3. Planet 2: lessons 7-12, Truck Garage, Moon Truck Rally, paint shop.
4. Planet 3: lessons 13-18, Space Stadium, Space Soccer.
5. Finale and polish: lesson 19, launch animation, printable certificate, Shop, trophies, grown-up page, export/import.
6. Publish: create GitHub repo, enable Pages, check puncraft.ca/typingtutor.

After phase 1, test with the kid and adjust difficulty, voice lines and pacing before building more.

## 11. Later ideas (not in version 1)

- Shift key and capital letters, numbers row, basic punctuation.
- More mini-games (rocket launch countdown words, rover delivery).
- Bilingual mode (French words) since it is Canada.
- Seasonal cosmetics.
