'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10 text-neutral-900 font-sans">
      {/* Author Header & Banking */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-100">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-black tracking-tight">
              {authorProfile?.name || 'Author Workspace'}
            </h1>
            <span className="font-mono text-xs text-neutral-400">
              [{authorProfile?.authorId || 'AUTH'}]
            </span>
          </div>
          <div className="text-xs text-neutral-500 font-mono flex flex-wrap gap-x-3 gap-y-1">
            <span>{authorProfile?.email}</span>
            <span>&bull;</span>
            <span>
              {authorProfile?.isBankDetailsLinked ? (
                <span className="text-black font-semibold">Bank: Direct Transfer (Verified)</span>
              ) : (
                <span className="text-neutral-500">Bank Details Pending Link</span>
              )}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenSubmitModal}
          className="px-3.5 py-1.5 bg-black text-white hover:bg-neutral-800 text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Submit Query</span>
        </button>
      </div>

      {/* Inline Royalty & Sales Figures */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-4 font-mono text-xs">
          <div className="flex items-baseline gap-6">
            <div>
              <span className="text-neutral-400 text-[10px] uppercase block">Editions</span>
              <span className="text-lg font-bold text-black">{summary?.totalBooksCount || books.length}</span>
            </div>
            <div>
              <span className="text-neutral-400 text-[10px] uppercase block">Units Sold</span>
              <span className="text-lg font-bold text-black">{summary?.totalCopiesSold || 0}</span>
            </div>
            <div>
              <span className="text-neutral-400 text-[10px] uppercase block">Pending Royalty (80% net)</span>
              <span className="text-lg font-bold text-black">₹{pendingAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="text-right text-[11px] text-neutral-500">
            {pendingAmount >= 1000 ? (
              <span className="text-black font-semibold">Threshold Met &bull; Scheduled for Quarterly Transfer</span>
            ) : (
              <span>₹{1000 - pendingAmount} remaining to reach ₹1,000 threshold</span>
            )}
          </div>
        </div>

        {/* 2px Hairline Progress Bar */}
        <div className="w-full bg-neutral-100 h-1 overflow-hidden">
          <div
            className="bg-black h-full transition-all duration-300"
            style={{ width: `${thresholdPercent}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-6 border-b border-neutral-100 pb-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('books')}
            className={`transition cursor-pointer ${
              activeTab === 'books' ? 'text-black font-bold underline underline-offset-8' : 'text-neutral-400 hover:text-black'
            }`}
          >
            Registered Titles ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`transition cursor-pointer ${
              activeTab === 'tickets' ? 'text-black font-bold underline underline-offset-8' : 'text-neutral-400 hover:text-black'
            }`}
          >
            Inquiry History ({tickets.length})
          </button>
        </div>

        {/* Tab 1: Books */}
        {activeTab === 'books' && (
          <div className="divide-y divide-neutral-100 text-xs">
            {books.length === 0 ? (
              <div className="py-8 text-neutral-400 font-mono">No titles registered.</div>
            ) : (
              books.map((b) => (
                <div key={b.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-black text-sm">{b.title}</span>
                      <span className="font-mono text-neutral-400 text-[11px]">[{b.bookId}]</span>
                      <span className="font-mono text-[10px] text-neutral-500">({b.status})</span>
                    </div>
                    <div className="text-neutral-500 font-mono text-[11px] flex gap-3">
                      <span>ISBN: {b.isbn || 'Pending'}</span>
                      <span>&bull;</span>
                      <span>{b.totalCopiesSold || 0} sold</span>
                      <span>&bull;</span>
                      <span>₹{b.royaltyPending || 0} royalty</span>
                    </div>
                  </div>

                  <button
                    onClick={onOpenSubmitModal}
                    className="text-neutral-400 hover:text-black font-mono text-xs cursor-pointer"
                  >
                    Query &rarr;
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Tickets */}
        {activeTab === 'tickets' && (
          <div className="divide-y divide-neutral-100 text-xs">
            {tickets.length === 0 ? (
              <div className="py-8 text-neutral-400 font-mono">
                No inquiries submitted. Click &ldquo;Submit Query&rdquo; above.
              </div>
            ) : (
              tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTicket(t)}
                  className="py-3.5 flex flex-wrap items-center justify-between gap-4 hover:bg-neutral-50 px-2 -mx-2 transition cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="font-bold text-black">{t.ticketNumber}</span>
                      <span className="text-neutral-400">&bull;</span>
                      <span className="uppercase text-neutral-600 font-semibold">{t.status}</span>
                      <span className="text-neutral-400">&bull;</span>
                      <span className="text-neutral-500">{t.category?.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="font-medium text-black">{t.subject}</div>
                    <p className="text-neutral-500 text-[11px] line-clamp-1">{t.description}</p>
                  </div>

                  <div className="text-right font-mono text-[11px] text-neutral-400">
                    <div>{new Date(t.createdAt).toLocaleDateString()}</div>
                    <div>{t.messages?.length || 0} replies &rarr;</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
