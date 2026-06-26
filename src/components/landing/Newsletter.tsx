// Newsletter.tsx
import React from 'react';
import { ArrowRight, MailCheck } from 'lucide-react';

const Newsletter: React.FC = () => {
  return (
    <section className="bg-neutral-800 border-b border-neutral-900 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center text-left">
          
          {/* Left Block: Value Proposition & Context (7 Columns Wide) */}
          <div className="lg:col-span-7 space-y-3">
        
            <h2 className="text-2xl text-center md:text-start text-neutral-200 font-medium max-w-xl leading-relaxed">
              Be the first to know about exclusive <span className="text-amber-600 underline">special offers</span>
            </h2>
          </div>

          {/* Right Block: Pure Conversion Input Engine (5 Columns Wide) */}
          <div className="lg:col-span-5 w-full">
            <form 
              className="space-y-3 max-w-md lg:max-w-full"
            //   onSubmit={(e) => e.preventDefault()}
            >
              <div className="bg-white flex items-center justify-between rounded-[2px] w-full border border-neutral-700 shadow-sm focus-within:ring-1 focus-within:ring-amber-500 transition-all">
                <input
                  type="email"
                  required
                  placeholder="Enter your corporate or personal email"
                  className="w-full bg-transparent pl-3 pr-4 py-3.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none font-medium"
                />
                
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs px-5 py-4 rounded-[2px] transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Subscribe</span>
                </button>
              </div>

              
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Newsletter;