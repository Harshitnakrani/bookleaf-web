'use client';

import React from 'react';
import {
  BookOpen,
  Shield,
  Zap,
  Clock,
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  Feather,
  CheckCircle,
  FileText,
  DollarSign,
  TrendingUp,
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
    <div className="space-y-16 pb-20 bg-[#faf9f5]">
      {/* Hero: Modern Literary Press Banner */}
      <section className="relative border-b border-[#e7e5df] bg-[#fbfbfa] pt-14 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fef8ee] border border-[#fae2c0] text-[#92400e] text-xs font-semibold tracking-wider uppercase font-mono shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#b4691b]" />
            <span>BookLeaf Technical Assignment 1 &bull; Full-Stack Solution</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#111827] tracking-tight leading-[1.12]">
            Author Support &amp; Communication{' '}
            <span className="italic font-normal text-[#0f2537] underline decoration-[#d49b55] decoration-2 underline-offset-8">
              Operations Portal
            </span>
          </h1>

          <p className="text-lg text-[#374151] max-w-3xl mx-auto font-sans leading-relaxed">
            Engineered for BookLeaf Publishing to process <strong>1,200+ books monthly</strong> across a catalog of <strong>22,000+ titles</strong>.
            Combines durable <strong>BullMQ asynchronous auto-triage</strong> with <strong>Valkey on-demand draft caching</strong> and an <strong>80/20 transparent royalty engine</strong>.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onSelectPersona('admin@bookleaf.pub')}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-[#0f2537] hover:bg-[#16324f] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition flex items-center gap-2.5 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#d49b55]" />
              <span>Open Operations Desk</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5 text-white/70" />
            </button>

            <button
              onClick={() => onSelectPersona('priya.sharma@email.com')}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-white hover:bg-[#f3f1eb] text-[#111827] text-xs font-bold uppercase tracking-wider border border-[#d6d3cb] shadow-2xs hover:shadow-sm transition flex items-center gap-2.5 cursor-pointer"
            >
              <Feather className="w-4 h-4 text-[#15803d]" />
              <span>Launch Author Studio (Priya Sharma)</span>
            </button>
          </div>

          {/* Publisher Stats Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-[#e7e5df] text-left">
            <div className="p-3 bg-white/70 rounded-xl border border-[#e7e5df]">
              <span className="text-[10px] uppercase font-mono text-[#6b7280] block">Catalog Scale</span>
              <span className="text-xl font-serif font-bold text-[#111827]">22,000+ Titles</span>
              <span className="text-[10px] text-[#6b7280] block">India &amp; US distribution</span>
            </div>
            <div className="p-3 bg-white/70 rounded-xl border border-[#e7e5df]">
              <span className="text-[10px] uppercase font-mono text-[#6b7280] block">Monthly Volume</span>
              <span className="text-xl font-serif font-bold text-[#111827]">1,200+ Books</span>
              <span className="text-[10px] text-[#6b7280] block">In-House + Repro India</span>
            </div>
            <div className="p-3 bg-white/70 rounded-xl border border-[#e7e5df]">
              <span className="text-[10px] uppercase font-mono text-[#6b7280] block">Royalty Model</span>
              <span className="text-xl font-serif font-bold text-[#15803d]">80/20 Net Profit</span>
              <span className="text-[10px] text-[#6b7280] block">Quarterly, ₹1,000 floor</span>
            </div>
            <div className="p-3 bg-white/70 rounded-xl border border-[#e7e5df]">
              <span className="text-[10px] uppercase font-mono text-[#6b7280] block">Print Turnaround</span>
              <span className="text-xl font-serif font-bold text-[#0f2537]">5–7 Bus. Days</span>
              <span className="text-[10px] text-[#6b7280] block">Free reprint guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Case Dossiers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-mono tracking-widest text-[#b4691b] font-bold block">
            Pre-Seeded Evaluator Personas
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#111827] mt-1">
            Explore Realistic Author &amp; Ops Scenarios
          </h2>
          <p className="text-sm text-[#4b5563] mt-1">
            Loaded directly from <code>bookleaf_sample_data.json</code> into Neon PostgreSQL. Click any dossier to test immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dossier 1: Ops Admin */}
          <div className="bg-white rounded-2xl border border-[#e7e5df] p-6 shadow-paper shadow-paper-hover transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#0f2537] text-white flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#d49b55]" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#f0f4f8] text-[#0f2537] border border-[#d2deeb]">
                  Chief Ops Desk
                </span>
              </div>

              <div>
                <h3 className="text-lg font-serif font-bold text-[#111827]">BookLeaf Ops Admin</h3>
                <p className="font-mono text-xs text-[#6b7280] mt-0.5">admin@bookleaf.pub</p>
              </div>

              <p className="text-xs text-[#4b5563] leading-relaxed">
                Oversees the incoming support queue across all 10 authors. Views AI auto-classification, priority ratings, and generates on-demand drafts via Valkey.
              </p>

              <div className="p-3 bg-[#faf9f5] rounded-xl border border-[#e7e5df] space-y-1.5 text-xs text-[#374151]">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Queue Backlog:</span>
                  <span className="font-mono font-bold text-[#0f2537]">Active Tickets</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">AI Studio:</span>
                  <span className="font-semibold text-[#15803d]">Valkey Cache Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Controls:</span>
                  <span className="font-semibold text-[#374151]">Status &amp; Priority Overrides</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPersona('admin@bookleaf.pub')}
              disabled={isLoading}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#0f2537] hover:bg-[#16324f] text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>Access Operations Desk</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#d49b55]" />
            </button>
          </div>

          {/* Dossier 2: Priya Sharma */}
          <div className="bg-white rounded-2xl border border-[#e7e5df] p-6 shadow-paper shadow-paper-hover transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#f2f9f4] border border-[#cbe8d5] text-[#15803d] flex items-center justify-center">
                  <Feather className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#f2f9f4] text-[#15803d] border border-[#cbe8d5]">
                  Live Titles &bull; AUTH001
                </span>
              </div>

              <div>
                <h3 className="text-lg font-serif font-bold text-[#111827]">Priya Sharma</h3>
                <p className="font-mono text-xs text-[#6b7280] mt-0.5">priya.sharma@email.com &bull; Mumbai</p>
              </div>

              <p className="text-xs text-[#4b5563] leading-relaxed">
                Author of <em>Whispers of the Ganges</em> and <em>The Saffron Diaries</em>. Has active support ticket TICK-1001 regarding pending Q3 royalties.
              </p>

              <div className="p-3 bg-[#faf9f5] rounded-xl border border-[#e7e5df] space-y-1.5 text-xs text-[#374151]">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Copies Sold:</span>
                  <span className="font-mono font-bold text-[#111827]">531 copies</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Total Royalty:</span>
                  <span className="font-mono font-bold text-[#15803d]">₹19,908</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Pending Payout:</span>
                  <span className="font-mono font-bold text-[#b4691b]">₹3,570</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPersona('priya.sharma@email.com')}
              disabled={isLoading}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>Access Priya Sharma Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/70" />
            </button>
          </div>

          {/* Dossier 3: Sneha Kulkarni */}
          <div className="bg-white rounded-2xl border border-[#e7e5df] p-6 shadow-paper shadow-paper-hover transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#fef8ee] border border-[#fae2c0] text-[#b4691b] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#fef8ee] text-[#b4691b] border border-[#fae2c0]">
                  Production Stage &bull; AUTH007
                </span>
              </div>

              <div>
                <h3 className="text-lg font-serif font-bold text-[#111827]">Sneha Kulkarni</h3>
                <p className="font-mono text-xs text-[#6b7280] mt-0.5">sneha.kulkarni@email.com &bull; Bangalore</p>
              </div>

              <p className="text-xs text-[#4b5563] leading-relaxed">
                Romance novelist with 2 live books and 1 title (<em>Midnight in Mysore</em>) currently in Cover Design stage. Has active ticket TICK-1002.
              </p>

              <div className="p-3 bg-[#faf9f5] rounded-xl border border-[#e7e5df] space-y-1.5 text-xs text-[#374151]">
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Total Copies:</span>
                  <span className="font-mono font-bold text-[#111827]">2,290 copies</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Total Royalty:</span>
                  <span className="font-mono font-bold text-[#15803d]">₹60,865</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7280]">Active In Production:</span>
                  <span className="font-semibold text-[#b4691b]">Cover Design Phase</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPersona('sneha.kulkarni@email.com')}
              disabled={isLoading}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#b4691b] hover:bg-[#92400e] text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>Access Sneha Kulkarni Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/70" />
            </button>
          </div>
        </div>
      </section>

      {/* Technical Workflow Schematic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#e7e5df] p-8 sm:p-10 shadow-paper space-y-8">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#0f2537] font-bold block">
              Architectural Design
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#111827] mt-1">
              Engineered for Zero Data Loss &amp; Strict Token Efficiency
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#4b5563]">
            <div className="p-5 rounded-2xl bg-[#faf9f5] border border-[#e7e5df] space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0f2537] text-white flex items-center justify-center font-mono font-bold text-xs">
                01
              </div>
              <h4 className="font-serif font-bold text-sm text-[#111827]">Immediate PostgreSQL Ingestion</h4>
              <p className="leading-relaxed">
                When an author submits a query, it commits to Neon PostgreSQL immediately with status <code>OPEN</code>. Even if external LLMs or queues undergo outage, ticket data is never lost.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf9f5] border border-[#e7e5df] space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#b4691b] text-white flex items-center justify-center font-mono font-bold text-xs">
                02
              </div>
              <h4 className="font-serif font-bold text-sm text-[#111827]">BullMQ Background Triage</h4>
              <p className="leading-relaxed">
                A background worker dequeues the triage task, sending strictly subject &amp; description to Groq LLM (JSON mode). It updates category &amp; priority scores and emits WebSocket events to ops staff.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf9f5] border border-[#e7e5df] space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#15803d] text-white flex items-center justify-center font-mono font-bold text-xs">
                03
              </div>
              <h4 className="font-serif font-bold text-sm text-[#111827]">Valkey On-Demand Draft Cache</h4>
              <p className="leading-relaxed">
                Drafts are NOT auto-generated on creation to save token cost. When an admin opens a ticket, it pulls from Valkey cache (TTL 1h) or injects the category slice + book stats. Sending replies automatically flushes the cache key.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
