'use client';

import React, { useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-neutral-900 font-sans">
      {/* Top Header & Backlog Counts */}
      <div className="space-y-2 pb-6 border-b border-neutral-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold tracking-tight text-black">
            Operations Triage Ledger
          </h1>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="text-xs font-mono text-neutral-500 hover:text-black transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-neutral-500">
          <div><span className="text-black font-semibold">{totalOpen}</span> open</div>
          <div><span className="text-black font-semibold">{totalUrgent}</span> urgent</div>
          <div><span className="text-black font-semibold">{totalInProgress}</span> in progress</div>
          <div><span className="text-black font-semibold">{totalResolved}</span> resolved</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets, authors, editions..."
            className="w-full border-b border-neutral-200 py-1 text-xs text-black placeholder-neutral-400 focus:outline-hidden focus:border-black font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-b border-neutral-200 py-1 text-xs text-neutral-700 bg-transparent focus:outline-hidden focus:border-black cursor-pointer"
          >
            <option value="ALL">Status: All</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border-b border-neutral-200 py-1 text-xs text-neutral-700 bg-transparent focus:outline-hidden focus:border-black cursor-pointer"
          >
            <option value="ALL">Priority: All</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border-b border-neutral-200 py-1 text-xs text-neutral-700 bg-transparent focus:outline-hidden focus:border-black cursor-pointer max-w-[140px] truncate"
          >
            <option value="ALL">Category: All</option>
            <option value="ROYALTY_AND_PAYMENTS">Royalty &amp; Payments</option>
            <option value="ISBN_AND_METADATA_ISSUES">ISBN &amp; Metadata</option>
            <option value="PRINTING_AND_QUALITY">Printing &amp; Quality</option>
            <option value="DISTRIBUTION_AND_AVAILABILITY">Distribution</option>
            <option value="BOOK_STATUS_AND_PRODUCTION_UPDATES">Production Updates</option>
            <option value="GENERAL_INQUIRY">General Inquiry</option>
          </select>

          <button
            onClick={() => setSortByUrgency(!sortByUrgency)}
            className={`transition cursor-pointer ${
              sortByUrgency ? 'text-black font-semibold' : 'text-neutral-400 hover:text-black'
            }`}
          >
            {sortByUrgency ? 'Urgency Sorted' : 'Date Sorted'}
          </button>
        </div>
      </div>

      {/* Flat Ledger Table */}
      <div className="overflow-x-auto">
        {sortedTickets.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-neutral-400">
            No matching inquiries in queue.
          </div>
        ) : (
          <table className="w-full text-left text-xs font-sans">
            <thead className="border-b border-neutral-100 font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="py-2 pr-4 font-normal">ID</th>
                <th className="py-2 pr-4 font-normal">Author</th>
                <th className="py-2 pr-4 font-normal">Inquiry</th>
                <th className="py-2 pr-4 font-normal">Category</th>
                <th className="py-2 pr-4 font-normal">Priority</th>
                <th className="py-2 pr-4 font-normal">Status</th>
                <th className="py-2 text-right font-normal">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {sortedTickets.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => onSelectTicket(t)}
                  className="hover:bg-neutral-50 transition cursor-pointer"
                >
                  <td className="py-3 pr-4 font-mono font-bold text-black whitespace-nowrap">
                    {t.ticketNumber}
                  </td>

                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="font-semibold text-black">{t.author?.name}</span>
                    <span className="text-[10px] font-mono text-neutral-400 block">
                      {t.book?.title ? t.book.title : t.author?.authorId || 'General'}
                    </span>
                  </td>

                  <td className="py-3 pr-4 max-w-xs sm:max-w-sm">
                    <div className="font-medium text-black line-clamp-1">{t.subject}</div>
                    <div className="text-[11px] text-neutral-500 line-clamp-1">{t.description}</div>
                  </td>

                  <td className="py-3 pr-4 font-mono text-[10px] text-neutral-600 whitespace-nowrap">
                    {t.category?.replace(/_/g, ' ')}
                  </td>

                  <td className="py-3 pr-4 font-mono text-[10px] whitespace-nowrap">
                    <span className={t.priority === 'CRITICAL' ? 'font-bold text-black underline' : t.priority === 'HIGH' ? 'font-semibold text-black' : 'text-neutral-500'}>
                      {t.priority}
                    </span>
                    {t.isPriorityOverridden && <span className="text-neutral-400 ml-0.5">*</span>}
                  </td>

                  <td className="py-3 pr-4 font-mono text-[10px] text-neutral-600 whitespace-nowrap uppercase">
                    {t.status}
                  </td>

                  <td className="py-3 text-right font-mono text-[11px] text-neutral-400 hover:text-black whitespace-nowrap">
                    Open &rarr;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
