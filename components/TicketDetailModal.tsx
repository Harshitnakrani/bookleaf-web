'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Lock,
  Zap,
  RefreshCw,
  User,
  Shield,
  FileText,
  CornerDownRight,
  ArrowRight,
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
      setAiDraft(null);
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
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white border border-neutral-300 rounded-xs p-6 flex items-center gap-3 font-mono text-xs text-neutral-800">
          <RefreshCw className="w-4 h-4 animate-spin text-black" />
          <span>Opening inquiry record...</span>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-xs border border-neutral-300 shadow-xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Minimal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-white bg-black px-2 py-0.5 rounded-xs">
              {ticket.ticketNumber}
            </span>
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-black truncate max-w-md sm:max-w-xl">
                {ticket.subject}
              </h2>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono uppercase text-neutral-500">
                <span>[{ticket.status}]</span>
                <span>&bull;</span>
                <span>[{ticket.priority} PRIORITY]</span>
                <span>&bull;</span>
                <span>{ticket.category?.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 border border-neutral-200 hover:border-black rounded-xs text-neutral-500 hover:text-black flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-200">
          {/* Main Column: Thread & Composer (7 cols) */}
          <div className="lg:col-span-7 flex flex-col h-full bg-white">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[55vh]">
              {/* Initial Query */}
              <div className="border border-neutral-200 p-4 rounded-xs bg-white space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-100 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-black text-white flex items-center justify-center text-[10px] font-bold rounded-xs">
                      {ticket.author?.name?.charAt(0)}
                    </span>
                    <span className="font-semibold text-black">{ticket.author?.name}</span>
                    <span>[{ticket.author?.authorId || 'AUTH'}]</span>
                  </div>
                  <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>

                <div className="text-xs text-neutral-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {ticket.description}
                </div>

                {ticket.attachmentName && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-mono">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Attachment: {ticket.attachmentName}</span>
                  </div>
                )}
              </div>

              {/* Replies Thread */}
              {ticket.messages?.map((msg: any) => {
                const isMsgAdmin = msg.sender?.role === 'ADMIN';
                const isInternal = msg.isInternalNote;

                return (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xs text-xs space-y-1.5 transition ${
                      isInternal
                        ? 'bg-neutral-50 border border-dashed border-neutral-400 text-neutral-900 ml-4'
                        : isMsgAdmin
                        ? 'bg-neutral-100 border border-neutral-200 text-black ml-4 sm:ml-6'
                        : 'bg-white border border-neutral-200 text-neutral-900 mr-4 sm:mr-6'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono pb-1 border-b border-neutral-200/60">
                      <div className="flex items-center gap-1.5 font-semibold">
                        {isInternal ? (
                          <span className="flex items-center gap-1 text-black font-bold">
                            <Lock className="w-3 h-3" />
                            [INTERNAL OPS NOTE]
                          </span>
                        ) : isMsgAdmin ? (
                          <span className="text-black flex items-center gap-1">
                            <Shield className="w-3 h-3 text-black" />
                            {msg.sender?.name} (Ops)
                          </span>
                        ) : (
                          <span className="text-neutral-800 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {msg.sender?.name} (Author)
                          </span>
                        )}
                      </div>
                      <span className="text-neutral-400 text-[10px]">
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

            {/* Composer */}
            <div className="p-4 border-t border-neutral-200 bg-white">
              <form onSubmit={handleSendMessage} className="space-y-3 font-mono text-xs">
                {isAdmin && (
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 text-black cursor-pointer">
                        <input
                          type="radio"
                          name="msgType"
                          checked={!isInternalNote}
                          onChange={() => setIsInternalNote(false)}
                          className="accent-black cursor-pointer"
                        />
                        <span className="font-semibold">Public Author Letter</span>
                      </label>

                      <label className="flex items-center gap-1.5 text-neutral-700 cursor-pointer">
                        <input
                          type="radio"
                          name="msgType"
                          checked={isInternalNote}
                          onChange={() => setIsInternalNote(true)}
                          className="accent-black cursor-pointer"
                        />
                        <span className="flex items-center gap-1 font-semibold">
                          <Lock className="w-3 h-3" />
                          Internal Note
                        </span>
                      </label>
                    </div>

                    {aiDraft && (
                      <button
                        type="button"
                        onClick={handleInsertDraftToEditor}
                        className="text-black hover:underline text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <CornerDownRight className="w-3 h-3" />
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
                      ? 'Write a confidential note for publishing operations...'
                      : 'Compose formal response to author...'
                  }
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xs text-xs text-black placeholder-neutral-400 focus:outline-hidden focus:border-black font-sans"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400">
                    Audit log auto-updated on dispatch.
                  </span>

                  <button
                    type="submit"
                    disabled={sendingMessage || !replyContent.trim()}
                    className="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider rounded-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                    <span>
                      {sendingMessage
                        ? 'Dispatching...'
                        : isInternalNote
                        ? 'Save Note'
                        : 'Dispatch Reply'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: AI Response Studio & Dossier (5 cols) */}
          <div className="lg:col-span-5 p-6 space-y-5 overflow-y-auto max-h-[75vh] bg-white text-xs">
            {/* Author & Edition Dossier */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs space-y-2.5 font-mono">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Author Dossier</span>
                <span className="text-[10px] text-neutral-600">[{ticket.author?.authorId || 'AUTH'}]</span>
              </div>

              <div className="space-y-1.5 text-neutral-700">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Name:</span>
                  <span className="font-bold text-black font-sans">{ticket.author?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Email:</span>
                  <span className="text-black">{ticket.author?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Bank Status:</span>
                  <span className="font-bold text-black">
                    {ticket.author?.isBankDetailsLinked ? '[VERIFIED]' : '[PENDING]'}
                  </span>
                </div>

                {ticket.book && (
                  <div className="pt-2 border-t border-neutral-200 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Edition:</span>
                      <span className="font-bold text-black font-sans truncate max-w-[160px]">{ticket.book.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">ISBN:</span>
                      <span className="text-black">{ticket.book.isbn || 'Pending'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Units Sold:</span>
                      <span className="font-bold text-black">{ticket.book.totalCopiesSold || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Pending Royalty:</span>
                      <span className="font-bold text-black">₹{ticket.book.royaltyPending || 0}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Override Controls */}
            {isAdmin && (
              <div className="space-y-3 font-mono">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    disabled={updatingStatus}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-xs text-xs text-black cursor-pointer font-sans"
                  >
                    <option value="OPEN">Open (Requires Action)</option>
                    <option value="IN_PROGRESS">In Progress (Under Review)</option>
                    <option value="RESOLVED">Resolved (Addressed)</option>
                    <option value="CLOSED">Closed (Archived)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                      Category {ticket.isCategoryOverridden && '*'}
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-1.5 bg-neutral-50 border border-neutral-300 rounded-xs text-xs text-black font-sans"
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
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                      Priority {ticket.isPriorityOverridden && '*'}
                    </label>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="w-full p-1.5 bg-neutral-50 border border-neutral-300 rounded-xs text-xs text-black font-sans"
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
                    className="flex-1 py-1.5 px-3 border border-neutral-300 hover:border-black rounded-xs text-xs font-mono uppercase tracking-wider text-black transition cursor-pointer"
                  >
                    {savingOverrides ? 'Saving...' : 'Apply Overrides'}
                  </button>
                  <button
                    type="button"
                    onClick={handleAssignToMe}
                    className="py-1.5 px-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-xs text-xs font-mono uppercase text-black transition cursor-pointer"
                  >
                    Assign to Me
                  </button>
                </div>
              </div>
            )}

            {/* AI-Drafted Response Studio */}
            {isAdmin && (
              <div className="p-4 bg-neutral-50 border border-neutral-300 rounded-xs space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-black">
                    AI Response Studio
                  </span>

                  {isDraftCached ? (
                    <span className="px-1.5 py-0.5 rounded-xs bg-black text-white text-[9px] font-mono uppercase flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" />
                      <span>Valkey Hit</span>
                    </span>
                  ) : draftModel ? (
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {draftModel}
                    </span>
                  ) : null}
                </div>

                <p className="text-[11px] text-neutral-500 font-sans leading-relaxed">
                  Generates an empathetic response referencing official BookLeaf policies and account details.
                </p>

                {aiDraft ? (
                  <div className="space-y-3">
                    <div className="bg-white border border-neutral-200 p-3 rounded-xs text-xs text-neutral-800 max-h-48 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
                      {aiDraft}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleInsertDraftToEditor}
                        className="flex-1 py-2 px-3 bg-black hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider rounded-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Insert Draft</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFetchAiDraft}
                        disabled={loadingDraft}
                        className="p-2 border border-neutral-300 hover:border-black bg-white rounded-xs text-black transition cursor-pointer"
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
                    className="w-full py-2.5 px-4 bg-black hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider rounded-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loadingDraft ? 'Generating Draft...' : 'Generate AI Response Draft'}</span>
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
