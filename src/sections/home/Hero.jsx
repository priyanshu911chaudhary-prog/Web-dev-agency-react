import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { heroScrollAnimation } from '../../animations/gsap/heroAnim';

const Hero = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    window.disableGlobalNav = true; // Ensure it is disabled instantly on mount
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
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen bg-transparent flex flex-col justify-center pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-12 overflow-hidden z-10">

      {/* ROW 1: Giant Name Display */}
      <div className="w-full flex justify-left px-4 ml-12.5 sm:px-6">
        <h1 id="h1forhero" className="text-[clamp(3.4rem,9vw,10.5rem)] sm:text-[clamp(4rem,10vw,11.5rem)] md:text-[clamp(5rem,10.0vw,12.5rem)] leading-[0.88] tracking-[0.02em] text-[#0D0D0D] uppercase whitespace-nowrap text-left">
          Design<br></br>That Converts
        </h1>
      </div>

      {/* ROW 2: Three-column layout */}
      <div className="flex w-full px-4 sm:px-6 lg:px-10 mt-8 md:mt-6 items-center justify-between flex-wrap md:flex-nowrap gap-y-8 sm:gap-y-10">

        {/* Left Column */}
        <div ref={leftTextRef} className=" h2forhero w-full md:w-[30%] text-center md:text-right">
          <h2 className="text-[clamp(2.6rem,10vw,6rem)] md:text-[clamp(2.8rem,3.5vw,4.8rem)] leading-none text-[#0D0D0D] uppercase">
            THE NET-CRAFT
          </h2>
        </div>

        {/* Center Column */}
        <div ref={cardWrapRef} className="w-full md:w-[32%] lg:w-[25%] flex flex-col relative z-[9999] mx-auto md:mx-0 max-w-[24rem] sm:max-w-[28rem] md:max-w-none">
          <div ref={cardLabelsRef} className="flex justify-between items-center w-full mb-2 text-[#555] text-[10px] sm:text-[11px] uppercase tracking-widest font-sans font-medium">
            <span>Web experiences</span>
            <span>2026</span>
          </div>
          {/* Image Sequence Canvas */}
          <div className="w-full aspect-[5/3] sm:aspect-[16/9] bg-neutral-300 relative overflow-hidden">
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover z-[9999]"
            ></canvas>
          </div>
        </div>

        {/* Right Column */}
        <div ref={rightTextRef} className=" h2forhero w-full md:w-[30%] text-center md:text-left">
          <h2 className="text-[clamp(2.6rem,10vw,6rem)] md:text-[clamp(2.8rem,3.5vw,4.8rem)] leading-none text-[#0D0D0D] uppercase">
            web studio
          </h2>
        </div>

      </div>

      {/* ROW 3: Scroll Indicator */}
      <div ref={scrollLabelRef} className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 overflow-hidden">
        <span className="block text-[#555] text-[10px] sm:text-[11px] uppercase tracking-widest font-sans font-medium">
          Scroll Down
        </span>
      </div>

    </section>
  );
};

export default Hero;