// JoinNetwork.tsx
'use client';
import React from 'react';
import { Store, Bike, ArrowUpRight } from 'lucide-react';

const JoinNetwork: React.FC = () => {
  return (
    <section className="bg-white py-16 lg:py-24  overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-20 lg:space-y-28">
        
        {/* ========================================================================= */}
        {/* ROW 1: RESTAURANT MERCHANT (Image Left, Content Right on Desktop)        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Image Container - Comes first on mobile, sits left on desktop */}
          <div className="order-1 lg:order-1 lg:col-span-6 w-full max-w-md lg:max-w-full mx-auto select-none">
            <div className=" aspect-[4/3] flex items-center justify-center border border-neutral-200/60 rounded-[2px]  group">
              <img 
                src="/images/join/merchant-showcase.png" 
                alt="Partner as a Kitchen Merchant" 
                className="w-full h-full object-cover filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.04)] transform transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content Block - Comes second on mobile, sits right on desktop */}
          <div className="order-2 lg:order-2 lg:col-span-6 space-y-5 text-left max-w-xl mx-auto lg:mx-0">
            <div className="flex items-center gap-1.5 text-amber-600 font-bold uppercase tracking-wider text-[10px]">
              <Store size={14} />
              <span>B2B Merchant Program</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-950 leading-tight">
              Partner as a Kitchen Merchant. <br />
              Scale your restaurant sales.
            </h3>
            
            <p className="text-xs lg:text-sm text-neutral-500 font-medium leading-relaxed">
              Digitize your menu, reach thousands of hungry clients across Molyko, Great Soppo, and the rest of Buea instantly. Leverage our integrated distribution fleet, live analytics dashboards, and automated payment cycles to maximize your daily kitchen volume.
            </p>

            <div className="pt-2">
              <a 
                href="/auth/vendor/signup"
                className="inline-flex items-center gap-1.5  bg-neutral-900 hover:bg-amber-500 text-white hover:text-neutral-950 font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-[2px] transition-all duration-200 shadow-sm"
              >
                <span>Register Your Kitchen</span>
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </a>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ROW 2: COURIER RIDER (Image Right, Content Left on Desktop)              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Image Container - Force order-1 on mobile so image stays on top, snaps to right (order-2) on desktop */}
          <div className="order-1 lg:order-2 lg:col-span-6 w-full max-w-md lg:max-w-full mx-auto select-none">
            <div className=" aspect-[4/3] flex items-center justify-center rounded-[2px]  group">
              <img 
                src="/images/join/rider-showcase.png" 
                alt="Deliver and Earn as a Rider" 
                className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.04)] transform transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content Block - Force order-2 on mobile to sit under image, shifts left (order-1) on desktop */}
          <div className="order-2 lg:order-1 lg:col-span-6 space-y-5 text-left max-w-xl mx-auto lg:mx-0">
            <div className="flex items-center gap-1.5 text-amber-600 font-bold uppercase tracking-wider text-[10px]">
              <Bike size={14} />
              <span>Logistics Network</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-950 leading-tight">
              Deliver and Earn on Time. <br />
              Be your own manager.
            </h3>
            
            <p className="text-xs lg:text-sm text-neutral-500 font-medium leading-relaxed">
              Turn your motorbike, bicycle, or vehicle into a reliable revenue pipeline. Take control of your hours, accept localized drop-offs with intelligent automated mapping guidance, and secure consistent weekly payouts straight to your account.
            </p>

            <div className="pt-2">
              <a 
                href="/auth/rider/signup"
                className="inline-flex items-center gap-1.5  bg-neutral-900 hover:bg-amber-500 text-white hover:text-neutral-950 font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-[2px] transition-all duration-200 shadow-sm"
              >
                <span>Apply to Ride</span>
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default JoinNetwork;