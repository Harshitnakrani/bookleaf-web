'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Lock,
  Sparkles,
  Zap,
  CheckCircle2,
  RefreshCw,
  User,
  BookOpen,
  DollarSign,
  AlertCircle,
  Clock,
  Shield,
  FileText,
  Feather,
  BookMarked,
  Tag,
} from 'lucide-react';
import { api } from '../lib/api';

interface Props {
  ticketId: string;
  currentUser: any;
  onClose: () => void;
  onTicketUpdated: () => void;
}

export const TicketDetailModal: React.FC<Props> = ({
  ticketId,
  currentUser,
  onClose,
  onTicketUpdated,
}) => {
  const [ticket, setTicket] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // AI Draft State
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [isDraftCached, setIsDraftCached] = useState(false);
  const [draftModel, setDraftModel] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);

  // Status & Override State
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [savingOverrides, setSavingOverrides] = useState(false);

  const isAdmin = currentUser?.role === 'ADMIN';

  const loadTicket = async () => {
    try {
      setLoading(true);
      const data = await api.getTicketById(ticketId);
      setTicket(data);
      setSelectedStatus(data.status);
      setSelectedCategory(data.category);
      setSelectedPriority(data.priority);
    } catch (err) {
      console.error('Failed to load ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  // Fetch AI draft for admins on demand (or from Valkey cache)
  const handleFetchAiDraft = async () => {
    if (!isAdmin) return;
    try {
      setLoadingDraft(true);
      const res = await api.getAiDraft(ticketId);
      setAiDraft(res.draft);
      setIsDraftCached(res.isCached);
      setDraftModel(res.modelUsed || null);
    } catch (err) {
      console.error('Failed to fetch AI draft:', err);
    } finally {
      setLoadingDraft(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || sendingMessage) return;

    try {
      setSendingMessage(true);
      await api.addMessage(ticketId, {
        content: replyContent.trim(),
        isInternalNote: isAdmin ? isInternalNote : false,
      });
      setReplyContent('');
      setIsInternalNote(false);
      // Invalidate AI draft in local state since thread progressed
      setAiDraft(null);
      // Reload conversation
      await loadTicket();
      onTicketUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      setUpdatingStatus(true);
      await api.updateStatus(ticketId, status);
      setSelectedStatus(status);
      await loadTicket();
      onTicketUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleOverride = async () => {
    try {
      setSavingOverrides(true);
      await api.overrideTicket(ticketId, {
        category: selectedCategory,
        priority: selectedPriority,
      });
      await loadTicket();
      onTicketUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to override ticket attributes');
    } finally {
      setSavingOverrides(false);
    }
  };

  const handleAssignToMe = async () => {
    try {
      await api.assignTicket(ticketId, currentUser.id);
      await loadTicket();
      onTicketUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to assign ticket');
    }
  };

  const handleInsertDraftToEditor = () => {
    if (aiDraft) {
      setReplyContent(aiDraft);
      setIsInternalNote(false);
    }
  };

  if (loading && !ticket) {
    return (
      <div className="fixed inset-0 z-50 bg-[#1b2a4a]/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-[#faf9f5] border border-[#e5dfd3] rounded-2xl p-8 flex items-center gap-3 shadow-xl">
          <RefreshCw className="w-5 h-5 animate-spin text-[#1b2a4a]" />
          <span className="text-sm font-serif font-medium text-[#2b2b2b]">
            Opening correspondence record...
          </span>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  const priorityColor =
    ticket.priority === 'CRITICAL'
      ? 'bg-[#8b263e]/10 text-[#8b263e] border-[#8b263e]/30'
      : ticket.priority === 'HIGH'
      ? 'bg-amber-500/10 text-amber-900 border-amber-300'
      : ticket.priority === 'MEDIUM'
      ? 'bg-blue-500/10 text-blue-900 border-blue-200'
      : 'bg-emerald-500/10 text-emerald-900 border-emerald-200';

  const statusColor =
    ticket.status === 'RESOLVED'
      ? 'bg-[#1e3a2b]/10 text-[#1e3a2b] border-[#1e3a2b]/30'
      : ticket.status === 'IN_PROGRESS'
      ? 'bg-amber-600/10 text-amber-900 border-amber-300'
      : ticket.status === 'CLOSED'
      ? 'bg-slate-200 text-slate-700 border-slate-300'
      : 'bg-[#1b2a4a]/10 text-[#1b2a4a] border-[#1b2a4a]/30';

  return (
    <div className="fixed inset-0 z-50 bg-[#1b2a4a]/45 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#faf9f5] rounded-2xl border border-[#e5dfd3] shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Editorial Letterhead Header */}
        <div className="px-6 py-4 border-b border-[#e5dfd3] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#1b2a4a] px-2.5 py-1 rounded-md bg-[#faf9f5] border border-[#e5dfd3]">
              {ticket.ticketNumber}
            </span>
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-[#1b2a4a] truncate max-w-md sm:max-w-xl font-serif">
                {ticket.subject}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${statusColor}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${priorityColor}`}>
                  {ticket.priority} Priority
                </span>
                <span className="text-[11px] text-[#737373]">
                  Category: <span className="font-medium text-[#2b2b2b]">{ticket.category.replace(/_/g, ' ')}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#faf9f5] text-[#737373] hover:text-[#1b2a4a] border border-transparent hover:border-[#e5dfd3] flex items-center justify-center transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#e5dfd3]">
          {/* Main Column: Ticket Thread & Composer (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col h-full bg-[#faf9f5]">
            {/* Conversation Messages Thread */}
            <div className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[55vh]">
              {/* Initial Author Query Dossier Bubble */}
              <div className="bg-white rounded-xl border border-[#e5dfd3] p-5 shadow-xs space-y-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1b2a4a]" />
                <div className="flex items-center justify-between text-xs text-[#737373] pb-2 border-b border-[#e5dfd3]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1e3a2b] text-white flex items-center justify-center text-xs font-serif font-bold">
                      {ticket.author?.name?.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-[#1b2a4a] block">{ticket.author?.name}</span>
                      <span className="text-[10px] text-[#737373] font-mono">
                        Author {ticket.author?.authorId || 'ID'} &bull; Original Query
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono">
                    {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="text-xs text-[#2b2b2b] leading-relaxed whitespace-pre-wrap font-sans pl-1">
                  {ticket.description}
                </div>

                {ticket.attachmentName && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#faf9f5] text-[#2b2b2b] text-xs border border-[#e5dfd3]">
                    <FileText className="w-3.5 h-3.5 text-[#1b2a4a]" />
                    <span className="font-mono text-[11px]">Attachment: {ticket.attachmentName}</span>
                  </div>
                )}
              </div>

              {/* Thread Messages */}
              {ticket.messages?.map((msg: any) => {
                const isMsgAdmin = msg.sender?.role === 'ADMIN';
                const isInternal = msg.isInternalNote;

                return (
                  <div
                    key={msg.id}
                    className={`rounded-xl p-4 text-xs space-y-2 shadow-xs transition ${
                      isInternal
                        ? 'bg-[#fffbeb] border border-[#fde68a] text-[#78350f] ml-4 sm:ml-6'
                        : isMsgAdmin
                        ? 'bg-white border-l-4 border-l-[#1b2a4a] border border-[#e5dfd3] text-[#2b2b2b] ml-4 sm:ml-8'
                        : 'bg-white border-l-4 border-l-[#1e3a2b] border border-[#e5dfd3] text-[#2b2b2b] mr-4 sm:mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-[#e5dfd3]/60">
                      <div className="flex items-center gap-1.5 font-semibold">
                        {isInternal ? (
                          <span className="flex items-center gap-1 text-[#92400e] font-serif font-bold">
                            <Lock className="w-3 h-3" />
                            Internal Operations Ledger (Author Cannot View)
                          </span>
                        ) : isMsgAdmin ? (
                          <span className="text-[#1b2a4a] flex items-center gap-1.5 font-serif">
                            <Shield className="w-3.5 h-3.5 text-[#1b2a4a]" />
                            {msg.sender?.name} <span className="text-[10px] font-sans text-[#737373]">(BookLeaf Operations)</span>
                          </span>
                        ) : (
                          <span className="text-[#1e3a2b] flex items-center gap-1.5 font-serif">
                            <User className="w-3.5 h-3.5 text-[#1e3a2b]" />
                            {msg.sender?.name} <span className="text-[10px] font-sans text-[#737373]">(Author)</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[#737373] text-[10px] font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="whitespace-pre-wrap leading-relaxed text-xs">{msg.content}</p>
                  </div>
                );
              })}
            </div>

            {/* Reply Composer Box */}
            <div className="p-4 border-t border-[#e5dfd3] bg-white">
              <form onSubmit={handleSendMessage} className="space-y-3">
                {isAdmin && (
                  <div className="flex items-center justify-between text-xs pb-1">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 text-[#2b2b2b] cursor-pointer">
                        <input
                          type="radio"
                          name="msgType"
                          checked={!isInternalNote}
                          onChange={() => setIsInternalNote(false)}
                          className="accent-[#1b2a4a] cursor-pointer"
                        />
                        <span className="font-medium">Public Author Letter</span>
                      </label>

                      <label className="flex items-center gap-1.5 text-[#78350f] cursor-pointer">
                        <input
                          type="radio"
                          name="msgType"
                          checked={isInternalNote}
                          onChange={() => setIsInternalNote(true)}
                          className="accent-[#d4af37] cursor-pointer"
                        />
                        <span className="flex items-center gap-1 font-medium">
                          <Lock className="w-3 h-3 text-[#d4af37]" />
                          Internal Ops Note
                        </span>
                      </label>
                    </div>

                    {aiDraft && (
                      <button
                        type="button"
                        onClick={handleInsertDraftToEditor}
                        className="text-[#1b2a4a] hover:text-[#d4af37] text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition"
                      >
                        <Sparkles className="w-3 h-3 text-[#d4af37]" />
                        <span>Insert AI Draft</span>
                      </button>
                    )}
                  </div>
                )}

                <textarea
                  rows={3}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={
                    isInternalNote
                      ? 'Record a confidential note for the publishing operations team...'
                      : 'Compose formal correspondence to author...'
                  }
                  className="w-full p-3 bg-[#faf9f5] border border-[#e5dfd3] rounded-xl text-xs text-[#2b2b2b] placeholder-[#737373] focus:outline-hidden focus:border-[#1b2a4a] focus:bg-white transition"
                />

                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-[#737373] flex items-center gap-1">
                    <Feather className="w-3 h-3 text-[#d4af37]" />
                    <span>Replies immediately notify the author and update the audit log.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={sendingMessage || !replyContent.trim()}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                      isInternalNote
                        ? 'bg-[#78350f] hover:bg-[#5b280b]'
                        : 'bg-[#1b2a4a] hover:bg-[#122844]'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {sendingMessage
                        ? 'Recording...'
                        : isInternalNote
                        ? 'Save Internal Note'
                        : 'Dispatch Reply'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: AI Draft Studio & Operations Ledger (5 cols on desktop) */}
          <div className="lg:col-span-5 p-6 space-y-6 overflow-y-auto max-h-[75vh] bg-white">
            {/* Context Card: Author & Title Snapshot */}
            <div className="bg-[#faf9f5] rounded-xl border border-[#e5dfd3] p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#e5dfd3] pb-2">
                <h4 className="font-serif font-bold text-[#1b2a4a] tracking-wide text-xs flex items-center gap-1.5">
                  <BookMarked className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Author &amp; Edition Dossier</span>
                </h4>
                <span className="font-mono text-[10px] text-[#737373]">
                  {ticket.author?.authorId || 'AUTH'}
                </span>
              </div>

              <div className="space-y-2 text-[#2b2b2b]">
                <div className="flex justify-between items-center">
                  <span className="text-[#737373]">Author Name:</span>
                  <span className="font-serif font-bold text-[#1b2a4a]">{ticket.author?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#737373]">Email:</span>
                  <span className="font-mono text-[11px]">{ticket.author?.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#737373]">Bank Linked:</span>
                  <span className={ticket.author?.isBankDetailsLinked ? 'text-[#1e3a2b] font-bold text-[11px]' : 'text-[#8b263e] font-bold text-[11px]'}>
                    {ticket.author?.isBankDetailsLinked ? '✓ Linked & Verified' : '✗ Pending Bank Link'}
                  </span>
                </div>

                {ticket.book && (
                  <div className="pt-2 border-t border-[#e5dfd3] space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[#737373]">Book Title:</span>
                      <span className="font-serif font-bold text-[#1b2a4a] truncate max-w-[180px]">{ticket.book.title}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#737373]">ISBN:</span>
                      <span className="font-mono text-[11px] text-[#2b2b2b]">{ticket.book.isbn || 'Pending Allocation'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#737373]">Copies Sold:</span>
                      <span className="font-mono font-bold text-[#1b2a4a]">{ticket.book.totalCopiesSold || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#737373]">Pending Royalty:</span>
                      <span className="font-mono font-bold text-[#1e3a2b]">₹{ticket.book.royaltyPending?.toLocaleString('en-IN') || 0}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Management Panel */}
            {isAdmin && (
              <div className="space-y-4 pt-1">
                {/* Status selector */}
                <div>
                  <label className="block text-[11px] font-bold text-[#1b2a4a] uppercase tracking-wider mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    disabled={updatingStatus}
                    className="w-full py-2 px-3 bg-[#faf9f5] border border-[#e5dfd3] rounded-xl text-xs font-semibold text-[#1b2a4a] focus:outline-hidden focus:border-[#1b2a4a] cursor-pointer"
                  >
                    <option value="OPEN">Open (Requires Action)</option>
                    <option value="IN_PROGRESS">In Progress (Under Review)</option>
                    <option value="RESOLVED">Resolved (Query Addressed)</option>
                    <option value="CLOSED">Closed (Archived)</option>
                  </select>
                </div>

                {/* Overrides: Category & Priority */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-[#737373] uppercase mb-1">
                      Category {ticket.isCategoryOverridden && '(Manual Override)'}
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full py-1.5 px-2 bg-[#faf9f5] border border-[#e5dfd3] rounded-lg text-xs text-[#2b2b2b]"
                    >
                      <option value="ROYALTY_AND_PAYMENTS">Royalty &amp; Payments</option>
                      <option value="ISBN_AND_METADATA_ISSUES">ISBN &amp; Metadata</option>
                      <option value="PRINTING_AND_QUALITY">Printing &amp; Quality</option>
                      <option value="DISTRIBUTION_AND_AVAILABILITY">Distribution</option>
                      <option value="BOOK_STATUS_AND_PRODUCTION_UPDATES">Production Updates</option>
                      <option value="GENERAL_INQUIRY">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#737373] uppercase mb-1">
                      Priority {ticket.isPriorityOverridden && '(Manual Override)'}
                    </label>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full py-1.5 px-2 bg-[#faf9f5] border border-[#e5dfd3] rounded-lg text-xs text-[#2b2b2b]"
                    >
                      <option value="CRITICAL">Critical</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleOverride}
                    disabled={savingOverrides}
                    className="flex-1 py-1.5 px-3 rounded-lg border border-[#e5dfd3] hover:bg-[#faf9f5] text-[11px] font-medium text-[#1b2a4a] transition cursor-pointer"
                  >
                    {savingOverrides ? 'Saving...' : 'Apply Overrides'}
                  </button>
                  <button
                    type="button"
                    onClick={handleAssignToMe}
                    className="py-1.5 px-3 rounded-lg border border-[#1b2a4a]/20 bg-[#1b2a4a]/5 hover:bg-[#1b2a4a]/10 text-[11px] font-medium text-[#1b2a4a] transition cursor-pointer"
                  >
                    Assign to Me
                  </button>
                </div>
              </div>
            )}

            {/* AI-Drafted Response Studio (Admin Feature) */}
            {isAdmin && (
              <div className="bg-[#faf9f5] rounded-xl border border-[#d4af37]/50 p-4 space-y-3 relative shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <h4 className="font-serif font-bold text-[#1b2a4a] text-xs">AI Response Studio</h4>
                  </div>

                  {isDraftCached ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#1e3a2b]/10 text-[#1e3a2b] border border-[#1e3a2b]/30 text-[10px] font-mono font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#1e3a2b]" />
                      <span>Valkey Cache Hit</span>
                    </span>
                  ) : draftModel ? (
                    <span className="text-[10px] text-[#737373] font-mono">
                      {draftModel}
                    </span>
                  ) : null}
                </div>

                <p className="text-[11px] text-[#737373] leading-relaxed">
                  Synthesizes official BookLeaf policy, royalty threshold rules, and author context into a ready-to-dispatch response.
                </p>

                {aiDraft ? (
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg border border-[#e5dfd3] p-3.5 text-xs text-[#2b2b2b] max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-2xs font-sans">
                      {aiDraft}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleInsertDraftToEditor}
                        className="flex-1 py-2 px-3 rounded-lg bg-[#1b2a4a] hover:bg-[#122844] text-white font-medium text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Insert into Reply Editor</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFetchAiDraft}
                        disabled={loadingDraft}
                        className="p-2 rounded-lg border border-[#e5dfd3] bg-white hover:bg-[#faf9f5] text-[#2b2b2b] transition cursor-pointer"
                        title="Regenerate Draft"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingDraft ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleFetchAiDraft}
                    disabled={loadingDraft}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1b2a4a] hover:bg-[#122844] text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <span>{loadingDraft ? 'Synthesizing Policy Draft...' : 'Generate AI Response Draft'}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
