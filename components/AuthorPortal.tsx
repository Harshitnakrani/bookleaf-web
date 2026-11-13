'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  DollarSign,
  Clock,
  Check,
  AlertCircle,
  Plus,
  MessageSquare,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published & Live':
        return (
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider bg-black text-white">
            Published &amp; Live
          </span>
        );
      case 'In Production - Cover Design':
        return (
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider border border-neutral-400 text-neutral-800 bg-neutral-100">
            Production &bull; Cover Design
          </span>
        );
      case 'In Production - Typesetting':
        return (
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider border border-neutral-400 text-neutral-800 bg-neutral-100">
            Production &bull; Typesetting
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider border border-neutral-300 text-neutral-600">
            {status}
          </span>
        );
    }
  };

  const getTicketStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase font-bold tracking-wider bg-black text-white">
            Open
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase font-semibold tracking-wider border border-neutral-400 text-neutral-800 bg-neutral-100">
            In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase font-semibold tracking-wider border border-neutral-300 text-neutral-700">
            Resolved
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider text-neutral-400 border border-neutral-200">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  const pendingAmount = summary?.totalRoyaltyPending || 0;
  const thresholdPercent = Math.min(100, Math.round((pendingAmount / 1000) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white font-sans text-neutral-900">
      {/* Author Dossier Banner */}
      <div className="bg-white border border-neutral-200 p-6 rounded-xs flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-mono font-bold text-lg rounded-xs">
            {authorProfile?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-black">
                {authorProfile?.name || 'Author Workspace'}
              </h1>
              <span className="font-mono text-[11px] px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-neutral-800 rounded-xs font-semibold">
                [{authorProfile?.authorId || 'AUTH'}]
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

        {/* Banking Status & Query Action */}
        <div className="flex flex-wrap items-center gap-3">
          {authorProfile?.isBankDetailsLinked ? (
            <div className="flex items-center gap-2 px-3 py-1.5 border border-neutral-300 bg-neutral-50 text-neutral-800 text-xs rounded-xs font-mono">
              <Check className="w-3.5 h-3.5 text-black" />
              <span>Bank Linked: Direct Payout (HDFC)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 border border-neutral-400 bg-neutral-100 text-neutral-900 text-xs rounded-xs font-mono">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Bank Details Pending</span>
            </div>
          )}

          <button
            onClick={onOpenSubmitModal}
            className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider rounded-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Support Query</span>
          </button>
        </div>
      </div>

      {/* Financial Statement & Royalties */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
          <span className="text-[10px] uppercase text-neutral-400 block">Catalog Volume</span>
          <span className="text-2xl font-bold text-black mt-0.5 block">
            {summary?.totalBooksCount || books.length} <span className="text-xs font-normal text-neutral-500">Editions</span>
          </span>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            {summary?.totalCopiesSold || 0} lifetime units sold
          </span>
        </div>

        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
          <span className="text-[10px] uppercase text-neutral-400 block">Royalty Model</span>
          <span className="text-2xl font-bold text-black mt-0.5 block">80% Net</span>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Paid quarterly &bull; Contract terms guaranteed
          </span>
        </div>

        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase text-neutral-400 block">Pending Payout</span>
            <span className="text-[10px] uppercase font-bold text-neutral-800">
              {pendingAmount >= 1000 ? '[ELIGIBLE]' : '[ACCUMULATING]'}
            </span>
          </div>
          <span className="text-2xl font-bold text-black mt-0.5 block">
            ₹{pendingAmount.toLocaleString('en-IN')}
          </span>
          {/* Minimalist Threshold Bar */}
          <div className="mt-2 space-y-1">
            <div className="w-full bg-neutral-200 h-1.5 rounded-xs overflow-hidden">
              <div
                className="bg-black h-full transition-all duration-300"
                style={{ width: `${thresholdPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>Threshold: ₹1,000</span>
              <span>{thresholdPercent}% achieved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="border-b border-neutral-200 flex items-center gap-4 text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('books')}
            className={`pb-2.5 transition border-b-2 cursor-pointer ${
              activeTab === 'books'
                ? 'border-black text-black font-bold'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Published Titles ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`pb-2.5 transition border-b-2 cursor-pointer ${
              activeTab === 'tickets'
                ? 'border-black text-black font-bold'
                : 'border-transparent text-neutral-400 hover:text-black'
            }`}
          >
            Inquiry Ledger ({tickets.length})
          </button>
        </div>

        {/* Tab 1: Books */}
        {activeTab === 'books' && (
          <div className="space-y-3">
            {books.length === 0 ? (
              <div className="p-12 text-center border border-neutral-200 rounded-xs font-mono text-xs text-neutral-400">
                No titles registered under this author profile.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {books.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 border border-neutral-200 hover:border-black rounded-xs transition bg-white space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-mono text-[10px] text-neutral-400">
                            [{b.bookId}]
                          </span>
                          <h3 className="text-base font-bold text-black tracking-tight">
                            {b.title}
                          </h3>
                        </div>
                        {getStatusBadge(b.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                        <div>
                          <span className="text-neutral-400 text-[10px] block">ISBN:</span>
                          <span className="text-black font-medium">{b.isbn || 'Pending Allocation'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 text-[10px] block">Units Sold:</span>
                          <span className="text-black font-medium">{b.totalCopiesSold || 0}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 text-[10px] block">Price:</span>
                          <span className="text-black font-medium">₹{b.price || 0}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 text-[10px] block">Accrued Royalty:</span>
                          <span className="text-black font-bold">₹{b.royaltyPending || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-400 text-[10px]">
                        Pub Date: {b.publishedDate ? new Date(b.publishedDate).toLocaleDateString() : 'In Queue'}
                      </span>
                      <button
                        onClick={onOpenSubmitModal}
                        className="text-black hover:underline text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Query about this edition</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Tickets */}
        {activeTab === 'tickets' && (
          <div className="border border-neutral-200 rounded-xs overflow-hidden">
            {tickets.length === 0 ? (
              <div className="p-12 text-center font-mono text-xs text-neutral-400">
                No active support queries found. Click &ldquo;New Support Query&rdquo; to submit a ticket.
              </div>
            ) : (
              <div className="divide-y divide-neutral-200 font-sans text-xs">
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
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
