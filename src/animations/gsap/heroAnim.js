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
  // --- DYNAMIC MEASUREMENTS ---
  const leftRect = leftTextRef.current.getBoundingClientRect()
  const rightRect = rightTextRef.current.getBoundingClientRect()
  const cardRect = cardWrapRef.current.getBoundingClientRect()
  const canvasRect = canvasRef.current.getBoundingClientRect()
  const vw = document.documentElement.clientWidth // CRITICAL FIX: Excludes Windows scrollbar width!
  const vh = window.innerHeight

  const screenCenter = vw / 2
  const gap = 8 // Gap between the two words when they meet

  // X distances needed to bring the inner edges of the text to the center
  const leftTargetX = (screenCenter - gap) - leftRect.right
  const rightTargetX = (screenCenter + gap) - rightRect.left

  // Scale needed to make the card fill about 85% of the viewport width
  const targetScale = (vw * 0.75) / cardRect.width

  // --- CANVAS SETUP ---
  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');
  
  // High resolution for premium feel
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

  images[0].onload = render;

  function render() {
    const frameIndex = Math.round(seq.frame); // Safely ensure the index is always a perfect integer
    if (images[frameIndex] && images[frameIndex].complete) {
      // OPTIMIZATION: clearRect is intentionally omitted. Because the images are opaque JPEGs, 
      // drawing directly over the previous frame is drastically faster and saves CPU cycles.
      context.drawImage(images[frameIndex], 0, 0, 1920, 1080);
    }
  }

  // --- INTRO REVEAL ANIMATION ---
  // Delay only when preloader is expected to run; on route returns, reveal immediately.
  const shouldDelayForPreloader = sessionStorage.getItem('home-loader-complete') !== '1';
  const introTl = gsap.timeline({ delay: shouldDelayForPreloader ? 7.5 : 0 });
  const h1 = document.getElementById('h1forhero');

  // Using clip-path 'inset' creates a perfect top-to-bottom wipe without physically moving the elements.
  // This guarantees we do NOT hamper their initial positions or conflict with the ScrollTrigger logic!
  const navElement = document.querySelector('nav');
  const navAndHeroElements = [navElement, h1, leftTextRef.current, cardWrapRef.current, rightTextRef.current, scrollLabelRef.current].filter(Boolean);

  if (navAndHeroElements.length > 0) {
    introTl.from(navAndHeroElements, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 1.25,
      stagger: 0.15,
      ease: "power3.inOut",
      clearProps: "clipPath" // Clears the inline style after it finishes so it doesn't break anything later
    }, 0);
  }

  // --- TIMELINE ---
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=800%', // Increased scroll distance to give time for pinning
      pin: true,
      scrub: true, // Changed from 1.2 to true: let Lenis handle the smoothing for perfect performance!
      anticipatePin: 1,
      onToggle: (self) => {
        window.disableGlobalNav = self.isActive;
      }
    }
  })

  // STEP 1 — Video moves down to 30vh quickly, then scales up while fixed at the bottom
  tl.addLabel('start')
  
  // Fade out Navbar
  const nav = document.querySelector('nav');
  if (nav) {
    tl.to(nav, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.out' }, 'start');
  }

  // First, move down to 30vh
  tl.to(cardWrapRef.current, { 
    y: "26vh", 
    ease: 'power2.in', 
    duration: 0.5, 
  }, 'start')

  // Then, while fixed at the bottom, scale up (syncing with the end of the text convergence)
  tl.to(cardWrapRef.current, {
    scale: targetScale,
    transformOrigin:'top',
    ease: 'power2.out',
    duration: 1
  }, 'start+=0.5')
  
  tl.to(cardLabelsRef.current, { opacity: 0, duration: 0.3 }, 'start')
  tl.to(scrollLabelRef.current, { opacity: 0, duration: 0.3 }, 'start')

  tl.to(leftTextRef.current, { x: leftTargetX, ease: 'power2.inOut', duration: 0.95 }, 'start')
  tl.to(rightTextRef.current, { x: rightTargetX, ease: 'power2.inOut', duration: 0.95 }, 'start')

  // STEP 2 — Once words have converged, video moves UP to center. Text fades away.
  tl.addLabel('videoReturns', 1.5) // Starts exactly when the 1.5s 'start' animations finish
  tl.to(cardWrapRef.current, {
    y: -460, 
    ease: 'none', // Adds a slight bounce effect when it hits the center
    duration: 1.2
  }, 'videoReturns')

  // SCRUB IMAGE SEQUENCE TO SCROLL
  // The video hits the center at 2.7s (1.5 + 1.2). The exit is at 8.0s.
  // So we have 5.3 seconds of "pinned" time to scrub the images.
  tl.to(seq, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    duration: 5.3,
    onUpdate: render
  }, 'videoReturns+=1.2')
  
  // The "Next-gen web studio" texts disappear as the video begins moving up
  tl.to([leftTextRef.current, rightTextRef.current], {
    opacity: 0,
    y: -40, // Texts float upwards gently as they fade out
    duration: 0.3,
    ease: 'power2.out',
  }, 'videoReturns') // Starts at the exact same time the video moves up

  // The H1 tagline waits to disappear until the video physically gets close to it
  // Since the video takes 1.2s to move up, tweaking this number (currently 0.4) 
  // controls exactly WHEN the tagline starts fading out.
  tl.to(h1, {
    opacity: 0,
    y: -40,
    duration: 0.3,
    ease: 'power2.out',
  }, 'videoReturns+=0.3') // <--- TWEAK THIS NUMBER (0.1 = earlier, 0.8 = later)

  // STEP 3 — Outro: Perfect Fullscreen
  tl.addLabel('outro', 8.0) 

  // Calculate scale to fill the screen based on the CANVAS size, not the wrapper!
  const fullscreenScaleX = vw / canvasRect.width;
  const fullscreenScaleY = vh / canvasRect.height;
  const fullscreenScale = Math.max(fullscreenScaleX, fullscreenScaleY);

  // CRITICAL FIX: Center the CANVAS horizontally and vertically, compensating for 
  // the invisible text above it in the wrapper wrapper, and the Windows scrollbar.
  const offsetY = canvasRect.top - cardRect.top;
  const exactCenterX = (vw / 2) - (canvasRect.left + canvasRect.width / 2);
  
  // The desired top edge of the canvas to perfectly center it
  const desiredCanvasTop = (vh - (canvasRect.height * fullscreenScale)) / 2;
  const exactCenterY = desiredCanvasTop - (offsetY * fullscreenScale) - cardRect.top;

  // Elevate the entire section's z-index ONLY when the outro starts, so it covers the navbar
  tl.set(sectionRef.current, { zIndex: 9999 }, 'outro')

  // Video perfectly centers and fills the entire screen seamlessly
  tl.to(cardWrapRef.current, {
    x: exactCenterX,
    y: exactCenterY,
    scale: fullscreenScale,
    transformOrigin: 'top', // Kept as top to prevent the abrupt jump!
    ease: 'power2.inOut',
    duration: 1.5
  }, 'outro')

  // The timeline ends here.
  // Because the timeline is over, the section unpins, and your normal scroll takes over,
  // pushing this fullscreen video up to reveal the next section flawlessly!
  
  return tl
}