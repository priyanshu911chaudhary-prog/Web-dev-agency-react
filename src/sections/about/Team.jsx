import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { teamAnimation } from '../../animations/gsap/teamAnim';
import styles from './Team.module.css';

import imgC from '../../assets/images/team-img/c.jpg';
import imgB from '../../assets/images/team-img/b.jpg';
import imgE from '../../assets/images/team-img/e.jpg';

const teamMembers = [
    { initial: "P", role: "(Creative Director)", firstName: "Priyanshu", lastName: "Chaudhary", image: imgC },
    { initial: "A", role: "(Lead Developer)", firstName: "Aryan", lastName: "Sharma", image: imgB },
    { initial: "S", role: "(Head of Design)", firstName: "Sahil", lastName: "Verma", image: imgE },
];

const Team = () => {
    const sectionRef = useRef(null);
    const memberRefs = useRef([]);
    const cardRefs = useRef([]);
    const initialRefs = useRef([]);

    // Ref callbacks integrated directly to satisfy linter

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
    }, { scope: sectionRef }); // CRITICAL: Removed dependencies: [lenis] to prevent constant recreation of animations on scroll

    return (
        <div className={`${styles.container} mt-12`}>

            {/* --- INTRO SECTION --- */}
            <section className={`${styles.section} ${styles.hero}`}>
                <div className="flex flex-col items-center justify-center gap-4 max-w-3xl px-4">
                    <h2 className="text-[11px] md:text-[6.5rem] uppercase tracking-wide text-[#555] font-bold" style={{ fontFamily: "Mango Grotesque" }}>
                        Meet The Team
                    </h2>
                    <p className="font-sans text-[clamp(1.35rem,1.2vw,1.15rem)] leading-[2rem] text-[#4a4a4a] text-center">
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
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* --- OUTRO SECTION --- */}
            <section className={`${styles.section} ${styles.outro}`}>
                <div className="flex flex-col items-center justify-center gap-6 max-w-4xl px-4">
                    <h2
                        className="text-[clamp(3rem,6vw,5rem)] leading-[0.88] tracking-[0.1em] text-[#0D0D0D] uppercase font-bold text-center"
                        style={{ fontFamily: 'Akkurat-Bold, sans-serif' }}
                    >
                        LET'S BUILD
                        <br />
                        SOMETHING
                        <br />
                        EXTRAORDINARY
                    </h2>
                    <p className="font-[Boldonsemi_bold] text-[clamp(1.35rem,1.2vw,1.15rem)] leading-relaxed text-[#4a4a4a] text-center mt-4">
                        We are always looking for passionate individuals to join our hive.
                    </p>
                </div>
            </section>

        </div>
    );
};

export default Team;