// FILE: src/components/LocationModal.tsx

'use client';

import React from 'react';
import Link from 'next/link';

// Define the props the modal will accept
interface LocationModalProps {
  title: string;
  description: string;
  onClose: () => void; // A function to close the modal
}

const LocationModal: React.FC<LocationModalProps> = ({ title, description, onClose }) => {
  return (
    // Backdrop: a semi-transparent layer that covers the screen
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} // Clicking the backdrop closes the modal
    >
      {/* Modal Content Box: stopPropagation prevents clicks inside from closing it */}
      <div 
        className="relative bg-white border-2 xs:border-3 sm:border-4 border-black shadow-pixel-hard p-4 xs:p-6 sm:p-8 max-w-xs xs:max-w-sm sm:max-w-lg w-full text-center fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-1 xs:top-2 right-1 xs:right-2 font-pixel text-lg xs:text-xl sm:text-2xl text-black hover:text-mario-red transition-colors duration-200"
          aria-label="Close"
        >
          X
        </button>

        {/* Title */}
        <h2 className="font-pixel text-lg xs:text-xl sm:text-2xl md:text-3xl text-mario-blue text-outline mb-4 xs:mb-5 sm:mb-6 px-6 xs:px-8">
          {title}
        </h2>

        {/* Description */}
        <p className="font-sans text-sm xs:text-base sm:text-lg text-slate-700 mb-6 xs:mb-7 sm:mb-8 leading-relaxed px-2">
          {description}
        </p>

        {/* Call to Action Button */}
        <Link 
          href="/math/pricing" // Go to pricing page first, then to contact
          className="pixel-button bg-luigi-green px-4 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4"
        >
          <span className="text-sm xs:text-lg sm:text-xl text-white text-outline">
            VIEW POWER-UPS
          </span>
        </Link>
      </div>
    </div>
  );
};

export default LocationModal;