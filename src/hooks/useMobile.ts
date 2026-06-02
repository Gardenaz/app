import { useState, useEffect } from 'react';

export function useMobile(breakpoint: number = 768): boolean {
  // Initialize with false to safely handle Server-Side Rendering (SSR)
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Return early if window is not defined (SSR safety fallback)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    
    // Set initial state matching current viewport width
    setIsMobile(mediaQuery.matches);

    // Event handler callback to update state dynamically
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Listen to changes across modern browsers
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Clean up event listener when component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [breakpoint]);

  return isMobile;
}
