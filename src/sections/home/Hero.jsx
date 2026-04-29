import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { heroScrollAnimation } from '../../animations/gsap/heroAnim';

const Hero = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Only disable global nav on desktop where pinning occurs
    if (window.innerWidth >= 1024) {
      window.disableGlobalNav = true;
    }
    return () => {
      window.disableGlobalNav = false;
    };
  }, []);

  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const cardWrapRef = useRef(null);
  const cardLabelsRef = useRef(null);
  const scrollLabelRef = useRef(null);
  const canvasRef = useRef(null);

  useGSAP(() => {
    heroScrollAnimation({ sectionRef, leftTextRef, rightTextRef, cardWrapRef, cardLabelsRef, scrollLabelRef, canvasRef })
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative w-full min-h-[100svh] bg-transparent flex flex-col justify-center pt-24 pb-12 overflow-hidden z-10">

      {/* ROW 1: Giant Name Display */}
      <div className="w-full flex justify-center lg:justify-start px-4 lg:ml-12.5 sm:px-6">
        {/* FIXED: Removed whitespace-nowrap and lowered clamp floor to 2.2rem to prevent horizontal overflow */}
        <h1 id="h1forhero" className="text-[clamp(2.2rem,11vw,10.5rem)] sm:text-[clamp(4.5rem,10vw,11.5rem)] lg:text-[clamp(5rem,10.0vw,12.5rem)] leading-[0.88] tracking-[0.02em] text-[#0D0D0D] uppercase text-center lg:text-left">
          Design<br></br>That Converts
        </h1>
      </div>

      {/* ROW 2: Three-column layout */}
      <div className="flex flex-col lg:flex-row w-full px-4 sm:px-6 lg:px-10 mt-10 lg:mt-6 items-center justify-between gap-y-6 lg:gap-y-10">

        {/* Left Column (Static center on mobile, aligns right on desktop) */}
        <div ref={leftTextRef} className=" h2forhero w-full lg:w-[30%] text-center lg:text-right">
          <h2 className="text-[clamp(2.5rem,10vw,6rem)] lg:text-[clamp(2.8rem,3.5vw,4.8rem)] leading-none text-[#0D0D0D] uppercase">
            THE NET-CRAFT
          </h2>
        </div>

        {/* Center Column (Static image on mobile, scales on desktop) */}
        <div ref={cardWrapRef} className="w-full sm:w-[80%] md:w-[60%] lg:w-[25%] flex flex-col relative z-20 mx-auto lg:mx-0">
          <div ref={cardLabelsRef} className="flex justify-between items-center w-full mb-2 text-[#555] text-[10px] sm:text-[11px] uppercase tracking-widest font-sans font-medium">
            <span>Web experiences</span>
            <span>2026</span>
          </div>
          {/* Image Sequence Canvas (Displays static frame 0 on mobile) */}
          <div className="w-full aspect-[4/3] lg:aspect-[16/9] bg-neutral-200 relative overflow-hidden rounded-md lg:rounded-none">
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover z-10"
            ></canvas>
          </div>
        </div>

        {/* Right Column (Static center on mobile, aligns left on desktop) */}
        <div ref={rightTextRef} className=" h2forhero w-full lg:w-[30%] text-center lg:text-left">
          <h2 className="text-[clamp(2.5rem,10vw,6rem)] lg:text-[clamp(2.8rem,3.5vw,4.8rem)] leading-none text-[#0D0D0D] uppercase">
            web studio
          </h2>
        </div>

      </div>

      {/* ROW 3: Scroll Indicator */}
      <div ref={scrollLabelRef} className="absolute bottom-6 left-1/2 -translate-x-1/2 overflow-hidden">
        <span className="block text-[#555] text-[10px] sm:text-[11px] uppercase tracking-widest font-sans font-medium">
          Scroll Down
        </span>
      </div>

    </section>
  );
};

export default Hero;