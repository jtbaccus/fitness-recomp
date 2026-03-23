'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import type { Ingredient, MealSlot } from '@/types/database';

type DayType = 'training' | 'work';

interface GeneratedRecipe {
  name: string;
  meal_slot: MealSlot;
  prep_time_min: number;
  servings: number;
  calories_per_serving: number;
  protein_per_serving: number;
  carbs_per_serving: number;
  fat_per_serving: number;
  ingredients: { name: string; quantity: number; unit: string }[];
  instructions: string;
  notes: string | null;
}

const MEAL_SLOTS: { value: MealSlot; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

const DAY_TYPES: { value: DayType; label: string }[] = [
  { value: 'training', label: 'Training Day' },
  { value: 'work', label: 'Work/Rest Day' },
];

export default function GenerateRecipePage() {
  const [step, setStep] = useState(1);
  const [knownIngredients, setKnownIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [customInput, setCustomInput] = useState('');
  const [customIngredients, setCustomIngredients] = useState<string[]>([]);
  const [mealSlot, setMealSlot] = useState<MealSlot>('lunch');
  const [dayType, setDayType] = useState<DayType>('training');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/ingredients')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setKnownIngredients(data);
      })
      .catch(() => {});
  }, []);

  const toggleIngredient = (name: string) => {
    setSelectedIngredients(prev => {
      const next = new Set(Array.from(prev));
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const addCustomIngredient = () => {
    const trimmed = customInput.trim();
    if (trimmed && !customIngredients.includes(trimmed) && !selectedIngredients.has(trimmed)) {
      setCustomIngredients(prev => [...prev, trimmed]);
      setSelectedIngredients(prev => new Set([...Array.from(prev), trimmed]));
      setCustomInput('');
    }
  };

  const allSelected = Array.from(selectedIngredients);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: allSelected,
          meal_slot: mealSlot,
          day_type: dayType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to generate recipe');
        setGenerating(false);
        return;
      }
      setRecipe(data);
      setStep(4);
    } catch {
      setError('Network error. Please try again.');
    }
    setGenerating(false);
  };

  const handleSave = async () => {
    if (!recipe) return;
    setSaving(true);
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: recipe.name,
          meal_slot: recipe.meal_slot,
          servings: recipe.servings,
          calories_per_serving: recipe.calories_per_serving,
          protein_per_serving: recipe.protein_per_serving,
          carbs_per_serving: recipe.carbs_per_serving,
          fat_per_serving: recipe.fat_per_serving,
          prep_time_min: recipe.prep_time_min,
          freezer_friendly: false,
          batch_yield: 1,
          notes: recipe.notes,
          instructions: recipe.instructions,
          ingredients: recipe.ingredients,
        }),
      });
      if (res.ok) {
        setSaved(true);
      }
    } catch {
      // silently fail
    }
    setSaving(false);
  };

  const handleTryAgain = () => {
    setRecipe(null);
    setSaved(false);
    setStep(3);
    handleGenerate();
  };

  const handleStartOver = () => {
    setStep(1);
    setRecipe(null);
    setSaved(false);
    setError(null);
  };

  return (
    <PageShell title="Create Recipe" subtitle="From What You Have">
      <Link
        href="/recipes"
        className="inline-flex items-center text-sm text-text-muted hover:text-white mb-4"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Recipes
      </Link>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map(s => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-accent' : 'bg-elevated'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Ingredients */}
      {step === 1 && (
        <div>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
            What do you have?
          </h2>

          {/* Known ingredients as toggleable chips */}
          {knownIngredients.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {knownIngredients.map(ing => (
                <button
                  key={ing.id}
                  onClick={() => toggleIngredient(ing.name)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedIngredients.has(ing.name)
                      ? 'bg-accent text-white'
                      : 'bg-elevated text-text-muted hover:text-white'
                  }`}
                >
                  {ing.name}
                </button>
              ))}
            </div>
          )}

          {/* Custom ingredients already added */}
          {customIngredients.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {customIngredients
                .filter(c => !knownIngredients.some(k => k.name === c))
                .map(name => (
                  <button
                    key={name}
                    onClick={() => {
                      setSelectedIngredients(prev => {
                        const next = new Set(Array.from(prev));
                        if (next.has(name)) next.delete(name);
                        else next.add(name);
                        return next;
                      });
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedIngredients.has(name)
                        ? 'bg-accent text-white'
                        : 'bg-elevated text-text-muted hover:text-white'
                    }`}
                  >
                    {name}
                  </button>
                ))}
            </div>
          )}

          {/* Custom ingredient input */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomIngredient();
                }
              }}
              placeholder="Add custom ingredient..."
              className="flex-1 bg-elevated border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
            <button
              onClick={addCustomIngredient}
              disabled={!customInput.trim()}
              className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>

          {/* Selected count and next */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">
              {allSelected.length} ingredient{allSelected.length !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setStep(2)}
              disabled={allSelected.length === 0}
              className="px-6 py-2.5 rounded-xl bg-accent text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Meal Type */}
      {step === 2 && (
        <div>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Meal Slot
          </h2>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {MEAL_SLOTS.map(slot => (
              <button
                key={slot.value}
                onClick={() => setMealSlot(slot.value)}
                className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                  mealSlot === slot.value
                    ? 'bg-accent text-white'
                    : 'bg-elevated text-text-muted hover:text-white'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>

          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Day Type
          </h2>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {DAY_TYPES.map(dt => (
              <button
                key={dt.value}
                onClick={() => setDayType(dt.value)}
                className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                  dayType === dt.value
                    ? 'bg-accent text-white'
                    : 'bg-elevated text-text-muted hover:text-white'
                }`}
              >
                {dt.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2.5 rounded-xl bg-elevated text-text-muted font-medium"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-2.5 rounded-xl bg-accent text-white font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Generate */}
      {step === 3 && (
        <div className="text-center py-8">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Ready to Generate
          </h2>

          <div className="bg-card rounded-xl p-4 mb-6 text-left">
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Ingredients</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {allSelected.map(name => (
                <span key={name} className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs">
                  {name}
                </span>
              ))}
            </div>
            <div className="flex gap-4 text-sm text-text-muted">
              <span className="capitalize">{mealSlot}</span>
              <span>{dayType === 'training' ? 'Training Day' : 'Work/Rest Day'}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-3 rounded-xl bg-accent text-white font-medium disabled:opacity-50 mb-3"
          >
            {generating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Recipe'
            )}
          </button>

          <button
            onClick={() => setStep(2)}
            disabled={generating}
            className="text-sm text-text-muted hover:text-white"
          >
            Back
          </button>
        </div>
      )}

      {/* Step 4: Preview */}
      {step === 4 && recipe && (
        <div>
          <h2 className="text-lg font-bold text-white mb-1">{recipe.name}</h2>
          {recipe.notes && (
            <p className="text-sm text-text-muted mb-4">{recipe.notes}</p>
          )}

          {/* Macros grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-card rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-white">{recipe.calories_per_serving}</div>
              <div className="text-xs text-text-muted">cal</div>
            </div>
            <div className="bg-card rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-blue-400">{recipe.protein_per_serving}g</div>
              <div className="text-xs text-text-muted">protein</div>
            </div>
            <div className="bg-card rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-amber-400">{recipe.carbs_per_serving}g</div>
              <div className="text-xs text-text-muted">carbs</div>
            </div>
            <div className="bg-card rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-rose-400">{recipe.fat_per_serving}g</div>
              <div className="text-xs text-text-muted">fat</div>
            </div>
          </div>

          {/* Meta */}
          <div className="flex gap-4 text-sm text-text-muted mb-4">
            {recipe.prep_time_min && <span>{recipe.prep_time_min} min prep</span>}
            <span>{recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}</span>
          </div>

          {/* Ingredients list */}
          <div className="bg-card rounded-xl p-4 mb-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Ingredients
            </h3>
            <ul className="space-y-1">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="text-sm text-white">
                  {ing.quantity} {ing.unit} {ing.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          {recipe.instructions && (
            <div className="bg-card rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Instructions
              </h3>
              <div className="text-sm text-text-muted whitespace-pre-line">
                {recipe.instructions}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            {saved ? (
              <div className="w-full py-3 rounded-xl bg-green-600/20 text-green-400 font-medium text-center text-sm">
                Saved to My Recipes
              </div>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 rounded-xl bg-accent text-white font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save to My Recipes'}
              </button>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleTryAgain}
                className="flex-1 py-2.5 rounded-xl bg-elevated text-text-muted font-medium text-sm hover:text-white"
              >
                Try Again
              </button>
              <button
                onClick={handleStartOver}
                className="flex-1 py-2.5 rounded-xl bg-elevated text-text-muted font-medium text-sm hover:text-white"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
