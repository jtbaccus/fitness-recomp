'use client';

interface GroceryItemProps {
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  onToggle: () => void;
}

export default function GroceryItem({ name, quantity, unit, checked, onToggle }: GroceryItemProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-3 w-full py-2 px-1 text-left hover:bg-elevated rounded-lg transition-default"
    >
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-default ${
        checked ? 'bg-accent border-accent' : 'border-border'
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-sm ${checked ? 'text-text-muted line-through' : 'text-white'}`}>
          {name}
        </span>
      </div>
      <span className={`text-xs shrink-0 ${checked ? 'text-text-muted' : 'text-text-secondary'}`}>
        {quantity} {unit}
      </span>
    </button>
  );
}
