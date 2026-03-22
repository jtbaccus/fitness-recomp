-- Seed data for meal planning: recipes, ingredients, recipe-ingredient links, and 12-week meal plan

-- ── Ingredients ──────────────────────────────────────────────────────────

INSERT INTO ingredients (name, category, default_unit, perishable, storage_type) VALUES
  ('Chicken Breast', 'protein', 'oz', true, 'fridge'),
  ('Ground Turkey (93% lean)', 'protein', 'oz', true, 'fridge'),
  ('Shrimp (frozen)', 'protein', 'oz', false, 'freezer'),
  ('Flank Steak', 'protein', 'oz', true, 'fridge'),
  ('Eggs', 'protein', 'each', true, 'fridge'),
  ('Egg Whites', 'protein', 'cups', true, 'fridge'),
  ('Greek Yogurt (nonfat)', 'dairy', 'cups', true, 'fridge'),
  ('Cottage Cheese (low-fat)', 'dairy', 'cups', true, 'fridge'),
  ('Whey Protein Powder', 'pantry', 'scoops', false, 'pantry'),
  ('White Rice', 'grains', 'cups', false, 'pantry'),
  ('Whole Wheat Pasta', 'grains', 'oz', false, 'pantry'),
  ('Oats (rolled)', 'grains', 'cups', false, 'pantry'),
  ('Whole Wheat Tortillas', 'grains', 'each', true, 'pantry'),
  ('Bread (whole wheat)', 'grains', 'slices', true, 'pantry'),
  ('Sweet Potato', 'produce', 'each', true, 'pantry'),
  ('Russet Potato', 'produce', 'each', true, 'pantry'),
  ('Broccoli', 'produce', 'cups', true, 'fridge'),
  ('Bell Pepper', 'produce', 'each', true, 'fridge'),
  ('Spinach', 'produce', 'cups', true, 'fridge'),
  ('Mixed Vegetables (frozen)', 'frozen', 'cups', false, 'freezer'),
  ('Banana', 'produce', 'each', true, 'pantry'),
  ('Berries (frozen)', 'frozen', 'cups', false, 'freezer'),
  ('Onion', 'produce', 'each', true, 'pantry'),
  ('Garlic', 'produce', 'cloves', true, 'pantry'),
  ('Tomatoes (canned diced)', 'pantry', 'oz', false, 'pantry'),
  ('Avocado', 'produce', 'each', true, 'fridge'),
  ('Lettuce (romaine)', 'produce', 'cups', true, 'fridge'),
  ('Olive Oil', 'condiment', 'tbsp', false, 'pantry'),
  ('Peanut Butter', 'pantry', 'tbsp', false, 'pantry'),
  ('Almonds', 'pantry', 'oz', false, 'pantry'),
  ('Shredded Cheese (reduced-fat)', 'dairy', 'oz', true, 'fridge'),
  ('Soy Sauce (low-sodium)', 'condiment', 'tbsp', false, 'pantry'),
  ('Hot Sauce', 'condiment', 'tbsp', false, 'pantry'),
  ('Salsa', 'condiment', 'tbsp', true, 'fridge'),
  ('Marinara Sauce', 'condiment', 'cups', false, 'pantry'),
  ('Honey', 'pantry', 'tbsp', false, 'pantry'),
  ('Rice Vinegar', 'condiment', 'tbsp', false, 'pantry'),
  ('Sesame Oil', 'condiment', 'tbsp', false, 'pantry'),
  ('Black Beans (canned)', 'pantry', 'oz', false, 'pantry'),
  ('Chicken Broth', 'pantry', 'cups', false, 'pantry'),
  ('Tortilla Chips', 'pantry', 'oz', false, 'pantry'),
  ('Frozen Peas', 'frozen', 'cups', false, 'freezer'),
  ('Green Onion', 'produce', 'each', true, 'fridge'),
  ('Ginger', 'produce', 'tbsp', true, 'fridge');

-- ── Recipes ──────────────────────────────────────────────────────────────

INSERT INTO recipes (name, meal_slot, servings, calories_per_serving, protein_per_serving, carbs_per_serving, fat_per_serving, prep_time_min, freezer_friendly, batch_yield, notes) VALUES
  ('Protein Oatmeal Bowl', 'breakfast', 1, 550, 45, 65, 12, 10, false, 1, 'Mix whey into oats after cooking. Top with banana + PB.'),
  ('Egg White Scramble + Toast', 'breakfast', 1, 480, 42, 40, 14, 15, false, 1, 'Scramble eggs + whites with spinach and peppers.'),
  ('Greek Yogurt Protein Bowl', 'breakfast', 1, 500, 50, 55, 10, 5, false, 1, 'Mix protein powder into yogurt. Top with berries, oats, honey.'),
  ('Chicken Rice Bowl', 'lunch', 1, 650, 50, 75, 14, 25, false, 1, 'Simple chicken, rice, and broccoli bowl with soy sauce.'),
  ('Turkey Taco Bowl', 'lunch', 1, 620, 48, 60, 18, 20, false, 1, 'Ground turkey with black beans over rice, topped with salsa and cheese.'),
  ('Chicken Wrap', 'lunch', 1, 580, 48, 50, 16, 15, false, 1, 'Grilled chicken with spinach, peppers, and cheese in a tortilla.'),
  ('Turkey Pasta Bake', 'dinner', 1, 700, 52, 80, 16, 35, true, 4, 'Freezer-friendly batch cook. Turkey + marinara + pasta.'),
  ('Chicken Stir-Fry', 'dinner', 1, 680, 50, 78, 15, 30, true, 4, 'Freezer-friendly batch cook. Chicken + veggies over rice.'),
  ('Shrimp Fried Rice', 'dinner', 1, 640, 45, 76, 14, 25, true, 4, 'Freezer-friendly batch cook. Use day-old rice for best results.'),
  ('Beef & Broccoli', 'dinner', 1, 720, 52, 74, 20, 30, true, 4, 'Freezer-friendly batch cook. Flank steak sliced thin.'),
  ('Chicken & Sweet Potato', 'dinner', 1, 660, 50, 70, 16, 40, false, 1, 'Baked chicken breast with roasted sweet potato and veggies.'),
  ('Protein Shake + Banana', 'snack', 1, 350, 35, 40, 6, 3, false, 1, 'Post-workout shake. Whey + banana + berries.'),
  ('Cottage Cheese & Almonds', 'snack', 1, 280, 30, 12, 12, 2, false, 1, 'Quick high-protein snack. Good for work days.'),
  ('PB Toast + Protein', 'snack', 1, 380, 32, 35, 14, 5, false, 1, 'Toast with peanut butter + protein shake on the side.');

-- ── Recipe Ingredients (links) ──────────────────────────────────────────
-- Using subqueries to look up IDs by name

-- Protein Oatmeal Bowl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
  ((SELECT id FROM recipes WHERE name='Protein Oatmeal Bowl'), (SELECT id FROM ingredients WHERE name='Oats (rolled)'), 1, 'cups'),
  ((SELECT id FROM recipes WHERE name='Protein Oatmeal Bowl'), (SELECT id FROM ingredients WHERE name='Whey Protein Powder'), 1, 'scoops'),
  ((SELECT id FROM recipes WHERE name='Protein Oatmeal Bowl'), (SELECT id FROM ingredients WHERE name='Banana'), 1, 'each'),
  ((SELECT id FROM recipes WHERE name='Protein Oatmeal Bowl'), (SELECT id FROM ingredients WHERE name='Peanut Butter'), 1, 'tbsp');

-- Egg White Scramble + Toast
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
  ((SELECT id FROM recipes WHERE name='Egg White Scramble + Toast'), (SELECT id FROM ingredients WHERE name='Eggs'), 2, 'each'),
  ((SELECT id FROM recipes WHERE name='Egg White Scramble + Toast'), (SELECT id FROM ingredients WHERE name='Egg Whites'), 0.5, 'cups'),
  ((SELECT id FROM recipes WHERE name='Egg White Scramble + Toast'), (SELECT id FROM ingredients WHERE name='Spinach'), 1, 'cups'),
  ((SELECT id FROM recipes WHERE name='Egg White Scramble + Toast'), (SELECT id FROM ingredients WHERE name='Bell Pepper'), 0.5, 'each'),
  ((SELECT id FROM recipes WHERE name='Egg White Scramble + Toast'), (SELECT id FROM ingredients WHERE name='Bread (whole wheat)'), 2, 'slices'),
  ((SELECT id FROM recipes WHERE name='Egg White Scramble + Toast'), (SELECT id FROM ingredients WHERE name='Olive Oil'), 0.5, 'tbsp');

-- Greek Yogurt Protein Bowl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
  ((SELECT id FROM recipes WHERE name='Greek Yogurt Protein Bowl'), (SELECT id FROM ingredients WHERE name='Greek Yogurt (nonfat)'), 1, 'cups'),
  ((SELECT id FROM recipes WHERE name='Greek Yogurt Protein Bowl'), (SELECT id FROM ingredients WHERE name='Whey Protein Powder'), 0.5, 'scoops'),
  ((SELECT id FROM recipes WHERE name='Greek Yogurt Protein Bowl'), (SELECT id FROM ingredients WHERE name='Berries (frozen)'), 0.5, 'cups'),
  ((SELECT id FROM recipes WHERE name='Greek Yogurt Protein Bowl'), (SELECT id FROM ingredients WHERE name='Oats (rolled)'), 0.25, 'cups'),
  ((SELECT id FROM recipes WHERE name='Greek Yogurt Protein Bowl'), (SELECT id FROM ingredients WHERE name='Honey'), 1, 'tbsp'),
  ((SELECT id FROM recipes WHERE name='Greek Yogurt Protein Bowl'), (SELECT id FROM ingredients WHERE name='Almonds'), 0.5, 'oz');

-- Chicken Rice Bowl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
  ((SELECT id FROM recipes WHERE name='Chicken Rice Bowl'), (SELECT id FROM ingredients WHERE name='Chicken Breast'), 6, 'oz'),
  ((SELECT id FROM recipes WHERE name='Chicken Rice Bowl'), (SELECT id FROM ingredients WHERE name='White Rice'), 1, 'cups'),
  ((SELECT id FROM recipes WHERE name='Chicken Rice Bowl'), (SELECT id FROM ingredients WHERE name='Broccoli'), 1.5, 'cups'),
  ((SELECT id FROM recipes WHERE name='Chicken Rice Bowl'), (SELECT id FROM ingredients WHERE name='Olive Oil'), 0.5, 'tbsp'),
  ((SELECT id FROM recipes WHERE name='Chicken Rice Bowl'), (SELECT id FROM ingredients WHERE name='Soy Sauce (low-sodium)'), 1, 'tbsp');

-- Turkey Taco Bowl
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
  ((SELECT id FROM recipes WHERE name='Turkey Taco Bowl'), (SELECT id FROM ingredients WHERE name='Ground Turkey (93% lean)'), 6, 'oz'),
  ((SELECT id FROM recipes WHERE name='Turkey Taco Bowl'), (SELECT id FROM ingredients WHERE name='White Rice'), 0.75, 'cups'),
  ((SELECT id FROM recipes WHERE name='Turkey Taco Bowl'), (SELECT id FROM ingredients WHERE name='Black Beans (canned)'), 4, 'oz'),
  ((SELECT id FROM recipes WHERE name='Turkey Taco Bowl'), (SELECT id FROM ingredients WHERE name='Salsa'), 3, 'tbsp'),
  ((SELECT id FROM recipes WHERE name='Turkey Taco Bowl'), (SELECT id FROM ingredients WHERE name='Shredded Cheese (reduced-fat)'), 1, 'oz'),
  ((SELECT id FROM recipes WHERE name='Turkey Taco Bowl'), (SELECT id FROM ingredients WHERE name='Hot Sauce'), 1, 'tbsp');

-- Chicken Wrap
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
  ((SELECT id FROM recipes WHERE name='Chicken Wrap'), (SELECT id FROM ingredients WHERE name='Chicken Breast'), 6, 'oz'),
  ((SELECT id FROM recipes WHERE name='Chicken Wrap'), (SELECT id FROM ingredients WHERE name='Whole Wheat Tortillas'), 2, 'each'),
  ((SELECT id FROM recipes WHERE name='Chicken Wrap'), (SELECT id FROM ingredients WHERE name='Spinach'), 1, 'cups'),
  ((SELECT id FROM recipes WHERE name='Chicken Wrap'), (SELECT id FROM ingredients WHERE name='Bell Pepper'), 0.5, 'each'),
  ((SELECT id FROM recipes WHERE name='Chicken Wrap'), (SELECT id FROM ingredients WHERE name='Shredded Cheese (reduced-fat)'), 1, 'oz');

-- Turkey Pasta Bake
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
  ((SELECT id FROM recipes WHERE name='Turkey Pasta Bake'), (SELECT id FROM ingredients WHERE name='Ground Turkey (93% lean)'), 6, 'oz'),
  ((SELECT id FROM recipes WHERE name='Turkey Pasta Bake'), (SELECT id FROM ingredients WHERE name='Whole Wheat Pasta'), 3, 'oz'),
  ((SELECT id FROM recipes WHERE name='Turkey Pasta Bake'), (SELECT id FROM ingredients WHERE name='Marinara Sauce'), 0.5, 'cups'),
  ((SELECT id FROM recipes WHERE name='Turkey Pasta Bake'), (SELECT id FROM ingredients WHERE name='Spinach'), 1, 'cups'),
  ((SELECT id FROM recipes WHERE name='Turkey Pasta Bake'), (SELECT id FROM ingredients WHERE name='Onion'), 0.25, 'each'),
  ((SELECT id FROM recipes WHERE name='Turkey Pasta Bake'), (SELECT id FROM ingredients WHERE name='Garlic'), 2, 'cloves'),
  ((SELECT id FROM recipes WHERE name='Turkey Pasta Bake'), (SELECT id FROM ingredients WHERE name='Olive Oil'), 0.5, 'tbsp');

-- Chicken Stir-Fry
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
  ((SELECT id FROM recipes WHERE name='Chicken Stir-Fry'), (SELECT id FROM ingredients WHERE name='Chicken Breast'), 6, 'oz'),
  ((SELECT id FROM recipes WHERE name='Chicken Stir-Fry'), (SELECT id FROM ingredients WHERE name='White Rice'), 1, 'cups'),
  ((SELECT id FROM recipes WHERE name='Chicken Stir-Fry'), (SELECT id FROM ingredients WHERE name='Broccoli'), 1, 'cups'),
  ((SELECT id FROM recipes WHERE name='Chicken Stir-Fry'), (SELECT id FROM ingredients WHERE name='Bell Pepper'), 0.5, 'each'),
  ((SELECT id FROM recipes WHERE name='Chicken Stir-Fry'), (SELECT id FROM ingredients WHERE name='Soy Sauce (low-sodium)'), 1.5, 'tbsp'),
  ((SELECT id FROM recipes WHERE name='Chicken Stir-Fry'), (SELECT id FROM ingredients WHERE name='Sesame Oil'), 0.5, 'tbsp'),
  ((SELECT id FROM recipes WHERE name='Chicken Stir-Fry'), (SELECT id FROM ingredients WHERE name='Garlic'), 2, 'cloves'),
  ((SELECT id FROM recipes WHERE name='Chicken Stir-Fry'), (SELECT id FROM ingredients WHERE name='Ginger'), 0.5, 'tbsp');

-- Shrimp Fried Rice
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
  ((SELECT id FROM recipes WHERE name='Shrimp Fried Rice'), (SELECT id FROM ingredients WHERE name='Shrimp (frozen)'), 6, 'oz'),
  ((SELECT id FROM recipes WHERE name='Shrimp Fried Rice'), (SELECT id FROM ingredients WHERE name='White Rice'), 1, 'cups'),
  ((SELECT id FROM recipes WHERE name='Shrimp Fried Rice'), (SELECT id FROM ingredients WHERE name='Eggs'), 2, 'each'),
  ((SELECT id FROM recipes WHERE name='Shrimp Fried Rice'), (SELECT id FROM ingredients WHERE name='Frozen Peas'), 0.5, 'cups'),
  ((SELECT id FROM recipes WHERE name='Shrimp Fried Rice'), (SELECT id FROM ingredients WHERE name='Green Onion'), 2, 'each'),
  ((SELECT id FROM recipes WHERE name='Shrimp Fried Rice'), (SELECT id FROM ingredients WHERE name='Soy Sauce (low-sodium)'), 1.5, 'tbsp'),
  ((SELECT id FROM recipes WHERE name='Shrimp Fried Rice'), (SELECT id FROM ingredients WHERE name='Sesame Oil'), 0.5, 'tbsp'),
  ((SELECT id FROM recipes WHERE name='Shrimp Fried Rice'), (SELECT id FROM ingredients WHERE name='Garlic'), 2, 'cloves');

-- Beef & Broccoli
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
  ((SELECT id FROM recipes WHERE name='Beef & Broccoli'), (SELECT id FROM ingredients WHERE name='Flank Steak'), 6, 'oz'),
  ((SELECT id FROM recipes WHERE name='Beef & Broccoli'), (SELECT id FROM ingredients WHERE name='White Rice'), 1, 'cups'),
  ((SELECT id FROM recipes WHERE name='Beef & Broccoli'), (SELECT id FROM ingredients WHERE name='Broccoli'), 2, 'cups'),
  ((SELECT id FROM recipes WHERE name='Beef & Broccoli'), (SELECT id FROM ingredients WHERE name='Soy Sauce (low-sodium)'), 1.5, 'tbsp'),
  ((SELECT id FROM recipes WHERE name='Beef & Broccoli'), (SELECT id FROM ingredients WHERE name='Garlic'), 2, 'cloves'),
  ((SELECT id FROM recipes WHERE name='Beef & Broccoli'), (SELECT id FROM ingredients WHERE name='Ginger'), 0.5, 'tbsp'),
  ((SELECT id FROM recipes WHERE name='Beef & Broccoli'), (SELECT id FROM ingredients WHERE name='Sesame Oil'), 0.5, 'tbsp'),
  ((SELECT id FROM recipes WHERE name='Beef & Broccoli'), (SELECT id FROM ingredients WHERE name='Honey'), 0.5, 'tbsp');

-- Chicken & Sweet Potato
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
  ((SELECT id FROM recipes WHERE name='Chicken & Sweet Potato'), (SELECT id FROM ingredients WHERE name='Chicken Breast'), 6, 'oz'),
  ((SELECT id FROM recipes WHERE name='Chicken & Sweet Potato'), (SELECT id FROM ingredients WHERE name='Sweet Potato'), 1, 'each'),
  ((SELECT id FROM recipes WHERE name='Chicken & Sweet Potato'), (SELECT id FROM ingredients WHERE name='Broccoli'), 1.5, 'cups'),
  ((SELECT id FROM recipes WHERE name='Chicken & Sweet Potato'), (SELECT id FROM ingredients WHERE name='Olive Oil'), 1, 'tbsp');

-- Protein Shake + Banana
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
  ((SELECT id FROM recipes WHERE name='Protein Shake + Banana'), (SELECT id FROM ingredients WHERE name='Whey Protein Powder'), 1, 'scoops'),
  ((SELECT id FROM recipes WHERE name='Protein Shake + Banana'), (SELECT id FROM ingredients WHERE name='Banana'), 1, 'each'),
  ((SELECT id FROM recipes WHERE name='Protein Shake + Banana'), (SELECT id FROM ingredients WHERE name='Berries (frozen)'), 0.5, 'cups');

-- Cottage Cheese & Almonds
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
  ((SELECT id FROM recipes WHERE name='Cottage Cheese & Almonds'), (SELECT id FROM ingredients WHERE name='Cottage Cheese (low-fat)'), 1, 'cups'),
  ((SELECT id FROM recipes WHERE name='Cottage Cheese & Almonds'), (SELECT id FROM ingredients WHERE name='Almonds'), 1, 'oz');

-- PB Toast + Protein
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
  ((SELECT id FROM recipes WHERE name='PB Toast + Protein'), (SELECT id FROM ingredients WHERE name='Bread (whole wheat)'), 2, 'slices'),
  ((SELECT id FROM recipes WHERE name='PB Toast + Protein'), (SELECT id FROM ingredients WHERE name='Peanut Butter'), 1.5, 'tbsp'),
  ((SELECT id FROM recipes WHERE name='PB Toast + Protein'), (SELECT id FROM ingredients WHERE name='Whey Protein Powder'), 0.5, 'scoops');

-- ── 12-Week Meal Plan ────────────────────────────────────────────────────
-- Stamps the weekly template across all 12 weeks (84 days) starting 2026-03-24
-- Day template:
--   Sun: Oatmeal / Chicken Rice / Turkey Pasta Bake / Shake
--   Mon: Egg Scramble / Turkey Taco / Chicken Stir-Fry(batch) / Shake
--   Tue: Yogurt Bowl / Chicken Wrap / Shrimp Fried Rice(batch) / Cottage Cheese
--   Wed: Oatmeal / Chicken Rice / Beef & Broccoli(batch) / Cottage Cheese
--   Thu: Egg Scramble / Turkey Taco / Chicken & Sweet Potato / PB Toast
--   Fri: Oatmeal / Chicken Rice / Turkey Pasta Bake(batch) / Shake
--   Sat: Yogurt Bowl / Chicken Wrap / Chicken Stir-Fry / Shake

DO $$
DECLARE
  start_date DATE := '2026-03-24';
  d DATE;
  dow INT;
BEGIN
  FOR week_num IN 0..11 LOOP
    FOR day_num IN 0..6 LOOP
      d := start_date + (week_num * 7 + day_num);
      dow := EXTRACT(DOW FROM d); -- 0=Sun

      CASE dow
        WHEN 0 THEN -- Sunday
          INSERT INTO meal_plan (date, meal_slot, recipe_id, servings, from_batch) VALUES
            (d, 'breakfast', (SELECT id FROM recipes WHERE name='Protein Oatmeal Bowl'), 1, false),
            (d, 'lunch', (SELECT id FROM recipes WHERE name='Chicken Rice Bowl'), 1, false),
            (d, 'dinner', (SELECT id FROM recipes WHERE name='Turkey Pasta Bake'), 1, false),
            (d, 'snack', (SELECT id FROM recipes WHERE name='Protein Shake + Banana'), 1, false);
        WHEN 1 THEN -- Monday
          INSERT INTO meal_plan (date, meal_slot, recipe_id, servings, from_batch) VALUES
            (d, 'breakfast', (SELECT id FROM recipes WHERE name='Egg White Scramble + Toast'), 1, false),
            (d, 'lunch', (SELECT id FROM recipes WHERE name='Turkey Taco Bowl'), 1, false),
            (d, 'dinner', (SELECT id FROM recipes WHERE name='Chicken Stir-Fry'), 1, true),
            (d, 'snack', (SELECT id FROM recipes WHERE name='Protein Shake + Banana'), 1, false);
        WHEN 2 THEN -- Tuesday
          INSERT INTO meal_plan (date, meal_slot, recipe_id, servings, from_batch) VALUES
            (d, 'breakfast', (SELECT id FROM recipes WHERE name='Greek Yogurt Protein Bowl'), 1, false),
            (d, 'lunch', (SELECT id FROM recipes WHERE name='Chicken Wrap'), 1, false),
            (d, 'dinner', (SELECT id FROM recipes WHERE name='Shrimp Fried Rice'), 1, true),
            (d, 'snack', (SELECT id FROM recipes WHERE name='Cottage Cheese & Almonds'), 1, false);
        WHEN 3 THEN -- Wednesday
          INSERT INTO meal_plan (date, meal_slot, recipe_id, servings, from_batch) VALUES
            (d, 'breakfast', (SELECT id FROM recipes WHERE name='Protein Oatmeal Bowl'), 1, false),
            (d, 'lunch', (SELECT id FROM recipes WHERE name='Chicken Rice Bowl'), 1, false),
            (d, 'dinner', (SELECT id FROM recipes WHERE name='Beef & Broccoli'), 1, true),
            (d, 'snack', (SELECT id FROM recipes WHERE name='Cottage Cheese & Almonds'), 1, false);
        WHEN 4 THEN -- Thursday
          INSERT INTO meal_plan (date, meal_slot, recipe_id, servings, from_batch) VALUES
            (d, 'breakfast', (SELECT id FROM recipes WHERE name='Egg White Scramble + Toast'), 1, false),
            (d, 'lunch', (SELECT id FROM recipes WHERE name='Turkey Taco Bowl'), 1, false),
            (d, 'dinner', (SELECT id FROM recipes WHERE name='Chicken & Sweet Potato'), 1, false),
            (d, 'snack', (SELECT id FROM recipes WHERE name='PB Toast + Protein'), 1, false);
        WHEN 5 THEN -- Friday
          INSERT INTO meal_plan (date, meal_slot, recipe_id, servings, from_batch) VALUES
            (d, 'breakfast', (SELECT id FROM recipes WHERE name='Protein Oatmeal Bowl'), 1, false),
            (d, 'lunch', (SELECT id FROM recipes WHERE name='Chicken Rice Bowl'), 1, false),
            (d, 'dinner', (SELECT id FROM recipes WHERE name='Turkey Pasta Bake'), 1, true),
            (d, 'snack', (SELECT id FROM recipes WHERE name='Protein Shake + Banana'), 1, false);
        WHEN 6 THEN -- Saturday
          INSERT INTO meal_plan (date, meal_slot, recipe_id, servings, from_batch) VALUES
            (d, 'breakfast', (SELECT id FROM recipes WHERE name='Greek Yogurt Protein Bowl'), 1, false),
            (d, 'lunch', (SELECT id FROM recipes WHERE name='Chicken Wrap'), 1, false),
            (d, 'dinner', (SELECT id FROM recipes WHERE name='Chicken Stir-Fry'), 1, false),
            (d, 'snack', (SELECT id FROM recipes WHERE name='Protein Shake + Banana'), 1, false);
      END CASE;
    END LOOP;
  END LOOP;
END $$;
