'use client';

import React from 'react';
import { Shield, User, LogOut, Radio, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { HoverBorderGradient } from './ui/hover-border-gradient';

interface Props {
  currentTab: 'landing' | 'author' | 'admin';
  onChangeTab: (tab: 'landing' | 'author' | 'admin') => void;
  currentUser: any | null;
  onOpenLogin: (role?: 'ADMIN' | 'AUTHOR') => void;
  onLogout: () => void;
  onOpenKnowledgeBase: () => void;
  isRealtimeConnected: boolean;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onChangeTab,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenKnowledgeBase,
  isRealtimeConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => onChangeTab('landing')}
            className="flex items-center gap-2.5 text-left cursor-pointer focus:outline-hidden group"
          >
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold font-mono text-xs shadow-xs group-hover:scale-105 transition-transform">
              BL
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-neutral-900 block leading-tight">
                BookLeaf Publishing
              </span>
              <span className="text-[10px] text-neutral-400 font-mono tracking-wider block">
                Author &amp; Operations Portal
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            <button
              onClick={() => onChangeTab('landing')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                currentTab === 'landing'
                  ? 'text-black bg-neutral-100 font-semibold'
                  : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
              }`}
            >
              Overview
            </button>

            {currentUser?.role === 'AUTHOR' && (
              <button
                onClick={() => onChangeTab('author')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'author'
                    ? 'text-black bg-neutral-100 font-semibold'
                    : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Author Studio</span>
              </button>
            )}

            {currentUser?.role === 'ADMIN' && (
              <button
                onClick={() => onChangeTab('admin')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'admin'
                    ? 'text-black bg-neutral-100 font-semibold'
                    : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Ops Desk</span>
              </button>
            )}

            <button
              onClick={onOpenKnowledgeBase}
              className="px-3 py-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-50 transition cursor-pointer"
            >
              Policy Codex
            </button>
          </nav>
        </div>

        {/* Right Section: Auth State / Actions */}
        <div className="flex items-center gap-3">
          {/* Live Sync Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-[10px] font-mono text-neutral-600">
            <Radio
              className={`w-3 h-3 ${isRealtimeConnected ? 'text-black animate-pulse' : 'text-neutral-400'}`}
            />
            <span>{isRealtimeConnected ? 'LIVE FEED' : 'STANDBY'}</span>
          </div>

          {currentUser ? (
            /* Logged In User Pill */
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right text-xs hidden sm:block">
                <div className="font-semibold text-neutral-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-mono text-neutral-400">
                  {currentUser.role === 'ADMIN' ? 'Chief Operations' : currentUser.authorId || 'Author'}
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 border border-neutral-200 hover:border-black rounded-xl text-neutral-500 hover:text-black transition cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            /* Logged Out: Action Buttons to Sign In */
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenLogin('AUTHOR')}
                className="px-3.5 py-1.5 rounded-xl border border-neutral-200 hover:border-black text-neutral-800 text-xs font-medium transition cursor-pointer"
              >
                Author Login
              </button>

              <HoverBorderGradient
                onClick={() => onOpenLogin('ADMIN')}
                className="py-1.5 px-3.5 text-xs font-semibold"
              >
                <span>Ops Portal</span>
                <ArrowRight className="w-3 h-3" />
              </HoverBorderGradient>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
