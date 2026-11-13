'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const BentoGrid: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div
      className={cn(
        'grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem: React.FC<{
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
}> = ({ className, title, description, header, icon, badge }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'row-span-1 rounded-2xl group/bento hover:shadow-xl transition duration-200 shadow-input p-6 bg-white border border-neutral-200 justify-between flex flex-col space-y-4 hover:border-neutral-400 relative overflow-hidden',
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-1 transition duration-200">
        <div className="flex items-center justify-between mb-2">
          {icon}
          {badge && (
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800">
              {badge}
            </span>
          )}
        </div>
        <div className="font-sans font-bold text-neutral-900 mb-1 tracking-tight text-base">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  );
};
