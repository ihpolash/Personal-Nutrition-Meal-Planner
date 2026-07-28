import { useState, useRef, useEffect } from 'react';
import { useNutrition } from '../context/NutritionContext';
import { searchFood } from '../utils/foodDatabase';
import WaterTracker from './WaterTracker';

const MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' };
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

function autoCalcCalories(p, c, f) {
  return (p || 0) * 4 + (c || 0) * 4 + (f || 0) * 9;
}

function EmptyFood({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-dashed border-warm-300">
      <span className="text-4xl mb-3">🍽️</span>
      <h3 className="text-lg font-semibold text-warm-800 mb-1">No meals tracked yet</h3>
      <p className="text-warm-500 text-sm max-w-md mb-4">Log what you ate today to track your nutrition.</p>
      {!onAdd && <p className="text-warm-400 text-xs">Generate a meal plan or add custom meals below.</p>}
    </div>
  );
}

function FoodForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [mealType, setMealType] = useState('lunch');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [qty, setQty] = useState(1);
  const [calLocked, setCalLocked] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target) && inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNameChange = (val) => {
    setName(val);
    setSelectedIndex(-1);
    if (val.length >= 2) {
      const results = searchFood(val);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (food) => {
    setName(food.name);
    setProtein(String(food.protein));
    setCarbs(String(food.carbs));
    setFat(String(food.fat));
    setCalories(String(food.calories));
    setCalLocked(true);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleMacroChange = (setter, val, field) => {
    setter(val);
    if (!calLocked) {
      const p = field === 'protein' ? (Number(val) || 0) : (Number(protein) || 0);
      const c = field === 'carbs' ? (Number(val) || 0) : (Number(carbs) || 0);
      const f = field === 'fat' ? (Number(val) || 0) : (Number(fat) || 0);
      setCalories(autoCalcCalories(p, c, f));
    }
  };

  const handleCalChange = (val) => {
    setCalories(val);
    setCalLocked(!!val);
    if (!val) setCalLocked(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const p = Number(protein) || 0;
    const c = Number(carbs) || 0;
    const f = Number(fat) || 0;
    onSubmit({
      name: name.trim(),
      mealType,
      calories: calLocked ? (Number(calories) || 0) : autoCalcCalories(p, c, f),
      protein: p,
      carbs: c,
      fat: f,
      qty: Number(qty) || 1,
      taken: true,
    });
    setName('');
    setMealType('lunch');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setQty(1);
    setCalLocked(false);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const calc = calLocked ? (Number(calories) || 0) : autoCalcCalories(Number(protein) || 0, Number(carbs) || 0, Number(fat) || 0);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-primary-200 p-5 space-y-4 animate-fade-in relative">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-warm-800">Log a Meal</h4>
        <button type="button" onClick={onCancel} className="text-xs text-warm-400 hover:text-warm-600 p-1">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1 relative">
          <label className="block text-xs font-medium text-warm-600 mb-1">Meal Name</label>
          <input ref={inputRef} type="text" value={name} onChange={e => handleNameChange(e.target.value)} onKeyDown={handleKeyDown} onFocus={() => suggestions.length > 0 && setShowSuggestions(true)} placeholder="Type a food name..."
            className="w-full px-3 py-2 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm" required autoComplete="off" />
          {showSuggestions && (
            <div ref={suggestRef} className="absolute z-20 top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-warm-200 py-1 max-h-52 overflow-y-auto">
              {suggestions.map((food, i) => (
                <button key={food.name} type="button" onClick={() => selectSuggestion(food)} onMouseEnter={() => setSelectedIndex(i)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm transition ${i === selectedIndex ? 'bg-primary-50 text-primary-700' : 'text-warm-700 hover:bg-warm-50'}`}>
                  <span className="font-medium">{food.name}</span>
                  <span className="text-xs text-warm-400">{food.calories} cal · P{food.protein} C{food.carbs} F{food.fat}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-600 mb-1">Type</label>
          <select value={mealType} onChange={e => setMealType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-white">
            {MEAL_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div>
          <label className="block text-xs font-medium text-warm-600 mb-1">
            Calories {calLocked && <span className="text-primary-500">✓</span>}
          </label>
          <input type="number" min="0" value={calories} onChange={e => handleCalChange(e.target.value)}
            className="w-full px-2 py-2 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm text-center" placeholder={String(calc)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-blue-600 mb-1">Protein</label>
          <input type="number" min="0" step="0.1" value={protein} onChange={e => handleMacroChange(setProtein, e.target.value, 'protein')}
            className="w-full px-2 py-2 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm text-center" placeholder="0" />
        </div>
        <div>
          <label className="block text-xs font-medium text-amber-600 mb-1">Carbs</label>
          <input type="number" min="0" step="0.1" value={carbs} onChange={e => handleMacroChange(setCarbs, e.target.value, 'carbs')}
            className="w-full px-2 py-2 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm text-center" placeholder="0" />
        </div>
        <div>
          <label className="block text-xs font-medium text-red-600 mb-1">Fat</label>
          <input type="number" min="0" step="0.1" value={fat} onChange={e => handleMacroChange(setFat, e.target.value, 'fat')}
            className="w-full px-2 py-2 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm text-center" placeholder="0" />
        </div>
      </div>

      <div className="flex items-center justify-between bg-warm-50 rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="text-sm text-warm-600 font-medium">Quantity</span>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setQty(v => Math.max(1, v - 1))}
              className="w-8 h-8 rounded-lg bg-white border border-warm-200 flex items-center justify-center text-warm-700 hover:bg-warm-100 transition font-medium text-lg">−</button>
            <span className="w-10 text-center font-bold text-warm-800 text-lg">{qty}</span>
            <button type="button" onClick={() => setQty(v => v + 1)}
              className="w-8 h-8 rounded-lg bg-white border border-warm-200 flex items-center justify-center text-warm-700 hover:bg-warm-100 transition font-medium text-lg">+</button>
          </div>
        </div>
        <p className="text-sm text-warm-500">
          Total: <strong className="text-primary-600 text-lg">{calc * qty} cal</strong>
          {calLocked && <span className="text-xs text-warm-400 ml-1">(locked)</span>}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-warm-400">{qty} × {calc} cal = {calc * qty} cal · P{qty * (Number(protein) || 0)}g C{qty * (Number(carbs) || 0)}g F{qty * (Number(fat) || 0)}g</p>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel}
            className="px-4 py-2 rounded-xl border-2 border-warm-200 text-warm-600 text-sm font-medium hover:bg-warm-50 transition">
            Cancel
          </button>
          <button type="submit" disabled={!name.trim()}
            className="px-5 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-50 shadow-sm">
            + Add Meal
          </button>
        </div>
      </div>
    </form>
  );
}

export default function DailyTracker() {
  const { mealPlan, checkedMeals, toggleMealCheck, nutritionData, workoutLog, dailyBurn, foodLog, logFood, removeFood, toggleFoodTaken } = useNutrition();
  const [selectedDay, setSelectedDay] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayFoodLog = foodLog?.[today] || [];
  const todayMeals = mealPlan?.[selectedDay];

  const todayWorkouts = workoutLog[today] || [];
  const todayBurn = dailyBurn[today] || { workout: 0, activity: 0 };

  let dayCals = 0, dayPro = 0, dayCarbs = 0, dayFats = 0, checkedCount = 0;
  const totalMeals = 4;

  todayFoodLog.forEach(e => {
    if (e.taken) {
      const m = Number(e.qty) || 1;
      dayCals += (e.calories || 0) * m;
      dayPro += (e.protein || 0) * m;
      dayCarbs += (e.carbs || 0) * m;
      dayFats += (e.fat || 0) * m;
    }
  });

  if (todayMeals) {
    Object.entries(todayMeals.meals).forEach(([type, meal]) => {
      if (checkedMeals?.[`${selectedDay}-${type}`]) {
        dayCals += meal.calories || 0;
        dayPro += meal.protein || 0;
        dayCarbs += meal.carbs || 0;
        dayFats += meal.fats || 0;
        checkedCount++;
      }
    });
  }

  const bmr = nutritionData?.bmr || 0;
  const totalBurn = bmr + (todayBurn.workout || 0) + (todayBurn.activity || 0);
  const netCal = dayCals - totalBurn;

  const handleAddFood = (entry) => {
    logFood(today, entry);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-800">Daily Tracker</h1>
          <p className="text-warm-500 mt-1">Log meals & track your daily nutrition</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition shadow-md shadow-primary-200 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Log Food
        </button>
      </div>

      {showForm && (
        <FoodForm onSubmit={handleAddFood} onCancel={() => setShowForm(false)} />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-warm-200 text-center">
          <p className="text-xs text-warm-500 uppercase tracking-wide">Calories</p>
          <p className="text-2xl font-bold text-primary-600">{dayCals}</p>
          <p className="text-xs text-warm-400">consumed</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-warm-200 text-center">
          <p className="text-xs text-warm-500 uppercase tracking-wide">Burned</p>
          <p className="text-2xl font-bold text-amber-600">{totalBurn}</p>
          <p className="text-xs text-warm-400">BMR + activity</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-warm-200 text-center">
          <p className="text-xs text-warm-500 uppercase tracking-wide">Net</p>
          <p className={`text-2xl font-bold ${netCal <= 0 ? 'text-green-600' : 'text-red-600'}`}>{netCal >= 0 ? '+' : ''}{netCal}</p>
          <p className="text-xs text-warm-400">{netCal <= 0 ? 'deficit' : 'surplus'}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-warm-200 text-center">
          <p className="text-xs text-warm-500 uppercase tracking-wide">Items Logged</p>
          <p className="text-2xl font-bold text-warm-800">{todayFoodLog.filter(e => e.taken).length + checkedCount}/{totalMeals + todayFoodLog.length}</p>
          <p className="text-xs text-warm-400">today</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-blue-50 p-3 rounded-xl text-center">
          <p className="text-sm font-bold text-blue-700">{dayPro}g</p>
          <p className="text-xs text-warm-500">Protein</p>
        </div>
        <div className="bg-amber-50 p-3 rounded-xl text-center">
          <p className="text-sm font-bold text-amber-700">{dayCarbs}g</p>
          <p className="text-xs text-warm-500">Carbs</p>
        </div>
        <div className="bg-red-50 p-3 rounded-xl text-center">
          <p className="text-sm font-bold text-red-700">{dayFats}g</p>
          <p className="text-xs text-warm-500">Fats</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-xl text-center">
          <p className="text-sm font-bold text-purple-700">{todayWorkouts.length}</p>
          <p className="text-xs text-warm-500">Workouts</p>
        </div>
      </div>

      {todayFoodLog.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-warm-800">Custom Food Log</h3>
            <span className="text-xs text-warm-400">{todayFoodLog.length} item{todayFoodLog.length !== 1 && 's'}</span>
          </div>
          <div className="space-y-2">
            {todayFoodLog.map(entry => (
              <div key={entry.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${entry.taken ? 'border-primary-200 bg-primary-50' : 'border-warm-200'}`}>
                <button onClick={() => toggleFoodTaken(today, entry.id)}
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg ${entry.taken ? 'bg-primary-100' : 'bg-warm-100'}`}>
                  {entry.taken ? '✅' : MEAL_ICONS[entry.mealType] || '🍽️'}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs font-medium uppercase tracking-wide ${entry.taken ? 'text-primary-600' : 'text-warm-500'}`}>
                      {entry.mealType}
                    </p>
                    {entry.taken && <span className="text-xs text-primary-600 font-medium">✓ Done</span>}
                    {(Number(entry.qty) || 1) > 1 && (
                      <span className="text-xs font-bold text-warm-500 bg-warm-100 px-1.5 py-0.5 rounded-md">{entry.qty}×</span>
                    )}
                  </div>
                  <p className={`font-semibold text-warm-800 truncate ${entry.taken ? 'line-through text-warm-400' : ''}`}>
                    {entry.name}
                  </p>
                  <div className="flex gap-3 mt-1 text-xs">
                    <span className="text-warm-500">🔥{(entry.calories || 0) * (Number(entry.qty) || 1)} cal</span>
                    <span className="text-blue-500">P{(entry.protein || 0) * (Number(entry.qty) || 1)}g</span>
                    <span className="text-amber-500">C{(entry.carbs || 0) * (Number(entry.qty) || 1)}g</span>
                    <span className="text-red-500">F{(entry.fat || 0) * (Number(entry.qty) || 1)}g</span>
                  </div>
                </div>
                <button onClick={() => removeFood(today, entry.id)}
                  className="flex-shrink-0 p-1.5 rounded-lg text-warm-400 hover:text-red-500 hover:bg-red-50 transition"
                  title="Remove">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {mealPlan && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-200">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-semibold text-warm-800">Meal Plan Check-off</h3>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {mealPlan.map((day, idx) => {
                const c = Object.keys(checkedMeals || {}).filter(k => k.startsWith(`${idx}-`) && checkedMeals[k]).length;
                return (
                  <button key={day.day} onClick={() => setSelectedDay(idx)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-medium text-xs transition-all ${selectedDay === idx ? 'bg-primary-500 text-white' : 'bg-white text-warm-600 border border-warm-200 hover:border-primary-300'}`}>
                    {day.day.slice(0, 3)}
                    <span className={`ml-1.5 text-[10px] px-1 py-0.5 rounded-full ${c === totalMeals ? 'bg-primary-100 text-primary-700' : c > 0 ? 'bg-amber-100 text-amber-700' : 'bg-warm-100 text-warm-500'}`}>
                      {c}/{totalMeals}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {todayMeals && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(todayMeals.meals).map(([type, meal]) => {
                const key = `${selectedDay}-${type}`;
                const checked = checkedMeals?.[key] || false;
                return (
                  <button key={type} onClick={() => toggleMealCheck(selectedDay, type)}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${checked ? 'border-primary-200 bg-primary-50' : 'border-warm-200 hover:border-primary-200 hover:bg-warm-50'}`}>
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl ${checked ? 'bg-primary-100' : 'bg-warm-100'}`}>
                      {checked ? '✅' : MEAL_ICONS[type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-xs font-medium uppercase tracking-wide ${checked ? 'text-primary-600' : 'text-warm-500'}`}>{type}</p>
                        {checked && <span className="text-xs text-primary-600 font-medium">✓ Done</span>}
                      </div>
                      <p className={`font-semibold text-warm-800 truncate ${checked ? 'line-through text-warm-400' : ''}`}>{meal.name}</p>
                      <div className="flex gap-3 mt-1 text-xs">
                        <span className="text-warm-500">🔥{meal.calories} cal</span>
                        <span className="text-blue-500">P{meal.protein}g</span>
                        <span className="text-amber-500">C{meal.carbs}g</span>
                        <span className="text-red-500">F{meal.fats}g</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!todayMeals && todayFoodLog.length === 0 && <EmptyFood />}

      <WaterTracker />
    </div>
  );
}
