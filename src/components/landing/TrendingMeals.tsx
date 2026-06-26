// TrendingMeals.tsx
'use client';
import React, { useState } from 'react';
import { Star, ShoppingBag, Flame, Heart } from 'lucide-react';

interface Dish {
  id: string;
  name: string;
  restaurantName: string;
  price: number;
  rating: number;
  imageSlug: string; // Will reference standard image assets, e.g., /images/meals/achu.jpg
}

const TRENDING_DISHES: Dish[] = [
  { id: 'd1', name: 'Spicy Fried Rice & Grilled Chicken Platter', restaurantName: 'Buea Special Spices', price: 2500, rating: 4.9, imageSlug: 'fried-rice-chicken' },
  { id: 'd2', name: 'Pounded Achu with Rich Yellow Soup', restaurantName: 'Grand Pot Kitchen', price: 3000, rating: 4.8, imageSlug: 'achu-yellow-soup' },
  { id: 'd3', name: 'Double Cheese Pepper Burger & Fries', restaurantName: 'The Molyko Diner', price: 1800, rating: 4.6, imageSlug: 'pepper-burger' },
  { id: 'd4', name: 'Steamed Corn Koki (Traditional Style)', restaurantName: 'Grand Pot Kitchen', price: 1500, rating: 4.7, imageSlug: 'koki-traditional' },
//   { id: 'd5', name: 'Charcoal Grilled Fish with Plantains', restaurantName: 'UB Junction Grills', price: 3500, rating: 4.8, imageSlug: 'grilled-fish' },
//   { id: 'd6', name: 'Sautéed Irish Potatoes & Beef', restaurantName: 'The Molyko Diner', price: 2000, rating: 4.5, imageSlug: 'irish-potatoes' },
];

const TrendingMeals: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Stop navigation if the card wrapper is a link
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-linear-to-b from-white to-amber-100 py-12 lg:py-16 ">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        
        {/* Section Header Line - Centered to match the Kitchens header */}
        <div className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-600 font-bold uppercase tracking-wider text-[10px]">
            <Flame size={14} />
            <span>High demand items right now</span>
          </div>
          <h3 className="text-xl lg:text-2xl font-black tracking-tight text-neutral-950">
            Trending Meals in Buea
          </h3>
        </div>

        {/* Dense Grid Architecture: 2 Columns Mobile -> 4 Columns Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {TRENDING_DISHES.map((dish) => (
            <div 
              key={dish.id}
              className="group bg-white border border-neutral-200 rounded-[2px] overflow-hidden flex flex-col justify-between relative hover:border-neutral-400 transition-all text-left"
            >
              {/* Interaction Layer: Wishlist Toggle */}
              <button
                type="button"
                onClick={(e) => toggleFavorite(dish.id, e)}
                className="absolute top-2.5 right-2.5 z-10 p-1.5 bg-white/90 backdrop-blur-sm border border-neutral-100 rounded-full text-neutral-400 hover:text-rose-500 transition-colors shadow-sm focus:outline-none"
                aria-label="Add to favorites"
              >
                <Heart size={13} className={favorites.includes(dish.id) ? "fill-rose-500 text-rose-500" : ""} />
              </button>

              {/* Standard Real-World Food Photography Frame */}
              <a href={`/meals/${dish.id}`} className="block">
                <div className="bg-neutral-100 aspect-4/3 w-full relative overflow-hidden">
                  <img 
                    src={`/images/meals/${dish.imageSlug}.png`} // Note: standard real photo file ext (.jpg)
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 select-none"
                    loading="lazy"
                  />
                  {/* Subtle Rating Badge pinned directly over image context */}
                  <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded-[2px] border border-neutral-200/60 text-[9px] font-black text-neutral-900 flex items-center gap-0.5 shadow-sm">
                    <Star size={9} className="text-amber-500 fill-amber-500" />
                    {dish.rating}
                  </div>
                </div>
              </a>

              {/* Commercial Processing Identity Unit */}
              <div className="p-3 lg:p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide truncate">{dish.restaurantName}</p>
                  <h4 className="text-xs lg:text-sm font-black text-neutral-950 line-clamp-2 group-hover:text-amber-600 transition-colors mt-0.5 min-h-[32px] lg:min-h-[40px] leading-tight">
                    <a href={`/meals/${dish.id}`}>{dish.name}</a>
                  </h4>
                </div>

                {/* Pricing & Cart Action Row */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                  <span className="text-sm lg:text-base font-black text-neutral-950 whitespace-nowrap">
                    {dish.price.toLocaleString()} <span className="text-[9px] font-bold text-neutral-400 font-sans tracking-wide">CFA</span>
                  </span>
                  
                  {/* Instant Checkout Loop Modifier */}
                  <button
                    type="button"
                    className="bg-amber-500 hover:bg-amber-500 text-white hover:text-neutral-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-[2px] transition-colors flex items-center gap-1 shrink-0 active:bg-neutral-800"
                  >
                    <ShoppingBag size={11} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrendingMeals;