'use client';

import React, { useState } from 'react';
import { X, Send, Paperclip, BookOpen, AlertCircle, Sparkles, Feather, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-[#1b2a4a]/45 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#faf9f5] rounded-2xl border border-[#e5dfd3] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e5dfd3] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b2a4a]/5 border border-[#1b2a4a]/10 flex items-center justify-center text-[#1b2a4a]">
              <Feather className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1b2a4a]">
                Submit Author Inquiry
              </h3>
              <p className="text-xs text-[#737373]">
                Direct correspondence to the BookLeaf Publishing operations team.
              </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-[#8b263e]/10 border border-[#8b263e]/30 text-[#8b263e] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Book / Edition Selector */}
          <div>
            <label className="block text-xs font-serif font-semibold text-[#1b2a4a] mb-1.5">
              Associated Book Edition
            </label>
            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#e5dfd3] rounded-xl text-xs text-[#2b2b2b] focus:outline-hidden focus:border-[#1b2a4a] cursor-pointer"
            >
              <option value="">General Account Inquiry (No Specific Book)</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.bookId}) &mdash; {b.status} &bull; ISBN: {b.isbn || 'Pending'}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-xs font-serif font-semibold text-[#1b2a4a] mb-1.5">
              Inquiry Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Query regarding Q3 royalty distribution threshold"
              className="w-full p-2.5 bg-white border border-[#e5dfd3] rounded-xl text-xs text-[#2b2b2b] placeholder-[#737373] focus:outline-hidden focus:border-[#1b2a4a]"
              required
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-serif font-semibold text-[#1b2a4a] mb-1.5">
              Detailed Inquiry *
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide full particulars. If reporting printing flaws or missing ISBN metadata, cite specific batch dates, retailers, or quantities."
              className="w-full p-3 bg-white border border-[#e5dfd3] rounded-xl text-xs text-[#2b2b2b] placeholder-[#737373] focus:outline-hidden focus:border-[#1b2a4a]"
              required
            />
          </div>

          {/* Optional Attachment */}
          <div>
            <label className="block text-xs font-serif font-semibold text-[#1b2a4a] mb-1.5">
              Supporting Documentation (Photographs, Invoices, Proofs)
            </label>
            <div className="flex items-center gap-3">
              <label className="px-3.5 py-2 rounded-xl border border-[#e5dfd3] bg-white hover:bg-[#faf9f5] text-xs font-medium text-[#2b2b2b] transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
                <Paperclip className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{attachmentName ? 'Replace File' : 'Attach File'}</span>
                <input
                  type="file"
                  onChange={handleSimulateFileSelect}
                  className="hidden"
                />
              </label>

              {attachmentName ? (
                <span className="text-xs text-[#1e3a2b] font-mono font-medium truncate max-w-xs flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {attachmentName}
                </span>
              ) : (
                <span className="text-[11px] text-[#737373]">Optional (.pdf, .jpg, .png)</span>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-[#e5dfd3] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-[#737373]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Durable ingestion &bull; BullMQ async triage</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#737373] hover:text-[#1b2a4a] hover:bg-white transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-[#1b2a4a] hover:bg-[#122844] text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Dispatching...' : 'Dispatch Inquiry'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
