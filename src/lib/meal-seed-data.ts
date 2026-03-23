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
  { name: 'Turkey Sausage', category: 'protein', default_unit: 'oz', perishable: true, storage_type: 'fridge' },
  { name: 'Granola', category: 'grains', default_unit: 'cups', perishable: false, storage_type: 'pantry' },
  { name: 'Premier Protein Shake', category: 'protein', default_unit: 'each', perishable: false, storage_type: 'pantry' },
  { name: 'Deli Turkey', category: 'protein', default_unit: 'oz', perishable: true, storage_type: 'fridge' },
  { name: 'Cheese Stick (string cheese)', category: 'dairy', default_unit: 'each', perishable: true, storage_type: 'fridge' },
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
  instructions: string | null;
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
    instructions: '1. Bring 2 cups water to a boil in a small pot.\n2. Add rolled oats, reduce heat to medium-low, and cook 5 minutes, stirring occasionally.\n3. Remove from heat. Let cool 1 minute, then stir in whey protein powder until smooth (adding while too hot makes it clumpy).\n4. Transfer to a bowl. Top with sliced banana and a drizzle of peanut butter.',
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
    instructions: '1. Dice bell pepper. Crack eggs into a bowl, add egg whites, and whisk together.\n2. Heat olive oil in a nonstick skillet over medium heat.\n3. Add diced pepper, cook 2 minutes until softened.\n4. Add spinach, stir until wilted (about 30 seconds).\n5. Pour in egg mixture. Gently push eggs from edges to center as they set, about 2-3 minutes.\n6. While eggs cook, toast bread.\n7. Plate scramble alongside toast. Season with salt and pepper.',
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
    instructions: '1. Scoop Greek yogurt into a bowl.\n2. Add protein powder and stir until fully combined (add a splash of water if too thick).\n3. Top with frozen berries (they\'ll thaw as you eat), rolled oats, chopped almonds, and a drizzle of honey.',
    ingredients: [
      { ingredientName: 'Greek Yogurt (nonfat)', quantity: 1, unit: 'cups' },
      { ingredientName: 'Whey Protein Powder', quantity: 0.5, unit: 'scoops' },
      { ingredientName: 'Berries (frozen)', quantity: 0.5, unit: 'cups' },
      { ingredientName: 'Oats (rolled)', quantity: 0.25, unit: 'cups' },
      { ingredientName: 'Honey', quantity: 1, unit: 'tbsp' },
      { ingredientName: 'Almonds', quantity: 0.5, unit: 'oz' },
    ],
  },
  {
    name: 'Breakfast Burrito',
    meal_slot: 'breakfast',
    servings: 1,
    calories_per_serving: 510,
    protein_per_serving: 44,
    carbs_per_serving: 42,
    fat_per_serving: 14,
    prep_time_min: 10,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Scramble egg whites with turkey sausage and peppers. Wrap in tortilla with salsa.',
    instructions: '1. Dice bell pepper. Slice or crumble turkey sausage into small pieces.\n2. Heat a nonstick skillet over medium heat. Cook turkey sausage 3-4 minutes until browned.\n3. Add diced pepper and spinach, cook 1-2 minutes until wilted.\n4. Pour in egg whites, scramble with the sausage and veggies until set, about 2 minutes.\n5. Warm tortilla in microwave 15 seconds or on a dry skillet.\n6. Spoon filling into center of tortilla, top with salsa, and wrap burrito-style.',
    ingredients: [
      { ingredientName: 'Egg Whites', quantity: 0.75, unit: 'cups' },
      { ingredientName: 'Turkey Sausage', quantity: 3, unit: 'oz' },
      { ingredientName: 'Bell Pepper', quantity: 0.5, unit: 'each' },
      { ingredientName: 'Whole Wheat Tortillas', quantity: 1, unit: 'each' },
      { ingredientName: 'Salsa', quantity: 2, unit: 'tbsp' },
      { ingredientName: 'Spinach', quantity: 0.5, unit: 'cups' },
    ],
  },
  {
    name: 'Smoothie Bowl',
    meal_slot: 'breakfast',
    servings: 1,
    calories_per_serving: 530,
    protein_per_serving: 48,
    carbs_per_serving: 60,
    fat_per_serving: 8,
    prep_time_min: 5,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Blend protein, yogurt, berries, banana thick. Top with granola.',
    instructions: '1. Add frozen berries, banana (broken into chunks), Greek yogurt, and protein powder to a blender.\n2. Blend on high until thick and smooth — use minimal liquid so it stays spoonable (add 2-3 tbsp water only if needed).\n3. Pour into a bowl. Top with granola.\n4. Eat immediately — it melts fast.',
    ingredients: [
      { ingredientName: 'Whey Protein Powder', quantity: 1, unit: 'scoops' },
      { ingredientName: 'Greek Yogurt (nonfat)', quantity: 0.5, unit: 'cups' },
      { ingredientName: 'Berries (frozen)', quantity: 0.75, unit: 'cups' },
      { ingredientName: 'Banana', quantity: 1, unit: 'each' },
      { ingredientName: 'Granola', quantity: 0.25, unit: 'cups' },
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
    instructions: '1. Cook rice according to package directions (1 cup dry = ~2 cups cooked).\n2. While rice cooks, slice chicken breast into strips. Season with salt and pepper.\n3. Heat olive oil in a skillet over medium-high. Cook chicken 5-6 minutes per side until internal temp reaches 165\u00b0F.\n4. Steam or microwave broccoli until tender-crisp, about 3 minutes.\n5. Slice chicken. Assemble bowl: rice on bottom, chicken and broccoli on top.\n6. Drizzle with soy sauce.',
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
    instructions: '1. Cook rice according to package directions.\n2. Brown ground turkey in a skillet over medium-high heat, breaking into crumbles, 5-6 minutes.\n3. Add taco seasoning (or cumin + chili powder + garlic powder) and a splash of water. Stir to coat.\n4. Drain and rinse black beans. Add to turkey, heat through.\n5. Assemble bowl: rice, turkey-bean mixture, salsa, shredded cheese, hot sauce.',
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
    instructions: '1. Slice chicken breast thin. Season with salt, pepper, and garlic powder.\n2. Cook chicken in a hot skillet 3-4 minutes per side until cooked through.\n3. Slice cooked chicken into strips. Slice bell pepper into strips.\n4. Warm tortillas in microwave 15 seconds.\n5. Layer each tortilla: spinach, chicken strips, pepper strips, shredded cheese.\n6. Roll tight, tucking in the sides. Cut in half diagonally.',
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
    instructions: 'BATCH COOK (makes 4 servings):\n1. Boil pasta according to package directions. Drain and set aside.\n2. Dice onion and mince garlic. Heat olive oil in a large skillet over medium-high.\n3. Cook onion 3 minutes, add garlic for 30 seconds.\n4. Add ground turkey, break into crumbles, cook 6-7 minutes until no pink remains.\n5. Add marinara sauce and spinach. Stir until spinach wilts.\n6. Combine pasta with turkey sauce. Mix well.\n7. Divide into 4 equal portions.\n\nFREEZER STORAGE:\n- Let cool completely. Portion into freezer-safe containers.\n- Label with date. Freezes well for 2-3 months.\n- Reheat: microwave 3-4 minutes, stirring halfway.',
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
    instructions: 'BATCH COOK (makes 4 servings):\n1. Cook rice according to package directions. Set aside.\n2. Slice chicken breast into thin strips. Mince garlic and ginger.\n3. Heat sesame oil in a large wok or skillet over high heat.\n4. Stir-fry chicken strips 4-5 minutes until cooked through. Remove and set aside.\n5. Add broccoli and sliced bell pepper to the wok. Stir-fry 3-4 minutes until tender-crisp.\n6. Return chicken to wok. Add soy sauce, toss everything together for 1 minute.\n7. Divide rice and stir-fry into 4 portions.\n\nFREEZER STORAGE:\n- Keep rice and stir-fry together or separate. Cool completely before sealing.\n- Reheat: microwave 3-4 minutes. Add a splash of water if rice is dry.',
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
    instructions: 'BATCH COOK (makes 4 servings):\n1. Use day-old refrigerated rice (fresh rice is too wet). If cooking fresh, spread on a sheet pan and refrigerate 1 hour.\n2. Thaw shrimp if frozen. Pat dry. Mince garlic and slice green onions.\n3. Heat sesame oil in a large wok over high heat.\n4. Scramble eggs in the wok, break into pieces, remove and set aside.\n5. Add shrimp to wok, cook 2 minutes per side. Remove.\n6. Add rice to wok, press flat, let it crisp 2 minutes before stirring. Repeat.\n7. Add peas, garlic, soy sauce. Toss 2 minutes.\n8. Return eggs and shrimp. Toss to combine. Top with green onions.\n9. Divide into 4 portions.\n\nFREEZER STORAGE:\n- Cool completely. Freeze in sealed containers up to 2 months.\n- Reheat: microwave 3-4 minutes, stirring halfway.',
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
    instructions: 'BATCH COOK (makes 4 servings):\n1. Cook rice according to package directions.\n2. Slice flank steak against the grain into thin strips. Mince garlic and ginger.\n3. Mix sauce: soy sauce + honey + 1 tbsp water.\n4. Heat sesame oil in a large skillet or wok over high heat.\n5. Sear beef strips in batches (don\'t crowd the pan) — 2 minutes per side for medium. Remove.\n6. Add broccoli to the pan with 2 tbsp water. Cover and steam 3 minutes.\n7. Return beef, pour sauce over everything. Toss 1 minute until glazed.\n8. Serve over rice. Divide into 4 portions.\n\nFREEZER STORAGE:\n- Cool completely. Store sauce/beef/broccoli together, rice can be separate.\n- Reheat: microwave 3-4 minutes.',
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
    instructions: '1. Preheat oven to 400\u00b0F.\n2. Cut sweet potato into 1-inch cubes. Toss with half the olive oil, salt, and pepper.\n3. Spread sweet potato on a sheet pan. Roast 15 minutes.\n4. Meanwhile, season chicken breast with salt, pepper, and garlic powder. Rub with remaining olive oil.\n5. After 15 minutes, add chicken and broccoli to the sheet pan.\n6. Roast another 20-25 minutes until chicken reaches 165\u00b0F and sweet potato is fork-tender.\n7. Let chicken rest 5 minutes before slicing. Plate everything together.',
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
    calories_per_serving: 270,
    protein_per_serving: 30,
    carbs_per_serving: 32,
    fat_per_serving: 2,
    prep_time_min: 1,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Premier Protein shake (premade, 30g protein) + banana.',
    instructions: '1. Grab a Premier Protein shake from the pantry.\n2. Shake well and open.\n3. Eat a banana alongside it.\n\nTip: Keep shakes at room temp or refrigerate if you prefer them cold.',
    ingredients: [
      { ingredientName: 'Premier Protein Shake', quantity: 1, unit: 'each' },
      { ingredientName: 'Banana', quantity: 1, unit: 'each' },
    ],
  },
  {
    name: 'Turkey Roll-Ups',
    meal_slot: 'snack',
    servings: 1,
    calories_per_serving: 270,
    protein_per_serving: 32,
    carbs_per_serving: 5,
    fat_per_serving: 14,
    prep_time_min: 2,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Deli turkey wrapped around cheese stick + almonds on the side.',
    instructions: '1. Lay out turkey slices flat.\n2. Place cheese stick at one end of each slice.\n3. Roll turkey around the cheese.\n4. Eat with almonds on the side.\n\nTip: Pack in a container for work — keeps well in the fridge all day.',
    ingredients: [
      { ingredientName: 'Deli Turkey', quantity: 4, unit: 'oz' },
      { ingredientName: 'Cheese Stick (string cheese)', quantity: 1, unit: 'each' },
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
    instructions: '1. Toast bread to desired darkness.\n2. Spread peanut butter evenly on both slices.\n3. Mix protein powder with 8 oz cold water in a shaker bottle. Shake 15 seconds.\n4. Drink the shake alongside the toast.',
    ingredients: [
      { ingredientName: 'Bread (whole wheat)', quantity: 2, unit: 'slices' },
      { ingredientName: 'Peanut Butter', quantity: 1.5, unit: 'tbsp' },
      { ingredientName: 'Whey Protein Powder', quantity: 0.5, unit: 'scoops' },
    ],
  },
  {
    name: 'Hello Fresh Dinner',
    meal_slot: 'dinner',
    servings: 1,
    calories_per_serving: 650,
    protein_per_serving: 35,
    carbs_per_serving: 70,
    fat_per_serving: 25,
    prep_time_min: 30,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Hello Fresh meal kit — varies weekly. Box arrives Wednesday.',
    instructions: '1. Follow the Hello Fresh recipe card included in the box.\n2. Prep time and ingredients vary by recipe.\n3. Typical serving: ~650 cal, moderate protein.',
    ingredients: [],
  },
  {
    name: 'Pizza Night',
    meal_slot: 'dinner',
    servings: 1,
    calories_per_serving: 800,
    protein_per_serving: 30,
    carbs_per_serving: 85,
    fat_per_serving: 35,
    prep_time_min: 0,
    freezer_friendly: false,
    batch_yield: 1,
    notes: 'Friday pizza night — delivery or homemade.',
    instructions: 'Order your favorite pizza or make one at home.\n\nMacro estimate is for ~3 slices of a medium pizza.\nAdjust portions to stay within daily targets.',
    ingredients: [],
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
      { slot: 'breakfast', recipeName: 'Smoothie Bowl', from_batch: false },
      { slot: 'lunch', recipeName: 'Chicken Rice Bowl', from_batch: false },
      { slot: 'dinner', recipeName: 'Turkey Pasta Bake', from_batch: false },
      { slot: 'snack', recipeName: 'Protein Shake + Banana', from_batch: false },
    ],
  },
  { // Monday — training, Hello Fresh dinner
    dayOfWeek: 1,
    meals: [
      { slot: 'breakfast', recipeName: 'Egg White Scramble + Toast', from_batch: false },
      { slot: 'lunch', recipeName: 'Turkey Taco Bowl', from_batch: false },
      { slot: 'dinner', recipeName: 'Hello Fresh Dinner', from_batch: false },
      { slot: 'snack', recipeName: 'Protein Shake + Banana', from_batch: false },
    ],
  },
  { // Tuesday — work day
    dayOfWeek: 2,
    meals: [
      { slot: 'breakfast', recipeName: 'Greek Yogurt Protein Bowl', from_batch: false },
      { slot: 'lunch', recipeName: 'Chicken Wrap', from_batch: false },
      { slot: 'dinner', recipeName: 'Shrimp Fried Rice', from_batch: true },
      { slot: 'snack', recipeName: 'Turkey Roll-Ups', from_batch: false },
    ],
  },
  { // Wednesday — work day, Hello Fresh dinner
    dayOfWeek: 3,
    meals: [
      { slot: 'breakfast', recipeName: 'Breakfast Burrito', from_batch: false },
      { slot: 'lunch', recipeName: 'Chicken Rice Bowl', from_batch: false },
      { slot: 'dinner', recipeName: 'Hello Fresh Dinner', from_batch: false },
      { slot: 'snack', recipeName: 'Turkey Roll-Ups', from_batch: false },
    ],
  },
  { // Thursday — work day, Hello Fresh dinner
    dayOfWeek: 4,
    meals: [
      { slot: 'breakfast', recipeName: 'Egg White Scramble + Toast', from_batch: false },
      { slot: 'lunch', recipeName: 'Turkey Taco Bowl', from_batch: false },
      { slot: 'dinner', recipeName: 'Hello Fresh Dinner', from_batch: false },
      { slot: 'snack', recipeName: 'PB Toast + Protein', from_batch: false },
    ],
  },
  { // Friday — training, Pizza Night
    dayOfWeek: 5,
    meals: [
      { slot: 'breakfast', recipeName: 'Protein Oatmeal Bowl', from_batch: false },
      { slot: 'lunch', recipeName: 'Chicken Rice Bowl', from_batch: false },
      { slot: 'dinner', recipeName: 'Pizza Night', from_batch: false },
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
