'use client';

import React from 'react';
import {
  BookOpen,
  LayoutDashboard,
  Inbox,
  HelpCircle,
  Radio,
  User,
  Feather,
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
    <header className="bg-white/95 backdrop-blur-xs border-b border-[#e7e5df] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Press Emblem & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChangeTab('landing')}
              className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0f2537] text-white flex items-center justify-center shadow-sm border border-[#16324f] group-hover:scale-105 transition-transform">
                <Feather className="w-5 h-5 text-[#d49b55]" />
              </div>
              <div>
                <span className="text-xl font-serif font-bold text-[#111827] block tracking-tight leading-tight">
                  BookLeaf <span className="text-[#b4691b] font-serif italic text-base font-normal">Publishing</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#6b7280] font-sans font-medium block">
                  Author Support &amp; Operations
                </span>
              </div>
            </button>
          </div>

          {/* Editorial Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onChangeTab('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer ${
                currentTab === 'landing'
                  ? 'bg-[#0f2537] text-white'
                  : 'text-[#374151] hover:text-[#111827] hover:bg-[#f3f1eb]'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => onChangeTab('author')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'author'
                  ? 'bg-[#15803d] text-white shadow-xs'
                  : 'text-[#374151] hover:text-[#15803d] hover:bg-[#f2f9f4]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Author Studio</span>
            </button>

            <button
              onClick={() => onChangeTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'admin'
                  ? 'bg-[#0f2537] text-white shadow-xs ring-1 ring-[#0f2537]'
                  : 'text-[#374151] hover:text-[#0f2537] hover:bg-[#f0f4f8]'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Operations Queue</span>
            </button>

            <button
              onClick={onOpenKnowledgeBase}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f1eb] transition cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#b4691b]" />
              <span className="hidden md:inline">Publishing Rules</span>
            </button>
          </nav>

          {/* Live Indicator & User Chip */}
          <div className="flex items-center gap-3">
            <div
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                isRealtimeConnected
                  ? 'bg-[#f2f9f4] text-[#15803d] border-[#cbe8d5]'
                  : 'bg-[#fef8ee] text-[#b4691b] border-[#fae2c0]'
              }`}
            >
              <Radio
                className={`w-3 h-3 ${
                  isRealtimeConnected
                    ? 'text-[#15803d] animate-pulse'
                    : 'text-[#b4691b]'
                }`}
              />
              <span className="font-mono">{isRealtimeConnected ? 'LIVE FEED ACTIVE' : 'CONNECTING'}</span>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2 pl-3 border-l border-[#e7e5df]">
                <div className="w-8 h-8 rounded-full bg-[#0f2537] text-[#d49b55] border border-[#d49b55]/30 flex items-center justify-center font-serif font-bold text-xs shadow-xs">
                  {currentUser.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <div className="font-bold text-[#111827] truncate max-w-[120px] font-serif">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-[#6b7280] font-mono">
                    {currentUser.role === 'ADMIN' ? 'OPERATIONS DESK' : currentUser.authorId || 'AUTHOR'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-[#6b7280] bg-[#f3f1eb] px-2.5 py-1 rounded-md">
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
