# Fitness Recomp App — Upgrade Path

## Phase 1: Core App (2026-03-17) — COMPLETE

**Scope:** Full workout tracking, nutrition logging, check-ins, progress, and program reference.

**Files created:** 34 source files
- 9 API routes: workouts, exercises, exercises/last, nutrition, checkins, dashboard, milestones, targets, photos
- 7 pages: dashboard, workout, workout/history, nutrition, checkins, progress, program
- 9+ components: BottomNav, PageShell, ExerciseCard, SetRow, PRBadge, RestTimer, SessionHeader, WeekPhaseCard, ComplianceRing, BodyweightSparkline, TodayWorkoutCard
- 4 lib modules: local-store, program-config, supabase-helpers, utils
- 2 type files: database.ts, program.ts
- 1 SQL migration: 001_initial_schema.sql (7 tables)

**Status:** Pushed to GitHub. Local-store fallback works for dev.

---

## Phase 2: Meal Planning + Calendar Views (2026-03-22) — COMPLETE

**Scope:** Calendar views, meal planning, recipe management, grocery list generation, freezer batch cooking support. Home tab replaced with Plan/Calendar tab.

**Data layer:**
- `002_meal_planning_schema.sql` — 5 new tables: recipes, ingredients, recipe_ingredients, meal_plan, grocery_list_items
- `003_seed_meals.sql` — 14 recipes, 44 ingredients, junction links, 12-week meal plan stamp
- `meal-seed-data.ts` — TS seed constants with weekly template
- `database.ts` — 5 new interfaces + 3 union types (MealSlot, IngredientCategory, StorageType)
- `local-store.ts` — extended with CRUD for all 5 new tables + grocery generation logic

**API routes (4 new):**
- `/api/recipes` — GET with optional ingredient include
- `/api/meal-plan` — GET (by date/range), POST, DELETE
- `/api/grocery` — GET, POST (generate from meal plan), PATCH (toggle checked)
- `/api/plan/summary` — GET calendar data (workout types + meals + macro totals per day)

**Pages (3 new):**
- `/plan` — Month calendar grid + week strip + dashboard summary
- `/plan/day/[date]` — Day detail with workout card, 4 meal slots, macro summary, meal swap picker
- `/plan/grocery` — Weekly/monthly grocery lists with category grouping, batch cook banner, check-off

**Components (10 new):**
- `MonthCalendar.tsx`, `WeekStrip.tsx`, `DashboardSummary.tsx`
- `DayWorkoutCard.tsx`, `DayMealCard.tsx`, `DayMacroSummary.tsx`, `MealSlotPicker.tsx`
- `GrocerySection.tsx`, `GroceryItem.tsx`
- `shared/MacroBar.tsx` (extracted from nutrition page)

**Navigation changes:**
- BottomNav: Home → Plan (CalendarIcon)
- Root `/` redirects to `/plan`
- Nutrition page imports MacroBar from shared

**Recipes designed (14 total):**
- 3 breakfasts: Protein Oatmeal, Egg White Scramble, Greek Yogurt Bowl
- 3 lunches: Chicken Rice Bowl, Turkey Taco Bowl, Chicken Wrap
- 5 dinners: Turkey Pasta Bake*, Chicken Stir-Fry*, Shrimp Fried Rice*, Beef & Broccoli*, Chicken & Sweet Potato
- 3 snacks: Protein Shake, Cottage Cheese & Almonds, PB Toast + Protein
- (* = freezer-friendly, batch_yield: 4)

---

## Remaining Work

- [ ] Push Supabase migrations (002 + 003)
- [ ] Deploy to Vercel
- [ ] Test on phone (PWA install, touch interactions)
- [ ] Verify grocery list generation end-to-end with Supabase
- [ ] Add recipe CRUD (currently read-only — edit recipes via DB/seed)
- [ ] Progress photo upload flow
- [ ] Push notifications / PWA reminders
