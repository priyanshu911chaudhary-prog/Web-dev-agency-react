import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MobileOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkOverlay = () => {
      const isMobile = window.innerWidth < 1024;
      const hasDismissed = sessionStorage.getItem('mobile-overlay-dismissed') === '1';
      
      const isLoaderPending = location.pathname === '/' && sessionStorage.getItem('home-loader-complete') !== '1';

      if (isMobile && !hasDismissed && !isLoaderPending) {
        setIsVisible(true);
        document.body.style.overflow = 'hidden';
      }
    };

    checkOverlay();

    window.addEventListener('loaderComplete', checkOverlay);
    return () => window.removeEventListener('loaderComplete', checkOverlay);
  }, [location.pathname]);

  const handleContinue = () => {
    sessionStorage.setItem('mobile-overlay-dismissed', '1');
    setIsVisible(false);
    document.body.style.overflow = '';
    window.dispatchEvent(new CustomEvent('mobileOverlayDismissed'));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#0D0D0D] text-[#F0EDE6] flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-sm flex flex-col items-center gap-8">
        
        {/* Decorative line */}
        <div className="w-12 h-[1px] bg-[#F0EDE6]/20" />

        <h2 
          className="text-[1.8rem] font-bold uppercase tracking-tight leading-[1.1]" 
          style={{ fontFamily: 'Major Mono Display, sans-serif' }}
        >
          Best on Desktop
        </h2>
        
        <div className="font-sans text-[0.95rem] leading-[1.7] text-[#A0A0A0] text-center space-y-5">
          <p>
            This site is a showcase of advanced web animation and interaction design, inspired by award-winning digital experiences.
          </p>
          <p>
            For the full experience — smooth scroll-driven sequences, cinematic transitions, and interactive elements — please visit on a <strong className="text-[#F0EDE6]">desktop browser</strong>.
          </p>
          <p className="text-[0.8rem] text-[#666] tracking-wide">
            Some animations have been simplified on mobile for performance.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 w-full mt-2">
          <button 
            onClick={handleContinue}
            className="px-8 py-4 bg-[#F0EDE6] text-[#0D0D0D] rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#d0ccc3] transition-colors w-full"
          >
            Continue Anyway
          </button>
          <span className="text-[10px] text-[#555] tracking-widest uppercase">
            — Priyanshu Chaudhary
          </span>
        </div>

      </div>
    </div>
  );
};

export default MobileOverlay;
