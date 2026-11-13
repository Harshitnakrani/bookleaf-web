'use client';

import React, { useEffect, useState } from 'react';
import { X, BookOpen, Clock, Bookmark, Feather, ShieldCheck, HelpCircle } from 'lucide-react';
import { api } from '../lib/api';

interface Props {
  onClose: () => void;
}

export const KnowledgeBaseModal: React.FC<Props> = ({ onClose }) => {
  const [data, setData] = useState<{ companyOverview: string; sections: any[] } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ROYALTY_AND_PAYMENTS');

  useEffect(() => {
    api.getKnowledgeBase().then(setData).catch(console.error);
  }, []);

  const activeSection = data?.sections?.find((s) => s.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 bg-[#1b2a4a]/45 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#faf9f5] rounded-2xl border border-[#e5dfd3] shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5dfd3] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1b2a4a]/5 border border-[#1b2a4a]/10 flex items-center justify-center text-[#1b2a4a]">
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1b2a4a]">
                BookLeaf Publishing Codex &amp; Policy Ledger
              </h3>
              <p className="text-xs text-[#737373]">
                Authoritative operating procedures, royalty calculations, and resolution timelines.
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

        {/* Content Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#e5dfd3]">
          {/* Policy Chapters Sidebar (4 cols) */}
          <div className="md:col-span-4 p-4 space-y-1.5 bg-[#faf9f5]">
            <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[#737373]">
              Chapters
            </div>
            {data?.sections?.map((s) => (
              <button
                key={s.category}
                onClick={() => setActiveCategory(s.category)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-between border ${
                  activeCategory === s.category
                    ? 'bg-[#1b2a4a] text-white border-[#1b2a4a] shadow-xs'
                    : 'bg-white text-[#2b2b2b] border-[#e5dfd3] hover:bg-[#faf9f5]'
                }`}
              >
                <span className="truncate">{s.title}</span>
                {activeCategory === s.category && (
                  <Bookmark className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Policy Detail View (8 cols) */}
          <div className="md:col-span-8 p-6 space-y-5 overflow-y-auto bg-white text-xs">
            {activeSection ? (
              <div className="space-y-5">
                <div className="border-b border-[#e5dfd3] pb-4">
                  <h4 className="text-lg font-serif font-bold text-[#1b2a4a]">
                    {activeSection.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1b2a4a]/5 border border-[#1b2a4a]/15 text-[#1b2a4a] font-mono text-[11px] font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Resolution SLA: {activeSection.resolutionTimeline}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1e3a2b]/10 text-[#1e3a2b] border border-[#1e3a2b]/30 text-[11px] font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Operating Policy</span>
                    </span>
                  </div>
                </div>

                {/* Policy Clauses Body */}
                <div className="space-y-2">
                  <span className="font-serif font-bold text-[#1b2a4a] text-xs uppercase tracking-wider block">
                    Operating Standard
                  </span>
                  <div className="p-4 rounded-xl bg-[#faf9f5] border border-[#e5dfd3] leading-relaxed whitespace-pre-wrap text-[#2b2b2b] font-sans text-xs">
                    {activeSection.policy.trim()}
                  </div>
                </div>

                {/* Calibration Example */}
                <div className="border-t border-[#e5dfd3] pt-4 space-y-2">
                  <span className="font-serif font-bold text-[#78350f] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Reference Resolution Calibration</span>
                  </span>
                  <div className="p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] space-y-2">
                    <p className="font-serif italic text-[#78350f] text-xs">
                      &ldquo;{activeSection.sampleQuery}&rdquo;
                    </p>
                    <div className="pt-2 border-t border-[#fde68a]/60 text-[#92400e] text-[11px] leading-relaxed">
                      <strong className="font-semibold text-[#78350f]">Editorial Action: </strong>
                      {activeSection.sampleResolution}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[#737373] py-12 text-center font-serif">
                Loading editorial policy documentation...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
