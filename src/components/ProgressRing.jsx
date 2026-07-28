export default function ProgressRing({ value, max, size = 120, strokeWidth = 8, color = '#22c55e', label, unit = '', showValue = true, bgColor = '#e5e7eb' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min((value / max) * 100, 100);
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && <span className="text-xl font-bold text-warm-800">{Math.round(value)}</span>}
          {unit && <span className="text-xs text-warm-500">{unit}</span>}
        </div>
      </div>
      {label && <span className="text-xs font-medium text-warm-600">{label}</span>}
    </div>
  );
}

export function MacroBars({ consumed = {}, targets }) {
  if (!targets) return null;
  const items = [
    { label: 'Protein', current: consumed.protein || 0, target: targets.protein.grams, color: '#3b82f6' },
    { label: 'Carbs', current: consumed.carbs || 0, target: targets.carbs.grams, color: '#f59e0b' },
    { label: 'Fats', current: consumed.fats || 0, target: targets.fat.grams, color: '#ef4444' },
  ];
  return (
    <div className="flex flex-col gap-3 w-full">
      {items.map(i => {
        const pct = Math.min((i.current / i.target) * 100, 100);
        return (
          <div key={i.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-warm-700">{i.label}</span>
              <span className="text-warm-500">{i.current}/{i.target}g</span>
            </div>
            <div className="w-full h-3 bg-warm-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: i.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CalorieRing({ consumed = 0, burned = 0, target }) {
  const balance = consumed - burned;
  const netPct = target ? Math.min((balance / target) * 100, 100) : 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 180, height: 180 }}>
        <svg width={180} height={180} className="transform -rotate-90" style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle cx={90} cy={90} r={76} fill="none" stroke="#e5e7eb" strokeWidth={10} />
          <circle cx={90} cy={90} r={76} fill="none" stroke="#22c55e" strokeWidth={10}
            strokeDasharray={2 * Math.PI * 76} strokeDashoffset={2 * Math.PI * 76 * (1 - Math.min(consumed / Math.max(target, 1), 1))}
            strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        </svg>
        <svg width={180} height={180} className="transform -rotate-90" style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle cx={90} cy={90} r={62} fill="none" stroke="#f0f0f0" strokeWidth={8} />
          <circle cx={90} cy={90} r={62} fill="none" stroke="#f59e0b" strokeWidth={8}
            strokeDasharray={2 * Math.PI * 62} strokeDashoffset={2 * Math.PI * 62 * (1 - Math.min(burned / Math.max(target, 1), 1))}
            strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-warm-800">{balance}</span>
          <span className="text-xs text-warm-500">net cal</span>
        </div>
      </div>
      <div className="flex gap-6 text-xs">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary-500" />Eaten {consumed}</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />Burned {burned}</div>
      </div>
    </div>
  );
}
