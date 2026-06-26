// HowItWorks.tsx
'use client';
import React from 'react';

interface Step {
  id: number;
  imageSrc: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    imageSrc: '/images/howitworks/place-order.png',
    title: "Create Account & Order",
    description: "Enter your information securely, browse curated menus from top local kitchens, and customize your cravings."
  },
  {
    id: 2,
    imageSrc: '/images/howitworks/preparation.png',
    title: "Fresh Preparation",
    description: "Vetted restaurant partners instantly accept, prepare, and seal your meals using high-grade thermal packaging."
  },
  {
    id: 3,
    imageSrc: '/images/howitworks/delivery.png',
    title: "Swift Delivery",
    description: "Our distributed rider network picks up hot plates, tracks coordinates, and utilizes optimized routes to your door."
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="bg-linear-to-b from-amber-100 via-white to-white py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-16">
        
        {/* Section Typography Header - Clean & Centered */}
        <div className="space-y-1 text-center">
          <p className="text-amber-600 font-bold uppercase tracking-wider text-[10px]">
            Simple Logistics Lifecycle
          </p>
          <h3 className="text-xl lg:text-2xl font-black tracking-tight text-neutral-950">
            How FlexyBayEats Works
          </h3>
        </div>

        {/* Global Lifecycle Track Container */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 lg:gap-12 pt-4">
          
          {/* Connected Dotted Process Trajectory Loop (Hidden on Mobile stacks) */}
          <div className="hidden md:block absolute top-[15%] left-[15%] right-[15%] h-[2px] pointer-events-none z-0">
            <svg className="w-full h-20 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M 0 0 Q 250 80, 500 0 T 1000 0" 
                stroke="#e5e5e5" 
                strokeWidth="2" 
                strokeDasharray="6 6" 
              />
            </svg>
          </div>

          {STEPS.map((step) => (
            <div 
              key={step.id} 
              className="flex flex-col items-center text-center space-y-6 max-w-sm mx-auto md:mx-0 relative z-10 group"
            >
              {/* Asset Display Frame matching precise aspect ratio dimensions */}
              <div className="w-full max-w-[200px] aspect-[4/3] flex items-center justify-center relative select-none">
                <img 
                  src={step.imageSrc} 
                  alt={step.title}
                  className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.02)] transform group-hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Information Text Block */}
              <div className="space-y-2 px-2">
                <h4 className="text-base lg:text-lg font-black text-neutral-950 tracking-tight">
                  {step.title}
                </h4>
                <p className="text-xs lg:text-sm text-neutral-500 font-medium leading-relaxed max-w-[280px] mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default HowItWorks;