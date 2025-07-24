// FILE: src/hooks/useMouseTracking.ts
import { useEffect, RefObject } from 'react';
import { MouseCoordinates } from '@/types/common';

/**
 * Custom hook for tracking mouse position and updating CSS custom properties
 * @param elementRef - React ref to the element that should respond to mouse movement
 */
export const useMouseTracking = (elementRef: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    const updateMousePosition = (event: MouseEvent): void => {
      if (elementRef.current) {
        const coordinates: MouseCoordinates = {
          x: event.clientX,
          y: event.clientY
        };
        
        elementRef.current.style.setProperty('--x', `${coordinates.x}px`);
        elementRef.current.style.setProperty('--y', `${coordinates.y}px`);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [elementRef]);
};
