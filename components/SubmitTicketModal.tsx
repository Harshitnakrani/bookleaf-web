'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
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
      setError('Please provide subject and description.');
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
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-2xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-neutral-200 w-full max-w-lg overflow-hidden text-xs">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-black">Submit Author Inquiry</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2 border border-black text-black font-mono text-[11px]">
              {error}
            </div>
          )}

          <div>
            <label className="block font-mono text-[11px] text-neutral-500 mb-1">
              Associated Title:
            </label>
            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="w-full border border-neutral-200 p-2 text-xs text-black cursor-pointer bg-white"
            >
              <option value="">General Account Inquiry</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} [{b.bookId}] &bull; {b.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-[11px] text-neutral-500 mb-1">
              Subject:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Query regarding Q3 royalty distribution"
              className="w-full border border-neutral-200 p-2 text-xs text-black placeholder-neutral-400 focus:outline-hidden focus:border-black"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-neutral-500 mb-1">
              Description:
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details regarding your question, quantities, or dates..."
              className="w-full border border-neutral-200 p-2 text-xs text-black placeholder-neutral-400 focus:outline-hidden focus:border-black leading-relaxed"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-neutral-500 mb-1">
              Attachment (Optional):
            </label>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <label className="px-3 py-1.5 border border-neutral-200 hover:border-black text-black cursor-pointer transition">
                <span>{attachmentName ? 'Replace File' : 'Choose File'}</span>
                <input
                  type="file"
                  onChange={handleSimulateFileSelect}
                  className="hidden"
                />
              </label>
              {attachmentName && (
                <span className="text-black truncate max-w-xs">{attachmentName}</span>
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
              className="px-4 py-2 bg-black text-white hover:bg-neutral-800 text-xs font-mono uppercase transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
