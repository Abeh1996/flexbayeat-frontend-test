// src/features/Buyer/components/MenuSection.tsx
import { MenuCategory } from '../types/vendor.types';
import { MenuItemCard } from './MenuItemCard';

export function MenuSection({ category }: { category: MenuCategory }) {
  if (category.menuItems.length === 0) return null;

  return (
    <section id={category.id} className="scroll-mt-36">
      <h2 className="text-lg font-black text-neutral-950">{category.name}</h2>
      {category.description && (
        <p className="mt-0.5 text-sm text-neutral-500">{category.description}</p>
      )}
      <div className="mt-4 grid grid-cols-1 max-w-4xl gap-3">
        {category.menuItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}