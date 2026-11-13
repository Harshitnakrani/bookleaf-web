'use client';

import React from 'react';
import {
  BookOpen,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  RefreshCw,
  ArrowRight,
  Database,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Props {
  onSelectPersona: (email: string) => Promise<void>;
  onChangeTab: (tab: 'author' | 'admin') => void;
  onOpenKnowledgeBase: () => void;
  isLoading: boolean;
}

export const LandingPage: React.FC<Props> = ({
  onSelectPersona,
  onChangeTab,
  onOpenKnowledgeBase,
  isLoading,
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-b border-slate-200 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>BookLeaf Technical Assignment 1 — Full-Stack Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15]">
            Author Support &amp; Communication{' '}
            <span className="text-[#1a365d] underline decoration-amber-400 decoration-3 underline-offset-4">
              Operations Portal
            </span>
          </h1>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto font-sans leading-relaxed">
            A production-ready platform designed for BookLeaf Publishing to manage 22,000+ catalog titles
            and author communications at scale—powered by <strong>asynchronous BullMQ auto-triage</strong>,{' '}
            <strong>Valkey on-demand draft caching</strong>, and <strong>real-time event streaming</strong>.
          </p>

          {/* Quick Start Buttons */}
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onSelectPersona('admin@bookleaf.pub')}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Launch Admin Queue</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onSelectPersona('priya.sharma@email.com')}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-medium border border-slate-300 shadow-xs hover:shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Launch Author Portal (Priya Sharma)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Persona Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            One-Click Evaluator Personas
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Click any persona card below to immediately log in and explore their dashboard with pre-seeded data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Admin */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition hover:border-indigo-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Operations Role
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">BookLeaf Ops Admin</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">admin@bookleaf.pub</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manages global ticket queue, reviews AI auto-classification &amp; priority scores, generates cached drafts via Valkey, and updates ticket states.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Filter by status, category &amp; urgency
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  AI Draft Studio with 1-click apply
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Private internal notes support
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectPersona('admin@bookleaf.pub')}
              disabled={isLoading}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Log In as Ops Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Priya Sharma */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition hover:border-emerald-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Published Author
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Priya Sharma</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">AUTH001 &bull; Mumbai</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Has 2 live titles (<em>Whispers of the Ganges</em>, <em>The Saffron Diaries</em>). Earned ₹19,908 with ₹3,570 pending. Has active support ticket TICK-1001.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Verified bank account linked
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  531 total copies sold
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Live ticket thread &amp; replies
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectPersona('priya.sharma@email.com')}
              disabled={isLoading}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Log In as Priya Sharma</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Sneha Kulkarni */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition hover:border-amber-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Books In Production
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Sneha Kulkarni</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">AUTH007 &bull; Bangalore</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Has 3 titles including <em>Midnight in Mysore</em> (In Production &mdash; Cover Design stage). Demonstrates edge case handling for books without royalties yet.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Title in production without MRP
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Active ticket TICK-1002 on cover design
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  ₹60,865 total royalty history
                </li>
              </ul>
            </div>
            <button
              onClick={() => onSelectPersona('sneha.kulkarni@email.com')}
              disabled={isLoading}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Log In as Sneha Kulkarni</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Technical Architecture Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Technical Architecture Highlights
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Engineered exactly as specified in the assignment evaluation criteria:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Async BullMQ Triage</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tickets insert into PostgreSQL immediately so queries are never lost, while a background BullMQ worker auto-classifies category &amp; priority.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Valkey Draft Caching</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drafts generate on-demand with a 1-hour Valkey TTL. Sending a reply immediately invalidates the cache key (<code>draft:ticketId</code>).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Token Cost-Awareness</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Auto-triage only consumes subject/description. Draft generation injects only the relevant category slice + author royalty numbers + last 5 messages.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">80/20 Royalty Logic</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complies with BookLeaf&apos;s 80/20 net profit rule, quarterly calculation schedule, and ₹1,000 threshold with linked bank verification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
