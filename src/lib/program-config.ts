import type {
  WorkoutDayType,
  NutritionDayType,
  ProgrammedDay,
  MacroTargets,
  PhaseDefinition,
  MilestoneSeed,
  LiftingTargetSeed,
} from '@/types/program';

export const PROGRAM_START_DATE = '2026-03-23';
export const PROGRAM_END_DATE = '2026-06-15';

// Day of week (0=Sun) → workout type
export const WORKOUT_SCHEDULE: Record<number, WorkoutDayType> = {
  0: 'upper_hypertrophy',   // Sunday
  1: 'lower_hypertrophy',   // Monday
  2: 'abs_forearms',        // Tuesday
  3: 'abs_forearms',        // Wednesday
  4: 'abs_forearms',        // Thursday
  5: 'heavy_upper',         // Friday
  6: 'heavy_lower',         // Saturday
};

// Day of week (0=Sun) → nutrition type
export const NUTRITION_SCHEDULE: Record<number, NutritionDayType> = {
  0: 'training',  // Sunday
  1: 'training',  // Monday
  2: 'work',      // Tuesday
  3: 'work',      // Wednesday
  4: 'work',      // Thursday
  5: 'training',  // Friday
  6: 'training',  // Saturday
};

export const MACRO_TARGETS: Record<NutritionDayType, MacroTargets> = {
  training: {
    calories: [2650, 2800],
    protein: 200,
    fat: [70, 80],
    carbs: [300, 330],
  },
  work: {
    calories: [2400, 2600],
    protein: 200,
    fat: [65, 75],
    carbs: [230, 270],
  },
  rest: {
    calories: [2300, 2450],
    protein: 200,
    fat: [70, 70],
    carbs: [210, 240],
  },
};

export const PHASES: PhaseDefinition[] = [
  {
    phase: 'foundation',
    label: 'Foundation',
    weekStart: 1,
    weekEnd: 4,
    goal: 'Learn flow, establish baseline loads, build consistency',
  },
  {
    phase: 'progression',
    label: 'Progression',
    weekStart: 5,
    weekEnd: 8,
    goal: 'Progressive overload, visible changes begin',
  },
  {
    phase: 'push',
    label: 'Push',
    weekStart: 9,
    weekEnd: 12,
    goal: 'Maintain high effort, refine nutrition, approach target physique',
  },
];

export const WEEKLY_PROGRAM: ProgrammedDay[] = [
  {
    dayType: 'heavy_upper',
    label: 'Heavy Upper (Friday)',
    duration: '60–75 min',
    exercises: [
      { name: 'Incline Dumbbell Press', sets: 4, reps: '6-10', equipment: 'Dumbbells' },
      { name: 'Flat Dumbbell Bench', sets: 4, reps: '8-12', equipment: 'Dumbbells', notes: 'OR Tonal chest press' },
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: '6-10', equipment: 'Dumbbells' },
      { name: 'Lateral Raise', sets: 4, reps: '12-20', equipment: 'Dumbbells' },
      { name: 'Chest-Supported Row', sets: 4, reps: '8-12', equipment: 'Dumbbells', notes: 'OR Tonal row' },
      { name: 'Rear Delt Fly', sets: 3, reps: '12-20', equipment: 'Dumbbells' },
      { name: 'Triceps Pressdown', sets: 3, reps: '10-15', equipment: 'Tonal', notes: 'OR overhead extension' },
      { name: 'Hanging Leg Raise', sets: 3, reps: '10-15', equipment: 'Bodyweight', notes: 'OR Tonal cable crunch' },
    ],
  },
  {
    dayType: 'heavy_lower',
    label: 'Heavy Lower (Saturday)',
    duration: '60–75 min',
    exercises: [
      { name: 'Goblet Squat', sets: 4, reps: '8-10', equipment: 'Dumbbell', notes: 'OR Tonal front squat' },
      { name: 'Bulgarian Split Squat', sets: 4, reps: '8-10 each', equipment: 'Dumbbells' },
      { name: 'Romanian Deadlift', sets: 4, reps: '8-12', equipment: 'Dumbbells' },
      { name: 'Reverse Lunge', sets: 3, reps: '10 each', equipment: 'Dumbbells', notes: 'OR walking lunge' },
      { name: 'Tonal Leg Extension', sets: 3, reps: '12-15', equipment: 'Tonal', notes: 'OR heels-elevated squat' },
      { name: 'Calf Raises', sets: 3, reps: '15-20', equipment: 'Dumbbells' },
      { name: 'Weighted Cable Crunch', sets: 3, reps: '12-15', equipment: 'Tonal' },
    ],
  },
  {
    dayType: 'upper_hypertrophy',
    label: 'Upper Hypertrophy (Sunday)',
    duration: '60–75 min',
    exercises: [
      { name: 'Dumbbell Shoulder Press', sets: 4, reps: '8-12', equipment: 'Dumbbells' },
      { name: 'Lateral Raise', sets: 4, reps: '12-20', equipment: 'Dumbbells' },
      { name: 'Tonal Pulldown', sets: 4, reps: '8-12', equipment: 'Tonal' },
      { name: 'Incline DB Press', sets: 3, reps: '10-12', equipment: 'Dumbbells', notes: 'OR Tonal chest press' },
      { name: 'Tonal Row', sets: 3, reps: '10-12', equipment: 'Tonal', notes: 'OR chest-supported row' },
      { name: 'Face Pull', sets: 3, reps: '12-20', equipment: 'Tonal', notes: 'OR rear delt fly' },
      { name: 'Dumbbell Bicep Curl', sets: 3, reps: '10-15', equipment: 'Dumbbells' },
      { name: 'Triceps Overhead Extension', sets: 3, reps: '10-15', equipment: 'Dumbbell' },
      { name: 'Tonal Cable Crunch', sets: 3, reps: '12-15', equipment: 'Tonal' },
    ],
  },
  {
    dayType: 'lower_hypertrophy',
    label: 'Lower Hypertrophy (Monday)',
    duration: '60–75 min',
    exercises: [
      { name: 'Heels-Elevated Goblet Squat', sets: 4, reps: '10-12', equipment: 'Dumbbell', notes: 'OR Tonal front squat' },
      { name: 'Step-Ups', sets: 3, reps: '10 each', equipment: 'Dumbbells' },
      { name: 'Hip Thrust', sets: 4, reps: '8-12', equipment: 'Dumbbell' },
      { name: 'Romanian Deadlift', sets: 3, reps: '10-12', equipment: 'Dumbbells' },
      { name: 'Bulgarian Split Squat', sets: 3, reps: '10-12 each', equipment: 'Dumbbells' },
      { name: 'Tonal Hamstring Curl', sets: 3, reps: '10-15', equipment: 'Tonal' },
      { name: 'Calf Raises', sets: 3, reps: '15-20', equipment: 'Dumbbells' },
      { name: 'Cable Crunch', sets: 3, reps: '10-15', equipment: 'Tonal', notes: 'OR hanging leg raise' },
    ],
  },
  {
    dayType: 'abs_forearms',
    label: 'Abs + Forearms (Tue/Wed/Thu)',
    duration: '15–20 min',
    exercises: [
      { name: 'Weighted Crunch', sets: 3, reps: '15-20', equipment: 'Light DB', notes: 'DB on chest' },
      { name: 'Plank', sets: 3, reps: '30-60 sec', equipment: 'Bodyweight' },
      { name: 'Dead Bug', sets: 3, reps: '10 each', equipment: 'Bodyweight' },
      { name: 'Side Plank', sets: 2, reps: '30 sec each', equipment: 'Bodyweight' },
      { name: 'Wrist Curl', sets: 3, reps: '15-20', equipment: 'Light DB' },
      { name: 'Reverse Wrist Curl', sets: 3, reps: '15-20', equipment: 'Light DB' },
      { name: 'Band Finger Extensions', sets: 3, reps: '15-20', equipment: 'Band' },
      { name: 'Farmer Hold', sets: 2, reps: '30-45 sec', equipment: 'Dumbbell' },
    ],
  },
];

export const SEED_MILESTONES: MilestoneSeed[] = [
  { description: 'All 7 sessions completed in first week', targetWeek: 1, phase: 'foundation' },
  { description: 'Batch prep routine established', targetWeek: 2, phase: 'foundation' },
  { description: 'Baseline weights recorded for all main lifts', targetWeek: 3, phase: 'foundation' },
  { description: 'Check-in #1: weight, waist, photos, lift review', targetWeek: 4, phase: 'foundation' },
  { description: 'First calorie adjustment decision', targetWeek: 5, phase: 'progression' },
  { description: 'Noticeable strength increases', targetWeek: 6, phase: 'progression' },
  { description: 'Check-in #2: weight, waist, photos, lift comparison', targetWeek: 8, phase: 'progression' },
  { description: 'Second calorie adjustment decision if needed', targetWeek: 9, phase: 'push' },
  { description: 'All main lifts meaningfully above Week 1', targetWeek: 10, phase: 'push' },
  { description: 'Final assessment: photos, weight, waist, all lifts logged', targetWeek: 12, phase: 'push' },
];

export const SEED_LIFTING_TARGETS: LiftingTargetSeed[] = [
  { exerciseName: 'Incline Dumbbell Press', estimatedStartMin: 40, estimatedStartMax: 55, week4Goal: '+10%', week8Goal: '+15-20%', week12Goal: '+20-25%' },
  { exerciseName: 'Flat Dumbbell Bench', estimatedStartMin: 45, estimatedStartMax: 60, week4Goal: '+10%', week8Goal: '+15-20%', week12Goal: '+20-25%' },
  { exerciseName: 'Dumbbell Shoulder Press', estimatedStartMin: 35, estimatedStartMax: 50, week4Goal: '+10%', week8Goal: '+15-20%', week12Goal: '+20-25%' },
  { exerciseName: 'Goblet Squat', estimatedStartMin: 50, estimatedStartMax: 70, week4Goal: '+10%', week8Goal: '+15-20%', week12Goal: '+20-30%' },
  { exerciseName: 'Bulgarian Split Squat', estimatedStartMin: 30, estimatedStartMax: 45, week4Goal: '+10%', week8Goal: '+15-20%', week12Goal: '+20-25%' },
  { exerciseName: 'Romanian Deadlift', estimatedStartMin: 50, estimatedStartMax: 70, week4Goal: '+10%', week8Goal: '+15-20%', week12Goal: '+20-25%' },
  { exerciseName: 'Hip Thrust', estimatedStartMin: 60, estimatedStartMax: 80, week4Goal: '+10-15%', week8Goal: '+20-25%', week12Goal: '+25-35%' },
  { exerciseName: 'Step-Ups', estimatedStartMin: 25, estimatedStartMax: 40, week4Goal: '+10%', week8Goal: '+15%', week12Goal: '+20%' },
  { exerciseName: 'Reverse Lunge', estimatedStartMin: 30, estimatedStartMax: 45, week4Goal: '+10%', week8Goal: '+15%', week12Goal: '+20%' },
  { exerciseName: 'Lateral Raise', estimatedStartMin: 12, estimatedStartMax: 20, week4Goal: '+reps first', week8Goal: '+5 lb', week12Goal: '+5-10 lb' },
  { exerciseName: 'Rear Delt Fly', estimatedStartMin: 10, estimatedStartMax: 15, week4Goal: '+reps first', week8Goal: '+5 lb', week12Goal: '+5-10 lb' },
  { exerciseName: 'Dumbbell Bicep Curl', estimatedStartMin: 20, estimatedStartMax: 30, week4Goal: '+5 lb', week8Goal: '+10 lb', week12Goal: '+10-15 lb' },
  { exerciseName: 'Triceps Pressdown', estimatedStartMin: 15, estimatedStartMax: 25, week4Goal: '+reps first', week8Goal: '+10%', week12Goal: '+15-20%' },
  { exerciseName: 'Calf Raises', estimatedStartMin: 40, estimatedStartMax: 60, week4Goal: '+reps first', week8Goal: '+10 lb', week12Goal: '+15-20 lb' },
  { exerciseName: 'Tonal Cable Crunch', estimatedStartMin: 20, estimatedStartMax: 40, week4Goal: '+10%', week8Goal: '+20%', week12Goal: '+25-30%' },
  { exerciseName: 'Hanging Leg Raise', estimatedStartMin: 0, estimatedStartMax: 0, week4Goal: 'Add slow reps', week8Goal: 'Hold DB between feet', week12Goal: 'Increase DB weight' },
  // Tonal + additional exercises
  { exerciseName: 'Chest-Supported Row', estimatedStartMin: 30, estimatedStartMax: 45, week4Goal: '+10%', week8Goal: '+15-20%', week12Goal: '+20-25%' },
  { exerciseName: 'Tonal Leg Extension', estimatedStartMin: 20, estimatedStartMax: 40, week4Goal: '+10%', week8Goal: '+20%', week12Goal: '+25-30%' },
  { exerciseName: 'Weighted Cable Crunch', estimatedStartMin: 20, estimatedStartMax: 40, week4Goal: '+10%', week8Goal: '+20%', week12Goal: '+25-30%' },
  { exerciseName: 'Tonal Pulldown', estimatedStartMin: 30, estimatedStartMax: 50, week4Goal: '+10%', week8Goal: '+15-20%', week12Goal: '+20-25%' },
  { exerciseName: 'Incline DB Press', estimatedStartMin: 35, estimatedStartMax: 50, week4Goal: '+10%', week8Goal: '+15-20%', week12Goal: '+20-25%' },
  { exerciseName: 'Tonal Row', estimatedStartMin: 25, estimatedStartMax: 45, week4Goal: '+10%', week8Goal: '+15-20%', week12Goal: '+20-25%' },
  { exerciseName: 'Face Pull', estimatedStartMin: 15, estimatedStartMax: 25, week4Goal: '+reps first', week8Goal: '+10%', week12Goal: '+15-20%' },
  { exerciseName: 'Triceps Overhead Extension', estimatedStartMin: 20, estimatedStartMax: 35, week4Goal: '+5 lb', week8Goal: '+10 lb', week12Goal: '+10-15 lb' },
  { exerciseName: 'Heels-Elevated Goblet Squat', estimatedStartMin: 45, estimatedStartMax: 65, week4Goal: '+10%', week8Goal: '+15-20%', week12Goal: '+20-30%' },
  { exerciseName: 'Tonal Hamstring Curl', estimatedStartMin: 20, estimatedStartMax: 35, week4Goal: '+10%', week8Goal: '+20%', week12Goal: '+25-30%' },
  { exerciseName: 'Cable Crunch', estimatedStartMin: 20, estimatedStartMax: 40, week4Goal: '+10%', week8Goal: '+20%', week12Goal: '+25-30%' },
  { exerciseName: 'Weighted Crunch', estimatedStartMin: 10, estimatedStartMax: 25, week4Goal: '+5 lb', week8Goal: '+10 lb', week12Goal: '+15 lb' },
  { exerciseName: 'Wrist Curl', estimatedStartMin: 10, estimatedStartMax: 20, week4Goal: '+reps first', week8Goal: '+5 lb', week12Goal: '+5-10 lb' },
  { exerciseName: 'Reverse Wrist Curl', estimatedStartMin: 5, estimatedStartMax: 15, week4Goal: '+reps first', week8Goal: '+5 lb', week12Goal: '+5-10 lb' },
  { exerciseName: 'Farmer Hold', estimatedStartMin: 40, estimatedStartMax: 60, week4Goal: '+time first', week8Goal: '+10 lb', week12Goal: '+15-20 lb' },
  // Bodyweight exercises (track reps/time, not weight)
  { exerciseName: 'Plank', estimatedStartMin: 0, estimatedStartMax: 0, week4Goal: '45 sec holds', week8Goal: '60 sec holds', week12Goal: '60+ sec holds' },
  { exerciseName: 'Dead Bug', estimatedStartMin: 0, estimatedStartMax: 0, week4Goal: 'Slow controlled reps', week8Goal: '+reps', week12Goal: 'Add ankle weights' },
  { exerciseName: 'Side Plank', estimatedStartMin: 0, estimatedStartMax: 0, week4Goal: '30 sec each', week8Goal: '45 sec each', week12Goal: '60 sec each' },
  { exerciseName: 'Band Finger Extensions', estimatedStartMin: 0, estimatedStartMax: 0, week4Goal: '+reps', week8Goal: 'Heavier band', week12Goal: 'Heavier band' },
];

/** Get the programmed day config for a workout day type */
export function getProgrammedDay(dayType: WorkoutDayType): ProgrammedDay {
  return WEEKLY_PROGRAM.find(d => d.dayType === dayType)!;
}
