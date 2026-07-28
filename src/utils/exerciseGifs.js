const BASE = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0';

const EXERCISE_GIF_MAP = {
  'Barbell Bench Press': `${BASE}/pectorals/barbell-bench-press.gif`,
  'Dumbbell Flyes': `${BASE}/pectorals/dumbbell-fly.gif`,
  'Incline Dumbbell Press': `${BASE}/pectorals/dumbbell-incline-press-on-exercise-ball.gif`,
  'Push-ups': `${BASE}/pectorals/push-up.gif`,
  'Cable Crossover': `${BASE}/pectorals/cable-cross-over-variation.gif`,
  'Overhead Dumbbell Press': `${BASE}/delts/dumbbell-standing-overhead-press.gif`,
  'Lateral Raises': `${BASE}/delts/dumbbell-lateral-raise.gif`,
  'Front Raises': `${BASE}/delts/dumbbell-front-raise.gif`,
  'Face Pulls': `${BASE}/delts/dumbbell-lateral-raise.gif`,
  'Tricep Pushdown': `${BASE}/triceps/cable-triceps-pushdown-v-bar.gif`,
  'Overhead Tricep Extension': `${BASE}/triceps/dumbbell-lying-triceps-extension.gif`,
  'Close-Grip Bench Press': `${BASE}/pectorals/barbell-bench-press.gif`,
  'Deadlifts': `${BASE}/glutes/barbell-deadlift.gif`,
  'Pull-ups / Lat Pulldown': `${BASE}/lats/pull-up.gif`,
  'Bent Over Rows': `${BASE}/upper-back/barbell-bent-over-row.gif`,
  'Seated Cable Rows': `${BASE}/upper-back/cable-seated-row.gif`,
  'Dumbbell Rows': `${BASE}/upper-back/dumbbell-bent-over-row.gif`,
  'Barbell Curls': `${BASE}/biceps/barbell-curl.gif`,
  'Dumbbell Hammer Curls': `${BASE}/biceps/dumbbell-hammer-curl.gif`,
  'Preacher Curls': `${BASE}/biceps/barbell-preacher-curl.gif`,
  'Barbell Squats': `${BASE}/glutes/barbell-full-squat.gif`,
  'Romanian Deadlifts': `${BASE}/glutes/barbell-romanian-deadlift.gif`,
  'Leg Press': `${BASE}/glutes/barbell-full-squat.gif`,
  'Walking Lunges': `${BASE}/glutes/walking-lunge.gif`,
  'Leg Extensions': `${BASE}/quads/lever-leg-extension.gif`,
  'Leg Curls': `${BASE}/hamstrings/lever-lying-leg-curl.gif`,
  'Calf Raises': `${BASE}/calves/standing-calf-raise-on-a-staircase.gif`,
  'Plank': `${BASE}/abs/bodyweight-incline-side-plank.gif`,
  'Cable Crunches': `${BASE}/abs/cable-kneeling-crunch.gif`,
  'Hanging Leg Raises': `${BASE}/abs/hanging-leg-raise.gif`,
  'Russian Twists': `${BASE}/abs/russian-twist.gif`,
  'Ab Wheel Rollouts': `${BASE}/abs/barbell-standing-ab-rollerout.gif`,
  'Treadmill Running': `${BASE}/cardio/stationary-bike-run-v-3.gif`,
  'Cycling': `${BASE}/cardio/stationary-bike-run-v-3.gif`,
  'Jump Rope': `${BASE}/cardio/jump-rope.gif`,
  'Rowing Machine': `${BASE}/upper-back/cable-seated-row.gif`,
  'HIIT Circuit': `${BASE}/cardio/jump-rope.gif`,
};

export function getExerciseGifUrl(exerciseName) {
  return EXERCISE_GIF_MAP[exerciseName] || `${BASE}/cardio/jump-rope.gif`;
}

export default EXERCISE_GIF_MAP;
