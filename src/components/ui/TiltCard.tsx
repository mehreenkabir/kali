// FILE: src/components/ui/TiltCard.tsx
import React, { useRef, MouseEvent } from 'react';
import { WithChildren, WithClassName } from '@/types/common';

interface TiltCardProps extends WithChildren, WithClassName {}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>): void => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const rotationX = (event.clientX - left - width / 2) / 20;
    const rotationY = (event.clientY - top - height / 2) / 20;
    
    cardRef.current.style.transform = `perspective(1000px) rotateY(${rotationX}deg) rotateX(${-rotationY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = (): void => {
    if (!cardRef.current) return;
    
    cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div 
      ref={cardRef} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave} 
      className={`relative w-full h-full transition-transform duration-300 ease-out ${className}`} 
      tabIndex={0}
      role="img"
      aria-label="Interactive tilt card effect"
    >
      {children}
    </div>
  );
};

export default TiltCard;
