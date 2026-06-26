// TopCategories.tsx
import React from 'react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Traditional Dishes', slug: 'traditional-dishes' },
  { id: '2', name: 'Main Entrées', slug: 'main-entrées' },
  { id: '3', name: 'Snacks & Pastries', slug: 'snacks-pastries' },
  { id: '4', name: 'Chilled Drinks', slug: 'chilled-drinks' },
];

const TopCategories: React.FC = () => {
  return (
    <section className="bg-white py-8 lg:py-16 ">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="flex mb-8 items-center justify-center">
          <div className="space-y-1">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-neutral-950">
              Browse Top Categories
            </h2>
            <p className="text-xs lg:text-sm text-neutral-500 font-medium text-center">
              Find your next meal by category.
            </p>
          </div>
          
          
        </div>

        {/* Categories Grid (2 Columns Mobile -> 4 Columns Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {CATEGORIES.map((category) => (
            <a
              key={category.id}
              href={`/meals?category=${category.slug}`}
              className="group block  transition-all bg-white overflow-hidden text-left"
            >
              {/* Asset Space */}
              <div className=" aspect-square px-6 py-0y flex items-center justify-center  relative overflow-hidden">
                <img
                  src={`/images/category/${category.slug}.png`}
                  alt={category.name}
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300 select-none filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)]"
                  loading="lazy"
                />
              </div>

              {/* Title Identity Space */}
              <div className="p-3 lg:p-4 bg-white text-center">
                <h3 className="text-sm lg:text-base font-bold text-neutral-950 group-hover:text-amber-600 transition-colors truncate">
                  {category.name}
                </h3>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TopCategories;