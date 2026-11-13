'use client';

import React, { useState } from 'react';
import { X, Send, Paperclip, AlertCircle, Check } from 'lucide-react';
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
      setError('Please provide both an inquiry subject and a detailed description.');
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
      setError(err.message || 'Failed to submit inquiry');
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
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-xs border border-neutral-300 shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-base font-bold text-black tracking-tight">
              Submit Author Inquiry
            </h3>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              Direct dispatch to the BookLeaf operations queue.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 border border-neutral-200 hover:border-black rounded-xs text-neutral-500 hover:text-black flex items-center justify-center transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          {error && (
            <div className="p-3 rounded-xs border border-black bg-neutral-100 text-black text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-black" />
              <span>{error}</span>
            </div>
          )}

          {/* Book Edition Selector */}
          <div>
            <label className="block text-xs font-semibold text-black mb-1">
              Associated Edition
            </label>
            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-xs text-xs text-black focus:outline-hidden focus:border-black cursor-pointer font-sans"
            >
              <option value="">General Account Inquiry (No Specific Book)</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} [{b.bookId}] &bull; {b.status} &bull; ISBN: {b.isbn || 'Pending'}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-xs font-semibold text-black mb-1">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Query regarding Q3 royalty distribution calculation"
              className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-xs text-xs text-black placeholder-neutral-400 focus:outline-hidden focus:border-black font-sans"
              required
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-semibold text-black mb-1">
              Description *
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide full details. If reporting printing defects or metadata issues, cite dates, quantities, or order numbers."
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xs text-xs text-black placeholder-neutral-400 focus:outline-hidden focus:border-black font-sans leading-relaxed"
              required
            />
          </div>

          {/* Optional Attachment */}
          <div>
            <label className="block text-xs font-semibold text-black mb-1">
              Supporting Documentation (Optional)
            </label>
            <div className="flex items-center gap-3 font-mono">
              <label className="px-3 py-1.5 border border-neutral-300 hover:border-black rounded-xs text-xs text-black transition flex items-center gap-1.5 cursor-pointer bg-white">
                <Paperclip className="w-3.5 h-3.5" />
                <span>{attachmentName ? 'Replace File' : 'Attach File'}</span>
                <input
                  type="file"
                  onChange={handleSimulateFileSelect}
                  className="hidden"
                />
              </label>

              {attachmentName ? (
                <span className="text-xs text-black font-semibold truncate max-w-xs flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {attachmentName}
                </span>
              ) : (
                <span className="text-[10px] text-neutral-400">PDF, JPG, or PNG</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between font-mono">
            <span className="text-[10px] text-neutral-400">
              Durable ingestion &bull; BullMQ triage
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-neutral-500 hover:text-black uppercase cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider rounded-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Dispatch Inquiry'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
