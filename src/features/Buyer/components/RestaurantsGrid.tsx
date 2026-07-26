// src/features/Buyer/components/RestaurantsGrid.tsx
'use client';
import { useVendorsQuery } from '../hooks/useVendorsQuery';
import { VendorCard } from './VendorCard';

export function RestaurantsGrid() {
  const { vendors, hasVendors, isLoadingVendors, isErrorVendors, refetchVendors } =
    useVendorsQuery();

    // console.log('vendors', vendors);

  if (isLoadingVendors) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse border border-gray-200 bg-gray-100" />
        ))}
      </div>
    );
  }

  if (isErrorVendors) {
    return (
      <div className="border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-600">
          Couldn&apos;t load restaurants right now. Check your connection and try again.
        </p>
        <button
          onClick={() => refetchVendors()}
          className="mt-3 border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!hasVendors) {
    return (
      <div className="border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-600">No restaurants available in your area yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
}