'use client';

import React, { useState } from 'react';
import {
  Shield,
  Search,
  ChevronRight,
  RefreshCw,
  ArrowUpDown,
  SlidersHorizontal,
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
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold uppercase tracking-wider bg-black text-white">
            Critical {isOverridden && '*'}
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono font-semibold uppercase tracking-wider bg-neutral-800 text-white">
            High {isOverridden && '*'}
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider border border-neutral-400 text-neutral-800 bg-neutral-100">
            Medium
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider border border-neutral-300 text-neutral-500">
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
          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider border border-neutral-200 text-neutral-400">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-white font-sans text-neutral-900">
      {/* Ops Desk Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
              Operations Control
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black mt-0.5">
            Triage &amp; Inquiry Ledger
          </h1>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-3 py-1.5 border border-neutral-300 hover:border-black text-black text-xs font-mono uppercase tracking-wider rounded-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
          <span className="text-[10px] uppercase text-neutral-400 block">Open Backlog</span>
          <span className="text-2xl font-bold text-black mt-0.5 block">{totalOpen}</span>
          <span className="text-[10px] text-neutral-500 block">Requires attention</span>
        </div>

        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
          <span className="text-[10px] uppercase text-neutral-400 block">Urgent (Critical / High)</span>
          <span className="text-2xl font-bold text-black mt-0.5 block">{totalUrgent}</span>
          <span className="text-[10px] text-neutral-500 block">Prioritized dispatch</span>
        </div>

        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
          <span className="text-[10px] uppercase text-neutral-400 block">In Progress</span>
          <span className="text-2xl font-bold text-black mt-0.5 block">{totalInProgress}</span>
          <span className="text-[10px] text-neutral-500 block">Under active review</span>
        </div>

        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
          <span className="text-[10px] uppercase text-neutral-400 block">Resolved / Closed</span>
          <span className="text-2xl font-bold text-black mt-0.5 block">{totalResolved}</span>
          <span className="text-[10px] text-neutral-500 block">Completed queries</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-xs text-xs font-mono">
        <div className="flex flex-1 items-center gap-2 min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ticket #, subject, author, or book..."
            className="w-full bg-white border border-neutral-300 rounded-xs px-2.5 py-1 text-xs text-black placeholder-neutral-400 focus:outline-hidden focus:border-black"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-neutral-300 rounded-xs px-2 py-1 text-xs text-black cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white border border-neutral-300 rounded-xs px-2 py-1 text-xs text-black cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-neutral-300 rounded-xs px-2 py-1 text-xs text-black cursor-pointer max-w-[150px] truncate"
          >
            <option value="ALL">All Categories</option>
            <option value="ROYALTY_AND_PAYMENTS">Royalty &amp; Payments</option>
            <option value="ISBN_AND_METADATA_ISSUES">ISBN &amp; Metadata</option>
            <option value="PRINTING_AND_QUALITY">Printing &amp; Quality</option>
            <option value="DISTRIBUTION_AND_AVAILABILITY">Distribution</option>
            <option value="BOOK_STATUS_AND_PRODUCTION_UPDATES">Production Updates</option>
            <option value="GENERAL_INQUIRY">General Inquiry</option>
          </select>

          {/* Sort toggle */}
          <button
            onClick={() => setSortByUrgency(!sortByUrgency)}
            className={`px-2.5 py-1 rounded-xs transition cursor-pointer flex items-center gap-1.5 ${
              sortByUrgency
                ? 'bg-black text-white font-semibold'
                : 'bg-white border border-neutral-300 text-neutral-700 hover:border-black'
            }`}
          >
            <ArrowUpDown className="w-3 h-3" />
            <span>{sortByUrgency ? 'Urgency Sorted' : 'Date Sorted'}</span>
          </button>
        </div>
      </div>

      {/* Ticket Ledger Table */}
      <div className="border border-neutral-200 rounded-xs overflow-hidden bg-white">
        {sortedTickets.length === 0 ? (
          <div className="p-12 text-center font-mono text-xs text-neutral-400">
            No inquiries match the current search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-neutral-50 border-b border-neutral-200 font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Ticket</th>
                  <th className="py-2.5 px-4 font-semibold">Author &amp; Title</th>
                  <th className="py-2.5 px-4 font-semibold">Inquiry Summary</th>
                  <th className="py-2.5 px-4 font-semibold">Category</th>
                  <th className="py-2.5 px-4 font-semibold">Priority</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {sortedTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => onSelectTicket(t)}
                    className="hover:bg-neutral-50 transition cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-black whitespace-nowrap">
                      {t.ticketNumber}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-black">{t.author?.name}</div>
                      <div className="text-[10px] font-mono text-neutral-400">
                        {t.book?.title ? t.book.title : t.author?.authorId || 'General Inquiry'}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs sm:max-w-md">
                      <div className="font-medium text-black line-clamp-1">{t.subject}</div>
                      <div className="text-[11px] text-neutral-500 line-clamp-1">{t.description}</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[10px] text-neutral-700 whitespace-nowrap">
                      {t.category?.replace(/_/g, ' ')}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {getPriorityBadge(t.priority, t.isPriorityOverridden)}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(t.status)}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="px-2 py-1 border border-neutral-300 hover:border-black rounded-xs text-[10px] font-mono uppercase tracking-wider text-black">
                        Open &rarr;
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
