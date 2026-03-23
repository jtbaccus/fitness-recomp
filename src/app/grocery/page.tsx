'use client';

import { useState, useEffect, useCallback } from 'react';
import PageShell from '@/components/PageShell';
import GrocerySection from '@/components/plan/GrocerySection';
import { toLocalDateString } from '@/lib/utils';
import { generateGroceryPDF } from '@/lib/grocery-pdf';
import type { GroceryListItem, Ingredient, Recipe } from '@/types/database';

type Tab = 'weekly' | 'monthly';

interface EnrichedItem extends GroceryListItem {
  ingredient_name: string;
  category: string;
}

export default function GroceryPage() {
  const [tab, setTab] = useState<Tab>('weekly');
  const [items, setItems] = useState<EnrichedItem[]>([]);
  const [ingredients, setIngredients] = useState<Map<string, Ingredient>>(new Map());
  const [batchRecipes, setBatchRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  // Get this week's Sunday
  const now = new Date();
  const sun = new Date(now);
  sun.setDate(now.getDate() - now.getDay());
  const weekStart = toLocalDateString(sun);

  const loadIngredients = useCallback(async () => {
    const [recipesRes, mealPlanRes] = await Promise.all([
      fetch('/api/recipes?include=ingredients'),
      fetch(`/api/meal-plan?start=${weekStart}&end=${(() => {
        const end = new Date(weekStart + 'T00:00:00');
        end.setDate(end.getDate() + 6);
        return end.toISOString().split('T')[0];
      })()}`),
    ]);
    const allRecipes: (Recipe & { ingredients?: Array<{ ingredient?: Ingredient }> })[] = await recipesRes.json();
    const weekMeals: { recipe_id: string }[] = await mealPlanRes.json();

    // Build ingredient map
    const ingMap = new Map<string, Ingredient>();
    for (const r of allRecipes) {
      if (r.ingredients) {
        for (const ri of r.ingredients) {
          if (ri.ingredient) {
            ingMap.set(ri.ingredient.id, ri.ingredient);
          }
        }
      }
    }
    setIngredients(ingMap);

    // Batch recipes for banner — only those actually in this week's plan
    const weekRecipeIds = new Set(weekMeals.map(m => m.recipe_id));
    setBatchRecipes(allRecipes.filter(r => r.freezer_friendly && weekRecipeIds.has(r.id)));
  }, [weekStart]);

  const generateList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/grocery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ week_start: weekStart, list_type: tab }),
      });
      const raw: GroceryListItem[] = await res.json();
      const enriched = raw.map(item => {
        const ing = ingredients.get(item.ingredient_id);
        return {
          ...item,
          ingredient_name: ing?.name || 'Unknown',
          category: ing?.category || 'pantry',
        };
      });
      setItems(enriched);
      setGenerated(true);
    } finally {
      setLoading(false);
    }
  }, [weekStart, tab, ingredients]);

  const loadExisting = useCallback(async () => {
    const res = await fetch(`/api/grocery?week_start=${weekStart}&list_type=${tab}`);
    const raw: GroceryListItem[] = await res.json();
    if (raw.length > 0) {
      const enriched = raw.map(item => {
        const ing = ingredients.get(item.ingredient_id);
        return {
          ...item,
          ingredient_name: ing?.name || 'Unknown',
          category: ing?.category || 'pantry',
        };
      });
      setItems(enriched);
      setGenerated(true);
    } else {
      setItems([]);
      setGenerated(false);
    }
  }, [weekStart, tab, ingredients]);

  useEffect(() => { loadIngredients(); }, [loadIngredients]);
  useEffect(() => {
    if (ingredients.size > 0) loadExisting();
  }, [ingredients, tab, loadExisting]);

  const handleToggle = async (id: string) => {
    const res = await fetch('/api/grocery', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const updated: GroceryListItem = await res.json();
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, checked: updated.checked } : item
    ));
  };

  // Group by category
  const categories = ['produce', 'protein', 'dairy', 'grains', 'pantry', 'frozen', 'condiment'];
  const grouped = categories
    .map(cat => ({
      category: cat,
      items: items
        .filter(i => i.category === cat)
        .sort((a, b) => a.ingredient_name.localeCompare(b.ingredient_name))
        .map(i => ({
          id: i.id,
          name: i.ingredient_name,
          quantity: i.quantity,
          unit: i.unit,
          checked: i.checked,
        })),
    }))
    .filter(g => g.items.length > 0);

  const totalItems = items.length;
  const checkedItems = items.filter(i => i.checked).length;

  return (
    <PageShell title="Grocery List" subtitle={`Week of ${weekStart}`}>
      <div className="space-y-4">
        {/* Tab toggle */}
        <div className="flex bg-card rounded-xl p-1">
          <button
            onClick={() => setTab('weekly')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-default ${
              tab === 'weekly' ? 'bg-accent text-white' : 'text-text-muted'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTab('monthly')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-default ${
              tab === 'monthly' ? 'bg-accent text-white' : 'text-text-muted'
            }`}
          >
            Monthly Staples
          </button>
        </div>

        {/* Batch Cook Banner (weekly tab only) */}
        {tab === 'weekly' && batchRecipes.length > 0 && generated && (
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-3">
            <p className="text-xs font-semibold text-accent mb-1">Batch Cook This Week</p>
            <div className="space-y-0.5">
              {batchRecipes.map(r => (
                <p key={r.id} className="text-xs text-text-secondary">
                  {r.name} — makes {r.batch_yield} portions
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Generate / Progress */}
        {!generated ? (
          <button
            onClick={generateList}
            disabled={loading || ingredients.size === 0}
            className="w-full py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-default disabled:opacity-50"
          >
            {loading ? 'Generating...' : `Generate ${tab === 'weekly' ? 'Weekly' : 'Monthly'} List`}
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-secondary">{checkedItems}/{totalItems} items checked</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const pdfItems = items.map(i => ({
                    name: i.ingredient_name,
                    quantity: i.quantity,
                    unit: i.unit,
                    category: i.category,
                    checked: i.checked,
                  }));
                  generateGroceryPDF(pdfItems, weekStart, tab);
                }}
                className="text-xs text-white bg-elevated px-3 py-1 rounded-lg font-medium"
              >
                Export PDF
              </button>
              <button
                onClick={generateList}
                disabled={loading}
                className="text-xs text-accent font-medium"
              >
                Regenerate
              </button>
            </div>
          </div>
        )}

        {/* Grocery sections */}
        {grouped.map(g => (
          <GrocerySection
            key={g.category}
            category={g.category}
            items={g.items}
            onToggle={handleToggle}
          />
        ))}

        {generated && grouped.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-muted text-sm">No items to show.</p>
            <p className="text-text-muted text-xs mt-1">
              {tab === 'monthly' ? 'Only non-perishable items appear here.' : 'Add meals to your plan first.'}
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
