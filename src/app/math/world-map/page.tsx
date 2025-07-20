// FILE: app/math/world-map/page.tsx - Scaled to match MathPage and PricingPage

'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import GlobalFooter from '@/components/GlobalFooter';
import Image from 'next/image';
import LocationModal from '@/components/LocationModal'; // Import our new modal

// --- The Main World Map Component ---
export default function WorldMapPage() {
  // State to manage the modal's content. If it's null, the modal is closed.
  const [modalContent, setModalContent] = useState<{ title: string; description: string } | null>(null);

  const locationData = {
    academy: {
      title: "The Hearthstone Academy",
      description: "Welcome, adventurer! This is a sanctuary for in-person learning. Here, we'll conquer challenges side-by-side in a supportive, hands-on environment."
    },
    etherverse: {
      title: "The Ether-Verse",
      description: "Greetings, traveler! You've discovered a portal to online learning. From anywhere in the world, we can connect and explore the cosmos of mathematics together."
    }
  };

  return (
    // Main page container: flex column for proper footer placement. Background is the solid Mario Blue.
    <div className="min-h-screen flex flex-col bg-mario-blue">
      <Header />

      {/* 
        --- MAIN GAME SCREEN FRAMING ---
        - flex-grow: Fills vertical space.
        - flex flex-col items-center justify-center: Centers the game screen container.
        - Responsive padding with adequate bottom clearance for all screen sizes.
      */}
      <main className="flex-grow flex flex-col items-center justify-center p-3 xs:p-4 sm:p-6 md:p-8 pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-16 xs:pb-18 sm:pb-20 md:pb-24">
        
        {/* 
          --- INNER GAME DISPLAY CONTAINER - EXACTLY MATCHING OTHERS ---
          - relative w-full max-w-4xl aspect-video crisp-edges: Shared scaling.
          - border-4 border-black shadow-pixel-hard: Shared border.
          - bg-cover bg-center bg-no-repeat: NEW! Ensures background image fills properly, matching other pages.
            (If you want a zoomed-in effect like PricingPage, change bg-cover to "backgroundSize: '120% 120%'" in style prop)
        */}
        <div 
          className="relative w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl aspect-video crisp-edges border-2 xs:border-3 sm:border-4 border-black shadow-pixel-hard bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/math/world-map-bg.png')" }} // Background image applied via style
        >
          {/* Player Character */}
          {/* Positioned on the map as a sprite */}
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-12 xs:w-14 sm:w-16 h-12 xs:h-14 sm:h-16 animate-bounce crisp-edges">
            <Image
              src="/assets/math/player-character.png"
              alt="Player Character"
              layout="fill"
              objectFit="contain"
            />
          </div>

          {/* Location 1: Hearthstone Academy (In-Person) */}
          {/* Positioned on the map as a sprite */}
          <div 
            className="absolute top-[35%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-16 xs:w-20 sm:w-24 h-16 xs:h-20 sm:h-24 cursor-pointer transition-transform hover:scale-110 hover:animate-pulse crisp-edges"
            onClick={() => setModalContent(locationData.academy)}
          >
            <Image
              src="/assets/math/location-academy.png"
              alt="Hearthstone Academy"
              layout="fill"
              objectFit="contain"
            />
          </div>

          {/* Location 2: The Ether-Verse (Online) */}
          {/* Positioned on the map as a sprite */}
          <div 
            className="absolute top-[35%] right-[25%] translate-x-1/2 -translate-y-1/2 w-16 xs:w-20 sm:w-24 h-16 xs:h-20 sm:h-24 cursor-pointer transition-transform hover:scale-110 hover:animate-pulse crisp-edges"
            onClick={() => setModalContent(locationData.etherverse)}
          >
            <Image
              src="/assets/math/location-portal.png"
              alt="The Ether-Verse"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </main>

      <GlobalFooter />

      {/* Conditionally render the modal WHEN modalContent is not null */}
      {modalContent && (
        <LocationModal
          title={modalContent.title}
          description={modalContent.description}
          onClose={() => setModalContent(null)}
        />
      )}
    </div>
  );
}