'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
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

  const handleInsertDraftToEditor = () => {
    if (aiDraft) {
      setReplyContent(aiDraft);
      setIsInternalNote(false);
    }
  };

  if (loading && !ticket) {
    return (
      <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xl font-mono text-xs text-neutral-600 flex items-center gap-3">
          <RefreshCw className="w-4 h-4 animate-spin text-black" />
          <span>Opening ticket correspondence...</span>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-neutral-200 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden my-auto text-xs"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="font-bold text-white bg-black px-2 py-0.5 rounded-md">
                  {ticket.ticketNumber}
                </span>
                <span className="text-neutral-300">&bull;</span>
                <span className="uppercase text-neutral-600 font-semibold">{ticket.status}</span>
                <span className="text-neutral-300">&bull;</span>
                <span className="uppercase text-neutral-500">{ticket.priority} PRIORITY</span>
                <span className="text-neutral-300">&bull;</span>
                <span className="text-neutral-500">{ticket.category?.replace(/_/g, ' ')}</span>
              </div>
              <h2 className="text-base font-bold text-neutral-900 truncate max-w-lg sm:max-w-xl">
                {ticket.subject}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-neutral-200 hover:border-black text-neutral-400 hover:text-black flex items-center justify-center transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Grid */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
            {/* Conversation Thread (7 cols) */}
            <div className="md:col-span-7 flex flex-col h-full bg-white">
              <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[52vh]">
                {/* Author Initial Query */}
                <div className="border border-neutral-200 rounded-2xl p-4 bg-white shadow-xs space-y-2.5">
                  <div className="flex justify-between items-center text-[11px] font-mono text-neutral-400 border-b border-neutral-100 pb-2">
                    <span className="text-neutral-900 font-semibold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-black" />
                      {ticket.author?.name} (Author)
                    </span>
                    <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>

                  <p className="whitespace-pre-wrap leading-relaxed text-neutral-800 font-sans text-xs">
                    {ticket.description}
                  </p>

                  {ticket.attachmentName && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-mono">
                      <FileText className="w-3 h-3" />
                      <span>Attachment: {ticket.attachmentName}</span>
                    </div>
                  )}
                </div>

                {/* Messages */}
                {ticket.messages?.map((msg: any) => {
                  const isMsgAdmin = msg.sender?.role === 'ADMIN';
                  const isInternal = msg.isInternalNote;

                  return (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-2xl space-y-2 text-xs shadow-xs ${
                        isInternal
                          ? 'border border-dashed border-neutral-300 bg-neutral-50 ml-4'
                          : isMsgAdmin
                          ? 'border border-neutral-200 bg-neutral-50 ml-4 sm:ml-6'
                          : 'border border-neutral-200 bg-white mr-4 sm:mr-6'
                      }`}
                    >
                      <div className="flex justify-between text-[11px] font-mono text-neutral-400 border-b border-neutral-200/50 pb-1.5">
                        <span className="text-neutral-900 font-semibold flex items-center gap-1.5">
                          {isInternal ? (
                            <span className="text-black font-bold flex items-center gap-1">
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
                        </span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed text-neutral-800 font-sans">{msg.content}</p>
                    </div>
                  );
                })}
              </div>

              {/* Reply Composer */}
              <div className="p-4 border-t border-neutral-200 bg-white space-y-2.5">
                <form onSubmit={handleSendMessage} className="space-y-2.5">
                  {isAdmin && (
                    <div className="flex items-center justify-between font-mono text-xs">
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1.5 cursor-pointer text-black font-medium">
                          <input
                            type="radio"
                            name="msgType"
                            checked={!isInternalNote}
                            onChange={() => setIsInternalNote(false)}
                            className="accent-black"
                          />
                          <span>Public Author Reply</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-neutral-600">
                          <input
                            type="radio"
                            name="msgType"
                            checked={isInternalNote}
                            onChange={() => setIsInternalNote(true)}
                            className="accent-black"
                          />
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Internal Ops Note
                          </span>
                        </label>
                      </div>

                      {aiDraft && (
                        <button
                          type="button"
                          onClick={handleInsertDraftToEditor}
                          className="text-black hover:underline cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
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
                    placeholder={isInternalNote ? 'Write a confidential internal ops note...' : 'Compose reply to author...'}
                    className="w-full border border-neutral-200 rounded-xl p-3 text-xs text-black placeholder-neutral-400 focus:outline-hidden focus:border-black font-sans bg-neutral-50/50"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-400">
                      Dispatched instantly via real-time WebSocket.
                    </span>

                    <button
                      type="submit"
                      disabled={sendingMessage || !replyContent.trim()}
                      className="px-4 py-2 bg-black text-white hover:bg-neutral-800 text-xs font-mono uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sendingMessage ? 'Dispatching...' : 'Dispatch Reply'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Context & AI Draft Studio (5 cols) */}
            <div className="md:col-span-5 p-6 space-y-6 overflow-y-auto max-h-[75vh] bg-neutral-50/30">
              {/* Context Dossier */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2 text-xs font-mono shadow-xs">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Author &amp; Edition Context
                </span>
                <div className="space-y-1.5 text-neutral-700">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Author:</span>
                    <span className="font-bold text-black font-sans">{ticket.author?.name} ({ticket.author?.authorId})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Email:</span>
                    <span className="text-black truncate max-w-[170px]">{ticket.author?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Bank Status:</span>
                    <span className="font-bold text-black">
                      {ticket.author?.isBankDetailsLinked ? 'Verified (Direct)' : 'Pending Link'}
                    </span>
                  </div>
                  {ticket.book && (
                    <div className="pt-2 border-t border-neutral-100 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Title:</span>
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

              {/* Workflow Status & Override Controls */}
              {isAdmin && (
                <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-3 font-mono text-xs shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                    Workflow &amp; Triage Overrides
                  </span>

                  <div>
                    <label className="text-neutral-400 block text-[10px] mb-1">Status:</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      disabled={updatingStatus}
                      className="w-full border border-neutral-200 rounded-xl p-2 text-xs text-black cursor-pointer bg-neutral-50"
                    >
                      <option value="OPEN">Open (Action Needed)</option>
                      <option value="IN_PROGRESS">In Progress (Reviewing)</option>
                      <option value="RESOLVED">Resolved (Addressed)</option>
                      <option value="CLOSED">Closed (Archived)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-neutral-400 block text-[10px] mb-1">Category:</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl p-1.5 text-xs text-black bg-neutral-50"
                      >
                        <option value="ROYALTY_AND_PAYMENTS">Royalty</option>
                        <option value="ISBN_AND_METADATA_ISSUES">ISBN</option>
                        <option value="PRINTING_AND_QUALITY">Printing</option>
                        <option value="DISTRIBUTION_AND_AVAILABILITY">Distribution</option>
                        <option value="BOOK_STATUS_AND_PRODUCTION_UPDATES">Production</option>
                        <option value="GENERAL_INQUIRY">General</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-neutral-400 block text-[10px] mb-1">Priority:</label>
                      <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl p-1.5 text-xs text-black bg-neutral-50"
                      >
                        <option value="CRITICAL">Critical</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleOverride}
                    disabled={savingOverrides}
                    className="w-full py-2 text-xs border border-neutral-200 hover:border-black rounded-xl text-black cursor-pointer transition font-mono uppercase tracking-wider"
                  >
                    {savingOverrides ? 'Applying...' : 'Apply Overrides'}
                  </button>
                </div>
              )}

              {/* AI Draft Response Studio */}
              {isAdmin && (
                <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-3 font-mono text-xs shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-black" />
                      <span>AI Response Studio</span>
                    </span>

                    {isDraftCached ? (
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[9px] font-mono uppercase font-semibold">
                        Valkey Cache Hit
                      </span>
                    ) : draftModel ? (
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {draftModel}
                      </span>
                    ) : null}
                  </div>

                  {aiDraft ? (
                    <div className="space-y-2.5">
                      <div className="border border-neutral-200 rounded-xl p-3 text-neutral-800 max-h-48 overflow-y-auto whitespace-pre-wrap font-sans text-xs leading-relaxed bg-neutral-50/50">
                        {aiDraft}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleInsertDraftToEditor}
                          className="flex-1 py-2 bg-black text-white hover:bg-neutral-800 text-xs rounded-xl font-mono uppercase tracking-wider cursor-pointer transition"
                        >
                          Insert Draft
                        </button>
                        <button
                          type="button"
                          onClick={handleFetchAiDraft}
                          disabled={loadingDraft}
                          className="p-2 border border-neutral-200 hover:border-black rounded-xl text-black cursor-pointer"
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
                      className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-mono uppercase tracking-wider cursor-pointer transition flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{loadingDraft ? 'Generating Draft via AI...' : 'Generate AI Response Draft'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
