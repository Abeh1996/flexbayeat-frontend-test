// Footer.tsx
import React from "react";
import { MapPin, X } from "lucide-react";
import { FiFacebook, FiInstagram, FiLinkedin } from "react-icons/fi";
import Link from "next/link";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-neutral-400 text-xs py-12 lg:py-16 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-10">
        {/* Main Content Workspace Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start text-left">
          {/* Left Block: Brand Stack & Newsletter Engine (5 Columns Wide) */}
          <div className="md:col-span-5 space-y-8 text-center md:text-start hidden md:block">
            <Link href="/">
              <span className="font-black text-neutral-900 text-2xl lg:text-3xl tracking-normal">
                Flexbay<span className="text-amber-500">Eats</span>
              </span>
            </Link>

            <p className="flex items-center gap-2 text-center md:text-start">
              <MapPin size={16} />
              buea, South West region, cameroon
            </p>
          </div>

          {/* Right Block: Pure Navigation Menu Links (7 Columns Wide) */}
          <div className="md:col-span-7 grid grid-cols-3 gap-4 md:gap-8">
            {/* Product Directory */}
            <div className="space-y-3">
              <h4 className="font-bold  text-[13px]">Product</h4>
              <ul className="space-y-2 font-medium md:text-base">
                <li>
                  <Link href="#new" className="hover: transition-colors">
                    Whats New?
                  </Link>
                </li>
                <li>
                  <Link href="#locations" className="hover: transition-colors">
                    Delivery Locations
                  </Link>
                </li>
                <li>
                  <Link href="/meals" className="hover: transition-colors">
                    Meal Categories
                  </Link>
                </li>
                <li>
                  <Link href="#cards" className="hover: transition-colors">
                    Gift Cards
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Directory */}
            <div className="space-y-3">
              <h4 className="font-bold  text-[13px]">Support</h4>
              <ul className="space-y-2 font-medium md:text-base">
                <li>
                  <Link href="#help" className="hover: transition-colors">
                    Help Centre
                  </Link>
                </li>
                <li>
                  <Link href="#faqs" className="hover: transition-colors">
                    Delivery FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover: transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#refunds" className="hover: transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Directory */}
            <div className="space-y-3">
              <h4 className="font-bold  text-[13px]">Legal</h4>
              <ul className="space-y-2 font-medium md:text-base">
                <li>
                  <Link href="#terms" className="hover: transition-colors">
                    Terms of Services
                  </Link>
                </li>
                <li>
                  <Link href="#privacy" className="hover: transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#cookies" className="hover: transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#agreement" className="hover: transition-colors">
                    Delivery Agreement
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Crisp Separation Rule Line */}
        <div className="w-full h-[1px] bg-neutral-300" />

        {/* Bottom Bar Tier: Balanced Copyright and Social Channels */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left  font-medium text-neutral-500">
          <p>
            &copy; {currentYear} FlexbayEats. Deliciousness Delivered. All
            rights reserved.
          </p>

          <div className="flex items-center gap-4 text-neutral-400">
            <a
              href="#facebook"
              className="hover: transition-colors"
              aria-label="Facebook Page"
            >
              <FiFacebook size={22} className="stroke-[2]" />
            </a>
            <a
              href="#instagram"
              className="hover: transition-colors"
              aria-label="Instagram Profile"
            >
              <FiInstagram size={22} className="stroke-[2]" />
            </a>
            <a
              href="#instagram"
              className="hover: transition-colors"
              aria-label="Instagram Profile"
            >
              <FiLinkedin size={22} className="stroke-[2]" />
            </a>
            <a
              href="#twitter"
              className="hover: transition-colors"
              aria-label="X Profile"
            >
              <X size={22} className="stroke-[2]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
