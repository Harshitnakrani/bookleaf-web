'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, Lock, RefreshCw, CornerDownRight } from 'lucide-react';
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
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-2xs flex items-center justify-center p-4">
        <div className="bg-white p-6 border border-neutral-200 font-mono text-xs text-neutral-500 flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Loading ticket...</span>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-white border border-neutral-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden my-auto text-xs">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="font-bold text-black">{ticket.ticketNumber}</span>
              <span className="text-neutral-300">&bull;</span>
              <span className="uppercase text-neutral-500 font-medium">{ticket.status}</span>
              <span className="text-neutral-300">&bull;</span>
              <span className="uppercase text-neutral-500">{ticket.priority} priority</span>
            </div>
            <h2 className="text-sm font-bold text-black">{ticket.subject}</h2>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black transition p-1 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
          {/* Main Column: Messages (7 cols) */}
          <div className="md:col-span-7 flex flex-col h-full">
            <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[50vh]">
              {/* Initial Query */}
              <div className="border border-neutral-100 p-4 space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-neutral-400 border-b border-neutral-50 pb-1.5">
                  <span className="text-black font-semibold">{ticket.author?.name} (Author)</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed text-neutral-800">{ticket.description}</p>
                {ticket.attachmentName && (
                  <div className="text-[11px] font-mono text-neutral-400 pt-1">
                    Attachment: {ticket.attachmentName}
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
                    className={`p-3.5 space-y-1.5 ${
                      isInternal
                        ? 'border border-dashed border-neutral-300 bg-neutral-50'
                        : isMsgAdmin
                        ? 'border border-neutral-100 bg-neutral-50 ml-4'
                        : 'border border-neutral-100'
                    }`}
                  >
                    <div className="flex justify-between text-[11px] font-mono text-neutral-400 border-b border-neutral-100/60 pb-1">
                      <span className="text-black font-semibold">
                        {isInternal ? '[INTERNAL NOTE]' : msg.sender?.name}
                      </span>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed text-neutral-800">{msg.content}</p>
                  </div>
                );
              })}
            </div>

            {/* Composer */}
            <div className="p-4 border-t border-neutral-100 bg-white space-y-2">
              <form onSubmit={handleSendMessage} className="space-y-2 font-mono">
                {isAdmin && (
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1 cursor-pointer text-black">
                        <input
                          type="radio"
                          name="msgType"
                          checked={!isInternalNote}
                          onChange={() => setIsInternalNote(false)}
                          className="accent-black"
                        />
                        <span>Author Reply</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer text-neutral-600">
                        <input
                          type="radio"
                          name="msgType"
                          checked={isInternalNote}
                          onChange={() => setIsInternalNote(true)}
                          className="accent-black"
                        />
                        <span>Internal Note</span>
                      </label>
                    </div>

                    {aiDraft && (
                      <button
                        type="button"
                        onClick={handleInsertDraftToEditor}
                        className="text-black hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <CornerDownRight className="w-3 h-3" />
                        <span>Insert Draft</span>
                      </button>
                    )}
                  </div>
                )}

                <textarea
                  rows={3}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={isInternalNote ? 'Confidential ops note...' : 'Type reply to author...'}
                  className="w-full border border-neutral-200 p-2 text-xs text-black placeholder-neutral-400 focus:outline-hidden focus:border-black font-sans"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sendingMessage || !replyContent.trim()}
                    className="px-3.5 py-1.5 bg-black text-white hover:bg-neutral-800 text-xs font-mono uppercase transition cursor-pointer disabled:opacity-50"
                  >
                    {sendingMessage ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Context & AI Draft (5 cols) */}
          <div className="md:col-span-5 p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            {/* Author & Edition Context */}
            <div className="space-y-2 font-mono text-[11px]">
              <div className="text-neutral-400 uppercase text-[10px]">Context</div>
              <div className="space-y-1 text-neutral-700">
                <div><span className="text-neutral-400">Author:</span> {ticket.author?.name} ({ticket.author?.authorId})</div>
                <div><span className="text-neutral-400">Email:</span> {ticket.author?.email}</div>
                <div><span className="text-neutral-400">Bank:</span> {ticket.author?.isBankDetailsLinked ? 'Verified' : 'Pending'}</div>
                {ticket.book && (
                  <>
                    <div><span className="text-neutral-400">Title:</span> {ticket.book.title}</div>
                    <div><span className="text-neutral-400">ISBN:</span> {ticket.book.isbn || 'Pending'}</div>
                    <div><span className="text-neutral-400">Units Sold:</span> {ticket.book.totalCopiesSold || 0}</div>
                    <div><span className="text-neutral-400">Pending Royalty:</span> ₹{ticket.book.royaltyPending || 0}</div>
                  </>
                )}
              </div>
            </div>

            {/* Overrides */}
            {isAdmin && (
              <div className="space-y-3 font-mono text-[11px] pt-4 border-t border-neutral-100">
                <div className="text-neutral-400 uppercase text-[10px]">Workflow Controls</div>
                <div className="space-y-2">
                  <div>
                    <label className="text-neutral-400 block mb-0.5">Status:</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      disabled={updatingStatus}
                      className="w-full border border-neutral-200 p-1 text-xs text-black cursor-pointer bg-white"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-neutral-400 block mb-0.5">Category:</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border border-neutral-200 p-1 text-xs text-black bg-white"
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
                      <label className="text-neutral-400 block mb-0.5">Priority:</label>
                      <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        className="w-full border border-neutral-200 p-1 text-xs text-black bg-white"
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
                    className="w-full py-1 text-xs border border-neutral-200 hover:border-black text-black cursor-pointer transition"
                  >
                    {savingOverrides ? 'Saving...' : 'Apply Overrides'}
                  </button>
                </div>
              </div>
            )}

            {/* AI Studio */}
            {isAdmin && (
              <div className="space-y-2 font-mono text-[11px] pt-4 border-t border-neutral-100">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 uppercase text-[10px]">AI Draft</span>
                  {isDraftCached && <span className="text-[10px] text-black">[Valkey Hit]</span>}
                </div>

                {aiDraft ? (
                  <div className="space-y-2">
                    <div className="border border-neutral-200 p-2.5 text-neutral-800 max-h-40 overflow-y-auto whitespace-pre-wrap font-sans text-xs leading-relaxed">
                      {aiDraft}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleInsertDraftToEditor}
                        className="flex-1 py-1 bg-black text-white hover:bg-neutral-800 text-xs cursor-pointer"
                      >
                        Insert Draft
                      </button>
                      <button
                        type="button"
                        onClick={handleFetchAiDraft}
                        disabled={loadingDraft}
                        className="px-2 py-1 border border-neutral-200 hover:border-black text-black cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${loadingDraft ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleFetchAiDraft}
                    disabled={loadingDraft}
                    className="w-full py-1.5 border border-neutral-200 hover:border-black text-black text-xs cursor-pointer transition"
                  >
                    {loadingDraft ? 'Generating...' : 'Generate AI Draft'}
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
