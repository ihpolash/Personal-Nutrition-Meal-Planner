import { useState, useMemo } from 'react';
import { useNutrition } from '../context/NutritionContext';
import { CalorieRing, MacroBars } from './ProgressRing';
import { getTargetWeight, forecastDays } from '../utils/goalForecast';

function TrendArrow({ value }) {
  if (value > 0) return <span className="text-green-500">↑ +{value}</span>;
  if (value < 0) return <span className="text-red-500">↓ {value}</span>;
  return <span className="text-warm-400">→ 0</span>;
}

export default function Dashboard() {
  const { profile, nutritionData, checkedMeals, mealPlan, workoutLog, weightLog, waterIntake, dailyBurn, foodLog, setView } = useNutrition();
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const { logWeight } = useNutrition();

  if (!nutritionData) return null;

  const { targetCalories, macros, goalLabel, bmr, tdee, weightKg } = nutritionData;
  const targetWeight = getTargetWeight(profile);
  const today = new Date().toISOString().split('T')[0];
  const todayFoodLog = foodLog?.[today] || [];
  const todayWorkouts = workoutLog[today] || [];
  const todayWater = waterIntake[today] || 0;
  const todayBurn = dailyBurn[today] || { workout: 0, activity: 0 };
  const lastWeight = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : null;
  const startWeight = weightLog.length > 0 ? weightLog[0].weight : weightKg;

  const consumed = useMemo(() => {
    const c = { protein: 0, carbs: 0, fats: 0, calories: 0 };
    if (mealPlan) {
      Object.entries(checkedMeals || {}).forEach(([key, checked]) => {
        if (!checked) return;
        const [di, mt] = key.split('-');
        const meal = mealPlan[Number(di)]?.meals[mt];
        if (meal) { c.protein += meal.protein || 0; c.carbs += meal.carbs || 0; c.fats += meal.fats || 0; c.calories += meal.calories || 0; }
      });
    }
    (foodLog?.[today] || []).forEach(e => {
      if (!e.taken) return;
      const m = Number(e.qty) || 1;
      c.protein += (e.protein || 0) * m;
      c.carbs += (e.carbs || 0) * m;
      c.fats += (e.fat || 0) * m;
      c.calories += (e.calories || 0) * m;
    });
    return c;
  }, [mealPlan, checkedMeals, foodLog, today]);

  const totalBurn = bmr + (todayBurn.workout || 0) + (todayBurn.activity || 0);
  const forecast = forecastDays(profile, nutritionData, todayBurn.workout + todayBurn.activity, consumed.calories);
  const daysToShow = Math.min(weightLog.length, 7);
  const weeklyTrend = daysToShow >= 2 ? ((weightLog[weightLog.length - 1]?.weight || weightKg) - (weightLog[Math.max(0, weightLog.length - daysToShow)]?.weight || weightKg)) : 0;

  const handleLogWeight = () => {
    if (weightInput) { logWeight(Number(weightInput)); setWeightInput(''); setShowWeightInput(false); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-warm-800">Dashboard</h1>
          <p className="text-sm text-warm-500">{goalLabel} · {profile.age}y · {profile.weightKg}{profile.weightUnit}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('mealplan')} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition shadow-sm">Meal Plan</button>
          <button onClick={() => setView('workout')} className="px-4 py-2 bg-warm-800 text-white rounded-xl text-sm font-medium hover:bg-warm-900 transition shadow-sm">Workout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-warm-200">
          <h3 className="text-sm font-semibold text-warm-800 mb-3 text-center">Daily Calorie Balance</h3>
          <CalorieRing consumed={consumed.calories} burned={totalBurn} target={targetCalories} />
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-primary-50 p-2 rounded-lg"><p className="font-bold text-primary-700">{targetCalories}</p><p className="text-warm-500">Target</p></div>
            <div className="bg-amber-50 p-2 rounded-lg"><p className="font-bold text-amber-700">{consumed.calories}</p><p className="text-warm-500">Eaten</p></div>
            <div className="bg-red-50 p-2 rounded-lg"><p className="font-bold text-red-700">{totalBurn}</p><p className="text-warm-500">Burned</p></div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-warm-200">
          <h3 className="text-sm font-semibold text-warm-800 mb-3">Today's Macronutrients</h3>
          <MacroBars consumed={consumed} targets={macros} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-warm-200">
          <p className="text-xs text-warm-500 uppercase tracking-wide font-medium">Goal Weight</p>
          <p className="text-2xl font-bold text-warm-800 mt-1">{targetWeight} kg</p>
          <p className="text-xs text-warm-400">from {weightKg} kg</p>
          {lastWeight && <p className="text-xs mt-1">Last: {lastWeight} kg <TrendArrow value={Math.round((lastWeight - weightKg) * 10) / 10} /></p>}
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-warm-200">
          <p className="text-xs text-warm-500 uppercase tracking-wide font-medium">Weekly Trend</p>
          <p className="text-2xl font-bold text-warm-800 mt-1">
            {weeklyTrend === 0 ? '—' : (weeklyTrend > 0 ? '+' : '') + weeklyTrend.toFixed(1)}
          </p>
          <p className="text-xs text-warm-400">kg over last {daysToShow} days</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-warm-200">
          <p className="text-xs text-warm-500 uppercase tracking-wide font-medium">BMR / TDEE</p>
          <p className="text-2xl font-bold text-warm-800 mt-1">{bmr}</p>
          <p className="text-xs text-warm-400">TDEE: {tdee} cal</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-warm-200">
          <p className="text-xs text-warm-500 uppercase tracking-wide font-medium">Water Today</p>
          <p className="text-2xl font-bold text-warm-800 mt-1">{todayWater} <span className="text-sm font-normal text-warm-500">cups</span></p>
          <p className="text-xs text-warm-400">Goal: 8 cups</p>
        </div>
      </div>

      {forecast && (
        <div className={`rounded-2xl p-5 shadow-sm border ${forecast.isDeficit ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-semibold text-warm-800">Goal Forecast</h3>
              <p className="text-sm text-warm-600 mt-1">
                {forecast.isDeficit
                  ? `At your current pace, you'll reach your goal weight in approximately `
                  : `With your current surplus, you'll reach your goal in approximately `}
                <strong className="text-warm-800">{forecast.days} days</strong>
                {forecast.isDeficit
                  ? ` (deficit of ${forecast.dailyDeficit} cal/day)`
                  : ` (surplus of ${forecast.dailyDeficit} cal/day)`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-warm-800">{forecast.days}</p>
              <p className="text-xs text-warm-500">days to goal</p>
            </div>
          </div>
          <div className="mt-3 h-2 bg-white/60 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all duration-700" style={{ width: `${Math.min((weightKg - targetWeight) / (startWeight - targetWeight || 1) * 100, 100)}%` }} />
          </div>
        </div>
      )}

      {weightLog.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-200">
          <h3 className="text-sm font-semibold text-warm-800 mb-3">Weight Progress</h3>
          <div className="flex items-end gap-1 h-28">
            {weightLog.slice(-14).map((w, i, arr) => {
              const min = Math.min(...arr.map(x => x.weight));
              const max = Math.max(...arr.map(x => x.weight));
              const range = max - min || 1;
              const h = ((w.weight - min) / range) * 100;
              return (
                <div key={w.date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-primary-100 rounded-t-md relative" style={{ height: `${h}%`, minHeight: 8 }}>
                    <div className="w-full bg-primary-500 rounded-t-md transition-all duration-500" style={{ height: '100%' }} />
                  </div>
                  <span className="text-[10px] text-warm-400">{new Date(w.date).getDate()}/{new Date(w.date).getMonth() + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-warm-800">Quick Log</h3>
          <button onClick={() => setShowWeightInput(!showWeightInput)} className="text-xs text-primary-600 font-medium hover:underline">Log Weight</button>
        </div>
        {showWeightInput && (
          <div className="flex gap-2 items-center">
            <input type="number" step="0.1" value={weightInput} onChange={e => setWeightInput(e.target.value)} placeholder="Weight (kg)"
              className="flex-1 px-3 py-2 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
            <button onClick={handleLogWeight} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition">Save</button>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <div className="bg-primary-50 p-3 rounded-xl text-center">
            <p className="text-lg font-bold text-primary-700">{Object.keys(checkedMeals || {}).filter(k => checkedMeals[k]).length}</p>
            <p className="text-xs text-warm-500">Meals logged</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl text-center">
            <p className="text-lg font-bold text-amber-700">{todayWorkouts.length}</p>
            <p className="text-xs text-warm-500">Workouts done</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-center">
            <p className="text-lg font-bold text-blue-700">{todayWater}/8</p>
            <p className="text-xs text-warm-500">Water cups</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-xl text-center">
            <p className="text-lg font-bold text-purple-700">{todayBurn.workout || 0}</p>
            <p className="text-xs text-warm-500">Cal burned</p>
          </div>
        </div>
      </div>
    </div>
  );
}
