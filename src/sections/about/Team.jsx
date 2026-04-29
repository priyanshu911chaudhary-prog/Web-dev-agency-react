import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { teamAnimation } from '../../animations/gsap/teamAnim';
import styles from './Team.module.css';

import imgC from '../../assets/images/team-img/c.jpg';
import imgB from '../../assets/images/team-img/b.jpg';
import imgE from '../../assets/images/team-img/e.jpg';

const teamMembers = [
    { 
        initial: "P", 
        role: "(Principal Engineer)", 
        firstName: "Marcus", 
        lastName: "Sterling", 
        image: imgC,
        description: "Architecting robust, scalable backend systems while seamlessly integrating high-performance frontend experiences."
    },
    { 
        initial: "A", 
        role: "(Lead UI/UX Designer)", 
        firstName: "Julian", 
        lastName: "Vance", 
        image: imgB,
        description: "Crafting immersive, user-centric interfaces with a deep focus on modern aesthetics and interaction design."
    },
    { 
        initial: "S", 
        role: "(Head of Strategy)", 
        firstName: "Elena", 
        lastName: "Rostova", 
        image: imgE,
        description: "Directing long-term vision and driving impactful, scalable growth strategies across the organization."
    },
];

const Team = () => {
    const sectionRef = useRef(null);
    const memberRefs = useRef([]);
    const cardRefs = useRef([]);
    const initialRefs = useRef([]);

    useGSAP(() => {
        const cleanup = teamAnimation({
            sectionRef,
            memberRefs,
            cardRefs,
            initialRefs
        });

        return () => {
            if (cleanup) cleanup();
        };
    }, { scope: sectionRef });

    return (
        <div className={`${styles.container} mt-8 lg:mt-12`}>

            {/* --- INTRO SECTION --- */}
            <section className={`${styles.section} ${styles.hero}`}>
                <div className="flex flex-col items-center justify-center gap-4 max-w-3xl px-4 sm:px-6">
                    <h2 className="text-[clamp(3.5rem,12vw,6.5rem)] leading-[0.8] uppercase tracking-wide text-[#555] font-bold text-center" style={{ fontFamily: "Mango Grotesque" }}>
                        Meet The Team
                    </h2>
                    <p className="font-sans text-[clamp(1.15rem,3vw,1.35rem)] leading-[1.6rem] md:leading-[2rem] text-[#4a4a4a] text-center">
                        Our team is a collective of visionary designers, meticulous developers, and strategic thinkers.
                        We bring diverse perspectives together to craft digital experiences that resonate and inspire.
                    </p>
                </div>
            </section>

            {/* --- PINNED TEAM SECTION --- */}
            <section
                ref={sectionRef}
                className={`${styles.section} ${styles.team}`}
            >
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        ref={(el) => { memberRefs.current[index] = el; }}
                        className={styles.teamMember}
                    >
                        {/* Background Initial Letter */}
                        <div className={styles.teamMemberNameInitial}>
                            <h1
                                ref={(el) => { initialRefs.current[index] = el; }}
                                className={styles.h1}
                            >
                                {member.initial}
                            </h1>
                        </div>

                        {/* Foreground Member Card */}
                        <div
                            ref={(el) => { cardRefs.current[index] = el; }}
                            className={styles.teamMemberCard}
                        >
                            <div className={styles.teamMemberImg}>
                                {member.image ? (
                                    <img src={member.image} alt={member.firstName} className={styles.img} />
                                ) : null}
                            </div>

                            <div className={styles.teamMemberInfo}>
                                <p className={styles.p}>
                                    {member.role}
                                </p>
                                <h1 className={styles.h1}>
                                    {member.firstName} <span>{member.lastName}</span>
                                </h1>
                                {/* Description */}
                                <p className="font-sans text-[0.8rem] md:text-[0.9rem] leading-relaxed text-[#555] max-w-[85%] mx-auto mt-2">
                                    {member.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* --- OUTRO SECTION --- */}
            <section className={`${styles.section} ${styles.outro} py-16 md:py-24`}>
                <div className="flex flex-col items-center justify-center gap-4 md:gap-6 w-full max-w-4xl px-4 sm:px-6 mx-auto">
                    <h2
                        className="w-full text-[clamp(1.8rem,10vw,5rem)] leading-[0.95] md:leading-[0.88] tracking-[0.05em] md:tracking-[0.1em] text-[#0D0D0D] uppercase font-bold text-center break-words sm:break-normal"
                        style={{ fontFamily: 'Akkurat-Bold, sans-serif' }}
                    >
                        LET'S BUILD
                        <br />
                        SOMETHING
                        <br />
                        EXTRAORDINARY
                    </h2>
                    <p className="font-[Boldonsemi_bold] text-[clamp(1rem,4vw,1.35rem)] leading-relaxed text-[#4a4a4a] text-center mt-2 md:mt-4 px-2">
                        We are always looking for passionate individuals to join our hive.
                    </p>
                </div>
            </section>

        </div>
    );
};

export default Team;