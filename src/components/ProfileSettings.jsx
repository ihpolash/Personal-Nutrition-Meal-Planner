import { useState } from 'react';
import { useNutrition } from '../context/NutritionContext';

const DIETARY_OPTIONS = ['Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Gluten-Free', 'Dairy-Free'];
const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'light', label: 'Light', desc: '1-3 days/week' },
  { value: 'moderate', label: 'Moderate', desc: '3-5 days/week' },
  { value: 'active', label: 'Active', desc: '6-7 days/week' },
];
const GOALS = [
  { value: 'lose-weight', label: 'Lose Weight', icon: '↓', desc: 'Burn fat & slim down' },
  { value: 'maintain', label: 'Maintain', icon: '→', desc: 'Stay at current weight' },
  { value: 'gain-muscle', label: 'Gain Muscle', icon: '↑', desc: 'Build strength & size' },
];

export default function ProfileSettings() {
  const { profile, updateProfile, generatePlan, generateWorkout, setView, nutritionData } = useNutrition();
  const [saved, setSaved] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const handleSave = () => {
    setRegenerating(true);
    generatePlan();
    generateWorkout();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setTimeout(() => setRegenerating(false), 600);
  };

  const toggleRestriction = (key) => {
    const cur = profile.dietaryRestrictions || [];
    const sel = cur.includes(key);
    updateProfile({ dietaryRestrictions: sel ? cur.filter(r => r !== key) : [...cur, key] });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-800">Profile Settings</h1>
          <p className="text-warm-500 mt-1">Update your personal information and goals</p>
        </div>
        <div className="flex items-center gap-2">
          {nutritionData && (
            <div className="text-xs text-warm-400 bg-white px-3 py-1.5 rounded-lg border border-warm-200">
              🔥 {nutritionData.targetCalories} cal/day
            </div>
          )}
          <button onClick={handleSave} disabled={regenerating}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition shadow-md shadow-primary-200 disabled:opacity-60">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-warm-200 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-warm-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Age</label>
              <input type="number" min="1" max="120" value={profile.age || ''} onChange={e => updateProfile({ age: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Gender</label>
              <select value={profile.gender} onChange={e => updateProfile({ gender: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none transition bg-white">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Weight</label>
              <div className="flex gap-3">
                <input type="number" min="1" step="0.1" value={profile.weightKg || ''} onChange={e => updateProfile({ weightKg: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none transition" />
                <select value={profile.weightUnit || 'kg'} onChange={e => updateProfile({ weightUnit: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-warm-200 outline-none transition bg-white">
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Height</label>
              <div className="flex gap-3">
                <input type="number" min="1" step="0.1" value={profile.heightCm || ''} onChange={e => updateProfile({ heightCm: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none transition" />
                <select value={profile.heightUnit || 'cm'} onChange={e => updateProfile({ heightUnit: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-warm-200 outline-none transition bg-white">
                  <option value="cm">cm</option>
                  <option value="ft">ft</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-warm-200" />

        <div>
          <h2 className="text-lg font-semibold text-warm-800 mb-4">Activity & Goal</h2>
          <p className="text-sm text-warm-500 mb-2">Activity Level</p>
          <div className="grid gap-2 mb-4">
            {ACTIVITY_LEVELS.map(al => (
              <button key={al.value} onClick={() => updateProfile({ activityLevel: al.value })}
                className={`flex items-center gap-4 p-3.5 rounded-xl border-2 transition-all text-left ${profile.activityLevel === al.value ? 'border-primary-500 bg-primary-50' : 'border-warm-200 hover:border-warm-300'}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${profile.activityLevel === al.value ? 'border-primary-500' : 'border-warm-300'}`}>
                  {profile.activityLevel === al.value && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                </div>
                <div><p className="font-medium text-warm-800">{al.label}</p><p className="text-xs text-warm-500">{al.desc}</p></div>
              </button>
            ))}
          </div>
          <p className="text-sm text-warm-500 mb-2">Health Goal</p>
          <div className="grid grid-cols-3 gap-3">
            {GOALS.map(g => (
              <button key={g.value} onClick={() => updateProfile({ goal: g.value })}
                className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all ${profile.goal === g.value ? 'border-primary-500 bg-primary-50' : 'border-warm-200 hover:border-warm-300'}`}>
                <span className="text-2xl">{g.icon}</span>
                <span className="text-sm font-medium text-warm-800">{g.label}</span>
                <span className="text-xs text-warm-500 text-center">{g.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <hr className="border-warm-200" />

        <div>
          <h2 className="text-lg font-semibold text-warm-800 mb-4">Dietary Preferences</h2>
          <div className="grid grid-cols-2 gap-2">
            {DIETARY_OPTIONS.map(option => {
              const key = option.toLowerCase().replace(/[-\s]/g, '-');
              const sel = (profile.dietaryRestrictions || []).includes(key);
              return (
                <button key={option} onClick={() => toggleRestriction(key)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${sel ? 'border-primary-500 bg-primary-50' : 'border-warm-200 hover:border-warm-300'}`}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${sel ? 'bg-primary-500 border-primary-500' : 'border-warm-300'}`}>
                    {sel && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="font-medium text-warm-800">{option}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-warm-700 mb-1">Allergies</label>
            <input type="text" value={profile.allergies || ''} onChange={e => updateProfile({ allergies: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="e.g. peanuts, shellfish" />
          </div>
        </div>

        <hr className="border-warm-200" />

        <div className="bg-warm-50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-warm-800">Regenerate Plans</p>
            <p className="text-xs text-warm-500">Recalculate meal & workout plans with your updated profile</p>
          </div>
          <button onClick={handleSave} disabled={regenerating}
            className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition disabled:opacity-60">
            {regenerating ? 'Regenerating...' : 'Regenerate Now'}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => setView('dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-warm-200 text-warm-600 font-medium hover:bg-warm-50 transition text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
