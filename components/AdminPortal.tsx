'use client';

import React, { useState } from 'react';
import {
  Shield,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  User,
  BookOpen,
  ArrowUpDown,
  RefreshCw,
  Inbox,
  Flame,
} from 'lucide-react';

interface Props {
  tickets: any[];
  onSelectTicket: (ticket: any) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const AdminPortal: React.FC<Props> = ({
  tickets,
  onSelectTicket,
  onRefresh,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortByUrgency, setSortByUrgency] = useState(true);

  // Filter & sort
  const filteredTickets = tickets.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchNum = t.ticketNumber?.toLowerCase().includes(q);
      const matchSub = t.subject?.toLowerCase().includes(q);
      const matchAuthor = t.author?.name?.toLowerCase().includes(q);
      const matchBook = t.book?.title?.toLowerCase().includes(q);
      if (!matchNum && !matchSub && !matchAuthor && !matchBook) return false;
    }
    return true;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortByUrgency) {
      const priorityOrder: Record<string, number> = {
        CRITICAL: 1,
        HIGH: 2,
        MEDIUM: 3,
        LOW: 4,
      };
      const pDiff = (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
      if (pDiff !== 0) return pDiff;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalOpen = tickets.filter((t) => t.status === 'OPEN').length;
  const totalInProgress = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const totalUrgent = tickets.filter(
    (t) =>
      (t.priority === 'CRITICAL' || t.priority === 'HIGH') &&
      t.status !== 'RESOLVED' &&
      t.status !== 'CLOSED',
  ).length;
  const totalResolved = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  const getPriorityBadge = (priority: string, isOverridden?: boolean) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#ffe4e6] text-[#be123c] border border-[#fecdd3] flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#be123c] animate-ping"></span>
            <span>Critical</span>
            {isOverridden && <span className="opacity-80">(Manual)</span>}
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#fef8ee] text-[#b4691b] border border-[#fae2c0] flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b4691b]"></span>
            <span>High</span>
            {isOverridden && <span className="opacity-80">(Manual)</span>}
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#f0f4f8] text-[#0f2537] border border-[#d2deeb]">
            Medium
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#f3f1eb] text-[#6b7280] border border-[#e7e5df]">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#f0f4f8] text-[#0f2537] border border-[#d2deeb]">
            Open
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#fef8ee] text-[#b4691b] border border-[#fae2c0]">
            In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#f2f9f4] text-[#15803d] border border-[#cbe8d5]">
            Resolved
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#f3f1eb] text-[#6b7280] border border-[#e7e5df]">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#faf9f5]">
      {/* Ops Desk Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0f2537]"></span>
              <h1 className="text-2xl font-serif font-bold text-[#111827]">
                Editorial Operations Support Queue
              </h1>
            </div>
            <p className="text-xs text-[#6b7280] mt-0.5 font-sans">
              Asynchronous BullMQ auto-triage &bull; Valkey on-demand draft generator &bull; Multi-author backlog
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#e7e5df] hover:bg-[#f3f1eb] text-xs font-bold font-mono uppercase tracking-wider text-[#374151] transition flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Backlog</span>
          </button>
        </div>

        {/* Ledger Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-[#e7e5df] p-4 shadow-paper space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#6b7280]">Open Queue</span>
            <div className="text-2xl font-serif font-bold text-[#0f2537]">{totalOpen}</div>
            <span className="text-[10px] text-[#6b7280] block">Awaiting response</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#e7e5df] p-4 shadow-paper space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#b4691b]">In Progress</span>
            <div className="text-2xl font-serif font-bold text-[#b4691b]">{totalInProgress}</div>
            <span className="text-[10px] text-[#6b7280] block">Active author thread</span>
          </div>

          <div className="bg-[#fff1f2] rounded-2xl border border-[#fecdd3] p-4 shadow-paper space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#be123c] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Critical / High</span>
            </span>
            <div className="text-2xl font-serif font-bold text-[#be123c]">{totalUrgent}</div>
            <span className="text-[10px] text-[#be123c] block">Needs expedited resolution</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#e7e5df] p-4 shadow-paper space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#15803d]">Resolved</span>
            <div className="text-2xl font-serif font-bold text-[#15803d]">{totalResolved}</div>
            <span className="text-[10px] text-[#6b7280] block">Settled dispatches</span>
          </div>
        </div>
      </div>

      {/* Queue Toolbar: Search & Filters */}
      <div className="bg-white rounded-2xl border border-[#e7e5df] p-4 shadow-paper space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ticket #, author, book, issue..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#faf9f5] border border-[#e7e5df] rounded-xl text-xs focus:outline-hidden focus:border-[#0f2537] focus:bg-white transition"
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1.5 px-3 bg-[#faf9f5] border border-[#e7e5df] rounded-xl text-xs focus:outline-hidden focus:border-[#0f2537] cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Category filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-1.5 px-3 bg-[#faf9f5] border border-[#e7e5df] rounded-xl text-xs focus:outline-hidden focus:border-[#0f2537] cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="ROYALTY_AND_PAYMENTS">Royalty &amp; Payments</option>
              <option value="ISBN_AND_METADATA_ISSUES">ISBN &amp; Metadata</option>
              <option value="PRINTING_AND_QUALITY">Printing &amp; Quality</option>
              <option value="DISTRIBUTION_AND_AVAILABILITY">Distribution</option>
              <option value="BOOK_STATUS_AND_PRODUCTION_UPDATES">Production Updates</option>
              <option value="GENERAL_INQUIRY">General Inquiry</option>
            </select>
          </div>

          {/* Priority filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full py-1.5 px-3 bg-[#faf9f5] border border-[#e7e5df] rounded-xl text-xs focus:outline-hidden focus:border-[#0f2537] cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Urgency Order Switcher */}
        <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#f3f1eb]">
          <span className="text-[#6b7280]">
            Filtered Backlog: <strong className="text-[#111827]">{sortedTickets.length}</strong> ticket(s)
          </span>

          <button
            onClick={() => setSortByUrgency(!sortByUrgency)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
              sortByUrgency
                ? 'bg-[#fef8ee] text-[#b4691b] border border-[#fae2c0]'
                : 'bg-[#f3f1eb] text-[#374151]'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>
              {sortByUrgency
                ? 'URGENCY ORDER (Critical First & Oldest Unresolved)'
                : 'CHRONOLOGICAL ORDER (Newest First)'}
            </span>
          </button>
        </div>
      </div>

      {/* Ticket Queue Ledger */}
      <div className="bg-white rounded-3xl border border-[#e7e5df] overflow-hidden shadow-paper divide-y divide-[#f3f1eb]">
        {sortedTickets.length === 0 ? (
          <div className="p-12 text-center text-[#6b7280] space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-[#d6d3cb]" />
            <p className="font-serif font-bold text-sm text-[#111827]">All clear in this queue slice.</p>
          </div>
        ) : (
          sortedTickets.map((t) => (
            <div
              key={t.id}
              onClick={() => onSelectTicket(t)}
              className="p-5 sm:p-6 hover:bg-[#faf9f5] transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#111827] px-2 py-0.5 rounded bg-[#f3f1eb] border border-[#e7e5df]">
                    {t.ticketNumber}
                  </span>
                  {getPriorityBadge(t.priority, t.isPriorityOverridden)}
                  <span className="text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[#faf9f5] text-[#374151] border border-[#e7e5df]">
                    {t.category?.replace(/_/g, ' ')}
                  </span>
                  {getStatusBadge(t.status)}
                  {t.aiConfidence && (
                    <span className="text-[10px] text-[#6b7280] font-mono">
                      [AI: {Math.round(t.aiConfidence * 100)}%]
                    </span>
                  )}
                </div>

                <h3 className="text-base font-serif font-bold text-[#111827] line-clamp-1">
                  {t.subject}
                </h3>

                <p className="text-xs text-[#4b5563] line-clamp-1 font-sans">
                  {t.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#6b7280] pt-1">
                  <div className="flex items-center gap-1.5 font-medium text-[#111827]">
                    <User className="w-3.5 h-3.5 text-[#b4691b]" />
                    <span>{t.author?.name}</span>
                    <span className="font-mono text-[10px] text-[#6b7280]">
                      ({t.author?.authorId || 'AUTH'})
                    </span>
                  </div>

                  {t.book?.title && (
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#0f2537]" />
                      <span className="truncate max-w-[220px]">
                        <em>{t.book.title}</em>
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-[#6b7280]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                {t.assignedTo ? (
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#f0f4f8] text-[#0f2537] border border-[#d2deeb]">
                    Assigned: {t.assignedTo.name?.split(' ')[0]}
                  </span>
                ) : (
                  <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-[#f3f1eb] text-[#6b7280]">
                    Unassigned
                  </span>
                )}

                <div className="w-8 h-8 rounded-full bg-[#f3f1eb] flex items-center justify-center text-[#6b7280] hover:bg-[#e7e5df] transition">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
