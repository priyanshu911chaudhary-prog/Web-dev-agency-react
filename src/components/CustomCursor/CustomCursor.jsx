import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const followerRef = useRef(null);
  const textRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice || window.innerWidth < 1024) return;
    setIsDesktop(true);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const dot = dotRef.current;
    const follower = followerRef.current;
    const cursorText = textRef.current;
    if (!dot || !follower) return;

    document.documentElement.style.cursor = 'none';

    const setDotX = gsap.quickSetter(dot, 'x', 'px');
    const setDotY = gsap.quickSetter(dot, 'y', 'px');
    const setFollowerX = gsap.quickSetter(follower, 'x', 'px');
    const setFollowerY = gsap.quickSetter(follower, 'y', 'px');

    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setDotX(mouseX);
      setDotY(mouseY);
    };

    const updateFollower = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      setFollowerX(followerX);
      setFollowerY(followerY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;

      if (target.matches('input, textarea, select, [contenteditable]')) {
        gsap.to(dot, { opacity: 0, duration: 0.2 });
        gsap.to(follower, { opacity: 0, duration: 0.2 });
        target.style.cursor = 'text';
        return;
      }

      if (target.closest('a, button, [role="button"]')) {
        gsap.to(follower, { width: 60, height: 60, borderColor: 'rgba(13,13,13,0.6)', duration: 0.35, ease: 'power3.out' });
        gsap.to(dot, { scale: 0, duration: 0.2 });
        return;
      }

      if (target.closest('.project-img') || target.closest('[onmouseenter]')) {
        gsap.to(follower, { width: 100, height: 100, borderColor: 'transparent', backgroundColor: 'rgba(13,13,13,0.08)', duration: 0.4, ease: 'power3.out' });
        gsap.to(dot, { scale: 0, duration: 0.2 });
        if (cursorText) {
          cursorText.textContent = 'VIEW';
          gsap.to(cursorText, { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' });
        }
        return;
      }

      if (target.matches('img')) {
        gsap.to(follower, { width: 50, height: 50, duration: 0.3, ease: 'power3.out' });
        return;
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;

      if (target.matches('input, textarea, select, [contenteditable]')) {
        target.style.cursor = '';
        gsap.to(dot, { opacity: 1, duration: 0.2 });
        gsap.to(follower, { opacity: 1, duration: 0.2 });
        return;
      }

      gsap.to(follower, { width: 36, height: 36, borderColor: 'rgba(13,13,13,0.35)', backgroundColor: 'transparent', duration: 0.35, ease: 'power3.out' });
      gsap.to(dot, { scale: 1, duration: 0.2 });
      if (cursorText) {
        gsap.to(cursorText, { opacity: 0, scale: 0.5, duration: 0.2 });
      }
    };

    const handleMouseDown = () => {
      gsap.to(follower, { scale: 0.75, duration: 0.15, ease: 'power3.out' });
      gsap.to(dot, { scale: 1.5, duration: 0.15, ease: 'power3.out' });
    };

    const handleMouseUp = () => {
      gsap.to(follower, { scale: 1, duration: 0.3, ease: 'elastic.out(1.2, 0.4)' });
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'elastic.out(1.2, 0.4)' });
    };

    const handleMouseLeave = () => {
      gsap.to([dot, follower], { opacity: 0, duration: 0.3 });
    };

    const handleMouseEnter = () => {
      gsap.to([dot, follower], { opacity: 1, duration: 0.3 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    gsap.ticker.add(updateFollower);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.ticker.remove(updateFollower);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isDesktop]);

  // Don't render anything on mobile/touch
  if (!isDesktop) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          width: 6, height: 6, borderRadius: '50%',
          backgroundColor: '#0D0D0D',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 pointer-events-none z-[99998] flex items-center justify-center"
        style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '1.5px solid rgba(13,13,13,0.35)',
          backgroundColor: 'transparent',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
          transition: 'width 0.35s cubic-bezier(0.23,1,0.32,1), height 0.35s cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        <span
          ref={textRef}
          className="text-[9px] font-bold uppercase tracking-widest text-[#0D0D0D] opacity-0"
          style={{ transform: 'scale(0.5)' }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
