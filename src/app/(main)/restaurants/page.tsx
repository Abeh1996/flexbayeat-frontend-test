// src/app/(main)/restaurants/page.tsx
import { RestaurantsGrid } from '@/features/Buyer/components/RestaurantsGrid';

export default function RestaurantsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Restaurants</h1>
      <p className="mt-1 text-sm text-gray-500">Browse all restaurants available to order from.</p>

      <div className="mt-6">
        <RestaurantsGrid />
      </div>
    </main>
  );
}