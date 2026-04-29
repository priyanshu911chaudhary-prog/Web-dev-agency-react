import { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useLenis = () => {
  const lenisRef = useRef(null);
  const [lenisInstance, setLenisInstance] = useState(null);

  useEffect(() => {
    // 1. Initialize Lenis with smooth options
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    // eslint-disable-next-line
    setLenisInstance(lenis);

    // 2. Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Setup RAF loop using GSAP's ticker to ensure perfect synchronization
    const update = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // 4. Force a ScrollTrigger recalculation so pinned sections find their correct layout
    ScrollTrigger.refresh();

    // 5. Clean up on unmount
    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  return lenisInstance;
};
