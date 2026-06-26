// FeaturedKitchens.tsx
'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Star, Clock, ChevronLeft, ChevronRight, Award, UtensilsCrossed } from 'lucide-react';

// Crucial Swiper Style Assets
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  openTime: string;
  mealsCount: number;
  bannerSlug: string;
}

const FEATURED_RESTAURANTS: Restaurant[] = [
  { id: 'r1', name: 'Sparkland', cuisine: 'Traditional & Grills', rating: 4.9, openTime: '08:00 AM - 10:00 PM', mealsCount: 42, bannerSlug: 'sparkland' },
  { id: 'r2', name: 'Njeirforbi Restaurant', cuisine: 'Burgers & Fast Food', rating: 4.7, openTime: '09:00 AM - 11:00 PM', mealsCount: 28, bannerSlug: 'njeirforbi' },
  { id: 'r3', name: 'My Way', cuisine: 'Traditional African', rating: 4.8, openTime: '07:30 AM - 09:00 PM', mealsCount: 35, bannerSlug: 'my-way' },
  { id: 'r4', name: 'UB Junction Grills', cuisine: 'Street Food & Shawarma', rating: 4.6, openTime: '10:00 AM - 11:30 PM', mealsCount: 19, bannerSlug: 'njeirforbi' },
  { id: 'r5', name: 'Chop Chair Kitchen', cuisine: 'Local Delicacies', rating: 4.9, openTime: '08:00 AM - 09:30 PM', mealsCount: 31, bannerSlug: 'sparkland' },
];

const FeaturedKitchens: React.FC = () => {
  return (
    <section className="bg-white py-12 lg:py-16 ">
      <div className="max-w-7xl mx-auto px-6  lg:px-8 space-y-6">
        
        {/* Section Heading Info - Centered */}
        <div className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-600 font-bold uppercase tracking-wider text-[10px]">
            <Award size={14} />
            <span>Top Vetted Partners</span>
          </div>
          <h3 className="text-xl lg:text-2xl font-black tracking-tight text-neutral-950">
            Popular Kitchens Near You
          </h3>
        </div>

        {/* Global Wrapper encapsulating custom relative navigation triggers */}
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
              1024: { slidesPerView: 3.2, spaceBetween: 24 }, // Cuts third card out slightly on desktop for explicit cognitive flow hint
            }}
            className="w-full !pb-10 md:!pb-2"
          >
            {FEATURED_RESTAURANTS.map((shop) => (
              <SwiperSlide key={shop.id}>
                <div className="bg-white border border-neutral-200 rounded-[2px] overflow-hidden hover:border-neutral-400 transition-all flex flex-col justify-between h-full">
                  <a href={`/restaurants/${shop.id}`} className="block">
                    <div className="bg-neutral-100 aspect-[16/9] w-full relative overflow-hidden">
                      <img 
                        src={`/images/restaurants/${shop.bannerSlug}.png`} 
                        alt={shop.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-[2px] border border-neutral-200 text-[10px] font-black text-neutral-900 flex items-center gap-1">
                        <Star size={10} className="text-amber-500 fill-amber-500" />
                        {shop.rating}
                      </div>
                    </div>
                  </a>

                  <div className="p-4 space-y-3 text-left">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600">{shop.cuisine}</span>
                      <h4 className="text-base font-black text-neutral-950 truncate mt-0.5">
                        <a href={`/restaurants/${shop.id}`} className="hover:text-amber-500 transition-colors">{shop.name}</a>
                      </h4>
                    </div>
                    
                    {/* Simplified Metadata Layer */}
                    <div className="flex items-center gap-3 text-xs font-semibold text-neutral-500 pt-2 border-t border-neutral-100">
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock size={13} className="text-neutral-400" />
                        <span>{shop.openTime}</span>
                      </span>
                      <span className="text-neutral-300">|</span>
                      <span className="flex items-center gap-1 text-neutral-700 truncate">
                        <UtensilsCrossed size={13} className="text-neutral-400" />
                        <span><strong>{shop.mealsCount}</strong> meals</span>
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Absolute Positioned Left Trigger - Large & Completely Transparent Background */}
          <button
            className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center text-neutral-400 hover:text-neutral-950 transition-all disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Previous slide"
          >
            <ChevronLeft size={36} strokeWidth={2.5} />
          </button>

          {/* Absolute Positioned Right Trigger - Large & Completely Transparent Background */}
          <button
            className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center text-neutral-400 hover:text-neutral-950 transition-all disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Next slide"
          >
            <ChevronRight size={36} strokeWidth={2.5} />
          </button>

          {/* Custom Pagination Wrapper - Present on Mobile, Hidden on Desktop via config */}
          <div className="swiper-pagination-custom absolute bottom-0 left-0 right-0 flex justify-center gap-1.5 md:hidden z-20" />

        </div>

      </div>

      {/* Global CSS Overrides explicitly targeting custom internal pagination engine properties */}
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