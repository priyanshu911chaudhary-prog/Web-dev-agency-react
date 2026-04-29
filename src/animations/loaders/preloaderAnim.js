import gsap from 'gsap';

export const runPreloaderAnim = (refs, onComplete) => {
  const {
    loadingScreen, counter1, counter2, counter3, digits
  } = refs;

  const tl = gsap.timeline({
    onComplete: onComplete
  });

  // Helper to calculate scroll distance based on actual DOM height
  const getScrollDist = (el) => {
    if (!el) return 0;
    const numHeight = el.querySelector('.num')?.clientHeight || 0;
    return -(el.querySelectorAll('.num').length - 1) * numHeight;
  };

  tl.to(counter3, { y: () => getScrollDist(counter3), duration: 5, ease: "power4.inOut" }, 0)
    .to(counter2, { y: () => getScrollDist(counter2), duration: 6, ease: "power4.inOut" }, 0)
    .to(counter1, { y: () => getScrollDist(counter1), duration: 2, ease: "power4.inOut" }, 4)

    // Digits slide out smoothly
    .to(digits, { top: "-150px", stagger: 0.25, duration: 1, ease: "power4.inOut" }, 6)

    // Page Transition: The black loader screen collapses downwards,
    // revealing the Hero section elegantly from top to bottom!
    .set(loadingScreen, { transformOrigin: "bottom" })
    .to(loadingScreen, { scaleY: 0, duration: 1.2, ease: "power3.inOut" }, 7.5);

  return tl;
};