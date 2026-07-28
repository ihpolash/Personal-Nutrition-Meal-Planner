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

export default function Onboarding() {
  const { profile, updateProfile, setView, generatePlan, generateWorkout } = useNutrition();
  const [step, setStep] = useState(1);

  const next = () => { if (step < 4) setStep(s => s + 1); };
  const prev = () => { if (step > 1) setStep(s => s - 1); };

  const valid = () => {
    if (step === 1) return profile.age && profile.weightKg && profile.heightCm;
    if (step === 2) return profile.goal;
    return true;
  };

  const finish = () => {
    generatePlan();
    generateWorkout();
    setView('dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-warm-50 to-primary-50">
      <div className="w-full max-w-2xl animate-scale-in">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-3 shadow-lg shadow-primary-200">
            <span className="text-3xl">🥗</span>
          </div>
          <h1 className="text-3xl font-bold text-warm-800">Set Up Your Profile</h1>
          <p className="text-warm-500 mt-1">We'll tailor everything to your goals</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1,2,3,4].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i <= step ? 'bg-primary-500' : 'bg-warm-200'} ${i === step ? 'w-8' : 'w-2'}`} />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-warm-200">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold text-warm-800 mb-4">Basic Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1">Age</label>
                  <input type="number" min="1" max="120" value={profile.age || ''} onChange={e => updateProfile({ age: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="28" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1">Gender</label>
                  <select value={profile.gender} onChange={e => updateProfile({ gender: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none transition bg-white">
                    <option value="male">Male</option><option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Weight</label>
                <div className="flex gap-3">
                  <input type="number" min="1" step="0.1" value={profile.weightKg || ''} onChange={e => updateProfile({ weightKg: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="70" />
                  <select value={profile.weightUnit || 'kg'} onChange={e => updateProfile({ weightUnit: e.target.value })}
                    className="px-4 py-2.5 rounded-xl border border-warm-200 outline-none transition bg-white">
                    <option value="kg">kg</option><option value="lbs">lbs</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-1">Height</label>
                <div className="flex gap-3">
                  <input type="number" min="1" step="0.1" value={profile.heightCm || ''} onChange={e => updateProfile({ heightCm: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="175" />
                  <select value={profile.heightUnit || 'cm'} onChange={e => updateProfile({ heightUnit: e.target.value })}
                    className="px-4 py-2.5 rounded-xl border border-warm-200 outline-none transition bg-white">
                    <option value="cm">cm</option><option value="ft">ft</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h2 className="text-xl font-semibold text-warm-800 mb-4">Activity & Goal</h2>
              <p className="text-sm text-warm-500 mb-2">Activity Level</p>
              <div className="grid gap-2">
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
              <p className="text-sm text-warm-500 mb-2 mt-4">Health Goal</p>
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
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold text-warm-800 mb-4">Dietary Preferences</h2>
              <div className="grid grid-cols-2 gap-2">
                {DIETARY_OPTIONS.map(option => {
                  const key = option.toLowerCase().replace(/[-\s]/g, '-');
                  const sel = (profile.dietaryRestrictions || []).includes(key);
                  return (
                    <button key={option} onClick={() => {
                      const cur = profile.dietaryRestrictions || [];
                      updateProfile({ dietaryRestrictions: sel ? cur.filter(r => r !== key) : [...cur, key] });
                    }} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${sel ? 'border-primary-500 bg-primary-50' : 'border-warm-200 hover:border-warm-300'}`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${sel ? 'bg-primary-500 border-primary-500' : 'border-warm-300'}`}>
                        {sel && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="font-medium text-warm-800">{option}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-warm-700 mb-1">Allergies (optional)</label>
                <input type="text" value={profile.allergies || ''} onChange={e => updateProfile({ allergies: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-warm-200 focus:ring-2 focus:ring-primary-500 outline-none transition" placeholder="e.g. peanuts, shellfish" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold text-warm-800 mb-4">Review Your Profile</h2>
              <div className="bg-warm-50 rounded-xl p-5 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-xs text-warm-500 uppercase tracking-wide">Age / Gender</p><p className="font-medium text-warm-800">{profile.age} / {profile.gender}</p></div>
                  <div><p className="text-xs text-warm-500 uppercase tracking-wide">Weight / Height</p><p className="font-medium text-warm-800">{profile.weightKg}{profile.weightUnit} / {profile.heightCm}{profile.heightUnit}</p></div>
                  <div><p className="text-xs text-warm-500 uppercase tracking-wide">Activity</p><p className="font-medium text-warm-800 capitalize">{profile.activityLevel}</p></div>
                  <div><p className="text-xs text-warm-500 uppercase tracking-wide">Goal</p><p className="font-medium text-warm-800 capitalize">{profile.goal?.replace('-', ' ')}</p></div>
                </div>
                {(profile.dietaryRestrictions || []).length > 0 && (
                  <div><p className="text-xs text-warm-500 uppercase tracking-wide mb-1">Dietary Restrictions</p>
                    <div className="flex flex-wrap gap-1.5">{(profile.dietaryRestrictions || []).map(r => (
                      <span key={r} className="px-2.5 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full capitalize">{r.replace('-', ' ')}</span>
                    ))}</div>
                  </div>
                )}
                {profile.allergies && <div><p className="text-xs text-warm-500 uppercase tracking-wide">Allergies</p><p className="font-medium text-warm-800">{profile.allergies}</p></div>}
              </div>
              <p className="text-sm text-warm-500 text-center">After finishing, we'll generate your personalized meal plan & workout schedule.</p>
            </div>
          )}

          <div className="flex justify-between mt-6 pt-5 border-t border-warm-200">
            {step > 1 ? <button onClick={prev} className="px-6 py-2.5 rounded-xl border-2 border-warm-200 text-warm-700 font-medium hover:bg-warm-50 transition">Back</button> : <div />}
            {step < 4 ? (
              <button onClick={next} disabled={!valid()}
                className={`px-6 py-2.5 rounded-xl font-medium transition ${valid() ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md shadow-primary-200' : 'bg-warm-200 text-warm-400 cursor-not-allowed'}`}>
                Continue
              </button>
            ) : (
              <button onClick={finish} className="px-8 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 shadow-md shadow-primary-200 transition">
                Start My Journey →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
