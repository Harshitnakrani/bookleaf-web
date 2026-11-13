'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-2xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white border border-neutral-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-black">Publishing Policy Codex</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-black transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
          {/* Chapter List (4 cols) */}
          <div className="md:col-span-4 p-4 space-y-1 font-mono text-xs">
            <div className="text-[10px] uppercase text-neutral-400 px-2 pb-1">Chapters</div>
            {data?.sections?.map((s) => (
              <button
                key={s.category}
                onClick={() => setActiveCategory(s.category)}
                className={`w-full text-left px-2.5 py-1.5 transition cursor-pointer block ${
                  activeCategory === s.category
                    ? 'text-black font-bold underline underline-offset-4'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* Policy Detail View (8 cols) */}
          <div className="md:col-span-8 p-6 space-y-4 overflow-y-auto text-xs">
            {activeSection ? (
              <div className="space-y-4">
                <div className="border-b border-neutral-100 pb-2">
                  <h4 className="text-base font-bold text-black">{activeSection.title}</h4>
                  <div className="font-mono text-[11px] text-neutral-400 mt-0.5">
                    Resolution SLA: {activeSection.resolutionTimeline}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-mono text-[10px] uppercase text-neutral-400">Policy Terms</div>
                  <p className="whitespace-pre-wrap leading-relaxed text-neutral-800">
                    {activeSection.policy.trim()}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 space-y-1 font-mono">
                  <div className="text-[10px] uppercase text-neutral-400">Reference Case</div>
                  <p className="italic text-neutral-700 font-sans">&ldquo;{activeSection.sampleQuery}&rdquo;</p>
                  <p className="text-neutral-500 font-sans text-[11px]">
                    <span className="font-mono font-semibold text-black">Action: </span>
                    {activeSection.sampleResolution}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-neutral-400 font-mono py-8">Loading policy codex...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
