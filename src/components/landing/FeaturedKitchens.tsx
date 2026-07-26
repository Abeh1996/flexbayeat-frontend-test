// FeaturedKitchens.tsx
'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Star, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { useVendorsQuery } from '@/features/Buyer/hooks/useVendorsQuery';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FEATURED_COUNT = 6;

const FeaturedKitchens: React.FC = () => {
  const { vendors, isLoadingVendors, isErrorVendors } = useVendorsQuery();

  const featured = [...vendors]
    .sort((a, b) => b.totalOrders - a.totalOrders)
    .slice(0, FEATURED_COUNT);

  if (isLoadingVendors) {
    return (
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 w-72 shrink-0 animate-pulse bg-neutral-100 rounded-[2px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isErrorVendors || featured.length === 0) return null;

  return (
    <section className="bg-white py-12 lg:py-16 ">
      <div className="max-w-7xl mx-auto px-6  lg:px-8 space-y-6">

        <div className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-600 font-bold uppercase tracking-wider text-[10px]">
            <Award size={14} />
            <span>Top Vetted Partners</span>
          </div>
          <h3 className="text-xl lg:text-2xl font-black tracking-tight text-neutral-950">
            Popular Kitchens Near You
          </h3>
        </div>

        <div className="relative group/slider px-0">

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1.2}
            grabCursor={true}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            pagination={{
              el: '.swiper-pagination-custom',
              clickable: true,
            }}
            breakpoints={{
              480: { slidesPerView: 1.5, spaceBetween: 20 },
              640: { slidesPerView: 2.2, spaceBetween: 20 },
              1024: { slidesPerView: 3.2, spaceBetween: 24 },
            }}
            className="w-full !pb-10 md:!pb-2"
          >
            {featured.map((vendor) => {
              const rating = Number(vendor.averageRating);
              const hasRating = vendor.totalReviews > 0;
              const image = vendor.bannerUrl ?? vendor.logoUrl;

              return (
                <SwiperSlide key={vendor.id}>
                  <div className="bg-white border border-neutral-200 rounded-[2px] overflow-hidden hover:border-neutral-400 transition-all flex flex-col justify-between h-full">
                    <a href={`/restaurant/${vendor.id}`} className="block">
                      <div className="bg-neutral-100 aspect-[16/9] w-full relative overflow-hidden">
                        {image ? (
                          <img
                            src={image}
                            alt={vendor.businessName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                            No image
                          </div>
                        )}
                        {hasRating && (
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-[2px] border border-neutral-200 text-[10px] font-black text-neutral-900 flex items-center gap-1">
                            <Star size={10} className="text-amber-500 fill-amber-500" />
                            {rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </a>

                    <div className="p-4 space-y-3 text-left">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600">
                          {vendor.city}
                        </span>
                        <h4 className="text-base font-black text-neutral-950 truncate mt-0.5">
                          <a href={`/restaurant/${vendor.id}`} className="hover:text-amber-500 transition-colors">
                            {vendor.businessName}
                          </a>
                        </h4>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-semibold text-neutral-500 pt-2 border-t border-neutral-100">
                        <span className="truncate">{vendor.addressLine1}</span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button
            className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center text-neutral-400 hover:text-neutral-950 transition-all disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Previous slide"
          >
            <ChevronLeft size={36} strokeWidth={2.5} />
          </button>

          <button
            className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center text-neutral-400 hover:text-neutral-950 transition-all disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Next slide"
          >
            <ChevronRight size={36} strokeWidth={2.5} />
          </button>

          <div className="swiper-pagination-custom absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 md:hidden z-20" />
        </div>
      </div>

      <style>{`
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #d4d4d4;
          opacity: 1;
          border-radius: 2px;
          transition: all 0.2s ease;
        }
        .swiper-pagination-custom .swiper-pagination-bullet-active {
          background: #f59e0b !important;
          width: 16px;
        }
      `}</style>
    </section>
  );
};

export default FeaturedKitchens;