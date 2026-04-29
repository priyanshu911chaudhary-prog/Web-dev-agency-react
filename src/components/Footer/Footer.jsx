import { useRef } from 'react';
import { FaInstagram, FaXTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa6';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Footer = () => {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const socialRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    // Run independently from scroll: always move right-to-left.
    gsap.fromTo(headingRef.current, {
      xPercent: 0,
    }, {
      xPercent: -50,
      duration: 20,
      ease: 'none',
      repeat: -1
    });

    gsap.fromTo(socialRef.current.children, {
      opacity: 0,
      y: 40
    }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: 0.2,
      stagger: 0.1,
      ease: 'power3.out'
    });

    gsap.fromTo(textRef.current.children, {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: 0.5,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  return (
    <footer ref={containerRef} className="w-full bg-transparent pt-16 pb-10 px-6 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Giant Heading Marquee */}
      <div className="w-full overflow-hidden flex whitespace-nowrap mb-4 mt-2">
        <h2 
          ref={headingRef}
          className="h2forfooter text-[clamp(4rem,10vw,13rem)] font-normal tracking-[-0.02em] text-[#0D0D0D] uppercase leading-none flex w-max"
        >
          <span className="pr-16">NETCRAFT WEB STUDIO</span>
          <span className="pr-16">NETCRAFT WEB STUDIO</span>
          <span className="pr-16">NETCRAFT WEB STUDIO</span>
          <span className="pr-16">NETCRAFT WEB STUDIO</span>
        </h2>
      </div>

      {/* Social Icons Row */}
      <div ref={socialRef} className="flex items-center justify-center gap-8 mt-8">

        <a href="#" className="text-[#0D0D0D] text-[22px] hover:opacity-60 transition-opacity duration-300" aria-label="Instagram">
          <FaInstagram />
        </a>
        <a href="#" className="text-[#0D0D0D] text-[22px] hover:opacity-60 transition-opacity duration-300" aria-label="Twitter / X">
          <FaXTwitter />
        </a>
        <a href="#" className="text-[#0D0D0D] text-[22px] hover:opacity-60 transition-opacity duration-300" aria-label="LinkedIn">
          <FaLinkedinIn />
        </a>
        <a href="#" className="text-[#0D0D0D] text-[22px] hover:opacity-60 transition-opacity duration-300" aria-label="GitHub">
          <FaGithub />
        </a>
      </div>

      {/* Bottom Text */}
      <div ref={textRef} className="mt-12 flex flex-col items-center text-center font-sans text-[11px] tracking-widest text-[#0D0D0D]/50 uppercase leading-relaxed">
        <p>© NETCRAFT WEB STUDIO 2026</p>
        <p>MADE BY PRIYANSHU CHAUDHARY.</p>
      </div>

    </footer>
  );
};

export default Footer;