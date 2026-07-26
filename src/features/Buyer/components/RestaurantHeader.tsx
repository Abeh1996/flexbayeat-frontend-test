// src/features/Buyer/components/RestaurantHeader.tsx
import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { Vendor } from '../types/vendor.types';

export function RestaurantHeader({ vendor }: { vendor: Vendor }) {
  const hasRating = vendor.totalReviews > 0;
  const rating = Number(vendor.averageRating);

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="relative h-48 sm:h-64 w-full bg-neutral-100">
        {vendor.bannerUrl ? (
          <Image src={vendor.bannerUrl} alt={vendor.businessName} fill className="object-cover brightness-30" priority />
        ) : <Image src="/images/resBanner.avif" alt={vendor.businessName} fill className="object-cover brightness-30" priority />}
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 border border-neutral-200 bg-white rounded-[2px] overflow-hidden -mt-10 sm:-mt-12 shadow-sm">
            {vendor.logoUrl ? (
              <Image src={vendor.logoUrl} alt={vendor.businessName} fill className="object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs font-bold text-neutral-400">
                {vendor.businessName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight text-neutral-950 truncate">
              {vendor.businessName}
            </h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500">
              <MapPin size={13} className="shrink-0 text-neutral-400" />
              <span className="truncate">{vendor.addressLine1}, {vendor.city}</span>
            </p>
            {vendor.description && (
              <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{vendor.description}</p>
            )}
          </div>

          <div className="shrink-0 text-right">
            {hasRating ? (
              <span className="inline-flex items-center gap-1 text-sm font-bold text-neutral-950 bg-neutral-50 border border-neutral-200 rounded-[2px] px-2 py-1">
                <Star size={13} className="text-amber-500 fill-amber-500" />
                {rating.toFixed(1)}
                <span className="font-normal text-neutral-400">({vendor.totalReviews})</span>
              </span>
            ) : (
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">New</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}