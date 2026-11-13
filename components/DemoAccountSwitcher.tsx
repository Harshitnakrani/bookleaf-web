'use client';

import React from 'react';
import { Shield, User, LogOut, Check } from 'lucide-react';

interface Props {
  currentUser: any | null;
  onSelectPersona: (email: string) => Promise<void>;
  onLogout: () => void;
  isLoading: boolean;
}

const DEMO_PERSONAS = [
  {
    role: 'ADMIN',
    name: 'Ops Admin',
    email: 'admin@bookleaf.pub',
    badge: 'Operations Desk',
    type: 'Desk',
  },
  {
    role: 'AUTHOR',
    name: 'Priya Sharma',
    code: 'AUTH001',
    email: 'priya.sharma@email.com',
    badge: '2 Titles • Royalty Active',
    type: 'Author',
  },
  {
    role: 'AUTHOR',
    name: 'Sneha Kulkarni',
    code: 'AUTH007',
    email: 'sneha.kulkarni@email.com',
    badge: 'Cover Design In-Progress',
    type: 'Author',
  },
  {
    role: 'AUTHOR',
    name: 'Rohit Kapoor',
    code: 'AUTH002',
    email: 'rohit.kapoor@email.com',
    badge: '2,079 Copies Sold',
    type: 'Author',
  },
];

export const DemoAccountSwitcher: React.FC<Props> = ({
  currentUser,
  onSelectPersona,
  onLogout,
  isLoading,
}) => {
  return (
    <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2 text-xs font-sans">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Persona Selector:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {DEMO_PERSONAS.map((p) => {
            const isActive = currentUser?.email === p.email;
            return (
              <button
                key={p.email}
                disabled={isLoading}
                onClick={() => onSelectPersona(p.email)}
                className={`px-2.5 py-1 text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 border rounded-sm font-mono ${
                  isActive
                    ? 'bg-black text-white border-black font-semibold'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-black hover:text-black'
                }`}
              >
                {isActive && <Check className="w-3 h-3 text-white" />}
                <span>{p.name}</span>
                {p.code && (
                  <span className={`text-[10px] ${isActive ? 'text-neutral-300' : 'text-neutral-400'}`}>
                    [{p.code}]
                  </span>
                )}
                <span
                  className={`text-[10px] hidden md:inline ml-0.5 ${
                    isActive ? 'text-neutral-300' : 'text-neutral-400'
                  }`}
                >
                  &mdash; {p.badge}
                </span>
              </button>
            );
          })}

          {currentUser && (
            <button
              onClick={onLogout}
              className="ml-2 text-neutral-500 hover:text-black px-2 py-1 border border-transparent hover:border-neutral-300 rounded-sm transition cursor-pointer flex items-center gap-1 text-[11px] font-mono"
              title="Sign Out"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
