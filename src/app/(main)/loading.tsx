
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="bg-white fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-2">
        <span className="font-extrabold text-xl tracking-normal text-neutral-900">
          Flexbay<span className="text-amber-500">Eats</span>
        </span>
      </div>

      <div
        className="h-8 w-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingScreen;