import { useState, useEffect, useRef, useCallback } from 'react';
import { EXERCISE_DETAILS } from '../utils/exerciseData';
import ExerciseFigure from './ExerciseFigure';
import { playCountdown, playStartChime, playEndChime, playRestChime, playCoachCue, getCoachPhrases, playCount } from '../utils/audioCoach';

export default function WorkoutSession({ exercises, onClose, dayName, totalCalBurn, onComplete }) {
  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState('ready');
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [coachMsg, setCoachMsg] = useState('');
  const [coachVisible, setCoachVisible] = useState(false);
  const timerRef = useRef(null);
  const completedSet = useRef(new Set());

  const currentEx = exercises[currentExIdx];
  const detail = EXERCISE_DETAILS[currentEx?.name];
  const sets = detail?.sets || currentEx?.sets || 3;
  const workDuration = detail?.duration || 40;
  const restDuration = detail?.rest || 60;
  const phrases = getCoachPhrases(currentEx?.name);

  const showCoach = useCallback((msg, duration = 2000) => {
    setCoachMsg(msg);
    setCoachVisible(true);
    const word = msg.replace(/["!]/g, '').split(' ')[0]?.toLowerCase();
    playCoachCue(word);
    setTimeout(() => setCoachVisible(false), duration);
  }, []);

  const startTimer = useCallback((duration, nextPhase) => {
    setTimeLeft(duration);
    setTotalTime(duration);
    setPhase(nextPhase);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (nextPhase === 'work') {
          playCount(prev);
        } else {
          playCountdown(next);
        }
        if (next <= 0) {
          clearInterval(timerRef.current);
          return 0;
        }
        if (next === Math.floor(duration / 2) && nextPhase === 'work') {
          const idx = Math.floor(Math.random() * phrases.length);
          showCoach(phrases[idx]);
        }
        return next;
      });
    }, 1000);
  }, [showCoach, phrases]);

  const nextExercise = useCallback(() => {
    completedSet.current.add(`ex-${currentExIdx}`);
    if (currentExIdx < exercises.length - 1) {
      setCurrentExIdx(i => i + 1);
      setCurrentSet(1);
      setPhase('ready');
      setTimeLeft(0);
    } else {
      setPhase('done');
      playEndChime();
    }
  }, [currentExIdx, exercises.length]);

  const handleStartSet = () => {
    playStartChime();
    showCoach(phrases[0], 1500);
    setTimeout(() => {
      startTimer(workDuration, 'work');
    }, 800);
  };

  const handleSkipRest = () => {
    clearInterval(timerRef.current);
    goToNext();
  };

  const goToNext = useCallback(() => {
    if (currentSet < sets) {
      setCurrentSet(s => s + 1);
      setPhase('ready');
      setTimeLeft(0);
    } else {
      nextExercise();
    }
  }, [currentSet, sets, nextExercise]);

  useEffect(() => {
    if (phase === 'work' && timeLeft === 0 && totalTime > 0) {
      playEndChime();
      if (currentSet < sets) {
        playRestChime();
        showCoach('"Rest and breathe"', 1500);
        setTimeout(() => startTimer(restDuration, 'rest'), 1000);
      } else {
        showCoach('"Great set!"', 1200);
        setTimeout(() => nextExercise(), 1500);
      }
    }
    if (phase === 'rest' && timeLeft === 0 && totalTime > 0) {
      playStartChime();
      goToNext();
    }
  }, [phase, timeLeft, totalTime, currentSet, sets, restDuration, startTimer, nextExercise, goToNext, showCoach]);

  useEffect(() => {
    return () => { clearInterval(timerRef.current); };
  }, []);

  if (!currentEx) return null;

  const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 100;
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const timerColor = phase === 'work' ? '#22c55e' : phase === 'rest' ? '#f59e0b' : '#6366f1';
  const bgGradient = phase === 'work'
    ? 'from-warm-900 to-warm-800'
    : phase === 'rest'
    ? 'from-amber-900/30 to-warm-900'
    : 'from-indigo-900/30 to-warm-900';

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br ${bgGradient} flex flex-col`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div>
          <p className="text-xs text-white/50">{dayName}</p>
          <p className="text-sm text-white/80 font-medium">Exercise {currentExIdx + 1} of {exercises.length}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {Array.from({ length: sets }, (_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < currentSet ? 'bg-primary-500' : i === currentSet && phase !== 'done' ? 'bg-white/60' : 'bg-white/20'}`} />
            ))}
          </div>
          <button onClick={() => { clearInterval(timerRef.current); onClose(); }} className="p-2 hover:bg-white/10 rounded-xl transition">
            <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 relative overflow-hidden">
        {coachVisible && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-primary-500/90 text-white px-6 py-2.5 rounded-2xl text-lg font-semibold shadow-lg animate-scale-in whitespace-nowrap z-10 backdrop-blur-sm">
            {coachMsg}
          </div>
        )}

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white">{currentEx.name}</h2>
          <p className="text-white/50 text-sm mt-1">
            {phase === 'ready' && 'Ready for your next set'}
            {phase === 'work' && 'GO! GO! GO!'}
            {phase === 'rest' && 'Rest period'}
            {phase === 'done' && 'Workout Complete!'}
          </p>
        </div>

        <div className="relative flex items-center justify-center mb-4">
          <svg width={200} height={200} className="absolute">
            <circle cx={100} cy={100} r={88} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
            <circle cx={100} cy={100} r={88} fill="none" stroke={timerColor} strokeWidth={6}
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" className="transition-all duration-500 ease-linear"
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
          </svg>
          <div className="relative w-[170px] h-[170px] rounded-2xl overflow-hidden">
            <ExerciseFigure exerciseName={currentEx.name} />
          </div>
        </div>

        {timeLeft > 0 && (
          <div className="text-center mb-2">
            <span className={`text-6xl font-bold tabular-nums tracking-tight ${phase === 'work' ? 'text-white' : phase === 'rest' ? 'text-amber-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
            <p className="text-white/40 text-sm mt-1">
              {phase === 'work' ? `Set ${currentSet} of ${sets}` : `Next set in ${timeLeft}s`}
            </p>
          </div>
        )}

        {phase === 'ready' && (
          <div className="flex gap-4 mt-2">
            <button onClick={handleStartSet}
              className="px-10 py-4 bg-primary-500 text-white rounded-2xl font-bold text-lg hover:bg-primary-600 transition shadow-lg shadow-primary-500/30 flex items-center gap-3 active:scale-95">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
              Start Set {currentSet}
            </button>
          </div>
        )}

        {phase === 'rest' && (
          <div className="flex flex-col items-center gap-3 mt-2">
            <div className="flex gap-4">
              {Array.from({ length: Math.min(timeLeft, 10) }, (_, i) => (
                <div key={i} className={`w-1.5 rounded-full transition-all ${i < timeLeft / (totalTime / 10) ? 'bg-amber-400' : 'bg-white/10'}`} style={{ height: 10 + i * 2 }} />
              ))}
            </div>
            <button onClick={handleSkipRest} className="px-6 py-2.5 bg-white/10 text-white/80 rounded-xl font-medium hover:bg-white/20 transition text-sm">
              Skip Rest →
            </button>
          </div>
        )}

        {phase === 'done' && (
          <div className="text-center mt-4">
            <p className="text-white/60 mb-2">You completed all exercises. Great work!</p>
            <div className="flex items-center justify-center gap-4 text-white/40 text-sm mb-4">
              <span>🔥 {exercises.length} exercises</span>
              <span>💪 {sets} sets each</span>
            </div>
            <button onClick={() => { onComplete?.(); onClose(); }} className="px-8 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition shadow-lg">
              Finish Workout
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-1.5 px-5 py-4 border-t border-white/10 overflow-x-auto scrollbar-hide justify-center">
        {exercises.map((ex, i) => (
          <div key={i} className={`flex flex-col items-center gap-1 min-w-0 transition-all ${i === currentExIdx ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`h-1 rounded-full transition-all ${completedSet.current.has(`ex-${i}`) ? 'w-8 bg-primary-500' : i === currentExIdx ? 'w-8 bg-white/60' : 'w-4 bg-white/20'}`} />
            <span className="text-[10px] text-white/30 truncate max-w-16">{ex.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
