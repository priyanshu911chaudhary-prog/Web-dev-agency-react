import gsap from 'gsap';

export const runPreloaderAnim = (refs, onComplete) => {
  const {
    loadingScreen, counter1, counter2, counter3, digits
  } = refs;

  const tl = gsap.timeline({
    onComplete: onComplete
  });

  const getScrollDist = (el) => {
    if (!el) return 0;
    const numHeight = el.querySelector('.num')?.clientHeight || 0;
    return -(el.querySelectorAll('.num').length - 1) * numHeight;
  };

  const getCriticalImages = () => {
    // Only wait for eager loaded images (exclude lazy ones to prevent infinite hangs)
    // Also ensure the image has a src attribute, otherwise load/error events may never fire
    return Array.from(document.querySelectorAll('img')).filter(img => img.loading !== 'lazy' && img.src);
  };

  tl.to(counter3, { y: () => getScrollDist(counter3), duration: 5, ease: "power4.inOut" }, 0)
    .to(counter2, { y: () => getScrollDist(counter2), duration: 6, ease: "power4.inOut" }, 0)
    .to(counter1, { y: () => getScrollDist(counter1), duration: 2, ease: "power4.inOut" }, 4)
    
    // Pause point at 6s (counter hits 100) to ensure assets are fully loaded before exiting
    .call(() => {
      tl.pause();
      
      const waitForAssets = () => {
        const images = getCriticalImages();
        const imagePromises = images.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true }); // resolve on error to prevent infinite hang
          });
        });
        
        const windowLoadPromise = document.readyState === 'complete' 
          ? Promise.resolve() 
          : new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
          
        const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve();
          
        const allAssetsPromise = Promise.all([...imagePromises, windowLoadPromise, fontsPromise]);
        
        // Add a maximum wait time of 3000ms (3 seconds) to prevent infinite hang at 100%
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 3000));
        
        return Promise.race([allAssetsPromise, timeoutPromise]);
      };

      waitForAssets().then(() => {
        tl.play();
      });
    }, [], 6)

    // Digits slide out smoothly
    .to(digits, { top: "-150px", stagger: 0.25, duration: 1, ease: "power4.inOut" }, 6.5)

    // Page Transition: The black loader screen collapses downwards
    .set(loadingScreen, { transformOrigin: "bottom" }, 7.5)
    .to(loadingScreen, { scaleY: 0, duration: 1.2, ease: "power3.inOut" }, 7.5);

  // --- DYNAMIC ACCELERATION ---
  // If assets load very fast, we don't want the user to arbitrarily wait 8.7 seconds.
  // We incrementally speed up the timeline as assets load.
  const optimizeSpeed = () => {
    const images = getCriticalImages();
    let loadedCount = images.filter(img => img.complete).length;
    const totalCount = images.length;
    
    let isWindowLoaded = document.readyState === 'complete';
    let areFontsLoaded = false;

    const checkAndAccelerate = () => {
      if (loadedCount === totalCount && isWindowLoaded && areFontsLoaded) {
        // Assets are fully ready! Speed up the timeline massively (makes it ~3 seconds instead of 8.7s)
        gsap.to(tl, { timeScale: 3, duration: 1, ease: "power2.inOut" });
      }
    };

    // 1. Check Fonts
    if (document.fonts) {
      document.fonts.ready.then(() => {
        areFontsLoaded = true;
        checkAndAccelerate();
      });
    } else {
      areFontsLoaded = true; // Fallback
    }

    // 2. Check Window Load
    if (!isWindowLoaded) {
      window.addEventListener('load', () => {
        isWindowLoaded = true;
        checkAndAccelerate();
      }, { once: true });
    }

    // 3. Check Images
    images.forEach(img => {
      if (!img.complete) {
        img.addEventListener('load', () => {
          loadedCount++;
          checkAndAccelerate();
        }, { once: true });
        img.addEventListener('error', () => {
          loadedCount++; // Count errors as loaded so we don't hang
          checkAndAccelerate();
        }, { once: true });
      }
    });

    checkAndAccelerate(); // Check immediately in case everything is cached
  };
  
  // Give React a tick to mount the images into the DOM
  setTimeout(optimizeSpeed, 50);

  return tl;
};