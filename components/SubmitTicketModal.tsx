'use client';

import React, { useState } from 'react';
import { X, Send, Paperclip, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../lib/api';

interface Props {
  books: any[];
  onClose: () => void;
  onTicketCreated: () => void;
}

export const SubmitTicketModal: React.FC<Props> = ({
  books,
  onClose,
  onTicketCreated,
}) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [bookId, setBookId] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError('Please fill in both subject and description.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await api.createTicket({
        subject: subject.trim(),
        description: description.trim(),
        bookId: bookId || undefined,
        attachmentName: attachmentName || undefined,
      });

      onTicketCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSimulateFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-base font-serif font-bold text-slate-900">
              Submit Support Query
            </h3>
            <p className="text-xs text-slate-500">
              Your ticket will be auto-classified by AI and routed immediately.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Book Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Book / Subject Area
            </label>
            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500 cursor-pointer"
            >
              <option value="">General / Account Level Inquiry</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.bookId}) &mdash; {b.status}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject Line *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Query regarding Q3 royalty payout calculation"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500"
              required
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe your question or issue in detail. If reporting print defects, ISBN mismatch, or royalty questions, include specific dates or quantities."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-indigo-500"
              required
            />
          </div>

          {/* Optional Attachment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Attachment (Optional &mdash; e.g. photo of misprints or sales screenshots)
            </label>
            <div className="flex items-center gap-3">
              <label className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition flex items-center gap-1.5 cursor-pointer">
                <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                <span>{attachmentName ? 'Change File' : 'Choose File'}</span>
                <input
                  type="file"
                  onChange={handleSimulateFileSelect}
                  className="hidden"
                />
              </label>

              {attachmentName && (
                <span className="text-xs text-slate-600 font-medium truncate max-w-xs">
                  {attachmentName}
                </span>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Auto-triage enqueued via BullMQ</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-[#1a365d] hover:bg-[#122844] text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting Ticket...' : 'Submit Query'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
