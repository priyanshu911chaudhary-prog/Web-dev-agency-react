import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ClientPortal from './pages/ClientPortal';
import MobileOverlay from './components/MobileOverlay/MobileOverlay';
import CustomCursor from './components/CustomCursor/CustomCursor';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const transitionOverlayRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const shouldRevealRef = useRef(false);

  useEffect(() => {
    const onTransitionNavigate = (event) => {
      const targetPath = event.detail?.to;
      const overlay = transitionOverlayRef.current;

      if (!overlay || !targetPath || targetPath === location.pathname || isTransitioningRef.current) {
        return;
      }

      isTransitioningRef.current = true;
      shouldRevealRef.current = true;

      gsap.killTweensOf(overlay);
      gsap.set(overlay, {
        scaleY: 0,
        transformOrigin: 'top',
        pointerEvents: 'auto'
      });

      gsap.to(overlay, {
        scaleY: 1,
        duration: 0.55,
        ease: 'power3.inOut',
        onComplete: () => {
          navigate(targetPath);
        }
      });
    };

    window.addEventListener('app:navigateWithTransition', onTransitionNavigate);

    return () => {
      window.removeEventListener('app:navigateWithTransition', onTransitionNavigate);
    };
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (!shouldRevealRef.current) {
      return;
    }

    const overlay = transitionOverlayRef.current;

    if (!overlay) {
      shouldRevealRef.current = false;
      isTransitioningRef.current = false;
      return;
    }

    gsap.killTweensOf(overlay);
    gsap.set(overlay, {
      scaleY: 1,
      transformOrigin: 'bottom',
      pointerEvents: 'auto'
    });

    gsap.to(overlay, {
      scaleY: 0,
      duration: 1.2,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.set(overlay, { pointerEvents: 'none' });
        shouldRevealRef.current = false;
        isTransitioningRef.current = false;
      }
    });
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/portal" element={<ClientPortal />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <div
        ref={transitionOverlayRef}
        className="fixed inset-0 z-[110] scale-y-0 bg-black pointer-events-none"
      ></div>

      <MobileOverlay />
      <CustomCursor />
    </>
  );
};

export default App;