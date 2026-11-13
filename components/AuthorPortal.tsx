'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  MessageSquare,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CardSpotlight } from './ui/card-spotlight';
import { BackgroundDots } from './ui/background-grid';

interface Props {
  authorProfile: any;
  books: any[];
  summary: any;
  tickets: any[];
  onOpenSubmitModal: () => void;
  onSelectTicket: (ticket: any) => void;
  isLoading: boolean;
}

export const AuthorPortal: React.FC<Props> = ({
  authorProfile,
  books,
  summary,
  tickets,
  onOpenSubmitModal,
  onSelectTicket,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'books' | 'tickets'>('books');

  const pendingAmount = summary?.totalRoyaltyPending || 0;
  const thresholdPercent = Math.min(100, Math.round((pendingAmount / 1000) * 100));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published & Live':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black text-white">
            Published &bull; Live
          </span>
        );
      case 'In Production - Cover Design':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border border-neutral-300 text-neutral-800 bg-neutral-100">
            Production &bull; Cover Design
          </span>
        );
      case 'In Production - Typesetting':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border border-neutral-300 text-neutral-800 bg-neutral-100">
            Production &bull; Typesetting
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border border-neutral-200 text-neutral-500">
            {status}
          </span>
        );
    }
  };

  const getTicketStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-black text-white">
            Open
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold tracking-wider border border-neutral-300 text-neutral-800 bg-neutral-100">
            In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold tracking-wider border border-neutral-200 text-neutral-600">
            Resolved
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider text-neutral-400 border border-neutral-200">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white text-neutral-900 font-sans pb-24">
      <BackgroundDots className="border-b border-neutral-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center font-mono font-bold text-xl shadow-md">
              {authorProfile?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-black">
                  {authorProfile?.name || 'Author Workspace'}
                </h1>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 font-semibold">
                  {authorProfile?.authorId || 'AUTH'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 font-mono">
                {authorProfile?.email} &bull; {authorProfile?.city || 'India'} &bull; Joined{' '}
                {authorProfile?.joinedDate
                  ? new Date(authorProfile.joinedDate).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })
                  : '2023'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {authorProfile?.isBankDetailsLinked ? (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-800 text-xs font-mono shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Bank: Direct Transfer (HDFC Verified)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-800 text-xs font-mono">
                <AlertCircle className="w-4 h-4 text-neutral-600" />
                <span>Bank Details Pending Link</span>
              </div>
            )}

            <button
              onClick={onOpenSubmitModal}
              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Query</span>
            </button>
          </div>
        </div>
      </BackgroundDots>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Spotlight Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <CardSpotlight className="p-5">
            <span className="text-[10px] uppercase text-neutral-400 block font-mono">Registered Catalog</span>
            <span className="text-3xl font-bold text-black mt-1 block">
              {summary?.totalBooksCount || books.length} <span className="text-xs font-normal text-neutral-500">Editions</span>
            </span>
            <span className="text-[11px] text-neutral-500 mt-2 block">
              {summary?.totalCopiesSold || 0} lifetime units sold across Amazon &amp; Repro
            </span>
          </CardSpotlight>

          <CardSpotlight className="p-5">
            <span className="text-[10px] uppercase text-neutral-400 block font-mono">Net Royalty Share</span>
            <span className="text-3xl font-bold text-black mt-1 block">80% Net</span>
            <span className="text-[11px] text-neutral-500 mt-2 block">
              Calculated on net profit after print/distribution costs
            </span>
          </CardSpotlight>

          <CardSpotlight className="p-5">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase text-neutral-400 block font-mono">Accrued Royalty</span>
              <span className="text-[10px] uppercase font-bold text-black font-mono">
                {pendingAmount >= 1000 ? '[THRESHOLD MET]' : '[ACCUMULATING]'}
              </span>
            </div>
            <span className="text-3xl font-bold text-black mt-1 block">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </span>

            <div className="mt-3 space-y-1">
              <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${thresholdPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="bg-black h-full rounded-full"
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Threshold: ₹1,000</span>
                <span>{thresholdPercent}% achieved</span>
              </div>
            </div>
          </CardSpotlight>
        </div>

        {/* Tabs */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-4 border-b border-neutral-200 pb-3 text-xs font-mono">
            <button
              onClick={() => setActiveTab('books')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'books'
                  ? 'bg-neutral-100 text-black font-bold'
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              Registered Editions ({books.length})
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'tickets'
                  ? 'bg-neutral-100 text-black font-bold'
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              Inquiry Ledger ({tickets.length})
            </button>
          </div>

          {/* Tab 1: Books */}
          {activeTab === 'books' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {books.length === 0 ? (
                <div className="col-span-2 p-12 text-center text-xs font-mono text-neutral-400 border border-neutral-200 rounded-2xl">
                  No titles registered under this author profile.
                </div>
              ) : (
                books.map((b) => (
                  <CardSpotlight
                    key={b.id}
                    className="p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-mono text-[10px] text-neutral-400">
                            [{b.bookId}]
                          </span>
                          <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                            {b.title}
                          </h3>
                        </div>
                        {getStatusBadge(b.status)}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono pt-1 text-neutral-600">
                        <div>
                          <span className="text-neutral-400 text-[10px] block">ISBN:</span>
                          <span className="text-black font-medium">{b.isbn || 'Pending Allocation'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 text-[10px] block">Genre:</span>
                          <span className="text-black font-medium">{b.genre || 'General'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 text-[10px] block">MRP:</span>
                          <span className="text-black font-medium">₹{b.mrp || b.price || 0}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 text-[10px] block">Copies Sold:</span>
                          <span className="text-black font-medium">{b.totalCopiesSold || 0}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 text-[10px] block">Royalty Earned:</span>
                          <span className="text-black font-medium">₹{b.totalRoyaltyEarned || 0}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 text-[10px] block">Royalty Paid:</span>
                          <span className="text-black font-medium">₹{b.royaltyPaid || 0}</span>
                        </div>
                        <div className="col-span-2 sm:col-span-3 pt-1 border-t border-neutral-100 flex justify-between items-center">
                          <span className="text-neutral-400 text-[11px]">Royalty Pending:</span>
                          <span className="text-black font-bold text-sm">₹{b.royaltyPending || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-400 text-[10px]">
                        Pub Date: {b.publishedDate ? new Date(b.publishedDate).toLocaleDateString() : 'In Production'}
                      </span>
                      <button
                        onClick={onOpenSubmitModal}
                        className="text-black hover:underline text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Query Edition</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </CardSpotlight>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Tickets */}
          {activeTab === 'tickets' && (
            <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              {tickets.length === 0 ? (
                <div className="p-12 text-center font-mono text-xs text-neutral-400">
                  No inquiries submitted. Click &ldquo;Submit Query&rdquo; to start a ticket.
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 text-xs">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onSelectTicket(t)}
                      className="p-4 hover:bg-neutral-50 transition cursor-pointer flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-black">
                            {t.ticketNumber}
                          </span>
                          {getTicketStatusBadge(t.status)}
                          <span className="font-mono text-[10px] text-neutral-400">
                            &bull; {t.category?.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-black">
                          {t.subject}
                        </h4>
                        <p className="text-neutral-500 text-xs line-clamp-1">
                          {t.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right text-[11px] font-mono text-neutral-400 hidden sm:block">
                          <div>{new Date(t.createdAt).toLocaleDateString()}</div>
                          <div>{t.messages?.length || 0} replies</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg border border-neutral-200 text-[10px] font-mono uppercase text-black">
                          View &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
