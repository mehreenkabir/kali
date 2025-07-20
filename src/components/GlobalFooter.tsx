// FILE: src/components/GlobalFooter.tsx

'use client';

import React from 'react';

interface GlobalFooterProps {
  theme?: 'light' | 'dark';
}

const GlobalFooter: React.FC<GlobalFooterProps> = ({ theme = 'light' }) => {
  const brandColor = theme === 'dark' ? 'text-atelier-light/90' : 'text-slate-700/90';
  const textColor = theme === 'dark' ? 'text-atelier-gray/80' : 'text-slate-600/80';

  return (
    <footer className="relative bottom-0 left-0 w-full text-center py-4 xs:py-5 sm:py-6 md:py-8 px-4 z-30 mt-auto">
      <div className={`font-serif text-sm xs:text-base sm:text-lg md:text-xl tracking-[0.25em] xs:tracking-[0.3em] sm:tracking-[0.35em] md:tracking-[0.4em] font-light mb-1 xs:mb-1.5 sm:mb-2 ${brandColor}`}>
        Kalianïa
      </div>
      <div className={`font-sans text-[9px] xs:text-[10px] sm:text-xs tracking-[0.1em] xs:tracking-[0.15em] sm:tracking-[0.2em] uppercase ${textColor}`}>
        © MMXXIV | All Rights Reserved
      </div>
    </footer>
  );
};
export default GlobalFooter;