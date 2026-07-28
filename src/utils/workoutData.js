const EXERCISES = {
  chest: [
    { name: 'Barbell Bench Press', sets: 4, reps: '8-12', rest: '90s', calPerMin: 6 },
    { name: 'Dumbbell Flyes', sets: 3, reps: '10-15', rest: '60s', calPerMin: 5 },
    { name: 'Incline Dumbbell Press', sets: 4, reps: '8-12', rest: '90s', calPerMin: 6 },
    { name: 'Push-ups', sets: 3, reps: '15-20', rest: '45s', calPerMin: 7 },
    { name: 'Cable Crossover', sets: 3, reps: '12-15', rest: '60s', calPerMin: 5 },
  ],
  shoulders: [
    { name: 'Overhead Dumbbell Press', sets: 4, reps: '8-12', rest: '90s', calPerMin: 6 },
    { name: 'Lateral Raises', sets: 4, reps: '12-15', rest: '45s', calPerMin: 4 },
    { name: 'Front Raises', sets: 3, reps: '12-15', rest: '45s', calPerMin: 4 },
    { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '45s', calPerMin: 5 },
  ],
  triceps: [
    { name: 'Tricep Pushdown', sets: 3, reps: '10-15', rest: '60s', calPerMin: 4 },
    { name: 'Overhead Tricep Extension', sets: 3, reps: '10-15', rest: '60s', calPerMin: 4 },
    { name: 'Close-Grip Bench Press', sets: 3, reps: '8-12', rest: '90s', calPerMin: 6 },
  ],
  back: [
    { name: 'Deadlifts', sets: 4, reps: '6-10', rest: '120s', calPerMin: 8 },
    { name: 'Pull-ups / Lat Pulldown', sets: 4, reps: '8-12', rest: '90s', calPerMin: 7 },
    { name: 'Bent Over Rows', sets: 4, reps: '8-12', rest: '90s', calPerMin: 6 },
    { name: 'Seated Cable Rows', sets: 3, reps: '10-15', rest: '60s', calPerMin: 5 },
    { name: 'Dumbbell Rows', sets: 3, reps: '10-12', rest: '60s', calPerMin: 6 },
  ],
  biceps: [
    { name: 'Barbell Curls', sets: 3, reps: '10-12', rest: '60s', calPerMin: 4 },
    { name: 'Dumbbell Hammer Curls', sets: 3, reps: '10-15', rest: '60s', calPerMin: 4 },
    { name: 'Preacher Curls', sets: 3, reps: '10-12', rest: '60s', calPerMin: 4 },
  ],
  legs: [
    { name: 'Barbell Squats', sets: 4, reps: '8-12', rest: '120s', calPerMin: 8 },
    { name: 'Romanian Deadlifts', sets: 4, reps: '10-12', rest: '90s', calPerMin: 7 },
    { name: 'Leg Press', sets: 4, reps: '10-15', rest: '90s', calPerMin: 6 },
    { name: 'Walking Lunges', sets: 3, reps: '12-15/leg', rest: '60s', calPerMin: 7 },
    { name: 'Leg Extensions', sets: 3, reps: '12-15', rest: '45s', calPerMin: 5 },
    { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '45s', calPerMin: 5 },
    { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '45s', calPerMin: 3 },
  ],
  core: [
    { name: 'Plank', sets: 3, reps: '45-60s', rest: '30s', calPerMin: 3 },
    { name: 'Cable Crunches', sets: 3, reps: '15-20', rest: '45s', calPerMin: 4 },
    { name: 'Hanging Leg Raises', sets: 3, reps: '10-15', rest: '45s', calPerMin: 5 },
    { name: 'Russian Twists', sets: 3, reps: '20-30', rest: '30s', calPerMin: 4 },
    { name: 'Ab Wheel Rollouts', sets: 3, reps: '10-15', rest: '45s', calPerMin: 5 },
  ],
  cardio: [
    { name: 'Treadmill Running', duration: '20 min', calPerMin: 10, intensity: 'high' },
    { name: 'Cycling', duration: '25 min', calPerMin: 8, intensity: 'moderate' },
    { name: 'Jump Rope', duration: '15 min', calPerMin: 12, intensity: 'veryHigh' },
    { name: 'Rowing Machine', duration: '20 min', calPerMin: 9, intensity: 'high' },
    { name: 'HIIT Circuit', duration: '20 min', calPerMin: 11, intensity: 'veryHigh' },
  ],
};

const WORKOUT_SPLITS = {
  'lose-weight': [
    { day: 'Monday', name: 'Full Body + Cardio', muscles: ['chest', 'back', 'legs', 'cardio'], focus: 'strength & fat burn' },
    { day: 'Tuesday', name: 'HIIT & Core', muscles: ['cardio', 'core'], focus: 'fat loss' },
    { day: 'Wednesday', name: 'Upper Body', muscles: ['chest', 'shoulders', 'back', 'biceps', 'triceps'], focus: 'strength' },
    { day: 'Thursday', name: 'Cardio & Conditioning', muscles: ['cardio'], focus: 'endurance' },
    { day: 'Friday', name: 'Lower Body', muscles: ['legs', 'core'], focus: 'strength' },
    { day: 'Saturday', name: 'Active Recovery', muscles: ['cardio'], focus: 'light cardio, stretching' },
    { day: 'Sunday', name: 'Rest Day', muscles: [], focus: 'recovery' },
  ],
  maintain: [
    { day: 'Monday', name: 'Push Day', muscles: ['chest', 'shoulders', 'triceps'], focus: 'strength' },
    { day: 'Tuesday', name: 'Pull Day', muscles: ['back', 'biceps'], focus: 'strength' },
    { day: 'Wednesday', name: 'Leg Day', muscles: ['legs'], focus: 'strength' },
    { day: 'Thursday', name: 'Core & Cardio', muscles: ['core', 'cardio'], focus: 'conditioning' },
    { day: 'Friday', name: 'Full Body', muscles: ['chest', 'back', 'legs', 'core'], focus: 'functional' },
    { day: 'Saturday', name: 'Cardio', muscles: ['cardio'], focus: 'endurance' },
    { day: 'Sunday', name: 'Rest Day', muscles: [], focus: 'recovery' },
  ],
  'gain-muscle': [
    { day: 'Monday', name: 'Chest & Triceps', muscles: ['chest', 'triceps'], focus: 'hypertrophy' },
    { day: 'Tuesday', name: 'Back & Biceps', muscles: ['back', 'biceps'], focus: 'hypertrophy' },
    { day: 'Wednesday', name: 'Leg Day', muscles: ['legs'], focus: 'strength & size' },
    { day: 'Thursday', name: 'Shoulders & Core', muscles: ['shoulders', 'core'], focus: 'hypertrophy' },
    { day: 'Friday', name: 'Full Body Power', muscles: ['chest', 'back', 'legs', 'shoulders'], focus: 'strength' },
    { day: 'Saturday', name: 'Arms & Abs', muscles: ['biceps', 'triceps', 'core'], focus: 'hypertrophy' },
    { day: 'Sunday', name: 'Rest Day', muscles: [], focus: 'recovery' },
  ],
};

function pickExercises(muscleGroup, count = 3) {
  const pool = EXERCISES[muscleGroup] || [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function generateWorkoutPlan(goal) {
  const split = WORKOUT_SPLITS[goal] || WORKOUT_SPLITS.maintain;
  return split.map(weekDay => {
    const exercises = weekDay.muscles.flatMap(muscle => {
      const count = muscle === 'cardio' ? 1 : (muscle === 'core' ? 2 : 3);
      return pickExercises(muscle, count);
    });
    const totalTime = exercises.reduce((sum, ex) => {
      if (ex.duration) return sum + parseInt(ex.duration) + 120;
      return sum + (ex.sets * (30 + parseInt(ex.rest) || 60));
    }, 0);
    const totalCalBurn = exercises.reduce((sum, ex) => {
      const mins = ex.duration ? parseInt(ex.duration) : ex.sets * 1.5;
      return sum + Math.round(ex.calPerMin * mins);
    }, 0);
    return { ...weekDay, exercises, totalTime: Math.round(totalTime / 60), totalCalBurn };
  });
}
