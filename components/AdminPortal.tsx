'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
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

  // Filter & sort logic
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
      // Older unresolved tickets first
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Metric counts
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
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
            <span>Critical</span>
            {isOverridden && <span className="text-[10px] text-rose-500">(Override)</span>}
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>High</span>
            {isOverridden && <span className="text-[10px] text-amber-500">(Override)</span>}
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            Medium
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
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
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Open
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Resolved
          </span>
        );
      case 'CLOSED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Ops Header & Metrics */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <span>Operations Support Queue</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              AI-triaged incoming ticket backlog across all BookLeaf authors
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 block uppercase">Open Queue</span>
            <span className="text-2xl font-serif font-bold text-blue-700">{totalOpen}</span>
            <span className="text-[10px] text-slate-400 block">Awaiting response</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 block uppercase">In Progress</span>
            <span className="text-2xl font-serif font-bold text-amber-600">{totalInProgress}</span>
            <span className="text-[10px] text-slate-400 block">Active discussions</span>
          </div>

          <div className="bg-white rounded-xl border border-rose-200 bg-rose-50/20 p-4 shadow-2xs">
            <span className="text-[11px] font-semibold text-rose-700 block uppercase flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Critical &amp; High</span>
            </span>
            <span className="text-2xl font-serif font-bold text-rose-700">{totalUrgent}</span>
            <span className="text-[10px] text-rose-500 block">Needs immediate review</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <span className="text-[11px] font-medium text-slate-500 block uppercase">Resolved</span>
            <span className="text-2xl font-serif font-bold text-emerald-700">{totalResolved}</span>
            <span className="text-[10px] text-slate-400 block">Completed queries</span>
          </div>
        </div>
      </div>

      {/* Queue Toolbar: Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ticket #, author, subject, book..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500 cursor-pointer"
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
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500 cursor-pointer"
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
              className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Urgency sorting toggle */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-500">
            Showing <strong>{sortedTickets.length}</strong> ticket(s)
          </span>

          <button
            onClick={() => setSortByUrgency(!sortByUrgency)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              sortByUrgency
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>
              {sortByUrgency
                ? 'Urgency Order (Critical & Oldest Unresolved First)'
                : 'Chronological Order (Newest First)'}
            </span>
          </button>
        </div>
      </div>

      {/* Ticket Queue List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
        {sortedTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Filter className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-medium text-sm">No tickets match the selected filters.</p>
          </div>
        ) : (
          sortedTickets.map((t) => (
            <div
              key={t.id}
              onClick={() => onSelectTicket(t)}
              className="p-5 hover:bg-slate-50/80 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {t.ticketNumber}
                  </span>
                  {getPriorityBadge(t.priority, t.isPriorityOverridden)}
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {t.category?.replace(/_/g, ' ')}
                  </span>
                  {getStatusBadge(t.status)}
                  {t.aiConfidence && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      (AI: {Math.round(t.aiConfidence * 100)}%)
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {t.subject}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-1">
                  {t.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <div className="flex items-center gap-1 font-medium text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.author?.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      ({t.author?.authorId || 'AUTH'})
                    </span>
                  </div>

                  {t.book?.title && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[200px]">
                        <em>{t.book.title}</em>
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                {t.assignedTo ? (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Assigned: {t.assignedTo.name?.split(' ')[0]}
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-500">
                    Unassigned
                  </span>
                )}

                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition">
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
