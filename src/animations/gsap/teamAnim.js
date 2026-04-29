import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function teamAnimation({ sectionRef, memberRefs, cardRefs, initialRefs }) {
    gsap.registerPlugin(ScrollTrigger);

    const teamSection = sectionRef.current;
    const teamMembers = memberRefs.current;
    const teamMemberCards = cardRefs.current;
    const teamInitials = initialRefs.current;

    let cardPlaceholderEntrance = null;
    let cardSlideInAnimation = null;

    function initTeamAnimations() {
        if (window.innerWidth < 1000) {
            if (cardPlaceholderEntrance) cardPlaceholderEntrance.kill();
            if (cardSlideInAnimation) cardSlideInAnimation.kill();

            teamMembers.forEach((member, index) => {
                gsap.set(member, { clearProps: "all" });
                gsap.set(teamInitials[index], { clearProps: "all" });
            });

            teamMemberCards.forEach((card) => {
                gsap.set(card, { clearProps: "all" });
            });

            return;
        }

        if (cardPlaceholderEntrance) cardPlaceholderEntrance.kill();
        if (cardSlideInAnimation) cardSlideInAnimation.kill();

        cardPlaceholderEntrance = ScrollTrigger.create({
            trigger: teamSection,
            start: "top bottom",
            end: "top top",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;

                teamMembers.forEach((member, index) => {
                    const entranceDelay = 0.15;
                    const entranceDuration = 0.7;
                    const entranceStart = index * entranceDelay;
                    const entranceEnd = entranceStart + entranceDuration;

                    if (progress >= entranceStart && progress <= entranceEnd) {
                        const memberEntranceProgress = (progress - entranceStart) / entranceDuration;
                        const entranceY = 150 - memberEntranceProgress * 150;
                        gsap.set(member, { y: `${entranceY}%` });

                        const initialLetterScaleDelay = 0.4;
                        const initialLetterScaleProgress = Math.max(
                            0,
                            (memberEntranceProgress - initialLetterScaleDelay) / (1 - initialLetterScaleDelay)
                        );
                        gsap.set(teamInitials[index], { scale: initialLetterScaleProgress });
                    } else if (progress > entranceEnd) {
                        gsap.set(member, { y: `0%` });
                        gsap.set(teamInitials[index], { scale: 1 });
                    }
                });
            },
        });

        cardSlideInAnimation = ScrollTrigger.create({
            trigger: teamSection,
            start: "top top",
            end: `+=${window.innerHeight * 3}`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;

                teamMemberCards.forEach((card, index) => {
                    const slideInStagger = 0.075;
                    const xRotationDuration = 0.4;
                    const xRotationStart = index * slideInStagger;
                    const xRotationEnd = xRotationStart + xRotationDuration;

                    if (progress >= xRotationStart && progress <= xRotationEnd) {
                        const cardProgress = (progress - xRotationStart) / xRotationDuration;
                        const cardInitialX = 450 - index * 150;
                        const cardTargetX = -50;
                        const cardSlideInX = cardInitialX + cardProgress * (cardTargetX - cardInitialX);
                        const cardSlideInRotation = 20 - cardProgress * 20;

                        gsap.set(card, {
                            x: `${cardSlideInX}%`,
                            rotation: cardSlideInRotation,
                        });
                    } else if (progress > xRotationEnd) {
                        gsap.set(card, {
                            x: `-50%`,
                            rotation: 0,
                        });
                    }

                    const cardScaleStagger = 0.12;
                    const cardScaleStart = 0.4 + index * cardScaleStagger;
                    const cardScaleEnd = 1;

                    if (progress >= cardScaleStart && progress <= cardScaleEnd) {
                        const scaleProgress = (progress - cardScaleStart) / (cardScaleEnd - cardScaleStart);
                        const scaleValue = 0.75 + scaleProgress * 0.25;

                        gsap.set(card, {
                            scale: scaleValue,
                        });
                    } else if (progress > cardScaleEnd) {
                        gsap.set(card, {
                            scale: 1,
                        });
                    }
                });
            }
        });
    }

    let resizeTimer;
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initTeamAnimations();
            ScrollTrigger.refresh();
        }, 250);
    };

    window.addEventListener("resize", handleResize);

    initTeamAnimations();

    return () => {
        if (cardPlaceholderEntrance) cardPlaceholderEntrance.kill();
        if (cardSlideInAnimation) cardSlideInAnimation.kill();
        window.removeEventListener("resize", handleResize);
    };
}