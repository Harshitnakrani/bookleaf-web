'use client';

import React from 'react';
import {
  BookOpen,
  Inbox,
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
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Minimalist Brand Mark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChangeTab('landing')}
              className="flex items-center gap-2.5 text-left cursor-pointer focus:outline-hidden"
            >
              <div className="w-7 h-7 bg-black text-white font-mono font-bold text-xs flex items-center justify-center rounded-xs">
                BL
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-black leading-none">
                  BookLeaf Publishing
                </span>
                <span className="text-[9px] uppercase tracking-wider font-mono text-neutral-400 mt-0.5">
                  Author Support Operations
                </span>
              </div>
            </button>
          </div>

          {/* Minimal Tab Navigation */}
          <nav className="flex items-center gap-1">
            <button
              onClick={() => onChangeTab('landing')}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition cursor-pointer rounded-xs ${
                currentTab === 'landing'
                  ? 'bg-black text-white'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => onChangeTab('author')}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 rounded-xs ${
                currentTab === 'author'
                  ? 'bg-black text-white'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Author Studio</span>
            </button>

            <button
              onClick={() => onChangeTab('admin')}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 rounded-xs ${
                currentTab === 'admin'
                  ? 'bg-black text-white'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Ops Queue</span>
            </button>

            <button
              onClick={onOpenKnowledgeBase}
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-black hover:bg-neutral-100 transition cursor-pointer flex items-center gap-1.5 rounded-xs border border-transparent hover:border-neutral-200"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Policy Codex</span>
            </button>
          </nav>

          {/* Minimal Live Status & User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 border border-neutral-200 rounded-xs text-[10px] font-mono text-neutral-600">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isRealtimeConnected ? 'bg-black animate-pulse' : 'bg-neutral-300'
                }`}
              />
              <span>{isRealtimeConnected ? 'LIVE' : 'STANDBY'}</span>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2 pl-3 border-l border-neutral-200">
                <div className="w-7 h-7 bg-neutral-100 text-black border border-neutral-300 flex items-center justify-center font-mono font-bold text-xs rounded-xs">
                  {currentUser.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left text-xs leading-none">
                  <div className="font-semibold text-black truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                    {currentUser.role === 'ADMIN' ? 'ADMIN' : currentUser.authorId || 'AUTHOR'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-xs font-mono">
                <User className="w-3 h-3" />
                <span>Guest</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
