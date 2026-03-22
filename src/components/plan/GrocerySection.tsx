'use client';

import GroceryItem from './GroceryItem';

interface GrocerySectionItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
}

interface GrocerySectionProps {
  category: string;
  items: GrocerySectionItem[];
  onToggle: (id: string) => void;
}

const categoryLabels: Record<string, string> = {
  produce: 'Produce',
  protein: 'Protein',
  dairy: 'Dairy',
  grains: 'Grains & Starches',
  pantry: 'Pantry',
  frozen: 'Frozen',
  condiment: 'Condiments',
};

export default function GrocerySection({ category, items, onToggle }: GrocerySectionProps) {
  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="bg-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {categoryLabels[category] || category}
        </h3>
        <span className="text-[10px] text-text-muted">
          {checkedCount}/{items.length}
        </span>
      </div>
      <div>
        {items.map(item => (
          <GroceryItem
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            unit={item.unit}
            checked={item.checked}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
