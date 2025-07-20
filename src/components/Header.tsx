// FILE: src/components/Header.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface HeaderProps {
  theme?: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({ theme = 'light' }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const textColor = theme === 'dark' ? 'text-atelier-light' : 'text-slate-700';
  const hoverTextColor = theme === 'dark' ? 'hover:text-atelier-citrus' : 'hover:text-amber-700';
  const activeTextColor = theme === 'dark' ? 'text-atelier-citrus' : 'text-amber-800';

  const navLinks = [ { name: 'ART', href: '/art' }, { name: 'MATH', href: '/math' }, { name: 'YOGA', href: '/yoga' }, ];

  return (
    <header className="absolute top-0 left-0 w-full z-50 p-4 xs:p-5 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className={`font-serif text-lg xs:text-xl sm:text-2xl tracking-[0.2em] xs:tracking-[0.25em] sm:tracking-[0.3em] font-light ${textColor} ${hoverTextColor} transition-colors duration-300`}>
          Kalianïa
        </Link>
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className={`font-sans tracking-widest uppercase text-xs xl:text-sm transition-colors duration-300 ${pathname === link.href ? `${activeTextColor} font-bold` : `${textColor} opacity-80 hover:opacity-100 ${hoverTextColor}`}`}>
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`${textColor} focus:outline-none`} aria-label="Open menu">
            <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className={`lg:hidden absolute top-full left-0 w-full mt-2 mx-4 xs:mx-5 sm:mx-6 p-4 xs:p-5 sm:p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-atelier-dark/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'}`}>
          <nav className="flex flex-col items-center space-y-4 xs:space-y-5 sm:space-y-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className={`font-sans tracking-widest uppercase text-base xs:text-lg transition-colors duration-300 ${pathname === link.href ? `${activeTextColor} font-bold` : `${textColor} ${hoverTextColor}`}`}>
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