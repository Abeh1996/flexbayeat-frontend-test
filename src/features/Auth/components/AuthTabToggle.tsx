// src/features/Auth/components/AuthTabToggle.tsx
'use client';
import React from 'react';

interface Tab {
  key: string;
  label: string;
}

interface AuthTabToggleProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

export function AuthTabToggle({ tabs, active, onChange }: AuthTabToggleProps) {
  return (
    <div className="flex w-full border border-zinc-200 bg-white rounded-xl overflow-hidden">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`
              flex-1 py-3 text-sm font-semibold tracking-wide uppercase transition-colors duration-150
              ${isActive
                ? 'bg-amber-500 text-white'
                : 'bg-white text-zinc-500 hover:text-zinc-800'
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}