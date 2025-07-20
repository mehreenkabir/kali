// FILE: app/math/pricing/page.tsx - Background Image Zoomed In

'use client';

import React from 'react';
import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import Link from 'next/link';
import Image from 'next/image';

// --- Reusable Component for a Shop Item ---
interface ShopItemProps {
  name: string;
  imageSrc: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  isFeatured?: boolean;
}

const ShopItem: React.FC<ShopItemProps> = ({ name, imageSrc, description, ctaText, ctaHref, isFeatured }) => {
  return (
    <div className={`relative bg-block-brown border-2 xs:border-3 sm:border-4 border-black shadow-pixel-hard px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-4 pb-3 xs:pb-4 flex flex-col items-center justify-between text-center transition-transform duration-200 hover:scale-105 min-h-[200px] xs:min-h-[220px] sm:min-h-[240px] ${isFeatured ? 'bg-block-yellow' : ''}`}>
      {isFeatured && (
        <div className="absolute -top-3 xs:-top-4 px-1 xs:px-2 py-1 bg-mario-red border-2 xs:border-3 sm:border-4 border-black shadow-pixel-hard-sm font-pixel text-[8px] xs:text-[10px] sm:text-xs text-white text-outline-lg z-10">
          BEST VALUE!
        </div>
      )}
      <h3 className="font-pixel text-xs xs:text-sm sm:text-base md:text-lg text-white text-outline-lg mb-2 mt-1 text-center leading-tight">
        {name}
      </h3>
      <div className="relative w-12 xs:w-14 sm:w-16 md:w-20 h-12 xs:h-14 sm:h-16 md:h-20 mb-2 flex-shrink-0">
        <Image src={imageSrc} alt={name} layout="fill" objectFit="contain" className="crisp-edges" />
      </div>
      <p className="font-sans text-[10px] xs:text-xs sm:text-sm text-white text-center mb-3 leading-tight flex-grow px-1">
        {description}
      </p>
      <Link href={ctaHref} className="pixel-button bg-mario-red flex-shrink-0 px-2 xs:px-3 py-1">
        <span className="text-xs xs:text-sm sm:text-base text-white text-outline">
          {ctaText}
        </span>
      </Link>
    </div>
  );
};


// --- The Main Power-Up Shop Component ---
export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-block-brown">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-32 xs:pb-36 sm:pb-40 md:pb-44 lg:pb-48">
        <div 
          // --- FULLY LIQUID RESPONSIVE CONTAINER WITH PROPER FOOTER CLEARANCE ---
          // Extended background coverage for mobile, liquid scaling across all devices
          // Generous bottom padding to prevent any footer overlap on all screen sizes
          className="relative w-full max-w-[280px] xs:max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl min-h-[450px] xs:min-h-[520px] sm:min-h-[580px] md:min-h-[650px] lg:min-h-[720px] xl:min-h-[800px] crisp-edges border-2 xs:border-3 sm:border-4 border-black shadow-pixel-hard flex flex-col items-center justify-start p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/math/shop-bg.png')", backgroundSize: 'cover' }}
        >
          <h1 className="font-pixel text-lg xs:text-xl sm:text-2xl md:text-3xl text-white text-outline-lg mb-6 xs:mb-7 sm:mb-8 fade-in-up text-center" style={{animationDelay: '0.2s'}}>
            THE POWER-UP SHOP
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 w-full max-w-full px-1 xs:px-2 sm:px-4 py-2 flex-grow items-start justify-center overflow-hidden mb-4 xs:mb-6 sm:mb-8">
            <div className="fade-in-up w-full" style={{animationDelay: '0.4s'}}>
              <ShopItem
                name="EXPLORER'S PACK"
                imageSrc="/assets/math/item-chest.png"
                description="Unlock your first adventure!"
                ctaText="ACQUIRE"
                ctaHref="/contact"
              />
            </div>

            <div className="fade-in-up w-full" style={{animationDelay: '0.6s'}}>
              <ShopItem
                name="VOYAGER'S KIT"
                imageSrc="/assets/math/item-shield.png"
                description="Equip for ongoing journeys!"
                ctaText="EQUIP"
                ctaHref="/contact"
              />
            </div>

            <div className="fade-in-up w-full sm:col-span-2 md:col-span-1 sm:mx-auto md:mx-0" style={{animationDelay: '0.8s'}}>
              <ShopItem
                name="MASTER'S ALMANAC"
                imageSrc="/assets/math/item-book.png"
                description="Master the game of life!"
                ctaText="POWER UP!"
                ctaHref="/contact"
                isFeatured={true}
              />
            </div>
          </div>
          
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}