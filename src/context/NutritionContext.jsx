import { createContext, useContext, useCallback, useMemo, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateAll } from '../utils/calorieCalculator';
import { generateMealPlan, generateGroceryList } from '../utils/mealData';
import { generateWorkoutPlan } from '../utils/workoutData';

const VIEWS = {
  '': 'dashboard',
  'dashboard': 'dashboard',
  'mealplan': 'mealplan',
  'workout': 'workout',
  'grocery': 'grocery',
  'tracker': 'tracker',
  'profile': 'profile',
};

function viewFromHash() {
  const hash = window.location.hash.replace(/^#\//, '');
  return VIEWS[hash] || 'dashboard';
}

function hashFromView(view) {
  if (view === 'dashboard') return '#/';
  return `#/${view}`;
}

const NutritionContext = createContext(null);

const EMPTY_PROFILE = {
  age: '', gender: 'male', weightKg: '', weightUnit: 'kg',
  heightCm: '', heightUnit: 'cm', activityLevel: 'sedentary',
  goal: 'maintain', dietaryRestrictions: [], allergies: '',
};

function storageKey(userId, key) {
  return `np_data_${userId}_${key}`;
}

export function NutritionProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const uid = user?.id || 'anon';
  const syncing = useRef(false);

  const [profile, setProfile] = useLocalStorage(storageKey(uid, 'profile'), EMPTY_PROFILE);
  const [mealPlan, setMealPlan] = useLocalStorage(storageKey(uid, 'mealPlan'), null);
  const [groceryList, setGroceryList] = useLocalStorage(storageKey(uid, 'groceryList'), {});
  const [checkedMeals, setCheckedMeals] = useLocalStorage(storageKey(uid, 'checkedMeals'), {});
  const [groceryChecks, setGroceryChecks] = useLocalStorage(storageKey(uid, 'groceryChecks'), []);
  const [workoutPlan, setWorkoutPlan] = useLocalStorage(storageKey(uid, 'workoutPlan'), null);
  const [workoutLog, setWorkoutLog] = useLocalStorage(storageKey(uid, 'workoutLog'), {});
  const [weightLog, setWeightLog] = useLocalStorage(storageKey(uid, 'weightLog'), []);
  const [waterIntake, setWaterIntake] = useLocalStorage(storageKey(uid, 'waterIntake'), {});
  const [dailyBurn, setDailyBurn] = useLocalStorage(storageKey(uid, 'dailyBurn'), {});
  const [foodLog, setFoodLog] = useLocalStorage(storageKey(uid, 'foodLog'), {});
  const [mealFeedback, setMealFeedback] = useLocalStorage(storageKey(uid, 'mealFeedback'), {});
  const [view, setViewState] = useLocalStorage(storageKey(uid, 'view'), viewFromHash());

  const setView = useCallback((v) => {
    setViewState(v);
    const hash = hashFromView(v);
    if (window.location.hash !== hash) {
      syncing.current = true;
      window.history.pushState(null, '', hash);
      syncing.current = false;
    }
  }, [setViewState]);

  useEffect(() => {
    const onPop = () => {
      if (syncing.current) return;
      setViewState(viewFromHash());
    };
    window.addEventListener('popstate', onPop);
    const hash = hashFromView(view);
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash);
    }
    return () => window.removeEventListener('popstate', onPop);
  }, [view, setViewState]);

  const isProfileComplete = !!(profile.age && profile.weightKg && profile.heightCm);

  const nutritionData = useMemo(() => {
    if (!isProfileComplete) return null;
    return calculateAll(profile);
  }, [profile, isProfileComplete]);

  const updateProfile = useCallback((updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, [setProfile]);

  const generatePlan = useCallback(() => {
    if (!isProfileComplete) return;
    const newPlan = generateMealPlan(profile.dietaryRestrictions || []);
    setMealPlan(newPlan);
    setGroceryList(generateGroceryList(newPlan));
    setCheckedMeals({});
    setGroceryChecks([]);
    return newPlan;
  }, [profile, isProfileComplete, setMealPlan, setGroceryList, setCheckedMeals, setGroceryChecks]);

  const regenerateMeal = useCallback((dayIndex, mealType) => {
    setMealPlan(prev => {
      if (!prev) return prev;
      const newPlan = [...prev];
      const newMealPlan = generateMealPlan(profile.dietaryRestrictions || []);
      newPlan[dayIndex] = { ...newPlan[dayIndex], meals: { ...newPlan[dayIndex].meals, [mealType]: newMealPlan[0].meals[mealType] } };
      setGroceryList(generateGroceryList(newPlan));
      return newPlan;
    });
  }, [profile, setGroceryList]);

  const toggleMealCheck = useCallback((dayIndex, mealType) => {
    const key = `${dayIndex}-${mealType}`;
    setCheckedMeals(prev => {
      const next = { ...prev, [key]: !prev[key] };
      return next;
    });
  }, [setCheckedMeals]);

  const toggleGroceryItem = useCallback((itemName) => {
    setGroceryChecks(prev => prev.includes(itemName) ? prev.filter(i => i !== itemName) : [...prev, itemName]);
  }, [setGroceryChecks]);

  const generateWorkout = useCallback(() => {
    const plan = generateWorkoutPlan(profile.goal);
    setWorkoutPlan(plan);
    return plan;
  }, [profile.goal, setWorkoutPlan]);

  const toggleWorkoutDay = useCallback((dayLabel, dateStr) => {
    setWorkoutLog(prev => {
      const dayLog = prev[dateStr] || [];
      const idx = dayLog.indexOf(dayLabel);
      const next = idx >= 0 ? dayLog.filter(d => d !== dayLabel) : [...dayLog, dayLabel];
      return { ...prev, [dateStr]: next };
    });
  }, [setWorkoutLog]);

  const logWorkoutBurn = useCallback((dateStr, calories) => {
    setDailyBurn(prev => {
      const existing = prev[dateStr] || { workout: 0, activity: 0 };
      return { ...prev, [dateStr]: { ...existing, workout: (existing.workout || 0) + calories } };
    });
  }, [setDailyBurn]);

  const logWeight = useCallback((weight) => {
    const today = new Date().toISOString().split('T')[0];
    setWeightLog(prev => {
      const filtered = prev.filter(w => w.date !== today);
      return [...filtered, { date: today, weight: Number(weight) }].sort((a, b) => a.date.localeCompare(b.date));
    });
  }, [setWeightLog]);

  const logWater = useCallback((glasses) => {
    setWaterIntake(prev => ({ ...prev, [new Date().toISOString().split('T')[0]]: glasses }));
  }, [setWaterIntake]);

  const setMealLike = useCallback((mealName, rating) => {
    setMealFeedback(prev => ({ ...prev, [mealName]: rating }));
  }, [setMealFeedback]);

  const logFood = useCallback((date, entry) => {
    setFoodLog(prev => {
      const day = prev[date] || [];
      return { ...prev, [date]: [...day, { ...entry, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }] };
    });
  }, [setFoodLog]);

  const removeFood = useCallback((date, id) => {
    setFoodLog(prev => {
      const day = (prev[date] || []).filter(e => e.id !== id);
      const next = { ...prev };
      if (day.length) next[date] = day;
      else delete next[date];
      return next;
    });
  }, [setFoodLog]);

  const toggleFoodTaken = useCallback((date, id) => {
    setFoodLog(prev => {
      const day = (prev[date] || []).map(e => e.id === id ? { ...e, taken: !e.taken } : e);
      return { ...prev, [date]: day };
    });
  }, [setFoodLog]);

  const resetOnboarding = useCallback(() => {
    setProfile(EMPTY_PROFILE);
    setMealPlan(null); setGroceryList({}); setCheckedMeals({}); setGroceryChecks([]);
    setWorkoutPlan(null); setWorkoutLog({}); setWeightLog([]); setWaterIntake({});
    setDailyBurn({}); setMealFeedback({}); setFoodLog({});
    setView('dashboard');
  }, [setProfile, setMealPlan, setGroceryList, setCheckedMeals, setGroceryChecks,
      setWorkoutPlan, setWorkoutLog, setWeightLog, setWaterIntake, setDailyBurn, setMealFeedback, setFoodLog, setView]);

  const contextValue = useMemo(() => ({
    profile, updateProfile, mealPlan, groceryList, checkedMeals, groceryChecks,
    workoutPlan, workoutLog, weightLog, waterIntake, dailyBurn, mealFeedback, foodLog,
    view, setView, nutritionData, isProfileComplete,
    generatePlan, regenerateMeal, toggleMealCheck, toggleGroceryItem,
    generateWorkout, toggleWorkoutDay, logWorkoutBurn, logWeight, logWater, setMealLike, resetOnboarding,
    setMealPlan, setGroceryList, setWorkoutPlan, setWeightLog,
    logFood, removeFood, toggleFoodTaken,
  }), [
    profile, updateProfile, mealPlan, groceryList, checkedMeals, groceryChecks,
    workoutPlan, workoutLog, weightLog, waterIntake, dailyBurn, mealFeedback, foodLog,
    view, setView, nutritionData, isProfileComplete,
    generatePlan, regenerateMeal, toggleMealCheck, toggleGroceryItem,
    generateWorkout, toggleWorkoutDay, logWorkoutBurn, logWeight, logWater, setMealLike, resetOnboarding,
    setMealPlan, setGroceryList, setWorkoutPlan, setWeightLog,
    logFood, removeFood, toggleFoodTaken,
  ]);

  return <NutritionContext.Provider value={contextValue}>{children}</NutritionContext.Provider>;
}

export function useNutrition() {
  const ctx = useContext(NutritionContext);
  if (!ctx) throw new Error('useNutrition must be used within NutritionProvider');
  return ctx;
}
