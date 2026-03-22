// Seed data for meal planning: recipes, ingredients, and default weekly template
// Designed around the user's macro targets:
//   Training day: ~2700 cal, 200g protein, 300-330g carbs, 70-80g fat
//   Work day:     ~2500 cal, 200g protein, 230-270g carbs, 65-75g fat

import type { MealSlot, IngredientCategory, StorageType } from '@/types/database';

// ── Ingredients ──────────────────────────────────────────────────────────

export interface IngredientSeed {
  name: string;
  category: IngredientCategory;
  default_unit: string;
  perishable: boolean;
  storage_type: StorageType;
}

export const SEED_INGREDIENTS: IngredientSeed[] = [
  // Proteins
  { name: 'Chicken Breast', category: 'protein', default_unit: 'oz', perishable: true, storage_type: 'fridge' },
  { name: 'Ground Turkey (93% lean)', category: 'protein', default_unit: 'oz', perishable: true, storage_type: 'fridge' },
  { name: 'Shrimp (frozen)', category: 'protein', default_unit: 'oz', perishable: false, storage_type: 'freezer' },
  { name: 'Flank Steak', category: 'protein', default_unit: 'oz', perishable: true, storage_type: 'fridge' },
  { name: 'Eggs', category: 'protein', default_unit: 'each', perishable: true, storage_type: 'fridge' },
  { name: 'Egg Whites', category: 'protein', default_unit: 'cups', perishable: true, storage_type: 'fridge' },
  { name: 'Greek Yogurt (nonfat)', category: 'dairy', default_unit: 'cups', perishable: true, storage_type: 'fridge' },
  { name: 'Cottage Cheese (low-fat)', category: 'dairy', default_unit: 'cups', perishable: true, storage_type: 'fridge' },
  { name: 'Whey Protein Powder', category: 'pantry', default_unit: 'scoops', perishable: false, storage_type: 'pantry' },

  // Grains & Starches
  { name: 'White Rice', category: 'grains', default_unit: 'cups', perishable: false, storage_type: 'pantry' },
  { name: 'Whole Wheat Pasta', category: 'grains', default_unit: 'oz', perishable: false, storage_type: 'pantry' },
  { name: 'Oats (rolled)', category: 'grains', default_unit: 'cups', perishable: false, storage_type: 'pantry' },
  { name: 'Whole Wheat Tortillas', category: 'grains', default_unit: 'each', perishable: true, storage_type: 'pantry' },
  { name: 'Bread (whole wheat)', category: 'grains', default_unit: 'slices', perishable: true, storage_type: 'pantry' },
  { name: 'Sweet Potato', category: 'produce', default_unit: 'each', perishable: true, storage_type: 'pantry' },
  { name: 'Russet Potato', category: 'produce', default_unit: 'each', perishable: true, storage_type: 'pantry' },

  // Produce
  { name: 'Broccoli', category: 'produce', default_unit: 'cups', perishable: true, storage_type: 'fridge' },
  { name: 'Bell Pepper', category: 'produce', default_unit: 'each', perishable: true, storage_type: 'fridge' },
  { name: 'Spinach', category: 'produce', default_unit: 'cups', perishable: true, storage_type: 'fridge' },
  { name: 'Mixed Vegetables (frozen)', category: 'frozen', default_unit: 'cups', perishable: false, storage_type: 'freezer' },
  { name: 'Banana', category: 'produce', default_unit: 'each', perishable: true, storage_type: 'pantry' },
  { name: 'Berries (frozen)', category: 'frozen', default_unit: 'cups', perishable: false, storage_type: 'freezer' },
  { name: 'Onion', category: 'produce', default_unit: 'each', perishable: true, storage_type: 'pantry' },
  { name: 'Garlic', category: 'produce', default_unit: 'cloves', perishable: true, storage_type: 'pantry' },
  { name: 'Tomatoes (canned diced)', category: 'pantry', default_unit: 'oz', perishable: false, storage_type: 'pantry' },
  { name: 'Avocado', category: 'produce', default_unit: 'each', perishable: true, storage_type: 'fridge' },
  { name: 'Lettuce (romaine)', category: 'produce', default_unit: 'cups', perishable: true, storage_type: 'fridge' },

  // Fats & Dairy
  { name: 'Olive Oil', category: 'condiment', default_unit: 'tbsp', perishable: false, storage_type: 'pantry' },
  { name: 'Peanut Butter', category: 'pantry', default_unit: 'tbsp', perishable: false, storage_type: 'pantry' },
  { name: 'Almonds', category: 'pantry', default_unit: 'oz', perishable: false, storage_type: 'pantry' },
  { name: 'Shredded Cheese (reduced-fat)', category: 'dairy', default_unit: 'oz', perishable: true, storage_type: 'fridge' },

  // Condiments & Pantry
  { name: 'Soy Sauce (low-sodium)', category: 'condiment', default_unit: 'tbsp', perishable: false, storage_type: 'pantry' },
  { name: 'Hot Sauce', category: 'condiment', default_unit: 'tbsp', perishable: false, storage_type: 'pantry' },
  { name: 'Salsa', category: 'condiment', default_unit: 'tbsp', perishable: true, storage_type: 'fridge' },
  { name: 'Marinara Sauce', category: 'condiment', default_unit: 'cups', perishable: false, storage_type: 'pantry' },
  { name: 'Honey', category: 'pantry', default_unit: 'tbsp', perishable: false, storage_type: 'pantry' },
  { name: 'Rice Vinegar', category: 'condiment', default_unit: 'tbsp', perishable: false, storage_type: 'pantry' },
  { name: 'Sesame Oil', category: 'condiment', default_unit: 'tbsp', perishable: false, storage_type: 'pantry' },
  { name: 'Black Beans (canned)', category: 'pantry', default_unit: 'oz', perishable: false, storage_type: 'pantry' },
  { name: 'Chicken Broth', category: 'pantry', default_unit: 'cups', perishable: false, storage_type: 'pantry' },
  { name: 'Tortilla Chips', category: 'pantry', default_unit: 'oz', perishable: false, storage_type: 'pantry' },
  { name: 'Frozen Peas', category: 'frozen', default_unit: 'cups', perishable: false, storage_type: 'freezer' },
  { name: 'Green Onion', category: 'produce', default_unit: 'each', perishable: true, storage_type: 'fridge' },
  { name: 'Ginger', category: 'produce', default_unit: 'tbsp', perishable: true, storage_type: 'fridge' },
];

// ── Recipes ──────────────────────────────────────────────────────────────

export interface RecipeSeed {
  name: string;
  meal_slot: MealSlot;
  servings: number;
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
  prep_time_min: number;
  freezer_friendly: boolean;
  batch_yield: number;
  notes: string | null;
  ingredients: { ingredientName: string; quantity: number; unit: string; notes?: string }[];
}

export const SEED_RECIPES: RecipeSeed[] = [
  // ── BREAKFAST ────────────────────────────────────────────
  {
    name: 'Protein Oatmeal Bowl',
    meal_slot: 'breakfast',
    servings: 1,
    calories_per_serving: 550,
    protein_per_serving: 45,
    carbs_per_serving: 65,
    fat_per_serving: 12,
    prep_time_min: 10,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Mix whey into oats after cooking. Top with banana + PB.',
    ingredients: [
      { ingredientName: 'Oats (rolled)', quantity: 1, unit: 'cups' },
      { ingredientName: 'Whey Protein Powder', quantity: 1, unit: 'scoops' },
      { ingredientName: 'Banana', quantity: 1, unit: 'each' },
      { ingredientName: 'Peanut Butter', quantity: 1, unit: 'tbsp' },
    ],
  },
  {
    name: 'Egg White Scramble + Toast',
    meal_slot: 'breakfast',
    servings: 1,
    calories_per_serving: 480,
    protein_per_serving: 42,
    carbs_per_serving: 40,
    fat_per_serving: 14,
    prep_time_min: 15,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Scramble eggs + whites with spinach and peppers.',
    ingredients: [
      { ingredientName: 'Eggs', quantity: 2, unit: 'each' },
      { ingredientName: 'Egg Whites', quantity: 0.5, unit: 'cups' },
      { ingredientName: 'Spinach', quantity: 1, unit: 'cups' },
      { ingredientName: 'Bell Pepper', quantity: 0.5, unit: 'each' },
      { ingredientName: 'Bread (whole wheat)', quantity: 2, unit: 'slices' },
      { ingredientName: 'Olive Oil', quantity: 0.5, unit: 'tbsp' },
    ],
  },
  {
    name: 'Greek Yogurt Protein Bowl',
    meal_slot: 'breakfast',
    servings: 1,
    calories_per_serving: 500,
    protein_per_serving: 50,
    carbs_per_serving: 55,
    fat_per_serving: 10,
    prep_time_min: 5,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Mix protein powder into yogurt. Top with berries, oats, honey.',
    ingredients: [
      { ingredientName: 'Greek Yogurt (nonfat)', quantity: 1, unit: 'cups' },
      { ingredientName: 'Whey Protein Powder', quantity: 0.5, unit: 'scoops' },
      { ingredientName: 'Berries (frozen)', quantity: 0.5, unit: 'cups' },
      { ingredientName: 'Oats (rolled)', quantity: 0.25, unit: 'cups' },
      { ingredientName: 'Honey', quantity: 1, unit: 'tbsp' },
      { ingredientName: 'Almonds', quantity: 0.5, unit: 'oz' },
    ],
  },

  // ── LUNCH ────────────────────────────────────────────────
  {
    name: 'Chicken Rice Bowl',
    meal_slot: 'lunch',
    servings: 1,
    calories_per_serving: 650,
    protein_per_serving: 50,
    carbs_per_serving: 75,
    fat_per_serving: 14,
    prep_time_min: 25,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Simple chicken, rice, and broccoli bowl with soy sauce.',
    ingredients: [
      { ingredientName: 'Chicken Breast', quantity: 6, unit: 'oz' },
      { ingredientName: 'White Rice', quantity: 1, unit: 'cups', notes: 'dry measure' },
      { ingredientName: 'Broccoli', quantity: 1.5, unit: 'cups' },
      { ingredientName: 'Olive Oil', quantity: 0.5, unit: 'tbsp' },
      { ingredientName: 'Soy Sauce (low-sodium)', quantity: 1, unit: 'tbsp' },
    ],
  },
  {
    name: 'Turkey Taco Bowl',
    meal_slot: 'lunch',
    servings: 1,
    calories_per_serving: 620,
    protein_per_serving: 48,
    carbs_per_serving: 60,
    fat_per_serving: 18,
    prep_time_min: 20,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Ground turkey with black beans over rice, topped with salsa and cheese.',
    ingredients: [
      { ingredientName: 'Ground Turkey (93% lean)', quantity: 6, unit: 'oz' },
      { ingredientName: 'White Rice', quantity: 0.75, unit: 'cups', notes: 'dry measure' },
      { ingredientName: 'Black Beans (canned)', quantity: 4, unit: 'oz', notes: 'drained' },
      { ingredientName: 'Salsa', quantity: 3, unit: 'tbsp' },
      { ingredientName: 'Shredded Cheese (reduced-fat)', quantity: 1, unit: 'oz' },
      { ingredientName: 'Hot Sauce', quantity: 1, unit: 'tbsp' },
    ],
  },
  {
    name: 'Chicken Wrap',
    meal_slot: 'lunch',
    servings: 1,
    calories_per_serving: 580,
    protein_per_serving: 48,
    carbs_per_serving: 50,
    fat_per_serving: 16,
    prep_time_min: 15,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Grilled chicken with spinach, peppers, and cheese in a tortilla.',
    ingredients: [
      { ingredientName: 'Chicken Breast', quantity: 6, unit: 'oz' },
      { ingredientName: 'Whole Wheat Tortillas', quantity: 2, unit: 'each' },
      { ingredientName: 'Spinach', quantity: 1, unit: 'cups' },
      { ingredientName: 'Bell Pepper', quantity: 0.5, unit: 'each' },
      { ingredientName: 'Shredded Cheese (reduced-fat)', quantity: 1, unit: 'oz' },
    ],
  },

  // ── DINNER ───────────────────────────────────────────────
  {
    name: 'Turkey Pasta Bake',
    meal_slot: 'dinner',
    servings: 1,
    calories_per_serving: 700,
    protein_per_serving: 52,
    carbs_per_serving: 80,
    fat_per_serving: 16,
    prep_time_min: 35,
    freezer_friendly: true,
    batch_yield: 4,
    notes: 'Freezer-friendly batch cook. Turkey + marinara + pasta.',
    ingredients: [
      { ingredientName: 'Ground Turkey (93% lean)', quantity: 6, unit: 'oz' },
      { ingredientName: 'Whole Wheat Pasta', quantity: 3, unit: 'oz', notes: 'dry weight' },
      { ingredientName: 'Marinara Sauce', quantity: 0.5, unit: 'cups' },
      { ingredientName: 'Spinach', quantity: 1, unit: 'cups' },
      { ingredientName: 'Onion', quantity: 0.25, unit: 'each' },
      { ingredientName: 'Garlic', quantity: 2, unit: 'cloves' },
      { ingredientName: 'Olive Oil', quantity: 0.5, unit: 'tbsp' },
    ],
  },
  {
    name: 'Chicken Stir-Fry',
    meal_slot: 'dinner',
    servings: 1,
    calories_per_serving: 680,
    protein_per_serving: 50,
    carbs_per_serving: 78,
    fat_per_serving: 15,
    prep_time_min: 30,
    freezer_friendly: true,
    batch_yield: 4,
    notes: 'Freezer-friendly batch cook. Chicken + veggies over rice.',
    ingredients: [
      { ingredientName: 'Chicken Breast', quantity: 6, unit: 'oz' },
      { ingredientName: 'White Rice', quantity: 1, unit: 'cups', notes: 'dry measure' },
      { ingredientName: 'Broccoli', quantity: 1, unit: 'cups' },
      { ingredientName: 'Bell Pepper', quantity: 0.5, unit: 'each' },
      { ingredientName: 'Soy Sauce (low-sodium)', quantity: 1.5, unit: 'tbsp' },
      { ingredientName: 'Sesame Oil', quantity: 0.5, unit: 'tbsp' },
      { ingredientName: 'Garlic', quantity: 2, unit: 'cloves' },
      { ingredientName: 'Ginger', quantity: 0.5, unit: 'tbsp' },
    ],
  },
  {
    name: 'Shrimp Fried Rice',
    meal_slot: 'dinner',
    servings: 1,
    calories_per_serving: 640,
    protein_per_serving: 45,
    carbs_per_serving: 76,
    fat_per_serving: 14,
    prep_time_min: 25,
    freezer_friendly: true,
    batch_yield: 4,
    notes: 'Freezer-friendly batch cook. Use day-old rice for best results.',
    ingredients: [
      { ingredientName: 'Shrimp (frozen)', quantity: 6, unit: 'oz' },
      { ingredientName: 'White Rice', quantity: 1, unit: 'cups', notes: 'cooked day-old' },
      { ingredientName: 'Eggs', quantity: 2, unit: 'each' },
      { ingredientName: 'Frozen Peas', quantity: 0.5, unit: 'cups' },
      { ingredientName: 'Green Onion', quantity: 2, unit: 'each' },
      { ingredientName: 'Soy Sauce (low-sodium)', quantity: 1.5, unit: 'tbsp' },
      { ingredientName: 'Sesame Oil', quantity: 0.5, unit: 'tbsp' },
      { ingredientName: 'Garlic', quantity: 2, unit: 'cloves' },
    ],
  },
  {
    name: 'Beef & Broccoli',
    meal_slot: 'dinner',
    servings: 1,
    calories_per_serving: 720,
    protein_per_serving: 52,
    carbs_per_serving: 74,
    fat_per_serving: 20,
    prep_time_min: 30,
    freezer_friendly: true,
    batch_yield: 4,
    notes: 'Freezer-friendly batch cook. Flank steak sliced thin.',
    ingredients: [
      { ingredientName: 'Flank Steak', quantity: 6, unit: 'oz' },
      { ingredientName: 'White Rice', quantity: 1, unit: 'cups', notes: 'dry measure' },
      { ingredientName: 'Broccoli', quantity: 2, unit: 'cups' },
      { ingredientName: 'Soy Sauce (low-sodium)', quantity: 1.5, unit: 'tbsp' },
      { ingredientName: 'Garlic', quantity: 2, unit: 'cloves' },
      { ingredientName: 'Ginger', quantity: 0.5, unit: 'tbsp' },
      { ingredientName: 'Sesame Oil', quantity: 0.5, unit: 'tbsp' },
      { ingredientName: 'Honey', quantity: 0.5, unit: 'tbsp' },
    ],
  },
  {
    name: 'Chicken & Sweet Potato',
    meal_slot: 'dinner',
    servings: 1,
    calories_per_serving: 660,
    protein_per_serving: 50,
    carbs_per_serving: 70,
    fat_per_serving: 16,
    prep_time_min: 40,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Baked chicken breast with roasted sweet potato and veggies.',
    ingredients: [
      { ingredientName: 'Chicken Breast', quantity: 6, unit: 'oz' },
      { ingredientName: 'Sweet Potato', quantity: 1, unit: 'each' },
      { ingredientName: 'Broccoli', quantity: 1.5, unit: 'cups' },
      { ingredientName: 'Olive Oil', quantity: 1, unit: 'tbsp' },
    ],
  },

  // ── SNACKS ───────────────────────────────────────────────
  {
    name: 'Protein Shake + Banana',
    meal_slot: 'snack',
    servings: 1,
    calories_per_serving: 350,
    protein_per_serving: 35,
    carbs_per_serving: 40,
    fat_per_serving: 6,
    prep_time_min: 3,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Post-workout shake. Whey + banana + berries.',
    ingredients: [
      { ingredientName: 'Whey Protein Powder', quantity: 1, unit: 'scoops' },
      { ingredientName: 'Banana', quantity: 1, unit: 'each' },
      { ingredientName: 'Berries (frozen)', quantity: 0.5, unit: 'cups' },
    ],
  },
  {
    name: 'Cottage Cheese & Almonds',
    meal_slot: 'snack',
    servings: 1,
    calories_per_serving: 280,
    protein_per_serving: 30,
    carbs_per_serving: 12,
    fat_per_serving: 12,
    prep_time_min: 2,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Quick high-protein snack. Good for work days.',
    ingredients: [
      { ingredientName: 'Cottage Cheese (low-fat)', quantity: 1, unit: 'cups' },
      { ingredientName: 'Almonds', quantity: 1, unit: 'oz' },
    ],
  },
  {
    name: 'PB Toast + Protein',
    meal_slot: 'snack',
    servings: 1,
    calories_per_serving: 380,
    protein_per_serving: 32,
    carbs_per_serving: 35,
    fat_per_serving: 14,
    prep_time_min: 5,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Toast with peanut butter + protein shake on the side.',
    ingredients: [
      { ingredientName: 'Bread (whole wheat)', quantity: 2, unit: 'slices' },
      { ingredientName: 'Peanut Butter', quantity: 1.5, unit: 'tbsp' },
      { ingredientName: 'Whey Protein Powder', quantity: 0.5, unit: 'scoops' },
    ],
  },
];

// ── Default Weekly Template ──────────────────────────────────────────────
// Maps day-of-week to meal assignments. Sunday = batch cook day.
// Training days (Sun, Mon, Fri, Sat): higher-carb meals
// Work days (Tue-Thu): slightly lower-carb meals

export interface DayTemplateSeed {
  dayOfWeek: number; // 0=Sun
  meals: { slot: MealSlot; recipeName: string; from_batch: boolean }[];
}

export const WEEKLY_MEAL_TEMPLATE: DayTemplateSeed[] = [
  { // Sunday — batch cook day + training
    dayOfWeek: 0,
    meals: [
      { slot: 'breakfast', recipeName: 'Protein Oatmeal Bowl', from_batch: false },
      { slot: 'lunch', recipeName: 'Chicken Rice Bowl', from_batch: false },
      { slot: 'dinner', recipeName: 'Turkey Pasta Bake', from_batch: false },
      { slot: 'snack', recipeName: 'Protein Shake + Banana', from_batch: false },
    ],
  },
  { // Monday — training, eat from Sunday batch
    dayOfWeek: 1,
    meals: [
      { slot: 'breakfast', recipeName: 'Egg White Scramble + Toast', from_batch: false },
      { slot: 'lunch', recipeName: 'Turkey Taco Bowl', from_batch: false },
      { slot: 'dinner', recipeName: 'Chicken Stir-Fry', from_batch: true },
      { slot: 'snack', recipeName: 'Protein Shake + Banana', from_batch: false },
    ],
  },
  { // Tuesday — work day
    dayOfWeek: 2,
    meals: [
      { slot: 'breakfast', recipeName: 'Greek Yogurt Protein Bowl', from_batch: false },
      { slot: 'lunch', recipeName: 'Chicken Wrap', from_batch: false },
      { slot: 'dinner', recipeName: 'Shrimp Fried Rice', from_batch: true },
      { slot: 'snack', recipeName: 'Cottage Cheese & Almonds', from_batch: false },
    ],
  },
  { // Wednesday — work day
    dayOfWeek: 3,
    meals: [
      { slot: 'breakfast', recipeName: 'Protein Oatmeal Bowl', from_batch: false },
      { slot: 'lunch', recipeName: 'Chicken Rice Bowl', from_batch: false },
      { slot: 'dinner', recipeName: 'Beef & Broccoli', from_batch: true },
      { slot: 'snack', recipeName: 'Cottage Cheese & Almonds', from_batch: false },
    ],
  },
  { // Thursday — work day
    dayOfWeek: 4,
    meals: [
      { slot: 'breakfast', recipeName: 'Egg White Scramble + Toast', from_batch: false },
      { slot: 'lunch', recipeName: 'Turkey Taco Bowl', from_batch: false },
      { slot: 'dinner', recipeName: 'Chicken & Sweet Potato', from_batch: false },
      { slot: 'snack', recipeName: 'PB Toast + Protein', from_batch: false },
    ],
  },
  { // Friday — training
    dayOfWeek: 5,
    meals: [
      { slot: 'breakfast', recipeName: 'Protein Oatmeal Bowl', from_batch: false },
      { slot: 'lunch', recipeName: 'Chicken Rice Bowl', from_batch: false },
      { slot: 'dinner', recipeName: 'Turkey Pasta Bake', from_batch: true },
      { slot: 'snack', recipeName: 'Protein Shake + Banana', from_batch: false },
    ],
  },
  { // Saturday — training
    dayOfWeek: 6,
    meals: [
      { slot: 'breakfast', recipeName: 'Greek Yogurt Protein Bowl', from_batch: false },
      { slot: 'lunch', recipeName: 'Chicken Wrap', from_batch: false },
      { slot: 'dinner', recipeName: 'Chicken Stir-Fry', from_batch: false },
      { slot: 'snack', recipeName: 'Protein Shake + Banana', from_batch: false },
    ],
  },
];
