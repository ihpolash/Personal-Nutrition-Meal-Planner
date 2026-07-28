import { useNutrition } from '../context/NutritionContext';

export default function WaterTracker() {
  const { waterIntake, logWater } = useNutrition();
  const today = new Date().toISOString().split('T')[0];
  const glasses = waterIntake[today] || 0;
  const goal = 8;

  const handleSet = (g) => {
    logWater(Math.max(0, Math.min(g, 16)));
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-warm-800">💧 Water Intake</h3>
        <span className="text-xs text-warm-500">{glasses}/{goal} cups</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => handleSet(glasses - 1)} className="w-8 h-8 rounded-lg border border-warm-200 flex items-center justify-center text-warm-500 hover:bg-warm-50 transition">−</button>
        <div className="flex-1 flex gap-1">
          {Array.from({ length: goal }, (_, i) => (
            <button key={i} onClick={() => handleSet(i + 1)}
              className={`flex-1 h-8 rounded-lg transition-all ${i < glasses ? 'bg-blue-500 shadow-sm' : 'bg-warm-200 hover:bg-warm-300'}`}
            />
          ))}
        </div>
        <button onClick={() => handleSet(glasses + 1)} className="w-8 h-8 rounded-lg border border-warm-200 flex items-center justify-center text-warm-500 hover:bg-warm-50 transition">+</button>
      </div>
    </div>
  );
}
