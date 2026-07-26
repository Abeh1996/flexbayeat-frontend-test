// src/features/Buyer/components/RestaurantStatusBanner.tsx
export function RestaurantStatusBanner({ status }: { status: string }) {
  if (status === 'ACTIVE') return null;

  return (
    <div className="bg-neutral-950 text-white text-sm font-medium text-center py-2 px-4">
      This restaurant isn&apos;t taking orders right now. Check back later.
    </div>
  );
}