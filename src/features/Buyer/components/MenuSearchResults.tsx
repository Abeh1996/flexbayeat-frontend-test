// src/features/Buyer/components/MenuSearchResults.tsx
import { MenuCategory } from '../types/vendor.types';
import { MenuItemCard } from './MenuItemCard';

export function MenuSearchResults({ categories, query }: { categories: MenuCategory[]; query: string }) {
  const q = query.trim().toLowerCase();
  const results = categories
    .flatMap((c) => c.menuItems)
    .filter((item) => item.name.toLowerCase().includes(q));

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-neutral-500">No dishes match &quot;{query}&quot;.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {results.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}