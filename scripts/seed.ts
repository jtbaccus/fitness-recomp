import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const PROGRAM_START_DATE = '2026-03-24';

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

const milestones = [
  { description: 'All 7 sessions completed in first week', target_date: addDays(PROGRAM_START_DATE, 6), phase: 'foundation' },
  { description: 'Batch prep routine established', target_date: addDays(PROGRAM_START_DATE, 13), phase: 'foundation' },
  { description: 'Baseline weights recorded for all main lifts', target_date: addDays(PROGRAM_START_DATE, 20), phase: 'foundation' },
  { description: 'Check-in #1: weight, waist, photos, lift review', target_date: addDays(PROGRAM_START_DATE, 27), phase: 'foundation' },
  { description: 'First calorie adjustment decision', target_date: addDays(PROGRAM_START_DATE, 34), phase: 'progression' },
  { description: 'Noticeable strength increases', target_date: addDays(PROGRAM_START_DATE, 41), phase: 'progression' },
  { description: 'Check-in #2: weight, waist, photos, lift comparison', target_date: addDays(PROGRAM_START_DATE, 55), phase: 'progression' },
  { description: 'Second calorie adjustment decision if needed', target_date: addDays(PROGRAM_START_DATE, 62), phase: 'push' },
  { description: 'All main lifts meaningfully above Week 1', target_date: addDays(PROGRAM_START_DATE, 69), phase: 'push' },
  { description: 'Final assessment: photos, weight, waist, all lifts logged', target_date: addDays(PROGRAM_START_DATE, 83), phase: 'push' },
];

const liftingTargets = [
  { exercise_name: 'Incline Dumbbell Press', week4_goal: '+10%', week8_goal: '+15-20%', week12_goal: '+20-25%' },
  { exercise_name: 'Flat Dumbbell Bench', week4_goal: '+10%', week8_goal: '+15-20%', week12_goal: '+20-25%' },
  { exercise_name: 'Dumbbell Shoulder Press', week4_goal: '+10%', week8_goal: '+15-20%', week12_goal: '+20-25%' },
  { exercise_name: 'Goblet Squat', week4_goal: '+10%', week8_goal: '+15-20%', week12_goal: '+20-30%' },
  { exercise_name: 'Bulgarian Split Squat', week4_goal: '+10%', week8_goal: '+15-20%', week12_goal: '+20-25%' },
  { exercise_name: 'Romanian Deadlift', week4_goal: '+10%', week8_goal: '+15-20%', week12_goal: '+20-25%' },
  { exercise_name: 'Hip Thrust', week4_goal: '+10-15%', week8_goal: '+20-25%', week12_goal: '+25-35%' },
  { exercise_name: 'Step-Ups', week4_goal: '+10%', week8_goal: '+15%', week12_goal: '+20%' },
  { exercise_name: 'Reverse Lunge', week4_goal: '+10%', week8_goal: '+15%', week12_goal: '+20%' },
  { exercise_name: 'Lateral Raise', week4_goal: '+reps first', week8_goal: '+5 lb', week12_goal: '+5-10 lb' },
  { exercise_name: 'Rear Delt Fly', week4_goal: '+reps first', week8_goal: '+5 lb', week12_goal: '+5-10 lb' },
  { exercise_name: 'Dumbbell Bicep Curl', week4_goal: '+5 lb', week8_goal: '+10 lb', week12_goal: '+10-15 lb' },
  { exercise_name: 'Triceps Pressdown', week4_goal: '+reps first', week8_goal: '+10%', week12_goal: '+15-20%' },
  { exercise_name: 'Calf Raises', week4_goal: '+reps first', week8_goal: '+10 lb', week12_goal: '+15-20 lb' },
  { exercise_name: 'Tonal Cable Crunch', week4_goal: '+10%', week8_goal: '+20%', week12_goal: '+25-30%' },
  { exercise_name: 'Hanging Leg Raise', week4_goal: 'Add slow reps', week8_goal: 'Hold DB between feet', week12_goal: 'Increase DB weight' },
];

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY');
    process.exit(1);
  }

  const supabase = createClient(url, key);

  console.log('Seeding milestones...');
  const { error: mErr } = await supabase.from('milestones').upsert(milestones, { onConflict: 'description' });
  if (mErr) console.error('Milestone error:', mErr);
  else console.log(`  ${milestones.length} milestones seeded`);

  console.log('Seeding lifting targets...');
  const { error: tErr } = await supabase.from('lifting_targets').upsert(liftingTargets, { onConflict: 'exercise_name' });
  if (tErr) console.error('Target error:', tErr);
  else console.log(`  ${liftingTargets.length} targets seeded`);

  console.log('Done!');
}

main();
