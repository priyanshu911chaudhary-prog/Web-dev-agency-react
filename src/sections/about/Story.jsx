import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Story = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const p1Ref = useRef(null);
    const p2Ref = useRef(null);
    const listRef = useRef(null);

    useEffect(() => {
        window.allowNavReappear = true;
        return () => {
            window.allowNavReappear = false;
        };
    }, []);

    useGSAP(() => {
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => {
                window.allowNavReappear = self.isActive;
            }
        });

        // Elements to animate
        const elements = [titleRef.current, p1Ref.current, p2Ref.current, listRef.current];

        // The same "building up" wipe effect used in the Hero section
        gsap.from(elements, {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.55,
            stagger: 0.15,
            ease: "power3.inOut",
            delay: 0.1, // Slight delay to ensure page is ready
            clearProps: "clipPath" // Clears the inline style after it finishes
        });

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="px-4 sm:px-8 md:px-12 lg:px-18 pt-12 lg:pt-17 pb-12 lg:pb-17 bg-transparent w-full my-8 lg:my-12 overflow-hidden">
            <div className="mt-4 lg:mt-8 flex flex-col lg:flex-row gap-8 lg:gap-10 w-full">
                <h2
                    ref={titleRef}
                    className="text-[clamp(3rem,8vw,7.5rem)] leading-[0.88] tracking-[0.1em] text-[#0D0D0D] uppercase font-bold text-center lg:text-left"
                    style={{ fontFamily: 'Major Mono Display, sans-serif' }}
                >
                    CRAFTING
                    <br />
                    DIGITAL
                    <br />
                    LEGENDS
                </h2>
                <div className="max-w-2xl space-y-6 lg:pr-11 mx-auto lg:mx-0">
                    <p ref={p1Ref} className="font-sans text-[clamp(1.15rem,3vw,1.35rem)] leading-relaxed text-[#4a4a4a] text-center lg:text-left">
                        The Net-Craft Studio was built to turn bold ideas into high-performing digital experiences. We work at
                        the intersection of visual identity, interaction design, and technical precision to create work
                        that feels premium and performs in the real world.
                    </p>
                    <p ref={p2Ref} className="font-sans text-[clamp(1.15rem,3vw,1.35rem)] leading-relaxed text-[#4a4a4a] text-center lg:text-left">
                        Every project moves through a focused rhythm: strategy first, design with intention, and build
                        with performance at the core. That is how we help brands launch experiences people remember.
                    </p>
                    <div ref={listRef} className="flex items-center justify-center lg:justify-start gap-4">
                        <p className="font-sans text-[10px] md:text-[12px] uppercase tracking-widest text-[#555]">
                            Strategy • Design • Build • Launch
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Story;