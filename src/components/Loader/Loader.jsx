import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { runPreloaderAnim } from '../../animations/loaders/preloaderAnim';

const Loader = ({ onComplete }) => {
  const [isFinished, setIsFinished] = useState(false);

  const loadingScreenRef = useRef(null);
  const counter1Ref = useRef(null);
  const counter2Ref = useRef(null);
  const counter3Ref = useRef(null);
  const digitsRef = useRef([]);

  const counter1Data = [0, 1];
  const counter2Data = [0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const counter3Data = Array.from({ length: 20 }, (_, i) => i % 10).concat(0);

  const addToDigits = (el) => {
    if (el && !digitsRef.current.includes(el)) {
      digitsRef.current.push(el);
    }
  };

  useGSAP(() => {
    // Pass the actual DOM elements to the animation function
    const domRefs = {
      loadingScreen: loadingScreenRef.current,
      counter1: counter1Ref.current,
      counter2: counter2Ref.current,
      counter3: counter3Ref.current,
      digits: digitsRef.current,
    };

    runPreloaderAnim(domRefs, () => {
      // Clear the pre-render black background
      document.documentElement.style.backgroundColor = '';
      setIsFinished(true);
      if (onComplete) {
        onComplete();
      }
      window.dispatchEvent(new CustomEvent('loaderComplete'));
    });
  }, { scope: loadingScreenRef, dependencies: [onComplete] });

  if (isFinished) return null; // Remove from DOM entirely once animation is complete

  return (
    <div 
      ref={loadingScreenRef}
      className="fixed inset-0 w-full h-full bg-black text-white pointer-events-none z-[100]"
    >
      <div className="fixed left-[50px] bottom-[50px] flex gap-[8px] h-[100px] text-[100px] leading-[102px] font-['Helvetica_Neue',_'Segoe_UI',_Arial,_sans-serif] font-light antialiased [clip-path:polygon(0_0,100%_0,100%_100px,0_100px)]">
        
        <div ref={addToDigits} className="relative top-[-15px]">
          <div ref={counter1Ref} className="relative">
            {counter1Data.map((num, i) => <div key={`c1-${i}`} className="num h-[100px]">{num}</div>)}
          </div>
        </div>

        <div ref={addToDigits} className="relative top-[-15px]">
          <div ref={counter2Ref} className="relative">
            {counter2Data.map((num, i) => <div key={`c2-${i}`} className="num h-[100px]">{num}</div>)}
          </div>
        </div>

        <div ref={addToDigits} className="relative top-[-15px]">
          <div ref={counter3Ref} className="relative">
            {counter3Data.map((num, i) => <div key={`c3-${i}`} className="num h-[100px]">{num}</div>)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Loader;