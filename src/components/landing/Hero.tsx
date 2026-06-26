// Hero.tsx
"use client";
import React from "react";
import { Search, MapPin, Navigation, ArrowRight } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="bg-linear-to-b from-amber-50 to-white  overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Right Column Content - Forced to Top on Mobile via 'order-first' */}
          <div className="col-span-1 lg:col-span-5 order-first lg:order-last flex justify-center items-center">
            <div className="w-full max-w-[340px] sm:max-w-[450px] lg:max-w-full md:aspect-square relative flex items-center justify-center">
              <img
                src="/images/hero3.png"
                alt="Premium roasted chicken and seasoned fried rice"
                className="w-full h-auto object-contain select-none filter drop-shadow-[0_24px_48px_rgba(180,83,9,0.18)]"
                loading="eager"
              />
            </div>
          </div>

          {/* Left Column Content - Shifts Below Image on Mobile */}
          <div className="col-span-1 lg:col-span-7 space-y-6 lg:space-y-8 text-center lg:text-left">
            {/* Direct Value Prop */}
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-800 leading-[1.05]">
                Fast delivery from your <br />
                <span className="">favorite local spots.</span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Connecting you with top-rated kitchens and local culinary spots
                in Buea. Delivered fresh to your doorstep in under 45 minutes.
              </p>
            </div>

            {/* Sharp Search Engine Widget */}
            <div className="bg-white p-1.5 md:hidden border border-neutral-200 focus-within:border-amber-500 rounded-[2px] max-w-2xl mx-auto lg:mx-0">
              <form
                className="flex flex-col sm:flex-row items-stretch gap-1.5"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Location Segment */}
                {/* <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-neutral-100 rounded-[2px] sm:w-[38%] focus-within:border-neutral-300 transition-colors text-left">
                  <MapPin size={16} className="text-amber-500 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Delivery area..." 
                    defaultValue="Molyko, Buea"
                    className="w-full bg-transparent text-xs font-bold text-neutral-800 placeholder-neutral-400 focus:outline-none"
                  />
                  <button 
                    type="button"
                    title="Locate device coordinates"
                    className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <Navigation size={12} />
                  </button>
                </div> */}

                {/* Dish/Restaurant Query Segment */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white  rounded-[2px] flex-1 focus:border-amber-500 transition-colors text-left">
                  <Search size={16} className="text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="What are you craving today?"
                    className="w-full bg-transparent text-xs text-neutral-800 placeholder-neutral-400  focus:outline-none transition-colors"
                  />
                </div>

                {/* Strict Action Target */}
                <button
                  type="submit"
                  className="bg-amber-500 hidden hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs px-6 py-3 sm:py-2 rounded-[2px] transition-colors shrink-0"
                >
                  <Search size={16} className="text-white shrink-0" />
                </button>
              </form>
            </div>

            <button className="hidden md:flex items-center gap-3 bg-amber-500 text-white px-8 py-3 rounded-sm">
              Order Now <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
