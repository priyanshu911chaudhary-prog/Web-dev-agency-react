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
      <div className="max-w-md flex flex-col items-center gap-6">
        <h2 
          className="text-[2.5rem] md:text-[3rem] font-bold uppercase tracking-tight leading-none" 
          style={{ fontFamily: 'Major Mono Display, sans-serif' }}
        >
          Notice
        </h2>
        
        <div className="font-sans text-[1.1rem] leading-relaxed text-[#A0A0A0] text-left space-y-4">
          <p className="text-[#F0EDE6] font-medium tracking-wide uppercase text-[0.8rem]">By the creator:</p>
          <p>
            This website is made to showcase web animation mastery and is heavily inspired by Awwwards websites. 
          </p>
          <p>
            I highly recommend you to please open it on <strong className="text-[#F0EDE6]">desktop</strong> as I have restricted many of the animations on mobile due to performance issues and complex animations.
          </p>
        </div>

        <button 
          onClick={handleContinue}
          className="mt-6 px-8 py-4 bg-[#F0EDE6] text-[#0D0D0D] rounded-full text-[12px] font-bold uppercase tracking-widest hover:bg-[#d0ccc3] transition-colors w-full sm:w-auto"
        >
          Continue with Mobile
        </button>
      </div>
    </div>
  );
};

export default MobileOverlay;
