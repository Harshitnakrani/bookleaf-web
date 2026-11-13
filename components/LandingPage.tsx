'use client';

import React from 'react';
import {
  Shield,
  ArrowRight,
  Feather,
  BookOpen,
  Layers,
  Database,
  Cpu,
  RefreshCw,
  Clock,
  Check,
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
    <div className="space-y-16 pb-20 bg-white font-sans text-neutral-900">
      {/* Hero Section */}
      <section className="border-b border-neutral-200 bg-white pt-14 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-mono uppercase tracking-wider">
            <span>BookLeaf Technical Assignment 1 &bull; Production Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-black leading-tight">
            Author Support &amp; Communication Operations
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            High-throughput publishing operations portal built for BookLeaf Publishing. Combines durable{' '}
            <strong className="text-black font-semibold">BullMQ asynchronous auto-triage</strong>,{' '}
            <strong className="text-black font-semibold">Valkey on-demand draft caching</strong>, and an{' '}
            <strong className="text-black font-semibold">80/20 transparent royalty engine</strong>.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onSelectPersona('admin@bookleaf.pub')}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xs bg-black hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Operations Desk</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 text-neutral-400" />
            </button>

            <button
              onClick={() => onSelectPersona('priya.sharma@email.com')}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xs bg-white hover:bg-neutral-100 text-black text-xs font-mono uppercase tracking-wider border border-neutral-300 hover:border-black transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Author Studio (Priya Sharma)</span>
            </button>
          </div>

          {/* Minimal Publisher Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-neutral-200 text-left">
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xs">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block">Catalog Scale</span>
              <span className="text-xl font-bold font-mono text-black">22,000+</span>
              <span className="text-[10px] text-neutral-500 font-mono block">Published Titles</span>
            </div>
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xs">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block">Monthly Ingestion</span>
              <span className="text-xl font-bold font-mono text-black">1,200+</span>
              <span className="text-[10px] text-neutral-500 font-mono block">New Manuscripts</span>
            </div>
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xs">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block">Author Royalty</span>
              <span className="text-xl font-bold font-mono text-black">80% Net</span>
              <span className="text-[10px] text-neutral-500 font-mono block">Quarterly, ₹1,000 floor</span>
            </div>
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xs">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block">Print Turnaround</span>
              <span className="text-xl font-bold font-mono text-black">5–7 Days</span>
              <span className="text-[10px] text-neutral-500 font-mono block">Zero-defect reprint SLA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Evaluator Personas Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="max-w-xl">
          <span className="text-[11px] uppercase font-mono tracking-wider text-neutral-400 block">
            Pre-Seeded Evaluator Roles
          </span>
          <h2 className="text-2xl font-bold text-black tracking-tight mt-1">
            Production Test Personas
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Directly mapped from <code>bookleaf_sample_data.json</code> into Neon PostgreSQL.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Persona 1: Admin */}
          <div className="bg-white border border-neutral-200 rounded-xs p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 bg-black text-white font-mono text-xs flex items-center justify-center rounded-xs">
                  A
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-800 rounded-xs">
                  [OPERATIONS DESK]
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-black">Operations Admin</h3>
                <p className="font-mono text-[11px] text-neutral-400">admin@bookleaf.pub</p>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Oversees triage queues across all 10 authors. Views AI auto-classification, priority scores, and generates on-demand Valkey-cached drafts.
              </p>

              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Backlog:</span>
                  <span className="text-black font-semibold">Active Queue</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">AI Draft:</span>
                  <span className="text-black font-semibold">Valkey Cache 1h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Overrides:</span>
                  <span className="text-black font-semibold">Status &amp; Priority</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPersona('admin@bookleaf.pub')}
              disabled={isLoading}
              className="w-full py-2 bg-black hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider rounded-xs transition cursor-pointer"
            >
              Sign In as Ops Admin
            </button>
          </div>

          {/* Persona 2: Priya Sharma */}
          <div className="bg-white border border-neutral-200 rounded-xs p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 bg-neutral-100 text-black border border-neutral-300 font-mono text-xs flex items-center justify-center rounded-xs">
                  P
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-800 rounded-xs">
                  [AUTH001 &bull; ACTIVE]
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-black">Priya Sharma</h3>
                <p className="font-mono text-[11px] text-neutral-400">priya.sharma@email.com</p>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Two published titles (<em>The Silent Echo</em> &amp; <em>Whispers in the Wind</em>). 1,770 copies sold. Bank account verified. Royalty tracking active.
              </p>

              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Published:</span>
                  <span className="text-black font-semibold">2 Titles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Pending:</span>
                  <span className="text-black font-semibold">₹3,450 (Eligible)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Banking:</span>
                  <span className="text-black font-semibold">Verified</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPersona('priya.sharma@email.com')}
              disabled={isLoading}
              className="w-full py-2 bg-white hover:bg-neutral-100 text-black border border-neutral-300 hover:border-black text-xs font-mono uppercase tracking-wider rounded-xs transition cursor-pointer"
            >
              Sign In as Priya
            </button>
          </div>

          {/* Persona 3: Sneha Kulkarni */}
          <div className="bg-white border border-neutral-200 rounded-xs p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 bg-neutral-100 text-black border border-neutral-300 font-mono text-xs flex items-center justify-center rounded-xs">
                  S
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-800 rounded-xs">
                  [AUTH007 &bull; PRODUCTION]
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-black">Sneha Kulkarni</h3>
                <p className="font-mono text-[11px] text-neutral-400">sneha.kulkarni@email.com</p>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                Manuscript in active typesetting &amp; cover design (<em>Starlight &amp; Shadows</em>). Bank details pending verification.
              </p>

              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xs space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Production:</span>
                  <span className="text-black font-semibold">Cover Design</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Pending:</span>
                  <span className="text-black font-semibold">₹0 (Pre-Release)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Banking:</span>
                  <span className="text-neutral-500 font-semibold">Pending Link</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPersona('sneha.kulkarni@email.com')}
              disabled={isLoading}
              className="w-full py-2 bg-white hover:bg-neutral-100 text-black border border-neutral-300 hover:border-black text-xs font-mono uppercase tracking-wider rounded-xs transition cursor-pointer"
            >
              Sign In as Sneha
            </button>
          </div>
        </div>
      </section>

      {/* Technical Architecture Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-t border-neutral-200 pt-10">
          <span className="text-[11px] uppercase font-mono tracking-wider text-neutral-400 block">
            System Topology
          </span>
          <h2 className="text-2xl font-bold text-black tracking-tight mt-1">
            Architectural Blueprint
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
            <span className="text-neutral-400 uppercase text-[10px] block">Ingestion Layer</span>
            <h4 className="text-sm font-bold text-black font-sans">Durable Database First</h4>
            <p className="text-neutral-600 text-[11px] font-sans">
              All author queries commit to Neon PostgreSQL immediately before dispatching to queues. Zero data loss.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
            <span className="text-neutral-400 uppercase text-[10px] block">Queue Engine</span>
            <h4 className="text-sm font-bold text-black font-sans">BullMQ Asynchronous Triage</h4>
            <p className="text-neutral-600 text-[11px] font-sans">
              Handles classification and priority scoring out-of-band with fallback to deterministic heuristic rules.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
            <span className="text-neutral-400 uppercase text-[10px] block">Cache Strategy</span>
            <h4 className="text-sm font-bold text-black font-sans">Valkey TLS (1h TTL)</h4>
            <p className="text-neutral-600 text-[11px] font-sans">
              AI response drafts generated on-demand and cached in Valkey. Flushed instantly whenever a message is sent.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2">
            <span className="text-neutral-400 uppercase text-[10px] block">Intelligence</span>
            <h4 className="text-sm font-bold text-black font-sans">Groq LLM + Domain Rules</h4>
            <p className="text-neutral-600 text-[11px] font-sans">
              Auto-classifies into 6 BookLeaf categories with high-speed JSON mode; resilient fallback on rate-limits.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
