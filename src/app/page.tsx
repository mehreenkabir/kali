// FILE: app/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import GlobalFooter from '@/components/GlobalFooter';

interface PortalPanelProps {
  href: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

const PortalPanel: React.FC<PortalPanelProps> = ({ href, title, subtitle, imageUrl }) => {
  return (
    <Link href={href} className="relative flex-1 group w-full h-full min-h-[50vh] xs:min-h-[55vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-screen overflow-hidden cursor-pointer">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl})` }}
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
export default function Home() {
  return (
    <div className="min-h-screen w-full bg-atelier-dark text-atelier-light relative">
      <div className="flex flex-col md:flex-row min-h-screen">
        <PortalPanel href="/art" title="ART" subtitle="The Architecture of Experience" imageUrl="/images/portal-art.jpg" />
        <PortalPanel href="/math" title="MATH" subtitle="The Language of the Cosmos" imageUrl="/images/portal-math.jpg" />
        <PortalPanel href="/yoga" title="YOGA" subtitle="The Practice of Presence" imageUrl="/images/portal-yoga.jpg" />
      </div>
      <GlobalFooter theme="dark" />
    </div>
  );
}