'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  BookOpen,
  Zap,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Database,
  Lock,
  Radio,
  FileText,
} from 'lucide-react';
import { BackgroundGrid, BackgroundDots } from './ui/background-grid';
import { BentoGrid, BentoGridItem } from './ui/bento-grid';
import { CardSpotlight } from './ui/card-spotlight';
import { HoverBorderGradient } from './ui/hover-border-gradient';
import { TextGenerateEffect } from './ui/text-generate-effect';

interface Props {
  onOpenLogin: (role?: 'ADMIN' | 'AUTHOR') => void;
  onOpenKnowledgeBase: () => void;
  isLoading: boolean;
}

export const LandingPage: React.FC<Props> = ({
  onOpenLogin,
  onOpenKnowledgeBase,
  isLoading,
}) => {
  return (
    <div className="w-full bg-white text-neutral-900 font-sans space-y-24 pb-28">
      {/* Hero Section with Aceternity BackgroundGrid */}
      <BackgroundGrid className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-200">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-neutral-200 text-neutral-800 text-xs font-mono tracking-wide shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
            <span>BookLeaf Technical Assignment 1 &bull; Production Full-Stack Architecture</span>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.12]">
              Author Support &amp; Communication{' '}
              <span className="relative inline-block px-2 py-0.5 mt-1 rounded-xl bg-neutral-100 border border-neutral-200 text-black">
                Operations Portal
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed pt-2">
              High-throughput publishing operations portal built for BookLeaf Publishing to manage{' '}
              <strong className="text-neutral-900 font-semibold">1,200+ monthly manuscripts</strong> across a catalog of{' '}
              <strong className="text-neutral-900 font-semibold">22,000+ titles</strong>.
              Engineered with durable database-first ingestion, asynchronous BullMQ triage, and Valkey draft caching.
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <HoverBorderGradient
              onClick={() => onOpenLogin('AUTHOR')}
              className="py-3 px-6 text-sm font-semibold cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-black" />
              <span>Sign In to Author Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </HoverBorderGradient>

            <button
              onClick={() => onOpenLogin('ADMIN')}
              className="px-6 py-3 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs tracking-wide transition flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
            >
              <Shield className="w-4 h-4" />
              <span>Operations Desk Access</span>
            </button>

            <button
              onClick={onOpenKnowledgeBase}
              className="px-5 py-3 rounded-full border border-neutral-200 hover:border-black text-neutral-700 text-xs font-medium transition cursor-pointer hover:bg-neutral-50"
            >
              View Publishing Codex
            </button>
          </motion.div>

          {/* Inline Key Metrics Spotlight Grid */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <CardSpotlight className="p-4 bg-white/80 backdrop-blur-xs">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block">Catalog Scale</span>
              <span className="text-2xl font-bold font-mono text-black mt-0.5 block">22,000+</span>
              <span className="text-[11px] text-neutral-500">Published Editions</span>
            </CardSpotlight>

            <CardSpotlight className="p-4 bg-white/80 backdrop-blur-xs">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block">Monthly Ingestion</span>
              <span className="text-2xl font-bold font-mono text-black mt-0.5 block">1,200+</span>
              <span className="text-[11px] text-neutral-500">New Manuscripts</span>
            </CardSpotlight>

            <CardSpotlight className="p-4 bg-white/80 backdrop-blur-xs">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block">Royalty Model</span>
              <span className="text-2xl font-bold font-mono text-black mt-0.5 block">80% Net</span>
              <span className="text-[11px] text-neutral-500">Quarterly, ₹1,000 floor</span>
            </CardSpotlight>

            <CardSpotlight className="p-4 bg-white/80 backdrop-blur-xs">
              <span className="text-[10px] uppercase font-mono text-neutral-400 block">Print Guarantee</span>
              <span className="text-2xl font-bold font-mono text-black mt-0.5 block">5–7 Days</span>
              <span className="text-[11px] text-neutral-500">Free reprint guarantee</span>
            </CardSpotlight>
          </div>
        </div>
      </BackgroundGrid>

      {/* Aceternity Bento Grid: Architectural Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold block">
            System Architecture
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
            Engineered for High-Scale Publishing Operations
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            A resilient multi-layered stack designed to handle peak query influx without data loss or latency.
          </p>
        </div>

        <BentoGrid className="max-w-6xl mx-auto">
          {/* Bento Item 1 */}
          <BentoGridItem
            className="md:col-span-2"
            title="Durable Database-First Ingestion"
            description="Author inquiries are committed directly to Neon PostgreSQL before dispatching async tasks, ensuring zero message loss if queues stall."
            badge="Durable Ingestion"
            icon={<Database className="w-5 h-5 text-neutral-800" />}
            header={
              <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-50 border border-neutral-100 p-4 font-mono text-[11px] space-y-1.5 text-neutral-600">
                <div className="flex items-center gap-1.5 text-black font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                  <span>POST /api/tickets &rarr; DB Transaction Complete</span>
                </div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  Ticket #TICK-1001 created &bull; Audit log entry registered &bull; Dispatched to queue
                </div>
              </div>
            }
          />

          {/* Bento Item 2 */}
          <BentoGridItem
            title="BullMQ Async Triage"
            description="Out-of-band classification into 6 BookLeaf categories with priority scoring via Groq LLM & heuristic fallback."
            badge="Worker Queue"
            icon={<Cpu className="w-5 h-5 text-neutral-800" />}
            header={
              <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-50 border border-neutral-100 p-4 font-mono text-[11px] space-y-1 text-neutral-600">
                <div className="text-black font-semibold">Queue: ticket-triage</div>
                <div className="text-[10px] text-neutral-400">Concurrency: 5 workers</div>
                <div className="text-[10px] text-neutral-400">Retry backoff: exponential</div>
              </div>
            }
          />

          {/* Bento Item 3 */}
          <BentoGridItem
            title="Valkey TLS On-Demand Draft Cache"
            description="AI draft replies cite official BookLeaf policy slices, cached in Aiven Valkey TLS with 1-hour TTL and instant cache invalidation upon author message."
            badge="Valkey Caching"
            icon={<Zap className="w-5 h-5 text-neutral-800" />}
            header={
              <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-50 border border-neutral-100 p-4 font-mono text-[11px] space-y-1 text-neutral-600">
                <div className="text-black font-semibold">Valkey TLS: rediss://</div>
                <div className="text-[10px] text-neutral-400">Cache key: ai:draft:ticket-id</div>
                <div className="text-[10px] text-neutral-400">TTL: 3,600s (1h) &bull; Purge on reply</div>
              </div>
            }
          />

          {/* Bento Item 4 */}
          <BentoGridItem
            className="md:col-span-2"
            title="80/20 Transparent Author Royalty Engine"
            description="Authors access transparent real-time sales reports, net profit calculations, and live tracking toward the quarterly ₹1,000 disbursement threshold."
            badge="Financial Ledger"
            icon={<Layers className="w-5 h-5 text-neutral-800" />}
            header={
              <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-50 border border-neutral-100 p-4 font-mono text-[11px] space-y-1.5 text-neutral-600">
                <div className="flex justify-between text-black font-semibold">
                  <span>Author Share: 80%</span>
                  <span>BookLeaf Share: 20%</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-black h-full w-[85%]" />
                </div>
                <div className="text-[10px] text-neutral-400">Disbursement threshold: ₹1,000 &bull; Direct bank transfer</div>
              </div>
            }
          />
        </BentoGrid>
      </section>

      {/* Production Evaluator Accounts Guide */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-8 sm:p-10 space-y-6 text-left">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                Production Role-Based Access
              </span>
              <h3 className="text-xl font-bold text-neutral-900 mt-0.5">
                Evaluator Portal Credentials
              </h3>
            </div>

            <button
              onClick={() => onOpenLogin()}
              className="px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-mono uppercase tracking-wider transition cursor-pointer"
            >
              Open Sign-In Dialog &rarr;
            </button>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
            This platform uses authentic JWT authentication. Passwords are required to access dashboards.
            When you sign in, the portal dynamically mounts either the <strong>Operations Triage Desk</strong> or the <strong>Author Studio</strong> based on your account role.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div
              onClick={() => onOpenLogin('ADMIN')}
              className="p-3 bg-white border border-neutral-200 hover:border-black rounded-xl transition cursor-pointer space-y-1"
            >
              <div className="font-bold text-black flex items-center justify-between">
                <span>Ops Admin</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-sm bg-neutral-100 text-neutral-700">Admin</span>
              </div>
              <div className="text-[11px] text-neutral-500 truncate">admin@bookleaf.pub</div>
              <div className="text-[10px] text-neutral-400">Pass: Password123!</div>
            </div>

            <div
              onClick={() => onOpenLogin('AUTHOR')}
              className="p-3 bg-white border border-neutral-200 hover:border-black rounded-xl transition cursor-pointer space-y-1"
            >
              <div className="font-bold text-black flex items-center justify-between">
                <span>Priya Sharma</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-sm bg-neutral-100 text-neutral-700">AUTH001</span>
              </div>
              <div className="text-[11px] text-neutral-500 truncate">priya.sharma@email.com</div>
              <div className="text-[10px] text-neutral-400">Pass: Password123!</div>
            </div>

            <div
              onClick={() => onOpenLogin('AUTHOR')}
              className="p-3 bg-white border border-neutral-200 hover:border-black rounded-xl transition cursor-pointer space-y-1"
            >
              <div className="font-bold text-black flex items-center justify-between">
                <span>Sneha Kulkarni</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-sm bg-neutral-100 text-neutral-700">AUTH007</span>
              </div>
              <div className="text-[11px] text-neutral-500 truncate">sneha.kulkarni@email.com</div>
              <div className="text-[10px] text-neutral-400">Pass: Password123!</div>
            </div>

            <div
              onClick={() => onOpenLogin('AUTHOR')}
              className="p-3 bg-white border border-neutral-200 hover:border-black rounded-xl transition cursor-pointer space-y-1"
            >
              <div className="font-bold text-black flex items-center justify-between">
                <span>Rohit Kapoor</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-sm bg-neutral-100 text-neutral-700">AUTH002</span>
              </div>
              <div className="text-[11px] text-neutral-500 truncate">rohit.kapoor@email.com</div>
              <div className="text-[10px] text-neutral-400">Pass: Password123!</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
