'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16 text-neutral-900 font-sans">
      {/* Hero */}
      <section className="space-y-5">
        <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-widest block">
          BookLeaf Publishing &bull; Technical Assignment 1
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
          Author Support &amp; Operations Portal
        </h1>

        <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
          High-throughput publishing portal built to serve 22,000+ catalog titles and 1,200+ monthly manuscripts.
          Features durable BullMQ asynchronous auto-triage, Valkey on-demand draft caching (1h TTL), and an 80/20 transparent royalty engine.
        </p>

        {/* Quick entry links */}
        <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
          <button
            onClick={() => onSelectPersona('admin@bookleaf.pub')}
            disabled={isLoading}
            className="px-3.5 py-1.5 bg-black text-white hover:bg-neutral-800 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Enter Ops Desk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onSelectPersona('priya.sharma@email.com')}
            disabled={isLoading}
            className="px-3.5 py-1.5 border border-neutral-300 hover:border-black text-black transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Enter Author Studio (Priya)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Inline Metrics */}
        <div className="pt-6 border-t border-neutral-100 flex flex-wrap gap-x-8 gap-y-2 text-xs font-mono text-neutral-500">
          <div><span className="text-black font-semibold">22,000+</span> titles</div>
          <div><span className="text-black font-semibold">1,200+</span> manuscripts/mo</div>
          <div><span className="text-black font-semibold">80%</span> net royalty</div>
          <div><span className="text-black font-semibold">₹1,000</span> payout floor</div>
          <div><span className="text-black font-semibold">5–7 days</span> print SLA</div>
        </div>
      </section>

      {/* Test Personas */}
      <section className="space-y-4 pt-4 border-t border-neutral-100">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          Test Personas (Pre-seeded in Neon DB)
        </h2>

        <div className="divide-y divide-neutral-100 text-xs">
          <div className="py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-semibold text-black">
                Operations Admin <span className="font-mono text-neutral-400 font-normal text-[11px]">(admin@bookleaf.pub)</span>
              </div>
              <p className="text-neutral-500 text-[11px]">
                Global triage backlog, Groq AI classifications, Valkey draft generation, priority &amp; status overrides.
              </p>
            </div>
            <button
              onClick={() => onSelectPersona('admin@bookleaf.pub')}
              disabled={isLoading}
              className="text-xs font-mono text-black hover:underline cursor-pointer"
            >
              Sign In &rarr;
            </button>
          </div>

          <div className="py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-semibold text-black">
                Priya Sharma <span className="font-mono text-neutral-400 font-normal text-[11px]">(AUTH001 &bull; priya.sharma@email.com)</span>
              </div>
              <p className="text-neutral-500 text-[11px]">
                2 published titles, 1,770 units sold, ₹3,450 royalty pending (eligible for payout), bank details verified.
              </p>
            </div>
            <button
              onClick={() => onSelectPersona('priya.sharma@email.com')}
              disabled={isLoading}
              className="text-xs font-mono text-black hover:underline cursor-pointer"
            >
              Sign In &rarr;
            </button>
          </div>

          <div className="py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-semibold text-black">
                Sneha Kulkarni <span className="font-mono text-neutral-400 font-normal text-[11px]">(AUTH007 &bull; sneha.kulkarni@email.com)</span>
              </div>
              <p className="text-neutral-500 text-[11px]">
                1 title in production (Cover Design), 0 units sold, bank details pending link.
              </p>
            </div>
            <button
              onClick={() => onSelectPersona('sneha.kulkarni@email.com')}
              disabled={isLoading}
              className="text-xs font-mono text-black hover:underline cursor-pointer"
            >
              Sign In &rarr;
            </button>
          </div>

          <div className="py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-semibold text-black">
                Rohit Kapoor <span className="font-mono text-neutral-400 font-normal text-[11px]">(AUTH002 &bull; rohit.kapoor@email.com)</span>
              </div>
              <p className="text-neutral-500 text-[11px]">
                High-volume author, 2,079 copies sold across 2 editions, ₹4,150 royalty pending.
              </p>
            </div>
            <button
              onClick={() => onSelectPersona('rohit.kapoor@email.com')}
              disabled={isLoading}
              className="text-xs font-mono text-black hover:underline cursor-pointer"
            >
              Sign In &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="space-y-4 pt-4 border-t border-neutral-100">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
          Architecture Highlights
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="border border-neutral-100 p-3.5 space-y-1">
            <div className="font-bold text-black font-sans">Durable Database-First Ingestion</div>
            <p className="text-neutral-500 text-[11px] font-sans">
              Every query commits to Neon PostgreSQL before entering BullMQ. Zero data loss on queue stalls.
            </p>
          </div>

          <div className="border border-neutral-100 p-3.5 space-y-1">
            <div className="font-bold text-black font-sans">BullMQ Asynchronous Auto-Triage</div>
            <p className="text-neutral-500 text-[11px] font-sans">
              Background workers classify and assign priority via Groq LLM with deterministic regex fallback.
            </p>
          </div>

          <div className="border border-neutral-100 p-3.5 space-y-1">
            <div className="font-bold text-black font-sans">Valkey TLS On-Demand Draft Cache</div>
            <p className="text-neutral-500 text-[11px] font-sans">
              Admin drafts generated on request, cached for 1h, and purged immediately when new messages arrive.
            </p>
          </div>

          <div className="border border-neutral-100 p-3.5 space-y-1">
            <div className="font-bold text-black font-sans">80/20 Transparent Royalty Engine</div>
            <p className="text-neutral-500 text-[11px] font-sans">
              Authors track live accrued royalties and progress toward the quarterly ₹1,000 disbursement threshold.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
