import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function heroScrollAnimation({
  sectionRef,
  leftTextRef,
  rightTextRef,
  cardWrapRef,
  cardLabelsRef,
  scrollLabelRef,
  canvasRef
}) {
  
  // --- CANVAS SETUP (Runs on all breakpoints so the static image loads) ---
  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');
  
  canvas.width = 1920;
  canvas.height = 1080;

  const frameCount = 300;
  const currentFrame = index => new URL(`../../assets/images/video-img/${(index + 1).toString().padStart(1, '0')}.jpg`, import.meta.url).href;

  const images = [];
  const seq = { frame: 0 };

  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }

  // Draw the first frame immediately so mobile has a gorgeous static image
  images[0].onload = render;

  function render() {
    const frameIndex = Math.round(seq.frame); 
    if (images[frameIndex] && images[frameIndex].complete) {
      context.drawImage(images[frameIndex], 0, 0, 1920, 1080);
    }
  }

  // Common preloader check is removed from here and moved to the dynamic check function
  const h1 = document.getElementById('h1forhero');
  const navElement = document.querySelector('nav');
  const navAndHeroElements = [navElement, h1, leftTextRef.current, cardWrapRef.current, rightTextRef.current, scrollLabelRef.current].filter(Boolean);


  // --- GSAP MATCHMEDIA (The core responsiveness fix) ---
  let mm = gsap.matchMedia();

  // ==========================================
  // DESKTOP: FULL ANIMATION (>= 1024px)
  // ==========================================
  mm.add("(min-width: 1024px)", () => {
    
    // 1. Intro Reveal Wipe (Created paused)
    const introTl = gsap.timeline({ paused: true });
    if (navAndHeroElements.length > 0) {
      introTl.from(navAndHeroElements, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.25,
        stagger: 0.15,
        ease: "power3.inOut",
        clearProps: "clipPath" 
      }, 0);
    }

    // Dynamic Intro Play Logic
    const checkAndPlayIntro = () => {
      const loaderPending = sessionStorage.getItem('home-loader-complete') !== '1';
      const isMobile = window.innerWidth < 1024;
      const overlayPending = isMobile && sessionStorage.getItem('mobile-overlay-dismissed') !== '1';

      if (!loaderPending && !overlayPending) {
        introTl.play();
      }
    };

    checkAndPlayIntro();

    window.addEventListener('loaderComplete', checkAndPlayIntro);
    window.addEventListener('mobileOverlayDismissed', checkAndPlayIntro);

    // 2. Dynamic Measurements
    const leftRect = leftTextRef.current.getBoundingClientRect()
    const rightRect = rightTextRef.current.getBoundingClientRect()
    const cardRect = cardWrapRef.current.getBoundingClientRect()
    const canvasRect = canvasRef.current.getBoundingClientRect()
    const vw = document.documentElement.clientWidth 
    const vh = window.innerHeight

    const screenCenter = vw / 2
    const gap = 8 

    const leftTargetX = (screenCenter - gap) - leftRect.right
    const rightTargetX = (screenCenter + gap) - rightRect.left
    const targetScale = (vw * 0.75) / cardRect.width;

    // 3. ScrollTrigger Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=800%', 
        pin: true,
        scrub: true, 
        anticipatePin: 1,
        onToggle: (self) => {
          window.disableGlobalNav = self.isActive;
        }
      }
    })

    tl.addLabel('start')
    
    if (navElement) {
      tl.to(navElement, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.out' }, 'start');
    }

    tl.to(cardWrapRef.current, { y: "26vh", ease: 'power2.in', duration: 0.5 }, 'start')
    tl.to(cardWrapRef.current, { scale: targetScale, transformOrigin:'top', ease: 'power2.out', duration: 1 }, 'start+=0.5')
    tl.to(cardLabelsRef.current, { opacity: 0, duration: 0.3 }, 'start')
    tl.to(scrollLabelRef.current, { opacity: 0, duration: 0.3 }, 'start')
    tl.to(leftTextRef.current, { x: leftTargetX, ease: 'power2.inOut', duration: 0.95 }, 'start')
    tl.to(rightTextRef.current, { x: rightTargetX, ease: 'power2.inOut', duration: 0.95 }, 'start')

    tl.addLabel('videoReturns', 1.5) 
    tl.to(cardWrapRef.current, { y: -460, ease: 'none', duration: 1.2 }, 'videoReturns')

    tl.to(seq, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      duration: 5.3,
      onUpdate: render
    }, 'videoReturns+=1.2')
    
    tl.to([leftTextRef.current, rightTextRef.current], { opacity: 0, y: -40, duration: 0.3, ease: 'power2.out' }, 'videoReturns') 
    tl.to(h1, { opacity: 0, y: -40, duration: 0.3, ease: 'power2.out' }, 'videoReturns+=0.3') 

    tl.addLabel('outro', 8.0) 

    const fullscreenScaleX = vw / canvasRect.width;
    const fullscreenScaleY = vh / canvasRect.height;
    const fullscreenScale = Math.max(fullscreenScaleX, fullscreenScaleY);

    const offsetY = canvasRect.top - cardRect.top;
    const exactCenterX = (vw / 2) - (canvasRect.left + canvasRect.width / 2);
    const desiredCanvasTop = (vh - (canvasRect.height * fullscreenScale)) / 2;
    const exactCenterY = desiredCanvasTop - (offsetY * fullscreenScale) - cardRect.top;

    tl.set(sectionRef.current, { zIndex: 9999 }, 'outro')

    tl.to(cardWrapRef.current, {
      x: exactCenterX,
      y: exactCenterY,
      scale: fullscreenScale,
      transformOrigin: 'top', 
      ease: 'power2.inOut',
      duration: 1.5
    }, 'outro')

    // Cleanup inline styles if window crosses breakpoint
    return () => {
      window.removeEventListener('loaderComplete', checkAndPlayIntro);
      window.removeEventListener('mobileOverlayDismissed', checkAndPlayIntro);
      gsap.set([navElement, h1, leftTextRef.current, rightTextRef.current, cardWrapRef.current, cardLabelsRef.current, scrollLabelRef.current, sectionRef.current], { clearProps: "all" });
    };
  });

  // ==========================================
  // MOBILE/TABLET: STATIC LAYOUT (< 1024px)
  // ==========================================
  mm.add("(max-width: 1023px)", () => {
    
    // Only do the initial entry wipe so it looks nice on load.
    // NO scroll triggers, NO pinning, NO complex math.
    const introTl = gsap.timeline({ paused: true });
    
    if (navAndHeroElements.length > 0) {
      introTl.from(navAndHeroElements, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.25,
        stagger: 0.15,
        ease: "power3.inOut",
        clearProps: "clipPath" 
      }, 0);
    }

    const checkAndPlayIntroMobile = () => {
      const loaderPending = sessionStorage.getItem('home-loader-complete') !== '1';
      const isMobile = window.innerWidth < 1024;
      const overlayPending = isMobile && sessionStorage.getItem('mobile-overlay-dismissed') !== '1';

      if (!loaderPending && !overlayPending) {
        introTl.play();
      }
    };

    checkAndPlayIntroMobile();

    window.addEventListener('loaderComplete', checkAndPlayIntroMobile);
    window.addEventListener('mobileOverlayDismissed', checkAndPlayIntroMobile);

    // Cleanup
    return () => {
      window.removeEventListener('loaderComplete', checkAndPlayIntroMobile);
      window.removeEventListener('mobileOverlayDismissed', checkAndPlayIntroMobile);
      gsap.set(navAndHeroElements, { clearProps: "all" });
    };
  });

  return () => mm.revert(); // Ensure MatchMedia cleans up on unmount
}