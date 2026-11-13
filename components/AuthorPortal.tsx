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
  ExternalLink,
  Info,
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
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Published &amp; Live
          </span>
        );
      case 'In Production - Cover Design':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Cover Design
          </span>
        );
      case 'In Production - Typesetting':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Typesetting
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const getTicketStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Open
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Resolved
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Author Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1a365d] text-white flex items-center justify-center font-serif font-bold text-xl shadow-sm">
            {authorProfile?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-serif font-bold text-slate-900">
                {authorProfile?.name || 'Author Dashboard'}
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                {authorProfile?.authorId || 'AUTH'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {authorProfile?.email} &bull; {authorProfile?.city || 'India'} &bull; Joined{' '}
              {authorProfile?.joinedDate
                ? new Date(authorProfile.joinedDate).toLocaleDateString()
                : 'Recently'}
            </p>
          </div>
        </div>

        {/* Bank Details & Actions */}
        <div className="flex items-center gap-3">
          {authorProfile?.isBankDetailsLinked ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bank Linked (Direct Payout Active)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Bank Details Pending</span>
            </div>
          )}

          <button
            onClick={onOpenSubmitModal}
            className="px-4 py-2 rounded-xl bg-[#1a365d] hover:bg-[#122844] text-white text-xs font-medium shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Submit Query</span>
          </button>
        </div>
      </div>

      {/* Royalty & Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Copies Sold</span>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-serif">
            {summary?.totalCopiesSold?.toLocaleString() || 0}
          </div>
          <p className="text-[11px] text-slate-500">Across Amazon, Flipkart &amp; Store</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Total Earned</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-serif">
            ₹{summary?.totalRoyaltyEarned?.toLocaleString() || 0}
          </div>
          <p className="text-[11px] text-slate-500">80% author profit split</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Royalty Paid</span>
            <CheckCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-800 font-serif">
            ₹{summary?.totalRoyaltyPaid?.toLocaleString() || 0}
          </div>
          <p className="text-[11px] text-slate-500">Disbursed via direct transfer</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Royalty Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 font-serif">
            ₹{summary?.totalRoyaltyPending?.toLocaleString() || 0}
          </div>
          <p className="text-[11px] text-slate-500">Quarterly payout cycle (&ge; ₹1,000)</p>
        </div>
      </div>

      {/* Tabs Switcher: My Books vs My Tickets */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('books')}
          className={`pb-3 text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'books'
              ? 'text-[#1a365d] border-b-2 border-[#1a365d]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Books ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`pb-3 text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'tickets'
              ? 'text-[#1a365d] border-b-2 border-[#1a365d]'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My Tickets ({tickets.length})</span>
        </button>
      </div>

      {/* Tab 1: My Books Grid / List */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block">
                      {book.bookId} &bull; {book.genre}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 font-serif mt-0.5">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ISBN: <span className="font-mono text-slate-700">{book.isbn || 'Pending Assignment'}</span>
                    </p>
                  </div>
                  <div>{getStatusBadge(book.status)}</div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">MRP</span>
                    <span className="font-semibold text-slate-800">
                      {book.mrp ? `₹${book.mrp}` : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Royalty/Copy</span>
                    <span className="font-semibold text-slate-800">
                      {book.authorRoyaltyPerCopy ? `₹${book.authorRoyaltyPerCopy}` : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Copies Sold</span>
                    <span className="font-semibold text-slate-800">
                      {book.totalCopiesSold || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Pending Payout</span>
                    <span className="font-semibold text-amber-600">
                      ₹{book.royaltyPending || 0}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Print: {book.printPartner || 'In-House'}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {book.availableOn && book.availableOn.length > 0 ? (
                      book.availableOn.map((ch: string) => (
                        <span
                          key={ch}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]"
                        >
                          {ch}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Distribution pending</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: My Tickets List */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 font-serif">No Support Tickets Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Need help with your book status, royalties, printing, or ISBN? Raise a ticket and our AI-assisted team will respond swiftly.
              </p>
              <button
                onClick={onOpenSubmitModal}
                className="mt-2 px-4 py-2 rounded-xl bg-[#1a365d] text-white text-xs font-medium shadow-xs"
              >
                Submit Your First Ticket
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTicket(t)}
                  className="p-4 sm:p-5 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-800">
                        {t.ticketNumber}
                      </span>
                      {getTicketStatusBadge(t.status)}
                      <span className="text-[11px] text-slate-500 font-medium px-2 py-0.5 rounded bg-slate-100">
                        {t.category?.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {t.subject}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {t.description}
                    </p>

                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                      {t.book?.title && (
                        <span>&bull; Book: <em>{t.book.title}</em></span>
                      )}
                      {t._count?.messages > 0 && (
                        <span>&bull; {t._count.messages} message(s)</span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
