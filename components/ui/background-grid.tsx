'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export const BackgroundGrid: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-white',
        className
      )}
    >
      {/* Aceternity style grid background */}
      <div
        className="pointer-events-none absolute inset-0 [background-size:24px_24px] [background-image:linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] opacity-60"
      />
      {/* Radial gradient mask for subtle fade out towards edges */}
      <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]" />

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const BackgroundDots: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-white',
        className
      )}
    >
      {/* Dot matrix */}
      <div
        className="pointer-events-none absolute inset-0 [background-size:20px_20px] [background-image:radial-gradient(#d1d5db_1px,transparent_1px)] opacity-70"
      />
      {/* Radial gradient mask */}
      <div className="pointer-events-none absolute inset-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative z-10">{children}</div>
    </div>
  );
};
