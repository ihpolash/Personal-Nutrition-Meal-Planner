const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;

function ensureCtx() {
  if (audioCtx?.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, start, duration, gain = 0.2, type = 'sine') {
  const ctx = ensureCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration);
}

export function playCountdown(secondsLeft) {
  if (secondsLeft > 3) return;
  const t = audioCtx?.currentTime || performance.now() / 1000;
  const pitch = secondsLeft === 0 ? 1000 : 700 + (3 - secondsLeft) * 100;
  const dur = secondsLeft === 0 ? 0.25 : 0.12;
  tone(pitch, t + 0.05, dur, 0.25, secondsLeft === 0 ? 'triangle' : 'sine');
}

export function playBeep(freq = 800, duration = 0.15) {
  const t = audioCtx?.currentTime || performance.now() / 1000;
  tone(freq, t + 0.05, duration, 0.2);
}

export function playStartChime() {
  const t = audioCtx?.currentTime || performance.now() / 1000;
  tone(523, t + 0.05, 0.15, 0.25, 'triangle');
  tone(659, t + 0.2, 0.15, 0.25, 'triangle');
  tone(784, t + 0.35, 0.3, 0.3, 'triangle');
}

export function playEndChime() {
  const t = audioCtx?.currentTime || performance.now() / 1000;
  tone(784, t + 0.05, 0.2, 0.25, 'triangle');
  tone(659, t + 0.25, 0.2, 0.25, 'triangle');
  tone(523, t + 0.45, 0.4, 0.3, 'triangle');
}

export function playRestChime() {
  const t = audioCtx?.currentTime || performance.now() / 1000;
  tone(440, t + 0.05, 0.2, 0.2, 'sine');
  tone(550, t + 0.25, 0.2, 0.2, 'sine');
}

export function playCount(number) {
  const t = audioCtx?.currentTime || performance.now() / 1000;
  const freq = 300 + number * 60;
  tone(freq, t + 0.05, 0.15, 0.12, 'sine');
}

export function playCoachCue(word) {
  const t = audioCtx?.currentTime || performance.now() / 1000;
  const words = {
    go: [660, 880],
    push: [300, 400],
    pull: [400, 300],
    drive: [500, 700],
    hold: [440, 440],
    rest: [350, 450],
    breathe: [330, 440],
    up: [660, 880],
    down: [440, 330],
  };
  const freq = words[word] || [500, 600];
  tone(freq[0], t + 0.05, 0.12, 0.15, 'triangle');
  tone(freq[1], t + 0.2, 0.12, 0.15, 'triangle');
}

export function getCoachPhrases(exerciseName) {
  const phrases = {
    'Barbell Bench Press': ['"Chest up, shoulders back"', '"Drive through your heels"', '"Touch mid-chest"', '"Press explosively!"'],
    'Barbell Squats': ['"Chest up, back tight"', '"Push knees out"', '"Go below parallel"', '"Drive up through heels"'],
    'Deadlifts': ['"Pull the slack out"', '"Keep back flat"', '"Drive hips forward"', '"Bar stays close"'],
    'Push-ups': ['"Body straight as a board"', '"Elbows at 45°"', '"Chest to floor"', '"Push through palms"'],
    'Pull-ups / Lat Pulldown': ['"Squeeze shoulder blades"', '"Pull to your chest"', '"Control the descent"', '"Full range of motion"'],
    'Overhead Dumbbell Press': ['"Brace your core"', '"Press straight up"', '"Don\'t arch your back"', '"Lock out at top"'],
    'Barbell Curls': ['"Elbows pinned to sides"', '"Squeeze at the top"', '"Lower slowly"', '"No swinging!"'],
    'Plank': ['"Body in straight line"', '"Squeeze glutes"', '"Breathe steadily"', '"Push floor away"'],
  };
  return phrases[exerciseName] || ['"Focus on form"', '"Control the movement"', '"Breathe steadily"', '"You got this!"'];
}
