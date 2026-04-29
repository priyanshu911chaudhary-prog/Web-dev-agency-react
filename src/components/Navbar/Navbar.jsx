import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [time, setTime] = useState("");
  
  // 1. Create a ref for the nav element
  const navRef = useRef(null);
  const isNavHidden = useRef(false);

  const handleNavWithTransition = (event, to) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    window.dispatchEvent(new CustomEvent('app:navigateWithTransition', { detail: { to } }));
  };

  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    const updateTime = () => {
      const now = new Date();
      // Formats to Indian Standard Time with GMT offset (e.g., "10:20 AM GMT+5:30")
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'shortOffset'
      });
      setTime(formatter.format(now).toUpperCase());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isHomePage]);

  // 2. Add the simple GSAP ScrollTrigger logic
  useGSAP(() => {
    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (window.disableGlobalNav) return;

        // If scrolling down AND past the top 50px threshold -> Hide Navbar
        if (self.direction === 1 && self.scroll() > 50) {
          if (!isNavHidden.current) {
            isNavHidden.current = true;
            gsap.to(navRef.current, { 
              y: -20,
              opacity: 0, 
              duration: 0.3, 
              ease: 'power2.out', 
              overwrite: 'auto' 
            });
          }
        } 
        // If scrolling up -> Show Navbar
        else if (self.direction === -1) {
          if (isNavHidden.current && (window.allowNavReappear || self.scroll() <= 50)) {
            isNavHidden.current = false;
            gsap.to(navRef.current, { 
              y: 0,
              opacity: 1, 
              duration: 0.3, 
              ease: 'power2.out', 
              overwrite: 'auto' 
            });
          }
        }
      }
    });
  }, { scope: navRef }); // Scoped to this component so it cleans itself up safely

  return (
    <nav 
      ref={navRef} 
      className={`fixed top-0 left-0 w-full z-[10000] px-4 min-[400px]:px-6 md:px-12 lg:px-19 py-6 md:py-8 flex ${isHomePage ? 'justify-center md:justify-between' : 'justify-center md:justify-end'} items-center text-[#0D0D0D] font-sans text-[9.5px] min-[375px]:text-[10px] md:text-[11px] lg:text-[12px] tracking-wider md:tracking-widest font-medium pointer-events-auto will-change-transform`}
    >
      
      {/* LEFT COLUMN: Progressively Hides on Smaller Screens */}
      {isHomePage && (
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[8px] leading-none mb-[2px]">●</span>
            <span>GREATER NOIDA, IN</span>
          </div>
          {/* Hides below 1024px */}
          <div className="hidden lg:block">{time}</div>
          {/* Hides below 1280px */}
          <div className="hidden xl:block">28.4500° N, 77.5800° E</div>
        </div>
      )}

      {/* RIGHT COLUMN: Always Visible, Scales Down to Fit */}
      <ul className="flex items-center gap-3 min-[400px]:gap-4 md:gap-6">
        <li>
          <Link to="/" onClick={(event) => handleNavWithTransition(event, '/')} className="hover:opacity-60 transition-opacity px-1 py-2">HOME</Link>
        </li>
        <li>
          <Link to="/about" onClick={(event) => handleNavWithTransition(event, '/about')} className="hover:opacity-60 transition-opacity px-1 py-2">ABOUT</Link>
        </li>
        <li>
          <Link to="/contact" onClick={(event) => handleNavWithTransition(event, '/contact')} className="hover:opacity-60 transition-opacity px-1 py-2">CONTACT</Link>
        </li>
        <li>
          <Link to="/portal" onClick={(event) => handleNavWithTransition(event, '/portal')} className="hover:opacity-60 transition-opacity px-1 py-2">PORTAL</Link>
        </li>
      </ul>

    </nav>
  );
};

export default Navbar;