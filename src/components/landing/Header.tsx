// Header.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Menu,
  Search,
  ShoppingBag,
  Heart,
  User,
  MapPin,
  Phone,
} from "lucide-react";
import { MobileSidebar } from "./MobileSidebar";
// import { FaUser } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import { useProfileQuery } from "@/features/Auth/hooks/useProfileQuery";

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { user, isLoadingProfile: isLoading } = useProfileQuery();


  // Monitor scroll positioning to switch container context from transparent to locked-in layout boundaries
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getInitials = (firstName?: string, lastName?: string): string => {
    const f = firstName?.[0]?.toUpperCase() ?? "";
    const l = lastName?.[0]?.toUpperCase() ?? "";
    return `${f}${l}` || "??";
  }

  return (
    <>
      <header
        className={`sticky  top-0 w-full z-40 transition-all duration-200 ${
          isScrolled
            ? "bg-white shadow-md border-b border-amber-200"
            : "bg-amber-50 border-b border-neutral-100"
        }`}
      >
        {/* Top Minimal Utility Bar - Hidden on Mobile */}
        <div className="hidden md:block bg-amber-600 text-neutral-300 text-xs py-2 px-4 ">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Phone size={12} className="text-amber-200" />
                Support Hotline:{" "}
                <strong className="text-white">+237 677 000 000</strong>
              </span>
              <span className="text-neutral-200">|</span>
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="text-amber-200" />
                <span className="truncate max-w-[200px]">
                  Delivering to: Molyko, Buea
                </span>
              </span>
            </div>
            <div className="flex items-center gap-4 font-medium">
              <Link
                href="/auth/vendor/login"
                className="hover:text-amber-400 transition-colors"
              >
                Register as a Restaurant
              </Link>
              <Link
                href="/auth/rider/login"
                className="hover:text-amber-400 transition-colors"
              >
                Signup as a Drivery Driver
              </Link>
            </div>
          </div>
        </div>

        {/* Main Application Navbar Layout */}
        <div className="px-4 lg:px-8 max-w-7xl mx-auto h-16 lg:h-20 flex items-center justify-between gap-4">
          {/* Left: Brand Identity & Mobile Menu Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-neutral-700 hover:text-neutral-900 md:hidden focus:outline-none"
              aria-label="Open global navigation menu"
            >
              <Menu size={24} />
            </button>

            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-xl lg:text-2xl tracking-normal text-neutral-900">
                Flexbay<span className="text-amber-500">Eats</span>
              </span>
            </Link>
          </div>

          {/* Middle: Desktop App Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-neutral-600 shrink-0">
            <Link
              href="#menu"
              className="hover:text-amber-500 transition-colors relative after:absolute after:bottom-[-22px] after:left-0 after:right-0 after:h-[2px] after:bg-amber-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Browse Menu
            </Link>
            <Link
              href="#offers"
              className="hover:text-amber-500 transition-colors relative after:absolute after:bottom-[-22px] after:left-0 after:right-0 after:h-[2px] after:bg-amber-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Offers
            </Link>
            <Link
              href="#track"
              className="hover:text-amber-500 transition-colors relative after:absolute after:bottom-[-22px] after:left-0 after:right-0 after:h-[2px] after:bg-amber-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Track Order
            </Link>
          </nav>

          {/* Middle/Right: Enterprise Search Bar (Fluid Expansion) */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-xl mx-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search for restaurants, cuisines, or dishes..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white text-neutral-900 placeholder-neutral-400 border  rounded-[2px] focus:outline-none focus:bg-white border-amber-500 transition-all"
            />
          </div>

          {/* Right: Functional Checkout Actions / Indicators */}
          <div className="flex items-center gap-1 lg:gap-3 shrink-0">
            {/* Mobile Search Toggle Target */}
            <button
              className="p-2 text-neutral-700 hover:text-neutral-900 md:hidden transition-colors"
              aria-label="Search items"
            >
              <Search size={22} />
            </button>

            {/* Wishlist Accumulator */}
            <Link
              href="#wishlist"
              className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-[2px] relative transition-colors hidden sm:block"
              aria-label="View favorite restaurants"
            >
              <Heart size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
            </Link>

            {/* Micro-Cart Interface Component */}
            <Link
              href="#cart"
              className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-[2px] relative transition-colors"
              aria-label="Open shopping basket"
            >
              <ShoppingBag size={22} />
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold text-white bg-neutral-900 rounded-full">
                3
              </span>
            </Link>


            {/* Authentic Identity Action Block */}
            <Link
              href={user ? "/buyer/account/profile" : "/auth/buyer/login"}
              className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-neutral-50 rounded-[2px] transition-colors group text-left"
            >
              {
                isLoading ? (
                  <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
                ) : user ? (
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {getInitials(user.firstName, user.lastName)}
                    </span>
                  </div>
                ) : (
                  <div className="w-8 h-8 border-2 border-neutral-300 rounded-full flex items-center justify-center">
                    <FiUser size={16} className="text-neutral-700" />
                  </div>
                )
              }
            </Link>

            <Link
              href={user ? "/buyer/account/profile" : "/auth/buyer/login"}
              className="flex sm:hidden items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-neutral-50 rounded-[2px] transition-colors group text-left"
            >
              <FiUser
                size={22}
                className="text-neutral-700 hover:text-neutral-900 transition-colors"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Synchronized Side Navigation Component */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
};

export default Header;
