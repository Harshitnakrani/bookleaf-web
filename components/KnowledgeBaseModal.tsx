'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-neutral-200 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden text-xs"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                  BookLeaf Publishing Policy Codex
                </h3>
                <p className="text-xs text-neutral-500 font-mono">
                  Official operating procedures, resolution SLAs, and royalty terms.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-neutral-200 hover:border-black text-neutral-400 hover:text-black flex items-center justify-center transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Grid Layout */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
            {/* Chapters Sidebar */}
            <div className="md:col-span-4 p-4 space-y-1.5 bg-neutral-50/60 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-neutral-400 px-2 block tracking-wider">
                Policy Slices
              </span>
              {data?.sections?.map((s) => (
                <button
                  key={s.category}
                  onClick={() => setActiveCategory(s.category)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-between border ${
                    activeCategory === s.category
                      ? 'bg-black text-white border-black font-semibold shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                  }`}
                >
                  <span className="truncate">{s.title}</span>
                </button>
              ))}
            </div>

            {/* Policy Detail Pane */}
            <div className="md:col-span-8 p-6 space-y-5 overflow-y-auto text-xs bg-white">
              {activeSection ? (
                <div className="space-y-5">
                  <div className="border-b border-neutral-100 pb-3">
                    <h4 className="text-lg font-bold text-neutral-900 tracking-tight">
                      {activeSection.title}
                    </h4>
                    <div className="mt-2 flex items-center gap-2 font-mono text-[11px]">
                      <span className="px-2.5 py-0.5 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-800 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-neutral-600" />
                        <span>Resolution SLA: {activeSection.resolutionTimeline}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-mono uppercase">
                        Verified Policy
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                      Standard Operating Policy
                    </span>
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 leading-relaxed whitespace-pre-wrap text-neutral-800 font-sans text-xs">
                      {activeSection.policy.trim()}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 space-y-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                      Reference Resolution Calibration
                    </span>
                    <div className="p-4 rounded-2xl border border-neutral-200 space-y-2 bg-white shadow-2xs">
                      <p className="italic text-neutral-900 font-sans">
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
                <div className="text-neutral-400 font-mono py-12 text-center">
                  Loading policy documentation...
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
