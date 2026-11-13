'use client';

import React from 'react';
import {
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
  HelpCircle,
  Radio,
  User,
} from 'lucide-react';

interface Props {
  currentTab: 'landing' | 'author' | 'admin';
  onChangeTab: (tab: 'landing' | 'author' | 'admin') => void;
  currentUser: any | null;
  onOpenKnowledgeBase: () => void;
  isRealtimeConnected: boolean;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onChangeTab,
  currentUser,
  onOpenKnowledgeBase,
  isRealtimeConnected,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChangeTab('landing')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-[#1a365d] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-lg font-serif font-bold tracking-tight text-slate-900 block leading-tight">
                  BookLeaf <span className="text-amber-600 font-sans text-xs uppercase tracking-wider font-semibold ml-1">Portal</span>
                </span>
                <span className="text-[11px] text-slate-500 block leading-none">
                  Author Support & Communication
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onChangeTab('landing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'landing'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onChangeTab('author')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'author'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-200'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>Author Portal</span>
            </button>

            <button
              onClick={() => onChangeTab('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'admin'
                  ? 'bg-indigo-50 text-indigo-800 font-semibold ring-1 ring-indigo-200'
                  : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Admin Queue</span>
            </button>

            <button
              onClick={onOpenKnowledgeBase}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span className="hidden md:inline">Knowledge Base</span>
            </button>
          </nav>

          {/* User Badge & Live Connection */}
          <div className="flex items-center gap-3">
            {/* Realtime indicator */}
            <div
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                isRealtimeConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title={isRealtimeConnected ? 'WebSocket & SSE Connected' : 'Reconnecting...'}
            >
              <Radio
                className={`w-3 h-3 ${
                  isRealtimeConnected
                    ? 'text-emerald-500 animate-pulse'
                    : 'text-amber-500'
                }`}
              />
              <span>{isRealtimeConnected ? 'Live Real-Time' : 'Syncing'}</span>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-xs shadow-xs">
                  {currentUser.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <div className="font-semibold text-slate-800 truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {currentUser.role === 'ADMIN' ? 'OPS ADMIN' : currentUser.authorId || 'AUTHOR'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                <User className="w-3.5 h-3.5" />
                <span>Guest</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
