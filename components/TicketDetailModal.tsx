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
      await api.overrideTicket(ticketId, {
        category: selectedCategory,
        priority: selectedPriority,
      });
      await loadTicket();
      onTicketUpdated();
      alert('AI classification and priority updated!');
    } catch (err: any) {
      alert(err.message || 'Failed to override ticket attributes');
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
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 flex items-center gap-3 shadow-xl">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
          <span className="text-sm font-medium text-slate-700">Loading ticket details...</span>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-slate-900 px-2.5 py-1 rounded-lg bg-slate-200/80">
              {ticket.ticketNumber}
            </span>
            <h2 className="text-base font-bold text-slate-900 truncate max-w-md sm:max-w-xl font-serif">
              {ticket.subject}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Main Column: Ticket Thread & Composer (8 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col h-full bg-slate-50/30">
            {/* Conversation Messages */}
            <div className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[55vh]">
              {/* Initial Author Query Bubble */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {ticket.author?.name?.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-900">{ticket.author?.name}</span>
                    <span className="text-[10px] text-slate-400">(Author)</span>
                  </div>
                  <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {ticket.description}
                </div>

                {ticket.attachmentName && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs border border-slate-200">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Attachment: {ticket.attachmentName}</span>
                  </div>
                )}
              </div>

              {/* Message Thread */}
              {ticket.messages?.map((msg: any) => {
                const isMsgAdmin = msg.sender?.role === 'ADMIN';
                const isInternal = msg.isInternalNote;

                return (
                  <div
                    key={msg.id}
                    className={`rounded-2xl p-4 text-xs space-y-2 shadow-2xs ${
                      isInternal
                        ? 'bg-amber-50/70 border border-amber-200 text-amber-950 ml-4'
                        : isMsgAdmin
                        ? 'bg-indigo-50/60 border border-indigo-100 text-slate-900 ml-4 sm:ml-8'
                        : 'bg-white border border-slate-200 text-slate-800 mr-4 sm:mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-200/50">
                      <div className="flex items-center gap-1.5 font-semibold">
                        {isInternal ? (
                          <span className="flex items-center gap-1 text-amber-800 font-bold">
                            <Lock className="w-3 h-3" />
                            Internal Ops Note (Hidden from Author)
                          </span>
                        ) : isMsgAdmin ? (
                          <span className="text-indigo-900 flex items-center gap-1">
                            <Shield className="w-3 h-3 text-indigo-600" />
                            {msg.sender?.name} (BookLeaf Ops)
                          </span>
                        ) : (
                          <span className="text-slate-800 flex items-center gap-1">
                            <User className="w-3 h-3 text-emerald-600" />
                            {msg.sender?.name} (Author)
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[10px]">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                );
              })}
            </div>

            {/* Reply Composer Box */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <form onSubmit={handleSendMessage} className="space-y-3">
                {isAdmin && (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="msgType"
                          checked={!isInternalNote}
                          onChange={() => setIsInternalNote(false)}
                          className="text-indigo-600 cursor-pointer"
                        />
                        <span>Public Reply</span>
                      </label>

                      <label className="flex items-center gap-1.5 text-amber-800 cursor-pointer">
                        <input
                          type="radio"
                          name="msgType"
                          checked={isInternalNote}
                          onChange={() => setIsInternalNote(true)}
                          className="text-amber-600 cursor-pointer"
                        />
                        <span className="flex items-center gap-1 font-medium">
                          <Lock className="w-3 h-3" />
                          Internal Note
                        </span>
                      </label>
                    </div>

                    {aiDraft && (
                      <button
                        type="button"
                        onClick={handleInsertDraftToEditor}
                        className="text-indigo-600 hover:text-indigo-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
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
                      ? 'Write a private note for operations team...'
                      : 'Type your message to the author...'
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500 focus:bg-white transition"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sendingMessage || !replyContent.trim()}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                      isInternalNote
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-[#1a365d] hover:bg-[#122844]'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sendingMessage ? 'Sending...' : isInternalNote ? 'Save Internal Note' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: AI Draft Studio & Operations Workspace (5 cols on desktop) */}
          <div className="lg:col-span-5 p-6 space-y-6 overflow-y-auto max-h-[75vh] bg-white">
            {/* Context Card: Author & Book Snapshot */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Author &amp; Book Context</span>
              </h4>

              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Author:</span>
                  <span className="font-semibold text-slate-900">{ticket.author?.name} ({ticket.author?.authorId || 'AUTH'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span>{ticket.author?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bank Linked:</span>
                  <span className={ticket.author?.isBankDetailsLinked ? 'text-emerald-700 font-semibold' : 'text-amber-600 font-semibold'}>
                    {ticket.author?.isBankDetailsLinked ? 'Yes (Verified)' : 'No (Pending Link)'}
                  </span>
                </div>

                {ticket.book && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Title:</span>
                      <span className="font-semibold text-slate-900 truncate max-w-[180px]">{ticket.book.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span>{ticket.book.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Copies Sold:</span>
                      <span className="font-semibold text-slate-900">{ticket.book.totalCopiesSold || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pending Royalty:</span>
                      <span className="font-semibold text-amber-600">₹{ticket.book.royaltyPending || 0}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Management Panel */}
            {isAdmin && (
              <div className="space-y-4">
                {/* Status selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Ticket Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    disabled={updatingStatus}
                    className="w-full py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                {/* Overrides: Category & Priority */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Category {ticket.isCategoryOverridden && '(Overridden)'}
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
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
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Priority {ticket.isPriorityOverridden && '(Overridden)'}
                    </label>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
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
                    className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-medium text-slate-700 transition cursor-pointer"
                  >
                    Save Category/Priority
                  </button>
                  <button
                    type="button"
                    onClick={handleAssignToMe}
                    className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-medium text-indigo-700 transition cursor-pointer"
                  >
                    Assign to Me
                  </button>
                </div>
              </div>
            )}

            {/* AI-Drafted Response Studio (Admin Feature) */}
            {isAdmin && (
              <div className="bg-gradient-to-br from-indigo-50/50 via-white to-amber-50/30 rounded-2xl border border-indigo-100 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-bold text-slate-900 text-xs">AI Response Studio</h4>
                  </div>

                  {isDraftCached ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-500" />
                      <span>Valkey Cache Hit</span>
                    </span>
                  ) : draftModel ? (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {draftModel}
                    </span>
                  ) : null}
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Generates an empathetic reply citing exact BookLeaf policy, royalty figures, and next steps.
                </p>

                {aiDraft ? (
                  <div className="space-y-3">
                    <div className="bg-white rounded-xl border border-indigo-100 p-3 text-xs text-slate-800 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-2xs font-sans">
                      {aiDraft}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleInsertDraftToEditor}
                        className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Insert into Editor</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFetchAiDraft}
                        disabled={loadingDraft}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
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
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1a365d] hover:bg-[#122844] text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{loadingDraft ? 'Generating Draft via AI...' : 'Generate AI Response Draft'}</span>
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
