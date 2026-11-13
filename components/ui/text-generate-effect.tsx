'use client';

import React, { useEffect } from 'react';
import { motion, stagger, useAnimate } from 'framer-motion';
import { cn } from '../../lib/utils';

export const TextGenerateEffect: React.FC<{
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}> = ({ words, className, filter = true, duration = 0.5 }) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(' ');

  useEffect(() => {
    animate(
      'span',
      {
        opacity: 1,
        filter: filter ? 'blur(0px)' : 'none',
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.12),
      }
    );
  }, [scope.current]);

  return (
    <div className={cn('font-bold', className)}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="opacity-0 inline-block mr-2 text-black"
              style={{
                filter: filter ? 'blur(8px)' : 'none',
              }}
            >
              {word}
            </motion.span>
          );
        })}
      </motion.div>
    </div>
  );
};
