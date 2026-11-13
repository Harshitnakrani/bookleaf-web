'use client';

import React from 'react';

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
    <header className="bg-white border-b border-neutral-100 sticky top-0 z-40 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        {/* Minimal Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onChangeTab('landing')}
            className="font-bold tracking-tight text-black text-sm cursor-pointer"
          >
            BookLeaf
          </button>

          {/* Minimal Links */}
          <nav className="flex items-center gap-4 text-xs">
            <button
              onClick={() => onChangeTab('landing')}
              className={`transition-colors cursor-pointer ${
                currentTab === 'landing' ? 'text-black font-semibold' : 'text-neutral-400 hover:text-black'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => onChangeTab('author')}
              className={`transition-colors cursor-pointer ${
                currentTab === 'author' ? 'text-black font-semibold' : 'text-neutral-400 hover:text-black'
              }`}
            >
              Author
            </button>
            <button
              onClick={() => onChangeTab('admin')}
              className={`transition-colors cursor-pointer ${
                currentTab === 'admin' ? 'text-black font-semibold' : 'text-neutral-400 hover:text-black'
              }`}
            >
              Ops Desk
            </button>
            <button
              onClick={onOpenKnowledgeBase}
              className="text-neutral-400 hover:text-black transition-colors cursor-pointer"
            >
              Codex
            </button>
          </nav>
        </div>

        {/* Status & User */}
        <div className="flex items-center gap-4 font-mono text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isRealtimeConnected ? 'bg-black' : 'bg-neutral-300'
              }`}
            />
            <span className="text-[10px] uppercase">{isRealtimeConnected ? 'Live' : 'Standby'}</span>
          </div>

          {currentUser && (
            <div className="text-neutral-600">
              <span className="text-black font-medium">{currentUser.name}</span>
              <span className="text-neutral-400 ml-1">
                ({currentUser.role === 'ADMIN' ? 'Admin' : currentUser.authorId || 'Author'})
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
