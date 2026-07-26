// src/features/Buyer/components/MenuCategoryNav.tsx
'use client';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { MenuCategory } from '../types/vendor.types';

interface Props {
  categories: MenuCategory[];
  searchQuery: string;
  onSearchChange: (v: string) => void;
}

export function MenuCategoryNav({ categories, searchQuery, onSearchChange }: Props) {
  const categoriesWithItems = categories.filter((c) => c.menuItems.length > 0);
  const [activeId, setActiveId] = useState<string | null>(categoriesWithItems[0]?.id ?? null);

  useEffect(() => {
    if (searchQuery) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-140px 0px -70% 0px', threshold: 0 }
    );

    categoriesWithItems.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categoriesWithItems, searchQuery]);

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 130;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-16 md:top-[100px] lg:top-[116px] z-30 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center gap-3">
        <div className="relative w-full max-w-xs shrink-0">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search this menu..."
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-neutral-200 rounded-[2px] focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {!searchQuery && categoriesWithItems.length > 1 && (
          <div className="flex-1 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {categoriesWithItems.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors ${
                    activeId === cat.id
                      ? 'bg-neutral-950 text-white border-neutral-950'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}