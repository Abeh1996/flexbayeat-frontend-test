// src/features/Buyer/components/VendorCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Vendor } from '../types/vendor.types';

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const hasRating = vendor.totalReviews > 0;
  const rating = Number(vendor.averageRating);

  return (
    <Link
      href={`/restaurant/${vendor.id}`}
      className="block border border-gray-200 bg-white transition-colors hover:border-gray-300"
    >
      <div className="relative h-40 w-full bg-gray-100">
        {vendor.logoUrl ? (
          <Image
            src={vendor.logoUrl}
            alt={vendor.businessName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900">{vendor.businessName}</h3>
          {hasRating ? (
            <span className="flex shrink-0 items-center gap-1 text-sm text-gray-700">
              <span className="text-amber-500">★</span>
              {rating.toFixed(1)}
            </span>
          ) : (
            <span className="shrink-0 text-xs text-gray-400">New</span>
          )}
        </div>

        <p className="mt-1 truncate text-sm text-gray-500">
          {vendor.addressLine1}, {vendor.city}
        </p>

        {vendor.description && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">{vendor.description}</p>
        )}
      </div>
    </Link>
  );
}