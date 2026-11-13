'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Paperclip, AlertCircle, CheckCircle2 } from 'lucide-react';
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
      setError('Please provide both subject and description.');
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-neutral-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden text-xs"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div>
              <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                Submit Author Inquiry
              </h3>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                Durable DB commit &bull; BullMQ async auto-triage.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-neutral-200 hover:border-black text-neutral-400 hover:text-black flex items-center justify-center transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-neutral-900 font-mono text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-black" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-neutral-800 mb-1.5">
                Associated Book Edition
              </label>
              <select
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 cursor-pointer bg-neutral-50/50 focus:outline-hidden focus:border-black focus:bg-white transition"
              >
                <option value="">General Account Inquiry (No Specific Book)</option>
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} [{b.bookId}] &bull; {b.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1.5">
                Inquiry Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Query regarding Q3 royalty distribution calculations"
                className="w-full border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-black bg-neutral-50/50 focus:bg-white transition"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1.5">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe your question or issue in detail. If reporting print defects, ISBN discrepancies, or royalty questions, include specific dates or quantities."
                className="w-full border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-black leading-relaxed bg-neutral-50/50 focus:bg-white transition"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1.5">
                Attachment (Optional)
              </label>
              <div className="flex items-center gap-3 font-mono">
                <label className="px-3.5 py-2 border border-neutral-200 hover:border-black rounded-xl text-xs text-neutral-900 cursor-pointer transition bg-white shadow-2xs flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{attachmentName ? 'Replace File' : 'Choose File'}</span>
                  <input
                    type="file"
                    onChange={handleSimulateFileSelect}
                    className="hidden"
                  />
                </label>
                {attachmentName ? (
                  <span className="text-black font-semibold truncate max-w-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                    {attachmentName}
                  </span>
                ) : (
                  <span className="text-[11px] text-neutral-400">PDF, JPG, or PNG</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between font-mono">
              <button
                type="button"
                onClick={onClose}
                className="text-neutral-400 hover:text-black uppercase text-[11px] cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-black text-white hover:bg-neutral-800 text-xs font-mono uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Dispatch Inquiry'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
