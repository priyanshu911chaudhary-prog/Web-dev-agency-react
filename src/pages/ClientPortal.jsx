import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const ClientPortal = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const saved = localStorage.getItem('clientPortalData');
      return saved ? JSON.parse(saved).currentStep ?? 0 : 0;
    } catch { return 0; }
  });

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('clientPortalData');
      return saved ? JSON.parse(saved).formData ?? { name: '', email: '', phone: '', project: '' } : { name: '', email: '', phone: '', project: '' };
    } catch { return { name: '', email: '', phone: '', project: '' }; }
  });

  const [isCompleted, setIsCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('clientPortalData');
      return saved ? JSON.parse(saved).isCompleted ?? false : false;
    } catch { return false; }
  });

  const [wasAlreadyCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('clientPortalData');
      return saved ? JSON.parse(saved).isCompleted === true : false;
    } catch { return false; }
  });

  const [countdown, setCountdown] = useState(5);
  
  const isInitialLoad = useRef(true);
  const rightColumnRef = useRef(null);
  
  const inputRefs = useRef([]);
  const containerRefs = useRef([]);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const pRef = useRef(null);

  useGSAP(() => {
    const leftElements = [titleRef.current, pRef.current];
    const tl = gsap.timeline();
    
    // 1. Build the left column first
    tl.from(leftElements, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 1.25,
      stagger: 0.15,
      ease: "power3.inOut",
      delay: 0.1,
      clearProps: "clipPath" 
    });

    // 2. Build the right column immediately after left column starts finishing
    if (rightColumnRef.current) {
      // Grab the individual form fields (label, input, buttons) or completion message elements
      const qElements = gsap.utils.toArray(rightColumnRef.current.querySelectorAll("label, input, .buttons-wrapper, .completion-msg > *"));
      
      if (qElements.length > 0) {
        tl.fromTo(qElements,
          { opacity: 0, y: 40, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.15, ease: "power3.out", clearProps: "all" },
          "-=0.6" // Start animating before the left column completely finishes
        );
      }
    }
  }, { scope: sectionRef });

  const questions = [
    { id: 'name', label: 'What is your name?', type: 'text', placeholder: 'Priyanshu Chaudhary' },
    { id: 'email', label: "What's your email address?", type: 'email', placeholder: 'hello@example.com' },
    { id: 'phone', label: "What's your phone number?", type: 'tel', placeholder: '+91 98765 43210' },
    { id: 'project', label: "Tell us about your project", type: 'text', placeholder: 'We need a new website...' }
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      const currentContainer = containerRefs.current[currentStep];
      if (currentContainer) {
        gsap.to(currentContainer, {
          opacity: 0,
          y: -30,
          filter: "blur(5px)",
          duration: 0.4,
          ease: 'power2.inOut',
          onComplete: () => setCurrentStep(prev => prev + 1),
        });
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      setIsCompleted(true);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentVal = formData[questions[index].id].trim();
      const isOptional = questions[index].id === 'phone';
      if (currentVal !== '' || isOptional) {
        handleNext();
      }
    }
  };

  // Back navigation with GSAP animation
  const handleBack = () => {
    if (currentStep > 0) {
      const currentContainer = containerRefs.current[currentStep];
      if (currentContainer) {
        gsap.to(currentContainer, {
          opacity: 0,
          y: 30,
          filter: "blur(5px)",
          duration: 0.4,
          ease: 'power2.inOut',
          onComplete: () => setCurrentStep(prev => prev - 1),
        });
      } else {
        setCurrentStep(prev => prev - 1);
      }
    }
  };

  // GSAP Animation: Slide and fade in the new question, and auto-focus the input
  useEffect(() => {
    if (!isCompleted && containerRefs.current[currentStep]) {
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
      } else {
        gsap.fromTo(containerRefs.current[currentStep],
          { opacity: 0, y: 30, filter: "blur(5px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: 'power3.out' }
        );
      }
    }
    
    const focusTimer = setTimeout(() => {
      if (!isCompleted && inputRefs.current[currentStep]) {
        inputRefs.current[currentStep].focus();
      }
    }, 100);

    return () => clearTimeout(focusTimer);
  }, [currentStep, isCompleted]);

  // Completion GSAP animation and Countdown Logic
  useEffect(() => {
    if (isCompleted) {
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
      } else {
        gsap.fromTo('.completion-msg',
          { opacity: 0, scale: 0.95, y: 20, filter: "blur(5px)" },
          { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: 'power3.out' }
        );
      }
    }
  }, [isCompleted]);

  // Save form data and step to localStorage whenever they change
  useEffect(() => {
    const payload = { formData, currentStep, isCompleted };
    try {
      localStorage.setItem('clientPortalData', JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save form data', e);
    }
  }, [formData, currentStep, isCompleted]);

  useEffect(() => {
    if (isCompleted && !wasAlreadyCompleted && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isCompleted && !wasAlreadyCompleted && countdown === 0) {
      navigate('/');
    }
  }, [isCompleted, wasAlreadyCompleted, countdown, navigate]);

  return (
    <div className="relative w-full min-h-screen bg-transparent text-[#0D0D0D] flex flex-col">
      <Navbar />
      
      <main className="flex-grow w-full pt-0 pb-12 overflow-hidden">
        
        <section ref={sectionRef} className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-32 lg:pt-40 pb-16 bg-transparent">
          
          <div className="mt-8 lg:mt-12 flex flex-col lg:flex-row gap-12 lg:gap-20 w-full">
            
            {/* --- Left Column: Intro Header --- */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h2
                ref={titleRef}
                className="text-[clamp(3rem,8vw,7.5rem)] leading-[0.88] tracking-[0.02em] text-[#0D0D0D] uppercase font-bold"
                style={{ fontFamily: 'Mandatory' }}
              >
                START A
                <br />
                PROJECT
              </h2>
              <div className="max-w-2xl space-y-6">
                <p ref={pRef} className="font-sans text-[1.1rem] sm:text-[1.25rem] lg:text-[1.35rem] leading-relaxed text-[#4a4a4a]">
                  Let's build something great together. Tell us a bit about yourself and what you're looking to achieve, and our team will be in touch shortly.
                </p>
              </div>
            </div>

            {/* --- Right Column: Interactive Progressive Form OR Completion State --- */}
            <div ref={rightColumnRef} className="w-full lg:w-1/2 flex flex-col gap-12 lg:pt-4">
              {wasAlreadyCompleted ? (
                <div className="completion-msg w-full flex flex-col items-start justify-center text-left py-4">
                  <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#0D0D0D] tracking-tight mb-2 leading-none">
                    Welcome Back
                  </h2>
                  <p className="text-[1.1rem] sm:text-[1.25rem] md:text-[1.5rem] text-[#4a4a4a] font-medium mb-8 max-w-[530px]">
                    Your enquiry reached us. We will reach you soon.
                  </p>
                  <button
                    onClick={() => {
                      localStorage.removeItem('clientPortalData');
                      window.location.reload();
                    }}
                    className="min-h-[44px] min-w-[44px] px-8 py-3 bg-[#0D0D0D] text-[#F0EDE6] rounded-full text-[14px] font-bold uppercase tracking-widest hover:bg-[#4a4a4a] transition-all"
                  >
                    Start New Enquiry
                  </button>
                </div>
              ) : !isCompleted ? (
                questions.map((q, index) => (
                  index === currentStep && (
                    <div
                      key={q.id}
                      ref={el => containerRefs.current[index] = el}
                      className="flex flex-col gap-4 transition-all duration-700"
                    >
                      <label htmlFor={q.id} className="text-[1.5rem] md:text-[2rem] font-medium text-[#0D0D0D]">
                        {q.label}
                      </label>
                      <input
                        ref={el => inputRefs.current[index] = el}
                        type={q.type}
                        id={q.id}
                        placeholder={index === currentStep ? q.placeholder : ''}
                        value={formData[q.id]}
                        onChange={(e) => setFormData({ ...formData, [q.id]: e.target.value })}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="bg-transparent border-b-[1px] md:border-b-2 border-[#0D0D0D]/30 focus:border-[#0D0D0D] text-[1.2rem] md:text-[2.2rem] text-[#0D0D0D] py-2 outline-none transition-colors w-full max-w-[530px] placeholder:text-[#0D0D0D]/20 font-sans"
                        autoComplete="off"
                      />
                      
                      {/* OK Button & Enter Hint (Only visible on active step) */}
                      {index === currentStep && (
                        <div className="buttons-wrapper flex flex-wrap items-center gap-4 mt-4">
                          {currentStep > 0 && (
                            <button
                              onClick={handleBack}
                              className="min-h-[44px] min-w-[44px] px-8 py-3 bg-[#555] text-[#F0EDE6] rounded-full text-[14px] font-bold uppercase tracking-widest mr-2 hover:bg-[#777] transition-all"
                            >
                              Back
                            </button>
                          )}
                          <button
                            onClick={handleNext}
                            disabled={formData[q.id].trim() === '' && q.id !== 'phone'} // Phone is optional
                            className="min-h-[44px] min-w-[44px] px-8 py-3 bg-[#0D0D0D] text-[#F0EDE6] rounded-full text-[14px] font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#4a4a4a] transition-all"
                          >
                            OK
                          </button>
                          <span className="text-[10px] sm:text-[12px] text-[#4a4a4a] font-medium tracking-widest uppercase mt-2 sm:mt-0">
                            Press Enter ↵
                          </span>
                        </div>
                      )}
                    </div>
                  )
                ))
              ) : (
                // --- Completion State (Thank You Screen) in Right Column ---
                <div className="completion-msg w-full flex flex-col items-start justify-center text-left py-4">
                  <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold text-[#0D0D0D] tracking-tight mb-2 leading-none">
                    Thank you!
                  </h2>
                  <p className="text-[1.1rem] sm:text-[1.25rem] md:text-[1.5rem] text-[#4a4a4a] font-medium mb-8 max-w-[530px]">
                    We've received your details. We'll be in touch with you shortly to discuss your project.
                  </p>
                  <p className="text-[0.75rem] sm:text-[0.85rem] text-[#555] font-sans tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Redirecting in {countdown}s...
                  </p>
                </div>
              )}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ClientPortal;