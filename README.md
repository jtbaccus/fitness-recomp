# Fitness Recomp App

Mobile-first fitness tracking webapp for a 12-week body recomposition program. Built with Next.js 14, Supabase, Tailwind CSS, Recharts, and Vercel AI SDK.

## Features

- **Calendar & Meal Planning** — Month/week calendar views, day detail with 4 meal slots, AI-powered meal swapping
- **Recipe Browser** — 18 recipes with full cooking instructions, ingredient lists, macros, batch cooking info
- **AI Coach** — Weekly streaming advice based on check-in data and nutrition logs (GPT-5.2 via OpenRouter)
- **AI Fridge Recipe Generator** — Input ingredients on hand, AI generates a macro-fitting recipe
- **Grocery Lists** — Auto-generated weekly (fresh) and monthly (bulk/pantry) lists with check-off + PDF export
- **Workout View** — Full exercise list per day with target weight tracking for all exercises (DB, Tonal, bodyweight)
- **Nutrition Tracker** — Day-type aware macro targets with color-coded compliance bars
- **Check-Ins** — Weekly weight, waist, sleep/energy/compliance scoring
- **Progress** — Bodyweight chart, lifting targets, milestones
- **PDF Export** — Grocery lists, weekly meal schedules, individual recipes
- **Hello Fresh + Pizza Night** — Built-in support for external meal sources (Mon/Wed/Thu Hello Fresh, Fri Pizza)

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** + **Tailwind CSS** (dark fitness theme)
- **Supabase** (PostgreSQL via REST API)
- **Vercel AI SDK** + **OpenRouter** (GPT-5.2 for AI features)
- **jsPDF** (client-side PDF generation)
- **Recharts v3** (charts)
- **Local-store fallback** for development without Supabase

## Navigation

6-tab bottom nav:
- **Plan** — Calendar, day details with meals + full workout + target weights
- **Workout** — Active workout session, history
- **Recipes** — Browse all recipes, detail pages, AI recipe generator
- **Grocery** — Weekly/monthly grocery lists, PDF export
- **Track** — Sub-tabs: Nutrition | Check-In | Progress
- **Coach** — AI weekly coaching with summary cards

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

Copy the example and fill in credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# AI (optional — features degrade gracefully without these)
AI_API_KEY=your-openrouter-key
AI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=openai/gpt-5.2
```

**Without Supabase configured:** The app runs fully in local-store mode (in-memory, auto-seeded with sample data). All features work — data just won't persist across restarts.

**Without AI configured:** Meal swap falls back to macro-proximity sorting, coach gives rule-based suggestions, recipe generator is disabled.

### 3. Database setup (Supabase)

If you have a Supabase project:

```bash
# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations (creates tables + seeds data)
supabase db push --dns-resolver https
```

**Migrations:**
- `001_initial_schema.sql` — 7 core tables (workouts, exercises, nutrition, check-ins, photos, targets, milestones)
- `002_meal_planning_schema.sql` — 5 meal planning tables (recipes, ingredients, recipe_ingredients, meal_plan, grocery_list_items)
- `003_seed_meals.sql` — Seeds 18 recipes, 46 ingredients, recipe links, and 12-week meal template
- `004_recipe_instructions.sql` — Adds instructions column to recipes
- `005_seed_instructions.sql` — Seeds step-by-step cooking instructions for all recipes

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
- `AI_API_KEY`
- `AI_BASE_URL`
- `AI_MODEL`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── ai/                 AI routes (meal-swap, coach, generate-recipe)
│   │   ├── checkins/           GET, POST
│   │   ├── dashboard/          GET (aggregated)
│   │   ├── exercises/          GET, POST + /last
│   │   ├── grocery/            GET, POST (generate), PATCH (toggle)
│   │   ├── ingredients/        GET
│   │   ├── meal-plan/          GET, POST, DELETE
│   │   ├── milestones/         GET, POST, PATCH
│   │   ├── nutrition/          GET, POST (upsert)
│   │   ├── photos/             GET, POST, DELETE
│   │   ├── plan/summary/       GET (calendar data)
│   │   ├── recipes/            GET, POST + /[id] (?include=ingredients)
│   │   ├── targets/            GET, PATCH
│   │   └── workouts/           GET, POST, PATCH
│   ├── coach/                  AI Coach page
│   ├── grocery/                Standalone grocery page
│   ├── plan/                   Calendar + day detail
│   ├── recipes/                Recipe list + detail + AI generator
│   ├── track/                  Sub-tabs: nutrition, checkin, progress
│   └── workout/                Active session + history
├── components/
│   ├── BottomNav.tsx           6-tab navigation
│   ├── SubNav.tsx              Reusable sub-tab navigation
│   ├── PageShell.tsx           Page header wrapper
│   ├── coach/                  CoachAdvice, WeekSummaryCards
│   ├── dashboard/              WeekPhaseCard, ComplianceRing, etc.
│   ├── plan/                   MonthCalendar, WeekStrip, DayMealCard, AIMealSwapModal, etc.
│   ├── recipes/                RecipeCard, IngredientList
│   ├── shared/MacroBar.tsx     Reusable macro progress bar
│   └── workout/                ExerciseCard, SetRow, PRBadge, etc.
├── lib/
│   ├── ai-config.ts            AI provider configuration (OpenRouter/OpenAI)
│   ├── ai-prompts.ts           System prompts for all AI features
│   ├── grocery-pdf.ts          Grocery list PDF generator
│   ├── meal-schedule-pdf.ts    Weekly meal schedule PDF generator
│   ├── recipe-pdf.ts           Individual recipe PDF generator
│   ├── local-store.ts          In-memory fallback DB
│   ├── meal-seed-data.ts       Recipe/ingredient seed constants
│   ├── program-config.ts       Schedule, phases, exercises, targets
│   ├── supabase-helpers.ts     REST API wrapper
│   └── utils.ts                Date/format helpers
└── types/
    ├── database.ts             All DB interfaces
    └── program.ts              Program-specific types
```

## Meal Planning

18 recipes across 4 meal slots, designed around program macro targets:
- **Training days** (~2700 cal, 200g protein): higher-carb meals
- **Work days** (~2500 cal, 200g protein): moderate-carb meals

Weekly dinner rotation:
- **Sun:** Turkey Pasta Bake (batch cook day)
- **Mon:** Hello Fresh
- **Tue:** Shrimp Fried Rice (from batch)
- **Wed:** Hello Fresh
- **Thu:** Hello Fresh
- **Fri:** Pizza Night
- **Sat:** Chicken Stir-Fry

Dinners serve a family of 4. Breakfast/lunch/snacks are single-serving.

## Notes

- The app works without Supabase using the local-store fallback (great for development)
- Program dates: start 2026-03-23, end 2026-06-15
- Single-user app — no authentication or RLS
- Companion planning docs live in the sibling `fitness-recomp/` project (local, not a submodule)
