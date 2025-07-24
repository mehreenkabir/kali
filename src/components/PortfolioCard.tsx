// FILE: src/components/PortfolioCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PortfolioCardData } from '@/types/common';

const PortfolioCard: React.FC<PortfolioCardData> = ({ 
  title, 
  category, 
  imageUrl, 
  href, 
  processNote 
}) => {
  return (
    <Link 
      href={href} 
      className="group relative block w-full h-full overflow-hidden rounded-lg shadow-lg"
      aria-label={`View ${title} portfolio piece`}
    >
      <Image
        src={imageUrl}
        alt={`Portfolio piece: ${title}`}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-500 ease-in-out group-hover:scale-105"
      />

      {/* Process Note Overlay */}
      <div className="absolute inset-0 bg-atelier-dark/70 backdrop-blur-sm p-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="font-dreamy text-2xl text-atelier-light text-center">
          {processNote}
        </p>
      </div>

      {/* Visible Content */}
      <div className="absolute bottom-0 left-0 p-6 transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="font-serif text-2xl text-atelier-light mb-1">
          {title}
        </h3>
        <p className="font-sans text-sm text-atelier-citrus tracking-widest uppercase">
          {category}
        </p>
      </div>
    </Link>
  );
};

export default PortfolioCard;