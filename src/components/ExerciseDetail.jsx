import { EXERCISE_DETAILS, ANIMATION_TYPES } from '../utils/exerciseData';
import { getExerciseGifUrl } from '../utils/exerciseGifs';
import ExerciseFigure from './ExerciseFigure';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const BODY_EMOJIS = { chest: '🏋️', shoulders: '🏋️', triceps: '💪', back: '🔙', biceps: '💪', legs: '🦵', core: '🧘', cardio: '❤️', 'Full Body': '🔥' };

export default function ExerciseDetail({ exerciseName, onClose, onStart }) {
  const detail = EXERCISE_DETAILS[exerciseName];
  const animType = ANIMATION_TYPES[detail?.type] || ANIMATION_TYPES.generic;

  if (!detail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-warm-800">{exerciseName}</h2>
              <div className="flex gap-2 mt-1">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">{detail.difficulty}</span>
                <span className="text-xs bg-warm-100 text-warm-600 px-2 py-0.5 rounded-full font-medium">{animType.label}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-warm-100 rounded-xl transition">
              <svg className="w-5 h-5 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="relative bg-gradient-to-br from-warm-800 to-warm-900 rounded-2xl mb-5 overflow-hidden border border-white/10">
            <div className="absolute inset-0 opacity-5" style={{
              background: `radial-gradient(circle at 50% 60%, #22c55e 0%, transparent 60%)`,
            }} />
            <div className="w-full h-[240px]">
              <ExerciseFigure exerciseName={exerciseName} />
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-500" /> {animType.label}</span>
              <span className="flex items-center gap-1">⏱ {detail.duration}s work</span>
              {detail.rest > 0 && <span className="flex items-center gap-1">😌 {detail.rest}s rest</span>}
            </div>
          </div>

          <p className="text-sm text-warm-700 mb-4">{detail.description}</p>

          <div className="mb-4">
            <p className="text-xs font-semibold text-warm-500 uppercase tracking-wide mb-2">Target Muscles</p>
            <div className="flex flex-wrap gap-2">
              {detail.muscles.map(m => (
                <span key={m} className="flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                  {BODY_EMOJIS[m] || '💪'} {m}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-warm-500 uppercase tracking-wide mb-2">Steps</p>
            <ol className="space-y-2">
              {detail.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-warm-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 mb-5 border border-amber-200">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">💡 Pro Tip</p>
            <p className="text-sm text-amber-800">{detail.tips}</p>
          </div>

          {detail.commonMistakes && (
            <div className="bg-red-50 rounded-xl p-4 mb-5 border border-red-200">
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">⚠️ Common Mistakes</p>
              <p className="text-sm text-red-800">{detail.commonMistakes}</p>
            </div>
          )}

          <button onClick={() => { onClose(); setTimeout(onStart, 300); }}
            className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold text-base hover:bg-primary-600 transition shadow-lg shadow-primary-200 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Start This Exercise
          </button>
        </div>
      </div>
    </div>
  );
}
