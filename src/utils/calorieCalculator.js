export function calculateBMR(gender, weightKg, heightCm, age) {
  if (gender === 'male') return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

const GOAL_CONFIG = {
  'lose-weight': { adjustment: -500, label: 'Lose Weight', icon: '↓' },
  maintain: { adjustment: 0, label: 'Maintain', icon: '→' },
  'gain-muscle': { adjustment: 300, label: 'Gain Muscle', icon: '↑' },
};

const MACRO_SPLITS = {
  'lose-weight': { protein: 0.40, carbs: 0.30, fat: 0.30 },
  maintain: { protein: 0.30, carbs: 0.40, fat: 0.30 },
  'gain-muscle': { protein: 0.35, carbs: 0.40, fat: 0.25 },
};

export function calculateTDEE(bmr, activityLevel) {
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.2));
}

export function calculateTargetCalories(tdee, goal) {
  const config = GOAL_CONFIG[goal] || GOAL_CONFIG.maintain;
  return Math.max(1200, tdee + config.adjustment);
}

export function calculateMacros(targetCalories, goal) {
  const splits = MACRO_SPLITS[goal] || MACRO_SPLITS.maintain;
  return {
    protein: { grams: Math.round((targetCalories * splits.protein) / 4), calories: Math.round(targetCalories * splits.protein), percentage: splits.protein * 100 },
    carbs: { grams: Math.round((targetCalories * splits.carbs) / 4), calories: Math.round(targetCalories * splits.carbs), percentage: splits.carbs * 100 },
    fat: { grams: Math.round((targetCalories * splits.fat) / 9), calories: Math.round(targetCalories * splits.fat), percentage: splits.fat * 100 },
  };
}

export function calculateAll(profile) {
  const weightKg = profile.weightUnit === 'lbs' ? Math.round(profile.weightKg * 0.453592) : Number(profile.weightKg);
  const heightCm = profile.heightUnit === 'ft' ? Math.round(Number(profile.heightCm) * 30.48) : Number(profile.heightCm);
  const bmr = calculateBMR(profile.gender, weightKg, heightCm, profile.age);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, profile.goal);
  const macros = calculateMacros(targetCalories, profile.goal);
  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    macros,
    goalLabel: GOAL_CONFIG[profile.goal]?.label || 'Maintain',
    weightKg,
    heightCm,
  };
}

export function estimateWorkoutBurn(minutes, intensity) {
  const MET = { low: 3.5, moderate: 5.0, high: 7.0, veryHigh: 9.0 };
  return Math.round((MET[intensity] || 5.0) * 3.5 * (minutes / 60));
}
