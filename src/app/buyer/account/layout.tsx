// src/app/buyer/account/layout.tsx
import React from 'react';
import { BuyerAccountSidebar } from '@/features/Auth/components/account/BuyerAccountSidebar';
import { BuyerAccountMobileNav } from '@/features/Auth/components/account/BuyerAccountMobileNav';
import Header from '@/components/landing/Header';
import Newsletter from '@/components/landing/Newsletter';
import Footer from '@/components/landing/Footer';

export default function BuyerAccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <Header />
    <div className="min-h-screen bg-stone-50 flex ">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <BuyerAccountSidebar />
      </div>
      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Page content */}
        <div className="px-5 py-6 lg:px-10 lg:py-8 pb-24 lg:pb-8">
          {children}
        </div>

      </main>

      {/* Mobile bottom nav */}
      <BuyerAccountMobileNav />

    </div>
    {/* Customer support cta */}
    <div className="bg-amber-100 border-t border-amber-200">
      <div className="container mx-auto px-5 py-4">
        <p className="text-sm text-amber-800">
          Need help? <a href="/contact" className="font-semibold text-amber-600 hover:text-amber-700">Contact us</a>
        </p>
      </div>
    </div>
    <Newsletter />
    <Footer />    
    </>
  );
}