'use client';

import React, { useEffect, useState } from 'react';
import { X, BookOpen, Clock, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-xs border border-neutral-300 shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-base font-bold text-black tracking-tight">
              Publishing Policy Codex
            </h3>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              Authoritative operating rules, royalty calculations, and resolution SLAs.
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

        {/* Content Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
          {/* Chapter Navigation Sidebar (4 cols) */}
          <div className="md:col-span-4 p-4 space-y-1.5 bg-neutral-50 font-mono text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 px-2 block">
              Policy Chapters
            </span>
            {data?.sections?.map((s) => (
              <button
                key={s.category}
                onClick={() => setActiveCategory(s.category)}
                className={`w-full text-left px-3 py-2 rounded-xs text-xs transition cursor-pointer flex items-center justify-between border ${
                  activeCategory === s.category
                    ? 'bg-black text-white border-black font-semibold'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                }`}
              >
                <span className="truncate">{s.title}</span>
                {activeCategory === s.category && <Check className="w-3 h-3 text-white" />}
              </button>
            ))}
          </div>

          {/* Policy Detail View (8 cols) */}
          <div className="md:col-span-8 p-6 space-y-5 overflow-y-auto bg-white text-xs font-sans">
            {activeSection ? (
              <div className="space-y-5">
                <div className="border-b border-neutral-200 pb-3">
                  <h4 className="text-lg font-bold text-black tracking-tight">
                    {activeSection.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-2 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded-xs border border-neutral-300 text-neutral-800 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Resolution SLA: {activeSection.resolutionTimeline}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-xs bg-black text-white text-[10px] uppercase">
                      Standard
                    </span>
                  </div>
                </div>

                {/* Policy Clauses Body */}
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                    Operating Policy
                  </span>
                  <div className="p-4 rounded-xs bg-neutral-50 border border-neutral-200 leading-relaxed whitespace-pre-wrap text-neutral-800 text-xs">
                    {activeSection.policy.trim()}
                  </div>
                </div>

                {/* Reference Resolution Case */}
                <div className="border-t border-neutral-200 pt-4 space-y-2 font-mono">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                    Reference Calibration Case
                  </span>
                  <div className="p-3.5 rounded-xs border border-neutral-300 space-y-2 bg-white text-xs">
                    <p className="italic text-black font-sans">
                      &ldquo;{activeSection.sampleQuery}&rdquo;
                    </p>
                    <div className="pt-2 border-t border-neutral-100 text-neutral-600 font-sans text-xs leading-relaxed">
                      <strong className="text-black font-mono text-[11px] block mb-0.5">
                        Tone &amp; Resolution:
                      </strong>
                      {activeSection.sampleResolution}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-neutral-400 py-12 text-center font-mono">
                Loading policy details...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
