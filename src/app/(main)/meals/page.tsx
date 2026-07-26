// Add to src/app/(main)/meals/page.tsx
'use client';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useAllMealsQuery, BrowsableMeal } from '@/features/Buyer/hooks/useAllMealsQuery';
import { MealBrowseCard } from '@/features/Buyer/components/MealBrowseCard';
import { MealDetailSheet } from '@/features/Buyer/components/MealDetailSheet';

export default function BrowseMealsPage() {
  const { meals, categoryNames, isLoadingMeals, isErrorMeals, error } = useAllMealsQuery();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<BrowsableMeal | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return meals.filter((m) => {
      const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.vendorName.toLowerCase().includes(q);
      const matchesCategory = !activeCategory || m.categoryName === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [meals, search, activeCategory]);

  // console.error("Errors fetching menu", error?.response?.data.message || error?.message);

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-2xl text-center font-black tracking-tight text-neutral-950">Browse Meals</h1>
      <p className="mt-1 text-center text-sm text-neutral-500">
        Dishes from every restaurant, in one place.
      </p>

      <div className="mt-6 space-y-3">
        {/* <div className="relative max-w-sm">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meals or restaurants..."
            className="w-full pl-8 pr-3 py-2 text-sm border border-neutral-200 rounded-[2px] focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div> */}

        {categoryNames.length > 1 && (
          <div className="flex md:justify-center text-nowrap flex-nowrap overflow-x-auto gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-colors ${
                activeCategory === null
                  ? 'bg-neutral-950 text-white border-neutral-950'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              All
            </button>
            {categoryNames.map((name) => (
              <button
                key={name}
                onClick={() => setActiveCategory(name ?? null)}
                className={`px-3 py-1.5 text-nowrap text-xs font-semibold rounded-[2px] border transition-colors ${
                  activeCategory === name
                    ? 'bg-neutral-950 text-white border-neutral-950'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        {isLoadingMeals ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-56 bg-neutral-100 animate-pulse rounded-[2px]" />
            ))}
          </div>
        ) : isErrorMeals ? (
          <p className="text-sm text-neutral-500 text-center py-12">
            Couldn&apos;t load meals right now. Try again shortly.
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-12">No meals match your search.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((meal) => (
              <MealBrowseCard key={meal.id} meal={meal} onSelect={setSelectedMeal} />
            ))}
          </div>
        )}
      </div>

      <MealDetailSheet meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
    </main>
  );
}