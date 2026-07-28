import { useState } from 'react';
import { useNutrition } from '../context/NutritionContext';
import WaterTracker from './WaterTracker';

const MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
const MEAL_COLORS = { breakfast: 'bg-amber-50 border-amber-200', lunch: 'bg-green-50 border-green-200', dinner: 'bg-indigo-50 border-indigo-200', snack: 'bg-rose-50 border-rose-200' };

export default function MealPlanView() {
  const { mealPlan, generatePlan, regenerateMeal, isProfileComplete, mealFeedback, setMealLike } = useNutrition();
  const [selectedDay, setSelectedDay] = useState(0);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { generatePlan(); setGenerating(false); }, 600);
  };

  if (!isProfileComplete) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-bold text-warm-800">Meal Plan</h1><p className="text-warm-500 mt-1">Personalized 7-day meal plan</p></div>
        <button onClick={handleGenerate} disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition shadow-md shadow-primary-200 disabled:opacity-60">
          <svg className={`w-5 h-5 ${generating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {generating ? 'Generating...' : (mealPlan ? 'Regenerate' : 'Generate Weekly Plan')}
        </button>
      </div>

      {!mealPlan ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-warm-300">
          <span className="text-5xl mb-4">📋</span>
          <h3 className="text-xl font-semibold text-warm-800 mb-2">No meal plan yet</h3>
          <p className="text-warm-500 max-w-md">Click the button above to generate your personalized meal plan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {mealPlan.map((day, idx) => (
                <button key={day.day} onClick={() => setSelectedDay(idx)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium text-sm transition-all ${selectedDay === idx ? 'bg-primary-500 text-white shadow-md shadow-primary-200' : 'bg-white text-warm-600 border border-warm-200 hover:border-primary-300'}`}>
                  {day.day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {mealPlan[selectedDay] && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-warm-800">{mealPlan[selectedDay].day}</h3>
                <p className="text-xs text-warm-400">
                  {Object.values(mealPlan[selectedDay].meals).reduce((s, m) => s + (m.calories || 0), 0)} cal total
                </p>
              </div>

              {Object.entries(mealPlan[selectedDay].meals).map(([type, meal]) => (
                <div key={type} className={`rounded-2xl border-2 p-5 ${MEAL_COLORS[type]}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{MEAL_ICONS[type]}</span>
                      <div>
                        <p className="text-xs text-warm-500 uppercase font-medium">{type}</p>
                        <h4 className="font-semibold text-warm-800 text-lg">{meal.name}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setMealLike(meal.name, mealFeedback?.[meal.name] === 'like' ? null : 'like')}
                        className={`p-1.5 rounded-lg transition ${mealFeedback?.[meal.name] === 'like' ? 'text-green-500 bg-green-100' : 'text-warm-400 hover:text-green-500'}`}>
                        <svg className="w-4 h-4" fill={mealFeedback?.[meal.name] === 'like' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                      </button>
                      <button onClick={() => regenerateMeal(selectedDay, type)}
                        className="p-1.5 rounded-lg transition text-warm-400 hover:text-primary-600 hover:bg-white/60"
                        title="Regenerate this meal">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-white/70 rounded-lg text-xs font-medium text-warm-600">⏱ {meal.prepTime}</span>
                    <span className="px-2.5 py-1 bg-white/70 rounded-lg text-xs font-medium text-warm-600">🔥 {meal.calories} cal</span>
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">P {meal.protein}g</span>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">C {meal.carbs}g</span>
                    <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">F {meal.fats}g</span>
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">{meal.carbs * 4 + meal.protein * 4 + meal.fats * 9} cal</span>
                  </div>

                  <ol className="space-y-1.5 ml-1">
                    {meal.instructions.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-warm-700">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/70 flex items-center justify-center text-xs font-medium text-primary-600 mt-0.5">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}

          <WaterTracker />
        </div>
      )}
    </div>
  );
}
