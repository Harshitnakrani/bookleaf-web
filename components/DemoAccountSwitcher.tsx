'use client';

import React from 'react';

interface Props {
  currentUser: any | null;
  onSelectPersona: (email: string) => Promise<void>;
  onLogout: () => void;
  isLoading: boolean;
}

const PERSONAS = [
  { name: 'Ops Admin', email: 'admin@bookleaf.pub', label: 'Admin' },
  { name: 'Priya Sharma', email: 'priya.sharma@email.com', label: 'AUTH001' },
  { name: 'Sneha Kulkarni', email: 'sneha.kulkarni@email.com', label: 'AUTH007' },
  { name: 'Rohit Kapoor', email: 'rohit.kapoor@email.com', label: 'AUTH002' },
];

export const DemoAccountSwitcher: React.FC<Props> = ({
  currentUser,
  onSelectPersona,
  onLogout,
  isLoading,
}) => {
  return (
    <div className="border-b border-neutral-100 bg-white px-4 py-1.5 text-[11px] font-mono text-neutral-500">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Switch:</span>
          {PERSONAS.map((p) => {
            const isActive = currentUser?.email === p.email;
            return (
              <button
                key={p.email}
                disabled={isLoading}
                onClick={() => onSelectPersona(p.email)}
                className={`transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-black font-bold underline underline-offset-4 decoration-black decoration-1'
                    : 'text-neutral-400 hover:text-black'
                }`}
              >
                {p.name} <span className="text-[10px] opacity-60">({p.label})</span>
              </button>
            );
          })}
        </div>

        {currentUser && (
          <button
            onClick={onLogout}
            className="text-neutral-400 hover:text-black transition-colors cursor-pointer whitespace-nowrap"
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  );
};
