import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function projectsScrollAnimation({
  sectionRef, projectIndexRef, projectImagesContainerRef,
  projectImgRefs, projectNamesContainerRef, projectNameRefs,
  totalProjects, counterTextRef
}) {
  // --- RESPONSIVE HANDLER ---
  let resizeTimer;
  const resizeHandler = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  };
  window.addEventListener('resize', resizeHandler);

  const spotlightSection = sectionRef.current;
  const projectIndex = projectIndexRef.current;
  const projectImagesContainer = projectImagesContainerRef.current;
  const projectNamesContainer = projectNamesContainerRef.current;
  const projectImgs = projectImgRefs.current;
  const projectNames = projectNameRefs.current;

  const spotlightSectionHeight = spotlightSection.offsetHeight;
  const spotlightSectionPadding = parseInt(window.getComputedStyle(spotlightSection).paddingTop);
  const projectIndexHeight = projectIndex.offsetHeight;
  const containerHeight = projectNamesContainer.offsetHeight;
  const imagesHeight = projectImagesContainer.offsetHeight;

  const moveDistanceIndex = spotlightSectionHeight - spotlightSectionPadding * 2 - projectIndexHeight;
  const moveDistanceName = spotlightSectionHeight - spotlightSectionPadding * 2 - containerHeight;
  const moveDistanceImage = window.innerHeight - imagesHeight;

  const imgActivationThreshold = window.innerHeight / 2;

  const imagesData = projectImgs.map(img => ({
    el: img,
    offsetTop: img.offsetTop,
    offsetHeight: img.offsetHeight
  }));

  // --- GPU LAYER PROMOTION ---
  // Force composited layers on mobile so transforms skip the main thread entirely
  const isMobile = window.innerWidth < 1024;

  if (isMobile) {
    // Promote containers to their own GPU layers
    projectImagesContainer.style.willChange = 'transform';
    projectIndex.style.willChange = 'transform';
    projectNames.forEach(p => { p.style.willChange = 'transform'; });

    // On mobile, use GSAP quickSetter for maximum performance
    // quickSetter skips the overhead of gsap.set() (no parsing, no invalidation)
    const setIndexY = gsap.quickSetter(projectIndex, 'y', 'px');
    const setImagesY = gsap.quickSetter(projectImagesContainer, 'y', 'px');
    const nameSetters = projectNames.map(p => gsap.quickSetter(p, 'y', 'px'));

    // Track state to avoid redundant DOM writes
    let lastIndex = -1;
    let lastActiveImg = -1;
    let lastActiveName = -1;

    ScrollTrigger.create({
      trigger: spotlightSection,
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      pinSpacing: true,
      scrub: true,  // true = native scrub, no lerp overhead
      onUpdate: (self) => {
        const progress = self.progress;

        // Counter text — only write DOM when value actually changes
        const currentIndex = Math.min(Math.floor(progress * totalProjects) + 1, totalProjects);
        if (currentIndex !== lastIndex) {
          counterTextRef.current.innerText = String(currentIndex).padStart(2, '0');
          lastIndex = currentIndex;
        }

        // Transforms via quickSetter (zero-overhead)
        setIndexY(progress * moveDistanceIndex);
        setImagesY(progress * moveDistanceImage);

        // Image opacity — only toggle when the active image changes
        const currentContainerY = progress * moveDistanceImage;
        let newActiveImg = -1;
        for (let i = 0; i < imagesData.length; i++) {
          const data = imagesData[i];
          const imgTop = spotlightSectionPadding + currentContainerY + data.offsetTop;
          const imgBottom = imgTop + data.offsetHeight;
          if (imgTop <= imgActivationThreshold && imgBottom >= imgActivationThreshold) {
            newActiveImg = i;
            break;
          }
        }

        if (newActiveImg !== lastActiveImg) {
          if (lastActiveImg >= 0) imagesData[lastActiveImg].el.style.opacity = '0.5';
          if (newActiveImg >= 0) imagesData[newActiveImg].el.style.opacity = '1';
          lastActiveImg = newActiveImg;
        }

        // Name positions via quickSetter
        for (let i = 0; i < projectNames.length; i++) {
          const startProgress = i / totalProjects;
          const endProgress = (i + 1) / totalProjects;
          const projectProgress = Math.max(0, Math.min(1, (progress - startProgress) / (endProgress - startProgress)));
          nameSetters[i](-projectProgress * moveDistanceName);
        }

        // Active name class — only toggle when the active name changes
        const newActiveName = Math.min(Math.floor(progress * totalProjects), totalProjects - 1);
        if (newActiveName !== lastActiveName) {
          if (lastActiveName >= 0 && projectNames[lastActiveName]) {
            projectNames[lastActiveName].classList.remove('active-name');
          }
          if (newActiveName >= 0 && projectNames[newActiveName]) {
            projectNames[newActiveName].classList.add('active-name');
          }
          lastActiveName = newActiveName;
        }
      }
    });
  } else {
    // --- DESKTOP: Original logic (scrub: 1.5 for smoothness) ---
    ScrollTrigger.create({
      trigger: spotlightSection,
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress;

        const currentIndex = Math.min(Math.floor(progress * totalProjects) + 1, totalProjects);
        if (counterTextRef.current && counterTextRef.current._lastIndex !== currentIndex) {
          counterTextRef.current.innerText = String(currentIndex).padStart(2, '0');
          counterTextRef.current._lastIndex = currentIndex;
        }

        gsap.set(projectIndex, { y: progress * moveDistanceIndex });
        gsap.set(projectImagesContainer, { y: progress * moveDistanceImage });

        const currentContainerY = progress * moveDistanceImage;

        imagesData.forEach((data) => {
          const imgTop = spotlightSectionPadding + currentContainerY + data.offsetTop;
          const imgBottom = imgTop + data.offsetHeight;
          const isActive = imgTop <= imgActivationThreshold && imgBottom >= imgActivationThreshold;

          if (isActive && !data.el._isActive) {
            data.el._isActive = true;
            gsap.set(data.el, { opacity: 1 });
          } else if (!isActive && data.el._isActive) {
            data.el._isActive = false;
            gsap.set(data.el, { opacity: 0.5 });
          }
        });

        gsap.set(projectNames, {
          y: (index) => {
            const startProgress = index / totalProjects;
            const endProgress = (index + 1) / totalProjects;
            const projectProgress = Math.max(0, Math.min(1, (progress - startProgress) / (endProgress - startProgress)));
            return -projectProgress * moveDistanceName;
          }
        });

        projectNames.forEach((p, index) => {
          const startProgress = index / totalProjects;
          const endProgress = (index + 1) / totalProjects;
          const projectProgress = Math.max(0, Math.min(1, (progress - startProgress) / (endProgress - startProgress)));

          const isActiveName = projectProgress > 0 && projectProgress < 1;

          if (isActiveName && !p._isActiveName) {
            p._isActiveName = true;
            p.classList.add('active-name');
          } else if (!isActiveName && p._isActiveName) {
            p._isActiveName = false;
            p.classList.remove('active-name');
          }
        });
      }
    });
  }

  // Cleanup
  return () => {
    window.removeEventListener('resize', resizeHandler);
  };
}