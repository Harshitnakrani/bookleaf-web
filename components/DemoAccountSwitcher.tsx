'use client';

import React from 'react';
import { Shield, BookOpen, Feather, LogOut, CheckCircle2 } from 'lucide-react';

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
    styleActive: 'bg-[#0f2537] text-white border-[#0f2537] shadow-sm',
    styleDefault: 'bg-[#f0f4f8] border-[#d2deeb] text-[#0f2537] hover:bg-[#e4ecf4]',
  },
  {
    role: 'AUTHOR',
    name: 'Priya Sharma',
    code: 'AUTH001',
    email: 'priya.sharma@email.com',
    badge: '2 Live Titles &bull; Royalty Active',
    type: 'Author',
    styleActive: 'bg-[#15803d] text-white border-[#15803d] shadow-sm',
    styleDefault: 'bg-[#f2f9f4] border-[#cbe8d5] text-[#15803d] hover:bg-[#e3f4e8]',
  },
  {
    role: 'AUTHOR',
    name: 'Sneha Kulkarni',
    code: 'AUTH007',
    email: 'sneha.kulkarni@email.com',
    badge: 'In Production (Cover Design)',
    type: 'Author',
    styleActive: 'bg-[#b4691b] text-white border-[#b4691b] shadow-sm',
    styleDefault: 'bg-[#fef8ee] border-[#fae2c0] text-[#b4691b] hover:bg-[#fdf0dc]',
  },
  {
    role: 'AUTHOR',
    name: 'Rohit Kapoor',
    code: 'AUTH002',
    email: 'rohit.kapoor@email.com',
    badge: 'High Volume &bull; 2,079 Sold',
    type: 'Author',
    styleActive: 'bg-[#4338ca] text-white border-[#4338ca] shadow-sm',
    styleDefault: 'bg-[#f5f3ff] border-[#ddd6fe] text-[#4338ca] hover:bg-[#ede9fe]',
  },
];

export const DemoAccountSwitcher: React.FC<Props> = ({
  currentUser,
  onSelectPersona,
  onLogout,
  isLoading,
}) => {
  return (
    <div className="bg-[#fcfbf9] border-b border-[#e7e5df] px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#b4691b]"></span>
          <span className="font-serif font-bold text-[#111827] tracking-tight">
            BookLeaf Dossier Switcher:
          </span>
          <span className="text-[11px] text-[#6b7280] hidden sm:inline">
            (Pre-seeded evaluators)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DEMO_PERSONAS.map((p) => {
            const isActive = currentUser?.email === p.email;
            return (
              <button
                key={p.email}
                disabled={isLoading}
                onClick={() => onSelectPersona(p.email)}
                className={`px-3 py-1 rounded-full border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                  isActive ? p.styleActive : p.styleDefault
                }`}
              >
                {isActive ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : p.role === 'ADMIN' ? (
                  <Shield className="w-3 h-3" />
                ) : (
                  <Feather className="w-3 h-3" />
                )}
                <span className="font-semibold">{p.name}</span>
                {p.code && (
                  <span className="font-mono text-[10px] opacity-75">
                    [{p.code}]
                  </span>
                )}
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full hidden md:inline ${
                    isActive ? 'bg-white/20' : 'bg-black/5 text-current'
                  }`}
                >
                  {p.badge}
                </span>
              </button>
            );
          })}

          {currentUser && (
            <button
              onClick={onLogout}
              className="ml-2 text-[#6b7280] hover:text-[#be123c] p-1 rounded hover:bg-[#ffe4e6] transition cursor-pointer flex items-center gap-1 text-[11px]"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
