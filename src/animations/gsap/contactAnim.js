import gsap from 'gsap';

export function contactAnimation({
  contactInfoParentRef,
  iconLayerARef,
  iconLayerBRef,
  rowRefs,
  lenis,
  totalIcons,
  iconSources = []
}) {
  const contactInfoParent = contactInfoParentRef.current;
  const contentTrack = contactInfoParent?.firstElementChild;
  let activeLayer = iconLayerARef.current;
  let idleLayer = iconLayerBRef.current;
  let currentIconIndex = 1;
  let isAnimating = false;
  let lastSwitchTime = 0;

  if (!contactInfoParent || !contentTrack || !activeLayer || !idleLayer || iconSources.length === 0) {
    return () => {};
  }

  const preloadedIcons = iconSources.map((src) => {
    const img = new Image();
    img.src = src;
    return img;
  });

  // Initialize icon layers
  activeLayer.src = iconSources[0];
  idleLayer.src = iconSources[1 % iconSources.length];
  gsap.set(activeLayer, { opacity: 1, scale: 1, filter: 'blur(0px)' });
  gsap.set(idleLayer, { opacity: 0, scale: 0.98, filter: 'blur(2px)' });

  function switchIconSmooth(nextIconIndex) {
    const now = performance.now();
    // Cooldown logic exact to specifications
    if (isAnimating || now - lastSwitchTime < 240) return;
    isAnimating = true;

    const src = iconSources[(nextIconIndex - 1) % iconSources.length];
    const candidate = preloadedIcons[(nextIconIndex - 1) % preloadedIcons.length];
    if (candidate && candidate.complete) {
      idleLayer.src = candidate.src;
    } else {
      idleLayer.src = src;
    }

    // Crossfade sequences
    gsap.to(activeLayer, { opacity: 0, duration: 0.24, ease: "power2.inOut" });
    gsap.to(idleLayer, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.34,
      ease: "power2.inOut",
      onComplete: () => {
        // Reset old active layer properties
        gsap.set(activeLayer, { scale: 0.98, filter: 'blur(2px)' });
        
        // Swap layer references safely
        const temp = activeLayer;
        activeLayer = idleLayer;
        idleLayer = temp;
        
        currentIconIndex = nextIconIndex;
        isAnimating = false;
        lastSwitchTime = performance.now();
      }
    });
  }


  function getScrollBasedIconIndex(scrollState) {
    if (!scrollState || scrollState.limit <= 0) {
      return null;
    }

    const progress = Math.max(0, Math.min(1, scrollState.scroll / scrollState.limit));
    const segmentSize = 1 / totalIcons;
    const segmentIndex = Math.min(totalIcons - 1, Math.floor(progress / segmentSize));
    return segmentIndex + 1;
  }

  // Pre-compute constants once (not per-frame)
  const isMobile = window.innerWidth < 1000;
  const minGap = isMobile ? 1 : 1.15;
  const maxGap = isMobile ? 4.8 : 9;
  const gapActivationDistance = isMobile ? 160 : 195;
  const gapEasePower = 1.25;

  function updateContactAnimation(scrollState) {
    const centerY = window.innerHeight / 2;
    let closestDist = Infinity;
    let closestIndex = -1;

    rowRefs.current.forEach((row, i) => {
      if (!row) return;

      const rect = row.getBoundingClientRect();
      const rowCenter = rect.top + rect.height / 2;
      const distance = Math.abs(centerY - rowCenter);

      // Distance mapping logic
      const activation = Math.max(0, (gapActivationDistance - distance) / gapActivationDistance);
      const focus = Math.pow(activation, gapEasePower);
      const gap = minGap + (maxGap - minGap) * focus;

      // Apply gap directly via style object to avoid React re-render overhead
      row.style.gap = `${gap}rem`;

      // Track closest row to viewport center
      if (distance < closestDist) {
        closestDist = distance;
        closestIndex = i;
      }
    });

    let nextIconIndex = getScrollBasedIconIndex(scrollState);

    // Fallback mapping if scroll state is unavailable.
    if (!nextIconIndex && closestDist < 22 && closestIndex >= 0) {
      nextIconIndex = (closestIndex % totalIcons) + 1;
    }

    if (nextIconIndex && nextIconIndex !== currentIconIndex) {
      switchIconSmooth(nextIconIndex);
    }
  }

  // rAF throttle on mobile to prevent scroll handler pile-up during touch inertia
  let ticking = false;
  let latestScrollState = null;

  const handleLenisScroll = (state) => {
    if (isMobile) {
      latestScrollState = state;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateContactAnimation(latestScrollState);
          ticking = false;
        });
      }
    } else {
      updateContactAnimation(state);
    }
  };

  if (lenis) {
    lenis.on('scroll', handleLenisScroll);
  }

  // Initial render calculation
  requestAnimationFrame(updateContactAnimation);

  // Return strictly the cleanup function
  return () => {
    if (lenis) {
      lenis.off('scroll', handleLenisScroll);
    }
  };
}