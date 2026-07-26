// TrendingMeals.tsx
'use client';
import React, { useState } from 'react';
import { Flame, ShoppingBag, Heart } from 'lucide-react';
import { useTrendingMealsQuery } from '@/features/Buyer/hooks/useTrendingMealsQuery';
import Link from 'next/link';
import { MealBrowseCard } from '@/features/Buyer/components/MealBrowseCard';
import { MealDetailSheet } from '@/features/Buyer/components/MealDetailSheet';
import { BrowsableMeal } from '@/features/Buyer/hooks/useAllMealsQuery';

function formatPrice(price: string): string {
  const n = Number(price);
  return Number.isFinite(n) ? n.toLocaleString() : price;
}

const TrendingMeals: React.FC = () => {
  const { trendingMeals, isLoadingMeals, isErrorMeals } = useTrendingMealsQuery(8);
    const [selectedMeal, setSelectedMeal] = useState<BrowsableMeal | null>(null);



  if (isLoadingMeals) {
    return (
      <section className="bg-linear-to-b from-white to-amber-100 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse bg-white border border-neutral-200 rounded-[2px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isErrorMeals || trendingMeals.length === 0) return null;

  return (
    <section className="bg-linear-to-b from-white to-amber-100 py-12 lg:py-16 ">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">

        <div className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-600 font-bold uppercase tracking-wider text-[10px]">
            <Flame size={14} />
            <span>High demand items right now</span>
          </div>
          <h3 className="text-xl lg:text-2xl font-black tracking-tight text-neutral-950">
            Trending Meals
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {trendingMeals.slice(0, 4).map((meal) => (
             <MealBrowseCard key={meal.id} meal={meal} onSelect={setSelectedMeal} />
          ))}
        </div>

        <MealDetailSheet meal={selectedMeal} onClose={() => setSelectedMeal(null)} />

        <Link href="/meals" className="block text-center text-sm font-semibold text-amber-400 hover:text-amber-500 hover:underline transition-colors">
          See all trending meals <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}

export default TrendingMeals;