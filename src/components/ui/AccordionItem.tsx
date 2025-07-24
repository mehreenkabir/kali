// FILE: src/components/ui/AccordionItem.tsx
import React from 'react';
import { WithChildren } from '@/types/common';

interface AccordionItemProps extends WithChildren {
  title: string;
  index: number;
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
}

const ChevronIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg 
    className={`w-5 h-5 text-amber-900/80 flex-shrink-0 transition-transform duration-300 ${
      isOpen ? 'rotate-180' : ''
    }`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M19 9l-7 7-7-7" 
    />
  </svg>
);

const AccordionItem: React.FC<AccordionItemProps> = ({ 
  title, 
  children, 
  index, 
  openIndex, 
  setOpenIndex 
}) => {
  const isOpen = index === openIndex;
  
  const handleToggle = (): void => {
    setOpenIndex(isOpen ? null : index);
  };

  return (
    <div className="border-b border-amber-800/10">
      <button 
        onClick={handleToggle} 
        className="w-full flex justify-between items-center text-left py-3 xs:py-4 focus-ring" 
        aria-expanded={isOpen}
        aria-controls={`accordion-panel-${index}`}
      >
        <span className="font-dreamy text-lg xs:text-xl text-slate-800 pr-2">
          {title}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      
      <div 
        id={`accordion-panel-${index}`}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
        role="region"
        aria-labelledby={`accordion-button-${index}`}
      >
        <div className="pt-2 pb-3 xs:pb-4 pr-4 xs:pr-6 font-sans text-xs xs:text-sm text-slate-600 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
