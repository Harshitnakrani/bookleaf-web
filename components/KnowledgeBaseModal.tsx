'use client';

import React, { useEffect, useState } from 'react';
import { X, HelpCircle, BookOpen, Clock, CheckCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-serif font-bold text-slate-900">
              BookLeaf Publishing Knowledge Base
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Categories Sidebar */}
          <div className="md:col-span-4 p-4 space-y-1 bg-slate-50/50">
            {data?.sections?.map((s) => (
              <button
                key={s.category}
                onClick={() => setActiveCategory(s.category)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                  activeCategory === s.category
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{s.title}</span>
              </button>
            ))}
          </div>

          {/* Policy Detail Pane */}
          <div className="md:col-span-8 p-6 space-y-5 overflow-y-auto bg-white text-xs">
            {activeSection ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-serif font-bold text-slate-900">
                    {activeSection.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-1.5 text-indigo-700 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Resolution: {activeSection.resolutionTimeline}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 leading-relaxed whitespace-pre-wrap text-slate-700">
                  {activeSection.policy.trim()}
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    Reference Calibration Case
                  </span>
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-1.5">
                    <p className="font-semibold text-amber-950">
                      Query: &ldquo;{activeSection.sampleQuery}&rdquo;
                    </p>
                    <p className="text-amber-900 leading-relaxed">
                      Tone &amp; Action: {activeSection.sampleResolution}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-400">Loading policy details...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
