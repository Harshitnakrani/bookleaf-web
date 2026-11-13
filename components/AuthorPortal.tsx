'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  MessageSquare,
  Building,
  Layers,
  ChevronRight,
  Sparkles,
  Feather,
  TrendingUp,
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
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f2f9f4] text-[#15803d] border border-[#cbe8d5]">
            Published &amp; Live
          </span>
        );
      case 'In Production - Cover Design':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#fef8ee] text-[#b4691b] border border-[#fae2c0]">
            In Production &bull; Cover Design
          </span>
        );
      case 'In Production - Typesetting':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f0f4f8] text-[#0f2537] border border-[#d2deeb]">
            In Production &bull; Typesetting
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const getTicketStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f0f4f8] text-[#0f2537] border border-[#d2deeb]">
            Open
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#fef8ee] text-[#b4691b] border border-[#fae2c0]">
            In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f2f9f4] text-[#15803d] border border-[#cbe8d5]">
            Resolved
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f3f1eb] text-[#6b7280] border border-[#e7e5df]">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#faf9f5]">
      {/* Author Dossier Banner */}
      <div className="bg-white rounded-3xl border border-[#e7e5df] p-6 sm:p-7 shadow-paper flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#0f2537] text-[#d49b55] border-2 border-[#d49b55]/40 flex items-center justify-center font-serif font-bold text-2xl shadow-sm">
            {authorProfile?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-bold text-[#111827]">
                {authorProfile?.name || 'Author Workspace'}
              </h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#f3f1eb] text-[#374151] font-semibold border border-[#e7e5df]">
                {authorProfile?.authorId || 'AUTH'}
              </span>
            </div>
            <p className="text-xs text-[#6b7280] mt-1 font-sans">
              {authorProfile?.email} &bull; {authorProfile?.city || 'India'} &bull; Author Since{' '}
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
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f2f9f4] border border-[#cbe8d5] text-[#15803d] text-xs font-medium">
              <CheckCircle className="w-4 h-4 text-[#15803d]" />
              <div>
                <span className="font-semibold block leading-tight">Bank Linked &bull; Direct Transfer</span>
                <span className="text-[10px] opacity-80 font-mono">
                  {authorProfile?.bankAccountNumber ? `••••${authorProfile.bankAccountNumber.slice(-4)}` : 'HDFC Bank'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#fef8ee] border border-[#fae2c0] text-[#b4691b] text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-[#b4691b]" />
              <div>
                <span className="font-semibold block leading-tight">Bank Details Pending</span>
                <span className="text-[10px] opacity-80">Required for quarterly disbursement</span>
              </div>
            </div>
          )}

          <button
            onClick={onOpenSubmitModal}
            className="px-5 py-2.5 rounded-xl bg-[#0f2537] hover:bg-[#16324f] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#d49b55]" />
            <span>Submit Query</span>
          </button>
        </div>
      </div>

      {/* Official Publisher Statement & Royalty Ledger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Copies Sold */}
        <div className="bg-white rounded-2xl border border-[#e7e5df] p-5 shadow-paper space-y-1">
          <div className="flex items-center justify-between text-[#6b7280]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Total Distributed</span>
            <BookOpen className="w-4 h-4 text-[#6b7280]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#111827]">
            {summary?.totalCopiesSold?.toLocaleString() || 0}
          </div>
          <p className="text-[11px] text-[#6b7280]">Print &amp; digital copies sold</p>
        </div>

        {/* Total Royalty Earned */}
        <div className="bg-white rounded-2xl border border-[#e7e5df] p-5 shadow-paper space-y-1">
          <div className="flex items-center justify-between text-[#6b7280]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#15803d]">Total Royalty (80%)</span>
            <TrendingUp className="w-4 h-4 text-[#15803d]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#15803d]">
            ₹{summary?.totalRoyaltyEarned?.toLocaleString() || 0}
          </div>
          <p className="text-[11px] text-[#6b7280]">80/20 net profit author split</p>
        </div>

        {/* Royalty Paid */}
        <div className="bg-white rounded-2xl border border-[#e7e5df] p-5 shadow-paper space-y-1">
          <div className="flex items-center justify-between text-[#6b7280]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0f2537]">Disbursed Payouts</span>
            <CheckCircle className="w-4 h-4 text-[#0f2537]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#0f2537]">
            ₹{summary?.totalRoyaltyPaid?.toLocaleString() || 0}
          </div>
          <p className="text-[11px] text-[#6b7280]">Settled via bank transfer</p>
        </div>

        {/* Royalty Pending & Threshold Progress */}
        <div className="bg-[#fef8ee] rounded-2xl border border-[#fae2c0] p-5 shadow-paper space-y-2">
          <div className="flex items-center justify-between text-[#b4691b]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Pending Payout</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#92400e]">
            ₹{pendingAmount.toLocaleString()}
          </div>
          {/* Progress bar towards ₹1,000 threshold */}
          <div className="space-y-1">
            <div className="w-full bg-[#fae2c0] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#b4691b] h-full rounded-full transition-all duration-500"
                style={{ width: `${thresholdPercent}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-[#92400e] flex justify-between font-mono">
              <span>{thresholdPercent >= 100 ? 'Threshold met (disburses Q end)' : 'Rollover towards ₹1,000 floor'}</span>
              <span>{thresholdPercent}%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#e7e5df] gap-8">
        <button
          onClick={() => setActiveTab('books')}
          className={`pb-3 text-sm font-serif font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'books'
              ? 'text-[#0f2537] border-b-2 border-[#0f2537]'
              : 'text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#b4691b]" />
          <span>My Published Works &amp; Titles ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`pb-3 text-sm font-serif font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'tickets'
              ? 'text-[#0f2537] border-b-2 border-[#0f2537]'
              : 'text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#15803d]" />
          <span>Support Inquiries &amp; Dispatches ({tickets.length})</span>
        </button>
      </div>

      {/* Tab 1: Book Catalog (Literary Card Aesthetics) */}
      {activeTab === 'books' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-[#e7e5df] p-6 shadow-paper shadow-paper-hover transition space-y-4 book-spine-effect"
            >
              <div className="flex justify-between items-start gap-4 pl-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#6b7280]">
                    {book.bookId} &bull; {book.genre}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#111827] leading-tight">
                    {book.title}
                  </h3>
                  <p className="text-xs text-[#6b7280] font-mono">
                    ISBN: {book.isbn || 'Pending Allocation'}
                  </p>
                </div>
                <div>{getStatusBadge(book.status)}</div>
              </div>

              {/* Financial Ledger Section */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#f3f1eb] text-xs bg-[#faf9f5]/50 rounded-xl px-4">
                <div>
                  <span className="text-[#6b7280] block text-[10px] uppercase font-mono">Retail MRP</span>
                  <span className="font-semibold text-[#111827] font-mono">
                    {book.mrp ? `₹${book.mrp}` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[#6b7280] block text-[10px] uppercase font-mono">Royalty/Copy</span>
                  <span className="font-semibold text-[#111827] font-mono">
                    {book.authorRoyaltyPerCopy ? `₹${book.authorRoyaltyPerCopy}` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[#6b7280] block text-[10px] uppercase font-mono">Copies Sold</span>
                  <span className="font-bold text-[#111827] font-mono">
                    {book.totalCopiesSold || 0}
                  </span>
                </div>
                <div>
                  <span className="text-[#6b7280] block text-[10px] uppercase font-mono">Pending</span>
                  <span className="font-bold text-[#b4691b] font-mono">
                    ₹{book.royaltyPending || 0}
                  </span>
                </div>
              </div>

              {/* Production and Distribution Channels */}
              <div className="flex flex-wrap items-center justify-between text-xs text-[#6b7280] pt-1 pl-3">
                <div className="flex items-center gap-1.5 font-medium">
                  <Building className="w-3.5 h-3.5 text-[#b4691b]" />
                  <span>Print Partner: {book.printPartner || 'In-House (Delhi)'}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {book.availableOn && book.availableOn.length > 0 ? (
                    book.availableOn.map((ch: string) => (
                      <span
                        key={ch}
                        className="px-2 py-0.5 rounded bg-[#f3f1eb] text-[#374151] text-[10px] font-medium border border-[#e7e5df]"
                      >
                        {ch}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-[#6b7280] italic">Distribution setup in queue</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: My Tickets */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#e7e5df] p-12 text-center space-y-3 shadow-paper">
              <MessageSquare className="w-10 h-10 text-[#d6d3cb] mx-auto" />
              <h3 className="text-lg font-serif font-bold text-[#111827]">No Active Tickets</h3>
              <p className="text-xs text-[#6b7280] max-w-sm mx-auto">
                Need guidance regarding your manuscript milestone, ISBN, quarterly payout, or author copies?
              </p>
              <button
                onClick={onOpenSubmitModal}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#0f2537] text-white text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
              >
                Submit Inquiries
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#e7e5df] overflow-hidden shadow-paper divide-y divide-[#f3f1eb]">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTicket(t)}
                  className="p-5 sm:p-6 hover:bg-[#faf9f5] transition cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#111827] px-2 py-0.5 rounded bg-[#f3f1eb] border border-[#e7e5df]">
                        {t.ticketNumber}
                      </span>
                      {getTicketStatusBadge(t.status)}
                      <span className="text-[10px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded bg-[#faf9f5] text-[#374151] border border-[#e7e5df]">
                        {t.category?.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h4 className="text-sm font-serif font-bold text-[#111827] truncate">
                      {t.subject}
                    </h4>

                    <p className="text-xs text-[#4b5563] line-clamp-1">
                      {t.description}
                    </p>

                    <div className="text-[11px] text-[#6b7280] flex items-center gap-3">
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                      {t.book?.title && (
                        <span>&bull; Title: <em>{t.book.title}</em></span>
                      )}
                      {t._count?.messages > 0 && (
                        <span className="text-[#15803d] font-semibold">&bull; {t._count.messages} reply(s)</span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-[#9ca3af] shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
