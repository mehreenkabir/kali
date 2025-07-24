// FILE: src/components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { WithTheme } from '@/types/common';
import { NAVIGATION_LINKS } from '@/utils/constants';
import { isActivePage, generateKey } from '@/utils/helpers';
import { useSession } from 'next-auth/react';

// Theme-based styling configuration
const THEME_STYLES = {
  light: {
    textColor: 'text-slate-700',
    hoverTextColor: 'hover:text-amber-700',
    activeTextColor: 'text-amber-800',
    menuBackground: 'bg-white/90 backdrop-blur-md'
  },
  dark: {
    textColor: 'text-atelier-light',
    hoverTextColor: 'hover:text-atelier-citrus',
    activeTextColor: 'text-atelier-citrus',
    menuBackground: 'bg-atelier-dark/90 backdrop-blur-md'
  }
} as const;

const Header: React.FC<WithTheme> = ({ theme = 'light' }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const styles = THEME_STYLES[theme];

  // Filter navigation links based on authentication status
  const getNavigationLinks = () => {
    const baseLinks = NAVIGATION_LINKS.filter(link => link.name !== 'PORTAL');
    const authLinks = session 
      ? [{ name: 'PORTAL', href: '/portal' }]
      : [
          { name: 'SIGN IN', href: '/auth/signin' },
          { name: 'SUBSCRIBE', href: '/subscribe' }
        ];
    return [...baseLinks, ...authLinks];
  };

  const handleMenuToggle = (): void => {
    setIsMenuOpen(previousState => !previousState);
  };

  const handleMenuClose = (): void => {
    setIsMenuOpen(false);
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50 p-4 xs:p-5 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          href="/" 
          className={`font-serif text-lg xs:text-xl sm:text-2xl tracking-[0.2em] xs:tracking-[0.25em] sm:tracking-[0.3em] font-light ${styles.textColor} ${styles.hoverTextColor} transition-colors duration-300`}
        >
          Kalianïa
        </Link>
        
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {getNavigationLinks().map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`font-sans tracking-widest uppercase text-xs xl:text-sm transition-colors duration-300 ${
                isActivePage(pathname, link.href) 
                  ? `${styles.activeTextColor} font-bold` 
                  : `${styles.textColor} opacity-80 hover:opacity-100 ${styles.hoverTextColor}`
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="lg:hidden">
          <button 
            onClick={handleMenuToggle} 
            className={`${styles.textColor} focus:outline-none`} 
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} 
              />
            </svg>
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className={`lg:hidden absolute top-full left-0 w-full mt-2 mx-4 xs:mx-5 sm:mx-6 p-4 xs:p-5 sm:p-6 rounded-lg shadow-lg ${styles.menuBackground}`}>
          <nav className="flex flex-col items-center space-y-4 xs:space-y-5 sm:space-y-6">
            {getNavigationLinks().map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={handleMenuClose} 
                className={`font-sans tracking-widest uppercase text-base xs:text-lg transition-colors duration-300 ${
                  isActivePage(pathname, link.href) 
                    ? `${styles.activeTextColor} font-bold` 
                    : `${styles.textColor} ${styles.hoverTextColor}`
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
export default Header;