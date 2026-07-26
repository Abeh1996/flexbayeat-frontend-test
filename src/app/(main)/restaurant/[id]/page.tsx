// src/app/(main)/restaurant/[id]/page.tsx
'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useVendorsQuery } from '@/features/Buyer/hooks/useVendorsQuery';
import { useVendorMenuQuery } from '@/features/Buyer/hooks/useVendorMenuQuery';
import { RestaurantHeader } from '@/features/Buyer/components/RestaurantHeader';
import { RestaurantStatusBanner } from '@/features/Buyer/components/RestaurantStatusBanner';
import { MenuCategoryNav } from '@/features/Buyer/components/MenuCategoryNav';
import { MenuSection } from '@/features/Buyer/components/MenuSection';
import { MenuSearchResults } from '@/features/Buyer/components/MenuSearchResults';

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');

  const { vendors, isLoadingVendors } = useVendorsQuery();
  const { menuCategories, hasMenu, isLoadingMenu, isErrorMenu, refetchMenu } = useVendorMenuQuery(id);

  console.log("menuCategories", menuCategories);

  const vendor = vendors.find((v) => v.id === id);

  if (isLoadingVendors || isLoadingMenu) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="h-64 bg-neutral-100 animate-pulse rounded-[2px]" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-sm text-neutral-500">
          This restaurant couldn&apos;t be found. It may no longer be available.
        </p>
      </div>
    );
  }

  return (
    <main>
      <RestaurantHeader vendor={vendor} />
      <RestaurantStatusBanner status={vendor.status} />

      {hasMenu && (
        <MenuCategoryNav
          categories={menuCategories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {isErrorMenu ? (
          <div className="text-center py-12">
            <p className="text-sm text-neutral-500">Couldn&apos;t load the menu right now.</p>
            <button
              onClick={() => refetchMenu()}
              className="mt-3 px-4 py-2 text-sm font-semibold border border-neutral-300 rounded-[2px] text-neutral-700 hover:border-neutral-500 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : !hasMenu ? (
          <p className="text-sm text-neutral-500 text-center py-12">
            This restaurant hasn&apos;t added a menu yet.
          </p>
        ) : searchQuery ? (
          <MenuSearchResults categories={menuCategories} query={searchQuery} />
        ) : (
          <div className="space-y-10">
            {menuCategories.map((category) => (
              <MenuSection key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}