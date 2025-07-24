// FILE: src/components/PortalPanel.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { PortalPanelProps } from '@/types/common';

const PortalPanel: React.FC<PortalPanelProps> = ({ 
  href, 
  title, 
  subtitle, 
  imageUrl 
}) => {
  return (
    <Link 
      href={href} 
      className="relative flex-1 group w-full h-full min-h-[50vh] xs:min-h-[55vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-screen overflow-hidden cursor-pointer"
      aria-label={`Navigate to ${title} - ${subtitle}`}
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl})` }}
        role="img"
        aria-label={`${title} world background`}
      />
      
      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-500" />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif tracking-[0.15em] xs:tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] font-light transition-transform duration-500 group-hover:-translate-y-2">
          {title}
        </h2>
        
        <p className="text-xs xs:text-sm sm:text-base md:text-lg font-sans tracking-wide xs:tracking-wider mt-2 xs:mt-3 sm:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-lg px-2">
          {subtitle}
        </p>
      </div>
    </Link>
  );
};

export default PortalPanel;
