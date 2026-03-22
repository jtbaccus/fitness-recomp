-- Meal Planning Schema: recipes, ingredients, meal plans, grocery lists

-- Recipes (~12-15 meals the user rotates through)
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  meal_slot TEXT NOT NULL,            -- breakfast | lunch | dinner | snack
  servings INTEGER NOT NULL DEFAULT 1,
  calories_per_serving INTEGER,
  protein_per_serving INTEGER,
  carbs_per_serving INTEGER,
  fat_per_serving INTEGER,
  prep_time_min INTEGER,
  freezer_friendly BOOLEAN DEFAULT FALSE,
  batch_yield INTEGER DEFAULT 1,      -- portions when batch cooked
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Master ingredient list
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,             -- produce | protein | dairy | grains | pantry | frozen | condiment
  default_unit TEXT NOT NULL,         -- oz | g | cups | each | tbsp | lbs
  perishable BOOLEAN DEFAULT TRUE,
  storage_type TEXT NOT NULL DEFAULT 'fridge',  -- pantry | fridge | freezer
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipe <-> ingredient junction
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT
);
CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);

-- Daily meal assignments
CREATE TABLE meal_plan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  meal_slot TEXT NOT NULL,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  servings REAL NOT NULL DEFAULT 1,
  from_batch BOOLEAN DEFAULT FALSE,   -- true = from freezer, no new groceries needed
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_meal_plan_date ON meal_plan(date);
CREATE UNIQUE INDEX idx_meal_plan_date_slot ON meal_plan(date, meal_slot, recipe_id);

-- Generated grocery lists with check-off state
CREATE TABLE grocery_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_type TEXT NOT NULL,            -- weekly | monthly
  week_start DATE NOT NULL,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id),
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_grocery_list_week ON grocery_list_items(week_start, list_type);
