const TextInterlude = () => {
  return (
    <section className="relative z-20 min-h-[60vh] bg-transparent flex flex-col items-center justify-center px-4 md:px-20 text-center py-12">
      <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-widest text-[#4a4a4a]">
        Between vision and execution
      </p>

      <h2
        className="mt-4 md:mt-5 text-[#0D0D0D] uppercase leading-[0.92] tracking-[0.02em] text-[clamp(1.8rem,8vw,7rem)] break-words sm:break-normal w-full"
        style={{ fontFamily: 'Anton, sans-serif' }}
      >
        WE CRAFT DIGITAL EXPERIENCES
      </h2>

      <p className="mt-4 md:mt-6 max-w-3xl font-sans text-sm md:text-base leading-relaxed text-[#4a4a4a] px-2">
        A curated bridge from concept to craft. Scroll ahead to explore selected projects where strategy,
        visual language, and performance-first development come together.
      </p>
    </section>
  );
};

export default TextInterlude;