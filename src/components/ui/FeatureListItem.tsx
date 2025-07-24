// FILE: src/components/ui/FeatureListItem.tsx
import React from 'react';
import { WithChildren } from '@/types/common';

const EtherealCheckIcon: React.FC = () => (
  <svg 
    className="w-5 h-5 mr-3 text-amber-800/80 flex-shrink-0" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M5 13l4 4L19 7" 
    />
  </svg>
);

const FeatureListItem: React.FC<WithChildren> = ({ children }) => (
  <li className="flex items-start mb-3">
    <EtherealCheckIcon />
    <span className="font-sans text-base text-slate-700">
      {children}
    </span>
  </li>
);

export default FeatureListItem;
