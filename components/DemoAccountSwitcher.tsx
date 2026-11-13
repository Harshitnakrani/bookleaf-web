'use client';

import React from 'react';
import { ShieldCheck, UserCheck, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';

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
    badge: 'Admin Queue',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
    activeColor: 'bg-indigo-600 text-white border-indigo-600 shadow-sm',
  },
  {
    role: 'AUTHOR',
    name: 'Priya Sharma (AUTH001)',
    email: 'priya.sharma@email.com',
    badge: 'Published & Royalties',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
    activeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-sm',
  },
  {
    role: 'AUTHOR',
    name: 'Sneha Kulkarni (AUTH007)',
    email: 'sneha.kulkarni@email.com',
    badge: 'Books In Production',
    color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100',
    activeColor: 'bg-amber-600 text-white border-amber-600 shadow-sm',
  },
  {
    role: 'AUTHOR',
    name: 'Rohit Kapoor (AUTH002)',
    email: 'rohit.kapoor@email.com',
    badge: 'High Sales Volume',
    color: 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100',
    activeColor: 'bg-sky-600 text-white border-sky-600 shadow-sm',
  },
];

export const DemoAccountSwitcher: React.FC<Props> = ({
  currentUser,
  onSelectPersona,
  onLogout,
  isLoading,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2.5 text-xs shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold text-slate-700">Quick Test Personas:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DEMO_PERSONAS.map((p) => {
            const isActive = currentUser?.email === p.email;
            return (
              <button
                key={p.email}
                disabled={isLoading}
                onClick={() => onSelectPersona(p.email)}
                className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                  isActive ? p.activeColor : p.color
                }`}
              >
                {isActive ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : p.role === 'ADMIN' ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : (
                  <UserCheck className="w-3 h-3" />
                )}
                <span>{p.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-slate-200/60 text-slate-700'
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
              className="ml-2 text-slate-500 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition cursor-pointer flex items-center gap-1"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
