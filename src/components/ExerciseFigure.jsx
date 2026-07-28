import { getExerciseGifUrl } from '../utils/exerciseGifs';

export default function ExerciseFigure({ exerciseName }) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <img
        src={getExerciseGifUrl(exerciseName)}
        alt={exerciseName || 'Exercise demonstration'}
        className="w-full h-full object-cover rounded-2xl shadow-2xl ring-1 ring-white/10"
        loading="lazy"
      />
    </div>
  );
}
