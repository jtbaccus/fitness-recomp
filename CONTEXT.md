# Fitness Recomp App — CONTEXT.md

*Last updated: 2026-03-22*

## Overview

Mobile-first fitness tracking webapp for Jon's 12-week body recomposition program (March 24 – June 15, 2026). Built with Next.js 14, Supabase (PostgreSQL), Tailwind CSS, and Recharts. Designed as a phone-first PWA with dark fitness theme.

## Architecture

- **Frontend:** Next.js 14 App Router, React 18, Tailwind CSS
- **Backend:** Next.js API routes with dual-mode storage
- **Database:** Supabase PostgreSQL (production) with in-memory local-store fallback (dev)
- **Charts:** Recharts v3 for bodyweight sparkline
- **Deploy target:** Vercel + Supabase hosted

## Key Patterns

- **Dual storage:** Every API route checks `getSupabaseConfig()` — if not configured, falls back to `local-store.ts` (in-memory with auto-seeding)
- **No auth:** Single-user app, no RLS
- **Program-driven:** Workouts and nutrition targets determined by day-of-week schedule in `program-config.ts`
- **PR detection:** Epley formula (weight × (1 + reps/30)) computed server-side
- **Phone-first:** Fixed bottom nav with safe-area-inset, max-w-lg container, dark theme

## Database Schema

**12 tables across 2 migrations:**

Migration 001 (original):
- `workout_sessions`, `exercise_logs`, `nutrition_logs`, `check_ins`, `progress_photos`, `lifting_targets`, `milestones`

Migration 002 (meal planning — added 2026-03-22):
- `recipes` — ~14 meals with macro data, freezer-friendly flag, batch_yield
- `ingredients` — ~44 items with category, perishability, storage type
- `recipe_ingredients` — junction table linking recipes to ingredients with quantities
- `meal_plan` — daily meal slot assignments with from_batch flag for freezer meals
- `grocery_list_items` — generated lists with weekly/monthly types and check-off state

Migration 003 (seed data):
- Seeds all recipes, ingredients, recipe_ingredients, and stamps the weekly meal template across all 12 weeks

## Build Phases

### Phase 1 (2026-03-17): Core App
- Workout logger with exercise cards, set logging, PR detection, rest timer
- Nutrition tracker with day-type aware macro targets and compliance bars
- Check-in form (weight/waist/scores), progress page (charts, milestones, lifting targets)
- Program reference page, dashboard with compliance ring and bodyweight sparkline
- 7 database tables, 9 API routes, dark fitness theme

### Phase 2 (2026-03-22): Meal Planning + Calendar
- Calendar views: month grid + week strip with workout/meal indicators
- Day detail view: workout card + 4 meal slots with macro summary
- Meal swap picker modal for changing recipes
- 14 macro-targeted recipes (3 breakfasts, 3 lunches, 5 dinners, 3 snacks)
- 4 freezer-friendly batch recipes (turkey pasta, chicken stir-fry, shrimp fried rice, beef & broccoli)
- Grocery list generation: weekly (fresh) + monthly (pantry/bulk)
- Check-off grocery items, batch cook banner, category grouping
- Home tab replaced with Plan/Calendar tab, root redirects to /plan
- 5 new database tables, 4 new API routes, 10 new components

## Pages

| Route | Purpose |
|-------|---------|
| `/plan` | Calendar page — month grid, week strip, dashboard summary |
| `/plan/day/[date]` | Day detail — workout + meals + macro summary |
| `/plan/grocery` | Grocery lists — weekly/monthly with category grouping |
| `/workout` | Active workout session with set logging |
| `/workout/history` | Past workout sessions |
| `/nutrition` | Daily macro logger with compliance bars |
| `/checkins` | Weekly check-in form |
| `/progress` | Charts, milestones, lifting targets |
| `/program` | Static program reference |

## Current Status

- [x] Core app built and deployed to GitHub
- [x] Meal planning, calendar views, grocery lists added
- [ ] Supabase migration pushed (002 + 003)
- [ ] Vercel deployment
- [ ] Test on phone
- [ ] PWA install verification

## Companion Project

The planning docs and reference materials live in `projects/fitness-recomp/` (not a submodule — local project). That project has:
- Training split, exercise library, progression targets
- Nutrition plan, meal templates, adjustment rules
- 12-week calendar, weekly check-in template
- Current/goal physique images in `images/`
