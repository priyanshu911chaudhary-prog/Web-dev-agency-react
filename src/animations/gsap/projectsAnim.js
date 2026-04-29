import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function projectsScrollAnimation({
  sectionRef, projectIndexRef, projectImagesContainerRef,
  projectImgRefs, projectNamesContainerRef, projectNameRefs,
  totalProjects, counterTextRef
}) {
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