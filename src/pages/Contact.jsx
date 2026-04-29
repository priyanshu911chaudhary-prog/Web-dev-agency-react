import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { contactAnimation } from '../animations/gsap/contactAnim';
import { useLenis } from '../hooks/useLenis';
import Navbar from '../components/Navbar/Navbar';
import icon1 from '../assets/images/contact-img/_icon_1.png';
import icon2 from '../assets/images/contact-img/_icon_2.png';
import icon3 from '../assets/images/contact-img/_icon_3.png';
import icon4 from '../assets/images/contact-img/_icon_4.png';

const Contact = () => {
  const lenis = useLenis();
  const [currentTime, setCurrentTime] = useState("");
  const contactIcons = [icon1, icon2, icon3, icon4];

  // Refs
  const contactInfoParentRef = useRef(null);
  const iconLayerARef = useRef(null);
  const iconLayerBRef = useRef(null);
  const rowRefs = useRef([]);

  // Base Data
  const baseContactData = [
    { label: "Address",           value: "Greater Noida, IN" },
    { label: "Current Time",      value: currentTime },
    { label: "General Inquiries", value: "hello@thenetcraft.studio" },
    { label: "New Business",      value: "business@thenetcraft.studio" },
    { label: "Collaborations",    value: "collab@thenetcraft.studio" },
    { label: "Job Inquiries",     value: "jobs@thenetcraft.studio" },
    { label: "Telephone",         value: "+91 98765 43210" },
    { label: "Social Media",      value: "@thenetcraft.studio" },
  ];

  // Update Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'shortOffset'
      });
      setCurrentTime(formatter.format(now).replace('GMT+5:30', '(IST)'));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    const cleanup = contactAnimation({
      contactInfoParentRef,
      iconLayerARef,
      iconLayerBRef,
      rowRefs,
      lenis,
      totalIcons: contactIcons.length,
      iconSources: contactIcons
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, { scope: contactInfoParentRef, dependencies: [lenis] });

  return (
    <main className="relative w-full min-h-screen bg-transparent overflow-x-hidden">
      <Navbar />
      
      {/* Background visual container (fixed) */}
      <section className="fixed top-0 left-0 w-full h-[100svh] flex items-center justify-center overflow-hidden bg-transparent pointer-events-none z-0">
        <div className="relative w-[4rem] md:w-[7rem] h-[4rem] md:h-[7rem]">
          {/* Layer A (Active) */}
          <img
            ref={iconLayerARef}
            src={contactIcons[0]}
            alt="Contact icon"
            className="absolute inset-0 w-full h-full object-contain origin-center will-change-transform will-change-opacity"
          />
          {/* Layer B (Idle / Crossfading) */}
          <img
            ref={iconLayerBRef}
            src={contactIcons[1]}
            alt="Contact icon"
            className="absolute inset-0 w-full h-full object-contain origin-center will-change-transform will-change-opacity"
          />
        </div>
      </section>

      {/* Scrollable contact info wrapper */}
      <section 
        ref={contactInfoParentRef}
        className="relative w-full flex flex-col justify-center overflow-hidden z-10 pt-[50svh] pb-[50svh]"
      >
        <div className="w-full max-w-7xl mx-auto flex flex-col justify-center gap-[1.5rem] py-12 px-4 sm:px-8">
          {baseContactData.map((item, index) => (
            <div
              key={`row-${index}`}
              ref={(el) => {
                rowRefs.current[index] = el;
              }}
              className="flex justify-center items-center min-h-[2rem] gap-[1rem] will-change-[gap] w-full"
            >
              <p className="flex-1 min-w-0 text-[10px] min-[375px]:text-[11px] sm:text-[14px] md:text-[1rem] lg:text-[1.4rem] font-bold leading-normal md:leading-[0.95] tracking-[-0.025rem] text-right text-[#0D0D0D] break-words">
                {item.label}
              </p>
              <p className="flex-1 min-w-0 text-[10px] min-[375px]:text-[11px] sm:text-[14px] md:text-[1rem] lg:text-[1.4rem] font-normal leading-normal md:leading-[0.95] tracking-[-0.025rem] text-left text-[#4a4a4a] break-words">
                {item.label === "Current Time" ? currentTime : item.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Contact;