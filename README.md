# Fitness Recomp App

Mobile-first fitness tracking webapp for a 12-week body recomposition program. Built with Next.js 14, Supabase, Tailwind CSS, and Recharts.

## Features

- **Calendar & Meal Planning** — Month/week calendar views, day detail with 4 meal slots, recipe swapping
- **Workout Logger** — Exercise cards with set/rep logging, PR detection (Epley formula), rest timer with vibration
- **Nutrition Tracker** — Day-type aware macro targets with color-coded compliance bars
- **Grocery Lists** — Auto-generated weekly (fresh) and monthly (bulk/pantry) lists with check-off
- **Check-Ins** — Weekly weight, waist, sleep/energy/compliance scoring
- **Progress** — Bodyweight chart, lifting targets, milestones
- **Program Reference** — Full training split rendered from config

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** + **Tailwind CSS** (dark fitness theme)
- **Supabase** (PostgreSQL via REST API)
- **Recharts v3** (charts)
- **Local-store fallback** for development without Supabase

## Setup on a New Machine

### 1. Clone and install

```bash
# If coming from the turing parent repo:
cd ~/turing
git submodule update --init --recursive
cd projects/fitness-recomp-app
npm install

# Or standalone:
git clone https://github.com/jtbaccus/fitness-recomp.git fitness-recomp-app
cd fitness-recomp-app
npm install
```

### 2. Environment variables

Copy the example and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

**Without Supabase configured:** The app runs fully in local-store mode (in-memory, auto-seeded with sample data). All features work — data just won't persist across restarts.

### 3. Database setup (Supabase)

If you have a Supabase project:

```bash
# Install Supabase CLI if needed
# (on Arch/Manjaro: already installed at /usr/bin/supabase)

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations (creates tables + seeds data)
supabase db push --dns-resolver https
```

**Migrations:**
- `001_initial_schema.sql` — 7 core tables (workouts, exercises, nutrition, check-ins, photos, targets, milestones)
- `002_meal_planning_schema.sql` — 5 meal planning tables (recipes, ingredients, recipe_ingredients, meal_plan, grocery_list_items)
- `003_seed_meals.sql` — Seeds 14 recipes, 44 ingredients, recipe links, and stamps the weekly meal template across all 12 weeks

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/plan` (calendar view).

### 5. Deploy to Vercel

```bash
npx vercel --prod
```

Set environment variables in the Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkins/          GET, POST
│   │   ├── dashboard/         GET (aggregated)
│   │   ├── exercises/         GET, POST + /last
│   │   ├── grocery/           GET, POST (generate), PATCH (toggle)
│   │   ├── meal-plan/         GET, POST, DELETE
│   │   ├── milestones/        GET, POST, PATCH
│   │   ├── nutrition/         GET, POST (upsert)
│   │   ├── photos/            GET, POST, DELETE
│   │   ├── plan/summary/      GET (calendar data)
│   │   ├── recipes/           GET (?include=ingredients)
│   │   ├── targets/           GET, PATCH
│   │   └── workouts/          GET, POST, PATCH
│   ├── checkins/page.tsx
│   ├── nutrition/page.tsx
│   ├── plan/
│   │   ├── page.tsx           Calendar view
│   │   ├── day/[date]/        Day detail
│   │   └── grocery/           Grocery lists
│   ├── program/page.tsx
│   ├── progress/page.tsx
│   └── workout/
│       ├── page.tsx           Active session
│       └── history/page.tsx
├── components/
│   ├── BottomNav.tsx          5-tab navigation
│   ├── PageShell.tsx          Page header wrapper
│   ├── dashboard/             WeekPhaseCard, ComplianceRing, etc.
│   ├── plan/                  MonthCalendar, WeekStrip, DayMealCard, etc.
│   ├── shared/MacroBar.tsx    Reusable macro progress bar
│   └── workout/               ExerciseCard, SetRow, PRBadge, etc.
├── lib/
│   ├── local-store.ts         In-memory fallback DB
│   ├── meal-seed-data.ts      Recipe/ingredient seed constants
│   ├── program-config.ts      Schedule, phases, exercises, targets
│   ├── supabase-helpers.ts    REST API wrapper
│   └── utils.ts               Date/format helpers
└── types/
    ├── database.ts            All DB interfaces
    └── program.ts             Program-specific types
```

## Meal Planning

The app includes 14 macro-targeted recipes designed around the program's nutrition targets:
- **Training days** (~2700 cal, 200g protein): higher-carb meals
- **Work days** (~2500 cal, 200g protein): moderate-carb meals

4 freezer-friendly batch recipes (batch_yield: 4) for Sunday batch cooking:
- Turkey Pasta Bake, Chicken Stir-Fry, Shrimp Fried Rice, Beef & Broccoli

Weekly template: batch cook Sunday, eat from freezer Mon-Wed, fresh cooking Thu-Sat.

## Notes

- The app works without Supabase using the local-store fallback (great for development)
- Program dates are hardcoded in `program-config.ts` (start: 2026-03-24, end: 2026-06-15)
- Single-user app — no authentication or RLS
- Companion planning docs live in the sibling `fitness-recomp/` project (local, not a submodule)
