// MobileSidebar.tsx
import React from "react";
import {
  X,
  ShoppingBag,
  Heart,
  User,
  MapPin,
  Phone,
  Search,
  ChevronRight,
} from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 z-50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer Canvas */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-full max-w-[320px] bg-white z-50 flex flex-col justify-between shadow-xl transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-xl tracking-normal text-neutral-900">
                Flexbay<span className="text-amber-500">Eats</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-900 focus:outline-none transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Location Context */}
          <div className="px-4 py-2 bg-amber-500 border-b border-neutral-100 flex items-center gap-2 text-xs text-neutral-600">
            <MapPin size={14} className="text-white shrink-0" />
            <span className="truncate font-medium text-white">
              Deliver to: Buea, SW Cameroon
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1">
            {[
              { label: "Browse Menu", href: "#menu" },
              { label: "Special Offers", href: "#offers" },
              { label: "Track Order", href: "#track" },
              { label: "Become a Partner", href: "#partner" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center justify-between p-3 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-[2px] transition-colors"
              >
                {link.label}
                <ChevronRight size={16} className="text-neutral-400" />
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom Utility Profile Footer */}
        <div className="p-4 border-t border-neutral-100 space-y-4 bg-neutral-50">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
            <Phone size={14} className="text-amber-500" />
            <span>Hotline: +237 677 000 000</span>
          </div>
        </div>
      </aside>
    </>
  );
};
