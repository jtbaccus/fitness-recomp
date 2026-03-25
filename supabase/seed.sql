-- Fitness Recomp App — Seed Data
-- Program start date: 2026-03-24

-- Milestones (10 items across 3 phases)
INSERT INTO milestones (description, target_date, phase) VALUES
  ('All 7 sessions completed in first week',        '2026-03-30', 'foundation'),
  ('Batch prep routine established',                 '2026-04-06', 'foundation'),
  ('Baseline weights recorded for all main lifts',   '2026-04-13', 'foundation'),
  ('Check-in #1: weight, waist, photos, lift review','2026-04-20', 'foundation'),
  ('First calorie adjustment decision',              '2026-04-27', 'progression'),
  ('Noticeable strength increases',                  '2026-05-04', 'progression'),
  ('Check-in #2: weight, waist, photos, lift comparison','2026-05-18', 'progression'),
  ('Second calorie adjustment decision if needed',   '2026-05-25', 'push'),
  ('All main lifts meaningfully above Week 1',       '2026-06-01', 'push'),
  ('Final assessment: photos, weight, waist, all lifts logged','2026-06-15', 'push')
ON CONFLICT DO NOTHING;

-- Lifting targets (16 exercises)
INSERT INTO lifting_targets (exercise_name, week4_goal, week8_goal, week12_goal) VALUES
  ('Incline Dumbbell Press',  '+10%',         '+15-20%',              '+20-25%'),
  ('Flat Dumbbell Bench',     '+10%',         '+15-20%',              '+20-25%'),
  ('Dumbbell Shoulder Press', '+10%',         '+15-20%',              '+20-25%'),
  ('Goblet Squat',            '+10%',         '+15-20%',              '+20-30%'),
  ('Bulgarian Split Squat',   '+10%',         '+15-20%',              '+20-25%'),
  ('Romanian Deadlift',       '+10%',         '+15-20%',              '+20-25%'),
  ('Hip Thrust',              '+10-15%',      '+20-25%',              '+25-35%'),
  ('Step-Ups',                '+10%',         '+15%',                 '+20%'),
  ('Reverse Lunge',           '+10%',         '+15%',                 '+20%'),
  ('Lateral Raise',           '+reps first',  '+5 lb',                '+5-10 lb'),
  ('Rear Delt Fly',           '+reps first',  '+5 lb',                '+5-10 lb'),
  ('Dumbbell Bicep Curl',     '+5 lb',        '+10 lb',               '+10-15 lb'),
  ('Triceps Pressdown',       '+reps first',  '+10%',                 '+15-20%'),
  ('Calf Raises',             '+reps first',  '+10 lb',               '+15-20 lb'),
  ('Tonal Cable Crunch',      '+10%',         '+20%',                 '+25-30%'),
  ('Hanging Leg Raise',       'Add slow reps','Hold DB between feet', 'Increase DB weight')
ON CONFLICT (exercise_name) DO NOTHING;
