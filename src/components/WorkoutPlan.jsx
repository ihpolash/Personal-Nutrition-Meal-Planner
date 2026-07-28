import { useState } from 'react';
import { useNutrition } from '../context/NutritionContext';
import { estimateWorkoutBurn } from '../utils/calorieCalculator';
import ExerciseDetail from './ExerciseDetail';
import WorkoutSession from './WorkoutSession';

const MUSCLE_ICONS = { chest: '🏋️', shoulders: '🏋️', triceps: '💪', back: '🔙', biceps: '💪', legs: '🦵', core: '🧘', cardio: '❤️' };

const EXERCISE_MUSCLE_MAP = {
  'Barbell Bench Press': 'chest', 'Dumbbell Flyes': 'chest', 'Incline Dumbbell Press': 'chest',
  'Push-ups': 'chest', 'Cable Crossover': 'chest',
  'Overhead Dumbbell Press': 'shoulders', 'Lateral Raises': 'shoulders', 'Front Raises': 'shoulders', 'Face Pulls': 'shoulders',
  'Tricep Pushdown': 'triceps', 'Overhead Tricep Extension': 'triceps', 'Close-Grip Bench Press': 'triceps',
  'Deadlifts': 'back', 'Pull-ups / Lat Pulldown': 'back', 'Bent Over Rows': 'back', 'Seated Cable Rows': 'back', 'Dumbbell Rows': 'back',
  'Barbell Curls': 'biceps', 'Dumbbell Hammer Curls': 'biceps', 'Preacher Curls': 'biceps',
  'Barbell Squats': 'legs', 'Romanian Deadlifts': 'legs', 'Leg Press': 'legs', 'Walking Lunges': 'legs',
  'Leg Extensions': 'legs', 'Leg Curls': 'legs', 'Calf Raises': 'legs',
  'Plank': 'core', 'Cable Crunches': 'core', 'Hanging Leg Raises': 'core', 'Russian Twists': 'core', 'Ab Wheel Rollouts': 'core',
};

export default function WorkoutPlan() {
  const { workoutPlan, generateWorkout, workoutLog, toggleWorkoutDay, logWorkoutBurn } = useNutrition();
  const [gen, setGen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [session, setSession] = useState(null);

  const handleGenerate = () => {
    setGen(true);
    setTimeout(() => { generateWorkout(); setGen(false); }, 400);
  };

  if (!workoutPlan) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold text-warm-800">Workout Plan</h1><p className="text-warm-500 mt-1">Weekly gym schedule tailored to your goal</p></div>
          <button onClick={handleGenerate} disabled={gen}
            className="flex items-center gap-2 px-5 py-2.5 bg-warm-800 text-white rounded-xl font-medium hover:bg-warm-900 transition shadow-sm disabled:opacity-60">
            <svg className={`w-5 h-5 ${gen ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {gen ? 'Creating...' : 'Generate Plan'}
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-warm-300">
          <span className="text-5xl mb-4">💪</span>
          <h3 className="text-xl font-semibold text-warm-800 mb-2">No workout plan yet</h3>
          <p className="text-warm-500 max-w-md">Generate a personalized weekly workout plan based on your fitness goal.</p>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const todayLog = workoutLog[today] || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-bold text-warm-800">Workout Plan</h1><p className="text-warm-500 mt-1">Weekly gym schedule — tap any exercise to see details</p></div>
        <button onClick={handleGenerate} disabled={gen}
          className="flex items-center gap-2 px-5 py-2.5 bg-warm-800 text-white rounded-xl font-medium hover:bg-warm-900 transition shadow-sm disabled:opacity-60">
          <svg className={`w-5 h-5 ${gen ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          {gen ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>

      <div className="space-y-4">
        {workoutPlan.map((day) => {
          const isToday = day.day === new Date().toLocaleDateString('en-US', { weekday: 'long' });
          const completed = todayLog.includes(day.name);
          const isRest = day.muscles.length === 0;

          const handleToggle = () => {
            toggleWorkoutDay(day.name, today);
            if (!completed) {
              const burn = estimateWorkoutBurn(day.totalTime, day.muscles.includes('cardio') ? 'high' : 'moderate');
              logWorkoutBurn(today, burn);
            }
          };

          return (
            <div key={day.day} className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all ${isToday ? 'border-primary-300 ring-2 ring-primary-100' : completed ? 'border-primary-200' : 'border-warm-200'} ${completed ? 'bg-primary-50/50' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button onClick={handleToggle}
                    className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition ${completed ? 'bg-primary-500 border-primary-500' : 'border-warm-300 hover:border-primary-400'}`}>
                    {completed && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-warm-500 font-medium">{day.day}</p>
                      {isToday && <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">Today</span>}
                      {completed && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Done ✓</span>}
                    </div>
                    <h3 className={`font-semibold text-warm-800 ${completed ? 'line-through text-warm-400' : ''}`}>{day.name}</h3>
                    <p className="text-xs text-warm-500 capitalize">{day.focus}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!isRest && (
                    <button onClick={() => setSession({ day, exercises: day.exercises, dayName: `${day.day} - ${day.name}` })}
                      className="px-3 py-1.5 bg-primary-500 text-white rounded-lg text-xs font-medium hover:bg-primary-600 transition shadow-sm flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                      Train
                    </button>
                  )}
                  <div className="text-right text-xs text-warm-500">
                    <p className="font-medium">{day.totalTime} min</p>
                    <p>🔥 ~{day.totalCalBurn} cal</p>
                  </div>
                </div>
              </div>

              {!isRest && (
                <div className="mt-3 pt-3 border-t border-warm-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {day.exercises.map((ex, i) => (
                      <button key={i} onClick={() => setSelectedExercise(ex.name)}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-warm-50 hover:bg-primary-50 hover:border-primary-200 border-2 border-transparent transition-all text-left group cursor-pointer">
                        <span className="text-lg group-hover:scale-110 transition-transform">
                          {MUSCLE_ICONS[EXERCISE_MUSCLE_MAP[ex.name]] || '🏋️'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-warm-800 group-hover:text-primary-700 transition-colors truncate">
                            {ex.name}
                          </p>
                          <p className="text-xs text-warm-500">
                            {ex.sets ? `${ex.sets}×${ex.reps} · rest ${ex.rest}` : ex.duration ? ex.duration : ''}
                          </p>
                        </div>
                        <svg className="w-4 h-4 text-warm-300 group-hover:text-primary-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isRest && (
                <div className="flex items-center gap-3 mt-2 pt-3 border-t border-warm-200 text-warm-500">
                  <span className="text-2xl">😌</span>
                  <div>
                    <p className="text-sm font-medium text-warm-600">Rest and recovery day.</p>
                    <p className="text-xs text-warm-400">Light stretching and mobility work recommended.</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedExercise && (
        <ExerciseDetail
          exerciseName={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onStart={() => {
            const day = workoutPlan.find(d => d.exercises?.some(e => e.name === selectedExercise));
            if (day) setSession({ day, exercises: day.exercises, dayName: `${day.day} - ${day.name}` });
          }}
        />
      )}

      {session && (
        <WorkoutSession
          workoutDay={session.day}
          exercises={session.exercises}
          dayName={session.dayName}
          totalCalBurn={session.day.totalCalBurn}
          onClose={() => setSession(null)}
          onComplete={() => {
            toggleWorkoutDay(session.day.name, today);
            logWorkoutBurn(today, session.day.totalCalBurn);
          }}
        />
      )}
    </div>
  );
}
