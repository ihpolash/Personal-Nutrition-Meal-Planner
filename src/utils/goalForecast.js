const KG_TO_CALORIES = 7700;
const LB_TO_CALORIES = 3500;

export function getTargetWeight(profile) {
  const weight = profile.weightUnit === 'lbs'
    ? Math.round(profile.weightKg * 0.453592)
    : Number(profile.weightKg);

  if (profile.goal === 'lose-weight') {
    const target = weight - weight * 0.1;
    return Math.round(target * 10) / 10;
  }
  if (profile.goal === 'gain-muscle') {
    const target = weight + weight * 0.05;
    return Math.round(target * 10) / 10;
  }
  return weight;
}

export function getWeightUnit(profile) {
  return profile.weightUnit === 'lbs' ? 'lbs' : 'kg';
}

export function forecastDays(profile, nutritionData, avgDailyBurn, avgDailyIntake) {
  const currentWeight = nutritionData.weightKg;
  const targetWeight = getTargetWeight(profile);
  if (currentWeight === targetWeight) return 0;

  const diff = currentWeight - targetWeight;
  const totalCalNeeded = Math.abs(diff) * KG_TO_CALORIES;

  const dailyBMR = nutritionData.bmr;
  const dailyDeficit = avgDailyIntake - (dailyBMR + avgDailyBurn);

  if (Math.abs(dailyDeficit) < 50) return null;

  const days = Math.round(totalCalNeeded / Math.abs(dailyDeficit));
  return { days, isDeficit: dailyDeficit < 0, totalCalNeeded: Math.round(totalCalNeeded), dailyDeficit: Math.round(Math.abs(dailyDeficit)) };
}

export function getCalorieBalance(dailyLog) {
  return {
    consumed: dailyLog.caloriesConsumed || 0,
    burned: (dailyLog.workoutBurn || 0) + (dailyLog.activityBurn || 0),
    net: (dailyLog.caloriesConsumed || 0) - ((dailyLog.workoutBurn || 0) + (dailyLog.activityBurn || 0)),
  };
}
